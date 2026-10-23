import { businessPlan } from '../../content/plans';
import { siteHref } from '../../app/paths';
import { LocaleText } from '../../i18n/LocaleText';
import { useLocale } from '../../i18n/context';
import { DoubleButton } from '../ui/DoubleButton';
export function AudienceSection() {
  const { locale, t } = useLocale();
  const users = new Intl.NumberFormat(locale === 'en' ? 'en-US' : locale).format(
    businessPlan.users,
  );
  return (
    <div id="audiences" className="audiences">
      <div className="audience-grid">
        <article id="researchers" className="audience-card">
          <div className="audience-copy">
            <h3>
              <LocaleText>{t('For security researchers')}</LocaleText>
            </h3>
            <p>
              <LocaleText>
                {t(
                  'Find the infrastructure you are interested in, check what runs on it and keep investigating.',
                )}
              </LocaleText>
            </p>
          </div>
          <div className="audience-actions">
            <DoubleButton href={siteHref('/platform/search-investigation')}>
              <LocaleText>{t('Explore Search & Investigation')}</LocaleText>
            </DoubleButton>
            <DoubleButton variant="secondary" href={siteHref('/pricing')}>
              <LocaleText>{t('View Plans')}</LocaleText>
            </DoubleButton>
          </div>
        </article>
        <article id="teams" className="audience-card">
          <div className="audience-copy">
            <h3>
              <LocaleText>{t('For security teams')}</LocaleText>
            </h3>
            <p>
              <LocaleText>
                {t(
                  'Investigate the internet-facing infrastructure your organisation runs, review its technical context and bring the results into your own tools through the API. The Business plan gives up to {users} users access on one subscription.',
                  { users },
                )}
              </LocaleText>
            </p>
          </div>
          <div className="audience-actions">
            <DoubleButton href={siteHref('/teams')}>
              <LocaleText>{t('Explore For Teams')}</LocaleText>
            </DoubleButton>
            <DoubleButton variant="secondary" href={siteHref('/pricing')}>
              <LocaleText>{t('View Business Plan')}</LocaleText>
            </DoubleButton>
          </div>
        </article>
      </div>
    </div>
  );
}
