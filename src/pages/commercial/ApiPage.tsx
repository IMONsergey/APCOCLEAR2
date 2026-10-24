import { Text } from '../../components/ui/Text';
import { plans } from '../../content/plans';
import { formatApiRate } from '../../lib/pricing';
import { linkTo } from '../../components/layout/pageLinks';
import { ApiExample } from '../../components/product/ApiExample';
import { apiDocumentationUrl } from '../../config/site';
import { siteHref } from '../../app/paths';
import { PageFrame } from '../../components/layout/PageFrame';
import {
  EditorialSection,
  ReadingRows,
  FeatureColumns,
} from '../../components/layout/PageSections';
import { useLocale } from '../../i18n/context';

const documentationLink = apiDocumentationUrl
  ? { label: 'View API Documentation', href: apiDocumentationUrl }
  : {
      label: 'Read API integration guidance',
      href: siteHref('/developers/api') + '#documentation',
    };

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
              Send JSON to POST /api/v1/search/hosts. Start with a small page size and the filters
              your plan supports.
            </Text>
          </Text>
          <Text as="li">
            <Text as="h3">Inspect the response.</Text>
            <Text as="p">
              Read the returned fields and their observation context before using them in a report
              or wider workflow.
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
        { label: 'What to query', id: 'api-capabilities' },
        { label: 'Access & limits', id: 'api-access' },
        { label: 'Integration', id: 'api-integration' },
      ]}
      closing={{
        title: 'Bring the evidence into your workflow.',
        description:
          'Explore access levels or talk to the team about the API reference and your integration requirements.',
      }}
      links={[documentationLink, linkTo('Compare plans', '/pricing', true)]}
    >
      <ApiSample />
      <EditorialSection
        id="api-capabilities"
        title="What you can query."
        intro="Use the same search and host context in your own tools. Build around the supported fields and request types in the current API reference."
      >
        <FeatureColumns
          items={[
            {
              title: 'Search infrastructure.',
              text: 'Turn an IP, domain, service or technology question into a set of observations to review.',
              detail: 'Useful for: focused enrichment and repeat lookups.',
            },
            {
              title: 'Inspect a host.',
              text: 'Bring observed ports, services and detected products into the context of a single system.',
              detail: 'Useful for: analyst tools and investigation reports.',
            },
            {
              title: 'Keep the context.',
              text: 'Carry the available observation dates and supporting attributes with the result.',
              detail: 'Useful for: traceable research and careful interpretation.',
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
                The HTTP API documents method costs separately from plan request rates. Review the
                current reference before scheduling larger workflows.
              </Text>
              <a className="stage-text-link" href={siteHref('/pricing') + '#usage-guide'}>
                {t('Understand usage and capacity')}
              </a>
              <Text as="p" className="editorial-note">
                Published HTTP API limits are shown here. Check current plan details in your Apcosys
                account before scheduling a larger workflow.
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
              title: 'Handle unsuccessful requests.',
              text: 'Check status codes and the current API error guidance. Make failures visible in your own tool instead of treating an empty result as a confirmed absence.',
            },
            {
              title: 'Respect the request rate.',
              text: 'Keep your workflow within its plan limit. Use the documented retry guidance and avoid repeating unsuccessful requests indefinitely.',
            },
            {
              title: 'Preserve the evidence.',
              text: 'Store the fields your investigation needs alongside the source and observation context. Keep your own conclusions separate from the returned data.',
            },
          ]}
        />
      </EditorialSection>
    </PageFrame>
  );
}
