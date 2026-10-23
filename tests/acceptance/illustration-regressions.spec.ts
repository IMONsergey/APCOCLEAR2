import { expect, test, type Locator, type Page } from '@playwright/test';

const locales = [
  {
    route: './',
    language: 'en',
    recent: 'Recent queries',
    countries: 'All countries',
    services: 'Open services',
    periods: ['7D', '30D', '90D', '1Y'],
    evidence: 'Evidence collected from 203.0.113.10:22',
    refine: 'Refine your query',
    request: 'Request',
    response: 'Response',
    apiNote: 'Illustrative host search response.',
    closing: 'Start with your first query.',
    action: 'Try free search',
    englishHint: 'Available in English',
    assessment: 'No CVE assessment is provided for this illustrative service.',
  },
  {
    route: './ru/',
    language: 'ru',
    recent: 'Недавние запросы',
    countries: 'Все страны',
    services: 'Открытые сервисы',
    periods: ['7д', '30д', '90д', '1г'],
    evidence: 'Доказательства собраны с 203.0.113.10:22',
    refine: 'Уточните запрос',
    request: 'Запрос',
    response: 'Ответ',
    apiNote: 'Пример ответа на поиск хостов.',
    closing: 'Начните с первого запроса.',
    action: 'Попробовать бесплатный поиск',
    englishHint: 'Доступно на английском',
    assessment: 'Для этого сервиса в примере не приводится оценка по CVE.',
  },
  {
    route: './zh-hant/',
    language: 'zh-Hant',
    recent: '最近查詢',
    countries: '所有國家/地區',
    services: '開放服務',
    periods: ['7天', '30天', '90天', '1年'],
    evidence: '從 203.0.113.10:22 收集的證據',
    refine: '細化您的查詢',
    request: '請求',
    response: '回應',
    apiNote: '主機搜尋回應的示意範例。',
    closing: '從第一個查詢開始。',
    action: '試用免費搜尋',
    englishHint: '提供英文版本',
    assessment: '此示意服務未提供 CVE 評估。',
  },
] as const;

async function openHome(page: Page, route: string, theme: 'light' | 'dark', width: number) {
  await page.setViewportSize({ width, height: 950 });
  await page.addInitScript((mode) => localStorage.setItem('apcosys-theme-mode', mode), theme);
  await page.goto(route);
  await expect(page.locator('main h1')).toBeVisible();
  await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
  await page.evaluate(() => document.fonts.ready);
}

/** Inspect rendered glyphs, including shadow DOM, against actual clipping ancestors.
 * This catches scaled-down desktop text and content below a fixed-height excerpt.
 * Invisible animation layers and intentionally omitted detail are not user-visible text.
 */
async function expectReadableContents(container: Locator, minimumFont = 11.5, checkBounds = true) {
  const result = await container.evaluate(
    (host, { minimum, checkBounds }) => {
      const root = host.shadowRoot ?? host;
      const bounds = host.getBoundingClientRect();
      const parentOf = (element: Element): Element | null => {
        if (element.parentElement) return element.parentElement;
        const tree = element.getRootNode();
        return tree instanceof ShadowRoot ? tree.host : null;
      };
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      const issues: { text: string; reason: string; detail: string }[] = [];
      let count = 0;
      let node;
      while ((node = walker.nextNode())) {
        const text = node.textContent?.trim();
        const element = node.parentElement;
        if (!text || !element || element.closest('style, script, template')) continue;
        const ancestors: Element[] = [];
        for (let ancestor: Element | null = element; ancestor; ancestor = parentOf(ancestor))
          ancestors.push(ancestor);
        const styles = ancestors.map((ancestor) => getComputedStyle(ancestor));
        if (
          styles.some(
            (style) =>
              style.display === 'none' ||
              style.visibility !== 'visible' ||
              Number(style.opacity) === 0,
          )
        )
          continue;
        const range = document.createRange();
        range.selectNodeContents(node);
        const rects = [...range.getClientRects()].filter((rect) => rect.width && rect.height);
        if (!rects.length) continue;
        count++;
        let scale = 1;
        for (const style of styles) {
          if (style.transform !== 'none') {
            const matrix = new DOMMatrixReadOnly(style.transform);
            scale *= Math.hypot(matrix.a, matrix.b);
          }
        }
        const font = parseFloat(styles[0]!.fontSize) * scale;
        if (font < minimum)
          issues.push({ text, reason: 'small text', detail: `${font.toFixed(2)}px` });
        for (const rect of rects) {
          if (
            checkBounds &&
            (rect.left < bounds.left - 1 ||
              rect.right > bounds.right + 1 ||
              rect.top < bounds.top - 1 ||
              rect.bottom > bounds.bottom + 1)
          )
            issues.push({ text, reason: 'outside excerpt', detail: host.className });
          for (let index = 0; index < ancestors.length; index++) {
            const style = styles[index]!;
            const clipX = /^(hidden|clip|auto|scroll)$/.test(style.overflowX);
            const clipY = /^(hidden|clip|auto|scroll)$/.test(style.overflowY);
            if (!clipX && !clipY) continue;
            const ancestor = ancestors[index]!;
            // The page viewport scrolls normally; the regression concerns component clipping.
            if (ancestor === document.documentElement || ancestor === document.body) continue;
            const clip = ancestor.getBoundingClientRect();
            if (
              (clipX && (rect.left < clip.left - 1 || rect.right > clip.right + 1)) ||
              (clipY && (rect.top < clip.top - 1 || rect.bottom > clip.bottom + 1))
            )
              issues.push({ text, reason: 'clipped text', detail: String(ancestor.className) });
          }
        }
      }
      return { count, issues };
    },
    { minimum: minimumFont, checkBounds },
  );
  expect(
    result.count,
    'the illustration must contain readable text, not only a raster',
  ).toBeGreaterThan(0);
  expect(result.issues, 'all displayed glyphs must fit at a readable size').toEqual([]);
}

for (const locale of locales) {
  test(`full evidence playback keeps service, product and CVE context consistent: ${locale.language}`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await openHome(page, locale.route, 'light', 1440);
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.locator('.step-card').nth(3).scrollIntoViewIfNeeded();
    await expect(
      page.locator('apcosys-product-demo[scene="evidence"] .evidence-source'),
    ).toBeVisible();
    // Exercise the renderer's supported full presentation, whose associations are
    // intentionally omitted from the homepage excerpt, through its real timeline.
    await page.evaluate(() => {
      const element = document.createElement('apcosys-product-demo');
      element.id = 'full-evidence-regression';
      element.setAttribute('scene', 'evidence');
      element.setAttribute('autoplay', 'false');
      element.style.cssText = 'position:fixed;inset:0;width:1360px;height:840px;z-index:1000';
      document.body.append(element);
    });
    const scene = page.locator('#full-evidence-regression');
    await expect(scene.locator('.evidence-products:visible')).toContainText('OpenSSH');
    await expect(scene.locator('.evidence-cve:visible')).toHaveCount(3);
    await scene.evaluate((element) => element.setAttribute('autoplay', 'true'));
    await expect(scene.locator('[data-port="443"]')).toHaveAttribute('data-active', 'true');
    await expect(scene.locator('.evidence-banner-text')).toContainText('Apache/2.4.41');
    await expect(scene.locator('.evidence-products:visible')).toContainText('Apache HTTP Server');
    await expect(scene.locator('.evidence-products:visible')).not.toContainText('OpenSSH');
    await expect(scene.locator('.evidence-cve:visible')).toHaveCount(0);
    await expect(
      scene.locator('.evidence-https-context .evidence-confidence-description'),
    ).toHaveText(locale.assessment);
    await expect(scene.locator('[data-port="22"]')).toHaveAttribute('data-active', 'true');
    await expect(scene.locator('.evidence-banner-text')).toContainText('SSH-2.0-OpenSSH');
    await expect(scene.locator('.evidence-products:visible')).toContainText('OpenSSH');
    await expect(scene.locator('.evidence-cve:visible')).toHaveCount(3);
    expect(errors).toEqual([]);
  });

  for (const width of [320, 1440]) {
    for (const theme of ['light', 'dark'] as const) {
      const variant = `${locale.language} ${width}px ${theme}`;

      test(`five research excerpts remain readable and localized: ${variant}`, async ({ page }) => {
        await openHome(page, locale.route, theme, width);
        const scenes = [
          ['query', '.recent-heading > span:first-child', locale.recent],
          ['results', '.country-filter-label', locale.countries],
          ['host', '.services-panel .host-panel-title > span', locale.services],
          ['evidence', '.evidence-source', locale.evidence],
          ['suggestions', '.refine-label', locale.refine],
        ];
        for (const [name, selector, text] of scenes) {
          await test.step(name!, async () => {
            const card = page
              .locator('.step-card')
              .nth(scenes.findIndex((scene) => scene[0] === name));
            await card.scrollIntoViewIfNeeded();
            const scene = card.locator('apcosys-product-demo');
            await expect(scene.locator(selector!)).toBeVisible();
            await expect(scene.locator(selector!)).toHaveText(text!);
            await expectReadableContents(scene);
            if (name === 'host')
              await expect(scene.locator('.period')).toHaveText([...locale.periods]);
            if (name === 'results') {
              const addresses = await scene.locator('.result-ip:visible').allTextContents();
              expect(addresses.length).toBeGreaterThan(0);
              for (const address of addresses)
                expect(address).toMatch(/^(192\.0\.2|198\.51\.100|203\.0\.113)\.\d+$/);
              for (const domain of await scene.locator('.result-domain:visible').allTextContents())
                expect(domain).toMatch(/(?:^|\.)example\.(?:com|net|org)$/);
            }
          });
        }
        expect(
          await page.evaluate(() => document.documentElement.scrollWidth - innerWidth),
        ).toBeLessThanOrEqual(1);
      });

      test(`API excerpt shows a readable illustrative host response without a live request: ${variant}`, async ({
        page,
      }) => {
        const requests: string[] = [];
        page.on('request', (request) => {
          if (['fetch', 'xhr'].includes(request.resourceType())) requests.push(request.url());
        });
        await openHome(page, locale.route, theme, width);
        const frame = page.locator('.api-demo-frame');
        await frame.scrollIntoViewIfNeeded();
        await expect(frame).toHaveAttribute('data-ready', 'true');
        const demo = frame.locator('api-developer-demo');
        await expect(demo.locator('.description')).toHaveText(locale.apiNote);
        await expect(demo.locator('.main > section').first().locator('h2')).toHaveText(
          locale.request,
        );
        await expect(demo.locator('.main > section').last().locator('h2')).toHaveText(
          locale.response,
        );
        await expect(demo.locator('.response-list')).toBeVisible();
        const response = JSON.parse(
          (await demo.locator('.response-list .code-text').allTextContents()).join('\n'),
        );
        expect(response).toMatchObject({ port: 443, protocol: 'HTTPS' });
        expect(response.host).toMatch(/^(192\.0\.2|198\.51\.100|203\.0\.113)\.\d+$/);
        expect(response).not.toHaveProperty('revenue');
        expect(response).not.toHaveProperty('transactions');
        const request = await demo.locator('.request-lines').innerText();
        expect(request).toContain('$APCOSYS_API_ENDPOINT');
        expect(request).toContain('$APCOSYS_AUTH_HEADER');
        expect(request).not.toMatch(/https?:\/\//);
        await expectReadableContents(demo);
        expect(requests, 'illustrations must not execute an API request').toEqual([]);
      });

      test(`closing action and footer communicate their language without clipping: ${variant}`, async ({
        page,
      }) => {
        await openHome(page, locale.route, theme, width);
        const closing = page.locator('.closing-section');
        await closing.scrollIntoViewIfNeeded();
        const heading = closing.getByRole('heading', {
          level: 2,
          name: locale.closing,
          exact: true,
        });
        const action = closing.getByRole('link', { name: locale.action, exact: true });
        await expect(heading).toBeVisible();
        await expect(action).toBeVisible();
        // Font glyphs can extend beyond a heading's line box without being clipped.
        await expectReadableContents(heading, 24, false);
        await expectReadableContents(closing.locator('.closing-scene'), 9.5);
        await expectReadableContents(action, 13.5);
        const destination = new URL((await action.getAttribute('href'))!, page.url());
        expect(destination.protocol).toBe('https:');
        expect(destination.pathname).toMatch(/\/search$/);
        await action.focus();
        await expect(action).toBeFocused();

        const footer = page.locator('.footer-columns');
        await footer.scrollIntoViewIfNeeded();
        const englishLinks = footer.locator(
          'a[href$="/about"], a[href$="/responsible-scanning"], a[href*="/legal/"]',
        );
        await expect(englishLinks).toHaveCount(8);
        for (const link of await englishLinks.all()) {
          const badge = link.locator('abbr');
          if (locale.language === 'en') await expect(badge).toHaveCount(0);
          else {
            await expect(badge).toBeVisible();
            await expect(badge).toHaveText('EN');
            await expect(badge).toHaveAttribute(
              'title',
              new RegExp(`^${locale.englishHint.split(' ').join('\\s+')}$`),
            );
            await expect(link).toHaveAccessibleName(/EN/);
            const href = (await link.getAttribute('href'))!;
            expect(href).not.toMatch(/\/(?:ru|zh-hant)\//);
          }
          await expectReadableContents(link, 9.5);
        }
        const translatedContact = footer.locator('a[href$="/contact"]');
        await expect(translatedContact.locator('abbr')).toHaveCount(0);
        if (locale.language !== 'en')
          await expect(translatedContact).toHaveAttribute(
            'href',
            new RegExp(`/${locale.language.toLowerCase()}/contact$`),
          );
      });
    }
  }
}
