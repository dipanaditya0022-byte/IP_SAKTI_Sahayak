'use client';

import { animate, motion, useInView } from 'framer-motion';
import clsx from 'clsx';
import {
  ArrowRight, Beaker, BookOpenCheck, Building2, CheckCircle2, ChevronDown, ChevronLeft, ChevronRight, CircleHelp, Code2, Database, ExternalLink,
  FileSearch, FlaskConical, GitBranch, Github, Globe, Landmark, Leaf, ListChecks, Mail, Menu, MessagesSquare, Microscope,
  Pause, Play, Scale, ScrollText, Search, ShieldAlert, ShieldCheck, UserCheck, X,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { LinkButton, Popover } from '@/components/ui';
import { useApp } from '@/lib/providers';
import type { Jurisdiction } from '@/lib/types';

const REPO_URL = 'https://github.com/dipanaditya0022-byte/IP_SAKTI_Sahayak';
const JURISDICTION_OPTIONS: [Jurisdiction, string][] = [['IN', 'India'], ['US', 'USA'], ['AU', 'Australia']];
const FONT_SCALES = ['100%', '112.5%', '125%'];
const FONT_SCALE_KEY = 'ipsakti.fontScale';
const CONTRAST_KEY = 'ipsakti.contrast';

// Verified against the live code, not estimated: `grep -rc '@router\.\(get\|post\|put\|patch\|delete\)' backend/app/api/endpoints/*.py` = 108.
const API_OPERATIONS = 108;
const RELEASE = 'v0.1.0'; // frontend/package.json "version"

const SERVICES = [
  { icon: Leaf, title: 'Innovation Profiler', text: 'Guided profiler turns a formulation into structured, normalised technical features.' },
  { icon: MessagesSquare, title: 'AI Research Assistant', text: 'Ask an IP, regulatory or scientific question and get cited, verified answers — or a clear abstention.' },
  { icon: FileSearch, title: 'Patent & Prior Art', text: 'Feature-to-document matrix with patent-family grouping. Overlap, never verdicts.' },
  { icon: FlaskConical, title: 'Scientific Evidence', text: 'Study cards that keep ingredient evidence separate from finished-formulation evidence.' },
  { icon: BookOpenCheck, title: 'Traditional Knowledge Context', text: 'Public and authorised TK context with explicit access limits. No TKDL scraping.' },
  { icon: Landmark, title: 'Regulatory Navigator', text: 'Provisional pathways for India, USA and Australia with a side-by-side passport.' },
  { icon: GitBranch, title: 'Evidence Graph', text: 'Interactive graph where every edge carries provenance back to a source passage.' },
  { icon: UserCheck, title: 'Human Review', text: 'One-click review packets for IP, regulatory and domain experts, with a full audit trail.' },
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
  { icon: Building2, title: 'Ayurveda startups & MSMEs', text: 'Move from a formulation idea to a structured profile, a classification and a regulatory pathway, without guessing which rules apply where.', stat: '8 guided modules' },
  { icon: Scale, title: 'Patent & IP professionals', text: 'Get a feature-to-document matrix and patent-family grouping to scope prior-art search before deciding where to spend drafting effort.', stat: '3 jurisdictions matched' },
  { icon: Landmark, title: 'Regulatory affairs teams', text: 'Compare provisional pathways across India, USA and Australia side by side, with the assumptions and open questions made explicit.', stat: 'India · USA · Australia' },
  { icon: Microscope, title: 'Academic & clinical researchers', text: 'Separate ingredient-level evidence from finished-formulation evidence, and see exactly which passage backs every claim.', stat: '40 curated sources' },
];
// Explicit per-card spans for the "Built for" bento (not cycled like Features): keeps
// Ayurveda/Patent as-is while swapping the Regulatory/Academic pair's sizes with each other.
const PERSONA_SPANS = ['lg:col-span-8', 'lg:col-span-4', 'lg:col-span-4', 'lg:col-span-8'];

const FAQ = [
  { q: 'Is this legal, regulatory or medical advice?', a: 'No. IP-SAKTI Sahayak is decision support only. It does not determine patentability, freedom to operate, regulatory approval or efficacy, and using it does not create attorney-client privilege. Outputs are a starting point for a qualified professional, not a replacement for one.' },
  { q: 'What happens when the evidence is missing or conflicting?', a: 'The system abstains rather than guesses. It states what was searched, what is missing or conflicting, and what would be needed to answer with confidence — instead of producing a confident-sounding but unsupported answer.' },
  { q: 'How is Traditional Knowledge handled?', a: 'The system has no TKDL access and never scrapes or reproduces restricted records. Only public or authorised TK context is surfaced, with explicit access limits, attribution and an escalation path for anything that needs expert review.' },
  { q: 'Which jurisdictions are covered, and are they mixed together?', a: 'India (AYUSH, CDSCO, FSSAI, IP India, NBA), the USA (FDA) and Australia (TGA) are covered, and kept strictly separate — the system never blends rules from one jurisdiction into an answer about another.' },
  { q: 'Is seeded or demo data clearly marked?', a: 'Yes. Short excerpts of real public instruments are labelled as summaries to verify against the original text; fictional demo patents and guidance notes are labelled fictional; user uploads are labelled unverified until reviewed.' },
  { q: 'Can I bring my own language model?', a: 'Yes. The backend works with a free local model (Ollama) out of the box, or can be pointed at Gemini, Groq, Grok, OpenAI or DeepSeek. Without a configured provider it still answers — by quoting retrieved passages directly instead of synthesising text.' },
];

// Real external developments in the Indian AYUSH/Ayurveda IP & regulatory space (not project
// updates) — each sourced, so it can be checked against the original, not taken on faith.
const INDUSTRY_UPDATES = [
  {
    date: '2025-09-23',
    text: 'Indian Patent Office (CGPDTM) released Guidelines for Examination of AYUSH-Related Inventions, making a TKDL prior-art search mandatory for such applications.',
    source: 'https://ssrana.in/articles/new-guidelines-for-examination-of-ayush-related-inventions-issued-by-the-indian-patent-office/',
  },
  {
    date: '2026-02-01',
    text: 'Union Budget 2026-27 raised AYUSH allocation to ₹4,408 crore, up from ₹3,992 crore in 2025-26.',
    source: 'https://vajiramandravi.com/current-affairs/ayush-major-push-union-budget/',
  },
  {
    date: '2025-03-16',
    text: 'A parliamentary committee recommended consolidating AYUSH drug standard-setting under a single independent drug regulator, aligned with the Drugs and Cosmetics Act, 1940.',
    source: 'https://business-standard.com/india-news/parliament-panel-asks-single-independent-drug-regulator-for-ayush-medicines-125031600373_1.html',
  },
];

// Official public sites of the regulatory/IP bodies this project's coverage is scoped to.
// Reference links only — no affiliation with or endorsement by these bodies is implied or claimed.
// Icons are generic (not the bodies' own emblems/logos) per this project's own rule against
// displaying government/agency logos, which would wrongly imply endorsement.
const EXTERNAL_LINKS = [
  { name: 'IP India', url: 'https://ipindia.gov.in', icon: Scale },
  { name: 'National Biodiversity Authority', url: 'https://nbaindia.org', icon: Leaf },
  { name: 'Traditional Knowledge Digital Library (TKDL)', url: 'https://www.tkdl.res.in', icon: BookOpenCheck },
  { name: 'Ministry of Ayush', url: 'https://ayush.gov.in', icon: Landmark },
  { name: 'CDSCO', url: 'https://cdsco.gov.in', icon: ShieldCheck },
  { name: 'FSSAI', url: 'https://fssai.gov.in', icon: FlaskConical },
  { name: 'WIPO', url: 'https://www.wipo.int', icon: Globe },
];

// Bento rhythm reused across the services grid, two tiles at a time: a wide "feature" tile
// (icon watermark, colspan 8) paired with a narrower accent tile (colspan 4) — repeated.
const BENTO_SPANS = ['lg:col-span-8', 'lg:col-span-4'];
// Explicit, non-repeating spans for the 8-tile Features bento — four differently-shaped rows
// (5+7, 4+4+4, 6+6, full-width) instead of the same wide/narrow pair cycling four times.
const FEATURE_SPANS = ['lg:col-span-5', 'lg:col-span-7', 'lg:col-span-4', 'lg:col-span-4', 'lg:col-span-4', 'lg:col-span-6', 'lg:col-span-6', 'lg:col-span-12'];
// Only a few tiles go deep-navy so the grid reads as premium, not a patchwork of colors.
const FEATURE_DARK = [1, 4, 7];
const BENTO_ACCENTS = [
  'bg-surface-muted border-none',
  'bg-warn-bg border-warn/20',
  'bg-surface border-t-4 border-t-gold',
  'bg-deep-green text-white border-none',
];

function UtilityBar({ lang, setLang, t }: { lang: 'en' | 'hi'; setLang: (l: 'en' | 'hi') => void; t: ReturnType<typeof useApp>['t'] }) {
  const [scale, setScale] = useState(0);
  const [contrast, setContrast] = useState(false);
  useEffect(() => {
    try {
      const savedScale = Number(window.localStorage.getItem(FONT_SCALE_KEY));
      if (savedScale >= 0 && savedScale <= 2) { setScale(savedScale); document.documentElement.style.fontSize = FONT_SCALES[savedScale]; }
      const savedContrast = window.localStorage.getItem(CONTRAST_KEY) === '1';
      if (savedContrast) { setContrast(true); document.documentElement.dataset.contrast = 'high'; }
    } catch { /* storage unavailable */ }
  }, []);
  const setFontScale = (next: number) => {
    setScale(next);
    document.documentElement.style.fontSize = FONT_SCALES[next];
    try { window.localStorage.setItem(FONT_SCALE_KEY, String(next)); } catch { /* storage unavailable */ }
  };
  const toggleContrast = () => {
    const next = !contrast;
    setContrast(next);
    document.documentElement.dataset.contrast = next ? 'high' : '';
    try { window.localStorage.setItem(CONTRAST_KEY, next ? '1' : '0'); } catch { /* storage unavailable */ }
  };
  return (
    <div className="sticky top-0 z-50 bg-deep-green text-[11px] text-white/80" style={{ padding: '6px 0' }}>
      <div className="flex flex-wrap items-center" style={{ gap: '8px 16px', padding: '0 16px' }}>
        <a href="#main-content" className="sr-only focus:not-sr-only focus:rounded focus:bg-white focus:px-2 focus:py-0.5 focus:text-deep-green">
          {t.utility.skipToContent}
        </a>
        <span className="hidden sm:inline">{t.sihNotice}</span>
        <div className="ml-auto flex items-center gap-3">
          <div className="flex rounded border border-white/20 text-[11px]" role="group" aria-label="Language">
            {(['en', 'hi'] as const).map((l) => (
              <button key={l} onClick={() => setLang(l)} aria-pressed={lang === l} className={clsx('min-h-[22px] px-2', lang === l ? 'bg-gold text-deep-green' : 'hover:bg-white/10')}>
                {l === 'en' ? 'English' : 'हिन्दी'}
              </button>
            ))}
          </div>
          <button type="button" onClick={toggleContrast} aria-pressed={contrast} className={clsx('rounded px-1.5 py-0.5', contrast ? 'bg-gold text-deep-green' : 'hover:bg-white/10')}>
            {t.utility.highContrast}
          </button>
          <div className="flex items-center gap-1" role="group" aria-label={t.utility.textSize}>
            {['A−', 'A', 'A+'].map((label, i) => (
              <button key={label} type="button" onClick={() => setFontScale(i)} aria-pressed={scale === i}
                className={clsx('grid h-5 w-5 place-items-center rounded', scale === i ? 'bg-gold text-deep-green' : 'hover:bg-white/10')}>
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function CountUp({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration: 1.2,
      ease: 'easeOut',
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, value]);
  return <span ref={ref}>{display}</span>;
}

function AnnouncementStrip() {
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    try {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) setPaused(true);
    } catch { /* matchMedia unavailable */ }
  }, []);
  const items = [
    `IP-SAKTI Sahayak ${RELEASE}`,
    'Demo workspace available — seeded with real Ayurveda formulation data',
    'Ask a tricky IP question — watch it cite the source or honestly say it doesn\'t know',
    '3 jurisdictions covered: India · USA · Australia',
  ];
  const loop = [...items, ...items];
  return (
    <div className="flex items-center gap-3 border-y-2 border-gold/30 bg-surface-muted px-4 py-2 text-xs font-semibold text-deep-green">
      <button type="button" onClick={() => setPaused((p) => !p)} aria-label={paused ? 'Play announcements' : 'Pause announcements'}
        className="shrink-0 rounded bg-deep-green p-1.5 text-gold shadow-sm transition-colors hover:bg-green">
        {paused ? <Play className="h-3.5 w-3.5" aria-hidden /> : <Pause className="h-3.5 w-3.5" aria-hidden />}
      </button>
      <div className="overflow-hidden">
        <motion.div
          className="flex w-max gap-10 whitespace-nowrap"
          animate={paused ? { x: 0 } : { x: ['0%', '-50%'] }}
          transition={paused ? {} : { repeat: Infinity, duration: 25, ease: 'linear' }}
        >
          {loop.map((item, i) => <span key={i}>{item}</span>)}
        </motion.div>
      </div>
    </div>
  );
}

function HeroCarousel({ t, lang, user, jurisdictions }: { t: ReturnType<typeof useApp>['t']; lang: 'en' | 'hi'; user: unknown; jurisdictions: Jurisdiction[] }) {
  const slides = [
    { icon: Database, title: t.principle[0], text: 'Every answer starts from the curated corpus — hybrid pgvector and full-text search across 40 source documents.', cta: lang === 'hi' ? 'स्रोत देखें' : 'Explore Sources', href: user ? '/app/coverage' : '/register?next=/app/coverage' },
    { icon: FlaskConical, title: t.principle[1], text: 'A formulation becomes a structured profile, classification and regulatory pathway — nothing is asserted without a basis.', cta: t.startAnalysis, href: user ? '/app/innovations/new' : '/register?next=/app/innovations/new' },
    { icon: ScrollText, title: t.principle[2], text: 'Every claim is bound back to a specific passage, not just a document — down to the sentence that supports it.', cta: lang === 'hi' ? 'आईपी / नियामक प्रश्न पूछें' : 'Ask an IP / Regulatory Question', href: user ? '/app/assistant' : '/login?demo=1&next=/app/assistant' },
    { icon: ShieldCheck, title: t.principle[3], text: 'Supported, partial, unsupported or conflicting — every claim carries its verification status, and the system abstains rather than guesses.', cta: t.exploreDemo, href: user ? '/app' : '/login?demo=1' },
  ];
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    try {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) setPaused(true);
    } catch { /* matchMedia unavailable */ }
  }, []);
  useEffect(() => {
    if (paused) return;
    timer.current = setInterval(() => setI((cur) => (cur + 1) % slides.length), 3000);
    return () => { if (timer.current) clearInterval(timer.current); };
  }, [paused, slides.length]);

  const slide = slides[i];
  const Icon = slide.icon;

  // Fixed px sizing throughout (not Tailwind's default rem-based classes): this card is a
  // decorative visual anchor, not reading content, so it must stay visually constant when the
  // accessibility text-size control (A-/A/A+) scales the root font-size — never "zoom".
  return (
    <div className="flex flex-1 flex-col overflow-hidden text-text-main shadow-soft-elevated"
      style={{ margin: '0 12px', borderRadius: '16px', background: 'linear-gradient(to bottom right, #FFFFFF, #F4F6FF, #E8ECFA)' }}>
      <div
        className="relative flex flex-1 flex-col overflow-hidden"
        onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}
      >
        <div className="relative flex flex-1 items-center justify-center text-center" style={{ minHeight: '420px', padding: '64px 24px' }}>
          <div className="absolute bottom-0 right-0 rounded-full bg-gold/10" style={{ height: '320px', width: '320px', filter: 'blur(100px)' }} aria-hidden />
          <div className="relative z-10" style={{ maxWidth: '672px' }} aria-live="polite">
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-surface-border bg-white font-semibold uppercase tracking-wider shadow-sm"
              style={{ marginBottom: '20px', padding: '6px 12px', fontSize: '12px' }}>
              <ShieldCheck style={{ height: '16px', width: '16px' }} className="text-ok" aria-hidden />
              <span className="text-deep-green">Evidence-Grounded IP &amp; Regulatory Intelligence Copilot for Ayurveda</span>
            </div>
            <h1 className="mx-auto font-heading font-bold text-deep-green" style={{ maxWidth: '768px', fontSize: '44px', lineHeight: 1.1 }}>
              {lang === 'hi' ? `${t.appTitle} में आपका स्वागत है` : `Welcome to ${t.appTitle}`}
            </h1>
            <p className="mx-auto text-text-secondary" style={{ marginTop: '16px', maxWidth: '576px', fontSize: '16px' }}>{t.tagline}</p>

            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mx-auto flex flex-col items-center justify-center"
              style={{ marginTop: '32px', minHeight: '132px' }}
            >
              <Icon style={{ height: '24px', width: '24px' }} className="text-gold" aria-hidden />
              <p className="font-heading font-bold text-deep-green" style={{ marginTop: '8px', fontSize: '24px' }}>{slide.title}</p>
              <p className="text-text-secondary" style={{ marginTop: '8px', maxWidth: '448px', fontSize: '14px' }}>{slide.text}</p>
              <div className="relative overflow-hidden" style={{ marginTop: '16px', borderRadius: '12px' }}>
                <LinkButton href={slide.href} className="!bg-gold !text-deep-green !font-bold hover:!bg-[#FFB366]">{slide.cta}</LinkButton>
                <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent hover:animate-shimmer" />
              </div>
            </motion.div>
          </div>

          <button type="button" onClick={() => setI((cur) => (cur - 1 + slides.length) % slides.length)} aria-label="Previous slide"
            className="absolute top-1/2 -translate-y-1/2 rounded-full border border-surface-border bg-white text-deep-green shadow-sm hover:bg-surface-subtle"
            style={{ left: '12px', padding: '8px' }}>
            <ChevronLeft style={{ height: '20px', width: '20px' }} aria-hidden />
          </button>
          <button type="button" onClick={() => setI((cur) => (cur + 1) % slides.length)} aria-label="Next slide"
            className="absolute top-1/2 -translate-y-1/2 rounded-full border border-surface-border bg-white text-deep-green shadow-sm hover:bg-surface-subtle"
            style={{ right: '12px', padding: '8px' }}>
            <ChevronRight style={{ height: '20px', width: '20px' }} aria-hidden />
          </button>

          <div className="absolute left-1/2 flex -translate-x-1/2 items-center rounded-full border border-surface-border bg-white shadow-sm"
            style={{ bottom: '20px', gap: '12px', padding: '6px 12px' }}>
            <div className="flex items-center" role="tablist" aria-label="Slides" style={{ gap: '8px' }}>
              {slides.map((s, idx) => (
                <button key={s.title} role="tab" aria-selected={idx === i} aria-label={`Slide ${idx + 1}: ${s.title}`} onClick={() => setI(idx)}
                  className={clsx('rounded-full', idx === i ? 'bg-gold' : 'bg-surface-border')} style={{ height: '8px', width: '8px' }} />
              ))}
            </div>
            <button type="button" onClick={() => setPaused((p) => !p)} aria-label={paused ? 'Play slideshow' : 'Pause slideshow'} className="rounded-full text-deep-green hover:bg-surface-subtle" style={{ padding: '4px' }}>
              {paused ? <Play style={{ height: '14px', width: '14px' }} aria-hidden /> : <Pause style={{ height: '14px', width: '14px' }} aria-hidden />}
            </button>
          </div>
        </div>
      </div>
      <div className="grid bg-deep-green text-white sm:grid-cols-4" style={{ gap: '16px', padding: '24px', borderTop: '1px solid #D9DEEE' }}>
        {t.principle.map((p, idx) => (
          <div key={p} className="flex items-baseline" style={{ gap: '12px' }}>
            <span className="font-mono text-gold" style={{ fontSize: '12px' }}>0{idx + 1}</span>
            <span className="font-heading font-bold leading-tight" style={{ fontSize: '18px' }}>{p}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Landing() {
  const { t, lang, setLang, user, jurisdictions, setJurisdictions } = useApp();
  const [navOpen, setNavOpen] = useState(false);
  const toggleJurisdiction = (j: Jurisdiction) =>
    setJurisdictions(jurisdictions.includes(j) ? jurisdictions.filter((x) => x !== j) : [...jurisdictions, j]);
  const jurisdictionLabel = jurisdictions.length
    ? JURISDICTION_OPTIONS.filter(([code]) => jurisdictions.includes(code)).map(([, name]) => name).join(', ')
    : 'Select jurisdiction';

  const navLinks: [string, string][] = [
    ['#main-content', t.landingNav.home],
    ['#about', t.landingNav.about],
    ['#features', t.landingNav.features],
    ['#coverage-stats', t.landingNav.coverage],
    ['#sources-rules', t.landingNav.sourcesRules],
    ['#updates', t.landingNav.updates],
    ['#faq', t.landingNav.help],
    ['#contact', t.landingNav.contact],
  ];

  return (
    <div className="min-h-screen">
      {/* This block (utility bar through hero) always fills at least one viewport height, so
          the next section never peeks in above the fold on any screen size or text scale. */}
      <div className="flex flex-col" style={{ minHeight: 'calc(100dvh - 48px)' }}>
      <UtilityBar lang={lang} setLang={setLang} t={t} />

      <div className="w-full bg-darkbg" style={{ paddingTop: '8px' }}>
        <div style={{ padding: '0 16px' }}>
          <div className="rounded-xl border-t-4 border-deep-green bg-surface/95 px-6 py-3.5 shadow-soft-elevated backdrop-blur-md">
            <div className="flex items-center justify-between gap-4">
              <Link href="/" className="flex shrink-0 items-center gap-2">
                <div className="grid h-11 w-11 place-items-center rounded-full bg-deep-green font-heading text-xl font-bold text-gold">स</div>
                <span className="hidden font-heading text-lg font-bold tracking-wide sm:inline">{t.appTitle}</span>
              </Link>
              <nav className="no-scrollbar hidden min-w-0 flex-1 items-center gap-4 overflow-x-auto text-sm font-medium text-text-secondary xl:flex xl:justify-center xl:gap-5" aria-label="Page sections">
                {navLinks.map(([href, label]) => (
                  <a key={href} href={href} className="group relative shrink-0 whitespace-nowrap py-1 hover:text-deep-green">
                    {label}
                    <span className="absolute inset-x-0 -bottom-0.5 h-0.5 scale-x-0 rounded-full bg-gold transition-transform duration-200 group-hover:scale-x-100" />
                  </a>
                ))}
              </nav>
              <div className="flex shrink-0 items-center gap-3 text-sm">
                {user ? (
                  <LinkButton href="/app" className="!font-bold">Open app</LinkButton>
                ) : (
                  <>
                    <Link href="/login" className="hidden font-medium hover:underline sm:inline">{t.signIn}</Link>
                    <LinkButton href="/register" className="!font-bold">{t.register}</LinkButton>
                  </>
                )}
                <button type="button" onClick={() => setNavOpen((o) => !o)} aria-expanded={navOpen} aria-label={navOpen ? t.utility.close : t.utility.menu}
                  className="grid h-9 w-9 place-items-center rounded-full border border-surface-border xl:hidden">
                  {navOpen ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
                </button>
              </div>
            </div>
          </div>
        </div>
        <nav className={clsx(navOpen ? 'block' : 'hidden', 'border-t border-surface-border bg-surface xl:hidden')} style={{ marginTop: '12px', paddingTop: '12px' }} aria-label="Page sections (mobile)">
          <div className="mx-auto flex max-w-6xl flex-col gap-1 px-6 py-2 text-sm font-medium text-text-secondary">
            {navLinks.map(([href, label]) => (
              <a key={href} href={href} onClick={() => setNavOpen(false)} className="min-h-[44px] py-2 hover:text-text-main">
                {label}
              </a>
            ))}
          </div>
        </nav>
      </div>
      <AnnouncementStrip />

      <div id="main-content" className="flex flex-1 flex-col">
        <HeroCarousel t={t} lang={lang} user={user} jurisdictions={jurisdictions} />
      </div>
      </div>

      <main>
        <div className="mx-auto max-w-6xl px-6">
        <section className="py-8">
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-text-secondary">
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
          <p className="mx-auto mt-4 max-w-2xl border-l-2 border-gold pl-3 text-xs text-text-secondary">{t.boundary}</p>
        </section>

        <section id="about" className="scroll-mt-24 grid gap-8 border-t border-surface-border py-12 lg:grid-cols-[1.3fr_1fr] lg:items-start">
          <div>
            <h2 className="font-heading text-4xl font-bold text-deep-green">{t.welcomeHeading}</h2>
            <p className="mt-3 max-w-2xl text-sm text-text-secondary">{t.welcomeBody}</p>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group relative overflow-hidden rounded-2xl border-none bg-deep-green p-6 text-white shadow-sm"
          >
            <ShieldCheck className="absolute -bottom-6 -right-4 h-28 w-28 text-white opacity-[0.06] transition-transform duration-700 group-hover:scale-110" aria-hidden />
            <ol className="relative z-10 space-y-3">
              {t.principle.map((p, i) => (
                <li key={p} className="flex items-baseline gap-3">
                  <span className="font-mono text-xs text-gold">0{i + 1}</span>
                  <span className="font-heading text-lg font-bold">{p}</span>
                </li>
              ))}
            </ol>
          </motion.div>
        </section>

        <section id="features" className="scroll-mt-24 border-t border-surface-border py-12">
          <h2 className="mb-6 text-center font-heading text-4xl font-bold text-deep-green">{t.landingNav.features}</h2>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
            {SERVICES.map(({ icon: Icon, title, text }, i) => {
              const dark = FEATURE_DARK.includes(i);
              const isBanner = i === SERVICES.length - 1;
              return (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: (i % 4) * 0.08 }}
                  className={clsx(
                    'group relative overflow-hidden rounded-3xl p-7 transition-all duration-300 hover:-translate-y-1.5',
                    dark
                      ? 'bg-gradient-to-br from-deep-green via-deep-green to-green text-white shadow-[0_18px_40px_-18px_rgba(10,26,79,0.55)] ring-1 ring-white/10'
                      : 'border border-surface-border bg-gradient-to-br from-white to-surface-subtle shadow-[0_10px_30px_-18px_rgba(10,26,79,0.25)] hover:border-gold/40 hover:shadow-[0_22px_44px_-20px_rgba(10,26,79,0.35)]',
                    isBanner ? 'flex items-center gap-6' : '',
                    FEATURE_SPANS[i],
                  )}
                >
                  <span className={clsx('absolute right-6 top-6 font-mono text-[11px] tracking-[0.2em]', dark ? 'text-gold/80' : 'text-text-muted')}>0{i + 1}</span>
                  {!dark && <span className="absolute inset-x-7 top-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" aria-hidden />}
                  <Icon className={clsx('absolute transition-transform duration-700 group-hover:scale-110 group-hover:rotate-6',
                    isBanner ? '-right-6 -bottom-12 h-48 w-48 opacity-[0.07]' : '-bottom-8 -right-6 h-36 w-36 opacity-[0.06]', dark ? 'text-white' : 'text-deep-green')} aria-hidden />
                  <div className={clsx('relative z-10 grid h-12 w-12 shrink-0 place-items-center rounded-2xl shadow-lg',
                    isBanner ? '' : 'mb-5',
                    dark ? 'bg-white/10 ring-1 ring-white/20' : 'bg-gradient-to-br from-deep-green to-green text-white shadow-deep-green/30')}>
                    <Icon className={clsx('h-5 w-5', dark ? 'text-gold' : 'text-white')} aria-hidden />
                  </div>
                  <div className="relative z-10">
                    <h3 className={clsx('font-heading text-xl font-bold tracking-tight', dark ? 'text-white' : 'text-deep-green')}>{title}</h3>
                    <p className={clsx('mt-2 max-w-md text-sm leading-relaxed', dark ? 'text-white/75' : 'text-text-secondary')}>{text}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <h3 className="mb-2 mt-14 text-center font-heading text-4xl font-bold text-deep-green">How an answer gets built</h3>
          <p className="mx-auto mb-8 max-w-2xl text-center text-sm text-text-secondary">
            Nothing is generated before something is retrieved, and nothing is shown as supported before it is checked. The same six-step
            pipeline runs behind every chat answer, every classification and every evidence report.
          </p>
          <div className="flex flex-col items-stretch gap-0 overflow-x-auto pb-2 lg:flex-row lg:items-start lg:gap-0">
            {PIPELINE.map(({ icon: Icon, title, text }, i) => (
              <div key={title} className="flex flex-1 lg:items-start">
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="flex min-w-[140px] flex-1 flex-col items-center px-2 py-4 text-center lg:py-0"
                >
                  <div className={clsx('grid h-14 w-14 shrink-0 place-items-center rounded-full border-2 bg-surface shadow-sm',
                    i === PIPELINE.length - 1 ? 'border-gold text-gold' : 'border-deep-green text-deep-green')}>
                    <Icon className="h-6 w-6" aria-hidden />
                  </div>
                  <span className="mt-2 font-mono text-[10px] text-gold">STEP 0{i + 1}</span>
                  <h3 className="font-heading text-sm font-bold text-deep-green">{title}</h3>
                  <p className="mt-1 max-w-[160px] text-[11px] leading-snug text-text-secondary">{text}</p>
                </motion.div>
                {i < PIPELINE.length - 1 && (
                  <div className="hidden shrink-0 items-center justify-center text-surface-border lg:flex" style={{ width: '28px', marginTop: '22px' }}>
                    <ArrowRight className="h-5 w-5" aria-hidden />
                  </div>
                )}
              </div>
            ))}
          </div>

          <h3 className="mb-2 mt-14 text-center font-heading text-4xl font-bold text-deep-green">Built for</h3>
          <p className="mx-auto mb-8 max-w-2xl text-center text-sm text-text-secondary">One evidence pipeline, used differently depending on who is asking.</p>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
            {PERSONAS.map(({ icon: Icon, title, text, stat }, i) => {
              const accent = BENTO_ACCENTS[i % BENTO_ACCENTS.length];
              const dark = accent.includes('bg-deep-green');
              return (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className={clsx(
                    'group relative overflow-hidden rounded-2xl border p-6 shadow-sm transition-transform hover:-translate-y-1',
                    PERSONA_SPANS[i], accent,
                  )}
                >
                  <Icon className={clsx('absolute -bottom-6 -right-4 h-24 w-24 opacity-[0.06] transition-transform duration-700 group-hover:scale-110', dark ? 'text-white' : 'text-deep-green')} aria-hidden />
                  <div className="relative z-10">
                    <div className="flex items-start justify-between gap-3">
                      <div className={clsx('mb-4 grid h-11 w-11 place-items-center rounded-xl shadow-sm', dark ? 'bg-white/10' : 'bg-white')}>
                        <Icon className={clsx('h-5 w-5', dark ? 'text-gold' : 'text-deep-green')} aria-hidden />
                      </div>
                      <span className={clsx('rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide', dark ? 'bg-white/10 text-gold' : 'bg-white text-deep-green')}>{stat}</span>
                    </div>
                    <h3 className={clsx('font-heading text-lg font-bold', dark ? 'text-white' : 'text-deep-green')}>{title}</h3>
                    <p className={clsx('mt-1.5 max-w-md text-sm', dark ? 'text-white/75' : 'text-text-secondary')}>{text}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-10 grid gap-6 border-t border-surface-border pt-10 md:grid-cols-4">
            {[
              ['Jurisdictions kept separate', 'India (AYUSH, CDSCO, FSSAI, IP India, NBA), USA (FDA) and Australia (TGA) are never mixed silently.'],
              ['Safe abstention', 'When evidence is missing, conflicting or out of scope, it says so — with what was searched and what is missing.'],
              ['Honest data labels', 'Seeded statute summaries, fictional demo patents and unverified uploads are always labelled as such.'],
              ['Full audit trail', 'Every key action is logged with who, what and when; admin access is a separate, server-enforced area.'],
            ].map(([h, p]) => (
              <div key={h} className="border-l-2 border-gold pl-4">
                <h3 className="font-heading font-bold text-deep-green">{h}</h3>
                <p className="mt-1 text-sm text-text-secondary">{p}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="coverage-stats" className="scroll-mt-24 border-t border-surface-border py-12">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Globe, value: 3, label: 'Jurisdictions covered', hint: 'India · USA · Australia, kept separate' },
              { icon: Database, value: 40, label: 'Curated source documents', hint: 'Statute, regulatory, scientific & TK context' },
              { icon: CheckCircle2, value: 69, label: 'Automated tests', hint: 'Incl. the full user/admin access-rules matrix' },
              { icon: Code2, value: API_OPERATIONS, label: 'API operations', hint: 'Counted directly from the backend route table' },
            ].map(({ icon: Icon, value, label, hint }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="glass-card group relative overflow-hidden p-5 transition-transform hover:-translate-y-1"
              >
                <Icon className="absolute -bottom-4 -right-3 h-20 w-20 text-deep-green opacity-[0.05] transition-transform duration-700 group-hover:scale-110" aria-hidden />
                <div className={"relative z-10 mb-3 grid h-10 w-10 place-items-center rounded-xl bg-surface-subtle text-deep-green"}>
                  <Icon className="h-5 w-5" aria-hidden />
                </div>
                <div className="relative z-10 text-xs font-semibold uppercase tracking-wide text-text-secondary">{label}</div>
                <div className="relative z-10 font-heading text-4xl font-bold text-deep-green"><CountUp value={value} /></div>
                <p className="relative z-10 mt-1 text-xs text-text-muted">{hint}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="grid gap-5 border-t border-surface-border py-10 lg:grid-cols-2">
          <div id="updates" className="glass-card scroll-mt-24 overflow-hidden">
            <div className="border-b border-surface-border bg-surface-subtle px-4 py-2.5 text-sm font-bold text-deep-green">{t.industryUpdatesHeading}</div>
            <ul className="divide-y divide-surface-border">
              {INDUSTRY_UPDATES.map((u) => (
                <li key={u.date + u.text} className="px-4 py-2.5 text-sm">
                  <div className="flex gap-3">
                    <span className="shrink-0 text-xs text-text-muted">{u.date}</span>
                    <span>{u.text}</span>
                  </div>
                  <a href={u.source} target="_blank" rel="noreferrer" className="ml-[3.25rem] mt-0.5 inline-flex items-center gap-1 text-[10px] uppercase tracking-wide text-ok hover:underline">
                    {t.source} <ExternalLink className="h-2.5 w-2.5" aria-hidden />
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div id="sources-rules" className="glass-card scroll-mt-24 overflow-hidden">
            <div className="border-b border-surface-border bg-surface-subtle px-4 py-2.5 text-sm font-bold text-deep-green">{t.linksHeading}</div>
            <ul className="divide-y divide-surface-border">
              {EXTERNAL_LINKS.map((l) => (
                <li key={l.url}>
                  <a href={l.url} target="_blank" rel="noreferrer" className="flex items-center justify-between px-4 py-2.5 text-sm hover:bg-surface-subtle">
                    <span className="flex items-center gap-2">
                      <l.icon className="h-4 w-4 shrink-0 text-gold" aria-hidden />
                      {l.name}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] uppercase tracking-wide text-text-muted">{t.externalSite} <ExternalLink className="h-3 w-3" aria-hidden /></span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="faq" className="scroll-mt-24 border-t border-surface-border py-12">
          <h2 className="mb-6 flex items-center justify-center gap-2 font-heading text-2xl font-bold text-deep-green"><CircleHelp className="h-6 w-6 text-gold" aria-hidden /> Frequently asked</h2>
          <div className="glass-card divide-y divide-surface-border">
            {FAQ.map(({ q, a }) => (
              <details key={q} className="group p-4 open:bg-surface-subtle/60">
                <summary className="cursor-pointer list-none text-sm font-semibold marker:content-none">
                  <span className="mr-2 inline-block text-gold transition group-open:rotate-45">+</span>{q}
                </summary>
                <p className="mt-2 pl-5 text-sm text-text-secondary">{a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="border-t border-surface-border py-14 text-center">
          <Beaker className="mx-auto h-8 w-8 text-gold" aria-hidden />
          <h2 className="mt-3 font-heading text-3xl font-bold text-deep-green">See it on a real formulation</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-text-secondary">
            The demo workspace ships with a seeded Ayurveda formulation, complete with an intentional ambiguity and a disease-claim flag,
            so you can see the safety checks trigger, not just the happy path.
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            <div className="relative overflow-hidden rounded-xl">
              <LinkButton href={user ? '/app' : '/login?demo=1'} className="!font-bold">{t.exploreDemo}</LinkButton>
              <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent hover:animate-shimmer" />
            </div>
            <LinkButton href={user ? '/app/innovations/new' : '/register?next=/app/innovations/new'} variant="secondary" className="!font-bold">{t.startAnalysis}</LinkButton>
          </div>
        </section>
        </div>
      </main>

      <footer id="contact" className="scroll-mt-24 border-t border-surface-border bg-deep-green text-white">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="grid h-9 w-9 place-items-center rounded-full bg-gold font-heading text-lg font-bold text-deep-green">स</div>
                <span className="font-heading text-lg font-bold">{t.appTitle}</span>
              </div>
              <p className="mt-3 text-xs text-white/70">{t.boundary}</p>
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-gold">{t.footer.usefulLinks}</h3>
              <ul className="mt-3 space-y-2 text-sm text-white/80">
                <li><a href="#about" className="hover:underline">{t.landingNav.about}</a></li>
                <li><a href="#features" className="hover:underline">{t.landingNav.features}</a></li>
                <li><a href="#faq" className="hover:underline">{t.landingNav.help}</a></li>
                <li><Link href="/login" className="hover:underline">{t.signIn}</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-gold">{t.footer.contact}</h3>
              <ul className="mt-3 space-y-2 text-sm text-white/80">
                <li className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" aria-hidden /> {t.footer.contactEmail}</li>
                <li><a href={REPO_URL} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:underline"><Github className="h-3.5 w-3.5" aria-hidden /> Source on GitHub</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-gold">Project</h3>
              <ul className="mt-3 space-y-2 text-sm text-white/80">
                <li>{t.footer.release}: {RELEASE}</li>
                <li>{t.footer.lastUpdated}: {process.env.NEXT_PUBLIC_BUILD_DATE}</li>
                <li className="text-white/50">FastAPI · Next.js · PostgreSQL + pgvector</li>
              </ul>
            </div>
          </div>
          <div className="mt-10 border-t border-white/10 pt-8 text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-white/90">{t.sihNotice}</p>
            <p className="mx-auto mt-3 max-w-2xl text-xs text-white/60">IP-SAKTI Sahayak · decision support, not legal, regulatory or medical advice · does not create attorney-client privilege</p>
            <p className="mt-1 text-xs text-white/60">India · USA · Australia coverage · evidence-grounded, citation-verified, abstains when unsure</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
