// Monta a página "portfolio.md" (lida pelo GitHub) e a mesma página em HTML para a prévia,
// a partir de portfolio.config.mjs. Nada de dado da empresa entra aqui: só o que está no config.

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { esc } from './estilos/_base.mjs';

const porArea = (dados) =>
  dados.areas
    .map((area) => ({ area, itens: dados.projetos.filter((p) => p.area === area) }))
    .filter((g) => g.itens.length);

export const idArea = (area) =>
  area
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

// Só as ferramentas: status e rotina interna da empresa não aparecem em material público
const meta = (p) => p.ferramentas.join(' · ');
const TITULO_ESTUDOS = 'Outros trabalhos';

// ---------- GitHub (markdown) ----------

// imagensDoCaso(p) devolve as animações do case já prontas para a página (a primeira abre o case, as outras fecham)
export function portfolioMarkdown(cfg, dados, { banner = '', imagensDoCaso = () => [] } = {}) {
  const grupos = porArea(dados);
  const indice = [
    ...grupos.map((g) => `- [${g.area}](#${idArea(g.area)}) (${g.itens.length})`),
    ...(dados.estudos?.length ? [`- [${TITULO_ESTUDOS}](#${idArea(TITULO_ESTUDOS)}) (${dados.estudos.length})`] : []),
  ];
  const linhas = [
    '<!-- Gerado por gerar.mjs a partir de portfolio.config.mjs. Edite o config, não este arquivo. -->',
    '',
    ...(banner ? [`<p>${banner}</p>`, ''] : []),
    '# Portfólio',
    '',
    dados.intro,
    '',
    indice.join('\n'),
    '',
  ];
  for (const g of grupos) {
    linhas.push(`<a id="${idArea(g.area)}"></a>`, '', `## ${g.area}`, '');
    for (const p of g.itens) {
      const [abre, ...fecham] = imagensDoCaso(p);
      linhas.push(`<a id="${p.slug}"></a>`, '', `### ${p.titulo}`, '', `<sub>${esc(meta(p))}</sub>`, '');
      if (abre) linhas.push(`<p>${abre}</p>`, '');
      linhas.push(`**Desafio.** ${p.desafio}`, '', `**O que fiz.** ${p.oQueFiz}`, '');
      if (p.destaques?.length) linhas.push(...p.destaques.map((d) => `- ${d}`), '');
      if (p.resultado) linhas.push(`**Resultado.** ${p.resultado}`, '');
      for (const img of fecham) linhas.push(`<p>${img}</p>`, '');
      if (p.imagem) linhas.push(`<img src="${p.imagem}" alt="${esc(p.legendaImagem ?? p.titulo)}" width="100%">`, '', `<sub>${esc(p.legendaImagem ?? '')}</sub>`, '');
    }
  }
  if (dados.estudos?.length) {
    linhas.push(`<a id="${idArea(TITULO_ESTUDOS)}"></a>`, '', `## ${TITULO_ESTUDOS}`, '');
    for (const e of dados.estudos) linhas.push(`- **${e.titulo}:** ${e.texto}`);
    linhas.push('');
  }
  linhas.push('---', '', `<sub>${esc(cfg.fraseFinal)} · [voltar ao perfil](https://github.com/${cfg.usuario})</sub>`, '');
  return linhas.join('\n');
}

// ---------- prévia (HTML com a mesma cara do GitHub) ----------

export function portfolioHtml(cfg, dados, raiz, { banner = '', imagensDoCaso = () => [] } = {}) {
  const grupos = porArea(dados);
  const img = (caminho) => `data:image/png;base64,${readFileSync(join(raiz, caminho)).toString('base64')}`;
  const indice = [
    ...grupos.map((g) => `<li><a href="#area-${idArea(g.area)}">${esc(g.area)}</a> (${g.itens.length})</li>`),
    ...(dados.estudos?.length ? [`<li><a href="#area-${idArea(TITULO_ESTUDOS)}">${TITULO_ESTUDOS}</a> (${dados.estudos.length})</li>`] : []),
  ];
  let h = banner ? `<p>${banner}</p>\n` : '';
  h += `<h1 id="caso-topo">Portfólio</h1>\n<p>${esc(dados.intro)}</p>\n<ul>${indice.join('')}</ul>\n`;
  for (const g of grupos) {
    h += `<h2 id="area-${idArea(g.area)}">${esc(g.area)}</h2>\n`;
    for (const p of g.itens) {
      const [abre, ...fecham] = imagensDoCaso(p);
      h += `<h3 id="caso-${p.slug}">${esc(p.titulo)}</h3>\n<p><sub>${esc(meta(p))}</sub></p>\n`;
      if (abre) h += `<p>${abre}</p>\n`;
      h += `<p><b>Desafio.</b> ${esc(p.desafio)}</p>\n<p><b>O que fiz.</b> ${esc(p.oQueFiz)}</p>\n`;
      if (p.destaques?.length) h += `<ul>${p.destaques.map((d) => `<li>${esc(d)}</li>`).join('')}</ul>\n`;
      if (p.resultado) h += `<p><b>Resultado.</b> ${esc(p.resultado)}</p>\n`;
      for (const im of fecham) h += `<p>${im}</p>\n`;
      if (p.imagem) h += `<p><img src="${img(p.imagem)}" alt="${esc(p.legendaImagem ?? p.titulo)}" width="100%"><br><sub>${esc(p.legendaImagem ?? '')}</sub></p>\n`;
    }
  }
  if (dados.estudos?.length) {
    h += `<h2 id="area-${idArea(TITULO_ESTUDOS)}">${TITULO_ESTUDOS}</h2>\n<ul>${dados.estudos
      .map((e) => `<li><b>${esc(e.titulo)}:</b> ${esc(e.texto)}</li>`)
      .join('')}</ul>\n`;
  }
  h += `<hr>\n<p><sub>${esc(cfg.fraseFinal)} · <a href="#perfil">voltar ao perfil</a></sub></p>\n`;
  return h;
}
