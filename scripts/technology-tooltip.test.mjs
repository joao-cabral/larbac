import assert from 'node:assert/strict';
import test from 'node:test';
import puppeteer from 'puppeteer';
import { existsSync } from 'node:fs';

const base = process.env.PORTFOLIO_URL ?? 'http://127.0.0.1:4321';
test('nome da tecnologia aparece somente no hover ou foco do próprio ícone', { skip: 'TechnologyStrip foi removida da home' }, async () => {
  const chrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
  const browser = await puppeteer.launch({ headless: true, executablePath: process.env.PUPPETEER_EXECUTABLE_PATH ?? (existsSync(chrome) ? chrome : undefined) });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 1000 });
    await page.goto(base, { waitUntil: 'networkidle0' });
    await page.focus('.contributions');
    await page.waitForFunction(() => getComputedStyle(document.querySelector('.technology-strip')).opacity === '1');
    const names = ['React', 'TypeScript', 'Flutter', 'Angular', 'Node.js', 'PostgreSQL'];
    for (const name of names) {
      const selector = `.technology-icon[aria-label="${name}"]`;
      assert.equal(await page.$eval(selector, el => getComputedStyle(el, '::after').opacity), '0');
      await page.hover(selector);
      await page.waitForFunction(sel => getComputedStyle(document.querySelector(sel), '::after').opacity === '1', {}, selector);
      assert.equal(await page.$eval(selector, el => getComputedStyle(el, '::after').content), `"${name}"`);
      await page.mouse.move(0, 0);
      await page.focus(selector);
      await page.waitForFunction(sel => getComputedStyle(document.querySelector(sel), '::after').opacity === '1', {}, selector);
      await page.focus('.contributions');
      await page.waitForFunction(sel => getComputedStyle(document.querySelector(sel), '::after').opacity === '0', {}, selector);
    }
  } finally { await browser.close(); }
});
