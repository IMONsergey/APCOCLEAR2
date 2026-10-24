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
  test(`${locale}: contact topics stay localized and changing them preserves the message`, async ({
    page,
  }) => {
    await page.goto(`./${locale}/contact`);
    await expect(page).toHaveURL(new RegExp(`/${locale}/contact/?$`));
    const form = page.locator('#contact-form');
    await expect(form.locator('select option:not([value=""])')).toHaveText(labels);
    await form.locator('[name="name"]').fill('Contact review');
    await form.locator('[name="email"]').fill('review@example.com');
    const message = 'A local review of the prepared message.';
    await form.locator('[name="message"]').fill(message);
    for (const value of [
      'Data & coverage',
      'API access',
      'Team & Business plan',
      'Billing & invoices',
      'Responsible scanning',
      'Other',
    ]) {
      await form.locator('[name="topic"]').selectOption(value);
      await expect(form.locator('[name="topic"]')).toHaveValue(value);
      await expect(form.locator('[name="message"]')).toHaveValue(message);
    }
    await expect(form.locator('.stage-form-actions button')).toHaveCount(1);
    await expect(form.locator('.stage-prepared-email')).toHaveCount(0);
    await expect(form.locator('.stage-note')).toHaveCount(0);
  });
}

test('changing the contact topic card clears stale validation without discarding the message', async ({
  page,
}) => {
  await page.goto('./contact');
  const form = page.locator('#contact-form');
  await form.locator('[name="name"]').fill('Contact review');
  await form.locator('[name="email"]').fill('review@example.com');
  await form.locator('[name="topic"]').selectOption('Other');
  await form.locator('[name="message"]').fill('         ok         ');
  await form.locator('[name="consent"]').check();
  await form.getByRole('button', { name: 'Email us' }).click();
  await expect(form.locator('.stage-form-status')).toContainText('at least 10 characters');
  await page
    .locator('.contact-topics button')
    .filter({ has: page.getByRole('heading', { name: 'API & integration', exact: true }) })
    .click();
  await expect(form.locator('[name="topic"]')).toHaveValue('API access');
  await expect(form.locator('[name="name"]')).toBeFocused();
  await expect(form.locator('.stage-form-status')).toHaveCount(0);
  await expect(form.locator('[name="message"]')).toHaveValue('         ok         ');
});
