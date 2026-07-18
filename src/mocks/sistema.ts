// Mocks para a Fase 8 (Sistema): Conexões, Integrações, Configurações, Suporte.

export type PortalStatus = "conectado" | "erro" | "pausado" | "pendente";

export interface Portal {
  id: string;
  nome: string;
  logo: string; // emoji fallback
  status: PortalStatus;
  imoveisPublicados: number;
  leadsMes: number;
  ultimaSync: string;
  plano: string;
}

export const portais: Portal[] = [
  {
    id: "zap",
    nome: "ZAP Imóveis",
    logo: "🏢",
    status: "conectado",
    imoveisPublicados: 284,
    leadsMes: 142,
    ultimaSync: "há 4 min",
    plano: "Destaque",
  },
  {
    id: "vivareal",
    nome: "Viva Real",
    logo: "🏠",
    status: "conectado",
    imoveisPublicados: 268,
    leadsMes: 98,
    ultimaSync: "há 6 min",
    plano: "Premium",
  },
  {
    id: "olx",
    nome: "OLX Imóveis",
    logo: "🟣",
    status: "conectado",
    imoveisPublicados: 312,
    leadsMes: 76,
    ultimaSync: "há 12 min",
    plano: "Profissional",
  },
  {
    id: "quintoandar",
    nome: "QuintoAndar",
    logo: "🔑",
    status: "erro",
    imoveisPublicados: 0,
    leadsMes: 0,
    ultimaSync: "há 2 dias",
    plano: "Locação",
  },
  {
    id: "chaves",
    nome: "Chaves na Mão",
    logo: "🗝️",
    status: "conectado",
    imoveisPublicados: 190,
    leadsMes: 34,
    ultimaSync: "há 18 min",
    plano: "Básico",
  },
  {
    id: "imovelweb",
    nome: "ImovelWeb",
    logo: "🌐",
    status: "pausado",
    imoveisPublicados: 45,
    leadsMes: 8,
    ultimaSync: "há 5 h",
    plano: "Free",
  },
  {
    id: "casamineira",
    nome: "Casa Mineira",
    logo: "⛰️",
    status: "pendente",
    imoveisPublicados: 0,
    leadsMes: 0,
    ultimaSync: "—",
    plano: "—",
  },
];

export type IntegracaoCategoria =
  | "crm"
  | "marketing"
  | "financeiro"
  | "documentos"
  | "produtividade"
  | "comunicacao";

export interface Integracao {
  id: string;
  nome: string;
  categoria: IntegracaoCategoria;
  descricao: string;
  conectado: boolean;
  logo: string;
}

export const integracoes: Integracao[] = [
  {
    id: "whatsapp",
    nome: "WhatsApp Business",
    categoria: "comunicacao",
    conectado: true,
    logo: "💬",
    descricao: "Envio de mensagens e templates aprovados.",
  },
  {
    id: "gmail",
    nome: "Gmail / Google Workspace",
    categoria: "produtividade",
    conectado: true,
    logo: "📧",
    descricao: "Sincronização de e-mails com CRM.",
  },
  {
    id: "outlook",
    nome: "Microsoft Outlook",
    categoria: "produtividade",
    conectado: false,
    logo: "📨",
    descricao: "Sync de e-mails e agenda do Outlook.",
  },
  {
    id: "gcal",
    nome: "Google Calendar",
    categoria: "produtividade",
    conectado: true,
    logo: "📅",
    descricao: "Agenda de visitas e reuniões.",
  },
  {
    id: "meta",
    nome: "Meta Ads",
    categoria: "marketing",
    conectado: true,
    logo: "📱",
    descricao: "Facebook Lead Ads e Instagram.",
  },
  {
    id: "google-ads",
    nome: "Google Ads",
    categoria: "marketing",
    conectado: false,
    logo: "🔍",
    descricao: "Campanhas de busca e display.",
  },
  {
    id: "tiktok",
    nome: "TikTok Ads",
    categoria: "marketing",
    conectado: false,
    logo: "🎵",
    descricao: "Anúncios de vídeo e Lead Gen.",
  },
  {
    id: "rdstation",
    nome: "RD Station",
    categoria: "marketing",
    conectado: false,
    logo: "🚀",
    descricao: "Automação de marketing.",
  },
  {
    id: "hubspot",
    nome: "HubSpot",
    categoria: "crm",
    conectado: false,
    logo: "🧡",
    descricao: "Sync bidirecional de contatos.",
  },
  {
    id: "pipedrive",
    nome: "Pipedrive",
    categoria: "crm",
    conectado: false,
    logo: "🟢",
    descricao: "Sync de deals e pipelines.",
  },
  {
    id: "docusign",
    nome: "DocuSign",
    categoria: "documentos",
    conectado: true,
    logo: "✍️",
    descricao: "Assinatura digital de contratos.",
  },
  {
    id: "clicksign",
    nome: "ClickSign",
    categoria: "documentos",
    conectado: true,
    logo: "🖋️",
    descricao: "Assinatura eletrônica ICP-Brasil.",
  },
  {
    id: "sefaz",
    nome: "SEFAZ / NFS-e",
    categoria: "financeiro",
    conectado: true,
    logo: "🧾",
    descricao: "Emissão de notas fiscais.",
  },
  {
    id: "asaas",
    nome: "Asaas",
    categoria: "financeiro",
    conectado: false,
    logo: "💰",
    descricao: "Boletos, Pix e cobrança recorrente.",
  },
  {
    id: "stripe",
    nome: "Stripe",
    categoria: "financeiro",
    conectado: false,
    logo: "💳",
    descricao: "Pagamentos internacionais.",
  },
  {
    id: "slack",
    nome: "Slack",
    categoria: "comunicacao",
    conectado: false,
    logo: "💼",
    descricao: "Notificações do time.",
  },
];

export interface TicketSuporte {
  id: string;
  assunto: string;
  categoria: "bug" | "duvida" | "feature" | "cobranca";
  prioridade: "baixa" | "media" | "alta" | "critica";
  status: "aberto" | "andamento" | "aguardando" | "resolvido";
  criadoEm: string;
  ultimaAtualizacao: string;
  responsavel?: string;
}

export const tickets: TicketSuporte[] = [
  {
    id: "#4821",
    assunto: "Erro ao publicar imóvel no ZAP",
    categoria: "bug",
    prioridade: "alta",
    status: "andamento",
    criadoEm: "2026-07-15",
    ultimaAtualizacao: "há 2 h",
    responsavel: "Ana (Suporte)",
  },
  {
    id: "#4820",
    assunto: "Como configurar templates de WhatsApp?",
    categoria: "duvida",
    prioridade: "media",
    status: "resolvido",
    criadoEm: "2026-07-14",
    ultimaAtualizacao: "ontem",
    responsavel: "Marcos (Suporte)",
  },
  {
    id: "#4819",
    assunto: "Solicitar integração com Corretora X",
    categoria: "feature",
    prioridade: "baixa",
    status: "aguardando",
    criadoEm: "2026-07-12",
    ultimaAtualizacao: "há 3 dias",
  },
  {
    id: "#4818",
    assunto: "Fatura duplicada em julho",
    categoria: "cobranca",
    prioridade: "alta",
    status: "resolvido",
    criadoEm: "2026-07-10",
    ultimaAtualizacao: "há 5 dias",
    responsavel: "Financeiro",
  },
  {
    id: "#4817",
    assunto: "Matchmaking com score inconsistente",
    categoria: "bug",
    prioridade: "critica",
    status: "aberto",
    criadoEm: "2026-07-16",
    ultimaAtualizacao: "há 30 min",
  },
];

export const artigosHelp = [
  { titulo: "Primeiros passos com o ImobiOS", categoria: "Onboarding", min: 5, views: 2840 },
  { titulo: "Como conectar o ZAP e o Viva Real", categoria: "Portais", min: 4, views: 1920 },
  { titulo: "Configurar templates de WhatsApp", categoria: "Comunicação", min: 6, views: 1580 },
  { titulo: "Gerando contratos com assinatura", categoria: "Contratos", min: 8, views: 1320 },
  { titulo: "Treinando agentes de IA", categoria: "IA", min: 12, views: 980 },
  { titulo: "Importação em lote via planilha", categoria: "Dados", min: 7, views: 720 },
];
