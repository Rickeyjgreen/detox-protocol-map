'use client';

import React, { useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle2, Copy, ExternalLink, Phone, Search, ShieldAlert, Users, Wrench } from 'lucide-react';
import contactsSeed from '@/data/crisis/contacts.json';
import scenariosA from '@/data/crisis/scenarios-a.json';
import scenariosB from '@/data/crisis/scenarios-b.json';
import questionFlow from '@/data/crisis/questionFlow.json';
import docTemplates from '@/data/crisis/docTemplates.json';
import policyConflicts from '@/data/crisis/policyConflicts.json';

type Contact = { id: string; name: string; role: string; notes?: string; actions: { id: string; type: string; label: string; value: string; href: string; primary?: boolean }[] };
type Scenario = {
  id: string; title: string; category: string; entryGroup: string; keywords: string[]; severity: 'red' | 'orange' | 'yellow' | 'green';
  short_description: string; responseLevel: string; requirements: { requires_911: boolean; requires_supervisor: boolean; requires_clinical_on_call: boolean; requires_peer_support_on_call: boolean; requires_maintenance_on_call: boolean; no_call_required: boolean };
  do_now: string[]; call_now: string[]; notify_after: string[]; documentation: string[]; follow_up: string[]; special_notes: string[];
};

const styles = {
  red: { badge: 'bg-red-600 text-white', card: 'border-red-200 bg-red-50' },
  orange: { badge: 'bg-orange-500 text-white', card: 'border-orange-200 bg-orange-50' },
  yellow: { badge: 'bg-yellow-400 text-slate-900', card: 'border-yellow-200 bg-yellow-50' },
  green: { badge: 'bg-emerald-600 text-white', card: 'border-emerald-200 bg-emerald-50' },
} as const;

function score(s: Scenario, q: string) {
  if (!q.trim()) return 0;
  const hay = [s.title, s.category, s.short_description, ...s.keywords].join(' ').toLowerCase();
  return q.toLowerCase().split(/\s+/).filter(Boolean).reduce((n, t) => n + (hay.includes(t) ? 1 : 0) + (s.title.toLowerCase().includes(t) ? 3 : 0), 0);
}

function renderTemplate(t: string, s: Scenario, calls: string[]) {
  return t
    .replaceAll('{{title}}', s.title)
    .replaceAll('{{severity}}', s.severity.toUpperCase())
    .replaceAll('{{do_now_1}}', s.do_now[0] ?? '-')
    .replaceAll('{{call_list}}', calls.length ? calls.join(', ') : 'No immediate call required')
    .replaceAll('{{doc_list}}', s.documentation.join(', '))
    .replaceAll('{{follow_up_1}}', s.follow_up[0] ?? 'No additional follow-up noted');
}

export default function Page() {
  const [entryGroup, setEntryGroup] = useState('emergency');
  const [search, setSearch] = useState('');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [contacts, setContacts] = useState<Contact[]>(contactsSeed as Contact[]);
  const scenarios = ([...(scenariosA as Scenario[]), ...(scenariosB as Scenario[])]) as Scenario[];
  const [selectedId, setSelectedId] = useState((scenarios[0]?.id) ?? '');
  const [checks, setChecks] = useState<string[]>([]);

  const contactMap = useMemo(() => contacts.reduce<Record<string, Contact>>((a, c) => ((a[c.id] = c), a), {}), [contacts]);

  const filtered = useMemo(() => {
    let items = scenarios.filter((s) => s.entryGroup === entryGroup);
    if (answers.immediateDanger === 'yes') items = items.filter((s) => s.requirements.requires_911 || s.severity !== 'green');
    if (answers.domain) items = items.filter((s) => s.category === answers.domain);
    if (answers.responseLevel) items = items.filter((s) => s.responseLevel === answers.responseLevel);
    if (search.trim()) items = items.map((s) => ({ s, n: score(s, search) })).filter((x) => x.n > 0).sort((a, b) => b.n - a.n).map((x) => x.s);
    return items;
  }, [answers, entryGroup, scenarios, search]);

  const selected = filtered.find((s) => s.id === selectedId) ?? filtered[0] ?? null;
  const callNow = selected ? selected.call_now.map((id) => contactMap[id]).filter(Boolean) : [];
  const notifyAfter = selected ? selected.notify_after.map((id) => contactMap[id]).filter(Boolean) : [];
  const templates = selected ? [
    { title: (docTemplates as any).shiftReport.title, value: renderTemplate((docTemplates as any).shiftReport.template, selected, callNow.map((c) => c.name)) },
    { title: (docTemplates as any).concernEmail.title, value: renderTemplate((docTemplates as any).concernEmail.template, selected, callNow.map((c) => c.name)) },
    { title: (docTemplates as any).evolvNote.title, value: renderTemplate((docTemplates as any).evolvNote.template, selected, callNow.map((c) => c.name)) },
    { title: (docTemplates as any).cirChecklist.title, value: renderTemplate((docTemplates as any).cirChecklist.template, selected, callNow.map((c) => c.name)) },
  ] : [];

  async function copyText(v: string) { try { await navigator.clipboard.writeText(v); } catch {} }
  function updateContact(contactId: string, actionId: string, value: string) {
    setContacts((current) => current.map((contact) => contact.id !== contactId ? contact : {
      ...contact,
      actions: contact.actions.map((action) => action.id !== actionId ? action : {
        ...action,
        value,
        href: action.type === 'call' ? (value.replace(/[^\d]/g, '').length ? `tel:+1${value.replace(/[^\d]/g, '').slice(-10)}` : '#admin') : action.type === 'email' ? (value ? `mailto:${value}` : '#admin') : (value || '#admin'),
      }),
    }));
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="sticky top-0 z-40 border-b border-slate-800/10 bg-slate-950 text-white">
        <div className="mx-auto flex max-w-7xl flex-wrap gap-2 px-3 py-3 md:px-6">
          <a href="tel:911" className="rounded-xl bg-red-600 px-4 py-3 text-sm font-bold">Call 911</a>
          {['shift-supervisor-1','on-call-supervisor','on-call-clinical','on-call-peer','on-call-maintenance'].map((id) => {
            const c = contactMap[id];
            const href = c?.actions.find((a) => a.primary)?.href || c?.actions[0]?.href || '#admin';
            const label = id === 'shift-supervisor-1' ? 'Call shift supervisor' : id === 'on-call-supervisor' ? 'Call on-call supervisor' : id === 'on-call-clinical' ? 'Call on-call clinical' : id === 'on-call-peer' ? 'Call peer support on-call' : 'Call maintenance on-call';
            return <a key={id} href={href} className="rounded-xl bg-slate-800 px-4 py-3 text-sm font-semibold">{label}</a>;
          })}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-3 py-5 md:px-6">
        <div className="mb-6">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-500">Liberty Place + Freedom Houses</p>
          <h1 className="mt-1 text-3xl font-black tracking-tight">Crisis Decision Dashboard</h1>
          <p className="mt-2 max-w-3xl text-sm text-slate-600">Searchable, mobile-first action engine built from the ARS crisis decision tree.</p>
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-3">
          {((questionFlow as any).entryPoints || []).map((entry: any) => {
            const Icon = entry.id === 'emergency' ? ShieldAlert : entry.id === 'client' ? Users : Wrench;
            const active = entryGroup === entry.id;
            return <button key={entry.id} onClick={() => setEntryGroup(entry.id)} className={`rounded-3xl p-6 text-left ${active ? 'bg-slate-900 text-white' : 'border border-slate-200 bg-white'}`}>
              <div className="mb-4 inline-flex rounded-2xl bg-slate-100 p-3 text-slate-900"><Icon className="h-7 w-7" /></div>
              <div className="text-xl font-black">{entry.title}</div>
              <p className={`mt-2 text-sm ${active ? 'text-slate-300' : 'text-slate-600'}`}>{entry.description}</p>
            </button>;
          })}
        </div>

        <div className="mb-6 rounded-3xl border border-slate-200 bg-white p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex-1">
              <label className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Search situations</label>
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"><Search className="h-5 w-5 text-slate-400" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="suicidal, client wants to leave, fire, media, overdose..." className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400" /></div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => { setAnswers({}); setSearch(''); }} className="rounded-2xl bg-slate-200 px-4 py-3 text-sm font-semibold">Reset filters</button>
              <button onClick={() => window.print()} className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white">Print / save quick card</button>
            </div>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {((questionFlow as any).wizardQuestions || []).map((q: any) => <div key={q.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><div className="mb-3 text-sm font-bold">{q.label}</div><div className="flex flex-wrap gap-2">{q.options.map((opt: any) => <button key={opt.value} onClick={() => setAnswers((a) => ({ ...a, [q.id]: opt.value }))} className={`rounded-xl px-3 py-2 text-xs font-semibold ${answers[q.id] === opt.value ? 'bg-slate-900 text-white' : 'bg-slate-200'}`}>{opt.label}</button>)}</div></div>)}
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
          <div className="rounded-3xl border border-slate-200 bg-white p-4">
            <div className="mb-3 flex items-center justify-between"><div><div className="text-sm font-bold">Scenario directory</div><div className="text-xs text-slate-500">{filtered.length} matching scenario(s)</div></div></div>
            <div className="grid gap-3">
              {filtered.map((s) => <button key={s.id} onClick={() => setSelectedId(s.id)} className={`rounded-2xl border p-4 text-left ${selected?.id === s.id ? `${styles[s.severity].card} ring-2 ring-slate-900/10` : 'border-slate-200 bg-white'}`}><div className="mb-2 flex items-center justify-between"><div className="text-sm font-bold">{s.title}</div><span className={`rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${styles[s.severity].badge}`}>{s.severity}</span></div><div className="text-xs text-slate-500">{s.category}</div><p className="mt-2 text-xs leading-relaxed text-slate-600">{s.short_description}</p></button>)}
            </div>
          </div>

          <div className="space-y-6">
            {selected ? <>
              <div className="rounded-3xl border border-slate-200 bg-white p-6">
                <div className={`inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${styles[selected.severity].badge}`}>{selected.severity} severity</div>
                <h2 className="mt-3 text-2xl font-black tracking-tight">{selected.title}</h2>
                <p className="mt-2 text-sm text-slate-600">{selected.short_description}</p>
                <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-bold">When in doubt, call the shift supervisor or on-call supervisor.</div>

                <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {[[ '911 required', selected.requirements.requires_911 ], [ 'Supervisor call required', selected.requirements.requires_supervisor ], [ 'Clinical on-call required', selected.requirements.requires_clinical_on_call ], [ 'Peer support on-call required', selected.requirements.requires_peer_support_on_call ], [ 'Maintenance call required', selected.requirements.requires_maintenance_on_call ], [ 'No call required', selected.requirements.no_call_required ]].map(([label, value]) => <div key={String(label)} className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><div className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</div><div className="mt-2 text-lg font-black">{value ? 'YES' : 'NO'}</div></div>)}
                </div>

                <div className="mt-6 grid gap-6 xl:grid-cols-2">
                  <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5"><h3 className="mb-4 text-lg font-bold">Do this now</h3><ol className="space-y-3">{selected.do_now.map((step, i) => <li key={step} className="flex gap-3 text-sm leading-relaxed"><span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-black text-white">{i + 1}</span><span>{step}</span></li>)}</ol></section>
                  <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5"><h3 className="mb-4 text-lg font-bold">Call / notify</h3><div className="space-y-4"><div><div className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">Call now</div><div className="grid gap-3">{callNow.length ? callNow.map((c) => <div key={c.id} className="rounded-2xl border border-slate-200 bg-white p-4"><div className="text-sm font-bold">{c.name}</div><div className="text-xs text-slate-500">{c.role}</div><div className="mt-3 flex flex-wrap gap-2">{c.actions.map((a) => <a key={a.id} href={a.href} className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white">{a.type === 'call' ? <Phone className="h-3.5 w-3.5" /> : <ExternalLink className="h-3.5 w-3.5" />}{a.label}</a>)}</div></div>) : <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm">No immediate call required.</div>}</div></div><div><div className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">Notify after</div><div className="grid gap-2">{notifyAfter.length ? notifyAfter.map((c) => <div key={c.id} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm"><div className="font-semibold">{c.name}</div><div className="text-xs text-slate-500">{c.role}</div></div>) : <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm">No additional after-call notifications listed.</div>}</div></div></div></section>
                  <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5"><h3 className="mb-4 text-lg font-bold">Document</h3><div className="space-y-3">{selected.documentation.map((item) => { const key = `${selected.id}:${item}`; return <label key={item} className="flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4"><input type="checkbox" checked={checks.includes(key)} onChange={() => setChecks((d) => d.includes(key) ? d.filter((x) => x !== key) : [...d, key])} className="mt-1 h-4 w-4" /><div><div className="text-sm font-semibold">{item}</div><div className="text-xs text-slate-500">Mark complete as you finish each documentation step.</div></div></label>; })}</div></section>
                  <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5"><h3 className="mb-4 text-lg font-bold">Special notes</h3><div className="space-y-3">{selected.special_notes.map((note) => <div key={note} className="rounded-2xl border border-slate-200 bg-white p-4 text-sm leading-relaxed">{note}</div>)}{!!selected.follow_up.length && <div className="rounded-2xl border border-slate-200 bg-white p-4"><div className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">Follow-up</div><ul className="space-y-2 text-sm leading-relaxed">{selected.follow_up.map((item) => <li key={item} className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" /><span>{item}</span></li>)}</ul></div>}</div></section>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-slate-900 p-5 text-white"><div className="mb-4 flex items-center gap-2"><Copy className="h-5 w-5" /><h3 className="text-lg font-bold">Documentation helper</h3></div><div className="grid gap-4 md:grid-cols-2">{templates.map((item) => <div key={item.title} className="rounded-2xl border border-slate-700 bg-slate-950 p-4"><div className="mb-2 text-sm font-bold">{item.title}</div><pre className="max-h-48 overflow-auto whitespace-pre-wrap text-xs leading-relaxed text-slate-300">{item.value}</pre><button onClick={() => copyText(item.value)} className="mt-3 inline-flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-xs font-bold text-slate-900"><Copy className="h-3.5 w-3.5" />Copy template</button></div>)}</div></div>
            </> : <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center"><h2 className="text-2xl font-black">No matching scenario found</h2><p className="mt-2 text-sm text-slate-600">Try broader keywords or reset the filters.</p></div>}
          </div>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
          <div className="rounded-3xl border border-slate-200 bg-white p-6"><div className="mb-4 flex items-center gap-3"><AlertTriangle className="h-6 w-6" /><div><h2 className="text-xl font-black">Policy Conflicts / Needs Review</h2><p className="text-sm text-slate-600">Leadership can resolve source conflicts here without redeploying code.</p></div></div><div className="space-y-4">{((policyConflicts as any[]) || []).map((item: any) => <div key={item.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-5"><div className="mb-2 flex flex-wrap items-center gap-2"><span className="rounded-full bg-orange-500 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white">{item.severity}</span><span className="rounded-full bg-slate-200 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-slate-800">{item.status}</span></div><h3 className="text-lg font-bold">{item.title}</h3><p className="mt-2 text-sm leading-relaxed text-slate-600">{item.summary}</p><div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4"><div className="text-xs font-bold uppercase tracking-wide text-slate-500">Source note</div><p className="mt-2 text-sm leading-relaxed">{item.source_note}</p></div></div>)}</div></div>
          <div id="admin" className="rounded-3xl border border-slate-200 bg-white p-6"><div className="mb-4"><h2 className="text-xl font-black">Editable contacts (preview)</h2><p className="mt-1 text-sm text-slate-600">Preview-only editing for contact values and action targets.</p></div><div className="space-y-4">{contacts.map((contact) => <div key={contact.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><div className="text-sm font-bold">{contact.name}</div><div className="mb-3 text-xs text-slate-500">{contact.role}</div><div className="space-y-3">{contact.actions.map((action) => <label key={action.id} className="block"><div className="mb-1 text-[11px] font-bold uppercase tracking-wide text-slate-500">{action.label}</div><input value={action.value} onChange={(e) => updateContact(contact.id, action.id, e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none" /></label>)}</div></div>)}</div></div>
        </div>
      </div>
    </div>
  );
}
