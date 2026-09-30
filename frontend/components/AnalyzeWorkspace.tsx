import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AnalysisReport } from './AnalysisReport';
import { ShieldCheck, AlertCircle } from 'lucide-react';

export function AnalyzeWorkspace({ onBack }: { onBack: () => void }) {
  const [step, setStep] = useState<0 | 1 | 2>(0);
  
  const [form, setForm] = useState({
    description: '',
    name: '',
    ingredients: '',
    intendedUse: '',
    dosageForm: '',
    manufacturing: '',
    claims: '',
    commercialIntent: '',
    jurisdiction: 'India'
  });
  
  const [showStructured, setShowStructured] = useState(false);
  const [showContext, setShowContext] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  const startAnalysis = async () => {
    setStep(1);
    try {
      const payload = {
        product_name: form.name || 'Unnamed Innovation',
        description: form.description,
        ingredients: form.ingredients ? form.ingredients.split(',') : [],
        intended_use: form.intendedUse,
        dosage_form: form.dosageForm,
        target_market: form.jurisdiction
      };

      const res = await fetch('http://localhost:8000/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      setAnalysisResult(data);
    } catch (e) {
      console.error(e);
      setAnalysisResult({ error: "Failed to connect to Intelligence Engine." });
    }
    setStep(2);
  };

  return (
    <div className="min-h-full flex flex-col items-center pt-10 pb-32 bg-darkbg">
      {/* Top Header */}
      <header className="w-full max-w-[820px] px-6 mb-10">
        <div className="text-terracotta tracking-[0.2em] text-[11px] font-semibold mb-3 uppercase">NEW INNOVATION ANALYSIS</div>
        <h2 className="text-[40px] font-serif text-text-main leading-tight mb-2">Tell us what you're building.</h2>
      </header>

      {/* Main Workspace Area */}
      <main className="w-full max-w-[820px] px-6 relative">
        <AnimatePresence mode="wait">
          {/* STEP 0: INNOVATION INPUT */}
          {step === 0 && (
            <motion.div
              key="step0"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-8">
                <label className="block text-[13px] font-semibold tracking-[0.08em] uppercase text-text-muted mb-3">INNOVATION</label>
                <textarea 
                  className="w-full h-[180px] bg-surface border border-surface-border text-[16px] text-text-main p-6 rounded-[12px] focus:border-accent outline-none resize-none transition-all shadow-sm"
                  style={{ lineHeight: 1.6 }}
                  placeholder="Describe your innovation..."
                  value={form.description}
                  onChange={e => setForm({...form, description: e.target.value})}
                />
              </div>

              {!showStructured && (
                <button 
                  onClick={() => setShowStructured(true)}
                  className="text-[14px] font-medium text-terracotta hover:text-accent transition-colors mb-10 flex items-center gap-2"
                >
                  <span className="text-xl leading-none font-light">+</span> Add structured details
                </button>
              )}

              {showStructured && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mb-10 pt-4"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                    <div className="flex flex-col gap-2">
                      <label className="text-[12px] font-medium text-text-secondary uppercase tracking-wider">Innovation name</label>
                      <input className="bg-surface border border-surface-border px-4 py-3 rounded-[8px] outline-none focus:border-accent text-[15px] transition-colors shadow-sm" placeholder="E.g. Nano-Curcumin Effervescent" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[12px] font-medium text-text-secondary uppercase tracking-wider">Ingredients</label>
                      <input className="bg-surface border border-surface-border px-4 py-3 rounded-[8px] outline-none focus:border-accent text-[15px] transition-colors shadow-sm" placeholder="E.g. Curcuma longa extract" value={form.ingredients} onChange={e => setForm({...form, ingredients: e.target.value})} />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[12px] font-medium text-text-secondary uppercase tracking-wider">Intended use</label>
                      <input className="bg-surface border border-surface-border px-4 py-3 rounded-[8px] outline-none focus:border-accent text-[15px] transition-colors shadow-sm" placeholder="E.g. Immunity boosting" value={form.intendedUse} onChange={e => setForm({...form, intendedUse: e.target.value})} />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[12px] font-medium text-text-secondary uppercase tracking-wider">Form / dosage</label>
                      <input className="bg-surface border border-surface-border px-4 py-3 rounded-[8px] outline-none focus:border-accent text-[15px] transition-colors shadow-sm" placeholder="E.g. 500mg effervescent tablet" value={form.dosageForm} onChange={e => setForm({...form, dosageForm: e.target.value})} />
                    </div>
                  </div>
                </motion.div>
              )}

              <div className="mb-10">
                <label className="block text-[13px] font-semibold tracking-[0.08em] uppercase text-text-muted mb-4">TARGET MARKET</label>
                <div className="inline-flex bg-surface p-1 rounded-[10px] border border-surface-border shadow-sm">
                  {['India', 'USA', 'Australia'].map(country => (
                    <button 
                      key={country}
                      onClick={() => setForm({...form, jurisdiction: country})}
                      className={`relative px-8 py-2.5 text-[14px] font-medium rounded-[6px] transition-all duration-200 flex items-center gap-2 ${
                        form.jurisdiction === country 
                          ? 'bg-soft-green border-transparent text-deep-green' 
                          : 'text-text-secondary hover:text-text-main border border-transparent'
                      }`}
                    >
                      {form.jurisdiction === country && (
                        <span className="w-1.5 h-1.5 rounded-full bg-deep-green absolute left-3" />
                      )}
                      <span className={form.jurisdiction === country ? "ml-3" : ""}>{country}</span>
                    </button>
                  ))}
                </div>
              </div>

              {!showContext && (
                <button 
                  onClick={() => setShowContext(true)}
                  className="text-[14px] font-medium text-terracotta hover:text-accent transition-colors mb-10 flex items-center gap-2"
                >
                  <span className="text-xl leading-none font-light">+</span> Add additional context
                </button>
              )}

              {showContext && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mb-12 pt-4"
                >
                  <h3 className="text-[13px] font-semibold tracking-[0.08em] uppercase text-text-muted mb-4">ADDITIONAL CONTEXT</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-5">
                    <div className="flex flex-col gap-2">
                      <label className="text-[12px] font-medium text-text-secondary uppercase tracking-wider">Manufacturing</label>
                      <input className="bg-surface border border-surface-border px-4 py-3 rounded-[8px] outline-none focus:border-accent text-[15px] transition-colors shadow-sm" placeholder="Process..." value={form.manufacturing} onChange={e => setForm({...form, manufacturing: e.target.value})} />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[12px] font-medium text-text-secondary uppercase tracking-wider">Claims</label>
                      <input className="bg-surface border border-surface-border px-4 py-3 rounded-[8px] outline-none focus:border-accent text-[15px] transition-colors shadow-sm" placeholder="E.g. Clinically proven..." value={form.claims} onChange={e => setForm({...form, claims: e.target.value})} />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[12px] font-medium text-text-secondary uppercase tracking-wider">Commercial intent</label>
                      <input className="bg-surface border border-surface-border px-4 py-3 rounded-[8px] outline-none focus:border-accent text-[15px] transition-colors shadow-sm" placeholder="E.g. OTC supplement" value={form.commercialIntent} onChange={e => setForm({...form, commercialIntent: e.target.value})} />
                    </div>
                  </div>
                </motion.div>
              )}

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-8 border-t border-surface-border">
                <button 
                  disabled={form.description.length < 5}
                  className="px-6 py-2.5 bg-transparent text-text-secondary text-[14px] font-medium rounded-md hover:bg-surface-border transition-colors border border-surface-border"
                >
                  Save draft
                </button>
                
                <button 
                  onClick={startAnalysis}
                  disabled={form.description.length < 5}
                  className="px-8 h-[50px] bg-deep-green text-surface text-[15px] font-medium rounded-[8px] hover:bg-green disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  Analyze Innovation &rarr;
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 1: ANALYZING ANIMATION */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-24"
            >
              <div className="max-w-[320px] mx-auto">
                <div className="space-y-10 border-l border-surface-border pl-8 relative">
                  {[
                    { id: 1, title: 'Understand', desc: 'Innovation structured' },
                    { id: 2, title: 'Classify', desc: 'Product pathway identified' },
                    { id: 3, title: 'Route', desc: 'Jurisdiction selected' },
                    { id: 4, title: 'Retrieve', desc: 'Authoritative evidence gathered' },
                    { id: 5, title: 'Verify', desc: 'Evidence and citations checked' },
                    { id: 6, title: 'Explain', desc: 'Intelligence report generated' },
                  ].map((stage, i) => (
                    <motion.div 
                      key={stage.id} 
                      className="relative"
                      initial={{ opacity: 0.3 }}
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 2, delay: i * 0.5, repeat: Infinity, repeatDelay: 2 }}
                    >
                      <div className="absolute -left-[38px] top-1 w-[20px] h-[20px] rounded-full bg-surface border border-surface-border flex items-center justify-center text-[9px] font-bold text-text-muted">
                        0{stage.id}
                      </div>
                      <div className="pt-0.5">
                        <div className="text-[16px] font-serif tracking-wide text-text-main mb-1">{stage.title}</div>
                        <div className="text-[13px] text-text-secondary">{stage.desc}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 2: RESULT REPORT */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="w-full"
            >
               {analysisResult?.error ? (
                  <div className="p-8 border border-surface-border bg-surface rounded-[12px] shadow-sm">
                    <div className="flex items-center gap-3 text-terracotta mb-3">
                      <AlertCircle className="w-5 h-5" />
                      <h3 className="text-[18px] font-serif">Analysis Failed</h3>
                    </div>
                    <p className="text-[14px] text-text-secondary mb-6">{analysisResult.error}</p>
                    <button onClick={() => setStep(0)} className="px-5 py-2.5 bg-surface text-[14px] text-text-main font-medium rounded-[8px] border border-surface-border hover:bg-surface-elevated transition-colors">Start Over</button>
                  </div>
               ) : (
                  <AnalysisReport result={analysisResult} onRestart={() => setStep(0)} />
               )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
