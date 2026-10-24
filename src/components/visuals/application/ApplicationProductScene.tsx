import { assetUrl } from '../../../content/assets';
import type { ResearchScene } from '../../../content/research';
import { useLocale } from '../../../i18n/context';

const fingerprint =
  '7A:3C:91:0F:26:5E:84:AD:19:67:22:4B:CC:04:73:8D:55:AA:10:B6:9F:32:76:CD:81:40:11:AE:0C:62:98:F3';

function QueryBar() {
  return (
    <div className="application-query-bar" data-demo-target="query-input">
      <span data-demo-query>example</span>
      <img
        src={assetUrl('application', 'run-search.svg')}
        width="36"
        height="36"
        alt=""
        data-demo-target="query-submit"
      />
    </div>
  );
}

function Country() {
  const { t } = useLocale();
  return (
    <span className="application-country">
      <img src={assetUrl('application', 'netherlands.svg')} width="18" height="12" alt="" />
      {t('Netherlands')}
    </span>
  );
}

function ResultRow({ secondary = false }: { secondary?: boolean }) {
  const { t } = useLocale();
  return (
    <div
      className="application-result"
      data-demo-target={secondary ? 'result-next' : 'result-first'}
    >
      <div className="application-result-identity">
        <strong className="application-result-address">
          {secondary ? '192.0.2.11' : '192.0.2.10'}
        </strong>
        <span className="application-link">{secondary ? 'cdn.example.com' : 'example.com'}</span>
      </div>
      <div className="application-result-services">
        <span className="application-ports">
          <span>443</span>
          {!secondary && <span>80</span>}
        </span>
        <span className="application-technology">
          <img src={assetUrl('application', 'nginx.svg')} width="16" height="16" alt="" />
          nginx
        </span>
      </div>
      {!secondary && (
        <span className="application-result-network application-muted">
          {t('Example Network')} · AS64496
        </span>
      )}
      {!secondary && <Country />}
    </div>
  );
}

function HostHeading() {
  return (
    <div className="application-host-heading" data-demo-target="host-address">
      <div>
        <strong>192.0.2.10</strong>
        <span className="application-link">example.com</span>
      </div>
      <Country />
    </div>
  );
}

function ObjectTabs({ tls = false }: { tls?: boolean }) {
  const { t } = useLocale();
  return (
    <div className="application-object-tabs">
      <span data-selected={!tls}>{t('Services')}</span>
      <span data-selected={tls} data-demo-target="tls-tab">
        {t('TLS certificate')}
      </span>
      <span>DNS</span>
    </div>
  );
}

function QueryScene() {
  const { t } = useLocale();
  return (
    <div className="application-query-scene">
      <div className="application-query-intro">
        <h4 className="application-query-title">{t('Search internet infrastructure.')}</h4>
        <p>{t('Find hosts, services and networks.')}</p>
      </div>
      <QueryBar />
      <div className="application-query-examples" data-demo-target="query-examples">
        <span>{t('Text query')}</span>
        <span>{t('Domain')}</span>
        <span>IP / CIDR</span>
      </div>
      <p className="application-query-hint" data-demo-target="query-hint">
        {t('Use filters for a specific field or range.')}
      </p>
    </div>
  );
}

function ResultsScene() {
  const { t } = useLocale();
  return (
    <div className="application-results-scene">
      <QueryBar />
      <h4 className="application-results-heading">
        <span className="application-results-all">{t('148 results')}</span>
        <span className="application-results-filtered">{t('86 results')}</span>
      </h4>
      <div className="application-facets" data-demo-target="country-filter">
        <span className="application-facets-heading">{t('Country · Hosts')}</span>
        <div className="application-facet application-facet--nl">
          <span className="application-facet-country">
            <img src={assetUrl('application', 'netherlands.svg')} width="18" height="12" alt="" />
            {t('Netherlands')}
          </span>
          <span>86</span>
          <i />
        </div>
        <div className="application-facet application-facet--de">
          <span className="application-facet-country">
            <img src={assetUrl('application', 'germany.svg')} width="18" height="12" alt="" />
            {t('Germany')}
          </span>
          <span>42</span>
          <i />
        </div>
        <div className="application-facet application-facet--us">
          <span className="application-facet-country">
            <img src={assetUrl('application', 'united-states.svg')} width="18" height="12" alt="" />
            {t('United States')}
          </span>
          <span>20</span>
          <i />
        </div>
      </div>
      <div className="application-result-list">
        <ResultRow />
        <ResultRow secondary />
      </div>
    </div>
  );
}

function HostScene() {
  const { t } = useLocale();
  return (
    <div className="application-host-scene">
      <HostHeading />
      <div className="application-host-network">AS64496 · {t('Example Network')}</div>
      <ObjectTabs />
      <h4 className="application-host-services-title">{t('Services')}</h4>
      <div className="application-services" data-demo-target="host-services">
        <span data-selected="true">
          <strong>443</strong> HTTPS
        </span>
        <span>
          <strong>80</strong> HTTP
        </span>
      </div>
      <div className="application-response" data-demo-target="host-response">
        <div className="application-response-heading">
          <strong>{t('HTTPS response')}</strong>
          <span>200 OK</span>
        </div>
        <pre>
          <code>
            {
              'HTTP/1.1 200 OK\nserver: nginx\ncontent-type: text/html\n\n<title>Example Domain</title>'
            }
          </code>
        </pre>
      </div>
      <div className="application-product" data-demo-target="host-product">
        <span>{t('Detected product')}</span>
        <span>
          <img src={assetUrl('application', 'nginx.svg')} width="16" height="16" alt="" />
          nginx
        </span>
      </div>
    </div>
  );
}

function EvidenceScene() {
  const { locale, t } = useLocale();
  const date = new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });
  return (
    <div className="application-evidence-scene">
      <HostHeading />
      <ObjectTabs tls />
      <div className="application-tls-service" data-demo-service="443">
        443 / HTTPS
      </div>
      <div className="application-certificate" data-demo-target="tls-identity">
        <h4 className="application-certificate-title">
          <img src={assetUrl('application', 'certificate.svg')} width="18" height="18" alt="" />
          {t('Certificate identity')}
        </h4>
        <dl>
          <div>
            <dt>{t('Subject')}</dt>
            <dd>example.com</dd>
          </div>
          <div>
            <dt>{t('Issuer')}</dt>
            <dd>{t('Example Certificate Authority')}</dd>
          </div>
        </dl>
      </div>
      <div className="application-validity" data-demo-target="tls-validity">
        <h4>
          <img src={assetUrl('application', 'link.svg')} width="18" height="18" alt="" />
          {t('Connection & validity')}
        </h4>
        <span>
          <time dateTime="2026-09-01">{date.format(new Date('2026-09-01T00:00:00Z'))}</time>
          {' — '}
          <time dateTime="2026-12-01">{date.format(new Date('2026-12-01T00:00:00Z'))}</time>
        </span>
      </div>
      <div className="application-fingerprint" data-demo-target="tls-fingerprint">
        <strong>{t('Certificate fingerprint')}</strong>
        <span>SHA-256</span>
        <code title={fingerprint}>7A:3C:91:0F:26:5E ··· AE:0C:62:98:F3</code>
      </div>
    </div>
  );
}

function RefinedScene() {
  const { t } = useLocale();
  return (
    <div className="application-refine-scene">
      <QueryBar />
      <div className="application-condition" data-demo-target="refine-condition">
        <h4 className="application-refine-heading">{t('Applied condition')}</h4>
        <span className="application-muted">domain</span>
        <span className="application-link">example.com</span>
      </div>
      <div className="application-applied" data-demo-target="refine-applied">
        <span>{t('Domain')} · example.com</span>
        <span>{t('Clear conditions')}</span>
      </div>
      <h4 className="application-refine-result-count">{t('1 result')}</h4>
      <ResultRow />
      <p className="application-refine-note">{t('Observed services and metadata')}</p>
    </div>
  );
}

export function ApplicationProductScene({ scene }: { scene: ResearchScene }) {
  return (
    <div className="application-product-scene">
      {scene === 'query' && <QueryScene />}
      {scene === 'results' && <ResultsScene />}
      {scene === 'host' && <HostScene />}
      {scene === 'evidence' && <EvidenceScene />}
      {scene === 'suggestions' && <RefinedScene />}
    </div>
  );
}
