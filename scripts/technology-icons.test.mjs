import assert from 'node:assert/strict';
import test from 'node:test';
import puppeteer from 'puppeteer';
import { existsSync } from 'node:fs';

const base = process.env.PORTFOLIO_URL ?? 'http://127.0.0.1:4321';
test('sem faixa de tecnologias; fluxos das duas páginas respeitam movimento reduzido', async () => {
  const systemChrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
  const browser = await puppeteer.launch({ headless: true, executablePath: process.env.PUPPETEER_EXECUTABLE_PATH ?? (existsSync(systemChrome) ? systemChrome : undefined) });
  try {
    for (const route of ['/', '/trabalhos/']) {
      const page = await browser.newPage();
      await page.goto(`${base}${route}`, { waitUntil: 'networkidle0' });
      assert.equal(await page.$('.technology-strip'), null, `${route}: sem faixa de tecnologias`);
      assert.notEqual(await page.$eval('.flow-packet', el => getComputedStyle(el).animationName), 'none');
      await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
      assert.equal(await page.$eval('.flow-packet', el => getComputedStyle(el).animationName), 'none');
      await page.close();
    }
  } finally { await browser.close(); }
});
