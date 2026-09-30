// Navegador sem janela (Chrome ou Edge) controlado pelo DevTools Protocol, sem dependências.
// Serve para renderizar as partes fixas das artes com as fontes da marca (Montserrat, Nunito Sans, Oxanium),
// que o GitHub não carrega sozinho: a página é desenhada aqui e vira imagem dentro do SVG.

import { spawn } from 'node:child_process';
import { existsSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const CANDIDATOS = [
  process.env.CHROME,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  '/usr/bin/google-chrome',
  '/usr/bin/google-chrome-stable',
  '/usr/bin/chromium-browser',
  '/usr/bin/chromium',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].filter(Boolean);

export function acharNavegador() {
  const achado = CANDIDATOS.find((c) => existsSync(c));
  if (!achado) throw new Error('Não achei Chrome nem Edge. Instale um deles ou aponte a variável CHROME para o executável.');
  return achado;
}

export async function abrirNavegador({ porta = 9351 } = {}) {
  const perfil = mkdtempSync(join(tmpdir(), 'perfil-github-'));
  const proc = spawn(
    acharNavegador(),
    [
      '--headless=new',
      `--remote-debugging-port=${porta}`,
      `--user-data-dir=${perfil}`,
      '--no-first-run',
      '--no-default-browser-check',
      '--hide-scrollbars',
      '--force-device-scale-factor=1',
      ...(process.platform === 'linux' ? ['--no-sandbox'] : []),
      'about:blank',
    ],
    { stdio: 'ignore' },
  );

  let alvos = [];
  for (let i = 0; i < 120; i++) {
    try {
      alvos = await (await fetch(`http://127.0.0.1:${porta}/json/list`)).json();
      if (alvos.some((a) => a.type === 'page')) break;
    } catch {}
    await new Promise((r) => setTimeout(r, 150));
  }
  const pagina = alvos.find((a) => a.type === 'page');
  if (!pagina) {
    proc.kill();
    throw new Error('O navegador não respondeu.');
  }
  const ws = new WebSocket(pagina.webSocketDebuggerUrl);
  await new Promise((ok, erro) => {
    ws.onopen = ok;
    ws.onerror = erro;
  });

  let id = 0;
  const pendentes = new Map();
  ws.onmessage = (ev) => {
    const msg = JSON.parse(ev.data);
    if (msg.id && pendentes.has(msg.id)) {
      const { ok, erro } = pendentes.get(msg.id);
      pendentes.delete(msg.id);
      msg.error ? erro(new Error(msg.error.message)) : ok(msg.result);
    }
  };
  const enviar = (method, params = {}) =>
    new Promise((ok, erro) => {
      const n = ++id;
      pendentes.set(n, { ok, erro });
      ws.send(JSON.stringify({ id: n, method, params }));
    });
  const avaliar = async (expressao) => {
    const r = await enviar('Runtime.evaluate', { expression: expressao, awaitPromise: true, returnByValue: true });
    if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text);
    return r.result.value;
  };

  await enviar('Page.enable');
  await enviar('Runtime.enable');
  const { frameTree } = await enviar('Page.getFrameTree');
  const memoria = new Map();

  // Desenha um HTML do tamanho pedido e devolve a imagem (fundo transparente) e as medidas
  // de todo elemento marcado com data-m, para as animações serem encaixadas por cima.
  async function renderizar(html, largura, altura, { escala = 1.5, fontes = [] } = {}) {
    const chave = `${largura}x${altura}@${escala}\n${html}`;
    if (memoria.has(chave)) return memoria.get(chave);
    await enviar('Emulation.setDeviceMetricsOverride', { width: largura, height: altura, deviceScaleFactor: escala, mobile: false });
    await enviar('Emulation.setDefaultBackgroundColorOverride', { color: { r: 0, g: 0, b: 0, a: 0 } });
    await enviar('Page.setDocumentContent', { frameId: frameTree.frame.id, html });
    const carregadas = await avaliar(`(async () => {
      // As fontes chegam pelas folhas de estilo: sem esperar por elas, o texto sairia invisível na foto.
      await Promise.all([...document.querySelectorAll('link[rel="stylesheet"]')].map((l) => l.sheet ? null : new Promise((r) => {
        l.addEventListener('load', r, { once: true });
        l.addEventListener('error', r, { once: true });
        setTimeout(r, 15000);
      })));
      const pedidas = ${JSON.stringify(fontes)};
      const texto = 'AaÁáÃãÇçÉéÊêÍíÓóÕõÚú0123456789';
      const prontas = [];
      for (const f of pedidas) {
        let faces = [];
        for (let i = 0; i < 3 && !faces.length; i++) faces = await document.fonts.load(f, texto).catch(() => []);
        if (faces.length) prontas.push(f);
      }
      await document.fonts.ready;
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      return prontas;
    })()`);
    const medidas = await avaliar(`Object.fromEntries([...document.querySelectorAll('[data-m]')].map((e) => {
      const r = e.getBoundingClientRect();
      return [e.dataset.m, { x: r.x, y: r.y, w: r.width, h: r.height }];
    }))`);
    const foto = await enviar('Page.captureScreenshot', {
      format: 'webp',
      quality: 94,
      clip: { x: 0, y: 0, width: largura, height: altura, scale: 1 },
    });
    const resultado = {
      uri: `data:image/webp;base64,${foto.data}`,
      medidas,
      fontesFaltando: fontes.filter((f) => !carregadas.includes(f)),
    };
    memoria.set(chave, resultado);
    return resultado;
  }

  async function fechar() {
    try {
      ws.close();
    } catch {}
    proc.kill();
    await new Promise((r) => setTimeout(r, 400));
    try {
      rmSync(perfil, { recursive: true, force: true });
    } catch {}
  }

  return { renderizar, fechar };
}
