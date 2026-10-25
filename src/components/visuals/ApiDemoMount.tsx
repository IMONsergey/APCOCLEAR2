import { useLayoutEffect, type RefObject } from 'react';
import { useLocale } from '../../i18n/context';
import { startApplicationPlayback } from './application/applicationPlayback';

export default function ApiDemoMount({ frameRef }: { frameRef: RefObject<HTMLDivElement | null> }) {
  const { locale } = useLocale();
  useLayoutEffect(() => {
    if (!frameRef.current) return;
    const playback = startApplicationPlayback(frameRef.current, 'api');
    return () => playback.dispose();
  }, [frameRef, locale]);
  return null;
}
