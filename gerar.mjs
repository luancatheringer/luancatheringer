// Gera as artes animadas (SVG), o README.md e o curriculo.md a partir de perfil.config.mjs e curriculo.config.mjs.
// Uso:
//   node gerar.mjs           → artes do estilo escolhido (assets/) + README.md + curriculo.md
//   node gerar.mjs --previa  → também gera a prévia num arquivo único, com as artes embutidas:
//                              previa.html (abre com dois cliques) e previa-publicar.html (vira link)

import { writeFileSync, mkdirSync, rmSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const RAIZ = dirname(fileURLToPath(import.meta.url));
const importar = (arquivo) => import(pathToFileURL(join(RAIZ, arquivo)).href + '?v=' + Date.now());

const { default: cfg } = await importar('perfil.config.mjs');
const { esc } = await importar('estilos/_base.mjs');
const { curriculoMarkdown, curriculoHtml } = await importar('curriculo.mjs');
const dadosCurriculo = existsSync(join(RAIZ, 'curriculo.config.mjs')) ? (await importar('curriculo.config.mjs')).default : null;

// Estilos disponíveis: cada um é um arquivo em estilos/ (os que começam com _ são peças compartilhadas)
const ESTILOS = ['terminal'].filter((id) => existsSync(join(RAIZ, 'estilos', `${id}.mjs`)));
// O que aparece na página de prévia (com mais de um, vira comparação entre variações)
const NA_PREVIA = [...ESTILOS];
const TEMAS = ['claro', 'escuro'];
const estilos = {};
for (const id of ESTILOS) estilos[id] = await importar(`estilos/${id}.mjs`);
if (!estilos[cfg.estilo]) throw new Error(`Estilo "${cfg.estilo}" não existe. Opções: ${ESTILOS.join(', ')}.`);

// Links: no GitHub apontam para curriculo.md; na prévia, para a aba Currículo
const URL_CURRICULO = `https://github.com/${cfg.usuario}/${cfg.usuario}/blob/main/curriculo.md`;
const slugsDoCurriculo = new Set((dadosCurriculo?.experiencia ?? []).flatMap((g) => g.itens.map((it) => it.slug).filter(Boolean)));
function comLinks(modo) {
  const caso = (slug) => (modo === 'github' ? `${URL_CURRICULO}#${slug}` : `#caso-${slug}`);
  return {
    ...cfg,
    urlCurriculo: dadosCurriculo ? (modo === 'github' ? URL_CURRICULO : '#caso-topo') : null,
    projetos: cfg.projetos.map((p) => ({ ...p, link: slugsDoCurriculo.has(p.slug) ? caso(p.slug) : p.link })),
  };
}

// Os estilos desenham as partes fixas no navegador (para usar as fontes certas).
// O navegador só abre se o estilo pedir, e fecha no fim.
let navegador = null;
async function contexto(id) {
  if (!estilos[id].precisaDeNavegador) return {};
  if (!navegador) navegador = await (await importar('ferramentas/navegador.mjs')).abrirNavegador();
  return {
    executar: (...args) => navegador.executar(...args),
    renderizar: async (...args) => {
      const r = await navegador.renderizar(...args);
      // Sem as fontes certas a arte sairia com uma substituta: melhor parar do que gravar isso.
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
// Arte igual nos dois temas (o topo, que é escuro sempre) vira um arquivo só
async function unicasDo(id) {
  const claro = await artesDo(id, 'claro');
  const escuro = await artesDo(id, 'escuro');
  return new Set(Object.keys(claro).filter((nome) => claro[nome] === escuro[nome]));
}

// Primeiro gera tudo, depois troca a pasta: se a geração falhar, as artes antigas continuam lá.
async function gravarArtes(id, pasta) {
  const unicas = await unicasDo(id);
  const prontas = [];
  for (const tema of TEMAS) {
    for (const [nome, conteudo] of Object.entries(await artesDo(id, tema))) {
      if (unicas.has(nome)) {
        if (tema === 'claro') prontas.push([`${nome}.svg`, conteudo]);
      } else prontas.push([`${nome}-${tema}.svg`, conteudo]);
    }
  }
  rmSync(pasta, { recursive: true, force: true });
  mkdirSync(pasta, { recursive: true });
  for (const [arquivo, conteudo] of prontas) writeFileSync(join(pasta, arquivo), conteudo);
  return prontas.length;
}

// No GitHub: <picture> troca a arte conforme o tema de quem visita (a arte única entra direto).
const imgGithub = (dir, unicas) => (base, alt, attrs = '') =>
  unicas.has(base)
    ? `<img alt="${esc(alt)}" src="${dir}/${base}.svg" ${attrs}>`
    : `<picture><source media="(prefers-color-scheme: dark)" srcset="${dir}/${base}-escuro.svg"><img alt="${esc(alt)}" src="${dir}/${base}-claro.svg" ${attrs}></picture>`;
// Na prévia: a arte vem embutida na página e é escolhida pelo tema (e pela variação) na hora de mostrar.
const imgPrevia = (id) => (base, alt, attrs = '') => `<img alt="${esc(alt)}" data-arte="${id}/${base}" ${attrs}>`;

try {
  const total = await gravarArtes(cfg.estilo, join(RAIZ, 'assets'));
  const unicas = await unicasDo(cfg.estilo);
  const img = imgGithub('assets', unicas);
  writeFileSync(
    join(RAIZ, 'README.md'),
    `<!-- Gerado por gerar.mjs a partir de perfil.config.mjs. Edite o config, não este arquivo. -->\n\n${estilos[cfg.estilo].readme(comLinks('github'), img)}`,
  );
  const altTopo = `${cfg.nome}: ${cfg.bio}`;
  const pecasCurriculo = (im) => ({
    topo: im('topo', altTopo, 'width="100%"'),
    resumo: im('resumo', 'Resumo em números', 'width="100%"'),
    imagem: (nome, titulo) => im(nome, `${titulo}: o que a plataforma tem`, 'width="100%"'),
  });
  if (dadosCurriculo) {
    writeFileSync(join(RAIZ, 'curriculo.md'), curriculoMarkdown(cfg, dadosCurriculo, pecasCurriculo(img)));
    // o currículo substituiu o portfólio
    rmSync(join(RAIZ, 'portfolio.md'), { force: true });
  }
  console.log(`Estilo "${cfg.estilo}": ${total} artes em assets/, README.md${dadosCurriculo ? ' e curriculo.md' : ''}.`);

  if (process.argv.includes('--previa')) {
    const cfgPrevia = comLinks('previa');
    const artes = {};
    const secoes = [];
    for (const id of NA_PREVIA) {
      artes[id] = {};
      const unicasId = await unicasDo(id);
      for (const tema of TEMAS) {
        for (const [nome, svg] of Object.entries(await artesDo(id, tema))) {
          // arte igual nos dois temas vai uma vez só (o escuro aponta para o claro)
          (artes[id][nome] ??= {})[tema] = tema === 'escuro' && unicasId.has(nome) ? '=' : svg;
        }
      }
      secoes.push(`<section data-estilo="${id}" hidden>\n${estilos[id].readme(cfgPrevia, imgPrevia(id))}\n</section>`);
    }
    // o currículo da prévia acompanha a variação escolhida (o "*" vira a variação ativa)
    const curriculo = dadosCurriculo ? curriculoHtml(cfg, dadosCurriculo, pecasCurriculo(imgPrevia('*'))) : '';
    const conteudo = paginaPrevia(secoes, artes, curriculo);
    writeFileSync(join(RAIZ, 'previa-publicar.html'), conteudo);
    writeFileSync(
      join(RAIZ, 'previa.html'),
      `<!doctype html>\n<html lang="pt-BR">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n</head>\n<body>\n${conteudo}</body>\n</html>\n`,
    );
    // cópia solta de cada arte, só para conferir uma a uma (pasta ignorada pelo git)
    for (const id of NA_PREVIA) await gravarArtes(id, join(RAIZ, 'previa', id));
    console.log(`Prévia${curriculo ? ' com o currículo' : ''}: previa.html e previa-publicar.html.`);
  }
} finally {
  await navegador?.fechar();
}

// Página de comparação. Segue o contrato dos Artifacts (sem <html>/<head>/<body>; o link embrulha),
// e as cores imitam o GitHub porque as artes escuras foram feitas para o fundo #0d1117.
function paginaPrevia(secoes, artes, curriculo) {
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
.readme h1,.readme h2,.readme h3,.readme li{scroll-margin-top:150px}
.readme ul{margin:0 0 16px;padding-left:2em;font-size:16px}
.readme li{margin:0 0 8px}
.readme li p{margin:12px 0 4px}
.readme hr{border:0;border-top:1px solid var(--borda);margin:24px 0}
.readme img{max-width:100%;vertical-align:middle}
.readme a{color:var(--link)}
@media (max-width:600px){.readme{padding:16px}}
</style>
<header class="topo"><div class="topo-dentro">
<h1>${NA_PREVIA.length > 1 ? 'Direções do perfil' : 'Prévia do perfil'}<span>github.com/${esc(cfg.usuario)}</span></h1>
${curriculo ? '<div class="grupo" role="group" aria-label="Página"><button type="button" data-pagina="perfil">Perfil</button><button type="button" data-pagina="curriculo">Currículo</button></div>' : ''}
${NA_PREVIA.length > 1 ? `<div class="grupo" role="group" aria-label="Variação">${botoes}</div>` : ''}
<div class="grupo" role="group" aria-label="Tema"><button type="button" data-tema="claro">Claro</button><button type="button" data-tema="escuro">Escuro</button></div>
<p id="resumo"></p>
</div></header>
<main class="readme" id="aba-perfil">
<p class="rotulo">${esc(cfg.usuario)} / README.md</p>
${secoes.join('\n')}
</main>
${curriculo ? `<main class="readme" id="aba-curriculo" hidden>\n<p class="rotulo">${esc(cfg.usuario)} / curriculo.md</p>\n${curriculo}</main>` : ''}
<script type="application/json" id="artes">${json}</script>
<script>
const ARTES = JSON.parse(document.getElementById('artes').textContent);
const RESUMOS = ${JSON.stringify(resumos)};
const raiz = document.documentElement;
const abaPerfil = document.getElementById('aba-perfil');
const abaCurriculo = document.getElementById('aba-curriculo');
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
  document.querySelectorAll('section[data-estilo="' + ativo + '"] img[data-arte], #aba-curriculo img[data-arte]').forEach((img) => {
    const partes = img.dataset.arte.split('/');
    const estilo = partes[0] === '*' ? ativo : partes[0];
    const par = ARTES[estilo] && ARTES[estilo][partes[1]];
    if (!par) return;
    const svg = par[tema] === '=' ? par.claro : par[tema];
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
  if (abaCurriculo) abaCurriculo.hidden = true;
  marcarPagina('perfil');
  document.querySelectorAll('section[data-estilo]').forEach((s) => (s.hidden = s.dataset.estilo !== id));
  document.querySelectorAll('[data-ir]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.ir === id)));
  document.getElementById('resumo').textContent = RESUMOS[id];
  trocarHash(id);
  pintar();
}

function abrirCurriculo(alvo) {
  if (!abaCurriculo) return;
  abaPerfil.hidden = true;
  abaCurriculo.hidden = false;
  marcarPagina('curriculo');
  document.getElementById('resumo').textContent = 'O currículo, sem nome de empresa nem dados internos.';
  pintar();
  const el = document.getElementById(alvo) || document.getElementById('caso-topo');
  if (el) el.scrollIntoView({ block: 'start' });
  trocarHash(alvo);
}

function seguirHash() {
  const h = location.hash.slice(1);
  if (h.startsWith('caso-')) abrirCurriculo(h);
  else if (h in RESUMOS) { if (h !== ativo || abaPerfil.hidden) mostrar(h); }
  else if (h === 'perfil') mostrar(ativo || '${NA_PREVIA[0]}');
}

document.querySelectorAll('[data-ir]').forEach((b) => b.addEventListener('click', () => mostrar(b.dataset.ir)));
document.querySelectorAll('[data-pagina]').forEach((b) =>
  b.addEventListener('click', () => (b.dataset.pagina === 'curriculo' ? abrirCurriculo('caso-topo') : mostrar(ativo || '${NA_PREVIA[0]}'))),
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
if (inicial.startsWith('caso-')) abrirCurriculo(inicial);
</script>
`;
}
