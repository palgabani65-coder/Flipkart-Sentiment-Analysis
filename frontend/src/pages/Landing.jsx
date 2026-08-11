import React, { useState, useEffect, useRef, useCallback, lazy, Suspense, memo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LazyMotion, domAnimation, m, useInView, useReducedMotion } from 'framer-motion';
import {
  Sparkles,
  ShoppingBag,
  BrainCircuit,
  BarChart3,
  ShieldCheck,
  ArrowRight,
  MessageSquare,
  CheckCircle2,
  Layers,
  Star,
  Search,
  History as HistoryIcon,
  Lock,
  TrendingUp,
  Sun,
  Moon,
  ChevronRight,
  ChevronLeft,
  Target,
  Zap,
  Award,
  Users,
  Menu,
  X,
  Globe
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { predictionService } from '../services/predictionService';
import { SentimentBadge } from '../components/common/SentimentBadge';
import { TypewriterEffect } from '../components/TypewriterEffect';
import { CountUp } from '../components/CountUp';

const Orb = lazy(() => import('@/components/Orb'));
const MagicRings = lazy(() => import('@/components/MagicRings'));
const LogoLoop = lazy(() => import('@/components/LogoLoop'));
const MagicBento = lazy(() => import('@/components/MagicBento'));
const CursorGrid = lazy(() => import('@/components/CursorGrid'));
const AnimatedList = lazy(() => import('@/components/AnimatedList'));
const InfiniteMovingCards = lazy(() => import('@/components/InfiniteMovingCards'));
import {
  SiReact,
  SiVite,
  SiTailwindcss,
  SiFramer,
  SiReactrouter,
  SiAxios,
  SiFastapi,
  SiPython,
  SiScikitlearn,
  SiPandas,
  SiNumpy
} from 'react-icons/si';

const techLogos = [
  {
    name: "React.js",
    category: "Frontend UI Framework",
    description: "Powers our component-driven interactive dashboard and reactive single-page interface.",
    node: <SiReact className="text-cyan-400" />,
    href: "https://react.dev"
  },
  {
    name: "Vite",
    category: "Frontend Build Tool",
    description: "Next-generation frontend tooling providing instant hot-module replacement and ultra-fast production builds.",
    node: <SiVite className="text-purple-400" />,
    href: "https://vitejs.dev"
  },
  {
    name: "Tailwind CSS",
    category: "Styling & Design System",
    description: "Utility-first CSS framework enabling our custom dark-mode design system and responsive layout utilities.",
    node: <SiTailwindcss className="text-cyan-300" />,
    href: "https://tailwindcss.com"
  },
  {
    name: "Framer Motion",
    category: "Animation Library",
    description: "Production-ready animation engine for smooth page transitions, interactive cards, and micro-interactions.",
    node: <SiFramer className="text-pink-400" />,
    href: "https://www.framer.com/motion/"
  },
  {
    name: "React Router",
    category: "Client Navigation",
    description: "Handles seamless client-side routing between Landing, Dashboard, History, and Predictor views.",
    node: <SiReactrouter className="text-rose-400" />,
    href: "https://reactrouter.com"
  },
  {
    name: "Axios",
    category: "HTTP API Client",
    description: "Promise-based HTTP client managing real-time API communications between frontend and NLP backend services.",
    node: <SiAxios className="text-purple-300" />,
    href: "https://axios-http.com"
  },
  {
    name: "FastAPI",
    category: "Backend API Framework",
    description: "High-performance Python web framework delivering sub-50ms machine learning inference endpoints.",
    node: <SiFastapi className="text-emerald-400" />,
    href: "https://fastapi.tiangolo.com"
  },
  {
    name: "Python",
    category: "Core Language & NLP",
    description: "Drives our Natural Language Processing, text preprocessing, feature extraction, and ML classification pipeline.",
    node: <SiPython className="text-yellow-400" />,
    href: "https://www.python.org"
  },
  {
    name: "Scikit-Learn",
    category: "Machine Learning Classifier",
    description: "Trained classification algorithms evaluating review text semantics and outputting sentiment confidence scores.",
    node: <SiScikitlearn className="text-orange-400" />,
    href: "https://scikit-learn.org"
  },
  {
    name: "Pandas",
    category: "Data Analysis Engine",
    description: "Processes structured review datasets, category benchmarks, and historical sentiment aggregations.",
    node: <SiPandas className="text-indigo-300" />,
    href: "https://pandas.pydata.org"
  },
  {
    name: "NumPy",
    category: "Numerical Computation",
    description: "Accelerates high-dimensional vector calculations, matrix operations, and array-based text embeddings.",
    node: <SiNumpy className="text-blue-400" />,
    href: "https://numpy.org"
  }
];

const featureListItems = [
  {
    title: 'AI Sentiment Classification',
    badge: 'Sub-50ms Inference',
    description: 'Classifies unformatted customer review text into Positive, Neutral, or Negative sentiments with instant confidence probability scoring.',
    icon: BrainCircuit,
  },
  {
    title: 'Aspect-Level Breakdown',
    badge: 'Aspect Extraction',
    description: 'Extracts distinct feedback sentiment per product feature—evaluating battery life, camera quality, heating, and customer service separately.',
    icon: BarChart3,
  },
  {
    title: 'Product Catalog Explorer',
    badge: 'Catalog Search',
    description: 'Search Flipkart product listings, filter by price and category, and explore aggregated sentiment ratings across catalog items.',
    icon: Search,
  },
  {
    title: 'Sentiment vs Rating Analysis',
    badge: 'Rating Alignment',
    description: 'Compares numerical 1-5 star ratings against true textual NLP sentiment to catch hidden complaints in high-rated reviews.',
    icon: TrendingUp,
  },
  {
    title: 'Analyst History & Data Export',
    badge: 'Batch Export',
    description: 'Review complete historical prediction logs, filter by sentiment polarity, and export results in clean CSV or JSON formats.',
    icon: HistoryIcon,
  },
  {
    title: 'Secure Analyst Accounts',
    badge: 'JWT Protected',
    description: 'JWT-backed token authentication ensuring user custom predictions, workspace settings, and analyst logs remain strictly private.',
    icon: Lock,
  },
];

const faqItems = [
  {
    question: "1. What is FlipSentiment?",
    answer: "FlipSentiment is an AI-powered platform that analyzes Flipkart product reviews and classifies them into Positive, Neutral, or Negative sentiments to help users make informed purchasing decisions."
  },
  {
    question: "2. How does sentiment analysis work?",
    answer: "Our machine learning model processes customer reviews using Natural Language Processing (NLP) to understand emotions, opinions, and confidence scores expressed in the text."
  },
  {
    question: "3. Can I analyze my own reviews?",
    answer: "Yes. Simply paste a review snippet into our sandbox or upload a CSV file containing multiple reviews, and FlipSentiment will generate instant sentiment predictions."
  },
  {
    question: "4. What sentiment categories are supported?",
    answer: "The platform classifies reviews into 😊 Positive, 😐 Neutral, and ☹️ Negative with aspect breakdown scores."
  },
  {
    question: "5. Does FlipSentiment provide visual analytics?",
    answer: "Yes. Interactive charts, sentiment distribution summaries, and trend analysis help you understand customer feedback at a glance."
  },
  {
    question: "6. Is the analysis performed in real time?",
    answer: "Yes. Individual review predictions process in sub-50ms, while CSV batch files are analyzed in a few seconds."
  },
  {
    question: "7. How accurate are the predictions?",
    answer: "Our model is trained on thousands of Flipkart product reviews and optimized to achieve 98.4% precision accuracy."
  },
  {
    question: "8. What file formats can I upload?",
    answer: "Currently, FlipSentiment supports CSV files containing customer review datasets for batch sentiment analysis."
  },
  {
    question: "9. Is my uploaded data secure?",
    answer: "Yes. Uploaded reviews process securely with JWT analyst authentication and private session logging."
  },
  {
    question: "10. Who can use FlipSentiment?",
    answer: "FlipSentiment is designed for online shoppers, sellers, researchers, businesses, and students interested in AI sentiment insights."
  }
];

const InViewRender = memo(({ children, margin = '300px 0px', className = 'w-full h-full' }) => {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { margin });
  return (
    <div ref={containerRef} className={className}>
      {isInView ? children : null}
    </div>
  );
});

export const Landing = memo(() => {
  const { user } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  // Navbar interaction states
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const [activeHoverNav, setActiveHoverNav] = useState(null);
  const [showNavbar, setShowNavbar] = useState(true);

  const scrollToHero = (e) => {
    e?.preventDefault();
    const heroEl = document.getElementById('hero');
    if (heroEl) {
      heroEl.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (location.hash === '#hero') {
      const heroEl = document.getElementById('hero');
      if (heroEl) {
        heroEl.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }, [location]);

  // Automatically hide top navbar when footer/bottom section is in view
  useEffect(() => {
    const handleScroll = () => {
      const footerElement = document.querySelector('footer');
      if (footerElement) {
        const footerTop = footerElement.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        if (footerTop <= windowHeight - 50) {
          setShowNavbar(false);
        } else {
          setShowNavbar(true);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Tech stack selection state (click)
  const [selectedTech, setSelectedTech] = useState(techLogos[0]);

  // Sandbox demo state
  const [demoInput, setDemoInput] = useState(
    'The camera on this Flipkart smartphone is unbelievable in low light! Battery easily lasts 1.5 days, though it gets slightly warm while fast charging.'
  );
  const [demoResult, setDemoResult] = useState(null);
  const [demoAnalyzing, setDemoAnalyzing] = useState(false);

  const handleRunDemo = async (e) => {
    e.preventDefault();
    if (!demoInput.trim()) return;

    setDemoAnalyzing(true);
    try {
      const res = await predictionService.predictSingle(demoInput, 'Flipkart Featured Item');
      setDemoResult(res);
    } finally {
      setDemoAnalyzing(false);
    }
  };

  return (
    <LazyMotion features={domAnimation}>
      <div className="min-h-screen bg-black text-white selection:bg-neutral-800 selection:text-white transition-colors duration-300">

        {/* HIGH-TECH INTERACTIVE NAVBAR */}
        <header className={`sticky top-4 z-50 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-500 ${showNavbar ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-10 pointer-events-none'
          }`}>
          <div className="h-16 px-6 rounded-full bg-neutral-950/80 backdrop-blur-xl border border-neutral-800/90 flex items-center justify-between shadow-[0_10px_30px_rgba(0,0,0,0.8)] transition-all duration-300 hover:border-neutral-700/80">

            {/* Glowing Brand Logo */}
            <Link to="/#hero" onClick={scrollToHero} className="flex items-center gap-3 group cursor-pointer">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-white via-neutral-200 to-neutral-400 text-black flex items-center justify-center font-bold shadow-[0_0_15px_rgba(255,255,255,0.3)] transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.5)]">
                <ShoppingBag className="w-4 h-4 transition-transform duration-300 group-hover:rotate-12" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-base tracking-tight text-white group-hover:text-neutral-200 transition-colors">
                  FlipSentiment
                </span>
                <span className="text-[9px] text-neutral-400 font-medium tracking-wider uppercase">AI Sentiment Engine</span>
              </div>
            </Link>

            {/* Desktop Nav Links with Hover Pill Indicator */}
            <nav className="hidden lg:flex items-center gap-1 bg-neutral-900/60 p-1.5 rounded-full border border-neutral-800/60 backdrop-blur-md">
              {[
                { name: 'Features', href: '#features' },
                { name: 'How It Works', href: '#how-it-works' },
                { name: 'Technology', href: '#technology' },
                { name: 'Why Choose Us', href: '#why-choose-us' },
                { name: 'Live Demo', href: '#demo' }
              ].map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onMouseEnter={() => setActiveHoverNav(item.name)}
                  onMouseLeave={() => setActiveHoverNav(null)}
                  className="px-4 py-1.5 rounded-full text-xs font-semibold text-neutral-300 hover:text-white relative transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  {activeHoverNav === item.name && (
                    <m.span
                      layoutId="navHoverPill"
                      className="absolute inset-0 rounded-full bg-white/10 border border-white/20 shadow-sm"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{item.name}</span>
                </a>
              ))}
            </nav>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              {user ? (
                <Link
                  to="/dashboard"
                  className="px-5 py-2.5 text-xs font-bold rounded-full bg-white text-black hover:bg-neutral-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:scale-105 active:scale-95 flex items-center gap-2"
                >
                  <span>Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-xs font-semibold text-neutral-300 hover:text-white hover:bg-neutral-900 rounded-full border border-transparent hover:border-neutral-800 transition-all"
                  >
                    Sign In
                  </Link>
                  <a
                    href="#get-started"
                    className="px-5 py-2.5 text-xs font-extrabold rounded-full bg-white text-black hover:bg-neutral-200 shadow-[0_0_20px_rgba(255,255,255,0.25)] hover:shadow-[0_0_25px_rgba(255,255,255,0.4)] hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5"
                  >
                    <span>Get Started</span>
                    <Sparkles className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-800 transition-all"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>

          </div>

          {/* Mobile Drawer Panel */}
          {mobileMenuOpen && (
            <m.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="lg:hidden mt-3 p-4 rounded-3xl bg-neutral-950/95 border border-neutral-800/90 backdrop-blur-2xl space-y-3 shadow-2xl"
            >
              <div className="flex flex-col space-y-1">
                {[
                  { name: 'Features', href: '#features' },
                  { name: 'How It Works', href: '#how-it-works' },
                  { name: 'Technology', href: '#technology' },
                  { name: 'Why Choose Us', href: '#why-choose-us' },
                  { name: 'Live Demo', href: '#demo' }
                ].map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-2.5 rounded-xl text-sm font-medium text-neutral-300 hover:text-white hover:bg-neutral-900 transition-colors"
                  >
                    {item.name}
                  </a>
                ))}
              </div>
              <div className="pt-2 border-t border-neutral-800 flex items-center justify-between gap-3">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-1/2 text-center py-2.5 text-xs font-semibold text-neutral-300 hover:text-white bg-neutral-900 rounded-xl border border-neutral-800"
                >
                  Sign In
                </Link>
                <a
                  href="#get-started"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-1/2 text-center py-2.5 text-xs font-bold bg-white text-black rounded-xl hover:bg-neutral-200"
                >
                  Get Started
                </a>
              </div>
            </m.div>
          )}
        </header>

        {/* HERO SECTION */}
        <section id="hero" className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-28 bg-black">

          {/* Seamless Transparent WebGL Glowing Orb in Background */}
          <div
            style={{ width: '1080px', height: '1080px', position: 'absolute', transform: 'translate(-50%, -50%) scale(1.0)' }}
            className="top-1/2 left-1/2 pointer-events-none z-0 overflow-hidden opacity-85"
          >
            <InViewRender className="w-full h-full">
              <Suspense fallback={null}>
                <Orb
                  hue={0}
                  hoverIntensity={1.5}
                  rotateOnHover
                  forceHoverState={false}
                  backgroundColor="#000000"
                />
              </Suspense>
            </InViewRender>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">

            <m.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-neutral-950/80 backdrop-blur-md border border-zinc-800 text-xs font-semibold text-[#A1A1AA] shadow-sm"
            >
              <span className="text-[#22D3EE]">✦</span>
              <span className="text-[#A1A1AA]">AI-Powered Flipkart Review Intelligence</span>
            </m.div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-[48px] font-extrabold tracking-tight text-[#F5F5F5] max-w-3xl sm:max-w-4xl mx-auto leading-[1.2]">
              Transform Flipkart Reviews into{' '}
              <span className="bg-gradient-to-r from-cyan-200 via-white to-indigo-200 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(255,255,255,0.12)]">
                Actionable Intelligence
              </span>
            </h1>

            <m.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-base sm:text-xl font-semibold text-neutral-300 max-w-3xl mx-auto min-h-[2.5rem] flex items-center justify-center"
            >
              <TypewriterEffect
                staticPrefix=""
                words={[
                  'Deep Aspect Analysis',
                  'Real-Time Sentiment Detection',
                  'Automated Rating Validation',
                  'Instant Customer Insights'
                ]}
                wordColors={[
                  '#67E8F9',
                  '#93C5FD',
                  '#A5B4FC',
                  '#C4B5FD'
                ]}
                textClassName="font-extrabold tracking-tight"
                cursorClassName="bg-[#22D3EE] shadow-[0_0_10px_rgba(34,211,238,0.6)]"
                typingSpeed={65}
                deletingSpeed={30}
                delayBetweenWords={2000}
              />
            </m.div>

            <m.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.25 }}
              className="text-sm sm:text-base text-[#A1A1AA] max-w-2xl mx-auto leading-relaxed font-normal"
            >
              Turn thousands of Flipkart reviews into clear insights on customer sentiment, product strengths, recurring issues, and buying signals.
            </m.p>

            <m.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap justify-center items-center gap-4 pt-2"
            >
              <a
                href="#get-started"
                className="px-8 py-3.5 rounded-full bg-white text-[#111111] font-extrabold text-xs sm:text-sm shadow-xl hover:bg-neutral-200 hover:scale-105 transition-all flex items-center gap-2"
              >
                <span className="text-[#22D3EE]">✦</span>
                <span>Analyze Reviews</span>
              </a>

              <a
                href="#demo"
                className="px-7 py-3.5 rounded-full bg-neutral-950/80 backdrop-blur-md text-white font-semibold text-xs sm:text-sm border border-zinc-800 shadow-sm hover:bg-neutral-900 transition-all flex items-center gap-1.5"
              >
                <span>Explore Live Demo</span>
                <ArrowRight className="w-3.5 h-3.5 text-neutral-400" />
              </a>
            </m.div>

            {/* Sleek Subdued Quick Metrics Bar */}
            <m.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.35 }}
              className="pt-8 grid grid-cols-2 md:grid-cols-4 gap-3.5 max-w-3xl mx-auto"
            >
              <div className="p-3.5 rounded-xl bg-[#111111]/65 backdrop-blur-md border border-white/10 shadow-sm transition-all duration-300 hover:border-white/20">
                <span className="block text-xl sm:text-2xl font-extrabold text-white font-mono">
                  <CountUp from={0} to={57} separator="," direction="up" duration={1} className="count-up-text" delay={0} /> K+</span>
                <span className="text-[11px] text-zinc-400 font-medium">Clean Reviews</span>
              </div>
              <div className="p-4 rounded-xl bg-[#111111]/65 backdrop-blur-md border border-white/10 shadow-sm transition-all duration-300 hover:border-white/20">
                <span className="block text-xl sm:text-2xl font-extrabold text-white font-mono">8</span>
                <span className="text-[11px] text-zinc-400 font-medium">Aspect Categories</span>
              </div>
              <div className="p-4 rounded-xl bg-[#111111]/65 backdrop-blur-md border border-white/10 shadow-sm transition-all duration-300 hover:border-white/20">
                <span className="block text-xl sm:text-2xl font-extrabold text-white font-mono">NLP</span>
                <span className="text-[11px] text-zinc-400 font-medium">Sentiment Analysis</span>
              </div>
              <div className="p-4 rounded-xl bg-[#111111]/65 backdrop-blur-md border border-white/10 shadow-sm transition-all duration-300 hover:border-white/20">
                <span className="block text-xl sm:text-2xl font-extrabold text-white font-mono">Real-Time</span>
                <span className="text-[11px] text-zinc-400 font-medium">Insights</span>
              </div>
            </m.div>

          </div>
        </section>

        {/* KEY FEATURES SECTION */}
        <section id="features" className="py-24 bg-black border-y border-neutral-800/80 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-2">
              <div className="space-y-3 max-w-2xl text-left">
                <span className="text-xs font-semibold text-neutral-400 uppercase tracking-widest px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 inline-block">
                  Core Platform Capabilities
                </span>
                <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
                  Powerful NLP Intelligence
                </h2>
                <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-normal">
                  High-precision natural language processing engineered to turn raw Flipkart buyer feedback into actionable sentiment analytics.
                </p>
              </div>

            </div>

            {/* Infinite Moving Feature Cards Carousel */}
            <div className="mt-8 w-full overflow-hidden">
              <Suspense fallback={<div className="h-40 flex items-center justify-center text-xs text-zinc-500 font-mono">Loading features...</div>}>
                <InfiniteMovingCards
                  items={featureListItems}
                  direction="left"
                  speed="normal"
                  pauseOnHover={true}
                />
              </Suspense>
            </div>

          </div>
        </section>

        {/* HOW IT WORKS SECTION */}
        <section id="how-it-works" className="py-20 bg-black relative overflow-hidden">

          {/* Ambient WebGL Magic Rings Background */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0 opacity-40 dark:opacity-60 overflow-hidden flex items-center justify-center" style={{ width: '100%', height: '650px' }}>
            <div style={{ width: '100%', height: '100%', position: 'relative' }}>
              <InViewRender className="w-full h-full">
                <Suspense fallback={null}>
                  <MagicRings
                    color="#A855F7"
                    colorTwo="#6366F1"
                    ringCount={6}
                    speed={1}
                    attenuation={12}
                    lineThickness={1.5}
                    baseRadius={0.35}
                    radiusStep={0.1}
                    scaleRate={0.1}
                    opacity={1}
                    blur={0}
                    noiseAmount={0.1}
                    rotation={0}
                    ringGap={1.5}
                    fadeIn={0.7}
                    fadeOut={0.5}
                    followMouse={false}
                    mouseInfluence={0.2}
                    hoverScale={1.2}
                    parallax={0.05}
                    clickBurst={false}
                  />
                </Suspense>
              </InViewRender>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

            <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
              <span className="text-xs font-semibold text-neutral-400 uppercase tracking-widest">
                Simple 4-Step Pipeline
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                How It Works
              </h2>
              <p className="text-xs sm:text-sm text-neutral-400">
                From raw text input to deep sentiment insights in milliseconds.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">

              {/* Step 1 */}
              <div className="p-6 rounded-3xl bg-neutral-900/90 backdrop-blur-md border border-neutral-800 shadow-sm space-y-3 relative">
                <div className="w-10 h-10 rounded-2xl bg-neutral-800 text-white border border-neutral-700 font-extrabold flex items-center justify-center text-sm shadow-md">
                  1
                </div>
                <h3 className="text-base font-bold text-white">Enter or Select Review</h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Paste any Flipkart customer review text or choose from sample catalog items.
                </p>
              </div>

              {/* Step 2 */}
              <div className="p-6 rounded-3xl bg-neutral-900/90 backdrop-blur-md border border-neutral-800 shadow-sm space-y-3 relative">
                <div className="w-10 h-10 rounded-2xl bg-neutral-800 text-white border border-neutral-700 font-extrabold flex items-center justify-center text-sm shadow-md">
                  2
                </div>
                <h3 className="text-base font-bold text-white">ML Model Text Analysis</h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Our trained machine learning NLP model evaluates text semantics and aspect keywords.
                </p>
              </div>

              {/* Step 3 */}
              <div className="p-6 rounded-3xl bg-neutral-900/90 backdrop-blur-md border border-neutral-800 shadow-sm space-y-3 relative">
                <div className="w-10 h-10 rounded-2xl bg-neutral-800 text-white border border-neutral-700 font-extrabold flex items-center justify-center text-sm shadow-md">
                  3
                </div>
                <h3 className="text-base font-bold text-white">Sentiment Prediction</h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  The system predicts the sentiment (Positive/Neutral/Negative) with a confidence score.
                </p>
              </div>

              {/* Step 4 */}
              <div className="p-6 rounded-3xl bg-neutral-900/90 backdrop-blur-md border border-neutral-800 shadow-sm space-y-3 relative">
                <div className="w-10 h-10 rounded-2xl bg-neutral-800 text-white border border-neutral-700 font-extrabold flex items-center justify-center text-sm shadow-md">
                  4
                </div>
                <h3 className="text-base font-bold text-white">Detailed Insights & Analytics</h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Explore visual reports, aspect scores, and historical predictions on an intuitive dashboard.
                </p>
              </div>

            </div>

          </div>
        </section>

        {/* TECHNOLOGY SECTION */}
        <section id="technology" className="py-20 bg-black border-t border-neutral-800">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-xs font-semibold text-neutral-400 uppercase tracking-widest">
                Core Tech Stack & Architecture
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                Technology Stack
              </h2>
              <p className="text-xs sm:text-sm text-neutral-400">
                Click on any logo below to view details about that technology.
              </p>
            </div>

            {/* Interactive Tech Logo Loop Ticker */}
            <div className="py-8 px-4 rounded-3xl bg-neutral-900/50 border border-neutral-800 overflow-hidden relative shadow-xl">
              <InViewRender className="w-full">
                <Suspense fallback={null}>
                  <LogoLoop
                    logos={techLogos}
                    speed={65}
                    direction="left"
                    logoHeight={44}
                    gap={64}
                    scaleOnHover
                    fadeOut
                    fadeOutColor="#171717"
                    onClickItem={setSelectedTech}
                    ariaLabel="Technologies powering FlipSentiment"
                  />
                </Suspense>
              </InViewRender>
            </div>

            {/* Dedicated Technology Detail Display Card */}
            <div className="min-h-[110px] p-6 rounded-3xl bg-neutral-900/80 border border-neutral-800 transition-all duration-300 flex items-center justify-between shadow-2xl">
              {selectedTech ? (
                <div className="flex items-start gap-4 w-full animate-fadeIn">
                  <div className="p-3 rounded-2xl bg-black border border-neutral-800 text-3xl shrink-0">
                    {selectedTech.node}
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold text-white tracking-tight">{selectedTech.name}</h3>
                        <span className="text-xs text-neutral-500 font-mono">(Click active)</span>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-neutral-800 text-neutral-300 border border-neutral-700 text-[10px] font-bold uppercase tracking-wider">
                        {selectedTech.category}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-300 leading-relaxed">
                      {selectedTech.description}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="py-3 px-4 w-full text-center text-xs text-neutral-400 flex items-center justify-center gap-2 font-medium">
                  <Sparkles className="w-4 h-4 text-neutral-400 animate-pulse" />
                  <span>Click on any technology icon above to view its role & architecture usage</span>
                </div>
              )}
            </div>

          </div>
        </section>

        {/* WHY CHOOSE US SECTION */}
        <section id="why-choose-us" className="py-20 bg-black border-t border-neutral-800">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-xs font-semibold text-neutral-400 uppercase tracking-widest">
                Built for Buyers, Researchers & Sellers
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                Why Choose Our Platform?
              </h2>
              <p className="text-xs sm:text-sm text-neutral-400">
                Key advantages that make FlipSentiment the preferred choice for review analysis.
              </p>
            </div>

            <div className="w-full">
              <InViewRender className="w-full">
                <Suspense fallback={null}>
                  <MagicBento
                    textAutoHide={true}
                    enableStars
                    enableSpotlight
                    enableBorderGlow={true}
                    enableTilt={false}
                    enableMagnetism={false}
                    clickEffect
                    spotlightRadius={400}
                    particleCount={12}
                    glowColor="132, 0, 255"
                    disableAnimations={false}
                  />
                </Suspense>
              </InViewRender>
            </div>

          </div>
        </section>

        {/* LIVE SANDBOX DEMO SECTION */}
        <section id="demo" className="py-24 bg-black border-t border-neutral-800/80 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

            <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
              <span className="text-xs font-semibold text-neutral-400 uppercase tracking-widest px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 inline-block">
                Interactive Inference Studio
              </span>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
                Test Review Sentiment Live
              </h2>
              <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-normal">
                Input any Flipkart review feedback or load preset samples below to experience sub-50ms AI classification in real-time.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-w-5xl mx-auto">

              {/* Input Studio Panel */}
              <div className="lg:col-span-7 p-7 rounded-3xl bg-neutral-900/70 backdrop-blur-md border border-neutral-800/90 space-y-5 flex flex-col justify-between shadow-2xl relative">
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-xs font-bold text-white tracking-wide">NLP Input Console</span>
                    </div>
                    <span className="text-[10px] text-neutral-500 font-mono">Live Sub-50ms Predictor</span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-neutral-400">
                      <label className="font-semibold text-neutral-300">Customer Feedback Text</label>
                      <span className="text-[11px] font-mono text-neutral-500">{demoInput.length} characters</span>
                    </div>
                    <textarea
                      rows="5"
                      value={demoInput}
                      onChange={(e) => setDemoInput(e.target.value)}
                      placeholder="Enter or paste Flipkart review text here..."
                      className="w-full p-4 text-xs sm:text-sm rounded-2xl bg-black/90 border border-neutral-800 text-white outline-none focus:ring-2 focus:ring-neutral-700 focus:border-neutral-600 transition-all leading-relaxed font-sans resize-none"
                    />
                  </div>
                </div>

                {/* Preset Sample Loaders & Submit Button */}
                <div className="space-y-4 pt-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-semibold text-neutral-400">Presets:</span>
                    <button
                      type="button"
                      onClick={() => setDemoInput('The camera and battery life on this Flipkart smartphone are absolutely amazing! Ultra fast 67W charging and vivid 120Hz display.')}
                      className="px-3 py-1 rounded-full bg-neutral-800/80 hover:bg-neutral-700 text-[11px] text-emerald-400 font-medium border border-neutral-700/60 transition-all"
                    >
                      + Positive Review
                    </button>
                    <button
                      type="button"
                      onClick={() => setDemoInput('Overheating issue after 10 minutes of heavy gaming. Battery drains rapidly and Flipkart customer service refused replacement.')}
                      className="px-3 py-1 rounded-full bg-neutral-800/80 hover:bg-neutral-700 text-[11px] text-rose-400 font-medium border border-neutral-700/60 transition-all"
                    >
                      + Negative Review
                    </button>
                    <button
                      type="button"
                      onClick={() => setDemoInput('Build quality is decent for the price. Camera is average but speaker volume is quite loud.')}
                      className="px-3 py-1 rounded-full bg-neutral-800/80 hover:bg-neutral-700 text-[11px] text-amber-400 font-medium border border-neutral-700/60 transition-all"
                    >
                      + Mixed Review
                    </button>
                  </div>

                  <div className="flex items-center justify-end pt-1">
                    <button
                      onClick={handleRunDemo}
                      disabled={demoAnalyzing || !demoInput.trim()}
                      className="px-7 py-3 rounded-xl bg-white text-black font-extrabold text-xs hover:bg-neutral-200 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 shadow-xl disabled:opacity-50"
                    >
                      <Sparkles className="w-4 h-4 text-purple-600 animate-spin-slow" />
                      <span>{demoAnalyzing ? 'Running Inference...' : 'Predict Sentiment'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Output Studio Display */}
              <div className="lg:col-span-5 p-7 rounded-3xl bg-neutral-900/70 backdrop-blur-md border border-neutral-800/90 space-y-5 flex flex-col justify-between shadow-2xl">
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                    <span className="text-xs font-bold text-white tracking-wide">AI Sentiment Output</span>
                    {demoResult && (
                      <SentimentBadge sentiment={demoResult.sentiment} confidence={demoResult.confidence} size="md" />
                    )}
                  </div>

                  {demoResult ? (
                    <div className="space-y-5 animate-fadeIn">
                      <div className="space-y-2 p-4 rounded-2xl bg-black/80 border border-neutral-800">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-neutral-400 font-semibold">Model Confidence Score</span>
                          <span className="font-mono font-bold text-white text-sm">{demoResult.confidence}%</span>
                        </div>
                        <div className="w-full h-3 rounded-full bg-neutral-900 overflow-hidden p-0.5 border border-neutral-800">
                          <div
                            style={{ width: `${demoResult.confidence}%` }}
                            className={`h-full rounded-full transition-all duration-700 ${demoResult.sentiment === 'Positive'
                              ? 'bg-gradient-to-r from-emerald-600 to-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]'
                              : demoResult.sentiment === 'Negative'
                                ? 'bg-gradient-to-r from-rose-600 to-rose-400 shadow-[0_0_10px_rgba(251,113,133,0.5)]'
                                : 'bg-gradient-to-r from-amber-600 to-amber-400'
                              }`}
                          />
                        </div>
                      </div>

                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-neutral-300">Extracted Aspect Sentiments</span>
                          <span className="text-[10px] text-neutral-500 font-mono">{demoResult.aspects.length} Aspects</span>
                        </div>
                        <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
                          {demoResult.aspects.map((asp, idx) => (
                            <div key={idx} className="p-3 rounded-xl bg-black/90 border border-neutral-800 flex items-center justify-between text-xs text-white shadow-sm hover:border-neutral-700 transition-colors">
                              <span className="font-semibold">{asp.name}</span>
                              <SentimentBadge sentiment={asp.sentiment} size="sm" />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="py-14 text-center text-xs text-neutral-400 space-y-3">
                      <div className="w-12 h-12 mx-auto rounded-2xl bg-black/90 border border-neutral-800 flex items-center justify-center">
                        <BrainCircuit className="w-6 h-6 text-neutral-500 animate-pulse" />
                      </div>
                      <p className="font-medium text-neutral-300">Click "Predict Sentiment" or pick a preset to see real-time AI results.</p>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between text-[11px] text-neutral-500 font-mono">
                  <span>Inference: &lt; 42ms</span>
                  <span>Aspect NLP v2.4</span>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* FAQ SECTION */}
        <section id="faq" className="py-20 bg-black border-t border-neutral-800">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center space-y-3">
              <span className="text-xs font-semibold text-neutral-400 uppercase tracking-widest">
                Got Questions?
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                Frequently Asked Questions
              </h2>
              <p className="text-xs sm:text-sm text-neutral-400">
                Everything you need to know about FlipSentiment review analysis.
              </p>
            </div>

            <div className="w-full">
              <InViewRender className="w-full">
                <Suspense fallback={null}>
                  <AnimatedList
                    items={faqItems}
                    onItemSelect={(item, index) => console.log('Selected FAQ:', item, index)}
                    showGradients
                    enableArrowNavigation
                    displayScrollbar
                  />
                </Suspense>
              </InViewRender>
            </div>
          </div>
        </section>

        {/* FINAL CALL TO ACTION */}
        <section id="get-started" className="py-20 bg-black border-t border-neutral-800 text-white text-center relative overflow-hidden">

          {/* Interactive CursorGrid Canvas Background */}
          <div style={{ width: '100%', height: '100%', position: 'absolute' }} className="top-0 left-0 pointer-events-auto z-0 overflow-hidden opacity-80">
            <InViewRender className="w-full h-full">
              <Suspense fallback={null}>
                <CursorGrid
                  cellSize={70}
                  color="#D946EF"
                  radius={140}
                  falloff="smooth"
                  holdTime={400}
                  fadeDuration={800}
                  lineWidth={1.2}
                  maxOpacity={1}
                  fillOpacity={0}
                  gridOpacity={0}
                  cellRadius={0}
                  clickPulse
                  pulseSpeed={600}
                />
              </Suspense>
            </InViewRender>
          </div>

          <div className="max-w-4xl mx-auto px-4 space-y-6 relative z-10 pointer-events-none">
            <h2 className="text-3xl sm:text-5xl font-extrabold leading-tight text-white">
              Start exploring customer opinions and discover the true sentiment behind every review.
            </h2>
            <p className="text-base text-neutral-400 max-w-2xl mx-auto">
              Access real-time sentiment analysis, interactive charts, and catalog insights today.
            </p>
            <div className="pt-2 pointer-events-auto">
              <Link
                to={user ? "/dashboard" : "/register"}
                className="inline-flex items-center gap-2.5 px-9 py-4 rounded-full bg-white text-black font-extrabold text-sm shadow-2xl hover:bg-neutral-200 hover:scale-105 transition-all"
              >
                <span>Get Started Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* MINIMAL MODERN FOOTER */}
        <footer className="bg-black py-16 border-t border-neutral-800/80 text-neutral-400 text-xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 text-center">

            {/* Centered Brand Logo */}
            <div className="flex justify-center">
              <Link to="/#hero" onClick={scrollToHero} className="inline-flex items-center gap-3 group cursor-pointer">
                <div className="w-10 h-10 rounded-2xl bg-white text-black flex items-center justify-center font-bold shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all duration-300 group-hover:scale-110">
                  <ShoppingBag className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12" />
                </div>
                <span className="font-extrabold text-xl tracking-tight text-white group-hover:text-neutral-200 transition-colors">
                  FlipSentiment
                </span>
              </Link>
            </div>

            {/* Centered Horizontal Navigation Links */}
            <nav className="flex flex-wrap justify-center items-center gap-x-8 gap-y-3 text-xs sm:text-sm font-medium text-neutral-400">
              <a href="#features" className="hover:text-white transition-colors">Features</a>
              <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
              <a href="#technology" className="hover:text-white transition-colors">Technology</a>
              <a href="#why-choose-us" className="hover:text-white transition-colors">Why Choose Us</a>
              <a href="#demo" className="hover:text-white transition-colors">Live Demo</a>
              <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
            </nav>

            {/* Bottom Bar: Copyright on Left, Social Icons on Right */}
            <div className="pt-8 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
              <p className="font-normal">© 2026 FlipSentiment System. All rights reserved.</p>

              {/* Social & Channel Icons */}
              <div className="flex items-center gap-5 text-neutral-400">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors p-1.5 rounded-lg hover:bg-neutral-900"
                  aria-label="GitHub"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors p-1.5 rounded-lg hover:bg-neutral-900"
                  aria-label="Twitter"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors p-1.5 rounded-lg hover:bg-neutral-900"
                  aria-label="LinkedIn"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
                <a
                  href="#demo"
                  className="hover:text-white transition-colors p-1.5 rounded-lg hover:bg-neutral-900"
                  aria-label="Live Demo"
                >
                  <Globe className="w-4 h-4" />
                </a>
              </div>
            </div>

          </div>
        </footer>

      </div>
    </LazyMotion>
  );
});
