import { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { HiMail, HiArrowLeft, HiCheck } from 'react-icons/hi';
import { sendVerificationCodeAPI, verifyEmailCodeAPI, resendVerificationCodeAPI, verifyLoginCodeAPI, verifyLoginTwoFactorAPI } from '../utils/api';
import { useUser } from '../context/UserContext';
import { getRedirectPathForRole } from '../utils/linkedAccounts';

import logoLight from '../assets/logo-light.png';

const EmailVerificationPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const prefilledEmail = searchParams.get('email') || '';
  const mode = searchParams.get('mode') || 'register';
  const isLoginMode = mode === 'login';
  const { setUser } = useUser();

  const [email, setEmail] = useState(prefilledEmail);
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCodeSent, setIsCodeSent] = useState(!!prefilledEmail);
  const [timer, setTimer] = useState(0);
  const [twoFactorRequired, setTwoFactorRequired] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const autoSendRef = useRef(false);

  useEffect(() => {
    if (prefilledEmail && !autoSendRef.current) {
      autoSendRef.current = true;
    }
  }, []);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleSendCode = async () => {
    if (!email) {
      setError('Please enter your email address.');
      return;
    }
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const data = await sendVerificationCodeAPI(email);
      setIsCodeSent(true);
      setSuccess('Verification code sent to your email.');
      setTimer(60);
    } catch (err: any) {
      const msg = err.message || '';
      if (msg.includes('already verified')) {
        setIsCodeSent(true);
        setError(msg);
      } else {
        setError(msg || 'Failed to send code. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (timer > 0) return;
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      if (isLoginMode) {
        await sendVerificationCodeAPI(email);
      } else {
        await resendVerificationCodeAPI(email);
      }
      setSuccess('Verification code resent to your email.');
      setTimer(60);
    } catch (err: any) {
      setError(err.message || 'Failed to resend code.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);
    setError('');

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
      setError('Please enter the complete 6-digit code.');
      return;
    }
    if (!email) {
      setError('Email is required.');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      let response: any;
      if (isLoginMode) {
        response = await verifyLoginCodeAPI(email, finalCode, `web:${window.location.hostname}:${email}`);
        if (response.requiresTwoFactorAuth) {
          setTwoFactorRequired(true);
          setTwoFactorCode('');
          return;
        }
      } else {
        response = await verifyEmailCodeAPI(email, finalCode);
      }
      const rawData = response.user || response.data || response;
      const userData = {
        ...rawData,
        token: response.token || rawData.token,
      };
      setUser(userData);
      navigate(getRedirectPathForRole(userData.role), { replace: true });
    } catch (err: any) {
      setError(err.message || 'Invalid verification code.');
      setCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleTwoFactorVerify = async () => {
    if (!email || twoFactorCode.length !== 6) {
      setError('Please enter the complete 6-digit authenticator code.');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const response = await verifyLoginTwoFactorAPI(email, twoFactorCode, `web:${window.location.hostname}:${email}`);
      const userData = {
        ...response.data,
        token: response.token,
      };
      setUser(userData);
      navigate(getRedirectPathForRole(userData.role), { replace: true });
    } catch (err: any) {
      setError(err.message || 'Invalid authenticator code.');
      setTwoFactorCode('');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length !== 6) return;
    const newCode = pasted.split('');
    setCode(newCode);
    inputRefs.current[5]?.focus();
    handleVerify(pasted);
  };

  return (
    <div className="min-h-screen bg-primary flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] size-[40%] bg-white/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-10%] size-[30%] bg-accent/10 rounded-full blur-3xl" />

      <div className="mb-10">
        <Link to="/">
          <img src={logoLight} alt="myPSW+ logo" className="h-12 md:h-14 hover:scale-105 duration-300" />
        </Link>
      </div>

      <div className="w-full max-w-lg bg-white rounded-5xl p-10 md:p-14 shadow-2xl z-10">
        <div className="text-center mb-8">
          <div className="size-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
            <HiMail className="text-primary size-8" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 font-playfair">
            Verify Your Email
          </h1>
          <p className="text-gray-400 font-medium font-dm">
            {isCodeSent
              ? (twoFactorRequired ? 'Enter the 6-digit code from your authenticator app.' : `Enter the 6-digit code sent to ${email}`)
              : 'Enter your email to receive a verification code'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-2xl text-sm font-medium font-dm animate-in fade-in slide-in-from-top-1 duration-300">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-600 rounded-2xl text-sm font-medium font-dm animate-in fade-in slide-in-from-top-1 duration-300 flex items-center gap-2">
            <HiCheck className="size-5" />
            {success}
          </div>
        )}

        {!isCodeSent ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-900 ml-1">Email Address</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/60 group-focus-within:text-primary duration-300">
                  <HiMail size={22} />
                </div>
                <input
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-surface py-5 pl-14 pr-6 rounded-2xl outline-none border-2 border-transparent focus:border-primary/20 focus:bg-white duration-300 text-gray-900 placeholder:text-gray-300 font-medium shadow-sm"
                />
              </div>
            </div>
            <button
              onClick={handleSendCode}
              disabled={isLoading}
              className="w-full py-5 bg-gradient-primary text-white font-bold text-xl rounded-2xl shadow-lg hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Sending...' : 'Send Verification Code'}
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {twoFactorRequired ? (
              <div className="space-y-4">
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="123456"
                  value={twoFactorCode}
                  onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  disabled={isLoading}
                  className="w-full bg-surface py-5 px-6 rounded-2xl outline-none border-2 border-transparent focus:border-primary/20 focus:bg-white duration-300 text-gray-900 placeholder:text-gray-300 font-medium shadow-sm"
                />
                <button
                  onClick={handleTwoFactorVerify}
                  disabled={isLoading || twoFactorCode.length !== 6}
                  className="w-full py-5 bg-gradient-primary text-white font-bold text-xl rounded-2xl shadow-lg hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Verifying...' : 'Verify Authenticator'}
                </button>
              </div>
            ) : (
              <>
                <div className="flex justify-center gap-3" onPaste={handlePaste}>
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
                      className="size-14 md:size-16 text-center text-2xl font-bold bg-surface rounded-2xl outline-none border-2 border-transparent focus:border-primary/30 focus:bg-white duration-300 text-gray-900 shadow-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  ))}
                </div>

                <button
                  onClick={() => handleVerify()}
                  disabled={isLoading || code.some((d) => d === '')}
                  className="w-full py-5 bg-gradient-primary text-white font-bold text-xl rounded-2xl shadow-lg hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Verifying...' : 'Verify Email'}
                </button>
              </>
            )}

            <div className="text-center">
              {twoFactorRequired ? (
                <button
                  onClick={() => navigate(`/two-factor-recovery?email=${encodeURIComponent(email)}`)}
                  className="text-primary font-bold hover:underline duration-300"
                >
                  Lost your code?
                </button>
              ) : (
                <button
                  onClick={handleResendCode}
                  disabled={isLoading || timer > 0}
                  className="text-primary font-bold hover:underline duration-300 disabled:text-gray-300 disabled:no-underline"
                >
                  {timer > 0 ? `Resend code in ${timer}s` : 'Resend Code'}
                </button>
              )}
            </div>
          </div>
        )}

        <div className="mt-8 text-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-primary font-bold text-lg hover:underline duration-300"
          >
            <HiArrowLeft />
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationPage;
