'use client';

import { useMemo, useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  Activity,
  AlertTriangle,
  Brain,
  CheckCircle2,
  ClipboardList,
  Pill,
  ShieldAlert,
  Stethoscope,
  Users,
  Wine,
  Zap,
} from 'lucide-react';

type Step = { step: string; desc: string };
type Lane = {
  id: string;
  shortTitle: string;
  title: string;
  substances: string;
  icon: LucideIcon;
  color: string;
  textColor: string;
  borderColor: string;
  iconColor: string;
  ringColor: string;
  profile: string[];
  qualifiers: string[];
  pathway: Step[];
  directives: string[];
};

const lanes: Lane[] = [
  {
    id: 'lane-1',
    shortTitle: 'Lane 1: Stimulant',
    title: 'Stimulant / Polysubstance',
    substances: 'Methamphetamine / Cocaine / THC',
    icon: Zap,
    color: 'bg-orange-50',
    textColor: 'text-orange-700',
    borderColor: 'border-orange-200',
    iconColor: 'text-orange-500',
    ringColor: 'ring-orange-500',
    profile: [
      'Primary goal is Abstinence.',
      'Represents 60+% of primary intake cases.',
      'Often involves polysubstance use (THC, alcohol, sporadic opiate exposure).',
    ],
    qualifiers: [
      'Not in a clinic and not in acute withdrawal.',
      'CASPER is negative and UDS is negative for primary opiate dependency.',
      'Caution: Fentanyl-positive UDS must be evaluated for amphetamine cutting vs. opiate dependency.',
    ],
    pathway: [
      { step: 'No MAT', desc: 'No medication-assisted treatment is used for this category.' },
      { step: 'No Medical Detox', desc: "Clarification: You cannot 'medically detox' from stimulants." },
      { step: 'Comfort Meds', desc: 'Comfort medications only when clinically appropriate (e.g., amphetamine-related psychosis).' },
    ],
    directives: [
      'Pathway is strictly abstinence-based.',
      'If CASPER is negative and UDS is negative, the client belongs in this lane.',
      "Communicate 'No long-term maintenance' policy clearly at intake.",
    ],
  },
  {
    id: 'lane-2',
    shortTitle: 'Lane 2: Opiate',
    title: 'Opiate Detoxification',
    substances: 'Fentanyl / Heroin / Rx Opiates',
    icon: Pill,
    color: 'bg-blue-50',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-200',
    iconColor: 'text-blue-500',
    ringColor: 'ring-blue-500',
    profile: [
      'Represents ~30% of intake cases (Fentanyl primary is 3-5%).',
      'Goal: Short-term bridge to injection-based detox.',
      'Requires daily opiate dependency to qualify.',
    ],
    qualifiers: [
      'Legitimate acute withdrawal is present and verifiable.',
      'UDS must be positive for Fentanyl or Suboxone.',
      'Consistent pattern of daily opiate use verified via CASPER/history.',
    ],
    pathway: [
      { step: '1-7 Day Bridge', desc: 'Short-term Suboxone strips to stabilize prior to injection.' },
      { step: 'Initial Injection', desc: 'Transition to Sublocade: 300mg initial injection.' },
      { step: 'Maintenance', desc: 'Sublocade: 100mg maintenance injection.' },
      { step: 'Endpoint', desc: "30-day cycle reduces 'daily ritual' and euphoric recall." },
    ],
    directives: [
      'Pregnancy Exception: Methadone is ONLY continued for pregnant individuals already maintained on it (to be decreased over time).',
      'Do NOT mention injection options to clients who do not meet these strict criteria.',
      'Vivitrol/Naltrexone may be considered at 30 days for discharge planning/overdose risk.',
    ],
  },
  {
    id: 'triage-alc',
    shortTitle: 'Triage: Alcohol',
    title: 'Alcohol: Critical Warning',
    substances: 'Most Dangerous Withdrawal Risk',
    icon: Wine,
    color: 'bg-red-50',
    textColor: 'text-red-700',
    borderColor: 'border-red-200',
    iconColor: 'text-red-500',
    ringColor: 'ring-red-500',
    profile: [
      'Identified clinically as the most dangerous substance to withdraw from.',
      'Client intake often minimizes true daily alcohol consumption.',
    ],
    qualifiers: [
      'Risk: 6 to 12 drinks daily.',
      'Serious Risk: 12+ drinks daily.',
      "Indicators: Morning drinking or a strict 'pint-a-day' pattern.",
    ],
    pathway: [
      { step: 'Mandatory Screen', desc: 'Immediate screening for history of seizures when coming off alcohol.' },
      { step: 'Triage Decision', desc: 'If seizure history exists -> Client needs medical evaluation or referral out (e.g., St. Mary and Elizabeth).' },
      { step: 'Medication', desc: 'Short-term benzodiazepines used strictly for seizure prevention.' },
    ],
    directives: [
      'Clients are NOT candidates for MAT for alcohol withdrawal.',
      'Vivitrol has shown low efficacy (98% report little effect) but remains an option.',
      'If medical evaluation is not available or sufficient, refer out.',
    ],
  },
  {
    id: 'triage-benzo',
    shortTitle: 'Triage: Benzos',
    title: 'Benzodiazepine Triage',
    substances: 'Xanax / Valium / Klonopin',
    icon: Brain,
    color: 'bg-purple-50',
    textColor: 'text-purple-700',
    borderColor: 'border-purple-200',
    iconColor: 'text-purple-500',
    ringColor: 'ring-purple-500',
    profile: [
      'Similar danger profile to alcohol, including high seizure risk.',
      'Requires careful physiological tapering.',
    ],
    qualifiers: [
      'Daily or high-volume usage creating physiological dependence.',
      'Discontinuation poses significant clinical risk.',
    ],
    pathway: [
      { step: 'Clinical Report', desc: 'Clinical staff must report use patterns and concerns directly to Medical.' },
      { step: 'Medical Protocol', desc: 'Medical team (Dr. Kuhn) determines exact protocols.' },
      { step: 'Alternatives', desc: 'E.g., Gabapentin may be used for severe nerve damage cases.' },
    ],
    directives: [
      'Focus is entirely on safe withdrawal, not long-term maintenance.',
      'Escalate to hospital level of care if seizure risk exceeds in-house capability.',
    ],
  },
];

export default function Page() {
  const [activeLaneId, setActiveLaneId] = useState('lane-1');
  const active = useMemo(() => lanes.find((lane) => lane.id === activeLaneId) ?? lanes[0], [activeLaneId]);
  const ActiveIcon = active.icon;

  return (
    <div className="min-h-screen bg-slate-100 p-4 text-slate-800 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">Abstinence-Based Protocol Map</h1>
              <p className="mt-1 font-medium text-slate-500">Transitioning from long-term maintenance to recovery-centered practice</p>
            </div>
            <div className="flex gap-4">
              <div className="rounded-xl border border-orange-100 bg-orange-50 px-4 py-2 text-center">
                <div className="text-2xl font-black text-orange-600">60+%</div>
                <div className="text-xs font-bold uppercase tracking-wider text-orange-800">Stimulant Cases</div>
              </div>
              <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-2 text-center">
                <div className="text-2xl font-black text-blue-600">30%</div>
                <div className="text-xs font-bold uppercase tracking-wider text-blue-800">Opiate Cases</div>
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="space-y-3 lg:col-span-3">
            <h2 className="mb-4 ml-2 text-xs font-bold uppercase tracking-wider text-slate-400">Pathways &amp; Triage</h2>
            {lanes.map((lane) => {
              const Icon = lane.icon;
              const isActive = activeLaneId === lane.id;
              return (
                <button
                  key={lane.id}
                  onClick={() => setActiveLaneId(lane.id)}
                  className={`flex w-full items-center gap-4 rounded-xl border p-4 text-left transition-all duration-200 ${isActive ? `${lane.color} ${lane.borderColor} ${lane.ringColor} shadow-sm ring-1` : 'border-slate-200 bg-white opacity-70 hover:border-slate-300 hover:bg-slate-50 hover:opacity-100'}`}
                >
                  <div className={`rounded-lg p-2 ${isActive ? 'bg-white shadow-sm' : 'bg-slate-100'}`}>
                    <Icon className={`h-6 w-6 ${isActive ? lane.iconColor : 'text-slate-500'}`} />
                  </div>
                  <div>
                    <div className={`font-bold ${isActive ? lane.textColor : 'text-slate-700'}`}>{lane.shortTitle}</div>
                    <div className="mt-0.5 text-xs font-medium text-slate-500">{lane.title.split(':')[0]}</div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex flex-col gap-6 lg:col-span-9">
            <div className={`relative flex items-start gap-6 overflow-hidden rounded-2xl border p-6 md:p-8 ${active.borderColor} ${active.color}`}>
              <div className={`inline-flex rounded-2xl bg-white p-4 shadow-sm ${active.textColor}`}>
                <ActiveIcon className="h-10 w-10" />
              </div>
              <div className="z-10">
                <div className={`mb-1 text-sm font-bold uppercase tracking-widest ${active.textColor} opacity-80`}>
                  {active.shortTitle.includes('Lane') ? 'Intake Pathway' : 'High-Risk Triage'}
                </div>
                <h2 className={`mb-2 text-3xl font-black ${active.textColor}`}>{active.title}</h2>
                <p className={`text-lg font-medium ${active.textColor} opacity-80`}>{active.substances}</p>
              </div>
              <ActiveIcon className={`absolute -bottom-8 -right-8 h-48 w-48 ${active.textColor} opacity-5`} />
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-6">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800">
                    <Activity className="h-5 w-5 text-slate-400" />
                    Clinical Profile
                  </h3>
                  <ul className="space-y-3">
                    {active.profile.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm leading-relaxed text-slate-600">
                        <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-slate-300" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800">
                    <CheckCircle2 className="h-5 w-5 text-slate-400" />
                    Criteria &amp; Qualifiers
                  </h3>
                  <ul className="space-y-3">
                    {active.qualifiers.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm leading-relaxed text-slate-600">
                        <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-green-400" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="mb-6 flex items-center gap-2 text-lg font-bold text-slate-800">
                  <Stethoscope className="h-5 w-5 text-slate-400" />
                  Clinical Pathway
                </h3>
                <div className="relative space-y-0 before:absolute before:inset-0 before:ml-5 before:h-full before:w-0.5 before:-translate-x-px before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent md:before:mx-auto md:before:translate-x-0">
                  {active.pathway.map((item, idx) => (
                    <div key={idx} className="group relative flex items-center justify-between py-3 md:justify-normal md:odd:flex-row-reverse">
                      <div className="z-10 flex h-10 w-10 items-center justify-center rounded-full border-4 border-white bg-slate-100 text-sm font-bold text-slate-500 shadow-sm md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                        {idx + 1}
                      </div>
                      <div className="w-[calc(100%-4rem)] rounded-xl border border-slate-100 bg-slate-50 p-4 md:w-[calc(50%-2.5rem)]">
                        <h4 className={`mb-1 text-sm font-bold ${active.textColor}`}>{item.step}</h4>
                        <p className="text-xs leading-relaxed text-slate-600">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-slate-800 p-6 text-slate-300 shadow-sm">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-white">
                <ShieldAlert className="h-5 w-5 text-slate-400" />
                Key Directives &amp; Notes
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {active.directives.map((phrase, idx) => (
                  <div key={idx} className="flex items-start gap-3 rounded-xl border border-slate-600/50 bg-slate-700/50 p-4">
                    <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-400" />
                    <p className="text-sm leading-relaxed text-slate-200">{phrase}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center gap-3 border-b border-slate-200 bg-slate-50 p-6">
            <ClipboardList className="h-6 w-6 text-slate-700" />
            <h3 className="text-xl font-bold text-slate-800">Implementation Action Items</h3>
          </div>
          <div className="grid grid-cols-1 divide-y divide-slate-200 md:grid-cols-2 md:divide-x md:divide-y-0">
            <div className="space-y-4 p-6">
              <h4 className="flex items-center gap-2 font-bold text-indigo-700">
                <Users className="h-5 w-5" />
                @Clinical Team (Evaluators)
              </h4>
              <ul className="space-y-3 text-sm text-slate-600">
                <li className="flex items-start gap-3"><div className="mt-1 h-1.5 w-1.5 rounded-full bg-indigo-400" />Gather detailed history (frequency, source, clinic involvement).</li>
                <li className="flex items-start gap-3"><div className="mt-1 h-1.5 w-1.5 rounded-full bg-indigo-400" />Cross-verify UDS and CASPER before recommending Lane 2.</li>
                <li className="flex items-start gap-3"><div className="mt-1 h-1.5 w-1.5 rounded-full bg-indigo-400" />Communicate &quot;No long-term maintenance&quot; policy at intake.</li>
                <li className="flex items-start gap-3"><div className="mt-1 h-1.5 w-1.5 rounded-full bg-indigo-400" />Send Dr. Kuhn a concise clinical impression &amp; recommendation.</li>
              </ul>
            </div>
            <div className="space-y-4 p-6">
              <h4 className="flex items-center gap-2 font-bold text-teal-700">
                <Stethoscope className="h-5 w-5" />
                @Medical Team (Dr. Kuhn)
              </h4>
              <ul className="space-y-3 text-sm text-slate-600">
                <li className="flex items-start gap-3"><div className="mt-1 h-1.5 w-1.5 rounded-full bg-teal-400" />Manage seizure-risk protocols for alcohol and benzo cases (or refer out).</li>
                <li className="flex items-start gap-3"><div className="mt-1 h-1.5 w-1.5 rounded-full bg-teal-400" />Execute 1-7 day Suboxone bridge followed by Sublocade injection.</li>
                <li className="flex items-start gap-3"><div className="mt-1 h-1.5 w-1.5 rounded-full bg-teal-400" />Review intake referrals in-person with clinician consult.</li>
                <li className="flex items-start gap-3"><div className="mt-1 h-1.5 w-1.5 rounded-full bg-teal-400" />Continue methadone ONLY for pregnant individuals already maintained on it.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
