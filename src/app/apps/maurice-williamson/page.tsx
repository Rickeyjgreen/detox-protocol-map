
import type { Metadata } from "next";
import {
  Activity,
  AlertTriangle,
  BadgeCheck,
  BookOpenCheck,
  Building2,
  ClipboardList,
  FileQuestion,
  FileSearch2,
  FileText,
  Landmark,
  ListChecks,
  Scale,
  SearchCheck,
  ShieldAlert,
  ShieldCheck,
  UserRoundSearch,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Due Diligence Dashboard | Maurice Williamson",
  description: "Expanded due diligence dashboard for Maurice Williamson.",
};

type BadgeTone = "green" | "yellow" | "red" | "slate" | "blue";

type VerificationItem = {
  section: string;
  title: string;
  status: string;
  tone: BadgeTone;
  notes: string[];
};

type TimelineItem = {
  employer: string;
  range: string;
  role?: string;
  current?: boolean;
  muted?: boolean;
};

type NoteCard = {
  title: string;
  body: string;
};

const verificationItems: VerificationItem[] = [
  {
    section: "Identity & Registry",
    title: "\"Maurice Williamson\" (Louisville behavioral-health context)",
    status: "Partially verified",
    tone: "green",
    notes: [
      "Strongest public anchor is an NPI-associated identity match for “Maurice F Williamson” in Louisville, Kentucky with a counselor taxonomy.",
      "Middle initial alignment is plausible, but not independently proven from the resume alone.",
    ],
  },
  {
    section: "Professional Registry",
    title: "NPI / NPPES presence",
    status: "Verified",
    tone: "green",
    notes: [
      "A public NPI trail exists and supports identity linkage to field-of-work and geography.",
      "This confirms registry existence, not licensure validity, employment, or scope-of-practice.",
    ],
  },
  {
    section: "Licensure & Credentials",
    title: "CSW / LSW / LMSW / LCSW date-range claims",
    status: "Unverified",
    tone: "red",
    notes: [
      "Resume lists multiple status and date-range assertions that could not be person-specifically validated from open-web results alone.",
      "Kentucky and Indiana board portals appear to be the correct primary-source path for direct verification.",
    ],
  },
  {
    section: "Scope of Practice",
    title: "Clinical therapist / clinical social work assertions",
    status: "Needs board check",
    tone: "yellow",
    notes: [
      "Public regulatory materials indicate scope boundaries differ by license level.",
      "Because the resume leans heavily on clinical-role language, exact license level matters materially.",
    ],
  },
  {
    section: "Education",
    title: "University of Louisville B.S. and M.S. claims",
    status: "Unverified",
    tone: "red",
    notes: [
      "No public registrar-grade confirmation was found, which is typical because degree verification usually requires consent.",
      "Transcript or official degree verification is still needed.",
    ],
  },
  {
    section: "Employment",
    title: "Humana, Wellcare, Journey Healthcare, CommonHealth Recovery, others",
    status: "Mixed",
    tone: "yellow",
    notes: [
      "Several named organizations appear to be real entities with public presence.",
      "Individual role, title, dates, supervisory level, and rehire status remain unverified without direct employer confirmation.",
    ],
  },
  {
    section: "Public Records",
    title: "Discipline, litigation, patents, publications, board roles",
    status: "Not found",
    tone: "slate",
    notes: [
      "No credible, person-specific public evidence was found in the report’s reviewed sources.",
      "Absence of a match should not be treated as affirmative clearance.",
    ],
  },
];

const methodologyCards: NoteCard[] = [
  {
    title: "1. Resume-first extraction",
    body: "The resume was treated as the claim set to be tested, not as verified fact.",
  },
  {
    title: "2. Primary-source preference",
    body: "Priority was given to licensing boards, statutes, regulations, and federal provider-registry materials before secondary directories.",
  },
  {
    title: "3. Identity resolution",
    body: "The review used name, geography, and profession together to reduce the risk of confusing this subject with unrelated Maurice Williamsons.",
  },
  {
    title: "4. Evidence grading",
    body: "Each claim is classified as verified, partially verified, mixed, unverified, or not found, with open gaps made explicit.",
  },
];

const findings: NoteCard[] = [
  {
    title: "NPI is an anchor, not a clearance",
    body: "The report’s strongest public match is the Louisville-area NPI identity trail. That helps link the subject to behavioral-health work, but it does not prove license validity, employment, or clinical authority.",
  },
  {
    title: "Licensure is still the biggest unresolved variable",
    body: "Kentucky and Indiana appear to have the correct verification channels, but person-specific license status was not established through open-web retrieval alone.",
  },
  {
    title: "Employment history is directionally plausible, not confirmed",
    body: "Public organization existence is not the same as confirming job title, tenure, duties, or supervisory scope. Direct HR verification is still needed for the major employers listed.",
  },
  {
    title: "Education remains consent-dependent",
    body: "The degree claims were not publicly confirmed. That is normal. Registrar-level or transcript verification is still required before treating the education section as validated.",
  },
];

const limitations: string[] = [
  "Open-web results cannot replace direct board verification, HR confirmation, or consent-based screening.",
  "The subject name has collision risk, so negative or positive records should not be attributed without at least one additional identifier.",
  "Some relevant systems are interactive, paywalled, or not reliably indexed by search engines.",
  "Public absence of discipline, litigation, or sanctions is best treated as “not located,” not “ruled out.”",
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
    role: "Frontline Leader / Contract Analyst / Learning Facilitator / Policy Consultant / Claims Adjuster",
  },
  {
    employer: "Portland Counseling (Private Practice)",
    range: "Dec 2002 – Ongoing",
    role: "Clinical Therapist (part-time)",
  },
];

const actionPlan = [
  {
    title: "1. Kentucky license verification",
    description:
      "Run Kentucky Board of Social Work verification and capture license type, number, status, issue date, expiration date, and any public discipline or restrictions.",
  },
  {
    title: "2. Scope-of-practice fit test",
    description:
      "Compare the verified license category against the resume’s clinical-role language before relying on those claims in hiring or credentialing decisions.",
  },
  {
    title: "3. Indiana check if applicable",
    description:
      "If the subject practiced or represented licensure in Indiana, run both Indiana search/verify and discipline/litigation checks directly through the PLA pathways.",
  },
  {
    title: "4. Degree confirmation",
    description:
      "Request transcript or official registrar verification for the University of Louisville degree claims.",
  },
  {
    title: "5. Employer verification",
    description:
      "Confirm titles, dates, rehire eligibility, clinical scope, and management responsibilities directly with HR or a formal verification channel.",
  },
  {
    title: "6. Consent-based screening",
    description:
      "Complete criminal, sanctions, sex-offender, and other role-relevant background checks that cannot be resolved from open public indexing alone.",
  },
  {
    title: "7. Clinical reference check",
    description:
      "Obtain at least two references who can speak to documentation quality, crisis handling, scope boundaries, and supervisory conduct.",
  },
];

function badgeClasses(tone: BadgeTone) {
  switch (tone) {
    case "green":
      return "bg-green-100 text-green-800";
    case "yellow":
      return "bg-amber-100 text-amber-800";
    case "red":
      return "bg-red-100 text-red-800";
    case "blue":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-slate-100 text-slate-800";
  }
}

function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-[1.25rem] border border-black/[0.02] bg-white shadow-[0_4px_20px_rgba(0,0,0,0.04),0_1px_3px_rgba(0,0,0,0.02)] ${className}`}
    >
      {children}
    </section>
  );
}

function SectionHeader({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-4 flex items-start gap-3">
      <div className="rounded-xl bg-slate-100 p-2">
        <Icon className="h-5 w-5 text-slate-700" />
      </div>
      <div>
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
        {subtitle ? <p className="mt-1 text-sm text-slate-500">{subtitle}</p> : null}
      </div>
    </div>
  );
}

export default function MauriceWilliamsonPage() {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <header className="sticky top-0 z-50 border-b border-slate-100 bg-white px-6 pb-4 pt-12 shadow-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-indigo-600">
              Investigative Due Diligence Report
            </p>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Maurice Williamson
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Expanded review with evidence hierarchy, methodology, gaps, chronology, and verification workflow.
            </p>
          </div>
          <div className="rounded-full bg-amber-100 p-2 text-amber-800">
            <ShieldAlert className="h-6 w-6" />
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-5xl flex-col gap-6 px-4 pb-20 pt-6 sm:px-6">
        <Card className="p-6">
          <SectionHeader
            icon={FileSearch2}
            title="Executive Summary"
            subtitle="Built to preserve the underlying report’s caution level while making the findings easier to act on."
          />
          <div className="space-y-4 text-sm leading-relaxed text-slate-600">
            <p>
              This page is a strengthened version of the underlying due diligence report. It keeps the same central conclusion:
              the strongest public anchor is an NPI-linked Louisville behavioral-health identity trail, but most material resume claims
              still require direct verification before being treated as validated fact.
            </p>
            <p>
              The biggest unresolved risks remain <strong>licensure status</strong>, <strong>scope-of-practice fit</strong>,
              <strong> employment verification</strong>, and <strong>education confirmation</strong>. Public internet research was useful
              for anchoring the identity context, but it was not sufficient to close the core diligence questions.
            </p>
          </div>
          <div className="mt-4 rounded-r-lg border-l-4 border-red-500 bg-red-50 p-4">
            <p className="text-sm font-medium text-red-800">Critical Finding</p>
            <p className="mt-1 text-sm text-red-700">
              An NPI record supports identity linkage and field-of-work plausibility, but it does <strong>not</strong> validate licensure,
              credentialing, clinical authority, education, or employment history.
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
              <p className="mb-1 text-xl font-bold text-slate-800">Low–Moderate</p>
              <p className="mt-2 border-t pt-2 text-xs text-slate-500">
                No credible adverse media was surfaced in the reviewed public materials, but the thin verifiable footprint limits confidence.
              </p>
            </Card>

            <Card className="border-2 border-amber-100 p-5">
              <div className="mb-2 flex items-start justify-between">
                <p className="text-sm font-medium text-slate-500">Legal &amp; Regulatory</p>
                <Scale className="h-4 w-4 text-amber-500" />
              </div>
              <p className="mb-1 text-xl font-bold text-amber-600">Moderate</p>
              <p className="mt-2 border-t pt-2 text-xs text-slate-500">
                Licensure, discipline status, and clinical scope alignment still depend on direct board verification.
              </p>
            </Card>

            <Card className="p-5">
              <div className="mb-2 flex items-start justify-between">
                <p className="text-sm font-medium text-slate-500">Financial / COI</p>
                <DollarSign className="h-4 w-4 text-emerald-500" />
              </div>
              <p className="mb-1 text-xl font-bold text-slate-800">Low</p>
              <p className="mt-2 border-t pt-2 text-xs text-slate-500">
                No public financial disclosures or board-role conflicts were identified in the reviewed sources.
              </p>
            </Card>
          </div>
        </section>

        <Card className="p-6">
          <SectionHeader
            icon={BadgeCheck}
            title="Evidence Strength Guide"
            subtitle="Use the evidence label, not the résumé wording, as the decision anchor."
          />
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
            {[
              {
                title: "Verified",
                tone: "green" as BadgeTone,
                text: "Public primary-source support exists for the narrow claim being made.",
              },
              {
                title: "Partially verified",
                tone: "blue" as BadgeTone,
                text: "A strong anchor exists, but one or more important identity or scope details remain open.",
              },
              {
                title: "Unverified",
                tone: "red" as BadgeTone,
                text: "The claim may be plausible, but the reviewed public sources did not confirm it.",
              },
              {
                title: "Not found",
                tone: "slate" as BadgeTone,
                text: "Nothing credible was located, but that should not be read as proof of absence.",
              },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${badgeClasses(item.tone)}`}>
                  {item.title}
                </span>
                <p className="mt-3 text-sm text-slate-600">{item.text}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <SectionHeader
            icon={UserRoundSearch}
            title="Methodology & Identity Resolution"
            subtitle="How the report reduces misattribution risk while staying inside public-source limits."
          />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {methodologyCards.map((item) => (
              <div key={item.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <h3 className="text-sm font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-2xl border border-indigo-100 bg-indigo-50 p-4">
            <p className="text-sm font-medium text-indigo-900">Identity ambiguity remains a live issue.</p>
            <p className="mt-1 text-sm text-indigo-800">
              “Maurice Williamson” is not unique enough by itself. The report’s safer frame is “Maurice Williamson in the Louisville,
              Kentucky behavioral-health context,” with the NPI-linked record acting as the strongest public anchor.
            </p>
          </div>
        </Card>

        <section>
          <div className="mb-4 flex items-center justify-between px-2">
            <h2 className="text-lg font-semibold text-slate-900">Claim Verification Matrix</h2>
            <span className="text-xs font-medium text-slate-500">What the report could actually support</span>
          </div>

          <div className="space-y-4">
            {verificationItems.map((item) => (
              <Card key={item.title} className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="mb-1 text-xs font-medium uppercase tracking-[0.18em] text-slate-500">{item.section}</p>
                    <h3 className="text-base font-semibold text-slate-900">{item.title}</h3>
                  </div>
                  <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${badgeClasses(item.tone)}`}>
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
          <SectionHeader
            icon={Landmark}
            title="Public-Record Findings"
            subtitle="The report’s strongest operational conclusions once the open-source noise is stripped away."
          />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {findings.map((item) => (
              <div key={item.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <h3 className="text-sm font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.body}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <SectionHeader
            icon={ClipboardList}
            title="Résumé Chronology (Claimed, not fully verified)"
            subtitle="This timeline organizes the resume narrative without overstating what the public evidence proved."
          />
          <div className="relative ml-3 space-y-8 border-l-2 border-slate-200">
            {chronology.map((item) => (
              <div key={`${item.employer}-${item.range}`} className="relative pl-6">
                <span
                  className={`absolute -left-[9px] top-1 h-4 w-4 rounded-full ring-4 ring-white ${
                    item.current ? "bg-indigo-500" : item.muted ? "bg-slate-200" : "bg-slate-300"
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

        <Card className="p-6">
          <SectionHeader
            icon={FileQuestion}
            title="Limitations & Caution Flags"
            subtitle="These are not minor footnotes. They materially affect confidence."
          />
          <ul className="space-y-3">
            {limitations.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-slate-600">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="border-0 bg-slate-900 p-6 text-white">
          <SectionHeader
            icon={ListChecks}
            title="Action Plan / Next Steps"
            subtitle="This converts the report from a passive summary into a hiring-grade diligence workflow."
          />
          <ul className="space-y-4">
            {actionPlan.map((item) => (
              <li key={item.title} className="flex items-start">
                <SearchCheck className="mr-3 mt-0.5 h-5 w-5 shrink-0 text-indigo-400" />
                <div>
                  <p className="text-sm font-semibold text-white">{item.title}</p>
                  <p className="mt-1 text-xs text-slate-300">{item.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </Card>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Card className="p-6">
            <SectionHeader
              icon={BookOpenCheck}
              title="What materially supports the subject"
              subtitle="Useful if this review is being presented in a balanced hiring discussion."
            />
            <ul className="space-y-3 text-sm text-slate-600">
              <li className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                <span>A public NPI-linked identity trail exists in the correct geography and profession lane.</span>
              </li>
              <li className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                <span>The named employers and organizations are not facially fictitious or obviously fabricated.</span>
              </li>
              <li className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                <span>No strong public adverse-media signal was surfaced in the reviewed materials.</span>
              </li>
            </ul>
          </Card>

          <Card className="p-6">
            <SectionHeader
              icon={Building2}
              title="What still blocks a clean clearance"
              subtitle="These are the items that prevent this report from being treated as fully dispositive."
            />
            <ul className="space-y-3 text-sm text-slate-600">
              <li className="flex items-start gap-3">
                <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                <span>License status, category, and discipline history were not fully person-specifically validated.</span>
              </li>
              <li className="flex items-start gap-3">
                <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                <span>Clinical scope claims depend on license type and therefore cannot be assumed from resume wording.</span>
              </li>
              <li className="flex items-start gap-3">
                <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                <span>Education and employer claims still require direct institutional confirmation.</span>
              </li>
            </ul>
          </Card>
        </section>

        <section className="opacity-80">
          <h2 className="mb-3 px-2 text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Document Basis</h2>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4">
              <p className="text-sm font-medium text-slate-700">Primary narrative source</p>
              <p className="mt-1 text-xs text-slate-500">
                Expanded from the uploaded investigative report and reshaped for clearer executive review.
              </p>
            </div>
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4">
              <p className="text-sm font-medium text-slate-700">Decision posture</p>
              <p className="mt-1 text-xs text-slate-500">
                Treat as a structured diligence brief, not a final clearance memorandum.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
