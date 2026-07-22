import { useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { HiLockClosed, HiArrowLeft } from 'react-icons/hi';
import { resetPasswordAPI } from '../utils/api';
import logoLight from '../assets/logo-light.png';

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '';
  const token = searchParams.get('token') || '';
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !token) { setError('Invalid reset link.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (password !== confirmPassword) { setError('Passwords do not match.'); return; }
    setError('');
    setIsLoading(true);
    try {
      await resetPasswordAPI(email, token, password);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to reset password.');
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
          <div className="size-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center"><HiLockClosed className="text-primary size-8" /></div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 font-playfair">Reset Password</h1>
          <p className="text-gray-400 font-medium font-dm">Enter your new password.</p>
        </div>
        {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-2xl text-sm font-medium">{error}</div>}
        {success ? (
          <div className="text-center space-y-6">
            <div className="p-6 bg-green-50 border border-green-200 text-green-700 rounded-2xl text-sm font-medium">
              Password reset successfully! Redirecting to login...
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-900 ml-1">New Password</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/60 group-focus-within:text-primary duration-300"><HiLockClosed size={22} /></div>
                <input type="password" placeholder="Min. 8 characters" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6}
                  className="w-full bg-surface py-5 pl-14 pr-6 rounded-2xl outline-none border-2 border-transparent focus:border-primary/20 focus:bg-white duration-300 text-gray-900 placeholder:text-gray-300 font-medium shadow-sm" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-900 ml-1">Confirm New Password</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/60 group-focus-within:text-primary duration-300"><HiLockClosed size={22} /></div>
                <input type="password" placeholder="Re-type new password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required minLength={6}
                  className="w-full bg-surface py-5 pl-14 pr-6 rounded-2xl outline-none border-2 border-transparent focus:border-primary/20 focus:bg-white duration-300 text-gray-900 placeholder:text-gray-300 font-medium shadow-sm" />
              </div>
            </div>
            <button type="submit" disabled={isLoading}
              className="w-full py-5 bg-gradient-primary text-white font-bold text-xl rounded-2xl shadow-lg hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}
        <div className="mt-8 text-center">
          <Link to="/login" className="inline-flex items-center gap-2 text-primary font-bold hover:underline duration-300"><HiArrowLeft /> Back to Login</Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
