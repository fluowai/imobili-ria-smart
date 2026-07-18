// Mocks da Carteira Urbana. Substituir por Lovable Cloud depois.

export type ImovelStatus = "disponivel" | "reservado" | "vendido" | "alugado" | "pausado";
export type ImovelFinalidade = "venda" | "locacao" | "ambos";
export type ImovelTipo = "apartamento" | "casa" | "cobertura" | "sala" | "terreno" | "galpao";

export interface ImovelUrbano {
  id: string;
  codigo: string;
  titulo: string;
  tipo: ImovelTipo;
  finalidade: ImovelFinalidade;
  status: ImovelStatus;
  endereco: string;
  bairro: string;
  cidade: string;
  dormitorios: number;
  suites: number;
  vagas: number;
  areaUtil: number;
  areaTotal: number;
  valorVenda: number;
  valorLocacao: number;
  condominio: number;
  iptu: number;
  captadoPor: string;
  publicado: boolean;
  destaque: boolean;
  visualizacoes: number;
  criadoEm: string;
  cover: string;
}

const covers = [
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=640",
  "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=640",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=640",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=640",
  "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=640",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=640",
  "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=640",
  "https://images.unsplash.com/photo-1600585152915-d208bec867a1?w=640",
];

export const imoveisUrbanos: ImovelUrbano[] = [
  {
    id: "IMU-4421",
    codigo: "IMU-4421",
    titulo: "Apartamento 3 dormitórios · Centro",
    tipo: "apartamento",
    finalidade: "venda",
    status: "disponivel",
    endereco: "Av. Getúlio Vargas, 1200 · Apto 802",
    bairro: "Centro",
    cidade: "Cuiabá",
    dormitorios: 3,
    suites: 1,
    vagas: 2,
    areaUtil: 98,
    areaTotal: 112,
    valorVenda: 680000,
    valorLocacao: 0,
    condominio: 780,
    iptu: 145,
    captadoPor: "Marcos",
    publicado: true,
    destaque: true,
    visualizacoes: 1842,
    criadoEm: "2026-05-12",
    cover: covers[0],
  },
  {
    id: "IMU-4420",
    codigo: "IMU-4420",
    titulo: "Casa em condomínio · Jardim Itália",
    tipo: "casa",
    finalidade: "venda",
    status: "reservado",
    endereco: "Cond. Vila Verde, Rua 4 · Casa 12",
    bairro: "Jardim Itália",
    cidade: "Cuiabá",
    dormitorios: 4,
    suites: 2,
    vagas: 4,
    areaUtil: 320,
    areaTotal: 480,
    valorVenda: 1200000,
    valorLocacao: 0,
    condominio: 1400,
    iptu: 380,
    captadoPor: "Larissa",
    publicado: true,
    destaque: true,
    visualizacoes: 2210,
    criadoEm: "2026-04-28",
    cover: covers[1],
  },
  {
    id: "IMU-4419",
    codigo: "IMU-4419",
    titulo: "Cobertura duplex · Ribeirão do Lipa",
    tipo: "cobertura",
    finalidade: "venda",
    status: "disponivel",
    endereco: "Res. Torres do Sol, Cobertura 2",
    bairro: "Ribeirão do Lipa",
    cidade: "Cuiabá",
    dormitorios: 4,
    suites: 3,
    vagas: 4,
    areaUtil: 280,
    areaTotal: 340,
    valorVenda: 2400000,
    valorLocacao: 0,
    condominio: 2100,
    iptu: 610,
    captadoPor: "Marcos",
    publicado: true,
    destaque: true,
    visualizacoes: 3180,
    criadoEm: "2026-04-10",
    cover: covers[2],
  },
  {
    id: "IMU-4418",
    codigo: "IMU-4418",
    titulo: "Apartamento 2 dormitórios · Bosque",
    tipo: "apartamento",
    finalidade: "ambos",
    status: "disponivel",
    endereco: "Rua das Palmeiras, 88 · Apto 401",
    bairro: "Bosque da Saúde",
    cidade: "Cuiabá",
    dormitorios: 2,
    suites: 1,
    vagas: 1,
    areaUtil: 68,
    areaTotal: 72,
    valorVenda: 380000,
    valorLocacao: 2400,
    condominio: 480,
    iptu: 82,
    captadoPor: "Diego",
    publicado: true,
    destaque: false,
    visualizacoes: 940,
    criadoEm: "2026-06-01",
    cover: covers[3],
  },
  {
    id: "IMU-4417",
    codigo: "IMU-4417",
    titulo: "Sala comercial · Av. do CPA",
    tipo: "sala",
    finalidade: "locacao",
    status: "alugado",
    endereco: "Ed. Empresarial CPA, Sala 1204",
    bairro: "CPA",
    cidade: "Cuiabá",
    dormitorios: 0,
    suites: 0,
    vagas: 2,
    areaUtil: 42,
    areaTotal: 42,
    valorVenda: 0,
    valorLocacao: 3200,
    condominio: 620,
    iptu: 90,
    captadoPor: "Larissa",
    publicado: true,
    destaque: false,
    visualizacoes: 512,
    criadoEm: "2026-05-20",
    cover: covers[4],
  },
  {
    id: "IMU-4416",
    codigo: "IMU-4416",
    titulo: "Terreno · Loteamento Sol Nascente",
    tipo: "terreno",
    finalidade: "venda",
    status: "disponivel",
    endereco: "Quadra 12, Lote 08",
    bairro: "Sol Nascente",
    cidade: "Várzea Grande",
    dormitorios: 0,
    suites: 0,
    vagas: 0,
    areaUtil: 360,
    areaTotal: 360,
    valorVenda: 145000,
    valorLocacao: 0,
    condominio: 0,
    iptu: 42,
    captadoPor: "Diego",
    publicado: false,
    destaque: false,
    visualizacoes: 210,
    criadoEm: "2026-06-15",
    cover: covers[5],
  },
  {
    id: "IMU-4415",
    codigo: "IMU-4415",
    titulo: "Casa térrea · Coxipó",
    tipo: "casa",
    finalidade: "locacao",
    status: "disponivel",
    endereco: "Rua Osvaldo Cruz, 421",
    bairro: "Coxipó",
    cidade: "Cuiabá",
    dormitorios: 3,
    suites: 1,
    vagas: 2,
    areaUtil: 140,
    areaTotal: 240,
    valorVenda: 0,
    valorLocacao: 3800,
    condominio: 0,
    iptu: 190,
    captadoPor: "Marcos",
    publicado: true,
    destaque: false,
    visualizacoes: 680,
    criadoEm: "2026-06-22",
    cover: covers[6],
  },
  {
    id: "IMU-4414",
    codigo: "IMU-4414",
    titulo: "Galpão logístico · Distrito Industrial",
    tipo: "galpao",
    finalidade: "locacao",
    status: "disponivel",
    endereco: "Av. Industrial, 2100",
    bairro: "Distrito Ind.",
    cidade: "Várzea Grande",
    dormitorios: 0,
    suites: 0,
    vagas: 8,
    areaUtil: 1200,
    areaTotal: 2000,
    valorVenda: 0,
    valorLocacao: 24000,
    condominio: 0,
    iptu: 1200,
    captadoPor: "Larissa",
    publicado: true,
    destaque: false,
    visualizacoes: 320,
    criadoEm: "2026-07-01",
    cover: covers[7],
  },
  {
    id: "IMU-4413",
    codigo: "IMU-4413",
    titulo: "Apartamento na praia · Riviera",
    tipo: "apartamento",
    finalidade: "venda",
    status: "vendido",
    endereco: "Ed. Riviera Beach, Apto 1502",
    bairro: "Praia Grande",
    cidade: "Guarujá",
    dormitorios: 3,
    suites: 2,
    vagas: 2,
    areaUtil: 110,
    areaTotal: 128,
    valorVenda: 620000,
    valorLocacao: 0,
    condominio: 890,
    iptu: 210,
    captadoPor: "Diego",
    publicado: false,
    destaque: false,
    visualizacoes: 1120,
    criadoEm: "2026-03-04",
    cover: covers[0],
  },
  {
    id: "IMU-4412",
    codigo: "IMU-4412",
    titulo: "Apartamento 1 dormitório · Universitário",
    tipo: "apartamento",
    finalidade: "locacao",
    status: "disponivel",
    endereco: "Rua da UFMT, 210 · Apto 302",
    bairro: "Boa Esperança",
    cidade: "Cuiabá",
    dormitorios: 1,
    suites: 0,
    vagas: 1,
    areaUtil: 38,
    areaTotal: 42,
    valorVenda: 0,
    valorLocacao: 1600,
    condominio: 320,
    iptu: 48,
    captadoPor: "Marcos",
    publicado: true,
    destaque: false,
    visualizacoes: 1420,
    criadoEm: "2026-06-30",
    cover: covers[3],
  },
  {
    id: "IMU-4411",
    codigo: "IMU-4411",
    titulo: "Casa alto padrão · Alphaville",
    tipo: "casa",
    finalidade: "venda",
    status: "disponivel",
    endereco: "Alphaville MT, Rua 8 · Casa 45",
    bairro: "Alphaville",
    cidade: "Cuiabá",
    dormitorios: 5,
    suites: 4,
    vagas: 6,
    areaUtil: 520,
    areaTotal: 900,
    valorVenda: 3800000,
    valorLocacao: 0,
    condominio: 2400,
    iptu: 980,
    captadoPor: "Larissa",
    publicado: true,
    destaque: true,
    visualizacoes: 2860,
    criadoEm: "2026-05-05",
    cover: covers[1],
  },
  {
    id: "IMU-4410",
    codigo: "IMU-4410",
    titulo: "Apartamento 3 dormitórios · Goiabeiras",
    tipo: "apartamento",
    finalidade: "ambos",
    status: "pausado",
    endereco: "Ed. Solar das Palmeiras, Apto 601",
    bairro: "Goiabeiras",
    cidade: "Cuiabá",
    dormitorios: 3,
    suites: 1,
    vagas: 2,
    areaUtil: 92,
    areaTotal: 104,
    valorVenda: 540000,
    valorLocacao: 2900,
    condominio: 640,
    iptu: 128,
    captadoPor: "Diego",
    publicado: false,
    destaque: false,
    visualizacoes: 480,
    criadoEm: "2026-06-18",
    cover: covers[2],
  },
];

export interface ContratoLocacao {
  id: string;
  imovelId: string;
  imovelTitulo: string;
  locatario: string;
  proprietario: string;
  inicio: string;
  fim: string;
  aluguel: number;
  status: "ativo" | "atrasado" | "encerrado" | "renovacao";
  reajuste: string;
  proximoVencimento: string;
}

export const contratosLocacao: ContratoLocacao[] = [
  {
    id: "CTR-2201",
    imovelId: "IMU-4417",
    imovelTitulo: "Sala comercial · Av. do CPA",
    locatario: "Nova Tech LTDA",
    proprietario: "Cláudia Souza",
    inicio: "2025-08-01",
    fim: "2027-07-31",
    aluguel: 3200,
    status: "ativo",
    reajuste: "IGPM · ago/26",
    proximoVencimento: "05/ago",
  },
  {
    id: "CTR-2202",
    imovelId: "IMU-4415",
    imovelTitulo: "Casa térrea · Coxipó",
    locatario: "Família Andrade",
    proprietario: "Roberto Lima",
    inicio: "2026-01-15",
    fim: "2028-01-14",
    aluguel: 3800,
    status: "atrasado",
    reajuste: "IPCA · jan/27",
    proximoVencimento: "05/jul",
  },
  {
    id: "CTR-2203",
    imovelId: "IMU-4412",
    imovelTitulo: "Apto 1 dorm · Universitário",
    locatario: "Marina Cruz",
    proprietario: "Aluguéis SA",
    inicio: "2026-02-01",
    fim: "2027-01-31",
    aluguel: 1600,
    status: "ativo",
    reajuste: "IGPM · fev/27",
    proximoVencimento: "10/ago",
  },
  {
    id: "CTR-2204",
    imovelId: "IMU-4414",
    imovelTitulo: "Galpão · Distrito Industrial",
    locatario: "LogPar Transportes",
    proprietario: "Imóveis Águia",
    inicio: "2024-03-01",
    fim: "2026-08-31",
    aluguel: 24000,
    status: "renovacao",
    reajuste: "IPCA · mar/26",
    proximoVencimento: "01/ago",
  },
  {
    id: "CTR-2205",
    imovelId: "IMU-4418",
    imovelTitulo: "Apto 2 dorm · Bosque",
    locatario: "João e Marta",
    proprietario: "Cláudia Souza",
    inicio: "2025-11-01",
    fim: "2026-10-31",
    aluguel: 2400,
    status: "ativo",
    reajuste: "IGPM · nov/26",
    proximoVencimento: "05/ago",
  },
  {
    id: "CTR-2206",
    imovelId: "IMU-4416",
    imovelTitulo: "Terreno · Sol Nascente",
    locatario: "Depósito Bom Preço",
    proprietario: "Fernando Melo",
    inicio: "2023-09-01",
    fim: "2026-08-31",
    aluguel: 900,
    status: "encerrado",
    reajuste: "—",
    proximoVencimento: "—",
  },
];

export interface Loteamento {
  id: string;
  nome: string;
  cidade: string;
  totalLotes: number;
  disponiveis: number;
  reservados: number;
  vendidos: number;
  vgv: number;
  entregaPrevista: string;
  status: "lancamento" | "obras" | "entregue";
  cover: string;
}

export const loteamentos: Loteamento[] = [
  {
    id: "LOT-01",
    nome: "Sol Nascente",
    cidade: "Várzea Grande",
    totalLotes: 240,
    disponiveis: 82,
    reservados: 34,
    vendidos: 124,
    vgv: 42000000,
    entregaPrevista: "12/2026",
    status: "obras",
    cover: covers[5],
  },
  {
    id: "LOT-02",
    nome: "Jardim das Águas",
    cidade: "Cuiabá",
    totalLotes: 180,
    disponiveis: 12,
    reservados: 8,
    vendidos: 160,
    vgv: 68000000,
    entregaPrevista: "03/2026",
    status: "entregue",
    cover: covers[3],
  },
  {
    id: "LOT-03",
    nome: "Reserva Bonita",
    cidade: "Chapada",
    totalLotes: 320,
    disponiveis: 280,
    reservados: 22,
    vendidos: 18,
    vgv: 24000000,
    entregaPrevista: "08/2027",
    status: "lancamento",
    cover: covers[6],
  },
  {
    id: "LOT-04",
    nome: "Alto do Pantanal",
    cidade: "Cuiabá",
    totalLotes: 96,
    disponiveis: 34,
    reservados: 12,
    vendidos: 50,
    vgv: 18000000,
    entregaPrevista: "06/2027",
    status: "obras",
    cover: covers[7],
  },
];

export interface Condominio {
  id: string;
  nome: string;
  endereco: string;
  unidades: number;
  administrado: boolean;
  sindico: string;
  taxaMedia: number;
  inadimplencia: number;
  cover: string;
}

export const condominios: Condominio[] = [
  {
    id: "CND-01",
    nome: "Ed. Solar das Palmeiras",
    endereco: "Rua das Palmeiras, 88 · Bosque",
    unidades: 48,
    administrado: true,
    sindico: "Ana Ribeiro",
    taxaMedia: 480,
    inadimplencia: 4.2,
    cover: covers[0],
  },
  {
    id: "CND-02",
    nome: "Res. Vila Verde",
    endereco: "Cond. Vila Verde · Jardim Itália",
    unidades: 120,
    administrado: true,
    sindico: "Carlos Menezes",
    taxaMedia: 1400,
    inadimplencia: 2.8,
    cover: covers[1],
  },
  {
    id: "CND-03",
    nome: "Torres do Sol",
    endereco: "Av. Beira Rio, 4200 · Ribeirão",
    unidades: 64,
    administrado: false,
    sindico: "Terceirizado",
    taxaMedia: 2100,
    inadimplencia: 6.5,
    cover: covers[2],
  },
  {
    id: "CND-04",
    nome: "Ed. Riviera Beach",
    endereco: "Av. Miguel Estefno, 1500 · Guarujá",
    unidades: 32,
    administrado: true,
    sindico: "Fernanda Prado",
    taxaMedia: 890,
    inadimplencia: 1.4,
    cover: covers[3],
  },
];

export interface Chave {
  id: string;
  imovelCodigo: string;
  imovelTitulo: string;
  copias: number;
  local: string;
  comQuem: string | null;
  desde: string | null;
  status: "disponivel" | "emprestada" | "atrasada";
  finalidade: string | null;
}

export const chaves: Chave[] = [
  {
    id: "CHV-01",
    imovelCodigo: "IMU-4421",
    imovelTitulo: "Apto 3 dorm · Centro",
    copias: 2,
    local: "Cofre 1 · Escritório",
    comQuem: null,
    desde: null,
    status: "disponivel",
    finalidade: null,
  },
  {
    id: "CHV-02",
    imovelCodigo: "IMU-4420",
    imovelTitulo: "Casa · Jardim Itália",
    copias: 3,
    local: "Cofre 1 · Escritório",
    comQuem: "Larissa",
    desde: "hoje 09:20",
    status: "emprestada",
    finalidade: "Vistoria com cliente",
  },
  {
    id: "CHV-03",
    imovelCodigo: "IMU-4419",
    imovelTitulo: "Cobertura · Ribeirão",
    copias: 2,
    local: "Cofre 2 · Escritório",
    comQuem: null,
    desde: null,
    status: "disponivel",
    finalidade: null,
  },
  {
    id: "CHV-04",
    imovelCodigo: "IMU-4415",
    imovelTitulo: "Casa · Coxipó",
    copias: 4,
    local: "Locatário",
    comQuem: "Fam. Andrade",
    desde: "15/01/2026",
    status: "emprestada",
    finalidade: "Contrato de locação",
  },
  {
    id: "CHV-05",
    imovelCodigo: "IMU-4418",
    imovelTitulo: "Apto 2 dorm · Bosque",
    copias: 2,
    local: "Cofre 1 · Escritório",
    comQuem: "Marcos",
    desde: "há 3 dias",
    status: "atrasada",
    finalidade: "Fotos profissionais",
  },
  {
    id: "CHV-06",
    imovelCodigo: "IMU-4417",
    imovelTitulo: "Sala comercial · CPA",
    copias: 3,
    local: "Locatário",
    comQuem: "Nova Tech",
    desde: "01/08/2025",
    status: "emprestada",
    finalidade: "Contrato de locação",
  },
  {
    id: "CHV-07",
    imovelCodigo: "IMU-4414",
    imovelTitulo: "Galpão · Distrito Industrial",
    copias: 2,
    local: "Cofre 2 · Escritório",
    comQuem: null,
    desde: null,
    status: "disponivel",
    finalidade: null,
  },
  {
    id: "CHV-08",
    imovelCodigo: "IMU-4411",
    imovelTitulo: "Casa · Alphaville",
    copias: 3,
    local: "Cofre 1 · Escritório",
    comQuem: "Diego",
    desde: "hoje 14:00",
    status: "emprestada",
    finalidade: "Visita com investidor",
  },
];

export const fmtBRL = (v: number) =>
  v >= 1000000
    ? `R$ ${(v / 1000000).toFixed(v % 1000000 === 0 ? 0 : 1)}M`
    : v >= 1000
      ? `R$ ${(v / 1000).toFixed(0)}k`
      : `R$ ${v.toLocaleString("pt-BR")}`;

export const fmtBRLFull = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
