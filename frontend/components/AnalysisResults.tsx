'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  FileCheck2,
  Scale,
  Leaf,
  Building2,
  BookOpen,
  ExternalLink,
  HelpCircle,
  CheckCircle,
  XCircle,
  AlertCircle,
  UserCheck,
  Info
} from 'lucide-react';
import { FullAnalysisResponse } from '../types';
import { Language, i18n } from '../lib/i18n';

interface AnalysisResultsProps {
  data: FullAnalysisResponse;
  lang: Language;
}

export const AnalysisResults: React.FC<AnalysisResultsProps> = ({ data, lang }) => {
  const t = i18n[lang];
  const [activeTab, setActiveTab] = useState<'overview' | 'ip' | 'tk' | 'regulatory' | 'scientific' | 'sources' | 'verification'>('overview');
  const [expandedCitations, setExpandedCitations] = useState<Record<string, boolean>>({});

  const toggleCitation = (id: string) => {
    setExpandedCitations(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const isAbstention = data.safe_abstention_flag;

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case 'TIER_1':
        return (
          <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/20 dark:bg-emerald-500/20 light:bg-emerald-100 text-emerald-300 dark:text-emerald-300 light:text-emerald-800 border border-emerald-500/30 dark:border-emerald-500/30 light:border-emerald-300">
            TIER 1 (Official Primary)
          </span>
        );
      case 'TIER_2':
        return (
          <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-cyan-500/20 dark:bg-cyan-500/20 light:bg-cyan-100 text-cyan-300 dark:text-cyan-300 light:text-cyan-800 border border-cyan-500/30 dark:border-cyan-500/30 light:border-cyan-300">
            TIER 2 (International Official)
          </span>
        );
      case 'TIER_3':
        return (
          <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-violet-500/20 dark:bg-violet-500/20 light:bg-violet-100 text-violet-300 dark:text-violet-300 light:text-violet-800 border border-violet-500/30 dark:border-violet-500/30 light:border-violet-300">
            TIER 3 (Scientific Literature)
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-slate-500/20 dark:bg-slate-500/20 light:bg-slate-100 text-slate-300 dark:text-slate-300 light:text-slate-800 border border-slate-500/30 dark:border-slate-500/30 light:border-slate-300">
            TIER 4 (Secondary)
          </span>
        );
    }
  };

  const getVerificationBadge = (status: string) => {
    switch (status) {
      case 'VERIFIED':
        return (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-950/80 dark:bg-emerald-950/80 light:bg-emerald-50 border border-emerald-500/40 dark:border-emerald-500/40 light:border-emerald-300 text-emerald-300 dark:text-emerald-300 light:text-emerald-800 text-xs font-bold shadow-sm">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400 dark:text-emerald-400 light:text-emerald-600" />
            <span>{t.verifiedBadge}</span>
          </div>
        );
      case 'NOT_VERIFIED':
        return (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-rose-950/80 dark:bg-rose-950/80 light:bg-rose-50 border border-rose-500/40 dark:border-rose-500/40 light:border-rose-300 text-rose-300 dark:text-rose-300 light:text-rose-800 text-xs font-bold shadow-sm">
            <XCircle className="w-3.5 h-3.5 text-rose-400 dark:text-rose-400 light:text-rose-600" />
            <span>{t.notVerifiedBadge}</span>
          </div>
        );
      default:
        return (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-950/80 dark:bg-amber-950/80 light:bg-amber-50 border border-amber-500/40 dark:border-amber-500/40 light:border-amber-300 text-amber-300 dark:text-amber-300 light:text-amber-800 text-xs font-bold shadow-sm">
            <AlertCircle className="w-3.5 h-3.5 text-amber-400 dark:text-amber-400 light:text-amber-600" />
            <span>{t.insufficientBadge}</span>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Safe Abstention Banner */}
      {isAbstention && (
        <div className="p-5 rounded-2xl bg-amber-950/40 dark:bg-amber-950/40 light:bg-amber-50 border border-amber-500/40 dark:border-amber-500/40 light:border-amber-300 shadow-xl space-y-3">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-amber-500/20 dark:bg-amber-500/20 light:bg-amber-100 border border-amber-500/30 dark:border-amber-500/30 light:border-amber-300 text-amber-400 dark:text-amber-400 light:text-amber-700">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-amber-200 dark:text-amber-200 light:text-amber-900">
                {t.safeAbstentionNotice}
              </h3>
              <p className="text-xs text-amber-100/90 dark:text-amber-100/90 light:text-amber-800 mt-1 leading-relaxed">
                {data.abstention_reason}
              </p>
            </div>
          </div>
          <div className="bg-slate-950/60 dark:bg-slate-950/60 light:bg-white/80 p-3 rounded-xl border border-amber-500/20 dark:border-amber-500/20 light:border-amber-200 text-xs text-slate-300 dark:text-slate-300 light:text-slate-700 flex items-center justify-between">
            <span>Protocol: Safe Abstention is a core anti-hallucination feature for high-risk legal queries.</span>
            <span className="text-amber-400 dark:text-amber-400 light:text-amber-700 font-bold">Grounded Compliance: 100%</span>
          </div>
        </div>
      )}

      {/* 2. Top Header & Confidence Summary Card */}
      <div className="glass-card rounded-2xl p-6 transition-all shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-5 border-b border-slate-800 dark:border-slate-800 light:border-slate-200">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-cyan-950 dark:bg-cyan-950 light:bg-cyan-50 border border-cyan-500/40 dark:border-cyan-500/40 light:border-cyan-200 text-cyan-300 dark:text-cyan-300 light:text-cyan-800">
                Jurisdiction: {data.jurisdiction}
              </span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-800 dark:bg-slate-800 light:bg-slate-100 border border-slate-700 dark:border-slate-700 light:border-slate-200 text-slate-300 dark:text-slate-300 light:text-slate-700">
                ID: {data.id}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white dark:text-white light:text-slate-900 tracking-tight">
              {data.innovation_name}
            </h2>
            <p className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-500 mt-1">
              Synthesized from {data.sources.length} authoritative statutory documents & {data.citations.length} verified citation anchors.
            </p>
          </div>

          {/* Confidence Score & Review Indicator */}
          <div className="flex items-center gap-3">
            <div className="px-4 py-2.5 rounded-xl bg-slate-950/80 dark:bg-slate-950/80 light:bg-slate-50 border border-cyan-500/30 dark:border-cyan-500/30 light:border-cyan-200 text-right shadow-sm">
              <div className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-400 light:text-slate-500">
                {t.confidence}
              </div>
              <div className="text-xl font-black text-cyan-400 dark:text-cyan-400 light:text-cyan-700">
                {(data.confidence_score * 100).toFixed(0)}%
              </div>
            </div>

            {data.expert_review_recommended && (
              <div className="px-4 py-2.5 rounded-xl bg-amber-950/60 dark:bg-amber-950/60 light:bg-amber-50 border border-amber-500/40 dark:border-amber-500/40 light:border-amber-300 text-amber-300 dark:text-amber-300 light:text-amber-800 flex items-center gap-2.5 shadow-sm">
                <UserCheck className="w-5 h-5 text-amber-400 dark:text-amber-400 light:text-amber-600" />
                <div>
                  <div className="text-[10px] uppercase font-bold text-amber-400 dark:text-amber-400 light:text-amber-700">Escalation</div>
                  <div className="text-xs font-bold">{t.expertEscalation}</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Executive Summary */}
        <div className="mt-5 p-4 rounded-xl bg-slate-950/60 dark:bg-slate-950/60 light:bg-slate-50 border border-slate-800/80 dark:border-slate-800/80 light:border-slate-200 text-sm text-slate-200 dark:text-slate-200 light:text-slate-800 leading-relaxed shadow-sm">
          <span className="font-bold text-cyan-300 dark:text-cyan-300 light:text-cyan-700">Executive Summary: </span>
          {data.summary}
        </div>

        {/* Review Reasons */}
        {data.review_reasons.length > 0 && (
          <div className="mt-3.5 p-3.5 rounded-xl bg-amber-950/30 dark:bg-amber-950/30 light:bg-amber-50/80 border border-amber-500/20 dark:border-amber-500/20 light:border-amber-200 text-xs text-amber-200/90 dark:text-amber-200/90 light:text-amber-900 space-y-1">
            <div className="font-bold text-amber-300 dark:text-amber-300 light:text-amber-700 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5" />
              <span>Key Uncertainty & Review Factors:</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-slate-300 dark:text-slate-300 light:text-slate-700 pl-1">
              {data.review_reasons.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* 3. Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'overview'
              ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
              : 'bg-slate-900/80 dark:bg-slate-900/80 light:bg-slate-100 text-slate-400 dark:text-slate-400 light:text-slate-600 hover:text-white dark:hover:text-white light:hover:text-slate-900 border border-slate-800 dark:border-slate-800 light:border-slate-200'
          }`}
        >
          <FileCheck2 className="w-4 h-4" />
          <span>{t.classificationTab}</span>
        </button>

        <button
          onClick={() => setActiveTab('ip')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'ip'
              ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
              : 'bg-slate-900/80 dark:bg-slate-900/80 light:bg-slate-100 text-slate-400 dark:text-slate-400 light:text-slate-600 hover:text-white dark:hover:text-white light:hover:text-slate-900 border border-slate-800 dark:border-slate-800 light:border-slate-200'
          }`}
        >
          <Scale className="w-4 h-4" />
          <span>{t.ipTab}</span>
        </button>

        <button
          onClick={() => setActiveTab('tk')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'tk'
              ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
              : 'bg-slate-900/80 dark:bg-slate-900/80 light:bg-slate-100 text-slate-400 dark:text-slate-400 light:text-slate-600 hover:text-white dark:hover:text-white light:hover:text-slate-900 border border-slate-800 dark:border-slate-800 light:border-slate-200'
          }`}
        >
          <Leaf className="w-4 h-4" />
          <span>{t.tkTab}</span>
        </button>

        <button
          onClick={() => setActiveTab('regulatory')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'regulatory'
              ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
              : 'bg-slate-900/80 dark:bg-slate-900/80 light:bg-slate-100 text-slate-400 dark:text-slate-400 light:text-slate-600 hover:text-white dark:hover:text-white light:hover:text-slate-900 border border-slate-800 dark:border-slate-800 light:border-slate-200'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>{t.regTab}</span>
        </button>

        <button
          onClick={() => setActiveTab('scientific')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'scientific'
              ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
              : 'bg-slate-900/80 dark:bg-slate-900/80 light:bg-slate-100 text-slate-400 dark:text-slate-400 light:text-slate-600 hover:text-white dark:hover:text-white light:hover:text-slate-900 border border-slate-800 dark:border-slate-800 light:border-slate-200'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>{t.evidenceTab}</span>
        </button>

        <button
          onClick={() => setActiveTab('sources')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'sources'
              ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
              : 'bg-slate-900/80 dark:bg-slate-900/80 light:bg-slate-100 text-slate-400 dark:text-slate-400 light:text-slate-600 hover:text-white dark:hover:text-white light:hover:text-slate-900 border border-slate-800 dark:border-slate-800 light:border-slate-200'
          }`}
        >
          <ExternalLink className="w-4 h-4" />
          <span>{t.sourcesTab} ({data.sources.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('verification')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'verification'
              ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
              : 'bg-slate-900/80 dark:bg-slate-900/80 light:bg-slate-100 text-slate-400 dark:text-slate-400 light:text-slate-600 hover:text-white dark:hover:text-white light:hover:text-slate-900 border border-slate-800 dark:border-slate-800 light:border-slate-200'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>{t.verificationTab} ({data.citations.length})</span>
        </button>
      </div>

      {/* TAB CONTENT: Overview & Classification */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Classification Card */}
          <div className="glass-card rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-bold tracking-wider text-slate-400 dark:text-slate-400 light:text-slate-500">
                Primary Regulatory Classification
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/20 dark:bg-cyan-500/20 light:bg-cyan-100 text-cyan-300 dark:text-cyan-300 light:text-cyan-800 border border-cyan-500/30 dark:border-cyan-500/30 light:border-cyan-300">
                {(data.classification.confidence * 100).toFixed(0)}% Confidence
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 dark:bg-slate-950/80 light:bg-slate-50 border border-cyan-500/30 dark:border-cyan-500/30 light:border-cyan-200 shadow-sm">
              <h3 className="text-lg font-bold text-white dark:text-white light:text-slate-900">
                {data.classification.primary_category}
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-600 mt-1">
                Statute: <span className="text-cyan-300 dark:text-cyan-300 light:text-cyan-700 font-medium">{data.classification.applicable_statute}</span>
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-600">
                Authority: <span className="text-slate-200 dark:text-slate-200 light:text-slate-800 font-medium">{data.classification.regulatory_authority}</span>
              </p>
            </div>

            <div className="text-xs text-slate-300 dark:text-slate-300 light:text-slate-700 leading-relaxed">
              <span className="font-bold text-white dark:text-white light:text-slate-900">Classification Rationale: </span>
              {data.classification.reasoning}
            </div>

            {data.classification.secondary_categories.length > 0 && (
              <div className="pt-3 border-t border-slate-800 dark:border-slate-800 light:border-slate-200">
                <span className="text-xs font-semibold text-slate-400 dark:text-slate-400 light:text-slate-600">Alternative / Secondary Pathways:</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {data.classification.secondary_categories.map((cat, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-lg text-xs bg-slate-900 dark:bg-slate-900 light:bg-slate-100 border border-slate-700 dark:border-slate-700 light:border-slate-300 text-slate-300 dark:text-slate-300 light:text-slate-700">
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Clarifying Questions */}
          <div className="glass-card rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white dark:text-white light:text-slate-900 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-cyan-400 dark:text-cyan-400 light:text-cyan-600" />
              <span>Clarifying Questions for Precision Classification</span>
            </h3>

            {data.classification.clarifying_questions.length > 0 ? (
              <div className="space-y-3">
                {data.classification.clarifying_questions.map((cq) => (
                  <div key={cq.question_id} className="p-3.5 rounded-xl bg-slate-950/60 dark:bg-slate-950/60 light:bg-slate-50 border border-slate-800 dark:border-slate-800 light:border-slate-200 text-xs space-y-2 shadow-sm">
                    <p className="font-bold text-white dark:text-white light:text-slate-900">{cq.question_text}</p>
                    <p className="text-[11px] text-cyan-300/80 dark:text-cyan-300/80 light:text-cyan-700">{cq.impact_explanation}</p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {cq.options.map((opt, oi) => (
                        <span key={oi} className="px-2 py-0.5 rounded bg-slate-900 dark:bg-slate-900 light:bg-white border border-slate-700 dark:border-slate-700 light:border-slate-300 text-[11px] text-slate-300 dark:text-slate-300 light:text-slate-700">
                          • {opt}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-slate-950/40 dark:bg-slate-950/40 light:bg-slate-50 text-xs text-slate-400 dark:text-slate-400 light:text-slate-500 text-center">
                All statutory boundaries for this formulation are clear based on provided parameters.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB CONTENT: IP & Patents */}
      {activeTab === 'ip' && (
        <div className="glass-card rounded-2xl p-6 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 dark:border-slate-800 light:border-slate-200">
            <h3 className="text-base font-bold text-white dark:text-white light:text-slate-900 flex items-center gap-2">
              <Scale className="w-5 h-5 text-cyan-400 dark:text-cyan-400 light:text-cyan-600" />
              <span>Intellectual Property & Section 3(p) Traditional Knowledge Analysis</span>
            </h3>
            <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-500/20 dark:bg-amber-500/20 light:bg-amber-100 text-amber-300 dark:text-amber-300 light:text-amber-800 border border-amber-500/30 dark:border-amber-500/30 light:border-amber-300">
              {data.ip_considerations.patent_eligibility_status}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 dark:bg-slate-950/80 light:bg-slate-50 border border-slate-800 dark:border-slate-800 light:border-slate-200 space-y-2 shadow-sm">
            <h4 className="text-xs uppercase font-bold text-cyan-400 dark:text-cyan-400 light:text-cyan-700">
              Section 3(p) Patents Act 1970 Assessment
            </h4>
            <p className="text-xs text-slate-200 dark:text-slate-200 light:text-slate-800 leading-relaxed">
              {data.ip_considerations.sec_3p_analysis}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-950/50 dark:bg-slate-950/50 light:bg-slate-50 border border-slate-800 dark:border-slate-800 light:border-slate-200 space-y-1.5 shadow-sm">
              <span className="font-bold text-slate-300 dark:text-slate-300 light:text-slate-800">Novelty & Inventive Step Context</span>
              <p className="text-slate-400 dark:text-slate-400 light:text-slate-600 leading-relaxed">{data.ip_considerations.novelty_inventive_step_context}</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950/50 dark:bg-slate-950/50 light:bg-slate-50 border border-slate-800 dark:border-slate-800 light:border-slate-200 space-y-1.5 shadow-sm">
              <span className="font-bold text-slate-300 dark:text-slate-300 light:text-slate-800">Prior Art & Classical Texts Risk</span>
              <p className="text-slate-400 dark:text-slate-400 light:text-slate-600 leading-relaxed">{data.ip_considerations.prior_art_risk}</p>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-800 dark:border-slate-800 light:border-slate-200">
            <h4 className="text-xs font-bold text-white dark:text-white light:text-slate-900">Recommended Patent Claim Structuring:</h4>
            <ul className="space-y-1.5 text-xs text-slate-300 dark:text-slate-300 light:text-slate-700">
              {data.ip_considerations.recommendations.map((rec, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-cyan-400 dark:text-cyan-400 light:text-cyan-600 font-bold">›</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* TAB CONTENT: Traditional Knowledge & Biodiversity (ABS) */}
      {activeTab === 'tk' && (
        <div className="glass-card rounded-2xl p-6 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 dark:border-slate-800 light:border-slate-200">
            <h3 className="text-base font-bold text-white dark:text-white light:text-slate-900 flex items-center gap-2">
              <Leaf className="w-5 h-5 text-teal-400 dark:text-teal-400 light:text-teal-600" />
              <span>Traditional Knowledge & Access and Benefit Sharing (ABS)</span>
            </h3>
            <span className="text-xs text-teal-300 dark:text-teal-300 light:text-teal-800 font-semibold px-2.5 py-1 rounded-md bg-teal-950 dark:bg-teal-950 light:bg-teal-50 border border-teal-500/30 dark:border-teal-500/30 light:border-teal-200">
              National Biodiversity Authority (NBA)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-950/80 dark:bg-slate-950/80 light:bg-slate-50 border border-slate-800 dark:border-slate-800 light:border-slate-200 space-y-2 text-xs shadow-sm">
              <h4 className="font-bold text-teal-300 dark:text-teal-300 light:text-teal-700">Biological Diversity Act 2002 Applicability</h4>
              <p className="text-slate-300 dark:text-slate-300 light:text-slate-700 leading-relaxed">{data.tk_abs_context.nba_applicability}</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 dark:bg-slate-950/80 light:bg-slate-50 border border-slate-800 dark:border-slate-800 light:border-slate-200 space-y-2 text-xs shadow-sm">
              <h4 className="font-bold text-teal-300 dark:text-teal-300 light:text-teal-700">Filing Requirements & Approvals</h4>
              <p className="text-slate-300 dark:text-slate-300 light:text-slate-700 leading-relaxed">{data.tk_abs_context.form_requirements}</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/50 dark:bg-slate-950/50 light:bg-slate-50 border border-slate-800 dark:border-slate-800 light:border-slate-200 space-y-1.5 text-xs shadow-sm">
            <h4 className="font-bold text-slate-200 dark:text-slate-200 light:text-slate-800">Benefit Sharing Obligations</h4>
            <p className="text-slate-400 dark:text-slate-400 light:text-slate-600 leading-relaxed">{data.tk_abs_context.benefit_sharing_obligation}</p>
          </div>

          <div className="p-3 rounded-xl bg-cyan-950/40 dark:bg-cyan-950/40 light:bg-cyan-50 border border-cyan-500/20 dark:border-cyan-500/20 light:border-cyan-200 text-[11px] text-cyan-200/90 dark:text-cyan-200/90 light:text-cyan-800 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400 dark:text-cyan-400 light:text-cyan-600 shrink-0" />
            <span>{data.tk_abs_context.safe_handling_note}</span>
          </div>
        </div>
      )}

      {/* TAB CONTENT: Regulatory Pathway */}
      {activeTab === 'regulatory' && (
        <div className="glass-card rounded-2xl p-6 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 dark:border-slate-800 light:border-slate-200">
            <h3 className="text-base font-bold text-white dark:text-white light:text-slate-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-cyan-400 dark:text-cyan-400 light:text-cyan-600" />
              <span>Statutory Regulatory Pathway ({data.regulatory_pathway.target_jurisdiction})</span>
            </h3>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-800 dark:bg-slate-800 light:bg-slate-100 border border-slate-700 dark:border-slate-700 light:border-slate-200 text-slate-200 dark:text-slate-200 light:text-slate-800">
              {data.regulatory_pathway.licensing_category}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-950/80 dark:bg-slate-950/80 light:bg-slate-50 border border-slate-800 dark:border-slate-800 light:border-slate-200 space-y-2 shadow-sm">
              <span className="font-bold text-cyan-300 dark:text-cyan-300 light:text-cyan-700">Governing Authority</span>
              <p className="text-slate-200 dark:text-slate-200 light:text-slate-800">{data.regulatory_pathway.governing_authority}</p>
              <span className="font-bold text-cyan-300 dark:text-cyan-300 light:text-cyan-700 pt-2 block">Statutory Rules & Articles</span>
              <p className="text-slate-300 dark:text-slate-300 light:text-slate-700">{data.regulatory_pathway.statutory_rules}</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 dark:bg-slate-950/80 light:bg-slate-50 border border-slate-800 dark:border-slate-800 light:border-slate-200 space-y-2 shadow-sm">
              <span className="font-bold text-cyan-300 dark:text-cyan-300 light:text-cyan-700">Clinical & Safety Requirements</span>
              <p className="text-slate-300 dark:text-slate-300 light:text-slate-700">{data.regulatory_pathway.clinical_data_requirement}</p>
              <span className="font-bold text-cyan-300 dark:text-cyan-300 light:text-cyan-700 pt-2 block">Quality & Stability Standards</span>
              <p className="text-slate-300 dark:text-slate-300 light:text-slate-700">{data.regulatory_pathway.stability_and_safety_standards}</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: Scientific Evidence */}
      {activeTab === 'scientific' && (
        <div className="glass-card rounded-2xl p-6 space-y-4">
          <h3 className="text-base font-bold text-white dark:text-white light:text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-violet-400 dark:text-violet-400 light:text-violet-600" />
            <span>Peer-Reviewed Scientific Literature & Clinical Evidence</span>
          </h3>

          <div className="space-y-3">
            {data.scientific_evidence.map((sci, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-950/80 dark:bg-slate-950/80 light:bg-slate-50 border border-slate-800 dark:border-slate-800 light:border-slate-200 space-y-2 text-xs shadow-sm">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-bold text-white dark:text-white light:text-slate-900 text-sm">{sci.title}</h4>
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-violet-500/20 dark:bg-violet-500/20 light:bg-violet-100 text-violet-300 dark:text-violet-300 light:text-violet-800 border border-violet-500/30 dark:border-violet-500/30 light:border-violet-300 whitespace-nowrap">
                    {sci.study_type}
                  </span>
                </div>
                <p className="text-slate-400 dark:text-slate-400 light:text-slate-500 text-[11px]">
                  {sci.journal_or_publisher} • ({sci.year}) {sci.doi_or_pmid && `• Ref: ${sci.doi_or_pmid}`}
                </p>
                <p className="text-slate-300 dark:text-slate-300 light:text-slate-700 leading-relaxed bg-slate-900/60 dark:bg-slate-900/60 light:bg-white p-3 rounded-lg border border-slate-800/80 dark:border-slate-800/80 light:border-slate-200 shadow-sm">
                  <span className="font-bold text-violet-300 dark:text-violet-300 light:text-violet-700">Key Finding: </span>
                  {sci.key_findings}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: Curated Sources Explorer */}
      {activeTab === 'sources' && (
        <div className="glass-card rounded-2xl p-6 space-y-4">
          <h3 className="text-base font-bold text-white dark:text-white light:text-slate-900 flex items-center gap-2">
            <ExternalLink className="w-5 h-5 text-cyan-400 dark:text-cyan-400 light:text-cyan-600" />
            <span>Authoritative Source Corpus Registry</span>
          </h3>

          <div className="space-y-3">
            {data.sources.map((src) => (
              <div key={src.id} className="p-4 rounded-xl bg-slate-950/80 dark:bg-slate-950/80 light:bg-slate-50 border border-slate-800 dark:border-slate-800 light:border-slate-200 space-y-2 text-xs shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {getTierBadge(src.tier)}
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 dark:bg-slate-800 light:bg-slate-200 text-slate-300 dark:text-slate-300 light:text-slate-800">
                      {src.jurisdiction}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 dark:bg-slate-800 light:bg-slate-200 text-cyan-300 dark:text-cyan-300 light:text-cyan-800">
                      {src.document_type}
                    </span>
                  </div>
                  {src.source_url && (
                    <a
                      href={src.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-400 dark:text-cyan-400 light:text-cyan-700 hover:underline text-[11px] flex items-center gap-1 font-semibold"
                    >
                      <span>Official Source</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>

                <h4 className="font-bold text-white dark:text-white light:text-slate-900 text-sm">{src.title}</h4>
                <p className="text-slate-400 dark:text-slate-400 light:text-slate-600 text-[11px]">
                  Authority: <span className="text-slate-200 dark:text-slate-200 light:text-slate-800 font-semibold">{src.authority}</span>
                  {src.section_article && ` • Section: ${src.section_article}`}
                  {src.year_version && ` • Version: ${src.year_version}`}
                </p>

                {src.excerpt && (
                  <div className="p-3 rounded-lg bg-slate-900/70 dark:bg-slate-900/70 light:bg-white border border-slate-800 dark:border-slate-800 light:border-slate-200 text-slate-300 dark:text-slate-300 light:text-slate-700 font-mono text-[11px] leading-relaxed shadow-sm">
                    "{src.excerpt}"
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: Citation Verification */}
      {activeTab === 'verification' && (
        <div className="glass-card rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white dark:text-white light:text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400 dark:text-emerald-400 light:text-emerald-600" />
              <span>Grounded Citation Verification Engine</span>
            </h3>
            <span className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-500 font-medium">
              Zero Hallucination Protocol Active
            </span>
          </div>

          <div className="space-y-3">
            {data.citations.map((cit) => (
              <div key={cit.id} className="p-4 rounded-xl bg-slate-950/80 dark:bg-slate-950/80 light:bg-slate-50 border border-slate-800 dark:border-slate-800 light:border-slate-200 space-y-3 text-xs shadow-sm">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {getVerificationBadge(cit.verification_status)}
                    <span className="text-slate-400 dark:text-slate-400 light:text-slate-600 text-[11px]">
                      Grounding Score: <span className="text-emerald-400 dark:text-emerald-400 light:text-emerald-700 font-black">{(cit.grounding_score * 100).toFixed(0)}%</span>
                    </span>
                  </div>
                  {getTierBadge(cit.authority_tier)}
                </div>

                <div className="p-3 rounded-lg bg-slate-900/60 dark:bg-slate-900/60 light:bg-white border border-slate-800 dark:border-slate-800 light:border-slate-200 space-y-1 shadow-sm">
                  <span className="text-[11px] uppercase font-bold text-slate-400 dark:text-slate-400 light:text-slate-500">Synthesized Claim:</span>
                  <p className="text-white dark:text-white light:text-slate-900 font-semibold text-xs leading-relaxed">{cit.claim_text}</p>
                </div>

                <button 
                  onClick={() => toggleCitation(cit.id)}
                  className="text-xs text-cyan-400 dark:text-cyan-400 light:text-cyan-700 font-bold flex items-center gap-1 hover:underline"
                >
                  {expandedCitations[cit.id] ? "Hide Evidence" : "View Evidence"}
                </button>

                {expandedCitations[cit.id] && (
                  <div className="p-3 rounded-lg bg-emerald-950/20 dark:bg-emerald-950/20 light:bg-emerald-50/70 border border-emerald-500/20 dark:border-emerald-500/20 light:border-emerald-200 space-y-2 mt-2">
                    <span className="text-[11px] uppercase font-bold text-emerald-400 dark:text-emerald-400 light:text-emerald-700">Exact Retrieved Passage ({cit.authority_name}):</span>
                    <p className="text-slate-300 dark:text-slate-300 light:text-slate-700 italic text-[11px] leading-relaxed">"{cit.excerpt}"</p>
                    <div className="pt-2 mt-2 border-t border-emerald-500/10 text-[10px] text-emerald-300/80 grid grid-cols-2 gap-2">
                        <div><span className="font-bold">Source Title:</span> {cit.authority_name} Doc</div>
                        <div><span className="font-bold">Section:</span> {cit.section_ref || "N/A"}</div>
                        <div><span className="font-bold">Verification:</span> {cit.verification_status}</div>
                        {cit.source_url && (
                          <div className="col-span-2">
                             <span className="font-bold">Source URL:</span> <a href={cit.source_url} target="_blank" className="underline">{cit.source_url}</a>
                          </div>
                        )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
