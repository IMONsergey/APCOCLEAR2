import { expect, test } from '@playwright/test';

for (const path of ['./', './about/', './legal/privacy-policy/']) {
  test(`footer actions appear only after delayed page content commits: ${path}`, async ({
    page,
  }) => {
    let release: () => void = () => undefined;
    const held = new Promise<void>((resolve) => {
      release = resolve;
    });
    await page.route(/\/(?:HomePage|CorporatePages|LegalPages)-[\w-]+\.js$/, async (route) => {
      await held;
      await route.continue();
    });
    try {
      const navigation = page.goto(path);
      await expect(page.locator('main .route-fallback')).toBeVisible();
      await expect(page.locator('footer')).toHaveCount(0);
      release();
      await navigation;
      await expect(page.locator('main h1')).toBeVisible();
      await page.getByRole('button', { name: 'Cookie Preferences' }).click();
      const dialog = page.getByRole('dialog', { name: 'Cookie Preferences' });
      await expect(dialog).toBeVisible();
      await dialog.getByRole('button', { name: 'Save Preferences' }).click();
      await expect(dialog).toBeHidden();
    } finally {
      release();
    }
  });
}

// Delay route code deliberately: a fast development machine must not hide a collapsing fallback.
for (const width of [390, 1440]) {
  for (const path of ['./', './about/', './legal/privacy-policy/']) {
    test(`cold load keeps the first screen stable: ${path} at ${width}px`, async ({
      page,
      browserName,
    }) => {
      test.skip(browserName !== 'chromium', 'Layout Instability API is Chromium-only.');
      await page.setViewportSize({ width, height: 1000 });
      await page.emulateMedia({ reducedMotion: 'no-preference' });
      await page.addInitScript(() => {
        const shifts: { time: number; value: number }[] = [];
        Object.assign(window, { __loadShifts: shifts });
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            const shift = entry as PerformanceEntry & { value: number; hadRecentInput: boolean };
            if (!shift.hadRecentInput) shifts.push({ time: shift.startTime, value: shift.value });
          }
        }).observe({ type: 'layout-shift', buffered: true });
      });
      await page.route(/\/(?:HomePage|CorporatePages|LegalPages)-[\w-]+\.js$/, async (route) => {
        await new Promise((resolve) => setTimeout(resolve, 350));
        await route.continue();
      });
      await page.goto(path);
      await expect(page.locator('main h1')).toBeVisible();
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(1200);
      const cls = await page.evaluate(() => {
        const shifts = (window as unknown as { __loadShifts: { time: number; value: number }[] })
          .__loadShifts;
        let start = 0,
          last = 0,
          sum = 0,
          max = 0;
        for (const shift of shifts) {
          if (shift.time - last > 1000 || shift.time - start > 5000) {
            start = shift.time;
            sum = 0;
          }
          sum += shift.value;
          last = shift.time;
          max = Math.max(max, sum);
        }
        return max;
      });
      expect(
        cls,
        'Cold-load CLS must stay below 0.05, including delayed route download',
      ).toBeLessThanOrEqual(0.05);
    });
  }
}

test('Legal loads without homepage, product artwork or animation engines', async ({ page }) => {
  const assets: string[] = [];
  page.on('request', (request) => assets.push(new URL(request.url()).pathname));
  await page.goto('./legal/privacy-policy/');
  await expect(page.locator('main h1')).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(400);
  expect(
    assets.filter((path) =>
      /\/(?:HomePage|PageFrame|ThemedArtwork|evidencePlayback|gsap|applicationPlayback)-/.test(
        path,
      ),
    ),
  ).toEqual([]);
});
