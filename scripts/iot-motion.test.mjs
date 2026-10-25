import assert from 'node:assert/strict';
import test from 'node:test';
import puppeteer from 'puppeteer';
import { existsSync } from 'node:fs';

const base = process.env.PORTFOLIO_URL ?? 'http://127.0.0.1:4321';
test('sensor transmite pacotes e gráfico de telemetria se movimenta automaticamente em Trabalhos', async () => {
  const chrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
  const browser = await puppeteer.launch({ headless: true, executablePath: process.env.PUPPETEER_EXECUTABLE_PATH ?? (existsSync(chrome) ? chrome : undefined) });
  try {
    const page = await browser.newPage();
    for (const route of ['/trabalhos/']) {
      await page.goto(`${base}${route}`, { waitUntil: 'networkidle0' });
      const root = '[data-project-kind="iot"]';
      assert.equal((await page.$$(`${root} .sensor-packet`)).length, 3);
      assert.equal((await page.$$(`${root} .sensor-wave`)).length, 3);
      await page.$eval(root, el => el.scrollIntoView({ behavior: 'instant', block: 'center' }));
      for (const selector of ['.telemetry-stream', '.sensor-packet', '.sensor-wave']) {
        const full = `${root} ${selector}`;
        const initial = await page.$eval(full, el => { const s = getComputedStyle(el); return [s.transform, s.opacity].join('|'); });
        assert.notEqual(await page.$eval(full, el => getComputedStyle(el).animationName), 'none');
        await page.waitForFunction((sel, previous) => {
          const s = getComputedStyle(document.querySelector(sel));
          return [s.transform, s.opacity].join('|') !== previous;
        }, { timeout: 3000 }, full, initial);
      }
      assert.equal(await page.$eval(root, el => el.getAttribute('viewBox')), '0 0 440 240');
      await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
      const animations = await page.$$eval(`${root} .telemetry-stream, ${root} .sensor-packet, ${root} .sensor-wave`, els => els.map(el => getComputedStyle(el).animationName));
      assert.ok(animations.every(name => name === 'none'));
      await page.emulateMediaFeatures([]);
    }
  } finally { await browser.close(); }
});
