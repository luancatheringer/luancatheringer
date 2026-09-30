// Estilo "Assinatura": a mesma identidade dos vídeos da LC Automações.
// Títulos em Montserrat, rótulos em Oxanium, texto em Nunito Sans; cartões claros com interface ilustrativa.
// Peças comuns em _lc.mjs; as cenas de cada case do portfólio em lc-casos.mjs.

import {
  esc, n, n4, svg, paletas as PALETAS, folha, icone, iconeSvg, kt, ciclo, pontilhada, viajante, visivelEntre, pulso,
  alertaPulsando, setaViva, sublinhado, cresce, logoHtml, cabecalhoTela, painelAnimado, cenaLead, cenaPedido, cenaRastreio,
} from './_lc.mjs';
import { artesDoPortfolio } from './lc-casos.mjs';

export const nome = 'Assinatura';
export const resumo = 'A mesma identidade dos seus vídeos: Montserrat nos títulos, cartões claros e interface ilustrativa animada.';
export const precisaDeNavegador = true;
export const paletas = PALETAS;

// ---------- topo ----------

const arrobaDe = (cfg) => cfg.links.find((l) => l.rede === 'Instagram' && l.url)?.texto;

async function banner(cfg, t, tema, R) {
  const W = 1200;
  const H = 190;
  const escuro = tema === 'escuro';
  const arroba = arrobaDe(cfg);
  // No escuro a logo fica com as cores originais sobre uma placa clara, com um brilho verde-água em volta
  const xTexto = escuro ? 166 : 150;
  const logo = escuro
    ? `<div class="abs" style="left:8px;top:29px;width:132px;height:132px;border-radius:30px;background:radial-gradient(circle at 50% 36%, #FFFFFF 0%, #F2F5F9 58%, #E1E8F0 100%);box-shadow:0 0 0 1.5px rgba(44,201,185,.6), 0 0 12px 1px rgba(44,201,185,.38)"></div>
<div class="abs" style="left:25px;top:47px;width:98px;height:95px">${logoHtml(cfg, t)}</div>`
    : `<div class="abs" style="left:4px;top:30px;width:120px;height:115px">${logoHtml(cfg, t)}</div>`;
  const f = await folha(
    R,
    t,
    'f',
    W,
    H,
    `${logo}
<div class="abs ti" data-m="nome" style="left:${xTexto}px;top:28px;font-size:56px;line-height:1;white-space:nowrap">${esc(cfg.nome)}</div>
<div class="abs" style="left:${xTexto + 2}px;top:100px;font-size:21px;line-height:1.3;color:${t.apoio};white-space:nowrap">${esc(cfg.bio)}</div>
${arroba ? `<div class="abs nu" data-m="arroba" style="left:${xTexto + 2}px;top:146px;font-size:19px;line-height:1;color:${t.tealEsc}">${esc(arroba)}</div>` : ''}`,
  );
  const m = f.medidas;

  // À direita do nome: três sistemas ligados, com o dado passando de um para o outro (só se couber)
  const nos = [['erp', 936], ['usuarios', 1046], ['balao', 1156]];
  const y = 58;
  const r = 25;
  const P = 6;
  let ligados = '';
  if (m.nome.x + m.nome.w + 60 < nos[0][1] - r) {
    const trecho = (a, b) => `M${a + r + 8} ${y}H${b - r - 8}`;
    const d1 = trecho(nos[0][1], nos[1][1]);
    const d2 = trecho(nos[1][1], nos[2][1]);
    ligados = `<g><animate attributeName="opacity" dur="1.9s" fill="freeze" keyTimes="0;.55;1" values="0;0;1"/>
${pontilhada(d1, t)}${pontilhada(d2, t)}
${viajante(d1, 0.08, 0.32, P, t, { r: 4.5 })}${viajante(d2, 0.42, 0.66, P, t, { r: 4.5 })}
${nos
  .map(
    ([ic, x], i) =>
      `<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="${t.teal}" stroke-width="1.8"/>${iconeSvg(ic, x, y, 23, t.navy, 1.9)}${pulso(x, y, r, r + 9, [0.001, 0.32, 0.66][i], 0.13, P, t.teal)}`,
  )
  .join('\n')}</g>`;
  }

  const fixo = xTexto - 8; // a logo (e a placa) fica parada; o texto entra da esquerda para a direita
  const larg = W - fixo;
  const corpo = `<clipPath id="fixo"><rect width="${fixo}" height="${H}"/></clipPath>
<clipPath id="revela"><rect x="${fixo}" width="${larg}" height="${H}"><animate attributeName="width" dur="1.1s" fill="freeze" values="0;${larg}" calcMode="spline" keyTimes="0;1" keySplines=".3 0 .2 1"/></rect></clipPath>
<g clip-path="url(#fixo)">${f.base()}</g>
<g clip-path="url(#revela)">${f.base()}</g>
${m.arroba ? sublinhado(m.arroba, t, 1) : ''}
${ligados}`;
  return svg({ w: W, h: H, titulo: `${cfg.nome}: ${cfg.bio}`, defs: f.def, corpo });
}

// ---------- projeto em destaque: painel ilustrativo que troca de tela ----------

export const MENU_PLATAFORMA = [
  ['visao', 'Visão geral', 'grade'],
  ['precos', 'Preços', 'etiqueta'],
  ['concorrentes', 'Concorrentes', 'alvo'],
  ['margem', 'Margem', 'percentual'],
  ['marca', 'Marca', 'escudo'],
  ['perguntas', 'Perguntas', 'balao'],
  ['relatorios', 'Relatórios', 'doc'],
];
const LOJAS = [['Loja A', 0.92], ['Sua loja', 0.78], ['Loja B', 0.66], ['Loja C', 0.52], ['Loja D', 0.38]];
const CASCATA = [
  // [rótulo, topo, base] em fração da altura
  ['Preço', 1, 0],
  ['Comissão', 1, 0.84],
  ['Frete', 0.84, 0.74],
  ['Imposto', 0.74, 0.62],
  ['Custo', 0.62, 0.27],
  ['Margem', 0.27, 0],
];

// Preços: os revendedores aparecem na régua, dois descem abaixo do piso e o primeiro dispara o alerta
const telaPrecos = {
  menu: 'precos',
  html(t) {
    const linha = (loja, texto, cor, etiqueta = '') =>
      `<div style="display:flex;align-items:center;height:34px;border-top:1px solid ${t.linha};font-size:13px">
<span style="width:8px;height:8px;border-radius:50%;background:${cor};margin-right:10px"></span>
<span style="width:64px;font-weight:700">${loja}</span><span style="color:${t.suave}">${texto}</span>${etiqueta}</div>`;
    return `<div style="padding:20px 24px">
${cabecalhoTela(t, 'Política de preço', 'Revendedores em relação ao piso combinado')}
<div data-m="regua" style="position:relative;height:84px;margin-top:8px">
<span class="abs nu" style="left:26%;top:6px;transform:translateX(-50%);font-size:11px;color:${t.apoio}">piso</span>
<span class="abs nu" style="left:88%;top:6px;transform:translateX(-50%);font-size:11px;color:${t.tealEsc};white-space:nowrap">loja oficial</span>
</div>
<div style="font-size:12.5px;font-weight:700;margin:6px 0">Quem furou primeiro</div>
${linha('Loja C', 'abaixo do piso', t.alerta, `<span class="nu" style="margin-left:auto;font-size:10.5px;color:${t.alerta};background:${t.alertaFundo};border-radius:6px;padding:3px 8px">1º a furar</span>`)}
${linha('Loja F', 'abaixo do piso', t.alerta)}
${linha('Loja A', 'dentro da política', t.teal)}
</div>`;
  },
  animar(f, { t, P, T0, ox, oy }) {
    const rg = f.medidas.regua;
    const naRegua = (fr) => n(ox + rg.x + rg.w * fr);
    const yR = n(oy + rg.y + 56);
    const x0 = naRegua(0);
    const x1 = naRegua(1);
    const xPiso = naRegua(0.26);
    const xLoja = naRegua(0.88);
    const surge = (j) => cresce(P, 'r', 0, 6, T0 + 0.004 + j * 0.006, T0 + 0.022 + j * 0.006);
    const fica = (fr, j) => `<circle cx="${naRegua(fr)}" cy="${yR}" r="6" fill="${t.cartao}" stroke="${t.navy}" stroke-width="2">${surge(j)}</circle>`;
    const fura = (de, para, ini, j) => {
      const a = T0 + ini;
      const troca = kt(0, a + 0.018);
      return `<circle cx="${naRegua(de)}" cy="${yR}" r="6" fill="${t.cartao}" stroke="${t.navy}" stroke-width="2">${surge(j)}
<animate attributeName="cx" ${ciclo(P)} keyTimes="${kt(0, a, a + 0.04, 1)}" values="${naRegua(de)};${naRegua(de)};${naRegua(para)};${naRegua(para)}" calcMode="spline" keySplines="0 0 1 1;.4 0 .2 1;0 0 1 1"/>
<animate attributeName="fill" ${ciclo(P)} calcMode="discrete" keyTimes="${troca}" values="${t.cartao};${t.alerta}"/>
<animate attributeName="stroke" ${ciclo(P)} calcMode="discrete" keyTimes="${troca}" values="${t.navy};${t.alerta}"/></circle>`;
    };
    return `<rect x="${x0}" y="${n(yR - 13)}" width="${n(xPiso - x0)}" height="26" rx="5" fill="${t.alertaFundo}"/>
<path d="M${x0} ${yR}H${x1}" stroke="${t.navy}" stroke-width="2"/>
<path d="M${xPiso} ${n(yR - 32)}V${n(yR + 18)}" stroke="${t.navy}" stroke-width="1.6" stroke-dasharray="3 4"/>
<path d="M${xLoja} ${yR}V${n(yR - 26)}" stroke="${t.teal}" stroke-width="2"/><path d="M${xLoja} ${n(yR - 26)}h13l-4 5l4 5h-13z" fill="${t.teal}"/>
${[0.5, 0.58, 0.66, 0.74, 0.8].map((fr, j) => fica(fr, j + 2)).join('\n')}
${fura(0.42, 0.19, 0.125, 1)}
${fura(0.34, 0.1, 0.07, 0)}
<g opacity="0">${visivelEntre(T0 + 0.11, 1, P)}${alertaPulsando(naRegua(0.1), yR, 7, t.alerta)}</g>`;
  },
};

// Concorrentes: as barras crescem uma depois da outra
const telaConcorrentes = {
  menu: 'concorrentes',
  html: (t) => `<div style="padding:20px 24px">
${cabecalhoTela(t, 'Concorrentes', 'Presença na busca da categoria')}
<div style="margin-top:12px">${LOJAS.map(
    ([loja], i) => `<div style="display:flex;align-items:center;height:38px">
<span style="width:78px;font-size:13px;color:${i === 1 ? t.tealEsc : t.apoio};font-weight:${i === 1 ? 700 : 600}">${loja}</span>
<span data-m="trilho-${i}" style="flex:1;height:9px;border-radius:5px;background:${t.campo}"></span></div>`,
  ).join('')}</div>
<div class="pilula" style="margin-top:14px">${icone('faisca', 13, t.teal)}Leitura automática por categoria</div>
</div>`,
  animar: (f, { t, P, T0, ox, oy }) =>
    LOJAS.map(([, frac], j) => {
      const m = f.medidas[`trilho-${j}`];
      const a = T0 + 0.004 + j * 0.008;
      return `<rect x="${n(ox + m.x)}" y="${n(oy + m.y)}" width="${n(m.w * frac)}" height="${n(m.h)}" rx="${n(m.h / 2)}" fill="${j === 1 ? t.teal : t.navy2}">${cresce(P, 'width', 0, m.w * frac, a, a + 0.045)}</rect>`;
    }).join('\n'),
};

// Margem: do preço do anúncio, descontando cada custo, até o que sobra
const telaMargem = {
  menu: 'margem',
  html: (t) => `<div style="padding:20px 24px">
${cabecalhoTela(t, 'Margem real', 'Do preço do anúncio ao que sobra')}
<div data-m="cascata" style="height:150px;margin-top:14px;border-bottom:1.5px solid ${t.linha}"></div>
<div style="display:flex;margin-top:7px">${CASCATA.map(
    ([rotulo], i) =>
      `<span style="flex:1;text-align:center;font-size:12px;color:${i === CASCATA.length - 1 ? t.tealEsc : t.apoio};font-weight:${i === CASCATA.length - 1 ? 700 : 600}">${rotulo}</span>`,
  ).join('')}</div>
<div class="pilula" style="margin-top:16px">${icone('faisca', 13, t.teal)}Calculada anúncio por anúncio</div>
</div>`,
  animar(f, { t, P, T0, ox, oy }) {
    const cs = f.medidas.cascata;
    const alt = 146;
    const chao = oy + cs.y + 150;
    const col = cs.w / CASCATA.length;
    const largBarra = 46;
    return CASCATA.map(([, topo, base], j) => {
      const x = n(ox + cs.x + col * (j + 0.5) - largBarra / 2);
      const a = T0 + 0.004 + j * 0.014;
      const b = a + 0.032;
      const yTopo = chao - alt * topo;
      const h = alt * (topo - base);
      const cor = j === 0 ? t.navy2 : j === CASCATA.length - 1 ? t.teal : t.alerta;
      return `<rect x="${x}" y="${n(yTopo)}" width="${largBarra}" height="${n(h)}" rx="4" fill="${cor}"${j > 0 && j < CASCATA.length - 1 ? ' opacity=".5"' : ''}>${base === 0 ? cresce(P, 'y', chao, yTopo, a, b) : ''}${cresce(P, 'height', 0, h, a, b)}</rect>`;
    }).join('\n');
  },
};

// Marca: o radar dá uma volta por tela; quando passa pelo anúncio suspeito, o aviso aparece
const telaMarca = {
  menu: 'marca',
  reserva: 90,
  html: (t, w, h) => `<div style="padding:20px 24px">
${cabecalhoTela(t, 'Proteção de marca', 'Radar de anúncios suspeitos')}
<div data-m="radar" style="width:170px;height:170px;margin:12px auto 0"></div>
<div data-m="vaga" style="height:56px;margin-top:12px"></div>
</div>
<div class="abs" data-m="aviso" style="left:24px;top:${h + 16}px;width:${w - 48}px;height:56px;display:flex;align-items:center;gap:12px;padding:0 14px;border-radius:11px;background:${t.alertaFundo}">
${icone('escudo', 20, t.alerta)}<div><div style="font-size:13px;font-weight:700;line-height:1.3">Marca parecida encontrada</div><div style="font-size:11.5px;color:${t.suave};line-height:1.3">evidência salva com data e hora</div></div></div>`,
  animar(f, { t, P, N, a, ox, oy }) {
    const rd = f.medidas.radar;
    const cx = n(ox + rd.x + rd.w / 2);
    const cy = n(oy + rd.y + rd.h / 2);
    const RR = rd.w / 2;
    const ANG = 2.4; // onde está o anúncio suspeito (radianos, sentido horário a partir da direita)
    const achou = a + ANG / (2 * Math.PI) / N;
    const ponto = (ang, frac) => `<circle cx="${n(cx + Math.cos(ang) * RR * frac)}" cy="${n(cy + Math.sin(ang) * RR * frac)}" r="3.5" fill="${t.suave}"/>`;
    const ax = n(cx + Math.cos(ANG) * RR * 0.62);
    const ay = n(cy + Math.sin(ANG) * RR * 0.62);
    const vaga = f.medidas.vaga;
    const tempos = kt(0, achou + 0.012, achou + 0.032, 1);
    return `${[1, 0.66, 0.33].map((fr) => `<circle cx="${cx}" cy="${cy}" r="${n(RR * fr)}" fill="none" stroke="${t.linha}" stroke-width="1.5"/>`).join('')}
<path d="M${n(cx - RR)} ${cy}H${n(cx + RR)}M${cx} ${n(cy - RR)}V${n(cy + RR)}" stroke="${t.linha}" stroke-width="1.2"/>
${ponto(-2.2, 0.45)}${ponto(-0.6, 0.8)}${ponto(0.7, 0.72)}${ponto(1.5, 0.3)}
<g><path d="M${cx} ${cy}L${n(cx + RR)} ${cy}A${n(RR)} ${n(RR)} 0 0 0 ${n(cx + Math.cos(-1) * RR)} ${n(cy + Math.sin(-1) * RR)}Z" fill="${t.teal}" opacity=".16"/>
<path d="M${cx} ${cy}L${n(cx + RR)} ${cy}" stroke="${t.teal}" stroke-width="2" stroke-linecap="round"/>
<animateTransform attributeName="transform" type="rotate" from="0 ${cx} ${cy}" to="360 ${cx} ${cy}" dur="${n4(P / N)}s" repeatCount="indefinite"/></g>
<circle cx="${ax}" cy="${ay}" r="5" fill="${t.alerta}">${cresce(P, 'r', 0, 5, achou, achou + 0.01)}</circle>
<g opacity="0">${visivelEntre(achou + 0.01, 1, P)}${alertaPulsando(ax, ay, 5, t.alerta)}</g>
<g><animate attributeName="opacity" ${ciclo(P)} keyTimes="${tempos}" values="0;0;1;1"/>
<animateTransform attributeName="transform" type="translate" ${ciclo(P)} keyTimes="${tempos}" values="0 8;0 8;0 0;0 0" calcMode="spline" keySplines="0 0 1 1;.2 .7 .2 1;0 0 1 1"/>
${f.recorte('aviso', ox + vaga.x, oy + vaga.y)}</g>`;
  },
};

// Ordem das telas no ciclo (a mesma da frase: preço, concorrência, margem e marca)
export const TELAS_PLATAFORMA = [telaPrecos, telaConcorrentes, telaMargem, telaMarca];

export async function destaque(p, t, R, { soPainel = false } = {}) {
  const [primeira, ...resto] = p.titulo.split(' ');
  const textoEsquerda = soPainel
    ? ''
    : `<div class="abs nu" style="left:4px;top:44px;font-size:16px;line-height:1;color:${t.tealEsc};display:flex;align-items:center;gap:10px"><span style="width:26px;height:2px;background:${t.teal}"></span>Projeto em destaque</div>
<div class="abs ti" style="left:2px;top:80px;font-size:50px;line-height:1">${esc(primeira)}</div>
<div class="abs ti" style="left:4px;top:138px;font-size:34px;line-height:1;color:${t.teal};white-space:nowrap">${esc(resto.join(' '))}.</div>
<div class="abs" style="left:4px;top:198px;width:400px;font-size:20px;line-height:1.45;color:${t.apoio}">${esc(p.chamada ?? p.descricao)}</div>
${p.nota ? `<div class="abs" style="left:4px;top:284px;font-size:16px;color:${t.suave};display:flex;align-items:center;gap:9px"><span style="width:7px;height:7px;border-radius:50%;background:${t.teal}"></span>${esc(p.nota)}</div>` : ''}
<div class="abs" data-m="abrir" style="left:4px;top:384px;font-size:17px;font-weight:700;line-height:1">abrir case</div>`;
  return painelAnimado(t, R, {
    W: soPainel ? 770 : 1200,
    H: 440,
    px: soPainel ? 22 : 452,
    py: 14,
    menu: MENU_PLATAFORMA,
    telas: TELAS_PLATAFORMA,
    P: 18,
    textoEsquerda,
    titulo: `${p.titulo}: ${p.chamada ?? p.descricao}`,
    extra: (fb) => {
      const ab = fb.medidas.abrir;
      return ab ? setaViva(ab.x + ab.w + 18, ab.y + ab.h / 2 + 1, 18, t.navy) : '';
    },
  });
}

// ---------- título de seção e botão ----------

async function secao(texto, t, R) {
  const W = 1200;
  const H = 54;
  const f = await folha(
    R,
    t,
    'f',
    W,
    H,
    `<div class="abs nu" style="left:4px;top:22px;font-size:16px;line-height:1;color:${t.tealEsc};display:flex;align-items:center;gap:10px"><span style="width:26px;height:2px;background:${t.teal}"></span>${esc(texto)}</div>`,
  );
  return svg({ w: W, h: H, titulo: texto, defs: f.def, corpo: f.base() });
}

async function botao(texto, t, R) {
  const W = 1200;
  const H = 84;
  const f = await folha(
    R,
    t,
    'f',
    W,
    H,
    `<div class="abs" style="left:0;right:0;top:16px;display:flex;justify-content:center"><div class="ti" style="height:52px;border-radius:26px;background:${t.motor};color:${t.sobreMotor};font-size:17px;display:flex;align-items:center;gap:12px;padding:0 26px 0 30px">${esc(texto)}<span data-m="seta" style="width:20px;height:20px"></span></div></div>`,
  );
  const m = f.medidas.seta;
  return svg({ w: W, h: H, titulo: texto, defs: f.def, corpo: f.base() + setaViva(m.x + m.w / 2, m.y + m.h / 2, 19, t.sobreMotor) });
}

// ---------- outros projetos: texto à esquerda e uma pequena cena à direita ----------

const HP = 160; // altura de cada projeto
const CENAS = { mensagem: cenaLead, bifurca: cenaPedido, busca: cenaRastreio };

async function projeto(p, t, R) {
  const W = 1200;
  const cena = CENAS[p.anim]?.(t, { x0: 640, cy: HP / 2, H: HP });
  const f = await folha(
    R,
    t,
    'f',
    W,
    HP,
    `<div class="abs ti" style="left:4px;top:30px;font-size:27px;line-height:1.15;white-space:nowrap;display:flex;align-items:center;gap:12px">${esc(p.titulo)}${icone('seta', 19, t.teal, 2.4)}</div>
<div class="abs" style="left:4px;top:76px;width:540px;font-size:19px;line-height:1.4;color:${t.apoio}">${esc(p.resumoCurto ?? p.descricao)}</div>
${cena?.html ?? ''}`,
    cena?.reserva ?? 0,
  );
  return svg({ w: W, h: HP, titulo: `${p.titulo}: ${p.descricao}`, defs: f.def, corpo: f.base() + (cena ? cena.animar(f) : '') });
}

// ---------- fechamento ----------

async function fim(cfg, t, R) {
  const W = 1200;
  const H = 190;
  const arroba = arrobaDe(cfg);
  const i = cfg.fraseFinal.indexOf('. ');
  const [a, b] = i > 0 ? [cfg.fraseFinal.slice(0, i + 1), cfg.fraseFinal.slice(i + 2)] : [cfg.fraseFinal, ''];
  const f = await folha(
    R,
    t,
    'f',
    W,
    H,
    `<div class="abs ti" style="left:0;right:0;top:22px;text-align:center;font-size:34px;line-height:1.22">${esc(a)}${b ? `<br><span style="color:${t.teal}">${esc(b)}</span>` : ''}</div>
${arroba ? `<div class="abs" style="left:0;right:0;top:132px;text-align:center"><span class="nu" data-m="arroba" style="font-size:20px;line-height:1;color:${t.tealEsc}">${esc(arroba)}</span></div>` : ''}`,
  );
  return svg({ w: W, h: H, titulo: cfg.fraseFinal, defs: f.def, corpo: f.base() + (f.medidas.arroba ? sublinhado(f.medidas.arroba, t, 0.5) : '') });
}

// ---------- montagem ----------

const TITULO_OUTROS = 'Outros projetos';
const TEXTO_BOTAO = 'Ver todos os projetos';
const principalDe = (cfg) => cfg.projetos.find((p) => p.destaque) ?? cfg.projetos[0];

export async function artes(cfg, t, tema, ctx) {
  if (!ctx?.renderizar) throw new Error('O estilo "lc" precisa do navegador para desenhar as fontes da marca.');
  const R = ctx.renderizar;
  const principal = principalDe(cfg);
  const a = {
    banner: await banner(cfg, t, tema, R),
    destaque: await destaque(principal, t, R),
    'secao-projetos': await secao(TITULO_OUTROS, t, R),
  };
  for (const p of cfg.projetos.filter((q) => q !== principal)) a[`projeto-${p.slug}`] = await projeto(p, t, R);
  a['botao-portfolio'] = await botao(TEXTO_BOTAO, t, R);
  a.fim = await fim(cfg, t, R);
  // Uma cena animada para cada case do portfólio
  if (ctx.portfolio) Object.assign(a, await artesDoPortfolio(ctx.portfolio, t, R, { destaque }));
  return a;
}

export function readme(cfg, img) {
  const principal = principalDe(cfg);
  const outros = cfg.projetos.filter((p) => p !== principal);
  const insta = cfg.links.find((l) => l.rede === 'Instagram' && l.url);
  const fecho = img('fim', `${cfg.fraseFinal}${insta ? ` ${insta.texto}` : ''}`, 'width="100%"');
  const comLink = (url, conteudo) => (url ? `<a href="${esc(url)}">${conteudo}</a>` : conteudo);
  return `<p>${img('banner', `${cfg.nome}: ${cfg.bio}`, 'width="100%"')}</p>

<p>${comLink(principal.link, img('destaque', `${principal.titulo}: ${principal.chamada ?? principal.descricao}`, 'width="100%"'))}</p>

<p>${img('secao-projetos', TITULO_OUTROS, 'width="100%"')}</p>

${outros.map((p) => `<p>${comLink(p.link, img(`projeto-${p.slug}`, `${p.titulo}: ${p.descricao}`, 'width="100%"'))}</p>`).join('\n')}
${cfg.urlPortfolio ? `\n<p>${comLink(cfg.urlPortfolio, img('botao-portfolio', TEXTO_BOTAO, 'width="100%"'))}</p>\n` : ''}
<p>${comLink(insta?.url, fecho)}</p>
`;
}
