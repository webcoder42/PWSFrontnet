import React, { useState } from 'react';
import pswPlusLogo from '../assets/PSW+ Logo.png';
import { loginAdminAPI } from '../utils/api';
import { persistAdminSession } from '../utils/sessionStorage';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await loginAdminAPI(email.trim(), password);
      const user = result.data;

      if (user?.role !== 'admin') {
        throw new Error('This account does not have admin access.');
      }

      persistAdminSession(user, result.token);
      onLogin(user);
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col justify-center items-center p-6 font-sans">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <img src={pswPlusLogo} className="h-12 mx-auto mb-6 object-contain" alt="PSW+" />
          <h2 className="text-3xl font-bold text-gray-900 mb-2 font-serif">Welcome Back</h2>
          <p className="text-gray-400 text-sm font-medium tracking-tight">Enter your credentials to access the console.</p>
        </div>

        <div className="bg-white rounded-[2.5rem] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-gray-50 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50/50 rounded-bl-[100%] opacity-50"></div>

          <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
            {error && (
              <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-xs font-bold">
                {error}
              </div>
            )}

            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-1 focus:ring-purple-200 outline-none transition-all font-bold text-sm"
                placeholder="admin@pswplus.com"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-1 focus:ring-purple-200 outline-none transition-all font-bold text-sm"
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded-md border-gray-200 text-purple-600 focus:ring-purple-500" />
                <span className="text-xs font-bold text-gray-500 group-hover:text-gray-700 transition-colors">Remember me</span>
              </label>
              <button type="button" className="text-xs font-bold text-purple-600 hover:underline">Forgot password?</button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-5 bg-gradient-to-r from-[#5915BD] to-[#7C3AED] text-white rounded-2xl font-bold text-sm shadow-xl shadow-purple-100 hover:shadow-purple-200 transition-all hover:-translate-y-1 transform active:scale-[0.98] uppercase tracking-widest flex items-center justify-center gap-2 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : 'Sign In'}
            </button>
          </form>
        </div>

        <p className="text-center mt-10 text-xs text-gray-400 font-medium">
          Protected by TechTide Security Infrastructure. <br />
          <span className="text-purple-600 font-bold hover:underline cursor-pointer">Support Center</span>
        </p>
      </div>
    </div>
  );
};

export default Login;
