'use client';

import { useQueryClient } from '@tanstack/react-query';
import {
  Activity, ClipboardList, Database, FileStack, Gauge, LayoutDashboard, Layers, LogOut, Menu, MessageSquareWarning,
  ScrollText, Search, Settings, ShieldAlert, ShieldCheck, Users,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button, ProfileMenu, Spinner, cx } from '@/components/ui';
import { post } from '@/lib/api';
import { AdminProvider, useAdmin } from '@/lib/admin';

const NAV: { href: string; label: string; icon: any }[] = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/workspaces', label: 'Workspaces', icon: Layers },
  { href: '/admin/sources', label: 'Source Registry', icon: Database },
  { href: '/admin/documents', label: 'Documents', icon: FileStack },
  { href: '/admin/rag', label: 'RAG Monitoring', icon: Activity },
  { href: '/admin/citations', label: 'Citation Verification', icon: ShieldCheck },
  { href: '/admin/evaluation', label: 'Evaluation', icon: Gauge },
  { href: '/admin/escalations', label: 'Escalations', icon: ClipboardList },
  { href: '/admin/feedback', label: 'Feedback', icon: MessageSquareWarning },
  { href: '/admin/audit-logs', label: 'Audit Logs', icon: ScrollText },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminProvider>
      <AdminGate>{children}</AdminGate>
    </AdminProvider>
  );
}

function AdminGate({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  if (path === '/admin/login') return <>{children}</>;
  return <AdminShell>{children}</AdminShell>;
}

function AdminShell({ children }: { children: React.ReactNode }) {
  const { session, loading, admin, clear } = useAdmin();
  const router = useRouter();
  const path = usePathname();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!loading && (session?.state === 'signed_out')) {
      router.replace(`/admin/login?next=${encodeURIComponent(path)}`);
    }
  }, [loading, session, router, path]);
  useEffect(() => setOpen(false), [path]);

  if (loading || !session) {
    return <div className="grid min-h-screen place-items-center bg-[#0B1E36]"><Spinner label="Checking admin session…" /></div>;
  }

  if (session.state === 'user_not_admin') {
    return <AccessDenied reason={`Signed in as ${session.user.name} (${session.user.email}), which does not have administrator access.`} />;
  }
  if (session.state === 'admin_login_required') {
    return (
      <AccessDenied
        title="Admin sign-in required"
        reason={`${session.user.name} (${session.user.email}) has administrator access, but the admin console requires its own sign-in for security — being signed in to the app is not enough.`}
        cta="Sign in to the admin console"
      />
    );
  }
  if (session.state === 'signed_out' || !admin) {
    return <div className="grid min-h-screen place-items-center bg-[#0B1E36]"><Spinner label="Redirecting to admin sign-in…" /></div>;
  }

  async function signOut() {
    try {
      await post('/auth/admin/logout');
    } finally {
      clear();
      qc.clear();
      router.replace('/admin/login');
    }
  }

  const nav = (
    <nav className="flex h-full flex-col" aria-label="Admin console">
      <div className="flex items-center gap-2 px-4 py-4">
        <div className="grid h-9 w-9 place-items-center rounded bg-[#F59E0B] font-serif text-[#0B1E36]">
          <ShieldCheck className="h-[18px] w-[18px]" />
        </div>
        <div className="leading-tight">
          <div className="text-base font-semibold text-white">IP-SAKTI Admin</div>
          <div className="text-[11px] uppercase tracking-wider text-white/40">Console — separate from the app</div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-2 pb-4">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = path === href || path.startsWith(href + '/');
          return (
            <Link key={href} href={href} aria-current={active ? 'page' : undefined}
              className={cx('flex items-center gap-2 rounded px-2 py-2 text-[15px]', active ? 'bg-white/10 font-medium text-white' : 'text-white/70 hover:bg-white/5 hover:text-white')}>
              <Icon className="h-[18px] w-[18px] shrink-0" aria-hidden /> {label}
            </Link>
          );
        })}
      </div>
      <div className="border-t border-white/10 p-3 text-xs text-white/60">
        <div className="truncate font-medium text-white/80">{admin.name}</div>
        <div className="truncate">{admin.email}</div>
        <Link href="/app" className="mt-2 inline-block underline">← Back to the app</Link>
      </div>
    </nav>
  );

  return (
    <div className="flex min-h-screen bg-[#F7F9FC]">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 bg-[#102A47] lg:block">{nav}</aside>
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button className="absolute inset-0 bg-black/40" aria-label="Close menu" onClick={() => setOpen(false)} />
          <aside className="relative h-full w-64 bg-[#102A47]">{nav}</aside>
        </div>
      )}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-[#E2E8F0] bg-[#F7F9FC]/95 px-4 py-2 backdrop-blur">
          <button className="lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu"><Menu className="h-5 w-5" /></button>
          <span className="rounded bg-[#102A47] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-[#F59E0B]">Admin console</span>
          <div className="ml-auto flex items-center gap-3">
            <ProfileMenu
              name={admin.name}
              subtitle={`${admin.email} · ${admin.role}`}
              accent="admin"
              items={[
                { label: 'Settings', href: '/admin/settings', icon: Settings },
                { label: 'Back to the app', href: '/app' },
                { label: 'Sign out', onClick: signOut, icon: LogOut, danger: true },
              ]}
            />
          </div>
        </header>
        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 md:px-8">{children}</main>
      </div>
    </div>
  );
}

function AccessDenied({ title = 'Access denied', reason, cta = 'Go to admin login' }: { title?: string; reason: string; cta?: string }) {
  return (
    <div className="grid min-h-screen place-items-center bg-[#0B1E36] px-4">
      <div className="w-full max-w-md rounded-lg border border-white/10 bg-[#102A47] p-6 text-center text-white">
        <ShieldAlert className="mx-auto h-10 w-10 text-[#F59E0B]" aria-hidden />
        <h1 className="mt-3 font-serif text-2xl text-white">{title}</h1>
        <p className="mt-2 text-sm text-white/70">{reason}</p>
        <p className="mt-1 text-xs text-white/50">Administrator access is required. This is enforced on the server for every admin request, not just in this screen.</p>
        <div className="mt-5 flex justify-center gap-2">
          <Button onClick={() => (window.location.href = '/admin/login')}>{cta}</Button>
          <Link href="/app"><Button variant="secondary">Back to the app</Button></Link>
        </div>
      </div>
    </div>
  );
}
