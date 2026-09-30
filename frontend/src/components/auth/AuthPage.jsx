import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  ShieldCheck,
  Zap,
  BarChart3,
  ArrowRight,
  ArrowLeft,
  Eye,
  EyeOff,
  AlertCircle,
  KeyRound,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { AuthBackground } from './AuthBackground';
import { authService } from '../../services/authService';

export const AuthPage = ({ initialMode = 'login' }) => {
  const [mode, setMode] = useState(initialMode); // 'login' | 'register' | 'forgot-password'
  const { login, register } = useAuth();
  const { addToast } = useNotification();
  const navigate = useNavigate();
  const location = useLocation();

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // OTP Verification States
  const [showOtpStep, setShowOtpStep] = useState(false);
  const [otpCode, setOtpCode] = useState('');

  useEffect(() => {
    setMode(initialMode);
    setError('');
    setShowOtpStep(false);
    setOtpCode('');
  }, [initialMode]);

  const handleTabSwitch = (targetMode) => {
    setMode(targetMode);
    setError('');
    setShowOtpStep(false);
    setOtpCode('');
    if (targetMode === 'login' || targetMode === 'register') {
      navigate(`/${targetMode}`, { replace: true, state: location.state });
    }
  };

  const handleResendOtp = async () => {
    try {
      setLoading(true);
      setError('');
      await authService.sendOtp(email);
      addToast(`New verification code sent to ${email}`, 'success');
    } catch (err) {
      setError(err.message || 'Failed to resend verification code.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (mode === 'login') {
      if (!email || !password) {
        setError('Please enter both email and password.');
        return;
      }
      try {
        setLoading(true);
        const res = await login(email, password);
        addToast('Welcome back to FlipSentiment!', 'success');
        const destination = res?.user?.role === 'admin' ? '/admin' : '/dashboard';
        navigate(destination, { replace: true });
      } catch (err) {
        setError(err.message || 'Authentication failed. Please verify credentials.');
      } finally {
        setLoading(false);
      }

    } else if (mode === 'forgot-password') {
      if (showOtpStep) {
        if (!otpCode || otpCode.trim().length < 6) {
          setError('Please enter the 6-digit reset code sent to your email.');
          return;
        }
        if (!password || password.length < 6) {
          setError('Password must be at least 6 characters long.');
          return;
        }
        if (confirmPassword && password !== confirmPassword) {
          setError('Passwords do not match.');
          return;
        }
        try {
          setLoading(true);
          await authService.resetPassword(email, otpCode.trim(), password);
          addToast('Password reset successfully! Please log in.', 'success');
          setMode('login');
          setShowOtpStep(false);
          setOtpCode('');
          setPassword('');
          setConfirmPassword('');
        } catch (err) {
          setError(err.message || 'Password reset failed.');
        } finally {
          setLoading(false);
        }
      } else {
        if (!email || !email.includes('@')) {
          setError('Please enter a valid email address.');
          return;
        }
        try {
          setLoading(true);
          await authService.forgotPassword(email);
          setShowOtpStep(true);
          addToast(`Password reset code sent to ${email}`, 'info');
        } catch (err) {
          setError(err.message || 'Failed to send reset code.');
        } finally {
          setLoading(false);
        }
      }
    } else {
      // REGISTER MODE
      if (showOtpStep) {
        if (!otpCode || otpCode.trim().length < 6) {
          setError('Please enter the 6-digit verification code.');
          return;
        }
        try {
          setLoading(true);
          await register(name, email, password, otpCode.trim());
          addToast('Account verified and created successfully!', 'success');
          navigate('/dashboard', { replace: true });
        } catch (err) {
          setError(err.message || 'Verification token failed.');
        } finally {
          setLoading(false);
        }
      } else {
        if (!name || !email || !password) {
          setError('Please fill in all required fields.');
          return;
        }
        if (password.length < 6) {
          setError('Password must be at least 6 characters long.');
          return;
        }
        if (confirmPassword && password !== confirmPassword) {
          setError('Passwords do not match.');
          return;
        }
        try {
          setLoading(true);
          await authService.sendOtp(email);
          setShowOtpStep(true);
          addToast(`Verification code sent to ${email}`, 'info');
        } catch (err) {
          setError(err.message || 'Failed to send verification code.');
        } finally {
          setLoading(false);
        }
      }
    }
  };

  // Staggered load entrance animation variants
  const rightColumnVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.09,
        delayChildren: 0.08,
      },
    },
  };

  const itemFadeUpVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.45,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <div className="h-screen max-h-screen w-full relative flex flex-col justify-between bg-[#101415] text-[#e0e3e5] font-['Inter',sans-serif] overflow-y-auto lg:overflow-hidden selection:bg-[#7bd0ff] selection:text-[#00354a]">
      {/* Ambient Cobalt/Cyan Parallax and Grid Drift Background */}
      <AuthBackground />

      {/* Top Header Navigation Bar (Compact Non-Scrollable) */}
      <header className="relative z-20 w-full shrink-0 bg-[#101415]/80 backdrop-blur-xl border-b border-[#272a2c]/60 shadow-[0_1px_12px_rgba(0,0,0,0.2)]">
        <div className="h-14 max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <span className="font-['Plus_Jakarta_Sans',sans-serif] text-lg sm:text-xl font-bold text-[#bec6e0] tracking-tight group-hover:text-white transition-colors">
              FlipSentiment
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-[11px] font-mono font-semibold uppercase tracking-wider text-[#c6c6cd]">
              {mode === 'login' ? 'SECURE SIGN-IN' : mode === 'register' ? 'CREATE ACCOUNT' : 'ACCOUNT RECOVERY'}
            </span>

            <Link
              to="/"
              className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg bg-[#191c1e] hover:bg-[#272a2c] text-[#c6c6cd] hover:text-[#e0e3e5] border border-[#272a2c] hover:border-[#bec6e0]/40 transition-all duration-150"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Home</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Split-Screen Section (Height-optimized to prevent vertical overflow) */}
      <main className="relative z-10 flex-1 min-h-0 w-full max-w-7xl mx-auto px-5 sm:px-8 py-2 sm:py-4 lg:py-6 flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-12">

        {/* Left Column: Electric Cobalt Login Card with Mount Fade/Scale */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="w-full lg:w-[440px] xl:w-[460px] shrink-0 bg-[#1d2022]/75 backdrop-blur-xl p-5 sm:p-6 lg:p-7 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.55)] border border-[#272a2c] relative overflow-hidden my-auto"
        >
          {/* Subtle Top Inner Glow Line */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#bec6e0]/40 to-transparent pointer-events-none" />

          {/* Avatar Icon Header */}
          <div className="flex flex-col items-center mb-3.5">
            <div className="w-11 h-11 rounded-xl bg-[#0f172a] border border-[#272a2c] flex items-center justify-center mb-2 text-[#bec6e0] shadow-inner">
              <User className="w-5 h-5 stroke-[1.8]" />
            </div>

            <h1 className="font-['Plus_Jakarta_Sans',sans-serif] text-xl sm:text-2xl font-bold text-[#e0e3e5] tracking-tight mb-0.5 uppercase text-center">
              {mode === 'login' ? 'WELCOME BACK' : mode === 'register' ? 'CREATE ACCOUNT' : 'RESET PASSWORD'}
            </h1>
            <p className="text-xs text-[#c6c6cd] text-center">
              {mode === 'login'
                ? 'Sign in to access your product intelligence dashboard.'
                : mode === 'register'
                  ? 'Create your account to start analyzing product feedback'
                  : 'Enter your email to receive a password reset code.'}
            </p>
          </div>

          {/* Error Alert */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-3 p-2.5 rounded-lg bg-[#93000a]/20 border border-[#ffb4ab]/30 text-[#ffdad6] text-xs flex items-center gap-2"
              >
                <AlertCircle className="w-4 h-4 text-[#ffb4ab] shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            {mode === 'forgot-password' ? (
              showOtpStep ? (
                /* Step 2: 6-Digit OTP + New Password */
                <div className="space-y-3">
                  <div className="p-2.5 rounded-lg bg-[#0b0f10] border border-[#272a2c] text-xs">
                    <div className="flex items-center gap-1.5 text-[#7bd0ff] font-semibold mb-0.5">
                      <KeyRound className="w-3.5 h-3.5" />
                      <span>Recovery Code Sent</span>
                    </div>
                    <p className="text-[#c6c6cd] text-[11px]">
                      Enter the 6-digit code sent to <strong className="text-white">{email}</strong>.
                    </p>
                  </div>

                  <div className="group/field flex flex-col gap-1 transition-all">
                    <label className="text-[11px] uppercase tracking-wider text-[#c6c6cd] font-semibold font-mono transition-all duration-200 group-focus-within/field:text-[#bec6e0] group-focus-within/field:-translate-y-0.5 group-focus-within/field:text-[10px] group-focus-within/field:tracking-widest">
                      6-Digit Recovery Token
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                      placeholder="000000"
                      required
                      autoFocus
                      className="auth-input-field w-full text-[#e0e3e5] text-center text-lg font-mono tracking-[6px] px-3 py-2 rounded-lg"
                    />
                  </div>

                  <div className="group/field flex flex-col gap-1 transition-all">
                    <label className="text-[11px] uppercase tracking-wider text-[#c6c6cd] font-semibold transition-all duration-200 group-focus-within/field:text-[#bec6e0] group-focus-within/field:-translate-y-0.5 group-focus-within/field:text-[10px] group-focus-within/field:tracking-widest">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        required
                        className="auth-input-field auth-password-input w-full px-3.5 py-2.5 rounded-lg pr-16"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-[#c6c6cd] hover:text-white cursor-pointer px-1 py-1 rounded transition-colors"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        <AnimatePresence mode="wait" initial={false}>
                          <motion.span
                            key={showPassword ? 'hide' : 'show'}
                            initial={{ opacity: 0, scale: 0.85 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.85 }}
                            transition={{ duration: 0.15 }}
                            className="flex items-center gap-1 text-[11px]"
                          >
                            {showPassword ? (
                              <>
                                <EyeOff className="w-3.5 h-3.5 text-[#bec6e0]" />
                                <span>Hide</span>
                              </>
                            ) : (
                              <>
                                <Eye className="w-3.5 h-3.5 text-[#909097] group-hover:text-[#bec6e0]" />
                                <span>Show</span>
                              </>
                            )}
                          </motion.span>
                        </AnimatePresence>
                      </button>
                    </div>
                  </div>

                  <div className="group/field flex flex-col gap-1 transition-all">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      required
                      className="auth-input-field auth-password-input w-full px-3.5 py-2.5 rounded-lg"
                    />
                  </div>

                  {/* Micro-interaction Sign-in / Reset Button */}
                  <button
                    type="submit"
                    disabled={loading || otpCode.length < 6 || !password}
                    className="btn-cta w-full mt-1 bg-[#bec6e0] hover:bg-[#d5dcf2] text-[#283044] font-['Plus_Jakarta_Sans',sans-serif] font-bold text-xs sm:text-sm tracking-wider uppercase py-2.5 rounded-lg transition-all duration-200 shadow-lg hover:shadow-[0_0_24px_rgba(190,198,224,0.45)] hover:scale-[1.02] active:scale-[0.98] active:bg-[#a6afcc] active:shadow-inner flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 select-none group"
                  >
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-[#283044] border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>RESET PASSWORD</span>
                        <ArrowRight className="w-4 h-4 btn-arrow-slide" />
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-between text-[11px] text-[#909097]">
                    <button
                      type="button"
                      onClick={() => setShowOtpStep(false)}
                      className="hover:text-white hover-underline-grow transition-colors cursor-pointer"
                    >
                      ← Change Email
                    </button>
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={loading}
                      className="text-[#7bd0ff] hover-underline-grow font-semibold cursor-pointer"
                    >
                      Resend Code
                    </button>
                  </div>
                </div>
              ) : (
                /* Step 1: Send Reset Token */
                <div className="space-y-3">
                  <div className="group/field flex flex-col gap-1 transition-all">
                    <label className="text-[11px] uppercase tracking-wider text-[#c6c6cd] font-semibold transition-all duration-200 group-focus-within/field:text-[#bec6e0] group-focus-within/field:-translate-y-0.5 group-focus-within/field:text-[10px] group-focus-within/field:tracking-widest">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@company.com"
                      required
                      autoFocus
                      className="auth-input-field w-full text-[#e0e3e5] text-xs sm:text-sm px-3.5 py-2.5 rounded-lg placeholder:text-[#909097]/40"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !email}
                    className="btn-cta w-full mt-1 bg-[#bec6e0] hover:bg-[#d5dcf2] text-[#283044] font-['Plus_Jakarta_Sans',sans-serif] font-bold text-xs sm:text-sm tracking-wider uppercase py-2.5 sm:py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-[0_0_24px_rgba(190,198,224,0.45)] hover:scale-[1.02] active:scale-[0.98] active:bg-[#a6afcc] active:shadow-inner flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 select-none group"
                  >
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-[#283044] border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>SEND RESET CODE</span>
                        <ArrowRight className="w-4 h-4 btn-arrow-slide" />
                      </>
                    )}
                  </button>

                  <div className="text-center text-[11px] pt-0.5">
                    <button
                      type="button"
                      onClick={() => handleTabSwitch('login')}
                      className="text-[#909097] hover:text-white hover-underline-grow transition-colors cursor-pointer"
                    >
                      ← Back to Login
                    </button>
                  </div>
                </div>
              )
            ) : mode === 'register' && showOtpStep ? (
              /* Register Mode: 6-Digit OTP Step */
              <div className="space-y-3">
                <div className="p-2.5 rounded-lg bg-[#0b0f10] border border-[#272a2c] text-xs">
                  <div className="flex items-center gap-1.5 text-[#7bd0ff] font-semibold mb-0.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Verification Code Sent</span>
                  </div>
                  <p className="text-[#c6c6cd] text-[11px]">
                    Enter the 6-digit code sent to <strong className="text-white">{email}</strong>.
                  </p>
                </div>

                <div className="group/field flex flex-col gap-1 transition-all">
                  <label className="text-[11px] uppercase tracking-wider text-[#c6c6cd] font-semibold font-mono transition-all duration-200 group-focus-within/field:text-[#bec6e0] group-focus-within/field:-translate-y-0.5 group-focus-within/field:text-[10px] group-focus-within/field:tracking-widest">
                    6-Digit Verification Code
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="000000"
                    required
                    autoFocus
                    className="auth-input-field w-full text-[#e0e3e5] text-center text-lg font-mono tracking-[6px] px-3.5 py-2.5 rounded-lg"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || otpCode.length < 6}
                  className="btn-cta w-full mt-1 bg-[#bec6e0] hover:bg-[#d5dcf2] text-[#283044] font-['Plus_Jakarta_Sans',sans-serif] font-bold text-xs sm:text-sm tracking-wider uppercase py-2.5 sm:py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-[0_0_24px_rgba(190,198,224,0.45)] hover:scale-[1.02] active:scale-[0.98] active:bg-[#a6afcc] active:shadow-inner flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 select-none group"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-[#283044] border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>VERIFY & COMPLETE REGISTRATION</span>
                      <ArrowRight className="w-4 h-4 btn-arrow-slide" />
                    </>
                  )}
                </button>

                <div className="flex items-center justify-between text-[11px] text-[#909097]">
                  <button
                    type="button"
                    onClick={() => setShowOtpStep(false)}
                    className="hover:text-white hover-underline-grow transition-colors cursor-pointer"
                  >
                    ← Change Details
                  </button>
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={loading}
                    className="text-[#7bd0ff] hover-underline-grow font-semibold cursor-pointer"
                  >
                    Resend Code
                  </button>
                </div>
              </div>
            ) : (
              /* Standard Login / Registration Step 1 */
              <>
                {mode === 'register' && (
                  <div className="group/field flex flex-col gap-1 transition-all">
                    <label className="text-[11px] uppercase tracking-wider text-[#c6c6cd] font-semibold transition-all duration-200 group-focus-within/field:text-[#bec6e0] group-focus-within/field:-translate-y-0.5 group-focus-within/field:text-[10px] group-focus-within/field:tracking-widest">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your full name"
                      required
                      className="auth-input-field w-full text-[#e0e3e5] text-xs sm:text-sm px-3.5 py-2 sm:py-2.5 rounded-lg placeholder:text-[#909097]/40"
                    />
                  </div>
                )}

                <div className="group/field flex flex-col gap-1 transition-all">
                  <label className="text-[11px] uppercase tracking-wider text-[#c6c6cd] font-semibold transition-all duration-200 group-focus-within/field:text-[#bec6e0] group-focus-within/field:-translate-y-0.5 group-focus-within/field:text-[10px] group-focus-within/field:tracking-widest">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    required
                    className="auth-input-field w-full text-[#e0e3e5] text-xs sm:text-sm px-3.5 py-2 sm:py-2.5 rounded-lg placeholder:text-[#909097]/40"
                  />
                </div>

                <div className="group/field flex flex-col gap-1 transition-all">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] uppercase tracking-wider text-[#c6c6cd] font-semibold transition-all duration-200 group-focus-within/field:text-[#bec6e0] group-focus-within/field:-translate-y-0.5 group-focus-within/field:text-[10px] group-focus-within/field:tracking-widest">
                      Password
                    </label>
                    {mode === 'login' && (
                      <button
                        type="button"
                        onClick={() => handleTabSwitch('forgot-password')}
                        className="text-[11px] text-[#bec6e0] hover-underline-grow cursor-pointer transition-colors"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      required
                      className="auth-input-field auth-password-input w-full px-3.5 py-2 sm:py-2.5 rounded-lg pr-16"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-[#c6c6cd] hover:text-white cursor-pointer px-1 py-1 rounded transition-colors"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      <AnimatePresence mode="wait" initial={false}>
                        <motion.span
                          key={showPassword ? 'hide' : 'show'}
                          initial={{ opacity: 0, scale: 0.85 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.85 }}
                          transition={{ duration: 0.15 }}
                          className="flex items-center gap-1 text-[11px]"
                        >
                          {showPassword ? (
                            <>
                              <EyeOff className="w-3.5 h-3.5 text-[#bec6e0]" />
                              <span>Hide</span>
                            </>
                          ) : (
                            <>
                              <Eye className="w-3.5 h-3.5 text-[#909097] group-hover:text-[#bec6e0]" />
                              <span>Show</span>
                            </>
                          )}
                        </motion.span>
                      </AnimatePresence>
                    </button>
                  </div>
                </div>

                {mode === 'register' && (
                  <div className="group/field flex flex-col gap-1 transition-all">
                    <label className="text-[11px] uppercase tracking-wider text-[#c6c6cd] font-semibold transition-all duration-200 group-focus-within/field:text-[#bec6e0] group-focus-within/field:-translate-y-0.5 group-focus-within/field:text-[10px] group-focus-within/field:tracking-widest">
                      Confirm Password
                    </label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••••••"
                      required
                      className="auth-input-field auth-password-input w-full px-3.5 py-2 sm:py-2.5 rounded-lg"
                    />
                  </div>
                )}

                {/* Sign In / Create Account Button with Micro-interactions */}
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-cta w-full mt-1 bg-[#bec6e0] hover:bg-[#d5dcf2] text-[#283044] font-['Plus_Jakarta_Sans',sans-serif] font-bold text-xs sm:text-sm tracking-wider uppercase py-2.5 sm:py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-[0_0_24px_rgba(190,198,224,0.45)] hover:scale-[1.02] active:scale-[0.98] active:bg-[#a6afcc] active:shadow-inner flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 select-none group"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-[#283044] border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>{mode === 'login' ? 'SIGN IN' : 'CREATE ACCOUNT'}</span>
                      <ArrowRight className="w-4 h-4 btn-arrow-slide" />
                    </>
                  )}
                </button>
              </>
            )}
          </form>

          {/* Subdued Divider with Elegant Gradient Fade */}
          {mode !== 'forgot-password' && (
            <>
              <div className="flex items-center my-3.5">
                <div className="flex-grow h-[1px] bg-gradient-to-r from-transparent via-[#45464d]/30 to-[#45464d]/60" />
                <span className="px-3 text-[10px] font-semibold text-[#8f9199] tracking-widest uppercase">
                  OR
                </span>
                <div className="flex-grow h-[1px] bg-gradient-to-l from-transparent via-[#45464d]/30 to-[#45464d]/60" />
              </div>

              {/* Google Social SSO Button with Fast Border Highlight & Hover Lightening */}
              <button
                type="button"
                onClick={() => {
                  addToast('Google SSO is connecting...', 'info');
                }}
                className="w-full bg-[#131719] hover:bg-[#1f2427] text-[#e0e3e5] hover:text-white text-xs font-semibold py-2.5 rounded-lg border border-[#272a2c] hover:border-[#bec6e0]/60 hover:shadow-[0_0_18px_rgba(190,198,224,0.15)] active:scale-[0.99] active:bg-[#0f1214] transition-all duration-150 flex items-center justify-center gap-2.5 cursor-pointer group"
              >
                <svg className="w-4 h-4 shrink-0 transition-transform duration-150 group-hover:scale-105" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    fill="#EA4335"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>

              <div className="mt-3 text-center">
                <p className="text-xs text-[#c6c6cd]">
                  {mode === 'login' ? (
                    <>
                      New to FlipSentiment?{' '}
                      <button
                        type="button"
                        onClick={() => handleTabSwitch('register')}
                        className="text-[#bec6e0] font-semibold hover-underline-grow cursor-pointer transition-colors"
                      >
                        Create an account
                      </button>
                    </>
                  ) : (
                    <>
                      Already registered?{' '}
                      <button
                        type="button"
                        onClick={() => handleTabSwitch('login')}
                        className="text-[#bec6e0] font-semibold hover-underline-grow cursor-pointer transition-colors"
                      >
                        Sign in
                      </button>
                    </>
                  )}
                </p>
              </div>
            </>
          )}
        </motion.div>

        {/* Right Column: Value Proposition & Feature Showcase with Staggered Entrance */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={rightColumnVariants}
          className="flex-1 flex flex-col justify-center select-none my-auto"
        >
          {/* Tagline Badge with Shimmer Gradient Border Sweep */}
          <motion.div variants={itemFadeUpVariants} className="w-fit mb-3">
            <div className="relative p-[1px] rounded-full overflow-hidden group shadow-[0_0_15px_rgba(123,208,255,0.08)]">
              <span className="absolute inset-0 animate-shimmer-border rounded-full" />
              <div className="relative inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0f172a] text-[#bec6e0] text-xs font-semibold backdrop-blur-md">
                <ShieldCheck className="w-3.5 h-3.5 text-[#7bd0ff]" />
                <span>ENTERPRISE NLP REVIEW INTELLIGENCE</span>
              </div>
            </div>
          </motion.div>

          {/* Status Bar with Direct Pulse Loop Beacon (Scale 1 -> 1.3, Opacity 1 -> 0.4, 2s loop) */}
          <motion.div variants={itemFadeUpVariants} className="flex items-center gap-2.5 mb-3 text-xs text-[#c6c6cd] tracking-wider font-mono">
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3 items-center justify-center">
                <motion.span
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [1, 0.4, 1],
                    boxShadow: [
                      '0 0 6px rgba(123, 208, 255, 0.8)',
                      '0 0 16px rgba(123, 208, 255, 1)',
                      '0 0 6px rgba(123, 208, 255, 0.8)',
                    ],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="live-status-dot w-2.5 h-2.5 rounded-full bg-[#7bd0ff] inline-block"
                />
              </span>
              <span className="font-semibold text-[#e0e3e5]">NLP ENGINE ONLINE</span>
            </div>
            <span>•</span>
            <span>57K+ REVIEWS ANALYZED</span>
          </motion.div>

          {/* Main Heading */}
          <motion.h2
            variants={itemFadeUpVariants}
            className="font-['Plus_Jakarta_Sans',sans-serif] text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#e0e3e5] tracking-tight mb-3 leading-[1.05] uppercase"
          >
            FLIP SENTIMENT REVIEW INTELLIGENCE
          </motion.h2>

          {/* Subtext */}
          <motion.p
            variants={itemFadeUpVariants}
            className="text-xs sm:text-sm text-[#c6c6cd] mb-6 max-w-xl leading-relaxed"
          >
            Analyze customer reviews, aspect-level sentiments, and product feedback in real-time to make data-driven decisions for your e-commerce brand.
          </motion.p>

          {/* Feature Grid Cards with Hover Lift (-4px), Soft Glow, Border Brightening & Icon Background Color Shift */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <motion.div
              variants={itemFadeUpVariants}
              className="feature-interactive-card bg-[#1d2022]/40 backdrop-blur-md p-4 sm:p-4.5 rounded-xl border border-[#272a2c] cursor-default group shadow-sm"
            >
              <div className="feature-icon-badge w-8 h-8 rounded-lg bg-[#0f172a] flex items-center justify-center text-[#bec6e0] mb-2.5">
                <Zap className="w-4 h-4" />
              </div>
              <h3 className="font-['Plus_Jakarta_Sans',sans-serif] text-[#e0e3e5] text-sm sm:text-base font-bold mb-0.5">
                99.4% Precision
              </h3>
              <p className="text-[#c6c6cd] text-xs">VADER &amp; BERT Ensembles</p>
            </motion.div>

            <motion.div
              variants={itemFadeUpVariants}
              className="feature-interactive-card bg-[#1d2022]/40 backdrop-blur-md p-4 sm:p-4.5 rounded-xl border border-[#272a2c] cursor-default group shadow-sm"
            >
              <div className="feature-icon-badge w-8 h-8 rounded-lg bg-[#00a6e0]/20 flex items-center justify-center text-[#7bd0ff] mb-2.5">
                <BarChart3 className="w-4 h-4" />
              </div>
              <h3 className="font-['Plus_Jakarta_Sans',sans-serif] text-[#e0e3e5] text-sm sm:text-base font-bold mb-0.5">
                Real-Time NLP
              </h3>
              <p className="text-[#c6c6cd] text-xs">Instant Review Stream</p>
            </motion.div>

            <motion.div
              variants={itemFadeUpVariants}
              className="feature-interactive-card bg-[#1d2022]/40 backdrop-blur-md p-4 sm:p-4.5 rounded-xl border border-[#272a2c] cursor-default group shadow-sm"
            >
              <div className="feature-icon-badge w-8 h-8 rounded-lg bg-[#0f172a] flex items-center justify-center text-[#bec6e0] mb-2.5">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h3 className="font-['Plus_Jakarta_Sans',sans-serif] text-[#e0e3e5] text-sm sm:text-base font-bold mb-0.5">
                Aspect Radar
              </h3>
              <p className="text-[#c6c6cd] text-xs">Proactive Sentiment Detection</p>
            </motion.div>
          </div>
        </motion.div>

      </main>

      {/* Footer (Compact Non-Scrollable) with Enhanced Link Hover Micro-interaction */}
      <footer className="w-full shrink-0 bg-[#101415] border-t border-[#272a2c]/60 py-3.5">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 flex flex-col md:flex-row items-center justify-between gap-2 text-[11px] text-[#909097]">
          <div>© {new Date().getFullYear()} FlipSentiment Global. All rights reserved.</div>
          <div className="flex items-center gap-6">
            <Link to="/" className="footer-link">Privacy Policy</Link>
            <Link to="/" className="footer-link">Terms of Service</Link>
            <Link to="/" className="footer-link">Security</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AuthPage;
