import { createPlaybackClock, easeInOutCubic, playbackProgress } from '../../../lib/playback';
import type { ApplicationScene } from './ApplicationFrame';

const targets: Record<ApplicationScene, readonly string[]> = {
  query: ['query-input', 'query-submit', 'query-examples', 'query-examples'],
  results: ['query-input', 'country-filter', 'result-first', 'result-first'],
  host: ['host-address', 'host-services', 'host-response', 'host-product'],
  evidence: ['tls-service', 'tls-identity', 'tls-validity', 'tls-names'],
  suggestions: ['refine-condition', 'refine-applied', 'query-submit', 'result-first'],
  api: ['api-key', 'api-copy', 'api-usage', 'api-limits'],
};

// The outline can explain a group while the pointer identifies its selected item.
const cursorTargets: Readonly<Record<string, string>> = {
  'country-filter': '.application-facet--de',
  'host-address': 'strong',
  'host-services': '[data-selected="true"]',
  'refine-applied': ':scope > span:first-child',
};

/** Native playback decorates the complete, translated HTML without owning its layout. */
export function startApplicationPlayback(root: HTMLElement, scene: ApplicationScene) {
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  // The change event owns this state and restores the static frame before rendering stops.
  let reduced = preference.matches;
  const cursor = root.querySelector<HTMLElement>('.application-demo-cursor');
  const cursorStyle = cursor && {
    transform: cursor.style.transform,
    opacity: cursor.style.opacity,
    visibility: cursor.style.visibility,
  };
  const query = root.querySelector<HTMLElement>('[data-demo-query]');
  const queryText = query?.textContent ?? '';
  const focusTargets = targets[scene].flatMap((name, index) => {
    const element = root.querySelector<HTMLElement>(`[data-demo-target="${name}"]`);
    if (!element) return [];
    const selector = cursorTargets[name];
    const cursorElement = selector ? element.querySelector<HTMLElement>(selector) : element;
    return [
      {
        element,
        cursorElement: cursorElement ?? element,
        index,
        emphasis: element.style.getPropertyValue('--demo-emphasis'),
        x: 0,
        y: 0,
      },
    ];
  });
  let visible = false;
  let disposed = false;
  let resizeFrame = 0;
  let previousPhase = -1;

  function restore() {
    if (cursor && cursorStyle) Object.assign(cursor.style, cursorStyle);
    for (const { element, emphasis } of focusTargets)
      element.style.setProperty('--demo-emphasis', emphasis);
    root.dataset.demoPhase = '0';
    delete root.dataset.demoFilter;
    delete root.dataset.demoCopied;
    delete root.dataset.apiView;
    previousPhase = -1;
    if (query) query.textContent = queryText;
  }

  function measure() {
    const bounds = root.getBoundingClientRect();
    for (const target of focusTargets) {
      const element = target.cursorElement.getBoundingClientRect();
      target.x = element.left - bounds.left + Math.min(element.width - 8, element.width * 0.75);
      target.y = element.top - bounds.top + Math.min(element.height - 6, element.height * 0.65);
    }
  }

  const clock = createPlaybackClock((elapsed) => {
    if (!cursor || reduced || disposed) return;
    if (!root.isConnected || document.hidden) {
      clock.setPlaying(false);
      root.dataset.demoPlayback = 'paused';
      return;
    }
    // Four 1.8-second phases followed by the original 0.8-second reading pause.
    const time = (elapsed / 1000) % 8;
    const phase = Math.min(3, Math.floor(time / 1.8));
    if (phase !== previousPhase) {
      previousPhase = phase;
      root.dataset.demoPhase = String(phase);
      if (scene === 'results') root.dataset.demoFilter = phase >= 2 ? 'country' : '';
      if (scene === 'api') {
        root.dataset.demoCopied = String(phase >= 1);
        root.dataset.apiView = phase >= 2 ? 'usage' : 'key';
      }
      // Filter/copy labels can reflow in a translation without resizing the outer frame.
      measure();
    }

    let previous = { x: 0, y: 0 };
    let position = previous;
    const activeElement = focusTargets[phase]?.element;
    for (const target of focusTargets) {
      const start = target.index * 1.8;
      const local = time - start;
      const entering = playbackProgress(time, start + 0.4, 0.25);
      const leaving = playbackProgress(time, start + 1.35, 0.35);
      const emphasis = local < 1.35 ? 1 - (1 - entering) ** 2 : (1 - leaving) ** 2;
      // A repeated reading target must not be cleared by its inactive phase.
      if (target.element !== activeElement || target.index === phase)
        target.element.style.setProperty('--demo-emphasis', emphasis.toFixed(4));
      if (target.index <= phase) {
        const move = easeInOutCubic(playbackProgress(time, start, 0.5));
        position = {
          x: previous.x + (target.x - previous.x) * move,
          y: previous.y + (target.y - previous.y) * move,
        };
        previous = target;
      }
    }
    cursor.style.transform = `translate(${position.x}px, ${position.y}px)`;
    cursor.style.opacity = String(easeInOutCubic(playbackProgress(time, 0, 0.5)));
    cursor.style.visibility = time > 0 ? 'visible' : 'hidden';
    if (scene === 'query' && query) {
      const text = queryText.slice(
        0,
        Math.ceil(queryText.length * playbackProgress(time, 0.4, 0.8)),
      );
      if (query.textContent !== text) query.textContent = text;
    }
  });

  function synchronize() {
    if (disposed) return;
    if (!cursor || reduced) {
      clock.reset();
      restore();
      root.dataset.demoPlayback = 'static';
      return;
    }
    const playing = visible && !document.hidden && root.isConnected;
    clock.setPlaying(playing);
    root.dataset.demoPlayback = playing ? 'playing' : 'paused';
  }

  function motionChanged(event: MediaQueryListEvent) {
    reduced = event.matches;
    synchronize();
  }

  const intersection = new IntersectionObserver(
    (entries) => {
      visible = entries.some((entry) => entry.isIntersecting && entry.intersectionRatio > 0);
      synchronize();
    },
    { threshold: [0, 0.05] },
  );
  intersection.observe(root);
  const resize = new ResizeObserver(() => {
    if (resizeFrame || disposed) return;
    resizeFrame = requestAnimationFrame(() => {
      resizeFrame = 0;
      if (disposed) return;
      measure();
      if (!reduced) clock.refresh();
    });
  });
  resize.observe(root);
  for (const { element, cursorElement } of focusTargets) {
    resize.observe(element);
    if (cursorElement !== element) resize.observe(cursorElement);
  }
  document.addEventListener('visibilitychange', synchronize);
  preference.addEventListener('change', motionChanged);
  measure();
  synchronize();
  return () => {
    disposed = true;
    intersection.disconnect();
    resize.disconnect();
    cancelAnimationFrame(resizeFrame);
    document.removeEventListener('visibilitychange', synchronize);
    preference.removeEventListener('change', motionChanged);
    clock.dispose();
    restore();
    root.dataset.demoPlayback = 'static';
  };
}
