'use client';

import React, { useMemo, useState } from 'react';
import { CheckCircle2, Copy, ExternalLink, Phone, Search, ShieldAlert, Users, Wrench } from 'lucide-react';
import contactsSeed from '@/data/crisis/contacts-live-test.json';
import scenariosA from '@/data/crisis/scenarios-a.json';
import scenariosB from '@/data/crisis/scenarios-b.json';
import questionFlow from '@/data/crisis/questionFlow.json';
import docTemplates from '@/data/crisis/docTemplates.json';

type ContactAction = {
  id: string;
  type: string;
  label: string;
  value: string;
  href: string;
  primary?: boolean;
};

type Contact = {
  id: string;
  name: string;
  role: string;
  active?: boolean;
  notes?: string;
  actions: ContactAction[];
};

type Scenario = {
  id: string;
  title: string;
  category: string;
  entryGroup: string;
  keywords: string[];
  severity: 'red' | 'orange' | 'yellow' | 'green';
  short_description: string;
  responseLevel: string;
  requirements: {
    requires_911: boolean;
    requires_supervisor: boolean;
    requires_clinical_on_call: boolean;
    requires_peer_support_on_call: boolean;
    requires_maintenance_on_call: boolean;
    no_call_required: boolean;
  };
  do_now: string[];
  call_now: string[];
  notify_after: string[];
  documentation: string[];
  follow_up: string[];
  special_notes: string[];
};

const severityStyles = {
  red: {
    badge: 'bg-red-600 text-white',
    card: 'border-red-200 bg-red-50',
  },
  orange: {
    badge: 'bg-orange-500 text-white',
    card: 'border-orange-200 bg-orange-50',
  },
  yellow: {
    badge: 'bg-yellow-300 text-slate-900',
    card: 'border-yellow-200 bg-yellow-50',
  },
  green: {
    badge: 'bg-blue-700 text-white',
    card: 'border-blue-200 bg-blue-50',
  },
} as const;

function scoreScenario(scenario: Scenario, query: string) {
  if (!query.trim()) return 0;
  const haystack = [scenario.title, scenario.category, scenario.short_description, ...scenario.keywords].join(' ').toLowerCase();
  return query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .reduce((total, token) => total + (haystack.includes(token) ? 1 : 0) + (scenario.title.toLowerCase().includes(token) ? 3 : 0), 0);
}

function renderTemplate(template: string, scenario: Scenario, callNames: string[]) {
  return template
    .replaceAll('{{title}}', scenario.title)
    .replaceAll('{{severity}}', scenario.severity.toUpperCase())
    .replaceAll('{{do_now_1}}', scenario.do_now[0] ?? '-')
    .replaceAll('{{call_list}}', callNames.length ? callNames.join(', ') : 'No immediate call required')
    .replaceAll('{{doc_list}}', scenario.documentation.join(', '))
    .replaceAll('{{follow_up_1}}', scenario.follow_up[0] ?? 'No additional follow-up noted');
}

function getActionableActions(contact?: Contact) {
  if (!contact) return [];
  return (contact.actions || []).filter((action) => action.href && !action.href.startsWith('#') && action.value);
}

export default function Page() {
  const [entryGroup, setEntryGroup] = useState('emergency');
  const [search, setSearch] = useState('');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selectedId, setSelectedId] = useState('');
  const [checks, setChecks] = useState<string[]>([]);

  const contacts = useMemo(() => (contactsSeed as Contact[]).filter((contact) => contact.active !== false), []);
  const scenarios = useMemo(() => ([...(scenariosA as Scenario[]), ...(scenariosB as Scenario[])]) as Scenario[], []);
  const contactMap = useMemo(
    () =>
      contacts.reduce<Record<string, Contact>>((acc, contact) => {
        acc[contact.id] = contact;
        return acc;
      }, {}),
    [contacts],
  );

  const filtered = useMemo(() => {
    let items = scenarios.filter((scenario) => scenario.entryGroup === entryGroup);
    if (answers.immediateDanger === 'yes') {
      items = items.filter((scenario) => scenario.requirements.requires_911 || scenario.severity !== 'green');
    }
    if (answers.domain) {
      items = items.filter((scenario) => scenario.category === answers.domain);
    }
    if (answers.responseLevel) {
      items = items.filter((scenario) => scenario.responseLevel === answers.responseLevel);
    }
    if (search.trim()) {
      items = items
        .map((scenario) => ({ scenario, score: scoreScenario(scenario, search) }))
        .filter((item) => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .map((item) => item.scenario);
    }
    return items;
  }, [answers, entryGroup, scenarios, search]);

  const selected = filtered.find((scenario) => scenario.id === selectedId) ?? filtered[0] ?? null;

  const callNow = useMemo(() => {
    if (!selected) return [];
    return selected.call_now
      .map((id) => contactMap[id])
      .filter((contact) => getActionableActions(contact).length > 0);
  }, [contactMap, selected]);

  const notifyAfter = useMemo(() => {
    if (!selected) return [];
    return selected.notify_after
      .map((id) => contactMap[id])
      .filter(Boolean)
      .filter((contact, index, arr) => arr.findIndex((item) => item.id === contact.id) === index);
  }, [contactMap, selected]);

  const templates = useMemo(() => {
    if (!selected) return [];
    const callNames = callNow.map((contact) => contact.name);
    return [
      {
        title: (docTemplates as any).shiftReport.title,
        value: renderTemplate((docTemplates as any).shiftReport.template, selected, callNames),
      },
      {
        title: (docTemplates as any).concernEmail.title,
        value: renderTemplate((docTemplates as any).concernEmail.template, selected, callNames),
      },
      {
        title: (docTemplates as any).evolvNote.title,
        value: renderTemplate((docTemplates as any).evolvNote.template, selected, callNames),
      },
      {
        title: (docTemplates as any).cirChecklist.title,
        value: renderTemplate((docTemplates as any).cirChecklist.template, selected, callNames),
      },
    ];
  }, [callNow, selected]);

  const quickContactIds = ['911', 'shift-supervisor-1', 'shift-supervisor-2', 'on-call-clinical', 'on-call-peer', 'on-call-maintenance', 'director'];

  async function copyText(value: string) {
    try {
      await navigator.clipboard.writeText(value);
    } catch {}
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="sticky top-0 z-40 border-b border-blue-900/20 bg-blue-950 text-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center gap-2 overflow-x-auto px-3 py-2 md:px-6">
          {quickContactIds.map((id) => {
            const contact = contactMap[id];
            const primary = getActionableActions(contact).find((action) => action.primary) ?? getActionableActions(contact)[0];
            if (!contact || !primary) return null;

            const label =
              id === '911'
                ? '911'
                : id === 'shift-supervisor-1'
                  ? 'Deborah'
                  : id === 'shift-supervisor-2'
                    ? 'Brittany'
                    : id === 'on-call-clinical'
                      ? 'Clinical'
                      : id === 'on-call-peer'
                        ? 'Peer Support'
                        : id === 'on-call-maintenance'
                          ? 'Maintenance'
                          : 'Director';

            return (
              <a
                key={id}
                href={primary.href}
                className={`shrink-0 rounded-xl px-3 py-2 text-xs font-bold tracking-wide ${
                  id === '911' ? 'bg-red-600 text-white' : 'bg-white text-blue-950'
                }`}
              >
                {label}
              </a>
            );
          })}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-3 py-5 md:px-6">
        <div className="mb-6 overflow-hidden rounded-3xl border border-blue-100 bg-white shadow-sm">
          <div className="h-2 bg-gradient-to-r from-red-600 via-white to-blue-900" />
          <div className="px-5 py-5 md:px-6 md:py-6">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-blue-700">VOA Mid-States | Liberty Place + Freedom Houses</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-blue-950">Crisis Decision Dashboard</h1>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">
              Searchable, mobile-first action engine for staff. The goal is to tell someone what to do next in under 10 seconds.
            </p>
          </div>
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-3">
          {((questionFlow as any).entryPoints || []).map((entry: any) => {
            const Icon = entry.id === 'emergency' ? ShieldAlert : entry.id === 'client' ? Users : Wrench;
            const active = entryGroup === entry.id;

            return (
              <button
                key={entry.id}
                onClick={() => setEntryGroup(entry.id)}
                className={`rounded-3xl border p-5 text-left transition ${
                  active ? 'border-blue-900 bg-blue-900 text-white shadow-sm' : 'border-blue-100 bg-white hover:border-blue-300'
                }`}
              >
                <div className={`mb-4 inline-flex rounded-2xl p-3 ${active ? 'bg-white text-blue-950' : 'bg-blue-50 text-blue-800'}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div className="text-lg font-black">{entry.title}</div>
                <p className={`mt-2 text-sm ${active ? 'text-blue-100' : 'text-slate-600'}`}>{entry.description}</p>
              </button>
            );
          })}
        </div>

        <div className="mb-6 rounded-3xl border border-blue-100 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex-1">
              <label className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-blue-700">Search situations</label>
              <div className="flex items-center gap-3 rounded-2xl border border-blue-100 bg-slate-50 px-4 py-3">
                <Search className="h-5 w-5 text-blue-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="suicidal, client wants to leave, fire, media, overdose..."
                  className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => { setAnswers({}); setSearch(''); }} className="rounded-2xl bg-slate-200 px-4 py-3 text-sm font-semibold">
                Reset filters
              </button>
              <button onClick={() => window.print()} className="rounded-2xl bg-red-600 px-4 py-3 text-sm font-semibold text-white">
                Print / save quick card
              </button>
            </div>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {((questionFlow as any).wizardQuestions || []).map((question: any) => (
              <div key={question.id} className="rounded-2xl border border-blue-100 bg-blue-50/40 p-4">
                <div className="mb-3 text-sm font-bold text-blue-950">{question.label}</div>
                <div className="flex flex-wrap gap-2">
                  {question.options.map((option: any) => (
                    <button
                      key={option.value}
                      onClick={() => setAnswers((current) => ({ ...current, [question.id]: option.value }))}
                      className={`rounded-xl px-3 py-2 text-xs font-semibold ${
                        answers[question.id] === option.value ? 'bg-blue-900 text-white' : 'bg-white text-slate-700'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
          <div className="rounded-3xl border border-blue-100 bg-white p-4 shadow-sm">
            <div className="mb-3">
              <div className="text-sm font-bold text-blue-950">Scenario directory</div>
              <div className="text-xs text-slate-500">{filtered.length} matching scenario(s)</div>
            </div>
            <div className="grid gap-3">
              {filtered.map((scenario) => (
                <button
                  key={scenario.id}
                  onClick={() => setSelectedId(scenario.id)}
                  className={`rounded-2xl border p-4 text-left ${
                    selected?.id === scenario.id ? `${severityStyles[scenario.severity].card} ring-2 ring-blue-900/10` : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <div className="text-sm font-bold">{scenario.title}</div>
                    <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${severityStyles[scenario.severity].badge}`}>
                      {scenario.severity}
                    </span>
                  </div>
                  <div className="text-xs text-blue-700">{scenario.category}</div>
                  <p className="mt-2 text-xs leading-relaxed text-slate-600">{scenario.short_description}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            {selected ? (
              <>
                <div className="rounded-3xl border border-blue-100 bg-white p-6 shadow-sm">
                  <div className={`inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${severityStyles[selected.severity].badge}`}>
                    {selected.severity} severity
                  </div>
                  <h2 className="mt-3 text-2xl font-black tracking-tight text-blue-950">{selected.title}</h2>
                  <p className="mt-2 text-sm text-slate-600">{selected.short_description}</p>
                  <div className="mt-4 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-bold text-red-700">
                    When in doubt, call the shift supervisor.
                  </div>

                  <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                    {[
                      ['911 required', selected.requirements.requires_911],
                      ['Supervisor call required', selected.requirements.requires_supervisor],
                      ['Clinical on-call required', selected.requirements.requires_clinical_on_call],
                      ['Peer support on-call required', selected.requirements.requires_peer_support_on_call],
                      ['Maintenance call required', selected.requirements.requires_maintenance_on_call],
                      ['No call required', selected.requirements.no_call_required],
                    ].map(([label, value]) => (
                      <div key={String(label)} className="rounded-2xl border border-blue-100 bg-blue-50/40 p-4">
                        <div className="text-xs font-bold uppercase tracking-wide text-blue-700">{label}</div>
                        <div className="mt-2 text-lg font-black text-blue-950">{value ? 'YES' : 'NO'}</div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 grid gap-6 xl:grid-cols-2">
                    <section className="rounded-2xl border border-blue-100 bg-slate-50 p-5">
                      <h3 className="mb-4 text-lg font-bold text-blue-950">Do this now</h3>
                      <ol className="space-y-3">
                        {selected.do_now.map((step, index) => (
                          <li key={step} className="flex gap-3 text-sm leading-relaxed">
                            <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-900 text-xs font-black text-white">
                              {index + 1}
                            </span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ol>
                    </section>

                    <section className="rounded-2xl border border-blue-100 bg-slate-50 p-5">
                      <h3 className="mb-4 text-lg font-bold text-blue-950">Call / notify</h3>
                      <div className="space-y-4">
                        <div>
                          <div className="mb-2 text-xs font-bold uppercase tracking-wide text-blue-700">Call now</div>
                          <div className="grid gap-3">
                            {callNow.length ? (
                              callNow.map((contact) => (
                                <div key={contact.id} className="rounded-2xl border border-blue-100 bg-white p-4">
                                  <div className="text-sm font-bold text-blue-950">{contact.name}</div>
                                  <div className="text-xs text-slate-500">{contact.role}</div>
                                  <div className="mt-3 flex flex-wrap gap-2">
                                    {getActionableActions(contact).map((action) => (
                                      <a
                                        key={action.id}
                                        href={action.href}
                                        className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold ${
                                          action.type === 'call' ? 'bg-blue-900 text-white' : 'bg-red-600 text-white'
                                        }`}
                                      >
                                        {action.type === 'call' ? <Phone className="h-3.5 w-3.5" /> : <ExternalLink className="h-3.5 w-3.5" />}
                                        {action.label}
                                      </a>
                                    ))}
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="rounded-2xl border border-blue-100 bg-white p-4 text-sm">No immediate call action is listed for this scenario.</div>
                            )}
                          </div>
                        </div>

                        <div>
                          <div className="mb-2 text-xs font-bold uppercase tracking-wide text-blue-700">Notify after</div>
                          <div className="grid gap-2">
                            {notifyAfter.length ? (
                              notifyAfter.map((contact) => (
                                <div key={contact.id} className="rounded-2xl border border-blue-100 bg-white px-4 py-3 text-sm">
                                  <div className="font-semibold text-blue-950">{contact.name}</div>
                                  <div className="text-xs text-slate-500">{contact.role}</div>
                                </div>
                              ))
                            ) : (
                              <div className="rounded-2xl border border-blue-100 bg-white p-4 text-sm">No additional after-call notifications listed.</div>
                            )}
                          </div>
                        </div>
                      </div>
                    </section>

                    <section className="rounded-2xl border border-blue-100 bg-slate-50 p-5">
                      <h3 className="mb-4 text-lg font-bold text-blue-950">Document</h3>
                      <div className="space-y-3">
                        {selected.documentation.map((item) => {
                          const key = `${selected.id}:${item}`;
                          return (
                            <label key={item} className="flex cursor-pointer items-start gap-3 rounded-2xl border border-blue-100 bg-white p-4">
                              <input
                                type="checkbox"
                                checked={checks.includes(key)}
                                onChange={() =>
                                  setChecks((current) => (current.includes(key) ? current.filter((entry) => entry !== key) : [...current, key]))
                                }
                                className="mt-1 h-4 w-4"
                              />
                              <div>
                                <div className="text-sm font-semibold text-blue-950">{item}</div>
                                <div className="text-xs text-slate-500">Mark complete as you finish each documentation step.</div>
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    </section>

                    <section className="rounded-2xl border border-blue-100 bg-slate-50 p-5">
                      <h3 className="mb-4 text-lg font-bold text-blue-950">Special notes</h3>
                      <div className="space-y-3">
                        {selected.special_notes.map((note) => (
                          <div key={note} className="rounded-2xl border border-blue-100 bg-white p-4 text-sm leading-relaxed">
                            {note}
                          </div>
                        ))}
                        {!!selected.follow_up.length && (
                          <div className="rounded-2xl border border-blue-100 bg-white p-4">
                            <div className="mb-2 text-xs font-bold uppercase tracking-wide text-blue-700">Follow-up</div>
                            <ul className="space-y-2 text-sm leading-relaxed">
                              {selected.follow_up.map((item) => (
                                <li key={item} className="flex gap-2">
                                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </section>
                  </div>
                </div>

                <div className="rounded-3xl border border-blue-100 bg-blue-950 p-5 text-white shadow-sm">
                  <div className="mb-4 flex items-center gap-2">
                    <Copy className="h-5 w-5" />
                    <h3 className="text-lg font-bold">Documentation helper</h3>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    {templates.map((item) => (
                      <div key={item.title} className="rounded-2xl border border-white/10 bg-blue-900 p-4">
                        <div className="mb-2 text-sm font-bold">{item.title}</div>
                        <pre className="max-h-48 overflow-auto whitespace-pre-wrap text-xs leading-relaxed text-blue-50">{item.value}</pre>
                        <button
                          onClick={() => copyText(item.value)}
                          className="mt-3 inline-flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-xs font-bold text-blue-950"
                        >
                          <Copy className="h-3.5 w-3.5" />
                          Copy template
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="rounded-3xl border border-blue-100 bg-white p-8 text-center shadow-sm">
                <h2 className="text-2xl font-black text-blue-950">No matching scenario found</h2>
                <p className="mt-2 text-sm text-slate-600">Try broader keywords or reset the filters.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
