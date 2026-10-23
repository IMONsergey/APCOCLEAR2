import type { ReactNode, RefObject } from 'react';
import type { ResearchScene } from '../../../content/research';
import { assetUrl } from '../../../content/assets';
import { useLocale } from '../../../i18n/context';
import { Logo } from '../../ui/Logo';
import './application-scene.css';

export type ApplicationScene = ResearchScene | 'api';

const designNodes: Record<ApplicationScene, string> = {
  query: '899:4021',
  results: '899:4117',
  host: '899:5079',
  evidence: '903:48414',
  suggestions: '903:48044',
  api: '903:53837',
};

/** A responsive excerpt of the application, with readable HTML before animation loads. */
export function ApplicationFrame({
  scene,
  frameRef,
  children,
}: {
  scene: ApplicationScene;
  frameRef: RefObject<HTMLDivElement | null>;
  children: ReactNode;
}) {
  const { t } = useLocale();
  const search = scene === 'query' || scene === 'results' || scene === 'suggestions';
  return (
    <div
      ref={frameRef}
      className="application-scene"
      data-scene={scene}
      data-design-source="figma-application"
      data-design-node={designNodes[scene]}
      data-demo-playback="static"
      data-demo-phase="0"
      aria-hidden="true"
      inert
    >
      <div className="application-toolbar">
        <Logo />
        {search ? (
          <div className="application-toolbar-actions">
            <span>
              {t('Filters')}
              <i
                className="application-toolbar-icon"
                style={{ maskImage: `url(${assetUrl('application', 'filter-plus.svg')})` }}
              />
            </span>
            <span>
              {t('All Types')}
              <i
                className="application-toolbar-icon application-toolbar-chevron"
                style={{ maskImage: `url(${assetUrl('application', 'type-chevron.svg')})` }}
              />
            </span>
          </div>
        ) : (
          <span className="application-toolbar-section">
            {scene === 'api' ? 'API' : t('Search')}
          </span>
        )}
      </div>
      {children}
      <span className="application-demo-cursor" />
    </div>
  );
}
