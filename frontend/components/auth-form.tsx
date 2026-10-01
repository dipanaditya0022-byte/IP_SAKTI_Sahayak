'use client';

import { useQueryClient } from '@tanstack/react-query';
import { ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { ApiError, post, setWorkspaceId } from '@/lib/api';
import { useApp } from '@/lib/providers';
import { BackLink } from './back';
import { Button, Field, Notice, cx } from './ui';

/** 'login' also renders the User/Admin toggle (see AuthRoleToggle below); 'register' is user-only. */
export function AuthForm({ mode, initialRole = 'user' }: { mode: 'login' | 'register'; initialRole?: 'user' | 'admin' }) {
  const router = useRouter();
  const params = useSearchParams();
  const qc = useQueryClient();
  const { t, lang } = useApp();
  const demo = params.get('demo') === '1';
  const [role, setRole] = useState<'user' | 'admin'>(mode === 'login' ? initialRole : 'user');
  const [form, setForm] = useState({
    name: '', email: demo ? 'researcher@ipsakti.demo' : '', password: demo ? 'Demo@12345' : '', workspace: '',
  });
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const reason = params.get('reason');
  const admin = mode === 'login' && role === 'admin';

  async function submit(e: FormEvent) {
    e.preventDefault();
    setErr(null);
    if (mode === 'register' && !/(?=.*[A-Za-z])(?=.*\d).{8,}/.test(form.password)) {
      setErr('Password must be at least 8 characters and include a letter and a number.');
      return;
    }
    setBusy(true);
    try {
      if (admin) {
        await post('/auth/admin/login', { email: form.email, password: form.password });
        await qc.invalidateQueries({ queryKey: ['admin-session'] });
        router.push(params.get('next') || '/admin/dashboard');
        return;
      }
      const data = await post<any>(mode === 'login' ? '/auth/login' : '/auth/register',
        mode === 'login' ? { email: form.email, password: form.password } : { name: form.name, email: form.email, password: form.password, workspace: form.workspace || undefined });
      if (data.user.workspaces[0]) setWorkspaceId(data.user.workspaces[0].id);
      await qc.invalidateQueries();
      router.push(params.get('next') || '/app');
    } catch (ex) {
      setErr(ex instanceof ApiError ? ex.message : 'Could not reach the server.');
    } finally {
      setBusy(false);
    }
  }

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [k]: e.target.value });

  return (
    <div className="grid min-h-screen place-items-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-4"><BackLink href="/">{lang === 'hi' ? 'होम पर वापस' : 'Back to home'}</BackLink></div>
        <Link href="/" className="mb-6 flex items-center gap-2">
          <div className={cx('grid h-8 w-8 place-items-center rounded font-serif', admin ? 'bg-[#C9A24A] text-[#14100a]' : 'bg-deep-green text-gold')}>
            {admin ? <ShieldCheck className="h-4 w-4" /> : 'स'}
          </div>
          <span className="font-semibold">{admin ? 'IP-SAKTI Admin' : t.appTitle}</span>
        </Link>
        <div className="rounded-lg border border-surface-border bg-surface-elevated p-6">
          {mode === 'login' && (
            <div className="mb-4 grid grid-cols-2 gap-1 rounded-md bg-surface-muted p-1 text-sm" role="tablist" aria-label="Sign in as">
              <button type="button" role="tab" aria-selected={!admin} onClick={() => setRole('user')}
                className={cx('rounded px-3 py-1.5 font-medium transition', !admin ? 'bg-deep-green text-white' : 'text-text-secondary hover:text-text-main')}>
                User
              </button>
              <button type="button" role="tab" aria-selected={admin} onClick={() => setRole('admin')}
                className={cx('rounded px-3 py-1.5 font-medium transition', admin ? 'bg-[#C9A24A] text-[#14100a]' : 'text-text-secondary hover:text-text-main')}>
                Admin
              </button>
            </div>
          )}
          <h1 className="font-serif text-2xl">{admin ? 'Admin sign in' : mode === 'login' ? t.signIn : t.register}</h1>
          {admin && (
            <p className="mt-1 text-xs text-text-secondary">
              Separate sign-in from the application. Only accounts with administrator access can use it, and the session it creates
              only works on the admin console — it will not open a regular app session.
            </p>
          )}
          {reason === 'expired' && <div className="mt-3"><Notice tone="info">Your {admin ? 'admin ' : ''}session expired. Please sign in again.</Notice></div>}
          {demo && mode === 'login' && !admin && <div className="mt-3"><Notice tone="info" title="Demo account">Pre-filled with the seeded demo researcher.</Notice></div>}
          <form onSubmit={submit} className="mt-4 space-y-3" noValidate>
            {mode === 'register' && (
              <Field label="Full name" required>
                <input className="w-full" value={form.name} onChange={set('name')} required minLength={2} autoComplete="name" />
              </Field>
            )}
            <Field label="Email" required>
              <input className="w-full" type="email" value={form.email} onChange={set('email')} required autoComplete="email" />
            </Field>
            <Field label="Password" required hint={mode === 'register' ? 'At least 8 characters with a letter and a number.' : undefined}>
              <input className="w-full" type="password" value={form.password} onChange={set('password')} required autoComplete={mode === 'login' ? 'current-password' : 'new-password'} />
            </Field>
            {mode === 'register' && (
              <Field label="Workspace name" hint="Optional. You become its owner.">
                <input className="w-full" value={form.workspace} onChange={set('workspace')} placeholder="My Research Workspace" />
              </Field>
            )}
            {err && <p role="alert" className="text-sm text-danger">{err}</p>}
            <Button type="submit" className={cx('w-full', admin && '!bg-[#C9A24A] !text-[#14100a] hover:!bg-[#dab35c]')} loading={busy}>
              {admin ? 'Sign in to admin console' : mode === 'login' ? t.signIn : t.register}
            </Button>
          </form>
          <p className="mt-4 text-center text-xs text-text-secondary">
            {admin ? (
              <>Not an administrator? Use the <button type="button" className="underline" onClick={() => setRole('user')}>User</button> tab above.</>
            ) : mode === 'login' ? (
              <>No account? <Link className="underline" href="/register">{t.register}</Link> · <Link className="underline" href="/login?demo=1">Use demo account</Link></>
            ) : (
              <>Already registered? <Link className="underline" href="/login">{t.signIn}</Link></>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
