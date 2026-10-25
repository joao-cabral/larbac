import assert from 'node:assert/strict';
import test from 'node:test';
import puppeteer from 'puppeteer';
import { existsSync } from 'node:fs';

const base = process.env.PORTFOLIO_URL ?? 'http://127.0.0.1:4321';
test('tecnologias reaparecem no hover e no foco; permanecem visíveis no touch', { skip: 'TechnologyStrip foi removida da home' }, async () => {
  const chrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
  const browser = await puppeteer.launch({ headless: true, executablePath: process.env.PUPPETEER_EXECUTABLE_PATH ?? (existsSync(chrome) ? chrome : undefined) });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 1000 });
    await page.goto(base, { waitUntil: 'networkidle0' });
    await page.mouse.move(0, 0);
    await page.waitForFunction(() => getComputedStyle(document.querySelector('.technology-strip')).opacity === '0');
    assert.equal(await page.$eval('.technology-strip', el => el.getBoundingClientRect().height), 0);
    await page.hover('.contributions');
    await page.waitForFunction(() => getComputedStyle(document.querySelector('.technology-strip')).opacity === '1');
    assert.ok(await page.$eval('.technology-strip', el => el.getBoundingClientRect().height > 60));
    await page.mouse.move(0, 0);
    await page.focus('.contributions');
    await page.waitForFunction(() => getComputedStyle(document.querySelector('.technology-strip')).opacity === '1');
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
    assert.equal(await page.$eval('.technology-strip', el => getComputedStyle(el).transitionDuration), '0s');
    await page.setViewport({ width: 375, height: 900, isMobile: true, hasTouch: true });
    await page.reload({ waitUntil: 'networkidle0' });
    assert.equal(await page.$eval('.technology-strip', el => getComputedStyle(el).opacity), '1');
    assert.ok(await page.$eval('.technology-strip', el => el.getBoundingClientRect().height > 60));
  } finally { await browser.close(); }
});
