// Utilidades compartilhadas pelos estilos.

export const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const n = (x) => +(+x).toFixed(2);
export const n4 = (x) => +(+x).toFixed(4);
export const chars = (s) => [...String(s)].length;
export const maiusculas = (s) => String(s).toLocaleUpperCase('pt-BR');
export const semAcento = (s) => String(s).normalize('NFD').replace(/\p{Diacritic}/gu, '');

export function quebrar(texto, max) {
  const linhas = [];
  let atual = '';
  for (const p of String(texto).split(/\s+/)) {
    const tentativa = atual ? `${atual} ${p}` : p;
    if (chars(tentativa) > max && atual) {
      linhas.push(atual);
      atual = p;
    } else atual = tentativa;
  }
  if (atual) linhas.push(atual);
  return linhas;
}

// Larguras da Helvetica/Arial em milésimos de em (as duas têm as mesmas medidas).
// Servem para posicionar enfeites sem precisar de navegador.
const NORMAL = {
  ' ': 278, a: 556, b: 556, c: 500, d: 556, e: 556, f: 278, g: 556, h: 556, i: 222, j: 222, k: 500, l: 222, m: 833,
  n: 556, o: 556, p: 556, q: 556, r: 333, s: 500, t: 278, u: 556, v: 500, w: 722, x: 500, y: 500, z: 500,
  A: 667, B: 667, C: 722, D: 722, E: 667, F: 611, G: 778, H: 722, I: 278, J: 500, K: 667, L: 556, M: 833, N: 722,
  O: 778, P: 667, Q: 778, R: 722, S: 667, T: 611, U: 722, V: 667, W: 944, X: 667, Y: 667, Z: 611,
  '.': 278, ',': 278, ':': 278, ';': 278, '-': 333, '(': 333, ')': 333, '/': 278, '·': 278, '"': 355, "'": 191,
  '!': 278, '?': 556, '@': 1015, '=': 584, '+': 584, '&': 667, '%': 889, '_': 556, '|': 260, '→': 1000, '↗': 1000,
};
const NEGRITO = {
  ' ': 278, a: 556, b: 611, c: 556, d: 611, e: 556, f: 333, g: 611, h: 611, i: 278, j: 278, k: 556, l: 278, m: 889,
  n: 611, o: 611, p: 611, q: 611, r: 389, s: 556, t: 333, u: 611, v: 556, w: 778, x: 556, y: 556, z: 500,
  A: 722, B: 722, C: 722, D: 722, E: 667, F: 611, G: 778, H: 722, I: 278, J: 556, K: 722, L: 611, M: 833, N: 722,
  O: 778, P: 667, Q: 778, R: 722, S: 667, T: 611, U: 722, V: 667, W: 944, X: 667, Y: 667, Z: 611,
  '.': 278, ',': 278, ':': 333, ';': 333, '-': 333, '(': 333, ')': 333, '/': 278, '·': 278, '"': 474, "'": 238,
  '!': 333, '?': 611, '@': 975, '=': 584, '+': 584, '&': 722, '%': 889, '_': 556, '|': 280, '→': 1000, '↗': 1000,
};

export function largura(texto, fs, negrito = false) {
  const t = negrito ? NEGRITO : NORMAL;
  let u = 0;
  for (const c of String(texto)) u += t[c] ?? t[semAcento(c)] ?? 556;
  return (u / 1000) * fs;
}

// Gerador determinístico: a mesma "mão" desenha igual toda vez que o perfil é gerado.
export function sorteio(semente) {
  let s = 2166136261;
  for (const c of String(semente)) s = Math.imul(s ^ c.charCodeAt(0), 16777619) >>> 0;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

export function svg({ w, h, titulo, css = '', defs = '', corpo }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(titulo)}">
<title>${esc(titulo)}</title>
<style>${css}
@media (prefers-reduced-motion: reduce){*{animation-duration:0s!important;animation-delay:0s!important}}
</style>
${defs ? `<defs>${defs}</defs>\n` : ''}${corpo}
</svg>
`;
}

// Animação SMIL em "degraus": mostra o elemento só entre ini e fim (segundos) dentro de um ciclo P.
export function janela(ini, fim, P) {
  const a = n4(ini / P);
  const b = n4(fim / P);
  if (a <= 0 && b >= 1) return '';
  const base = `attributeName="opacity" dur="${n4(P)}s" repeatCount="indefinite" calcMode="discrete"`;
  if (a <= 0) return `<animate ${base} keyTimes="0;${b}" values="1;0"/>`;
  if (b >= 1) return `<animate ${base} keyTimes="0;${a}" values="0;1"/>`;
  return `<animate ${base} keyTimes="0;${a};${b}" values="0;1;0"/>`;
}
