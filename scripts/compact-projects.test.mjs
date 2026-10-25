import assert from 'node:assert/strict';
import test from 'node:test';
import puppeteer from 'puppeteer';
import { existsSync } from 'node:fs';

const base = process.env.PORTFOLIO_URL ?? 'http://127.0.0.1:4321';
test('cards destacados compactos e lado a lado no desktop, sem overflow no celular', async () => {
  const chrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
  const browser = await puppeteer.launch({ headless: true, executablePath: process.env.PUPPETEER_EXECUTABLE_PATH ?? (existsSync(chrome) ? chrome : undefined) });
  try {
    const page = await browser.newPage();
    for (const route of ['/', '/trabalhos/']) {
      for (const width of [1440, 375]) {
        await page.setViewport({ width, height: 1000 });
        await page.goto(`${base}${route}`, { waitUntil: 'networkidle0' });
        const cards = await page.$$eval('.professional-card.is-featured', els => els.map(el => ({
          top: el.getBoundingClientRect().top,
          height: el.getBoundingClientRect().height,
          previewHeight: el.querySelector('.product-showcase').getBoundingClientRect().height,
          fits: el.scrollWidth <= el.clientWidth,
          styled: getComputedStyle(el).borderRadius === '24px' && getComputedStyle(el).overflow === 'hidden',
        })));
        assert.equal(cards.length, 2);
        assert.ok(cards.every(card => card.previewHeight <= 245), `${route} em ${width}: prévias precisam ser pequenas`);
        assert.ok(cards.every(card => card.height <= 490 && card.fits && card.styled), `${route} em ${width}: cards compactos, com estilos aplicados e sem overflow`);
        if (width === 1440) assert.ok(Math.abs(cards[0].top - cards[1].top) < 2, 'Clickmax e RepareCar devem ficar lado a lado');
      }
    }
  } finally { await browser.close(); }
});
