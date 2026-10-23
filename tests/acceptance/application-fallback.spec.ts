import { expect, test } from '@playwright/test';

test('all six application frames remain readable when their motion chunks fail', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  const failed = new Set<string>();
  await page.route(
    /\/assets\/(?:StepDemoMount|ApiDemoMount|applicationPlayback)-[^/]+\.js$/,
    async (route) => {
      failed.add(route.request().url());
      await route.abort('failed');
    },
  );
  await page.goto('./');
  for (const [scene, heading] of [
    ['query', '.application-query-title'],
    ['results', '.application-results-heading'],
    ['host', '.application-host-services-title'],
    ['evidence', '.application-certificate-title'],
    ['suggestions', '.application-refine-heading'],
    ['api', '.application-api__heading'],
  ]) {
    const frame = page.locator(`.application-scene[data-scene="${scene}"]`);
    await frame.scrollIntoViewIfNeeded();
    await page.waitForLoadState('networkidle');
    await expect(frame).toBeVisible();
    await expect(frame).toHaveAttribute('data-demo-playback', 'static');
    await expect(frame.locator(heading!)).toBeVisible();
    await expect(frame.locator(heading!)).not.toBeEmpty();
    expect(
      await frame
        .locator('img')
        .evaluateAll((images) =>
          images.every(
            (image) =>
              image instanceof HTMLImageElement && image.complete && image.naturalWidth > 0,
          ),
        ),
    ).toBe(true);
  }
  expect([...failed].some((url) => url.includes('/StepDemoMount-'))).toBe(true);
  expect([...failed].some((url) => url.includes('/ApiDemoMount-'))).toBe(true);
  await expect(page.locator('.application-scene')).toHaveCount(6);
  await expect(page.locator('main[data-startup-error]')).toHaveCount(0);
});
