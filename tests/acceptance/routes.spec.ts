import { expect, test } from '@playwright/test';
import { siteRoutes } from '../../src/content/routes';

for (const route of siteRoutes) {
  test(`Route ${route.path} resolves with a unique heading`, async ({ page }) => {
    await page.goto(`.${route.path === '/' ? '/' : route.path}`);
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page).toHaveTitle(/Apcosys/i);
    await expect(page.locator('main')).toHaveAttribute('data-route', route.path);
    await expect(page.locator('.site-header')).toHaveCount(1);
    await expect(page.locator('.footer')).toHaveCount(1);
  });
}

test('Navigation changes URL and supports browser back', async ({ page }) => {
  await page.goto('./');
  await expect(page.locator('main h1')).toBeVisible();
  const group = page.getByRole('button', { name: 'Platform', exact: true });
  await group.click();
  await page.getByRole('link', { name: 'Search & Investigation' }).first().click();
  await expect(page).toHaveURL(/\/platform\/search-investigation$/);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Every investigation');
  await page.goBack();
  await expect(page.locator('main')).toHaveAttribute('data-route', '/');
});

test('Early navigation stays open when Home commits during a link press', async ({ page }) => {
  let release: () => void = () => undefined;
  const held = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route(/\/HomePage-[\w-]+\.js$/, async (route) => {
    await held;
    await route.continue();
  });
  try {
    const navigation = page.goto('./');
    await expect(page.locator('main .route-fallback')).toBeVisible();
    await expect(page.locator('footer')).toHaveCount(0);
    await page.evaluate(() => document.fonts.ready);
    const group = page.getByRole('button', { name: 'Platform', exact: true });
    await group.click();
    const link = page
      .locator('#nav-panel-0')
      .getByRole('link', { name: 'Search & Investigation', exact: true });
    await expect(group).toHaveAttribute('aria-expanded', 'true');
    await expect(link).toBeVisible();
    const before = await link.boundingBox();
    expect(before).not.toBeNull();
    await page.mouse.move(before!.x + before!.width / 2, before!.y + before!.height / 2);
    await page.mouse.down();

    // A lazy page and its footer must not close or move the navigation mid-gesture.
    release();
    await navigation;
    await expect(page.locator('main h1')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();
    await expect(group).toHaveAttribute('aria-expanded', 'true');
    await expect(link).toBeVisible();
    const after = await link.boundingBox();
    expect(after).not.toBeNull();
    for (const axis of ['x', 'y', 'width', 'height'] as const) {
      expect(
        Math.abs(after![axis] - before![axis]),
        `Navigation link ${axis} stays stable`,
      ).toBeLessThanOrEqual(1);
    }
    await page.mouse.up();
    await expect(page).toHaveURL(/\/platform\/search-investigation$/);
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Every investigation');
    await page.goBack();
    await expect(page.locator('main')).toHaveAttribute('data-route', '/');
    await expect(page.locator('main h1')).toBeVisible();
  } finally {
    release();
    await page.mouse.up();
  }
});

test('Protected preview keeps unverified monitoring visibly conceptual', async ({ page }) => {
  await page.goto('./platform/monitoring');
  await expect(
    page.getByText('Concept demonstration · Not a live product capability'),
  ).toBeVisible();
});

test('Contact form does not claim to send without a backend', async ({ page }) => {
  await page.goto('./contact');
  await expect(page.locator('#contact-form .stage-form-actions button')).toHaveCount(1);
  await expect(page.locator('#contact-form')).not.toContainText('Message sent');
  await expect(page.getByRole('button', { name: 'Email us' })).toBeVisible();
  await expect(page.getByLabel('Work email')).toHaveAttribute('type', 'email');
});

test('Cookie preferences disclose disabled analytics', async ({ page }) => {
  await page.goto('./');
  await page.getByRole('button', { name: 'Cookie Preferences' }).click();
  const dialog = page.getByRole('dialog', { name: 'Cookie Preferences' });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByText('Analytics', { exact: true })).toBeVisible();
  await dialog.getByRole('button', { name: 'Save Preferences' }).click();
  await expect(dialog).toBeHidden();
  expect(await page.evaluate(() => localStorage.getItem('apcosys-cookie-preferences'))).toBe(
    'essential',
  );
});
