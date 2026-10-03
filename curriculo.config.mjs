// Conteúdo do currículo (curriculo.md).
// Regras: nada que identifique a empresa (nome, pessoas, IDs, prints internos), sistemas de terceiros pelo tipo,
// a ferramenta de automação sem nome, sem travessões. Número só se for do próprio trabalho (taxa de erro,
// atualizações, quantidade de textos, links ou campos), nunca faturamento, volume de vendas ou dado de cliente.
// Tom: gestor de automação que constrói com IA (vibe coding com o Claude), não programador.
// slug: âncora do item (o perfil aponta para elas). imagem: animação que aparece depois do item.

export default {
  cargo: 'Gestor de automação · integrações por API, IA e sistemas sob medida',
  local: 'Belo Horizonte, MG',

  resumo:
    'Sou gestor de automação. Não venho da programação: construo com IA, no que hoje se chama vibe coding. Descrevo o que precisa ser feito, o Claude escreve o código comigo e eu testo, ajusto e coloco no ar. É assim que conecto ERP, CRM, WhatsApp, marketplace e e-commerce por API e webhook, monto painéis com dados ao vivo e crio rotinas de controle. Todo fluxo passa por homologação, com teste de ponta a ponta antes de ligar, e segue acompanhado depois que entra em produção.',

  experiencia: [
    {
      area: 'Sistemas',
      itens: [
        {
          slug: 'plataforma-para-marketplace',
          titulo: 'Plataforma para marketplace',
          texto:
            'Sistema web feito do zero com IA e usado no dia a dia da equipe: vendas ao vivo e por período com a apresentação gerada em um clique, política de preço com régua de revendedores, margem real por anúncio, proteção de marca, promoções, SAC com perguntas e pós-venda, avisos automáticos, chat e chamadas de vídeo da equipe e login com verificação em duas etapas. Mais de 500 atualizações em cinco semanas.',
          ferramentas: ['Claude (vibe coding)', 'Next.js', 'Supabase', 'Cloudflare', 'WebRTC', 'Claude API'],
          imagem: 'destaque',
        },
      ],
    },
    {
      area: 'Integrações por API',
      itens: [
        {
          slug: 'pedido-b2b-no-erp-certo',
          titulo: 'Pedido B2B no ERP certo',
          texto:
            'Integração entre o CRM de vendas e o ERP que fatura cada pedido pela empresa escolhida pelo vendedor, com as parcelas de todas as condições de pagamento, a tradução dos códigos de produto entre as contas, as observações do pedido e uma trava contra duplicidade. Homologada e em produção, convivendo com a integração nativa, sem erro nas primeiras execuções.',
        },
        {
          slug: 'lead-direto-no-whatsapp',
          titulo: 'Lead direto no WhatsApp',
          texto:
            'Cada lead da landing page vira contato, card no funil e primeira mensagem no WhatsApp, já com o vendedor da região. Em uso desde julho, com erro em menos de 0,2% das execuções. Uma segunda landing page ganhou fluxo e funil próprios, sem mexer no primeiro.',
        },
        {
          titulo: 'Troca da ferramenta de marketing sem perder captação',
          texto: 'Webhook em XML, telefone padronizado e origem do lead reconstruída pelas UTMs, reaproveitando o direcionamento por região. Pronto e testado de ponta a ponta.',
        },
        {
          titulo: 'Leads recuperados pelo webhook',
          texto: 'Leads que saíram da fila de processamento voltaram ao fluxo reenviados pelo webhook, a partir da exportação da ferramenta de marketing, sem perda.',
        },
        {
          titulo: 'Relatórios direto da API',
          texto: 'Dados puxados das APIs do CRM de vendas e da plataforma de WhatsApp quando a tela do sistema não entrega o recorte que a gestão precisa.',
        },
      ],
    },
    {
      area: 'WhatsApp e atendimento',
      itens: [
        { titulo: 'Triagem do WhatsApp comercial', texto: 'Chatbot com ordem fixa de verificação: horário, rotas especiais, contato que volta, região e menu só para quem é novo.' },
        { titulo: 'Entrada de campanha', texto: 'A frase do anúncio leva o contato a um fluxo próprio, que etiqueta, cria o card do gerente e transfere, sem card repetido.' },
        { titulo: 'Prospecção que vira card', texto: 'O vendedor aplica uma etiqueta e a oportunidade entra no funil sem duplicar. Zero erro nas execuções.' },
        { titulo: 'Listas de prospecção no funil', texto: 'A planilha do vendedor vira cards na etapa certa, sem duplicar, e separa quem não tem WhatsApp.' },
        { titulo: 'Campanha de primeira compra', texto: 'Disparos no WhatsApp separados por região e origem do contato, com relatório consolidado de entrega, leitura e interação.' },
        { titulo: 'Aviso de pedido enviado', texto: 'Oito modelos de mensagem aprovados pela Meta, um para cada transportadora, com botão de rastreio. Pronto e testado.' },
      ],
    },
    {
      area: 'Controles e prevenção de fraude',
      itens: [
        {
          slug: 'alerta-de-compra-suspeita',
          titulo: 'Alerta de compra suspeita',
          texto:
            'O ERP avisa cada pedido novo do site e um porteiro na nuvem confere os padrões de fraude já conhecidos; só quando encontra algo ele aciona o fluxo, e o financeiro recebe no WhatsApp a classificação do risco, o motivo e um botão que abre o pedido. Dois pedidos de uma rede conhecida foram cancelados antes do envio, o segundo pelo alerta automático, no dia em que a próxima compra era esperada.',
        },
        {
          slug: 'rastreio-contra-chargeback',
          titulo: 'Rastreio contra chargeback',
          texto:
            'Script que cruza a exportação da plataforma de pagamento com o ERP e devolve o código de rastreio dentro do prazo de defesa. Roda três vezes por semana e encontra de 95% a 97% dos pedidos.',
        },
        {
          titulo: 'Relatório de chargebacks',
          texto: 'Rodada semanal com uma base mestre que detecta reincidência e padrões de má-fé; a mesma base alimenta o alerta de compra suspeita.',
        },
      ],
    },
    {
      area: 'Relatórios e análises',
      itens: [
        { titulo: 'Relatório comercial semanal', texto: 'Vendas do CRM e funil do WhatsApp num deck de layout fixo, toda semana.' },
        { titulo: 'Leitura do atendimento comercial', texto: 'Taxa de resposta por modelo de mensagem e pontos fortes e de atenção de cada vendedor.' },
        { titulo: 'Modelo de metas por vendedor', texto: 'Base do último trimestre e fator sazonal nos meses de baixa, gerado por script.' },
        { titulo: 'Tempo de atendimento nos marketplaces', texto: 'Diagnóstico do tempo de primeira resposta e das causas de venda com problema, com plano de meta.' },
        { titulo: 'Auditoria de preço de revendedores', texto: 'Anúncios comparados ao preço da loja oficial; o levantamento também encontrou uma marca falsa copiando o produto.' },
        { titulo: 'Auditoria do e-commerce', texto: 'Revisão completa de páginas, links, SEO e acessibilidade, entregue em listas priorizadas.' },
      ],
    },
    {
      area: 'Blog, conteúdo e documentos',
      itens: [
        {
          slug: 'migracao-do-blog',
          titulo: 'Migração do blog sem perder busca orgânica',
          texto:
            'Blog antigo levado para o WordPress: inventário de 1.299 links, redirecionamentos 301 no ar na plataforma da loja, pilotos antes de cada lote e 142 textos convertidos por script, com frase-chave e meta descrição de SEO, prontos para importar em lotes.',
        },
        {
          titulo: 'Onboarding em PDF preenchível',
          texto: 'Playbook de 24 páginas com 109 caixas de marcação e 43 campos de resposta, inseridos por script sem mexer na diagramação.',
        },
      ],
    },
  ],

  outros: [
    'CRM de prospecção regional: escopo e arquitetura de um CRM com mapa de lojistas, funil e assistente de IA.',
    'Agente de IA para mensagens do Instagram: triagem entre produto, pedido, parceria e influenciador.',
    'Fechamento mensal de comissão de influenciadores com IA, a partir da planilha exportada.',
    'Pré-atendimento no WhatsApp com consulta de pedido: fluxos de rastreio e ajuda testados.',
  ],

  proprios: [
    'LC Automações (@lcautomacoes.ai): vídeos curtos animados feitos em código com IA, com narração, legenda que acende palavra a palavra e trilha própria, e carrosséis de cases para o Instagram e o LinkedIn.',
    'Este perfil: as artes animadas, o README e este currículo saem de um script feito com o Claude.',
  ],

  competencias: [
    ['Integrações por API', 'REST, webhooks, XML e JSON, OAuth; ERP, CRM, WhatsApp, marketplace, e-commerce e plataforma de pagamento'],
    ['Homologação', 'teste de ponta a ponta antes de ligar, piloto com um item antes do lote, acompanhamento depois da virada'],
    ['Automação sem código', 'fluxos de automação, chatbots e WhatsApp Business com modelos aprovados pela Meta'],
    ['IA no dia a dia', 'vibe coding com o Claude, agentes de IA por área (design, segurança, testes), análise de conversas e prompts prontos para a equipe'],
    ['Dados e relatórios', 'planilhas, relatórios e apresentações automáticas, com scripts feitos com IA'],
    ['Segurança e LGPD', 'verificação em duas etapas, revisão de segurança antes de publicar, cuidado com dado pessoal'],
  ],

  // formacao: ['...'] (opcional: aparece como a seção "Formação" no fim do currículo)
};
