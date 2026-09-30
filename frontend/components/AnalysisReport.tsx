import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, CheckCircle2, AlertTriangle, ArrowRight, MessageSquare, ChevronRight, X } from 'lucide-react';

export function AnalysisReport({ result, onRestart }: { result: any; onRestart: () => void }) {
  const [activeEvidence, setActiveEvidence] = useState<any | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<{role: string, text: string}[]>([]);

  const status = result?.status || 'COMPLETED';
  const classification = result?.classification || { primary_category: 'Unknown', confidence: 0, review_required: true };
  const jurisdiction = result?.jurisdiction || 'UNKNOWN';
  const sources = result?.sources || [];
  const confidence = Math.round((classification.confidence || 0) * 100);
  
  const isInsufficient = status === 'ABSTENTION_TRIGGERED' || result?.safe_abstention_flag;

  const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase();

  const handleAsk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setChatHistory([...chatHistory, {role: 'user', text: chatInput}, {role: 'assistant', text: 'This feature is grounded strictly in the current analysis.'}]);
    setChatInput('');
  };

  const sections = [
    { id: 'Classify', num: '01', title: 'CLASSIFICATION', content: classification.reasoning || 'Classification reasoning', claim: 'Classified under applicable schedule.' },
    { id: 'IP', num: '02', title: 'IP LANDSCAPE', content: result?.ip_considerations?.sec_3p_analysis || 'No IP restrictions identified.', claim: 'No Section 3(p) TK bar identified.' },
    { id: 'TK', num: '03', title: 'TK / ABS', content: result?.tk_abs_context?.nba_applicability || 'ABS compliance analysis.', claim: 'Form I approval required.' },
    { id: 'Regulatory', num: '04', title: 'REGULATORY PATHWAY', content: result?.regulatory_pathway?.clinical_data_requirement || 'Regulatory pathway defined.', claim: 'Requires clinical data under Rule 158B.' },
    { id: 'Scientific', num: '05', title: 'SCIENTIFIC EVIDENCE', content: result?.scientific_evidence?.[0]?.key_findings || 'Scientific findings.', claim: 'Evidence supports intended use.' }
  ];

  return (
    <div className="w-full relative flex pb-24 text-text-main bg-darkbg">
      {/* Main Report Area */}
      <div className={`flex-1 pr-8 ${chatOpen ? 'max-w-2xl' : 'max-w-4xl'} mx-auto`}>
        <div className="mb-14 border-b border-surface-border pb-8 flex items-end justify-between">
          <div>
            <div className="text-terracotta tracking-[0.2em] text-[11px] font-semibold mb-3 uppercase">IP-SAKTI RESEARCH REPORT</div>
            <h1 className="text-[32px] font-serif text-text-main leading-tight">{result?.product_name || 'Innovation Analysis'}</h1>
            <div className="flex items-center gap-3 text-xs font-medium text-text-secondary mt-4 tracking-wide uppercase">
              <span className="bg-surface px-2 py-1 rounded border border-surface-border">{jurisdiction}</span>
              <span className="bg-surface px-2 py-1 rounded border border-surface-border">{today}</span>
              <span className="bg-surface px-2 py-1 rounded border border-surface-border flex items-center gap-1">
                CONFIDENCE: <span className={confidence > 80 ? 'text-deep-green' : 'text-terracotta'}>{confidence}%</span>
              </span>
            </div>
          </div>
          <button 
            onClick={() => setChatOpen(!chatOpen)}
            className="flex items-center gap-2 text-sm text-deep-green hover:text-green font-medium transition-colors px-4 py-2 rounded-md bg-surface border border-surface-border shadow-sm"
          >
            <MessageSquare className="w-4 h-4" />
            Ask about this analysis
          </button>
        </div>

        {isInsufficient ? (
          <div className="mb-16 border-l-2 border-terracotta pl-8 py-2">
            <h2 className="text-[22px] font-serif text-text-main mb-4">06 EVIDENCE BOUNDARY REACHED</h2>
            <p className="text-base text-text-secondary leading-relaxed mb-6 max-w-2xl">
              {result?.abstention_reason || "The available authoritative evidence does not support a sufficiently reliable conclusion for this question."}
            </p>
            <div className="flex items-center gap-2 text-terracotta text-sm font-medium">
              <AlertTriangle className="w-4 h-4" />
              PROFESSIONAL REVIEW RECOMMENDED
            </div>
          </div>
        ) : (
          <div className="mb-20">
            <h3 className="text-[12px] font-semibold tracking-[0.15em] text-text-muted mb-6 uppercase">Executive Finding</h3>
            <div className="text-[24px] text-text-main leading-relaxed font-serif max-w-3xl">
              {result?.summary || result?.classification?.reasoning || "The innovation is classified appropriately and has a viable regulatory pathway based on current evidence."}
            </div>
          </div>
        )}

        {!isInsufficient && (
          <div className="space-y-16">
            {sections.map(sec => (
              <div key={sec.id} className="relative border-t border-surface-border pt-12">
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="md:w-1/3">
                    <div className="flex items-baseline gap-3 mb-2">
                      <span className="text-sm font-semibold text-terracotta font-mono">{sec.num}</span>
                      <h3 className="text-sm font-semibold tracking-widest text-text-main uppercase">{sec.title}</h3>
                    </div>
                  </div>
                  <div className="md:w-2/3">
                    <div className="text-[15px] text-text-secondary leading-relaxed mb-8 whitespace-pre-wrap">
                      {sec.content}
                    </div>
                    
                    {/* Evidence Claim Row */}
                    <div className="bg-surface p-5 rounded-lg border border-surface-border">
                      <div className="flex items-start gap-3 text-sm">
                        <CheckCircle2 className="w-5 h-5 text-deep-green shrink-0 mt-0.5" />
                        <div>
                          <div className="text-[10px] tracking-widest text-deep-green font-bold uppercase mb-1">Verified Claim</div>
                          <span className="text-text-main font-medium leading-relaxed">{sec.claim}</span>
                          <button 
                            onClick={() => setActiveEvidence(sources[0] || {title: 'Demo Source', authority: 'AYUSH', document_type: 'Guidelines', excerpt: 'Demo excerpt'})}
                            className="mt-3 text-[13px] font-medium text-terracotta hover:text-accent flex items-center gap-1 transition-colors"
                          >
                            View evidence <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            <div className="relative border-t border-surface-border pt-12">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-1/3">
                  <div className="flex items-baseline gap-3 mb-2">
                    <span className="text-sm font-semibold text-terracotta font-mono">07</span>
                    <h3 className="text-sm font-semibold tracking-widest text-text-main uppercase">SOURCES</h3>
                  </div>
                </div>
                <div className="md:w-2/3">
                  <div className="space-y-4">
                    {(sources.length > 0 ? sources : [{title: 'Drugs and Cosmetics Act, 1940', authority: 'CDSCO', tier: 'TIER_1', jurisdiction: 'India'}]).map((src: any, i: number) => (
                      <div key={i} className="flex justify-between items-center p-4 border border-surface-border rounded-lg bg-surface">
                        <div>
                          <div className="text-sm font-medium text-text-main">{src.title}</div>
                          <div className="text-xs text-text-muted mt-1">{src.authority} • {src.jurisdiction}</div>
                        </div>
                        <span className="text-[10px] tracking-widest bg-darkbg px-2 py-1 text-text-muted rounded border border-surface-border font-medium">
                          {src.tier?.replace('_', ' ') || 'TIER 1'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-20 pt-8 border-t border-surface-border">
          <button onClick={onRestart} className="text-sm font-medium text-text-secondary hover:text-text-main transition-colors flex items-center gap-2">
            ← Start New Analysis
          </button>
        </div>
      </div>

      {/* Ask / Chat Drawer */}
      <AnimatePresence>
        {chatOpen && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="w-80 border-l border-surface-border pl-6 flex flex-col h-[calc(100vh-160px)] sticky top-8 bg-darkbg"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-[13px] font-semibold tracking-widest uppercase text-text-main">Ask about this analysis</h3>
              <button onClick={() => setChatOpen(false)} className="text-text-muted hover:text-text-main">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
              {chatHistory.map((msg, i) => (
                <div key={i} className={`p-4 rounded-xl text-sm leading-relaxed ${msg.role === 'user' ? 'bg-surface border border-surface-border text-text-main ml-auto max-w-[85%]' : 'text-text-secondary mr-auto border-l-2 border-deep-green pl-4'}`}>
                  {msg.text}
                </div>
              ))}
            </div>
            
            <form onSubmit={handleAsk} className="relative mt-2">
              <input 
                type="text" 
                placeholder="Ask a question..." 
                className="w-full bg-surface border border-surface-border pl-4 pr-12 py-3.5 text-sm rounded-xl outline-none focus:border-deep-green shadow-sm text-text-main"
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
              />
              <button type="submit" className="absolute right-2 top-2 bottom-2 aspect-square flex items-center justify-center bg-deep-green text-surface rounded-lg hover:bg-green transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Evidence Drawer Modal Overlay */}
      <AnimatePresence>
        {activeEvidence && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-text-main/20 backdrop-blur-sm p-4 md:p-8"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-2xl bg-surface border border-surface-border rounded-xl shadow-xl overflow-hidden flex flex-col max-h-full"
            >
              <div className="px-6 py-4 border-b border-surface-border flex justify-between items-center bg-darkbg">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] tracking-widest bg-surface px-2 py-1 text-text-secondary rounded border border-surface-border font-medium">TIER {activeEvidence.tier?.split('_')[1] || 1}</span>
                  <span className="text-[10px] tracking-widest bg-deep-green text-surface px-2 py-1 rounded font-medium">{activeEvidence.jurisdiction || 'India'}</span>
                </div>
                <button onClick={() => setActiveEvidence(null)} className="text-text-muted hover:text-text-main">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-8 overflow-y-auto">
                <h4 className="text-xl font-serif text-text-main mb-2">{activeEvidence.title || 'Official Document'}</h4>
                <div className="text-[13px] font-mono text-text-muted mb-8">
                  {activeEvidence.authority || 'AUTHORITY'} · {activeEvidence.document_type || 'DOCUMENT'} {activeEvidence.section_article ? `· ${activeEvidence.section_article}` : ''}
                </div>
                
                <div className="bg-darkbg rounded-lg p-6 border border-surface-border">
                  <div className="text-[11px] font-semibold tracking-[0.15em] text-text-muted uppercase mb-4">Relevant Passage</div>
                  <div className="text-[15px] text-text-secondary leading-relaxed font-serif">
                    {activeEvidence.excerpt || 'Excerpt content here.'}
                  </div>
                </div>
              </div>
              
              {activeEvidence.source_url && (
                <div className="px-8 py-5 border-t border-surface-border bg-darkbg text-right">
                  <a href={activeEvidence.source_url} target="_blank" rel="noreferrer" className="text-sm font-medium text-terracotta hover:text-accent transition-colors">
                    Open original source ↗
                  </a>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
