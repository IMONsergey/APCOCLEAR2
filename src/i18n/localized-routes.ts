import type { SitePath } from '../content/routes';

/** Routes with complete editions in both additional languages. */
export const localizedRoutes = [
  '/',
  '/platform/search-investigation',
  '/platform/data-methodology',
  '/platform/monitoring',
  '/use-cases/bug-bounty',
  '/use-cases/vulnerability-research',
  '/use-cases/osint-threat-investigation',
  '/teams',
  '/developers/api',
  '/pricing',
  '/about',
  '/responsible-scanning',
  '/contact',
  '/legal/api-data-license-agreement',
  '/legal/cookie-policy',
  '/legal/data-collection-policy',
  '/legal/data-processing-agreement',
  '/legal/privacy-policy',
  '/legal/terms',
] as const satisfies readonly SitePath[];

export const hasLocalizedCopy = (route: string): boolean =>
  (localizedRoutes as readonly string[]).includes(route);
