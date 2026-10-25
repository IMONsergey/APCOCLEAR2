import { useLayoutEffect, type RefObject } from 'react';
import type { ResearchScene } from '../../content/research';
import { useLocale } from '../../i18n/context';
import { startApplicationPlayback } from './application/applicationPlayback';

export default function StepDemoMount({
  scene,
  frameRef,
}: {
  scene: ResearchScene;
  frameRef: RefObject<HTMLDivElement | null>;
}) {
  const { locale } = useLocale();
  useLayoutEffect(() => {
    if (!frameRef.current) return;
    const controller = startApplicationPlayback(frameRef.current, scene);
    return () => controller.dispose();
  }, [frameRef, scene, locale]);
  return null;
}
