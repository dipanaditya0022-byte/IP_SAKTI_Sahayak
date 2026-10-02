'use client';

import {
  Beaker, BookOpenCheck, Building2, ChevronDown, CircleHelp, Database, FileSearch, FlaskConical, GitBranch,
  Landmark, Leaf, ListChecks, Microscope, MessagesSquare, Scale, ScrollText, Search, ShieldAlert,
  ShieldCheck, UserCheck,
} from 'lucide-react';
import Link from 'next/link';
import { LinkButton, Popover, Stat } from '@/components/ui';
import { useApp } from '@/lib/providers';
import type { Jurisdiction } from '@/lib/types';

const JURISDICTION_OPTIONS: [Jurisdiction, string][] = [['IN', 'India'], ['US', 'USA'], ['AU', 'Australia']];

const CAPABILITIES = [
  { icon: Leaf, title: 'Innovation Intelligence', text: 'Guided profiler turns a formulation into structured, normalised technical features.' },
  { icon: FileSearch, title: 'Patent & Prior Art', text: 'Feature-to-document matrix with patent-family grouping. Overlap, never verdicts.' },
  { icon: FlaskConical, title: 'Scientific Evidence', text: 'Study cards that keep ingredient evidence separate from finished-formulation evidence.' },
  { icon: BookOpenCheck, title: 'Traditional Knowledge Context', text: 'Public and authorised TK context with explicit access limits. No TKDL scraping.' },
  { icon: Landmark, title: 'Regulatory Navigation', text: 'Provisional pathways for India, USA and Australia with a side-by-side passport.' },
  { icon: ScrollText, title: 'Citation Verification', text: 'Every claim is checked against its cited passage: supported, partial, unsupported, conflicting.' },
  { icon: GitBranch, title: 'Evidence Graph', text: 'Interactive graph where every edge carries provenance back to a source passage.' },
  { icon: UserCheck, title: 'Human Escalation', text: 'One-click review packets for IP, regulatory and domain experts, with a full audit trail.' },
];

const PIPELINE = [
  { icon: Search, title: 'Understand', text: 'The query is parsed for intent, jurisdiction and domain terminology — Sanskrit, Hindi, botanical and chemical names are normalised and ambiguities are flagged.' },
  { icon: Database, title: 'Retrieve', text: 'A hybrid search combines pgvector dense retrieval, Postgres full-text search, source metadata and graph expansion over the curated corpus.' },
  { icon: ListChecks, title: 'Rerank', text: 'Candidates are deterministically reranked on relevance, lexical match, jurisdiction, authority tier, freshness and document type.' },
  { icon: MessagesSquare, title: 'Generate', text: 'An answer is drafted — synthesised when an LLM is configured, or assembled from direct quotes when it is not.' },
  { icon: ShieldCheck, title: 'Verify', text: 'Every claim is bound back to a specific passage and checked for existence, authority, jurisdiction, freshness and semantic support.' },
  { icon: ShieldAlert, title: 'Abstain', text: 'If the evidence is missing, conflicting or out of scope, the system says so explicitly instead of guessing.' },
];

const PERSONAS = [
  { icon: Building2, title: 'Ayurveda startups & MSMEs', text: 'Move from a formulation idea to a structured profile, a classification and a regulatory pathway, without guessing which rules apply where.' },
  { icon: Scale, title: 'Patent & IP professionals', text: 'Get a feature-to-document matrix and patent-family grouping to scope prior-art search before deciding where to spend drafting effort.' },
  { icon: Landmark, title: 'Regulatory affairs teams', text: 'Compare provisional pathways across India, USA and Australia side by side, with the assumptions and open questions made explicit.' },
  { icon: Microscope, title: 'Academic & clinical researchers', text: 'Separate ingredient-level evidence from finished-formulation evidence, and see exactly which passage backs every claim.' },
];

const FAQ = [
  { q: 'Is this legal, regulatory or medical advice?', a: 'No. IP-SAKTI Sahayak is decision support only. It does not determine patentability, freedom to operate, regulatory approval or efficacy, and using it does not create attorney-client privilege. Outputs are a starting point for a qualified professional, not a replacement for one.' },
  { q: 'What happens when the evidence is missing or conflicting?', a: 'The system abstains rather than guesses. It states what was searched, what is missing or conflicting, and what would be needed to answer with confidence — instead of producing a confident-sounding but unsupported answer.' },
  { q: 'How is Traditional Knowledge handled?', a: 'The system has no TKDL access and never scrapes or reproduces restricted records. Only public or authorised TK context is surfaced, with explicit access limits, attribution and an escalation path for anything that needs expert review.' },
  { q: 'Which jurisdictions are covered, and are they mixed together?', a: 'India (AYUSH, CDSCO, FSSAI, IP India, NBA), the USA (FDA) and Australia (TGA) are covered, and kept strictly separate — the system never blends rules from one jurisdiction into an answer about another.' },
  { q: 'Is seeded or demo data clearly marked?', a: 'Yes. Short excerpts of real public instruments are labelled as summaries to verify against the original text; fictional demo patents and guidance notes are labelled fictional; user uploads are labelled unverified until reviewed.' },
  { q: 'Can I bring my own language model?', a: 'Yes. The backend works with a free local model (Ollama) out of the box, or can be pointed at Gemini, Groq, Grok, OpenAI or DeepSeek. Without a configured provider it still answers — by quoting retrieved passages directly instead of synthesising text.' },
];

export default function Landing() {
  const { t, lang, setLang, user, jurisdictions, setJurisdictions } = useApp();
  const toggleJurisdiction = (j: Jurisdiction) =>
    setJurisdictions(jurisdictions.includes(j) ? jurisdictions.filter((x) => x !== j) : [...jurisdictions, j]);
  const jurisdictionLabel = jurisdictions.length
    ? JURISDICTION_OPTIONS.filter(([code]) => jurisdictions.includes(code)).map(([, name]) => name).join(', ')
    : 'Select jurisdiction';
  return (
    <div className="min-h-screen">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded bg-deep-green font-serif text-gold">स</div>
          <span className="font-semibold tracking-wide">{t.appTitle}</span>
        </div>
        <nav className="flex items-center gap-3 text-sm">
          <div className="flex rounded border border-surface-border text-xs" role="group" aria-label="Language">
            {(['en', 'hi'] as const).map((l) => (
              <button key={l} onClick={() => setLang(l)} aria-pressed={lang === l} className={`px-2 py-1 ${lang === l ? 'bg-deep-green text-white' : ''}`}>
                {l === 'en' ? 'English' : 'हिन्दी'}
              </button>
            ))}
          </div>
          {user ? <LinkButton href="/app">Open app</LinkButton> : <Link href="/login" className="font-medium hover:underline">{t.signIn}</Link>}
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-6">
        <section className="grid gap-10 py-14 lg:grid-cols-[1.3fr_1fr] lg:items-center">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-terracotta">Evidence-Grounded IP & Regulatory Intelligence Copilot for Ayurveda</p>
            <h1 className="font-serif text-5xl leading-[1.05] md:text-6xl">{t.appTitle}</h1>
            <p className="mt-5 max-w-xl text-lg text-text-secondary">{t.tagline}</p>
            <div className="mt-6 flex flex-wrap items-start gap-6 text-xs">
              <label className="flex items-center gap-1">Language
                <select className="py-1 text-xs" value={lang} onChange={(e) => setLang(e.target.value as 'en' | 'hi')}>
                  <option value="en">English</option><option value="hi">हिन्दी</option>
                </select>
              </label>
              <div className="flex items-center gap-1">Jurisdiction
                <Popover
                  align="left"
                  trigger={
                    <span className="flex items-center gap-1 rounded border border-surface-border bg-surface-elevated px-2 py-1 text-xs hover:border-green/50">
                      <span className={jurisdictions.length ? '' : 'text-text-muted'}>{jurisdictionLabel}</span>
                      <ChevronDown className="h-3.5 w-3.5 text-text-muted" aria-hidden />
                    </span>
                  }
                >
                  <fieldset className="px-3 py-2">
                    <legend className="mb-1.5 text-xs font-medium text-text-secondary">Select your jurisdiction</legend>
                    <div className="space-y-1.5">
                      {JURISDICTION_OPTIONS.map(([code, name]) => (
                        <label key={code} className="flex items-center gap-2 text-sm" onClick={(e) => e.stopPropagation()}>
                          <input type="checkbox" checked={jurisdictions.includes(code)} onChange={() => toggleJurisdiction(code)} />
                          {name}
                        </label>
                      ))}
                    </div>
                  </fieldset>
                </Popover>
              </div>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {[
                [user ? '/app/innovations/new' : '/register?next=/app/innovations/new', t.startAnalysis, 'Profile a formulation → classification, pathway, IP, evidence'],
                [user ? `/app/assistant${jurisdictions[0] ? `?jur=${jurisdictions[0]}` : ''}` : '/login?demo=1&next=/app/assistant', lang === 'hi' ? 'आईपी / नियामक प्रश्न पूछें' : 'Ask an IP / Regulatory Question', 'Cited, verified answers — or a clear abstention'],
                [user ? '/app/coverage' : '/login?demo=1&next=/app/coverage', lang === 'hi' ? 'स्रोत देखें' : 'Explore Sources', 'What is actually ingested, per jurisdiction'],
              ].map(([href, label, sub], i) => (
                <Link key={href} href={href} className={`rounded-lg border p-4 transition ${i === 0 ? 'border-deep-green bg-deep-green text-white hover:bg-green' : 'border-surface-border bg-surface-elevated hover:border-green/50'}`}>
                  <div className="font-semibold">{label}</div>
                  <div className={`mt-1 text-xs ${i === 0 ? 'text-white/70' : 'text-text-secondary'}`}>{sub}</div>
                </Link>
              ))}
            </div>
            <div className="mt-3"><LinkButton href={user ? '/app' : '/login?demo=1'} variant="secondary">{t.exploreDemo}</LinkButton></div>
            <p className="mt-6 max-w-xl border-l-2 border-gold pl-3 text-xs text-text-secondary">{t.boundary}</p>
          </div>
          <div className="rounded-xl border border-surface-border bg-deep-green p-8 text-white">
            <ol className="space-y-4">
              {t.principle.map((p, i) => (
                <li key={p} className="flex items-baseline gap-4">
                  <span className="font-mono text-sm text-gold">0{i + 1}</span>
                  <span className="font-serif text-3xl">{p}</span>
                </li>
              ))}
            </ol>
            <p className="mt-6 text-xs text-white/70">
              Query → intent & jurisdiction → terminology expansion → hybrid retrieval (pgvector + full-text) → rerank → generate → extract claims → bind &
              verify citations → detect conflicts & staleness → abstain when evidence is insufficient.
            </p>
          </div>
        </section>

        <section className="border-t border-surface-border py-10">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Stat label="Jurisdictions covered" value="3" hint="India · USA · Australia, kept separate" />
            <Stat label="Curated source documents" value="40" hint="Statute, regulatory, scientific & TK context" />
            <Stat label="Citation verification checks" value="10" hint="Per claim, before it is shown as supported" />
            <Stat label="Automated tests" value="60" hint="Incl. the full user/admin access-rules matrix" />
          </div>
        </section>

        <section className="border-t border-surface-border py-12">
          <h2 className="mb-6 font-serif text-2xl">What it does</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {CAPABILITIES.map(({ icon: Icon, title, text }) => (
              <div key={title} className="rounded-lg border border-surface-border bg-surface-elevated p-4">
                <Icon className="h-5 w-5 text-terracotta" aria-hidden />
                <h3 className="mt-3 text-sm font-semibold">{title}</h3>
                <p className="mt-1 text-xs text-text-secondary">{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="border-t border-surface-border py-12">
          <h2 className="mb-2 font-serif text-2xl">How an answer gets built</h2>
          <p className="mb-6 max-w-2xl text-sm text-text-secondary">
            Nothing is generated before something is retrieved, and nothing is shown as supported before it is checked. The same six-step
            pipeline runs behind every chat answer, every classification and every evidence report.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {PIPELINE.map(({ icon: Icon, title, text }, i) => (
              <div key={title} className="relative rounded-lg border border-surface-border bg-surface-elevated p-4">
                <div className="flex items-center gap-2">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-deep-green font-mono text-[11px] text-gold">{i + 1}</span>
                  <Icon className="h-4 w-4 text-terracotta" aria-hidden />
                  <h3 className="text-sm font-semibold">{title}</h3>
                </div>
                <p className="mt-2 text-xs text-text-secondary">{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="border-t border-surface-border py-12">
          <h2 className="mb-2 font-serif text-2xl">Built for</h2>
          <p className="mb-6 max-w-2xl text-sm text-text-secondary">
            One evidence pipeline, used differently depending on who is asking.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PERSONAS.map(({ icon: Icon, title, text }) => (
              <div key={title} className="rounded-lg border border-surface-border bg-surface-elevated p-4">
                <Icon className="h-5 w-5 text-terracotta" aria-hidden />
                <h3 className="mt-3 text-sm font-semibold">{title}</h3>
                <p className="mt-1 text-xs text-text-secondary">{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-6 border-t border-surface-border py-12 md:grid-cols-4">
          {[
            ['Jurisdictions kept separate', 'India (AYUSH, CDSCO, FSSAI, IP India, NBA), USA (FDA) and Australia (TGA) are never mixed silently.'],
            ['Safe abstention', 'When evidence is missing, conflicting or out of scope, it says so — with what was searched and what is missing.'],
            ['Honest data labels', 'Seeded statute summaries, fictional demo patents and unverified uploads are always labelled as such.'],
            ['Full audit trail', 'Every key action is logged with who, what and when; admin access is a separate, server-enforced area.'],
          ].map(([h, p]) => (
            <div key={h}>
              <h3 className="font-semibold">{h}</h3>
              <p className="mt-1 text-sm text-text-secondary">{p}</p>
            </div>
          ))}
        </section>

        <section className="border-t border-surface-border py-12">
          <h2 className="mb-6 flex items-center gap-2 font-serif text-2xl"><CircleHelp className="h-6 w-6 text-terracotta" aria-hidden /> Frequently asked</h2>
          <div className="divide-y divide-surface-border rounded-lg border border-surface-border bg-surface-elevated">
            {FAQ.map(({ q, a }) => (
              <details key={q} className="group p-4 open:bg-surface-muted/40">
                <summary className="cursor-pointer list-none text-sm font-semibold marker:content-none">
                  <span className="mr-2 inline-block text-terracotta transition group-open:rotate-45">+</span>{q}
                </summary>
                <p className="mt-2 pl-5 text-sm text-text-secondary">{a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="border-t border-surface-border py-14 text-center">
          <Beaker className="mx-auto h-8 w-8 text-terracotta" aria-hidden />
          <h2 className="mt-3 font-serif text-3xl">See it on a real formulation</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-text-secondary">
            The demo workspace ships with a seeded Ayurveda formulation, complete with an intentional ambiguity and a disease-claim flag,
            so you can see the safety checks trigger, not just the happy path.
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            <LinkButton href={user ? '/app' : '/login?demo=1'}>{t.exploreDemo}</LinkButton>
            <LinkButton href={user ? '/app/innovations/new' : '/register?next=/app/innovations/new'} variant="secondary">{t.startAnalysis}</LinkButton>
          </div>
        </section>
      </main>
      <footer className="border-t border-surface-border py-8 text-center text-xs text-text-muted">
        <p>IP-SAKTI Sahayak · decision support, not legal, regulatory or medical advice · does not create attorney-client privilege</p>
        <p className="mt-2">India · USA · Australia coverage · evidence-grounded, citation-verified, abstains when unsure</p>
      </footer>
    </div>
  );
}
