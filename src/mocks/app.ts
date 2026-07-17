// Mocks do painel da imobiliária. Substituir por Lovable Cloud depois.

export type LeadStatus = "novo" | "contato" | "visita" | "proposta" | "fechado" | "perdido";
export type LeadOrigem = "site" | "instagram" | "whatsapp" | "indicacao" | "portal";

export interface Lead {
  id: string;
  nome: string;
  telefone: string;
  email: string;
  status: LeadStatus;
  origem: LeadOrigem;
  interesse: string;
  responsavel: string;
  valor: number;
  criadoEm: string;
  ultimoContato: string;
}

export const leads: Lead[] = [
  { id: "L-1024", nome: "Ana Ribeiro",     telefone: "(65) 99912-4488", email: "ana@gmail.com",       status: "proposta", origem: "instagram", interesse: "Apto 3 dorms Centro",      responsavel: "Marcos",  valor: 680000,  criadoEm: "2026-07-12", ultimoContato: "há 2 h" },
  { id: "L-1023", nome: "Bruno Alves",     telefone: "(65) 99811-2233", email: "bruno@empresa.com",   status: "visita",   origem: "site",       interesse: "Casa condomínio Jardim",   responsavel: "Larissa", valor: 1200000, criadoEm: "2026-07-12", ultimoContato: "há 4 h" },
  { id: "L-1022", nome: "Carla Menezes",   telefone: "(65) 98877-1010", email: "carla@terra.com",     status: "fechado",  origem: "indicacao",  interesse: "Fazenda 220ha",            responsavel: "Diego",   valor: 8900000, criadoEm: "2026-07-11", ultimoContato: "ontem" },
  { id: "L-1021", nome: "Diego Farias",    telefone: "(65) 99123-4455", email: "diego@yahoo.com",     status: "contato",  origem: "whatsapp",   interesse: "Lote loteamento Sol",      responsavel: "Marcos",  valor: 145000,  criadoEm: "2026-07-11", ultimoContato: "ontem" },
  { id: "L-1020", nome: "Eduarda Silva",   telefone: "(65) 99555-8877", email: "eduarda@hotmail.com", status: "novo",     origem: "portal",     interesse: "Apto 2 dorms",             responsavel: "Larissa", valor: 380000,  criadoEm: "2026-07-11", ultimoContato: "há 12 h" },
  { id: "L-1019", nome: "Felipe Costa",    telefone: "(65) 99333-1122", email: "felipe@outlook.com",  status: "proposta", origem: "site",       interesse: "Sítio 15ha",               responsavel: "Diego",   valor: 890000,  criadoEm: "2026-07-10", ultimoContato: "há 2 dias" },
  { id: "L-1018", nome: "Gabriela Nunes",  telefone: "(65) 99222-3344", email: "gabi@gmail.com",      status: "perdido",  origem: "instagram",  interesse: "Cobertura duplex",         responsavel: "Marcos",  valor: 2400000, criadoEm: "2026-07-09", ultimoContato: "há 3 dias" },
  { id: "L-1017", nome: "Henrique Rocha",  telefone: "(65) 99444-5566", email: "henrique@empresa.br", status: "visita",   origem: "indicacao",  interesse: "Sala comercial",           responsavel: "Larissa", valor: 420000,  criadoEm: "2026-07-09", ultimoContato: "há 3 dias" },
  { id: "L-1016", nome: "Isabela Prado",   telefone: "(65) 99555-6677", email: "isa@gmail.com",       status: "contato",  origem: "whatsapp",   interesse: "Apto na praia",            responsavel: "Diego",   valor: 620000,  criadoEm: "2026-07-08", ultimoContato: "há 4 dias" },
  { id: "L-1015", nome: "João Marques",    telefone: "(65) 99666-7788", email: "joao@corp.com",       status: "novo",     origem: "site",       interesse: "Terreno rural",            responsavel: "Marcos",  valor: 320000,  criadoEm: "2026-07-08", ultimoContato: "há 5 dias" },
];

export const funil = [
  { etapa: "Novo",     valor: 12, cor: "var(--color-chart-2)" },
  { etapa: "Contato",  valor: 24, cor: "var(--color-chart-2)" },
  { etapa: "Visita",   valor: 18, cor: "var(--color-chart-3)" },
  { etapa: "Proposta", valor: 9,  cor: "var(--color-chart-4)" },
  { etapa: "Fechado",  valor: 6,  cor: "var(--color-chart-1)" },
];

export const vendasSerie = [
  { mes: "Jan", vgv: 4.2, fechamentos: 3 },
  { mes: "Fev", vgv: 5.1, fechamentos: 4 },
  { mes: "Mar", vgv: 6.8, fechamentos: 5 },
  { mes: "Abr", vgv: 5.9, fechamentos: 4 },
  { mes: "Mai", vgv: 7.4, fechamentos: 6 },
  { mes: "Jun", vgv: 8.2, fechamentos: 7 },
  { mes: "Jul", vgv: 9.6, fechamentos: 9 },
];

export const tarefas = [
  { id: 1, titulo: "Retornar ligação — Ana Ribeiro",        vencimento: "hoje 14h",   prioridade: "alta"  as const, responsavel: "Marcos"  },
  { id: 2, titulo: "Enviar contrato — Bruno Alves",         vencimento: "hoje 16h",   prioridade: "alta"  as const, responsavel: "Larissa" },
  { id: 3, titulo: "Vistoria Rua das Flores, 128",          vencimento: "amanhã 9h",  prioridade: "media" as const, responsavel: "Diego"   },
  { id: 4, titulo: "Atualizar fotos do imóvel IMU-4421",    vencimento: "amanhã",     prioridade: "baixa" as const, responsavel: "Marcos"  },
  { id: 5, titulo: "Follow-up — Eduarda Silva",             vencimento: "sexta",      prioridade: "media" as const, responsavel: "Larissa" },
];

export const mensagens = [
  { id: 1, nome: "Ana Ribeiro",     canal: "whatsapp"  as const, previa: "Podemos remarcar para amanhã de manhã?",  quando: "há 2 min", naoLidas: 2, avatar: "AR" },
  { id: 2, nome: "Bruno Alves",     canal: "instagram" as const, previa: "Olá! Vi o anúncio da casa no Jardim...",  quando: "há 8 min", naoLidas: 1, avatar: "BA" },
  { id: 3, nome: "Diego Farias",    canal: "whatsapp"  as const, previa: "Recebi o boleto, obrigado!",                quando: "há 24 min", naoLidas: 0, avatar: "DF" },
  { id: 4, nome: "Portal ZAP",      canal: "portal"    as const, previa: "Novo lead: Interesse em apto 2 dorms",      quando: "há 1 h",  naoLidas: 1, avatar: "PZ" },
  { id: 5, nome: "Gabriela Nunes",  canal: "email"     as const, previa: "Segue documentação solicitada em anexo",    quando: "há 2 h",  naoLidas: 0, avatar: "GN" },
  { id: 6, nome: "Henrique Rocha",  canal: "whatsapp"  as const, previa: "Confirmado para quinta-feira 15h",           quando: "há 3 h",  naoLidas: 0, avatar: "HR" },
  { id: 7, nome: "Isabela Prado",   canal: "instagram" as const, previa: "Vocês têm mais fotos desse apartamento?",   quando: "ontem",   naoLidas: 0, avatar: "IP" },
];

export const emails = [
  { id: 1, remetente: "Cartório Central",   assunto: "Certidão pronta — Matrícula 44.221",       previa: "A certidão solicitada está disponível...",     quando: "09:42", naoLido: true  },
  { id: 2, remetente: "Banco do Brasil",    assunto: "Aprovação de financiamento — Bruno Alves", previa: "Comunicamos a aprovação do financiamento...",  quando: "08:15", naoLido: true  },
  { id: 3, remetente: "Portal ZAP Imóveis", assunto: "Relatório semanal de leads",               previa: "Você recebeu 24 novos leads esta semana...",   quando: "ontem", naoLido: false },
  { id: 4, remetente: "Ana Ribeiro",        assunto: "Re: Proposta apto Centro",                 previa: "Aceito a contraproposta, podemos fechar...",   quando: "ontem", naoLido: false },
  { id: 5, remetente: "Prefeitura Cuiabá",  assunto: "IPTU 2026 — 3 imóveis",                    previa: "Segue guia para pagamento consolidado...",     quando: "seg",   naoLido: false },
];

export const kanbanColunas = [
  { id: "novo",      titulo: "Novo",      cor: "var(--color-chart-2)" },
  { id: "contato",   titulo: "Contato",   cor: "var(--color-chart-2)" },
  { id: "visita",    titulo: "Visita",    cor: "var(--color-chart-3)" },
  { id: "proposta",  titulo: "Proposta",  cor: "var(--color-chart-4)" },
  { id: "fechado",   titulo: "Fechado",   cor: "var(--color-chart-1)" },
] as const;
