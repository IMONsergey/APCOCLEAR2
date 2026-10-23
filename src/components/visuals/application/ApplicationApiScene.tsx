import { assetUrl } from '../../../content/assets';
import { useLocale } from '../../../i18n/context';
import './application-api-scene.css';

const creditBalances = [
  { label: 'Query credits remaining', remaining: 124_850, total: 1_500_000 },
  { label: 'Scan credits remaining', remaining: 327_680, total: 327_680 },
] as const;

/** Figma application workspace, presented as an inert illustration by its frame. */
export function ApplicationApiScene() {
  const { locale, t } = useLocale();
  const number = new Intl.NumberFormat(locale);
  const percent = new Intl.NumberFormat(locale, {
    style: 'percent',
    maximumFractionDigits: 0,
  });

  return (
    <div className="application-api-scene">
      <div className="application-api__intro">
        <h3 className="application-api__heading">{t('Build with Apcosys')}</h3>
        <p className="application-api__subtitle">
          {t('Your existing key, available credits and API documentation.')}
        </p>
      </div>

      <div className="application-api__workspace">
        <div className="application-api__credentials">
          <div className="application-api__control-row">
            <div className="application-api__field-group">
              <p className="application-api__label">{t('API key')}</p>
              <div
                className="application-api__field application-api__key"
                data-demo-target="api-key"
              >
                <code>••••••••</code>
              </div>
            </div>
            <div
              className="application-api__action application-api__action--primary"
              data-demo-target="api-copy"
            >
              <span className="application-api__copy-label">
                <span className="application-api__copy-default">{t('Copy API key')}</span>
                <span data-demo-copy-state>{t('Copied')}</span>
              </span>
              <img src={assetUrl('application', 'copy-white.svg')} width="20" height="20" alt="" />
            </div>
          </div>

          <div className="application-api__action application-api__regenerate">
            {t('Regenerate API key')}
          </div>

          <div className="application-api__control-row application-api__url-row">
            <div className="application-api__field-group">
              <p className="application-api__label">{t('Base URL')}</p>
              <div className="application-api__field" data-demo-target="api-url">
                <code>
                  {'https://api.apcosys.net'}
                  <wbr />
                  {'/v1'}
                </code>
              </div>
            </div>
            <div className="application-api__action">
              <span>{t('Copy base URL')}</span>
              <img src={assetUrl('application', 'copy-accent.svg')} width="20" height="20" alt="" />
            </div>
          </div>

          <div className="application-api__credits">
            {creditBalances.map(({ label, remaining, total }) => (
              <div className="application-api__credit" key={label}>
                <div className="application-api__credit-label">
                  <p>{t(label)}</p>
                  <span>{t('{percent} left', { percent: percent.format(remaining / total) })}</span>
                </div>
                <div
                  className="application-api__credit-track"
                  role="meter"
                  aria-label={t(label)}
                  aria-valuemin={0}
                  aria-valuemax={total}
                  aria-valuenow={remaining}
                >
                  <div
                    className="application-api__credit-fill"
                    style={{ width: `${(remaining / total) * 100}%` }}
                  />
                </div>
                <p className="application-api__credit-value">
                  <span>{number.format(remaining)}</span>
                  <span aria-hidden="true"> / </span>
                  <span>{number.format(total)}</span>
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="application-api__documentation">
          <div className="application-api__documentation-heading">
            <img src={assetUrl('application', 'code.svg')} width="36" height="36" alt="" />
            <h4>{t('From a question to a response.')}</h4>
          </div>
          <p className="application-api__documentation-description">
            {t('Use the current endpoints and supported query fields.')}
          </p>
          <div
            className="application-api__action application-api__documentation-action"
            data-demo-target="api-docs"
          >
            <span>{t('Open documentation')}</span>
            <img src={assetUrl('application', 'external.svg')} width="20" height="20" alt="" />
          </div>
          <p className="application-api__documentation-note">
            {t('API access and rate limits depend on your plan.')}
          </p>
        </div>
      </div>
    </div>
  );
}
