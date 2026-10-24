# Published product integration references

These references were read on 23 October 2026. They describe the separate public Apcosys product; this repository remains the marketing website. No authenticated requests, credentials, real payments or message delivery are used by its demonstrations.

## Statistics

Source: [public statistics](https://api.apcosys.net/api/statistics), a JSON response with `success` and `data`. The endpoint is publicly readable without a key.

The snapshot used in `src/content/metrics.ts` has `last_updated_timestamp=1792768164`, or `2026-10-23T15:09:24.000Z`:

| Field       | Snapshot value |
| ----------- | -------------: |
| `ipv4`      |    117,699,441 |
| `ipv6`      |    161,719,645 |
| `domains`   |    839,953,442 |
| `products`  |  1,348,017,100 |
| `cves`      |        794,597 |
| `protocols` |             54 |

Both Home and Methodology show the snapshot date and source link. The UI uses neutral Products/CVEs labels and identifies each source field. The endpoint does not document counting or deduplication semantics; a number must not be reinterpreted as distinct vulnerable hosts or a confirmed security finding. The later verification response had a newer timestamp and different values, confirming that these are changing counters. This website intentionally renders its dated snapshot and does not claim live updates.

## HTTP API

Source: [published API documentation](https://apcosys.net/docs/api). The published documentation bundle provides this contract:

- Base: `https://api.apcosys.net/api/v1`.
- Authentication: `X-API-Key` with the account API key.
- Host search: `POST /search/hosts`, JSON body with optional `page`, `docs_per_page` and `full_text_search` (among other documented filters).
- Search response: `total`, `page`, `docs_per_page`, `hosts`; host records include `ip`, organization/country context, `uts` and `open_ports`.
- Published API rates: Plus 1 request/s, Expert 2, Business 5; Free has no API access.

`src/content/api-example.ts` uses that request structure and a deliberately small 20-record page. It reads the API key from a server environment variable in the copyable cURL example. The browser never stores a key or runs the request. Response values use a reserved documentation IP and an explicitly synthetic organization. The API illustration uses the same corrected base prefix; its masked key, balances and copy/regenerate animation are inert.

The documented HTTP method costs are separate from plan request rates. The authenticated web application's session-cookie/WebSocket protocol must not be confused with this public HTTP API. Search Token packages and plan credits likewise must not be treated as interchangeable without an account-level conversion rule.

## Account and billing handoff

The public product exposes `/login`. A standalone `/register` route was not present in the published route manifest, so the website does not send users to that assumed URL. Default Sign In and Free entry use the product login. A custom same-origin sign-in URL remains configurable.

Paid-plan dialogs retain the selected plan and monthly/annual period. Users can copy a readable summary and open Apcosys in a new tab; clipboard denial reveals a focused, selectable text area. The marketing page does not append invented checkout or subscription parameters, and it does not claim that the selection or payment was completed in the product.

## Boundaries requiring owner information

| Area                            | Remaining external decision                                                                                                                                                                                      |
| ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Usage rights, earlier issue B29 | Map Free/Plus/Expert/Business to the legal Personal/Free and Business/Enterprise categories. No rights for Plus or Expert are inferred.                                                                          |
| Automatic checkout              | Supply a supported checkout/plan-selection contract before automatic transfer is implemented.                                                                                                                    |
| Contact delivery                | Provide a backend only if direct server delivery is required. Current actions prepare/copy an email and never claim delivery.                                                                                    |
| Legal approval                  | English policy originals are unchanged. RU/ZH document bodies display directly, with English available through the language selector; owner/legal approval remains distinct from structural and semantic checks. |
| Domain and indexing             | Configure the final marketing origin and explicitly enable indexing there. Review copies stay noindex.                                                                                                           |

Public sources support the specific technical facts above; they do not establish contractual approval, ownership of a host, monitoring availability or all commercial billing semantics.
