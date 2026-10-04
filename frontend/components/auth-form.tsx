'use client';

import { useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, ShieldCheck, Sparkles } from 'lucide-react';
import { FormEvent, useEffect, useState } from 'react';
import { ApiError, post, setWorkspaceId } from '@/lib/api';
import { useApp } from '@/lib/providers';
import { BackLink } from './back';
import { Button, Field, Notice } from './ui';

const DEMO = { email: 'user@ipsakti.demo', password: 'Demo@12345' };

export function AuthForm({ mode }: { mode: 'login' | 'register' }) {
  const router = useRouter();
  const params = useSearchParams();
  const qc = useQueryClient();
  const { t, lang } = useApp();
  const isLogin = mode === 'login';
  const [form, setForm] = useState({ name: '', email: '', password: '', workspace: '' });
  const [showPw, setShowPw] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const reason = params.get('reason');

  async function run(path: string, body: Record<string, unknown>) {
    setErr(null);
    setBusy(true);
    try {
      const data = await post<any>(path, body);
      if (data.user.workspaces[0]) setWorkspaceId(data.user.workspaces[0].id);
      await qc.invalidateQueries();
      router.push(params.get('next') || '/app');
    } catch (ex) {
      setErr(ex instanceof ApiError ? ex.message : 'Could not reach the server.');
      setBusy(false);
    }
  }

  useEffect(() => {
    if (isLogin && params.get('demo') === '1') setForm((f) => ({ ...f, email: DEMO.email, password: DEMO.password }));
  }, [isLogin, params]);

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!isLogin && !/(?=.*[A-Za-z])(?=.*\d).{8,}/.test(form.password)) {
      setErr('Password must be at least 8 characters and include a letter and a number.');
      return;
    }
    if (isLogin) run('/auth/login', { email: form.email, password: form.password });
    else run('/auth/register', { name: form.name, email: form.email, password: form.password, workspace: form.workspace || undefined });
  }

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [k]: e.target.value });

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-darkbg px-4 py-12">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-deep-green/10 to-transparent" aria-hidden />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-gold/10 blur-3xl" aria-hidden />

      <div className={`relative w-full ${isLogin ? 'max-w-md' : 'max-w-2xl'}`}>
        <div className="absolute -top-10 left-0">
          <BackLink href="/">{lang === 'hi' ? 'होम पर वापस' : 'Back to home'}</BackLink>
        </div>

        <div className="mb-8 flex flex-col items-center text-center">
          <Link href="/" className="grid h-14 w-14 place-items-center rounded-2xl bg-deep-green font-serif text-2xl text-gold shadow-soft-elevated">स</Link>
          <p className="mt-4 text-sm font-semibold text-deep-green">{t.appTitle}</p>
          <p className="mt-1 text-xs text-text-secondary">
            {lang === 'hi' ? 'साक्ष्य-आधारित IP और नियामक सहायक' : 'Evidence-based IP and regulatory copilot'}
          </p>
        </div>

        <div className="rounded-2xl border border-surface-border bg-surface-elevated p-8 shadow-soft-elevated">
          <h1 className="font-serif text-2xl text-text-main">{isLogin ? t.signIn : t.register}</h1>
          <p className="mt-1 text-sm text-text-secondary">
            {isLogin
              ? (lang === 'hi' ? 'अपने वर्कस्पेस में साइन इन करें।' : 'Sign in to your workspace.')
              : (lang === 'hi' ? 'नया खाता बनाएँ। आप वर्कस्पेस के मालिक होंगे।' : 'Create an account. You become the owner of your workspace.')}
          </p>

          {reason === 'expired' && <div className="mt-4"><Notice tone="info">Your session expired. Please sign in again.</Notice></div>}

          {isLogin && (
            <button type="button" disabled={busy} onClick={() => { setErr(null); setForm((f) => ({ ...f, email: DEMO.email, password: DEMO.password })); }}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-gold px-4 py-3 text-sm font-semibold text-deep-green shadow-sm transition hover:brightness-105 disabled:opacity-60">
              <Sparkles className="h-4 w-4" aria-hidden />
              {lang === 'hi' ? 'डेमो खाते की जानकारी भरें' : 'Use demo account'}
            </button>
          )}

          {isLogin && (
            <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-wider text-text-secondary">
              <span className="h-px flex-1 bg-surface-border" />
              {lang === 'hi' ? 'या ईमेल से' : 'or with email'}
              <span className="h-px flex-1 bg-surface-border" />
            </div>
          )}

          <form onSubmit={submit} className={isLogin ? 'space-y-4' : 'mt-6 space-y-4'} noValidate>
              {!isLogin && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label={lang === 'hi' ? 'पूरा नाम' : 'Full name'} required>
                    <input className="w-full" value={form.name} onChange={set('name')} required minLength={2} autoComplete="name" />
                  </Field>
                  <Field label={lang === 'hi' ? 'वर्कस्पेस नाम' : 'Workspace name'} hint="Optional. You become its owner.">
                    <input className="w-full" value={form.workspace} onChange={set('workspace')} placeholder="My Research Workspace" />
                  </Field>
                </div>
              )}
              <div className={isLogin ? 'space-y-4' : 'grid gap-4 sm:grid-cols-2'}>
                <Field label={lang === 'hi' ? 'ईमेल' : 'Email'} required>
                  <input className="w-full" type="email" value={form.email} onChange={set('email')} required autoComplete="email" />
                </Field>
                <Field label={lang === 'hi' ? 'पासवर्ड' : 'Password'} required hint={!isLogin ? 'At least 8 characters with a letter and a number.' : undefined}>
                  <div className="relative">
                    <input className="w-full pr-11" type={showPw ? 'text' : 'password'} value={form.password} onChange={set('password')} required
                      autoComplete={isLogin ? 'current-password' : 'new-password'} />
                    <button type="button" onClick={() => setShowPw(!showPw)} aria-label={showPw ? 'Hide password' : 'Show password'}
                      className="absolute inset-y-0 right-0 grid w-11 place-items-center text-text-secondary hover:text-text-main">
                      {showPw ? <EyeOff className="h-4 w-4" aria-hidden /> : <Eye className="h-4 w-4" aria-hidden />}
                    </button>
                  </div>
                </Field>
              </div>
              {err && <p role="alert" className="text-sm text-danger">{err}</p>}
              <Button type="submit" className="w-full" loading={busy}>
                {isLogin ? t.signIn : t.register}
              </Button>
            </form>
        </div>

        <p className="mt-6 text-center text-sm text-text-secondary">
          {isLogin ? (
            <>New here? <Link className="font-semibold text-deep-green underline underline-offset-4" href="/register">{t.register}</Link></>
          ) : (
            <>Already registered? <Link className="font-semibold text-deep-green underline underline-offset-4" href="/login">{t.signIn}</Link></>
          )}
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-2 text-xs text-text-secondary">
          <ShieldCheck className="h-3.5 w-3.5 text-deep-green" aria-hidden />
          {lang === 'hi'
            ? 'निर्णय-सहायता केवल। कानूनी या पेटेंट सलाह नहीं।'
            : 'Decision support only. Not legal or patent advice.'}
        </div>
        <p className="mt-2 text-center text-[11px] text-text-secondary">
          {lang === 'hi'
            ? 'स्मार्ट इंडिया हैकाथॉन प्रोटोटाइप (PS-045) — भारत सरकार की आधिकारिक वेबसाइट नहीं।'
            : 'Smart India Hackathon prototype (PS-045). Not an official Government of India website.'}
        </p>
      </div>
    </div>
  );
}
