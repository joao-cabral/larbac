import assert from 'node:assert/strict';
import test from 'node:test';
import puppeteer from 'puppeteer';
import { existsSync } from 'node:fs';

const base = process.env.PORTFOLIO_URL ?? 'http://127.0.0.1:4321';
test('prévias Clickmax e RepareCar apresentam módulos automaticamente, sem controles interativos', async () => {
  const chrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
  const browser = await puppeteer.launch({ headless: true, executablePath: process.env.PUPPETEER_EXECUTABLE_PATH ?? (existsSync(chrome) ? chrome : undefined) });
  try {
    const page = await browser.newPage();
    for (const route of ['/', '/trabalhos/']) {
      await page.goto(`${base}${route}`, { waitUntil: 'networkidle0' });
      for (const kind of ['clickmax', 'reparecar']) {
        const root = `.product-showcase[data-product="${kind}"]`;
        assert.ok(await page.$(root), `${route}: prévia automática ${kind}`);
        assert.equal((await page.$$(`${root} [data-module]`)).length, kind === 'clickmax' ? 6 : 5);
        assert.equal((await page.$$(`${root} button, ${root} [tabindex]`)).length, 0);
        const initial = await page.$eval(root, el => el.dataset.active);
        await page.$eval(root, el => el.scrollIntoView({ behavior: 'instant', block: 'center' }));
        await page.waitForFunction((sel, id) => document.querySelector(sel).dataset.active !== id, { timeout: 7000 }, root, initial);
        assert.equal(await page.$eval(`${root} [data-panel]:not([hidden])`, el => el.dataset.panel), await page.$eval(root, el => el.dataset.active));
        assert.match(await page.$eval(root, el => el.textContent), /ilustrativa/i);
        await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
        assert.equal(await page.$eval(`${root} .flow-packet`, el => getComputedStyle(el).animationName), 'none');
        await page.emulateMediaFeatures([]);
      }
    }
    await page.setViewport({ width: 375, height: 900, isMobile: true, hasTouch: true });
    await page.goto(base, { waitUntil: 'networkidle0' });
    for (const kind of ['clickmax', 'reparecar']) {
      const root = `.product-showcase[data-product="${kind}"]`;
      assert.equal((await page.$$(`${root} button`)).length, 0);
      assert.ok(await page.$eval(root, el => el.scrollWidth <= el.clientWidth));
    }
  } finally { await browser.close(); }
});
