import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import test from 'node:test';

const componentUrl = new URL('../src/components/ExperienceTimeline.astro', import.meta.url);
const expected = [
  ['Bilhon', '2024 — agora', 'Engenheiro de Software', 'Desenvolvimento fullstack e evolução arquitetural de uma plataforma SaaS em monorepo, da componentização e integrações à sustentação em produção.'],
  ['RepareCar', '2025 · 2026', 'Engenheiro de Software · Freelance', 'Atuei no frontend e em evoluções do backend da plataforma, desenvolvendo fluxos de ordens de serviço, checklists, orçamentos, gestão de pátio e portal do cliente.'],
  ['Kasco P&D', '2022 — 2024', 'Engenheiro de Software', 'Liderança técnica e desenvolvimento de soluções web, desktop e mobile para o setor agro.'],
  ['Grupo ICTS', '2021 — 2023', 'Engenheiro de Software', 'Produtos web e mobile para sensoriamento IoT e acompanhamento de rotas em tempo real.'],
  ['Sidia', '2019 — 2021', 'Desenvolvedor de Testes', 'Automação de testes e ferramentas internas para os principais dispositivos Samsung.'],
];

// Astro 4.1 has no astro/container export. These checks remain runnable before
// the parent integrates the component; opt into real browser checks below.
test('shared component exposes an accessible semantic timeline', async () => {
  const source = await readFile(componentUrl, 'utf8').catch(() => '');
  assert.match(source, /class=["']experience-timeline["']/);
  assert.match(source, /<ol\s[^>]*class=["']timeline["']/);
  assert.match(source, /<li\s[^>]*class:list=\{\[["']timeline__item["']/);
  assert.match(source, /aria-label=["']Experiência profissional["']/);
  assert.doesNotMatch(source, /Trajetória/);
  assert.match(source, />Experiência</);
});

test('preserves the five experiences and marks only Bilhon ongoing', async () => {
  const source = await readFile(componentUrl, 'utf8');
  let previous = -1;
  for (const [company, period, role, description] of expected) {
    const position = source.indexOf(`company: "${company}"`);
    assert.ok(position > previous, `${company} must follow the previous experience`);
    previous = position;
    for (const value of [period, role, description]) assert.ok(source.includes(value), value);
  }
  assert.equal((source.match(/current: true/g) ?? []).length, 1);
  assert.match(source, /Em andamento/);
  assert.match(source, /@media/);
});

const baseUrl = process.env.TIMELINE_BASE_URL;
test('home renders the timeline responsively; Trabalhos contains only the project collection', { skip: !baseUrl }, async () => {
  const { default: puppeteer } = await import('puppeteer');
  const systemChrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH ?? (existsSync(systemChrome) ? systemChrome : undefined),
  });
  try {
    const page = await browser.newPage();
    for (const pathname of ['/']) {
      for (const width of [1440, 768, 375]) {
        await page.setViewport({ width, height: 1000 });
        const response = await page.goto(new URL(pathname, baseUrl).href, { waitUntil: 'domcontentloaded' });
        assert.equal(response.status(), 200);
        await page.waitForSelector('.experience-timeline ol.timeline', { timeout: 10000 });
        const result = await page.$eval('.experience-timeline', (root) => ({
          heading: root.querySelector('h2')?.textContent,
          entries: Array.from(root.querySelectorAll('ol.timeline > li.timeline__item')).map((item) => ({
            company: item.querySelector('h3')?.textContent.trim(),
            period: item.querySelector('.timeline__period')?.textContent.trim(),
            role: item.querySelector('.timeline__role')?.textContent.trim(),
            description: item.querySelector('.timeline__description')?.textContent.trim(),
            current: item.classList.contains('is-current'),
            badge: item.querySelector('.timeline__badge')?.textContent.trim() ?? null,
          })),
          fits: Array.from(root.querySelectorAll('.timeline__card')).every((card) => {
            const bounds = card.getBoundingClientRect();
            return bounds.left >= 0 && bounds.right <= innerWidth && card.scrollWidth <= card.clientWidth;
          }),
        }));
        assert.equal(result.heading, 'Experiência');
        assert.deepEqual(result.entries, expected.map(([company, period, role, description], index) => ({
          company, period, role, description, current: company === 'Bilhon', badge: company === 'Bilhon' ? 'Em andamento' : null,
        })));
        assert.ok(result.fits, `${pathname} cards overflow at ${width}px`);
      }
    }
    await page.goto(new URL('/trabalhos', baseUrl).href, { waitUntil: 'domcontentloaded' });
    assert.equal(await page.$('.experience-timeline'), null, 'Trabalhos não deve repetir a seção Experiência');
    assert.equal((await page.$$('.work-card')).length, 5);
  } finally {
    await browser.close();
  }
});
