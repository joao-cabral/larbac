import assert from 'node:assert/strict';
import test from 'node:test';
import puppeteer from 'puppeteer';
import { existsSync } from 'node:fs';

const base = process.env.PORTFOLIO_URL ?? 'http://127.0.0.1:4321';
test('home e trabalhos sem transbordamento horizontal em celular, tablet e desktop', async () => {
  const systemChrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
  const browser = await puppeteer.launch({ headless: true, executablePath: process.env.PUPPETEER_EXECUTABLE_PATH ?? (existsSync(systemChrome) ? systemChrome : undefined) });
  try {
    for (const route of ['/', '/trabalhos/']) {
      const page = await browser.newPage();
      for (const width of [375, 768, 1440]) {
        await page.setViewport({ width, height: 900 });
        await page.goto(`${base}${route}`, { waitUntil: 'networkidle0' });
        const size = await page.evaluate(() => ({ content: document.documentElement.scrollWidth, viewport: innerWidth }));
        assert.ok(size.content <= size.viewport, `${route} em ${width}px: conteúdo ${size.content}px`);
        const selectors = route === '/' ? ['.project-flow', '.personal-card'] : ['.project-flow', '.personal-card'];
        for (const selector of selectors) {
          const boxes = await page.$$eval(selector, els => els.map(el => ({ left: el.getBoundingClientRect().left, right: el.getBoundingClientRect().right })));
          assert.ok(boxes.length > 0, `${route}: ${selector} presente`);
          assert.ok(boxes.every(box => box.left >= 0 && box.right <= width), `${route}: ${selector} dentro da tela`);
        }
      }
      await page.close();
    }
  } finally { await browser.close(); }
});
