'use client';

import React, { useMemo, useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  Zap,
  Pill,
  Wine,
  Brain,
  Baby,
  AlertCircle,
  CheckCircle2,
  FileText,
  ShieldCheck,
  ChevronRight,
  Stethoscope,
} from 'lucide-react';

type PathwayStep = { step: string; desc: string };

type Lane = {
  id: number;
  title: string;
  substances: string;
  icon: LucideIcon;
  color: string;
  textColor: string;
  borderColor: string;
  ringColor: string;
  iconColor: string;
  profile: string[];
  qualifiers: string[];
  pathway: PathwayStep[];
  documentation: string[];
};

type Overlay = {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  color: string;
  textColor: string;
  borderColor: string;
  ringColor: string;
  iconColor: string;
  qualifiers: string[];
  pathway: PathwayStep[];
  documentation: string[];
};

const lanesData: Lane[] = [
  {
    id: 1,
    title: 'Stimulant Primary',
    substances: 'Methamphetamine / Cocaine / Crack',
    icon: Zap,
    color: 'bg-orange-50',
    textColor: 'text-orange-700',
    borderColor: 'border-orange-200',
    ringColor: 'ring-orange-500',
    iconColor: 'text-orange-500',
    profile: [
      'Primary substance: methamphetamine (or cocaine/crack).',
      'Secondary: intermittent opioid use possible.',
      'Not in acute opioid withdrawal on admission.',
    ],
    qualifiers: [
      'No objective/clinical picture of acute opioid withdrawal.',
      'Opioid use is intermittent/secondary OR historical.',
      "Presenting issue is stimulant use + sleep/anxiety + 'cravings' (urge to alter mood).",
    ],
    pathway: [
      { step: 'No Agonists', desc: 'No buprenorphine. No methadone.' },
      { step: 'Comfort Meds', desc: 'PRN for sleep/anxiety per assessment.' },
      {
        step: 'Psychosocial Focus',
        desc: "Treat 'cravings' as preoccupation/obsession → psychosocial + residential intensity.",
      },
      {
        step: 'Discharge Planning',
        desc: 'Overdose-risk screen. If elevated opioid history → consider Vivitrol (naltrexone). If low risk → not indicated.',
      },
    ],
    documentation: [
      'Client presents with stimulant-primary use disorder and is not in acute opioid withdrawal at intake.',
      "Reported 'cravings' are clinically assessed as addiction preoccupation/obsession rather than opioid withdrawal.",
      'Opioid agonist initiation (buprenorphine/methadone) is not clinically indicated for this presentation.',
      'Treatment plan emphasizes psychosocial interventions at an intensive residential level to address psychological drivers.',
      'Symptom-based comfort medications may be used as indicated for sleep/anxiety.',
      'Overdose risk evaluated; naltrexone (Vivitrol) considered when risk profile supports relapse/overdose prevention.',
    ],
  },
  {
    id: 2,
    title: 'Primary Opioid',
    substances: 'Fentanyl / Heroin',
    icon: Pill,
    color: 'bg-red-50',
    textColor: 'text-red-700',
    borderColor: 'border-red-200',
    ringColor: 'ring-red-500',
    iconColor: 'text-red-500',
    profile: [
      'Primary substance: fentanyl/opioids.',
      'Higher medical complexity + relapse/overdose risk.',
      'Goal: defined detoxification pathway (not indefinite maintenance).',
    ],
    qualifiers: [
      'Opioid use is primary driver of admission.',
      'Clinical need for opioid withdrawal management is present or anticipated.',
      'Client is appropriate for a program whose stance is time-limited MAT as detox support.',
    ],
    pathway: [
      {
        step: 'Days 1-7',
        desc: 'Oral buprenorphine induction (approx. 5–7 days) to stabilize and reduce fentanyl burden.',
      },
      { step: 'Month 1', desc: 'Transition to Sublocade taper: 300 mg injection.' },
      { step: 'Month 2', desc: 'Sublocade taper: 100 mg injection.' },
      {
        step: 'Month 3',
        desc: 'Endpoint: No further injection. Weekly medical leadership oversight throughout to ensure adherence.',
      },
    ],
    documentation: [
      'Client presents with primary opioid use disorder (fentanyl).',
      'Program provides a structured medication-assisted detoxification pathway with a defined endpoint.',
      'Plan: short oral buprenorphine stabilization to transition to long-acting injectable buprenorphine (Sublocade) as a taper.',
      'Client education provided: protocol is intended to support progress toward abstinence and reduce overdose risk while eliminating daily dosing rituals.',
      'Client participated in informed consent; alternatives, risks/benefits, and program parameters reviewed.',
      'Client may decline elements of the recommended protocol; however, the program does not provide indefinite high-dose maintenance as a service model.',
      'Case management + therapy + medical monitoring are integrated and individualized throughout the detoxification course.',
    ],
  },
  {
    id: 3,
    title: 'Alcohol Primary',
    substances: 'Alcohol',
    icon: Wine,
    color: 'bg-blue-50',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-200',
    ringColor: 'ring-blue-500',
    iconColor: 'text-blue-500',
    profile: [
      'Primary substance: alcohol.',
      'Highest risk for dangerous withdrawal (seizures/DTs).',
      'Some may require medical detox/hospitalization.',
    ],
    qualifiers: [
      'Alcohol is primary current substance.',
      'Withdrawal severity risk present (history of seizures/DTs, very high daily intake, elevated BAL, etc.).',
    ],
    pathway: [
      { step: 'Triage', desc: 'Severity-based triage. If high severity/unsafe → hospital referral.' },
      {
        step: 'In-House Detox',
        desc: 'If appropriate → symptom-triggered/med-guided withdrawal management (comfort meds).',
      },
      { step: 'Strong Stance', desc: 'No long-term benzodiazepine use.' },
      {
        step: 'Post-Detox',
        desc: 'Consider naltrexone/Vivitrol when clinically indicated. Antabuse: reserve for later-stage/persistent relapse profiles.',
      },
    ],
    documentation: [
      'Client presents with primary alcohol use disorder; withdrawal risk assessed (history, daily use pattern, BAL when available).',
      'Detox level-of-care determined by severity; hospitalization considered when risk exceeds in-house capability.',
      'Treatment avoids long-term benzodiazepine maintenance; medications used for short-term withdrawal management only.',
      'Post-detox relapse prevention options reviewed; naltrexone considered when indicated.',
    ],
  },
  {
    id: 4,
    title: 'Benzodiazepine Primary',
    substances: 'Xanax / Valium / Klonopin',
    icon: Brain,
    color: 'bg-purple-50',
    textColor: 'text-purple-700',
    borderColor: 'border-purple-200',
    ringColor: 'ring-purple-500',
    iconColor: 'text-purple-500',
    profile: ['Primary substance: benzodiazepines.', 'Seizure risk + often longer withdrawal course.'],
    qualifiers: ['Benzo use is primary and discontinuation risk is clinically significant.'],
    pathway: [
      { step: 'Triage', desc: 'Severity-based triage. High severity/unsafe withdrawal → hospital referral.' },
      { step: 'Withdrawal Plan', desc: 'Medically managed taper/withdrawal plan per prescriber guidance.' },
      {
        step: 'Model Stance',
        desc: 'No long-term benzo maintenance as a standing model; focus is safe withdrawal and stabilization.',
      },
    ],
    documentation: [
      'Client presents with primary benzodiazepine use disorder; withdrawal/seizure risk assessed.',
      'Detox plan is severity-driven with escalation to hospital when clinically indicated.',
      'Medication strategy is time-limited and oriented to safe withdrawal, not ongoing maintenance.',
    ],
  },
];

const overlayData: Overlay = {
  title: 'Pregnancy / Postpartum Overlay',
  subtitle: 'Modifies pathway; requires tighter medical governance.',
  icon: Baby,
  color: 'bg-teal-50',
  textColor: 'text-teal-800',
  borderColor: 'border-teal-300',
  ringColor: 'ring-teal-600',
  iconColor: 'text-teal-600',
  qualifiers: ['Pregnant, postpartum, or baby in NICU.', 'Any opioid exposure history (on MAT or active fentanyl use).'],
  pathway: [
    {
      step: 'Currently on MAT',
      desc: 'If pregnant and already on methadone or Suboxone: maintain stability during pregnancy; avoid destabilizing changes.',
    },
    {
      step: 'Active Fentanyl',
      desc: 'If pregnant + active fentanyl + not on MAT: requires medical director consult before finalizing pathway.',
    },
    { step: 'Post-Delivery', desc: "Transition toward the program's detoxification pathway as clinically appropriate." },
  ],
  documentation: [
    'Pregnancy/postpartum status materially impacts risk; medication decisions require enhanced medical oversight.',
    'During pregnancy, priority is fetal/maternal stability; medication changes avoided unless medically indicated.',
    'Postpartum planning includes a structured transition toward detoxification/abstinence-oriented stabilization as appropriate.',
    'Case reviewed with medical leadership; rationale documented for dosing decisions and timing.',
  ],
};

export default function Page() {
  const [activeLaneId, setActiveLaneId] = useState<number>(1);
  const [showOverlay, setShowOverlay] = useState<boolean>(false);

  const activeLane = useMemo(() => lanesData.find((l) => l.id === activeLaneId) ?? lanesData[0], [activeLaneId]);

  const active = showOverlay ? overlayData : activeLane;
  const ActiveIcon = active.icon;

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8 font-sans text-slate-800">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <header className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Detoxification Protocol Map</h1>
            <p className="text-slate-500 font-medium mt-1">Clinical Guidelines &amp; Pathways (Draft v1.0)</p>
          </div>
          <button
            onClick={() => setShowOverlay((v) => !v)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all ${
              showOverlay
                ? 'bg-teal-600 text-white shadow-md shadow-teal-200'
                : 'bg-teal-50 text-teal-700 hover:bg-teal-100 border border-teal-200'
            }`}
          >
            <Baby className="w-5 h-5" />
            {showOverlay ? 'Close Pregnancy Overlay' : 'Apply Pregnancy Overlay'}
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sidebar / Lane Selector */}
          <div className="lg:col-span-3 space-y-3">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 ml-2">Select Primary Lane</h2>
            {lanesData.map((lane) => {
              const Icon = lane.icon;
              const isActive = activeLaneId === lane.id && !showOverlay;

              return (
                <button
                  key={lane.id}
                  onClick={() => {
                    setActiveLaneId(lane.id);
                    setShowOverlay(false);
                  }}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-center gap-4 ${
                    isActive
                      ? `${lane.color} ${lane.borderColor} shadow-sm ring-1 ${lane.ringColor}`
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50 opacity-70 hover:opacity-100'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${isActive ? 'bg-white shadow-sm' : 'bg-slate-100'}`}>
                    <Icon className={`w-6 h-6 ${isActive ? lane.iconColor : 'text-slate-500'}`} />
                  </div>
                  <div>
                    <div className={`font-bold ${isActive ? lane.textColor : 'text-slate-700'}`}>Lane {lane.id}</div>
                    <div className="text-xs text-slate-500 truncate font-medium mt-0.5">{lane.title}</div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-9 flex flex-col gap-6">
            {/* Active Lane Header */}
            <div
              className={`rounded-2xl border ${active.borderColor} ${active.color} p-6 md:p-8 flex items-start gap-6 relative overflow-hidden`}
            >
              <div className={`p-4 rounded-2xl bg-white shadow-sm inline-flex ${active.textColor}`}>
                <ActiveIcon className="w-10 h-10" />
              </div>
              <div className="z-10">
                <div className={`text-sm font-bold tracking-widest uppercase mb-1 ${active.textColor} opacity-80`}>
                  {showOverlay ? 'Global Modifier' : `Lane ${(active as Lane).id}`}
                </div>
                <h2 className={`text-3xl font-black ${active.textColor} mb-2`}>{active.title}</h2>
                <p className={`font-medium ${active.textColor} opacity-80 text-lg`}>
                  {showOverlay ? (active as Overlay).subtitle : (active as Lane).substances}
                </p>
              </div>
              {/* Decorative background icon */}
              <ActiveIcon className={`absolute -right-8 -bottom-8 w-48 h-48 ${active.textColor} opacity-5`} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column: Profile & Qualifiers */}
              <div className="space-y-6">
                {!showOverlay && (
                  <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                    <h3 className="flex items-center gap-2 text-lg font-bold text-slate-800 mb-4">
                      <Stethoscope className="w-5 h-5 text-slate-400" />
                      Typical Profile
                    </h3>
                    <ul className="space-y-3">
                      {(active as Lane).profile?.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-slate-600 text-sm leading-relaxed">
                          <div className="mt-1 w-1.5 h-1.5 rounded-full bg-slate-300 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                  <h3 className="flex items-center gap-2 text-lg font-bold text-slate-800 mb-4">
                    <CheckCircle2 className="w-5 h-5 text-slate-400" />
                    Qualifies When
                  </h3>
                  <ul className="space-y-3">
                    {active.qualifiers.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-slate-600 text-sm leading-relaxed">
                        <div className="mt-1 w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Right Column: Pathway */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                <h3 className="flex items-center gap-2 text-lg font-bold text-slate-800 mb-6">
                  <AlertCircle className="w-5 h-5 text-slate-400" />
                  Clinical Pathway
                </h3>
                <div className="space-y-0 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                  {active.pathway.map((item, idx) => (
                    <div
                      key={idx}
                      className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active py-3"
                    >
                      <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-slate-100 text-slate-500 font-bold text-sm shadow-sm z-10 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                        {idx + 1}
                      </div>

                      <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <h4 className={`font-bold text-sm mb-1 ${active.textColor}`}>{item.step}</h4>
                        <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Row: Documentation Phrases */}
            <div className="bg-slate-800 rounded-2xl p-6 shadow-sm text-slate-300">
              <h3 className="flex items-center gap-2 text-lg font-bold text-white mb-4">
                <FileText className="w-5 h-5 text-slate-400" />
                Required Documentation Phrases
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {active.documentation.map((phrase, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-700/50 p-4 rounded-xl border border-slate-600/50 flex items-start gap-3"
                  >
                    <ChevronRight className="w-4 h-4 mt-0.5 text-slate-400 flex-shrink-0" />
                    <p className="text-sm leading-relaxed italic text-slate-200">&quot;{phrase}&quot;</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Global Footer Standards */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mt-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-slate-100 rounded-lg">
              <ShieldCheck className="w-6 h-6 text-slate-700" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">Program-Wide Standard Language</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border-l-2 border-slate-300 pl-4 py-1">
              <p className="text-sm text-slate-600 italic">
                &quot;Medication decisions are client-match, assessment-driven, and aligned with a defined path toward stabilization and progress.&quot;
              </p>
            </div>
            <div className="border-l-2 border-slate-300 pl-4 py-1">
              <p className="text-sm text-slate-600 italic">
                &quot;When MAT is used, it is implemented as part of a structured protocol with clear goals, monitoring, and documentation.&quot;
              </p>
            </div>
            <div className="border-l-2 border-slate-300 pl-4 py-1">
              <p className="text-sm text-slate-600 italic">
                &quot;Clinical rationale, consent, and individualized response are documented to maintain a clear medical and compliance-ready paper trail.&quot;
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
