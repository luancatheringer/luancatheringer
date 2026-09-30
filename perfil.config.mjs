// Tudo o que aparece no perfil sai deste arquivo (e o portfólio sai do portfolio.config.mjs).
// Edite, salve e rode:  node gerar.mjs
// As artes são desenhadas num Chrome ou Edge sem janela, com as fontes da marca vindas do Google Fonts:
// precisa de internet na hora de gerar. No GitHub, a Action refaz tudo sozinha a cada alteração.

export default {
  // Visual do perfil: 'lc' (a identidade dos vídeos da LC Automações)
  estilo: 'lc',

  usuario: 'luancatheringer',
  nome: 'Luan Catheringer',
  // Logo original em camadas: cada camada é pintada com as cores da marca
  logoCamadas: { navy: 'imagens/logo-navy.png', teal: 'imagens/logo-teal.png', palavra: 'imagens/logo-palavra.png' },

  // Frase de apresentação (a mesma do Instagram)
  bio: 'Automatizo o operacional que trava a venda: ERP, CRM e WhatsApp integrados.',

  // Projetos do perfil. O que tiver "destaque: true" abre o perfil, com o painel animado.
  // anim: a cena ao lado de cada um dos outros ('bifurca', 'mensagem' ou 'busca')
  // O slug precisa ser igual ao do portfolio.config.mjs para o link levar ao case certo.
  // Regras: nada que identifique a empresa; sistemas de terceiros pelo tipo (ERP, CRM de vendas...).
  projetos: [
    {
      slug: 'plataforma-para-marketplace',
      destaque: true,
      titulo: 'Plataforma para marketplace',
      descricao:
        'Acompanha preço e revendedores nos marketplaces, calcula a margem real de cada anúncio e aponta quem fura a política de preço.',
      // Frase curta e observação que aparecem ao lado do painel animado
      chamada: 'Preço, concorrência, margem e marca no mesmo painel.',
      nota: 'criado para uma empresa de cosméticos',
    },
    {
      slug: 'pedido-b2b-no-erp-certo',
      titulo: 'Pedido B2B no ERP certo',
      descricao:
        'O pedido fechado no CRM de vendas entra sozinho na conta certa do ERP, já com parcelas e marcador.',
      anim: 'bifurca',
    },
    {
      slug: 'lead-direto-no-whatsapp',
      titulo: 'Lead direto no WhatsApp',
      descricao:
        'Quem preenche a landing page vira atendimento no WhatsApp, já no funil certo e com o vendedor definido.',
      anim: 'mensagem',
    },
    {
      slug: 'rastreio-contra-chargeback',
      titulo: 'Rastreio contra chargeback',
      descricao:
        'Cruza os pagamentos com o ERP e devolve o código de rastreio de cada pedido dentro do prazo de defesa de chargeback.',
      anim: 'busca',
    },
  ],

  // Contato (url vazia = não aparece)
  links: [
    { rede: 'Instagram', texto: '@lcautomacoes.ai', url: 'https://instagram.com/lcautomacoes.ai' },
    { rede: 'LinkedIn', texto: 'Luan Catheringer', url: '' },
  ],

  fraseFinal: 'Automatizar é fácil. Não quebrar é o difícil.',

  // Opcional: trocar cores do estilo. Ex.: cores: { lc: { claro: { teal: '#0FA394' } } }
  cores: {},
};
