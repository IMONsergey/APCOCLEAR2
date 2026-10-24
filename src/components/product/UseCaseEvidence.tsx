import { Text } from '../ui/Text';
import { CaseFragment } from './CompactFragments';
import type { EvidenceScenario } from './ProductEvidence';
import { productUrl } from '../../config/site';
import { LocaleText } from '../../i18n/LocaleText';
import { useLocale } from '../../i18n/context';

type Journey = {
  label: string;
  title: string;
  introduction: string;
  scenario: EvidenceScenario;
  start: string;
  query: string;
  result: string;
  next: string;
  caveat: string;
  caveatValues?: Record<string, string | number>;
};

const journeys: Record<'scope' | 'technology' | 'indicator', Journey> = {
  scope: {
    label: 'BUG BOUNTY / EXAMPLE INVESTIGATION',
    title: "Visibility isn't permission.",
    introduction:
      'Build a shortlist of candidate hosts, then check their services, observation dates and programme scope.',
    scenario: 'domain',
    start: 'example.com — a reserved stand-in for a domain explicitly permitted by a programme.',
    query: 'Search that permitted domain using the currently supported query format.',
    result: 'Inspect the host, ports and service context of candidate results.',
    next: 'Verify each selected host against the programme rules before interacting with it.',
    caveat: 'Reserved example domain and IP addresses.',
  },
  technology: {
    label: 'VULNERABILITY RESEARCH / EXAMPLE INVESTIGATION',
    title: 'A version is a lead. Not a finding.',
    introduction:
      'Identify candidate hosts with a matching technology, then use service evidence and observation dates to plan advisory checks.',
    scenario: 'technology',
    start: 'nginx 1.24.0, used here as a synthetic technology lead.',
    query:
      'Research input: nginx 1.24.0. Translate it into the supported product/version query syntax.',
    result: 'Compare observed host services, detection evidence and any associated CVE context.',
    next: 'Open a host, check observation age, patch backports and configuration before drawing conclusions.',
    caveat: 'Example technology and host records.',
  },
  indicator: {
    label: 'OSINT / EXAMPLE INVESTIGATION',
    title: 'Follow attributes. Keep attribution separate.',
    introduction:
      'Turn an indicator into a next query, keeping the observed service, date and supporting response together.',
    scenario: 'indicator',
    start: 'An IP address present in an alert or investigation report.',
    query: 'Look up the address in the current Apcosys search.',
    result: 'Review the host view, available services, technologies and observation date.',
    next: 'Investigate a relevant service or attribute while keeping attribution unproven.',
    caveat: '{address} · Reserved example address.',
    caveatValues: { address: '198.51.100.24' },
  },
};

function EvidenceJourney({ kind }: { kind: keyof typeof journeys }) {
  const { t } = useLocale();
  const item = journeys[kind];
  const stages = [
    [
      '01',
      'Starting point',
      kind === 'scope'
        ? 'An authorised domain.'
        : kind === 'technology'
          ? 'A product and version.'
          : 'An IP or domain from a report.',
    ],
    [
      '02',
      'Query',
      kind === 'scope'
        ? 'Find candidate infrastructure.'
        : kind === 'technology'
          ? 'Find matching observations.'
          : 'Look up the indicator.',
    ],
    [
      '03',
      'Result',
      kind === 'scope'
        ? 'Review ports, services and observation dates.'
        : kind === 'technology'
          ? 'Compare versions, responses and observation dates.'
          : 'Read services, technologies and observation dates.',
    ],
    [
      '04',
      'Next step',
      kind === 'scope'
        ? 'Keep an in-scope shortlist with service evidence.'
        : kind === 'technology'
          ? 'Keep candidates for advisory and configuration checks.'
          : 'Record the next query and its supporting evidence.',
    ],
  ] as const;
  return (
    <section
      id="example-investigation"
      className={'stage-case-evidence stage-case-evidence--' + kind + ' section-space'}
    >
      <div className="container">
        <div className="stage-case-evidence__heading">
          <Text as="h2">{item.title}</Text>
          <Text as="p">{item.introduction}</Text>
        </div>
        <div className="stage-case-experience">
          <div
            className="stage-example-journey"
            aria-label={t('Illustrative investigation stages')}
          >
            {stages.map(([number, title, description]) => (
              <div key={number}>
                {kind === 'scope' && (
                  <b className="stage-example-journey__number" aria-hidden="true">
                    {number}
                  </b>
                )}
                <span>
                  <LocaleText>{t(title)}</LocaleText>
                </span>
                <Text as="p">{description}</Text>
              </div>
            ))}
          </div>
          <CaseFragment kind={kind} />
        </div>
        <div className="stage-example-footer">
          <p>{t(item.caveat, item.caveatValues)}</p>
          <a href={productUrl + '/search'}>
            <LocaleText>
              {t(
                kind === 'scope'
                  ? 'Search your scope'
                  : kind === 'technology'
                    ? 'Search by technology'
                    : 'Look up an IP or domain',
              )}
            </LocaleText>{' '}
          </a>
        </div>
      </div>
    </section>
  );
}

export function ScopeEvidence() {
  return <EvidenceJourney kind="scope" />;
}
export function TechnologyEvidence() {
  return <EvidenceJourney kind="technology" />;
}
export function IndicatorEvidence() {
  return <EvidenceJourney kind="indicator" />;
}
