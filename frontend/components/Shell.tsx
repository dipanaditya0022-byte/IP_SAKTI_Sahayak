import React from 'react';
import { ShieldCheck, Search, Database, BarChart3, Settings, History, GitCompare } from 'lucide-react';

export function Shell({
  children,
  currentTab,
  onNavigate,
}: {
  children: React.ReactNode;
  currentTab: string;
  onNavigate: (tab: string) => void;
}) {
  return (
    <div className="flex h-screen w-full bg-darkbg overflow-hidden selection:bg-accent selection:text-white">
      {/* Sidebar */}
      <aside className="w-[250px] flex-shrink-0 bg-deep-green text-surface flex flex-col justify-between hidden md:flex z-20">
        <div>
          {/* Logo */}
          <div className="h-20 flex items-center px-6 mb-4">
            <div className="flex items-center gap-3 select-none">
              <ShieldCheck className="w-6 h-6 text-accent" />
              <div className="font-serif tracking-widest text-[16px] text-surface uppercase">
                IP-SAKTI <span className="font-sans font-normal text-surface/80 text-[12px] ml-1 block mt-[-4px]">Sahayak</span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="px-3 space-y-1">
            <NavItem 
              icon={<Search className="w-4 h-4" />} 
              label="New Research" 
              active={currentTab === 'analyze'} 
              onClick={() => onNavigate('analyze')} 
            />
            <NavItem 
              icon={<Database className="w-4 h-4" />} 
              label="Source Library" 
              active={currentTab === 'corpus'} 
              onClick={() => onNavigate('corpus')} 
            />
            <NavItem 
              icon={<GitCompare className="w-4 h-4" />} 
              label="Compare Regimes" 
              active={currentTab === 'compare'} 
              onClick={() => onNavigate('compare')} 
            />
            <NavItem 
              icon={<History className="w-4 h-4" />} 
              label="Research History" 
              active={currentTab === 'history'} 
              onClick={() => onNavigate('history')} 
            />
            <NavItem 
              icon={<BarChart3 className="w-4 h-4" />} 
              label="Trust Evaluation" 
              active={currentTab === 'eval'} 
              onClick={() => onNavigate('eval')} 
            />
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="p-3 border-t border-green">
          <div className="flex items-center gap-2 px-3 py-2 text-[12px] font-medium tracking-wide text-surface/70 mb-1">
            <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse shadow-[0_0_4px_rgba(201,162,74,0.5)]" />
            System Online
          </div>
          <button className="w-full flex items-center gap-3 px-3 py-2 text-[13px] font-medium text-surface/70 hover:text-surface hover:bg-green rounded-md transition-colors">
            <Settings className="w-4 h-4" />
            Settings
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative min-w-0 overflow-y-auto">
        <div className="flex-1 w-full mx-auto relative">
          {children}
        </div>
      </main>
    </div>
  );
}

function NavItem({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-[8px] text-[13px] font-medium transition-all duration-200 ${
        active 
          ? 'bg-green text-surface shadow-sm' 
          : 'text-surface/70 hover:text-surface hover:bg-green/50'
      }`}
    >
      <span className={active ? 'text-accent' : 'text-surface/70'}>{icon}</span>
      {label}
    </button>
  );
}
