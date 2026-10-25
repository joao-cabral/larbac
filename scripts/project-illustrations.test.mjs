import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const astroRequire = createRequire(require.resolve('astro/package.json'));
const { transform } = astroRequire('@astrojs/compiler');
const { transform: transpile } = astroRequire('esbuild');
const componentURL = new URL('../src/components/ProjectIllustration.astro', import.meta.url);
const kinds = ['clickmax', 'reparecar', 'routes', 'iot', 'automation'];

// Exercise the real Astro compiler and TS transpiler without a site build.
async function fixture() {
  const source = await readFile(componentURL, 'utf8');
  const compiled = await transform(source, { filename: componentURL.pathname });
  assert.equal(compiled.diagnostics.filter(d => d.severity === 1).length, 0);
  assert.ok(compiled.css.length > 0, 'Astro compiles the scoped illustration styles');
  await transpile(compiled.code, { loader: 'ts', format: 'esm' });
  const compositions = kinds.map(kind => {
    const branch = source.match(new RegExp(`\\{kind === '${kind}' && ([\\s\\S]*?)\\n  </g>\\}`));
    assert.ok(branch, `explicit composition exists for ${kind}`);
    return branch[1];
  });
  return { source, compositions };
}

test('five distinct accessible SVG compositions pass structure and Astro compilation', async () => {
  const { source, compositions } = await fixture();
  assert.match(source, /viewBox="0 0 440 240"/);
  assert.match(source, /class="project-flow project-illustration"/);
  assert.match(source, /data-project-kind=\{kind\}/);
  assert.match(source, /role="img"/);
  assert.match(source, /aria-label=\{`Ilustração/);
  const geometry = new Set();
  const labels = [ /Páginas|Editor/, /Oficina|Serviço/, /Rota|Trajeto/, /Telemetria|Sensor/, /Testes|test/ ];
  compositions.forEach((html, i) => {
    assert.match(html, labels[i]);
    assert.match(html, /class="[^"]*flow-packet/);
    assert.match(html, /ilustrativ|ilustração/i);
    assert.doesNotMatch(html, /\bid=|<image|<video|<foreignObject/);
    const paths = [...html.matchAll(/<path\b[^>]*\bd="([^"]+)"/g)].map(m => m[1]);
    assert.ok(paths.length >= 3, `${kinds[i]} should have hand-drawn geometry`);
    geometry.add(paths.join('|'));
  });
  assert.equal(geometry.size, 5, 'variants must differ in geometry, not just labels');
  assert.match(source, /kind: 'clickmax'\s*\|\s*'reparecar'\s*\|\s*'routes'\s*\|\s*'iot'\s*\|\s*'automation'/);
  assert.match(source, /@media\s*\(prefers-reduced-motion:\s*reduce\)/);
  assert.match(source, /animation:\s*none\s*!important/);
  assert.match(source, /\.project-illustration\s*\*/);
  assert.match(source, /width:\s*100%/);
  assert.match(source, /height:\s*auto/);
});
