import { test, expect, type Page } from '@playwright/test';
import { revealHeader } from '../helpers/locale';

async function visit(page: Page, width = 1440, height = 1000) {
  await page.setViewportSize({ width, height });
  await page.goto('./', { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
}

for (const width of [320, 390, 768, 1200, 1440, 1920]) {
  test('English content remains readable and intrinsic at ' + width + 'px', async ({ page }) => {
    await visit(page, width);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');

    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
      width + 1,
    );

    const overflow = await page
      .locator('main h1, main h2, main h3, main p')
      .evaluateAll((nodes) =>
        nodes
          .filter(
            (node) =>
              !node.closest('[inert], [aria-hidden="true"], .sr-only') &&
              node.clientWidth > 0 &&
              node.scrollWidth > node.clientWidth + 2,
          )
          .map((node) => node.textContent),
      );

    expect(overflow).toEqual([]);
  });
}

for (const width of [390, 768, 1440]) {
  test(
    'expanded FAQ retains native disclosure and reflows at ' + width + 'px',
    async ({ page }) => {
      await visit(page, width);
      await page.locator('#faq').scrollIntoViewIfNeeded();

      const details = page.locator('.faq-list details').nth(1);
      await details.locator('summary').click();
      await expect(details).toHaveAttribute('open', '');
      await expect(details.locator('.faq-answer')).not.toHaveAttribute('inert');
    },
  );
}

for (const width of [390, 1440]) {
  test(
    'directional header keeps language menu and keyboard usable at ' + width + 'px',
    async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'no-preference' });
      await visit(page, width);

      const header = page.locator('.site-header');
      await page.mouse.wheel(0, 1200);
      await expect(header).toHaveAttribute('data-hidden', 'true');

      await revealHeader(page);
      await page.locator('[data-language-selector]').click();
      await expect(page.locator('.language-panel')).toHaveCSS('opacity', '1');

      await page.keyboard.press('Escape');
      await expect(page.locator('[data-language-selector]')).toBeFocused();
    },
  );
}

test('Figma API remains static until viewed, then plays, pauses and resumes with navigation', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await visit(page, 1440);

  const demo = page.locator('.application-scene[data-scene="api"]');
  await expect(demo).toHaveAttribute('data-demo-playback', 'static');
  await expect(demo.locator('.application-api__heading')).toHaveText('Build with APCOSYS');
  await page.locator('#api').scrollIntoViewIfNeeded();
  await demo.scrollIntoViewIfNeeded();

  const cursorTransform = () =>
    demo
      .locator('.application-demo-cursor')
      .evaluate((cursor) => getComputedStyle(cursor).transform);
  await expect(demo).toHaveAttribute('data-demo-playback', 'playing');
  await expect(demo.locator('.application-demo-cursor')).toBeVisible();
  const initial = await cursorTransform();
  await expect.poll(cursorTransform).not.toBe(initial);

  await page.locator('.hero h1').scrollIntoViewIfNeeded();
  await expect(demo).toHaveAttribute('data-demo-playback', 'paused');
  const resting = {
    transform: await cursorTransform(),
    phase: await demo.getAttribute('data-demo-phase'),
  };
  await page.waitForTimeout(2100);
  expect({
    transform: await cursorTransform(),
    phase: await demo.getAttribute('data-demo-phase'),
  }).toEqual(resting);

  await demo.scrollIntoViewIfNeeded();
  await expect(demo).toHaveAttribute('data-demo-playback', 'playing');
  const resumed = await cursorTransform();
  await expect.poll(cursorTransform).not.toBe(resumed);
});

test('reduced motion keeps globe visible and closing action usable on phone', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await visit(page, 390, 844);

  await page.locator('#data').scrollIntoViewIfNeeded();
  await expect(page.locator('.signal-globe canvas')).toBeVisible();

  await page.locator('.closing-section').scrollIntoViewIfNeeded();
  await expect(page.locator('.closing-copy .double-button')).toBeVisible();
});

test('footer underline feedback does not change geometry', async ({ page }) => {
  await visit(page, 1440);
  await page.locator('.footer').scrollIntoViewIfNeeded();

  const link = page.locator('.footer a').filter({ hasText: 'Search & Investigation' }).first();
  const before = await link.boundingBox();
  await link.hover();
  const after = await link.boundingBox();

  expect(after).toEqual(before);
});
