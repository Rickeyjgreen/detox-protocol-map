import type { Metadata } from "next";
import {
  Activity,
  CheckCircle2,
  DollarSign,
  FileText,
  ImageIcon,
  ListChecks,
  Scale,
  ShieldAlert,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Due Diligence Dashboard | Maurice Williamson",
  description: "Due diligence dashboard for Maurice Williamson.",
};

type VerificationItem = {
  section: string;
  title: string;
  status: string;
  statusClassName: string;
  notes: string[];
};

type TimelineItem = {
  employer: string;
  range: string;
  role?: string;
  current?: boolean;
  muted?: boolean;
};

const verificationItems: VerificationItem[] = [
  {
    section: "Identity & Registry",
    title: '"Maurice Williamson" (Louisville)',
    status: "Verified / Partial",
    statusClassName: "bg-green-100 text-green-800",
    notes: [
      "Evidence: NPI record exists for \"MAURICE F WILLIAMSON\" in Louisville, KY with Counselor taxonomy.",
    ],
  },
  {
    section: "Licensure & Credentials",
    title: "CSW / LSW / LMSW / LCSW",
    status: "Unverified",
    statusClassName: "bg-red-100 text-red-800",
    notes: [
      "Claim: Multiple license statuses spanning 2013-2026.",
      "Notes: NPI credential text says \"CSW\" but CMS does not verify this. Person-specific license numbers not confirmed via open web. Direct state-board verification required.",
    ],
  },
  {
    section: "Education",
    title: "University of Louisville (B.S. & M.S.)",
    status: "Unverified",
    statusClassName: "bg-red-100 text-red-800",
    notes: [
      "Notes: No public registrar confirmation available due to FERPA. Requires transcript verification with applicant consent.",
    ],
  },
  {
    section: "Employment",
    title: "Humana, Wellcare, Journey Healthcare, etc.",
    status: "Employer Exists / Role Unverified",
    statusClassName: "bg-yellow-100 text-yellow-800",
    notes: [
      "Notes: Organizations are real entities, but individual employee rosters and role confirmations are not public. Direct employer verification needed.",
    ],
  },
  {
    section: "Public Records",
    title: "Discipline, Litigation & Patents",
    status: "Not Found",
    statusClassName: "bg-slate-100 text-slate-800",
    notes: [
      "Notes: Absence of a match is not clearance. Paid background checks and official state portal searches required.",
    ],
  },
];

const chronology: TimelineItem[] = [
  {
    employer: "Journey Healthcare",
    range: "Mar 2025 – Present",
    role: "Social Services Director",
    current: true,
  },
  {
    employer: "Sunrise Recovery",
    range: "May 2023 – Mar 2025",
    role: "Addiction Counselor",
  },
  {
    employer: "Wellstone Regional Hospital",
    range: "Apr 2022 – Apr 2023",
    role: "Clinical Therapist / Float",
  },
  {
    employer: "CommonHealth Recovery",
    range: "Nov 2021 – May 2023",
    role: "Addictions Counselor",
  },
  {
    employer: "Home of the Innocents",
    range: "Feb 2020 – Nov 2021",
    role: "Clinical Therapist",
  },
  {
    employer: "Nortons Home Health",
    range: "Jun 2019 – Jan 2020",
    role: "Medical Social Worker",
  },
  {
    employer: "Wellcare Health Plans",
    range: "Nov 2017 – Dec 2018",
    role: "Clinical Social Worker",
  },
  {
    employer: "Various Roles (Carewise, Our Lady of Peace, Uspiritus)",
    range: "2013 – 2017",
    muted: true,
  },
  {
    employer: "Humana Inc",
    range: "Nov 2004 – Jun 2013",
    role: "Frontline Leader / Contract Analyst / Learning Facilitator...",
  },
  {
    employer: "Portland Counseling (Private Practice)",
    range: "Dec 2002 – Ongoing",
    role: "Clinical Therapist (Part-time)",
  },
];

const actionPlan = [
  {
    title: "1. License Verification",
    description:
      "Check KY Board of Social Work channels directly. Validate scope-of-practice fit against license category.",
  },
  {
    title: "2. Indiana Portal Search",
    description:
      "Run Indiana license verification and litigation search for out-of-state overlap.",
  },
  {
    title: "3. Transcript Request",
    description:
      "Obtain candidate consent and request official university degree verifications.",
  },
  {
    title: "4. Employer Verification",
    description:
      "Verify titles, dates, and rehire eligibility with HR. Request W-2s if HR refuses to verify dates.",
  },
  {
    title: "5. Consent-Based Background",
    description:
      "Run formal criminal, sex offender, and healthcare sanction checks.",
  },
  {
    title: "6. Clinical References",
    description:
      "Obtain at least two professional references to verify scope boundaries and crisis handling.",
  },
];

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <section
      className={`rounded-[1.25rem] border border-black/[0.02] bg-white shadow-[0_4px_20px_rgba(0,0,0,0.04),0_1px_3px_rgba(0,0,0,0.02)] ${className}`}
    >
      {children}
    </section>
  );
}

export default function MauriceWilliamsonPage() {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <header className="sticky top-0 z-50 border-b border-slate-100 bg-white px-6 pb-4 pt-12 shadow-sm">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-indigo-600">
              Due Diligence Report
            </p>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Maurice Williamson</h1>
          </div>
          <div className="rounded-full bg-amber-100 p-2 text-amber-800">
            <ShieldAlert className="h-6 w-6" />
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-4xl flex-col gap-6 px-4 pb-20 pt-6 sm:px-6">
        <Card className="p-6">
          <div className="mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5 text-indigo-500" />
            <h2 className="text-lg font-semibold text-slate-900">Executive Summary</h2>
          </div>
          <p className="mb-4 text-sm leading-relaxed text-slate-600">
            This report reviews the applicant&apos;s resume and attempts to corroborate claims using publicly accessible,
            primary and official sources. The strongest public match to the applicant&apos;s identity is a U.S. National
            Provider Identifier (NPI) record located in Louisville, Kentucky.
          </p>
          <div className="rounded-r-lg border-l-4 border-red-500 bg-red-50 p-4">
            <p className="text-sm font-medium text-red-800">Critical Finding</p>
            <p className="mt-1 text-sm text-red-700">
              Most resume claims, especially employment history, scope-of-practice assertions, specific license status,
              and education credentials, could <strong>not</strong> be confirmed from public primary sources. An NPI
              record does <strong>not</strong> validate licensure or credentialing.
            </p>
          </div>
        </Card>

        <section>
          <h2 className="mb-4 px-2 text-lg font-semibold text-slate-900">Risk Assessment</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Card className="p-5">
              <div className="mb-2 flex items-start justify-between">
                <p className="text-sm font-medium text-slate-500">Reputation Risk</p>
                <Activity className="h-4 w-4 text-emerald-500" />
              </div>
              <p className="mb-1 text-xl font-bold text-slate-800">Low-Moderate</p>
              <p className="mt-2 border-t pt-2 text-xs text-slate-500">
                No credible adverse media found, but verification opacity limits confidence.
              </p>
            </Card>

            <Card className="border-2 border-amber-100 p-5">
              <div className="mb-2 flex items-start justify-between">
                <p className="text-sm font-medium text-slate-500">Legal &amp; Regulatory</p>
                <Scale className="h-4 w-4 text-amber-500" />
              </div>
              <p className="mb-1 text-xl font-bold text-amber-600">Moderate</p>
              <p className="mt-2 border-t pt-2 text-xs text-slate-500">
                Pending direct KY Board of Social Work licensure confirmation and scope-of-practice check.
              </p>
            </Card>

            <Card className="p-5">
              <div className="mb-2 flex items-start justify-between">
                <p className="text-sm font-medium text-slate-500">Financial / COI</p>
                <DollarSign className="h-4 w-4 text-emerald-500" />
              </div>
              <p className="mb-1 text-xl font-bold text-slate-800">Low</p>
              <p className="mt-2 border-t pt-2 text-xs text-slate-500">
                No public financial disclosures or conflicting board memberships identified.
              </p>
            </Card>
          </div>
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between px-2">
            <h2 className="text-lg font-semibold text-slate-900">Verification Status</h2>
            <span className="text-xs font-medium text-slate-500">Vs. Public Records</span>
          </div>

          <div className="space-y-4">
            {verificationItems.map((item) => (
              <Card key={item.title} className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="mb-1 text-xs font-medium uppercase tracking-[0.18em] text-slate-500">{item.section}</p>
                    <h3 className="text-base font-semibold text-slate-900">{item.title}</h3>
                  </div>
                  <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${item.statusClassName}`}>
                    {item.status}
                  </span>
                </div>
                <div className="mt-3 space-y-2 text-sm text-slate-600">
                  {item.notes.map((note) => (
                    <p key={note}>{note}</p>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </section>

        <Card className="p-6">
          <h2 className="mb-6 text-lg font-semibold text-slate-900">Resume Chronology (Unverified)</h2>
          <div className="relative ml-3 space-y-8 border-l-2 border-slate-200">
            {chronology.map((item) => (
              <div key={`${item.employer}-${item.range}`} className="relative pl-6">
                <span
                  className={`absolute -left-[9px] top-1 h-4 w-4 rounded-full ring-4 ring-white ${
                    item.current
                      ? "bg-indigo-500"
                      : item.muted
                        ? "bg-slate-200"
                        : "bg-slate-300"
                  }`}
                />
                <h3 className="text-sm font-bold text-slate-900">{item.employer}</h3>
                <p className={`mb-1 text-xs font-medium ${item.current ? "text-indigo-600" : "text-slate-500"}`}>
                  {item.range}
                </p>
                {item.role ? <p className="text-sm text-slate-600">{item.role}</p> : null}
              </div>
            ))}
          </div>
        </Card>

        <Card className="border-0 bg-slate-900 p-6 text-white">
          <div className="mb-4 flex items-center gap-2">
            <ListChecks className="h-5 w-5 text-indigo-400" />
            <h2 className="text-lg font-semibold text-white">Action Plan / Next Steps</h2>
          </div>

          <ul className="space-y-4">
            {actionPlan.map((item) => (
              <li key={item.title} className="flex items-start">
                <CheckCircle2 className="mr-3 mt-0.5 h-5 w-5 shrink-0 text-indigo-400" />
                <div>
                  <p className="text-sm font-semibold">{item.title}</p>
                  <p className="mt-1 text-xs text-slate-400">{item.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </Card>

        <section className="mt-4 opacity-70">
          <h2 className="mb-3 px-2 text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Document Artifacts</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex h-24 flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-center">
              <ImageIcon className="mb-1 h-5 w-5 text-slate-400" />
              <p className="text-xs text-slate-500">
                Humana/Univ Resume Excerpt
                <br />
                (See original PDF)
              </p>
            </div>
            <div className="flex h-24 flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-center">
              <ImageIcon className="mb-1 h-5 w-5 text-slate-400" />
              <p className="text-xs text-slate-500">
                Certifications Excerpt
                <br />
                (See original PDF)
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
