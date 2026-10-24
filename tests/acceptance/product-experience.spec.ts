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
  await expect(results.locator('.product-evidence__result[aria-pressed="true"]')).toHaveCSS(
    'outline-style',
    'none',
  );
  await steps.nth(3).focus();
  await steps.nth(3).press('ArrowRight');
  await expect(steps.nth(4)).toBeFocused();
  await expect(steps.nth(4)).toHaveCSS('text-decoration-line', 'underline');
  await expect(results.locator('.product-evidence__next')).toContainText('gateway.example.com');
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
  await steps.nth(3).click();
  await expect(page.locator('.monitor-context pre')).toHaveText('SSH-2.0-OpenSSH_9.6');
  await expect(page.locator('.stage-monitor-assets__list [aria-pressed="true"]')).toHaveCSS(
    'outline-style',
    'none',
  );
  await steps.nth(4).click();
  await expect(page.locator('.stage-monitor-console__link')).toHaveAttribute(
    'href',
    /search-investigation/,
  );
  await expect(page.locator('.stage-concept-label')).toBeVisible();
  await expect(page.locator('.stage-concept-label')).toContainText('Not a live product capability');
});

test('Teams keeps one stage rail and carries the selected evidence into the handoff', async ({
  page,
}) => {
  await page.goto('./teams');
  const stages = page.locator('.team-workflow__tabs button');
  await expect(stages).toHaveCount(4);
  await expect(page.locator('.team-workflow__tabs')).toHaveCount(1);
  await expect(page.locator('.team-workflow__record')).toContainText('portal.example.com');
  await stages.nth(1).click();
  await expect(stages.nth(1)).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('.team-workflow__record')).toContainText('HTTP Server header');
  await stages.nth(2).focus();
  await stages.nth(2).press('Enter');
  await expect(page.locator('.team-workflow__record')).toContainText('Check vendor advisory');
  await expect(stages.nth(2)).toHaveCSS('text-decoration-line', 'underline');
  await stages.nth(3).click();
  await expect(page.locator('.team-workflow__record')).toContainText(
    'Scripts and internal reports',
  );
  await expect(page.locator('.team-workflow__record')).toContainText('198.51.100.24');
  await expect(page.locator('.team-workflow__tabs [aria-pressed="true"]')).toHaveCSS(
    'outline-style',
    'none',
  );
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

test('API starts with the published HTTP request and labels the example response', async ({
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
  await expect(code.locator('.stage-code-note')).toHaveText('Example response');
});

for (const locale of ['', 'ru/', 'zh-hant/']) {
  test(`${locale || 'en'} plan handoff keeps the selected annual plan visible while opening Apcosys`, async ({
    page,
    context,
  }) => {
    await context.route(deploymentSettings.signInUrl, (route) =>
      route.fulfill({
        contentType: 'text/html',
        body: '<title>Product entry test</title><p>Account entry</p>',
      }),
    );
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(`./${locale}pricing`);
    await expect(page.locator('.billing--desktop input[value="annually"]')).toBeChecked();
    await page.locator('#plan-plus .plan-button').click();
    const dialog = page.getByRole('dialog');
    await expect(dialog.locator('.selected-plan-price')).toContainText('40');
    await expect(dialog).toContainText('480');
    const handoff = dialog.locator('.plan-handoff');
    await expect(handoff.getByRole('button')).toHaveCount(0);
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

test('mobile plan handoff retains one action and the complete annual price', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 840 });
  await page.goto('./pricing');
  await page.locator('#plan-business .plan-button').first().click();
  const dialog = page.getByRole('dialog');
  await expect(dialog.locator('.selected-plan-price')).toContainText('$720');
  await expect(dialog).toContainText('$8,640');
  await expect(dialog.locator('.plan-handoff button')).toHaveCount(0);
  await expect(dialog.locator('.plan-handoff textarea')).toHaveCount(0);
  const action = dialog.locator('.plan-handoff a');
  await expect(action).toBeVisible();
  const rect = await action.boundingBox();
  expect(rect!.x).toBeGreaterThanOrEqual(0);
  expect(rect!.x + rect!.width).toBeLessThanOrEqual(320);
});
