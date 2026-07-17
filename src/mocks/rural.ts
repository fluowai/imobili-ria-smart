// Mocks da Carteira Rural. Substituir por Lovable Cloud depois.

export type RuralStatus = "disponivel" | "reservado" | "vendido" | "pausado";
export type RuralUso = "pecuaria" | "agricultura" | "misto" | "lazer" | "reflorestamento";

export interface ImovelRural {
  id: string;
  codigo: string;
  nome: string;
  municipio: string;
  uf: string;
  areaHa: number;
  uso: RuralUso;
  status: RuralStatus;
  car: string;
  ccir: string;
  itr: "regular" | "pendente" | "atrasado";
  matricula: string;
  benfeitorias: string;
  aguas: string;
  acesso: string;
  reservaLegalHa: number;
  appHa: number;
  produtivaHa: number;
  valorTotal: number;
  valorHectare: number;
  proprietario: string;
  captadoPor: string;
  cover: string;
  destaque: boolean;
}

const covers = [
  "https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=640",
  "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=640",
  "https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?w=640",
  "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=640",
  "https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=640",
  "https://images.unsplash.com/photo-1595872018818-97555653a011?w=640",
];

export const imoveisRurais: ImovelRural[] = [
  { id: "IMR-2201", codigo: "IMR-2201", nome: "Fazenda Boa Vista",           municipio: "Nova Mutum",     uf: "MT", areaHa: 2400, uso: "agricultura",    status: "disponivel", car: "MT-51.03106-...A21", ccir: "3.101.204-9", itr: "regular",  matricula: "44.221 · CRI Nova Mutum",  benfeitorias: "Sede, 4 galpões, 12 casas",  aguas: "Rio + 3 açudes",   acesso: "BR-163 · 8 km asfalto",         reservaLegalHa: 480,  appHa: 180, produtivaHa: 1740, valorTotal: 168000000, valorHectare: 70000, proprietario: "Grupo Bela Vista", captadoPor: "Diego",   cover: covers[0], destaque: true  },
  { id: "IMR-2202", codigo: "IMR-2202", nome: "Fazenda São Judas",           municipio: "Sorriso",        uf: "MT", areaHa: 1180, uso: "agricultura",    status: "reservado",  car: "MT-51.07206-...B14", ccir: "3.201.884-2", itr: "regular",  matricula: "18.994 · CRI Sorriso",     benfeitorias: "Sede, 2 armazéns 20k sc",   acesso: "MT-242 · 3 km cascalho",       reservaLegalHa: 260,  appHa: 90,  produtivaHa: 830,  valorTotal: 89000000,  valorHectare: 75000, proprietario: "Família Menezes",  captadoPor: "Marcos",  cover: covers[1], destaque: true  },
  { id: "IMR-2203", codigo: "IMR-2203", nome: "Sítio Recanto Verde",         municipio: "Chapada dos Guimarães", uf: "MT", areaHa: 15, uso: "lazer", status: "disponivel", car: "MT-51.02605-...C08", ccir: "3.011.502-1", itr: "regular",  matricula: "8.221 · CRI Chapada",      benfeitorias: "Sede pé-direito duplo, piscina", acesso: "MT-251 · asfalto até o portão",  reservaLegalHa: 3,    appHa: 2,   produtivaHa: 10,   valorTotal: 890000,    valorHectare: 59333, proprietario: "Fernanda Prado",   captadoPor: "Larissa", cover: covers[2], destaque: false },
  { id: "IMR-2204", codigo: "IMR-2204", nome: "Fazenda Pantanal do Rio",     municipio: "Poconé",         uf: "MT", areaHa: 3200, uso: "pecuaria",       status: "disponivel", car: "MT-51.06803-...D42", ccir: "3.407.221-8", itr: "pendente", matricula: "22.104 · CRI Poconé",      benfeitorias: "Sede, curral, 6 mangueiras", acesso: "Transpantaneira · 12 km",     reservaLegalHa: 1280, appHa: 420, produtivaHa: 1500, valorTotal: 44000000,  valorHectare: 13750, proprietario: "Pantanal Agro",    captadoPor: "Diego",   cover: covers[3], destaque: true  },
  { id: "IMR-2205", codigo: "IMR-2205", nome: "Fazenda Cerrado Grande",      municipio: "Primavera do Leste", uf: "MT", areaHa: 1800, uso: "misto",  status: "vendido",    car: "MT-51.06905-...E11", ccir: "3.310.995-4", itr: "regular",  matricula: "31.402 · CRI Primavera",   benfeitorias: "Sede, secador 500 sc/h",    acesso: "BR-070 · 2 km asfalto",       reservaLegalHa: 380,  appHa: 140, produtivaHa: 1280, valorTotal: 126000000, valorHectare: 70000, proprietario: "Agro Cerrado LTDA",captadoPor: "Marcos",  cover: covers[4], destaque: false },
  { id: "IMR-2206", codigo: "IMR-2206", nome: "Sítio das Águas",             municipio: "Rondonópolis",   uf: "MT", areaHa: 42,   uso: "reflorestamento", status: "disponivel", car: "MT-51.07701-...F09", ccir: "3.508.331-2", itr: "atrasado", matricula: "12.887 · CRI Rondonópolis",benfeitorias: "Casa caseiro, viveiro mudas",acesso: "MT-270 · 5 km cascalho",       reservaLegalHa: 9,    appHa: 6,   produtivaHa: 27,   valorTotal: 1600000,   valorHectare: 38095, proprietario: "Sérgio Bittencourt",captadoPor: "Larissa", cover: covers[5], destaque: false },
  { id: "IMR-2207", codigo: "IMR-2207", nome: "Fazenda Três Rios",           municipio: "Campo Novo do Parecis", uf: "MT", areaHa: 4200, uso: "agricultura", status: "disponivel", car: "MT-51.02106-...G33", ccir: "3.902.114-6", itr: "regular",  matricula: "58.221 · CRI Campo Novo",  benfeitorias: "2 sedes, 3 armazéns 60k sc",acesso: "BR-364 · asfalto",             reservaLegalHa: 890,  appHa: 320, produtivaHa: 2990, valorTotal: 310000000, valorHectare: 73810, proprietario: "Três Rios Agro",   captadoPor: "Diego",   cover: covers[0], destaque: true  },
  { id: "IMR-2208", codigo: "IMR-2208", nome: "Fazenda Pouso Alegre",        municipio: "Cáceres",        uf: "MT", areaHa: 680,  uso: "pecuaria",       status: "pausado",    car: "MT-51.02506-...H77", ccir: "3.605.998-1", itr: "regular",  matricula: "14.502 · CRI Cáceres",     benfeitorias: "Sede, curral novo, 3 casas",acesso: "MT-343 · 4 km cascalho",       reservaLegalHa: 150,  appHa: 60,  produtivaHa: 470,  valorTotal: 16000000,  valorHectare: 23529, proprietario: "Herdeiros Pouso",  captadoPor: "Marcos",  cover: covers[3], destaque: false },
];

// Distribuição de solo para o mapa territorial (mock simples em % da carteira)
export const coberturaSolo = [
  { classe: "Área produtiva",  ha: 8847, cor: "hsl(35 85% 55%)" },
  { classe: "Reserva legal",   ha: 3452, cor: "hsl(140 55% 40%)" },
  { classe: "APP",             ha: 1218, cor: "hsl(200 65% 50%)" },
  { classe: "Uso restrito",    ha: 425,  cor: "hsl(280 40% 55%)" },
];

export const passivosAmbientais = [
  { id: 1, imovel: "IMR-2204 · Pantanal do Rio", tipo: "APP degradada",        areaHa: 12, prazo: "12/2027", severidade: "alta"   as const },
  { id: 2, imovel: "IMR-2201 · Boa Vista",       tipo: "Reserva legal a averbar", areaHa: 40, prazo: "06/2027", severidade: "media"  as const },
  { id: 3, imovel: "IMR-2206 · Sítio das Águas", tipo: "ITR em atraso",        areaHa: 0,  prazo: "imediato", severidade: "alta"   as const },
  { id: 4, imovel: "IMR-2208 · Pouso Alegre",    tipo: "CAR pendente análise", areaHa: 0,  prazo: "análise", severidade: "baixa"  as const },
];

export const valuationHistorico = [
  { ano: "2020", valorHa: 42000 },
  { ano: "2021", valorHa: 48000 },
  { ano: "2022", valorHa: 55000 },
  { ano: "2023", valorHa: 61000 },
  { ano: "2024", valorHa: 66000 },
  { ano: "2025", valorHa: 71000 },
  { ano: "2026", valorHa: 74000 },
];

export const comparaveis = [
  { fazenda: "Fazenda Progresso",   municipio: "Sorriso",         areaHa: 1200, valorHa: 78000, distancia: "12 km",  data: "05/2026" },
  { fazenda: "Faz. Santa Luzia",    municipio: "Nova Mutum",       areaHa: 2100, valorHa: 72000, distancia: "8 km",   data: "03/2026" },
  { fazenda: "Faz. Vale do Sol",    municipio: "Lucas do Rio Verde", areaHa: 1600, valorHa: 74500, distancia: "22 km", data: "02/2026" },
  { fazenda: "Faz. Boa Esperança",  municipio: "Sorriso",         areaHa: 890,  valorHa: 76000, distancia: "18 km",  data: "12/2025" },
  { fazenda: "Faz. Nova Fronteira", municipio: "Nova Mutum",       areaHa: 3200, valorHa: 69000, distancia: "5 km",   data: "11/2025" },
];

export const fmtHa = (v: number) => `${v.toLocaleString("pt-BR")} ha`;
export const fmtBRL = (v: number) =>
  v >= 1000000
    ? `R$ ${(v / 1000000).toFixed(v % 1000000 === 0 ? 0 : 1)}M`
    : v >= 1000
      ? `R$ ${(v / 1000).toFixed(0)}k`
      : `R$ ${v.toLocaleString("pt-BR")}`;
export const fmtBRLFull = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
