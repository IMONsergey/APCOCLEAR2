import { expect, test } from '@playwright/test';
import { deploymentSettings } from '../helpers/public-settings';

test('Hero keeps one real search and immediately visible connected examples', async ({ page }) => {
  await page.goto('./');
  await expect(page.locator('.hero .search-form')).toHaveCount(0);
  await expect(page.locator('.search-preview .search-form')).toHaveCount(1);
  const preview = page.locator('.search-scene__results');
  await expect(preview).toBeVisible();
  await expect(preview.locator('.product-evidence__details')).toContainText('nginx 1.24.0');
  await page.getByRole('button', { name: 'Technology', exact: true }).click();
  await expect(preview.locator('.product-evidence__query')).toContainText('nginx 1.24.0');
  await expect(preview.locator('.product-evidence__cve')).toBeVisible();
  await page.getByRole('button', { name: 'IP address', exact: true }).click();
  await expect(preview.locator('.product-evidence__result')).toHaveCount(1);
});

test('investigation results, selected host and context share one UI fragment', async ({ page }) => {
  await page.goto('./platform/search-investigation');
  const steps = page.locator('.stage-workbench__step');
  await expect(steps).toHaveCount(5);
  await steps.nth(1).click();
  const results = page.locator('.stage-workbench .product-evidence');
  await expect(results).toBeVisible();
  await expect(results.locator('.product-evidence__result')).toHaveCount(2);
  await results.locator('.product-evidence__result').nth(1).click();
  await expect(results.locator('.product-evidence__details h3')).toContainText('203.0.113.42');
  await steps.nth(3).click();
  await expect(page.locator('.stage-workbench .product-evidence__cve')).toBeVisible();
  await expect(results.locator('.product-evidence__details h3')).toContainText('203.0.113.42');
  await expect(page.locator('.stage-workbench')).toContainText('No CVE is asserted');
});

test('Monitoring has five meaningful concept states and selectable example assets', async ({
  page,
}) => {
  await page.goto('./platform/monitoring');
  const steps = page.locator('.stage-monitor-console__nav');
  await expect(steps).toHaveCount(5);
  await expect(page.locator('.stage-monitor-assets__list button')).toHaveCount(2);
  await page.locator('.stage-monitor-assets__list button').nth(1).click();
  await expect(page.locator('.stage-monitor-assets__details')).toContainText('203.0.113.42');
  await steps.nth(1).click();
  await expect(page.locator('.stage-monitor-console__summary')).toContainText(
    '443 / HTTPS + 22 / SSH',
  );
  await steps.nth(4).click();
  await expect(page.locator('.stage-monitor-console__link')).toHaveAttribute(
    'href',
    /search-investigation/,
  );
  await expect(page.locator('.stage-monitor-console')).toContainText('NO LIVE ALERTS');
});

for (const [route, label] of [
  ['/use-cases/bug-bounty', 'Search your scope'],
  ['/use-cases/vulnerability-research', 'Search by technology'],
  ['/use-cases/osint-threat-investigation', 'Look up an IP or domain'],
] as const) {
  test(`Use Case ${route} demonstrates the investigation and contextual CTA`, async ({ page }) => {
    await page.goto('.' + route);
    const journey = page.locator('.stage-example-journey');
    await expect(journey.locator(':scope > div')).toHaveCount(4);
    for (const step of ['Starting point', 'Query', 'Result', 'Next step']) {
      await expect(journey).toContainText(step);
    }
    await expect(page.locator('.stage-case-evidence .case-fragment')).toBeVisible();
    await expect(page.getByRole('link', { name: label }).first()).toHaveAttribute(
      'href',
      /\/search$/,
    );
  });
}

test('Pricing explains units before comparison without changing the original cards', async ({
  page,
}) => {
  await page.goto('./pricing');
  for (const plan of ['free', 'plus', 'expert', 'business']) {
    await expect(page.locator('#plan-' + plan)).toBeVisible();
  }
  await expect(page.locator('.stage-usage-guide')).toContainText('Search Tokens');
  await expect(page.locator('.stage-usage-guide')).toContainText(
    'Plan allowances use credits; additional packages use Search Tokens.',
  );
  await expect(page.locator('.stage-usage-guide')).toContainText(
    'Check the conversion, available balance and package terms in your account before adding capacity.',
  );
  const sequence = await page.evaluate(() => {
    const guide = document.querySelector('.stage-usage-guide');
    const compare = document.querySelector('#compare-plans');
    return Boolean(
      guide && compare && guide.compareDocumentPosition(compare) & Node.DOCUMENT_POSITION_FOLLOWING,
    );
  });
  expect(sequence).toBe(true);
  await expect(page.locator('#search-token-packages')).toContainText('25,000');
});

test('API starts with the published HTTP request and labels synthetic response values', async ({
  page,
}) => {
  await page.goto('./developers/api');
  const code = page.locator('.stage-code-window');
  await expect(code.locator('pre')).toContainText('curl --request POST');
  await expect(code.locator('pre')).toContainText('https://api.apcosys.net/api/v1/search/hosts');
  await expect(code.locator('pre')).toContainText('X-API-Key: $APCOSYS_API_KEY');
  await expect(code.locator('.stage-api-auth')).toContainText('AUTHENTICATION');
  await expect(code.getByRole('button', { name: 'Response', exact: true })).toHaveAttribute(
    'aria-pressed',
    'false',
  );
  await code.getByRole('button', { name: 'Response', exact: true }).click();
  const response = JSON.parse((await code.locator('pre').textContent())!);
  expect(response).toMatchObject({
    total: expect.any(Number),
    page: 1,
    docs_per_page: 20,
    hosts: [
      expect.objectContaining({
        ip: '203.0.113.10',
        open_ports: [{ protocol: 'https', port: 443 }],
      }),
    ],
  });
  expect(response).not.toHaveProperty('services');
  await expect(code.locator('.stage-code-note')).toContainText('synthetic host data');
});

for (const locale of ['', 'ru/', 'zh-hant/']) {
  test(`${locale || 'en'} plan handoff copies the chosen annual plan and keeps the comparison open`, async ({
    page,
    context,
  }) => {
    let copied = '';
    await page.exposeFunction('capturePlanCopy', (text: string) => {
      copied = text;
    });
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'clipboard', {
        configurable: true,
        value: {
          writeText: (text: string) =>
            (Reflect.get(window, 'capturePlanCopy') as (value: string) => Promise<void>)(text),
        },
      });
    });
    await context.route(deploymentSettings.signInUrl, (route) =>
      route.fulfill({
        contentType: 'text/html',
        body: '<title>Product entry test</title><p>Account entry</p>',
      }),
    );
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(`./${locale}pricing`);
    await page.locator('.billing--desktop input[value="annually"]').check({ force: true });
    await page.locator('#plan-plus .plan-button').click();
    const dialog = page.getByRole('dialog');
    const handoff = dialog.locator('.plan-handoff');
    await handoff.getByRole('button').click();
    await expect.poll(() => copied).toMatch(/\bplus\b/i);
    expect(copied).toMatch(/480/);
    await expect(handoff.getByRole('status')).toBeVisible();
    const link = handoff.getByRole('link');
    await expect(link).toHaveAttribute('href', deploymentSettings.signInUrl);
    await expect(link).toHaveAttribute('target', '_blank');
    await expect(link).toHaveAttribute('rel', /noopener/);
    expect(new URL((await link.getAttribute('href'))!).searchParams.has('subscription')).toBe(
      false,
    );
    const [popup] = await Promise.all([page.waitForEvent('popup'), link.click()]);
    await expect(popup).toHaveURL(deploymentSettings.signInUrl);
    await popup.close();
    await expect(dialog).toBeVisible();
    await expect(dialog.locator('.selected-plan-price')).toContainText('40');
    await expect(page.locator('.billing--desktop input[value="annually"]')).toBeChecked();
  });
}

test('plan handoff provides a readable summary when clipboard access is denied on mobile', async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: () => Promise.reject(new DOMException('Denied', 'NotAllowedError')),
      },
    });
  });
  await page.setViewportSize({ width: 320, height: 840 });
  await page.goto('./pricing');
  await page.locator('#plan-business .plan-button').first().click();
  const handoff = page.getByRole('dialog').locator('.plan-handoff');
  await handoff.getByRole('button', { name: 'Copy plan details' }).click();
  const preview = handoff.getByRole('textbox', { name: 'Selected plan details' });
  await expect(preview).toBeVisible();
  await expect(preview).toHaveAttribute('readonly', '');
  await expect(preview).toHaveValue(/BUSINESS/);
  await expect(preview).toHaveValue(/900/);
  await expect(preview).toBeFocused();
  const rect = await preview.boundingBox();
  expect(rect!.x).toBeGreaterThanOrEqual(0);
  expect(rect!.x + rect!.width).toBeLessThanOrEqual(320);
});
