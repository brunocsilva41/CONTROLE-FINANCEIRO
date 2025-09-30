export interface Transacao {
  id: string;
  tipo: 'entrada' | 'saida';
  valor: number;
  categoria: string;
  descricao: string;
  data: Date;
}

export interface Categoria {
  id: string;
  nome: string;
  tipo: 'entrada' | 'saida';
  cor: string;
}

export interface ResumoFinanceiro {
  saldoTotal: number;
  entradasDiarias: number;
  saidasDiarias: number;
  saldoDiario: number;
}