import { useLayoutEffect, useRef, type RefObject } from 'react';
import { useLocale } from '../../i18n/context';
import { startApplicationPlayback } from './application/applicationPlayback';

export default function ApiDemoMount({
  frameRef,
  paused,
}: {
  frameRef: RefObject<HTMLDivElement | null>;
  paused: boolean;
}) {
  const { locale } = useLocale();
  const controller = useRef<ReturnType<typeof startApplicationPlayback> | null>(null);
  useLayoutEffect(() => {
    if (!frameRef.current) return;
    const playback = startApplicationPlayback(frameRef.current, 'api');
    controller.current = playback;
    return () => {
      playback.dispose();
      controller.current = null;
    };
  }, [frameRef, locale]);
  useLayoutEffect(() => controller.current?.setPaused(paused), [paused, locale]);
  return null;
}
