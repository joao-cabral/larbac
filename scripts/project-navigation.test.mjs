import assert from 'node:assert/strict';
import test from 'node:test';
import puppeteer from 'puppeteer';
import { existsSync } from 'node:fs';

const base = process.env.PORTFOLIO_URL ?? 'http://127.0.0.1:4321';
test('projetos sem duplicação, contribuição como destino principal e site como ação secundária', async () => {
  const chrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
  const browser = await puppeteer.launch({ headless: true, executablePath: process.env.PUPPETEER_EXECUTABLE_PATH ?? (existsSync(chrome) ? chrome : undefined) });
  try {
    const page = await browser.newPage();
    for (const route of ['/', '/trabalhos/']) {
      await page.goto(`${base}${route}`, { waitUntil: 'networkidle0' });
      assert.equal(await page.$('.selected-projects-heading'), null, 'não deve existir seção duplicada de selecionados');
      const cards = await page.$$eval('.professional-card', els => els.map(el => ({
        title: el.querySelector('h2, h3').textContent.trim(),
        primary: el.querySelector('.professional-card__primary').getAttribute('href'),
        featured: el.classList.contains('is-featured'),
        external: el.querySelector('.professional-card__external')?.getAttribute('href') ?? null,
        externalText: el.querySelector('.professional-card__external')?.textContent.trim() ?? null,
        nestedLinks: el.querySelectorAll('a a').length,
      })));
      assert.equal(cards.length, route === '/' ? 2 : 5);
      if (route === '/') assert.equal(await page.$eval('.projects-section__more', el => el.getAttribute('href')), '/trabalhos');
      for (const [title, slug, external] of [['Clickmax', 'clickmax-project', 'https://clickmax.io/'], ['RepareCar', 'reparecar-project', 'https://www.reparecar.com.br/']]) {
        assert.equal(cards.filter(card => card.title === title).length, 1);
        const card = cards.find(card => card.title === title);
        assert.equal(card.primary, `/projects/${slug}`);
        assert.equal(card.external, external);
        assert.match(card.externalText, /Visitar site/);
        assert.ok(card.featured);
        assert.equal((await page.$$(`h2, h3`)).length > 0, true);
        const headings = await page.$$eval('h2, h3', els => els.filter(el => !el.closest('.experience-timeline')).map(el => el.textContent.trim()));
        assert.equal(headings.filter(heading => heading === title).length, 1, `${title} não pode aparecer em dois cards`);
      }
      assert.ok(cards.every(card => card.primary.startsWith('/projects/') && card.nestedLinks === 0));
      for (const card of cards) {
        const response = await page.goto(new URL(card.primary, base).href, { waitUntil: 'domcontentloaded' });
        assert.equal(response.status(), 200, `estudo de caso ${card.primary}`);
      }
      await page.goto(`${base}${route}`, { waitUntil: 'networkidle0' });
      await page.$eval('.professional-card__external', el => el.scrollIntoView({ behavior: 'instant', block: 'center' }));
      const externalClickable = await page.$eval('.professional-card__external', el => {
        const rect = el.getBoundingClientRect();
        return document.elementFromPoint(rect.x + rect.width / 2, rect.y + rect.height / 2)?.closest('a') === el;
      });
      assert.ok(externalClickable, 'o link externo não deve ser interceptado pelo link principal do card');
      await Promise.all([
        page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
        page.click('.professional-card__cta'),
      ]);
      assert.equal(new URL(page.url()).pathname.replace(/\/$/, ''), '/projects/clickmax-project');
    }
  } finally { await browser.close(); }
});
