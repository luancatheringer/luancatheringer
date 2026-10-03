// Estilo "Terminal": o visual de terminal, com o conteúdo em português claro (nada de perfil escrito em código).
// Topo: "neofetch" imprime a logo da LC em ASCII e, ao lado, a ficha (o que faz, o que conecta, com o que trabalha).
// Números: "luan --stats" com contagem e o gráfico das atualizações da plataforma por dia (dados reais do histórico).
// Destaque: "plataforma --sobre" com o que a plataforma tem e, ao lado, o dia a dia dela rolando.
// As partes fixas são desenhadas no navegador (fonte JetBrains Mono) e viram imagem; as animações (SMIL) entram por cima.

import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { esc, n, n4, quebrar, svg } from './_base.mjs';
import { folha as folhaBase } from './_lc.mjs';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');

// Um tema só, escuro, como um terminal (o mesmo arquivo serve para os dois temas do GitHub)
export const C = {
  fundo: '#0B0F1C', barra: '#0E1426', painel: '#080C17', borda: '#1C2440',
  texto: '#D6DEFF', apagado: '#6B7391', numeroLinha: '#3A4466', comentario: '#5C6787',
  chave: '#2CC9B9', string: '#9BE0B5', numero: '#FED10A', prop: '#9FB3FF', pont: '#8C94B0', erro: '#FF6B6F', ok: '#5BC98A',
};

const FONTES_LINK =
  '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>' +
  '<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,400;0,700;1,400&display=block" rel="stylesheet">';
const FONTES = ['400 16px "JetBrains Mono"', '700 16px "JetBrains Mono"', 'italic 400 16px "JetBrains Mono"'];

const pagina = (t, w, h, corpo) => `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">${FONTES_LINK}<style>
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:${w}px;height:${h}px;background:transparent;overflow:hidden}
body{position:relative;font-family:"JetBrains Mono",Consolas,monospace;font-weight:400;color:${C.texto};-webkit-font-smoothing:antialiased;font-variant-ligatures:none}
.abs{position:absolute}
.linha{white-space:pre}
.comentario{color:${C.comentario};font-style:italic}.chave{color:${C.chave}}.string{color:${C.string}}.numero{color:${C.numero}}.prop{color:${C.prop}}.pont{color:${C.pont}}.texto{color:${C.texto}}.apagado{color:${C.apagado}}.ok{color:${C.ok}}
</style></head><body>${corpo}</body></html>`;

const folha = (R, id, W, H, corpo, reserva = 0) => folhaBase(R, C, id, W, H, corpo, reserva, { montar: pagina, fontes: FONTES });

// Janela de terminal: barra com os três pontos, abas e um rótulo à direita
const janela = ({ x, y, w, h, abas = [], direita = '' }) => `<div class="abs" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px;background:${C.fundo};border:1px solid ${C.borda};border-radius:10px;overflow:hidden">
<div style="height:38px;background:${C.barra};border-bottom:1px solid ${C.borda};display:flex;align-items:stretch;padding-left:14px">
<div style="display:flex;align-items:center;gap:8px;margin-right:18px">${['#FF5F57', '#FEBC2E', '#28C840'].map((c) => `<span style="width:11px;height:11px;border-radius:50%;background:${c};opacity:.8"></span>`).join('')}</div>
${abas.map((a, i) => `<div style="display:flex;align-items:center;gap:8px;padding:0 16px;font-size:12.5px;${i === 0 ? `background:${C.fundo};color:${C.texto};box-shadow:inset 0 2px 0 ${C.chave}` : `color:${C.apagado}`}">${esc(a)}</div>`).join('')}
<div style="margin-left:auto;display:flex;align-items:center;padding-right:16px;font-size:12px;color:${C.apagado}">${esc(direita)}</div>
</div></div>`;

const sombraJanela = (x, y, w, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="#000" opacity=".35" filter="url(#sombraJ)"/>`;
const defsSombra = '<filter id="sombraJ" x="-10%" y="-10%" width="120%" height="140%"><feGaussianBlur stdDeviation="14"/></filter>';
const inteira = (W, H, id = 'f') => `<svg x="0" y="0" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><use href="#${id}"/></svg>`;
// aparece de vez no instante t0 (s) de uma animação que toca uma vez (T s) e fica
const surgeEm = (t0, T, conteudo) => `<g opacity="0"><animate attributeName="opacity" dur="${T}s" fill="freeze" calcMode="discrete" keyTimes="0;${n4(t0 / T)}" values="0;1"/>${conteudo}</g>`;
const cursorPiscando = (x, y, w, h) =>
  `<rect x="${n(x)}" y="${n(y)}" width="${n(w)}" height="${n(h)}" fill="${C.texto}" opacity=".8"><animate attributeName="opacity" dur="1.06s" repeatCount="indefinite" calcMode="discrete" keyTimes="0;.5" values=".8;0"/></rect>`;

const dataUri = (caminho) => `data:image/png;base64,${readFileSync(join(RAIZ, caminho)).toString('base64')}`;

const PROMPT = 'luan@lc ~ $ ';
const prompt = (cmd) => `<span class="chave">luan@lc</span> <span class="prop">~</span> <span class="apagado">$</span> <span class="texto">${esc(cmd)}</span>`;

// Comando digitado depois do prompt: um recorte da folha "g" que cresce letra a letra, com o cursor acompanhando
// até a saída do comando começar (instante "ate").
function digitar({ id, m, cw, cmd, t0, passo, T, ate, W, H }) {
  const pre = PROMPT.length;
  const tempos = [];
  for (let k = 0; k <= cmd.length; k++) tempos.push(t0 + k * passo);
  const kts = `0;${tempos.map((x) => n4(x / T)).join(';')}`;
  const larg = (k) => n((pre + k) * cw + 1);
  const xCur = (k) => n(m.x + (pre + k) * cw);
  return {
    clip: `<clipPath id="${id}"><rect x="${n(m.x)}" y="${n(m.y)}" width="${larg(0)}" height="${n(m.h)}"><animate attributeName="width" dur="${T}s" fill="freeze" calcMode="discrete" keyTimes="${kts}" values="${larg(0)};${tempos.map((_, k) => larg(k)).join(';')}"/></rect></clipPath>`,
    texto: `<g clip-path="url(#${id})">${inteira(W, H, 'g')}</g>`,
    cursor: `<rect x="${xCur(0)}" y="${n(m.y + 2)}" width="${n(cw)}" height="${n(m.h - 4)}" fill="${C.texto}" opacity=".8">
<animate attributeName="x" dur="${T}s" fill="freeze" calcMode="discrete" keyTimes="${kts}" values="${xCur(0)};${tempos.map((_, k) => xCur(k)).join(';')}"/>
<animate attributeName="opacity" dur="${T}s" fill="freeze" calcMode="discrete" keyTimes="0;${n4(ate / T)}" values=".8;0"/></rect>`,
  };
}

// ---------- topo: neofetch, com a logo em ASCII e a ficha ----------

// A logo da LC (letras e engrenagem) virando caracteres: cobertura de cada célula → um caractere da rampa.
// A logo é recortada no que tem desenho (a palavra fica de fora) e passa por um desfoque leve antes da contagem:
// isso fecha os traços finos do circuito dentro do C, que em caracteres virariam ruído.
export async function asciiDaLogo(executar, cfg, cols, rows, aspecto) {
  const c = cfg.logoCamadas;
  const camadas = [c.navy, c.teal].map(dataUri);
  const expressao = `(async () => {
    const carregar = (src) => new Promise((ok, erro) => { const i = new Image(); i.onload = () => ok(i); i.onerror = erro; i.src = src; });
    const imgs = await Promise.all(${JSON.stringify(camadas)}.map(carregar));
    const iw = imgs[0].naturalWidth, ih = imgs[0].naturalHeight;
    let x0 = iw, y0 = ih, x1 = 0, y1 = 0;
    for (const img of imgs) {
      const cv = document.createElement('canvas'); cv.width = iw; cv.height = ih;
      const g = cv.getContext('2d'); g.drawImage(img, 0, 0);
      const d = g.getImageData(0, 0, iw, ih).data;
      for (let y = 0; y < ih; y++) for (let x = 0; x < iw; x++)
        if (d[(y * iw + x) * 4 + 3] > 120) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
    }
    const bw = x1 - x0 + 1, bh = y1 - y0 + 1;
    const S = 8, cw = S, ch = Math.round(S / ${aspecto});
    const W = ${cols} * cw, H = ${rows} * ch;
    let ah = H, aw = ah * bw / bh; if (aw > W) { aw = W; ah = aw * bh / bw; }
    const ox = (W - aw) / 2, oy = (H - ah) / 2;
    return imgs.map((img) => {
      const cv = document.createElement('canvas'); cv.width = W; cv.height = H;
      const g = cv.getContext('2d');
      g.filter = 'blur(' + Math.max(1, ah * 0.009) + 'px)';
      g.drawImage(img, x0, y0, bw, bh, ox, oy, aw, ah);
      const d = g.getImageData(0, 0, W, H).data;
      const grade = [];
      for (let r = 0; r < ${rows}; r++) { const linha = [];
        for (let k = 0; k < ${cols}; k++) { let cheio = 0;
          for (let y = r * ch; y < (r + 1) * ch; y++) for (let x = k * cw; x < (k + 1) * cw; x++) if (d[(y * W + x) * 4 + 3] > 110) cheio++;
          linha.push(+(cheio / (cw * ch)).toFixed(3)); }
        grade.push(linha); }
      return grade;
    });
  })()`;
  const [letras, engrenagem] = await executar('<!doctype html><html><body></body></html>', expressao);
  const RAMPA = ' .:-=+*#%@';
  return letras.map((linha, r) =>
    linha.map((cobLetra, k) => {
      const cobEng = engrenagem[r][k];
      const cob = Math.max(cobLetra, cobEng);
      // 80% de cobertura já vira o caractere mais cheio: o miolo das letras fica sólido
      const ch = cob < 0.04 ? ' ' : RAMPA[Math.max(1, Math.min(9, Math.round(Math.min(1, cob / 0.8) * 9)))];
      return { ch, cor: ch === ' ' ? '' : cobEng > cobLetra ? 'chave' : 'prop' };
    }),
  );
}

// Junta caracteres da mesma cor num span só
export const linhaAscii = (celulas) => {
  let html = '';
  let atual = null;
  let buf = '';
  const fecha = () => {
    if (!buf) return;
    html += atual ? `<span class="${atual}">${esc(buf)}</span>` : esc(buf);
    buf = '';
  };
  for (const { ch, cor } of celulas) {
    const c2 = ch === ' ' ? atual : cor;
    if (c2 !== atual) {
      fecha();
      atual = c2;
    }
    buf += ch;
  }
  fecha();
  return html;
};

// Valor da ficha: troca {nome}, {emUso} e {lema} pelos dados do config; números ficam em amarelo
const textoFicha = (cfg, v) =>
  String(v)
    .replaceAll('{nome}', cfg.nome)
    .replaceAll('{emUso}', String(cfg.resumo?.grande?.valor ?? ''))
    .replaceAll('{lema}', cfg.fraseFinal.toLocaleLowerCase('pt-BR'));
const valorFicha = (cfg, v, cor) => {
  const s = esc(textoFicha(cfg, v));
  return cor ? `<span class="${cor}">${s}</span>` : `<span class="texto">${s.replace(/\d+/g, (d) => `<span class="numero">${d}</span>`)}</span>`;
};

export async function topo(cfg, R, executar) {
  const W = 1200;
  const H = 480;
  const jx = 10;
  const jy = 10;
  const jw = 1180;
  const jh = 460;
  const px = jx + 28; // prompts
  const py = jy + 38 + 16;
  const fsP = 14;
  const lhP = 20;

  // logo em ASCII (célula de 9,5 px: 5,7 de largura por 11,4 de altura)
  const cols = 62;
  const rows = 21;
  const lhA = 11.4;
  const ax = jx + 30;
  const ay = py + 40;
  const ascii = await asciiDaLogo(executar, cfg, cols, rows, 5.7 / lhA);

  // a ficha, ao lado da logo, como no neofetch
  const ficha = cfg.ficha ?? [];
  const largChave = Math.max(0, ...ficha.map(([k]) => [...k].length)) + 2;
  const fx = 450;
  const fy = ay - 4;
  const lhF = 26;
  const linhasFicha = [
    '<span class="chave" style="font-weight:700">luan</span><span class="texto">@</span><span class="chave" style="font-weight:700">lc</span>',
    `<span class="apagado">${'─'.repeat(10)}</span>`,
    ...ficha.map(([k, v, cor]) => `<span class="chave" style="font-weight:700">${esc(k.padEnd(largChave))}</span>${valorFicha(cfg, v, cor)}`),
  ];
  // as oito cores do terminal, como o neofetch mostra no fim
  const CORES = [C.borda, C.erro, C.ok, C.numero, C.prop, '#C792EA', C.chave, C.texto];
  const yBlocos = fy + linhasFicha.length * lhF + 12;
  const yP2 = jy + jh - 52;

  const f = await folha(R, 'f', W, H, janela({ x: jx, y: jy, w: jw, h: jh, abas: ['zsh'], direita: 'luan@lc: ~' }));
  // tudo o que é impresso fica na folha "g", no lugar final, e entra animado por cima da janela
  const g = await folha(
    R,
    'g',
    W,
    H,
    `<div class="abs linha" data-m="p1" style="left:${px}px;top:${py}px;font-size:${fsP}px;line-height:${lhP}px">${prompt('neofetch')}</div>
${ascii.map((linha, r) => `<div class="abs linha" data-m="a${r}" style="left:${ax}px;top:${n(ay + r * lhA)}px;font-size:9.5px;line-height:${lhA}px;font-weight:700">${linhaAscii(linha)}</div>`).join('')}
${linhasFicha.map((l, k) => `<div class="abs linha" data-m="i${k}" style="left:${fx}px;top:${fy + k * lhF}px;font-size:15px;line-height:${lhF}px">${l}</div>`).join('')}
<div class="abs" data-m="blocos" style="left:${fx}px;top:${yBlocos}px;display:flex">${CORES.map((c) => `<span style="width:28px;height:16px;background:${c}"></span>`).join('')}</div>
<div class="abs linha" data-m="p2" style="left:${px}px;top:${yP2}px;font-size:${fsP}px;line-height:${lhP}px">${prompt('')}</div>
<div class="abs linha" data-m="ref" style="left:20px;top:${H + 10}px;font-size:${fsP}px;line-height:${lhP}px">${'0'.repeat(40)}</div>`,
    50,
  );
  const m = g.medidas;
  const cw = m.ref.w / 40; // largura de um caractere (fonte monoespaçada)

  // digita "neofetch", imprime a logo linha a linha e a ficha ao lado, as cores e um prompt novo piscando
  const T = 3.2;
  const tCmd = 0.55;
  const passo = 0.065;
  const tSaida = tCmd + 'neofetch'.length * passo + 0.3;
  const dig = digitar({ id: 'cCmd', m: m.p1, cw, cmd: 'neofetch', t0: tCmd, passo, T, ate: tSaida, W, H });
  const logo = ascii.map((_, r) => surgeEm(tSaida + r * 0.03, T, g.recorte(`a${r}`, m[`a${r}`].x, m[`a${r}`].y))).join('');
  const linhas = linhasFicha.map((_, k) => surgeEm(tSaida + 0.04 + k * 0.085, T, g.recorte(`i${k}`, m[`i${k}`].x, m[`i${k}`].y))).join('');
  const tBlocos = tSaida + 0.06 + linhasFicha.length * 0.085;
  const blocos = surgeEm(tBlocos, T, g.recorte('blocos', m.blocos.x, m.blocos.y));
  const p2 = m.p2;
  const final = surgeEm(tBlocos + 0.3, T, `${g.recorte('p2', p2.x, p2.y)}${cursorPiscando(p2.x + PROMPT.length * cw, p2.y + 2, cw, p2.h - 4)}`);

  const alt = ficha.map(([k, v]) => `${k}: ${textoFicha(cfg, v)}`).join('; ');
  return svg({
    w: W,
    h: H,
    titulo: `${cfg.nome}. ${alt}`,
    defs: `${f.def}${g.def}${defsSombra}${dig.clip}`,
    corpo: `${sombraJanela(jx + 10, jy + 16, jw - 20, jh - 10)}${inteira(W, H)}${dig.texto}${dig.cursor}${logo}${linhas}${blocos}${final}`,
  });
}

// ---------- números: luan --stats + o gráfico das atualizações ----------

function contador(f, ids, destino, inicio, dur, P) {
  const N = ids.length;
  const tempos = ids.map((_, i) => inicio + dur * (1 - Math.cbrt(1 - i / Math.max(1, N - 1))));
  return ids
    .map((id, i) => {
      const mm = f.medidas[id];
      const a = tempos[i] / P;
      const b = i < N - 1 ? tempos[i + 1] / P : null;
      const quadro = f.recorte(id, destino.xDir - mm.w, destino.y);
      if (b === null) return `<g><animate attributeName="opacity" dur="${P}s" fill="freeze" calcMode="discrete" keyTimes="0;${n4(a)}" values="0;1"/>${quadro}</g>`;
      return `<g opacity="0"><animate attributeName="opacity" dur="${P}s" fill="freeze" calcMode="discrete" keyTimes="0;${n4(a)};${n4(b)}" values="0;1;0"/>${quadro}</g>`;
    })
    .join('');
}
function quadrosDe(valor, { passos = 18, sufixo = '' } = {}) {
  const k = Math.min(passos, valor);
  const l = [];
  for (let i = 0; i <= k; i++) l.push(Math.round((valor * i) / k).toLocaleString('pt-BR'));
  if (sufixo) l[l.length - 1] += sufixo;
  return l;
}

export async function stats(cfg, R) {
  const W = 1200;
  const H = 370;
  const r = cfg.resumo;
  const atv = cfg.atividade;
  // a linha marcada com daAtividade usa a soma do gráfico, para os dois nunca discordarem
  const soma = atv ? atv.dias.reduce((s, [, q]) => s + q, 0) : null;
  const linhas = r.linhas.map((l) => ({ ...l, valor: l.daAtividade && soma !== null ? soma : l.valor }));
  linhas.push({ rotulo: r.grande.rotulo, valor: r.grande.valor, extra: true });
  linhas.forEach((l) => (l.rotulo = l.rotulo.toLocaleLowerCase('pt-BR')));
  const jx = 10;
  const jy = 10;
  const jw = 1180;
  const jh = 350;
  const lx = jx + 28;
  const ly = jy + 38 + 26;
  const LH = 40;
  const yL = (i) => ly + 42 + i * LH;
  const yP2 = yL(linhas.length) + 4;
  const LARG = 30; // colunas até a coluna dos números
  const CW = 9; // JetBrains Mono a 15 px: 0,6 em
  const colNum = lx + (LARG + 1) * CW + 70; // borda direita da coluna dos números
  const quadros = linhas.map((l) => quadrosDe(l.valor, l));

  // gráfico das atualizações por dia (semanas em colunas, de segunda a domingo)
  const dias = new Map((atv?.dias ?? []).map(([d, q]) => [d, q]));
  const ini = atv ? new Date(`${atv.inicio}T12:00:00`) : null;
  const fim = atv ? new Date(`${atv.fim}T12:00:00`) : null;
  const semanas = [];
  if (ini) {
    const seg = new Date(ini);
    seg.setDate(seg.getDate() - ((seg.getDay() + 6) % 7));
    for (let d = new Date(seg); d <= fim; d.setDate(d.getDate() + 7)) semanas.push(new Date(d));
  }
  const nivel = (q) => (q === 0 ? 0 : q < 10 ? 1 : q < 20 ? 2 : q < 50 ? 3 : 4);
  const CORES_NIVEL = ['rgba(214,222,255,.06)', 'rgba(44,201,185,.28)', 'rgba(44,201,185,.5)', 'rgba(44,201,185,.75)', '#2CC9B9'];
  const q = 24;
  const gap = 5;
  const gx = 770;
  const gy = jy + 38 + 70;

  let reserva = '';
  quadros.forEach((qs, i) => {
    reserva += `<div class="abs" style="left:20px;top:${H + 10 + i * 64}px;width:${W - 40}px;display:flex;flex-wrap:wrap;gap:6px 14px;font-size:15px;line-height:20px;font-weight:700;color:${linhas[i].extra ? C.chave : C.numero}">${qs.map((s, k) => `<span data-m="q${i}_${k}">${esc(s)}</span>`).join('')}</div>`;
  });
  reserva += `<div class="abs linha" data-m="ref" style="left:20px;top:${H + 10 + quadros.length * 64}px;font-size:14px;line-height:20px">${'0'.repeat(40)}</div>`;
  const f = await folha(
    R,
    'f',
    W,
    H,
    `${janela({ x: jx, y: jy, w: jw, h: jh, abas: ['zsh'], direita: 'luan@lc: ~' })}
<div class="abs linha" style="left:${lx}px;top:${ly}px;font-size:14px;line-height:20px">${prompt('luan --stats')}</div>
${linhas.map((l, i) => `<div class="abs linha" data-m="l${i}" style="left:${lx}px;top:${yL(i)}px;font-size:15px;line-height:20px"><span class="texto">${esc(l.rotulo)}</span> <span style="color:${C.numeroLinha}">${'.'.repeat(Math.max(3, LARG - l.rotulo.length))}</span><span data-m="v${i}" style="display:inline-block;width:1px;height:20px"></span></div>`).join('')}
<div class="abs linha" data-m="noar" style="left:${colNum + 18}px;top:${yL(linhas.length - 1)}px;font-size:13px;line-height:20px;color:${C.ok}">● no ar</div>
<div class="abs linha" data-m="p2" style="left:${lx}px;top:${yP2}px;font-size:14px;line-height:20px">${prompt('')}</div>
<div class="abs linha" style="left:${gx}px;top:${gy - 46}px;font-size:12.5px;line-height:18px"><span class="comentario">// ${esc(atv?.titulo ?? 'atualizações por dia na plataforma')}</span></div>
<div class="abs linha" style="left:${gx}px;top:${gy - 26}px;font-size:12px;line-height:16px;color:${C.apagado}">${esc(atv?.legenda ?? '')}</div>
${['seg', '', 'qua', '', 'sex', '', 'dom'].map((d, i) => (d ? `<div class="abs" style="left:${gx - 36}px;top:${gy + i * (q + gap) + 5}px;font-size:10.5px;color:${C.apagado}">${d}</div>` : '')).join('')}
<div class="abs" style="left:${gx}px;top:${gy + 7 * (q + gap) + 6}px;display:flex;align-items:center;gap:5px;font-size:10.5px;color:${C.apagado}">menos ${CORES_NIVEL.map((c) => `<span style="width:11px;height:11px;border-radius:2px;background:${c}"></span>`).join('')} mais</div>
${reserva}`,
    quadros.length * 64 + 60,
  );
  const m = f.medidas;
  const P = 3.2;
  const cobre = (mm, t) =>
    `<rect x="${n(mm.x - 2)}" y="${n(mm.y - 2)}" width="${n(mm.w + 4)}" height="${n(mm.h + 4)}" fill="${C.fundo}"><animate attributeName="opacity" dur="${P}s" fill="freeze" calcMode="discrete" keyTimes="0;${n4(t / P)}" values="1;0"/></rect>`;
  // as linhas aparecem uma a uma (como saída de terminal) e os números contam
  const saida = linhas
    .map((_, i) => {
      const l = m[`l${i}`];
      return cobre({ x: l.x, y: l.y, w: colNum - l.x, h: l.h }, 0.5 + i * 0.12);
    })
    .join('');
  const numeros = quadros.map((qs, i) => contador(f, qs.map((_, k) => `q${i}_${k}`), { xDir: colNum, y: m[`v${i}`].y }, 0.55 + i * 0.12, 0.8, P)).join('');
  const tFim = 0.55 + (linhas.length - 1) * 0.12 + 0.85;
  const noAr = cobre(m.noar, tFim);
  // no fim, um prompt novo com o cursor piscando
  const cw = m.ref.w / 40;
  const p2 = m.p2;
  const prompt2 = `${cobre(p2, tFim + 0.25)}${surgeEm(tFim + 0.25, P, cursorPiscando(p2.x + PROMPT.length * cw, p2.y + 2, cw, p2.h - 4))}`;
  // quadradinhos do gráfico acendendo da esquerda para a direita
  let grafico = '';
  semanas.forEach((s, c) => {
    for (let d = 0; d < 7; d++) {
      const dia = new Date(s);
      dia.setDate(dia.getDate() + d);
      if (dia > fim) continue;
      const chave = dia.toISOString().slice(0, 10);
      const qd = dias.get(chave) ?? 0;
      const x = gx + c * (q + gap);
      const y = gy + d * (q + gap);
      const a = (0.6 + c * 0.16 + d * 0.025) / P;
      grafico += `<rect x="${x}" y="${y}" width="${q}" height="${q}" rx="3" fill="${CORES_NIVEL[0]}"/>`;
      if (qd) grafico += `<rect x="${x}" y="${y}" width="${q}" height="${q}" rx="3" fill="${CORES_NIVEL[nivel(qd)]}" opacity="0"><animate attributeName="opacity" dur="${P}s" fill="freeze" keyTimes="0;${n4(a)};${n4(Math.min(a + 0.08, 1))};1" values="0;0;1;1"/></rect>`;
    }
  });
  // o dia mais forte ganha um contorno que pulsa
  const maior = [...dias.entries()].sort((a, b) => b[1] - a[1])[0];
  let destaqueDia = '';
  if (maior && ini) {
    const dia = new Date(`${maior[0]}T12:00:00`);
    const c = semanas.findIndex((s) => dia >= s && dia - s < 7 * 864e5);
    const d = (dia.getDay() + 6) % 7;
    const x = gx + c * (q + gap);
    const y = gy + d * (q + gap);
    destaqueDia = `<rect x="${n(x - 3)}" y="${n(y - 3)}" width="${q + 6}" height="${q + 6}" rx="5" fill="none" stroke="${C.numero}" stroke-width="1.5" opacity="0"><animate attributeName="opacity" dur="2.4s" repeatCount="indefinite" values="0;.9;0"/></rect>`;
  }
  return svg({
    w: W,
    h: H,
    titulo: `luan --stats: ${linhas.map((l) => `${l.rotulo} ${l.valor}`).join('; ')}`,
    defs: `${f.def}${defsSombra}`,
    corpo: `${sombraJanela(jx + 10, jy + 16, jw - 20, jh - 10)}${inteira(W, H)}${saida}${noAr}${prompt2}${numeros}${grafico}${destaqueDia}`,
  });
}

// ---------- destaque: o que a plataforma tem e o dia a dia dela ----------

export async function plataforma(cfg, R) {
  const p = cfg.projetos.find((x) => x.destaque) ?? cfg.projetos[0];
  const W = 1200;
  const H = 470;
  const jx = 10;
  const jy = 10;
  const jw = 1180;
  const jh = 450;
  const div = 650; // divisa: o que tem | dia a dia
  const lx = jx + 28;
  const ly = jy + 38 + 16;
  const cmd = 'plataforma --sobre';
  const chamada = quebrar(p.chamada ?? p.descricao ?? '', 62);
  const modulos = p.modulos ?? [];
  const yTit = ly + 40;
  const yCh = yTit + 38;
  const yMod = yCh + chamada.length * 22 + 20;
  const lhM = 25;

  // dia a dia: uma lista que rola uma linha por vez, a linha nova entrando embaixo
  const dx = div + 28;
  const dia = p.diaADia ?? [];
  const VIS = Math.min(8, dia.length);
  const lhD = 36;
  const jlY = ly + 34;
  const larguraDia = jx + jw - dx - 24;
  const COR_DIA = { ok: C.ok, alerta: C.numero, equipe: C.chave };
  const linhaDia = ([tipo, txt]) =>
    `<div class="linha" style="height:${lhD}px;font-size:13.5px;line-height:${lhD}px"><span style="color:${COR_DIA[tipo] ?? C.ok}">●</span>  <span class="texto">${esc(txt)}</span></div>`;

  const f = await folha(
    R,
    'f',
    W,
    H,
    `${janela({ x: jx, y: jy, w: jw, h: jh, abas: ['zsh'], direita: 'luan@lc: ~' })}
<div class="abs" style="left:${div}px;top:${jy + 39}px;width:${jx + jw - div - 1}px;height:${jh - 40}px;background:${C.painel};border-left:1px solid ${C.borda};border-radius:0 0 9px 0"></div>
<div class="abs linha" style="left:${dx}px;top:${ly}px;font-size:10.5px;line-height:20px;letter-spacing:.18em;color:${C.apagado}">NO DIA A DIA <span style="color:${C.ok}">●</span></div>
<div class="abs" data-m="janelaDia" style="left:${dx}px;top:${jlY}px;width:${larguraDia}px;height:${VIS * lhD}px"></div>
<div class="abs linha" style="left:${dx}px;top:${jlY + VIS * lhD + 22}px;font-size:12.5px;line-height:18px"><span class="comentario">// ${esc(p.rodape ?? 'em uso pela equipe todo dia')}</span></div>
<div class="abs" data-m="dia" style="left:${dx}px;top:${H + 10}px;width:${larguraDia}px">${[...dia, ...dia.slice(0, VIS)].map(linhaDia).join('')}</div>`,
    (dia.length + VIS) * lhD + 20,
  );
  const g = await folha(
    R,
    'g',
    W,
    H,
    `<div class="abs linha" data-m="p1" style="left:${lx}px;top:${ly}px;font-size:14px;line-height:20px">${prompt(cmd)}</div>
<div class="abs linha" data-m="tit" style="left:${lx}px;top:${yTit}px;font-size:22px;line-height:30px;font-weight:700">${esc(p.titulo)}</div>
${chamada.map((l, k) => `<div class="abs linha" data-m="ch${k}" style="left:${lx}px;top:${yCh + k * 22}px;font-size:14px;line-height:22px;color:${C.apagado}">${esc(l)}</div>`).join('')}
${modulos.map((s, k) => `<div class="abs linha" data-m="mo${k}" style="left:${lx}px;top:${yMod + k * lhM}px;font-size:14px;line-height:${lhM}px"><span class="ok">✓</span> <span class="texto">${esc(s)}</span></div>`).join('')}
<div class="abs linha" data-m="ref" style="left:20px;top:${H + 10}px;font-size:14px;line-height:20px">${'0'.repeat(40)}</div>`,
    50,
  );
  const m = g.medidas;
  const cw = m.ref.w / 40;

  // digita o comando, mostra o título e a frase, e a lista entra item a item (fica parada no fim)
  const T = 3.6;
  const t0 = 0.5;
  const passo = 0.05;
  const tSaida = t0 + cmd.length * passo + 0.25;
  const dig = digitar({ id: 'cCmd', m: m.p1, cw, cmd, t0, passo, T, ate: tSaida, W, H });
  const cabeca =
    surgeEm(tSaida, T, g.recorte('tit', m.tit.x, m.tit.y)) +
    chamada.map((_, k) => surgeEm(tSaida + 0.08 + k * 0.08, T, g.recorte(`ch${k}`, m[`ch${k}`].x, m[`ch${k}`].y))).join('');
  const tMod = tSaida + 0.35;
  const lista = modulos.map((_, k) => surgeEm(tMod + k * 0.11, T, g.recorte(`mo${k}`, m[`mo${k}`].x, m[`mo${k}`].y))).join('');

  // o dia a dia rola em ciclo; a linha que acabou de entrar acende de leve
  const mf = f.medidas;
  const jl = mf.janelaDia;
  const lg = mf.dia;
  const PASSO = 1.3;
  const N = dia.length;
  const tempos = [];
  const valores = [];
  for (let i = 0; i < N; i++) {
    tempos.push(i / N);
    valores.push(`0 ${-i * lhD}`);
  }
  const yNova = jl.y + (VIS - 1) * lhD;
  const novidade = `<rect x="${n(jl.x - 10)}" y="${n(yNova)}" width="${n(jl.w + 10)}" height="${lhD}" rx="4" fill="${C.chave}" opacity="0"><animate attributeName="opacity" dur="${PASSO}s" repeatCount="indefinite" keyTimes="0;.7;1" values=".12;0;0"/></rect>`;
  const rolagem = N
    ? `<clipPath id="cDia"><rect x="${n(jl.x)}" y="${n(jl.y)}" width="${n(jl.w)}" height="${n(jl.h)}"/></clipPath>
<g clip-path="url(#cDia)"><g><animateTransform attributeName="transform" type="translate" dur="${n(N * PASSO)}s" repeatCount="indefinite" calcMode="discrete" keyTimes="${tempos.map(n4).join(';')}" values="${valores.join(';')}"/>
<svg x="${n(jl.x)}" y="${n(jl.y)}" width="${n(lg.w)}" height="${n(lg.h)}" viewBox="${n(lg.x)} ${n(lg.y)} ${n(lg.w)} ${n(lg.h)}"><use href="#f"/></svg></g></g>`
    : '';

  return svg({
    w: W,
    h: H,
    titulo: `${p.titulo}: ${modulos.join(', ')}`,
    defs: `${f.def}${g.def}${defsSombra}${dig.clip}`,
    corpo: `${sombraJanela(jx + 10, jy + 16, jw - 20, jh - 10)}${inteira(W, H)}${N ? novidade : ''}${rolagem}${dig.texto}${dig.cursor}${cabeca}${lista}`,
  });
}

// ---------- o estilo pronto ----------

const comLink = (url, conteudo) => (url ? `<a href="${esc(url)}">${conteudo}</a>` : conteudo);

export function montarEstilo() {
  const prontas = {};
  return {
    nome: 'Terminal',
    resumo: 'Visual de terminal, sem código: a ficha com a logo da LC em ASCII, os números com as atualizações reais da plataforma e o que a plataforma faz, com o dia a dia rolando.',
    precisaDeNavegador: true,
    paletas: { claro: {}, escuro: {} },
    async artes(cfg, _d, _tema, ctx) {
      if (!ctx?.renderizar || !ctx?.executar) throw new Error('O estilo "Terminal" precisa do navegador para desenhar a fonte e a logo em ASCII.');
      // as artes são escuras nos dois temas: desenhadas uma vez só
      prontas.topo ??= await topo(cfg, ctx.renderizar, ctx.executar);
      prontas.resumo ??= await stats(cfg, ctx.renderizar);
      prontas.destaque ??= await plataforma(cfg, ctx.renderizar);
      return { ...prontas };
    },
    readme(cfg, img) {
      const principal = cfg.projetos.find((p) => p.destaque) ?? cfg.projetos[0];
      const insta = cfg.links.find((l) => l.rede === 'Instagram' && l.url);
      const r = cfg.resumo;
      const altResumo = `luan --stats: ${r.linhas.map((l) => `${l.rotulo} ${l.valor}`).join('; ')}; ${r.grande.rotulo} ${r.grande.valor}.`;
      return `<p>${comLink(cfg.urlCurriculo, img('topo', `${cfg.nome}: ${cfg.bio}`, 'width="100%"'))}</p>

<p>${img('resumo', altResumo, 'width="100%"')}</p>

<p>${comLink(principal.link, img('destaque', `${principal.titulo}: ${(principal.modulos ?? []).join(', ')}`, 'width="100%"'))}</p>

<p align="center">${cfg.urlCurriculo ? `<a href="${esc(cfg.urlCurriculo)}"><b>Currículo completo</b></a>` : ''}${insta ? ` · <a href="${esc(insta.url)}">${esc(insta.texto)}</a>` : ''}</p>
`;
    },
  };
}
