// Peças comuns dos estilos: a folha desenhada no navegador (folha + recorte) e utilidades de animação.
// As partes fixas são desenhadas no navegador (para usar as fontes da marca) e viram imagem dentro do SVG;
// as animações (SMIL) entram por cima, encaixadas pelas medidas que o navegador devolve.

import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { esc, n, n4, svg } from './_base.mjs';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');

// Cores dos vídeos (logo: azul-marinho #111739 e verde-água #11AEA0).
// A logo mantém as cores originais nos dois temas; no escuro ela ganha uma placa clara por trás.
export const paletas = {
  claro: {
    navy: '#111739', navy2: '#2B3264', apoio: '#5A6282', suave: '#8C93AE', linha: '#DCE1EB', campo: '#EEF1F6',
    teal: '#11AEA0', tealEsc: '#0A8A7F', tealFundo: 'rgba(17,174,160,.12)', cartao: '#FFFFFF',
    alerta: '#E5484D', alertaFundo: 'rgba(229,72,77,.10)', aviso: '#D98A1C', avisoFundo: 'rgba(217,138,28,.12)',
    zap: '#DDF7E6', traco: 'rgba(17,23,57,.16)',
    sombra: '0 6px 18px rgba(17,23,57,.09), 0 0 0 1px rgba(17,23,57,.06)',
    sombraP: '0 3px 10px rgba(17,23,57,.08), 0 0 0 1px rgba(17,23,57,.06)',
    motor: '#111739', sobreMotor: '#FFFFFF', logoA: '#111739', logoB: '#11AEA0',
  },
  escuro: {
    navy: '#E9ECF5', navy2: '#AEB6D2', apoio: '#A3ABBF', suave: '#737D96', linha: '#2A3140', campo: '#1F2531',
    teal: '#2CC9B9', tealEsc: '#3FD4C4', tealFundo: 'rgba(44,201,185,.16)', cartao: '#151A24',
    alerta: '#FF6B6F', alertaFundo: 'rgba(255,107,111,.14)', aviso: '#F2B55A', avisoFundo: 'rgba(242,181,90,.14)',
    zap: '#16392C', traco: 'rgba(233,236,245,.20)',
    sombra: '0 0 0 1px #2A3140',
    sombraP: '0 0 0 1px #2A3140',
    motor: '#E9ECF5', sobreMotor: '#0D1117', logoA: '#111739', logoB: '#11AEA0',
  },
};

const FONTES_LINK =
  '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>' +
  '<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700&family=Nunito+Sans:wght@400;600;700&family=Oxanium:wght@500;600&display=block" rel="stylesheet">';
const FONTES = ['700 20px Montserrat', '600 16px "Nunito Sans"', '700 16px "Nunito Sans"', '600 16px Oxanium'];
const ARIAL = "Arial, 'Helvetica Neue', Helvetica, sans-serif";

export const pagina = (t, w, h, corpo) => `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">${FONTES_LINK}<style>
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:${w}px;height:${h}px;background:transparent;overflow:hidden}
body{position:relative;font-family:'Nunito Sans',${ARIAL};font-weight:600;color:${t.navy};-webkit-font-smoothing:antialiased}
.ti{font-family:Montserrat,${ARIAL};font-weight:700;letter-spacing:-.02em}
.nu{font-family:Oxanium,Consolas,monospace;font-weight:600}
.abs{position:absolute}
.cartao{background:${t.cartao};border-radius:14px;box-shadow:${t.sombra}}
.cartaoP{background:${t.cartao};border-radius:12px;box-shadow:${t.sombraP}}
.barra{height:8px;border-radius:4px;background:${t.traco}}
.pilula{display:inline-flex;align-items:center;gap:8px;height:30px;padding:0 14px;border-radius:9px;background:${t.campo};font-size:12px;color:${t.apoio}}
.rot{display:flex;align-items:center;gap:6px;font-size:11px;line-height:1;color:${t.suave}}
</style></head><body>${corpo}</body></html>`;

// Desenha a página no navegador. O que fica abaixo de H é reserva: pedaços que as animações
// trazem para a parte visível (recorte), para poderem aparecer e sumir.
// opcoes.montar e opcoes.fontes trocam a página base (outro estilo, outras fontes).
export async function folha(R, t, id, W, H, corpo, reserva = 0, opcoes = {}) {
  const montar = opcoes.montar ?? pagina;
  const r = await R(montar(t, W, H + reserva, corpo), W, H + reserva, { fontes: opcoes.fontes ?? FONTES });
  return {
    medidas: r.medidas,
    def: `<image id="${id}" href="${r.uri}" width="${W}" height="${H + reserva}"/>`,
    base: (x = 0, y = 0) => `<svg x="${n(x)}" y="${n(y)}" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><use href="#${id}"/></svg>`,
    // folga: margem em volta do pedaço, para levar junto a sombra
    recorte(nomeMedida, x, y, folga = 0) {
      const m = r.medidas[nomeMedida];
      const w = m.w + 2 * folga;
      const h = m.h + 2 * folga;
      return `<svg x="${n(x - folga)}" y="${n(y - folga)}" width="${n(w)}" height="${n(h)}" viewBox="${n(m.x - folga)} ${n(m.y - folga)} ${n(w)} ${n(h)}"><use href="#${id}"/></svg>`;
    },
  };
}
// ---------- ícones de traço (os mesmos dos vídeos, grade de 24) ----------

const PONTO = (x, y) => `<circle cx="${x}" cy="${y}" r=".9" fill="currentColor" stroke="none"/>`;
export const IC = {
  grade: '<rect x="3.5" y="3.5" width="7" height="7" rx="1.8"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.8"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.8"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.8"/>',
  etiqueta: '<path d="M3 3H12L21 12L12 21L3 12Z"/><circle cx="7.5" cy="7.5" r="1.2"/>',
  alvo: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5.2"/><circle cx="12" cy="12" r="1.4"/>',
  percentual: '<circle cx="7" cy="7" r="2.6"/><circle cx="17" cy="17" r="2.6"/><path d="M19 5L5 19"/>',
  escudo: '<path d="M12 2.5L20 5.5V11C20 16 16.5 19.5 12 21.5C7.5 19.5 4 16 4 11V5.5Z"/><path d="M8.5 12L11 14.5L15.5 9.5"/>',
  balao: '<rect x="3" y="4" width="18" height="13" rx="4"/><path d="M8 17L6.5 21L12 17"/>',
  chat: `<rect x="3" y="4" width="18" height="13" rx="4"/><path d="M8 17L6.5 21L12 17"/>${PONTO(8.5, 10.5)}${PONTO(12, 10.5)}${PONTO(15.5, 10.5)}`,
  doc: '<path d="M14 2.5H5V21.5H19V7.5L14 2.5V7.5H19"/><path d="M8.5 12H15.5M8.5 16H15.5"/>',
  sino: '<path d="M6 17V11A6 6 0 0 1 18 11V17L20 18.5H4L6 17Z"/><path d="M10 21.5H14"/>',
  faisca: '<path d="M11 3Q12 10 19 11Q12 12 11 19Q10 12 3 11Q10 10 11 3Z" fill="currentColor" stroke="none"/>',
  erp: `<rect x="4" y="3" width="16" height="5" rx="1.5"/><rect x="4" y="9.5" width="16" height="5" rx="1.5"/><rect x="4" y="16" width="16" height="5" rx="1.5"/>${PONTO(7.5, 5.5)}${PONTO(7.5, 12)}${PONTO(7.5, 18.5)}`,
  usuarios: '<circle cx="9" cy="8.5" r="3.5"/><path d="M2.34 18.84A7 7 0 0 1 15.66 18.84"/><circle cx="17" cy="9.5" r="2.8"/><path d="M13.61 16.11A5.5 5.5 0 0 1 22.4 17.5"/>',
  vendedor: '<circle cx="12" cy="8" r="4"/><path d="M3.77 19.89A8.5 8.5 0 0 1 20.23 19.89"/>',
  form: '<rect x="4.5" y="3" width="15" height="18" rx="2.5"/><path d="M8 8.5H16M8 12.5H16M8 16.5H12.5"/>',
  pedido: '<rect x="5" y="4.5" width="14" height="17" rx="2"/><rect x="9" y="2.5" width="6" height="4" rx="1.2"/><path d="M8.5 11H15.5M8.5 14.5H15.5M8.5 18H12.5"/>',
  pacote: '<path d="M12 2.5L20.5 7V17L12 21.5L3.5 17V7ZM3.5 7L12 11.5L20.5 7M12 11.5V21.5"/>',
  megafone: '<path d="M4 10H8L17 5V19L8 14H4Z"/><path d="M8 14L9.5 20M20 9L22 8M20 12H22.5M20 15L22 16"/>',
  grafico: '<path d="M4 3.5V20H21"/><path d="M8.5 20V14M13 20V9M17.5 20V12" stroke-width="3.2"/>',
  cadeado: '<rect x="5" y="10.5" width="14" height="10.5" rx="2.5"/><path d="M8 10.5V7.5A4 4 0 0 1 16 7.5V10.5"/>',
  busca: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5L21 21"/>',
  relogio: '<circle cx="12" cy="12" r="9"/><path d="M12 7V12L15.5 14"/>',
  email: '<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M3.5 6.5L12 13L20.5 6.5"/>',
  navegador: '<rect x="2.5" y="4" width="19" height="16" rx="2.5"/><path d="M2.5 8.5H21.5"/>',
  camera: '<rect x="2.5" y="6.5" width="13" height="11" rx="2.5"/><path d="M15.5 10.5L21.5 7V17L15.5 13.5"/>',
  microfone: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11A6.5 6.5 0 0 0 18.5 11M12 17.5V21"/>',
  telefone: '<path d="M5 3.5H9L10.5 8L8 9.5A11 11 0 0 0 14.5 16L16 13.5L20.5 15V19A2 2 0 0 1 18.5 21A16 16 0 0 1 3 5.5A2 2 0 0 1 5 3.5Z"/>',
  link: '<path d="M10 14L14 10"/><path d="M8.5 11.5L6.5 13.5A3.5 3.5 0 0 0 11.5 18.5L13.5 16.5"/><path d="M15.5 12.5L17.5 10.5A3.5 3.5 0 0 0 12.5 5.5L10.5 7.5"/>',
  slide: '<rect x="3" y="4.5" width="18" height="12" rx="2"/><path d="M12 16.5V20M8.5 20H15.5M7 9H13M7 12H11"/>',
  cartao: '<rect x="2.5" y="5.5" width="19" height="13" rx="2.5"/><path d="M2.5 10H21.5M6 14.5H10"/>',
  seta: '<path d="M4 12H20M14 6L20 12L14 18"/>',
  check: '<path d="M5 12.5L10 17.5L19 7"/>',
  checks: '<path d="M1.5 12.5L6 17L14 7"/><path d="M11 15L13 17L21.5 7"/>',
  exclamacao: '<path d="M12 6.5V13.5"/><circle cx="12" cy="17.5" r="1.2" fill="currentColor" stroke="none"/>',
};
// dentro de uma página (HTML)
export const icone = (nomeIcone, tam, cor, esp = 2) =>
  `<svg width="${tam}" height="${tam}" viewBox="0 0 24 24" fill="none" stroke="${cor}" stroke-width="${esp}" stroke-linecap="round" stroke-linejoin="round" style="color:${cor};flex:none;display:block">${IC[nomeIcone]}</svg>`;
// dentro de uma arte (SVG), centrado em (cx, cy)
export const iconeSvg = (nomeIcone, cx, cy, tam, cor, esp = 2) =>
  `<g transform="translate(${n(cx - tam / 2)} ${n(cy - tam / 2)}) scale(${n4(tam / 24)})" fill="none" stroke="${cor}" color="${cor}" stroke-width="${esp}" stroke-linecap="round" stroke-linejoin="round">${IC[nomeIcone]}</g>`;

// ---------- blocos de página (HTML) ----------

// Cartão com o nome do sistema no alto
export const cartao = (t, { id, x, y, w, h, rotulo, icone: ic, corpo = '', estilo = '', classe = 'cartaoP' }) =>
  `<div class="abs ${classe}"${id ? ` data-m="${id}"` : ''} style="left:${x}px;top:${y}px;width:${w}px;height:${h}px;padding:12px 14px;${estilo}">
${rotulo ? `<div class="rot">${ic ? icone(ic, 12, t.suave, 2.2) : ''}${rotulo}</div>` : ''}${corpo}</div>`;
// Linhas de texto sem texto (barras), em % da largura
export const barras = (larguras, { alt = 7, gap = 7, topo = 10 } = {}) =>
  larguras.map((l, i) => `<div class="barra" style="height:${alt}px;width:${l}%;margin-top:${i ? gap : topo}px"></div>`).join('');
export const chip = (t, texto, { cor = t.tealEsc, fundo = t.tealFundo, id, estilo = '' } = {}) =>
  `<span class="ti"${id ? ` data-m="${id}"` : ''} style="display:inline-block;font-size:11.5px;line-height:1;color:${cor};background:${fundo};border-radius:6px;padding:5px 8px;white-space:nowrap;${estilo}">${texto}</span>`;
export const avatar = (t, tam = 26, cor = t.campo, id) =>
  `<span${id ? ` data-m="${id}"` : ''} style="width:${tam}px;height:${tam}px;border-radius:50%;background:${cor};flex:none;display:inline-block"></span>`;

// ---------- peças de animação ----------
// Tudo em SMIL, sem "begin": o atraso vai dentro dos keyTimes (é o que roda dentro de <img> no GitHub).

export const kt = (...xs) => xs.map((x) => n4(x)).join(';');
export const ciclo = (P) => `dur="${P}s" repeatCount="indefinite"`;

// Engrenagem do motor das automações (gira devagar)
function caminhoEngrenagem(r) {
  const dentes = 8;
  const passo = (2 * Math.PI) / dentes;
  const pts = [];
  for (let i = 0; i < dentes; i++) {
    const a = i * passo;
    for (const [ang, raio] of [[a - passo * 0.17, r], [a + passo * 0.17, r], [a + passo * 0.3, r * 0.74], [a + passo * 0.7, r * 0.74]])
      pts.push(`${n(Math.cos(ang) * raio)} ${n(Math.sin(ang) * raio)}`);
  }
  return `M${pts.join('L')}Z`;
}
export function motor(cx, cy, t, r = 24) {
  return `<circle cx="${n(cx)}" cy="${n(cy)}" r="${r}" fill="${t.motor}"/>
<g transform="translate(${n(cx)} ${n(cy)})"><g fill="none" stroke="${t.sobreMotor}" stroke-width="2" stroke-linejoin="round">
<path d="${caminhoEngrenagem(r * 0.48)}"/><circle r="${n(r * 0.16)}"/>
<animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="9s" repeatCount="indefinite"/></g></g>`;
}
// Nó com ícone no lugar da engrenagem (porteiro, chatbot, IA)
export const no = (cx, cy, t, ic, r = 24) =>
  `<circle cx="${n(cx)}" cy="${n(cy)}" r="${r}" fill="${t.motor}"/>${iconeSvg(ic, cx, cy, r * 0.95, t.sobreMotor, 2)}`;
export const pontilhada = (d, t) =>
  `<path d="${d}" fill="none" stroke="${t.teal}" stroke-width="2.4" stroke-linecap="round" stroke-dasharray="0.1 7.5"/>`;
// Ponto que percorre um caminho só entre as frações a e b do ciclo P
export const viajante = (d, a, b, P, t, { volta = false, r = 5 } = {}) => `<circle r="${r}" fill="${t.teal}" opacity="0">
<animateMotion ${ciclo(P)} path="${d}" keyPoints="${volta ? '1;1;0;0' : '0;0;1;1'}" keyTimes="${kt(0, a, b, 1)}" calcMode="spline" keySplines="0 0 1 1;.4 0 .6 1;0 0 1 1"/>
<animate attributeName="opacity" ${ciclo(P)} calcMode="discrete" keyTimes="${kt(0, a, b)}" values="0;1;0"/></circle>`;
// Liga e desliga em degraus: visível só entre a e b
export function visivelEntre(a, b, P) {
  const base = `attributeName="opacity" ${ciclo(P)} calcMode="discrete"`;
  if (a <= 0) return `<animate ${base} keyTimes="${kt(0, b)}" values="1;0"/>`;
  if (b >= 1) return `<animate ${base} keyTimes="${kt(0, a)}" values="0;1"/>`;
  return `<animate ${base} keyTimes="${kt(0, a, b)}" values="0;1;0"/>`;
}
// Grupo que aparece entre a e b (com uma subida curta) e some depois
export const aparece = (conteudo, a, b, P, { sobe = 8 } = {}) => {
  const tempos = kt(0, a, a + 0.03, b, Math.min(b + 0.02, 0.999), 1);
  return `<g opacity="0"><animate attributeName="opacity" ${ciclo(P)} keyTimes="${tempos}" values="0;0;1;1;0;0"/>
<animateTransform attributeName="transform" type="translate" ${ciclo(P)} keyTimes="${tempos}" values="0 ${sobe};0 ${sobe};0 0;0 0;0 0;0 ${sobe}" calcMode="spline" keySplines="0 0 1 1;.2 .7 .2 1;0 0 1 1;0 0 1 1;0 0 1 1"/>
${conteudo}</g>`;
};
// Cortina da cor do cartão sobre um pedaço da imagem: some entre a e b e revela o que está por baixo.
// Sem SMIL a cortina fica transparente, então nada some de vez.
export const cortina = (m, cor, a, b, P, { fim = 0.95, rx = 0 } = {}) =>
  `<rect x="${n(m.x)}" y="${n(m.y)}" width="${n(m.w)}" height="${n(m.h)}" rx="${rx}" fill="${cor}" opacity="0"><animate attributeName="opacity" ${ciclo(P)} keyTimes="${kt(0, a, b, fim, Math.min(fim + 0.02, 0.999), 1)}" values="1;1;0;0;1;1"/></rect>`;
// Anel que cresce e some a partir do instante k (fração do ciclo)
export function pulso(cx, cy, r0, r1, k, d, P, cor) {
  const a = Math.max(k, 0.0005);
  const tempos = kt(0, a - 0.0004, a, a + d, 1);
  return `<circle cx="${n(cx)}" cy="${n(cy)}" r="${r0}" fill="none" stroke="${cor}" stroke-width="2" opacity="0">
<animate attributeName="r" ${ciclo(P)} keyTimes="${tempos}" values="${r0};${r0};${r0};${r1};${r1}"/>
<animate attributeName="opacity" ${ciclo(P)} keyTimes="${tempos}" values="0;0;.7;0;0"/></circle>`;
}
// Anel de alerta, pulsando sem parar
export const alertaPulsando = (cx, cy, r, cor) =>
  `<circle cx="${n(cx)}" cy="${n(cy)}" r="${r}" fill="none" stroke="${cor}" stroke-width="2"><animate attributeName="r" values="${r};${r + 10}" dur="1.5s" repeatCount="indefinite"/><animate attributeName="opacity" values=".7;0" dur="1.5s" repeatCount="indefinite"/></circle>`;
// Selo de "feito": círculo cheio com o visto
export const selo = (cx, cy, r, t, cor = t.teal) =>
  `<circle cx="${n(cx)}" cy="${n(cy)}" r="${r}" fill="${cor}"/>${iconeSvg('check', cx, cy, r * 1.5, t.cartao, 3)}`;
// Contorno aceso em volta de uma medida, visível entre a e b
export const contorno = (m, t, a, b, P, { rx = 12, cor = t.teal, folga = 0 } = {}) =>
  `<rect x="${n(m.x - folga)}" y="${n(m.y - folga)}" width="${n(m.w + 2 * folga)}" height="${n(m.h + 2 * folga)}" rx="${rx}" fill="none" stroke="${cor}" stroke-width="2.5" opacity="0">${visivelEntre(a, b, P)}</rect>`;
// Fundo aceso (realce de linha), visível entre a e b
export const realce = (m, cor, a, b, P, { rx = 0 } = {}) =>
  `<rect x="${n(m.x)}" y="${n(m.y)}" width="${n(m.w)}" height="${n(m.h)}" rx="${rx}" fill="${cor}" opacity="0">${visivelEntre(a, b, P)}</rect>`;
// Anima um atributo numérico de "de" para "para" entre a e b (e volta no fim do ciclo)
export const cresce = (P, atributo, de, para, a, b) =>
  `<animate attributeName="${atributo}" ${ciclo(P)} keyTimes="${kt(0, a, b, 1)}" values="${n(de)};${n(de)};${n(para)};${n(para)}" calcMode="spline" keySplines="0 0 1 1;.2 .7 .2 1;0 0 1 1"/>`;
// Seta que dá um toque para a direita de tempos em tempos
export const setaViva = (cx, cy, tam, cor) =>
  `<g>${iconeSvg('seta', cx, cy, tam, cor, 2.4)}<animateTransform attributeName="transform" type="translate" dur="2.8s" repeatCount="indefinite" keyTimes="0;.7;.85;1" values="0 0;0 0;5 0;0 0"/></g>`;
export const sublinhado = (m, t, atraso = 0.9) => {
  const y = n(m.y + m.h + 5);
  const T = n4(atraso + 0.7);
  return `<path d="M${n(m.x)} ${y}H${n(m.x + m.w)}" pathLength="1" stroke="${t.teal}" stroke-width="2.2" stroke-linecap="round" stroke-dasharray="1 2" stroke-dashoffset="0">
<animate attributeName="stroke-dashoffset" dur="${T}s" fill="freeze" keyTimes="${kt(0, atraso / T, 1)}" values="1.02;1.02;0" calcMode="spline" keySplines="0 0 1 1;.3 0 .2 1"/></path>`;
};
// Traço que se desenha entre a e b e fica até "fim"
export const desenha = (d, t, a, b, P, { fim = 0.95, esp = 2, cor = t.teal } = {}) =>
  `<path d="${d}" pathLength="1" fill="none" stroke="${cor}" stroke-width="${esp}" stroke-linecap="round" stroke-dasharray="1 2" stroke-dashoffset="0"><animate attributeName="stroke-dashoffset" ${ciclo(P)} keyTimes="${kt(0, a, b, fim, fim + 0.01, 1)}" values="1.02;1.02;0;0;1.02;1.02"/></path>`;
// Caminho da borda direita de a até a borda esquerda de b, na altura do meio de cada um
export function entre(a, b, folga = 9) {
  const x1 = a.x + a.w + folga;
  const x2 = b.x - folga;
  const y1 = a.y + a.h / 2;
  const y2 = b.y + b.h / 2;
  if (Math.abs(y1 - y2) < 0.5) return `M${n(x1)} ${n(y1)}H${n(x2)}`;
  const mx = (x1 + x2) / 2;
  return `M${n(x1)} ${n(y1)}C${n(mx)} ${n(y1)} ${n(mx)} ${n(y2)} ${n(x2)} ${n(y2)}`;
}
// Retângulo de medida a partir de um ponto (para ligar nós desenhados em SVG)
export const pontoComo = (cx, cy, r = 24) => ({ x: cx - r, y: cy - r, w: 2 * r, h: 2 * r });

// ---------- logo em camadas ----------

const cacheArquivo = {};
const dataUri = (caminho) => (cacheArquivo[caminho] ??= `data:image/png;base64,${readFileSync(join(RAIZ, caminho)).toString('base64')}`);
export function logoHtml(cfg, t) {
  const camada = (arquivo, cor) => {
    const m = `url('${dataUri(arquivo)}') center / contain no-repeat`;
    return `<div class="abs" style="inset:0;background:${cor};-webkit-mask:${m};mask:${m}"></div>`;
  };
  const c = cfg.logoCamadas;
  return camada(c.teal, t.logoB) + camada(c.navy, t.logoA) + camada(c.palavra, t.logoA);
}

// ---------- painel ilustrativo que troca de tela ----------

const LAT = 164; // menu lateral
const TOPO = 48;

function molduraPainel(t, { px, py, pw, ph, menu }) {
  return `<div class="abs cartao" style="left:${px}px;top:${py}px;width:${pw}px;height:${ph}px;overflow:hidden">
<div style="height:${TOPO - 1}px;display:flex;align-items:center;gap:10px;padding:0 16px;border-bottom:1px solid ${t.linha}">
<span style="width:22px;height:22px;border-radius:7px;background:${t.motor};display:grid;place-items:center">${icone('grade', 12, t.sobreMotor, 2.4)}</span>
<span class="ti" style="font-size:15px">Plataforma</span>
<span style="margin-left:26px;width:200px;height:26px;border-radius:13px;background:${t.campo};display:flex;align-items:center;padding:0 13px;font-size:12px;color:${t.suave}">Buscar</span>
<span style="margin-left:auto;display:flex;align-items:center;gap:12px">${icone('sino', 17, t.apoio)}<span style="width:24px;height:24px;border-radius:50%;background:${t.motor}"></span></span>
</div>
<div style="position:absolute;left:0;top:${TOPO}px;bottom:0;width:${LAT}px;border-right:1px solid ${t.linha};padding-top:12px">
${menu.map(([id, rotulo, ic]) => `<div data-m="menu-${id}" style="height:32px;display:flex;align-items:center;gap:10px;padding:0 16px;font-size:13.5px;color:${t.apoio}">${icone(ic, 14, t.suave)}${rotulo}</div>`).join('')}
<div style="position:absolute;left:16px;bottom:16px;display:flex;align-items:center;gap:9px;font-size:13.5px;color:${t.tealEsc}">${icone('faisca', 14, t.teal)}Agente de IA</div>
</div>
<div class="abs" style="right:16px;bottom:10px;font-size:10.5px;color:${t.suave}">interface ilustrativa · dados fictícios</div>
</div>`;
}

export const cabecalhoTela = (t, titulo, sub) =>
  `<div class="ti" style="font-size:21px;line-height:1.15">${titulo}</div><div style="font-size:12.5px;color:${t.suave};margin-top:3px">${sub}</div>`;

// telas: [{ menu, html(t, tw, th), reserva?, animar(f, ctx) }]
// ctx: { t, P, N, i, a (começo da fatia), T0 (tela já visível), T1 (tela começa a sair), ox, oy }
// moldura/folhaFn/lat/topo/aceso: trocam o desenho do painel (outro estilo usa a mesma mecânica)
export async function painelAnimado(t, R, { W, H, px, py, pw = 726, ph = 404, menu, telas, P, textoEsquerda = '', titulo, extra, moldura = molduraPainel, folhaFn = folha, lat = LAT, topo = TOPO, aceso }) {
  const LAT = lat; // eslint-disable-line no-shadow
  const TOPO = topo; // eslint-disable-line no-shadow
  const fb = await folhaFn(R, t, 'f', W, H, `${textoEsquerda}${moldura(t, { px, py, pw, ph, menu, lat: LAT, topo: TOPO })}`);
  const tw = pw - LAT;
  const th = ph - TOPO;
  const ox = px + LAT;
  const oy = py + TOPO;
  const folhas = [];
  for (const [i, tela] of telas.entries()) folhas.push(await folhaFn(R, t, `t${i}`, tw, th, tela.html(t, tw, th), tela.reserva ?? 0));

  // Cada tela aparece, anima e sai antes de a próxima entrar. Nada começa antes do zero,
  // então a volta do ciclo acontece com tudo apagado.
  const N = telas.length;
  const F = 0.35 / P;
  const some = (i) => {
    const a = i / N;
    const b = (i + 1) / N;
    const [tempos, valores] =
      i === 0 ? [kt(0, F, b - F, b, 1), '0;1;1;0;0'] : i === N - 1 ? [kt(0, a, a + F, 1 - F, 1), '0;0;1;1;0'] : [kt(0, a, a + F, b - F, b, 1), '0;0;1;1;0;0'];
    return `<animate attributeName="opacity" ${ciclo(P)} keyTimes="${tempos}" values="${valores}"/>`;
  };
  const conteudo = telas
    .map((tela, i) => {
      const ctx = { t, P, N, i, a: i / N, T0: i / N + F, T1: (i + 1) / N - F, ox, oy };
      return `<g${i === 0 ? '' : ' opacity="0"'}>${some(i)}${folhas[i].base(ox, oy)}${tela.animar(folhas[i], ctx)}</g>`;
    })
    .join('\n');

  // O item aceso do menu acompanha a tela
  const ys = telas.map((tela) => fb.medidas[`menu-${tela.menu}`].y);
  const tempos = [0];
  const posicoes = [ys[0]];
  const curvas = [];
  telas.forEach((_, i) => {
    const b = (i + 1) / N;
    tempos.push(b - F, b);
    posicoes.push(ys[i], ys[(i + 1) % N]);
    curvas.push('0 0 1 1', '.3 0 .2 1');
  });
  const desliza = (d = 0) =>
    `<animate attributeName="y" ${ciclo(P)} keyTimes="${kt(...tempos)}" values="${posicoes.map((y) => n(y + d)).join(';')}" calcMode="spline" keySplines="${curvas.join(';')}"/>`;
  const cores = aceso ?? { fundo: t.tealFundo, barra: t.teal, rx: 1.5 };
  const acesoMenu = `<rect x="${px}" y="${n(ys[0])}" width="${LAT}" height="32" fill="${cores.fundo}">${desliza()}</rect>
<rect x="${px}" y="${n(ys[0] + 5)}" width="3" height="22" rx="${cores.rx}" fill="${cores.barra}">${desliza(5)}</rect>`;

  return svg({
    w: W,
    h: H,
    titulo,
    defs: fb.def + folhas.map((f) => f.def).join(''),
    corpo: `${fb.base()}\n${acesoMenu}\n${conteudo}\n${extra ? extra(fb) : ''}`,
  });
}

// ---------- cenas usadas no perfil e no portfólio ----------
// Cada cena devolve { html, reserva, animar(f) }. x0 = onde a cena começa; cy = linha do meio; H = altura visível.
// Largura de cada uma: 538.

// Lead: o formulário é preenchido, passa pelo motor e vira mensagem no WhatsApp
export function cenaLead(t, { x0, cy, H }) {
  const xm = x0 + 244; // motor
  const zx = x0 + 360; // cartão do WhatsApp
  const zw = 178;
  return {
    reserva: 110,
    html: `<div class="abs cartaoP" data-m="a" style="left:${x0}px;top:${cy - 58}px;width:140px;height:116px;padding:13px 14px">
<div style="font-size:11px;line-height:1;color:${t.suave}">landing page</div>
<div data-m="c1" style="height:15px;border-radius:5px;background:${t.campo};margin-top:10px"></div>
<div data-m="c2" style="height:15px;border-radius:5px;background:${t.campo};margin-top:7px"></div>
<div class="ti" data-m="enviar" style="margin-top:11px;width:70px;height:25px;border-radius:7px;background:${t.motor};color:${t.sobreMotor};font-size:11.5px;display:grid;place-items:center">Enviar</div></div>
<div class="abs cartaoP" data-m="b" style="left:${zx}px;top:${cy - 58}px;width:${zw}px;height:116px;padding:13px 14px">
<div class="rot">${icone('balao', 12, t.suave, 2.2)}WhatsApp</div>
<div data-m="vaga" style="height:62px;margin-top:11px"></div></div>
<div class="abs" data-m="balao" style="left:${zx + 14}px;top:${H + 20}px;width:${zw - 40}px;height:62px;border-radius:12px 12px 12px 4px;background:${t.zap};padding:13px 12px 0">
<div class="barra" style="height:7px"></div><div class="barra" style="height:7px;width:62%;margin-top:7px"></div>
<div class="nu" style="display:flex;justify-content:flex-end;align-items:center;gap:4px;font-size:10px;line-height:1;color:${t.suave};margin-top:7px">agora${icone('checks', 13, t.tealEsc, 2.2)}</div></div>`,
    animar(f) {
      const m = f.medidas;
      const P = 6.5;
      const d1 = `M${n(m.a.x + m.a.w + 9)} ${cy}H${xm - 33}`;
      const d2 = `M${xm + 33} ${cy}H${n(m.b.x - 9)}`;
      const digita = (c, a, b, fr) =>
        `<rect x="${n(c.x + 6)}" y="${n(c.y + c.h / 2 - 2.5)}" width="${n(c.w * fr)}" height="5" rx="2.5" fill="${t.navy2}"><animate attributeName="width" ${ciclo(P)} keyTimes="${kt(0, a, b, 0.95, 0.97, 1)}" values="0;0;${n(c.w * fr)};${n(c.w * fr)};0;0"/></rect>`;
      const e = m.enviar;
      const chega = kt(0, 0.54, 0.59, 0.94, 0.97, 1);
      return `${digita(m.c1, 0.02, 0.09, 0.62)}${digita(m.c2, 0.1, 0.16, 0.44)}
<rect x="${n(e.x)}" y="${n(e.y)}" width="${n(e.w)}" height="${n(e.h)}" rx="7" fill="${t.teal}" opacity="0"><animate attributeName="opacity" ${ciclo(P)} keyTimes="${kt(0, 0.175, 0.19, 0.25, 1)}" values="0;0;.6;0;0"/></rect>
${pontilhada(d1, t)}${pontilhada(d2, t)}${motor(xm, cy, t)}
${viajante(d1, 0.22, 0.36, P, t)}${pulso(xm, cy, 24, 33, 0.36, 0.08, P, t.teal)}${viajante(d2, 0.4, 0.54, P, t)}
${contorno(m.b, t, 0.54, 0.94, P)}
<g><animate attributeName="opacity" ${ciclo(P)} keyTimes="${chega}" values="0;0;1;1;0;0"/>
<animateTransform attributeName="transform" type="translate" ${ciclo(P)} keyTimes="${chega}" values="0 10;0 10;0 0;0 0;0 0;0 10" calcMode="spline" keySplines="0 0 1 1;.2 .7 .2 1;0 0 1 1;0 0 1 1;0 0 1 1"/>
${f.recorte('balao', m.vaga.x, m.vaga.y)}</g>`;
    },
  };
}

// Pedido B2B: o campo do pedido decide em qual empresa ele entra no ERP
export function cenaPedido(t, { x0, cy, H }) {
  const xm = x0 + 244;
  const erp = (id, rotulo, topo) => `<div class="abs cartaoP" data-m="${id}" style="left:${x0 + 360}px;top:${topo}px;width:178px;height:56px;display:flex;align-items:center;gap:11px;padding:0 14px">
${icone('erp', 19, t.apoio)}<div><div class="nu" style="font-size:10px;line-height:1.2;color:${t.suave}">ERP</div><div class="ti" style="font-size:14px;line-height:1.2">${rotulo}</div></div></div>`;
  const chipEmpresa = (id, rotulo, topo) =>
    `<div class="abs ti" data-m="${id}" style="left:${x0 + 14}px;top:${topo}px;font-size:12px;line-height:1;white-space:nowrap;color:${t.tealEsc};background:${t.tealFundo};border-radius:6px;padding:5px 9px">${rotulo}</div>`;
  return {
    reserva: 90,
    html: `<div class="abs cartaoP" data-m="a" style="left:${x0}px;top:${cy - 64}px;width:146px;height:128px;padding:13px 14px">
<div style="font-size:11px;line-height:1;color:${t.suave}">pedido · CRM</div>
<div class="barra" style="margin-top:11px;width:70%"></div><div class="barra" style="margin-top:7px"></div>
<div style="font-size:11px;line-height:1;color:${t.suave};margin-top:14px">empresa</div>
<div data-m="vaga" style="height:22px;margin-top:6px"></div></div>
${erp('e1', 'Empresa 1', cy - 64)}${erp('e2', 'Empresa 2', cy + 8)}
${chipEmpresa('chip1', 'Empresa 1', H + 16)}${chipEmpresa('chip2', 'Empresa 2', H + 50)}`,
    animar(f) {
      const m = f.medidas;
      const P = 10;
      const d1 = `M${n(m.a.x + m.a.w + 9)} ${cy}H${xm - 33}`;
      const ramo = (e) => `M${xm + 33} ${cy}C${xm + 70} ${cy} ${xm + 56} ${n(e.y + e.h / 2)} ${n(e.x - 9)} ${n(e.y + e.h / 2)}`;
      const vez = (e, chipId, base) => `<g opacity="0">${visivelEntre(base, base + 0.5, P)}${f.recorte(chipId, m.vaga.x, m.vaga.y)}</g>
${viajante(d1, base + 0.05, base + 0.17, P, t)}${pulso(xm, cy, 24, 33, base + 0.17, 0.07, P, t.teal)}${viajante(ramo(e), base + 0.2, base + 0.32, P, t)}
<g opacity="0">${visivelEntre(base + 0.32, base + 0.47, P)}<rect x="${n(e.x)}" y="${n(e.y)}" width="${n(e.w)}" height="${n(e.h)}" rx="12" fill="none" stroke="${t.teal}" stroke-width="2.5"/>${selo(e.x + e.w - 22, e.y + e.h / 2, 9, t)}</g>`;
      return `${pontilhada(d1, t)}${pontilhada(ramo(m.e1), t)}${pontilhada(ramo(m.e2), t)}${motor(xm, cy, t)}
${vez(m.e1, 'chip1', 0)}
${vez(m.e2, 'chip2', 0.5)}`;
    },
  };
}

// Rastreio: cada pagamento é procurado nos pedidos e volta com o código de rastreio
export function cenaRastreio(t, { x0, cy }) {
  const pagamentos = ['#1043', '#1051', '#1060', '#1077'];
  const pedidos = ['#1060', '#1043', '#1077', '#1051'];
  const tabela = (left, tituloTabela, linhas) => `<div class="abs cartaoP" style="left:${left}px;top:${cy - 68}px;width:206px;height:136px;overflow:hidden">
<div style="height:28px;display:flex;align-items:center;padding:0 13px;font-size:11px;color:${t.suave};border-bottom:1px solid ${t.linha}">${tituloTabela}</div>
${linhas.join('')}</div>`;
  return {
    html:
      tabela(
        x0,
        'pagamentos',
        pagamentos.map(
          (numero, i) =>
            `<div class="nu" data-m="p${i}" style="height:27px;display:flex;align-items:center;padding:0 13px;font-size:12.5px">${numero}<span data-m="s${i}" style="margin-left:auto;width:15px;height:15px;border-radius:50%;border:1.5px dashed ${t.suave}"></span></div>`,
        ),
      ) +
      tabela(
        x0 + 332,
        'pedidos · rastreio',
        pedidos.map(
          (numero, i) =>
            `<div class="nu" data-m="r${i}" style="height:27px;display:flex;align-items:center;padding:0 13px;font-size:12.5px">${numero}<span class="barra" style="margin-left:auto;width:62px;height:7px"></span></div>`,
        ),
      ),
    animar(f) {
      const m = f.medidas;
      const P = 8;
      const FIM = 0.95;
      return pagamentos
        .map((numero, i) => {
          const a = m[`p${i}`];
          const b = m[`r${pedidos.indexOf(numero)}`];
          const s = m[`s${i}`];
          const ini = 0.04 + i * 0.19;
          const achou = ini + 0.1;
          const voltou = achou + 0.06;
          const d = entre(a, b, 5);
          return `${realce(a, t.tealFundo, ini, voltou, P)}${realce(b, t.tealFundo, ini, voltou, P)}
${desenha(d, t, ini, achou, P, { fim: FIM })}
${viajante(d, achou, voltou, P, t, { volta: true, r: 4.5 })}
<g opacity="0">${visivelEntre(voltou, FIM, P)}${selo(s.x + s.w / 2, s.y + s.h / 2, 8.5, t)}</g>`;
        })
        .join('\n');
    },
  };
}

export { esc, n, n4, svg };
