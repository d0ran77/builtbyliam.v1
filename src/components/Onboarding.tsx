import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Info, ArrowRight, ArrowLeft, Check, ExternalLink, Palette, Type, Globe, Server, ShieldCheck,
  CheckCircle, Zap, Search, Target, Edit3, ImageIcon, Layout, AlertCircle
} from 'lucide-react';

interface OnboardingProps {
  onClose: () => void;
}

const STEPS = 5;

export default function Onboarding({ onClose }: OnboardingProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    project_type: 'new',
    current_url: '',
    business_name: '',
    blueprint: 'service',
    page_two: 'Services',
    page_three: 'Gallery & Contact',
    value_prop: '',
    keywords: '',
    inspiration_links: '',
    image_folder_link: '',
    domain_choice: 'own',
    delivery_path: 'hosted',
    terms_agreed: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateField = (name: string, value: any) => {
    let error = '';
    if (name === 'full_name') {
      if (!value) error = 'Full name is required';
      else if (value.length < 2) error = 'Name is too short';
    }
    if (name === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value) error = 'Email is required';
      else if (!emailRegex.test(value)) error = 'Invalid email address';
    }
    if (name === 'phone') {
      const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
      if (value && !phoneRegex.test(value)) error = 'Invalid phone number format';
    }
    if (name === 'current_url' && formData.project_type === 'revamp') {
      if (!value) error = 'Current URL is required for revamps';
      else {
        try { 
          if (!value.startsWith('http')) throw new Error();
          new URL(value); 
        } catch (_) { error = 'Invalid URL (include http/https)'; }
      }
    }
    if (name === 'business_name' && !value) error = 'Business name is required';
    if (name === 'value_prop' && !value) error = 'Core hook is required';
    if (name === 'page_two' && !value) error = 'Page name is required';
    if (name === 'page_three' && !value) error = 'Page name is required';
    if (name === 'image_folder_link' && value) {
      try { 
        if (!value.startsWith('http')) throw new Error();
        new URL(value); 
      } catch (_) { error = 'Invalid URL (include http/https)'; }
    }
    
    setErrors(prev => ({ ...prev, [name]: error }));
    return !error;
  };

  const handleBlueprintChange = (id: string) => {
    let pages = { p2: '', p3: '' };
    if (id === 'service') pages = { p2: 'Services', p3: 'Gallery & Contact' };
    if (id === 'portfolio') pages = { p2: 'Projects', p3: 'Bio & Contact' };
    if (id === 'lead') pages = { p2: 'The Process', p3: 'Work With Us' };

    setFormData({
      ...formData,
      blueprint: id,
      page_two: pages.p2,
      page_three: pages.p3
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    const newValue = type === 'checkbox' ? checked : value;
    setFormData({ ...formData, [name]: newValue });
    validateField(name, newValue);
  };

  const canGoNext = () => {
    if (step === 1) return true; // USP step
    if (step === 2) {
      return formData.full_name && formData.email && !errors.full_name && !errors.email && 
             (formData.project_type !== 'revamp' || (formData.current_url && !errors.current_url));
    }
    if (step === 3) {
      return formData.business_name && formData.value_prop && formData.page_two && formData.page_three &&
             !errors.business_name && !errors.value_prop && !errors.page_two && !errors.page_three;
    }
    if (step === 4) {
      return !errors.image_folder_link && !errors.inspiration_links && !errors.keywords;
    }
    if (step === 5) {
      return formData.terms_agreed;
    }
    return true;
  };

  const nextStep = () => {
    if (canGoNext()) setStep(s => Math.min(s + 1, STEPS));
  };

  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const resetSession = () => {
    setStep(1);
    setIsSuccess(false);
    setFormData({
      full_name: '',
      email: '',
      phone: '',
      project_type: 'new',
      current_url: '',
      business_name: '',
      blueprint: 'service',
      page_two: 'Services',
      page_three: 'Gallery & Contact',
      value_prop: '',
      keywords: '',
      inspiration_links: '',
      image_folder_link: '',
      domain_choice: 'own',
      delivery_path: 'hosted',
      terms_agreed: false
    });
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canGoNext()) return;
    
    setIsSubmitting(true);

    try {
      const form = e.target as HTMLFormElement;
      const data = new FormData(form);
      
      await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(data as any).toString()
      });
      
      setIsSuccess(true);
    } catch (error) {
      console.error('Form submission error:', error);
      alert('There was a problem submitting your form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 20 : -20,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 20 : -20,
      opacity: 0
    })
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-[#fafafa]/80 backdrop-blur-md"
    >
      <motion.div 
        initial={{ y: 20, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 20, opacity: 0, scale: 0.95 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative w-full max-w-3xl bg-white border border-neutral-200 shadow-2xl rounded-2xl overflow-hidden flex flex-col max-h-[95vh]"
      >
        {/* Transparency Badge */}
        <div className="bg-neutral-900 text-white p-2.5 text-center text-xs font-mono tracking-wider flex items-center justify-center gap-4">
          <span className="font-bold">£249.99 FIXED</span>
          <span className="opacity-50">•</span>
          <span className="flex items-center gap-1.5"><Zap size={12} /> 3 Pages</span>
          <span className="opacity-50">•</span>
          <span className="flex items-center gap-1.5"><Search size={12} /> SEO Intel</span>
          <span className="opacity-50">•</span>
          <span className="flex items-center gap-1.5"><Globe size={12} /> High Speed</span>
        </div>

        <div className="flex items-center justify-between p-6 border-b border-neutral-100">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[0.5em] text-neutral-400 mb-1 font-mono">Project Genesis</div>
            <h2 className="text-3xl font-display font-bold text-neutral-900 uppercase tracking-tighter">Start.</h2>
          </div>
          <div className="flex items-center gap-4">
            {!isSuccess && (
              <div className="font-mono text-neutral-400 text-sm font-bold">
                0{step} <span className="opacity-40">/ 0{STEPS}</span>
              </div>
            )}
            <button 
              onClick={onClose}
              className="p-2 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto p-6 md:p-8 custom-scrollbar flex-1 relative">
          {isSuccess ? (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="py-16 text-center flex flex-col items-center justify-center h-full"
            >
              <div className="w-20 h-20 bg-neutral-900 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <CheckCircle size={32} />
              </div>
              <h3 className="text-4xl font-display font-bold text-neutral-900 mb-4 uppercase tracking-tighter">Accepted.</h3>
              <p className="text-neutral-500 font-mono text-xs uppercase tracking-[0.2em] max-w-md mx-auto mb-10">
                Architecture Logged. Build queue initiated.
              </p>
              <div className="flex gap-4">
                <button 
                  onClick={onClose}
                  className="px-6 py-3 bg-neutral-100 text-neutral-900 rounded-xl font-bold font-mono text-xs uppercase tracking-widest hover:bg-neutral-200 transition-colors"
                >
                  Close
                </button>
                <button 
                  onClick={resetSession}
                  className="px-6 py-3 bg-neutral-900 text-white rounded-xl font-bold font-mono text-xs uppercase tracking-widest hover:bg-neutral-800 transition-colors flex items-center gap-2"
                >
                  New Session
                </button>
              </div>
            </motion.div>
          ) : (
            <form name="onboarding" method="POST" data-netlify="true" onSubmit={handleSubmit} className="h-full flex flex-col">
              <input type="hidden" name="form-name" value="onboarding" />
              <div className="flex-1 relative min-h-[400px]">
                <AnimatePresence mode="wait" custom={1}>
                  
                  {/* STEP 1: WHY LIAM? (USPs) */}
                  {step === 1 && (
                    <motion.div 
                      key="step1"
                      custom={1}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="space-y-8"
                    >
                      <div className="flex items-center gap-3 mb-6 text-neutral-900">
                        <span className="text-xs font-bold font-mono opacity-30">01</span>
                        <h3 className="text-2xl font-display font-bold uppercase tracking-tighter">Why Choose Liam?</h3>
                      </div>

                      <div className="grid grid-cols-1 gap-4">
                        {[
                          { icon: <Zap size={18} />, title: "Fixed Pricing", desc: "£249.99 total. No hidden fees, no scope creep. Professional quality at a local price." },
                          { icon: <CheckCircle size={18} />, title: "7-Day Delivery", desc: "The build clock starts as soon as your content is ready. Fast, efficient, and reliable." },
                          { icon: <Search size={18} />, title: "SEO Optimized", desc: "Built with search engines in mind from day one. Get found by local customers in Hull." },
                          { icon: <Globe size={18} />, title: "Custom React Build", desc: "No generic templates. High-performance, modern tech stack for a world-class experience." }
                        ].map((usp, i) => (
                          <div key={i} className="p-5 bg-neutral-50 border border-neutral-100 rounded-2xl flex gap-4 items-start">
                            <div className="p-2 bg-white rounded-xl shadow-sm text-neutral-900">
                              {usp.icon}
                            </div>
                            <div>
                              <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-900 mb-1 font-mono">{usp.title}</h4>
                              <p className="text-[11px] text-neutral-500 leading-relaxed font-sans">{usp.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="p-6 bg-neutral-900 rounded-2xl text-white">
                        <p className="text-[11px] font-bold uppercase tracking-widest font-mono text-center">
                          "I don't just build websites; I build digital authority for local businesses."
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 2: IDENTITY */}
                  {step === 2 && (
                    <motion.div 
                      key="step2"
                      custom={1}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="space-y-8"
                    >
                      <div className="flex items-center gap-3 mb-6 text-neutral-900">
                        <span className="text-xs font-bold font-mono opacity-30">02</span>
                        <h3 className="text-2xl font-display font-bold uppercase tracking-tighter">Identity</h3>
                      </div>

                      <div className="flex p-1.5 bg-neutral-100 rounded-2xl">
                        <button type="button" onClick={() => setFormData({...formData, project_type: 'new'})} className={`flex-1 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all font-mono ${formData.project_type === 'new' ? 'bg-white shadow-sm text-neutral-900' : 'text-neutral-500 hover:text-neutral-700'}`}>New Build</button>
                        <button type="button" onClick={() => setFormData({...formData, project_type: 'revamp'})} className={`flex-1 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all font-mono ${formData.project_type === 'revamp' ? 'bg-white shadow-sm text-neutral-900' : 'text-neutral-500 hover:text-neutral-700'}`}>Revamp</button>
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-1">
                          <input 
                            type="text" name="full_name" required
                            value={formData.full_name} onChange={handleChange}
                            className={`w-full px-5 py-4 bg-neutral-50 border ${errors.full_name ? 'border-red-500' : 'border-neutral-200'} rounded-2xl focus:ring-2 focus:ring-neutral-900 focus:border-transparent outline-none transition-all font-sans text-sm font-medium text-neutral-900 placeholder:text-neutral-400`}
                            placeholder="FULL NAME"
                          />
                          {errors.full_name && <p className="text-[9px] font-bold text-red-500 uppercase tracking-widest ml-2 flex items-center gap-1 font-mono"><AlertCircle size={10}/> {errors.full_name}</p>}
                        </div>
                        <div className="space-y-1">
                          <input 
                            type="email" name="email" required
                            value={formData.email} onChange={handleChange}
                            className={`w-full px-5 py-4 bg-neutral-50 border ${errors.email ? 'border-red-500' : 'border-neutral-200'} rounded-2xl focus:ring-2 focus:ring-neutral-900 focus:border-transparent outline-none transition-all font-sans text-sm font-medium text-neutral-900 placeholder:text-neutral-400`}
                            placeholder="EMAIL ADDRESS"
                          />
                          {errors.email && <p className="text-[9px] font-bold text-red-500 uppercase tracking-widest ml-2 flex items-center gap-1 font-mono"><AlertCircle size={10}/> {errors.email}</p>}
                        </div>
                        <div className="space-y-1">
                          <input 
                            type="tel" name="phone"
                            value={formData.phone} onChange={handleChange}
                            className={`w-full px-5 py-4 bg-neutral-50 border ${errors.phone ? 'border-red-500' : 'border-neutral-200'} rounded-2xl focus:ring-2 focus:ring-neutral-900 focus:border-transparent outline-none transition-all font-sans text-sm font-medium text-neutral-900 placeholder:text-neutral-400`}
                            placeholder="PHONE NUMBER"
                          />
                          {errors.phone && <p className="text-[9px] font-bold text-red-500 uppercase tracking-widest ml-2 flex items-center gap-1 font-mono"><AlertCircle size={10}/> {errors.phone}</p>}
                        </div>
                        <AnimatePresence>
                          {formData.project_type === 'revamp' && (
                            <motion.div 
                              initial={{ height: 0, opacity: 0, marginTop: 0 }}
                              animate={{ height: 'auto', opacity: 1, marginTop: 16 }}
                              exit={{ height: 0, opacity: 0, marginTop: 0 }}
                              className="overflow-hidden space-y-1"
                            >
                              <input 
                                type="url" name="current_url" 
                                value={formData.current_url} onChange={handleChange}
                                className={`w-full px-5 py-4 bg-neutral-50 border-2 ${errors.current_url ? 'border-red-500' : 'border-neutral-200'} rounded-2xl focus:ring-2 focus:ring-neutral-900 focus:border-transparent outline-none transition-all font-sans text-sm font-medium text-neutral-900 placeholder:text-neutral-400`}
                                placeholder="CURRENT URL"
                              />
                              {errors.current_url && <p className="text-[9px] font-bold text-red-500 uppercase tracking-widest ml-2 flex items-center gap-1 font-mono"><AlertCircle size={10}/> {errors.current_url}</p>}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 3: ARCHITECTURE */}
                  {step === 3 && (
                    <motion.div 
                      key="step3"
                      custom={1}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="space-y-8"
                    >
                      <div className="flex items-center gap-3 mb-6 text-neutral-900">
                        <span className="text-xs font-bold font-mono opacity-30">03</span>
                        <h3 className="text-2xl font-display font-bold uppercase tracking-tighter">Architecture</h3>
                      </div>
                      
                      <div className="space-y-6">
                        {/* Blueprint Selection Cards */}
                        <div className="grid grid-cols-1 gap-3">
                          {[
                            { id: 'service', label: 'Path A: Service Pro', desc: 'Home, Services, Gallery/Contact' },
                            { id: 'portfolio', label: 'Path B: Portfolio', desc: 'Home, Projects, Bio/Contact' },
                            { id: 'lead', label: 'Path C: Lead Gen', desc: 'Home, The Approach, Work With Us' }
                          ].map((bp) => (
                            <div 
                              key={bp.id}
                              onClick={() => handleBlueprintChange(bp.id)}
                              className={`p-5 rounded-2xl cursor-pointer transition-all border-2 ${formData.blueprint === bp.id ? 'border-neutral-900 bg-neutral-50' : 'border-neutral-100 hover:border-neutral-200 bg-white'}`}
                            >
                              <div className="flex justify-between items-center mb-1">
                                <span className="font-bold text-xs uppercase tracking-widest font-mono text-neutral-900">{bp.label}</span>
                                {formData.blueprint === bp.id && <CheckCircle size={16} className="text-neutral-900" />}
                              </div>
                              <p className="text-[11px] font-medium text-neutral-500 uppercase tracking-tight font-sans">{bp.desc}</p>
                            </div>
                          ))}
                        </div>

                        {/* Editable Page Slot View */}
                        <div className="p-6 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-4">
                          <div className="flex items-center gap-2 text-neutral-400 mb-4">
                            <Edit3 size={14} />
                            <span className="text-[10px] font-bold uppercase tracking-widest font-mono">The 3-Page Structure</span>
                          </div>
                          
                          <div className="grid grid-cols-1 gap-3">
                            <div className="flex items-center gap-4">
                              <span className="text-[10px] font-bold font-mono w-4 text-neutral-400">01</span>
                              <div className="flex-1 p-3.5 rounded-xl bg-neutral-200/50 text-xs font-bold uppercase tracking-widest font-sans text-neutral-500">Home (Landing)</div>
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center gap-4">
                                <span className="text-[10px] font-bold font-mono w-4 text-neutral-900">02</span>
                                <input 
                                  type="text" name="page_two" value={formData.page_two} onChange={handleChange}
                                  className={`flex-1 p-3.5 rounded-xl bg-white border ${errors.page_two ? 'border-red-500' : 'border-neutral-200'} text-xs font-bold uppercase tracking-widest focus:ring-2 focus:ring-neutral-900 outline-none font-sans text-neutral-900`} 
                                />
                              </div>
                              {errors.page_two && <p className="text-[9px] font-bold text-red-500 uppercase tracking-widest ml-8 flex items-center gap-1 font-mono"><AlertCircle size={10}/> {errors.page_two}</p>}
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center gap-4">
                                <span className="text-[10px] font-bold font-mono w-4 text-neutral-900">03</span>
                                <input 
                                  type="text" name="page_three" value={formData.page_three} onChange={handleChange}
                                  className={`flex-1 p-3.5 rounded-xl bg-white border ${errors.page_three ? 'border-red-500' : 'border-neutral-200'} text-xs font-bold uppercase tracking-widest focus:ring-2 focus:ring-neutral-900 outline-none font-sans text-neutral-900`} 
                                />
                              </div>
                              {errors.page_three && <p className="text-[9px] font-bold text-red-500 uppercase tracking-widest ml-8 flex items-center gap-1 font-mono"><AlertCircle size={10}/> {errors.page_three}</p>}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4 pt-2">
                          <div className="space-y-1">
                            <input 
                              type="text" name="business_name" required onChange={handleChange} value={formData.business_name}
                              placeholder="BUSINESS NAME" 
                              className={`w-full px-5 py-4 bg-neutral-50 border ${errors.business_name ? 'border-red-500' : 'border-neutral-200'} rounded-2xl focus:ring-2 focus:ring-neutral-900 outline-none font-sans text-sm font-medium text-neutral-900 placeholder:text-neutral-400`} 
                            />
                            {errors.business_name && <p className="text-[9px] font-bold text-red-500 uppercase tracking-widest ml-2 flex items-center gap-1 font-mono"><AlertCircle size={10}/> {errors.business_name}</p>}
                          </div>
                          <div className="space-y-1">
                            <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-3 ml-2 font-mono flex items-center gap-2"><Target size={12}/> The Core Hook</label>
                            <textarea 
                              name="value_prop" required onChange={handleChange} value={formData.value_prop} rows={2} 
                              className={`w-full px-5 py-4 bg-neutral-50 border ${errors.value_prop ? 'border-red-500' : 'border-neutral-200'} rounded-2xl focus:ring-2 focus:ring-neutral-900 outline-none font-sans text-sm font-medium text-neutral-900 placeholder:text-neutral-400 resize-none`} 
                              placeholder="What makes you the best in one sentence?" 
                            />
                            {errors.value_prop && <p className="text-[9px] font-bold text-red-500 uppercase tracking-widest ml-2 flex items-center gap-1 font-mono"><AlertCircle size={10}/> {errors.value_prop}</p>}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 4: AESTHETIC */}
                  {step === 4 && (
                    <motion.div 
                      key="step4"
                      custom={1}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="space-y-8"
                    >
                      <div className="flex items-center gap-3 mb-6 text-neutral-900">
                        <span className="text-xs font-bold font-mono opacity-30">04</span>
                        <h3 className="text-2xl font-display font-bold uppercase tracking-tighter">Aesthetic</h3>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <a href="https://colorhunt.co" target="_blank" rel="noreferrer" className="p-4 rounded-xl flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest font-mono bg-neutral-50 border border-neutral-200 hover:bg-neutral-100 hover:border-neutral-300 transition-all text-neutral-700">Colors <ExternalLink size={14} /></a>
                        <a href="https://fontjoy.com" target="_blank" rel="noreferrer" className="p-4 rounded-xl flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest font-mono bg-neutral-50 border border-neutral-200 hover:bg-neutral-100 hover:border-neutral-300 transition-all text-neutral-700">Fonts <ExternalLink size={14} /></a>
                      </div>

                      <div className="space-y-6">
                        <div>
                            <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-3 ml-2 font-mono">Inspiration (Links/Codes)</label>
                            <textarea 
                              name="inspiration_links" onChange={handleChange} value={formData.inspiration_links} rows={2} 
                              className="w-full px-5 py-4 bg-neutral-50 border border-neutral-200 rounded-2xl focus:ring-2 focus:ring-neutral-900 outline-none font-sans text-sm font-medium text-neutral-900 placeholder:text-neutral-400 resize-none" 
                              placeholder="REFERENCE LINKS / HEX CODES" 
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-3 ml-2 font-mono">Keywords (Rank phrases)</label>
                            <textarea 
                              name="keywords" onChange={handleChange} value={formData.keywords} rows={2} 
                              className="w-full px-5 py-4 bg-neutral-50 border border-neutral-200 rounded-2xl focus:ring-2 focus:ring-neutral-900 outline-none font-sans text-sm font-medium text-neutral-900 placeholder:text-neutral-400 resize-none" 
                              placeholder="e.g. Plumber Bristol..." 
                            />
                        </div>
                        <div className="p-6 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-1">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-4 flex items-center gap-2 font-mono"><ImageIcon size={14}/> Asset Vault <span className="normal-case tracking-normal opacity-70">(Optional)</span></p>
                          <input 
                            type="url" name="image_folder_link" onChange={handleChange} value={formData.image_folder_link}
                            placeholder="DRIVE OR DROPBOX LINK" 
                            className={`w-full p-4 rounded-xl bg-white border ${errors.image_folder_link ? 'border-red-500' : 'border-neutral-200'} text-xs font-bold outline-none focus:ring-2 focus:ring-neutral-900 font-mono text-neutral-900 placeholder:text-neutral-400`} 
                          />
                          {errors.image_folder_link && <p className="text-[9px] font-bold text-red-500 uppercase tracking-widest ml-2 flex items-center gap-1 font-mono"><AlertCircle size={10}/> {errors.image_folder_link}</p>}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 5: LOGISTICS */}
                  {step === 5 && (
                    <motion.div 
                      key="step5"
                      custom={1}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="space-y-8"
                    >
                      <div className="flex items-center gap-3 mb-6 text-neutral-900">
                        <span className="text-xs font-bold font-mono opacity-30">05</span>
                        <h3 className="text-2xl font-display font-bold uppercase tracking-tighter">Logistics</h3>
                      </div>

                      <div className="space-y-8">
                        <div className="space-y-3">
                          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500 ml-2 font-mono">Domain Management</p>
                          <div className="flex p-1.5 bg-neutral-100 rounded-2xl">
                            <button type="button" onClick={() => setFormData({...formData, domain_choice: 'own'})} className={`flex-1 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all font-mono ${formData.domain_choice === 'own' ? 'bg-white shadow-sm text-neutral-900' : 'text-neutral-500 hover:text-neutral-700'}`}>I own a domain</button>
                            <button type="button" onClick={() => setFormData({...formData, domain_choice: 'studio'})} className={`flex-1 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all font-mono ${formData.domain_choice === 'studio' ? 'bg-white shadow-sm text-neutral-900' : 'text-neutral-500 hover:text-neutral-700'}`}>Studio Manages</button>
                          </div>
                          <AnimatePresence>
                            {formData.domain_choice === 'studio' && (
                              <motion.div 
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                              >
                                <div className="p-4 mt-2 bg-neutral-900 rounded-xl text-white text-center shadow-md">
                                  <p className="text-[11px] font-bold tracking-widest uppercase font-mono">Managed Domain: £20 / Year</p>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        <div className="space-y-3">
                          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500 ml-2 font-mono">Hosting Strategy</p>
                          <div className="space-y-3">
                            <label className={`block p-5 rounded-2xl cursor-pointer border-2 transition-all ${formData.delivery_path === 'hosted' ? 'border-neutral-900 bg-neutral-50' : 'border-neutral-100 hover:border-neutral-200 bg-white'}`}>
                              <input type="radio" name="delivery_path" value="hosted" checked={formData.delivery_path === 'hosted'} onChange={handleChange} className="hidden" />
                              <div className="flex justify-between items-center font-bold uppercase tracking-widest text-xs mb-1.5 font-mono text-neutral-900"><span>Managed Hosting</span><span>£10/MO</span></div>
                              <p className="text-[10px] font-bold text-neutral-500 tracking-wider font-sans uppercase">SSL + SECURITY + RECURRING UPDATES.</p>
                            </label>
                            <label className={`block p-5 rounded-2xl cursor-pointer border-2 transition-all ${formData.delivery_path === 'zip' ? 'border-neutral-900 bg-neutral-50' : 'border-neutral-100 hover:border-neutral-200 bg-white'}`}>
                              <input type="radio" name="delivery_path" value="zip" checked={formData.delivery_path === 'zip'} onChange={handleChange} className="hidden" />
                              <div className="flex justify-between items-center font-bold uppercase tracking-widest text-xs mb-1.5 font-mono text-neutral-900"><span>Full Handover</span><span>£50 FEE</span></div>
                              <p className="text-[10px] font-bold text-neutral-500 tracking-wider font-sans uppercase">PRODUCTION FILES FOR INDEPENDENT HOSTING.</p>
                            </label>
                          </div>
                        </div>

                        {/* CONTENT-FIRST RULE (THE SHIELD) */}
                        <div className="p-6 bg-neutral-50 rounded-2xl border border-neutral-200">
                          <div className="flex items-center gap-2 mb-3 text-neutral-900">
                            <Info size={16} strokeWidth={2.5} />
                            <span className="text-[11px] font-bold uppercase tracking-widest font-mono">Content-First Rule</span>
                          </div>
                          <p className="text-sm font-medium text-neutral-600 leading-relaxed mb-5 font-sans">
                            The <span className="text-neutral-900 font-bold">7-day build clock</span> only starts once <span className="text-neutral-900 font-bold">100% of your assets</span> (text, logos, images) are verified in the vault link provided.
                          </p>
                          <label className="flex items-start gap-4 cursor-pointer group">
                            <div className="relative flex items-center justify-center mt-0.5">
                              <input type="checkbox" name="terms_agreed" required checked={formData.terms_agreed} onChange={handleChange} className="peer sr-only" />
                              <div className="w-5 h-5 border-2 border-neutral-300 rounded peer-checked:bg-neutral-900 peer-checked:border-neutral-900 transition-colors"></div>
                              <Check size={14} className="absolute text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-700 leading-tight italic font-mono group-hover:text-neutral-900 transition-colors mt-0.5">
                              I AGREE TO PROVIDE CONTENT UPFRONT. £249.99 FIXED.
                            </span>
                          </label>
                        </div>
                      </div>
                    </motion.div>
                  )}

                </AnimatePresence>
              </div>

              {/* Navigation Footer */}
              <div className="pt-6 mt-8 border-t border-neutral-100 flex items-center justify-between">
                {step > 1 ? (
                  <button 
                    type="button" onClick={prevStep}
                    className="p-3 text-neutral-600 font-medium hover:bg-neutral-100 rounded-xl transition-colors flex items-center justify-center"
                  >
                    <ArrowLeft size={20} />
                  </button>
                ) : (
                  <div></div> // Spacer
                )}

                {step < STEPS ? (
                  <button 
                    type="button" onClick={nextStep} disabled={!canGoNext()}
                    className="flex-1 ml-4 py-4 bg-neutral-900 text-white rounded-xl font-bold font-mono text-xs uppercase tracking-widest hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    Continue <ArrowRight size={16} />
                  </button>
                ) : (
                  <button 
                    type="submit" disabled={isSubmitting || !canGoNext()}
                    className="flex-1 ml-4 py-4 bg-neutral-900 text-white rounded-xl font-bold font-mono text-xs uppercase tracking-widest hover:bg-neutral-800 transition-colors disabled:opacity-70 flex items-center justify-center gap-2 shadow-lg shadow-neutral-900/20"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <span>Commit</span> <Check size={16} />
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
