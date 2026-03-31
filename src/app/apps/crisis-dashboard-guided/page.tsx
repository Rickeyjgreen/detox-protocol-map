'use client';

import React, { useMemo, useState } from 'react';
import {
  CheckCircle2,
  Copy,
  ExternalLink,
  Phone,
  Search,
  ShieldAlert,
  Users,
  Wrench,
  X,
} from 'lucide-react';
import contactsSeed from '@/data/crisis/contacts-live-test.json';
import scenariosA from '@/data/crisis/scenarios-a.json';
import scenariosB from '@/data/crisis/scenarios-b.json';
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

type WizardGroup = 'emergency' | 'client' | 'facility';

const severityStyles = {
  red: { badge: 'bg-red-600 text-white', card: 'border-red-200 bg-red-50' },
  orange: { badge: 'bg-orange-500 text-white', card: 'border-orange-200 bg-orange-50' },
  yellow: { badge: 'bg-yellow-300 text-slate-900', card: 'border-yellow-200 bg-yellow-50' },
  green: { badge: 'bg-blue-700 text-white', card: 'border-blue-200 bg-blue-50' },
} as const;

const wizardDomains: Record<WizardGroup, string[]> = {
  emergency: ['Medical', 'Safety / Violence', 'Fire', 'Police / Media / External'],
  client: ['Medical', 'Behavioral / Emotional', 'Client Status / Movement'],
  facility: ['Staff / Facility', 'Safety / Violence', 'Police / Media / External', 'Transportation / Vehicle', 'Fire'],
};

const groupLabels: Record<WizardGroup, string> = {
  emergency: 'Emergency / Danger Right Now',
  client: 'Client Situation',
  facility: 'Staff / Facility Situation',
};

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

function sortScenarios(items: Scenario[]) {
  const weight: Record<Scenario['severity'], number> = { red: 4, orange: 3, yellow: 2, green: 1 };
  return [...items].sort((a, b) => weight[b.severity] - weight[a.severity] || a.title.localeCompare(b.title));
}

export default function Page() {
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

  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState('');
  const [checks, setChecks] = useState<string[]>([]);
  const [wizardGroup, setWizardGroup] = useState<WizardGroup | null>(null);
  const [wizardDanger, setWizardDanger] = useState<string>('');
  const [wizardDomain, setWizardDomain] = useState<string>('');

  const searchResults = useMemo(() => {
    if (!search.trim()) return [];
    return scenarios
      .map((scenario) => ({ scenario, score: scoreScenario(scenario, search) }))
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((item) => item.scenario)
      .slice(0, 8);
  }, [scenarios, search]);

  const wizardCandidates = useMemo(() => {
    if (!wizardGroup) return [];
    let items = scenarios.filter((scenario) => scenario.entryGroup === wizardGroup);
    if (wizardDanger === 'yes') {
      items = items.filter((scenario) => scenario.requirements.requires_911 || scenario.severity === 'red' || scenario.severity === 'orange');
    }
    if (wizardDanger === 'no') {
      items = items.filter((scenario) => !scenario.requirements.requires_911 || scenario.severity !== 'red');
    }
    if (wizardDomain) {
      items = items.filter((scenario) => scenario.category === wizardDomain);
    }
    return sortScenarios(items).slice(0, 8);
  }, [scenarios, wizardDanger, wizardDomain, wizardGroup]);

  const selected =
    search.trim()
      ? searchResults.find((scenario) => scenario.id === selectedId) ?? searchResults[0] ?? scenarios.find((scenario) => scenario.id === selectedId) ?? null
      : scenarios.find((scenario) => scenario.id === selectedId) ?? null;

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

  function openWizard(group: WizardGroup) {
    setWizardGroup(group);
    setWizardDanger('');
    setWizardDomain('');
  }

  function closeWizard() {
    setWizardGroup(null);
    setWizardDanger('');
    setWizardDomain('');
  }

  function pickScenario(scenarioId: string) {
    setSelectedId(scenarioId);
    setSearch('');
    closeWizard();
    if (typeof window !== 'undefined') {
      window.setTimeout(() => {
        document.getElementById('result-card')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    }
  }

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
                className={`shrink-0 rounded-xl px-3 py-2 text-xs font-bold tracking-wide ${id === '911' ? 'bg-red-600 text-white' : 'bg-white text-blue-950'}`}
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
              This page helps staff know what to do next.
            </p>
          </div>
        </div>

        <div className="mb-6 rounded-3xl border border-blue-100 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-black text-blue-950">How to use this page</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-4">
            {[
              '1. Tap the kind of problem.',
              '2. Answer the short questions.',
              '3. Open the best match.',
              '4. Follow the steps on the screen.',
            ].map((step) => (
              <div key={step} className="rounded-2xl border border-blue-100 bg-blue-50/40 p-4 text-sm font-semibold text-slate-700">
                {step}
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-bold text-red-700">
            If someone may die or get badly hurt, call 911 first.
          </div>
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-3">
          {([
            { id: 'emergency', title: 'Emergency / Danger Right Now', desc: 'Use this when someone may be badly hurt, very sick, or unsafe.', icon: ShieldAlert },
            { id: 'client', title: 'Client Situation', desc: 'Use this for client behavior, health, passes, or leaving.', icon: Users },
            { id: 'facility', title: 'Staff / Facility Situation', desc: 'Use this for staff issues, media, equipment, or cars.', icon: Wrench },
          ] as const).map((entry) => {
            const Icon = entry.icon;
            return (
              <button
                key={entry.id}
                onClick={() => openWizard(entry.id)}
                className="rounded-3xl border border-blue-100 bg-white p-5 text-left shadow-sm transition hover:border-blue-300"
              >
                <div className="mb-4 inline-flex rounded-2xl bg-blue-50 p-3 text-blue-800">
                  <Icon className="h-6 w-6" />
                </div>
                <div className="text-lg font-black text-blue-950">{entry.title}</div>
                <p className="mt-2 text-sm text-slate-600">{entry.desc}</p>
              </button>
            );
          })}
        </div>

        <div className="mb-6 rounded-3xl border border-blue-100 bg-white p-5 shadow-sm">
          <label className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-blue-700">Or type a word</label>
          <div className="flex items-center gap-3 rounded-2xl border border-blue-100 bg-slate-50 px-4 py-3">
            <Search className="h-5 w-5 text-blue-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Try words like fire, suicidal, late, media, overdose"
              className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
            />
          </div>
          {!!searchResults.length && (
            <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {searchResults.map((scenario) => (
                <button
                  key={scenario.id}
                  onClick={() => setSelectedId(scenario.id)}
                  className="rounded-2xl border border-blue-100 bg-white p-4 text-left"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-sm font-bold text-blue-950">{scenario.title}</div>
                    <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${severityStyles[scenario.severity].badge}`}>
                      {scenario.severity}
                    </span>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-slate-600">{scenario.short_description}</p>
                </button>
              ))}
            </div>
          )}
        </div>

        {selected ? (
          <div id="result-card" className="space-y-6">
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
                                    className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold ${action.type === 'call' ? 'bg-blue-900 text-white' : 'bg-red-600 text-white'}`}
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
                      <div className="grid gap-3">
                        {notifyAfter.length ? (
                          notifyAfter.map((contact) => (
                            <div key={contact.id} className="rounded-2xl border border-blue-100 bg-white p-4">
                              <div className="text-sm font-bold text-blue-950">{contact.name}</div>
                              <div className="text-xs text-slate-500">{contact.role}</div>
                              {!!getActionableActions(contact).length && (
                                <div className="mt-3 flex flex-wrap gap-2">
                                  {getActionableActions(contact).map((action) => (
                                    <a
                                      key={action.id}
                                      href={action.href}
                                      className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold ${action.type === 'call' ? 'bg-blue-900 text-white' : 'bg-red-600 text-white'}`}
                                    >
                                      {action.type === 'call' ? <Phone className="h-3.5 w-3.5" /> : <ExternalLink className="h-3.5 w-3.5" />}
                                      {action.label}
                                    </a>
                                  ))}
                                </div>
                              )}
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
                            onChange={() => setChecks((current) => (current.includes(key) ? current.filter((entry) => entry !== key) : [...current, key]))}
                            className="mt-1 h-4 w-4"
                          />
                          <div>
                            <div className="text-sm font-semibold text-blue-950">{item}</div>
                            <div className="text-xs text-slate-500">Mark complete as you finish each step.</div>
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
                    <button onClick={() => copyText(item.value)} className="mt-3 inline-flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-xs font-bold text-blue-950">
                      <Copy className="h-3.5 w-3.5" />
                      Copy template
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-3xl border border-blue-100 bg-white p-8 text-center shadow-sm">
            <h2 className="text-2xl font-black text-blue-950">Pick a category to start</h2>
            <p className="mt-2 text-sm text-slate-600">Tap a big button above. Answer the short questions. Then read the action card.</p>
          </div>
        )}
      </div>

      {wizardGroup && (
        <div className="fixed inset-0 z-50 flex items-end bg-slate-950/45 p-0 md:items-center md:justify-center md:p-6">
          <div className="w-full rounded-t-3xl border border-blue-100 bg-white p-5 shadow-2xl md:max-w-2xl md:rounded-3xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-xs font-bold uppercase tracking-[0.2em] text-blue-700">Guided help</div>
                <h2 className="mt-1 text-2xl font-black text-blue-950">{groupLabels[wizardGroup]}</h2>
                <p className="mt-2 text-sm text-slate-600">Answer a few short questions. Then tap the best match.</p>
              </div>
              <button onClick={closeWizard} className="rounded-xl bg-slate-100 p-2 text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-5 space-y-5">
              <div className="rounded-2xl border border-blue-100 bg-blue-50/40 p-4">
                <div className="mb-3 text-sm font-bold text-blue-950">1. Is anyone in danger right now?</div>
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: 'yes', label: 'Yes' },
                    { value: 'no', label: 'No' },
                    { value: 'not-sure', label: 'Not sure' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setWizardDanger(option.value)}
                      className={`rounded-xl px-4 py-3 text-sm font-bold ${wizardDanger === option.value ? 'bg-blue-900 text-white' : 'bg-white text-slate-700'}`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {wizardDanger && (
                <div className="rounded-2xl border border-blue-100 bg-blue-50/40 p-4">
                  <div className="mb-3 text-sm font-bold text-blue-950">2. What is this mostly about?</div>
                  <div className="flex flex-wrap gap-2">
                    {wizardDomains[wizardGroup].map((domain) => (
                      <button
                        key={domain}
                        onClick={() => setWizardDomain(domain)}
                        className={`rounded-xl px-4 py-3 text-sm font-bold ${wizardDomain === domain ? 'bg-blue-900 text-white' : 'bg-white text-slate-700'}`}
                      >
                        {domain}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {wizardDanger && wizardDomain && (
                <div className="rounded-2xl border border-blue-100 bg-slate-50 p-4">
                  <div className="mb-3 text-sm font-bold text-blue-950">3. Tap the best match</div>
                  <div className="grid gap-3 md:grid-cols-2">
                    {wizardCandidates.length ? (
                      wizardCandidates.map((scenario) => (
                        <button
                          key={scenario.id}
                          onClick={() => pickScenario(scenario.id)}
                          className="rounded-2xl border border-blue-100 bg-white p-4 text-left"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="text-sm font-bold text-blue-950">{scenario.title}</div>
                            <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${severityStyles[scenario.severity].badge}`}>
                              {scenario.severity}
                            </span>
                          </div>
                          <p className="mt-2 text-xs leading-relaxed text-slate-600">{scenario.short_description}</p>
                        </button>
                      ))
                    ) : (
                      <div className="rounded-2xl border border-blue-100 bg-white p-4 text-sm text-slate-600">
                        No close match was found. Close this window and use the search box.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
