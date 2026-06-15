import React, { useState } from 'react';
import Breadcrumb from './Breadcrumb';
import { useUser } from '../../context/UserContext';

const SecurityView = ({ view, setView }) => {
  const { user, updateUser } = useUser();
  const [activeSecurityTab, setActiveSecurityTab] = useState('change-password');
  
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChangePassword = async () => {
    setError('');
    setSuccess('');

    // Step 1: Frontend validations
    if (!oldPassword || !newPassword || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    setIsLoading(true);
    try {
      // Call backend API — backend verifies old password using bcrypt
      const response = await fetch(`http://localhost:5000/api/auth/change-password/${user._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldPassword, newPassword })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Update context so future sessions reflect new password
        updateUser({ password: newPassword });
        setSuccess('Password changed successfully! Your account is now secure.');
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        // Backend returned error (e.g. wrong old password)
        setError(data.message || 'Failed to change password.');
      }
    } catch (err) {
      // Network/server error — do NOT update password
      setError('Cannot connect to server. Please make sure the server is running and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
  <div className="animate-fade-in max-w-6xl mx-auto pb-20">
    <Breadcrumb current="Password & Security" setView={setView} />
    <div className="flex flex-col lg:flex-row gap-12">
      <div className="w-full lg:w-80 space-y-6">
        <div className="bg-white rounded-[2rem] border border-gray-50 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-gray-50"><h3 className="text-xl font-bold text-gray-900 mb-6 font-serif">Password & Security</h3><p className="text-xs text-gray-400 leading-relaxed">Manage your passwords, login preferences and recovery methods.</p></div>
          <div className="flex flex-col">
            <button onClick={() => setActiveSecurityTab('change-password')} className={`w-full text-left p-6 flex items-center justify-between transition-colors ${activeSecurityTab === 'change-password' ? 'bg-purple-50/50 text-purple-600' : 'hover:bg-gray-25'}`}>
              <div className="flex items-center gap-4"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/></svg><span className="text-sm font-bold">Change password</span></div>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
            </button>
            <button onClick={() => setActiveSecurityTab('2fa')} className={`w-full text-left p-6 flex items-center justify-between transition-colors border-t border-gray-50 ${activeSecurityTab === '2fa' ? 'bg-purple-50/50 text-purple-600' : 'hover:bg-gray-25'}`}>
              <div className="flex items-center gap-4"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg><span className="text-sm font-bold">Two-factor authentication</span></div>
              <div className="flex items-center gap-3"><span className="bg-emerald-50 text-emerald-600 text-[10px] font-bold px-2 py-0.5 rounded-lg uppercase">Enabled</span><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg></div>
            </button>
          </div>
        </div>
        <div className="bg-white rounded-[2rem] p-8 border border-gray-50 shadow-sm flex items-center justify-between"><span className="text-sm font-bold text-gray-700">Save login information</span><button className="w-11 h-6 rounded-full relative transition-colors bg-purple-900"><div className="w-4 h-4 rounded-full bg-white absolute top-1 right-1 shadow-sm"></div></button></div>
      </div>
      <div className="flex-1">
        {activeSecurityTab === 'change-password' ? (
          <div className="bg-white rounded-[2.5rem] p-12 border border-gray-50 shadow-sm animate-scale-in">
            <h3 className="text-3xl font-bold text-gray-900 mb-10 font-serif">Change password</h3>
            <div className="bg-amber-50 border-l-4 border-amber-400 p-6 rounded-r-2xl flex items-start gap-5 mb-10"><div className="text-amber-600 pt-0.5"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg></div><p className="text-xs text-amber-900 font-medium leading-relaxed">You’ll be logged out of all sessions except this one to protect your account if anyone is trying to gain access.</p></div>
            <div className="space-y-8">
              <p className="text-xs text-gray-400 max-w-md leading-relaxed">Your password must be at least 8 characters and should include a combination of numbers, letters and special characters (!@#%).</p>
              
              {error && <div className="p-4 bg-red-50 text-red-600 border border-red-100 rounded-xl text-sm font-medium">{error}</div>}
              {success && <div className="p-4 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl text-sm font-medium">{success}</div>}

              <div className="space-y-6 max-w-lg">
                <div className="relative"><input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} placeholder="Current password" className="w-full px-6 py-4 bg-gray-25 border border-gray-100 rounded-2xl text-sm focus:ring-1 focus:ring-purple-200 outline-none transition-all" /><button className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg></button></div>
                <div className="relative"><input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="New password" className="w-full px-6 py-4 bg-gray-25 border border-gray-100 rounded-2xl text-sm focus:ring-1 focus:ring-purple-200 outline-none transition-all" /><button className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg></button></div>
                <div className="relative"><input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Re-type new password" className="w-full px-6 py-4 bg-gray-25 border border-gray-100 rounded-2xl text-sm focus:ring-1 focus:ring-purple-200 outline-none transition-all" /><button className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg></button></div>
              </div>
              <button className="text-xs font-bold text-purple-600 hover:text-purple-800 transition-colors">Forgot your password?</button>
              <div className="pt-4"><button onClick={handleChangePassword} disabled={isLoading} className="w-full max-w-lg py-5 bg-gradient-to-r from-purple-700 to-purple-500 text-white rounded-[2rem] font-bold text-sm shadow-xl shadow-purple-200 hover:-translate-y-1 transition-all disabled:opacity-50 disabled:hover:translate-y-0">{isLoading ? 'Changing password...' : 'Change password'}</button></div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-[2.5rem] p-12 border border-gray-50 shadow-sm animate-scale-in flex flex-col min-h-[500px]">
             {view === '2fa-confirm' ? (
               <div className="animate-fade-in flex flex-col flex-1"><h3 className="text-3xl font-bold text-gray-900 mb-10 font-serif">Enter confirmation code</h3><p className="text-xs text-gray-400 max-w-md leading-relaxed mb-12">Enter the 6-digit code we sent to (xxx) xxx-xx98. It may take up to a minute for you to receive this code.</p><div className="flex gap-4 mb-12">{[1,2,3,4,5,6].map(i => (<input key={i} type="text" maxLength={1} className="w-14 h-20 text-center text-3xl font-bold bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-200 outline-none uppercase" />))}</div><p className="text-xs font-bold text-gray-800 mb-12"><span className="text-purple-600 cursor-pointer">Resend code.</span> <span className="text-gray-400">(Resend in 0:43)</span></p><div className="mt-auto"><button onClick={() => setView('main')} className="w-full max-w-lg py-5 bg-gradient-to-r from-purple-700 to-purple-500 text-white rounded-[2rem] font-bold text-sm shadow-xl shadow-purple-200 hover:-translate-y-1 transition-all">Save</button></div></div>
             ) : (
               <div className="animate-fade-in flex flex-col flex-1"><h3 className="text-3xl font-bold text-gray-900 mb-10 font-serif">2FA – Authentication</h3><p className="text-xs text-gray-400 max-w-md leading-relaxed mb-12">Two-factor authentication protects your account by requiring an additional code when you log in on a device we don’t recognize.</p><div className="space-y-6 max-w-lg"><div className="p-8 bg-gray-25 border-2 border-purple-100 rounded-3xl flex items-center justify-between cursor-pointer hover:bg-purple-25"><div className="space-y-1"><h4 className="text-sm font-bold text-gray-900 leading-none">Text message (SMS)</h4><p className="text-[10px] text-gray-400 font-bold tracking-tight">We'll send a code to the number you choose.</p></div><div className="w-5 h-5 rounded-full border-4 border-purple-600 flex items-center justify-center p-0.5"><div className="w-full h-full bg-purple-600 rounded-full"></div></div></div><div className="p-8 bg-white border border-gray-100 rounded-3xl flex items-center justify-between opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer"><div className="space-y-1"><h4 className="text-sm font-bold text-gray-900 leading-none">Authenticator App</h4><p className="text-[10px] text-gray-400 font-bold tracking-tight">Use Google Authenticator or similar.</p></div><div className="w-5 h-5 rounded-full border border-gray-200"></div></div></div><div className="mt-auto pt-16"><button onClick={() => setView('2fa-confirm')} className="w-full max-w-lg py-5 bg-gradient-to-r from-purple-700 to-purple-500 text-white rounded-[2rem] font-bold text-sm shadow-xl shadow-purple-200 hover:-translate-y-1 transition-all">Next</button></div></div>
             )}
          </div>
        )}
      </div>
    </div>
  </div>
)};

export default SecurityView;
