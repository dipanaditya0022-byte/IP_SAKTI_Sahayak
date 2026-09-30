'use client';

import React from 'react';
import { ShieldCheck, Database, BarChart3, Sparkles, Sun, Moon } from 'lucide-react';
import { Language, i18n } from '../lib/i18n';

interface HeaderProps {
  currentTab: 'analyze' | 'corpus' | 'eval';
  setCurrentTab: (tab: 'analyze' | 'corpus' | 'eval') => void;
  lang: Language;
  setLang: (lang: Language) => void;
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  lang,
  setLang,
  theme,
  setTheme,
}) => {
  const t = i18n[lang];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#070b14]/85 dark:bg-[#070b14]/90 light:bg-white/85 border-b border-cyan-500/20 dark:border-cyan-500/20 light:border-slate-200 px-4 lg:px-8 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo & Name */}
        <div
          onClick={() => setCurrentTab('analyze')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-teal-500 to-violet-600 p-[1.5px] shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-400/40 transition-all">
            <div className="w-full h-full bg-[#070B14] dark:bg-[#070B14] light:bg-white rounded-[10px] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-cyan-400 dark:text-cyan-400 light:text-cyan-600 group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-cyan-300 dark:from-white dark:to-cyan-300 light:from-slate-900 light:via-slate-800 light:to-cyan-700 bg-clip-text text-transparent">
                {t.appTitle}
              </span>
              <span className="px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded border border-cyan-400/30 bg-cyan-950/60 dark:bg-cyan-950/60 dark:text-cyan-300 light:bg-cyan-50 light:border-cyan-200 light:text-cyan-700">
                SIH MVP
              </span>
            </div>
            <p className="text-[11px] text-slate-400 dark:text-slate-400 light:text-slate-500 hidden sm:block">
              {t.appTagline}
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1.5 p-1 bg-slate-900/80 dark:bg-slate-900/80 light:bg-slate-100 rounded-xl border border-slate-800 dark:border-slate-800 light:border-slate-200 shadow-sm">
          <button
            onClick={() => setCurrentTab('analyze')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              currentTab === 'analyze'
                ? 'bg-gradient-to-r from-cyan-500/20 to-violet-500/20 dark:from-cyan-500/20 dark:to-violet-500/20 light:bg-white text-cyan-300 dark:text-cyan-300 light:text-cyan-700 border border-cyan-500/40 dark:border-cyan-500/40 light:border-cyan-300 shadow-sm'
                : 'text-slate-400 dark:text-slate-400 light:text-slate-600 hover:text-slate-200 dark:hover:text-slate-200 light:hover:text-slate-900 hover:bg-slate-800/60 dark:hover:bg-slate-800/60 light:hover:bg-slate-200/60'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 dark:text-cyan-400 light:text-cyan-600" />
            <span>{t.navNewAnalysis}</span>
          </button>

          <button
            onClick={() => setCurrentTab('corpus')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              currentTab === 'corpus'
                ? 'bg-gradient-to-r from-cyan-500/20 to-violet-500/20 dark:from-cyan-500/20 dark:to-violet-500/20 light:bg-white text-cyan-300 dark:text-cyan-300 light:text-cyan-700 border border-cyan-500/40 dark:border-cyan-500/40 light:border-cyan-300 shadow-sm'
                : 'text-slate-400 dark:text-slate-400 light:text-slate-600 hover:text-slate-200 dark:hover:text-slate-200 light:hover:text-slate-900 hover:bg-slate-800/60 dark:hover:bg-slate-800/60 light:hover:bg-slate-200/60'
            }`}
          >
            <Database className="w-3.5 h-3.5 text-teal-400 dark:text-teal-400 light:text-teal-600" />
            <span>{t.navCorpus}</span>
          </button>

          <button
            onClick={() => setCurrentTab('eval')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              currentTab === 'eval'
                ? 'bg-gradient-to-r from-cyan-500/20 to-violet-500/20 dark:from-cyan-500/20 dark:to-violet-500/20 light:bg-white text-cyan-300 dark:text-cyan-300 light:text-cyan-700 border border-cyan-500/40 dark:border-cyan-500/40 light:border-cyan-300 shadow-sm'
                : 'text-slate-400 dark:text-slate-400 light:text-slate-600 hover:text-slate-200 dark:hover:text-slate-200 light:hover:text-slate-900 hover:bg-slate-800/60 dark:hover:bg-slate-800/60 light:hover:bg-slate-200/60'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-violet-400 dark:text-violet-400 light:text-violet-600" />
            <span>{t.navEvaluation}</span>
          </button>
        </nav>

        {/* Right Controls: Theme Toggle + Language Switcher */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Theme Toggle Button */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            className="p-2 rounded-xl bg-slate-900 dark:bg-slate-900 light:bg-slate-100 border border-slate-700/80 dark:border-slate-700/80 light:border-slate-200 text-slate-300 dark:text-slate-300 light:text-slate-700 hover:border-cyan-400 transition-all cursor-pointer shadow-sm"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400 animate-spin-slow" />
            ) : (
              <Moon className="w-4 h-4 text-cyan-700" />
            )}
          </button>

          {/* Language Switcher */}
          <div className="flex items-center bg-slate-900 dark:bg-slate-900 light:bg-slate-100 border border-slate-700/80 dark:border-slate-700/80 light:border-slate-200 rounded-xl p-0.5 shadow-sm">
            <button
              onClick={() => setLang('en')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                lang === 'en'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 dark:text-slate-400 light:text-slate-600 hover:text-white dark:hover:text-white light:hover:text-slate-900'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLang('hi')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                lang === 'hi'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 dark:text-slate-400 light:text-slate-600 hover:text-white dark:hover:text-white light:hover:text-slate-900'
              }`}
            >
              हिंदी
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
