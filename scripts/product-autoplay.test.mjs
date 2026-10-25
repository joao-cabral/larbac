import assert from 'node:assert/strict';
import test from 'node:test';
import puppeteer from 'puppeteer';
import { existsSync } from 'node:fs';

const base = process.env.PORTFOLIO_URL ?? 'http://127.0.0.1:4321';
test('prévia alterna sozinha mesmo sob o mouse, sem controles, e respeita movimento reduzido', async () => {
  const chrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
  const browser = await puppeteer.launch({ headless: true, executablePath: process.env.PUPPETEER_EXECUTABLE_PATH ?? (existsSync(chrome) ? chrome : undefined) });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 1000 });
    await page.goto(base, { waitUntil: 'networkidle0' });
    const root = '.product-showcase[data-product="clickmax"]';
    await page.$eval(root, el => el.scrollIntoView({ behavior: 'instant', block: 'center' }));
    await page.mouse.move(2, 2);
    const initial = await page.$eval(root, el => el.dataset.active);
    await page.waitForFunction((sel, id) => document.querySelector(sel).dataset.active !== id, { timeout: 7000 }, root, initial);
    assert.equal((await page.$$(`${root} button`)).length, 0);
    await page.hover(root);
    const hovered = await page.$eval(root, el => el.dataset.active);
    await page.waitForFunction((sel, id) => document.querySelector(sel).dataset.active !== id, { timeout: 7000 }, root, hovered);
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
    const reduced = await page.$eval(root, el => el.dataset.active);
    await new Promise(resolve => setTimeout(resolve, 4700));
    assert.equal(await page.$eval(root, el => el.dataset.active), reduced);
    assert.equal(await page.$eval(`${root} .flow-packet`, el => getComputedStyle(el).animationName), 'none');
  } finally { await browser.close(); }
});
