// Gera as artes animadas (SVG), o README.md e o portfolio.md a partir de perfil.config.mjs e portfolio.config.mjs.
// Uso:
//   node gerar.mjs           → artes do estilo escolhido (assets/) + README.md + portfolio.md
//   node gerar.mjs --previa  → também gera a prévia num arquivo único, com as artes embutidas:
//                              previa.html (abre com dois cliques) e previa-publicar.html (vira link)

import { writeFileSync, mkdirSync, rmSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const RAIZ = dirname(fileURLToPath(import.meta.url));
const importar = (arquivo) => import(pathToFileURL(join(RAIZ, arquivo)).href + '?v=' + Date.now());

const { default: cfg } = await importar('perfil.config.mjs');
const { esc } = await importar('estilos/_base.mjs');
const { portfolioMarkdown, portfolioHtml } = await importar('portfolio.mjs');
const dadosPortfolio = existsSync(join(RAIZ, 'portfolio.config.mjs')) ? (await importar('portfolio.config.mjs')).default : null;

// Estilos disponíveis: cada um é um arquivo em estilos/ (os que começam com _ são peças compartilhadas)
const ESTILOS = ['lc'].filter((id) => existsSync(join(RAIZ, 'estilos', `${id}.mjs`)));
// O que aparece na página de prévia (com mais de um, vira comparação entre variações)
const NA_PREVIA = [...ESTILOS];
// Estilo da prévia usado na aba do portfólio
const ESTILO_DA_PREVIA = cfg.estilo;
const TEMAS = ['claro', 'escuro'];
const estilos = {};
for (const id of ESTILOS) estilos[id] = await importar(`estilos/${id}.mjs`);
if (!estilos[cfg.estilo]) throw new Error(`Estilo "${cfg.estilo}" não existe. Opções: ${ESTILOS.join(', ')}.`);

// Links dos cases: no GitHub apontam para portfolio.md; na prévia, para a aba Portfólio
const URL_PORTFOLIO = `https://github.com/${cfg.usuario}/${cfg.usuario}/blob/main/portfolio.md`;
const temCaso = (slug) => Boolean(dadosPortfolio?.projetos.some((p) => p.slug === slug));
function comLinks(modo) {
  const caso = (slug) => (modo === 'github' ? `${URL_PORTFOLIO}#${slug}` : `#caso-${slug}`);
  return {
    ...cfg,
    urlPortfolio: dadosPortfolio ? (modo === 'github' ? URL_PORTFOLIO : '#caso-topo') : null,
    projetos: cfg.projetos.map((p) => ({ ...p, link: temCaso(p.slug) ? caso(p.slug) : p.link })),
  };
}

// Alguns estilos desenham as partes fixas no navegador (para usar as fontes da marca).
// O navegador só abre se o estilo pedir, e fecha no fim.
let navegador = null;
async function contexto(id) {
  if (!estilos[id].precisaDeNavegador) return {};
  if (!navegador) navegador = await (await importar('ferramentas/navegador.mjs')).abrirNavegador();
  return {
    // o estilo também desenha a animação de cada case do portfólio
    portfolio: dadosPortfolio,
    renderizar: async (...args) => {
      const r = await navegador.renderizar(...args);
      // Sem as fontes da marca a arte sairia com uma substituta: melhor parar do que gravar isso.
      if (r.fontesFaltando.length)
        throw new Error(`O navegador não carregou as fontes (${r.fontesFaltando.join(', ')}). Confira a internet e rode de novo. Nada foi alterado.`);
      return r;
    },
  };
}

const artesProntas = new Map();
async function artesDo(id, tema) {
  const chave = `${id}/${tema}`;
  if (!artesProntas.has(chave)) {
    const e = estilos[id];
    const cores = { ...e.paletas[tema], ...(cfg.cores?.[id]?.[tema] ?? {}) };
    artesProntas.set(chave, await e.artes(cfg, cores, tema, await contexto(id)));
  }
  return artesProntas.get(chave);
}

// Primeiro gera tudo, depois troca a pasta: se a geração falhar, as artes antigas continuam lá.
async function gravarArtes(id, pasta) {
  const prontas = [];
  for (const tema of TEMAS) {
    for (const [nome, conteudo] of Object.entries(await artesDo(id, tema))) prontas.push([`${nome}-${tema}.svg`, conteudo]);
  }
  rmSync(pasta, { recursive: true, force: true });
  mkdirSync(pasta, { recursive: true });
  for (const [arquivo, conteudo] of prontas) writeFileSync(join(pasta, arquivo), conteudo);
  return prontas.length;
}

// No GitHub: <picture> troca a arte conforme o tema de quem visita.
const imgGithub = (dir) => (base, alt, attrs = '') =>
  `<picture><source media="(prefers-color-scheme: dark)" srcset="${dir}/${base}-escuro.svg"><img alt="${esc(alt)}" src="${dir}/${base}-claro.svg" ${attrs}></picture>`;
// Na prévia: a arte vem embutida na página e é escolhida pelo tema na hora de mostrar.
const imgPrevia = (id) => (base, alt, attrs = '') => `<img alt="${esc(alt)}" data-arte="${id}/${base}" ${attrs}>`;
// Animações de cada case do portfólio: caso-<slug>, caso-<slug>-2... (só as que o estilo gerou)
const imagensDoCaso = (img, nomes) => (p) =>
  (p.cenas ?? [])
    .map((_, i) => `caso-${p.slug}${i ? `-${i + 1}` : ''}`)
    .filter((nome) => nomes.has(nome))
    .map((nome, i) => img(nome, `${p.titulo}: animação ilustrativa${i ? ` ${i + 1}` : ''}`, 'width="100%"'));

try {
const total = await gravarArtes(cfg.estilo, join(RAIZ, 'assets'));
writeFileSync(
  join(RAIZ, 'README.md'),
  `<!-- Gerado por gerar.mjs a partir de perfil.config.mjs. Edite o config, não este arquivo. -->\n\n${estilos[cfg.estilo].readme(comLinks('github'), imgGithub('assets'))}`,
);
const altBanner = `${cfg.nome}: ${cfg.bio}`;
const nomesDo = async (id) => new Set(Object.keys(await artesDo(id, 'claro')));
if (dadosPortfolio)
  writeFileSync(
    join(RAIZ, 'portfolio.md'),
    portfolioMarkdown(cfg, dadosPortfolio, {
      banner: imgGithub('assets')('banner', altBanner, 'width="100%"'),
      imagensDoCaso: imagensDoCaso(imgGithub('assets'), await nomesDo(cfg.estilo)),
    }),
  );
console.log(
  `Estilo "${cfg.estilo}": ${total} artes em assets/ e README.md.` +
    (dadosPortfolio ? ` Portfólio com ${dadosPortfolio.projetos.length} projetos em portfolio.md.` : ''),
);

if (process.argv.includes('--previa')) {
  const cfgPrevia = comLinks('previa');
  const artes = {};
  const secoes = [];
  for (const id of NA_PREVIA) {
    artes[id] = {};
    for (const tema of TEMAS) {
      for (const [nome, svg] of Object.entries(await artesDo(id, tema))) (artes[id][nome] ??= {})[tema] = svg;
    }
    secoes.push(`<section data-estilo="${id}" hidden>\n${estilos[id].readme(cfgPrevia, imgPrevia(id))}\n</section>`);
  }
  const temNaPrevia = NA_PREVIA.includes(ESTILO_DA_PREVIA);
  const portfolio = dadosPortfolio
    ? portfolioHtml(cfg, dadosPortfolio, RAIZ, {
        banner: temNaPrevia ? imgPrevia(ESTILO_DA_PREVIA)('banner', altBanner, 'width="100%"') : '',
        imagensDoCaso: temNaPrevia ? imagensDoCaso(imgPrevia(ESTILO_DA_PREVIA), await nomesDo(ESTILO_DA_PREVIA)) : undefined,
      })
    : '';
  const conteudo = paginaPrevia(secoes, artes, portfolio);
  writeFileSync(join(RAIZ, 'previa-publicar.html'), conteudo);
  writeFileSync(
    join(RAIZ, 'previa.html'),
    `<!doctype html>\n<html lang="pt-BR">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n</head>\n<body>\n${conteudo}</body>\n</html>\n`,
  );
  // cópia solta de cada arte, só para conferir uma a uma (pasta ignorada pelo git)
  for (const id of NA_PREVIA) await gravarArtes(id, join(RAIZ, 'previa', id));
  console.log(`Prévia${portfolio ? ' com o portfólio' : ''}: previa.html e previa-publicar.html.`);
}
} finally {
  await navegador?.fechar();
}

// Página de comparação. Segue o contrato dos Artifacts (sem <html>/<head>/<body>; o link embrulha),
// e as cores imitam o GitHub porque as artes escuras foram feitas para o fundo #0d1117.
function paginaPrevia(secoes, artes, portfolio) {
  const botoes = NA_PREVIA.map((id) => `<button type="button" data-ir="${id}">${esc(estilos[id].nome)}</button>`).join('');
  const resumos = Object.fromEntries(NA_PREVIA.map((id) => [id, estilos[id].resumo]));
  const json = JSON.stringify(artes).replace(/<\//g, '<\\/');
  return `<title>Direções do perfil GitHub</title>
<style>
:root{--chao:#f6f8fa;--papel:#ffffff;--texto:#1f2328;--suave:#59636e;--borda:#d1d9e0;--ativo:#1f2328;--sobre-ativo:#ffffff;--foco:#0969da;--link:#0969da}
@media (prefers-color-scheme: dark){:root:not([data-theme="light"]){--chao:#010409;--papel:#0d1117;--texto:#f0f6fc;--suave:#9198a1;--borda:#3d444d;--ativo:#f0f6fc;--sobre-ativo:#0d1117;--foco:#4493f8;--link:#4493f8;color-scheme:dark}}
:root[data-theme="dark"]{--chao:#010409;--papel:#0d1117;--texto:#f0f6fc;--suave:#9198a1;--borda:#3d444d;--ativo:#f0f6fc;--sobre-ativo:#0d1117;--foco:#4493f8;--link:#4493f8;color-scheme:dark}
*{box-sizing:border-box}
body{background:var(--chao);color:var(--texto);font:15px/1.5 -apple-system,BlinkMacSystemFont,"Segoe UI","Noto Sans",Helvetica,Arial,sans-serif;padding-inline:16px;padding-block:0 48px}
.topo{position:sticky;top:env(safe-area-inset-top,0px);z-index:2;background:var(--chao);border-bottom:1px solid var(--borda);margin-inline:-16px;padding:12px 16px}
.topo-dentro{max-width:928px;margin:0 auto;display:flex;flex-wrap:wrap;gap:10px 16px;align-items:center}
.topo h1{margin:0 auto 0 0;font-size:15px;font-weight:600}
.topo h1 span{display:block;font-weight:400;font-size:13px;color:var(--suave)}
.grupo{display:inline-flex;border:1px solid var(--borda);border-radius:6px;overflow:hidden}
.grupo button{font:inherit;font-size:14px;color:var(--texto);background:var(--papel);border:0;padding:6px 14px;cursor:pointer}
.grupo button+button{border-left:1px solid var(--borda)}
.grupo button[aria-pressed="true"]{background:var(--ativo);color:var(--sobre-ativo);font-weight:600}
.grupo button:focus-visible{outline:2px solid var(--foco);outline-offset:-2px}
#resumo{flex-basis:100%;margin:0;font-size:14px;color:var(--suave)}
.readme{max-width:928px;margin:24px auto 0;background:var(--papel);border:1px solid var(--borda);border-radius:6px;padding:24px}
.readme .rotulo{margin:0 0 16px;font-size:12px;color:var(--suave)}
.readme p{margin:0 0 16px;font-size:16px}
.readme h1{margin:0 0 16px;padding-bottom:.3em;font-size:2em;border-bottom:1px solid var(--borda)}
.readme h2{margin:32px 0 16px;padding-bottom:.3em;font-size:1.5em;border-bottom:1px solid var(--borda)}
.readme h3{margin:24px 0 16px;font-size:20px;text-wrap:balance}
.readme h1,.readme h2,.readme h3{scroll-margin-top:150px}
.readme ul{margin:0 0 16px;padding-left:2em;font-size:16px}
.readme hr{border:0;border-top:1px solid var(--borda);margin:24px 0}
.readme img{max-width:100%;vertical-align:middle}
.readme a{color:var(--link)}
@media (max-width:600px){.readme{padding:16px}}
</style>
<header class="topo"><div class="topo-dentro">
<h1>${NA_PREVIA.length > 1 ? 'Direções do perfil' : 'Prévia do perfil'}<span>github.com/${esc(cfg.usuario)}</span></h1>
${portfolio ? '<div class="grupo" role="group" aria-label="Página"><button type="button" data-pagina="perfil">Perfil</button><button type="button" data-pagina="portfolio">Portfólio</button></div>' : ''}
${NA_PREVIA.length > 1 ? `<div class="grupo" role="group" aria-label="Variação">${botoes}</div>` : ''}
<div class="grupo" role="group" aria-label="Tema"><button type="button" data-tema="claro">Claro</button><button type="button" data-tema="escuro">Escuro</button></div>
<p id="resumo"></p>
</div></header>
<main class="readme" id="aba-perfil">
<p class="rotulo">${esc(cfg.usuario)} / README.md</p>
${secoes.join('\n')}
</main>
${portfolio ? `<main class="readme" id="aba-portfolio" hidden>\n<p class="rotulo">${esc(cfg.usuario)} / portfolio.md</p>\n${portfolio}</main>` : ''}
<script type="application/json" id="artes">${json}</script>
<script>
const ARTES = JSON.parse(document.getElementById('artes').textContent);
const RESUMOS = ${JSON.stringify(resumos)};
const raiz = document.documentElement;
const abaPerfil = document.getElementById('aba-perfil');
const abaPortfolio = document.getElementById('aba-portfolio');
let ativo = null;
let enderecos = [];

function temaAtual() {
  const escolha = raiz.getAttribute('data-theme');
  if (escolha === 'dark') return 'escuro';
  if (escolha === 'light') return 'claro';
  return matchMedia('(prefers-color-scheme: dark)').matches ? 'escuro' : 'claro';
}

// Cada exibição ganha um endereço novo, para as animações sempre começarem do zero
function pintar() {
  const tema = temaAtual();
  enderecos.forEach((u) => URL.revokeObjectURL(u));
  enderecos = [];
  document.querySelectorAll('section[data-estilo="' + ativo + '"] img[data-arte], #aba-portfolio img[data-arte]').forEach((img) => {
    const [estilo, arte] = img.dataset.arte.split('/');
    const svg = ARTES[estilo] && ARTES[estilo][arte] && ARTES[estilo][arte][tema];
    if (!svg) return;
    const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
    enderecos.push(url);
    img.src = url;
  });
  document.querySelectorAll('[data-tema]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.tema === tema)));
}

function marcarPagina(pagina) {
  document.querySelectorAll('[data-pagina]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.pagina === pagina)));
}

function trocarHash(h) {
  try {
    if (location.hash !== '#' + h) history.replaceState(null, '', '#' + h);
  } catch (e) {}
}

function mostrar(id) {
  ativo = id;
  abaPerfil.hidden = false;
  if (abaPortfolio) abaPortfolio.hidden = true;
  marcarPagina('perfil');
  document.querySelectorAll('section[data-estilo]').forEach((s) => (s.hidden = s.dataset.estilo !== id));
  document.querySelectorAll('[data-ir]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.ir === id)));
  document.getElementById('resumo').textContent = RESUMOS[id];
  trocarHash(id);
  pintar();
}

function abrirPortfolio(alvo) {
  if (!abaPortfolio) return;
  abaPerfil.hidden = true;
  abaPortfolio.hidden = false;
  marcarPagina('portfolio');
  document.getElementById('resumo').textContent = 'Todos os projetos, sem nomes, números nem dados da empresa.';
  const el = document.getElementById(alvo) || document.getElementById('caso-topo');
  if (el) el.scrollIntoView({ block: 'start' });
  trocarHash(alvo);
}

function seguirHash() {
  const h = location.hash.slice(1);
  if (h.startsWith('caso-') || h.startsWith('area-')) abrirPortfolio(h);
  else if (h in RESUMOS) { if (h !== ativo || abaPerfil.hidden) mostrar(h); }
  else if (h === 'perfil') mostrar(ativo || '${NA_PREVIA[0]}');
}

document.querySelectorAll('[data-ir]').forEach((b) => b.addEventListener('click', () => mostrar(b.dataset.ir)));
document.querySelectorAll('[data-pagina]').forEach((b) =>
  b.addEventListener('click', () => (b.dataset.pagina === 'portfolio' ? abrirPortfolio('caso-topo') : mostrar(ativo || '${NA_PREVIA[0]}'))),
);
document.querySelectorAll('[data-tema]').forEach((b) =>
  b.addEventListener('click', () => {
    // o observador abaixo repinta quando o atributo muda
    raiz.setAttribute('data-theme', b.dataset.tema === 'escuro' ? 'dark' : 'light');
  }),
);
new MutationObserver(pintar).observe(raiz, { attributes: true, attributeFilter: ['data-theme'] });
matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
  if (!raiz.hasAttribute('data-theme')) pintar();
});
window.addEventListener('hashchange', seguirHash);
const inicial = location.hash.slice(1);
mostrar(inicial in RESUMOS ? inicial : '${NA_PREVIA[0]}');
if (inicial.startsWith('caso-') || inicial.startsWith('area-')) abrirPortfolio(inicial);
</script>
`;
}
