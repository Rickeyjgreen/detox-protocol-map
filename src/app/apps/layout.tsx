import Link from 'next/link';
import React from 'react';
import { apps } from '@/lib/apps';

export default function AppsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800">
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 md:px-8">
          <Link href="/apps" className="font-bold tracking-tight text-slate-900">
            BYBO Apps
          </Link>
          <nav className="flex flex-wrap items-center gap-2">
            {apps.map((a) => (
              <Link
                key={a.slug}
                href={a.href}
                className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                {a.title}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-4 py-6 md:px-8">{children}</main>
    </div>
  );
}
