import React, { useState, useRef, useEffect } from 'react';
import { clsx } from 'clsx';
import { HiCheck, HiX } from 'react-icons/hi';
import { sendPhoneCodeAPI, verifyPhoneCodeAPI, resendPhoneCodeAPI } from '../utils/api';

interface PhoneVerificationProps {
  phone: string;
  countryCode: string;
  onVerified: (verified: boolean) => void;
}

const PhoneVerification: React.FC<PhoneVerificationProps> = ({ phone, countryCode, onVerified }) => {
  const [step, setStep] = useState<'idle' | 'sent' | 'verified'>('idle');
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [timer, setTimer] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const fullPhone = `${countryCode}${phone.replace(/\D/g, '')}`;

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  useEffect(() => {
    if (step === 'idle') {
      onVerified(false);
    }
  }, [step, onVerified]);

  useEffect(() => {
    setStep('idle');
    setCode(['', '', '', '', '', '']);
    setErrorMsg('');
    setTimer(0);
  }, [phone]);

  const handleSendCode = async () => {
    if (!phone.trim()) return;
    setIsLoading(true);
    setErrorMsg('');
    try {
      const res = await sendPhoneCodeAPI(fullPhone);
      console.log(`\n[DEV] Phone verification code: ${res.devCode}\n`);
      setStep('sent');
      setTimer(60);
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to send code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (timer > 0 || !phone.trim()) return;
    setIsLoading(true);
    setErrorMsg('');
    try {
      const res = await resendPhoneCodeAPI(fullPhone);
      console.log(`\n[DEV] Phone verification code (resend): ${res.devCode}\n`);
      setTimer(60);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to resend code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);
    setErrorMsg('');

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newCode.every((d) => d !== '') && index === 5) {
      handleVerify(newCode.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (fullCode?: string) => {
    const finalCode = fullCode || code.join('');
    if (finalCode.length !== 6) {
      setErrorMsg('Please enter the complete 6-digit code');
      return;
    }
    setIsLoading(true);
    setErrorMsg('');
    try {
      await verifyPhoneCodeAPI(fullPhone, finalCode);
      setStep('verified');
      onVerified(true);
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid code');
      setCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const fullPhoneDisplay = `${countryCode} ${phone}`;

  if (step === 'verified') {
    return (
      <div className="flex items-center gap-2 text-green-600 bg-green-50 w-fit px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-bold font-dm">
        <HiCheck className="size-4" />
        Verified via SMS
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {step === 'idle' && (
        <button
          onClick={handleSendCode}
          disabled={!phone.trim() || isLoading}
          className={clsx(
            'text-xs sm:text-sm font-bold font-dm px-4 py-2 rounded-lg duration-200',
            !phone.trim() || isLoading
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-primary/10 text-primary hover:bg-primary/20 cursor-pointer'
          )}
        >
          {isLoading ? 'Sending...' : 'Send Verification Code'}
        </button>
      )}

      {step === 'sent' && (
        <div className="space-y-3">
          <p className="text-xs sm:text-sm text-gray-500 font-medium font-dm">
            Enter the 6-digit code sent to {fullPhoneDisplay}
          </p>
          <div className="flex gap-2">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => { inputRefs.current[index] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleCodeChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                disabled={isLoading}
                className={clsx(
                  'w-10 h-12 sm:w-12 sm:h-14 text-center text-lg sm:text-xl font-bold rounded-xl border-2 outline-none duration-200',
                  digit ? 'border-primary bg-white' : 'border-gray-200 bg-gray-50',
                  isLoading ? 'opacity-50' : ''
                )}
              />
            ))}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleVerify()}
              disabled={isLoading || code.some((d) => d === '')}
              className={clsx(
                'text-xs sm:text-sm font-bold font-dm px-4 py-2 rounded-lg duration-200',
                isLoading || code.some((d) => d === '')
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-primary text-white hover:bg-primary/90 cursor-pointer'
              )}
            >
              {isLoading ? 'Verifying...' : 'Verify Code'}
            </button>
            <button
              onClick={handleResend}
              disabled={isLoading || timer > 0}
              className="text-xs sm:text-sm font-bold font-dm text-primary/70 hover:text-primary duration-200 disabled:text-gray-300 disabled:cursor-not-allowed"
            >
              {timer > 0 ? `Resend in ${timer}s` : 'Resend Code'}
            </button>
          </div>
        </div>
      )}

      {errorMsg && (
        <div className="flex items-center gap-1.5 text-red-600 bg-red-50 w-fit px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-bold font-dm">
          <HiX className="size-4" />
          {errorMsg}
        </div>
      )}
    </div>
  );
};

export default PhoneVerification;
