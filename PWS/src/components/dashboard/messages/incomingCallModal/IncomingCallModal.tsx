import React, { useEffect, useRef } from 'react';

export type IncomingCallInfo = {
  callId: string;
  fromName: string;
  fromUserId: string;
  conversationKey: string;
  streamCallUrl: string;
};

interface Props {
  callInfo: IncomingCallInfo | null;
  onAccept: (info: IncomingCallInfo) => void;
  onDecline: (info: IncomingCallInfo) => void;
}

export default function IncomingCallModal({ callInfo, onAccept, onDecline }: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Play/stop ringtone
  useEffect(() => {
    if (callInfo) {
      // Use a silent oscillator via Web Audio API so no external file is needed
      try {
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        osc.start();
        (audioRef as any).current = { stop: () => { osc.stop(); ctx.close(); } };
      } catch {
        // silent fail if AudioContext blocked
      }
    } else {
      try { (audioRef as any).current?.stop(); } catch { /* */ }
    }
    return () => {
      try { (audioRef as any).current?.stop(); } catch { /* */ }
    };
  }, [callInfo]);

  if (!callInfo) return null;

  const initials = callInfo.fromName
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-[9998] bg-black/60 backdrop-blur-sm animate-fade-in" />

      {/* Modal card */}
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
        aria-modal="true"
        role="dialog"
        aria-label="Incoming voice call"
      >
        <div className="relative w-full max-w-sm bg-gradient-to-b from-[#1a0533] to-[#2d0a5e] rounded-3xl shadow-2xl overflow-hidden animate-slide-up">

          {/* Decorative blobs */}
          <div className="absolute top-[-60px] left-[-60px] w-56 h-56 rounded-full bg-violet-600/20 blur-3xl pointer-events-none" />
          <div className="absolute bottom-[-40px] right-[-40px] w-44 h-44 rounded-full bg-indigo-500/15 blur-3xl pointer-events-none" />

          {/* Content */}
          <div className="relative z-10 px-8 pt-10 pb-8 flex flex-col items-center gap-5">

            {/* Label */}
            <p className="text-[11px] font-bold tracking-[2px] uppercase text-white/40">
              Incoming Voice Call
            </p>

            {/* Avatar with pulse rings */}
            <div className="relative flex items-center justify-center my-2">
              <span className="absolute w-32 h-32 rounded-full bg-violet-500/20 animate-ping-slow" />
              <span className="absolute w-24 h-24 rounded-full bg-violet-500/25 animate-ping-slower" />
              <div className="relative z-10 w-20 h-20 rounded-full bg-violet-700 border-2 border-white/20 flex items-center justify-center shadow-xl">
                <span className="text-3xl font-extrabold text-white">{initials}</span>
              </div>
            </div>

            {/* Caller name */}
            <div className="text-center">
              <h2 className="text-2xl font-extrabold text-white">{callInfo.fromName}</h2>
              <p className="text-sm text-white/50 mt-1">PSW · Care Provider</p>
            </div>

            {/* Animated dots */}
            <div className="flex gap-2 items-center h-4">
              {[0, 0.2, 0.4].map((delay, i) => (
                <span
                  key={i}
                  className="w-2 h-2 rounded-full bg-white/30 animate-bounce"
                  style={{ animationDelay: `${delay}s` }}
                />
              ))}
            </div>

            {/* Buttons */}
            <div className="flex gap-10 mt-4">
              {/* Decline */}
              <div className="flex flex-col items-center gap-2">
                <button
                  id="decline-call-btn"
                  onClick={() => onDecline(callInfo)}
                  className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-500 active:scale-95 transition-all duration-200 flex items-center justify-center shadow-lg shadow-red-900/40"
                  aria-label="Decline call"
                >
                  <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 9.4l-4.95 4.95M7.5 14.35l-4.95-4.95M21 7.5a9.955 9.955 0 00-3.197-1.992M3 7.5a9.956 9.956 0 013.197-1.992M21 7.5l-1.5 3M3 7.5l1.5 3M6.197 5.508A9.96 9.96 0 0112 4c2.09 0 4.03.639 5.641 1.732" />
                  </svg>
                </button>
                <span className="text-xs text-white/50 font-semibold">Decline</span>
              </div>

              {/* Accept */}
              <div className="flex flex-col items-center gap-2">
                <button
                  id="accept-call-btn"
                  onClick={() => onAccept(callInfo)}
                  className="w-16 h-16 rounded-full bg-green-600 hover:bg-green-500 active:scale-95 transition-all duration-200 flex items-center justify-center shadow-lg shadow-green-900/40 animate-pulse-green"
                  aria-label="Accept call"
                >
                  <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.338c0-.966.784-1.75 1.75-1.75h1.757a.75.75 0 01.713.515l1.113 3.341a.75.75 0 01-.174.788L6.1 10.45a11.957 11.957 0 005.45 5.45l1.217-1.26a.75.75 0 01.788-.174l3.342 1.113a.75.75 0 01.514.713V18a1.75 1.75 0 01-1.75 1.75C9.125 19.75 4.25 14.875 4.25 8.838" />
                  </svg>
                </button>
                <span className="text-xs text-white/50 font-semibold">Accept</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
