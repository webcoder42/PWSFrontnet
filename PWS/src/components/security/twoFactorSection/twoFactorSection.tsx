import React, { useMemo, useState } from 'react';
import { clsx } from 'clsx';
import { HiOutlineShieldCheck, HiOutlineArrowLeft, HiCheckCircle, HiOutlineExclamationCircle, HiOutlineRefresh } from 'react-icons/hi';
import QRCode from 'react-qr-code';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useUser } from '../../../context/UserContext';
import { getTwoFactorAuthStatusAPI, setupTwoFactorAuthAPI, verifyTwoFactorAuthAPI, disableTwoFactorAuthAPI } from '../../../utils/api';

interface TwoFactorSectionProps {
  onComplete: () => void;
}

const buildOtpAuthUri = (secret: string, email: string) => {
  const issuer = 'myPSW+';
  const label = encodeURIComponent(email || 'user@mypsw.com');
  return `otpauth://totp/${issuer}:${label}?secret=${secret}&issuer=${issuer}&algorithm=SHA1&digits=6&period=30`;
};

const TwoFactorSection: React.FC<TwoFactorSectionProps> = ({ onComplete }) => {
  const { rawUser } = useUser();
  const queryClient = useQueryClient();
  const userId = rawUser?._id || rawUser?.id;
  const [mode, setMode] = useState<'intro' | 'verify' | 'enabled'>('intro');
  const [secret, setSecret] = useState<string | null>(null);
  const [otpCode, setOtpCode] = useState('');

  const { data: statusData } = useQuery({
    queryKey: ['two-factor-status', userId],
    queryFn: () => getTwoFactorAuthStatusAPI(String(userId)).then(r => r.data || null),
    enabled: !!userId,
  });

  const isEnabled = statusData?.enabled || false;
  if (statusData?.enabled && mode === 'intro') setMode('enabled');

  const email = rawUser?.email || 'user@mypsw.com';
  const otpAuthUri = useMemo(() => (secret ? buildOtpAuthUri(secret, email) : ''), [secret, email]);

  const setupMutation = useMutation({
    mutationFn: () => setupTwoFactorAuthAPI(String(userId)),
    onSuccess: (response) => {
      setSecret(response?.data?.secret || null);
      setOtpCode('');
      setMode('verify');
    },
  });

  const verifyMutation = useMutation({
    mutationFn: (code: string) => verifyTwoFactorAuthAPI(String(userId), code),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['two-factor-status', userId] });
      setMode('enabled');
      onComplete();
    },
  });

  const disableMutation = useMutation({
    mutationFn: (code: string) => disableTwoFactorAuthAPI(String(userId), code),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['two-factor-status', userId] });
      setSecret(null);
      setOtpCode('');
      setMode('intro');
    },
  });

  const handleStartSetup = () => {
    if (!userId) return;
    setupMutation.mutate();
  };

  const handleVerify = () => {
    if (!secret) return;
    const normalizedCode = otpCode.replace(/\D/g, '').slice(0, 6);
    if (normalizedCode.length !== 6) return;
    verifyMutation.mutate(normalizedCode);
  };

  const handleDisable = () => {
    const normalizedCode = otpCode.replace(/\D/g, '').slice(0, 6);
    if (normalizedCode.length !== 6) return;
    disableMutation.mutate(normalizedCode);
  };

  if (mode === 'enabled' && isEnabled) {
    return (
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-12 space-y-8 md:space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="space-y-6">
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 font-playfair">Authenticator app enabled</h3>
          <p className="text-sm sm:text-base text-text-muted font-medium font-dm leading-relaxed">
            Your account is now protected with a time-based one-time password from your authenticator app.
          </p>
        </div>

        <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <HiCheckCircle className="size-5 sm:size-6 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-emerald-900">2-step verification is active</p>
              <p className="mt-2 text-xs sm:text-sm text-emerald-800">You can disable it anytime if you no longer want to use an authenticator app.</p>
            </div>
          </div>
        </div>

        {disableMutation.isError && (
          <div className="bg-red-50 border border-red-100 p-4 sm:p-6 rounded-2xl flex gap-3 sm:gap-4 animate-in shake duration-300">
            <HiOutlineExclamationCircle className="size-5 sm:size-6 text-red-500 shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm text-red-800 font-bold font-dm leading-relaxed">{disableMutation.error instanceof Error ? disableMutation.error.message : 'Failed to disable authenticator.'}</p>
          </div>
        )}

        <div className="space-y-3">
          <label className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">Enter the 6-digit code from your authenticator app</label>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={6}
            value={otpCode}
            onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="Enter 6-digit code"
            className="w-full bg-white border border-gray-100 rounded-2xl py-4 px-5 outline-none focus:border-primary/20 focus:ring-4 focus:ring-primary/5 duration-300 font-dm text-gray-900 font-bold text-base"
          />
        </div>

        <button
          onClick={handleDisable}
          disabled={disableMutation.isPending}
          className={clsx(
            'w-full py-4 sm:py-5 border border-red-200 bg-white text-red-600 font-bold text-lg sm:text-xl rounded-full hover:bg-red-50 duration-300',
            disableMutation.isPending && 'opacity-70 cursor-not-allowed'
          )}
        >
          {disableMutation.isPending ? 'Disabling...' : 'Disable authenticator app'}
        </button>
      </div>
    );
  }

  if (mode === 'verify' && secret) {
    return (
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-12 space-y-8 md:space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={() => {
              setMode('intro');
              setSecret(null);
              setOtpCode('');
              setError(null);
            }}
            className="size-8 sm:size-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-primary hover:bg-primary/5 duration-300"
          >
            <HiOutlineArrowLeft className="size-4 sm:size-5" />
          </button>
          <h3 className="text-xl sm:text-3xl font-bold text-gray-900 font-playfair">Authenticator setup</h3>
        </div>

        <div className="space-y-6">
          <p className="text-sm sm:text-base text-text-muted font-medium font-dm leading-relaxed">
            Open your authenticator app, scan the QR code below, and enter the 6-digit code it generates.
          </p>

          {verifyMutation.isSuccess && (
            <div className="bg-emerald-50 border border-emerald-100 p-4 sm:p-6 rounded-2xl flex gap-3 sm:gap-4 animate-in zoom-in duration-300">
              <HiCheckCircle className="size-5 sm:size-6 text-emerald-500 shrink-0 mt-0.5" />
              <p className="text-xs sm:text-sm text-emerald-800 font-bold font-dm leading-relaxed">
                Authenticator app enabled successfully.
              </p>
            </div>
          )}

          {verifyMutation.isError && (
            <div className="bg-red-50 border border-red-100 p-4 sm:p-6 rounded-2xl flex gap-3 sm:gap-4 animate-in shake duration-300">
              <HiOutlineExclamationCircle className="size-5 sm:size-6 text-red-500 shrink-0 mt-0.5" />
              <p className="text-xs sm:text-sm text-red-800 font-bold font-dm leading-relaxed">
                {verifyMutation.error instanceof Error ? verifyMutation.error.message : 'Invalid verification code.'}
              </p>
            </div>
          )}

          <div className="flex justify-center rounded-3xl border border-gray-100 bg-gray-50 p-4 sm:p-6">
            <QRCode value={otpAuthUri} size={220} includeMargin />
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-4 sm:p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">Manual entry key</p>
            <p className="mt-2 break-all text-sm font-semibold text-gray-900">{secret}</p>
          </div>

          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={6}
            value={otpCode}
            onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="Enter 6-digit code"
            className="w-full bg-white border border-gray-100 rounded-2xl py-4 px-5 outline-none focus:border-primary/20 focus:ring-4 focus:ring-primary/5 duration-300 font-dm text-gray-900 font-bold text-base"
          />
        </div>

        <div className="pt-4 sm:pt-6">
          <button
            onClick={handleVerify}
            disabled={verifyMutation.isPending}
            className={clsx(
              'w-full py-4 sm:py-5 bg-gradient-purple text-white font-bold text-lg sm:text-xl rounded-full shadow-lg shadow-primary/20 hover:shadow-xl hover:scale-[1.01] duration-300 active:scale-95 flex items-center justify-center gap-3',
              verifyMutation.isPending && 'opacity-70 cursor-not-allowed'
            )}
          >
            {verifyMutation.isPending && <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
            {verifyMutation.isPending ? 'Verifying...' : 'Enable authenticator app'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-12 space-y-8 md:space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="space-y-6">
        <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 font-playfair">2FA – Authentication</h3>
        <p className="text-sm sm:text-base text-text-muted font-medium font-dm leading-relaxed">
          Two-factor authentication protects your account by requiring an additional code when you log in on a device we don't recognize.
        </p>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <HiOutlineShieldCheck className="size-5 sm:size-6 text-primary shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-gray-900">Authenticator app</p>
            <p className="mt-2 text-xs sm:text-sm text-gray-600">Use Google Authenticator, Authy, or any TOTP-compatible app to secure your account.</p>
          </div>
        </div>
      </div>

      {setupMutation.isError && (
        <div className="bg-red-50 border border-red-100 p-4 sm:p-6 rounded-2xl flex gap-3 sm:gap-4 animate-in shake duration-300">
          <HiOutlineExclamationCircle className="size-5 sm:size-6 text-red-500 shrink-0 mt-0.5" />
          <p className="text-xs sm:text-sm text-red-800 font-bold font-dm leading-relaxed">
            {setupMutation.error instanceof Error ? setupMutation.error.message : 'Failed to start setup.'}
          </p>
        </div>
      )}

      <button
        onClick={handleStartSetup}
        disabled={setupMutation.isPending}
        className={clsx(
          'w-full py-4 sm:py-5 bg-gradient-purple text-white font-bold text-lg sm:text-xl rounded-full shadow-lg shadow-primary/20 hover:shadow-xl hover:scale-[1.01] duration-300 active:scale-95',
          setupMutation.isPending && 'opacity-70 cursor-not-allowed'
        )}
      >
        {setupMutation.isPending ? 'Setting up...' : 'Enable authenticator app'}
      </button>
    </div>
  );
};

export default TwoFactorSection;
