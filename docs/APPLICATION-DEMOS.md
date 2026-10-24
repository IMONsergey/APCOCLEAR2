# Application demonstrations — 24 October 2026

The five Home research scenes and the API illustration now follow the current Apcosys SaaS interface. They are compact, translated React/HTML excerpts with native playback. The five research frames retain their existing 3:2 size; their left edge now aligns with the card text. The homepage retains all 13 sections in the approved order, including both Audience illustrations.

This document describes the implementation in source. [Final readiness](FINAL-READINESS.md) records the current verification scope and links to the commit-associated release workflow. The historical results below are not evidence for this revision.

## Current design source

- Live interface: [Apcosys SaaS](https://assaasdev.vercel.app/).
- Reference repository: [IMONsergey/Assaasdev](https://github.com/IMONsergey/Assaasdev), checked out at [`85f41b7569ccb172b4eceabd345e9c79cfde470e`](https://github.com/IMONsergey/Assaasdev/commit/85f41b7569ccb172b4eceabd345e9c79cfde470e), dated 24 October 2026, “Refine native navigation, avatars and guided workflows”.
- Example records and account values: [`src/demo/fixtures.ts` at that revision](https://github.com/IMONsergey/Assaasdev/blob/85f41b7569ccb172b4eceabd345e9c79cfde470e/src/demo/fixtures.ts).

The earlier Figma frames remain historical provenance. They no longer define the current scene composition or example values. `ApplicationFrame` identifies the current source with `data-design-source="apcosys-application"` and `data-design-url="https://assaasdev.vercel.app"`; the retained `data-design-node` values refer to the earlier Figma source.

## Current six excerpts

| Scene             | Implemented content and progression                                                                                                                                                                                                                                                                                           |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Query             | Centered search heading; `nginx` query; Filters, All types and Saved queries where space permits; text/domain/IP/technology hints; adjoining search label and arrow. No illustration or application shell header.                                                                                                             |
| Results           | Results/Analytics tabs, a four-host result count and a compact table excerpt. Playback opens the left country-filter panel, selects Germany, then shows one matching result.                                                                                                                                                  |
| Host              | `192.0.2.10`, `node-1.example.com`, Germany and AS64496 / Example Research Network. Services shows the fixture total of 100 with a three-service excerpt: 443 HTTPS, 80 HTTP and 22 SSH. The selected HTTPS response and nginx 1.0 remain connected to that host.                                                             |
| Technical context | The same host and HTTPS/443 context, TLS 1.3, certificate subject and issuer, validity dates and DNS name. There is no invented fingerprint.                                                                                                                                                                                  |
| Next step         | Search for `node-1.example.com`, show the applied Domain condition and retain the same host as the matching result.                                                                                                                                                                                                           |
| API               | API access with API key and Usage & limits tabs. Playback emphasizes the masked account key, shows the copied state and switches to the account-usage panel. The key view has Reveal, Copy and Rotate controls; the usage view shows credit balances and account limits. No base-URL field or documentation card is included. |

The results excerpt shows two of the four matching fixture records before filtering: `192.0.2.10` in Germany and `192.0.2.144` in the Netherlands. The record count describes the result set; the compact illustration does not attempt to display every row.

The TLS example uses the source fixture's `Example Certificate Authority`, subject/DNS name `node-1.example.com`, and validity from **1 October 2026 to 1 January 2027**. Dates are formatted in the selected locale with UTC. The earlier generated SHA-256 value and its tooltip metadata have been removed.

| API account field                   | Fixture value         |
| ----------------------------------- | --------------------- |
| Plan                                | Business              |
| Query credits remaining / allowance | 1,240,500 / 1,500,000 |
| Scan credits remaining / allowance  | 327,680 / 327,680     |
| Search pages per query              | 300                   |
| API access                          | Enabled               |

Credit meters derive their fill from the displayed remaining/allowance values. The sixteen dots in the key field are a visual mask, not an exposed credential or an assertion about real key length. These are the separate application's demonstration fixtures, not live scan results or a production account.

## Layout, typography and assets

The shared `ApplicationFrame` contains the scene and decorative cursor without a logo strip, navigation shell or shared screen header. Controls within the search box belong to the excerpt itself. The first query scene has no artwork.

- All five research excerpts keep the **3:2** aspect ratio and existing frame width. `--step-copy-inset` coordinates the text and illustration left edges at each carousel breakpoint. The illustration moves right without shrinking; only the outer card intentionally clips its trailing right edge. That crop must not be treated as a document overflow defect or used to excuse accidental clipping inside the scene.
- The carousel retains one card through 767px, two from 768px and three from 1200px. Shared rows keep the card text and media aligned.
- Research body text has a **10px minimum**. Compact breakpoints omit secondary details instead of scaling the whole interface below that size. The query heading is 18px normally, 16px at application widths up to 359px and 20px from 400px.
- API body text is 12px; secondary labels and actions are 10px, card headings 14px and the API heading 20px. Above 479px of application-container width, the key and account balances sit in two columns. At 479px and below they stack. Both API panels occupy the same grid area, reserving the taller panel's content height; playback hides the inactive panel with `visibility` so the tab change does not resize the outer frame.
- Both light and dark scene palettes use the website's existing tokens. The cyan API section keeps its established outer composition.

`ApplicationGlyph.tsx` supplies lightweight inline SVG line icons. Country flags, the nginx mark and the certificate icon continue to use registered local exports from `public/assets/application/` through `assetUrl`. Earlier exported artwork, toolbar and API icons remain available as source assets, but their old rendered-size table is not a specification for this implementation. No remote Figma image URLs are shipped.

## Native playback and data boundaries

`ApplicationFrame`, `ApplicationProductScene` and `ApplicationApiScene` render their HTML before motion loads. `StepDemoMount` and `ApiDemoMount` load `applicationPlayback.ts` near the viewport. GSAP is still absent from runtime imports and the dependency manifest.

The native clock retains its eight-second cycle: four 1.8-second phases followed by a 0.8-second reading pause. It drives the decorative cursor, target emphasis, query typing, country-filter panel/result state, copied state and the API key/usage switch. `data-demo-phase` identifies the phase; `data-demo-playback` reports `static`, `playing` or `paused`. API view state is exposed through `data-api-view`.

Viewport visibility pauses offscreen playback; document visibility pauses hidden tabs. A changed reduced-motion preference resets the clock, restores the complete captured query and initial state, hides the cursor and removes the filter/copy/API-view state. Resume does not accumulate paused time. Resize measurements are scheduled through `requestAnimationFrame`. Cleanup removes observers/listeners, cancels pending work and restores styles owned by playback. The API panel transition also respects reduced motion.

If a motion chunk fails, the complete initial React frame remains available. The illustration subtree is inert and hidden from assistive technology; its enclosing image role supplies a translated description. EN, RU and Traditional Chinese text, dates and balances follow the selected locale. The illustrated search, key and tab controls do not submit requests, reveal or rotate a key, copy real account data or change product state. Real navigation stays outside the inert scene.

The developer page is separate from these illustrations and retains the documented POST host-search example and X-API-Key authentication. See [Product integrations](reference/PRODUCT-INTEGRATIONS.md).

## Historical Figma provenance

The previous replacement used [Apcosys, page «01 · Приложение»](https://www.figma.com/design/lLMSuy0RrCiPhg873xpVUY/Apcosys?node-id=899-3620), previously named «Приложение — доработка». Design context, visible child nodes and screenshots were read; the source Figma file was not edited.

| Earlier scene | Historical Figma frame                                                                                              |
| ------------- | ------------------------------------------------------------------------------------------------------------------- |
| Query         | [899:4021 — Поиск, начало](https://www.figma.com/design/lLMSuy0RrCiPhg873xpVUY/Apcosys?node-id=899-4021)            |
| Results       | [899:4117 — Поиск, результаты](https://www.figma.com/design/lLMSuy0RrCiPhg873xpVUY/Apcosys?node-id=899-4117)        |
| Host          | [899:5079 — Объект, адрес и сервисы](https://www.figma.com/design/lLMSuy0RrCiPhg873xpVUY/Apcosys?node-id=899-5079)  |
| Evidence      | [903:48414 — Сертификат TLS](https://www.figma.com/design/lLMSuy0RrCiPhg873xpVUY/Apcosys?node-id=903-48414)         |
| Refined query | [903:48044 — Поиск, применён domain](https://www.figma.com/design/lLMSuy0RrCiPhg873xpVUY/Apcosys?node-id=903-48044) |
| API           | [903:53837 — API, доступ](https://www.figma.com/design/lLMSuy0RrCiPhg873xpVUY/Apcosys?node-id=903-53837)            |

Result row `899:4220` and filter fragment `959:74371` supplied additional context. That implementation used the earlier `example` query, 148-result presentation, `example.com` host context, generated certificate fingerprint, a base-URL API field and documentation card. Those details describe the superseded excerpts. The local SVG export collection and its original paths/viewBox values are retained; its fourteen-file provenance was recorded with that replacement.

The first 24 October composition correction then introduced the shared 3:2 research frames, removed the shell toolbar and query artwork, and reduced the compact text size. The current SaaS-based revision keeps those structural decisions while replacing the inner content and aligning the illustration with the card text.

## Historical acceptance record — earlier replacement stage

The following results belong to the earlier scene replacement and subsequent lifecycle fixes, before the 24 October composition correction. The replacement followed initial frontend audit commit `4355610ef225780d44d64a2e0d2221bf9791f904`, which repaired the old custom-element scenes without completing their replacement. Historical dimensions, minimum font sizes, sample counts and bundle measurements below describe those earlier source snapshots. They are not current revision results. See [Final readiness](FINAL-READINESS.md) for the checks and publication status of the 24 October source.

The replacement was checked at 320, 390, 768, 1024, 1440 and 1856 px in all three locales and both themes: 216 scene samples. That stage's final matrix had no visible glyph clipping, broken images, page exceptions or document horizontal overflow. Seventy-two frame captures covered all six scenes at 320/1440 px; manual review covered composition, hierarchy, word wrapping, legibility and theme consistency in every capture. Minimum visible scene body text at that stage was 12 px.

The regression suites at that stage covered translated scene structure, image and mask decoding, API icon dimensions, synthetic TLS details through all four phases, viewport/document visibility pause and resume, reduced-motion changes, the inert boundary and absence of requests to the illustrated API host. Their clipping assertions included clipping ancestors outside the frame. The initial Russian toolbar clipping, oversized API icons, mask overflow and broken copy-label wrapping were fixed in source without relaxing those checks.

The complete `npm run check` passed: 17 verification fixtures, 645 required authored UI messages, 1,198 messages in each RU/Traditional Chinese catalog, 87 image/logo files, ten font/license files, nine preserved rendering/data engine checksums, 136 runtime modules and 415 runtime imports. ESLint, TypeScript, formatting, asset safety and source-boundary checks passed. The motion-chunk failure test also passed in Chromium, Firefox and WebKit, confirming that all six complete frames remained visible when their animation imports were blocked. The Home static graph at that checkpoint was 129.6/132 KiB gzip JavaScript and 28.5/29 KiB gzip CSS. These checks do not establish the authenticated application's API contract or physical-device approval.

### WebKit resize correction

The first combined three-engine run passed 186 of 189 cases. Two WebKit TLS/startup cases consistently exposed a pre-existing `MorphPanel` resize-delivery loop: a fractional content-height change started a Web Animations height transition directly from a `ResizeObserver` callback. A controlled probe reproduced the error in EN/RU and removed it by deferring only that callback to the next animation frame. The source now coalesces observer measurements through `requestAnimationFrame` and cancels the pending callback on cleanup; synchronous React-update measurements remain intact. Browser errors are still treated as failures.

The third initial failure concerned an unchanged API expansion frame-sampling assertion under two-worker contention; it passed in the isolated run with the original assertion. No timing or clipping threshold was relaxed. Final production reruns and the commit-associated CI run provide the release evidence.

After the resize correction, the unchanged WebKit suite passed all 63 cases. The six affected Chromium cases and six affected Firefox cases also passed, for 75/75 in the targeted final run, with no failures, skipped tests or retries. The earlier complete Chromium and Firefox runs each passed 63/63; only the affected cases were repeated after the shared observer fix. The separate motion-chunk failure test passed once in each of the three engines.

After the final date and fingerprint wrapping adjustment, all 45 scene/TLS cases passed across the three engines, as did the Chromium legal-page loading contract. The home-page contract initially differed only in typographic nonbreaking spaces in its accessible description; its matcher was changed to accept whitespace without changing the expected words. That single case passed on its targeted rerun. The final gate at that stage therefore had passing observations for all 47 distinct cases (17 Chromium, 15 Firefox and 15 WebKit), recorded as a 46/47 run plus the corrected 1/1 rerun.

### Repository-wide brand consistency

The first complete repository CI run for the replacement passed 567 of 568 cases. Its remaining failure correctly caught uppercase `APCOSYS` in the new API heading, contrary to the website's existing prose-brand contract. The heading and both translated messages now use `Apcosys`; scene-specific text expectations were updated to the same wording. The original site-wide brand assertion, logo-path checks and uppercase-footer assertions remain unchanged.

The corrected production build passed all 15 targeted Chromium cases: the unchanged brand contract across every site route, twelve API combinations covering three locales, both themes and 320/1440 px, reduced motion, and viewport pause/resume. There were no failures, skipped tests or retries.
