# Localization

APCOSYS Website includes English, Russian and Traditional Chinese marketing pages in ordinary development and production builds. English retains the original unprefixed paths. Russian uses `/ru/`; Traditional Chinese uses `/zh-hant/` and the BCP 47 language tag `zh-Hant`. Verify the deployed locale routes against the destination build; publication status belongs to the hosting workflow, not to a language-specific build flag.

## Route coverage

`src/i18n/localized-routes.ts` defines the eleven marketing page identities that have client-supplied translations: Home, Search & Investigation, Data & Methodology, Monitoring, the three use cases, Teams, API, Pricing and Contact. These have an English path and two localized variants. `/about`, `/responsible-scanning` and the six `/legal/*` routes remain English-only; their content was not translated in the supplied document. Links to those routes use English URLs and the resulting document is marked `lang="en"`. There is no automatic redirect based on country or browser language.

The router resolves locale and page identity independently. `siteHref` keeps query parameters and fragments, and language switching opens the corresponding localized URL. Static `index.html` is generated for each available variant, retaining direct-link refresh support on subdirectory and root deployments. `scripts/prerender-route-meta.ts` and `src/i18n/route-metadata.ts` provide translated titles/descriptions, correct `html lang`, canonical URLs and matching `hreflang` alternates for equivalent localized pages. `noindex` remains enabled until launch approval. Site-map publication is a separate launch task.

## Translation catalogs

The supplied Word document comprises 53 table rows with English screenshot references and Russian/Traditional Chinese text. `src/i18n/translations/ru.ts` and `src/i18n/translations/zh-Hant.ts` contain English-source-keyed translations. This retains compatibility with existing `t(source)` calls and `Text`/`LocaleText` without splitting pages or duplicating components. It is a pragmatic migration convention; stable semantic IDs may be introduced when copy is next substantively reworked, not as a speculative second abstraction.

Translations are imported by locale on initial navigation before React renders. The English entry bundle does not include both localized catalogs. `LocaleProvider` supplies `locale` and `t`; `LocaleText` translates inline labels, and `Text` translates authored native text without changing its semantic HTML element. Code, IP addresses, identifiers, hostnames, JSON, API request templates, and explicit verbatim content are left intact. Dynamic numbers, prices and credit allowances remain application data and use locale-sensitive `Intl` formatting where displayed.

The initial document mapping was reviewed for conflicting term choices, alternative editorial notes, placeholders and examples embedded in labels. An additional small set of UI/accessible strings, which the document does not cover, is included in the catalogs to avoid partially English form controls; these editorial supplements require content-owner review before public launch. The client source DOCX and temporary reconciliation reports are not included in the source package. The legal policy bodies remain in English pending separate legal approval.

The runtime performs named `{placeholder}` substitution. When a finite numeric `count` is supplied, it optionally selects a catalog key suffixed with the cardinal category from `Intl.PluralRules`, such as `Search Tokens#few` or `{count} requests/s#many`; otherwise it uses the base message. This is not full ICU `plural`/`select` syntax. Keep the base key for fallback and preserve the same placeholders in every variant. `npm run verify:localization` checks placeholders, catalog symmetry, route metadata and required static UI messages found in authored `t()` calls, `Text`/`LocaleText` children shared page-template props and the translated plan-record fields. Its AST fixtures prove that a newly used missing key fails even when both catalogs omit it. Dynamic record values and animation updates still require browser coverage; the guard does not infer arbitrary runtime expressions. Avoid putting dynamic prices, counts or dates in translation values.

## Script and typography

Use `ru`, `zh-Hant` (Traditional Chinese), not `zh-CN`/`zh-Hans` for the supplied Chinese. The language selector uses native names and a region-neutral symbol for Traditional Chinese. Its menu is keyboard accessible and announces the active selection. English retains the project's Instrument Sans/IBM Plex presentation. Russian uses the bundled Onest and IBM Plex Mono Cyrillic subsets, with their font notices retained in `public/fonts/`. Traditional Chinese uses script-capable system fallbacks and less aggressive tracking. Install a Traditional Chinese/CJK font in the test environment; CI explicitly installs Noto CJK so glyph metrics and visibility are meaningful. See [Assets](ASSETS.md) for the complete local font inventory.

Prefer whole-sentence translation keys over fragments around line breaks: word order and punctuation differ across locales. The English design may keep its editorial hard breaks, but localized headings should wrap naturally. `Intl.NumberFormat` owns numeric localization. Test light/dark themes, long labels, focus states and reduced motion at 320, 390, 768, 1200, 1440 and 1856 px.

## Release review

- Validate `npm run check`, `npm run verify:localization`, `npm run build`, `npm run build:root`, browser route/navigation, locale switching and translations in Pricing/Contact/API/product scenes.
- Inspect all 11 marketing routes per locale for untranslated visible copy or layout overflow; include `aria-label`, form validation, modals and dynamic states. Recheck English content and geometry after localization changes.
- Check localized static title, description, canonical URL, alternate URL, language tag and direct refresh on the deployment origin. Legal/untranslated pages must not get fabricated locale URLs.
- Confirm the supplementary editor-provided UI translations and ambiguous terminology with the content owner; confirm technical product values independently before production release.
- Keep legal policy bodies in English unless their owner supplies reviewed translated legal copy; deliberate source amendments must be compiled and reviewed. The app's authenticated product and checkout remain separate systems.

References: BCP 47 language tags, W3C language identification, Google Search Central localized variants guidance, ECMAScript `Intl` APIs.
