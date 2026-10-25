import { Text } from '../../components/ui/Text';
import { plans } from '../../content/plans';
import { formatApiRate } from '../../lib/pricing';
import { linkTo } from '../../components/layout/pageLinks';
import { ApiExample } from '../../components/product/ApiExample';
import { apiDocumentationPath } from '../../config/site';
import { siteHref } from '../../app/paths';
import { PageFrame } from '../../components/layout/PageFrame';
import {
  EditorialSection,
  ReadingRows,
  FeatureColumns,
} from '../../components/layout/PageSections';
import { useLocale } from '../../i18n/context';

function ApiSample() {
  return (
    <EditorialSection
      id="documentation"
      title="Your first request."
      intro="Send a small host-search request to the public HTTP API. Use your account API key in the X-API-Key header."
      className="stage-api-demo"
    >
      <div className="api-first-request">
        <ol className="api-setup">
          <Text as="li">
            <Text as="h3">Get your account key.</Text>
            <Text as="p">
              Use an account with API access. Keep the key in your server environment or secrets
              manager, outside browser code.
            </Text>
          </Text>
          <Text as="li">
            <Text as="h3">Prepare a narrow request.</Text>
            <Text as="p">
              Send JSON to POST /api/v1/search/hosts. The example requests 20 hosts on page 1;
              docs_per_page supports up to 100 records.
            </Text>
          </Text>
          <Text as="li">
            <Text as="h3">Inspect the response.</Text>
            <Text as="p">
              Read total for the number of matches and hosts for this page of results. Keep each
              host's ports, protocols and update time with your research notes.
            </Text>
          </Text>
        </ol>
        <div>
          <ApiExample />
        </div>
      </div>
    </EditorialSection>
  );
}

function ApiReference() {
  const { t } = useLocale();
  const groups = [
    {
      title: 'Request body',
      fields: [
        ['page', 'Integer', 'Page to request. The example starts at page 1.'],
        [
          'docs_per_page',
          'Integer',
          'Records per page. The example requests 20; the documented maximum is 100.',
        ],
        [
          'full_text_search',
          'String',
          'Text to look for, such as nginx. The first-request example uses this field.',
        ],
      ],
    },
    {
      title: 'Search response',
      fields: [
        ['total', 'Integer', 'Number of matches for the query, across all result pages.'],
        ['page', 'Integer', 'The result page returned by this response.'],
        ['docs_per_page', 'Integer', 'The page size used for this request.'],
        ['hosts', 'Array', 'Host records on the returned page.'],
        ['hosts[].ip', 'String', 'The IP address identifying this host record.'],
        ['hosts[].uts', 'Integer', 'The last update timestamp, in Unix seconds.'],
        [
          'hosts[].open_ports',
          'Array',
          'Observed services, with a protocol and port number for each entry.',
        ],
      ],
    },
  ] as const;
  return (
    <EditorialSection
      id="api-reference"
      title="Request fields and results."
      intro="Use these fields with POST /api/v1/search/hosts. The request fields below are optional; the example sets them explicitly."
    >
      <div className="api-field-references">
        {groups.map((group) => (
          <div
            key={group.title}
            className="stage-table-scroll"
            role="region"
            aria-label={t(group.title)}
            tabIndex={0}
          >
            <table className="stage-data-table stage-api-reference">
              <caption>{t(group.title)}</caption>
              <thead>
                <tr>
                  <th scope="col">{t('Field and type')}</th>
                  <th scope="col">{t('Meaning')}</th>
                </tr>
              </thead>
              <tbody>
                {group.fields.map(([field, type, description]) => (
                  <tr key={field}>
                    <th scope="row">
                      <code>{field}</code>
                      <small>{t(type)}</small>
                    </th>
                    <td>{t(description)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
      <Text as="p" className="editorial-note">
        For the next page, keep the same filters and increase page. Compare total with the records
        already returned. An update timestamp describes the stored observation, not a live check of
        the host.
      </Text>
    </EditorialSection>
  );
}

export default function ApiPage() {
  const { t } = useLocale();
  return (
    <PageFrame
      artwork="api"
      variant="developer"
      title="Apcosys data, in your own code."
      description="Query hosts, services and technologies programmatically and use the results in scripts, pipelines, reports and internal tools."
      sections={[
        { label: 'First request', id: 'documentation' },
        { label: 'Fields', id: 'api-reference' },
        { label: 'What to query', id: 'api-capabilities' },
        { label: 'Access & limits', id: 'api-access' },
        { label: 'Integration', id: 'api-integration' },
      ]}
      closing={{
        title: 'Bring the evidence into your workflow.',
        description:
          'Start with the request example, compare API access and plan an integration around the fields your research needs.',
      }}
      links={[
        linkTo('View API Documentation', apiDocumentationPath),
        linkTo('Compare plans', '/pricing', true),
      ]}
    >
      <ApiSample />
      <ApiReference />
      <EditorialSection
        id="api-capabilities"
        title="What you can query."
        intro="Search hosts, inspect individual systems and explore indexed storage records. Plus, Expert and Business include access to the public HTTP API."
      >
        <FeatureColumns
          items={[
            {
              title: 'Search infrastructure.',
              text: 'Find hosts by IP, domain, service or technology. Request analytics with the same filters to understand the matching set.',
              detail: 'POST /api/v1/search/hosts',
            },
            {
              title: 'Inspect a host.',
              text: 'Bring observed ports, services and detected products into the context of a single system.',
              detail: 'GET /api/v1/search/hosts/:ip',
            },
            {
              title: 'Explore buckets.',
              text: 'Search indexed storage records by host, extension or size. Review their file metadata and update time.',
              detail: 'POST /api/v1/search/buckets',
            },
          ]}
        />
      </EditorialSection>
      <EditorialSection
        id="api-access"
        title="API access by plan."
        intro="Plus, Expert and Business include API access. Choose a rate and allowance that fit the volume and pace of your workflow."
        className="stage-api-limits"
      >
        <div className="api-access-layout editorial-pair">
          <div className="api-plan-access">
            <Text as="h3" id="api-rate-limits-title">
              API rate limits
            </Text>
            <div
              role="region"
              aria-labelledby="api-rate-limits-title"
              tabIndex={0}
              className="stage-table-scroll"
            >
              <table className="stage-data-table stage-api-table">
                <thead>
                  <tr>
                    <th scope="col">{t('Plan')}</th>
                    <th scope="col">{t('API access')}</th>
                    <th scope="col">{t('Plan rate limit')}</th>
                  </tr>
                </thead>
                <tbody>
                  {plans.map((plan) => (
                    <tr key={plan.id}>
                      <th scope="row">{t(plan.name[0] + plan.name.slice(1).toLowerCase())}</th>
                      <td>
                        <span className="api-access-status" data-available={plan.api}>
                          {t(plan.api ? 'Yes' : 'No')}
                        </span>
                      </td>
                      <td>{formatApiRate(plan, t)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <aside className="api-usage">
            <Text as="h3">Usage and credits.</Text>
            <div className="editorial-pair__body">
              <Text as="p">
                Request rate controls how quickly you can query. Your usage allowance controls how
                much capacity is available.
              </Text>
              <Text as="p">
                Each HTTP API method has a cost against the rate allowance. The usage guide shows
                these costs separately from plan credits and Search Token packages.
              </Text>
              <a className="stage-text-link" href={siteHref('/pricing') + '#usage-guide'}>
                {t('Understand usage and capacity')}
              </a>
              <Text as="p" className="editorial-note">
                Fields and values also depend on your plan. HTTP 402 identifies a restriction; HTTP
                429 identifies an exceeded request rate.
              </Text>
            </div>
          </aside>
        </div>
      </EditorialSection>
      <EditorialSection
        id="api-integration"
        title="Start small. Make the result useful."
        intro="A careful first integration is easier to understand, debug and extend."
      >
        <ReadingRows
          items={[
            {
              title: 'HTTP 401 · API key',
              text: 'The key is missing or invalid. Check the X-API-Key header and the key loaded from your server environment.',
            },
            {
              title: 'HTTP 402 · Plan restriction',
              text: 'A requested field or value is restricted by the plan. Read the JSON error message and check which fields your plan permits.',
            },
            {
              title: 'HTTP 404 · Host not found',
              text: 'For an individual host lookup, the requested host was not found. Check the address you supplied.',
            },
            {
              title: 'HTTP 429 · Rate limit',
              text: 'The request rate was exceeded. Reduce request frequency before retrying and read the JSON error message.',
            },
          ]}
        />
      </EditorialSection>
    </PageFrame>
  );
}
