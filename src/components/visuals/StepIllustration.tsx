import { useNearViewport } from '../../hooks/useNearViewport';
import { Component, Suspense, lazy, useRef, type ReactNode } from 'react';
import type { ResearchScene } from '../../content/research';
import { useLocale } from '../../i18n/context';
import { ApplicationFrame } from './application/ApplicationFrame';
import { ApplicationProductScene } from './application/ApplicationProductScene';

const Demo = lazy(() => import('./StepDemoMount'));

class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export function StepIllustration({
  scene,
  alt,
  paused = false,
}: {
  scene: ResearchScene;
  alt: string;
  paused?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const mounted = useNearViewport(ref, '240px');
  const { t } = useLocale();
  return (
    <div ref={ref} className="step-illustration" role="img" aria-label={t(alt)}>
      <ApplicationFrame scene={scene} frameRef={frameRef}>
        <ApplicationProductScene scene={scene} />
      </ApplicationFrame>
      <SceneBoundary>
        <Suspense fallback={null}>
          {mounted && <Demo scene={scene} frameRef={frameRef} paused={paused} />}
        </Suspense>
      </SceneBoundary>
    </div>
  );
}
