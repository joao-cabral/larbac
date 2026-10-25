import assert from 'node:assert/strict';
import test from 'node:test';
import puppeteer from 'puppeteer';
import { existsSync } from 'node:fs';

const base = process.env.PORTFOLIO_URL ?? 'http://127.0.0.1:4321';
test('ônibus percorre automaticamente a rota e chega ao destino em Trabalhos', async () => {
  const chrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
  const browser = await puppeteer.launch({ headless: true, executablePath: process.env.PUPPETEER_EXECUTABLE_PATH ?? (existsSync(chrome) ? chrome : undefined) });
  try {
    const page = await browser.newPage();
    for (const route of ['/trabalhos/']) {
      await page.goto(`${base}${route}`, { waitUntil: 'networkidle0' });
      const bus = '[data-project-kind="routes"] .route-bus';
      assert.ok(await page.$(bus), `${route}: ônibus desenhado no mapa`);
      assert.notEqual(await page.$eval(bus, el => getComputedStyle(el).offsetPath), 'none');
      const initial = await page.$eval(bus, el => getComputedStyle(el).offsetDistance);
      await page.waitForFunction((selector, before) => getComputedStyle(document.querySelector(selector)).offsetDistance !== before, { timeout: 3000 }, bus, initial);
      const position = await page.$eval(bus, el => {
        const animation = el.getAnimations()[0];
        animation.pause();
        animation.currentTime = 9000;
        const point = new DOMPoint(0, 0).matrixTransform(el.getScreenCTM()).matrixTransform(el.ownerSVGElement.getScreenCTM().inverse());
        return { x: point.x, y: point.y, distance: getComputedStyle(el).offsetDistance };
      });
      assert.equal(position.distance, '100%');
      assert.ok(Math.abs(position.x - 304) < 2 && Math.abs(position.y - 110) < 2, `${route}: chegada no marcador, recebido ${JSON.stringify(position)}`);
      await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
      assert.equal(await page.$eval(bus, el => getComputedStyle(el).animationName), 'none');
      await page.emulateMediaFeatures([]);
    }
  } finally { await browser.close(); }
});
