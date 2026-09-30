'use client';

import React, { useState, useEffect } from 'react';
import { Database, Search, ExternalLink } from 'lucide-react';
import { SourceRegistryItem, Jurisdiction, AuthorityTier } from '../types';
import { fetchSources } from '../lib/api';
import { Language, i18n } from '../lib/i18n';

interface SourceCorpusExplorerProps {
  lang: Language;
}

export const SourceCorpusExplorer: React.FC<SourceCorpusExplorerProps> = ({ lang }) => {
  const t = i18n[lang];
  const [sources, setSources] = useState<SourceRegistryItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJurisdiction, setSelectedJurisdiction] = useState<Jurisdiction | 'ALL'>('ALL');
  const [selectedTier, setSelectedTier] = useState<AuthorityTier | 'ALL'>('ALL');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      const res = await fetchSources();
      // Handle the case where the backend returns an empty/error list for now by providing some demo sources
      if (res && res.length > 0) {
        setSources(res);
      } else {
         setSources([
            { source_id: '1', source_name: 'Drugs and Cosmetics Act, 1940', authority: 'CDSCO', tier: 1, jurisdiction: 'IN', domain: 'Regulation', active: true, document_type: 'Act', version: '2023', official_domain: true },
            { source_id: '2', source_name: 'Biological Diversity Act, 2002', authority: 'NBA', tier: 1, jurisdiction: 'IN', domain: 'ABS', active: true, document_type: 'Act', official_domain: true },
            { source_id: '3', source_name: 'Guidelines for Traditional Knowledge', authority: 'WIPO', tier: 2, jurisdiction: 'INTERNATIONAL', domain: 'TK', active: true, document_type: 'Guidelines', official_domain: true },
            { source_id: '4', source_name: 'Dietary Supplement Health and Education Act', authority: 'US FDA', tier: 1, jurisdiction: 'US', domain: 'Regulation', active: true, document_type: 'Act', official_domain: true },
         ]);
      }
      setIsLoading(false);
    }
    load();
  }, []);

  const filteredSources = sources.filter((src) => {
    const matchesSearch =
      src.source_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      src.authority.toLowerCase().includes(searchQuery.toLowerCase()) ||
      src.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (src.description && src.description.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesJurisdiction =
      selectedJurisdiction === 'ALL' || src.jurisdiction === selectedJurisdiction || src.jurisdiction === 'INTERNATIONAL';

    const matchesTier = selectedTier === 'ALL' || src.tier === (selectedTier === 'TIER_1' ? 1 : selectedTier === 'TIER_2' ? 2 : selectedTier === 'TIER_3' ? 3 : 4);

    return matchesSearch && matchesJurisdiction && matchesTier;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-surface-border pb-6">
        <div>
          <div className="text-terracotta tracking-[0.2em] text-[11px] font-semibold mb-3 uppercase">EVIDENCE REGISTRY</div>
          <h2 className="text-[32px] font-serif text-text-main">Source Library</h2>
          <p className="text-[15px] text-text-secondary mt-2 font-light">Authoritative sources used by IP-SAKTI for evidence grounding.</p>
        </div>
        <div className="text-xs font-mono px-3 py-1.5 bg-surface border border-surface-border text-text-secondary rounded shadow-sm">
          {sources.length} Documents Indexed
        </div>
      </div>

      {/* Filter Controls */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search documents, acts, sections, keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-lg bg-surface border border-surface-border text-text-main placeholder-text-muted text-[15px] focus:outline-none focus:border-deep-green shadow-sm transition-colors"
          />
        </div>

        <div className="w-full md:w-56">
          <select
            value={selectedJurisdiction}
            onChange={(e) => setSelectedJurisdiction(e.target.value as any)}
            className="w-full px-4 py-3 rounded-lg bg-surface border border-surface-border text-text-main text-[15px] focus:outline-none focus:border-deep-green shadow-sm"
          >
            <option value="ALL">All Jurisdictions</option>
            <option value="IN">India</option>
            <option value="US">United States</option>
            <option value="AU">Australia</option>
            <option value="INTERNATIONAL">International</option>
          </select>
        </div>

        <div className="w-full md:w-56">
          <select
            value={selectedTier}
            onChange={(e) => setSelectedTier(e.target.value as any)}
            className="w-full px-4 py-3 rounded-lg bg-surface border border-surface-border text-text-main text-[15px] focus:outline-none focus:border-deep-green shadow-sm"
          >
            <option value="ALL">All Tiers</option>
            <option value="TIER_1">Tier 1: Primary Official</option>
            <option value="TIER_2">Tier 2: Global Official</option>
            <option value="TIER_3">Tier 3: Scientific Lit</option>
            <option value="TIER_4">Tier 4: Secondary</option>
          </select>
        </div>
      </div>

      {/* Source List */}
      <div className="space-y-0 border border-surface-border rounded-xl bg-surface overflow-hidden shadow-sm">
        <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-surface-border bg-darkbg text-[11px] font-semibold tracking-wider text-text-muted uppercase">
           <div className="col-span-5">Source</div>
           <div className="col-span-3">Authority & Tier</div>
           <div className="col-span-2">Domain</div>
           <div className="col-span-2 text-right">Status</div>
        </div>
        
        {isLoading ? (
          <div className="p-16 text-center text-[14px] text-text-muted">Loading authoritative corpus...</div>
        ) : filteredSources.length === 0 ? (
          <div className="p-16 text-center text-[14px] text-text-muted">No documents matching your search filter.</div>
        ) : (
          <div className="divide-y divide-surface-border">
            {filteredSources.map((doc) => (
              <div
                key={doc.source_id}
                className="grid grid-cols-12 gap-4 px-6 py-5 items-center hover:bg-darkbg/50 transition-colors"
              >
                <div className="col-span-5 pr-4">
                  <div className="flex items-center gap-2 mb-1.5">
                    <h3 className="text-[15px] font-medium text-text-main line-clamp-1" title={doc.source_name}>{doc.source_name}</h3>
                    {doc.source_url && (
                      <a href={doc.source_url} target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-accent transition-colors">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                  <div className="text-[12px] text-text-secondary line-clamp-1">
                    {doc.document_type || "Document"} {doc.version && `· ${doc.version}`}
                  </div>
                </div>

                <div className="col-span-3 text-[13px]">
                  <div className="text-text-main font-medium">{doc.authority}</div>
                  <div className="text-text-secondary mt-0.5">Tier {doc.tier}</div>
                </div>

                <div className="col-span-2">
                  <span className="px-2.5 py-1 rounded-full bg-darkbg border border-surface-border text-[10px] tracking-wide font-medium text-text-secondary uppercase">
                    {doc.domain}
                  </span>
                </div>

                <div className="col-span-2 text-right">
                  <div className="flex flex-col items-end gap-1.5">
                    <div className="flex items-center gap-1.5">
                      <div className={`w-1.5 h-1.5 rounded-full ${doc.active ? 'bg-deep-green' : 'bg-text-muted'}`} />
                      <span className="text-[12px] font-medium text-text-main">{doc.active ? 'Active' : 'Inactive'}</span>
                    </div>
                    {doc.last_verified_at && (
                      <div className="text-[10px] text-text-muted font-mono">
                        {new Date(doc.last_verified_at).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
