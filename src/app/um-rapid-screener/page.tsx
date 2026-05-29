'use client';

import React, { useMemo, useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  CheckCircle,
  ClipboardCopy,
  Home,
  RefreshCw,
  ShieldAlert,
} from 'lucide-react';

type Answers = {
  acuteRisk?: boolean;
  recentUse?: boolean;
  needsContainment?: boolean;
  severeCravings?: boolean;
  failedLowerLOC?: boolean;
  lacksSafeEnv?: boolean;
};

type Question = {
  id: keyof Answers;
  title: string;
  text: string;
  hint: string;
  icon: LucideIcon;
  iconClass: string;
};

type Result = {
  loc: string;
  color: string;
  badge: string;
  text: string;
  nextStep: string;
};

const questions: Question[] = [
  {
    id: 'acuteRisk',
    title: 'Acute Medical / Psych',
    text: 'Has the person had severe withdrawal history, such as seizures or DTs, or are there current acute psychiatric safety or perception concerns requiring immediate evaluation?',
    hint: 'Checks for immediate hospital, withdrawal management, or ASAM 3.7 need.',
    icon: AlertTriangle,
    iconClass: 'text-red-500',
  },
  {
    id: 'recentUse',
    title: 'Substance Acuity',
    text: 'Has the person used high-risk substances, such as fentanyl, IV drugs, meth, alcohol, or benzodiazepines, in the last 72 hours?',
    hint: 'Supports acute intoxication or withdrawal-risk documentation.',
    icon: Activity,
    iconClass: 'text-orange-500',
  },
  {
    id: 'needsContainment',
    title: 'Containment Need',
    text: 'Is the person unable to stop using for a couple of days unless placed in a 24-hour treatment facility?',
    hint: 'Key trigger phrase for ASAM 3.5 level-of-care review.',
    icon: ShieldAlert,
    iconClass: 'text-indigo-500',
  },
  {
    id: 'severeCravings',
    title: 'Relapse Risk',
    text: 'Are cravings uncontrollable right now, or is there a pattern of relapsing immediately after stopping?',
    hint: 'Helps separate ASAM 3.5 need from IOP or 3.1 support.',
    icon: RefreshCw,
    iconClass: 'text-blue-500',
  },
  {
    id: 'failedLowerLOC',
    title: 'Treatment History',
    text: 'Has the person recently tried lower levels of care, such as outpatient or IOP, but still struggled to stay sober?',
    hint: 'Documents why a lower level cannot safely meet the current need.',
    icon: CheckCircle,
    iconClass: 'text-teal-500',
  },
  {
    id: 'lacksSafeEnv',
    title: 'Recovery Environment',
    text: 'Is the person currently without a safe, completely sober place to sleep tonight?',
    hint: 'Unsafe environment supports residential placement when paired with clinical severity.',
    icon: Home,
    iconClass: 'text-purple-500',
  },
];

function calculateResult(answers: Answers): Result {
  const { acuteRisk, recentUse, needsContainment, severeCravings, failedLowerLOC, lacksSafeEnv } = answers;

  if (acuteRisk) {
    return {
      loc: 'WM / 3.7 / Inpatient',
      color: 'red',
      badge: 'Emergency Escalation',
      text: 'Patient requires immediate evaluation for higher level of care due to acute medical withdrawal risk or psychiatric instability.',
      nextStep: 'Do not use this as a final placement. Escalate for immediate clinical and/or emergency evaluation.',
    };
  }

  if (needsContainment || (recentUse && lacksSafeEnv) || (!recentUse && severeCravings && failedLowerLOC && lacksSafeEnv)) {
    return {
      loc: '3.5 LOC',
      color: 'orange',
      badge: 'High-Intensity Residential',
      text: 'Recent high-risk use with inability to stop, high relapse potential, unsafe recovery environment, failed lower levels of care, and need for 24-hour clinically managed stabilization.',
      nextStep: 'Document ASAM dimensions, medical necessity, withdrawal risk, relapse potential, and why lower levels of care are insufficient.',
    };
  }

  if (lacksSafeEnv) {
    return {
      loc: '3.1 LOC',
      color: 'blue',
      badge: 'Low-Intensity Residential',
      text: 'Not acutely unstable enough for 3.5, but lacks a safe sober environment and needs 24-hour supervised recovery structure with low-intensity clinical services and reintegration support.',
      nextStep: 'Document recovery-environment instability and the need for 24-hour recovery structure.',
    };
  }

  if (recentUse || severeCravings || failedLowerLOC) {
    return {
      loc: 'IOP',
      color: 'emerald',
      badge: 'Intensive Outpatient',
      text: 'Moderate SUD severity requiring structured treatment multiple days per week, but the person can remain safely in the community without 24-hour supervision.',
      nextStep: 'Confirm safe housing, transportation, relapse-prevention supports, and ability to attend scheduled services.',
    };
  }

  return {
    loc: 'Routine Outpatient',
    color: 'slate',
    badge: 'Lower-Intensity Care',
    text: 'Symptoms are mild, no recent high-risk use, no immediate relapse risk, and recovery environment is currently stable. Recommend standard outpatient therapy.',
    nextStep: 'Confirm ongoing supports and reassess if risk, use pattern, housing, or psychiatric stability changes.',
  };
}

const resultStyles: Record<string, { badge: string; text: string }> = {
  red: { badge: 'bg-red-600', text: 'text-red-600' },
  orange: { badge: 'bg-orange-600', text: 'text-orange-600' },
  blue: { badge: 'bg-blue-600', text: 'text-blue-600' },
  emerald: { badge: 'bg-emerald-600', text: 'text-emerald-600' },
  slate: { badge: 'bg-slate-600', text: 'text-slate-600' },
};

export default function UMRapidScreenerPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [copied, setCopied] = useState(false);

  const isComplete = step >= questions.length;
  const result = useMemo(() => calculateResult(answers), [answers]);
  const style = resultStyles[result.color] ?? resultStyles.slate;
  const currentQuestion = questions[step];
  const progress = Math.round(((Math.min(step, questions.length - 1) + 1) / questions.length) * 100);

  function handleAnswer(value: boolean) {
    const nextAnswers = { ...answers, [questions[step].id]: value };
    setAnswers(nextAnswers);

    if (step === 0 && value) {
      setStep(questions.length);
      return;
    }

    setStep(step + 1);
  }

  function handleBack() {
    setCopied(false);
    setStep((current) => Math.max(0, current - 1));
  }

  function resetScreener() {
    setStep(0);
    setAnswers({});
    setCopied(false);
  }

  async function copyJustification() {
    const text = `${result.loc}: ${result.text}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  if (!currentQuestion && !isComplete) return null;
  const QuestionIcon = currentQuestion?.icon;

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-6 text-slate-900 md:px-8">
      <section className="mx-auto flex min-h-[680px] w-full max-w-md flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-300/60">
        <header className="flex items-center justify-between bg-slate-950 px-6 py-5 text-white">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">KY Medicaid LOC Triage</p>
            <h1 className="mt-1 text-xl font-black tracking-tight">UM Rapid Screener</h1>
          </div>
          <Activity className="h-7 w-7 text-blue-400" aria-hidden="true" />
        </header>

        <div className="flex flex-1 flex-col p-6">
          {!isComplete ? (
            <div className="flex flex-1 flex-col">
              <div className="mb-8">
                <div className="mb-2 flex justify-between text-xs font-bold text-slate-500">
                  <span>Question {step + 1} of {questions.length}</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-slate-200">
                  <div className="h-full rounded-full bg-blue-600 transition-all" style={{ width: `${progress}%` }} />
                </div>
              </div>

              <div className="flex flex-1 flex-col justify-center pb-8">
                <div className="mb-5 flex items-center gap-3">
                  {QuestionIcon && <QuestionIcon className={`h-7 w-7 ${currentQuestion.iconClass}`} aria-hidden="true" />}
                  <h2 className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">{currentQuestion.title}</h2>
                </div>
                <p className="mb-5 text-3xl font-black leading-tight tracking-tight text-slate-800">{currentQuestion.text}</p>
                <aside className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm leading-relaxed text-slate-600">
                  <strong className="text-slate-800">MCO Tip:</strong> {currentQuestion.hint}
                </aside>
              </div>

              <div className="mt-auto space-y-3">
                <button
                  onClick={() => handleAnswer(true)}
                  className="w-full rounded-2xl bg-indigo-600 py-4 text-lg font-black uppercase text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700 active:scale-[0.99]"
                >
                  Yes
                </button>
                <button
                  onClick={() => handleAnswer(false)}
                  className="w-full rounded-2xl border-2 border-slate-200 bg-slate-100 py-4 text-lg font-black uppercase text-slate-700 transition hover:bg-slate-200 active:scale-[0.99]"
                >
                  No
                </button>
                {step > 0 && (
                  <button onClick={handleBack} className="flex w-full items-center justify-center gap-2 py-3 font-bold text-slate-400 hover:text-slate-600">
                    <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-1 flex-col">
              <div className="mb-7 mt-4 text-center">
                <p className="mb-2 text-xs font-black uppercase tracking-[0.18em] text-slate-500">Recommended Assignment</p>
                <span className={`mb-4 inline-flex rounded-full px-4 py-1 text-xs font-black uppercase tracking-wide text-white ${style.badge}`}>
                  {result.badge}
                </span>
                <h2 className={`text-5xl font-black leading-none tracking-tighter ${style.text}`}>{result.loc}</h2>
              </div>

              <section className="mb-4 rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
                <h3 className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-slate-400">
                  <ShieldAlert className="h-4 w-4" aria-hidden="true" /> MCO Justification Text
                </h3>
                <p className="text-lg font-bold leading-relaxed text-slate-800">“{result.text}”</p>
              </section>

              <section className="mb-4 rounded-2xl border border-slate-200 bg-white p-5">
                <h3 className="mb-2 text-xs font-black uppercase tracking-[0.14em] text-slate-400">Clinical next step</h3>
                <p className="text-sm leading-relaxed text-slate-600">{result.nextStep}</p>
              </section>

              <p className="mb-5 text-xs leading-relaxed text-slate-500">
                Decision support only. Final level-of-care assignment requires qualified clinical assessment, ASAM documentation, payer criteria review, and applicable emergency protocols.
              </p>

              <div className="mt-auto space-y-3">
                <button
                  onClick={copyJustification}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 py-4 text-lg font-black text-white shadow-lg transition hover:bg-slate-800 active:scale-[0.99]"
                >
                  {copied ? <CheckCircle className="h-5 w-5 text-emerald-400" aria-hidden="true" /> : <ClipboardCopy className="h-5 w-5" aria-hidden="true" />}
                  {copied ? 'Copied' : 'Copy Justification'}
                </button>
                <button
                  onClick={resetScreener}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-100 py-4 font-black text-slate-600 transition hover:bg-slate-200 active:scale-[0.99]"
                >
                  <RefreshCw className="h-5 w-5" aria-hidden="true" /> New Screen
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
