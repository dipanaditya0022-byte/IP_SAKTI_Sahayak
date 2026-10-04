'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, FormEvent, useState } from 'react';
import { ApiError, post } from '@/lib/api';
import { Button, Field, Notice } from '@/components/ui';

function AdminLoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const qc = useQueryClient();
  const [form, setForm] = useState({ email: '', password: '' });
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const reason = params.get('reason');

  async function submit(e: FormEvent) {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    try {
      await post('/auth/admin/login', { email: form.email, password: form.password });
      await qc.invalidateQueries({ queryKey: ['admin-session'] });
      router.push(params.get('next') || '/admin/dashboard');
    } catch (ex) {
      setErr(ex instanceof ApiError ? ex.message : 'Could not reach the server.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid min-h-screen place-items-center px-4">
      <div className="w-full max-w-sm">
        <p className="mb-4 text-xs font-medium uppercase tracking-wide text-text-secondary">Administrator access</p>
        <div className="rounded-lg border border-surface-border bg-surface-elevated p-6">
          <h1 className="font-serif text-2xl">Sign in</h1>
          {reason === 'expired' && <div className="mt-3"><Notice tone="info">Your session expired. Please sign in again.</Notice></div>}
          <form onSubmit={submit} className="mt-4 space-y-3" noValidate>
            <Field label="Email" required>
              <input className="w-full" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required autoComplete="email" />
            </Field>
            <Field label="Password" required>
              <input className="w-full" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required autoComplete="current-password" />
            </Field>
            {err && <p role="alert" className="text-sm text-danger">{err}</p>}
            <Button type="submit" className="w-full" loading={busy}>Sign in</Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense>
      <AdminLoginForm />
    </Suspense>
  );
}
