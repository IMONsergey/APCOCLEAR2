import { useNearViewport } from '../../hooks/useNearViewport';
import '../sections/ApiSection.css';
import { Component, Suspense, lazy, useRef, type ReactNode } from 'react';
import { useLocale } from '../../i18n/context';
import { ApplicationFrame } from './application/ApplicationFrame';
import { ApplicationApiScene } from './application/ApplicationApiScene';

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
  const frameRef = useRef<HTMLDivElement>(null);
  const mounted = useNearViewport(ref, '280px');
  return (
    <div
      ref={ref}
      className="api-demo-frame"
      role="img"
      aria-label={t(
        'Illustrative API workspace with a masked key, credit balances and documentation access.',
      )}
    >
      <ApplicationFrame scene="api" frameRef={frameRef}>
        <ApplicationApiScene />
      </ApplicationFrame>
      <DemoBoundary>
        <Suspense fallback={null}>{mounted && <Demo frameRef={frameRef} />}</Suspense>
      </DemoBoundary>
    </div>
  );
}
