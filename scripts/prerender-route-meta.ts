import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { resolve, join, dirname } from 'node:path';
import ts from 'typescript';
import { loadLocale, translate, type Locale } from '../src/i18n/messages';
import { hasLocalizedCopy } from '../src/i18n/localized-routes';
import { localizedMetadataSource } from '../src/i18n/route-metadata';

interface CommonJsModule {
  exports: unknown;
}

interface SiteRoute {
  path: string;
  title: string;
  description: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isSiteRoute(value: unknown): value is SiteRoute {
  return (
    isRecord(value) &&
    typeof value.path === 'string' &&
    typeof value.title === 'string' &&
    typeof value.description === 'string'
  );
}

function isSiteRoutes(value: unknown): value is SiteRoute[] {
  return Array.isArray(value) && value.every(isSiteRoute);
}

const source = await readFile(resolve('src/content/routes.ts'), 'utf8');
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;
const routeModule: CommonJsModule = { exports: {} };
const legalModule: CommonJsModule = { exports: {} };
const legalCompiled = ts.transpileModule(
  await readFile(resolve('src/content/legal-routes.ts'), 'utf8'),
  { compilerOptions: { module: ts.ModuleKind.CommonJS } },
).outputText;
new Function('exports', 'module', legalCompiled)(legalModule.exports, legalModule);
new Function('exports', 'module', 'require', compiled)(
  routeModule.exports,
  routeModule,
  (specifier: string): unknown => {
    if (specifier !== './legal-routes') {
      throw new Error(`Unexpected route-manifest dependency: ${specifier}`);
    }
    return legalModule.exports;
  },
);
const routesValue = isRecord(routeModule.exports) ? routeModule.exports.siteRoutes : undefined;
if (
  !isSiteRoutes(routesValue) ||
  !routesValue.length ||
  new Set(routesValue.map((route) => route.path)).size !== routesValue.length ||
  !routesValue.every(
    (route) =>
      /^\/(?:[a-z0-9-]+(?:\/[a-z0-9-]+)*)?$/.test(route.path) && route.title && route.description,
  )
)
  throw new Error('Route manifest must contain unique safe paths, titles and descriptions');
const routes = routesValue;
const dist = resolve('dist');
const template = await readFile(join(dist, 'index.html'), 'utf8');
const escape = (s: string): string =>
  s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const replaceMeta = (html: string, attribute: string, key: string, value: string): string => {
  const selector = new RegExp(
    '(<meta\\s+' + attribute + '="' + key + '"\\s+content=")[^"]*(")',
    'i',
  );
  if (!selector.test(html)) throw new Error('Missing metadata ' + key);
  return html.replace(
    selector,
    (_match: string, before: string, after: string) => before + escape(value) + after,
  );
};
const origin = process.env.APCO_PUBLIC_SITE_ORIGIN?.replace(/\/+$/, '') ?? '';
const indexingSetting = process.env.APCO_SITE_INDEXABLE || 'false';
if (!['true', 'false'].includes(indexingSetting)) {
  throw new Error('APCO_SITE_INDEXABLE must be true or false.');
}
const indexable = indexingSetting === 'true';
if (indexable && !origin) {
  throw new Error('An indexable build requires APCO_PUBLIC_SITE_ORIGIN.');
}
if (origin) {
  const url = new URL(origin);
  if (url.protocol !== 'https:' || url.origin !== origin || url.username || url.password) {
    throw new Error(
      'APCO_PUBLIC_SITE_ORIGIN requires an HTTPS origin without a path or credentials',
    );
  }
}
const base = (template.match(/<script[^>]*\bsrc="(\/[^"]*?)assets\//)?.[1] ?? '/').replace(
  /\/$/,
  '',
);
const localizedPath = (path: string, locale: Locale): string => {
  const prefix = locale === 'en' ? '' : locale === 'ru' ? '/ru' : '/zh-hant';
  const pathname = (base || '') + (path === '/' ? prefix + '/' : prefix + path);
  return path.startsWith('/legal/') || pathname.endsWith('/') ? pathname : pathname + '/';
};
const locales: readonly Locale[] = ['en', 'ru', 'zh-Hant'];
const sitemapEntries: string[] = [];
let generated = 0;
for (const locale of locales) {
  await loadLocale(locale);
  for (const route of routes) {
    if (locale !== 'en' && !hasLocalizedCopy(route.path)) continue;
    const localized = locale === 'en' ? null : localizedMetadataSource(route.path);
    const title =
      route.path === '/' && locale === 'en'
        ? 'Apcosys — Start with a query.'
        : (localized ? translate(locale, localized.title) : route.title) + ' | Apcosys';
    const description = localized ? translate(locale, localized.description) : route.description;
    let html = template.replace(/<html\s+lang="[^"]*"/, `<html lang="${locale}"`);
    html = html.replace(/<title>[^<]*<\/title>/, '<title>' + escape(title) + '</title>');
    html = replaceMeta(html, 'name', 'description', description);
    html = replaceMeta(html, 'property', 'og:title', title);
    html = replaceMeta(html, 'property', 'og:description', description);
    html = replaceMeta(html, 'name', 'robots', indexable ? 'index, follow' : 'noindex, nofollow');
    html = html.replace('<html ', `<html data-indexable="${indexable}" `);
    const canonicalPath = localizedPath(route.path, locale);
    if (origin) {
      const links = [
        '    <link rel="canonical" href="' + escape(origin + canonicalPath) + '" />',
        '    <meta property="og:url" content="' + escape(origin + canonicalPath) + '" />',
      ];
      if (!route.path.startsWith('/legal/')) {
        const image = escape(`${origin}${base}/assets/brand/social-preview.png`);
        links.push(
          `    <meta property="og:image" content="${image}" data-apco-social />`,
          '    <meta property="og:image:width" content="1200" data-apco-social />',
          '    <meta property="og:image:height" content="630" data-apco-social />',
          '    <meta property="og:image:type" content="image/png" data-apco-social />',
          '    <meta property="og:image:alt" content="Apcosys — Start with a query. Follow what you find." data-apco-social />',
          '    <meta name="twitter:card" content="summary_large_image" data-apco-social />',
          `    <meta name="twitter:image" content="${image}" data-apco-social />`,
        );
      }
      if (hasLocalizedCopy(route.path)) {
        for (const alternate of [...locales, 'x-default'] as const) {
          const targetLocale = alternate === 'x-default' ? 'en' : alternate;
          links.push(
            '    <link rel="alternate" hreflang="' +
              alternate +
              '" href="' +
              escape(origin + localizedPath(route.path, targetLocale)) +
              '" data-apco-hreflang />',
          );
        }
      }
      html = html.replace('</head>', links.join('\n') + '\n  </head>');
      const alternatives = hasLocalizedCopy(route.path)
        ? ([...locales, 'x-default'] as const).map((alternate) => {
            const targetLocale = alternate === 'x-default' ? 'en' : alternate;
            return `    <xhtml:link rel="alternate" hreflang="${alternate}" href="${escape(origin + localizedPath(route.path, targetLocale))}" />`;
          })
        : [];
      sitemapEntries.push(
        [
          '  <url>',
          `    <loc>${escape(origin + canonicalPath)}</loc>`,
          ...alternatives,
          '  </url>',
        ].join('\n'),
      );
    }
    const relativePath = localizedPath(route.path, locale).slice(base.length).replace(/^\//, '');
    const target = join(dist, relativePath, 'index.html');
    await mkdir(dirname(target), { recursive: true });
    await writeFile(target, html);
    generated++;
  }
}
await loadLocale('en');
let notFound = template.replace(/<title>[^<]*<\/title>/, '<title>Page not found | Apcosys</title>');
notFound = notFound.replace('<html ', `<html data-indexable="${indexable}" `);
notFound = replaceMeta(notFound, 'name', 'robots', 'noindex, nofollow');
notFound = replaceMeta(notFound, 'name', 'description', 'Find what you need on Apcosys.');
notFound = replaceMeta(notFound, 'property', 'og:title', 'Page not found | Apcosys');
notFound = replaceMeta(notFound, 'property', 'og:description', 'Find what you need on Apcosys.');
await writeFile(join(dist, '404.html'), notFound);
if (origin) {
  await writeFile(
    join(dist, 'sitemap.xml'),
    [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
      ...sitemapEntries,
      '</urlset>',
      '',
    ].join('\n'),
  );
}
await writeFile(
  join(dist, 'robots.txt'),
  `User-agent: *\n${indexable ? 'Allow: /' : 'Disallow: /'}\n${origin ? `\nSitemap: ${origin}${base}/sitemap.xml\n` : ''}`,
);
console.log(
  'Generated localized static title, description and Open Graph metadata for',
  generated,
  'routes. Runtime rendering remains client-side.',
);
