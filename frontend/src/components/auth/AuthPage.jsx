import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  ShoppingBag,
  Sparkles,
  AlertCircle,
  ArrowLeft,
  ShieldCheck,
  Zap,
  BarChart3
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { AuthBackground } from './AuthBackground';

import TextType from '../TextType';

export const AuthPage = ({ initialMode = 'login' }) => {
  const [mode, setMode] = useState(initialMode); // 'login' | 'register'
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

  // AI Status Line Initializing Sequence (0: INITIALIZING... | 1: ONLINE | 2: +METRICS)
  const [statusStage, setStatusStage] = useState(0);

  const from = location.state?.from?.pathname || '/dashboard';

  useEffect(() => {
    setMode(initialMode);
    setError('');
  }, [initialMode]);

  useEffect(() => {
    const timer1 = setTimeout(() => setStatusStage(1), 500);
    const timer2 = setTimeout(() => setStatusStage(2), 1000);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const handleTabSwitch = (targetMode) => {
    setMode(targetMode);
    setError('');
    navigate(targetMode === 'login' ? '/login' : '/register', { replace: true, state: location.state });
  };

  const handleDemoFill = () => {
    setEmail('pal@gmail.com');
    setPassword('demo1234');
    if (mode === 'register') {
      setName('Demo Analyst');
      setConfirmPassword('demo1234');
    }
    setError('');
    addToast('Demo credentials filled!', 'info');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (mode === 'login') {
      if (!email || !password) {
        setError('Please provide both email and password.');
        return;
      }
      try {
        setLoading(true);
        await login(email, password);
        addToast('Welcome back to FlipSentiment!', 'success');
        navigate(from, { replace: true });
      } catch (err) {
        setError(err.message || 'Login failed. Verify credentials.');
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
        await register(name, email, password);
        addToast('Account created successfully!', 'success');
        navigate('/dashboard', { replace: true });
      } catch (err) {
        setError(err.message || 'Registration failed.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col justify-between bg-[#050711] text-slate-100 font-sans overflow-x-hidden selection:bg-[#818CF8]/30 selection:text-white">

      {/* Slow Breathing Ambient Background Visual */}
      <motion.div
        animate={{
          scale: [1, 1.03, 1],
          opacity: [0.9, 0.85, 0.9],
        }}
        transition={{
          duration: 11,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      >
        <AuthBackground className="opacity-40 blur-[2px]" />
      </motion.div>

      {/* Subtle Dark Radial Overlay for High Title Contrast (Darkens wave directly behind title) */}
      <div className="absolute inset-0 pointer-events-none z-[1] bg-[radial-gradient(ellipse_at_75%_48%,rgba(5,7,17,0.35)_0%,rgba(5,7,17,0.78)_52%,rgba(5,7,17,0.96)_100%)]" />

      {/* Top Header */}
      <header className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-[#F8FAFC] text-[#111318] flex items-center justify-center font-bold shadow-sm transition-transform group-hover:scale-105">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-lg text-white tracking-tight">
              FlipSentiment
            </span>
            <span className="text-[10px] tracking-wider text-[#71717A] font-semibold uppercase">
              AI NLP Intelligence
            </span>
          </div>
        </Link>

        <Link
          to="/"
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-white/[0.03] border border-white/[0.08] text-slate-300 hover:text-white hover:border-[#22D3EE]/40 backdrop-blur-md transition-all shadow-sm"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>
      </header>

      {/* Split Auth Section */}
      <main className="relative z-10 flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

          {/* LEFT SIDE: Premium User Form Card Container (Staggered Entrance: 0.2s -> 0.6s) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 w-full max-w-md mx-auto relative"
          >
            {/* Soft Ambient Light Pulse Sweep behind card (Reacts every 6s) */}
            <motion.div
              className="absolute -inset-6 bg-[#22D3EE]/[0.08] blur-[80px] rounded-full pointer-events-none"
              animate={{
                opacity: [0.3, 0.75, 0.3],
                scale: [0.97, 1.03, 0.97],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />

            {/* True Border Beam Wrapper (1px padding creates the border track) */}
            <div className="w-full relative rounded-3xl p-[1px] overflow-hidden shadow-[0_25px_80px_rgba(0,0,0,0.35)] transition-all duration-500 hover:shadow-[0_0_50px_rgba(34,211,238,0.25)]">

              {/* Light Sweep Conic Beam Traveling Around Card Border (6s Sweep Cycle) */}
              <motion.div
                className="absolute -inset-[150%] bg-[conic-gradient(from_0deg,transparent_0_310deg,rgba(34,211,238,0.85)_335deg,rgba(156,67,254,0.85)_360deg)]"
                animate={{ rotate: 360 }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: 'linear'
                }}
              />

              {/* Inner Opaque Dark Card (#0B0D16) - Stable Outer Container */}
              <div className="relative z-10 w-full h-full bg-[#0B0D16] rounded-[23px] p-7 sm:p-9 flex flex-col items-center">

                {/* Inner Form Content (Smooth AnimatePresence Slide/Fade on Mode Change) */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={mode}
                    initial={{ opacity: 0, x: mode === 'register' ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: mode === 'register' ? -20 : 20 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="w-full flex flex-col items-center"
                  >

                    {/* Static Avatar Header Icon */}
                    <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-2xl bg-white/[0.03] border border-white/[0.08] text-[#22D3EE] flex items-center justify-center shadow-sm mb-5 shrink-0">
                      <User className="w-10 h-10 sm:w-11 sm:h-11 stroke-[1.8]" />
                    </div>

                    {/* Form Title & Subtitle */}
                    <div className="w-full text-center mb-5">
                      <h2 className="text-xl font-bold text-white tracking-wide uppercase">
                        {mode === 'login' ? 'Account Login' : 'Create Account'}
                      </h2>
                      <p className="text-xs text-[#71717A] mt-1">
                        {mode === 'login'
                          ? 'Enter your credentials to access NLP analytics'
                          : 'Join FlipSentiment for real-time sentiment predictions'}
                      </p>
                    </div>

                    {/* Input Form Container */}
                    <div className="w-full">
                      {/* Error Alert */}
                      <AnimatePresence>
                        {error && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="w-full mb-4 p-3 rounded-xl bg-rose-950/40 border border-rose-800/80 text-rose-300 text-xs font-medium flex items-center gap-2"
                          >
                            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                            <span>{error}</span>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Input Form */}
                      <form onSubmit={handleSubmit} className="w-full space-y-3.5">

                        {/* Full Name Input (Register Only) */}
                        {mode === 'register' && (
                          <div>
                            <input
                              type="text"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              placeholder="name"
                              required
                              className="w-full px-4 py-3 text-sm rounded-xl bg-[#0F111A] border border-[#252A3A] text-[#F8FAFC] outline-none transition-all placeholder:text-[#71717A] focus:border-[#22D3EE] focus:ring-1 focus:ring-[#22D3EE]/30 font-mono"
                            />
                          </div>
                        )}

                        {/* Email Input */}
                        <div>
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="email"
                            required
                            className="w-full px-4 py-3 text-sm rounded-xl bg-[#0F111A] border border-[#252A3A] text-[#F8FAFC] outline-none transition-all placeholder:text-[#71717A] focus:border-[#22D3EE] focus:ring-1 focus:ring-[#22D3EE]/30 font-mono"
                          />
                        </div>

                        {/* Password Input */}
                        <div>
                          <div className="relative">
                            <input
                              type={showPassword ? 'text' : 'password'}
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              placeholder="password"
                              required
                              className="w-full px-4 py-3 text-sm rounded-xl bg-[#0F111A] border border-[#252A3A] text-[#F8FAFC] outline-none transition-all placeholder:text-[#71717A] focus:border-[#22D3EE] focus:ring-1 focus:ring-[#22D3EE]/30 font-mono pr-16"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#22D3EE] hover:text-white transition-colors cursor-pointer"
                            >
                              {showPassword ? 'Hide' : 'Show'}
                            </button>
                          </div>
                        </div>

                        {/* Confirm Password Input (Register Only) */}
                        {mode === 'register' && (
                          <div>
                            <input
                              type={showPassword ? 'text' : 'password'}
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              placeholder="confirm password"
                              required
                              className="w-full px-4 py-3 text-sm rounded-xl bg-[#0F111A] border border-[#252A3A] text-[#F8FAFC] outline-none transition-all placeholder:text-[#71717A] focus:border-[#22D3EE] focus:ring-1 focus:ring-[#22D3EE]/30 font-mono"
                            />
                          </div>
                        )}

                        {/* Primary Action Button (White background with black text & cyan hover glow) */}
                        <button
                          type="submit"
                          disabled={loading}
                          className="w-full py-3.5 rounded-xl bg-white hover:bg-neutral-200 text-black font-extrabold text-sm uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2 shadow-sm hover:shadow-[0_0_30px_rgba(34,211,238,0.35)] active:scale-[0.99]"
                        >
                          {loading ? (
                            <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <span>{mode === 'login' ? 'LOGIN' : 'SIGN UP'}</span>
                          )}
                        </button>

                        {/* Bottom Options Row */}
                        <div className="pt-2 flex items-center justify-between text-xs text-[#71717A]">
                          {mode === 'login' ? (
                            <>
                              <button
                                type="button"
                                onClick={() => addToast('Password reset link sent to demo account', 'info')}
                                className="hover:text-[#22D3EE] transition-colors cursor-pointer"
                              >
                                Forgot password?
                              </button>

                              <button
                                type="button"
                                onClick={() => handleTabSwitch('register')}
                                className="font-medium hover:text-[#22D3EE] transition-colors cursor-pointer"
                              >
                                Don't have an account?
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                type="button"
                                onClick={() => addToast('Please enter your email to receive recovery instructions', 'info')}
                                className="hover:text-[#22D3EE] transition-colors cursor-pointer"
                              >
                                Need help?
                              </button>

                              <button
                                type="button"
                                onClick={() => handleTabSwitch('login')}
                                className="font-medium hover:text-[#22D3EE] transition-colors cursor-pointer"
                              >
                                Already registered? Log in
                              </button>
                            </>
                          )}
                        </div>
                      </form>

                      {/* Subdued Divider */}
                      <div className="w-full my-4 flex items-center gap-3">
                        <div className="flex-1 h-px bg-white/[0.08]" />
                        <span className="text-[10px] text-[#71717A] font-semibold uppercase">
                          or
                        </span>
                        <div className="flex-1 h-px bg-white/[0.08]" />
                      </div>

                      {/* Google Social SSO Button */}
                      <button
                        type="button"
                        onClick={() => {
                          addToast('Google authentication initialized.', 'info');
                          setTimeout(() => handleDemoFill(), 500);
                        }}
                        className="w-full py-2.5 px-4 rounded-xl bg-[#0F111A] hover:bg-[#151926] border border-[#252A3A] text-[#F8FAFC] text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer hover:border-[#22D3EE]/30"
                      >
                        <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                          <path
                            fill="#4285F4"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          />
                          <path
                            fill="#34A853"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.62z"
                          />
                          <path
                            fill="#EA4335"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                          />
                        </svg>
                        <span>Sign in with Google</span>
                      </button>
                    </div>

                  </motion.div>
                </AnimatePresence>

              </div>
            </div>
          </motion.div>

          {/* RIGHT SIDE: FlipSentiment AI Content (Staggered Entrance: 0.3s -> 0.7s) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="hidden lg:flex lg:col-span-7 flex-col justify-center items-start pl-8 text-left z-10"
          >
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0B0D16]/80 border border-white/[0.12] text-[#E2E8F0] text-xs font-semibold mb-3 backdrop-blur-md shadow-md">
              <ShieldCheck className="w-4 h-4 text-[#22D3EE]" />
              <span>ENTERPRISE NLP REVIEW INTELLIGENCE</span>
            </div>

            {/* AI Status Indicator with Initializing Sequence */}
            <div className="flex items-center gap-3 mb-4 text-xs text-slate-300 font-mono drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              <span className="flex items-center gap-2 font-bold text-slate-200">
                <motion.span
                  className="w-1.5 h-1.5 rounded-full bg-[#22D3EE] shadow-[0_0_10px_rgba(34,211,238,0.9)]"
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                />
                <span>
                  {statusStage === 0
                    ? 'INITIALIZING NLP ENGINE...'
                    : 'NLP ENGINE ONLINE'}
                </span>
              </span>
              {statusStage >= 2 && (
                <>
                  <span className="text-slate-600">•</span>
                  <motion.span
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="font-semibold text-slate-300"
                  >
                    57K+ REVIEWS ANALYZED
                  </motion.span>
                </>
              )}
            </div>

            {/* Main Title Block (High Contrast Pure White & Cyan-Indigo Gradient to pop off background) */}
            <h1 className="font-serif text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight uppercase leading-[0.95] drop-shadow-[0_6px_28px_rgba(5,7,17,0.98)]">
              <span className="text-white">
                FLIP SENTIMENT
              </span>
              <br />
              <span className="bg-gradient-to-r from-white via-[#E8EEFF] to-[#DCE5FF] bg-clip-text text-transparent">
                REVIEW INTELLIGENCE
              </span>
            </h1>

            {/* Project Subtext with TextType Typewriter Effect */}
            <p className="text-sm xl:text-base text-slate-300 mt-5 leading-relaxed max-w-xl font-medium drop-shadow-[0_2px_12px_rgba(5,7,17,0.98)] min-h-[3.5rem]">
              <TextType
                texts={[
                  'Analyze customer reviews, aspect-level sentiments, and product feedback in real-time to make data-driven decisions for your e-commerce brand.',
                  'Empower your business with VADER & BERT sentiment predictions, aspect radar, and automated rating validation.',
                  'Turn raw product feedback into actionable analytics and instant growth insights for your store.'
                ]}
                typingSpeed={40}
                deletingSpeed={25}
                pauseDuration={3000}
                showCursor={true}
                cursorCharacter="|"
                cursorClassName="text-[#22D3EE]"
                cursorStyle={{ color: '#22D3EE', textShadow: '0 0 8px rgba(34, 211, 238, 0.7)' }}
                cursorBlinkDuration={0.7}
              />
            </p>

            {/* Feature Highlights Grid (Sequential Entrance: 0.5s -> 0.6s -> 0.7s) */}
            <div className="grid grid-cols-3 gap-4 mt-8 w-full max-w-xl">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-2xl border border-white/[0.12] bg-[#0B0D16]/90 backdrop-blur-2xl p-5 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-[#22D3EE]/40 hover:shadow-[0_0_25px_rgba(34,211,238,0.18)]"
              >
                <Zap className="w-5 h-5 text-[#22D3EE] mb-2" />
                <span className="block text-xs font-bold text-white">99.4% Precision</span>
                <span className="block text-[10px] text-slate-300 mt-0.5 font-medium">VADER & BERT Ensembles</span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-2xl border border-white/[0.12] bg-[#0B0D16]/90 backdrop-blur-2xl p-5 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-[#22D3EE]/40 hover:shadow-[0_0_25px_rgba(34,211,238,0.18)]"
              >
                <BarChart3 className="w-5 h-5 text-[#22D3EE] mb-2" />
                <span className="block text-xs font-bold text-white">Real-Time NLP</span>
                <span className="block text-[10px] text-slate-300 mt-0.5 font-medium">Instant Review Stream</span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-2xl border border-white/[0.12] bg-[#0B0D16]/90 backdrop-blur-2xl p-5 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-[#A5B4FC]/40 hover:shadow-[0_0_25px_rgba(165,180,252,0.18)]"
              >
                <ShieldCheck className="w-5 h-5 text-[#A5B4FC] mb-2" />
                <span className="block text-xs font-bold text-white">Aspect Radar</span>
                <span className="block text-[10px] text-slate-300 mt-0.5 font-medium">Proactive Sentiment Detection</span>
              </motion.div>
            </div>
          </motion.div>

        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-[#71717A]">
        <p>© {new Date().getFullYear()} FlipSentiment AI. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <Link to="/" className="hover:text-[#22D3EE] transition-colors">Privacy Policy</Link>
          <Link to="/" className="hover:text-[#22D3EE] transition-colors">Terms of Service</Link>
        </div>
      </footer>

    </div>
  );
};



