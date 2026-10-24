import { expect, test, type Locator, type Page } from '@playwright/test';

test.use({ reducedMotion: 'no-preference' });

for (const width of [390, 1440]) {
  test(`application pointers identify the selected item inside a highlighted group at ${width}px`, async ({
    page,
  }) => {
    test.setTimeout(60000);
    await page.setViewportSize({ width, height: 950 });
    await page.goto('./');
    const targets = [
      {
        scene: 'results',
        phase: '1',
        group: 'country-filter',
        item: '.application-facet--de',
        text: 'Germany',
      },
      {
        scene: 'results',
        phase: '2',
        group: 'result-first',
        item: '[data-demo-target="result-first"]',
        text: /192\.0\.2\.10[\s\S]*Germany/,
      },
      {
        scene: 'host',
        phase: '0',
        group: 'host-address',
        item: '[data-demo-target="host-address"] strong',
        text: '192.0.2.10',
      },
      {
        scene: 'host',
        phase: '1',
        group: 'host-services',
        item: '.application-services [data-selected="true"]',
        text: '443 HTTPS',
      },
      {
        scene: 'suggestions',
        phase: '1',
        group: 'refine-applied',
        item: '.application-applied > span:first-child',
        text: 'Domain · node-1.example.com',
      },
    ];
    for (const target of targets) {
      const scene = page.locator(`.application-scene[data-scene="${target.scene}"]`);
      await scene.scrollIntoViewIfNeeded();
      await expect(scene.locator(target.item)).toHaveText(target.text);
      await expect
        .poll(
          () =>
            scene.evaluate(
              (root, target) => {
                if (root.getAttribute('data-demo-phase') !== target.phase) return false;
                const cursor = root.querySelector('.application-demo-cursor')!;
                const style = getComputedStyle(cursor);
                if (style.visibility !== 'visible' || Number(style.opacity) < 0.8) return false;
                const group = root.querySelector(`[data-demo-target="${target.group}"]`)!;
                if (Number(getComputedStyle(group).getPropertyValue('--demo-emphasis')) < 0.8)
                  return false;
                const bounds = cursor.getBoundingClientRect();
                const point = {
                  x: bounds.left + bounds.width / 2,
                  y: bounds.top + bounds.height / 2,
                };
                const item = root.querySelector(target.item)!.getBoundingClientRect();
                return (
                  point.x >= item.left - 1 &&
                  point.x <= item.right + 1 &&
                  point.y >= item.top - 1 &&
                  point.y <= item.bottom + 1
                );
              },
              { phase: target.phase, group: target.group, item: target.item },
            ),
          {
            timeout: 12000,
            intervals: [50, 100],
            message: `${target.scene}: the pointer identifies ${target.item}, not an adjacent item`,
          },
        )
        .toBe(true);
    }
  });
}

test('a live reduced-motion change restores the complete query while it is being typed', async ({
  page,
}) => {
  await page.goto('./');
  const scene = page.locator('.application-scene[data-scene="query"]');
  await scene.scrollIntoViewIfNeeded();
  await expect(scene).toHaveAttribute('data-demo-playback', 'playing');
  const query = scene.locator('[data-demo-query]');
  await expect
    .poll(async () => (await query.textContent())?.length, { timeout: 12000 })
    .toBeLessThan(5);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(scene).toHaveAttribute('data-demo-playback', 'static');
  await expect(scene).toHaveAttribute('data-demo-phase', '0');
  await expect(query).toHaveText('nginx');
  await expect(scene.locator('.application-demo-cursor')).toBeHidden();
  await page.waitForTimeout(1800);
  await expect(query).toHaveText('nginx');
  await expect(scene).toHaveAttribute('data-demo-phase', '0');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await expect(scene).toHaveAttribute('data-demo-playback', 'playing');
  await expect(scene.locator('.application-demo-cursor')).toBeVisible();
  await expect(scene).toHaveAttribute('data-demo-phase', '1');
});

for (const width of [390, 1440]) {
  test(`the application API keeps its frame stable between key and usage panels at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 950 });
    await page.goto('./');
    const scene = page.locator('.application-scene[data-scene="api"]');
    await scene.scrollIntoViewIfNeeded();
    await expect(scene).toHaveAttribute('data-demo-playback', 'playing');
    await expect(scene).toHaveAttribute('data-demo-phase', '1');
    await expect(scene.locator('[data-api-panel="key"]')).toBeVisible();
    await expect(scene.locator('[data-api-panel="usage"]')).toBeHidden();
    await expect(scene.locator('[data-demo-target="api-key"]')).toHaveText(/^•{16}$/);
    const keyFrame = await scene.boundingBox();
    expect(keyFrame).not.toBeNull();

    await expect(scene).toHaveAttribute('data-demo-phase', '2');
    const usagePanel = scene.locator('[data-api-panel="usage"]');
    await expect(usagePanel).toBeVisible();
    await expect(scene.locator('[data-api-panel="key"]')).toBeHidden();
    const usageMeters = usagePanel.locator('[role="meter"]:visible');
    await expect(usageMeters).toHaveCount(2);
    await expect(scene.locator('[role="meter"]:visible')).toHaveCount(2);
    const number = new Intl.NumberFormat('en');
    for (const [index, [current, maximum]] of [
      [1240500, 1500000],
      [327680, 327680],
    ].entries()) {
      await expect(usageMeters.nth(index)).toHaveAttribute('aria-valuenow', String(current));
      await expect(usageMeters.nth(index)).toHaveAttribute('aria-valuemax', String(maximum));
      const value = usagePanel.locator('.application-api__credit-value').nth(index);
      await expect(value.locator('span').first()).toHaveText(number.format(current!));
      await expect(value.locator('span').last()).toContainText(number.format(maximum!));
    }
    const usageFrame = await scene.boundingBox();
    expect(usageFrame).not.toBeNull();
    expect(
      Math.abs(usageFrame!.width - keyFrame!.width),
      'switching panels preserves the API frame width',
    ).toBeLessThanOrEqual(1);
    expect(
      Math.abs(usageFrame!.height - keyFrame!.height),
      'switching panels preserves the API frame height',
    ).toBeLessThanOrEqual(1);

    await page.emulateMedia({ reducedMotion: 'reduce' });
    await expect(scene).toHaveAttribute('data-demo-playback', 'static');
    await expect(scene).toHaveAttribute('data-demo-phase', '0');
    await expect(scene.locator('[data-api-panel="key"]')).toBeVisible();
    await expect(scene.locator('[data-api-panel="usage"]')).toBeHidden();
    await expect(scene.locator('.application-demo-cursor')).toBeHidden();
    const staticFrame = await scene.boundingBox();
    expect(staticFrame).not.toBeNull();
    expect(
      Math.abs(staticFrame!.height - keyFrame!.height),
      'reduced motion preserves the API frame height',
    ).toBeLessThanOrEqual(1);
  });
}

async function openEvidence(page: Page) {
  await page.goto('./platform/search-investigation');
  const sample = page.locator('.stage-workbench__record .product-evidence');
  await sample.scrollIntoViewIfNeeded();
  await page.mouse.move(1, 1);
  await expect(sample).toBeVisible();
  return sample;
}

async function readPlayback(sample: Locator) {
  return sample.evaluate((root) => {
    const cursor = getComputedStyle(root.querySelector('.evidence-cursor')!);
    const progress = getComputedStyle(root.querySelector('[data-playback-progress]')!);
    const matrix = new DOMMatrixReadOnly(
      cursor.transform === 'none' ? undefined : cursor.transform,
    );
    return {
      x: matrix.m41,
      y: matrix.m42,
      transform: cursor.transform,
      progress: progress.transform,
      visibility: cursor.visibility,
      opacity: Number(cursor.opacity),
      clips: [
        ...root.querySelectorAll('.product-evidence__query strong, .evidence-response code'),
      ].map((element) => getComputedStyle(element).clipPath),
    };
  });
}

async function expectMoving(sample: Locator) {
  await expect.poll(async () => (await readPlayback(sample)).opacity).toBeGreaterThan(0.25);
  const before = await readPlayback(sample);
  await expect
    .poll(
      async () => {
        const current = await readPlayback(sample);
        return Math.hypot(current.x - before.x, current.y - before.y);
      },
      { timeout: 6000, message: 'the rendered evidence cursor travels between real targets' },
    )
    .toBeGreaterThan(8);
  await expect.poll(async () => (await readPlayback(sample)).progress).not.toBe(before.progress);
}

async function expectReadableAndPaused(sample: Locator) {
  await expect.poll(async () => (await readPlayback(sample)).visibility).toBe('hidden');
  const before = await readPlayback(sample);
  expect(before.clips.every((clip) => clip === 'none')).toBe(true);
  // Longer than the authored reading pause, so a running loop cannot appear to pass by chance.
  await sample.page().waitForTimeout(1800);
  expect(await readPlayback(sample)).toEqual(before);
}

test('evidence playback moves, explicitly pauses with readable text and resumes', async ({
  page,
}) => {
  const sample = await openEvidence(page);
  await expectMoving(sample);
  await sample.getByRole('button', { name: 'Pause product animation' }).click();
  await page.mouse.move(1, 1);
  await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
  await expect(sample.getByRole('button', { name: 'Play product animation' })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await expectReadableAndPaused(sample);
  await sample.getByRole('button', { name: 'Play product animation' }).click();
  await page.mouse.move(1, 1);
  await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
  await expectMoving(sample);
});

test('pointer and keyboard interaction independently suspend evidence playback', async ({
  page,
}) => {
  const sample = await openEvidence(page);
  await expectMoving(sample);
  const query = sample.locator('.product-evidence__query');
  await query.hover();
  await expectReadableAndPaused(sample);
  const service = sample.locator('.product-evidence__service').first();
  await service.focus();
  await page.mouse.move(1, 1);
  await expect(service).toBeFocused();
  await expectReadableAndPaused(sample);
  await query.hover();
  await service.evaluate((element: HTMLElement) => element.blur());
  await expectReadableAndPaused(sample);
  await page.mouse.move(1, 1);
  await expectMoving(sample);
});

test('evidence playback freezes in a hidden tab and outside the viewport without skipping its place', async ({
  page,
}) => {
  const sample = await openEvidence(page);
  await expectMoving(sample);
  const hidden = await sample.evaluate(async (root) => {
    const descriptor = Object.getOwnPropertyDescriptor(document, 'hidden');
    const read = () => ({
      cursor: getComputedStyle(root.querySelector('.evidence-cursor')!).transform,
      progress: getComputedStyle(root.querySelector('[data-playback-progress]')!).transform,
    });
    try {
      Object.defineProperty(document, 'hidden', { configurable: true, value: true });
      document.dispatchEvent(new Event('visibilitychange'));
      const before = read();
      await new Promise((resolve) => setTimeout(resolve, 1800));
      return { before, after: read() };
    } finally {
      if (descriptor) Object.defineProperty(document, 'hidden', descriptor);
      else Reflect.deleteProperty(document, 'hidden');
      document.dispatchEvent(new Event('visibilitychange'));
    }
  });
  expect(hidden.after).toEqual(hidden.before);
  await expectMoving(sample);
  await page.locator('main h1').scrollIntoViewIfNeeded();
  await sample.evaluate(
    (root) =>
      new Promise<void>((resolve) => {
        const observer = new IntersectionObserver(([entry]) => {
          if (entry?.isIntersecting) return;
          observer.disconnect();
          requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
        });
        observer.observe(root);
      }),
  );
  const before = await readPlayback(sample);
  await page.waitForTimeout(1800);
  expect(await readPlayback(sample)).toEqual(before);
  await sample.scrollIntoViewIfNeeded();
  await expectMoving(sample);
});

test('evidence playback follows resized targets, restores static text and cleans up on navigation', async ({
  page,
}) => {
  const sample = await openEvidence(page);
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 950 });
    await sample.scrollIntoViewIfNeeded();
    await expectMoving(sample);
    const inside = await sample.evaluate((root) => {
      const bounds = root.getBoundingClientRect();
      const cursor = root.querySelector('.evidence-cursor')!.getBoundingClientRect();
      return (
        cursor.left >= bounds.left - 1 &&
        cursor.right <= bounds.right + 1 &&
        cursor.top >= bounds.top - 1 &&
        cursor.bottom <= bounds.bottom + 1
      );
    });
    expect(inside, 'the cursor stays aligned with the resized evidence panel').toBe(true);
  }
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(sample.locator('.evidence-cursor')).toBeHidden();
  await expect
    .poll(async () => (await readPlayback(sample)).clips.every((clip) => clip === 'none'))
    .toBe(true);
  await expect(sample.locator('.evidence-response')).toContainText('HTTP/1.1 200 OK');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await expectMoving(sample);
  const detached = await sample.evaluate(async (root) => {
    document.querySelector<HTMLAnchorElement>('a[href$="/about"]')!.click();
    const started = performance.now();
    while (root.isConnected && performance.now() - started < 5000)
      await new Promise((resolve) => setTimeout(resolve, 50));
    let mutations = 0;
    const observer = new MutationObserver((records) => {
      mutations += records.length;
    });
    observer.observe(root, { attributes: true, childList: true, subtree: true });
    await new Promise((resolve) => setTimeout(resolve, 1800));
    observer.disconnect();
    return {
      connected: root.isConnected,
      mutations,
      cursorTransform: root.querySelector<HTMLElement>('.evidence-cursor')!.style.transform,
    };
  });
  expect(detached).toEqual({ connected: false, mutations: 0, cursorTransform: '' });
  await expect(page).toHaveURL(/\/about$/);
});
