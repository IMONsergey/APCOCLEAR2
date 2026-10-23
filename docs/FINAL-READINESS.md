# Final visual and release review

## Scope and publication status

This release extends `IMONsergey/APCOCLEAR2` from `6deda43835e054a3d741de2dbae2df6bf00d3aeb`. It includes the full multilingual visual review and the corrections described below. The source of the original `apcoseb-clear` repository is unchanged remotely.

**Publication was not confirmed at the packaging checkpoint.** Earlier GitHub write requests for this final release were interrupted before creating a tree or branch; the last checked remote main remained at the baseline above. Local validation, a prepared release workflow and a source package are not evidence that GitHub Actions or Pages deployed this revision. Confirm the exact checked source and full workflow before claiming the public URL is updated; the delivered release report records the subsequent publication result.

## What changed

### Composition and responsive layout

- Home is reduced from 13 top-level sections to 11. The duplicated five-tab capability explanation is removed; its distinct research-collection content remains below the five-step walkthrough. Two audience cards are integrated into the use-case section.
- Walkthrough titles and scenes share stable grid rows. The API fields/actions share rows, narrow result counters remain readable, TLS labels wrap without squeezing values and illustrative icons retain their intended dimensions.
- Empty-search validation is in normal flow, separate from the input and examples. The compact free-search hint yields space to the error and `aria-describedby` follows the visible message.
- Pricing cards reserve enough description height to align prices and actions. Plan handoff actions have a full spacing token after their explanation; fallback summaries remain inside the mobile modal.
- Responsible Scanning labels use intrinsic desktop columns and a sequential mobile layout. API plan-limit headings wrap at intermediate widths. The three use-case fragments no longer add nested horizontal padding twice.
- Russian legal title/navigation wrapping, the English 320 px legal description rail, Russian legal subheadings and Traditional Chinese paragraph wrapping are corrected. Translation notices remain legible when printing from the dark theme.
- Prepared email text has a 24 px gap before the draft explanation. Contact never reports a sent message when it has only prepared or copied one.
- The footer waits for the initial route's content or its recoverable error UI, so a delayed page download cannot move a cookie-preferences action between pointer events.

### Complete language coverage

All 19 page identities are available in English, Russian and Traditional Chinese: 57 normal URLs plus three localized missing-page states. About and Responsible Scanning now have complete translations, including dynamic contact text and email drafts.

The six English legal Markdown files and their compiled English output are unchanged. Twelve complete reference translations retain editions, section structure, numbers, emphasis and URL destinations. A clear notice links to the authoritative English original. Locale-specific loading avoids an English body appearing first; stable clause anchors and query parameters survive language changes. Dates are formatted for the selected language.

An independent full read of all 18 legal documents verified age boundaries and commercial conditions. The final Traditional Chinese review also corrected the meanings of chargeback, data breach, promptly and ensures compliance without changing the English terms. Structural parity is a build gate; it does not replace legal-owner approval.

### Product content and interactions

- Home and Methodology show a dated snapshot from the public statistics endpoint, with locale-formatted numbers, update date and source link. Products/CVEs use neutral labels instead of inventing counting semantics.
- The developer-page cURL example uses the published HTTP API base, POST host-search endpoint and X-API-Key header. Response values remain explicitly synthetic and the website sends no API request.
- Sign In and Free entry use the published `/login` route. Paid-plan dialogs preserve the selected period and provide copyable details while opening the separate product in a new tab. Clipboard denial exposes a focused, selectable fallback. No unsupported checkout parameters are appended.
- Monthly plan summaries no longer repeat their billing description. Contact topic labels and prepared messages cover all six topics in each locale; changing a topic or clearing the form invalidates pending clipboard results before they can restore stale text, status or focus.
- Internal “client preview” language is removed from public-facing package, team, cookie and comparison explanations. Remaining account checks explain a real decision: conversion of credits, package terms or permitted data usage.

See [Product integrations](reference/PRODUCT-INTEGRATIONS.md) for the public sources and precise boundaries.

### Animation status

The five legacy Home scenes and the API scene have been replaced with application-based React/HTML compositions and fourteen exact SVG assets. **GSAP is fully removed from the runtime imports and dependency manifest.** Both remaining playback modules now use native browser animation with an active-time clock. The complete frames remain readable without animation, with reduced motion or after a failed motion-chunk download. Cleanup, visibility pause/resume, independent pointer/focus pauses and interruption are covered by browser checks. A live change to reduced motion restores complete text even during query typing.

The visual motion review also corrected four cursor targets: the selected Netherlands facet, HTTPS service, host address and applied condition. Group outlines remain intact while the pointer follows the actual selected child. Coordinate regressions cover both mobile and desktop layouts.

The combined deferred playback graph decreased from 74,159 raw / 29,125 gzip bytes to 7,405 raw / 3,500 gzip bytes, measured with the same compressor. The saving is 25,625 gzip bytes, approximately 88%. These are lazy animation chunks, not the entry bundle or first-screen transfer size.

## Validation

The temporary workspace was reset during an interrupted publishing request. The current source was recovered, missing UI/translation changes were reconstructed, and fresh source/build/browser/visual checks were run. Earlier lost screenshots or stale build results are not treated as current release proof.

### Static and build gates

- `npm run check` passes: legal-source and translation parity, 87 image/logo files, ten font/license files, nine protected rendering/data hashes, CSS contracts, architecture, localization, formatting, ESLint and TypeScript.
- All 18 script fixtures pass. The runtime graph has 141 modules and 427 imports with no boundary violations or runtime cycles.
- All 19 localized route definitions, 735 required authored UI messages and 1,316 entries in each translated catalog pass the coverage and placeholder checks. Dynamic contact-topic values are explicitly covered so a missing translation cannot silently appear in selects or prepared messages.
- The production build generates 57 static route metadata documents. Entry assets remain within 335 KiB JavaScript and 32 KiB CSS limits; every route-group budget passes. The Home static graph is approximately 129.3 KiB gzip JavaScript and 27.6 KiB gzip CSS.
- The production dependency advisory audit reports zero known vulnerabilities on 23 October 2026. This is a registry result, not a proof that no vulnerability exists.

### Browser and visual results

The current suite contains 699 cases per browser, or 2,097 across Chromium, Firefox and WebKit. Six CLS measurements per Firefox/WebKit are unsupported because those engines do not expose the Layout Instability API; these skips are explicit and do not apply to general layout, accessibility or interaction cases.

The exact run history is preserved in [Release validation](RELEASE-VALIDATION.json):

| Run                                    | Passed | Failed | Explicit skips | Scope                                                                   |
| -------------------------------------- | -----: | -----: | -------------: | ----------------------------------------------------------------------- |
| Initial full three-engine run          |   2027 |     10 |             12 | 2049-case inventory before final corrections                            |
| Fresh affected follow-up               |    401 |      1 |             12 | Legal, contact, footer/loading, navigation, runtime, pricing and motion |
| Final native motion/lifecycle/fallback |     54 |      0 |              0 | Final source, all three engines, one worker, zero retries               |
| Relocation and configuration           |    216 |      0 |              0 | 72 cases in each of three independent configurations                    |

The initial failures comprise six stale-build comparisons after two Traditional Chinese legal corrections, one genuine footer click race, one observation-window assumption and two WebKit frame-sampling failures. All have passing follow-up observations. The affected run's single remaining failure was the same observation-window assumption: a 2.1-second sample could fit inside the intentional 2.6-second reading phase. Moving samples now span 3.1 seconds; every visibility, distance and phase assertion remains, and resting samples remain 2.1 seconds. The two API progress thresholds were unchanged and passed in both fresh follow-ups.

This record does not describe a single clean execution of all 2097 final cases. The complete run and scoped follow-ups together cover routes, static metadata, direct refresh, navigation/history/focus, localization, accessibility, menus/dialogs, forms, pricing, API examples, synthetic scenes, animation lifecycle and resource failures. No assertion threshold was reduced to clear a product defect.

The full-page visual matrix covers 19 pages × three languages × two themes × mobile/desktop = 228 variants, plus 12 localized 404 variants. Continuous review includes the middle and end of long legal pages. The restored review additionally includes 132 carousel/search/contact observations, fresh plan-handoff states and all 87 source image/logo assets. Individual findings and replacements are tracked with source/capture hashes in the review evidence; a captured image is counted as inspected only after it has been read.

The final motion supplement manually inspects 720 frames on 108 sheets: 432 frames for all six application scenes, 240 for Home/Investigation evidence and 48 for the four corrected pointer targets. It covers all three languages, both themes and 390/1440 px. All 96 live reduced-motion/resume observations and 72 interaction pauses passed; the captures reported zero JavaScript errors. All 828 motion image hashes match. No confirmed visual finding remains open within the recorded matrix.

Responsive checks extend to 320 px and intermediate tablet widths; both light and dark themes, loaded fonts, decoded assets and reduced-motion behavior are included. Browser emulation does not establish approval on every physical device, every zoom factor or every possible animation frame. Automated accessibility checks do not establish complete WCAG conformance.

## Release behavior and remaining external decisions

The prepared main-push workflow validates Chromium and a full Firefox/WebKit matrix before Pages deployment. It then checks the actual deployed URL in Chromium. Pull requests validate without publication. Static canonical/hreflang, sitemap and robots handling follow the configured marketing origin; review copies default to noindex and missing pages always remain noindex. See [Deployment](DEPLOYMENT.md).

| Area                          | Remaining action                                                                                                                                                                 |
| ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Final publication             | Complete a successful write to APCOCLEAR2, run the new workflow and verify the actual deployed commit. At packaging, the prior interrupted writes had not published this source. |
| Commercial rights, B29        | Approve the mapping between marketing plan names and legal usage categories. The UI asks users to confirm permitted commercial use rather than inventing rights.                 |
| Automatic product checkout    | Supply a supported handoff contract if automatic plan transfer is required. The current copy/new-tab flow is functional without such a contract.                                 |
| Server-side contact delivery  | Supply a mail service/backend if direct website delivery is required. Current draft/copy/mailto behavior is intentional and explicit.                                            |
| Legal and editorial ownership | Approve reference translations and any future amendments. Original English terms are preserved.                                                                                  |
| Final public domain           | Set the production origin/base and enable indexing on the intended public site. The review copy remains noindex.                                                                 |

The release has a concrete, reviewable implementation for each implemented frontend flow. Completion of those flows must be distinguished from approvals or capabilities of the separate authenticated product and hosting account.
