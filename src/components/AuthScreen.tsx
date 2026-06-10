import React, { useState } from 'react';
import { localAuth } from '../lib/localAuth';
import { Sparkles, ShieldCheck, Mail, Lock, User, LogIn, UserPlus, AlertCircle, RefreshCw, Phone, ArrowLeft, CheckCircle, Eye, EyeOff } from 'lucide-react';

// ফাইলটি সরাসরি ইমপোর্ট করুন
import brandLogo from '../assets/images/bdlogo.png';

interface AuthScreenProps {
  onAuthSuccess: () => void;
  triggerToast: (title: string, message: string) => void;
}

export default function AuthScreen({ onAuthSuccess, triggerToast }: AuthScreenProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [isResetMode, setIsResetMode] = useState(false);
  
  // Registration & General State
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  // Reset password state
  const [resetIdentifier, setResetIdentifier] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Password visibility states
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      // Simulate database handshake latency
      await new Promise(resolve => setTimeout(resolve, 800));

      if (isResetMode) {
        await localAuth.resetPassword(resetIdentifier, newPassword);
        triggerToast('Password Changed (পাসওয়ার্ড সম্পন্ন)', 'পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে। নতুন পাসওয়ার্ড দিয়ে প্রবেশ করুন।');
        setSuccessMessage('পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে! নতুন পাসওয়ার্ড দিয়ে নিচে লগইন করুন।');
        
        // Populate fields for easy login
        setEmail(resetIdentifier);
        setPassword(newPassword);
        setIsResetMode(false);
        setIsLogin(true);
      } else if (isLogin) {
        const user = await localAuth.login(email, password);
        triggerToast('Welcome Back (স্বাগতম)', `Logged in securely as ${user.displayName}.`);
        onAuthSuccess();
      } else {
        const user = await localAuth.register(email, phone, name, password);
        triggerToast('Account Registered (নিবন্ধন সম্পন্ন)', `Profile allocated for ${user.displayName}!`);
        onAuthSuccess();
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'An authentication error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const randId = Math.floor(100 + Math.random() * 900);
      const user = await localAuth.register(`google-user-${randId}@gmail.com`, `01711${randId}000`, 'গুগল সিটিজেন গেস্ট', 'google_guest_pass');
      triggerToast('Google Authorized (গুগল কানেকশন)', `Signed in as ${user.displayName}`);
      onAuthSuccess();
    } catch (err: any) {
      try {
        const user = await localAuth.login('google-citizen-demo@gmail.com', 'google_guest_pass');
        triggerToast('Google Authorized (গুগল কানেকশন)', `Welcome back, ${user.displayName}`);
        onAuthSuccess();
      } catch (innerErr: any) {
        setErrorMessage('Standard email/password/phone registration is recommended for local sandbox.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-purple-100 via-pink-50 to-purple-50 flex items-center justify-center p-3 sm:p-4 relative antialiased font-sans overflow-hidden">
      {/* Absolute Dynamic Grid & Nebula Atmosphere */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#7c3aed05_1px,transparent_1px),linear-gradient(to_bottom,#7c3aed05_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none"></div>
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-300/20 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-pink-300/20 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>

      <div className="w-full max-w-md bg-white/90 backdrop-blur-xl border border-purple-100/80 rounded-[2rem] shadow-[0_20px_50px_-15px_rgba(124,58,237,0.12)] p-5 sm:p-6 space-y-4 relative z-10 transition-all duration-300">
        
        {/* National Emblem Visual Accent */}
        <div className="flex justify-center items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
          <div className="text-[9px] font-mono font-black text-purple-600 tracking-[0.25em] uppercase">Gov Cloud Gateway</div>
        </div>

        {/* Dynamic App Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-1 bg-white rounded-xl border border-slate-150 shadow-3xs hover:scale-105 duration-300 transition-all mx-auto relative group">
            <div className="relative">
              <img 
                src={brandLogo} 
                alt="নাগরিক সেবা লোগো" 
                className="h-12 sm:h-14 w-auto object-contain rounded-lg select-none"
                referrerPolicy="no-referrer"
              />
              {/* Visual national flag dot badge */}
              <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-600 rounded-full border-2 border-white flex items-center justify-center">
                <span className="w-1 h-1 bg-rose-500 rounded-full animate-pulse" />
              </span>
            </div>
          </div>

          <div className="space-y-0.5">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-none">
              {isResetMode ? 'পাসওয়ার্ড পরিবর্তন' : isLogin ? 'বিডি সেবা পোর্টাল' : 'নতুন একাউন্ট তৈরি'}
            </h2>
            <p className="text-[10px] sm:text-xs font-bold text-slate-500">
              {isResetMode ? 'Citizen Directory Password Recovery Desk' : 'Government Cloud Citizenship Suite'}
            </p>
          </div>
        </div>

        {/* Embedded Segmented Selector Tabs (Only when not in Reset Mode) */}
        {!isResetMode && (
          <div className="flex gap-1 bg-purple-50/50 p-1 rounded-2xl border border-purple-100/80">
            <button
              onClick={() => {
                setIsLogin(true);
                setErrorMessage('');
                setSuccessMessage('');
              }}
              type="button"
              className={`flex-1 py-2 rounded-xl text-xs font-extrabold tracking-wide transition-all duration-300 cursor-pointer ${
                isLogin
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-[0_4px_12px_rgba(124,58,237,0.15)]'
                  : 'text-purple-800/70 hover:text-purple-950 hover:bg-white/50'
              }`}
            >
              প্রবেশ (Login)
            </button>
            <button
              onClick={() => {
                setIsLogin(false);
                setErrorMessage('');
                setSuccessMessage('');
              }}
              type="button"
              className={`flex-1 py-2 rounded-xl text-xs font-extrabold tracking-wide transition-all duration-300 cursor-pointer ${
                !isLogin
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-[0_4px_12px_rgba(124,58,237,0.15)]'
                  : 'text-purple-800/70 hover:text-purple-950 hover:bg-white/50'
              }`}
            >
              নিবন্ধন (Register)
            </button>
          </div>
        )}

        {/* Live System Feedback Prompts */}
        {errorMessage && (
          <div className="p-2.5 bg-red-50 border border-red-200 rounded-2xl text-[10.5px] text-red-800 flex items-start gap-2 font-semibold leading-relaxed shadow-3xs animate-fade-in">
            <AlertCircle className="shrink-0 text-red-600 mt-0.5" size={14} />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-[10.5px] text-emerald-850 flex items-start gap-2 font-semibold leading-relaxed shadow-3xs animate-fade-in">
            <CheckCircle className="shrink-0 text-emerald-600 mt-0.5" size={14} />
            <span>{successMessage}</span>
          </div>
        )}

        {/* 1. RESET PASSWORD MODE */}
        {isResetMode ? (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-1">
              <label className="text-[9.5px] font-extrabold text-purple-900/75 uppercase tracking-widest block pl-1">Email or Phone / ইমেইল অথবা মোবাইল</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-400" size={14} />
                <input
                  type="text"
                  required
                  placeholder="যেমন: citizen@gov.bd অথবা 017XXXXXXXX"
                  value={resetIdentifier}
                  onChange={(e) => setResetIdentifier(e.target.value)}
                  className="w-full bg-purple-50/20 border border-purple-100 rounded-xl py-2.5 pl-10 pr-4 text-xs font-semibold text-purple-950 placeholder-purple-300 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all font-sans"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[9.5px] font-extrabold text-purple-900/75 uppercase tracking-widest block pl-1">New Password / নতুন পাসওয়ার্ড</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-400" size={14} />
                <input
                  type={showNewPassword ? "text" : "password"}
                  required
                  minLength={6}
                  placeholder="অন্তত ০৬ ডিজিটের পাসওয়ার্ড"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-purple-50/20 border border-purple-100 rounded-xl py-2.5 pl-10 pr-10 text-xs font-semibold text-purple-950 placeholder-purple-300 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all font-sans"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-purple-600 hover:text-purple-800 hover:bg-purple-100/80 rounded-lg transition-all active:scale-90 focus:outline-none flex items-center justify-center"
                  title={showNewPassword ? "পাসওয়ার্ড লুকান" : "পাসওয়ার্ড দেখান"}
                >
                  {showNewPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="w-4.5 h-4.5 text-purple-600"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.25"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" fill="none" />
                      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" fill="none" />
                      <path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" fill="none" />
                      <line x1="2" y1="2" x2="22" y2="22" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="w-4.5 h-4.5 text-purple-600"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.25"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" fill="none" />
                      <circle cx="12" cy="12" r="3" fill="none" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2.5 py-2.5 bg-gradient-to-r from-purple-600 via-indigo-650 to-pink-500 hover:scale-[1.01] hover:-translate-y-0.5 active:scale-[0.99] hover:shadow-[0_4px_20px_rgba(124,58,237,0.3)] text-white text-xs font-black rounded-xl shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2 animate-pulse">
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span className="font-extrabold tracking-wide text-[11px] text-white/95">Updating Security Node / পাসওয়ার্ড সেট হচ্ছে...</span>
                </div>
              ) : (
                <>
                  <Lock size={13} />
                  <span>Update Password / পাসওয়ার্ড সেট করুন</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setIsResetMode(false);
                setIsLogin(true);
                setErrorMessage('');
              }}
              className="w-full py-2 border border-purple-150 hover:bg-purple-50 text-purple-900 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <ArrowLeft size={13} />
              <span>Back to Login / লগইন এ ফিরে যান</span>
            </button>
          </form>
        ) : (
          /* 2. REGULAR LOGIN / REGISTER FORM */
          <form onSubmit={handleSubmit} className="space-y-3">
            {!isLogin && (
              <>
                <div className="space-y-1">
                  <label className="text-[9.5px] font-extrabold text-purple-900/75 uppercase tracking-widest block pl-1">Full Name / পূর্ণ নাম</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-400" size={14} />
                    <input
                      type="text"
                      required
                      placeholder="যেমন: আসিফুল ইসলাম রাফি"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-purple-50/20 border border-purple-100 rounded-xl py-2.5 pl-10 pr-4 text-xs font-semibold text-purple-950 placeholder-purple-300 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all font-sans"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[9.5px] font-extrabold text-purple-900/75 uppercase tracking-widest block pl-1">Phone Number / মোবাইল নম্বর</label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-400" size={14} />
                    <input
                      type="tel"
                      required
                      placeholder="যেমন: 017XXXXXXXX"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-purple-50/20 border border-purple-100 rounded-xl py-2.5 pl-10 pr-4 text-xs font-semibold text-purple-950 placeholder-purple-300 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all font-mono"
                    />
                  </div>
                </div>
              </>
            )}

            <div className="space-y-1">
              <label className="text-[9.5px] font-extrabold text-purple-900/75 uppercase tracking-widest block pl-1">
                {isLogin ? 'Email or Phone / ইমেইল অথবা মোবাইল' : 'Email Address / ইমেইল অ্যাড্রেস'}
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-400" size={14} />
                <input
                  type={isLogin ? "text" : "email"}
                  required
                  placeholder={isLogin ? "citizen@example.com বা মোবাইল নম্বর" : "citizen@example.com"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-purple-50/20 border border-purple-100 rounded-xl py-2.5 pl-10 pr-4 text-xs font-semibold text-purple-950 placeholder-purple-300 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all font-sans"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center px-1">
                <label className="text-[9.5px] font-extrabold text-purple-900/75 uppercase tracking-widest block">Password / পাসওয়ার্ড</label>
                {isLogin && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsResetMode(true);
                      setResetIdentifier(email);
                      setErrorMessage('');
                    }}
                    className="text-[9.5px] font-extrabold text-purple-600 hover:text-purple-850 transition-colors"
                  >
                    Forgot Password? / পাসওয়ার্ড পুনরুদ্ধার
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-400" size={14} />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  placeholder="০৬ ডিজিটের পাসওয়ার্ড"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-purple-50/20 border border-purple-100 rounded-xl py-2.5 pl-10 pr-10 text-xs font-semibold text-purple-950 placeholder-purple-300 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-purple-600 hover:text-purple-800 hover:bg-purple-100/80 rounded-lg transition-all active:scale-90 focus:outline-none flex items-center justify-center"
                  title={showPassword ? "পাসওয়ার্ড লুকান" : "পাসওয়ার্ড দেখান"}
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="w-4.5 h-4.5 text-purple-600"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.25"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" fill="none" />
                      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" fill="none" />
                      <path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" fill="none" />
                      <line x1="2" y1="2" x2="22" y2="22" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="w-4.5 h-4.5 text-purple-600"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.25"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" fill="none" />
                      <circle cx="12" cy="12" r="3" fill="none" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2.5 py-2.5 bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-500 hover:scale-[1.01] hover:-translate-y-0.5 active:scale-[0.99] hover:shadow-[0_4px_20px_rgba(124,58,237,0.3)] text-white text-xs font-black rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2 animate-pulse">
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span className="font-extrabold tracking-wide text-[11px] text-white/95">
                    {isLogin ? "Verifying Credentials / পোর্টালে প্রবেশ করা হচ্ছে..." : "Allocating Secure Citizen Node / নিবন্ধন করা হচ্ছে..."}
                  </span>
                </div>
              ) : isLogin ? (
                <>
                  <LogIn size={13} />
                  <span>Account Login / পোর্টালে প্রবেশ করুন</span>
                </>
              ) : (
                <>
                  <UserPlus size={13} />
                  <span>Register Account / নতুন অ্যাকাউন্ট নিবন্ধন</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* Dynamic Decorative Visual Divider */}
        {!isResetMode && (
          <>
            <div className="relative flex py-0.5 items-center">
              <div className="flex-grow border-t border-purple-100"></div>
              <span className="flex-shrink mx-3 text-[8.5px] text-purple-400 uppercase tracking-widest font-mono font-extrabold font-sans">Citizen OAuth Handshake</span>
              <div className="flex-grow border-t border-purple-100"></div>
            </div>

            {/* Google Authentication Trigger */}
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full py-2 bg-white hover:bg-purple-50/50 border border-purple-200 text-purple-950 font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-xs active:scale-[0.98] transition-all cursor-pointer disabled:opacity-60"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2 animate-pulse">
                  <div className="w-3.5 h-3.5 border-2 border-purple-300/60 border-t-purple-600 rounded-full animate-spin" />
                  <span className="text-purple-900 font-extrabold text-[11px]">Connecting Google Gateway / কানেক্ট হচ্ছে...</span>
                </div>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.87-2.6-1.12-4.13.81-6.63z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  <span>Connect Local Google Gateway / গুগল কানেক্ট</span>
                </>
              )}
            </button>
          </>
        )}

        {/* Bottom Platform Trust Seal */}
        <div className="p-2.5 bg-purple-50 hover:bg-purple-100/50 rounded-2xl flex gap-2.5 border border-purple-100 transition-all">
          <ShieldCheck className="text-purple-600 shrink-0 mt-0.5" size={15} />
          <div className="text-[9.5px] text-purple-900/80 leading-relaxed">
            <span className="font-extrabold text-purple-900">Bangladesh Gov Cloud Node:</span> This portal executes database synchronization securely. All history is stored encrypted.
          </div>
        </div>

      </div>
    </div>
  );
}
