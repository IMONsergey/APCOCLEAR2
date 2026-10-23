# Application demonstrations — 23 October 2026

The five Home research scenes and the API illustration now use the approved application design. This is a replacement of the former GSAP custom-element scenes, following the initial frontend audit commit `4355610ef225780d44d64a2e0d2221bf9791f904`. That initial revision repaired the old scenes but did not complete this replacement. GSAP 3.13.0 remains the animation engine; its notice is retained.

## Design source and scope

Source: [Apcosys, page «01 · Приложение»](https://www.figma.com/design/lLMSuy0RrCiPhg873xpVUY/Apcosys?node-id=899-3620), previously named «Приложение — доработка». Design context, visible child nodes and screenshots were read from the file. The source design was not edited.

| Website scene | Approved frame                                                                                                      | Implemented excerpt                                                                          |
| ------------- | ------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| Query         | [899:4021 — Поиск, начало](https://www.figma.com/design/lLMSuy0RrCiPhg873xpVUY/Apcosys?node-id=899-4021)            | Aperture artwork, query field, filter/type controls and query-type hints                     |
| Results       | [899:4117 — Поиск, результаты](https://www.figma.com/design/lLMSuy0RrCiPhg873xpVUY/Apcosys?node-id=899-4117)        | Query, country facets, result count and host records with ports/product                      |
| Host          | [899:5079 — Объект, адрес и сервисы](https://www.figma.com/design/lLMSuy0RrCiPhg873xpVUY/Apcosys?node-id=899-5079)  | Address, network, service tabs, HTTPS response and detected product                          |
| Evidence      | [903:48414 — Сертификат TLS](https://www.figma.com/design/lLMSuy0RrCiPhg873xpVUY/Apcosys?node-id=903-48414)         | Selected HTTPS service, certificate identity, issuer, validity and SHA-256 fingerprint       |
| Refined query | [903:48044 — Поиск, применён domain](https://www.figma.com/design/lLMSuy0RrCiPhg873xpVUY/Apcosys?node-id=903-48044) | Applied domain condition, condition chip and matching result                                 |
| API           | [903:53837 — API, доступ](https://www.figma.com/design/lLMSuy0RrCiPhg873xpVUY/Apcosys?node-id=903-53837)            | Existing masked key, copy state, base URL, query/scan credit balances and documentation card |

The result row `899:4220` and filter fragment `959:74371` supplied detailed context where the parent frame was sparse. These are responsive excerpts for marketing cards, not a scaled copy of the entire authenticated application. They retain the approved screen structure and actual artwork, with the website's existing type roles, theme tokens and translated text. Narrow frames grow vertically; the toolbar wraps when a translation requires more room.

## Exact vector assets

All fourteen files are local SVG exports in `public/assets/application/`, registered in `src/content/asset-manifest.ts` and resolved through `assetUrl`. No temporary Figma asset URL is shipped. The export's paths, viewBox and aspect ratio are preserved. Toolbar masks use the exported silhouette and the active text color.

| File                | Figma node                       | Export canvas          | Rendered role                                   |
| ------------------- | -------------------------------- | ---------------------- | ----------------------------------------------- |
| `aperture.svg`      | `1279:24142`                     | 360 × 341.581          | Query artwork, 100 px wide with intrinsic ratio |
| `run-search.svg`    | `I902:3871;902:3814`             | 50 × 50                | Query action, 36 × 36                           |
| `netherlands.svg`   | `958:70915`                      | 24 × 16                | Country marker and facet, 18 × 12               |
| `germany.svg`       | `958:70920`                      | 24 × 16                | Country facet, 18 × 12                          |
| `united-states.svg` | `962:72020`                      | 24 × 16                | Country facet, 18 × 12                          |
| `filter-plus.svg`   | `I914:7459;914:7433;902:3806`    | 8 × 8                  | Theme-aware toolbar mask, 8 × 8                 |
| `type-chevron.svg`  | `I914:7459;914:7434;902:3810`    | 7 × 5 including stroke | Theme-aware toolbar mask, 7 × 5                 |
| `nginx.svg`         | `962:72017`                      | 20 × 20                | Product marker, 16 × 16                         |
| `certificate.svg`   | `959:70264`                      | 18 × 18                | Certificate heading, 18 × 18                    |
| `link.svg`          | `959:70285`                      | 18 × 18                | Connection/validity heading, 18 × 18            |
| `copy-white.svg`    | `I903:53856;984:12522;984:82546` | 20 × 20                | Primary API copy action, 20 × 20                |
| `copy-accent.svg`   | `I903:53864;984:12657;984:82553` | 20 × 20                | Base URL action, 20 × 20                        |
| `code.svg`          | `903:53876`                      | 36 × 36                | Documentation card, 36 × 36                     |
| `external.svg`      | `I903:53881;984:12657;984:82559` | 20 × 20                | Documentation action, 20 × 20                   |

The existing `Logo` component supplies the original brand vector. No replacement wordmark is typeset. The API icon dimensions are asserted in browser tests because a broad image rule previously enlarged them despite successful image decoding.

The API heading follows the website's prose spelling, `Apcosys`, in all three locales. The original vector logo and intentional uppercase footer labels retain their established forms.

## Runtime contract

`ApplicationFrame`, `ApplicationProductScene` and `ApplicationApiScene` render the complete translated frame eagerly. `StepDemoMount` and `ApiDemoMount` load `applicationPlayback.ts` near the viewport. GSAP controls a decorative cursor, target emphasis, query typing, the country-filter result count and the illustrative copied state. It does not own navigation, page text, real credentials or API communication.

The four phases are exposed by `data-demo-phase`. `data-demo-playback` reports `static`, `playing` or `paused`. An intersection observer pauses offscreen motion, document visibility pauses hidden tabs, and a media-query listener applies a changed reduced-motion preference immediately. Cleanup removes observers/listeners, cancels a pending resize frame and reverts the GSAP context. Tests assert visible motion and frozen transforms rather than reaching into private timeline fields.

Reduced motion leaves the complete initial frame readable. If the animation chunk fails, the React frame stays visible. Text, dates, balances, percentages and descriptions use the current EN/RU/Traditional Chinese locale. All six frames support the website's light and dark modes. The illustration subtree is inert and hidden from assistive technology; the enclosing image role has a translated description. Real page links and actions remain outside it.

## Data boundaries

Host examples use `192.0.2.10`, `192.0.2.11`, AS64496 and `example.com`. TLS evidence stays attached to HTTPS/443 throughout playback and includes a complete 32-byte SHA-256 fingerprint. Fingerprints wrap between complete hexadecimal bytes, and each localized date remains a single unit when its validity range wraps. The API key is an eight-dot visual mask; it conveys neither a real credential nor an actual key length. Balances and `https://api.apcosys.net/v1` reproduce illustrative Figma content. No request is sent to that address and the illustrated copy/regenerate controls perform no real action. The actual developer-page template continues to use explicit integration placeholders.

## Acceptance record

The replacement was checked at 320, 390, 768, 1024, 1440 and 1856 px in all three locales and both themes: 216 scene samples. The final matrix had no visible glyph clipping, broken images, page exceptions or document horizontal overflow. Seventy-two frame captures cover all six scenes at 320/1440 px; manual review covers composition, hierarchy, word wrapping, legibility and theme consistency in every capture. Minimum visible scene body text is 12 px.

The regression suites cover translated scene structure, image and mask decoding, API icon dimensions, synthetic TLS details through all four phases, viewport/document visibility pause and resume, reduced-motion changes, the inert boundary and absence of requests to the illustrated API host. Their clipping assertions include clipping ancestors outside the frame. The initial Russian toolbar clipping, oversized API icons, mask overflow and broken copy-label wrapping were fixed in source without relaxing those checks.

The complete `npm run check` passed: 17 verification fixtures, 645 required authored UI messages, 1,198 messages in each RU/Traditional Chinese catalog, 87 image/logo files, ten font/license files, nine preserved rendering/data engine checksums, 136 runtime modules and 415 runtime imports. ESLint, TypeScript, formatting, asset safety and source-boundary checks passed. The motion-chunk failure test also passed in Chromium, Firefox and WebKit, confirming that all six complete frames remain visible when their animation imports are blocked. The final Home static graph is 129.6/132 KiB gzip JavaScript and 28.5/29 KiB gzip CSS. These checks do not establish the authenticated application's API contract or physical-device approval.

### WebKit resize correction

The first combined three-engine run passed 186 of 189 cases. Two WebKit TLS/startup cases consistently exposed a pre-existing `MorphPanel` resize-delivery loop: a fractional content-height change started a Web Animations height transition directly from a `ResizeObserver` callback. A controlled probe reproduced the error in EN/RU and removed it by deferring only that callback to the next animation frame. The source now coalesces observer measurements through `requestAnimationFrame` and cancels the pending callback on cleanup; synchronous React-update measurements remain intact. Browser errors are still treated as failures.

The third initial failure concerned an unchanged API expansion frame-sampling assertion under two-worker contention; it passed in the isolated run with the original assertion. No timing or clipping threshold was relaxed. Final production reruns and the commit-associated CI run provide the release evidence.

After the resize correction, the unchanged WebKit suite passed all 63 cases. The six affected Chromium cases and six affected Firefox cases also passed, for 75/75 in the targeted final run, with no failures, skipped tests or retries. The earlier complete Chromium and Firefox runs each passed 63/63; only the affected cases were repeated after the shared observer fix. The separate motion-chunk failure test passed once in each of the three engines.

After the final date and fingerprint wrapping adjustment, all 45 scene/TLS cases passed across the three engines, as did the Chromium legal-page loading contract. The home-page contract initially differed only in typographic nonbreaking spaces in its accessible description; its matcher now accepts whitespace without changing the expected words. That single case passed on its targeted rerun. The final gate therefore has passing observations for all 47 distinct cases (17 Chromium, 15 Firefox and 15 WebKit), recorded as a 46/47 run plus the corrected 1/1 rerun.

### Repository-wide brand consistency

The first complete repository CI run for the replacement passed 567 of 568 cases. Its remaining failure correctly caught uppercase `APCOSYS` in the new API heading, contrary to the website's existing prose-brand contract. The heading and both translated messages now use `Apcosys`; scene-specific text expectations were updated to the same wording. The original site-wide brand assertion, logo-path checks and uppercase-footer assertions remain unchanged.

The corrected production build passed all 15 targeted Chromium cases: the unchanged brand contract across every site route, twelve API combinations covering three locales, both themes and 320/1440 px, reduced motion, and viewport pause/resume. There were no failures, skipped tests or retries.
