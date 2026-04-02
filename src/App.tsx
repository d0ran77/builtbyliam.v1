import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Mail, 
  ArrowRight, 
  Zap, 
  Search, 
  Globe, 
  CheckCircle,
  Menu,
  X,
  ArrowUpRight,
  Shield,
  Clock,
  Lock,
  ChevronRight,
  Plus
} from 'lucide-react';
import Onboarding from './components/Onboarding';

export default function App() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#f0f0f3] text-neutral-900 font-sans selection:bg-neutral-900 selection:text-white">
      {/* Noise Overlay */}
      <div className="noise-overlay" />

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 w-full z-40 transition-all duration-700 ${scrolled ? 'py-4 bg-[#f0f0f3]/80 backdrop-blur-2xl border-b border-white/20' : 'py-10 bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-8 flex items-center justify-between">
          <div className="flex items-center gap-4 group cursor-pointer">
            <div className="w-12 h-12 bg-[#f0f0f3] rounded-2xl flex items-center justify-center shadow-[6px_6px_12px_#d1d1d6,-6px_-6px_12px_#ffffff] group-hover:shadow-[inset_4px_4px_8px_#d1d1d6,inset_-4px_-4px_8px_#ffffff] transition-all duration-500">
              <span className="text-neutral-900 font-display font-black text-2xl">L</span>
            </div>
            <div className="flex flex-col">
              <span className="font-display font-black text-xl tracking-tighter leading-none">Built by Liam</span>
              <span className="text-[9px] font-mono uppercase tracking-[0.4em] text-neutral-400 mt-1.5 font-bold">Digital Architect</span>
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-16">
            <a href="#philosophy" className="text-[10px] font-bold uppercase tracking-[0.4em] text-neutral-400 hover:text-neutral-900 transition-colors font-mono">Philosophy</a>
            <a href="#pricing" className="text-[10px] font-bold uppercase tracking-[0.4em] text-neutral-400 hover:text-neutral-900 transition-colors font-mono">The Standard</a>
            <button 
              onClick={() => setShowOnboarding(true)}
              className="px-10 py-4 bg-[#f0f0f3] text-neutral-900 rounded-2xl text-[10px] font-bold uppercase tracking-[0.3em] shadow-[8px_8px_16px_#d1d1d6,-8px_-8px_16px_#ffffff] hover:shadow-[inset_4px_4px_8px_#d1d1d6,inset_-4px_-4px_8px_#ffffff] active:scale-95 transition-all flex items-center gap-4 font-mono"
            >
              Start Project <Plus size={14} />
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden w-12 h-12 bg-[#f0f0f3] rounded-xl flex items-center justify-center shadow-[4px_4px_8px_#d1d1d6,-4px_-4px_8px_#ffffff] text-neutral-900"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-30 bg-[#f0f0f3] pt-40 px-10 md:hidden"
          >
            <div className="flex flex-col gap-12">
              <a href="#philosophy" onClick={() => setIsMenuOpen(false)} className="text-6xl font-display font-black tracking-tighter">Philosophy.</a>
              <a href="#pricing" onClick={() => setIsMenuOpen(false)} className="text-6xl font-display font-black tracking-tighter">Pricing.</a>
              <button 
                onClick={() => {
                  setIsMenuOpen(false);
                  setShowOnboarding(true);
                }}
                className="w-full py-8 bg-neutral-900 text-white rounded-3xl text-xs font-bold uppercase tracking-[0.3em] font-mono shadow-2xl shadow-neutral-900/20"
              >
                Start Project
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative pt-64 pb-40 px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-flex items-center gap-4 px-6 py-2.5 bg-[#f0f0f3] rounded-full text-[10px] font-bold uppercase tracking-[0.4em] text-neutral-400 mb-16 font-mono shadow-[inset_2px_2px_5px_#d1d1d6,inset_-2px_-2px_5px_#ffffff]">
              <span className="w-2 h-2 bg-neutral-900 rounded-full animate-pulse" />
              Available for Q2 2026
            </div>
            
            <h1 className="text-8xl md:text-[12rem] lg:text-[15rem] font-display font-black tracking-tighter leading-[0.75] mb-24">
              Built <br />
              <span className="text-neutral-400/30 italic">Different.</span>
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-end">
              <div className="lg:col-span-6">
                <p className="text-2xl md:text-3xl text-neutral-500 font-medium leading-tight tracking-tight max-w-xl">
                  I engineer high-performance digital architecture for founders who demand aesthetic perfection and technical superiority.
                </p>
              </div>
              <div className="lg:col-span-6 flex flex-col sm:flex-row gap-8 lg:justify-end">
                <button 
                  onClick={() => setShowOnboarding(true)}
                  className="px-14 py-8 bg-neutral-900 text-white rounded-[32px] text-xs font-bold uppercase tracking-[0.3em] hover:bg-neutral-800 transition-all shadow-[20px_20px_40px_rgba(0,0,0,0.15)] flex items-center justify-center gap-5 font-mono group"
                >
                  Launch Project <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="px-14 py-8 bg-[#f0f0f3] text-neutral-900 rounded-[32px] text-xs font-bold uppercase tracking-[0.3em] shadow-[10px_10px_20px_#d1d1d6,-10px_-10px_20px_#ffffff] hover:shadow-[inset_4px_4px_8px_#d1d1d6,inset_-4px_-4px_8px_#ffffff] transition-all font-mono flex items-center justify-center gap-3">
                  The Blueprint <ArrowUpRight size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Background Decorative Element */}
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-1/2 h-full pointer-events-none select-none opacity-[0.05]">
          <div className="w-full h-full border-[100px] border-neutral-900 rounded-full blur-[120px]" />
        </div>
      </section>

      {/* Philosophy Section */}
      <section id="philosophy" className="py-48 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
            <div className="space-y-16">
              <div className="inline-flex items-center gap-4 text-neutral-900">
                <div className="w-12 h-12 bg-[#f0f0f3] rounded-2xl flex items-center justify-center shadow-[4px_4px_8px_#d1d1d6,-4px_-4px_8px_#ffffff]">
                  <Shield size={22} strokeWidth={2.5} />
                </div>
                <span className="text-xs font-bold uppercase tracking-[0.5em] font-mono">The Shield</span>
              </div>
              <h2 className="text-6xl md:text-8xl font-display font-black tracking-tighter leading-[0.85]">
                Content First. <br />
                <span className="text-neutral-400/30 italic">No Limbo.</span>
              </h2>
              <p className="text-xl text-neutral-500 font-medium leading-relaxed max-w-lg">
                Projects die in content limbo. I've built a shield against it. 
                The 7-day build clock does not start until 100% of your assets are verified.
              </p>
              
              <div className="flex gap-16">
                <div className="space-y-3">
                  <div className="text-4xl font-display font-black tracking-tighter">0%</div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-400 font-mono">Scope Creep</div>
                </div>
                <div className="space-y-3">
                  <div className="text-4xl font-display font-black tracking-tighter">100%</div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-400 font-mono">Asset Integrity</div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-square bg-[#f0f0f3] rounded-[80px] shadow-[25px_25px_50px_#d1d1d6,-25px_-25px_50px_#ffffff] flex items-center justify-center p-20 overflow-hidden group">
                <div className="text-center space-y-10 relative z-10">
                  <div className="w-32 h-32 bg-[#f0f0f3] rounded-[40px] shadow-[10px_10px_20px_#d1d1d6,-10px_-10px_20px_#ffffff] flex items-center justify-center mx-auto group-hover:shadow-[inset_6px_6px_12px_#d1d1d6,inset_-6px_-6px_12px_#ffffff] transition-all duration-500">
                    <Lock size={48} className="text-neutral-900" />
                  </div>
                  <div className="space-y-3">
                    <h4 className="text-3xl font-display font-black uppercase tracking-tighter">Locked In.</h4>
                    <p className="text-[10px] font-mono text-neutral-400 uppercase tracking-[0.4em] font-bold">Assets Verified • Clock Starts</p>
                  </div>
                </div>
              </div>
              {/* Floating Badge */}
              <div className="absolute -bottom-10 -right-10 bg-[#f0f0f3] p-10 rounded-[40px] shadow-[15px_15px_30px_#d1d1d6,-15px_-15px_30px_#ffffff] border border-white/50 max-w-[240px]">
                <div className="flex items-center gap-4 mb-4">
                  <Clock size={20} className="text-neutral-900" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] font-mono">7-Day Sprint</span>
                </div>
                <p className="text-xs text-neutral-500 font-medium leading-relaxed">Guaranteed delivery from the moment your content is verified in the vault.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-64 px-8 bg-[#f0f0f3]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-32">
            <div className="text-[10px] font-bold uppercase tracking-[0.6em] text-neutral-400 mb-8 font-mono">The Standard</div>
            <h2 className="text-7xl md:text-9xl font-display font-black tracking-tighter uppercase leading-[0.8]">One Price. <br />Total Clarity.</h2>
          </div>
          
          <div className="relative group">
            <div className="absolute -inset-10 bg-neutral-900/5 rounded-[100px] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            <div className="relative p-16 md:p-32 bg-[#f0f0f3] rounded-[80px] shadow-[40px_40px_80px_#d1d1d6,-40px_-40px_80px_#ffffff] overflow-hidden">
              <div className="absolute top-12 right-12">
                <div className="bg-neutral-900 text-white px-8 py-3 rounded-full text-[10px] font-bold uppercase tracking-[0.3em] font-mono shadow-xl">Fixed Fee</div>
              </div>
              
              <div className="flex flex-col md:flex-row items-baseline gap-4 mb-10">
                <span className="text-9xl md:text-[14rem] font-display font-black tracking-tighter leading-none">£249</span>
                <span className="text-4xl md:text-6xl font-display font-black text-neutral-300 italic">.99</span>
              </div>
              
              <p className="text-neutral-400 font-mono text-sm uppercase tracking-[0.4em] font-bold mb-24">Complete 3-Page Architecture</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left mb-24">
                {[
                  "Custom React Architecture",
                  "SEO Intel & Meta Strategy",
                  "High-Depth Neomorphic UI",
                  "7-Day Delivery Guarantee",
                  "Managed Hosting Options",
                  "Asset Vault Integration"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-6 text-base font-bold text-neutral-700">
                    <div className="w-7 h-7 rounded-xl bg-[#f0f0f3] shadow-[3px_3px_6px_#d1d1d6,-3px_-3px_6px_#ffffff] flex items-center justify-center">
                      <CheckCircle size={14} className="text-neutral-900" />
                    </div>
                    {item}
                  </div>
                ))}
              </div>

              <button 
                onClick={() => setShowOnboarding(true)}
                className="w-full py-10 bg-neutral-900 text-white rounded-[40px] text-sm font-bold uppercase tracking-[0.4em] hover:bg-neutral-800 transition-all shadow-[20px_20px_40px_rgba(0,0,0,0.2)] font-mono flex items-center justify-center gap-6 group"
              >
                Secure Your Build Slot <ChevronRight size={20} className="group-hover:translate-x-2 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-48 px-8 bg-[#f0f0f3] border-t border-white/40">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-start justify-between gap-32 mb-32">
            <div className="space-y-12">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-[#f0f0f3] rounded-[24px] flex items-center justify-center shadow-[6px_6px_12px_#d1d1d6,-6px_-6px_12px_#ffffff]">
                  <span className="text-neutral-900 font-display font-black text-3xl">L</span>
                </div>
                <span className="font-display font-black text-4xl tracking-tighter uppercase">Built by Liam</span>
              </div>
              <p className="max-w-sm text-neutral-400 text-lg font-medium leading-relaxed">
                Crafting world-class digital experiences for the next generation of founders. Based in Willerby, Hull.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-24">
              <div className="space-y-8">
                <h5 className="text-[10px] font-bold uppercase tracking-[0.5em] text-neutral-900 font-mono">Studio</h5>
                <ul className="space-y-5 text-sm font-bold text-neutral-400">
                  <li><a href="#philosophy" className="hover:text-neutral-900 transition-colors">Philosophy</a></li>
                  <li><a href="#pricing" className="hover:text-neutral-900 transition-colors">Pricing</a></li>
                  <li><a href="#" className="hover:text-neutral-900 transition-colors">Blueprint</a></li>
                </ul>
              </div>
              <div className="space-y-8">
                <h5 className="text-[10px] font-bold uppercase tracking-[0.5em] text-neutral-900 font-mono">Social</h5>
                <ul className="space-y-5 text-sm font-bold text-neutral-400">
                  <li><a href="#" className="hover:text-neutral-900 transition-colors">Instagram</a></li>
                  <li><a href="#" className="hover:text-neutral-900 transition-colors">Twitter</a></li>
                  <li><a href="#" className="hover:text-neutral-900 transition-colors">LinkedIn</a></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between pt-16 border-t border-white/20 gap-10">
            <p className="text-neutral-400 text-[10px] font-mono uppercase tracking-[0.4em] font-bold">© 2026 Built by Liam. All Rights Reserved.</p>
            <div className="flex items-center gap-12">
              <a href="#" className="text-neutral-400 text-[10px] font-mono uppercase tracking-[0.4em] font-bold hover:text-neutral-900 transition-colors">Privacy</a>
              <a href="#" className="text-neutral-400 text-[10px] font-mono uppercase tracking-[0.4em] font-bold hover:text-neutral-900 transition-colors">Terms</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.05, y: -5 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowOnboarding(true)}
        className="fixed bottom-12 right-12 w-24 h-24 bg-[#f0f0f3] text-neutral-900 rounded-[32px] flex items-center justify-center shadow-[15px_15px_30px_#d1d1d6,-15px_-15px_30px_#ffffff] hover:shadow-[inset_6px_6px_12px_#d1d1d6,inset_-6px_-6px_12px_#ffffff] z-30 group transition-all duration-500"
      >
        <Mail size={32} className="group-hover:scale-110 transition-transform" />
      </motion.button>

      {/* Onboarding Modal */}
      <AnimatePresence>
        {showOnboarding && (
          <Onboarding onClose={() => setShowOnboarding(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
