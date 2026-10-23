# Visual components

The rendering modules in `src/visuals/` are integrated through React components and typed declarations. Their lifecycle is controlled by React, while each engine manages its own decorative canvas or SVG subtree.

| Module    | Placement                                 |
| --------- | ----------------------------------------- |
| `flow/`   | Search-area turquoise field               |
| `dots/`   | Search, cards, API and contact decoration |
| `globe/`  | Data-section globe                        |
| `shapes/` | Contour motifs                            |
| `waves/`  | Lower-page atmosphere                     |

The six application illustrations live in `src/components/visuals/application/`: five product scenes in the research carousel and one API workspace. Their source mapping and acceptance record are in [Application demonstrations](APPLICATION-DEMOS.md). `src/visuals/api/` retains the GSAP notice; the former product/API custom elements and their theme adapter have been removed.

## Integration contract

Rendering components mount near the viewport, pause when appropriate and dispose listeners, observers and controller instances on unmount. Reduced-motion preferences must remain supported. The underlying engines do not manage navigation, forms or page content.

All rendering and product-demo modules are written in TypeScript. The six original Canvas/SVG rendering and data implementations and the three themed engines used by the React adapters are checksum-verified by `scripts/verify-visuals.ts` against `src/visuals/engine-integrity.json`. Any changes to these engines require an explicit review, updated checksums and a visual regression test; TypeScript types alone do not establish rendering equivalence.

Application illustrations render translated React HTML before the optional animation chunk loads. `ApplicationFrame` provides the application toolbar and theme; `ApplicationProductScene` and `ApplicationApiScene` provide readable content. `applicationPlayback.ts` loads GSAP near the viewport and controls only the illustrative cursor, emphasis and demonstration states. Reduced motion or a failed animation chunk leaves the complete static frame visible. Playback pauses offscreen and in hidden documents, responds to a live motion-preference change and disposes its timeline, observers and listeners on unmount.

Product records use reserved documentation addresses and example hostnames. The new API workspace follows the Figma key, credit and documentation view; its masked key, balances and displayed base URL are illustrative and never make a network request or copy a credential. The separate developer-page request example retains explicit endpoint/authentication placeholders. Neither illustration establishes a production API contract.

The six application frames reflow at their actual container width instead of scaling the entire desktop interface down. Their controls are inert illustration content, with a translated description on the enclosing image role. After a change, check all languages and themes, narrow widths, animation phases, visibility pause/resume and reduced-motion transitions. Static-frame inspection alone does not cover the animation lifecycle. The separate interactive product-evidence component also requires service-selection and period/reset checks.

A GSAP notice is retained in `src/visuals/api/GSAP-NOTICE.txt`. Dependencies and notices must accompany the final source distribution.
