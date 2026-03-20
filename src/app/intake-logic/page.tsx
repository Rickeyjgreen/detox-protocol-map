'use client';

import React, { useState } from 'react';
import {
  Zap,
  Pill,
  Wine,
  Brain,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  Activity,
  Stethoscope,
  Baby,
  RotateCcw,
  Info,
  ArrowLeft,
  ChevronRight,
} from 'lucide-react';

const decisionTree = {
  start: {
    type: 'decision',
    question: 'Is the client pregnant AND currently maintained on Methadone or Suboxone?',
    icon: Baby,
    color: 'text-teal-600',
    bgColor: 'bg-teal-50',
    borderColor: 'border-teal-200',
    options: [
      { label: 'Yes, Pregnant & on MAT', nextId: 'preg_exception', btnColor: 'bg-teal-600 hover:bg-teal-700' },
      { label: 'No', nextId: 'triage_substance', btnColor: 'bg-slate-600 hover:bg-slate-700' },
    ],
  },
  triage_substance: {
    type: 'decision',
    question: 'What is the primary reported substance or presenting clinical issue?',
    icon: Activity,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-200',
    options: [
      { label: 'Alcohol', nextId: 'alc_seizure', btnColor: 'bg-red-500 hover:bg-red-600' },
      { label: 'Benzodiazepines', nextId: 'benzo_taper', btnColor: 'bg-purple-500 hover:bg-purple-600' },
      { label: 'Opiates (Fentanyl/Heroin/Rx)', nextId: 'opiate_eval', btnColor: 'bg-blue-500 hover:bg-blue-600' },
      { label: 'Stimulants / Polysubstance', nextId: 'lane_1_check', btnColor: 'bg-orange-500 hover:bg-orange-600' },
    ],
  },
  alc_seizure: {
    type: 'decision',
    question: 'Does the client have a history of seizures during alcohol withdrawal OR consume 12+ drinks daily?',
    icon: Wine,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    options: [
      { label: 'Yes (High Risk / Seizure Hx)', nextId: 'alc_referral', btnColor: 'bg-red-600 hover:bg-red-700' },
      { label: 'No (Moderate Risk)', nextId: 'alc_inhouse', btnColor: 'bg-amber-600 hover:bg-amber-700' },
    ],
  },
  opiate_eval: {
    type: 'decision',
    question:
      'Does the client meet ALL THREE of the following opiate criteria?\n\n1. Legitimate acute withdrawal is present.\n2. UDS is positive for Fentanyl or Suboxone.\n3. Consistent daily opiate use is verified (CASPER/History).',
    icon: Stethoscope,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    options: [
      { label: 'Yes, All Criteria Met', nextId: 'lane_2', btnColor: 'bg-blue-600 hover:bg-blue-700' },
      { label: 'No, One or More False', nextId: 'lane_1', btnColor: 'bg-orange-600 hover:bg-orange-700' },
    ],
  },
  lane_1_check: {
    type: 'decision',
    question: 'Did the client report Stimulants as primary, but their UDS came back positive for Fentanyl?',
    icon: AlertTriangle,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    options: [
      { label: 'Yes (UDS + for Fentanyl)', nextId: 'lane_1_fent', btnColor: 'bg-orange-600 hover:bg-orange-700' },
      { label: 'No', nextId: 'lane_1', btnColor: 'bg-slate-600 hover:bg-slate-700' },
    ],
  },

  // ENDPOINTS
  preg_exception: {
    type: 'endpoint',
    title: 'Pregnancy Exception Protocol',
    lane: 'Special Override',
    icon: Baby,
    colorTheme: 'teal',
    description: 'During pregnancy, the priority is fetal/maternal stability.',
    actions: [
      'Maintain stability on Methadone or Suboxone during pregnancy.',
      'Avoid destabilizing changes unless medically indicated.',
      "Post-delivery: transition toward the program's detoxification pathway as clinically appropriate.",
      'This is the ONLY scenario where methadone is maintained.',
    ],
  },
  alc_referral: {
    type: 'endpoint',
    title: 'Medical Evaluation / Hospital Referral',
    lane: 'Alcohol Triage: Critical Risk',
    icon: ShieldAlert,
    colorTheme: 'red',
    description: 'Client risk exceeds in-house capabilities due to seizure history or extreme usage.',
    actions: [
      'Mandatory medical evaluation required immediately.',
      'Refer out to a higher level of care (e.g., St. Mary and Elizabeth).',
      'Do NOT attempt in-house detox without explicit Medical Director override.',
    ],
  },
  alc_inhouse: {
    type: 'endpoint',
    title: 'In-House Med-Guided Withdrawal',
    lane: 'Alcohol Triage: Moderate',
    icon: Wine,
    colorTheme: 'amber',
    description: 'Client requires structured withdrawal management for alcohol dependency.',
    actions: [
      'Short-term benzodiazepines may be used strictly for seizure prevention.',
      'Clients are NOT candidates for MAT for alcohol withdrawal.',
      'No long-term benzo maintenance.',
      'Vivitrol/Naltrexone is an option post-detox, though efficacy historically noted as low.',
    ],
  },
  benzo_taper: {
    type: 'endpoint',
    title: 'Medically Managed Taper',
    lane: 'Benzodiazepine Triage',
    icon: Brain,
    colorTheme: 'purple',
    description: 'Benzodiazepine withdrawal carries severe seizure risk requiring physiological tapering.',
    actions: [
      'Clinical staff must report use patterns and concerns directly to Medical.',
      'Dr. Kuhn / Medical Team determines exact taper protocols.',
      'Focus is entirely on safe withdrawal, NOT long-term maintenance.',
      'Alternatives like Gabapentin may be utilized for severe nerve damage cases.',
    ],
  },
  lane_2: {
    type: 'endpoint',
    title: 'Opiate Detoxification Protocol',
    lane: 'Lane 2: Short-Term Bridge to Injection',
    icon: Pill,
    colorTheme: 'blue',
    description: 'Verified daily opiate dependency requiring a structured exit pathway.',
    actions: [
      'Execute 1-7 day short-term Suboxone strips to stabilize prior to injection.',
      'Transition to Sublocade: 300mg initial injection.',
      'Follow up with 100mg Sublocade maintenance injection.',
      "Endpoint reached: 30-day cycle reduces 'daily ritual' and euphoric recall.",
    ],
  },
  lane_1_fent: {
    type: 'endpoint',
    title: 'Stimulant Protocol (Evaluate for Cutting)',
    lane: 'Lane 1: Abstinence (Flagged)',
    icon: AlertTriangle,
    colorTheme: 'orange',
    description: 'Client likely exposed to Fentanyl through cut stimulants. Do not default to Opiate Lane.',
    actions: [
      'Pathway remains STRICTLY ABSTINENCE-BASED.',
      'Evaluate clinical picture to confirm lack of acute opiate dependency.',
      "No MAT used for this category. Communicate 'No long-term maintenance' policy.",
      'Comfort meds only when clinically appropriate (e.g., amphetamine-related psychosis).',
    ],
  },
  lane_1: {
    type: 'endpoint',
    title: 'Stimulant / Polysubstance Protocol',
    lane: 'Lane 1: Abstinence',
    icon: Zap,
    colorTheme: 'orange',
    description: 'Primary abstinence pathway. No acute opiate withdrawal present.',
    actions: [
      'STRICTLY ABSTINENCE-BASED. No MAT used.',
      "Clarification: You cannot 'medically detox' from stimulants.",
      "Communicate 'No long-term maintenance' policy clearly at intake.",
      'Provide symptom-based comfort medications only if necessary.',
    ],
  },
};

const themeClasses = {
  teal: { bg: 'bg-teal-50', border: 'border-teal-200', text: 'text-teal-800', icon: 'text-teal-600', iconBg: 'bg-teal-100' },
  red: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-800', icon: 'text-red-600', iconBg: 'bg-red-100' },
  amber: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-800', icon: 'text-amber-600', iconBg: 'bg-amber-100' },
  purple: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-800', icon: 'text-purple-600', iconBg: 'bg-purple-100' },
  blue: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-800', icon: 'text-blue-600', iconBg: 'bg-blue-100' },
  orange: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-800', icon: 'text-orange-600', iconBg: 'bg-orange-100' },
};

export default function App() {
  const [currentNodeId, setCurrentNodeId] = useState('start');
  const [history, setHistory] = useState<string[]>([]);

  const handleSelection = (nextId: string) => {
    setHistory([...history, currentNodeId]);
    setCurrentNodeId(nextId);
  };

  const goBack = () => {
    if (history.length === 0) return;
    const newHistory = [...history];
    const prevId = newHistory.pop();
    setHistory(newHistory);
    if (prevId) setCurrentNodeId(prevId);
  };

  const resetTree = () => {
    setCurrentNodeId('start');
    setHistory([]);
  };

  const node = (decisionTree as any)[currentNodeId];
  const isEndpoint = node.type === 'endpoint';
  const NodeIcon = node.icon;

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8 font-sans text-slate-800 flex items-center justify-center">
      <div className="max-w-2xl w-full">
        {/* Navigation & Header */}
        <div className="flex justify-between items-center mb-6 px-2">
          {history.length > 0 ? (
            <button
              onClick={goBack}
              className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-semibold transition-colors text-sm bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </button>
          ) : (
            <div className="w-24"></div> // Spacer to keep title centered if no back button
          )}

          <div className="text-center flex-grow">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Intake Logic</h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5 uppercase tracking-wider">Triage &amp; Pathways</p>
          </div>

          <button
            onClick={resetTree}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-semibold transition-colors text-sm bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        </div>

        {/* Dynamic Content Area */}
        <div className="transition-all duration-300 ease-in-out">
          {/* DECISION NODE */}
          {!isEndpoint && (
            <div className="bg-white border-2 border-slate-200 rounded-3xl p-8 md:p-10 shadow-lg text-center animate-in fade-in zoom-in-95 duration-300">
              <div className={`mx-auto w-16 h-16 rounded-2xl ${node.bgColor} flex items-center justify-center mb-6`}>
                <NodeIcon className={`w-8 h-8 ${node.color}`} />
              </div>

              <h2 className="text-2xl font-bold text-slate-800 whitespace-pre-line leading-relaxed mb-10 max-w-lg mx-auto">
                {node.question}
              </h2>

              <div className="flex flex-col gap-4 max-w-md mx-auto">
                {node.options.map((opt: any, optIdx: number) => (
                  <button
                    key={optIdx}
                    onClick={() => handleSelection(opt.nextId)}
                    className={`w-full py-4 px-6 rounded-xl text-white font-bold text-lg shadow-sm transition-transform active:scale-95 flex justify-between items-center ${opt.btnColor}`}
                  >
                    <span>{opt.label}</span>
                    <ChevronRight className="w-5 h-5 opacity-70" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ENDPOINT NODE */}
          {isEndpoint && (() => {
            const theme = (themeClasses as any)[node.colorTheme];
            return (
              <div
                className={`border-2 ${theme.border} ${theme.bg} rounded-3xl p-8 md:p-10 shadow-xl relative overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-500`}
              >
                <NodeIcon className={`absolute -right-10 -top-10 w-64 h-64 ${theme.icon} opacity-5 rotate-12`} />

                <div className="relative z-10">
                  <div className="flex flex-col items-center text-center mb-8">
                    <div className={`p-4 rounded-3xl ${theme.iconBg} mb-4`}>
                      <NodeIcon className={`w-12 h-12 ${theme.icon}`} />
                    </div>
                    <div className={`text-sm font-black uppercase tracking-widest ${theme.icon} mb-2`}>{node.lane}</div>
                    <h2 className={`text-4xl font-black ${theme.text} mb-4`}>{node.title}</h2>
                    <div className="bg-white/70 rounded-xl p-4 border border-white/50 backdrop-blur-sm max-w-md w-full">
                      <p className="font-medium text-slate-700">{node.description}</p>
                    </div>
                  </div>

                  <div className="bg-white/80 rounded-2xl p-6 shadow-sm border border-white">
                    <h3
                      className={`text-sm font-bold uppercase tracking-wider ${theme.text} opacity-80 flex items-center gap-2 mb-4`}
                    >
                      <CheckCircle2 className="w-5 h-5" />
                      Protocol Directives
                    </h3>
                    <ul className="space-y-4">
                      {node.actions.map((action: string, actIdx: number) => (
                        <li key={actIdx} className="flex items-start gap-3">
                          <div className={`mt-1.5 w-2.5 h-2.5 rounded-full ${theme.iconBg.replace('100', '400')} flex-shrink-0`} />
                          <span className="text-base font-medium text-slate-700 leading-relaxed">{action}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
