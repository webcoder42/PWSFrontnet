import React, { useState, useRef } from 'react';
import { clsx } from 'clsx';
import { HiOutlineDeviceMobile, HiOutlineShieldCheck, HiOutlineArrowLeft, HiCheckCircle, HiOutlineExclamationCircle } from 'react-icons/hi';

interface TwoFactorSectionProps {
  onComplete: () => void;
}

const TwoFactorSection: React.FC<TwoFactorSectionProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1); // 1: Select Method, 2: Enter Code
  const [selectedMethod, setSelectedMethod] = useState('sms');
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const methods = [
    {
      id: 'sms',
      title: 'Text message (SMS)',
      icon: HiOutlineDeviceMobile,
      description: "We'll send a code to the number you choose."
    },
    {
      id: 'app',
      title: 'Authenticator App',
      icon: HiOutlineShieldCheck,
      description: 'Use Google Authenticator or similar.'
    }
  ];

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSave = () => {
    const fullCode = code.join('');
    if (fullCode.length < 6) {
      setError("Please enter the full 6-digit code.");
      return;
    }

    setError(null);
    setIsLoading(true);

    // Simulate Verification
    setTimeout(() => {
      setIsLoading(false);
      if (fullCode === '123456') { // Mock success code
        setSuccess(true);
        onComplete(); // Update parent state
        setTimeout(() => {
          setSuccess(false);
          setStep(1);
          setCode(['', '', '', '', '', '']);
        }, 3000);
      } else {
        setError("Invalid verification code. Please try again.");
      }
    }, 2000);
  };

  if (step === 1) {
    return (
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-12 space-y-8 md:space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="space-y-6">
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 font-playfair">2FA – Authentication</h3>
          <p className="text-sm sm:text-base text-text-muted font-medium font-dm leading-relaxed">
            Two-factor authentication protects your account by requiring an additional code when you log in on a device we don't recognize.
          </p>
        </div>

        <div className="space-y-4">
          {methods.map((method) => (
            <div
              key={method.id}
              onClick={() => setSelectedMethod(method.id)}
              className={clsx(
                "p-4 sm:p-6 rounded-2xl border-2 cursor-pointer duration-300 flex items-center justify-between group",
                selectedMethod === method.id
                  ? "border-primary bg-primary/[0.02]"
                  : "border-gray-100 hover:border-primary/20 bg-white"
              )}
            >
              <div className="flex items-center gap-3 sm:gap-5">
                <div className={clsx(
                  "size-10 sm:size-12 rounded-xl flex items-center justify-center duration-300 shadow-sm",
                  selectedMethod === method.id ? "bg-primary text-white" : "bg-gray-50 text-gray-400 group-hover:bg-primary/5 group-hover:text-primary"
                )}>
                  <method.icon className="size-5 sm:size-6" />
                </div>
                <div className="space-y-0.5 sm:space-y-1">
                  <h4 className={clsx(
                    "text-base sm:text-lg font-bold font-dm duration-300",
                    selectedMethod === method.id ? "text-primary" : "text-gray-900"
                  )}>
                    {method.title}
                  </h4>
                  <p className="text-[10px] sm:text-sm text-text-muted font-medium font-dm leading-tight">
                    {method.description}
                  </p>
                </div>
              </div>

              <div className={clsx(
                "size-5 sm:size-6 rounded-full border-2 flex items-center justify-center duration-300",
                selectedMethod === method.id
                  ? "border-primary"
                  : "border-gray-200 group-hover:border-primary/40"
              )}>
                {selectedMethod === method.id && (
                  <div className="size-2 sm:size-3 bg-primary rounded-full animate-in zoom-in duration-300" />
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="pt-6 sm:pt-10">
          <button
            onClick={() => setStep(2)}
            className="w-full py-4 sm:py-5 bg-gradient-purple text-white font-bold text-lg sm:text-xl rounded-full shadow-lg shadow-primary/20 hover:shadow-xl hover:scale-[1.01] duration-300 active:scale-95"
          >
            Next
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-12 space-y-8 md:space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex items-center gap-3 sm:gap-4">
        <button
          onClick={() => {
            setStep(1);
            setError(null);
          }}
          className="size-8 sm:size-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-primary hover:bg-primary/5 duration-300"
        >
          <HiOutlineArrowLeft className="size-4 sm:size-5" />
        </button>
        <h3 className="text-xl sm:text-3xl font-bold text-gray-900 font-playfair">Enter confirmation code</h3>
      </div>

      <div className="space-y-6">
        <p className="text-sm sm:text-base text-text-muted font-medium font-dm leading-relaxed">
          {selectedMethod === 'sms'
            ? "Enter the 6-digit code we sent to (xxx) xxx-xx98. It may take up to a minute for you to receive this code."
            : "Enter the 6-digit code generated by your authenticator app (like Google Authenticator or Authy)."}
        </p>

        {success && (
          <div className="bg-emerald-50 border border-emerald-100 p-4 sm:p-6 rounded-2xl flex gap-3 sm:gap-4 animate-in zoom-in duration-300">
            <HiCheckCircle className="size-5 sm:size-6 text-emerald-500 shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm text-emerald-800 font-bold font-dm leading-relaxed">
              Two-factor authentication enabled successfully!
            </p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-100 p-4 sm:p-6 rounded-2xl flex gap-3 sm:gap-4 animate-in shake duration-300">
            <HiOutlineExclamationCircle className="size-5 sm:size-6 text-red-500 shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm text-red-800 font-bold font-dm leading-relaxed">
              {error}
            </p>
          </div>
        )}

        <div className="flex items-center justify-center gap-2 sm:gap-4 overflow-x-auto no-scrollbar py-2">
          {code.map((digit, idx) => (
            <input
              key={idx}
              ref={el => { inputRefs.current[idx] = el; }}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              value={digit}
              onChange={(e) => handleCodeChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              className="size-10 sm:size-16 md:size-20 bg-white border-2 border-gray-100 rounded-xl sm:rounded-2xl text-center text-xl sm:text-3xl font-bold text-gray-900 focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none duration-300 font-dm"
            />
          ))}
        </div>

        {selectedMethod === 'sms' && !success && (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 text-center sm:text-left">
            <button className="text-primary font-bold font-dm hover:underline underline-offset-4 duration-300 text-sm">
              Resend code.
            </button>
            <span className="text-gray-400 font-medium font-dm text-xs sm:text-sm">(Resend in 0:43)</span>
          </div>
        )}
      </div>

      <div className="pt-4 sm:pt-6">
        <button 
          onClick={handleSave}
          disabled={isLoading || success}
          className={clsx(
            "w-full py-4 sm:py-5 bg-gradient-purple text-white font-bold text-lg sm:text-xl rounded-full shadow-lg shadow-primary/20 hover:shadow-xl hover:scale-[1.01] duration-300 active:scale-95 flex items-center justify-center gap-3",
            (isLoading || success) && "opacity-70 cursor-not-allowed"
          )}
        >
          {isLoading && <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
          {isLoading ? 'Verifying...' : success ? 'Success!' : 'Save'}
        </button>
      </div>
    </div>
  );
};

export default TwoFactorSection;
