'use client';

import React from 'react';
import Link from 'next/link';
import { ExternalLink, LayoutGrid, FileText, Map } from 'lucide-react';

type AppLink = {
  title: string;
  description: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  tag?: string;
};

const apps: AppLink[] = [
  {
    title: 'Intake Logic',
    description: 'Interactive decision tree for intake/triage logic.',
    href: '/intake-logic',
    icon: FileText,
    tag: 'Live',
  },
  {
    title: 'Protocol Map',
    description: 'Main map view (current homepage).',
    href: '/',
    icon: Map,
    tag: 'Live',
  },
  {
    title: 'Protocol Map (Alt Route)',
    description: 'Direct route to the map view.',
    href: '/protocol-map',
    icon: Map,
  },
];

export default function AppsHubPage() {
  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8 font-sans text-slate-800">
      <div className="max-w-5xl mx-auto space-y-6">
        <header className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 text-slate-500 text-sm font-semibold">
              <LayoutGrid className="w-4 h-4" />
              Apps Hub
            </div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight mt-2">bybo.ai</h1>
            <p className="text-slate-500 font-medium mt-1">
              Share tools as <span className="font-semibold">bybo.ai/&lt;app&gt;</span>
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-600">
            Shareable hub:
            <div className="font-mono text-slate-800">/apps</div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {apps.map((app) => {
            const Icon = app.icon;
            return (
              <div key={app.href} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-slate-100 rounded-xl">
                    <Icon className="w-6 h-6 text-slate-700" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-bold text-slate-900">{app.title}</h2>
                      {app.tag ? (
                        <span className="text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">
                          {app.tag}
                        </span>
                      ) : null}
                    </div>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">{app.description}</p>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between">
                  <div className="text-xs text-slate-500 font-mono">{app.href}</div>
                  <Link
                    href={app.href}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 font-semibold text-sm"
                  >
                    Open
                    <ExternalLink className="w-4 h-4 opacity-80" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-bold text-slate-900">Scale the pattern</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            <li>• Keep <span className="font-semibold">bybo.ai</span> on one Vercel project.</li>
            <li>• Add tools by path: <span className="font-mono">/tool-a</span>, <span className="font-mono">/tool-b</span>, etc.</li>
            <li>• Either build tools as routes in this repo, or use Vercel rewrites to forward a path to another project.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
