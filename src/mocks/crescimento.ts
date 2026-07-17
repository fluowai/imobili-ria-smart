// Mocks do módulo de Crescimento.

// Metas
export interface Meta {
  id: string;
  titulo: string;
  categoria: "vendas" | "captacao" | "locacao" | "leads" | "conversao";
  responsavel: string;
  meta: number;
  atingido: number;
  unidade: string;
  prazo: string;
}

export const metas: Meta[] = [
  { id: "M1", titulo: "VGV do trimestre",         categoria: "vendas",    responsavel: "Equipe comercial", meta: 12000000, atingido: 8400000, unidade: "R$",    prazo: "30/09" },
  { id: "M2", titulo: "Novos imóveis captados",   categoria: "captacao",  responsavel: "Diego",            meta: 24,       atingido: 18,       unidade: "un.",   prazo: "31/07" },
  { id: "M3", titulo: "Contratos de locação",     categoria: "locacao",   responsavel: "Larissa",          meta: 12,       atingido: 9,        unidade: "un.",   prazo: "31/07" },
  { id: "M4", titulo: "Leads qualificados / mês", categoria: "leads",     responsavel: "Marketing",        meta: 320,      atingido: 268,      unidade: "leads", prazo: "31/07" },
  { id: "M5", titulo: "Taxa de conversão visita→proposta", categoria: "conversao", responsavel: "Marcos",  meta: 35,       atingido: 28,       unidade: "%",     prazo: "31/08" },
  { id: "M6", titulo: "NPS clientes",             categoria: "conversao", responsavel: "CS",               meta: 80,       atingido: 74,       unidade: "pts",   prazo: "30/09" },
];

export const evolucaoMetas = [
  { semana: "S1", planejado: 20, real: 22 },
  { semana: "S2", planejado: 40, real: 38 },
  { semana: "S3", planejado: 60, real: 55 },
  { semana: "S4", planejado: 80, real: 74 },
  { semana: "S5", planejado: 100, real: 88 },
];

// Site / Portal
export interface PaginaSite {
  id: string;
  slug: string;
  titulo: string;
  status: "publicada" | "rascunho" | "revisao";
  tipo: "home" | "categoria" | "imovel" | "artigo" | "contato";
  visualizacoes: number;
  cliques: number;
  atualizado: string;
}

export const paginasSite: PaginaSite[] = [
  { id: "P1", slug: "/",                    titulo: "Home",                          status: "publicada", tipo: "home",      visualizacoes: 18420, cliques: 2140, atualizado: "há 2 dias" },
  { id: "P2", slug: "/comprar",             titulo: "Comprar imóveis",              status: "publicada", tipo: "categoria", visualizacoes: 8842,  cliques: 1210, atualizado: "há 5 dias" },
  { id: "P3", slug: "/alugar",              titulo: "Alugar imóveis",               status: "publicada", tipo: "categoria", visualizacoes: 6320,  cliques: 890,  atualizado: "há 1 semana" },
  { id: "P4", slug: "/rural",               titulo: "Fazendas e sítios",            status: "publicada", tipo: "categoria", visualizacoes: 3210,  cliques: 542,  atualizado: "há 3 dias" },
  { id: "P5", slug: "/blog/como-financiar", titulo: "Como financiar seu imóvel",    status: "publicada", tipo: "artigo",    visualizacoes: 4820,  cliques: 720,  atualizado: "há 2 semanas" },
  { id: "P6", slug: "/contato",             titulo: "Fale conosco",                  status: "publicada", tipo: "contato",   visualizacoes: 1820,  cliques: 480,  atualizado: "há 1 mês" },
  { id: "P7", slug: "/blog/lancamento-sol-nascente", titulo: "Lançamento Sol Nascente", status: "rascunho", tipo: "artigo", visualizacoes: 0,     cliques: 0,    atualizado: "hoje" },
  { id: "P8", slug: "/parceiros",           titulo: "Programa de parceiros",         status: "revisao",   tipo: "artigo",    visualizacoes: 0,     cliques: 0,    atualizado: "ontem" },
];

export const traficoDiario = [
  { dia: "Seg", visitas: 420, leads: 22 },
  { dia: "Ter", visitas: 480, leads: 28 },
  { dia: "Qua", visitas: 512, leads: 32 },
  { dia: "Qui", visitas: 468, leads: 24 },
  { dia: "Sex", visitas: 590, leads: 41 },
  { dia: "Sáb", visitas: 720, leads: 52 },
  { dia: "Dom", visitas: 680, leads: 44 },
];

// Agentes IA
export interface AgenteIA {
  id: string;
  nome: string;
  papel: string;
  ativo: boolean;
  conversas: number;
  conversao: number;
  economia: string;
  modelo: string;
  cor: string;
}

export const agentesIA: AgenteIA[] = [
  { id: "A1", nome: "Aurora",   papel: "SDR / Qualificação",        ativo: true,  conversas: 1284, conversao: 42, economia: "R$ 18k/mês",  modelo: "gemini-2.5-pro",  cor: "hsl(280 55% 55%)" },
  { id: "A2", nome: "Bento",    papel: "Atendimento inicial",       ativo: true,  conversas: 2140, conversao: 58, economia: "R$ 24k/mês",  modelo: "gemini-2.5-flash",cor: "hsl(200 65% 50%)" },
  { id: "A3", nome: "Clara",    papel: "Pós-venda e vistorias",     ativo: true,  conversas: 480,  conversao: 88, economia: "R$ 6k/mês",   modelo: "gemini-2.5-flash",cor: "hsl(140 55% 45%)" },
  { id: "A4", nome: "Dante",    papel: "Copywriter de anúncios",    ativo: true,  conversas: 220,  conversao: 0,  economia: "80 h/mês",     modelo: "gemini-2.5-pro",  cor: "hsl(35 85% 55%)"  },
  { id: "A5", nome: "Elis",     papel: "Assistente jurídica",       ativo: false, conversas: 0,    conversao: 0,  economia: "—",            modelo: "gemini-2.5-pro",  cor: "hsl(340 65% 55%)" },
  { id: "A6", nome: "Fábio",    papel: "Precificação (valuation)",  ativo: true,  conversas: 88,   conversao: 0,  economia: "40 h/mês",     modelo: "gemini-2.5-pro",  cor: "hsl(20 75% 55%)"  },
];

// Landing pages
export interface Landing {
  id: string;
  nome: string;
  campanha: string;
  status: "publicada" | "rascunho" | "pausada";
  visualizacoes: number;
  leads: number;
  conversao: number;
  investimento: number;
  cpl: number;
}

export const landings: Landing[] = [
  { id: "L1", nome: "Apartamentos Centro Cuiabá", campanha: "Meta Ads · jul", status: "publicada", visualizacoes: 12800, leads: 428, conversao: 3.3, investimento: 8400,  cpl: 19.6 },
  { id: "L2", nome: "Fazendas MT · investidor",    campanha: "Google · SEM",  status: "publicada", visualizacoes: 4820,  leads: 96,  conversao: 2.0, investimento: 14800, cpl: 154   },
  { id: "L3", nome: "Loteamento Sol Nascente",     campanha: "Instagram Ads", status: "publicada", visualizacoes: 22400, leads: 812, conversao: 3.6, investimento: 12400, cpl: 15.3 },
  { id: "L4", nome: "Aluguel comercial CPA",       campanha: "Google · Local",status: "pausada",   visualizacoes: 1820,  leads: 34,  conversao: 1.9, investimento: 2100,  cpl: 61.8 },
  { id: "L5", nome: "Casas Alphaville · alto padrão", campanha: "Rascunho",   status: "rascunho",  visualizacoes: 0,     leads: 0,   conversao: 0,   investimento: 0,     cpl: 0    },
];

// Quiz
export interface Quiz {
  id: string;
  nome: string;
  publico: string;
  perguntas: number;
  respostas: number;
  leadsGerados: number;
  ativo: boolean;
}

export const quizzes: Quiz[] = [
  { id: "Q1", nome: "Qual imóvel combina com você?",         publico: "Comprador urbano",  perguntas: 8,  respostas: 1420, leadsGerados: 412, ativo: true  },
  { id: "Q2", nome: "Perfil de investidor rural",             publico: "Investidor rural",  perguntas: 12, respostas: 384,  leadsGerados: 128, ativo: true  },
  { id: "Q3", nome: "Descubra sua parcela ideal",             publico: "Financiamento",     perguntas: 6,  respostas: 2210, leadsGerados: 542, ativo: true  },
  { id: "Q4", nome: "Aluguel comercial na medida certa",      publico: "PJ / empresas",     perguntas: 10, respostas: 220,  leadsGerados: 68,  ativo: false },
];

// Relatórios
export const relatoriosDisponiveis = [
  { id: "R1", nome: "Funil de vendas por corretor",   categoria: "Comercial",  ultimo: "hoje 08:00", scheduled: true  },
  { id: "R2", nome: "Origem de leads (últimos 90d)",  categoria: "Marketing",  ultimo: "hoje 07:00", scheduled: true  },
  { id: "R3", nome: "DRE mensal consolidado",         categoria: "Financeiro", ultimo: "ontem",       scheduled: true  },
  { id: "R4", nome: "Inadimplência de locatários",    categoria: "Financeiro", ultimo: "há 2 dias",   scheduled: false },
  { id: "R5", nome: "Imóveis parados > 90 dias",      categoria: "Comercial",  ultimo: "há 3 dias",   scheduled: false },
  { id: "R6", nome: "Performance de anúncios",        categoria: "Marketing",  ultimo: "hoje",        scheduled: true  },
  { id: "R7", nome: "Cobertura territorial (rural)",  categoria: "Estratégia", ultimo: "há 1 semana", scheduled: false },
  { id: "R8", nome: "NPS e satisfação",               categoria: "CS",         ultimo: "há 2 semanas", scheduled: false },
];

// Matchmaking 360
export interface Match {
  id: string;
  cliente: string;
  perfil: string;
  imovel: string;
  score: number;
  motivos: string[];
  ultimoContato: string;
  responsavel: string;
}

export const matches: Match[] = [
  { id: "MM-01", cliente: "Ana Ribeiro",     perfil: "Apto 3 dorm · até 700k · Centro",     imovel: "IMU-4421 · Apto Centro",         score: 96, motivos: ["Bairro","Preço","Vagas"],           ultimoContato: "há 2 h",    responsavel: "Marcos"  },
  { id: "MM-02", cliente: "Bruno Alves",     perfil: "Casa condomínio · até 1.5M · Jardim", imovel: "IMU-4420 · Casa Jardim Itália",  score: 91, motivos: ["Condomínio","Dormitórios","Vagas"], ultimoContato: "ontem",     responsavel: "Larissa" },
  { id: "MM-03", cliente: "Investidor Rural",perfil: "Fazenda soja · 1000-2000ha · MT",     imovel: "IMR-2202 · Fazenda São Judas",  score: 89, motivos: ["Uso","Água","Acesso"],              ultimoContato: "há 3 dias", responsavel: "Diego"   },
  { id: "MM-04", cliente: "Henrique Rocha",  perfil: "Sala comercial · até 500k · CPA",     imovel: "IMU-4417 · Sala CPA (alugada)", score: 72, motivos: ["Localização","Metragem"],           ultimoContato: "há 4 dias", responsavel: "Larissa" },
  { id: "MM-05", cliente: "Isabela Prado",   perfil: "Apto praia · até 700k",               imovel: "IMU-4413 · Apto Riviera",        score: 84, motivos: ["Praia","Metragem","Vagas"],         ultimoContato: "há 5 dias", responsavel: "Diego"   },
  { id: "MM-06", cliente: "Eduarda Silva",   perfil: "Apto 2 dorm · até 420k",              imovel: "IMU-4418 · Apto Bosque",         score: 93, motivos: ["Preço","Bairro","Suíte"],           ultimoContato: "há 12 h",   responsavel: "Larissa" },
];

export const fmtBRL = (v: number) =>
  v >= 1000000
    ? `R$ ${(v / 1000000).toFixed(v % 1000000 === 0 ? 0 : 1)}M`
    : v >= 1000
      ? `R$ ${(v / 1000).toFixed(0)}k`
      : `R$ ${v.toLocaleString("pt-BR")}`;
export const fmtBRLFull = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
