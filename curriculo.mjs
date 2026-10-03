// Monta a página "curriculo.md" (lida pelo GitHub) e a mesma página em HTML para a prévia,
// a partir de curriculo.config.mjs. Nada de dado da empresa entra aqui: só o que está no config.

import { esc } from './estilos/_base.mjs';

const ancora = (slug, modo) => (slug ? (modo === 'md' ? `<a id="${slug}"></a>` : '') : '');
const idPrevia = (slug) => `caso-${slug}`;

// ---------- GitHub (markdown) ----------

export function curriculoMarkdown(cfg, dados, { topo = '', resumo = '', imagem = () => '' } = {}) {
  const insta = cfg.links.find((l) => l.rede === 'Instagram' && l.url);
  const linhas = [
    '<!-- Gerado por gerar.mjs a partir de curriculo.config.mjs. Edite o config, não este arquivo. -->',
    '',
    ...(topo ? [`<p>${topo}</p>`, ''] : []),
    `**${dados.cargo}**  `,
    `${dados.local}${insta ? ` · [${insta.texto}](${insta.url})` : ''} · [github.com/${cfg.usuario}](https://github.com/${cfg.usuario})`,
    '',
    '## Resumo',
    '',
    dados.resumo,
    '',
    ...(resumo ? [`<p>${resumo}</p>`, ''] : []),
    '## Experiência',
    '',
  ];
  for (const g of dados.experiencia) {
    linhas.push(`### ${g.area}`, '');
    for (const it of g.itens) {
      linhas.push(`- ${ancora(it.slug, 'md')}**${it.titulo}.** ${it.texto}${it.ferramentas ? `<br><sub>${esc(it.ferramentas.join(' · '))}</sub>` : ''}`);
      const img = it.imagem ? imagem(it.imagem, it.titulo) : '';
      if (img) linhas.push('', `<p>${img}</p>`, '');
    }
    linhas.push('');
  }
  const lista = (titulo, itens) => {
    if (!itens?.length) return;
    linhas.push(`## ${titulo}`, '');
    for (const o of itens) linhas.push(`- ${o}`);
    linhas.push('');
  };
  lista('Outros trabalhos', dados.outros);
  lista('Projetos próprios', dados.proprios);
  linhas.push('## Competências', '');
  for (const [area, texto] of dados.competencias) linhas.push(`- **${area}:** ${texto}`);
  linhas.push('');
  lista('Formação', dados.formacao);
  linhas.push('---', '', `<sub>${esc(cfg.fraseFinal)} · [voltar ao perfil](https://github.com/${cfg.usuario})</sub>`, '');
  return linhas.join('\n');
}

// ---------- prévia (HTML com a mesma cara do GitHub) ----------

export function curriculoHtml(cfg, dados, { topo = '', resumo = '', imagem = () => '' } = {}) {
  const insta = cfg.links.find((l) => l.rede === 'Instagram' && l.url);
  let h = topo ? `<p id="caso-topo">${topo}</p>\n` : '<span id="caso-topo"></span>\n';
  h += `<p><b>${esc(dados.cargo)}</b><br>${esc(dados.local)}${insta ? ` · <a href="${esc(insta.url)}">${esc(insta.texto)}</a>` : ''} · <a href="https://github.com/${esc(cfg.usuario)}">github.com/${esc(cfg.usuario)}</a></p>\n`;
  h += `<h2>Resumo</h2>\n<p>${esc(dados.resumo)}</p>\n`;
  if (resumo) h += `<p>${resumo}</p>\n`;
  h += '<h2>Experiência</h2>\n';
  for (const g of dados.experiencia) {
    h += `<h3>${esc(g.area)}</h3>\n<ul>`;
    for (const it of g.itens) {
      h += `<li${it.slug ? ` id="${idPrevia(it.slug)}"` : ''}><b>${esc(it.titulo)}.</b> ${esc(it.texto)}${it.ferramentas ? `<br><sub>${esc(it.ferramentas.join(' · '))}</sub>` : ''}`;
      const img = it.imagem ? imagem(it.imagem, it.titulo) : '';
      if (img) h += `<p>${img}</p>`;
      h += '</li>';
    }
    h += '</ul>\n';
  }
  const lista = (titulo, itens) => (itens?.length ? `<h2>${esc(titulo)}</h2>\n<ul>${itens.map((o) => `<li>${esc(o)}</li>`).join('')}</ul>\n` : '');
  h += lista('Outros trabalhos', dados.outros);
  h += lista('Projetos próprios', dados.proprios);
  h += `<h2>Competências</h2>\n<ul>${dados.competencias.map(([a, t]) => `<li><b>${esc(a)}:</b> ${esc(t)}</li>`).join('')}</ul>\n`;
  h += lista('Formação', dados.formacao);
  h += `<hr>\n<p><sub>${esc(cfg.fraseFinal)} · <a href="#perfil">voltar ao perfil</a></sub></p>\n`;
  return h;
}
