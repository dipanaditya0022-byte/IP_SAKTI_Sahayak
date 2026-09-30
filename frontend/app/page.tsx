"use client";

import React, { useState } from 'react';
import { Shell } from '../components/Shell';
import { AnalyzeWorkspace } from '../components/AnalyzeWorkspace';
import { SourceCorpusExplorer } from '../components/SourceCorpusExplorer';
import { BenchmarkDashboard } from '../components/BenchmarkDashboard';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';

export default function Home() {
  const [view, setView] = useState<'landing' | 'app'>('landing');
  const [currentTab, setCurrentTab] = useState('analyze');

  if (view === 'app') {
    return (
      <Shell currentTab={currentTab} onNavigate={setCurrentTab}>
        <div className="h-full w-full">
          {currentTab === 'analyze' && <AnalyzeWorkspace onBack={() => setView('landing')} />}
          {currentTab === 'history' && (
            <div className="p-12 text-center text-text-muted">
              <h2 className="text-2xl font-serif text-text-main mb-2">History</h2>
              <p>Your previous analyses will appear here.</p>
            </div>
          )}
          {currentTab === 'compare' && (
            <div className="p-12 text-center text-text-muted">
              <h2 className="text-2xl font-serif text-text-main mb-2">Compare Regimes</h2>
              <p>Comparison feature coming soon.</p>
            </div>
          )}
          {currentTab === 'corpus' && (
             <div className="p-8"><SourceCorpusExplorer lang="en" /></div>
          )}
          {currentTab === 'eval' && (
             <div className="p-8"><BenchmarkDashboard lang="en" /></div>
          )}
        </div>
      </Shell>
    );
  }

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-darkbg text-text-main selection:bg-accent selection:text-white">
      {/* Top Navigation */}
      <header className="absolute top-0 left-0 w-full p-8 flex justify-between items-center z-10">
        <div>
          <h1 className="text-sm font-semibold tracking-widest text-text-main uppercase font-serif">IP-SAKTI Sahayak</h1>
        </div>
        <div className="flex gap-4 items-center">
          <button 
            onClick={() => { setView('app'); setCurrentTab('analyze'); }}
            className="text-xs font-medium tracking-widest text-text-muted hover:text-text-main transition-colors uppercase"
          >
            Enter Workspace
          </button>
        </div>
      </header>

      {/* Main Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 relative z-10 pt-20 pb-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center max-w-4xl w-full"
        >
          <div className="text-terracotta tracking-[0.2em] text-[11px] font-semibold mb-6 uppercase">
            AYURVEDA • INTELLECTUAL PROPERTY • REGULATION
          </div>
          
          <h2 className="text-5xl md:text-[64px] font-serif tracking-tight text-text-main leading-[1.1] mb-6">
            What will you<br />research today?
          </h2>
          
          <p className="text-base text-text-secondary max-w-2xl mx-auto mb-10 font-normal leading-relaxed">
            Explore intellectual property, traditional knowledge, Ayurvedic formulations and regulatory frameworks through source-cited intelligence.
          </p>

          <div className="max-w-2xl mx-auto relative mb-16">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-text-muted" />
            </div>
            <input 
              type="text" 
              placeholder="Ask a research question or describe an innovation..." 
              className="w-full py-4 pl-12 pr-32 rounded-xl border border-surface-border bg-surface text-text-main placeholder-text-muted shadow-sm focus:ring-1 focus:ring-accent transition-all text-base"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setView('app');
                  setCurrentTab('analyze');
                }
              }}
            />
            <button 
              onClick={() => { setView('app'); setCurrentTab('analyze'); }}
              className="absolute inset-y-1.5 right-1.5 px-6 bg-deep-green text-surface rounded-lg hover:bg-green transition-colors text-sm font-medium"
            >
              Research →
            </button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-16">
             <div className="p-4 rounded-xl border border-surface-border bg-surface hover:border-accent transition-colors cursor-pointer" onClick={() => { setView('app'); setCurrentTab('analyze'); }}>
               <h3 className="font-serif text-lg mb-1">Patents & IP</h3>
               <p className="text-xs text-text-secondary">Eligibility & Prior Art</p>
             </div>
             <div className="p-4 rounded-xl border border-surface-border bg-surface hover:border-accent transition-colors cursor-pointer" onClick={() => { setView('app'); setCurrentTab('analyze'); }}>
               <h3 className="font-serif text-lg mb-1">Regulation</h3>
               <p className="text-xs text-text-secondary">Pathways & Compliance</p>
             </div>
             <div className="p-4 rounded-xl border border-surface-border bg-surface hover:border-accent transition-colors cursor-pointer" onClick={() => { setView('app'); setCurrentTab('analyze'); }}>
               <h3 className="font-serif text-lg mb-1">Biodiversity</h3>
               <p className="text-xs text-text-secondary">Access & Benefit Sharing</p>
             </div>
             <div className="p-4 rounded-xl border border-surface-border bg-surface hover:border-accent transition-colors cursor-pointer" onClick={() => { setView('app'); setCurrentTab('analyze'); }}>
               <h3 className="font-serif text-lg mb-1">Trad. Knowledge</h3>
               <p className="text-xs text-text-secondary">Protection & References</p>
             </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-8 justify-center max-w-3xl mx-auto text-left pt-8 border-t border-surface-border">
             <div className="flex-1">
               <h4 className="text-xs font-semibold tracking-wider text-text-muted uppercase mb-3">Research Regimes</h4>
               <ul className="text-sm text-text-main space-y-2">
                 <li>India (AYUSH, CDSCO, NBA)</li>
                 <li>USA (FDA, USPTO)</li>
                 <li>Australia (TGA, IP Australia)</li>
                 <li>International (WIPO)</li>
               </ul>
             </div>
             <div className="flex-1">
               <h4 className="text-xs font-semibold tracking-wider text-text-muted uppercase mb-3">Why IP-SAKTI</h4>
               <ul className="text-sm text-text-main space-y-2">
                 <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-terracotta rounded-full"></div> Evidence grounded</li>
                 <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-accent rounded-full"></div> Jurisdiction aware</li>
                 <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-deep-green rounded-full"></div> Citation verified</li>
                 <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-text-muted rounded-full"></div> Safe when uncertain</li>
               </ul>
             </div>
          </div>
          
        </motion.div>
      </main>
    </div>
  );
}
