import { useState, useMemo } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { HiShieldExclamation, HiArrowLeft, HiCheck, HiMail, HiPhone } from 'react-icons/hi';
import QRCode from 'react-qr-code';
import { sendRecoveryEmailCodeAPI, verifyRecoveryEmailCodeAPI, sendPhoneCodeAPI, verifyPhoneCodeAPI, startTwoFactorRecoveryAPI, completeTwoFactorRecoveryAPI } from '../utils/api';
import logoLight from '../assets/logo-light.png';

const buildOtpAuthUri = (secret: string, email: string) => {
  const issuer = 'myPSW+';
  const label = encodeURIComponent(email || 'user@mypsw.com');
  return `otpauth://totp/${issuer}:${label}?secret=${secret}&issuer=${issuer}&algorithm=SHA1&digits=6&period=30`;
};

const TwoFactorRecoveryPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const prefilledEmail = searchParams.get('email') || '';
  const [step, setStep] = useState<'email-verify' | 'phone-verify' | 'scan'>('email-verify');
  const [email, setEmail] = useState(prefilledEmail);
  const [emailCode, setEmailCode] = useState('');
  const [phone, setPhone] = useState('');
  const [phoneCode, setPhoneCode] = useState('');
  const [secret, setSecret] = useState('');
  const [authCode, setAuthCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [phoneSent, setPhoneSent] = useState(false);

  const otpAuthUri = useMemo(() => (secret ? buildOtpAuthUri(secret, email) : ''), [secret, email]);

  const handleSendEmailCode = async () => {
    if (!email.trim()) { setError('Please enter your email.'); return; }
    setError('');
    setIsLoading(true);
    try {
      const res = await sendRecoveryEmailCodeAPI(email);
      console.log('[DEV] Recovery email verification code:', res?.devCode);
      setEmailSent(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send code.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyEmail = async () => {
    if (emailCode.length !== 6) { setError('Please enter the full 6-digit code.'); return; }
    setError('');
    setIsLoading(true);
    try {
      const res = await verifyRecoveryEmailCodeAPI(email, emailCode);
      const savedPhone = res?.data?.phone || '';
      if (savedPhone) setPhone(savedPhone);
      setStep('phone-verify');
    } catch (err: any) {
      setError(err.message || 'Invalid verification code.');
      setEmailCode('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendPhoneCode = async () => {
    if (!phone.trim()) { setError('Please enter your phone number.'); return; }
    setError('');
    setIsLoading(true);
    try {
      const res = await sendPhoneCodeAPI(phone);
      console.log('[DEV] Phone verification code:', res?.devCode);
      setPhoneSent(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send code.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyPhone = async () => {
    if (phoneCode.length !== 6) { setError('Please enter the full 6-digit code.'); return; }
    setError('');
    setIsLoading(true);
    try {
      await verifyPhoneCodeAPI(phone, phoneCode);
      const res = await startTwoFactorRecoveryAPI(email);
      setSecret(res.data?.secret || '');
      setStep('scan');
    } catch (err: any) {
      setError(err.message || 'Invalid verification code.');
      setPhoneCode('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompleteRecovery = async () => {
    if (authCode.length !== 6) { setError('Please enter the full 6-digit code.'); return; }
    setError('');
    setIsLoading(true);
    try {
      await completeTwoFactorRecoveryAPI(email, authCode);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err: any) {
      setError(err.message || 'Invalid code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] size-[40%] bg-white/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-10%] size-[30%] bg-accent/10 rounded-full blur-3xl" />
      <div className="mb-10">
        <Link to="/"><img src={logoLight} alt="myPSW+ logo" className="h-12 md:h-14 hover:scale-105 duration-300" /></Link>
      </div>
      <div className="w-full max-w-lg bg-white rounded-5xl p-10 md:p-14 shadow-2xl z-10">
        <div className="text-center mb-8">
          <div className="size-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
            {step === 'email-verify' ? <HiMail className="text-primary size-8" /> : step === 'phone-verify' ? <HiPhone className="text-primary size-8" /> : <HiShieldExclamation className="text-primary size-8" />}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 font-playfair">Reset Authenticator</h1>
          <p className="text-gray-400 font-medium font-dm text-sm">
            {success ? 'Authenticator reset successfully!' : step === 'email-verify' ? 'Step 1: Verify your email address.' : step === 'phone-verify' ? 'Step 2: Verify your phone number.' : 'Step 3: Scan and set up your new authenticator.'}
          </p>
          {!success && (
            <p className="text-xs text-gray-300 font-medium mt-1">
              Step {step === 'email-verify' ? '1' : step === 'phone-verify' ? '2' : '3'} of 3
            </p>
          )}
        </div>

        {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-2xl text-sm font-medium">{error}</div>}

        {success ? (
          <div className="text-center space-y-6">
            <div className="flex justify-center"><div className="size-16 bg-green-100 rounded-full flex items-center justify-center"><HiCheck className="size-8 text-green-600" /></div></div>
            <div className="p-6 bg-green-50 border border-green-200 text-green-700 rounded-2xl text-sm font-medium">
              Authenticator has been reset. Redirecting to login...
            </div>
          </div>
        ) : step === 'email-verify' ? (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-900 ml-1">Email Address</label>
              <input type="email" placeholder="name@company.com" value={email} onChange={(e) => setEmail(e.target.value)} disabled={emailSent}
                className="w-full bg-surface py-5 px-6 rounded-2xl outline-none border-2 border-transparent focus:border-primary/20 focus:bg-white duration-300 text-gray-900 placeholder:text-gray-300 font-medium shadow-sm disabled:opacity-50" />
            </div>
            {!emailSent ? (
              <button onClick={handleSendEmailCode} disabled={isLoading}
                className="w-full py-5 bg-gradient-primary text-white font-bold text-xl rounded-2xl shadow-lg hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                {isLoading ? 'Sending...' : 'Send Verification Code'}
              </button>
            ) : (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-900 ml-1">Enter 6-digit code sent to your email</label>
                  <input type="text" inputMode="numeric" placeholder="123456" value={emailCode} onChange={(e) => setEmailCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="w-full bg-surface py-5 px-6 rounded-2xl outline-none border-2 border-transparent focus:border-primary/20 focus:bg-white duration-300 text-gray-900 placeholder:text-gray-300 font-medium shadow-sm" />
                </div>
                <button onClick={handleVerifyEmail} disabled={isLoading || emailCode.length !== 6}
                  className="w-full py-5 bg-gradient-primary text-white font-bold text-xl rounded-2xl shadow-lg hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                  {isLoading ? 'Verifying...' : 'Verify Email'}
                </button>
              </>
            )}
          </div>
        ) : step === 'phone-verify' ? (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-900 ml-1">Phone Number</label>
              <div className="bg-surface py-5 px-6 rounded-2xl border-2 border-transparent text-gray-900 font-bold text-base shadow-sm">
                {phone || 'Not found'}
              </div>
            </div>
            {!phoneSent ? (
              <button onClick={handleSendPhoneCode} disabled={isLoading || !phone.trim()}
                className="w-full py-5 bg-gradient-primary text-white font-bold text-xl rounded-2xl shadow-lg hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                {isLoading ? 'Sending...' : 'Send Verification Code'}
              </button>
            ) : (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-900 ml-1">Enter 6-digit code sent to your phone</label>
                  <input type="text" inputMode="numeric" placeholder="123456" value={phoneCode} onChange={(e) => setPhoneCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="w-full bg-surface py-5 px-6 rounded-2xl outline-none border-2 border-transparent focus:border-primary/20 focus:bg-white duration-300 text-gray-900 placeholder:text-gray-300 font-medium shadow-sm" />
                </div>
                <button onClick={handleVerifyPhone} disabled={isLoading || phoneCode.length !== 6}
                  className="w-full py-5 bg-gradient-primary text-white font-bold text-xl rounded-2xl shadow-lg hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                  {isLoading ? 'Verifying...' : 'Verify Phone'}
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <p className="text-sm text-gray-500 font-medium text-center">Scan this QR code with your authenticator app and enter the 6-digit code.</p>
            <div className="flex justify-center rounded-3xl border border-gray-100 bg-gray-50 p-6">
              {otpAuthUri ? <QRCode value={otpAuthUri} size={200} includeMargin /> : null}
            </div>
            {secret && (
              <div className="rounded-2xl border border-gray-100 bg-white p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">Manual entry key</p>
                <p className="mt-2 break-all text-sm font-semibold text-gray-900">{secret}</p>
              </div>
            )}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-900 ml-1">6-digit code from authenticator</label>
              <input type="text" inputMode="numeric" placeholder="123456" value={authCode} onChange={(e) => setAuthCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="w-full bg-surface py-5 px-6 rounded-2xl outline-none border-2 border-transparent focus:border-primary/20 focus:bg-white duration-300 text-gray-900 placeholder:text-gray-300 font-medium shadow-sm" />
            </div>
            <button onClick={handleCompleteRecovery} disabled={isLoading || authCode.length !== 6}
              className="w-full py-5 bg-gradient-primary text-white font-bold text-xl rounded-2xl shadow-lg hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
              {isLoading ? 'Verifying...' : 'Verify & Reset'}
            </button>
          </div>
        )}

        {!success && (
          <div className="mt-8 text-center">
            <Link to="/login" className="inline-flex items-center gap-2 text-primary font-bold hover:underline duration-300"><HiArrowLeft /> Back to Login</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default TwoFactorRecoveryPage;
