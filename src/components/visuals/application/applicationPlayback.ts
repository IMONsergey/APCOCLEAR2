import { gsap } from 'gsap';
import type { ApplicationScene } from './ApplicationFrame';

const targets: Record<ApplicationScene, readonly string[]> = {
  query: ['query-input', 'query-submit', 'query-examples', 'query-hint'],
  results: ['query-input', 'country-filter', 'result-first', 'result-next'],
  host: ['host-address', 'host-services', 'host-response', 'host-product'],
  evidence: ['tls-tab', 'tls-identity', 'tls-validity', 'tls-fingerprint'],
  suggestions: ['refine-condition', 'refine-applied', 'query-submit', 'result-first'],
  api: ['api-key', 'api-copy', 'api-url', 'api-docs'],
};

/** GSAP owns only decorative motion; translated, useful HTML is always present. */
export function startApplicationPlayback(root: HTMLElement, scene: ApplicationScene) {
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const cursor = root.querySelector<HTMLElement>('.application-demo-cursor');
  const query = root.querySelector<HTMLElement>('[data-demo-query]');
  const queryText = query?.textContent ?? '';
  const focusTargets = targets[scene].map((name) =>
    root.querySelector<HTMLElement>(`[data-demo-target="${name}"]`),
  );
  let visible = false;
  let timeline: gsap.core.Timeline | null = null;
  let context: gsap.Context | null = null;
  let resizeFrame = 0;

  function reset() {
    root.dataset.demoPhase = '0';
    delete root.dataset.demoFilter;
    delete root.dataset.demoCopied;
    if (query) query.textContent = queryText;
  }

  function synchronize() {
    if (!timeline || preference.matches) {
      root.dataset.demoPlayback = 'static';
      return;
    }
    const playing = visible && !document.hidden && root.isConnected;
    timeline.paused(!playing);
    root.dataset.demoPlayback = playing ? 'playing' : 'paused';
  }

  function position(target: HTMLElement, axis: 'x' | 'y') {
    const bounds = root.getBoundingClientRect();
    const element = target.getBoundingClientRect();
    return axis === 'x'
      ? element.left - bounds.left + Math.min(element.width - 8, element.width * 0.75)
      : element.top - bounds.top + Math.min(element.height - 6, element.height * 0.65);
  }

  function build() {
    context?.revert();
    timeline = null;
    reset();
    if (!cursor || preference.matches) {
      synchronize();
      return;
    }
    context = gsap.context(() => {
      const clock = { progress: 0 };
      timeline = gsap.timeline({ paused: true, repeat: -1, repeatDelay: 0.8 });
      timeline.to(clock, { progress: 1, duration: 7.2, ease: 'none' }, 0);
      focusTargets.forEach((target, index) => {
        if (!target) return;
        const start = index * 1.8;
        timeline!.call(
          () => {
            root.dataset.demoPhase = String(index);
            if (scene === 'results') root.dataset.demoFilter = index === 0 ? '' : 'country';
            if (scene === 'api') root.dataset.demoCopied = String(index >= 1);
          },
          [],
          start,
        );
        timeline!.to(
          cursor,
          {
            x: () => position(target, 'x'),
            y: () => position(target, 'y'),
            autoAlpha: 1,
            duration: 0.5,
            ease: 'power2.inOut',
          },
          start,
        );
        timeline!.to(target, { '--demo-emphasis': 1, duration: 0.25 }, start + 0.4);
        timeline!.to(target, { '--demo-emphasis': 0, duration: 0.35 }, start + 1.35);
      });
      if (scene === 'query' && query) {
        const typing = { length: 0 };
        timeline.call(
          () => {
            query.textContent = '';
            typing.length = 0;
          },
          [],
          0,
        );
        timeline.to(
          typing,
          {
            length: queryText.length,
            duration: 0.8,
            ease: 'none',
            onUpdate: () => {
              query.textContent = queryText.slice(0, Math.ceil(typing.length));
            },
          },
          0.4,
        );
      }
    }, root);
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
    if (resizeFrame) return;
    resizeFrame = requestAnimationFrame(() => {
      resizeFrame = 0;
      timeline?.invalidate();
    });
  });
  resize.observe(root);
  document.addEventListener('visibilitychange', synchronize);
  preference.addEventListener('change', build);
  build();
  return () => {
    intersection.disconnect();
    resize.disconnect();
    cancelAnimationFrame(resizeFrame);
    document.removeEventListener('visibilitychange', synchronize);
    preference.removeEventListener('change', build);
    context?.revert();
    timeline = null;
    reset();
    root.dataset.demoPlayback = 'static';
  };
}
