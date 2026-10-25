# Frontend revision and release readiness — 25 October 2026

## Current revision — compact product demonstrations and API documentation

This revision starts from `2da409dc89aa23321879e40b6bf2bf64759099b5` in **IMONsergey/APCOCLEAR2**. The requested reference is the current interface at <https://assaasdev.vercel.app/>. The client documentation at <https://apcosys.net/docs/api> supplies the API structure and contract; its extraction and limitations are recorded in [Product integrations](reference/PRODUCT-INTEGRATIONS.md). Legal document content, templates and dedicated styles are outside this revision and remain unchanged.

### Implemented changes

- API documentation has its own localized route, `/developers/api/docs`, and its own lazy page module. It covers authentication, access and rates, all eight published methods, query filters, response schemas, errors and request examples. A sticky desktop contents rail becomes a disclosure on narrow screens. Long schemas are expandable, field names remain selectable, and request copying has an accessible selection fallback. Copying does not execute an API request. The existing API overview retains its short first-request section and legacy `#documentation` anchor; Documentation links now open the full reference.
- The five Home research scenes follow the current SaaS search, results, host-services and TLS hierarchy. Complete frames fit within their cards. Their interface text is at least 12 px; secondary content is omitted at small container widths instead of cropping or scaling the whole interface. The scenes loop automatically without playback buttons; each action completes after the illustration pointer reaches its target. Reduced-motion, offscreen and hidden-document behavior remain available.
- The Home API composition no longer stretches to a forced desktop height. The left heading, description and CTA form a compact stack. The right illustration uses a key panel with a small account summary and a separate usage view. Its interface text is 14 px, the panels reserve equal height, and narrow usage cards stack when required. Playback loops automatically while all illustrated controls remain inert. No GSAP dependency or runtime is introduced.
- Search & Investigation replaces the tall five-stage composition with Query, Results and Host states. Example searches filter two synthetic records; selecting a host exposes its services and Response/TLS evidence. Searching the selected hostname returns to filtered results. The workbench retains keyboard navigation, deep links, translated copy and the five existing page contexts. The desktop stage is tested against a 650 px height limit; phone content flows naturally without reducing the text size.
- The additional audit removed inherited table minimum widths that overflowed the new workbench and documentation on phones. It also corrected Russian API labels at the narrowest container widths and both sides of the 480 px API layout transition. Tests cover readable glyphs, clipping, visibility pause/resume, schema disclosures, copy fallback and the new three-state workbench.

### Validation record

`npm run check` passes, including 26 architecture/data fixtures, 89 image/logo assets, ten font/license files, nine protected rendering/data hashes and the localization contract for 20 routes, 997 required authored messages and 1,738 entries in each translated catalog. A clean production build generates metadata for 60 localized routes plus the 404 document. The Home static graph is 131.2/132 KiB gzip JavaScript and 27.6/29 KiB gzip CSS; Corporate is 114.8/115 KiB gzip JavaScript. React and typography share one mandatory runtime chunk, and browser asset resolvers omit the full validation-only filename catalog. The complete asset catalog and its build checks remain intact.

The acceptance inventory is 803 cases per engine in 48 spec files (2,409 across the three engines); inventory is not a completed full-run result. Focused Chromium checks pass for the five research scenes in 18 locale/theme/viewport combinations, API typography and panel stability, documentation in all three locales and both themes at 320/390/768/1440 px, and the manual investigation workflow. Active Results/Host/TLS accessibility checks pass in nine combinations. Pointer checks cover opening/applying filters, visibility pause/resume and the hidden mobile TLS target across resize. Manual review includes all five Home scenes, both API panels, all workbench states and desktop/mobile documentation in light and dark themes.

The release uses the existing source, legal parity, protected visual engine, style, architecture, localization, bundle and browser gates. Existing bundle limits are not increased. The exact candidate and published commit are verified by the [Validate and deploy APCOSYS workflow](https://github.com/IMONsergey/APCOCLEAR2/actions/workflows/deploy.yml): the full Chromium, Firefox and WebKit suites precede publication, and Chromium runs against the deployed site afterward. Historical results below are not evidence of this candidate's publication.

The review site remains non-indexable. Demonstration data and copied API examples do not perform live searches or account operations. Existing external product, billing and contact handoffs retain their documented integration boundaries.

## Historical revision — component composition and responsive alignment

This checkpoint records the website refinements in [PR #1](https://github.com/IMONsergey/APCOCLEAR2/pull/1), based on `6e1c3ba`. It retains the earlier composition corrections. The pull request links the exact source revision and its workflow results; inventory counts below do not establish a completed browser run or publication. The active repository remains **IMONsergey/APCOCLEAR2**, with the review site at <https://imonsergey.github.io/APCOCLEAR2/>.

### Implemented correction

- The Chinese language badge uses the five-star Chinese flag in both the active language button and language list. The available Chinese locale remains Traditional Chinese.
- Decorative focus rectangles are removed from both native animation systems, including their CSS and runtime writes. Real interactive controls retain visible keyboard feedback through their selected surface and underlined text.
- Home Capabilities keeps its five separate tabs and reserves their intrinsic height in one shared grid cell. Inactive panels remain hidden and inert, so tab changes do not move the following section or expose hidden controls. Each view pairs a clear text hierarchy and numbered notes with one coherent product record; the API view uses the documented `ip`/`open_ports` response excerpt.
- The Home API screen stretches from the top of the left headline to the bottom of its CTA on desktop. Below 1200 px it becomes a stacked composition. Both API panels reserve the same height and preserve their 12 px minimum interface text.
- The dark closing screen is opaque and has an explicit stacking context. Its colored layers remain behind the front screen; preview-only masks cannot affect it.
- The Contact Topic field uses a themed custom listbox with viewport-aware positioning, wrapping mobile labels, selected checkmark, full keyboard navigation, required validation and cancellation on outside click. It was the only visible native select on the site.
- Search & Investigation uses a horizontal stage rail and a full-width connected record. Monitoring uses one host selector, a stage explanation and the corresponding snapshot, service response or next research step. Bug Bounty uses a numbered scope sequence and candidate rows. Teams uses one interactive workflow, with changing evidence fields rather than two duplicate diagrams.
- Responsible Scanning uses aligned editorial columns and consistent definition rows. The developer API rates table has stable column proportions and readable mobile values. The Request/Response example uses a stable, internally scrollable code viewport and reserves both note heights; its following field-reference section stays in place when tabs change. Shared responsive rules remove the competing tablet and phone overrides that caused the misalignment.
- The explanatory caption below the five Home research scenes is restored in English, Russian and Traditional Chinese.

All 13 Home sections, the two Audience illustrations, annual billing defaults, About-first navigation and existing contact handoff remain in place. No new dependency, GSAP runtime, live API request, commercial-domain change or indexing change is introduced.

### Validation scope

The localization verifier reports 19 route definitions, 726 required authored UI messages and 1,457 messages in each translated catalog. Playwright `--list` enumerates 775 cases per engine across 47 spec files, or 2,325 across Chromium, Firefox and WebKit; this includes 15 panel-stability cases per engine and the API layout boundary at 1000/1001 px. These counts do not establish completed browser runs. Bundle limits remain unchanged, and the build retains its 57 localized route documents plus the 404 document. The older checks and byte measurements below remain historical evidence.

The preceding 24 October focused checks covered native animation pointers and lifecycle, API panel stability and desktop alignment, dark closing layers, custom select keyboard behavior and validation, all three locales and both themes, and the revised workspaces. Scanner and API editorial checks measured rendered geometry at 320, 768 and 1440 px in Firefox and WebKit; their existing typography thresholds are retained. That checkpoint's visual captures include English desktop, Russian tablet and Traditional Chinese phone layouts; they do not establish a completed run for `6713d9d`.

The production accessibility check also identified insufficient contrast in the selected example-result title in the light theme. It now inherits the primary text color on its selected surface; the selection and keyboard underline remain visible without restoring decorative outlines.

The new site-integrity suite traverses all 19 routes for each language, theme and 320/768/1440 px viewport combination. It checks heading visibility and fit, horizontal overflow, loaded images and runtime errors. The intentional optical offset of the Home display heading is measured against its own box and the viewport.

The [Validate and deploy APCOSYS workflow](https://github.com/IMONsergey/APCOCLEAR2/actions/workflows/deploy.yml) remains the publication record for the exact commit. The entire Chromium, Firefox and WebKit acceptance suite must pass before deployment, followed by the Chromium suite against the deployed site. A successful older workflow does not establish deployment of this correction.

## Historical revision — SaaS alignment and UI cleanup

The following checkpoint describes the preceding release and is retained as implementation history.

The active repository is **IMONsergey/APCOCLEAR2**, branch **main**, with the review site at <https://imonsergey.github.io/APCOCLEAR2/>. This revision builds on [`91f3605115594749230a699ebc71c89f063fa1f5`](https://github.com/IMONsergey/APCOCLEAR2/commit/91f3605115594749230a699ebc71c89f063fa1f5), whose [release workflow 40073737122](https://github.com/IMONsergey/APCOCLEAR2/actions/runs/40073737122) completed successfully. The old `apcoweb` and `apcoseb-clear` repositories are historical references. `Assaasdev` supplies the product interface reference and is not modified by this website revision.

### Implemented request

- The five native animated research excerpts retain their existing 3:2 dimensions. Their left edges align with the card text; their right edges may continue behind the outer cards, as requested. Text remains inside each excerpt. Narrow layouts omit secondary details rather than shrinking the type.
- All five excerpts and the API illustration now follow <https://assaasdev.vercel.app/> at reference commit `85f41b7569ccb172b4eceabd345e9c79cfde470e`. The nginx query, four-result set, selected German host, TLS details and account balances share coherent source fixtures. [Application demonstrations](APPLICATION-DEMOS.md) records the exact data and presentation.
- API key and usage views reserve the same outer height. The API text base is 12 px; all visible API detail text meets that minimum. Native reduced-motion, viewport pause and document-visibility behavior remain intact. GSAP is not added.
- About is first in the shared Platform menu, on desktop and mobile. Annual billing is the initial selection on both Home and Pricing.
- Contact uses one Email us action. Copy/clear buttons, generated email previews and the long browser-draft instructions are removed. The Topic chevron is centered independently of the native select. Validation and entered-form retention remain available.
- Other redundant implementation explanations are replaced with concise example labels and useful product copy in all three languages. The actual Monitoring concept marker, legal content, documented API structure, and research scope/CVE guidance remain accurate.
- Coverage-source text is smaller and quieter, with the link emphasized on hover or keyboard focus.
- All 13 Home sections remain in their approved order, including the separate Capabilities section and both Audience illustrations. The tablet workbench grid and horizontal navigation now switch together at 1199 px. Heading-margin defects and the dark-theme API CTA hover contrast are corrected.

### Validation checkpoint

`npm run check` passes the source, asset, legal, architecture, locale, formatting, ESLint and TypeScript gates. The production build generates metadata for all 57 localized routes and passes every existing bundle limit without raising a limit. Home remains within 132 KiB gzip JavaScript and 29 KiB gzip CSS.

Focused Firefox validation covers Contact, annual billing, desktop/mobile navigation, all three locales and both themes; accessibility of Home/Pricing/Contact; internal-page layout; scene glyph size and clipping; exact text-edge alignment and 3:2 geometry; API panel stability and balances; native pointer/lifecycle behavior; the 13-section contract; tablet workbench geometry at 1024 px; route metadata, anchors, noindex and page interactions. Compact scene corrections were checked at 320 px in all three languages and both themes. Existing clipping, font-size and geometry tolerances are unchanged. The scene helper now reports every failing scene in a case and attaches a screenshot rather than stopping at the first clipping finding.

The review site remains non-indexable. All 57 localized route documents and the 404 document contain `noindex, nofollow`; `robots.txt` disallows crawling. Product destinations remain configured for the actual Apcosys application; the SaaS reference URL is only design provenance and is not a replacement CTA destination.

Publication and exact-commit acceptance evidence are recorded by the [Validate and deploy APCOSYS workflow](https://github.com/IMONsergey/APCOCLEAR2/actions/workflows/deploy.yml). It requires the complete Chromium, Firefox and WebKit release suites before deployment and a Chromium production check afterward. The local checks above and the historical records below do not replace that commit-associated evidence.

## Historical composition checkpoint

The following record is retained from the preceding composition correction. Its publication labels, test counts, navigation order and measurements describe that earlier checkpoint, not the current SaaS-alignment revision.

### Publication status — pre-publication checkpoint

The previous revision, [`88a45c4fa62877ef4f8eaa86ceecd84ce7f8c1a1`](https://github.com/IMONsergey/APCOCLEAR2/commit/88a45c4fa62877ef4f8eaa86ceecd84ce7f8c1a1), was published to `IMONsergey/APCOCLEAR2` and completed the [release workflow, run 40062089841](https://github.com/IMONsergey/APCOCLEAR2/actions/runs/40062089841). The earlier packaging-stage warning that publication had not been confirmed is superseded by that completed run.

The current 24 October correction builds on that published revision. Its local static checks, production build and the focused browser checks listed below have completed. **A new complete three-engine workflow and publication of a new commit are not yet recorded at this checkpoint.** The previous successful run does not establish deployment of these new changes. The original `IMONsergey/apcoseb-clear` repository remains unchanged remotely.

| Checkpoint                                                        | Status                                                                                     |
| ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| Previous revision `88a45c4`                                       | Published; release workflow 40062089841 completed successfully                             |
| Current correction: static checks and production build            | Passed locally                                                                             |
| Current correction: focused Firefox run                           | 93 passed, two Russian 320 px heading findings; both fixed and both targeted reruns passed |
| Current correction: full three-engine acceptance                  | Pending the new workflow                                                                   |
| Current correction: new deployed commit and post-deployment check | Pending publication and verification of the exact new commit                               |

### Current composition and visual corrections

#### Home structure and illustrations

Home restores the original **13 top-level blocks** from the [reference site](https://imonsergey.github.io/apcoseb-clear/). The independent Capabilities section and the “For security researchers and teams” audience section are restored. The audience section again contains **both original illustrations**. Its two audience cards are separate from the use-case section.

The previous reduction to 11 blocks is no longer the intended composition. This correction preserves the original section structure while refining alignment, typography, spacing and responsive behavior. Audience and capability headings use balanced wrapping; this removes the single-character final line found during Traditional Chinese desktop inspection. On narrow screens the original illustrations move above the copy so that Russian words retain their full available width. The restored Search and Host View capability panels retain their complete fragment styling, including full-width query choices and grouped host facts. Unused CSS for the retired image-based closing panel is removed, keeping the Home CSS graph within the existing 29 KiB budget.

#### Five walkthrough scenes and API

All five “One query, step by step” scenes use the same compact **3:2 frame**. Their extra top panels are removed, and their text, controls and data rows use a consistent smaller scale. The first query scene contains the query interface without its former illustration. Phone cards use the full available content rail; compact internal gaps and padding keep all text and both search results visible even with a classic browser scrollbar. The five scene proportions and font-size requirements remain unchanged.

The separate API scene uses a compact **12 px text base** and smaller interface spacing. The scenes retain readable complete content before animation starts and when reduced motion is enabled.

Playback uses the native browser animation implementation introduced in the previous release. **GSAP remains absent from runtime imports and the dependency manifest.** The current visual correction changes scene composition and dimensions; it does not reintroduce GSAP. Existing lifecycle, pause/resume, interruption and motion-load fallback checks remain part of the acceptance suite. See [Application demonstrations](APPLICATION-DEMOS.md).

#### Closing section

The pre-footer screen has a **16:9 frame on wide desktop screens**, corrected headline alignment and more useful vertical space. Mobile uses a dedicated layout with sufficient height for the heading, supporting content and CTA, instead of compressing them into a shallow desktop-shaped strip.

#### Header and mobile menu

The Platform group now contains the following six destinations in the desktop header and mobile menu, with English, Russian and Traditional Chinese labels:

| Platform item          | Route                            |
| ---------------------- | -------------------------------- |
| Search & Investigation | `/platform/search-investigation` |
| Data & Methodology     | `/platform/data-methodology`     |
| Monitoring             | `/platform/monitoring`           |
| About                  | `/about`                         |
| Responsible Scanning   | `/responsible-scanning`          |
| Talk to Us             | `/contact`                       |

Mobile navigation accommodates the expanded group with viewport-aware height, internal scrolling and corrected focus handling. Its fullscreen drawer clears the reserved page scrollbar gutter only while open, preventing a 15 px Chromium offset. The native modal phase reaches `open` after the entrance animation or immediately with reduced motion. Three Platform regression scenarios and six intermediate-phone scene checks bring the acceptance inventory to **708 cases per engine**, or **2,124 across Chromium, Firefox and WebKit**. An inventory count is separate from a completed run.

### Russian client-copy integration

The supplied `правки (1).docx` was reviewed against the current implementation and the authoritative English sources.

#### Marketing and interface copy

The review covers **99 marketing items: 29 screenshot/freeform corrections and 70 table entries** for About and Responsible Scanning. The supplied wording is used with corrections to grammar, terminology and natural Russian phrasing. Placeholder values and split source keys remain consistent. Six legal-page hero summaries are included in the interface-copy review; the legal bodies are reviewed separately below. A further pass over the restored capability tabs corrected 12 literal Russian formulations while preserving the supplied collection wording and aligning the shared search CTA with the page name. Contact distinguishes its form anchor from its direct email link.

All 19 page identities remain available in English, Russian and Traditional Chinese, producing 57 normal localized URLs. The current catalog checks cover 749 required authored messages and 1,317 entries in each translated catalog.

#### Legal bodies

All **365 substantive rows** of the six legal tables, including their headings, were compared with the complete English originals and the Russian translations. The correction makes **77 editorial changes across 81 Markdown lines**. The coverage record distinguishes 95 rows matching the supplied wording, 269 rows incorporated in a refined or already-correct Russian formulation, and one unapplied proposal. These are coverage categories; they are not counts of newly changed clauses.

The single unapplied proposal is **DPA paragraph 788**: the client text refers to a “Subprocessors List” without a destination, while the authoritative English source instructs users to contact `info@apcosys.net`. The existing contact and `mailto` are retained. The real Mozilla URL is retained where the client supplied `[URL]`, and all seven browser/device entries in Cookie Policy remain even though the client table omitted them.

The review preserves the scope of chargeback, private data, data breach, reverse engineering and legal action. It corrects literal or misleading Russian wording, including consequential damages, legal fees and unenforceable provisions, while retaining all parties, conditions and limitations. The original plan identifiers Personal / Free / Business / Enterprise remain unchanged.

The six authoritative English legal Markdown files remain unchanged. The translations retain source hashes, edition dates, numbers, destinations, emphasis, complete lists and section order. Russian headings continue to receive the original English clause anchors. Existing links to the authoritative English edition, locale-specific loading and language-switch preservation of anchors and query parameters remain in place.

### Current validation

#### Static checks and production build

The following results belong to the current 24 October correction:

| Gate                                                                       | Result                                                                                             |
| -------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `npm run check`                                                            | Passed                                                                                             |
| Script fixtures                                                            | 18 passed                                                                                          |
| Runtime graph                                                              | 141 modules, 425 imports; architecture checks passed                                               |
| Localization                                                               | 19 route definitions, 749 required authored UI messages, 1,317 messages in each translated catalog |
| Asset checks                                                               | 87 image/logo assets, ten font/license files and nine protected rendering/data hashes checked      |
| Legal compilation/parity, CSS contracts, formatting, ESLint and TypeScript | Passed as part of `npm run check`                                                                  |
| Production build and route budgets                                         | Passed                                                                                             |
| Home static graph                                                          | Approximately 130.7 KiB gzip JavaScript and 28.8 KiB gzip CSS                                      |

The build retains 57 static route metadata documents and the existing configured-origin behavior. The byte figures above describe the Home static graph, not every asset a user may subsequently load.

#### Focused browser checks

The first focused Firefox run contained **95 cases: 93 passed and two failed**. The failures exposed Russian heading-word layout at **320 px**. Both issues were corrected, and both targeted reruns passed. A subsequent compact-layout run passed all five cases. Independent checks of the restored column rails and responsive containers passed all 18 cases, including the shared page rails from 320 to 2560 px, with no skips, retries or flaky results.

The subsequent [candidate workflow 40071324997](https://github.com/IMONsergey/APCOCLEAR2/actions/runs/40071324997), commit `a5e23ce`, found three regression groups before deployment: compact-scene clipping with Chromium classic scrollbars, the fullscreen drawer gutter offset, and an ambiguous About test locator selecting a hidden Platform link. Its results were Chromium 691 passed / 11 failed, Firefox 694 passed / 2 failed / 6 skipped, and WebKit 694 passed / 2 failed / 6 skipped. Deployment was blocked.

Those causes are corrected in this checkpoint. A production-preview Chromium pass across illustration, compact-layout, localization, responsive navigation, column-rail and responsive-container suites passed **90/90** cases. All five scenes at the additional **390 px** width then passed all **six** language/theme cases. The drawer and focus checks separately passed **10/10** cases across Chromium and Firefox, including normal and reduced motion. The corrected About-link scenarios also passed in Firefox. No glyph-size requirement, clipping tolerance or viewport-coverage requirement was reduced. The new full acceptance workflow still needs to run against the exact committed revision before its result can be added here. The previous suite's six unsupported Layout Instability API measurements in each of Firefox and WebKit remain explicitly identified in the historical record; they do not waive general layout, navigation or accessibility checks.

#### Visual inspection completed at this checkpoint

| View                          | Inspected in the current correction                                                                            |
| ----------------------------- | -------------------------------------------------------------------------------------------------------------- |
| English desktop               | Audience section and both illustrations, all five walkthrough scenes, API scene and Closing section            |
| Russian at 320 px             | All five walkthrough scenes, Audience, API and Closing, including the corrected narrow heading behavior        |
| Mobile at 390 px              | Expanded mobile-menu layout and scrolling; RU About, Responsible Scanning and Contact in dark mode             |
| Russian legal pages           | All six documents at 390 px: page headers and long-body samples; API contents disclosure/anchor; desktop Terms |
| Traditional Chinese desktop   | All five walkthrough scenes, API, Closing and both Audience illustrations; balanced audience headings          |
| Traditional Chinese at 320 px | All five walkthrough scenes, API and Closing; last-card alignment matches the first card                       |

The Traditional Chinese views above were inspected in Chrome with Chinese glyphs rendered on the connected device. Earlier local test screenshots without CJK fonts were not treated as visual typography evidence. This table records the inspected current views without treating historical captures as a new complete visual matrix. Automated all-locale light/dark coverage is retained in the acceptance suite; the complete new three-engine run is pending at this pre-publication checkpoint.

### Historical review evidence

[Quality review](QUALITY-REVIEW.md) and [Release validation](RELEASE-VALIDATION.json) preserve the preceding audit and validation stages. Their source snapshots, counts and byte measurements are historical. The successful publication record for the previous `88a45c4` revision is the workflow linked at the start of this document.

The earlier manual review recorded **228 page/language/theme/viewport variants**, plus 12 localized missing-page variants, and inspected all 87 source image/logo assets. Its motion supplement recorded **720 frames on 108 sheets**, including the application scenes, evidence scenes and corrected pointer targets. Those records help identify regression areas; they do not establish that every view or frame has been reinspected after the current composition changes.

Earlier fixes remain in the implementation and acceptance suite: search validation and accessible error descriptions, pricing alignment and handoff fallback, translated contact drafts, legal text wrapping, route-loading/footer interaction, native playback lifecycle and resource-failure behavior. The prior full-run and follow-up histories remain available in the linked validation JSON instead of being relabeled as results of the current revision.

Browser emulation covers the recorded engines and viewport settings. It does not establish every physical-device or zoom combination, and automated accessibility checks do not establish complete WCAG conformance.

### Release workflow and existing integration boundaries

The main-push workflow validates Chromium and the complete Firefox/WebKit matrix before Pages deployment, then checks the deployed URL in Chromium. Pull requests validate without publication. After the current correction is pushed, its exact commit, workflow result and deployed URL must be recorded together. See [Deployment](DEPLOYMENT.md).

The following existing boundaries are unchanged by this frontend correction. They describe separate product capabilities and owner-maintained information, rather than new approval requirements for the authorized work.

| Area                               | Existing implementation and boundary                                                                                                                                                                                                                                                                  |
| ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Commercial usage categories, B29   | Marketing uses Free / Plus / Expert / Business; legal categories remain Personal / Free / Business / Enterprise. The authoritative mapping remains a product-policy decision. The UI retains its usage clarification and contact path without inventing rights.                                       |
| Product sign-in and checkout       | Sign In and Free entry open the supported `/login` route. Paid-plan dialogs preserve the selected period and provide copyable details while opening the product in a new tab. Automatic plan transfer requires a supported product handoff contract; no unsupported checkout parameters are appended. |
| Contact delivery                   | The website prepares drafts, supports copy and opens `mailto`. It does not report a message as sent. Direct server delivery requires the separately configured mail service/backend.                                                                                                                  |
| API examples and public statistics | The API example uses the documented request shape and synthetic response values; the marketing website does not send the illustrated API request. Statistics retain their dated public source and locale-formatted values.                                                                            |
| Legal and editorial ownership      | English terms remain authoritative, with reference translations and source links. Future amendments and commercial-policy changes remain the responsibility of the document/product owners.                                                                                                           |
| Public domain and indexing         | Canonical/hreflang, sitemap and robots behavior follow the configured origin/base. Review copies remain `noindex`; missing pages always remain `noindex`. The intended public domain and indexing configuration remain hosting-owner settings.                                                        |

See [Product integrations](reference/PRODUCT-INTEGRATIONS.md) for the documented public sources and implementation boundaries, and [QA](QA.md) for reproducible checks.
