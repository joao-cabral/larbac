import assert from 'node:assert/strict';
import test from 'node:test';
import puppeteer from 'puppeteer';
import { existsSync } from 'node:fs';

const base = process.env.PORTFOLIO_URL ?? 'http://127.0.0.1:4321';
test('Schulte demonstra números em ordem e LibrasCode mostra QR para vídeo, automaticamente', async () => {
  const chrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
  const browser = await puppeteer.launch({ headless: true, executablePath: process.env.PUPPETEER_EXECUTABLE_PATH ?? (existsSync(chrome) ? chrome : undefined) });
  try {
    const page = await browser.newPage();
    for (const route of ['/trabalhos/']) {
      await page.goto(`${base}${route}`, { waitUntil: 'networkidle0' });
      const schulte = '[data-personal-kind="schulte"]';
      assert.ok(await page.$(schulte), `${route}: tabela animada`);
      const values = await page.$$eval(`${schulte} [data-schulte-number]`, els => els.map(el => Number(el.dataset.schulteNumber)));
      assert.equal(values.length, 25);
      assert.deepEqual([...values].sort((a, b) => a - b), Array.from({ length: 25 }, (_, i) => i + 1));
      assert.notDeepEqual(values, [...values].sort((a, b) => a - b));
      await page.$eval(schulte, el => el.scrollIntoView({ behavior: 'instant', block: 'center' }));
      const step = await page.$eval(schulte, el => Number(el.dataset.step));
      await page.waitForFunction((sel, previous) => Number(document.querySelector(sel).dataset.step) !== previous, { timeout: 3000 }, schulte, step);
      const next = await page.$eval(schulte, el => ({ step: Number(el.dataset.step), active: Number(el.querySelector('.schulte-cell.is-active').dataset.schulteNumber) }));
      assert.equal(next.step, step === 25 ? 1 : step + 1);
      assert.equal(next.active, next.step);
      const libras = '[data-personal-kind="libras"]';
      assert.ok(await page.$(libras), `${route}: fluxo cultural acessível`);
      assert.ok(await page.$(`${libras} .qr-code`));
      assert.ok(await page.$(`${libras} .libras-video`));
      assert.match(await page.$eval(libras, el => el.textContent), /Libras/);
      const initial = await page.$eval(`${libras} .qr-scanline`, el => getComputedStyle(el).transform);
      await page.waitForFunction((sel, before) => getComputedStyle(document.querySelector(sel)).transform !== before, { timeout: 3000 }, `${libras} .qr-scanline`, initial);
      for (const selector of [schulte, libras]) assert.equal(await page.$eval(selector, el => el.getAttribute('viewBox')), '0 0 440 220');
      await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
      assert.equal(await page.$eval(`${libras} .qr-scanline`, el => getComputedStyle(el).animationName), 'none');
      assert.equal(await page.$eval(`${schulte} .schulte-click`, el => getComputedStyle(el).animationName), 'none');
      const still = await page.$eval(schulte, el => el.dataset.step);
      await new Promise(resolve => setTimeout(resolve, 1000));
      assert.equal(await page.$eval(schulte, el => el.dataset.step), still);
      await page.emulateMediaFeatures([]);
    }
  } finally { await browser.close(); }
});
