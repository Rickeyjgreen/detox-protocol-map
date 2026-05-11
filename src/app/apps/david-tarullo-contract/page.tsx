'use client';

import { useState } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  Target,
  Stethoscope,
  Activity,
  ShieldAlert,
  CheckSquare,
  Square,
  Users,
  ArrowRight,
  BarChart3,
} from 'lucide-react';

const supportNeeds = [
  'Continue David beyond May 11',
  'Reinforce the clinical implementation plan at leadership level',
  'Use IDS for problem-solving, with Director input, rather than sending down new directives that do NOT consider operational realities and impacts.',
  'Add one clinician for assessments, for ALL ARS to directly empower us to control admissions processes that strictly adhere to our program standards, ensuring long-term fidelity and sustainability.',
  'Approve CRM licenses for Outreach leadership',
  'Approve Microsoft tools: Power Apps, Power Automate, Power BI, Dataverse',
  'Approve outreach reprioritization toward a court-liaison referral strategy that deprioritizes high-risk, ASA-inclined in-dorm assessments. These activities currently sit at the top of our outreach funnel and directly drive our increased ASA/AWOL trends — a risk that will persist until this funnel activity is corrected.',
  'Continue staffing correction already underway',
] as const;

const accomplishments = [
  '11 micro-trainings completed',
  '37 case consultations completed',
  '1:1 schedules established',
  'Group safety and standards work in implementation',
  'Group start/stop consistency moved close to standard',
  'Clinician champions identified and developing',
] as const;

const discoveryTags = ['fidelity', 'engagement', 'planning', 'consistency', 'confidence'] as const;

const censusRisks = [
  'Magnify operational strain',
  'Weaken treatment consistency',
  'Damage referral confidence',
  'Make growth less sustainable',
] as const;

const pressurePoints = [
  'Intake-control reliability',
  'Day-to-day consistency',
  'Therapist development',
  'Referral-partner experience',
] as const;

const contractEndRisks = [
  'Group fidelity',
  'Treatment planning consistency',
  'Front-door decision-making',
  'Therapist skill development',
  'Overall clinical standardization',
] as const;

export default function Page() {
  const [checkedAsks, setCheckedAsks] = useState<Record<number, boolean>>({});

  const toggleAsk = (index: number) => {
    setCheckedAsks((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 font-sans text-slate-800 md:p-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="rounded-2xl bg-slate-900 p-6 text-white shadow-lg md:p-8">
          <div className="mb-6">
            <p className="mb-1 text-sm font-bold uppercase tracking-wider text-blue-400">Executive Snapshot</p>
            <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">David Tarullo Contract Update</h1>
            <p className="mt-2 text-lg text-slate-400">ARS Louisville</p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-xl border border-blue-500/30 bg-blue-600/20 p-5">
              <div className="mb-2 flex items-center gap-2">
                <Target className="text-blue-400" size={20} />
                <h2 className="text-sm font-bold uppercase tracking-wider text-blue-300">Decision Needed</h2>
              </div>
              <p className="text-lg font-semibold text-white">Approve continuation of David’s contract beyond May 11</p>
            </div>

            <div className="rounded-xl border border-slate-700 bg-slate-800 p-5">
              <h2 className="mb-2 text-sm font-bold uppercase tracking-wider text-slate-400">The Bottom Line</h2>
              <p className="text-sm leading-relaxed text-slate-200">
                David’s work is producing meaningful clinical and operational gains, <strong className="font-bold text-white">AND</strong> ARS Louisville is still in implementation, not steady-state.{' '}
                <strong className="font-bold text-white">Ending his contract now would remove key clinical infrastructure before the new model is stabilized.</strong>
              </p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-5 flex items-center gap-2 text-xl font-bold text-slate-900">
              <CheckCircle2 className="text-emerald-500" size={24} />
              What David has accomplished
            </h2>
            <ul className="space-y-3">
              {accomplishments.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <div className="mt-1 shrink-0 rounded-full bg-emerald-100 p-1">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                  </div>
                  <span className="font-medium text-slate-700">{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 bg-slate-50 p-6">
              <h2 className="mb-2 flex items-center gap-2 text-xl font-bold text-slate-900">
                <Stethoscope className="text-indigo-600" size={24} />
                What we discovered
              </h2>
              <p className="mb-4 text-sm italic text-slate-600">As implementation progressed, deeper issues surfaced...</p>

              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="mb-1 text-sm font-bold uppercase tracking-wider text-red-600">Most Important Issue</p>
                <p className="mb-2 font-medium text-slate-800">Front-door clinical / medical practice needed correction</p>
                <p className="mb-3 text-sm leading-relaxed text-slate-600">
                  A long-standing pattern developed where medication pathways were not always being sufficiently matched to the client’s actual presentation at intake.
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {discoveryTags.map((tag) => (
                    <span key={tag} className="rounded bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">
                      Affects {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex-grow bg-indigo-50 p-6">
              <h3 className="mb-2 flex items-center gap-2 font-bold text-indigo-900">
                <Activity size={18} /> What we did about it
              </h3>
              <p className="mb-4 text-sm text-indigo-800">Partnered with the Medical Director to redesign the approach.</p>
              <div className="rounded-xl border border-indigo-100 bg-white p-4">
                <p className="mb-2 text-sm font-bold uppercase tracking-wider text-indigo-900">Result</p>
                <p className="mb-2 text-sm font-medium text-slate-700">A new person-centered detoxification / intake protocol is established and being:</p>
                <ul className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
                  {['Trained', 'Implemented', 'Reinforced weekly'].map((step) => (
                    <li key={step} className="rounded-lg border border-indigo-100 bg-indigo-50 py-2 text-center text-xs font-bold text-indigo-700">
                      {step}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-amber-100 bg-amber-50 p-6">
              <h2 className="mb-2 flex items-center gap-2 text-xl font-bold text-amber-900">
                <BarChart3 className="text-amber-600" size={24} />
                Why this matters to census
              </h2>
              <p className="mb-4 text-lg font-bold text-amber-800">Census is the business priority.</p>
              <p className="mb-3 text-sm font-medium text-amber-900">
                <strong className="font-bold">AND</strong> increasing census before stabilizing these core weaknesses would:
              </p>
              <ul className="mb-6 space-y-2">
                {censusRisks.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-amber-800">
                    <ArrowRight size={14} className="shrink-0 text-amber-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-slate-900 p-6 text-white">
              <p className="mb-1 text-xs font-bold uppercase tracking-wider text-blue-400">Translation</p>
              <p className="text-lg font-medium leading-tight">
                This work is not separate from census. <br />
                <span className="font-bold text-emerald-400">It is what protects census growth.</span>
              </p>
            </div>
          </section>

          <div className="space-y-6">
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-3 text-lg font-bold text-slate-900">Current Status</h2>
              <div className="mb-4 rounded-r-xl border-l-4 border-blue-500 bg-slate-50 p-4">
                <p className="font-bold text-slate-800">
                  ARS Louisville is improving, <strong className="font-bold">AND</strong> still in transition.
                </p>
                <p className="mt-1 text-sm text-slate-600">Progress is real. Execution is catching up to the model.</p>
              </div>
              <p className="mb-2 text-sm font-bold text-slate-700">Remaining pressure points:</p>
              <div className="flex flex-wrap gap-2">
                {pressurePoints.map((point) => (
                  <span key={point} className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700">
                    {point}
                  </span>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-red-100 bg-red-50 p-6 shadow-sm">
              <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-red-900">
                <AlertTriangle className="text-red-500" size={20} />
                Risk if contract ends May 11
              </h2>

              <div className="mb-4 rounded-xl border border-red-300 bg-red-200/50 p-4">
                <p className="text-sm font-bold leading-relaxed text-red-900">
                  CRITICAL FLIGHT RISK: Just last week, the clinical team expressed that David’s mentorship has finally restored their hope for professional development after a long period of uncertainty and reluctance. Removing him now guarantees they will seek new opportunities. 3 of our 4 qualified clinicians will leave, putting us further behind our objectives than when we started 9 months ago.
                </p>
              </div>

              <p className="mb-3 text-sm font-medium text-red-800">If David exits now, risk increases in:</p>
              <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {contractEndRisks.map((risk) => (
                  <li key={risk} className="flex items-center gap-2 rounded border border-red-100/50 bg-white/60 p-2 text-sm text-red-700">
                    <ShieldAlert size={14} className="shrink-0 text-red-400" />
                    {risk}
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold text-slate-900">
            <Users className="text-blue-500" size={28} />
            Support Needed
          </h2>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {supportNeeds.map((ask, index) => (
              <button
                key={ask}
                type="button"
                onClick={() => toggleAsk(index)}
                className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 text-left transition-all ${
                  checkedAsks[index]
                    ? 'border-blue-200 bg-blue-50 shadow-inner'
                    : 'border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-slate-100'
                }`}
              >
                <span className="mt-0.5 shrink-0">
                  {checkedAsks[index] ? <CheckSquare className="text-blue-600" size={20} /> : <Square className="text-slate-400" size={20} />}
                </span>
                <span className={`text-sm font-medium ${checkedAsks[index] ? 'text-blue-900' : 'text-slate-700'}`}>{ask}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-blue-800 bg-blue-900 p-6 text-center shadow-md md:p-8">
          <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-blue-300">Final Recommendation</h2>
          <p className="mx-auto max-w-4xl text-xl font-medium leading-relaxed text-white md:text-2xl">
            Continue David’s contract now and begin planning for a more formal long-term clinical systems leadership structure so the{' '}
            <span className="border-b-2 border-blue-400/50 font-bold text-blue-300">gains underway become sustainable</span> as ARS Louisville scales.
          </p>
        </section>
      </div>
    </div>
  );
}
