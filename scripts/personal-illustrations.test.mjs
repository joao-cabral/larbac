import assert from 'node:assert/strict';
import test from 'node:test';
import puppeteer from 'puppeteer';
import { existsSync } from 'node:fs';

const base = process.env.PORTFOLIO_URL ?? 'http://127.0.0.1:4321';
test('projetos pessoais têm cenas próprias: mapa atmosférico e impressão em camadas', async () => {
  const chrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
  const browser = await puppeteer.launch({ headless: true, executablePath: process.env.PUPPETEER_EXECUTABLE_PATH ?? (existsSync(chrome) ? chrome : undefined) });
  try {
    const page = await browser.newPage();
    for (const route of ['/', '/trabalhos/']) {
      await page.goto(`${base}${route}`, { waitUntil: 'networkidle0' });
      assert.equal((await page.$$('.personal-card .flow-node')).length, 0, 'não reutilizar diagrama genérico de três nós');
      const scenes = route === '/' ? [['air', '.air-current']] : [['air', '.air-current'], ['print', '.printer-head']];
      for (const [kind, moving] of scenes) {
        const root = `.personal-card svg.personal-illustration[data-personal-kind="${kind}"]`;
        assert.ok(await page.$(root), `${route}: cena ${kind}`);
        assert.equal(await page.$eval(root, el => el.getAttribute('viewBox')), '0 0 440 220');
        assert.equal(await page.$eval(root, el => el.getAttribute('role')), 'img');
        await page.$eval(root, el => el.scrollIntoView({ behavior: 'instant', block: 'center' }));
        const selector = `${root} ${moving}`;
        const initial = await page.$eval(selector, el => { const s = getComputedStyle(el); return `${s.transform}|${s.strokeDashoffset}|${s.opacity}`; });
        await page.waitForFunction((sel, previous) => {
          const s = getComputedStyle(document.querySelector(sel));
          return `${s.transform}|${s.strokeDashoffset}|${s.opacity}` !== previous;
        }, { timeout: 3000 }, selector, initial);
        await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
        assert.equal(await page.$eval(selector, el => getComputedStyle(el).animationName), 'none');
        await page.emulateMediaFeatures([]);
      }
      assert.ok(await page.$('.air-sensor-pulse'));
      if (route !== '/') assert.ok(await page.$('.printed-layers'));
    }
  } finally { await browser.close(); }
});
