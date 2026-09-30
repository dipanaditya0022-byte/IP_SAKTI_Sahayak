'use client';

import React from 'react';
import { Sparkles, ShieldAlert, ArrowRight } from 'lucide-react';
import { Language, i18n } from '../lib/i18n';

interface HeroSectionProps {
  lang: Language;
  onSelectScenario: (scenarioId: string) => void;
  activeScenario?: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ lang, onSelectScenario, activeScenario }) => {
  const t = i18n[lang];

  return (
    <section className="relative pt-6 pb-4">
      {/* Ambient background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-48 bg-gradient-to-r from-cyan-500/10 via-violet-500/10 to-teal-500/10 blur-3xl pointer-events-none -z-10" />

      <div className="text-center max-w-4xl mx-auto space-y-3.5 px-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/70 dark:bg-cyan-950/70 light:bg-cyan-50 border border-cyan-500/30 dark:border-cyan-500/30 light:border-cyan-200 text-cyan-300 dark:text-cyan-300 light:text-cyan-800 text-xs font-semibold shadow-sm">
          <Sparkles className="w-3.5 h-3.5 animate-pulse text-cyan-400 dark:text-cyan-400 light:text-cyan-600" />
          <span>SIH Official Intelligence Copilot — Evidence Grounded</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white dark:text-white light:text-slate-900 leading-tight">
          {t.heroTitle}
        </h1>

        <p className="text-sm sm:text-base text-slate-300 dark:text-slate-300 light:text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
          {t.heroSubtitle}
        </p>

        {/* Demo Notice Bar */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-amber-950/40 dark:bg-amber-950/40 light:bg-amber-50 border border-amber-500/30 dark:border-amber-500/30 light:border-amber-200 text-amber-200 dark:text-amber-200 light:text-amber-800 text-xs font-medium shadow-sm">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-400 dark:text-amber-400 light:text-amber-600" />
          <span>{t.demoDataWarning}</span>
        </div>
      </div>

      {/* 3 Official Demo Scenario Selectors */}
      <div className="mt-8 max-w-5xl mx-auto px-4">
        <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-400 light:text-slate-500 mb-3 flex items-center justify-between">
          <span>{t.quickDemoScenarios}</span>
          <span className="text-[11px] text-cyan-400 dark:text-cyan-400 light:text-cyan-600 font-medium">Click a scenario to load pre-verified dossier</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {/* Scenario A */}
          <div
            onClick={() => onSelectScenario('scenario_a')}
            className={`cursor-pointer p-4 rounded-2xl border transition-all relative overflow-hidden ${
              activeScenario === 'scenario_a'
                ? 'bg-gradient-to-b from-cyan-950/70 to-slate-900 dark:from-cyan-950/70 dark:to-slate-900 light:from-cyan-50/90 light:to-white border-cyan-400/80 dark:border-cyan-400/80 light:border-cyan-500 shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-400/50'
                : 'glass-card hover:border-cyan-500/50 hover:shadow-md'
            }`}
          >
            <div className="flex items-start justify-between">
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-cyan-500/20 dark:bg-cyan-500/20 light:bg-cyan-100 text-cyan-300 dark:text-cyan-300 light:text-cyan-800 border border-cyan-500/30 dark:border-cyan-500/30 light:border-cyan-300">
                SCENARIO A
              </span>
              <span className="text-[10px] text-slate-400 dark:text-slate-400 light:text-slate-500 font-medium">India Jurisdiction</span>
            </div>
            <h4 className="text-sm font-semibold text-white dark:text-white light:text-slate-900 mt-2.5">
              {t.scenarioA}
            </h4>
            <p className="text-xs text-slate-300 dark:text-slate-300 light:text-slate-600 mt-1 line-clamp-2">
              {t.scenarioADesc}
            </p>
            <div className="mt-3 flex items-center text-xs font-semibold text-cyan-400 dark:text-cyan-400 light:text-cyan-600 gap-1">
              <span>Load Scenario</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Scenario B */}
          <div
            onClick={() => onSelectScenario('scenario_b')}
            className={`cursor-pointer p-4 rounded-2xl border transition-all relative overflow-hidden ${
              activeScenario === 'scenario_b'
                ? 'bg-gradient-to-b from-teal-950/70 to-slate-900 dark:from-teal-950/70 dark:to-slate-900 light:from-teal-50/90 light:to-white border-teal-400/80 dark:border-teal-400/80 light:border-teal-500 shadow-lg shadow-teal-500/20 ring-1 ring-teal-400/50'
                : 'glass-card hover:border-teal-500/50 hover:shadow-md'
            }`}
          >
            <div className="flex items-start justify-between">
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-teal-500/20 dark:bg-teal-500/20 light:bg-teal-100 text-teal-300 dark:text-teal-300 light:text-teal-800 border border-teal-500/30 dark:border-teal-500/30 light:border-teal-300">
                SCENARIO B
              </span>
              <span className="text-[10px] text-slate-400 dark:text-slate-400 light:text-slate-500 font-medium">IP + ABS</span>
            </div>
            <h4 className="text-sm font-semibold text-white dark:text-white light:text-slate-900 mt-2.5">
              {t.scenarioB}
            </h4>
            <p className="text-xs text-slate-300 dark:text-slate-300 light:text-slate-600 mt-1 line-clamp-2">
              {t.scenarioBDesc}
            </p>
            <div className="mt-3 flex items-center text-xs font-semibold text-teal-400 dark:text-teal-400 light:text-teal-600 gap-1">
              <span>Load Scenario</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Scenario C */}
          <div
            onClick={() => onSelectScenario('scenario_c')}
            className={`cursor-pointer p-4 rounded-2xl border transition-all relative overflow-hidden ${
              activeScenario === 'scenario_c'
                ? 'bg-gradient-to-b from-violet-950/70 to-slate-900 dark:from-violet-950/70 dark:to-slate-900 light:from-violet-50/90 light:to-white border-violet-400/80 dark:border-violet-400/80 light:border-violet-500 shadow-lg shadow-violet-500/20 ring-1 ring-violet-400/50'
                : 'glass-card hover:border-violet-500/50 hover:shadow-md'
            }`}
          >
            <div className="flex items-start justify-between">
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-violet-500/20 dark:bg-violet-500/20 light:bg-violet-100 text-violet-300 dark:text-violet-300 light:text-violet-800 border border-violet-500/30 dark:border-violet-500/30 light:border-violet-300">
                SCENARIO C
              </span>
              <span className="text-[10px] text-amber-300 dark:text-amber-300 light:text-amber-700 font-semibold">Safe Abstention</span>
            </div>
            <h4 className="text-sm font-semibold text-white dark:text-white light:text-slate-900 mt-2.5">
              {t.scenarioC}
            </h4>
            <p className="text-xs text-slate-300 dark:text-slate-300 light:text-slate-600 mt-1 line-clamp-2">
              {t.scenarioCDesc}
            </p>
            <div className="mt-3 flex items-center text-xs font-semibold text-violet-400 dark:text-violet-400 light:text-violet-600 gap-1">
              <span>Load Scenario</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
