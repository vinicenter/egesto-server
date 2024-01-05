type PriceTableReportSpec = {
  ID: string;
  'Código do Produto': string;
  NCM: string;
  'Nome do Produto': string;
  'Peso do Produto': number;
  Família: string;
  Subfamília: string;
  Margem: number;
  Frete: number;
  Despesas: number;
  'Custo do Produto': number;
  Impostos: number;
  'Perda de Produção': number;
  'Preço de Venda': number;
};

type PriceTableReportColumn = keyof PriceTableReportSpec;

export type PriceTableReportData =
  PriceTableReportSpec[keyof PriceTableReportSpec][];

export type PriceTableReport = [
  PriceTableReportColumn[],
  ...PriceTableReportData,
];
