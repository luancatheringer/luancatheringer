// Tudo o que aparece no perfil sai deste arquivo (e o currículo sai do curriculo.config.mjs).
// Edite, salve e rode:  node gerar.mjs
// As artes são desenhadas num Chrome ou Edge sem janela, com a fonte JetBrains Mono vinda do Google Fonts:
// precisa de internet na hora de gerar. No GitHub, a Action refaz tudo sozinha a cada alteração.

export default {
  // Visual do perfil: 'terminal' (ficha no terminal, números e o que a plataforma faz)
  estilo: 'terminal',

  usuario: 'luancatheringer',
  nome: 'Luan Catheringer',
  // Logo original em camadas: a logo em ASCII do topo é tirada destas imagens
  logoCamadas: { navy: 'imagens/logo-navy.png', teal: 'imagens/logo-teal.png', palavra: 'imagens/logo-palavra.png' },

  // Frase de apresentação (a mesma do Instagram)
  bio: 'Automatizo o operacional que trava a venda: ERP, CRM e WhatsApp integrados.',

  // Ficha do topo (como no neofetch): chave, valor e, se quiser, a cor do valor ('ok' verde, 'numero' amarelo).
  // {nome}, {emUso} e {lema} são trocados pelo nome, pelo número de "Em uso hoje" e pela frase final.
  ficha: [
    ['nome', '{nome}'],
    ['cargo', 'gestor de automação'],
    ['faz', 'automação, integrações por API e sistemas sob medida'],
    ['conecta', 'ERP, CRM, WhatsApp, marketplaces e loja virtual'],
    ['usa', 'IA (vibe coding com o Claude), APIs e automação sem código'],
    ['em uso', '{emUso} sistemas e automações rodando no dia a dia'],
    ['status', 'aberto a novos projetos', 'ok'],
    ['lema', '{lema}'],
  ],

  // Números (luan --stats). Só números do próprio trabalho, conferidos.
  //   doCurriculo: 'entregues' → itens do currículo que não estão "em andamento"
  //   doCurriculo: 'emUso'     → itens do currículo marcados como em uso
  //   daAtividade: true        → soma da "atividade" abaixo
  // Os sistemas conectados são contados à mão (13 em 13/11/2026): ERP, CRM de vendas, plataforma de WhatsApp,
  // duas ferramentas de e-mail marketing, três marketplaces, plataforma da loja, plataforma de pagamento,
  // blog, Google (busca e audiência) e o ERP da fábrica. Ferramentas de construção (IA, nuvem, banco) não entram.
  resumo: {
    titulo: 'Em números.',
    linhas: [
      { rotulo: 'Projetos entregues', valor: 0, doCurriculo: 'entregues' },
      { rotulo: 'Sistemas conectados', valor: 13 },
      { rotulo: 'Atualizações na plataforma', valor: 0, daAtividade: true },
    ],
    grande: { rotulo: 'Em uso hoje', valor: 0, doCurriculo: 'emUso', sub: 'sistemas, automações, alertas e rotinas rodando no dia a dia.', carimbo: 'NO AR' },
  },

  // Atualizações por dia na plataforma: commits do branch publicado, por data de autor no horário de Brasília
  // (contado em 13/11/2026 às 22h). Vira o gráfico do luan --stats; a legenda é montada a partir destes dados.
  atividade: {
    titulo: 'atualizações por dia na plataforma',
    inicio: '2026-08-26',
    fim: '2026-11-13',
    dias: [
      ['2026-08-26', 21], ['2026-08-27', 25], ['2026-08-28', 5], ['2026-08-31', 20], ['2026-09-01', 10], ['2026-09-02', 5],
      ['2026-09-03', 16], ['2026-09-04', 3], ['2026-09-08', 7], ['2026-09-09', 5], ['2026-09-11', 8], ['2026-09-14', 21],
      ['2026-09-15', 20], ['2026-09-17', 5], ['2026-09-18', 6], ['2026-09-21', 10], ['2026-09-22', 14], ['2026-09-23', 10],
      ['2026-09-24', 19], ['2026-09-25', 115], ['2026-09-28', 108], ['2026-09-29', 49], ['2026-09-30', 29], ['2026-10-01', 6],
      ['2026-10-02', 9], ['2026-10-05', 9], ['2026-10-06', 18], ['2026-10-07', 13], ['2026-10-08', 24], ['2026-10-09', 52],
      ['2026-10-13', 25], ['2026-10-14', 19], ['2026-10-15', 10], ['2026-10-16', 7], ['2026-10-19', 18], ['2026-10-20', 65],
      ['2026-10-21', 10], ['2026-10-22', 17], ['2026-10-23', 1], ['2026-10-26', 9], ['2026-10-27', 30], ['2026-10-28', 63],
      ['2026-10-29', 11], ['2026-10-30', 57], ['2026-11-03', 34], ['2026-11-04', 37], ['2026-11-05', 57], ['2026-11-06', 35],
      ['2026-11-09', 33], ['2026-11-10', 25], ['2026-11-11', 56], ['2026-11-12', 34], ['2026-11-13', 43],
    ],
  },

  // Projeto em destaque (plataforma --sobre). O slug precisa existir no curriculo.config.mjs para o link funcionar.
  projetos: [
    {
      slug: 'plataforma-de-gestao',
      destaque: true,
      titulo: 'Plataforma de gestão',
      descricao: 'Sistema web feito com IA que reúne marketplaces, financeiro, comercial e marketing num lugar só.',
      chamada: 'Começou nos marketplaces e hoje reúne financeiro, comercial e marketing, tudo em tempo real.',
      // o que tem dentro (a lista com ✓; cabem 9 linhas)
      modulos: [
        'vendas ao vivo de três marketplaces',
        'atendimento ao cliente numa caixa só',
        'vigia de preço e proteção da marca',
        'estoque de todos os depósitos numa tabela',
        'tarifas, impostos e margem por venda',
        'conciliação e baixa no ERP com um clique',
        'central que avisa quando uma automação falha',
        'chat e chamadas de vídeo da equipe',
        'acesso por setor com verificação em duas etapas',
      ],
      // linha de comentário embaixo do dia a dia
      rodape: 'feita com IA, usada por quatro setores todo dia',
      // o dia a dia que rola ao lado (tipo: 'ok' verde, 'alerta' amarelo, 'equipe' verde-água). Ilustrativo, sem dado real.
      diaADia: [
        ['ok', 'pergunta de cliente respondida'],
        ['alerta', 'preço abaixo da régua: equipe avisada'],
        ['ok', 'venda conferida com o que caiu na conta'],
        ['alerta', 'estoque para 3 dias: alerta no sino'],
        ['equipe', 'live no ar acompanhada a cada 2 minutos'],
        ['alerta', 'automação com falha: causa explicada'],
        ['ok', 'baixa lançada no ERP com conferência'],
        ['equipe', 'apresentação de vendas pronta para baixar'],
        ['ok', 'amostra de criador aprovada'],
        ['equipe', 'chamada de vídeo da equipe'],
      ],
    },
  ],

  // Contato (url vazia = não aparece)
  links: [
    { rede: 'Instagram', texto: '@lcautomacoes.ai', url: 'https://instagram.com/lcautomacoes.ai' },
    { rede: 'LinkedIn', texto: 'Luan Catheringer', url: '' },
  ],

  fraseFinal: 'Automatizar é fácil. Não quebrar é o difícil.',

  // Opcional: trocar cores do estilo (o Terminal usa uma paleta só, escura)
  cores: {},
};
