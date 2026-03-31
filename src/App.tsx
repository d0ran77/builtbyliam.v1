import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Mail, X } from 'lucide-react';
import { motion, useSpring, useTransform, useMotionTemplate, AnimatePresence, useScroll, useMotionValueEvent } from 'motion/react';

// --- AUDIO SETUP ---
let audioCtx: AudioContext | null = null;
const initAudio = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
};

const playTone = (freq: number, type: OscillatorType, duration: number, vol: number) => {
  if (!audioCtx) return;
  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(vol, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {
    // Ignore audio errors if context is locked
  }
};

const playSnap = () => playTone(120, 'triangle', 0.15, 0.1);
const playHover = () => playTone(600, 'sine', 0.05, 0.02);
const playDrawerOpen = () => playTone(300, 'sine', 0.2, 0.05);

// --- SCRAMBLE TEXT COMPONENT ---
const ScrambleText = ({ text, isFocused }: { text: string, isFocused: boolean }) => {
  const [displayText, setDisplayText] = useState(text);
  const chars = '!<>-_\\\\/[]{}—=+*^?#________';
  
  useEffect(() => {
    if (!isFocused) {
      setDisplayText(text);
      return;
    }
    
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText(text.split('').map((char, index) => {
        if (char === ' ') return char;
        if (index < iteration) return text[index];
        return chars[Math.floor(Math.random() * chars.length)];
      }).join(''));
      
      if (iteration >= text.length) {
        clearInterval(interval);
      }
      iteration += 1 / 2;
    }, 30);
    
    return () => clearInterval(interval);
  }, [isFocused, text]);
  
  return <>{displayText}</>;
};

const NeumorphicCloud = ({ className, animateProps, delay, flip, colors }: { className: string, animateProps: any, delay: number, flip?: boolean, colors: any }) => {
  return (
    <motion.div
      className={`absolute pointer-events-none ${className}`}
      style={{ 
        transform: flip ? 'scaleX(-1)' : 'none',
        willChange: 'transform, opacity',
        // Tighter, more balanced drop shadows to prevent the "uneven" detached look
        filter: `drop-shadow(10px 10px 20px ${colors.darkShadow}) drop-shadow(-10px -10px 20px ${colors.lightShadow})`
      }}
      animate={animateProps}
      transition={{ duration: 40, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay }}
    >
      {/* Perfectly symmetrical, modern cloud/pill shape */}
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full" style={{ color: colors.base }} preserveAspectRatio="xMidYMid meet">
        <path d="M 18 18 H 6 A 5 5 0 0 1 6 8 A 7 7 0 0 1 18 8 A 5 5 0 0 1 18 18 Z" />
      </svg>
    </motion.div>
  );
};

const TunnelItem = ({ item, index, vh, scrollY, activeIndex, isLoading, colors, setSelectedProject, setIsProcessingClick, isProcessingClick }: any) => {
  const isActive = activeIndex === index;
  
  const scale = useTransform(scrollY, (y: number) => {
    const targetScroll = index * vh;
    const relativeZ = targetScroll - y;
    const zFactor = relativeZ / vh;
    let s = zFactor >= 0 ? 1 - (zFactor * 0.5) : 1 - (zFactor * 1.2);
    s = Math.max(0, s);
    return isNaN(s) ? 1 : s;
  });

  const opacity = useTransform(scrollY, (y: number) => {
    const targetScroll = index * vh;
    const relativeZ = targetScroll - y;
    const zFactor = relativeZ / vh;
    const o = Math.max(0, 1 - Math.abs(zFactor) * 1.5);
    return isNaN(o) ? 0 : o;
  });

  const isFocused = isActive;

  return (
    <motion.div
      className="absolute flex flex-col items-center justify-center text-center w-full px-6 pointer-events-none will-change-transform"
      style={{
        scale,
        opacity,
      }}
    >
      {item.type === 'hero' && (
        <motion.div 
          initial="hidden"
          animate={isFocused && !isLoading ? "visible" : "hidden"}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.2,
                delayChildren: 0.4, // Wait for loader to slide up
              }
            }
          }}
          className="space-y-6 flex flex-col items-center px-4"
        >
          <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } } }}>
            <motion.span 
              animate={{ y: [0, -4, 0], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="text-[10px] md:text-xs font-mono font-bold tracking-[0.5em] block transition-colors duration-700"
              style={{ color: colors.accent }}
            >
              LIAM DORAN — PORTFOLIO '26
            </motion.span>
          </motion.div>
          
          <motion.div variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } } }}>
            <motion.h1 
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
              className="text-5xl md:text-7xl lg:text-[8rem] font-display font-black tracking-tighter leading-[0.9] uppercase drop-shadow-sm text-center transition-colors duration-700"
              style={{ color: colors.text }}
            >
              CREATIVE<br/>PORTFOLIO
            </motion.h1>
          </motion.div>

          <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } } }} className="max-w-2xl text-center mt-4">
            <motion.p 
              animate={{ y: [0, -4, 0], opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
              className="text-sm md:text-lg font-sans font-medium leading-relaxed transition-colors duration-700"
              style={{ color: colors.textMuted }}
            >
              Welcome to <strong style={{ color: colors.text }}>Built by Liam</strong>. I craft immersive digital experiences, interactive web applications, and bold brand identities.
            </motion.p>
            
            <motion.div 
              className="mt-12 flex flex-col items-center gap-3"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            >
              <span className="text-[10px] md:text-xs font-sans font-bold tracking-[0.2em] uppercase" style={{ color: colors.accent }}>
                Scroll to explore
              </span>
            </motion.div>
          </motion.div>
        </motion.div>
      )}

      {item.type === 'project' && (
        <button 
          onClick={() => {
            initAudio();
            setIsProcessingClick(item.id);
            setTimeout(() => {
              playDrawerOpen();
              setSelectedProject(item);
              setIsProcessingClick(null);
            }, 400); // Small delay to show the processing animation
          }}
          className={`flex flex-col items-center group space-y-6 ${isFocused && !isLoading ? 'pointer-events-auto' : ''}`}
        >
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isFocused && !isLoading ? 1 : 0, y: isFocused && !isLoading ? 0 : 20 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="block text-[10px] md:text-xs font-mono font-bold tracking-[0.5em] transition-all duration-500 group-hover:text-zinc-800 group-hover:-translate-y-2 group-hover:tracking-[0.6em]"
            style={{ color: colors.textMuted }}
          >
            {item.label} {isFocused && <span className="md:hidden opacity-50 ml-2">— TAP TO VIEW</span>}
          </motion.span>
          
          {/* Project Title with Hover Underline and Processing Animation */}
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            animate={{ 
              opacity: isFocused && !isLoading ? (isProcessingClick === item.id ? 0.5 : 1) : 0, 
              y: isFocused && !isLoading ? 0 : 30,
              scale: isProcessingClick === item.id ? 0.95 : 1
            }}
            transition={{ duration: isProcessingClick === item.id ? 0.2 : 0.8, ease: "easeOut", delay: isProcessingClick === item.id ? 0 : 0.1 }}
            className="relative inline-block pb-4 md:pb-6 text-6xl md:text-8xl lg:text-[9rem] font-display font-black tracking-tighter leading-[0.9] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:text-zinc-800 group-hover:tracking-tight group-hover:scale-[1.02] group-hover:-translate-y-1 will-change-transform"
            style={{ color: colors.text }}
          >
            <ScrambleText text={item.title} isFocused={isFocused && !isLoading} />
            <span className="absolute bottom-0 left-0 w-0 h-[4px] md:h-[8px] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:w-full" style={{ backgroundColor: colors.accent }}></span>
          </motion.h2>

          {/* View Project - Fades and slides in on hover (Desktop) or when focused (Mobile) */}
          <div 
            className={`mt-4 flex items-center justify-center gap-3 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] 
              ${isFocused && !isLoading ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'} 
              md:opacity-0 md:translate-y-6 md:group-hover:opacity-100 md:group-hover:translate-y-0`}
          >
            <span className="text-xs md:text-sm font-sans font-bold uppercase tracking-[0.2em] relative after:content-[''] after:absolute after:-bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-[2px] after:bg-current after:transition-all after:duration-500 after:ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:after:w-full" style={{ color: colors.accent }}>View Case Study</span>
            <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform duration-300" style={{ color: colors.accent }} />
          </div>
        </button>
      )}

      {item.type === 'contact' && (
        <a 
          href={item.href} 
          target="_blank" 
          rel="noopener noreferrer" 
          onMouseEnter={() => {
            initAudio();
            playHover();
          }}
          className={`flex flex-col items-center group space-y-6 ${isFocused && !isLoading ? 'pointer-events-auto' : ''}`}
        >
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isFocused && !isLoading ? 1 : 0, y: isFocused && !isLoading ? 0 : 20 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="block text-[10px] md:text-xs font-mono font-bold tracking-[0.5em] transition-all duration-500 group-hover:text-zinc-800 group-hover:-translate-y-2 group-hover:tracking-[0.6em]"
            style={{ color: colors.textMuted }}
          >
            {item.label} {isFocused && <span className="md:hidden opacity-50 ml-2">— TAP TO START</span>}
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: isFocused && !isLoading ? 1 : 0, y: isFocused && !isLoading ? 0 : 30 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-[8rem] font-display font-black tracking-tighter leading-[0.9] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.02]"
            style={{ color: colors.text }}
          >
            Let's build<br/>
            <span className="inline-block transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110 group-hover:-translate-y-4 group-hover:drop-shadow-[0_15px_35px_rgba(39,39,42,0.3)] group-hover:rotate-[-2deg]" style={{ color: colors.accent }}>
              something.
            </span>
          </motion.h2>

          {/* Contact CTA - Fades and slides in on hover (Desktop) or when focused (Mobile) */}
          <div 
            className={`mt-4 flex items-center justify-center gap-3 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] 
              ${isFocused && !isLoading ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'} 
              md:opacity-0 md:translate-y-6 md:group-hover:opacity-100 md:group-hover:translate-y-0`}
          >
            <span className="text-xs md:text-sm font-sans font-bold uppercase tracking-[0.2em] relative after:content-[''] after:absolute after:-bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-[2px] after:bg-current after:transition-all after:duration-500 after:ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:after:w-full" style={{ color: colors.accent }}>Get in touch</span>
            <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform duration-300" style={{ color: colors.accent }} />
          </div>
        </a>
      )}
    </motion.div>
  );
};

export default function App() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll({ container: scrollContainerRef });
  const [activeIndex, setActiveIndex] = useState(0);
  const [vh, setVh] = useState(800);
  
  // Feature 1: Loading Sequence State
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Feature 2: Project Drawer State
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [isProcessingClick, setIsProcessingClick] = useState<number | null>(null);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const newIndex = Math.round(latest / vh);
    if (newIndex !== activeIndex) {
      setActiveIndex(newIndex);
    }
  });

  // Loading Sequence Effect
  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsLoading(false), 800); // Wait a bit at 100%
          return 100;
        }
        return p + Math.floor(Math.random() * 15) + 5;
      });
    }, 150);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const updateVh = () => {
      if (scrollContainerRef.current) {
        setVh(Math.max(1, scrollContainerRef.current.clientHeight));
      } else {
        setVh(Math.max(1, window.innerHeight));
      }
    };
    updateVh();
    window.addEventListener('resize', updateVh);
    
    return () => {
      window.removeEventListener('resize', updateVh);
    };
  }, []);

  // Theme Colors
  const colors = {
    accent: '#27272a', // Sleek dark zinc instead of orange
    base: '#f0f0f3', // Neumorphic off-white/grey
    text: '#2d3142', // Deep grey for text
    textMuted: '#a3a3a3',
    lightShadow: '#ffffff',
    darkShadow: '#d9d9d9',
    cloudShadowLight: '#ffffff',
    cloudShadowDark: '#c0c0c5',
    cloudBase: '#f0f0f3'
  };

  // ============================================================================
  // 🚀 HOW TO ADD MORE PROJECTS LATER ON:
  // ============================================================================
  // 1. Add a new object to the `portfolioItems` array below.
  // 2. Make sure to increment the `id` so it's unique.
  // 3. Set `type: 'project'`.
  // 4. Fill in the `title`, `label` (e.g., 'WORK_03'), `href` (live site link),
  //    `description`, `role`, `tech` (array of strings), and `year`.
  // 5. The 3D tunnel engine and navigation dots will automatically update to 
  //    include your new project!
  // 
  // NOTE: For the project drawer gallery, it currently uses picsum.photos placeholders
  // based on the project title. To use real screenshots, update the <img> tags in 
  // the "High-Res Screenshots Section" further down in this file to use actual URLs 
  // from your project data.
  // ============================================================================

  const portfolioItems = [
    { id: 0, type: 'hero', label: 'ORIGIN' },
    { 
      id: 1, 
      type: 'project', 
      title: 'Practisy', 
      label: 'WORK_01', 
      href: 'https://practisy.app',
      description: 'A privacy-first automation tool for practitioners to sync Google Calendar therapy sessions and track clinical compliance ratios (BACP/UKCP). Built with a focus on local-first data privacy and seamless JSON backup & restore.',
      detailedContent: 'Built for the modern practitioner, Practisy transforms session tracking from a tedious chore into a seamless, automated workflow. The app\'s custom Sync Engine reads Google Calendar color codes and keywords to automatically build a clinical log, while a dynamic dashboard tracks supervision-to-client compliance ratios. Designed with a strict "local-first" architecture, all sensitive data remains exclusively on the user\'s device. Featuring voice dictation, integrated clinical metrics (PHQ-9, GAD-7), dynamic tag filtering, and a sleek "Focus Mode" for deep reflection, Practisy is the ultimate private thought-partner for professional practitioners.',
      role: 'Lead Developer & Founder',
      tech: ['React', 'Google Calendar API', 'Local-First Storage', 'Tailwind CSS'],
      year: '2026'
    },
    { 
      id: 2, 
      type: 'project', 
      title: 'Talk With Liam', 
      label: 'WORK_02', 
      href: 'https://talkwithliam.co.uk',
      description: 'A professional psychotherapy practice platform based in Hull, specializing in Transactional Analysis. Features a custom booking system, reflective journal, and interactive structural analysis tools.',
      detailedContent: 'Built with the "Quiet Presence" framework, Talk with Liam is a masterclass in digital stewardship. The site replaces traditional therapy "marketing" with a sophisticated, architectural atmosphere that favors structural whitespace and industrial textures. Designed to anchor a professional practice in Hull and East Yorkshire, it features a custom-built "Breathe Room" for somatic grounding and a library of AI-free reflections. The result is a digital consulting room that feels safe, stable, and intentionally silent—positioning the practitioner as a verified local authority in a cluttered professional landscape.',
      role: 'Lead Developer & Founder',
      tech: ['HTML5', 'Vanilla JS', 'Tailwind CSS', 'Netlify', 'JSON-LD', 'No-Database'],
      year: '2026'
    },
    { id: 3, type: 'contact', title: 'Contact', label: 'SIGNAL', href: 'https://tally.so/r/2ErxqA' },
  ];

  // Trigger snap sound when activeIndex changes
  useEffect(() => {
    if (scrollY.get() > 10 && !isLoading) { // Don't play on initial load
      playSnap();
    }
  }, [activeIndex, isLoading, scrollY]);

  return (
    <>
      <AnimatePresence>
        {isLoading && (
          <motion.div 
            key="loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: '-100%' }}
            transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
            style={{ backgroundColor: colors.base }}
          >
            <div className="relative flex flex-col items-center">
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="text-8xl md:text-[12rem] font-display font-black tracking-tighter"
                style={{ color: colors.accent }}
              >
                {loadingProgress}
                <span className="text-4xl md:text-6xl">%</span>
              </motion.div>
              <div className="h-1 w-48 md:w-64 bg-[#d9d9d9] rounded-full mt-8 overflow-hidden">
                <motion.div 
                  className="h-full"
                  style={{ backgroundColor: colors.accent }}
                  initial={{ width: '0%' }}
                  animate={{ width: `${loadingProgress}%` }}
                  transition={{ ease: "linear" }}
                />
              </div>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mt-6 text-xs font-mono font-bold tracking-[0.5em] uppercase"
                style={{ color: colors.textMuted }}
              >
                Initializing Environment
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedProject && (
          <motion.div 
            key="drawer-backdrop"
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 bg-black/60 z-[60]"
            onClick={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {selectedProject && (
          <motion.div 
            key="drawer-panel"
            initial={{ x: '100%' }} 
            animate={{ x: 0 }} 
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-0 right-0 bottom-0 w-full md:w-[600px] lg:w-[800px] z-[70] shadow-[0_0_40px_rgba(0,0,0,0.1)] overflow-y-auto flex flex-col bg-[#f0f0f3] border-l border-white/50"
            style={{ willChange: 'transform' }}
          >
              <div className="p-8 md:p-12 flex-1 flex flex-col">
                <div className="flex justify-between items-center mb-16">
                  <span className="text-xs font-mono font-bold tracking-[0.5em] uppercase" style={{ color: colors.textMuted }}>
                    {selectedProject.label}
                  </span>
                  <button 
                    onClick={() => setSelectedProject(null)}
                    className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                    style={{
                      backgroundColor: colors.base,
                      boxShadow: `4px 4px 8px ${colors.darkShadow}, -4px -4px 8px ${colors.lightShadow}`
                    }}
                  >
                    <X size={20} style={{ color: colors.text }} />
                  </button>
                </div>

                <div>
                  <motion.h2 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="text-5xl md:text-7xl font-display font-black tracking-tighter leading-[0.9] mb-8 relative inline-block group cursor-default"
                    style={{ color: colors.text }}
                  >
                    {selectedProject.title}
                    <span className="absolute bottom-[-8px] left-0 w-0 h-[4px] md:h-[6px] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:w-full" style={{ backgroundColor: colors.accent }}></span>
                  </motion.h2>
                </div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="space-y-12"
                >
                  <div>
                    <h3 className="text-xs font-mono font-bold tracking-[0.2em] uppercase mb-4" style={{ color: colors.textMuted }}>Overview</h3>
                    <p className="text-lg md:text-xl leading-relaxed" style={{ color: colors.text }}>
                      {selectedProject.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-xs font-mono font-bold tracking-[0.2em] uppercase mb-4" style={{ color: colors.textMuted }}>Role</h3>
                      <p className="font-medium" style={{ color: colors.text }}>{selectedProject.role}</p>
                    </div>
                    <div>
                      <h3 className="text-xs font-mono font-bold tracking-[0.2em] uppercase mb-4" style={{ color: colors.textMuted }}>Year</h3>
                      <p className="font-medium" style={{ color: colors.text }}>{selectedProject.year}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-mono font-bold tracking-[0.2em] uppercase mb-4" style={{ color: colors.textMuted }}>Tech Stack</h3>
                    <div className="flex flex-wrap gap-3">
                      {selectedProject.tech.map((t: string, i: number) => (
                        <span 
                          key={i}
                          className="px-4 py-2 rounded-full text-xs font-mono font-bold tracking-wider"
                          style={{
                            backgroundColor: colors.base,
                            color: colors.accent,
                            boxShadow: `inset 2px 2px 4px ${colors.darkShadow}, inset -2px -2px 4px ${colors.lightShadow}`
                          }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Deep Dive Content Section */}
                  {selectedProject.detailedContent && (
                    <div className="mt-12">
                      <h3 className="text-xs font-mono font-bold tracking-[0.2em] uppercase mb-6" style={{ color: colors.textMuted }}>Deep Dive</h3>
                      <div className="p-8 md:p-10 rounded-3xl bg-white/40 border border-white/60 shadow-[inset_0_2px_20px_rgba(255,255,255,0.5),0_10px_30px_rgba(0,0,0,0.03)] relative overflow-hidden group transition-all duration-500 hover:bg-white/50 hover:shadow-[inset_0_2px_20px_rgba(255,255,255,0.8),0_15px_40px_rgba(0,0,0,0.05)]">
                        {/* Decorative background element */}
                        <div className="absolute -top-24 -right-24 w-64 h-64 bg-zinc-200/50 rounded-full opacity-40 group-hover:opacity-60 transition-opacity duration-700"></div>
                        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-zinc-200/50 rounded-full opacity-40 group-hover:opacity-60 transition-opacity duration-700"></div>
                        
                        <p className="relative text-lg md:text-xl leading-relaxed font-medium" style={{ color: colors.text }}>
                          {selectedProject.detailedContent}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="pt-12 mt-auto flex justify-center">
                    <a 
                      href={selectedProject.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center justify-center gap-3 text-sm font-sans font-bold uppercase tracking-[0.2em] relative after:content-[''] after:absolute after:-bottom-2 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-[2px] after:bg-current after:transition-all after:duration-500 after:ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:after:w-full"
                      style={{ color: colors.accent }}
                    >
                      View Case Study
                      <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-2" />
                    </a>
                  </div>
                </motion.div>
              </div>
            </motion.div>
        )}
      </AnimatePresence>

      <div 
        ref={scrollContainerRef}
        className="h-screen w-full overflow-y-auto overscroll-none snap-y snap-mandatory font-sans select-none overflow-x-hidden transition-colors duration-700"
        onClick={initAudio}
        style={{ backgroundColor: colors.base }}
      >
        {/* 3D Scroll Progress Indicator */}
        <div className="fixed top-6 md:top-8 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-3 pointer-events-none w-full max-w-[90vw] md:max-w-xl px-2">
          <div className="flex flex-row flex-wrap justify-center gap-3 sm:gap-5 md:gap-8">
            {portfolioItems.map((item, i) => (
              <button
                key={`nav-dot-${i}`}
                onClick={() => scrollContainerRef.current?.scrollTo({ top: i * vh, behavior: 'smooth' })}
                className="pointer-events-auto w-2.5 h-2.5 md:w-3 md:h-3 rounded-full transition-all duration-300 hover:scale-125"
                style={{
                  backgroundColor: activeIndex === i ? colors.accent : colors.base,
                  boxShadow: activeIndex === i 
                    ? `inset 2px 2px 4px rgba(0,0,0,0.2), inset -2px -2px 4px rgba(255,255,255,0.1)` 
                    : `2px 2px 4px ${colors.darkShadow}, -2px -2px 4px ${colors.lightShadow}`
                }}
                aria-label={`Scroll to section ${i + 1}`}
              />
            ))}
          </div>
          <div className="h-4 overflow-visible relative w-full flex justify-center mt-1">
            <AnimatePresence mode="wait">
              <motion.span
                key={`nav-label-${activeIndex}`}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.2 }}
                className="text-[10px] md:text-xs font-mono font-bold tracking-[0.3em] uppercase text-center absolute whitespace-nowrap"
                style={{ color: colors.text }}
              >
                {portfolioItems[activeIndex]?.label} {portfolioItems[activeIndex]?.title && portfolioItems[activeIndex]?.type !== 'hero' && portfolioItems[activeIndex]?.type !== 'contact' ? `- ${portfolioItems[activeIndex].title}` : ''}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>

        {/* 1. SNAP POINTS */}
        {portfolioItems.map((_, i) => (
          <div key={`snap-${i}`} className="h-screen w-full shrink-0 snap-center" />
        ))}

        {/* 2. NEUMORPHIC CLOUD ENVIRONMENT */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden transition-colors duration-700">
          {/* Neumorphic Floating Clouds */}
          <NeumorphicCloud 
            className="top-[5%] left-[-10%] w-[400px] h-[200px] md:w-[700px] md:h-[350px]" 
            animateProps={{ x: [0, 100, 0], y: [0, -20, 0], opacity: [0.8, 1, 0.8] }} 
            delay={0} 
            colors={colors}
          />
          <NeumorphicCloud 
            className="top-[40%] right-[-10%] w-[500px] h-[250px] md:w-[800px] md:h-[400px]" 
            animateProps={{ x: [0, -150, 0], y: [0, 50, 0], opacity: [0.7, 0.95, 0.7] }} 
            delay={5} 
            flip 
            colors={colors}
          />
          <NeumorphicCloud 
            className="bottom-[5%] left-[5%] w-[450px] h-[225px] md:w-[750px] md:h-[375px]" 
            animateProps={{ x: [0, 80, 0], y: [0, -30, 0], opacity: [0.8, 1, 0.8] }} 
            delay={2} 
            colors={colors}
          />

          {/* Grainy Noise for texture */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        </div>

        {/* 3. THE 3D TUNNEL ENGINE */}
        <div className="fixed inset-0 perspective-[1200px] flex items-center justify-center pointer-events-none z-10">
          {portfolioItems.map((item, index) => (
            <TunnelItem 
              key={item.id}
              item={item}
              index={index}
              vh={vh}
              scrollY={scrollY}
              activeIndex={activeIndex}
              isLoading={isLoading}
              colors={colors}
              setSelectedProject={setSelectedProject}
              setIsProcessingClick={setIsProcessingClick}
              isProcessingClick={isProcessingClick}
              initAudio={initAudio}
              playDrawerOpen={playDrawerOpen}
            />
          ))}
        </div>

        {/* 4. NEUMORPHIC FLOATING ACTION BUTTON (Contact) */}
        <div className="fixed bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
          <a 
            href="https://tally.so/r/2ErxqA" 
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => {
              initAudio();
              playHover();
            }}
            className="pointer-events-auto flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full transition-all duration-300 hover:scale-110 group"
            style={{
              backgroundColor: colors.base,
              color: colors.accent,
              boxShadow: `8px 8px 16px ${colors.darkShadow}, -8px -8px 16px ${colors.lightShadow}`
            }}
            aria-label="Contact Form"
          >
            <Mail size={24} className="group-hover:scale-110 transition-transform duration-300" />
          </a>
        </div>
      </div>
    </>
  );
}
