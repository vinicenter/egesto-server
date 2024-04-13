export namespace ConsultCnpjData {
  export interface Root {
    abertura: string;
    situacao: string;
    tipo: string;
    nome: string;
    porte: string;
    natureza_juridica: string;
    atividade_principal: Activitity[];
    atividades_secundarias: Activitity[];
    qsa: Qsa[];
    logradouro: string;
    numero: string;
    complemento: string;
    municipio: string;
    bairro: string;
    uf: string;
    cep: string;
    email: string;
    telefone: string;
    data_situacao: string;
    cnpj: string;
    ultima_atualizacao: string;
    status: string;
    fantasia: string;
    efr: string;
    motivo_situacao: string;
    situacao_especial: string;
    data_situacao_especial: string;
    capital_social: string;
    extra: unknown;
    billing: Billing;
  }

  export interface Activitity {
    code: string;
    text: string;
  }

  export interface Qsa {
    nome: string;
    qual: string;
  }

  export interface Billing {
    free: boolean;
    database: boolean;
  }
}
