import '../../styles/compact-experience.css';
import { useState } from 'react';
import { siteHref } from '../../app/paths';
import { DataLens } from '../product/CompactFragments';
import { AudienceSection } from './AudienceSection';
import { TeamSignal } from '../product/TeamSignal';
import { DoubleButton } from '../ui/DoubleButton';
import { ThemedArtwork } from '../ui/ThemedArtwork';
import { demoHosts } from '../../content/product-demo';
import '../../styles/home-product.css';
import { LocaleText } from '../../i18n/LocaleText';
import { useLocale } from '../../i18n/context';

const searchable = [
  {
    label: 'Hosts',
    description: 'Find internet-facing systems that match your query.',
    mode: 'host',
  },
  {
    label: 'Domains',
    description: 'Search and investigate observed domain data.',
    mode: 'results',
  },
  {
    label: 'Ports & Services',
    description: 'See exposed ports and the services observed behind them.',
    mode: 'services',
  },
  {
    label: 'Technologies',
    description: 'Explore detected products and technologies.',
    mode: 'services',
  },
  {
    label: 'Vulnerability Context',
    description: 'Examine CVEs potentially associated with observed technologies and versions.',
    mode: 'cve',
  },
] as const;

export function SearchableSection() {
  const { locale, t } = useLocale();
  const [selected, setSelected] = useState(0);
  return (
    <section
      id="what-you-can-search"
      className="home-searchable section-space"
      aria-labelledby="searchable-title"
    >
      <div className="container">
        <div className="home-product-heading">
          <h2 id="searchable-title">
            {locale === 'en' ? (
              <>
                Search the infrastructure <br />
                behind the internet.
              </>
            ) : (
              <LocaleText>{t('Search the infrastructure behind the internet.')}</LocaleText>
            )}
          </h2>
        </div>
        <div className="home-searchable__layout">
          <div
            className="home-searchable__index"
            role="group"
            aria-label={t('Searchable data types')}
          >
            {searchable.map((item, i) => (
              <button
                key={item.label}
                type="button"
                aria-pressed={selected === i}
                onClick={() => setSelected(i)}
              >
                <span className="searchable-selector" aria-hidden="true" />
                <span>
                  <strong>{t(item.label)}</strong>
                  <small>{t(item.description)}</small>
                </span>
              </button>
            ))}
          </div>
          <div className="home-searchable__evidence">
            <DataLens selected={selected} />
            <DoubleButton compact href={siteHref('/platform/data-methodology')}>
              {t('Explore Data & Methodology')}
            </DoubleButton>
          </div>
        </div>
      </div>
    </section>
  );
}

const cases = [
  {
    artwork: 'use-cases/bug-bounty.webp',
    title: 'Bug Bounty',
    outcome: 'Find candidate infrastructure. Verify permission before testing.',
    path: '/use-cases/bug-bounty',
    label: 'Explore Bug Bounty',
  },
  {
    artwork: 'use-cases/vulnerability-research.webp',
    title: 'Vulnerability Research',
    outcome: 'Find matching versions. Check whether the advisory applies.',
    path: '/use-cases/vulnerability-research',
    label: 'Explore Vulnerability Research',
  },
  {
    artwork: 'use-cases/osint.webp',
    title: 'OSINT & Threat Investigation',
    outcome: 'Examine services and host context. Identify the next research lead.',
    path: '/use-cases/osint-threat-investigation',
    label: 'Explore OSINT',
  },
] as const;
export function HomeUseCases() {
  const { locale, t } = useLocale();
  return (
    <section
      className="home-usecases section-space"
      id="use-cases"
      aria-labelledby="home-cases-title"
    >
      <div className="container">
        <div className="home-product-heading">
          <h2 id="home-cases-title">
            {locale === 'en' ? (
              <>
                Different questions. <br />
                One place to investigate them.
              </>
            ) : (
              <LocaleText>{t('Different questions. One place to investigate them.')}</LocaleText>
            )}
          </h2>
        </div>
        <div className="home-usecases__grid">
          {cases.map((item) => (
            <article key={item.title}>
              <a
                className="home-usecases__image"
                href={siteHref(item.path)}
                aria-label={t(item.label)}
                tabIndex={-1}
              >
                <ThemedArtwork
                  asset={item.artwork}
                  alt=""
                  width="1536"
                  height="1024"
                  loading="lazy"
                />
              </a>
              <div className="home-usecases__story">
                <h3>{t(item.title)}</h3>
                <p>{t(item.outcome)}</p>
                <DoubleButton variant="secondary" compact href={siteHref(item.path)}>
                  {t(item.label)}
                </DoubleButton>
              </div>
            </article>
          ))}
        </div>
        <AudienceSection />
      </div>
    </section>
  );
}
export function ResearchCollection() {
  const { t } = useLocale();
  return (
    <div id="capabilities" className="container home-collection" aria-labelledby="collection-title">
      <div className="home-collection__layout">
        <div className="home-collection__copy">
          <h3 id="collection-title">{t('Keep a useful lead together.')}</h3>
          <p>
            {t(
              'An illustrative saved collection. Confirm current availability and plan access with the team.',
            )}
          </p>
          <DoubleButton compact variant="secondary" href={siteHref('/contact')}>
            {t('Talk to Us')}
          </DoubleButton>
        </div>
        <div className="capability-record">
          <div className="capability-record__bar">
            <span>{t('BUCKETS / CONCEPT')}</span>
            <span>{t('Research shortlist')}</span>
          </div>
          {demoHosts.map((host) => (
            <div className="capability-record__host" key={host.ip}>
              <strong>{host.hostname}</strong>
              <span>{host.ip}</span>
              <p>{t('Review service evidence and confirm authorised scope.')}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
export function SecurityTeamsCTA() {
  const { locale, t } = useLocale();
  return (
    <section className="home-team-cta" aria-labelledby="team-evaluation-title">
      <div className="container home-team-cta__layout">
        <div className="home-team-cta__copy">
          <h2 id="team-evaluation-title">
            {locale === 'en' ? (
              <>
                Evaluating Apcosys <br />
                for your security team?
              </>
            ) : (
              <LocaleText>{t('Evaluating Apcosys for your security team?')}</LocaleText>
            )}
          </h2>
          <p>
            {t(
              'Tell us about your investigation workflows, data requirements and API needs. Find the right way to evaluate Apcosys with your team.',
            )}
          </p>
          <div className="home-team-cta__actions">
            <DoubleButton variant="inverse" href={siteHref('/contact')}>
              {t('Talk to Us')}
            </DoubleButton>
            <DoubleButton variant="inverse" href={siteHref('/teams')}>
              {t('Explore Security Teams')}
            </DoubleButton>
          </div>
        </div>
        <div className="home-team-cta__art">
          <TeamSignal inverse />
        </div>
      </div>
    </section>
  );
}
