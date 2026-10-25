import assert from 'node:assert/strict';
import test from 'node:test';
import puppeteer from 'puppeteer';
import { existsSync } from 'node:fs';

const base = process.env.PORTFOLIO_URL ?? 'http://127.0.0.1:4321';

test('as duas coleções profissionais usam fluxos vetoriais, sem GIFs', async () => {
  const systemChrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
  const browser = await puppeteer.launch({ headless: true,
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH ?? (existsSync(systemChrome) ? systemChrome : undefined),
  });
  try {
    for (const route of ['/', '/trabalhos/']) {
      const page = await browser.newPage();
      await page.goto(`${base}${route}`, { waitUntil: 'networkidle0' });
      const selector = route === '/' ? '.projects-section' : '.works-grid';
      const result = await page.$eval(selector, el => ({
        flows: el.querySelectorAll('svg.project-flow').length,
        cards: el.querySelectorAll('a').length,
        media: el.querySelectorAll('img, video').length,
      }));
      assert.ok(result.flows >= (route === '/' ? 2 : 4), `${route}: precisa de fluxos SVG nos projetos`);
      assert.equal(result.media, 0, `${route}: sem imagens/GIFs nos fluxos profissionais`);
      const illustrations = await page.$$eval(`${selector} svg.project-illustration`, els => els.map(el => ({
        kind: el.getAttribute('data-project-kind'),
        geometry: Array.from(el.querySelectorAll('path, rect, circle, ellipse')).map(shape =>
          ['d', 'x', 'y', 'width', 'height', 'cx', 'cy', 'r', 'rx', 'ry'].map(attr => shape.getAttribute(attr)).join(',')
        ).join('|'),
      })));
      assert.deepEqual(illustrations.map(item => item.kind), route === '/' ? ['clickmax', 'reparecar'] : ['clickmax', 'reparecar', 'routes', 'iot', 'automation']);
      assert.equal(new Set(illustrations.map(item => item.geometry)).size, illustrations.length, `${route}: cada projeto tem composição própria, não o mesmo diagrama de nós`);
      await page.close();
    }
  } finally { await browser.close(); }
});

test('issoeseu aparece na inicial; issoeseu e Cabral 3D Lab aparecem em Trabalhos', async () => {
  const systemChrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
  const browser = await puppeteer.launch({ headless: true, executablePath: process.env.PUPPETEER_EXECUTABLE_PATH ?? (existsSync(systemChrome) ? systemChrome : undefined) });
  try {
    for (const route of ['/', '/trabalhos/']) {
      const page = await browser.newPage();
      await page.goto(`${base}${route}`, { waitUntil: 'networkidle0' });
      const hrefs = route === '/' ? ['https://ar.issoeseu.com/'] : ['https://ar.issoeseu.com/', 'https://shop.cabral3dlab.com/'];
      const section = route === '/' ? '.projects-section' : '.personal-projects-section';
      for (const href of hrefs) {
        const link = await page.$(`${section} a[href="${href}"]`);
        assert.ok(link, `${route}: projeto pessoal ${href} ausente`);
        assert.equal(await link.evaluate(el => el.target), '_blank');
      }
      await page.close();
    }
  } finally { await browser.close(); }
});
