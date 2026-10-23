import { useNearViewport } from '../../hooks/useNearViewport';
import '../sections/ApiSection.css';
import { Component, Suspense, lazy, useCallback, useRef, useState, type ReactNode } from 'react';
import { apiRequestExample, demoHosts } from '../../content/product-demo';
import { useLocale } from '../../i18n/context';

const Demo = lazy(() => import('./ApiDemoMount'));
class DemoBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}
export function ApiIllustration() {
  const { t } = useLocale();
  const ref = useRef<HTMLDivElement>(null);
  const mounted = useNearViewport(ref, '280px');
  const [ready, setReady] = useState(false);
  const onReady = useCallback(() => setReady(true), []);

  return (
    <div
      ref={ref}
      className="api-demo-frame"
      data-ready={ready}
      role="img"
      aria-label={t(
        'Illustrative Apcosys API documentation with a request and response. See the current documentation for the live API.',
      )}
    >
      <div className="api-demo-poster" aria-hidden="true">
        <div className="api-demo-fallback">
          <p>{t('Illustrative workflow')}</p>
          <h3>{t('Request')}</h3>
          <pre>
            <code>{apiRequestExample}</code>
          </pre>
          <h3>{t('Response')}</h3>
          <pre>
            <code>
              {JSON.stringify(
                {
                  host: demoHosts[0]!.ip,
                  port: 443,
                  protocol: 'HTTPS',
                },
                null,
                2,
              )}
            </code>
          </pre>
        </div>
      </div>
      <DemoBoundary>
        <Suspense fallback={null}>{mounted && <Demo onReady={onReady} />}</Suspense>
      </DemoBoundary>
    </div>
  );
}
