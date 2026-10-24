# Application demonstrations — 24 October 2026

The five Home research scenes and the API illustration are translated React/HTML excerpts of the application. The 24 October correction gives all five research scenes a compact 3:2 frame, removes the shared top toolbar from all six demonstrations and removes the artwork from the first query scene. The API illustration uses its own responsive layout and content-driven height.

Playback continues to use the native browser animation implementation from the previous release. GSAP remains absent from runtime imports and the dependency manifest. This document describes the current composition, asset sizes and runtime contract. [Final readiness](FINAL-READINESS.md) records the current release checks and publication status; the earlier replacement results are preserved separately under **Historical acceptance record** below.

## Design source and scope

Source: [Apcosys, page «01 · Приложение»](https://www.figma.com/design/lLMSuy0RrCiPhg873xpVUY/Apcosys?node-id=899-3620), previously named «Приложение — доработка». Design context, visible child nodes and screenshots were read from the file. The source design was not edited.

| Website scene | Application source frame                                                                                            | Current implemented excerpt                                                                  |
| ------------- | ------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| Query         | [899:4021 — Поиск, начало](https://www.figma.com/design/lLMSuy0RrCiPhg873xpVUY/Apcosys?node-id=899-4021)            | Search heading, query field, query-type hints and filter guidance; no artwork or toolbar     |
| Results       | [899:4117 — Поиск, результаты](https://www.figma.com/design/lLMSuy0RrCiPhg873xpVUY/Apcosys?node-id=899-4117)        | Query, country facets, result count and host records with ports/product                      |
| Host          | [899:5079 — Объект, адрес и сервисы](https://www.figma.com/design/lLMSuy0RrCiPhg873xpVUY/Apcosys?node-id=899-5079)  | Address, network, service tabs, HTTPS response and detected product                          |
| Evidence      | [903:48414 — Сертификат TLS](https://www.figma.com/design/lLMSuy0RrCiPhg873xpVUY/Apcosys?node-id=903-48414)         | Selected HTTPS service, certificate identity, issuer, validity and SHA-256 fingerprint       |
| Refined query | [903:48044 — Поиск, применён domain](https://www.figma.com/design/lLMSuy0RrCiPhg873xpVUY/Apcosys?node-id=903-48044) | Applied domain condition, condition chip and matching result                                 |
| API           | [903:53837 — API, доступ](https://www.figma.com/design/lLMSuy0RrCiPhg873xpVUY/Apcosys?node-id=903-53837)            | Existing masked key, copy state, base URL, query/scan credit balances and documentation card |

The result row `899:4220` and filter fragment `959:74371` supplied detailed context where the parent frame was sparse. The current marketing excerpts arrange that application content for compact cards using the website's type roles, theme tokens and translated text. Results place country facets beside host records; the host scene places service selection beside the response; certificate details and the refined query use compact data rows. The five-scene frame has a fixed aspect ratio, so its dimensions remain consistent when its language or playback phase changes.

## Current layout and typography

The shared `ApplicationFrame` contains scene content and the decorative cursor. It has no logo strip, Filters / All Types toolbar or API/Search toolbar label. The first query scene contains its search interface and supporting text without `aperture.svg`.

| Element                        | Current contract                                                                                                                                                                 |
| ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Five research frames           | One 3:2 aspect ratio; the previous 440 px minimum height is removed                                                                                                              |
| Research carousel              | One card through 767 px, two from 768 px and three from 1200 px; the narrow layout includes 16 px of trailing allowance so the last card reaches its intended scroll position    |
| Research body, labels and code | 10 px base; regular record headings and result addresses use 12 px                                                                                                               |
| Query heading                  | 18 px normally; 16 px when the application container is at most 299 px wide, 20 px from 400 px                                                                                   |
| Host address heading           | 16 px normally; 12 px at container widths up to 299 px, 18 px from 400 px                                                                                                        |
| API body and code              | 12 px; documentation heading 14 px                                                                                                                                               |
| API introductory heading       | 18 px normally; 16 px when the API content container is at most 359 px wide                                                                                                      |
| API fields and actions         | 32 px minimum height, with room for localized content; the regenerate action uses 28 px normally and 32 px when the API content container is at most 359 px wide                 |
| API layout                     | Credentials and documentation form two columns above 479 px of API-content width and stack at 479 px or below; height follows the content without the former 560/600 px minimums |

These values are CSS dimensions from `application-scene.css`, `application-api-scene.css` and the outer section styles. Container breakpoints refer to the illustration's available width, while the carousel breakpoints refer to its section width. Research text retains a 10 px minimum rather than being reduced further at the two-card transition.

The API key field and its copy action have explicit grid positions. The visible copy label uses the translated `Copy` / `Copied` state; its full `Copy API key` description remains in `title`. The base URL has a compact copy icon with a translated `Copy base URL` title. This keeps the localized controls compact without splitting long action labels inside words.

## Exact vector assets

All fourteen files remain local SVG exports in `public/assets/application/`, registered in `src/content/asset-manifest.ts` and resolved through `assetUrl` when rendered. No temporary Figma asset URL is shipped. The exports' paths, viewBox values and aspect ratios are preserved. The artwork and two toolbar exports remain in the source collection but are not rendered in the current demonstrations. The sizes below describe the current CSS-rendered icons, which can differ from their original export canvases and HTML width/height attributes.

| File                | Figma node                       | Export canvas          | Rendered role                                                               |
| ------------------- | -------------------------------- | ---------------------- | --------------------------------------------------------------------------- |
| `aperture.svg`      | `1279:24142`                     | 360 × 341.581          | Retained source export; not rendered in the current query scene             |
| `run-search.svg`    | `I902:3871;902:3814`             | 50 × 50                | Query action, 22 × 22; 16 × 16 at application-container widths up to 299 px |
| `netherlands.svg`   | `958:70915`                      | 24 × 16                | Country marker and facet, 12 × 8                                            |
| `germany.svg`       | `958:70920`                      | 24 × 16                | Country facet, 12 × 8                                                       |
| `united-states.svg` | `962:72020`                      | 24 × 16                | Country facet, 12 × 8                                                       |
| `filter-plus.svg`   | `I914:7459;914:7433;902:3806`    | 8 × 8                  | Retained source export; the toolbar is removed                              |
| `type-chevron.svg`  | `I914:7459;914:7434;902:3810`    | 7 × 5 including stroke | Retained source export; the toolbar is removed                              |
| `nginx.svg`         | `962:72017`                      | 20 × 20                | Product marker, 12 × 12                                                     |
| `certificate.svg`   | `959:70264`                      | 18 × 18                | Certificate heading, 12 × 12                                                |
| `link.svg`          | `959:70285`                      | 18 × 18                | Connection/validity heading, 12 × 12                                        |
| `copy-white.svg`    | `I903:53856;984:12522;984:82546` | 20 × 20                | Primary API copy action, 16 × 16                                            |
| `copy-accent.svg`   | `I903:53864;984:12657;984:82553` | 20 × 20                | Base URL action, 16 × 16                                                    |
| `code.svg`          | `903:53876`                      | 36 × 36                | Documentation card, 24 × 24                                                 |
| `external.svg`      | `I903:53881;984:12657;984:82559` | 20 × 20                | Documentation action, 16 × 16                                               |

At application-container widths up to 299 px, the country facets retain their text labels and counts while omitting their small flags; host country markers remain visible. API icon dimensions are asserted in browser tests because a broad image rule previously enlarged them despite successful image decoding.

The API heading follows the website's prose spelling, `Apcosys`, in all three locales. The original vector logo and intentional uppercase footer labels retain their established forms.

## Runtime contract

`ApplicationFrame`, `ApplicationProductScene` and `ApplicationApiScene` render the complete translated frame eagerly. `StepDemoMount` and `ApiDemoMount` load `applicationPlayback.ts` near the viewport. A native animation clock controls a decorative cursor, target emphasis, query typing, the country-filter result count and the illustrative copied state. It does not own navigation, page text, real credentials or API communication.

The four phases are exposed by `data-demo-phase`. `data-demo-playback` reports `static`, `playing` or `paused`. An intersection observer pauses offscreen motion, document visibility pauses hidden tabs, and a media-query listener applies a changed reduced-motion preference immediately. Paused time does not accumulate into a jump on resume. Cleanup removes observers/listeners, cancels pending frames and restores the inline styles owned by playback. Tests assert visible motion and frozen transforms rather than reaching into private clock fields.

Reduced motion leaves the complete initial frame readable. If the animation chunk fails, the React frame stays visible. Text, dates, balances, percentages and descriptions use the current EN/RU/Traditional Chinese locale. All six frames support the website's light and dark modes. The illustration subtree is inert and hidden from assistive technology; the enclosing image role has a translated description. Real page links and actions remain outside it.

## Data boundaries

Host examples use `192.0.2.10`, `192.0.2.11`, AS64496, `example.com` and `cdn.example.com`. TLS evidence stays attached to HTTPS/443 throughout playback. The service label is `443 / HTTPS`; the associated domain remains visible in the host heading and certificate Subject.

The certificate's visible SHA-256 value is abbreviated as `7A:3C:91:0F:26:5E ··· AE:0C:62:98:F3`. The same `<code>` element retains the complete 32-byte digest in its `title` attribute. Regression checks assert the visible prefix/suffix and the full attribute value. Each localized date remains a single unit when the validity range wraps. The illustration stays inert; retaining the full digest as metadata does not add a verification or copy control.

The API key is an eight-dot visual mask; it conveys neither a real credential nor an actual key length. Balances remain synthetic. The displayed base URL is `https://api.apcosys.net/api/v1`. No request is sent from the illustration, and its copy/regenerate controls perform no real action. The developer-page request uses the documented POST host-search contract and X-API-Key authentication, with a clearly labelled synthetic response. See [Product integrations](reference/PRODUCT-INTEGRATIONS.md).

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
