// Dados mockados para o Super Admin. Substituir por chamadas reais quando o
// backend (Lovable Cloud) estiver plugado.

export type PlanTier = "starter" | "pro" | "enterprise";
export type ImobStatus = "ativa" | "trial" | "suspensa" | "cancelada";

export interface Imobiliaria {
  id: string;
  nome: string;
  cidade: string;
  uf: string;
  plano: PlanTier;
  status: ImobStatus;
  usuarios: number;
  imoveis: number;
  mrr: number;
  criadaEm: string;
}

export const imobiliarias: Imobiliaria[] = [
  {
    id: "IM-001",
    nome: "Terra & Lar Imóveis",
    cidade: "Cuiabá",
    uf: "MT",
    plano: "enterprise",
    status: "ativa",
    usuarios: 42,
    imoveis: 1284,
    mrr: 4890,
    criadaEm: "2024-02-11",
  },
  {
    id: "IM-002",
    nome: "Campo Verde Rural",
    cidade: "Rondonópolis",
    uf: "MT",
    plano: "pro",
    status: "ativa",
    usuarios: 18,
    imoveis: 612,
    mrr: 1890,
    criadaEm: "2024-04-03",
  },
  {
    id: "IM-003",
    nome: "Skyline Urbana",
    cidade: "São Paulo",
    uf: "SP",
    plano: "enterprise",
    status: "ativa",
    usuarios: 87,
    imoveis: 3241,
    mrr: 8900,
    criadaEm: "2023-11-22",
  },
  {
    id: "IM-004",
    nome: "Casa Nova Corretora",
    cidade: "Curitiba",
    uf: "PR",
    plano: "starter",
    status: "trial",
    usuarios: 4,
    imoveis: 82,
    mrr: 0,
    criadaEm: "2026-07-01",
  },
  {
    id: "IM-005",
    nome: "Fazenda & Cia",
    cidade: "Goiânia",
    uf: "GO",
    plano: "pro",
    status: "ativa",
    usuarios: 22,
    imoveis: 458,
    mrr: 1890,
    criadaEm: "2024-08-15",
  },
  {
    id: "IM-006",
    nome: "Litoral Sul Imóveis",
    cidade: "Florianópolis",
    uf: "SC",
    plano: "pro",
    status: "suspensa",
    usuarios: 12,
    imoveis: 220,
    mrr: 0,
    criadaEm: "2024-05-30",
  },
  {
    id: "IM-007",
    nome: "Nordeste Rural",
    cidade: "Petrolina",
    uf: "PE",
    plano: "starter",
    status: "ativa",
    usuarios: 6,
    imoveis: 94,
    mrr: 490,
    criadaEm: "2025-01-18",
  },
  {
    id: "IM-008",
    nome: "Metrópole Prime",
    cidade: "Rio de Janeiro",
    uf: "RJ",
    plano: "enterprise",
    status: "ativa",
    usuarios: 63,
    imoveis: 2110,
    mrr: 8900,
    criadaEm: "2023-09-04",
  },
  {
    id: "IM-009",
    nome: "Interior Corretora",
    cidade: "Ribeirão Preto",
    uf: "SP",
    plano: "pro",
    status: "cancelada",
    usuarios: 0,
    imoveis: 0,
    mrr: 0,
    criadaEm: "2024-01-10",
  },
  {
    id: "IM-010",
    nome: "Cerrado Agrimóveis",
    cidade: "Uberlândia",
    uf: "MG",
    plano: "pro",
    status: "ativa",
    usuarios: 15,
    imoveis: 380,
    mrr: 1890,
    criadaEm: "2024-10-27",
  },
  {
    id: "IM-011",
    nome: "Vale do Sol",
    cidade: "Blumenau",
    uf: "SC",
    plano: "starter",
    status: "trial",
    usuarios: 3,
    imoveis: 41,
    mrr: 0,
    criadaEm: "2026-07-10",
  },
  {
    id: "IM-012",
    nome: "Pampa Rural",
    cidade: "Passo Fundo",
    uf: "RS",
    plano: "pro",
    status: "ativa",
    usuarios: 11,
    imoveis: 267,
    mrr: 1890,
    criadaEm: "2025-03-22",
  },
];

export const mrrSerie = [
  { mes: "Jan", mrr: 42000, clientes: 68 },
  { mes: "Fev", mrr: 45800, clientes: 74 },
  { mes: "Mar", mrr: 49200, clientes: 79 },
  { mes: "Abr", mrr: 52400, clientes: 85 },
  { mes: "Mai", mrr: 57100, clientes: 92 },
  { mes: "Jun", mrr: 61300, clientes: 98 },
  { mes: "Jul", mrr: 66780, clientes: 104 },
];

export const distribuicaoPlano = [
  { plano: "Starter", valor: 28, cor: "var(--color-chart-3)" },
  { plano: "Pro", valor: 54, cor: "var(--color-chart-2)" },
  { plano: "Enterprise", valor: 22, cor: "var(--color-chart-1)" },
];

export const auditLog = [
  {
    id: 1,
    ator: "carla@terra.com",
    acao: "Atualizou plano",
    alvo: "IM-001",
    ip: "189.12.44.10",
    quando: "há 3 min",
  },
  { id: 2, ator: "system", acao: "Trial expirou", alvo: "IM-011", ip: "-", quando: "há 21 min" },
  {
    id: 3,
    ator: "admin@imobios.com",
    acao: "Suspendeu conta",
    alvo: "IM-006",
    ip: "201.55.9.2",
    quando: "há 1 h",
  },
  {
    id: 4,
    ator: "joao@skyline.com",
    acao: "Login",
    alvo: "IM-003",
    ip: "177.44.9.1",
    quando: "há 2 h",
  },
  {
    id: 5,
    ator: "admin@imobios.com",
    acao: "Criou feature flag",
    alvo: "new_kanban",
    ip: "201.55.9.2",
    quando: "há 3 h",
  },
  {
    id: 6,
    ator: "billing-bot",
    acao: "Cobrança processada",
    alvo: "IM-008",
    ip: "-",
    quando: "há 5 h",
  },
];

export const featureFlags = [
  {
    key: "new_kanban",
    nome: "Novo Kanban",
    descricao: "Kanban redesenhado com drag-and-drop 2.0",
    cobertura: 32,
    ativo: true,
  },
  {
    key: "ia_valuation",
    nome: "IA Valuation",
    descricao: "Valuation automático via IA para imóveis rurais",
    cobertura: 12,
    ativo: true,
  },
  {
    key: "whatsapp_v2",
    nome: "WhatsApp v2",
    descricao: "Nova integração multi-agente com Meta Cloud API",
    cobertura: 100,
    ativo: true,
  },
  {
    key: "portal_cliente",
    nome: "Portal do Cliente",
    descricao: "Área logada para clientes finais acompanharem contratos",
    cobertura: 8,
    ativo: false,
  },
  {
    key: "assinatura_digital",
    nome: "Assinatura Digital",
    descricao: "Assinatura eletrônica nativa em contratos",
    cobertura: 68,
    ativo: true,
  },
];

export const planos = [
  {
    tier: "starter" as PlanTier,
    nome: "Starter",
    preco: 490,
    limites: { usuarios: 5, imoveis: 100, storageGb: 5 },
    features: ["CRM básico", "Site institucional", "Suporte por email"],
  },
  {
    tier: "pro" as PlanTier,
    nome: "Pro",
    preco: 1890,
    limites: { usuarios: 25, imoveis: 1000, storageGb: 50 },
    features: ["Tudo do Starter", "Kanban + Automações", "Financeiro completo", "Contratos & GED"],
  },
  {
    tier: "enterprise" as PlanTier,
    nome: "Enterprise",
    preco: 4890,
    limites: { usuarios: 999, imoveis: 99999, storageGb: 500 },
    features: [
      "Tudo do Pro",
      "Agentes IA ilimitados",
      "Multi-carteira Rural + Urbana",
      "Suporte dedicado",
    ],
  },
];

export const invoices = [
  {
    id: "INV-2026-0714",
    cliente: "Terra & Lar Imóveis",
    valor: 4890,
    status: "paga",
    vencimento: "2026-07-10",
  },
  {
    id: "INV-2026-0713",
    cliente: "Skyline Urbana",
    valor: 8900,
    status: "paga",
    vencimento: "2026-07-08",
  },
  {
    id: "INV-2026-0712",
    cliente: "Fazenda & Cia",
    valor: 1890,
    status: "pendente",
    vencimento: "2026-07-18",
  },
  {
    id: "INV-2026-0711",
    cliente: "Metrópole Prime",
    valor: 8900,
    status: "paga",
    vencimento: "2026-07-05",
  },
  {
    id: "INV-2026-0710",
    cliente: "Cerrado Agrimóveis",
    valor: 1890,
    status: "atrasada",
    vencimento: "2026-07-01",
  },
  {
    id: "INV-2026-0709",
    cliente: "Campo Verde Rural",
    valor: 1890,
    status: "paga",
    vencimento: "2026-06-28",
  },
];
