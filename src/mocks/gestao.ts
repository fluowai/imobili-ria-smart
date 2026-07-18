// Mocks do módulo de Gestão (Financeiro, Contratos, GED).

export type FluxoTipo = "receita" | "despesa";
export type FluxoStatus = "pago" | "aberto" | "atrasado";
export type FluxoCategoria =
  | "comissao"
  | "aluguel"
  | "repasse"
  | "salario"
  | "marketing"
  | "operacional"
  | "impostos"
  | "outros";

export interface Lancamento {
  id: string;
  data: string;
  descricao: string;
  categoria: FluxoCategoria;
  tipo: FluxoTipo;
  status: FluxoStatus;
  valor: number;
  contraparte: string;
}

export const lancamentos: Lancamento[] = [
  {
    id: "F-9001",
    data: "2026-07-15",
    descricao: "Comissão venda IMU-4421",
    categoria: "comissao",
    tipo: "receita",
    status: "pago",
    valor: 40800,
    contraparte: "Ana Ribeiro",
  },
  {
    id: "F-9002",
    data: "2026-07-15",
    descricao: "Repasse aluguel · Cláudia S.",
    categoria: "repasse",
    tipo: "despesa",
    status: "pago",
    valor: 5040,
    contraparte: "Cláudia Souza",
  },
  {
    id: "F-9003",
    data: "2026-07-14",
    descricao: "Salários equipe julho",
    categoria: "salario",
    tipo: "despesa",
    status: "pago",
    valor: 68000,
    contraparte: "Folha",
  },
  {
    id: "F-9004",
    data: "2026-07-14",
    descricao: "Google Ads · captação",
    categoria: "marketing",
    tipo: "despesa",
    status: "pago",
    valor: 12400,
    contraparte: "Google",
  },
  {
    id: "F-9005",
    data: "2026-07-12",
    descricao: "Aluguel sala CPA · Nova Tech",
    categoria: "aluguel",
    tipo: "receita",
    status: "pago",
    valor: 3200,
    contraparte: "Nova Tech",
  },
  {
    id: "F-9006",
    data: "2026-07-10",
    descricao: "Comissão locação · Bosque",
    categoria: "comissao",
    tipo: "receita",
    status: "pago",
    valor: 2400,
    contraparte: "João e Marta",
  },
  {
    id: "F-9007",
    data: "2026-07-20",
    descricao: "IPTU carteira · julho",
    categoria: "impostos",
    tipo: "despesa",
    status: "aberto",
    valor: 8600,
    contraparte: "Prefeitura",
  },
  {
    id: "F-9008",
    data: "2026-07-22",
    descricao: "Comissão venda IMR-2202",
    categoria: "comissao",
    tipo: "receita",
    status: "aberto",
    valor: 178000,
    contraparte: "Família Menezes",
  },
  {
    id: "F-9009",
    data: "2026-07-05",
    descricao: "Aluguel Coxipó · Fam. Andrade",
    categoria: "aluguel",
    tipo: "receita",
    status: "atrasado",
    valor: 3800,
    contraparte: "Fam. Andrade",
  },
  {
    id: "F-9010",
    data: "2026-07-25",
    descricao: "Software ImobiOS · mensal",
    categoria: "operacional",
    tipo: "despesa",
    status: "aberto",
    valor: 4900,
    contraparte: "ImobiOS",
  },
  {
    id: "F-9011",
    data: "2026-07-30",
    descricao: "Manutenção galpão IMU-4414",
    categoria: "operacional",
    tipo: "despesa",
    status: "aberto",
    valor: 8200,
    contraparte: "Prestador",
  },
  {
    id: "F-9012",
    data: "2026-07-28",
    descricao: "Repasse aluguel · Roberto L.",
    categoria: "repasse",
    tipo: "despesa",
    status: "aberto",
    valor: 3610,
    contraparte: "Roberto Lima",
  },
];

export const fluxoMensal = [
  { mes: "Jan", receitas: 142, despesas: 96 },
  { mes: "Fev", receitas: 168, despesas: 102 },
  { mes: "Mar", receitas: 194, despesas: 118 },
  { mes: "Abr", receitas: 176, despesas: 110 },
  { mes: "Mai", receitas: 212, despesas: 128 },
  { mes: "Jun", receitas: 238, despesas: 134 },
  { mes: "Jul", receitas: 264, despesas: 142 },
];

export const distribuicaoDespesa = [
  { categoria: "Salários", valor: 68000, cor: "hsl(0 70% 55%)" },
  { categoria: "Marketing", valor: 22400, cor: "hsl(35 85% 55%)" },
  { categoria: "Repasses", valor: 18400, cor: "hsl(140 55% 45%)" },
  { categoria: "Operacional", valor: 15200, cor: "hsl(200 65% 50%)" },
  { categoria: "Impostos", valor: 12800, cor: "hsl(280 45% 55%)" },
];

// Contratos
export type ContratoStatus = "rascunho" | "assinatura" | "ativo" | "vencendo" | "encerrado";
export type ContratoTipo = "venda" | "locacao" | "captacao" | "parceria" | "prestacao";

export interface ContratoDoc {
  id: string;
  titulo: string;
  tipo: ContratoTipo;
  status: ContratoStatus;
  partes: string[];
  valor: number;
  criadoEm: string;
  vencimento: string | null;
  assinadoPor: number;
  totalAssinantes: number;
  responsavel: string;
}

export const contratosDocs: ContratoDoc[] = [
  {
    id: "CTR-3301",
    titulo: "Compra e venda · Apto IMU-4421",
    tipo: "venda",
    status: "assinatura",
    partes: ["Ana Ribeiro", "João Vendedor"],
    valor: 680000,
    criadoEm: "2026-07-14",
    vencimento: null,
    assinadoPor: 1,
    totalAssinantes: 2,
    responsavel: "Marcos",
  },
  {
    id: "CTR-3302",
    titulo: "Locação comercial · Sala CPA",
    tipo: "locacao",
    status: "ativo",
    partes: ["Nova Tech", "Cláudia Souza"],
    valor: 3200,
    criadoEm: "2025-08-01",
    vencimento: "2027-07-31",
    assinadoPor: 2,
    totalAssinantes: 2,
    responsavel: "Larissa",
  },
  {
    id: "CTR-3303",
    titulo: "Captação exclusiva · Fazenda 2201",
    tipo: "captacao",
    status: "ativo",
    partes: ["Grupo Bela Vista"],
    valor: 168000000,
    criadoEm: "2026-05-12",
    vencimento: "2026-11-12",
    assinadoPor: 1,
    totalAssinantes: 1,
    responsavel: "Diego",
  },
  {
    id: "CTR-3304",
    titulo: "Locação residencial · Casa Coxipó",
    tipo: "locacao",
    status: "vencendo",
    partes: ["Fam. Andrade", "Roberto Lima"],
    valor: 3800,
    criadoEm: "2026-01-15",
    vencimento: "2026-08-14",
    assinadoPor: 2,
    totalAssinantes: 2,
    responsavel: "Marcos",
  },
  {
    id: "CTR-3305",
    titulo: "Prestação · Marketing Google Ads",
    tipo: "prestacao",
    status: "ativo",
    partes: ["ImobiOS", "Google"],
    valor: 12400,
    criadoEm: "2026-07-01",
    vencimento: "2026-12-31",
    assinadoPor: 2,
    totalAssinantes: 2,
    responsavel: "Larissa",
  },
  {
    id: "CTR-3306",
    titulo: "Compra e venda · Fazenda 2205",
    tipo: "venda",
    status: "encerrado",
    partes: ["Agro Cerrado", "Comprador X"],
    valor: 126000000,
    criadoEm: "2026-03-04",
    vencimento: null,
    assinadoPor: 2,
    totalAssinantes: 2,
    responsavel: "Marcos",
  },
  {
    id: "CTR-3307",
    titulo: "Parceria · Portal ZAP",
    tipo: "parceria",
    status: "rascunho",
    partes: ["ImobiOS", "ZAP Imóveis"],
    valor: 24000,
    criadoEm: "2026-07-16",
    vencimento: null,
    assinadoPor: 0,
    totalAssinantes: 2,
    responsavel: "Diego",
  },
  {
    id: "CTR-3308",
    titulo: "Locação · Galpão Distrito",
    tipo: "locacao",
    status: "vencendo",
    partes: ["LogPar", "Imóveis Águia"],
    valor: 24000,
    criadoEm: "2024-03-01",
    vencimento: "2026-08-31",
    assinadoPor: 2,
    totalAssinantes: 2,
    responsavel: "Larissa",
  },
];

// GED
export type DocTipo =
  | "matricula"
  | "certidao"
  | "contrato"
  | "foto"
  | "planta"
  | "identidade"
  | "outros";

export interface Documento {
  id: string;
  nome: string;
  tipo: DocTipo;
  pasta: string;
  tamanhoKB: number;
  atualizadoEm: string;
  autor: string;
  compartilhado: boolean;
  versoes: number;
}

export const pastasGED = [
  { id: "imoveis", nome: "Imóveis", total: 428 },
  { id: "clientes", nome: "Clientes", total: 214 },
  { id: "contratos", nome: "Contratos", total: 96 },
  { id: "juridico", nome: "Jurídico", total: 42 },
  { id: "financeiro", nome: "Financeiro", total: 158 },
  { id: "marketing", nome: "Marketing", total: 84 },
];

export const documentos: Documento[] = [
  {
    id: "D-1",
    nome: "Matrícula 44.221.pdf",
    tipo: "matricula",
    pasta: "Imóveis / IMU-4421",
    tamanhoKB: 842,
    atualizadoEm: "há 2 h",
    autor: "Marcos",
    compartilhado: true,
    versoes: 3,
  },
  {
    id: "D-2",
    nome: "Certidão negativa · A. Ribeiro",
    tipo: "certidao",
    pasta: "Clientes / Ana R.",
    tamanhoKB: 224,
    atualizadoEm: "há 4 h",
    autor: "Larissa",
    compartilhado: false,
    versoes: 1,
  },
  {
    id: "D-3",
    nome: "Contrato CTR-3301.docx",
    tipo: "contrato",
    pasta: "Contratos / 2026",
    tamanhoKB: 88,
    atualizadoEm: "há 6 h",
    autor: "Marcos",
    compartilhado: true,
    versoes: 5,
  },
  {
    id: "D-4",
    nome: "Fotos IMU-4419 (28).zip",
    tipo: "foto",
    pasta: "Imóveis / IMU-4419",
    tamanhoKB: 42800,
    atualizadoEm: "ontem",
    autor: "Diego",
    compartilhado: true,
    versoes: 2,
  },
  {
    id: "D-5",
    nome: "Planta baixa · Apto 802.dwg",
    tipo: "planta",
    pasta: "Imóveis / IMU-4421",
    tamanhoKB: 3200,
    atualizadoEm: "há 2 dias",
    autor: "Marcos",
    compartilhado: false,
    versoes: 2,
  },
  {
    id: "D-6",
    nome: "RG e CPF · Bruno Alves.pdf",
    tipo: "identidade",
    pasta: "Clientes / Bruno A.",
    tamanhoKB: 412,
    atualizadoEm: "há 3 dias",
    autor: "Larissa",
    compartilhado: false,
    versoes: 1,
  },
  {
    id: "D-7",
    nome: "CAR · Faz. Boa Vista.pdf",
    tipo: "certidao",
    pasta: "Imóveis / IMR-2201",
    tamanhoKB: 1240,
    atualizadoEm: "há 4 dias",
    autor: "Diego",
    compartilhado: true,
    versoes: 4,
  },
  {
    id: "D-8",
    nome: "Contrato locação galpão.pdf",
    tipo: "contrato",
    pasta: "Contratos / 2024",
    tamanhoKB: 640,
    atualizadoEm: "há 1 semana",
    autor: "Larissa",
    compartilhado: true,
    versoes: 8,
  },
  {
    id: "D-9",
    nome: "Laudo valuation IMR-2202.pdf",
    tipo: "outros",
    pasta: "Imóveis / IMR-2202",
    tamanhoKB: 2100,
    atualizadoEm: "há 1 semana",
    autor: "Diego",
    compartilhado: false,
    versoes: 1,
  },
  {
    id: "D-10",
    nome: "IPTU consolidado 2026.pdf",
    tipo: "certidao",
    pasta: "Financeiro / 2026",
    tamanhoKB: 380,
    atualizadoEm: "há 2 semanas",
    autor: "Marcos",
    compartilhado: true,
    versoes: 1,
  },
];

export const fmtBRLFull = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
export const fmtBRLk = (v: number) =>
  v >= 1000000
    ? `R$ ${(v / 1000000).toFixed(v % 1000000 === 0 ? 0 : 1)}M`
    : `R$ ${(v / 1000).toFixed(0)}k`;
