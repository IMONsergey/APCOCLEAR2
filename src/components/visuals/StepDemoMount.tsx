import { useLayoutEffect, useRef, type RefObject } from 'react';
import type { ResearchScene } from '../../content/research';
import { useLocale } from '../../i18n/context';
import { startApplicationPlayback } from './application/applicationPlayback';

export default function StepDemoMount({
  scene,
  frameRef,
  paused = false,
}: {
  scene: ResearchScene;
  frameRef: RefObject<HTMLDivElement | null>;
  paused?: boolean;
}) {
  const { locale } = useLocale();
  const playback = useRef<ReturnType<typeof startApplicationPlayback> | null>(null);
  useLayoutEffect(() => {
    if (!frameRef.current) return;
    const controller = startApplicationPlayback(frameRef.current, scene);
    playback.current = controller;
    return () => {
      controller.dispose();
      playback.current = null;
    };
  }, [frameRef, scene, locale]);
  useLayoutEffect(() => {
    playback.current?.setPaused(paused);
  }, [paused, scene, locale]);
  return null;
}
