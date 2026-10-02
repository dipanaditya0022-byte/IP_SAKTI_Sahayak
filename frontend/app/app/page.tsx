'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useState } from 'react';
import { InnovationCardView } from '@/components/innovation-card';
import { Button, Card, EmptyState, ErrorState, JurisdictionBadge, LinkButton, PageHeader, Spinner, Stat, fmtDateTime } from '@/components/ui';
import { get } from '@/lib/api';
import { useApp } from '@/lib/providers';
import type { InnovationCard, Jurisdiction } from '@/lib/types';

const JURISDICTION_OPTIONS: [Jurisdiction, string][] = [['IN', 'India'], ['US', 'USA'], ['AU', 'Australia']];

function ActiveJurisdiction() {
  const { jurisdictions, setJurisdictions } = useApp();
  const [editing, setEditing] = useState(false);
  const toggle = (j: Jurisdiction) => setJurisdictions(jurisdictions.includes(j) ? jurisdictions.filter((x) => x !== j) : [...jurisdictions, j]);
  return (
    <div className="mb-4 flex flex-wrap items-center gap-2 text-sm">
      <span className="text-text-secondary">{jurisdictions.length > 1 ? 'Active jurisdictions' : 'Active jurisdiction'}:</span>
      {jurisdictions.length ? jurisdictions.map((j) => <JurisdictionBadge key={j} j={j} />) : <span className="text-text-muted">None selected</span>}
      <Button variant="ghost" size="sm" onClick={() => setEditing((v) => !v)}>Change</Button>
      {editing && (
        <fieldset className="flex items-center gap-3 rounded-md border border-surface-border bg-surface-elevated px-3 py-1.5 text-xs">
          {JURISDICTION_OPTIONS.map(([code, name]) => (
            <label key={code} className="flex items-center gap-1.5">
              <input type="checkbox" checked={jurisdictions.includes(code)} onChange={() => toggle(code)} />
              {name}
            </label>
          ))}
        </fieldset>
      )}
    </div>
  );
}

const ACTION_LABEL: Record<string, string> = {
  login: 'signed in', innovation_created: 'created innovation', innovation_updated: 'updated', profile_generated: 'generated profile',
  search_started: 'started research', search_completed: 'completed research', citation_verified: 'verified a citation',
  report_generated: 'generated a report', report_exported: 'exported a report', escalation_created: 'created an escalation',
  document_ingested: 'ingested a document', document_viewed: 'viewed a document', evidence_added: 'added evidence',
  classification_analyzed: 'ran classification', analysis_completed: 'completed analysis', gap_status_changed: 'updated a gap',
  workspace_setting_changed: 'changed workspace settings', source_modified: 'modified a source', escalation_status_changed: 'updated an escalation',
};

export default function Dashboard() {
  const { t, user } = useApp();
  const dash = useQuery({ queryKey: ['dashboard'], queryFn: () => get('/dashboard') });
  const inns = useQuery({ queryKey: ['innovations'], queryFn: () => get<InnovationCard[]>('/innovations') });
  const s = dash.data?.stats;

  return (
    <div>
      <PageHeader
        eyebrow={t.nav.dashboard}
        title={`Welcome, ${user?.name.split(' ')[0]}`}
        subtitle="Your workspace's innovations, evidence and open review items."
        actions={<><LinkButton href="/app/assistant" variant="secondary">{t.nav.assistant}</LinkButton><LinkButton href="/app/innovations/new">{t.nav.createInnovation}</LinkButton></>}
      />
      <ActiveJurisdiction />
      {dash.isError ? (
        <ErrorState error={dash.error} onRetry={() => dash.refetch()} />
      ) : (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-7">
          <Stat label="Total innovations" value={s?.total_innovations ?? '…'} href="/app/innovations" />
          <Stat label="Active research" value={s?.active_research ?? '…'} />
          <Stat label="Evidence found" value={s?.evidence_found ?? '…'} hint="passages linked" href="/app/analysis/evidence" />
          <Stat label="Prior-art matches" value={s?.prior_art_matches ?? '…'} hint="distinct patents" href="/app/research/patents" />
          <Stat label="Evidence gaps" value={s?.evidence_gaps ?? '…'} hint="open" href="/app/analysis/gaps" />
          <Stat label="Pending reviews" value={s?.pending_reviews ?? '…'} hint="patent matches" />
          <Stat label="Open escalations" value={s?.open_escalations ?? '…'} href="/app/escalations" />
        </div>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-text-secondary">Recent innovations</h2>
          {inns.isLoading && <Spinner />}
          {inns.isError && <ErrorState error={inns.error} onRetry={() => inns.refetch()} />}
          {inns.data && inns.data.length === 0 && (
            <EmptyState title="No innovations yet" action={<LinkButton href="/app/innovations/new">{t.nav.createInnovation}</LinkButton>}>
              Profile your first formulation to start evidence discovery.
            </EmptyState>
          )}
          <div className="grid gap-3 md:grid-cols-2">
            {inns.data?.slice(0, 6).map((i) => <InnovationCardView key={i.id} inn={i} />)}
          </div>
        </div>
        <Card title="Recent activity" actions={<Link href="/app/audit" className="text-xs underline">Audit trail</Link>}>
          {dash.isLoading && <Spinner />}
          {dash.data?.recent_activity?.length === 0 && <p className="text-sm text-text-muted">No activity yet.</p>}
          <ol className="space-y-2.5">
            {dash.data?.recent_activity?.map((a: any, i: number) => (
              <li key={i} className="text-xs">
                <span className="font-medium">{a.user || 'System'}</span> {ACTION_LABEL[a.action] || a.action.replace(/_/g, ' ')}
                {a.entity_name && (
                  <> — <Link className="underline" href={`/app/innovations/${a.entity_id}`}>{a.entity_name}</Link></>
                )}
                <div className="text-text-muted">{fmtDateTime(a.created_at)}</div>
              </li>
            ))}
          </ol>
        </Card>
      </div>
    </div>
  );
}
