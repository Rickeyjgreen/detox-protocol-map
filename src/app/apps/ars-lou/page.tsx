import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

const CODEX_DASHBOARD_URL = 'https://codex-i3vyn6edt-rickeyjgreens-projects.vercel.app';

export default function Page() {
  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8 font-sans text-slate-800">
      <div className="max-w-6xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <Link
            href="/apps"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Apps
          </Link>
          <div className="text-xs text-slate-500 font-mono">/apps/ars-lou</div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-200">
            <h1 className="text-lg font-bold text-slate-900">ARS Louisville Dashboard</h1>
            <p className="text-sm text-slate-600 mt-1">Interactive business health investigation report (served from the codex project).</p>
          </div>

          <div className="w-full" style={{ height: 'calc(100vh - 220px)' }}>
            <iframe
              title="ARS Louisville Dashboard"
              src={CODEX_DASHBOARD_URL}
              className="w-full h-full"
              referrerPolicy="no-referrer"
              sandbox="allow-scripts allow-forms allow-popups allow-modals allow-downloads"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
