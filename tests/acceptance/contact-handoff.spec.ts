import { expect, test } from '@playwright/test';

const topicLabels = {
  ru: [
    'Данные и покрытие',
    'Доступ к API',
    'Команда и тариф Business',
    'Оплата и счета',
    'Ответственное сканирование',
    'Другое',
  ],
  'zh-hant': [
    '資料與涵蓋範圍',
    'API 存取',
    '團隊與 Business 方案',
    '帳單與發票',
    '負責任的掃描',
    '其他',
  ],
};

for (const [locale, labels] of Object.entries(topicLabels)) {
  test(`${locale}: every contact topic and generated subject use the selected language`, async ({
    page,
  }) => {
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'clipboard', {
        configurable: true,
        value: {
          writeText: () => Promise.reject(new DOMException('Unavailable', 'NotAllowedError')),
        },
      });
    });
    await page.goto(`./${locale}/contact`);
    // Static hosts may canonicalize directory routes with a trailing slash.
    await expect(page).toHaveURL(new RegExp(`/${locale}/contact/?$`));
    const contactUrl = page.url();
    const form = page.locator('#contact-form');
    await expect(form.locator('select option:not([value=""])')).toHaveText(labels);
    await form.locator('[name="name"]').fill('Contact review');
    await form.locator('[name="email"]').fill('review@example.com');
    await form.locator('[name="message"]').fill('A local review of the prepared message.');
    await form.locator('[name="consent"]').check();
    for (const [value, label] of [
      ['Data & coverage', labels[0]!],
      ['API access', labels[1]!],
      ['Team & Business plan', labels[2]!],
      ['Billing & invoices', labels[3]!],
      ['Responsible scanning', labels[4]!],
      ['Other', labels[5]!],
    ]) {
      await form.locator('[name="topic"]').selectOption(value!);
      await form.locator('.stage-form-actions button').nth(1).click();
      const prepared = form.locator('.stage-prepared-email textarea');
      await expect(prepared).toBeVisible();
      const draftText = async () => (await prepared.inputValue()).replace(/\u00a0/g, ' ');
      await expect.poll(draftText).toContain(`Apcosys: ${label}`);
      expect((await draftText()).split(label!).length - 1).toBe(2);
      await expect(prepared).toBeFocused();
      await expect(page).toHaveURL(contactUrl);
    }
  });
}

for (const result of ['resolve', 'reject'] as const) {
  test(`changing the contact topic card invalidates a late clipboard ${result}`, async ({
    page,
  }) => {
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'clipboard', {
        configurable: true,
        value: {
          writeText: () =>
            new Promise<void>((resolve, reject) => {
              window.addEventListener('review-clipboard-resolve', () => resolve(), { once: true });
              window.addEventListener(
                'review-clipboard-reject',
                () => reject(new Error('Denied')),
                { once: true },
              );
            }),
        },
      });
    });
    await page.goto('./contact');
    const form = page.locator('#contact-form');
    await form.locator('[name="name"]').fill('Contact review');
    await form.locator('[name="email"]').fill('review@example.com');
    await form.locator('[name="topic"]').selectOption('Other');
    await form.locator('[name="message"]').fill('A local review of the prepared message.');
    await form.locator('[name="consent"]').check();
    await form.getByRole('button', { name: 'Copy email text' }).click();
    await expect(form.locator('.stage-prepared-email textarea')).toHaveValue(/Apcosys: Other/);
    await page
      .locator('.contact-topics button')
      .filter({ has: page.getByRole('heading', { name: 'API & integration', exact: true }) })
      .click();
    await expect(form.locator('[name="topic"]')).toHaveValue('API access');
    await expect(form.locator('[name="name"]')).toBeFocused();
    await expect(form.locator('.stage-prepared-email')).toHaveCount(0);
    await expect(form.locator('.stage-form-status')).toHaveCount(0);
    await page.evaluate(async (outcome) => {
      window.dispatchEvent(new Event(`review-clipboard-${outcome}`));
      await new Promise(requestAnimationFrame);
      await new Promise(requestAnimationFrame);
    }, result);
    await expect(form.locator('.stage-prepared-email')).toHaveCount(0);
    await expect(form.locator('.stage-form-status')).toHaveCount(0);
    await expect(form.locator('[name="name"]')).toBeFocused();
    await expect(form.locator('[name="topic"]')).toHaveValue('API access');
    await expect(form.locator('[name="message"]')).toHaveValue(
      'A local review of the prepared message.',
    );
  });
}

for (const result of ['resolve', 'reject'] as const) {
  test(`clearing a contact draft survives a late clipboard ${result}`, async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'clipboard', {
        configurable: true,
        value: {
          writeText: () =>
            new Promise<void>((resolve, reject) => {
              window.addEventListener('review-clipboard-resolve', () => resolve(), { once: true });
              window.addEventListener(
                'review-clipboard-reject',
                () => reject(new Error('Denied')),
                {
                  once: true,
                },
              );
            }),
        },
      });
    });
    await page.goto('./contact');
    const form = page.locator('#contact-form');
    await form.locator('[name="name"]').fill('Contact review');
    await form.locator('[name="email"]').fill('review@example.com');
    await form.locator('[name="topic"]').selectOption('Other');
    await form.locator('[name="message"]').fill('A local review of the prepared message.');
    await form.locator('[name="consent"]').check();
    await form.getByRole('button', { name: 'Copy email text' }).click();
    await expect(form.locator('.stage-prepared-email')).toBeVisible();
    await form.getByRole('button', { name: 'Clear draft' }).focus();
    await page.keyboard.press('Enter');
    await expect(form.locator('.stage-form-status')).toHaveText('Draft cleared.');
    await page.evaluate(async (outcome) => {
      window.dispatchEvent(new Event(`review-clipboard-${outcome}`));
      await new Promise(requestAnimationFrame);
    }, result);
    await expect(form.locator('.stage-form-status')).toHaveText('Draft cleared.');
    await expect(form.locator('.stage-prepared-email')).toHaveCount(0);
    await expect(form.locator('[name="message"]')).toHaveValue('');
    await expect(form.getByRole('button', { name: 'Clear draft' })).toBeFocused();
  });
}
