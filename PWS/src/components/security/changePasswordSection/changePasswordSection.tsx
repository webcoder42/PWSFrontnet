import React, { useState } from 'react';
import { HiOutlineExclamationCircle, HiOutlineEye, HiOutlineEyeOff, HiCheckCircle } from 'react-icons/hi';
import { clsx } from 'clsx';

const ChangePasswordSection = () => {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showRetype, setShowRetype] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    retypePassword: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Basic Validation
    if (!formData.currentPassword || !formData.newPassword || !formData.retypePassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (formData.newPassword.length < 8) {
      setError("New password must be at least 8 characters long.");
      return;
    }

    if (formData.newPassword !== formData.retypePassword) {
      setError("New passwords do not match.");
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setSuccess(true);
      setFormData({ currentPassword: '', newPassword: '', retypePassword: '' });

      // Reset success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000);
    }, 2000);
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 md:p-12 space-y-8 md:space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
      <form onSubmit={handleSubmit}>
        <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 font-playfair mb-6">Change password</h3>

        {/* Warning Alert */}
        <div className="bg-warning-extralight border-l-4 border-warning p-4 sm:p-6 rounded-2xl flex gap-3 sm:gap-4 mb-8 sm:mb-10">
          <HiOutlineExclamationCircle className="size-5 sm:size-6 text-warning shrink-0 mt-0.5" />
          <p className="text-xs sm:text-sm text-amber-900 font-medium font-dm leading-relaxed">
            You'll be logged out of all sessions except this one to protect your account if anyone is trying to gain access.
          </p>
        </div>

        {success && (
          <div className="bg-emerald-50 border border-emerald-100 p-4 sm:p-6 rounded-2xl flex gap-3 sm:gap-4 mb-8 animate-in zoom-in duration-300">
            <HiCheckCircle className="size-5 sm:size-6 text-emerald-500 shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm text-emerald-800 font-bold font-dm leading-relaxed">
              Password updated successfully! Your account is now secure.
            </p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-100 p-4 sm:p-6 rounded-2xl flex gap-3 sm:gap-4 mb-8 animate-in shake duration-300">
            <HiOutlineExclamationCircle className="size-5 sm:size-6 text-red-500 shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm text-red-800 font-bold font-dm leading-relaxed">
              {error}
            </p>
          </div>
        )}

        <p className="text-xs sm:text-sm text-text-muted font-medium font-dm leading-relaxed mb-6 sm:mb-8">
          Your password must be at least 8 characters and should include a combination of numbers, letters and special characters (!$@%).
        </p>

        <div className="space-y-4 sm:space-y-6">
          {/* Current Password */}
          <div className="relative group">
            <input
              type={showCurrent ? "text" : "password"}
              placeholder="Current password"
              value={formData.currentPassword}
              onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
              className="w-full bg-white border border-gray-100 rounded-xl sm:rounded-2xl py-3 sm:py-4 px-5 sm:px-6 pr-12 sm:pr-14 outline-none focus:border-primary/20 focus:ring-4 focus:ring-primary/5 duration-300 font-dm text-gray-900 font-bold text-sm sm:text-base"
            />
            <button
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              className="absolute right-4 sm:right-5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-primary duration-300"
            >
              {showCurrent ? <HiOutlineEyeOff className="size-5 sm:size-6" /> : <HiOutlineEye className="size-5 sm:size-6" />}
            </button>
          </div>

          {/* New Password */}
          <div className="relative group">
            <input
              type={showNew ? "text" : "password"}
              placeholder="New password"
              value={formData.newPassword}
              onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
              className="w-full bg-white border border-gray-100 rounded-xl sm:rounded-2xl py-3 sm:py-4 px-5 sm:px-6 pr-12 sm:pr-14 outline-none focus:border-primary/20 focus:ring-4 focus:ring-primary/5 duration-300 font-dm text-gray-900 font-bold text-sm sm:text-base"
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute right-4 sm:right-5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-primary duration-300"
            >
              {showNew ? <HiOutlineEyeOff className="size-5 sm:size-6" /> : <HiOutlineEye className="size-5 sm:size-6" />}
            </button>
          </div>

          {/* Re-type New Password */}
          <div className="relative group">
            <input
              type={showRetype ? "text" : "password"}
              placeholder="Re-type new password"
              value={formData.retypePassword}
              onChange={(e) => setFormData({ ...formData, retypePassword: e.target.value })}
              className="w-full bg-white border border-gray-100 rounded-xl sm:rounded-2xl py-3 sm:py-4 px-5 sm:px-6 pr-12 sm:pr-14 outline-none focus:border-primary/20 focus:ring-4 focus:ring-primary/5 duration-300 font-dm text-gray-900 font-bold text-sm sm:text-base"
            />
            <button
              type="button"
              onClick={() => setShowRetype(!showRetype)}
              className="absolute right-4 sm:right-5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-primary duration-300"
            >
              {showRetype ? <HiOutlineEyeOff className="size-5 sm:size-6" /> : <HiOutlineEye className="size-5 sm:size-6" />}
            </button>
          </div>
        </div>

        <button
          type="button"
          className="text-primary font-bold font-dm mt-6 hover:underline underline-offset-4 duration-300 text-xs sm:text-sm"
        >
          Forgot your password?
        </button>

        <div className="pt-8 sm:pt-10">
          <button
            type="submit"
            disabled={isLoading}
            className={clsx(
              "w-full py-4 sm:py-5 bg-gradient-purple text-white font-bold text-lg sm:text-xl rounded-full shadow-lg shadow-primary/20 hover:shadow-xl hover:scale-[1.01] duration-300 active:scale-95 flex items-center justify-center gap-3",
              isLoading && "opacity-70 cursor-not-allowed"
            )}
          >
            {isLoading && <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
            {isLoading ? 'Updating...' : 'Change password'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePasswordSection;
