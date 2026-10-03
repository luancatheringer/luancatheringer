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
    ['faz', 'automação comercial, integrações e sistemas sob medida'],
    ['conecta', 'ERP, CRM, WhatsApp e marketplace'],
    ['usa', 'IA (vibe coding com o Claude), APIs e automação sem código'],
    ['em uso', '{emUso} automações rodando no dia a dia'],
    ['status', 'aberto a novos projetos', 'ok'],
    ['lema', '{lema}'],
  ],

  // Números (luan --stats). Só números do próprio trabalho, conferidos: projetos do currículo, sistemas ligados, atualizações.
  resumo: {
    titulo: 'Em números.',
    linhas: [
      { rotulo: 'Projetos entregues', valor: 20 },
      { rotulo: 'Sistemas conectados', valor: 8 },
      // daAtividade: o valor sai da soma da "atividade" abaixo
      { rotulo: 'Atualizações na plataforma', valor: 544, daAtividade: true },
    ],
    grande: { rotulo: 'Em uso hoje', valor: 10, sub: 'automações, alertas, relatórios e uma plataforma web, rodando no dia a dia.', carimbo: 'NO AR' },
  },

  // Atualizações por dia na plataforma (commits tirados do histórico em 02/10/2026): vira o gráfico do luan --stats
  atividade: {
    titulo: 'atualizações por dia na plataforma',
    inicio: '2026-08-26',
    fim: '2026-10-02',
    legenda: '26/08 a 02/10 · 544 atualizações em 25 dias',
    dias: [
      ['2026-08-26', 21], ['2026-08-27', 25], ['2026-08-28', 5], ['2026-08-31', 20], ['2026-09-01', 10], ['2026-09-02', 5],
      ['2026-09-03', 16], ['2026-09-04', 3], ['2026-09-08', 7], ['2026-09-09', 5], ['2026-09-11', 8], ['2026-09-14', 21],
      ['2026-09-15', 20], ['2026-09-17', 5], ['2026-09-18', 6], ['2026-09-21', 10], ['2026-09-22', 14], ['2026-09-23', 10],
      ['2026-09-24', 19], ['2026-09-25', 115], ['2026-09-28', 108], ['2026-09-29', 49], ['2026-09-30', 29], ['2026-10-01', 6],
      ['2026-10-02', 7],
    ],
  },

  // Projeto em destaque (plataforma --sobre). O slug precisa existir no curriculo.config.mjs para o link funcionar.
  projetos: [
    {
      slug: 'plataforma-para-marketplace',
      destaque: true,
      titulo: 'Plataforma para marketplace',
      descricao:
        'Acompanha preço e revendedores nos marketplaces, calcula a margem real de cada anúncio e aponta quem fura a política de preço.',
      chamada: 'Vendas, preço, margem, marca e atendimento no mesmo painel, com a equipe conversando e fazendo chamadas ali dentro.',
      // o que tem dentro (a lista com ✓)
      modulos: [
        'vendas ao vivo e por período',
        'apresentação de vendas em um clique',
        'régua de preço dos revendedores',
        'margem real por anúncio',
        'proteção da marca',
        'promoções',
        'SAC com perguntas e pós-venda',
        'chat e chamadas de vídeo da equipe',
        'login com verificação em duas etapas',
      ],
      // linha de comentário embaixo do dia a dia
      rodape: 'feita com IA, usada pela equipe todo dia',
      // o dia a dia que rola ao lado (tipo: 'ok' verde, 'alerta' amarelo, 'equipe' verde-água). Ilustrativo, sem dado real.
      diaADia: [
        ['ok', 'vendas do dia atualizadas ao vivo'],
        ['alerta', 'preço abaixo da régua: equipe avisada'],
        ['ok', 'pergunta de cliente respondida'],
        ['equipe', 'apresentação de vendas gerada em um clique'],
        ['ok', 'promoção conferida antes de entrar'],
        ['equipe', 'chamada de vídeo da equipe'],
        ['alerta', 'anúncio suspeito na proteção da marca'],
        ['ok', 'pós-venda respondido'],
        ['ok', 'margem por anúncio recalculada'],
        ['equipe', 'login com código de verificação'],
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
