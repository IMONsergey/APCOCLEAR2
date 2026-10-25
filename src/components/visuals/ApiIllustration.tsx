import { useNearViewport } from '../../hooks/useNearViewport';
import '../sections/ApiSection.css';
import { Component, Suspense, lazy, useRef, useState, type ReactNode } from 'react';
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
  const [paused, setPaused] = useState(false);
  return (
    <div ref={ref} className="api-illustration">
      <div
        className="api-demo-frame"
        role="img"
        aria-label={t('API workspace with a masked key, credit balances and account limits.')}
      >
        <ApplicationFrame scene="api" frameRef={frameRef}>
          <ApplicationApiScene />
        </ApplicationFrame>
      </div>
      <button
        className="api-playback-toggle"
        type="button"
        aria-label={t(paused ? 'Play product animation' : 'Pause product animation')}
        aria-pressed={paused}
        onClick={() => setPaused(!paused)}
      >
        <svg viewBox="0 0 10 12" aria-hidden="true">
          <path d={paused ? 'M1 0L10 6L1 12Z' : 'M1 0H4V12H1ZM6 0H9V12H6Z'} />
        </svg>
        {t(paused ? 'Play' : 'Pause')}
      </button>
      <DemoBoundary>
        <Suspense fallback={null}>
          {mounted && <Demo frameRef={frameRef} paused={paused} />}
        </Suspense>
      </DemoBoundary>
    </div>
  );
}
