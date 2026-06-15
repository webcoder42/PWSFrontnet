import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useUser } from './UserContext';
import { startVoiceCallAPI, endVoiceCallAPI } from '../utils/api';
import {
  getChatSocket,
  subscribeIncomingCalls,
  subscribeCallEnded,
  subscribeCallSignal,
  emitCallSignal,
} from '../utils/chatSocket';

type CallState = 'idle' | 'calling' | 'ringing' | 'connected' | 'ended';

interface CallInfo {
  callId: string;
  conversationKey: string;
  peerName: string;
  peerRole: string;
  peerAvatar: string;
  targetUserId: string;
  isIncoming: boolean;
}

interface CallContextValue {
  callState: CallState;
  callInfo: CallInfo | null;
  initiateCall: (
    conversationKey: string,
    peerName: string,
    peerRole: string,
    peerAvatar: string,
    targetUserId: string
  ) => Promise<void>;
  acceptCall: () => Promise<void>;
  declineCall: () => Promise<void>;
  endCall: () => Promise<void>;
}

const CallContext = createContext<CallContextValue | null>(null);

export function useCall() {
  const context = useContext(CallContext);
  if (!context) {
    throw new Error('useCall must be used within a CallProvider');
  }
  return context;
}

export function CallProvider({ children }: { children: React.ReactNode }) {
  const { profile } = useUser();
  const [callState, setCallState] = useState<CallState>('idle');
  const [callInfo, setCallInfo] = useState<CallInfo | null>(null);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  const durationTimerRef = useRef<NodeJS.Timeout | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const remoteAudioRef = useRef<HTMLAudioElement | null>(null);
  const ringingAudioRef = useRef<HTMLAudioElement | null>(null);

  // Clean up WebRTC peer connection
  const cleanupWebRTC = useCallback(() => {
    if (pcRef.current) {
      pcRef.current.onicecandidate = null;
      pcRef.current.ontrack = null;
      pcRef.current.close();
      pcRef.current = null;
    }
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    }
    if (remoteAudioRef.current) {
      remoteAudioRef.current.pause();
      remoteAudioRef.current.srcObject = null;
      remoteAudioRef.current.remove();
      remoteAudioRef.current = null;
    }
  }, []);

  // Clean up ringing sound
  const stopRinging = useCallback(() => {
    if (ringingAudioRef.current) {
      try {
        (ringingAudioRef.current as any).stop?.();
      } catch {
        /* silent */
      }
      ringingAudioRef.current = null;
    }
  }, []);

  // Play proper phone ring pattern (double-ring: ring-ring ... pause ...)
  const startRinging = useCallback(() => {
    stopRinging();
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      let stopped = false;

      // Phone ring: two short 0.4s rings, then 2s silence, repeating
      const scheduleRing = (startTime: number) => {
        if (stopped) return;
        const ringDuration = 0.4;
        const pauseBetween = 0.2;
        const pauseAfter = 2.0;

        const playTone = (t: number, duration: number) => {
          const osc1 = ctx.createOscillator();
          const osc2 = ctx.createOscillator();
          const gain = ctx.createGain();
          osc1.connect(gain);
          osc2.connect(gain);
          gain.connect(ctx.destination);
          osc1.type = 'sine';
          osc2.type = 'sine';
          osc1.frequency.setValueAtTime(400, t);
          osc2.frequency.setValueAtTime(450, t);
          gain.gain.setValueAtTime(0, t);
          gain.gain.linearRampToValueAtTime(0.12, t + 0.01);
          gain.gain.setValueAtTime(0.12, t + duration - 0.01);
          gain.gain.linearRampToValueAtTime(0, t + duration);
          osc1.start(t);
          osc1.stop(t + duration);
          osc2.start(t);
          osc2.stop(t + duration);
        };

        // Ring 1
        playTone(startTime, ringDuration);
        // Ring 2
        playTone(startTime + ringDuration + pauseBetween, ringDuration);

        const cycleDuration = ringDuration * 2 + pauseBetween + pauseAfter;
        const timeoutId = window.setTimeout(() => {
          scheduleRing(ctx.currentTime);
        }, cycleDuration * 1000);

        ringingAudioRef.current = {
          stop: () => {
            stopped = true;
            clearTimeout(timeoutId);
            try { ctx.close(); } catch { /* silent */ }
          },
        } as any;
      };

      scheduleRing(ctx.currentTime);
    } catch {
      /* silent if audio context is blocked */
    }
  }, [stopRinging]);

  // Get or create RTCPeerConnection (resolves when initialized and microphone tracks are attached)
  const getOrCreatePC = useCallback(async (targetId: string) => {
    if (pcRef.current) return pcRef.current;

    const pc = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    });
    pcRef.current = pc;

    // Handle ICE candidates
    pc.onicecandidate = async (event) => {
      if (event.candidate) {
        const socket = await getChatSocket();
        emitCallSignal(socket, targetId, {
          type: 'candidate',
          candidate: event.candidate,
        });
      }
    };

    // Handle remote audio stream
    pc.ontrack = (event) => {
      console.log('ontrack event received:', event.streams, event.track);
      let remoteStream = event.streams && event.streams[0];
      if (!remoteStream) {
        // Create fallback MediaStream containing the track
        remoteStream = new MediaStream();
        remoteStream.addTrack(event.track);
      }

      if (!remoteAudioRef.current) {
        const audio = new Audio();
        audio.autoplay = true;
        audio.srcObject = remoteStream;
        remoteAudioRef.current = audio;
        document.body.appendChild(audio);
      } else {
        remoteAudioRef.current.srcObject = remoteStream;
      }
      // Force play
      remoteAudioRef.current.play().catch((err) => {
        console.warn('Audio play failed:', err);
      });
    };

    // Capture microphone
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      localStreamRef.current = stream;
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));
    } catch (err) {
      console.warn('Microphone access denied or failed:', err);
    }

    return pc;
  }, []);

  // Monitor socket events for incoming call and ended call
  useEffect(() => {
    if (!profile?.id) return;

    // Listen to incoming call
    const unsubIncoming = subscribeIncomingCalls((payload) => {
      setCallState((state) => {
        if (state !== 'idle') return state; // Already busy

        setCallInfo({
          callId: payload.callId || '',
          conversationKey: payload.conversationKey || '',
          peerName: payload.fromName || 'Someone',
          peerRole: 'Care Provider',
          peerAvatar: '',
          targetUserId: payload.fromUserId || '',
          isIncoming: true,
        });
        startRinging();
        return 'ringing';
      });
    });

    // Listen to call ended / answered state changes
    const unsubEnded = subscribeCallEnded((payload) => {
      setCallInfo((info) => {
        if (!info || info.callId !== payload.callId) return info;

        if (payload.status === 'answered') {
          stopRinging();
          setCallState((state) => {
            if (state === 'calling') {
              // Trigger offer creation as Caller
              void (async () => {
                try {
                  // Give callee some time to initialize mic and peer connection
                  await new Promise((resolve) => setTimeout(resolve, 600));
                  const pc = await getOrCreatePC(info.targetUserId);
                  const offer = await pc.createOffer({ offerToReceiveAudio: true });
                  await pc.setLocalDescription(offer);
                  const socket = await getChatSocket();
                  emitCallSignal(socket, info.targetUserId, {
                    type: 'offer',
                    sdp: offer.sdp,
                  });
                } catch (err) {
                  console.error('Failed to create offer on answered event:', err);
                }
              })();
              return 'connected';
            }
            return state;
          });
        } else {
          // Declined, missed, or ended
          stopRinging();
          cleanupWebRTC();
          setCallState('ended');
          setTimeout(() => {
            setCallState('idle');
            setCallInfo(null);
          }, 1500);
        }
        return info;
      });
    });

    // Listen to WebRTC signaling signals
    const unsubSignal = subscribeCallSignal((payload) => {
      setCallInfo((info) => {
        if (!info || info.targetUserId !== payload.fromUserId) return info;

        void (async () => {
          const pc = await getOrCreatePC(info.targetUserId);
          const sig = payload.signal;
          if (sig.type === 'offer') {
            try {
              await pc.setRemoteDescription(new RTCSessionDescription({ type: 'offer', sdp: sig.sdp }));
              const answer = await pc.createAnswer();
              await pc.setLocalDescription(answer);
              const socket = await getChatSocket();
              emitCallSignal(socket, info.targetUserId, { type: 'answer', sdp: answer.sdp });
            } catch (err) {
              console.error('Failed to answer offer:', err);
            }
          } else if (sig.type === 'answer') {
            try {
              await pc.setRemoteDescription(new RTCSessionDescription({ type: 'answer', sdp: sig.sdp }));
            } catch (err) {
              console.error('Failed to set remote answer:', err);
            }
          } else if (sig.type === 'candidate' && sig.candidate) {
            try {
              await pc.addIceCandidate(new RTCIceCandidate(sig.candidate));
            } catch (err) {
              console.warn('Failed to add Ice Candidate:', err);
            }
          }
        })();

        return info;
      });
    });

    return () => {
      unsubIncoming();
      unsubEnded();
      unsubSignal();
    };
  }, [profile?.id, startRinging, stopRinging, getOrCreatePC, cleanupWebRTC]);

  // Duration timer
  useEffect(() => {
    if (callState === 'connected') {
      setDuration(0);
      durationTimerRef.current = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
    } else {
      if (durationTimerRef.current) {
        clearInterval(durationTimerRef.current);
        durationTimerRef.current = null;
      }
    }
    return () => {
      if (durationTimerRef.current) clearInterval(durationTimerRef.current);
    };
  }, [callState]);

  // Toggle local mute
  const toggleMute = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    }
  };

  const initiateCall = async (
    conversationKey: string,
    peerName: string,
    peerRole: string,
    peerAvatar: string,
    targetUserId: string
  ) => {
    try {
      setCallState('calling');
      setIsMuted(false);
      
      // Start microphone capturing and RTC setup immediately
      void getOrCreatePC(targetUserId);

      const response = await startVoiceCallAPI(conversationKey);
      if (response?.success && response?.data) {
        setCallInfo({
          callId: response.data.callId,
          conversationKey,
          peerName,
          peerRole,
          peerAvatar,
          targetUserId,
          isIncoming: false,
        });
        startRinging();
      } else {
        throw new Error('Could not start call record.');
      }
    } catch (err) {
      setCallState('idle');
      cleanupWebRTC();
      throw err;
    }
  };

  const acceptCall = async () => {
    if (!callInfo) return;
    try {
      stopRinging();
      setCallState('connected');
      await endVoiceCallAPI(callInfo.conversationKey, callInfo.callId, 'answered');
      
      // Warm up and prepare the PeerConnection to receive the caller's incoming offer
      await getOrCreatePC(callInfo.targetUserId);
    } catch (err) {
      console.error('Accept call failed:', err);
    }
  };

  const declineCall = async () => {
    if (!callInfo) return;
    try {
      stopRinging();
      setCallState('idle');
      await endVoiceCallAPI(callInfo.conversationKey, callInfo.callId, 'declined');
      setCallInfo(null);
    } catch (err) {
      console.error('Decline call failed:', err);
    }
  };

  const endCall = async () => {
    if (!callInfo) return;
    try {
      stopRinging();
      cleanupWebRTC();
      setCallState('ended');
      await endVoiceCallAPI(callInfo.conversationKey, callInfo.callId, 'ended');
      setTimeout(() => {
        setCallState('idle');
        setCallInfo(null);
      }, 1200);
    } catch (err) {
      setCallState('idle');
      setCallInfo(null);
      console.error('End call failed:', err);
    }
  };

  const formatDuration = (sec: number) => {
    const min = Math.floor(sec / 60)
      .toString()
      .padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${min}:${s}`;
  };

  const initials = callInfo?.peerName
    ? callInfo.peerName
        .split(' ')
        .map((w) => w[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'U';

  const myInitials = profile?.name
    ? profile.name
        .split(' ')
        .map((w) => w[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'ME';

  return (
    <CallContext.Provider value={{ callState, callInfo, initiateCall, acceptCall, declineCall, endCall }}>
      {children}

      {/* CALL OVERLAY UI */}
      {callState !== 'idle' && callInfo && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/75 backdrop-blur-md p-0 md:p-6 font-sans">
          {/* Main Card Container */}
          <div className="w-full h-full md:h-auto md:max-w-md md:rounded-3xl bg-gradient-to-b from-[#160d2b] via-[#0d071a] to-[#080410] border-0 md:border md:border-violet-500/20 shadow-[0_25px_60px_rgba(0,0,0,0.8),0_0_80px_rgba(124,58,237,0.12)] overflow-hidden relative flex flex-col items-center justify-between min-h-screen md:min-h-[560px] p-8 md:py-10 text-white transition-all duration-300">
            
            {/* Background decorative glow blobs */}
            <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-violet-600/10 blur-[100px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-indigo-600/10 blur-[100px] pointer-events-none" />

            {/* Header */}
            <div className="flex flex-col items-center select-none z-10 pt-4 md:pt-0">
              <span className="text-xs font-bold tracking-[4px] uppercase text-violet-400/80 mb-2">
                Voice Call
              </span>
              <div className="flex items-center gap-2">
                {callState === 'connected' ? (
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                ) : (
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
                  </span>
                )}
                <span className="text-[10px] tracking-wide text-white/40 uppercase font-semibold">
                  Secure Connection
                </span>
              </div>
            </div>

            {/* Central Area: Avatars */}
            <div className="flex flex-col items-center justify-center flex-1 w-full my-6 z-10">
              <div className="relative flex items-center justify-center w-full min-h-[200px]">
                {callState === 'connected' ? (
                  // Active Call View: Side-by-side avatars
                  <div className="flex items-center gap-10 md:gap-12 animate-[fadeIn_0.5s_ease-out]">
                    <div className="flex flex-col items-center gap-3">
                      <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-tr from-violet-800 to-fuchsia-900 border-2 border-violet-500/50 flex items-center justify-center shadow-xl">
                        <span className="text-2xl font-extrabold tracking-wide">{myInitials}</span>
                      </div>
                      <span className="text-xs text-white/50 font-medium">You</span>
                    </div>

                    {/* Animated Connection Bridge */}
                    <div className="flex items-center gap-1.5 px-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="w-6 h-[1px] bg-gradient-to-r from-violet-500/50 to-indigo-500/50" />
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse [animation-delay:0.2s]" />
                    </div>

                    <div className="flex flex-col items-center gap-3">
                      <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-tr from-indigo-800 to-violet-900 border-2 border-indigo-500/50 flex items-center justify-center shadow-xl">
                        <span className="text-2xl font-extrabold tracking-wide">{initials}</span>
                      </div>
                      <span className="text-xs text-white/50 font-medium">{callInfo.peerName.split(' ')[0]}</span>
                    </div>
                  </div>
                ) : (
                  // Single Avatar with outer pulsing rings
                  <div className="relative flex items-center justify-center">
                    {(callState === 'calling' || callState === 'ringing') && (
                      <>
                        <div className="absolute w-36 h-36 rounded-full border border-violet-500/20 animate-[ping_2.5s_infinite] opacity-60" />
                        <div className="absolute w-28 h-28 rounded-full border border-violet-500/40 animate-[ping_1.8s_infinite] opacity-80" />
                      </>
                    )}
                    <div className="relative z-10 w-24 h-24 rounded-full bg-gradient-to-tr from-violet-700 to-indigo-950 border-2 border-white/10 flex items-center justify-center shadow-2xl">
                      <span className="text-3xl font-extrabold tracking-wider">{initials}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Caller Name and Status */}
              <div className="text-center mt-6">
                <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight select-text mb-1">{callInfo.peerName}</h2>
                <p className="text-xs md:text-sm text-white/40 font-medium tracking-wide uppercase select-none">{callInfo.peerRole}</p>
                
                <div className="mt-6 text-lg md:text-xl font-mono tracking-wider select-none font-semibold">
                  {callState === 'calling' && <span className="text-violet-400 animate-pulse">Calling...</span>}
                  {callState === 'ringing' && <span className="text-violet-400 animate-[pulse_1.5s_infinite]">Ringing...</span>}
                  {callState === 'connected' && <span className="text-emerald-400">{formatDuration(duration)}</span>}
                  {callState === 'ended' && <span className="text-rose-500">Call Ended</span>}
                </div>
              </div>
            </div>

            {/* Action Controls */}
            <div className="w-full flex flex-col items-center gap-6 z-10 pb-8 md:pb-0 select-none">
              {callState === 'ringing' && callInfo.isIncoming ? (
                // Ringing incoming call options
                <div className="flex gap-12 justify-center items-center w-full">
                  {/* Decline Button */}
                  <div className="flex flex-col items-center gap-2">
                    <button
                      onClick={declineCall}
                      className="w-14 h-14 rounded-full bg-rose-500/10 hover:bg-rose-600 text-rose-500 hover:text-white border border-rose-500/20 active:scale-90 transition-all duration-300 flex items-center justify-center shadow-lg shadow-rose-950/20"
                      aria-label="Decline Call"
                    >
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 9.4l-4.95 4.95M7.5 14.35l-4.95-4.95M21 7.5a9.955 9.955 0 00-3.197-1.992M3 7.5a9.956 9.956 0 013.197-1.992M21 7.5l-1.5 3M3 7.5l1.5 3M6.197 5.508A9.96 9.96 0 0112 4c2.09 0 4.03.639 5.641 1.732" />
                      </svg>
                    </button>
                    <span className="text-[10px] text-white/40 font-bold uppercase tracking-wider">Decline</span>
                  </div>

                  {/* Accept Button */}
                  <div className="flex flex-col items-center gap-2">
                    <button
                      onClick={acceptCall}
                      className="w-16 h-16 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white active:scale-90 transition-all duration-300 flex items-center justify-center shadow-lg shadow-emerald-950/40 animate-[bounce_2s_infinite]"
                      aria-label="Attend Call"
                    >
                      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.338c0-.966.784-1.75 1.75-1.75h1.757a.75.75 0 01.713.515l1.113 3.341a.75.75 0 01-.174.788L6.1 10.45a11.957 11.957 0 005.45 5.45l1.217-1.26a.75.75 0 01.788-.174l3.342 1.113a.75.75 0 01.514.713V18a1.75 1.75 0 01-1.75 1.75C9.125 19.75 4.25 14.875 4.25 8.838" />
                      </svg>
                    </button>
                    <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Attend</span>
                  </div>
                </div>
              ) : (
                // Calling or Connected options
                <div className="flex flex-col items-center gap-6 w-full">
                  {callState === 'connected' && (
                    <div className="flex gap-10 justify-center items-center mb-2">
                      {/* Mute Button */}
                      <div className="flex flex-col items-center gap-2">
                        <button
                          onClick={toggleMute}
                          className={`w-12 h-12 rounded-full border transition-all duration-300 flex items-center justify-center ${
                            isMuted 
                              ? 'bg-violet-600 text-white border-violet-500 shadow-md shadow-violet-500/20' 
                              : 'bg-white/5 hover:bg-white/10 text-white/70 border-white/10 hover:text-white'
                          }`}
                          aria-label={isMuted ? 'Unmute microphone' : 'Mute microphone'}
                        >
                          {isMuted ? (
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l6 6m0-6l-6 6m3-3v3m0-6V9a3 3 0 00-3-3m0 0a3 3 0 00-3 3v3m6-3a3 3 0 013 3v1m-9-.282v.982a7.5 7.5 0 0013 4.982m-13-.982a7.48 7.48 0 002.518 5.518M12 18.75V21m-4.5-2.25h9" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
                            </svg>
                          )}
                        </button>
                        <span className="text-[9px] text-white/40 font-bold uppercase tracking-wider">{isMuted ? 'Muted' : 'Mute'}</span>
                      </div>
                    </div>
                  )}

                  {/* Red End Call Button */}
                  {callState !== 'ended' && (
                    <div className="flex flex-col items-center gap-2">
                      <button
                        onClick={endCall}
                        className="w-14 h-14 rounded-full bg-rose-600 hover:bg-rose-500 active:scale-90 transition-all duration-300 flex items-center justify-center shadow-lg shadow-rose-950/30 hover:shadow-rose-600/40"
                        aria-label="End Call"
                      >
                        <svg className="w-6 h-6 text-white rotate-[135deg]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.338c0-.966.784-1.75 1.75-1.75h1.757a.75.75 0 01.713.515l1.113 3.341a.75.75 0 01-.174.788L6.1 10.45a11.957 11.957 0 005.45 5.45l1.217-1.26a.75.75 0 01.788-.174l3.342 1.113a.75.75 0 01.514.713V18a1.75 1.75 0 01-1.75 1.75C9.125 19.75 4.25 14.875 4.25 8.838" />
                        </svg>
                      </button>
                      <span className="text-[10px] text-rose-500 font-bold uppercase tracking-wider">End Call</span>
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </CallContext.Provider>
  );
}
