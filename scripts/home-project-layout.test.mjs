import assert from 'node:assert/strict';
import test from 'node:test';
import puppeteer from 'puppeteer';
import { existsSync } from 'node:fs';

const base = process.env.PORTFOLIO_URL ?? 'http://127.0.0.1:4321';
test('home: dois cards na primeira linha e Ar Manaus largo abaixo; celular empilhado', async () => {
  const chrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
  const browser = await puppeteer.launch({ headless: true, executablePath: process.env.PUPPETEER_EXECUTABLE_PATH ?? (existsSync(chrome) ? chrome : undefined) });
  try {
    const page = await browser.newPage();
    for (const width of [1440, 1920, 375]) {
      await page.setViewport({ width, height: 1000 });
      await page.goto(base, { waitUntil: 'networkidle0' });
      const result = await page.$eval('.professional-grid', root => {
        const bounds = el => { const b = el.getBoundingClientRect(); return { top: b.top, bottom: b.bottom, left: b.left, right: b.right, width: b.width, height: b.height }; };
        return { grid: bounds(root), cards: [...root.children].map(bounds), overflow: document.documentElement.scrollWidth > innerWidth };
      });
      const [first, second, third] = result.cards;
      assert.equal(result.cards.length, 3);
      assert.equal(result.overflow, false);
      if (width >= 1000) {
        assert.ok(Math.abs(first.top - second.top) < 2, 'dois primeiros cards na mesma linha');
        assert.ok(third.top >= Math.max(first.bottom, second.bottom), 'Ar Manaus precisa ficar abaixo');
        assert.ok(Math.abs(third.width - result.grid.width) < 2, 'Ar Manaus deve ocupar toda a largura');
        assert.ok(Math.abs(third.left - first.left) < 2 && Math.abs(third.right - second.right) < 2);
        assert.ok(third.height < 400, 'card largo deve continuar compacto');
      } else {
        assert.ok(second.top >= first.bottom && third.top >= second.bottom);
      }
    }
  } finally { await browser.close(); }
});
