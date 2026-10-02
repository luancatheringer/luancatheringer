<!-- Gerado por gerar.mjs a partir de portfolio.config.mjs. Edite o config, não este arquivo. -->

<p><picture><source media="(prefers-color-scheme: dark)" srcset="assets/banner-escuro.svg"><img alt="Luan Catheringer: Automatizo o operacional que trava a venda: ERP, CRM e WhatsApp integrados." src="assets/banner-claro.svg" width="100%"></picture></p>

# Portfólio

Sistemas, integrações, atendimento no WhatsApp e relatórios que construí. Nomes e dados internos ficaram de fora, e os sistemas de terceiros aparecem pelo tipo (ERP, CRM de vendas, plataforma de WhatsApp).

- [Sistemas](#sistemas) (1)
- [Integrações](#integracoes) (3)
- [WhatsApp e atendimento](#whatsapp-e-atendimento) (6)
- [Relatórios e painéis](#relatorios-e-paineis) (6)
- [Rotinas e controles](#rotinas-e-controles) (3)
- [Documentos](#documentos) (1)
- [Outros trabalhos](#outros-trabalhos) (8)

<a id="sistemas"></a>

## Sistemas

<a id="plataforma-para-marketplace"></a>

### Plataforma para marketplace

<sub>Next.js · React · TypeScript · Cloudflare Workers · Supabase · WebRTC · Claude API · Python</sub>

<p><picture><source media="(prefers-color-scheme: dark)" srcset="assets/caso-plataforma-para-marketplace-escuro.svg"><img alt="Plataforma para marketplace: animação ilustrativa" src="assets/caso-plataforma-para-marketplace-claro.svg" width="100%"></picture></p>

**Desafio.** A operação nos marketplaces precisava de uma visão única de vendas, estoque, publicidade, preço e atendimento, e de um acompanhamento contínuo da política de preço combinada com os revendedores.

**O que fiz.** Construí uma plataforma web ligada à API oficial do marketplace, que reúne num lugar só o que antes ficava espalhado. Ela vai da venda ao vivo até a proteção da marca e segue ganhando módulos novos:

- Vendas ao vivo e por período, com a apresentação do período gerada em um clique.
- Estoque no fulfillment com cálculo de reposição e resultado da publicidade.
- Política de preço: piso combinado, quem furou primeiro e um dossiê por revendedor.
- Proteção de marca: posição nos catálogos, anúncios suspeitos e evidência salva com data e hora.
- Promoções: o que está em promoção, o que acaba hoje e o que está programado, com aviso no resumo do dia.
- SAC: perguntas e pós-venda organizados por cliente e por anúncio, com indicadores de atendimento.
- Equipe: chat com reações, chamadas de voz e vídeo com tela compartilhada e lista de pendências.
- Segurança: acesso por convite, papéis de permissão, código de verificação por e-mail ou WhatsApp e registro de atividades.
- Tutorial no primeiro acesso e um mapa do que já está pronto e do que vem a seguir.

**Resultado.** Em uso pela equipe. Vendas, estoque e publicidade foram conferidos contra os painéis oficiais do marketplace, e na publicidade o total bateu ao centavo. A plataforma também explicou com dados uma divergência de números levantada pela diretoria.

<p><picture><source media="(prefers-color-scheme: dark)" srcset="assets/caso-plataforma-para-marketplace-2-escuro.svg"><img alt="Plataforma para marketplace: animação ilustrativa 2" src="assets/caso-plataforma-para-marketplace-2-claro.svg" width="100%"></picture></p>

<a id="integracoes"></a>

## Integrações

<a id="pedido-b2b-no-erp-certo"></a>

### Pedido B2B no ERP certo

<sub>Automação sem código · API do CRM de vendas · API do ERP</sub>

<p><picture><source media="(prefers-color-scheme: dark)" srcset="assets/caso-pedido-b2b-no-erp-certo-escuro.svg"><img alt="Pedido B2B no ERP certo: animação ilustrativa" src="assets/caso-pedido-b2b-no-erp-certo-claro.svg" width="100%"></picture></p>

**Desafio.** A empresa passou a faturar parte dos pedidos B2B por outro CNPJ, e o CRM de vendas não direcionava o pedido para a conta certa do ERP.

**O que fiz.** Criei um campo no pedido para o vendedor escolher a empresa que vai faturar. Um fluxo de automação busca o pedido completo, cria cliente e pedido na conta certa do ERP, traduz a condição de pagamento em parcelas que fecham com o total, converte os códigos de produto entre as contas e impede pedido duplicado.

**Resultado.** Homologação aprovada pelo fornecedor do CRM. Um pedido real reprocessado saiu idêntico ao da integração nativa, e a comparação ainda revelou um erro de parcelas na integração antiga, que foi levado ao financeiro.

<a id="lead-direto-no-whatsapp"></a>

### Lead direto no WhatsApp

<sub>Automação sem código · Landing page · Plataforma de WhatsApp</sub>

<p><picture><source media="(prefers-color-scheme: dark)" srcset="assets/caso-lead-direto-no-whatsapp-escuro.svg"><img alt="Lead direto no WhatsApp: animação ilustrativa" src="assets/caso-lead-direto-no-whatsapp-claro.svg" width="100%"></picture></p>

**Desafio.** Cada lead da landing page de revenda precisava chegar rápido ao vendedor da região, já com contato criado, card no funil e primeira mensagem enviada.

**O que fiz.** Um fluxo de automação recebe cada conversão, confere se o lead está completo e se já existe, direciona para o vendedor e a equipe da região, cria ou atualiza o contato com etiquetas, abre o card no funil e envia o modelo de mensagem no WhatsApp. Uma variação do mesmo desenho leva os leads de uma nova linha direto ao gerente comercial, com funil próprio.

**Resultado.** Roda com erro raro. A primeira mensagem automática teve boa taxa de resposta, e a estrutura virou base para outras landing pages e para a troca da ferramenta de marketing.

<a id="captura-de-leads-na-troca-de-plataforma"></a>

### Captura de leads na troca de plataforma

<sub>Automação sem código · XML · Plataforma de WhatsApp</sub>

<p><picture><source media="(prefers-color-scheme: dark)" srcset="assets/caso-captura-de-leads-na-troca-de-plataforma-escuro.svg"><img alt="Captura de leads na troca de plataforma: animação ilustrativa" src="assets/caso-captura-de-leads-na-troca-de-plataforma-claro.svg" width="100%"></picture></p>

**Desafio.** A empresa trocou a ferramenta de automação de marketing, e a nova não tinha integração pronta com a plataforma de automação nem entregava a origem do tráfego do mesmo jeito que a anterior.

**O que fiz.** Mapeei a API da nova ferramenta e confirmei com o fornecedor um webhook de saída por lista. O fluxo lê o conteúdo em XML, padroniza o telefone, evita duplicidade e reconstrói a origem do lead pelas UTMs e pela página de referência, reaproveitando o direcionamento por região.

**Resultado.** Dois testes de ponta a ponta aprovados, com contato completo, card na etapa certa e direcionamento correto.

<a id="whatsapp-e-atendimento"></a>

## WhatsApp e atendimento

<a id="aviso-de-pedido-enviado"></a>

### Aviso de pedido enviado no WhatsApp

<sub>Automação sem código · Webhook do ERP · Plataforma de WhatsApp</sub>

<p><picture><source media="(prefers-color-scheme: dark)" srcset="assets/caso-aviso-de-pedido-enviado-escuro.svg"><img alt="Aviso de pedido enviado no WhatsApp: animação ilustrativa" src="assets/caso-aviso-de-pedido-enviado-claro.svg" width="100%"></picture></p>

**Desafio.** Os clientes lojistas precisavam receber um aviso automático quando o pedido saísse para entrega, já com o rastreio.

**O que fiz.** Um fluxo de automação, acionado pela conclusão da expedição no ERP, busca o pedido e a nota fiscal, identifica a transportadora e escolhe um de oito modelos de mensagem aprovados pela Meta, com botão de rastreio quando a transportadora permite. Cada envio tem tratamento de erro próprio, para uma falha isolada não parar o resto.

**Resultado.** Os oito caminhos foram testados com pedidos reais e conferidos no WhatsApp. Os testes pegaram dois ajustes antes de ir ao ar: o nome jurídico da transportadora e o número de pedido mais útil para o cliente.

<a id="triagem-do-whatsapp-comercial"></a>

### Triagem do WhatsApp comercial

<sub>Chatbot da plataforma de WhatsApp</sub>

<p><picture><source media="(prefers-color-scheme: dark)" srcset="assets/caso-triagem-do-whatsapp-comercial-escuro.svg"><img alt="Triagem do WhatsApp comercial: animação ilustrativa" src="assets/caso-triagem-do-whatsapp-comercial-claro.svg" width="100%"></picture></p>

**Desafio.** O número do comercial recebe clientes, leads novos, rotas especiais e contatos que voltam, e cada um precisava cair no lugar certo.

**O que fiz.** Organizei o chatbot numa ordem fixa de verificação: horário, rotas especiais, retorno de contato conhecido, direcionamento por região e menu só para contato novo. Levei as mensagens de horário para dentro do chatbot e documentei as etiquetas em uso e as armadilhas do construtor.

**Resultado.** Versão publicada com testes aprovados no número real.

<a id="entrada-de-campanha-no-whatsapp"></a>

### Entrada de campanha com card automático

<sub>Chatbot da plataforma de WhatsApp · Anúncio de clique para WhatsApp</sub>

<p><picture><source media="(prefers-color-scheme: dark)" srcset="assets/caso-entrada-de-campanha-no-whatsapp-escuro.svg"><img alt="Entrada de campanha com card automático: animação ilustrativa" src="assets/caso-entrada-de-campanha-no-whatsapp-claro.svg" width="100%"></picture></p>

**Desafio.** Os leads de um anúncio sazonal precisavam chegar direto ao gerente comercial, já identificados como vindos da campanha.

**O que fiz.** No topo do chatbot principal, a frase pré-preenchida do anúncio desvia o contato para um fluxo próprio, que aplica a etiqueta da campanha, cria o card no funil com o gerente como responsável, pergunta o nome da loja e transfere. Quem volta já identificado vai direto, sem card repetido.

**Resultado.** Testes de entrada, retorno, criação de card e transferência aprovados no número real.

<a id="prospeccao-ativa-vira-card"></a>

### Prospecção ativa vira card no funil

<sub>Automação sem código · API da plataforma de WhatsApp</sub>

<p><picture><source media="(prefers-color-scheme: dark)" srcset="assets/caso-prospeccao-ativa-vira-card-escuro.svg"><img alt="Prospecção ativa vira card no funil: animação ilustrativa" src="assets/caso-prospeccao-ativa-vira-card-claro.svg" width="100%"></picture></p>

**Desafio.** Cada oportunidade aberta pelo vendedor na prospecção ativa precisava entrar no funil de vendas automaticamente.

**O que fiz.** O vendedor só aplica uma etiqueta na conversa. Um fluxo de automação identifica o contato e o vendedor, confere se a oportunidade já está no funil e cria o card na etapa inicial, sem duplicar. Preparei uma apresentação curta para o time com a nova rotina.

**Resultado.** Roda sem erros nas execuções registradas.

<a id="follow-up-de-campanha"></a>

### Follow-up de campanha no WhatsApp

<sub>Automação sem código · API da plataforma de WhatsApp · Python</sub>

<p><picture><source media="(prefers-color-scheme: dark)" srcset="assets/caso-follow-up-de-campanha-escuro.svg"><img alt="Follow-up de campanha no WhatsApp: animação ilustrativa" src="assets/caso-follow-up-de-campanha-claro.svg" width="100%"></picture></p>

**Desafio.** Uma campanha para lojistas que ainda não tinham comprado precisava de novos contatos só para quem não respondeu.

**O que fiz.** Consolidei os resultados num relatório e extraí quem não respondeu. Montei um fluxo de automação que tira o contato da sequência assim que ele responde, e reconstruí pela API quem de fato respondeu quando a sequência da plataforma falhou.

**Resultado.** A saída automática de quem respondeu funcionou no teste de ponta a ponta, e as conferências evitaram reenviar mensagem a quem já tinha respondido. A campanha passou a usar disparos segmentados.

<a id="pre-atendimento-com-consulta-de-pedido"></a>

### Pré-atendimento com consulta de pedido

<sub>Chatbot da plataforma de WhatsApp · Automação sem código · API do ERP</sub>

<p><picture><source media="(prefers-color-scheme: dark)" srcset="assets/caso-pre-atendimento-com-consulta-de-pedido-escuro.svg"><img alt="Pré-atendimento com consulta de pedido: animação ilustrativa" src="assets/caso-pre-atendimento-com-consulta-de-pedido-claro.svg" width="100%"></picture></p>

**Desafio.** O atendimento queria responder consultas simples de pedido no próprio WhatsApp, sem esperar um atendente.

**O que fiz.** Montei no chatbot os fluxos de rastrear pedido e ajuda com o pedido. O cliente informa o número do pedido ou o CPF, um fluxo de automação consulta o ERP e devolve status, previsão e rastreio. Erro ou pedido não encontrado levam a uma nova tentativa ou ao atendente, sem mensagem duplicada.

**Resultado.** Os dois fluxos foram testados no WhatsApp.

<a id="relatorios-e-paineis"></a>

## Relatórios e painéis

<a id="relatorio-comercial-semanal"></a>

### Relatório comercial semanal

<sub>API do CRM de vendas · API da plataforma de WhatsApp · Node.js · Python</sub>

<p><picture><source media="(prefers-color-scheme: dark)" srcset="assets/caso-relatorio-comercial-semanal-escuro.svg"><img alt="Relatório comercial semanal: animação ilustrativa" src="assets/caso-relatorio-comercial-semanal-claro.svg" width="100%"></picture></p>

**Desafio.** O gestor comercial precisava apresentar toda semana vendas, positivação e funil de atendimento, com dados que ficam em dois sistemas diferentes.

**O que fiz.** Montei a rotina que busca as vendas no CRM e o funil e as conversas na plataforma de WhatsApp, aplica regras fixas de contagem e gera um deck de layout fixo, conferido slide a slide.

**Resultado.** Layout aprovado pela diretoria e usado nas apresentações semanais. A rotina corrigiu a regra que fazia o relatório antigo mostrar zero ganhos.

<a id="relatorio-de-chargebacks"></a>

### Relatório de chargebacks e padrões de fraude

<sub>API do ERP · Node.js · Python</sub>

<p><picture><source media="(prefers-color-scheme: dark)" srcset="assets/caso-relatorio-de-chargebacks-escuro.svg"><img alt="Relatório de chargebacks e padrões de fraude: animação ilustrativa" src="assets/caso-relatorio-de-chargebacks-claro.svg" width="100%"></picture></p>

**Desafio.** A diretoria queria entender as perdas com chargeback e identificar compras contestadas de má-fé, mas a plataforma de pagamento não exporta os dados do cliente.

**O que fiz.** Levantei o histórico de um ano e cruzei cada caso com o ERP para confirmar pedido e entrega. A cada rodada gero uma apresentação e uma planilha só com o que é novo, e mantenho uma base mestre que detecta reincidência entre as rodadas. Essa base também alimenta a lista de clientes que o alerta de compra suspeita vigia.

**Resultado.** Identificou três padrões de má-fé, entre eles uma rede com endereço-modelo, e a recomendação passou de bloquear CPF por CPF para bloquear pelo padrão. O relatório virou pauta semanal da diretoria.

<a id="leitura-do-atendimento-comercial"></a>

### Leitura do atendimento comercial

<sub>API da plataforma de WhatsApp · Node.js · Claude</sub>

<p><picture><source media="(prefers-color-scheme: dark)" srcset="assets/caso-leitura-do-atendimento-comercial-escuro.svg"><img alt="Leitura do atendimento comercial: animação ilustrativa" src="assets/caso-leitura-do-atendimento-comercial-claro.svg" width="100%"></picture></p>

**Desafio.** A plataforma de atendimento contava conversas, mas não mostrava como cada vendedor atendia nem qual modelo de mensagem gerava resposta.

**O que fiz.** Extraí pela API os cards, as sessões e as mensagens do funil, medi a taxa de resposta de cada modelo de mensagem e li as conversas para apontar padrões de atendimento. Montei uma apresentação com pontos fortes e pontos de atenção por vendedor.

**Resultado.** Gerou recomendações de processo, como registrar ganho e perda no funil, e identificou o modelo de prospecção com melhor resposta.

<a id="modelo-de-metas-por-vendedor"></a>

### Modelo de metas por vendedor

<sub>API do CRM de vendas · Node.js · Python</sub>

<p><picture><source media="(prefers-color-scheme: dark)" srcset="assets/caso-modelo-de-metas-por-vendedor-escuro.svg"><img alt="Modelo de metas por vendedor: animação ilustrativa" src="assets/caso-modelo-de-metas-por-vendedor-claro.svg" width="100%"></picture></p>

**Desafio.** As metas mensais precisavam de uma base justa, que não subestimasse quem acabou de chegar nem cobrasse meta cheia em mês de baixa sazonal.

**O que fiz.** Levantei as vendas por vendedor e região pela API de relatórios do CRM, contornando a falta de filtro por vendedor. Usei o último trimestre como base, apliquei um fator sazonal nos meses de baixa e gerei o deck por script.

**Resultado.** Entregue ao gestor comercial, já com a revisão de clientes atendidos fora do território que distorciam a meta.

<a id="auditoria-de-preco-de-revendedores"></a>

### Auditoria de preço de revendedores

<sub>HTML · Planilha</sub>

<p><picture><source media="(prefers-color-scheme: dark)" srcset="assets/caso-auditoria-de-preco-de-revendedores-escuro.svg"><img alt="Auditoria de preço de revendedores: animação ilustrativa" src="assets/caso-auditoria-de-preco-de-revendedores-claro.svg" width="100%"></picture></p>

**Desafio.** A empresa queria saber, com dados, se revendedores vendiam abaixo do preço mínimo combinado no marketplace.

**O que fiz.** Levantei os anúncios de revendedores da marca, comparei com o preço da loja oficial e entreguei um relatório com filtros e links, mais a base em planilha.

**Resultado.** Os dados mostraram que a maioria dos revendedores acompanhava o preço, o que redirecionou o esforço. O levantamento também encontrou uma marca falsa copiando o produto, e o acompanhamento contínuo passou a ser feito pela plataforma para marketplace.

<a id="auditoria-do-site"></a>

### Auditoria do e-commerce

<sub>Navegador com IA · SEO · Acessibilidade</sub>

<p><picture><source media="(prefers-color-scheme: dark)" srcset="assets/caso-auditoria-do-site-escuro.svg"><img alt="Auditoria do e-commerce: animação ilustrativa" src="assets/caso-auditoria-do-site-claro.svg" width="100%"></picture></p>

**Desafio.** O site da loja precisava de uma revisão completa de páginas, links, SEO e acessibilidade.

**O que fiz.** Varri o site em duas levas e entreguei listas priorizadas: páginas vazias, links quebrados, telefone que não discava, busca sem tolerância a erro de digitação, meta tags ausentes, zoom bloqueado e sitemap faltando.

**Resultado.** A primeira leva foi tratada pela equipe.

<a id="rotinas-e-controles"></a>

## Rotinas e controles

<a id="alerta-de-compra-suspeita"></a>

### Alerta de compra suspeita para o financeiro

<sub>Webhook do ERP · Cloudflare Workers · Automação sem código · Plataforma de WhatsApp · PowerShell</sub>

<p><picture><source media="(prefers-color-scheme: dark)" srcset="assets/caso-alerta-de-compra-suspeita-escuro.svg"><img alt="Alerta de compra suspeita para o financeiro: animação ilustrativa" src="assets/caso-alerta-de-compra-suspeita-claro.svg" width="100%"></picture></p>

**Desafio.** Compras com sinais de fraude só apareciam quando o chargeback chegava, semanas depois, e a essa altura o pedido já tinha sido entregue.

**O que fiz.** O ERP avisa cada pedido novo do site assim que ele é criado. Um serviço na nuvem funciona como porteiro: confere o pedido contra os padrões de fraude já conhecidos, como endereço com ruído proposital, destino repetido de uma rede e cliente com chargeback anterior, e só quando encontra algo aciona o fluxo de automação. O financeiro recebe no WhatsApp a classificação do risco, o motivo e um botão que abre o pedido direto no ERP. Se algum sistema falhar, o porteiro guarda o aviso e tenta de novo.

**Resultado.** Um pedido de uma rede conhecida foi cancelado antes de sair para entrega a partir do alerta. Como só os pedidos suspeitos acionam o fluxo, o custo da automação fica baixo.

<a id="rastreio-contra-chargeback"></a>

### Rastreio contra chargeback

<sub>PowerShell · API do ERP</sub>

<p><picture><source media="(prefers-color-scheme: dark)" srcset="assets/caso-rastreio-contra-chargeback-escuro.svg"><img alt="Rastreio contra chargeback: animação ilustrativa" src="assets/caso-rastreio-contra-chargeback-claro.svg" width="100%"></picture></p>

**Desafio.** Para defender um chargeback, o código de rastreio precisa estar na plataforma de pagamento dentro de um prazo curto, e a integração entre a loja e essa plataforma não enviava o rastreio.

**O que fiz.** Investiguei a cadeia entre ERP, loja e plataforma de pagamento e provei com um pedido real qual elo estava quebrado. Escrevi um script que lê a exportação de pedidos sem rastreio, busca cada um no ERP em três níveis (CPF em pedidos enviados, CPF em qualquer situação e nome) e gera o arquivo pronto para importar, mais a lista de pendentes.

**Resultado.** A busca por nome recuperou mais da metade dos pedidos que a busca por CPF não encontrava.

<a id="alerta-de-ruptura-de-estoque"></a>

### Alerta de ruptura de estoque

<sub>Automação sem código · API do ERP · Claude</sub>

<p><picture><source media="(prefers-color-scheme: dark)" srcset="assets/caso-alerta-de-ruptura-de-estoque-escuro.svg"><img alt="Alerta de ruptura de estoque: animação ilustrativa" src="assets/caso-alerta-de-ruptura-de-estoque-claro.svg" width="100%"></picture></p>

**Desafio.** A diretoria queria saber com antecedência quais produtos estavam zerados ou abaixo do estoque mínimo.

**O que fiz.** Um fluxo de automação percorre o catálogo ativo do ERP com pausas para respeitar o limite da API, lê saldo e estoque mínimo de cada produto e grava os itens em risco. Rotinas com IA conferem o saldo atual e deixam um rascunho de e-mail curto para revisão.

**Resultado.** Varredura validada com dados reais.

<a id="documentos"></a>

## Documentos

<a id="checklist-de-onboarding-preenchivel"></a>

### Checklist de onboarding preenchível

<sub>Python · PDF</sub>

<p><picture><source media="(prefers-color-scheme: dark)" srcset="assets/caso-checklist-de-onboarding-preenchivel-escuro.svg"><img alt="Checklist de onboarding preenchível: animação ilustrativa" src="assets/caso-checklist-de-onboarding-preenchivel-claro.svg" width="100%"></picture></p>

**Desafio.** O RH queria marcar os itens do playbook de onboarding direto no arquivo.

**O que fiz.** Converti o documento em PDF e, por script, localizei cada caixa de marcação e cada linha de preenchimento pela posição, inserindo campos de formulário por cima sem mexer na diagramação.

**Resultado.** Aprovado pelo RH.

<a id="outros-trabalhos"></a>

## Outros trabalhos

- **Comissão de influenciadores:** prompt e gerador offline para fechar a comissão mensal a partir da planilha exportada.
- **Migração do blog sem perder busca orgânica:** inventário de URLs e plano de redirecionamento 301 em etapas.
- **Lembrete automático de boleto:** fluxo que avisa o lojista um dia antes do vencimento, com o link do boleto.
- **Agente de IA para mensagens do Instagram:** triagem entre produto, pedido, influenciador e parceria, com consulta de pedido.
- **Baixa de entrega automática no ERP:** estudo de webhook da transportadora e consulta periódica de rastreio.
- **CRM de prospecção regional:** escopo, arquitetura e protótipos de um CRM com mapa de lojistas, funil e assistente de IA.
- **Panorama de cliente com várias lojas:** relatório loja a loja com mix de produtos e sugestões do que ainda não é comprado.
- **Escopo das automações do comercial:** documento que ordenou as ideias de automação e definiu uma prioridade única.

---

<sub>Automatizar é fácil. Não quebrar é o difícil. · [voltar ao perfil](https://github.com/luancatheringer)</sub>
