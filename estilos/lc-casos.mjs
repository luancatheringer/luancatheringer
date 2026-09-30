// Cenas animadas do portfólio (estilo "Assinatura"): uma por case, escolhida pelo campo "cenas" do portfolio.config.mjs.
// Cada cena é uma faixa de 1200 de largura com a composição centralizada. Interface ilustrativa, dados fictícios.

import {
  esc, n, svg, folha, icone, iconeSvg, kt, ciclo, motor, no, pontilhada, viajante, visivelEntre, aparece, cortina, pulso,
  alertaPulsando, selo, contorno, realce, cresce, desenha, entre, pontoComo, cartao, barras, chip, avatar, cabecalhoTela,
  painelAnimado, cenaLead, cenaPedido, cenaRastreio,
} from './_lc.mjs';

const W = 1200;

// ---------- peças pequenas ----------

// Balão de conversa (cliente à direita em verde, empresa à esquerda em cinza)
const balao = (t, { id, x, y, w, h, texto = '', lado = 'cliente', corpo = '' }) =>
  `<div class="abs" data-m="${id}" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px;border-radius:${lado === 'cliente' ? '12px 12px 4px 12px' : '12px 12px 12px 4px'};background:${lado === 'cliente' ? t.zap : t.campo};padding:8px 11px;font-size:12px;line-height:1.3;color:${t.navy}">${texto}${corpo}</div>`;
const vaga = (id, x, y, w, h) => `<div class="abs" data-m="${id}" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px"></div>`;
const rotulo = (texto, x, y, cor, { w = 120, alinhar = 'center' } = {}) =>
  `<div class="abs nu" style="left:${x - (alinhar === 'center' ? w / 2 : 0)}px;top:${y}px;width:${w}px;text-align:${alinhar};font-size:11px;line-height:1;color:${cor}">${texto}</div>`;
// Marca de status à direita de uma pílula: visto verde, alerta vermelho ou traço cinza ("segue")
const marca = (t, tipo, cx, cy) =>
  tipo === 'ok'
    ? selo(cx, cy, 8, t)
    : tipo === 'alerta'
      ? `<circle cx="${n(cx)}" cy="${n(cy)}" r="8" fill="${t.alerta}"/>${iconeSvg('exclamacao', cx, cy, 13, t.cartao, 2.6)}`
      : `<path d="M${n(cx - 5)} ${n(cy)}H${n(cx + 5)}" stroke="${t.suave}" stroke-width="2.2" stroke-linecap="round"/>`;
const noMedida = (cx, cy) => pontoComo(cx, cy, 24);

// ---------- cenas ----------

const CENAS = {
  lead: (t) => ({ ...cenaLead(t, { x0: 331, cy: 125, H: 250 }), H: 250 }),
  pedido: (t) => ({ ...cenaPedido(t, { x0: 331, cy: 125, H: 250 }), H: 250 }),
  rastreio: (t) => ({ ...cenaRastreio(t, { x0: 331, cy: 125 }), H: 250 }),

  // Troca da ferramenta de marketing: o XML do lead é lido, passa pelo motor e vira contato e card
  captura(t) {
    const H = 250;
    const xml = ['&lt;lead&gt;', '&nbsp;&nbsp;&lt;nome&gt;···&lt;/nome&gt;', '&nbsp;&nbsp;&lt;telefone&gt;···&lt;/telefone&gt;', '&nbsp;&nbsp;&lt;origem&gt;···&lt;/origem&gt;'];
    return {
      H,
      reserva: 90,
      html: `${cartao(t, {
        id: 'a', x: 320, y: 55, w: 200, h: 140, rotulo: 'ferramenta de marketing', icone: 'megafone',
        corpo: `<div style="margin-top:10px">${xml.map((l, i) => `<div class="nu" data-m="x${i}" style="height:22px;display:flex;align-items:center;font-size:11.5px;color:${t.apoio};border-radius:5px;padding:0 4px">${l}</div>`).join('')}</div>`,
      })}
${cartao(t, { id: 'b1', x: 690, y: 30, w: 200, h: 90, rotulo: 'WhatsApp · contato', icone: 'usuarios', corpo: `<div style="display:flex;align-items:center;gap:8px;margin-top:9px">${avatar(t, 22)}<div style="flex:1">${barras([70], { topo: 0 })}</div></div><div data-m="vChip" style="height:22px;margin-top:9px"></div>` })}
${cartao(t, { id: 'b2', x: 690, y: 132, w: 200, h: 88, rotulo: 'funil · etapa inicial', icone: 'grade', corpo: `<div data-m="vMini" style="height:30px;margin-top:12px;border-radius:7px;border:1.5px dashed ${t.linha}"></div>` })}
<div class="abs" style="left:320px;top:${H + 14}px">${chip(t, 'origem: anúncio', { id: 'chipOrigem' })}</div>
<div class="abs" data-m="mini" style="left:320px;top:${H + 46}px;width:172px;height:30px;border-radius:7px;background:${t.cartao};box-shadow:${t.sombraP};display:flex;align-items:center;gap:7px;padding:0 8px">${avatar(t, 16)}<div style="flex:1">${barras([80], { topo: 0, alt: 6 })}</div></div>`,
      animar(f) {
        const m = f.medidas;
        const P = 7;
        const mx = 590;
        const cy = 125;
        const nm = noMedida(mx, cy);
        const d1 = entre(m.a, nm);
        const dB1 = entre(nm, m.b1);
        const dB2 = entre(nm, m.b2);
        return `${xml.map((_, i) => realce(m[`x${i}`], t.tealFundo, 0.04 + i * 0.04, 0.09 + i * 0.04, P, { rx: 5 })).join('')}
${pontilhada(d1, t)}${pontilhada(dB1, t)}${pontilhada(dB2, t)}${motor(mx, cy, t)}
${viajante(d1, 0.22, 0.34, P, t)}${pulso(mx, cy, 24, 33, 0.34, 0.08, P, t.teal)}
${viajante(dB1, 0.38, 0.5, P, t)}${viajante(dB2, 0.38, 0.5, P, t)}
${contorno(m.b1, t, 0.5, 0.94, P)}${contorno(m.b2, t, 0.5, 0.94, P)}
${aparece(f.recorte('chipOrigem', m.vChip.x, m.vChip.y), 0.5, 0.94, P)}
${aparece(f.recorte('mini', m.vMini.x - 1.5, m.vMini.y - 1.5), 0.52, 0.94, P)}`;
      },
    };
  },

  // Aviso de pedido enviado: a expedição conclui, o motor escolhe o modelo certo e o cliente recebe o rastreio
  'aviso-enviado'(t) {
    const H = 250;
    const trans = ['A', 'B', 'C'];
    return {
      H,
      reserva: 150,
      html: `${cartao(t, {
        id: 'a', x: 290, y: 45, w: 210, h: 160, rotulo: 'ERP · expedição', icone: 'pacote',
        corpo: `<div style="margin-top:11px">${chip(t, 'pedido expedido')}</div>${barras([80, 55])}
<div style="font-size:11px;color:${t.suave};margin-top:12px">transportadora</div>
<div style="display:flex;gap:8px;margin-top:6px">${trans.map((l) => `<span class="nu" data-m="t${l}" style="width:36px;height:24px;border-radius:6px;border:1px solid ${t.linha};display:grid;place-items:center;font-size:11.5px;color:${t.apoio}">${l}</span>`).join('')}</div>`,
      })}
${cartao(t, { id: 'b', x: 660, y: 35, w: 260, h: 180, rotulo: 'WhatsApp · cliente', icone: 'balao', corpo: vaga('vaga', 14, 38, 232, 128) })}
<div class="abs" data-m="bolha" style="left:300px;top:${H + 12}px;width:232px;height:128px;border-radius:12px 12px 12px 4px;background:${t.zap};padding:12px 12px 0">
${barras([88, 70, 42], { topo: 0 })}
<div style="height:1px;background:${t.traco};margin:11px -12px 0"></div>
<div class="ti" data-m="rastrear" style="height:34px;display:flex;align-items:center;justify-content:center;gap:7px;font-size:12.5px;color:${t.tealEsc}">${icone('link', 14, t.tealEsc, 2.2)}Rastrear pedido</div></div>`,
      animar(f) {
        const m = f.medidas;
        const P = 8;
        const mx = 572;
        const cy = 125;
        const nm = noMedida(mx, cy);
        const d1 = entre(m.a, nm);
        const d2 = entre(nm, m.b);
        const v = m.vaga;
        const r = m.rastrear;
        const bo = m.bolha;
        // posição do botão "Rastrear" depois que o balão chega na vaga
        const bx = v.x + (r.x - bo.x);
        const by = v.y + (r.y - bo.y);
        return `${realce(m.tA, t.tealFundo, 0.04, 0.08, P, { rx: 6 })}${realce(m.tB, t.tealFundo, 0.08, 0.94, P, { rx: 6 })}${contorno(m.tB, t, 0.1, 0.94, P, { rx: 6 })}
${pontilhada(d1, t)}${pontilhada(d2, t)}${motor(mx, cy, t)}
${viajante(d1, 0.16, 0.28, P, t)}${pulso(mx, cy, 24, 33, 0.28, 0.08, P, t.teal)}${viajante(d2, 0.31, 0.43, P, t)}
${contorno(m.b, t, 0.43, 0.94, P)}
${aparece(f.recorte('bolha', v.x, v.y), 0.43, 0.94, P)}
<rect x="${n(bx)}" y="${n(by)}" width="${n(r.w)}" height="${n(r.h)}" rx="6" fill="${t.teal}" opacity="0"><animate attributeName="opacity" ${ciclo(P)} keyTimes="${kt(0, 0.62, 0.635, 0.7, 1)}" values="0;0;.35;0;0"/></rect>`;
      },
    };
  },

  // Triagem do WhatsApp comercial: a mensagem passa pelas regras em ordem e cai no lugar certo
  triagem(t) {
    const H = 250;
    const regras = ['Horário de atendimento', 'Rota especial', 'Contato conhecido', 'Região do cliente', 'Menu de opções'];
    const ry = (i) => 32 + i * 39;
    return {
      H,
      reserva: 80,
      html: `${cartao(t, {
        id: 'msg', x: 190, y: 72, w: 210, h: 106, rotulo: 'mensagem nova', icone: 'balao',
        corpo: `<div style="margin-top:10px;border-radius:12px 12px 12px 4px;background:${t.zap};padding:9px 11px">${barras([90, 60], { topo: 0, alt: 6, gap: 6 })}</div>${'<div data-m="vTipo" style="height:22px;margin-top:8px"></div>'}`,
      })}
${regras.map((r, i) => `<div class="abs" data-m="r${i}" style="left:480px;top:${ry(i)}px;width:250px;height:30px;border-radius:9px;border:1px solid ${t.linha};background:${t.cartao};display:flex;align-items:center;padding:0 12px;font-size:12.5px;color:${t.apoio}">${r}</div>`).join('')}
${cartao(t, {
  id: 'dest', x: 810, y: 78, w: 200, h: 94, rotulo: 'atendimento', icone: 'vendedor',
  corpo: `<div style="display:flex;align-items:center;gap:8px;margin-top:9px">${avatar(t, 24)}<div style="flex:1">${barras([75], { topo: 0 })}</div></div><div data-m="vDest" style="height:22px;margin-top:8px"></div>`,
})}
<div class="abs" style="left:190px;top:${H + 10}px;display:flex;gap:10px">${chip(t, 'contato novo', { id: 'v1', cor: t.apoio, fundo: t.campo })}${chip(t, 'contato conhecido', { id: 'v2', cor: t.apoio, fundo: t.campo })}</div>
<div class="abs" style="left:190px;top:${H + 44}px;display:flex;gap:10px">${chip(t, 'vendedor da região', { id: 'd1' })}${chip(t, 'mesmo vendedor de antes', { id: 'd2' })}</div>`,
      animar(f) {
        const m = f.medidas;
        const P = 10;
        const xEsq = m.r0.x - 12;
        const vez = (base, tipo, destino, alvo) => {
          const passo = 0.035;
          const chegaTopo = base + 0.08;
          const chega = chegaTopo + passo * alvo;
          const d1 = `M${n(m.msg.x + m.msg.w + 9)} ${n(m.msg.y + m.msg.h / 2)}C${n(xEsq - 30)} ${n(m.msg.y + m.msg.h / 2)} ${n(xEsq - 30)} ${n(m.r0.y + 15)} ${n(xEsq)} ${n(m.r0.y + 15)}`;
          const d2 = `M${n(xEsq)} ${n(m.r0.y + 15)}V${n(m[`r${alvo}`].y + 15)}`;
          const d3 = entre(m[`r${alvo}`], m.dest);
          const fimVez = base + 0.47;
          let s = `<g opacity="0">${visivelEntre(base, base + 0.5, P)}${f.recorte(tipo, m.vTipo.x, m.vTipo.y)}</g>
${viajante(d1, base + 0.03, chegaTopo, P, t, { r: 4.5 })}${alvo ? viajante(d2, chegaTopo, chega, P, t, { r: 4.5 }) : ''}`;
          for (let i = 0; i <= alvo; i++) {
            const k = chegaTopo + passo * i;
            const r = m[`r${i}`];
            s += realce(r, t.tealFundo, k, k + passo, P, { rx: 9 });
            s += `<g opacity="0">${visivelEntre(k + 0.01, fimVez, P)}${marca(t, i === alvo ? 'ok' : 'segue', r.x + r.w - 16, r.y + r.h / 2)}</g>`;
          }
          s += contorno(m[`r${alvo}`], t, chega, fimVez, P, { rx: 9 });
          s += `${pontilhada(d3, t)}${viajante(d3, chega + 0.02, chega + 0.1, P, t, { r: 4.5 })}`;
          s += contorno(m.dest, t, chega + 0.1, fimVez, P);
          s += `<g opacity="0">${visivelEntre(chega + 0.1, fimVez, P)}${f.recorte(destino, m.vDest.x, m.vDest.y)}</g>`;
          return s;
        };
        return `${vez(0, 'v1', 'd1', 3)}\n${vez(0.5, 'v2', 'd2', 2)}`;
      },
    };
  },

  // Entrada de campanha: o clique no anúncio abre o WhatsApp, o chatbot etiqueta e cria o card do gerente
  campanha(t) {
    const H = 250;
    return {
      H,
      reserva: 100,
      html: `${cartao(t, {
        id: 'a', x: 230, y: 55, w: 150, h: 140, rotulo: 'anúncio', icone: 'megafone',
        corpo: `<div style="height:46px;border-radius:8px;background:${t.campo};margin-top:10px"></div>${barras([80], { topo: 9 })}<div class="ti" data-m="btn" style="margin-top:9px;height:24px;border-radius:7px;background:${t.zap};color:${t.tealEsc};font-size:11px;display:grid;place-items:center">Enviar mensagem</div>`,
      })}
${cartao(t, { id: 'b', x: 430, y: 72, w: 190, h: 106, rotulo: 'WhatsApp', icone: 'balao', corpo: '<div data-m="vBolha" style="height:56px;margin-top:10px"></div>' })}
${cartao(t, { id: 'd1', x: 770, y: 45, w: 200, h: 66, rotulo: 'etiqueta', icone: 'etiqueta', corpo: '<div data-m="vEtq" style="height:22px;margin-top:9px"></div>' })}
${cartao(t, { id: 'd2', x: 770, y: 125, w: 200, h: 80, rotulo: 'funil do gerente', icone: 'grade', corpo: `<div data-m="vCard" style="height:32px;margin-top:9px;border-radius:7px;border:1.5px dashed ${t.linha}"></div>` })}
<div class="abs" data-m="bolha" style="left:230px;top:${H + 10}px;width:162px;height:56px;border-radius:12px 12px 4px 12px;background:${t.zap};padding:9px 11px">${barras([90, 55], { topo: 0, alt: 6, gap: 6 })}<div class="nu" style="font-size:9.5px;color:${t.suave};margin-top:6px;text-align:right">frase do anúncio</div></div>
<div class="abs" style="left:420px;top:${H + 10}px">${chip(t, 'campanha sazonal', { id: 'etq' })}</div>
<div class="abs" data-m="card" style="left:420px;top:${H + 46}px;width:172px;height:32px;border-radius:7px;background:${t.cartao};box-shadow:${t.sombraP};display:flex;align-items:center;gap:7px;padding:0 8px">${avatar(t, 16)}<div style="flex:1">${barras([80], { topo: 0, alt: 6 })}</div></div>`,
      animar(f) {
        const m = f.medidas;
        const P = 8;
        const mx = 692;
        const cy = 125;
        const nm = noMedida(mx, cy);
        const d1 = entre(m.a, m.b);
        const d2 = entre(m.b, nm);
        const dE = entre(nm, m.d1);
        const dC = entre(nm, m.d2);
        return `<rect x="${n(m.btn.x)}" y="${n(m.btn.y)}" width="${n(m.btn.w)}" height="${n(m.btn.h)}" rx="7" fill="${t.teal}" opacity="0"><animate attributeName="opacity" ${ciclo(P)} keyTimes="${kt(0, 0.03, 0.045, 0.1, 1)}" values="0;0;.45;0;0"/></rect>
${pontilhada(d1, t)}${pontilhada(d2, t)}${pontilhada(dE, t)}${pontilhada(dC, t)}${no(mx, cy, t, 'balao')}
${viajante(d1, 0.07, 0.17, P, t)}
${aparece(f.recorte('bolha', m.vBolha.x + (m.vBolha.w - m.bolha.w), m.vBolha.y), 0.17, 0.94, P)}
${viajante(d2, 0.24, 0.34, P, t)}${pulso(mx, cy, 24, 33, 0.34, 0.08, P, t.teal)}
${viajante(dE, 0.38, 0.48, P, t)}${viajante(dC, 0.38, 0.48, P, t)}
${contorno(m.d1, t, 0.48, 0.94, P)}${aparece(f.recorte('etq', m.vEtq.x, m.vEtq.y), 0.48, 0.94, P)}
${contorno(m.d2, t, 0.5, 0.94, P)}${aparece(f.recorte('card', m.vCard.x - 1.5, m.vCard.y - 1.5), 0.5, 0.94, P)}`;
      },
    };
  },

  // Prospecção ativa: o vendedor aplica a etiqueta e o card aparece no funil, sem duplicar
  prospeccao(t) {
    const H = 250;
    const colunas = ['Novo', 'Proposta', 'Fechado'];
    const miniCard = (extra = '') => `<div style="height:30px;border-radius:7px;background:${t.cartao};box-shadow:${t.sombraP};display:flex;align-items:center;gap:6px;padding:0 7px;${extra}">${avatar(t, 14)}<div style="flex:1">${barras([75], { topo: 0, alt: 5 })}</div></div>`;
    return {
      H,
      reserva: 90,
      html: `${cartao(t, {
        id: 'a', x: 250, y: 45, w: 220, h: 160, rotulo: 'conversa · prospecção', icone: 'balao',
        corpo: `<div style="display:flex;align-items:center;gap:8px;margin-top:10px">${avatar(t, 24)}<div style="flex:1">${barras([70], { topo: 0 })}</div></div>
<div style="margin-top:10px;width:80%;border-radius:12px 12px 12px 4px;background:${t.campo};padding:8px 10px">${barras([85], { topo: 0, alt: 6 })}</div>
<div style="margin:6px 0 0 auto;width:62%;border-radius:12px 12px 4px 12px;background:${t.zap};padding:8px 10px">${barras([80], { topo: 0, alt: 6 })}</div>
<div style="display:flex;align-items:center;gap:8px;margin-top:10px"><span style="font-size:11px;color:${t.suave}">etiquetas</span><span data-m="vEtq" style="width:100px;height:22px"></span></div>`,
      })}
${cartao(t, {
  id: 'b', x: 630, y: 35, w: 330, h: 180, rotulo: 'funil de vendas', icone: 'grade',
  corpo: `<div style="display:flex;gap:8px;margin-top:10px">${colunas.map((c, i) => `<div data-m="col${i}" style="flex:1;height:124px;border-radius:9px;background:${t.campo};padding:8px 6px"><div class="nu" style="font-size:10.5px;color:${t.apoio};margin-bottom:7px">${c}</div>${i === 0 ? '<div data-m="vCard" style="height:30px"></div>' : i === 1 ? miniCard() + miniCard('margin-top:6px') : miniCard()}</div>`).join('')}</div>`,
})}
<div class="abs" style="left:250px;top:${H + 10}px">${chip(t, 'oportunidade', { id: 'etq' })}</div>
<div class="abs" data-m="novo" style="left:420px;top:${H + 44}px;width:92px">${miniCard()}</div>`,
      animar(f) {
        const m = f.medidas;
        const P = 7;
        const mx = 548;
        const cy = 125;
        const nm = noMedida(mx, cy);
        const d1 = entre(m.a, nm);
        const alvo = { x: m.vCard.x, y: m.vCard.y, w: m.vCard.w, h: m.vCard.h };
        const d2 = `M${mx + 33} ${cy}C${mx + 60} ${cy} ${n(alvo.x - 40)} ${n(alvo.y + 15)} ${n(alvo.x - 6)} ${n(alvo.y + 15)}`;
        return `${aparece(f.recorte('etq', m.vEtq.x, m.vEtq.y), 0.06, 0.94, P)}
${pontilhada(d1, t)}${pontilhada(d2, t)}${motor(mx, cy, t)}
${viajante(d1, 0.16, 0.28, P, t)}${pulso(mx, cy, 24, 33, 0.28, 0.08, P, t.teal)}${viajante(d2, 0.31, 0.43, P, t)}
${realce(m.col0, t.tealFundo, 0.43, 0.94, P, { rx: 9 })}
${aparece(f.recorte('novo', alvo.x, alvo.y), 0.43, 0.94, P)}`;
      },
    };
  },

  // Follow-up: quem respondeu sai da sequência; os outros seguem para a próxima mensagem
  'follow-up'(t) {
    const H = 250;
    const linhas = [0, 1, 2, 3];
    return {
      H,
      reserva: 80,
      html: `${cartao(t, {
        id: 'a', x: 270, y: 35, w: 290, h: 180, rotulo: 'sequência da campanha', icone: 'chat',
        corpo: `<div style="margin-top:8px">${linhas.map((i) => `<div data-m="f${i}" style="height:32px;display:flex;align-items:center;gap:8px;margin-top:3px">${avatar(t, 20)}<div style="flex:1">${barras([60 + (i % 2) * 15], { topo: 0, alt: 6 })}</div>${[0, 1, 2].map((j) => `<span data-m="d${i}${j}" style="width:12px;height:12px;border-radius:50%;border:1.5px solid ${t.linha}"></span>`).join('')}<span data-m="z${i}" style="width:22px;height:18px"></span></div>`).join('')}</div>`,
      })}
${cartao(t, { id: 'b', x: 720, y: 70, w: 210, h: 110, rotulo: 'responderam', icone: 'checks', corpo: '<div data-m="vResp" style="height:62px;margin-top:10px"></div>' })}
<div class="abs" data-m="resp" style="left:270px;top:${H + 10}px;width:182px;height:62px">
<div style="display:flex;align-items:center;gap:8px">${avatar(t, 20)}<div style="flex:1">${barras([75], { topo: 0, alt: 6 })}</div></div>
<div style="margin-top:10px">${chip(t, 'saiu da sequência')}</div></div>`,
      animar(f) {
        const m = f.medidas;
        const P = 9;
        const mx = 640;
        const cy = 125;
        const nm = noMedida(mx, cy);
        const quem = 1; // a linha que responde
        const passo = (j, ini, pula) =>
          linhas
            .filter((i) => !(pula && i === quem))
            .map((i, k) => {
              const d = m[`d${i}${j}`];
              return `<circle cx="${n(d.x + d.w / 2)}" cy="${n(d.y + d.h / 2)}" r="6" fill="${t.teal}" opacity="0">${visivelEntre(ini + k * 0.015, 0.95, P)}</circle>`;
            })
            .join('');
        const z = m[`z${quem}`];
        const fq = m[`f${quem}`];
        const d1 = `M${n(z.x + z.w + 6)} ${n(z.y + z.h / 2)}C${n(mx - 50)} ${n(z.y + z.h / 2)} ${mx - 60} ${cy} ${mx - 33} ${cy}`;
        const d2 = entre(nm, m.b);
        return `${passo(0, 0.04, false)}
<g opacity="0">${visivelEntre(0.16, 0.95, P)}<rect x="${n(z.x)}" y="${n(z.y)}" width="${n(z.w)}" height="${n(z.h)}" rx="6" fill="${t.zap}"/>${iconeSvg('balao', z.x + z.w / 2, z.y + z.h / 2, 12, t.tealEsc, 2.2)}</g>
${pontilhada(d1, t)}${pontilhada(d2, t)}${motor(mx, cy, t)}
${viajante(d1, 0.2, 0.3, P, t)}${pulso(mx, cy, 24, 33, 0.3, 0.08, P, t.teal)}${viajante(d2, 0.33, 0.43, P, t)}
<rect x="${n(fq.x - 4)}" y="${n(fq.y - 1)}" width="${n(fq.w + 8)}" height="${n(fq.h + 2)}" fill="${t.cartao}" opacity="0"><animate attributeName="opacity" ${ciclo(P)} keyTimes="${kt(0, 0.3, 0.36, 0.95, 0.97, 1)}" values="0;0;.72;.72;0;0"/></rect>
${contorno(m.b, t, 0.43, 0.94, P)}${aparece(f.recorte('resp', m.vResp.x, m.vResp.y), 0.43, 0.94, P)}
${passo(1, 0.55, true)}${passo(2, 0.72, true)}`;
      },
    };
  },

  // Pré-atendimento: o cliente pede o rastreio, o motor consulta o ERP e o chatbot responde
  'pre-atendimento'(t) {
    const H = 250;
    const x = 250;
    const y = 10;
    const bolhas = [
      { id: 'b1', lado: 'cliente', w: 132, h: 30, texto: 'Rastrear pedido' },
      { id: 'b2', lado: 'empresa', w: 206, h: 30, texto: 'Qual o número do pedido?' },
      { id: 'b3', lado: 'cliente', w: 74, h: 30, texto: '<span class="nu">#1043</span>' },
      { id: 'b4', lado: 'empresa', w: 222, h: 54, texto: 'Seu pedido saiu para entrega.', corpo: `<div style="margin-top:6px">${chip(t, 'rastreio · BR···', { estilo: 'font-size:10.5px;padding:4px 7px' })}</div>` },
    ];
    const topos = [40, 78, 116, 154];
    const esquerda = (b) => (b.lado === 'cliente' ? x + 310 - 14 - b.w : x + 14);
    return {
      H,
      reserva: 130,
      html: `${cartao(t, { id: 'chat', x, y, w: 310, h: 230, rotulo: 'WhatsApp · atendimento', icone: 'balao' })}
${bolhas.map((b, i) => vaga(`v${b.id}`, esquerda(b), y + topos[i], b.w, b.h)).join('')}
${cartao(t, {
  id: 'erp', x: 740, y: 65, w: 190, h: 120, rotulo: 'ERP · pedidos', icone: 'erp',
  corpo: `<div style="margin-top:8px">${['#1037', '#1043', '#1049'].map((p, i) => `<div class="nu" data-m="e${i}" style="height:25px;display:flex;align-items:center;gap:10px;font-size:12px;padding:0 4px;border-radius:5px">${p}<span class="barra" style="flex:1;height:6px"></span></div>`).join('')}</div>`,
})}
${bolhas.map((b, i) => balao(t, { id: b.id, x: 20 + (i % 2) * 250, y: H + 6 + Math.floor(i / 2) * 60, w: b.w, h: b.h, texto: b.texto, lado: b.lado, corpo: b.corpo ?? '' })).join('')}`,
      animar(f) {
        const m = f.medidas;
        const P = 10;
        const mx = 650;
        const cy = 125;
        const nm = noMedida(mx, cy);
        const d1 = entre(m.chat, nm);
        const d2 = entre(nm, m.erp);
        const mostra = (id, a) => aparece(f.recorte(id, m[`v${id}`].x, m[`v${id}`].y), a, 0.95, P, { sobe: 6 });
        return `${mostra('b1', 0.03)}${mostra('b2', 0.12)}${mostra('b3', 0.22)}
${pontilhada(d1, t)}${pontilhada(d2, t)}${motor(mx, cy, t)}
${viajante(d1, 0.27, 0.34, P, t)}${pulso(mx, cy, 24, 33, 0.34, 0.06, P, t.teal)}${viajante(d2, 0.36, 0.43, P, t)}
${realce(m.e1, t.tealFundo, 0.43, 0.56, P, { rx: 5 })}
${viajante(d2, 0.55, 0.62, P, t, { volta: true })}${pulso(mx, cy, 24, 33, 0.62, 0.06, P, t.teal)}${viajante(d1, 0.63, 0.7, P, t, { volta: true })}
${mostra('b4', 0.7)}`;
      },
    };
  },

  // Relatório semanal: as duas fontes passam pelo motor e viram um deck que se monta sozinho
  'relatorio-semanal'(t) {
    const H = 250;
    const dx = 590;
    const dy = 28;
    const sw = 316;
    const sh = 146;
    const face = (id, titulo, conteudo, topo) =>
      `<div class="abs" data-m="${id}" style="left:20px;top:${topo}px;width:${sw}px;height:${sh}px;border-radius:8px;background:${t.cartao};border:1px solid ${t.linha};padding:12px 14px">
<div class="ti" style="font-size:14px;line-height:1">${titulo}</div>${conteudo}</div>`;
    return {
      H,
      reserva: 3 * (sh + 12) + 10,
      html: `${cartao(t, { id: 's1', x: 270, y: 48, w: 170, h: 62, rotulo: 'CRM de vendas', icone: 'pedido', corpo: barras([80, 55], { topo: 9, alt: 6, gap: 6 }) })}
${cartao(t, { id: 's2', x: 270, y: 140, w: 170, h: 62, rotulo: 'WhatsApp', icone: 'balao', corpo: barras([70, 50], { topo: 9, alt: 6, gap: 6 }) })}
${cartao(t, { id: 'deck', x: dx, y: dy, w: 340, h: 194, rotulo: 'apresentação da semana', icone: 'slide', corpo: `<div data-m="vSlide" style="width:${sw}px;height:${sh}px;margin-top:9px;margin-left:-2px"></div>` })}
${face('f1', 'Vendas da semana', `<div data-m="g1" style="height:96px;margin-top:12px;border-bottom:1.5px solid ${t.linha}"></div>`, H + 6)}
${face('f2', 'Funil de atendimento', '<div data-m="g2" style="height:100px;margin-top:10px"></div>', H + 6 + (sh + 12))}
${face('f3', 'Positivação', `<div style="display:flex;align-items:center;gap:18px;margin-top:10px"><div data-m="g3" style="width:96px;height:96px"></div><div style="flex:1">${barras([90, 70, 50], { topo: 0, gap: 12 })}</div></div>`, H + 6 + 2 * (sh + 12))}`,
      animar(f) {
        const m = f.medidas;
        const P = 12;
        const mx = 512;
        const cy = 125;
        const nm = noMedida(mx, cy);
        const a1 = entre(m.s1, nm);
        const a2 = entre(m.s2, nm);
        const d = entre(nm, m.deck);
        const v = m.vSlide;
        // desloca uma medida da face (na reserva) para a vaga do slide
        const naVaga = (face, g) => ({ x: v.x + (g.x - face.x), y: v.y + (g.y - face.y), w: g.w, h: g.h });
        const janelas = [[0.2, 0.46], [0.46, 0.72], [0.72, 0.97]];
        // slide 1: barras
        const g1 = naVaga(m.f1, m.g1);
        const alturas = [0.45, 0.6, 0.52, 0.75, 0.68, 0.88, 0.8];
        const lb = 22;
        const passo = (g1.w - lb) / (alturas.length - 1);
        const s1 = alturas
          .map((fr, i) => {
            const h = g1.h * fr;
            const a = janelas[0][0] + 0.01 + i * 0.012;
            const yB = g1.y + g1.h;
            return `<rect x="${n(g1.x + i * passo)}" y="${n(yB - h)}" width="${lb}" height="${n(h)}" rx="4" fill="${i === alturas.length - 1 ? t.teal : t.navy2}">${cresce(P, 'y', yB, yB - h, a, a + 0.04)}${cresce(P, 'height', 0, h, a, a + 0.04)}</rect>`;
          })
          .join('');
        // slide 2: funil
        const g2 = naVaga(m.f2, m.g2);
        const fatias = [1, 0.74, 0.5, 0.3];
        const s2 = fatias
          .map((fr, i) => {
            const w = g2.w * fr;
            const cx = g2.x + g2.w / 2;
            const a = janelas[1][0] + 0.01 + i * 0.015;
            return `<rect x="${n(cx - w / 2)}" y="${n(g2.y + i * 25)}" width="${n(w)}" height="19" rx="5" fill="${i === fatias.length - 1 ? t.teal : t.navy2}" opacity="${n(1 - i * 0.12)}">${cresce(P, 'x', cx, cx - w / 2, a, a + 0.04)}${cresce(P, 'width', 0, w, a, a + 0.04)}</rect>`;
          })
          .join('');
        // slide 3: rosca
        const g3 = naVaga(m.f3, m.g3);
        const rr = g3.w / 2 - 9;
        const c3x = g3.x + g3.w / 2;
        const c3y = g3.y + g3.h / 2;
        const a3 = janelas[2][0] + 0.01;
        const s3 = `<circle cx="${n(c3x)}" cy="${n(c3y)}" r="${n(rr)}" fill="none" stroke="${t.campo}" stroke-width="16"/>
<circle cx="${n(c3x)}" cy="${n(c3y)}" r="${n(rr)}" fill="none" stroke="${t.teal}" stroke-width="16" pathLength="1" stroke-dasharray="0.68 1" stroke-dashoffset="0" transform="rotate(-90 ${n(c3x)} ${n(c3y)})"><animate attributeName="stroke-dasharray" ${ciclo(P)} keyTimes="${kt(0, a3, a3 + 0.06, 1)}" values="0 1;0 1;0.68 1;0.68 1" calcMode="spline" keySplines="0 0 1 1;.3 0 .2 1;0 0 1 1"/></circle>`;
        const slide = (i, face, conteudo) =>
          `<g opacity="0">${visivelEntre(janelas[i][0], janelas[i][1], P)}${f.recorte(face, v.x, v.y)}${conteudo}</g>`;
        const pontos = [0, 1, 2]
          .map((i) => {
            const px = m.deck.x + m.deck.w / 2 + (i - 1) * 14;
            const py = m.deck.y + m.deck.h - 9;
            return `<circle cx="${n(px)}" cy="${n(py)}" r="3.2" fill="${t.linha}"/><circle cx="${n(px)}" cy="${n(py)}" r="3.2" fill="${t.teal}" opacity="0">${visivelEntre(janelas[i][0], janelas[i][1], P)}</circle>`;
          })
          .join('');
        return `${pontilhada(a1, t)}${pontilhada(a2, t)}${pontilhada(d, t)}${motor(mx, cy, t)}
${viajante(a1, 0.02, 0.1, P, t)}${viajante(a2, 0.02, 0.1, P, t)}${pulso(mx, cy, 24, 33, 0.1, 0.06, P, t.teal)}${viajante(d, 0.12, 0.2, P, t)}
${slide(0, 'f1', s1)}${slide(1, 'f2', s2)}${slide(2, 'f3', s3)}
${pontos}`;
      },
    };
  },

  // Chargebacks: os casos são varridos, os que repetem o mesmo destino formam um padrão e viram bloqueio
  chargebacks(t) {
    const H = 250;
    const cx0 = 230;
    const cy0 = 35;
    return {
      H,
      reserva: 50,
      html: `${cartao(t, { id: 'a', x: cx0, y: cy0, w: 300, h: 180, rotulo: 'casos do ano', icone: 'cartao', corpo: '<div data-m="grade" style="height:130px;margin-top:10px"></div>' })}
${rotulo('mesmo destino', 625, 158, t.suave)}
${cartao(t, { id: 'b', x: 715, y: 70, w: 230, h: 110, rotulo: 'bloqueio pelo padrão', icone: 'escudo', corpo: `${barras([80, 55], { topo: 10 })}<div data-m="vChip" style="height:22px;margin-top:12px"></div>` })}
<div class="abs" style="left:230px;top:${H + 10}px">${chip(t, 'padrão da rede', { id: 'chipPadrao', cor: t.alerta, fundo: t.alertaFundo })}</div>`,
      animar(f) {
        const m = f.medidas;
        const P = 9;
        const g = m.grade;
        const colunas = 6;
        const linhasG = 4;
        const cw = 36;
        const ch = 22;
        const gx = (g.w - colunas * cw) / (colunas - 1);
        const gy = (g.h - linhasG * ch) / (linhasG - 1);
        const padrao = new Set([2, 7, 9, 14, 19, 21]);
        const hx = 625;
        const hy = 125;
        const varre = (x) => 0.04 + ((x - g.x) / g.w) * 0.2;
        let casos = '';
        let fios = '';
        for (let i = 0; i < colunas * linhasG; i++) {
          const c = i % colunas;
          const l = Math.floor(i / colunas);
          const x = g.x + c * (cw + gx);
          const y = g.y + l * (ch + gy);
          const k = varre(x + cw / 2);
          casos += `<rect x="${n(x)}" y="${n(y)}" width="${cw}" height="${ch}" rx="5" fill="${t.campo}"/><rect x="${n(x + 7)}" y="${n(y + ch / 2 - 2.5)}" width="${cw - 14}" height="5" rx="2.5" fill="${t.traco}"/>`;
          if (padrao.has(i)) {
            casos += `<g opacity="0">${visivelEntre(k, 0.95, P)}<rect x="${n(x)}" y="${n(y)}" width="${cw}" height="${ch}" rx="5" fill="${t.alertaFundo}" stroke="${t.alerta}" stroke-width="1.5"/><rect x="${n(x + 7)}" y="${n(y + ch / 2 - 2.5)}" width="${cw - 14}" height="5" rx="2.5" fill="${t.alerta}" opacity=".6"/></g>`;
            const xa = x + cw;
            const ya = y + ch / 2;
            fios += desenha(`M${n(xa)} ${n(ya)}C${n(hx - 50)} ${n(ya)} ${n(hx - 40)} ${hy} ${hx - 26} ${hy}`, t, 0.28, 0.38, P, { esp: 1.6, cor: t.alerta });
          }
        }
        const faixa = `<rect x="${n(g.x - 6)}" y="${n(g.y - 6)}" width="40" height="${n(g.h + 12)}" rx="8" fill="${t.teal}" opacity="0">
<animate attributeName="x" ${ciclo(P)} keyTimes="${kt(0, 0.04, 0.24, 1)}" values="${n(g.x - 20)};${n(g.x - 20)};${n(g.x + g.w - 20)};${n(g.x + g.w - 20)}"/>
<animate attributeName="opacity" ${ciclo(P)} keyTimes="${kt(0, 0.04, 0.05, 0.23, 0.24, 1)}" values="0;0;.14;.14;0;0"/></rect>`;
        const d = entre(noMedida(hx, hy), m.b);
        return `${casos}${faixa}${fios}
${no(hx, hy, t, 'alvo')}${pulso(hx, hy, 24, 33, 0.38, 0.08, P, t.alerta)}
${pontilhada(d, t)}${viajante(d, 0.41, 0.5, P, t)}
${contorno(m.b, t, 0.5, 0.94, P)}${aparece(f.recorte('chipPadrao', m.vChip.x, m.vChip.y), 0.5, 0.94, P)}`;
      },
    };
  },

  // Leitura do atendimento: a taxa de resposta de cada modelo e os pontos de cada vendedor
  'leitura-atendimento'(t) {
    const H = 250;
    const modelos = [['Modelo A', 0.38], ['Modelo B', 0.74], ['Modelo C', 0.52]];
    return {
      H,
      reserva: 50,
      html: `${cartao(t, {
        id: 'a', x: 235, y: 35, w: 330, h: 180, rotulo: 'modelos de mensagem', icone: 'chat',
        corpo: `<div style="margin-top:8px">${modelos.map(([nomeModelo], i) => `<div data-m="l${i}" style="height:40px;display:flex;align-items:center;gap:12px;margin-top:3px;border-radius:8px;padding:0 4px">${chip(t, nomeModelo, { cor: t.apoio, fundo: t.campo })}<span data-m="trk${i}" style="flex:1;height:10px;border-radius:5px;background:${t.campo}"></span></div>`).join('')}</div>`,
      })}
${cartao(t, {
  id: 'b', x: 635, y: 35, w: 330, h: 180, rotulo: 'vendedores', icone: 'usuarios',
  corpo: `<div style="margin-top:8px">${[0, 1, 2].map((i) => `<div style="height:40px;display:flex;align-items:center;gap:10px;margin-top:3px">${avatar(t, 24)}<div style="width:90px">${barras([85, 55], { topo: 0, alt: 5, gap: 5 })}</div><span data-m="vp${i}" style="flex:1;height:22px"></span></div>`).join('')}</div>`,
})}
<div class="abs" style="left:235px;top:${H + 10}px;display:flex;gap:10px">${chip(t, 'melhor resposta', { id: 'melhor' })}${chip(t, 'ponto forte', { id: 'forte' })}${chip(t, 'ponto de atenção', { id: 'atencao', cor: t.aviso, fundo: t.avisoFundo })}</div>`,
      animar(f) {
        const m = f.medidas;
        const P = 9;
        const barrasModelo = modelos
          .map(([, fr], i) => {
            const k = m[`trk${i}`];
            const a = 0.04 + i * 0.05;
            return `<rect x="${n(k.x)}" y="${n(k.y)}" width="${n(k.w * fr)}" height="${n(k.h)}" rx="5" fill="${i === 1 ? t.teal : t.navy2}">${cresce(P, 'width', 0, k.w * fr, a, a + 0.08)}</rect>`;
          })
          .join('');
        const melhor = m.l1;
        const ptos = [['forte', 0.36], ['atencao', 0.44], ['forte', 0.52]]
          .map(([id, a], i) => aparece(f.recorte(id, m[`vp${i}`].x, m[`vp${i}`].y), a, 0.94, P))
          .join('');
        return `${barrasModelo}
${contorno(melhor, t, 0.24, 0.94, P, { rx: 8 })}
${aparece(f.recorte('melhor', m.a.x + m.a.w - m.melhor.w - 14, m.a.y + 9), 0.24, 0.94, P)}
${ptos}`;
      },
    };
  },

  // Metas: a base do último trimestre, a meta de cada vendedor e o fator dos meses de baixa
  metas(t) {
    const H = 250;
    const base = [0.62, 0.8, 0.45, 0.7, 0.9, 0.55];
    return {
      H,
      reserva: 40,
      html: `${cartao(t, {
        id: 'a', x: 300, y: 18, w: 600, h: 214, rotulo: 'metas do mês por vendedor', icone: 'alvo',
        corpo: `<div style="position:absolute;right:14px;top:10px;display:flex;gap:8px">${chip(t, 'base: último trimestre', { cor: t.apoio, fundo: t.campo })}<span data-m="vFator" style="width:170px;height:22px"></span></div>
<div data-m="graf" style="height:128px;margin-top:22px;border-bottom:1.5px solid ${t.linha}"></div>
<div style="display:flex;margin-top:7px">${base.map((_, i) => `<span class="nu" style="flex:1;text-align:center;font-size:11px;color:${t.apoio}">Vendedor ${String.fromCharCode(65 + i)}</span>`).join('')}</div>`,
      })}
<div class="abs" style="left:300px;top:${H + 8}px">${chip(t, 'mês de baixa: fator sazonal', { id: 'fator', cor: t.aviso, fundo: t.avisoFundo })}</div>`,
      animar(f) {
        const m = f.medidas;
        const P = 9;
        const g = m.graf;
        const col = g.w / base.length;
        const lb = 40;
        const chao = g.y + g.h;
        let s = '';
        base.forEach((fr, i) => {
          const h = g.h * fr * 0.9;
          const x = g.x + col * (i + 0.5) - lb / 2;
          const a = 0.04 + i * 0.02;
          s += `<rect x="${n(x)}" y="${n(chao - h)}" width="${lb}" height="${n(h)}" rx="5" fill="${t.navy2}" opacity=".85">${cresce(P, 'y', chao, chao - h, a, a + 0.06)}${cresce(P, 'height', 0, h, a, a + 0.06)}</rect>`;
          const yMeta = chao - Math.min(h * 1.12, g.h - 4);
          const yBaixa = chao - h * 0.8;
          s += `<g opacity="0">${visivelEntre(0.26 + i * 0.015, 0.95, P)}<path d="M${n(x - 8)} ${n(yMeta)}H${n(x + lb + 8)}" stroke="${t.teal}" stroke-width="3" stroke-linecap="round"><animateTransform attributeName="transform" type="translate" ${ciclo(P)} keyTimes="${kt(0, 0.52, 0.6, 1)}" values="0 0;0 0;0 ${n(yBaixa - yMeta)};0 ${n(yBaixa - yMeta)}" calcMode="spline" keySplines="0 0 1 1;.3 0 .2 1;0 0 1 1"/></path></g>`;
        });
        return `${s}${aparece(f.recorte('fator', m.vFator.x + m.vFator.w - m.fator.w, m.vFator.y), 0.5, 0.94, P)}`;
      },
    };
  },

  // Auditoria de preço: a varredura passa pelos anúncios; a maioria segue o preço, um fura e um é marca falsa
  'auditoria-preco'(t) {
    const H = 250;
    const x = 210;
    const y = 25;
    const n6 = [0, 1, 2, 3, 4, 5];
    const pequeno = 'font-size:10.5px;padding:4px 7px';
    return {
      H,
      reserva: 50,
      html: `${cartao(t, {
        id: 'a', x, y, w: 780, h: 200, rotulo: 'anúncios de revendedores', icone: 'busca',
        corpo: `<div style="display:flex;gap:17px;margin-top:12px">${n6.map((i) => `<div data-m="c${i}" style="width:109px;height:128px;border-radius:9px;border:1px solid ${t.linha};padding:7px"><div style="height:46px;border-radius:6px;background:${t.campo}"></div>${barras([90, 60], { topo: 8, alt: 5, gap: 5 })}<div data-m="st${i}" style="height:22px;margin-top:10px"></div></div>`).join('')}</div>
<div data-m="vResumo" style="position:absolute;right:14px;top:9px;width:220px;height:22px"></div>`,
      })}
<div class="abs" style="left:${x}px;top:${H + 10}px;display:flex;gap:10px">${chip(t, 'abaixo do piso', { id: 'abaixo', cor: t.alerta, fundo: t.alertaFundo, estilo: pequeno })}${chip(t, 'marca falsa', { id: 'falsa', cor: t.alerta, fundo: t.alertaFundo, estilo: pequeno })}${chip(t, 'a maioria acompanha o preço', { id: 'resumo' })}</div>`,
      animar(f) {
        const m = f.medidas;
        const P = 9;
        const estado = ['ok', 'ok', 'abaixo', 'ok', 'falsa', 'ok'];
        const primeiro = m.c0;
        const ultimo = m.c5;
        const varre = (cx) => 0.05 + ((cx - primeiro.x) / (ultimo.x + ultimo.w - primeiro.x)) * 0.5;
        const faixa = `<rect x="${n(primeiro.x - 30)}" y="${n(primeiro.y - 6)}" width="44" height="${n(primeiro.h + 12)}" rx="8" fill="${t.teal}" opacity="0">
<animate attributeName="x" ${ciclo(P)} keyTimes="${kt(0, 0.05, 0.55, 1)}" values="${n(primeiro.x - 30)};${n(primeiro.x - 30)};${n(ultimo.x + ultimo.w - 14)};${n(ultimo.x + ultimo.w - 14)}"/>
<animate attributeName="opacity" ${ciclo(P)} keyTimes="${kt(0, 0.05, 0.06, 0.54, 0.55, 1)}" values="0;0;.14;.14;0;0"/></rect>`;
        // dentro da política: só o visto; fora: contorno vermelho e a etiqueta do problema
        const status = estado
          .map((e, i) => {
            const c = m[`c${i}`];
            const st = m[`st${i}`];
            const k = varre(c.x + c.w / 2);
            if (e === 'ok') return aparece(selo(st.x + 10, st.y + st.h / 2, 9, t), k, 0.94, P, { sobe: 4 });
            return `${contorno(c, t, k, 0.94, P, { rx: 9, cor: t.alerta })}${aparece(f.recorte(e, st.x, st.y), k, 0.94, P, { sobe: 4 })}`;
          })
          .join('');
        return `${faixa}${status}${aparece(f.recorte('resumo', m.vResumo.x + m.vResumo.w - m.resumo.w, m.vResumo.y), 0.6, 0.94, P)}`;
      },
    };
  },

  // Auditoria do e-commerce: a varredura desce pela página e cada problema vira item da lista priorizada
  'auditoria-site'(t) {
    const H = 260;
    return {
      H,
      html: `<div class="abs cartaoP" data-m="nav" style="left:260px;top:14px;width:440px;height:232px;overflow:hidden">
<div style="height:30px;display:flex;align-items:center;gap:6px;padding:0 12px;border-bottom:1px solid ${t.linha}">${['#E5484D', '#F2B55A', '#2CC9B9'].map((c) => `<span style="width:9px;height:9px;border-radius:50%;background:${c};opacity:.7"></span>`).join('')}<span style="margin-left:10px;flex:1;height:16px;border-radius:8px;background:${t.campo}"></span></div>
<div data-m="pag" style="padding:12px 14px">
<div style="display:flex;align-items:center;gap:10px"><span style="width:60px;height:14px;border-radius:4px;background:${t.navy2};opacity:.8"></span><span style="flex:1"></span>${[36, 44, 30].map((w, i) => `<span${i === 1 ? ' data-m="i0"' : ''} style="width:${w}px;height:7px;border-radius:4px;background:${t.traco}"></span>`).join('')}</div>
<div data-m="i1" style="height:62px;border-radius:8px;background:${t.campo};margin-top:12px;padding:12px">${barras([55, 35], { topo: 0, alt: 7 })}</div>
<div style="display:flex;gap:10px;margin-top:12px">${[0, 1, 2].map((i) => `<div${i === 2 ? ' data-m="i2"' : ''} style="flex:1;height:58px;border-radius:7px;border:1px solid ${t.linha};padding:6px"><div style="height:24px;border-radius:5px;background:${t.campo}"></div>${barras([80], { topo: 7, alt: 5 })}</div>`).join('')}</div>
<div style="display:flex;gap:14px;margin-top:12px">${barras([30], { topo: 0, alt: 6 })}<span data-m="i3" style="width:70px;height:6px;border-radius:3px;background:${t.traco}"></span></div>
</div></div>
${cartao(t, {
  id: 'lista', x: 740, y: 40, w: 220, h: 180, rotulo: 'lista priorizada', icone: 'doc',
  corpo: `<div style="margin-top:8px">${[t.alerta, t.alerta, t.aviso, t.aviso].map((c, i) => `<div data-m="li${i}" style="height:30px;display:flex;align-items:center;gap:9px;margin-top:3px"><span style="width:9px;height:9px;border-radius:50%;background:${c}"></span><div style="flex:1">${barras([85 - i * 10], { topo: 0, alt: 6 })}</div></div>`).join('')}</div>`,
})}`,
      animar(f) {
        const m = f.medidas;
        const P = 10;
        const pg = m.nav;
        const topo = pg.y + 32;
        const baixo = pg.y + pg.h - 6;
        const quando = (y) => 0.05 + ((y - topo) / (baixo - topo)) * 0.45;
        const linhaVarre = `<g opacity="0"><animate attributeName="opacity" ${ciclo(P)} keyTimes="${kt(0, 0.05, 0.06, 0.49, 0.5, 1)}" values="0;0;1;1;0;0"/>
<animateTransform attributeName="transform" type="translate" ${ciclo(P)} keyTimes="${kt(0, 0.05, 0.5, 1)}" values="0 0;0 0;0 ${n(baixo - topo)};0 ${n(baixo - topo)}"/>
<rect x="${n(pg.x)}" y="${n(topo - 16)}" width="${n(pg.w)}" height="16" fill="${t.teal}" opacity=".12"/><path d="M${n(pg.x)} ${n(topo)}H${n(pg.x + pg.w)}" stroke="${t.teal}" stroke-width="2"/></g>`;
        const alvos = ['i0', 'i1', 'i2', 'i3'].map((id) => m[id]);
        const pinos = alvos
          .map((a, i) => {
            const cx = a.x + a.w - 4;
            const cy = a.y + Math.min(a.h / 2, 10);
            const k = quando(cy);
            return `<g opacity="0">${visivelEntre(k, 0.95, P)}${alertaPulsando(cx, cy, 8, i < 2 ? t.alerta : t.aviso)}<circle cx="${n(cx)}" cy="${n(cy)}" r="8" fill="${i < 2 ? t.alerta : t.aviso}"/>${iconeSvg('exclamacao', cx, cy, 13, t.cartao, 2.6)}</g>`;
          })
          .join('');
        const itens = alvos.map((a, i) => cortina(m[`li${i}`], t.cartao, quando(a.y + Math.min(a.h / 2, 10)), quando(a.y + Math.min(a.h / 2, 10)) + 0.03, P)).join('');
        return `${linhaVarre}${pinos}${itens}${contorno(m.lista, t, 0.52, 0.94, P)}`;
      },
    };
  },

  // Ruptura: a varredura lê saldo e mínimo de cada produto; os itens em risco vão para o rascunho do e-mail
  ruptura(t) {
    const H = 250;
    const saldo = [0.8, 0.3, 0.02, 0.65, 0.2];
    const minimo = 0.4;
    return {
      H,
      reserva: 50,
      html: `${cartao(t, {
        id: 'a', x: 215, y: 25, w: 400, h: 200, rotulo: 'catálogo do ERP', icone: 'erp',
        corpo: `<div style="margin-top:6px">${saldo.map((_, i) => `<div data-m="l${i}" style="height:31px;display:flex;align-items:center;gap:9px;margin-top:2px;border-radius:6px;padding:0 4px"><span style="width:20px;height:20px;border-radius:5px;background:${t.campo}"></span><div style="width:90px">${barras([85], { topo: 0, alt: 6 })}</div><span data-m="sk${i}" style="position:relative;width:96px;height:8px;border-radius:4px;background:${t.campo}"><span style="position:absolute;left:${minimo * 100}%;top:-4px;width:2px;height:16px;background:${t.navy2};opacity:.6"></span></span><span data-m="vs${i}" style="flex:1;height:22px"></span></div>`).join('')}</div>`,
      })}
${cartao(t, {
  id: 'b', x: 775, y: 55, w: 200, h: 140, rotulo: 'rascunho para revisão', icone: 'email',
  corpo: `<div style="margin-top:8px">${[0, 1, 2].map((i) => `<div data-m="e${i}" style="height:26px;display:flex;align-items:center;gap:8px;margin-top:3px"><span style="width:8px;height:8px;border-radius:50%;background:${t.alerta}"></span><div style="flex:1">${barras([85 - i * 12], { topo: 0, alt: 6 })}</div></div>`).join('')}</div>`,
})}
<div class="abs" style="left:240px;top:${H + 10}px;display:flex;gap:10px">${chip(t, 'abaixo do mínimo', { id: 'baixo', cor: t.alerta, fundo: t.alertaFundo })}${chip(t, 'zerado', { id: 'zero', cor: t.alerta, fundo: t.alertaFundo })}</div>`,
      animar(f) {
        const m = f.medidas;
        const P = 9;
        const mx = 695;
        const cy = 125;
        const nm = noMedida(mx, cy);
        let s = '';
        saldo.forEach((fr, i) => {
          const k = 0.04 + i * 0.06;
          const l = m[`l${i}`];
          const sk = m[`sk${i}`];
          const risco = fr < minimo;
          s += realce(l, t.tealFundo, k, k + 0.06, P, { rx: 6 });
          s += `<rect x="${n(sk.x)}" y="${n(sk.y)}" width="${n(sk.w * fr)}" height="${n(sk.h)}" rx="4" fill="${risco ? t.alerta : t.teal}">${cresce(P, 'width', 0, sk.w * fr, k, k + 0.04)}</rect>`;
          if (risco) s += aparece(f.recorte(fr < 0.05 ? 'zero' : 'baixo', m[`vs${i}`].x + 4, m[`vs${i}`].y), k + 0.04, 0.94, P, { sobe: 4 });
        });
        const d1 = entre(m.a, nm);
        const d2 = entre(nm, m.b);
        const itens = [0, 1, 2].map((i) => cortina(m[`e${i}`], t.cartao, 0.6 + i * 0.03, 0.63 + i * 0.03, P)).join('');
        return `${s}
${pontilhada(d1, t)}${pontilhada(d2, t)}${no(mx, cy, t, 'faisca')}
${viajante(d1, 0.38, 0.47, P, t)}${pulso(mx, cy, 24, 33, 0.47, 0.06, P, t.teal)}${viajante(d2, 0.5, 0.59, P, t)}
${itens}${contorno(m.b, t, 0.59, 0.94, P)}`;
      },
    };
  },

  // Compra suspeita: o porteiro confere cada pedido novo do site; só o suspeito vira aviso ao financeiro
  'compra-suspeita'(t) {
    const H = 250;
    const regras = ['ruído no endereço', 'destino repetido', 'chargeback anterior'];
    return {
      H,
      reserva: 190,
      html: `${cartao(t, {
        id: 'a', x: 170, y: 45, w: 210, h: 160, rotulo: 'ERP · pedido novo do site', icone: 'pedido',
        corpo: `<div style="font-size:11px;color:${t.suave};margin-top:11px">cliente</div>${barras([70], { topo: 5, alt: 6 })}
<div style="font-size:11px;color:${t.suave};margin-top:9px">endereço</div>${barras([90, 60], { topo: 5, alt: 6, gap: 5 })}
<div data-m="vTipo" style="height:22px;margin-top:10px"></div>`,
      })}
${rotulo('porteiro', 470, 158, t.suave)}
${regras.map((r, i) => `<div class="abs" data-m="r${i}" style="left:530px;top:${80 + i * 36}px;width:200px;height:28px;border-radius:9px;border:1px solid ${t.linha};background:${t.cartao};display:flex;align-items:center;padding:0 11px;font-size:12px;color:${t.apoio}">${r}</div>`).join('')}
${cartao(t, {
  id: 'b', x: 770, y: 40, w: 250, h: 170, rotulo: 'WhatsApp · financeiro', icone: 'balao',
  corpo: `<div data-m="vAviso" style="height:124px;margin-top:10px;display:grid;place-items:center;font-size:12px;color:${t.suave}">nenhum aviso enviado</div>`,
})}
<div class="abs" data-m="aviso" style="left:20px;top:${H + 10}px;width:222px;height:124px;border-radius:12px 12px 12px 4px;background:${t.campo};padding:11px 12px 0">
${chip(t, 'POSSÍVEL CHARGEBACK', { cor: t.alerta, fundo: t.alertaFundo, estilo: 'font-size:10.5px' })}${barras([90, 65], { topo: 9, alt: 6, gap: 6 })}
<div style="height:1px;background:${t.traco};margin:10px -12px 0"></div>
<div class="ti" data-m="abrir" style="height:34px;display:flex;align-items:center;justify-content:center;gap:7px;font-size:12px;color:${t.tealEsc}">${icone('link', 14, t.tealEsc, 2.2)}Abrir pedido no ERP</div></div>
<div class="abs" style="left:270px;top:${H + 10}px;display:flex;flex-direction:column;gap:10px;align-items:flex-start">${chip(t, 'pedido comum', { id: 'v1', cor: t.apoio, fundo: t.campo })}${chip(t, 'endereço com ruído', { id: 'v2', cor: t.alerta, fundo: t.alertaFundo })}${chip(t, 'sem sinais', { id: 'semSinais' })}${chip(t, 'cancelado antes do envio', { id: 'cancelado' })}</div>`,
      animar(f) {
        const m = f.medidas;
        const P = 12;
        const px = 470;
        const cy = 125;
        const nm = noMedida(px, cy);
        const d1 = entre(m.a, nm);
        const dR = `M${px + 33} ${cy}H${n(m.r0.x - 9)}`;
        const d2 = entre(m.r1, m.b);
        const marcas = (base, tipos) =>
          tipos
            .map((tipo, i) => {
              const r = m[`r${i}`];
              const k = base + 0.12 + i * 0.03;
              return `${realce(r, tipo === 'alerta' ? t.alertaFundo : t.tealFundo, k, base + 0.47, P, { rx: 9 })}<g opacity="0">${visivelEntre(k, base + 0.47, P)}${marca(t, tipo, r.x + r.w - 16, r.y + r.h / 2)}</g>`;
            })
            .join('');
        const v = m.vAviso;
        const ab = m.abrir;
        const av = m.aviso;
        const bx = v.x + (v.w - av.w) / 2;
        const by = v.y;
        return `<g opacity="0">${visivelEntre(0, 0.5, P)}${f.recorte('v1', m.vTipo.x, m.vTipo.y)}</g>
<g opacity="0">${visivelEntre(0.5, 1, P)}${f.recorte('v2', m.vTipo.x, m.vTipo.y)}</g>
${pontilhada(d1, t)}${pontilhada(dR, t)}${no(px, cy, t, 'escudo')}
${viajante(d1, 0.03, 0.1, P, t)}${pulso(px, cy, 24, 33, 0.1, 0.06, P, t.teal)}
${marcas(0, ['ok', 'ok', 'ok'])}
<g opacity="0">${visivelEntre(0.22, 0.47, P)}${f.recorte('semSinais', px - m.semSinais.w / 2, cy + 50)}</g>
${viajante(d1, 0.53, 0.6, P, t)}${pulso(px, cy, 24, 33, 0.6, 0.06, P, t.alerta)}
${marcas(0.5, ['alerta', 'alerta', 'ok'])}
${pontilhada(d2, t)}${viajante(d2, 0.7, 0.77, P, t)}
<g opacity="0">${visivelEntre(0.77, 0.97, P)}${f.recorte('aviso', bx, by)}</g>
${contorno(m.b, t, 0.77, 0.97, P)}
<rect x="${n(bx + (ab.x - av.x))}" y="${n(by + (ab.y - av.y))}" width="${n(ab.w)}" height="${n(ab.h)}" rx="6" fill="${t.teal}" opacity="0"><animate attributeName="opacity" ${ciclo(P)} keyTimes="${kt(0, 0.85, 0.86, 0.9, 1)}" values="0;0;.35;0;0"/></rect>
${contorno(m.a, t, 0.88, 0.97, P)}
<g opacity="0">${visivelEntre(0.88, 0.97, P)}${f.recorte('cancelado', m.vTipo.x, m.vTipo.y)}</g>`;
      },
    };
  },

  // Onboarding: o script acha cada caixa e cada linha do PDF, vira campo de formulário e o RH marca
  onboarding(t) {
    const H = 270;
    const linhas = [0, 1, 2, 3, 4, 5];
    return {
      H,
      html: `${cartao(t, {
        id: 'doc', x: 370, y: 72, w: 130, h: 126, rotulo: 'documento', icone: 'doc',
        corpo: `<div style="margin-top:8px">${[0, 1, 2, 3].map(() => `<div style="display:flex;align-items:center;gap:6px;margin-top:6px"><span style="width:9px;height:9px;border:1.3px solid ${t.suave};border-radius:2px"></span><div style="flex:1">${barras([80], { topo: 0, alt: 5 })}</div></div>`).join('')}</div>`,
      })}
${cartao(t, {
  id: 'pdf', x: 650, y: 10, w: 190, h: 250, rotulo: 'PDF preenchível', icone: 'doc',
  corpo: `<div style="margin-top:4px">${linhas.map((i) => `<div style="display:flex;align-items:center;gap:8px;margin-top:8px"><span data-m="cb${i}" style="width:13px;height:13px;border:1.5px solid ${t.suave};border-radius:3px;flex:none"></span><div style="flex:1">${barras([90 - (i % 3) * 15], { topo: 0, alt: 6 })}</div></div>`).join('')}
${[0, 1].map((i) => `<div style="margin-top:9px"><div style="font-size:10px;line-height:1.2;color:${t.suave}">${i ? 'data' : 'nome'}</div><div data-m="tx${i}" style="height:16px;border-bottom:1.5px solid ${t.suave};margin-top:2px"></div></div>`).join('')}</div>`,
})}`,
      animar(f) {
        const m = f.medidas;
        const P = 8;
        const mx = 575;
        const cy = 135;
        const nm = noMedida(mx, cy);
        const d1 = entre(m.doc, nm);
        const d2 = entre(nm, m.pdf);
        const detecta = (r, k, rx = 3) =>
          `<rect x="${n(r.x - 3)}" y="${n(r.y - 3)}" width="${n(r.w + 6)}" height="${n(r.h + 6)}" rx="${rx + 2}" fill="none" stroke="${t.teal}" stroke-width="1.6" stroke-dasharray="3 3" opacity="0">${visivelEntre(k, 0.95, P)}</rect>`;
        let s = '';
        linhas.forEach((i) => {
          const cb = m[`cb${i}`];
          s += detecta(cb, 0.3 + i * 0.025);
          if ([0, 1, 3, 4].includes(i)) {
            const k = 0.58 + [0, 1, 3, 4].indexOf(i) * 0.05;
            s += `<g opacity="0">${visivelEntre(k, 0.95, P)}<rect x="${n(cb.x)}" y="${n(cb.y)}" width="${n(cb.w)}" height="${n(cb.h)}" rx="3" fill="${t.teal}"/>${iconeSvg('check', cb.x + cb.w / 2, cb.y + cb.h / 2, 11, t.cartao, 3.2)}</g>`;
          }
        });
        [0, 1].forEach((i) => {
          const tx = m[`tx${i}`];
          s += detecta(tx, 0.46 + i * 0.03, 4);
          const w = tx.w * (i ? 0.45 : 0.7);
          const a = 0.8 + i * 0.05;
          s += `<rect x="${n(tx.x + 3)}" y="${n(tx.y + tx.h / 2 - 3)}" width="${n(w)}" height="6" rx="3" fill="${t.navy2}"><animate attributeName="width" ${ciclo(P)} keyTimes="${kt(0, a, a + 0.05, 0.95, 0.97, 1)}" values="0;0;${n(w)};${n(w)};0;0"/></rect>`;
        });
        return `${pontilhada(d1, t)}${pontilhada(d2, t)}${motor(mx, cy, t)}
${viajante(d1, 0.04, 0.13, P, t)}${pulso(mx, cy, 24, 33, 0.13, 0.06, P, t.teal)}${viajante(d2, 0.16, 0.26, P, t)}
${s}${contorno(m.pdf, t, 0.58, 0.94, P)}`;
      },
    };
  },
};

// ---------- segundo painel da plataforma: as novidades (vendas, promoções, SAC, equipe e segurança) ----------

const MENU_NOVIDADES = [
  ['visao', 'Visão geral', 'grade'],
  ['vendas', 'Vendas', 'grafico'],
  ['promocoes', 'Promoções', 'etiqueta'],
  ['sac', 'SAC', 'balao'],
  ['protecao', 'Proteção', 'escudo'],
  ['equipe', 'Equipe', 'usuarios'],
  ['seguranca', 'Segurança', 'cadeado'],
];

const telaVendas = {
  menu: 'vendas',
  reserva: 160,
  html: (t, w, h) => `<div style="padding:20px 24px">
<div style="display:flex;align-items:flex-start;justify-content:space-between">${`<div>${cabecalhoTela(t, 'Vendas por período', 'Um período manda na tela inteira')}</div>`}
<div class="ti" data-m="botao" style="height:30px;border-radius:9px;background:${t.motor};color:${t.sobreMotor};font-size:12px;display:flex;align-items:center;gap:7px;padding:0 12px">${icone('slide', 14, t.sobreMotor, 2)}Gerar apresentação</div></div>
<div class="pilula" style="margin-top:12px;height:26px">${icone('relogio', 13, t.apoio)}últimos 7 dias</div>
<div data-m="graf" style="height:150px;margin-top:14px;border-bottom:1.5px solid ${t.linha}"></div>
<div style="display:flex;margin-top:6px">${['seg', 'ter', 'qua', 'qui', 'sex', 'sáb', 'dom'].map((d) => `<span class="nu" style="flex:1;text-align:center;font-size:10.5px;color:${t.apoio}">${d}</span>`).join('')}</div>
</div>
<div class="abs" data-m="slide" style="left:30px;top:${h + 30}px;width:170px;height:100px;border-radius:9px;background:${t.cartao};border:1px solid ${t.linha};box-shadow:${t.sombra};padding:10px 11px">
<div style="height:8px;width:60%;border-radius:4px;background:${t.navy2}"></div>
<div style="display:flex;align-items:flex-end;gap:5px;height:44px;margin-top:10px">${[0.5, 0.7, 0.45, 0.9, 0.65].map((fr) => `<span style="flex:1;height:${fr * 100}%;border-radius:3px;background:${t.teal};opacity:.75"></span>`).join('')}</div>
<div class="nu" style="font-size:9.5px;color:${t.suave};margin-top:7px">apresentação do período</div></div>`,
  animar(f, { t, P, T0, T1, ox, oy }) {
    const m = f.medidas;
    const g = m.graf;
    const alturas = [0.5, 0.62, 0.45, 0.8, 0.7, 0.92, 0.66];
    const col = g.w / alturas.length;
    const lb = 34;
    const chao = oy + g.y + g.h;
    const colunas = alturas
      .map((fr, i) => {
        const h = g.h * fr * 0.92;
        const x = ox + g.x + col * (i + 0.5) - lb / 2;
        const a = T0 + 0.004 + i * 0.006;
        return `<rect x="${n(x)}" y="${n(chao - h)}" width="${lb}" height="${n(h)}" rx="5" fill="${i === 5 ? t.teal : t.navy2}">${cresce(P, 'y', chao, chao - h, a, a + 0.03)}${cresce(P, 'height', 0, h, a, a + 0.03)}</rect>`;
      })
      .join('');
    const b = m.botao;
    const k = T0 + 0.085;
    const sx = ox + b.x + b.w - m.slide.w;
    const sy = oy + b.y + b.h + 10;
    return `${colunas}
<rect x="${n(ox + b.x)}" y="${n(oy + b.y)}" width="${n(b.w)}" height="${n(b.h)}" rx="9" fill="${t.teal}" opacity="0"><animate attributeName="opacity" ${ciclo(P)} keyTimes="${kt(0, k, k + 0.004, k + 0.02, 1)}" values="0;0;.55;0;0"/></rect>
${aparece(f.recorte('slide', sx, sy, 24), k + 0.012, T1, P, { sobe: -8 })}`;
  },
};

const telaPromocoes = {
  menu: 'promocoes',
  html: (t) => {
    const status = [
      ['em promoção', t.tealEsc, t.tealFundo],
      ['acaba hoje', t.alerta, t.alertaFundo],
      ['programada', t.navy2, t.campo],
      ['sem promoção', t.suave, t.campo],
    ];
    return `<div style="padding:20px 24px">
${cabecalhoTela(t, 'Promoções', 'Em promoção, acabando e programadas')}
<div style="margin-top:12px">${status.map(([s, c, fundo], i) => `<div data-m="p${i}" style="height:44px;display:flex;align-items:center;gap:12px;border-top:1px solid ${t.linha}"><span style="width:28px;height:28px;border-radius:7px;background:${t.campo}"></span><div style="width:190px">${barras([85, 50], { topo: 0, alt: 6, gap: 6 })}</div><span style="margin-left:auto">${chip(t, s, { cor: c, fundo, id: i === 1 ? 'acaba' : undefined })}</span></div>`).join('')}</div>
<div class="pilula" style="margin-top:12px">${icone('faisca', 13, t.teal)}Promoções acabando entram no resumo do dia</div>
</div>`;
  },
  animar(f, { t, P, T0, ox, oy }) {
    const m = f.medidas;
    const desloca = (r) => ({ x: ox + r.x, y: oy + r.y, w: r.w, h: r.h });
    const linhas = [0, 1, 2, 3].map((i) => cortina(desloca(m[`p${i}`]), t.cartao, T0 + 0.004 + i * 0.01, T0 + 0.014 + i * 0.01, P, { fim: 0.999 })).join('');
    const a = desloca(m.acaba);
    return `${linhas}<g opacity="0">${visivelEntre(T0 + 0.05, 1, P)}${alertaPulsando(a.x - 12, a.y + a.h / 2, 4, t.alerta)}<circle cx="${n(a.x - 12)}" cy="${n(a.y + a.h / 2)}" r="4" fill="${t.alerta}"/></g>`;
  },
};

const telaSac = {
  menu: 'sac',
  reserva: 90,
  html: (t, w, h) => `<div style="padding:20px 24px">
<div class="ti" style="font-size:21px;line-height:1.15">SAC</div>
<div style="display:flex;gap:18px;margin-top:8px;font-size:12.5px;border-bottom:1px solid ${t.linha}"><span style="color:${t.tealEsc};font-weight:700;padding-bottom:7px;border-bottom:2px solid ${t.teal}">Perguntas</span><span style="color:${t.suave}">Pós-vendas</span></div>
<div style="display:flex;gap:14px;margin-top:12px">
<div style="width:170px">${[0, 1, 2].map((i) => `<div data-m="item${i}" style="height:48px;display:flex;align-items:center;gap:8px;padding:0 8px;border-radius:9px;${i === 0 ? `background:${t.tealFundo}` : ''};margin-top:${i ? 5 : 0}px">${avatar(t, 24)}<div style="flex:1">${barras([85, 55], { topo: 0, alt: 5, gap: 5 })}</div></div>`).join('')}</div>
<div style="flex:1;border-left:1px solid ${t.linha};padding-left:14px">
<div style="display:flex;align-items:center;gap:8px">${avatar(t, 22)}<div style="width:110px">${barras([80], { topo: 0, alt: 6 })}</div>${chip(t, 'já comprou', { cor: t.apoio, fundo: t.campo, estilo: 'margin-left:auto' })}</div>
<div data-m="pergunta" style="margin-top:14px;width:220px;border-radius:12px 12px 12px 4px;background:${t.campo};padding:9px 11px;font-size:12.5px">Esse produto tem refil?</div>
<div data-m="vResposta" style="margin:10px 0 0 auto;width:230px;height:52px"></div>
</div></div></div>
<div class="abs" data-m="resposta" style="left:24px;top:${h + 10}px;width:230px;height:52px;border-radius:12px 12px 4px 12px;background:${t.tealFundo};padding:9px 11px;font-size:12.5px;line-height:1.3">Tem sim, o refil está na mesma página do anúncio.</div>
<div class="abs" style="left:280px;top:${h + 10}px">${chip(t, 'respondida', { id: 'respondida' })}</div>`,
  animar(f, { t, P, T0, T1, ox, oy }) {
    const m = f.medidas;
    const v = m.vResposta;
    const k = T0 + 0.07;
    const pontos = [0, 1, 2]
      .map((i) => {
        const cx = ox + v.x + v.w - 40 + i * 12;
        const cy = oy + v.y + 16;
        const a = 0.001 + i * 0.15;
        return `<circle cx="${n(cx)}" cy="${n(cy)}" r="3.5" fill="${t.suave}"><animate attributeName="cy" dur=".9s" repeatCount="indefinite" keyTimes="${kt(0, a, a + 0.15, a + 0.3, 1)}" values="${n(cy)};${n(cy)};${n(cy - 4)};${n(cy)};${n(cy)}"/></circle>`;
      })
      .join('');
    const item = m.item0;
    return `<g opacity="0">${visivelEntre(T0 + 0.015, k, P)}<rect x="${n(ox + v.x + v.w - 58)}" y="${n(oy + v.y)}" width="58" height="32" rx="12" fill="${t.campo}"/>${pontos}</g>
${aparece(f.recorte('resposta', ox + v.x, oy + v.y), k, T1, P, { sobe: 6 })}
${aparece(f.recorte('respondida', ox + item.x + item.w - m.respondida.w - 6, oy + item.y + 4), k + 0.02, T1, P, { sobe: 3 })}`;
  },
};

const telaEquipe = {
  menu: 'equipe',
  reserva: 40,
  html: (t, w, h) => `<div style="padding:20px 24px">
${cabecalhoTela(t, 'Equipe', 'Chat, chamadas de voz e vídeo e pendências')}
<div style="display:flex;gap:16px;margin-top:14px">
<div style="width:230px">
<div style="width:200px;border-radius:12px 12px 12px 4px;background:${t.campo};padding:9px 11px;font-size:12.5px">Subi os preços da campanha.</div>
<div data-m="msg2" style="margin:8px 0 0 auto;width:150px;border-radius:12px 12px 4px 12px;background:${t.tealFundo};padding:9px 11px;font-size:12.5px">Perfeito, já confiro.</div>
<div data-m="vReacao" style="margin:4px 0 0 auto;width:50px;height:22px"></div>
<div class="rot" style="margin-top:14px">${icone('check', 12, t.suave, 2.4)}pendências da equipe</div>
${barras([90, 70], { topo: 8, alt: 6, gap: 7 })}
</div>
<div data-m="chamada" style="flex:1;border-radius:12px;background:${t.campo};padding:10px">
<div class="rot">${icone('camera', 12, t.suave, 2.2)}chamada de vídeo</div>
<div style="display:flex;gap:8px;margin-top:9px">${[0, 1].map((i) => `<div data-m="tile${i}" style="flex:1;height:112px;border-radius:9px;background:${t.cartao};display:grid;place-items:center"><span data-m="av${i}" style="width:40px;height:40px;border-radius:50%;background:${i ? t.navy2 : t.teal};opacity:.55"></span></div>`).join('')}</div>
<div style="display:flex;justify-content:center;gap:10px;margin-top:10px">${[['microfone', t.cartao, t.apoio], ['camera', t.cartao, t.apoio], ['telefone', t.alerta, '#FFFFFF']].map(([ic, fundo, cor]) => `<span style="width:30px;height:30px;border-radius:50%;background:${fundo};display:grid;place-items:center">${icone(ic, 14, cor, 2)}</span>`).join('')}</div>
</div></div></div>
<div class="abs" data-m="reacao" style="left:24px;top:${h + 8}px;height:22px;border-radius:11px;background:${t.cartao};box-shadow:${t.sombraP};display:flex;align-items:center;gap:4px;padding:0 8px;font-size:11px;color:${t.apoio}">${icone('check', 11, t.tealEsc, 2.6)}<span class="nu">2</span></div>`,
  animar(f, { t, P, T0, T1, ox, oy }) {
    const m = f.medidas;
    const a0 = m.av0;
    const cx = ox + a0.x + a0.w / 2;
    const cy = oy + a0.y + a0.h / 2;
    const liga = T0 + 0.03;
    const ondas = [0, 1, 2, 3]
      .map((i) => {
        const x = cx - 13 + i * 8;
        const y0 = cy + 30;
        return `<rect x="${n(x)}" y="${n(y0 - 6)}" width="4" height="12" rx="2" fill="${t.teal}"><animate attributeName="height" dur="${0.5 + i * 0.13}s" repeatCount="indefinite" values="4;14;6;12;4"/><animate attributeName="y" dur="${0.5 + i * 0.13}s" repeatCount="indefinite" values="${n(y0 - 2)};${n(y0 - 7)};${n(y0 - 3)};${n(y0 - 6)};${n(y0 - 2)}"/></rect>`;
      })
      .join('');
    const r = m.vReacao;
    return `${pulso(cx, cy, 20, 34, T0 + 0.004, 0.02, P, t.teal)}${pulso(cx, cy, 20, 34, T0 + 0.016, 0.02, P, t.teal)}
<g opacity="0">${visivelEntre(liga, T1 + 0.01, P)}${ondas}${contorno({ x: ox + m.tile0.x, y: oy + m.tile0.y, w: m.tile0.w, h: m.tile0.h }, t, liga, T1 + 0.01, P, { rx: 9 })}</g>
${aparece(f.recorte('reacao', ox + r.x + r.w - m.reacao.w, oy + r.y), T0 + 0.06, T1, P, { sobe: 4 })}`;
  },
};

const telaSeguranca = {
  menu: 'seguranca',
  reserva: 40,
  html: (t, w, h) => `<div style="padding:20px 24px">
${cabecalhoTela(t, 'Segurança', 'Código de acesso por e-mail ou WhatsApp')}
<div style="margin:18px auto 0;width:356px;border-radius:12px;border:1px solid ${t.linha};padding:16px 18px">
<div class="ti" style="font-size:15px">Digite o código</div>
<div style="font-size:12px;color:${t.suave};margin-top:3px">enviado para o seu WhatsApp</div>
<div style="display:flex;gap:8px;margin-top:14px">${[0, 1, 2, 3, 4, 5].map((i) => `<span data-m="b${i}" style="width:40px;height:44px;border-radius:8px;border:1.5px solid ${t.linha}"></span>`).join('')}</div>
<div style="display:flex;align-items:center;gap:8px;margin-top:14px;font-size:12px;color:${t.apoio};white-space:nowrap"><span style="width:28px;height:16px;border-radius:8px;background:${t.campo};flex:none"></span>lembrar este navegador<span data-m="vOk" style="margin-left:auto;width:112px;height:22px;flex:none"></span></div>
</div></div>
<div class="abs" style="left:24px;top:${h + 8}px">${chip(t, 'acesso liberado', { id: 'ok' })}</div>`,
  animar(f, { t, P, T0, T1, ox, oy }) {
    const m = f.medidas;
    let s = '';
    for (let i = 0; i < 6; i++) {
      const b = m[`b${i}`];
      const k = T0 + 0.006 + i * 0.008;
      s += `<g opacity="0">${visivelEntre(k, T1 + 0.01, P)}<circle cx="${n(ox + b.x + b.w / 2)}" cy="${n(oy + b.y + b.h / 2)}" r="5.5" fill="${t.navy}"/></g>`;
      s += contorno({ x: ox + b.x, y: oy + b.y, w: b.w, h: b.h }, t, k - 0.008, k, P, { rx: 8 });
    }
    const fim = T0 + 0.06;
    const ok = m.vOk;
    return `${s}${aparece(f.recorte('ok', ox + ok.x + ok.w - m.ok.w, oy + ok.y), fim, T1, P, { sobe: 4 })}`;
  },
};

const TELAS_NOVIDADES = [telaVendas, telaPromocoes, telaSac, telaEquipe, telaSeguranca];

const painelNovidades = (t, R, titulo) =>
  painelAnimado(t, R, { W: 770, H: 440, px: 22, py: 14, menu: MENU_NOVIDADES, telas: TELAS_NOVIDADES, P: 20, titulo });

// ---------- montagem ----------

async function montarCena(t, R, nomeCena, titulo) {
  const c = CENAS[nomeCena](t);
  const f = await folha(R, t, 'f', W, c.H, c.html, c.reserva ?? 0);
  return svg({ w: W, h: c.H, titulo, defs: f.def, corpo: f.base() + c.animar(f) });
}

export const cenasDisponiveis = [...Object.keys(CENAS), 'painel', 'painel-novidades'];

// Gera "caso-<slug>" (e "caso-<slug>-2", ...) para cada case que tiver "cenas" no portfolio.config.mjs
export async function artesDoPortfolio(dados, t, R, { destaque }) {
  const a = {};
  for (const p of dados.projetos) {
    for (const [i, nomeCena] of (p.cenas ?? []).entries()) {
      const chave = `caso-${p.slug}${i ? `-${i + 1}` : ''}`;
      const titulo = `${p.titulo}: animação ilustrativa`;
      if (nomeCena === 'painel') a[chave] = await destaque({ titulo: p.titulo, descricao: p.desafio }, t, R, { soPainel: true });
      else if (nomeCena === 'painel-novidades') a[chave] = await painelNovidades(t, R, titulo);
      else if (CENAS[nomeCena]) a[chave] = await montarCena(t, R, nomeCena, titulo);
      else throw new Error(`A cena "${nomeCena}" do case "${p.slug}" não existe. Opções: ${cenasDisponiveis.join(', ')}.`);
    }
  }
  return a;
}

export { esc };
