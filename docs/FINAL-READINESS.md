# Frontend revision and release readiness — 24 October 2026

## Publication status — pre-publication checkpoint

The previous revision, [`88a45c4fa62877ef4f8eaa86ceecd84ce7f8c1a1`](https://github.com/IMONsergey/APCOCLEAR2/commit/88a45c4fa62877ef4f8eaa86ceecd84ce7f8c1a1), was published to `IMONsergey/APCOCLEAR2` and completed the [release workflow, run 40062089841](https://github.com/IMONsergey/APCOCLEAR2/actions/runs/40062089841). The earlier packaging-stage warning that publication had not been confirmed is superseded by that completed run.

The current 24 October correction builds on that published revision. Its local static checks, production build and the focused browser checks listed below have completed. **A new complete three-engine workflow and publication of a new commit are not yet recorded at this checkpoint.** The previous successful run does not establish deployment of these new changes. The original `IMONsergey/apcoseb-clear` repository remains unchanged remotely.

| Checkpoint                                                        | Status                                                                                     |
| ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| Previous revision `88a45c4`                                       | Published; release workflow 40062089841 completed successfully                             |
| Current correction: static checks and production build            | Passed locally                                                                             |
| Current correction: focused Firefox run                           | 93 passed, two Russian 320 px heading findings; both fixed and both targeted reruns passed |
| Current correction: full three-engine acceptance                  | Pending the new workflow                                                                   |
| Current correction: new deployed commit and post-deployment check | Pending publication and verification of the exact new commit                               |

## Current composition and visual corrections

### Home structure and illustrations

Home restores the original **13 top-level blocks** from the [reference site](https://imonsergey.github.io/apcoseb-clear/). The independent Capabilities section and the “For security researchers and teams” audience section are restored. The audience section again contains **both original illustrations**. Its two audience cards are separate from the use-case section.

The previous reduction to 11 blocks is no longer the intended composition. This correction preserves the original section structure while refining alignment, typography, spacing and responsive behavior. Audience and capability headings use balanced wrapping; this removes the single-character final line found during Traditional Chinese desktop inspection. On narrow screens the original illustrations move above the copy so that Russian words retain their full available width. The restored Search and Host View capability panels retain their complete fragment styling, including full-width query choices and grouped host facts. Unused CSS for the retired image-based closing panel is removed, keeping the Home CSS graph within the existing 29 KiB budget.

### Five walkthrough scenes and API

All five “One query, step by step” scenes use the same compact **3:2 frame**. Their extra top panels are removed, and their text, controls and data rows use a consistent smaller scale. The first query scene contains the query interface without its former illustration. Phone cards use the full available content rail; compact internal gaps and padding keep all text and both search results visible even with a classic browser scrollbar. The five scene proportions and font-size requirements remain unchanged.

The separate API scene uses a compact **12 px text base** and smaller interface spacing. The scenes retain readable complete content before animation starts and when reduced motion is enabled.

Playback uses the native browser animation implementation introduced in the previous release. **GSAP remains absent from runtime imports and the dependency manifest.** The current visual correction changes scene composition and dimensions; it does not reintroduce GSAP. Existing lifecycle, pause/resume, interruption and motion-load fallback checks remain part of the acceptance suite. See [Application demonstrations](APPLICATION-DEMOS.md).

### Closing section

The pre-footer screen has a **16:9 frame on wide desktop screens**, corrected headline alignment and more useful vertical space. Mobile uses a dedicated layout with sufficient height for the heading, supporting content and CTA, instead of compressing them into a shallow desktop-shaped strip.

### Header and mobile menu

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

## Russian client-copy integration

The supplied `правки (1).docx` was reviewed against the current implementation and the authoritative English sources.

### Marketing and interface copy

The review covers **99 marketing items: 29 screenshot/freeform corrections and 70 table entries** for About and Responsible Scanning. The supplied wording is used with corrections to grammar, terminology and natural Russian phrasing. Placeholder values and split source keys remain consistent. Six legal-page hero summaries are included in the interface-copy review; the legal bodies are reviewed separately below. A further pass over the restored capability tabs corrected 12 literal Russian formulations while preserving the supplied collection wording and aligning the shared search CTA with the page name. Contact distinguishes its form anchor from its direct email link.

All 19 page identities remain available in English, Russian and Traditional Chinese, producing 57 normal localized URLs. The current catalog checks cover 749 required authored messages and 1,317 entries in each translated catalog.

### Legal bodies

All **365 substantive rows** of the six legal tables, including their headings, were compared with the complete English originals and the Russian translations. The correction makes **77 editorial changes across 81 Markdown lines**. The coverage record distinguishes 95 rows matching the supplied wording, 269 rows incorporated in a refined or already-correct Russian formulation, and one unapplied proposal. These are coverage categories; they are not counts of newly changed clauses.

The single unapplied proposal is **DPA paragraph 788**: the client text refers to a “Subprocessors List” without a destination, while the authoritative English source instructs users to contact `info@apcosys.net`. The existing contact and `mailto` are retained. The real Mozilla URL is retained where the client supplied `[URL]`, and all seven browser/device entries in Cookie Policy remain even though the client table omitted them.

The review preserves the scope of chargeback, private data, data breach, reverse engineering and legal action. It corrects literal or misleading Russian wording, including consequential damages, legal fees and unenforceable provisions, while retaining all parties, conditions and limitations. The original plan identifiers Personal / Free / Business / Enterprise remain unchanged.

The six authoritative English legal Markdown files remain unchanged. The translations retain source hashes, edition dates, numbers, destinations, emphasis, complete lists and section order. Russian headings continue to receive the original English clause anchors. Existing links to the authoritative English edition, locale-specific loading and language-switch preservation of anchors and query parameters remain in place.

## Current validation

### Static checks and production build

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

### Focused browser checks

The first focused Firefox run contained **95 cases: 93 passed and two failed**. The failures exposed Russian heading-word layout at **320 px**. Both issues were corrected, and both targeted reruns passed. A subsequent compact-layout run passed all five cases. Independent checks of the restored column rails and responsive containers passed all 18 cases, including the shared page rails from 320 to 2560 px, with no skips, retries or flaky results.

The subsequent [candidate workflow 40071324997](https://github.com/IMONsergey/APCOCLEAR2/actions/runs/40071324997), commit `a5e23ce`, found three regression groups before deployment: compact-scene clipping with Chromium classic scrollbars, the fullscreen drawer gutter offset, and an ambiguous About test locator selecting a hidden Platform link. Its results were Chromium 691 passed / 11 failed, Firefox 694 passed / 2 failed / 6 skipped, and WebKit 694 passed / 2 failed / 6 skipped. Deployment was blocked.

Those causes are corrected in this checkpoint. A production-preview Chromium pass across illustration, compact-layout, localization, responsive navigation, column-rail and responsive-container suites passed **90/90** cases. All five scenes at the additional **390 px** width then passed all **six** language/theme cases. The drawer and focus checks separately passed **10/10** cases across Chromium and Firefox, including normal and reduced motion. The corrected About-link scenarios also passed in Firefox. No glyph-size requirement, clipping tolerance or viewport-coverage requirement was reduced. The new full acceptance workflow still needs to run against the exact committed revision before its result can be added here. The previous suite's six unsupported Layout Instability API measurements in each of Firefox and WebKit remain explicitly identified in the historical record; they do not waive general layout, navigation or accessibility checks.

### Visual inspection completed at this checkpoint

| View                          | Inspected in the current correction                                                                            |
| ----------------------------- | -------------------------------------------------------------------------------------------------------------- |
| English desktop               | Audience section and both illustrations, all five walkthrough scenes, API scene and Closing section            |
| Russian at 320 px             | All five walkthrough scenes, Audience, API and Closing, including the corrected narrow heading behavior        |
| Mobile at 390 px              | Expanded mobile-menu layout and scrolling; RU About, Responsible Scanning and Contact in dark mode             |
| Russian legal pages           | All six documents at 390 px: page headers and long-body samples; API contents disclosure/anchor; desktop Terms |
| Traditional Chinese desktop   | All five walkthrough scenes, API, Closing and both Audience illustrations; balanced audience headings          |
| Traditional Chinese at 320 px | All five walkthrough scenes, API and Closing; last-card alignment matches the first card                       |

The Traditional Chinese views above were inspected in Chrome with Chinese glyphs rendered on the connected device. Earlier local test screenshots without CJK fonts were not treated as visual typography evidence. This table records the inspected current views without treating historical captures as a new complete visual matrix. Automated all-locale light/dark coverage is retained in the acceptance suite; the complete new three-engine run is pending at this pre-publication checkpoint.

## Historical review evidence

[Quality review](QUALITY-REVIEW.md) and [Release validation](RELEASE-VALIDATION.json) preserve the preceding audit and validation stages. Their source snapshots, counts and byte measurements are historical. The successful publication record for the previous `88a45c4` revision is the workflow linked at the start of this document.

The earlier manual review recorded **228 page/language/theme/viewport variants**, plus 12 localized missing-page variants, and inspected all 87 source image/logo assets. Its motion supplement recorded **720 frames on 108 sheets**, including the application scenes, evidence scenes and corrected pointer targets. Those records help identify regression areas; they do not establish that every view or frame has been reinspected after the current composition changes.

Earlier fixes remain in the implementation and acceptance suite: search validation and accessible error descriptions, pricing alignment and handoff fallback, translated contact drafts, legal text wrapping, route-loading/footer interaction, native playback lifecycle and resource-failure behavior. The prior full-run and follow-up histories remain available in the linked validation JSON instead of being relabeled as results of the current revision.

Browser emulation covers the recorded engines and viewport settings. It does not establish every physical-device or zoom combination, and automated accessibility checks do not establish complete WCAG conformance.

## Release workflow and existing integration boundaries

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
