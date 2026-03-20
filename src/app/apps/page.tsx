'use client';

import Link from 'next/link';
import React from 'react';
import { ChevronRight, ClipboardList, Map, ShieldCheck } from 'lucide-react';

const items = [
  {
    title: 'Detoxification Protocol Map',
    description: 'Clinical lanes + documentation phrases (protocol overview).',
    href: '/',
    icon: Map,
  },
  {
    title: 'Intake Logic',
    description: 'Decision-tree triage logic (step-by-step intake pathway).',
    href: '/intake-logic',
    icon: ClipboardList,
  },
];

export default function Page() {
  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8 font-sans text-slate-800">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-100 rounded-lg">
              <ShieldCheck className="w-6 h-6 text-slate-700" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">BYBO Apps</h1>
              <p className="text-slate-500 font-medium mt-1">Path-based tools served from bybo.ai</p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:border-slate-300 hover:bg-slate-50 transition-all flex items-start justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-slate-100">
                    <Icon className="w-6 h-6 text-slate-700" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-slate-900">{item.title}</div>
                    <div className="text-sm text-slate-600 mt-1">{item.description}</div>
                    <div className="text-xs text-slate-500 mt-3 font-mono">{item.href}</div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400 mt-1" />
              </Link>
            );
          })}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Shareable Links</h2>
          <div className="mt-3 space-y-2 text-sm">
            <div>
              <span className="font-mono">/intake-logic</span>
              <span className="text-slate-500"> — Intake logic decision tree</span>
            </div>
            <div>
              <span className="font-mono">/</span>
              <span className="text-slate-500"> — Detoxification protocol map</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
