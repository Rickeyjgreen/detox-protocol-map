import type { LucideIcon } from 'lucide-react';
import { ClipboardList, Map } from 'lucide-react';

export type AppLink = {
  slug: string;
  title: string;
  description: string;
  href: string; // canonical
  icon: LucideIcon;
  legacy?: string[];
};

/**
 * Canonical routing convention:
 * - Every tool lives at `/apps/<slug>`
 * - `/apps` is the directory (hub)
 * - Legacy paths can continue to work, but should link to `href`
 */
export const apps: AppLink[] = [
  {
    slug: 'protocol-map',
    title: 'Detoxification Protocol Map',
    description: 'Abstinence-based protocol lanes + triage notes.',
    href: '/apps/protocol-map',
    icon: Map,
    legacy: ['/', '/protocol-map'],
  },
  {
    slug: 'intake-logic',
    title: 'Intake Logic',
    description: 'Decision-tree triage logic (step-by-step intake pathway).',
    href: '/apps/intake-logic',
    icon: ClipboardList,
    legacy: ['/intake-logic'],
  },
];
