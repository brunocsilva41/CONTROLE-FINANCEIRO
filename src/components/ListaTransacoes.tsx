import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Trash2 } from 'lucide-react';
import type { Transacao } from '../types';

interface ListaTransacoesProps {
  transacoes: Transacao[];
  onRemover: (id: string) => void;
  mesAtual?: Date;
}

export function ListaTransacoes({ transacoes, onRemover, mesAtual }: ListaTransacoesProps) {
  // Filtrar transações do mês atual se mesAtual for fornecido
  const transacoesFiltradas = mesAtual
    ? transacoes.filter(t =>
        t.data.getMonth() === mesAtual.getMonth() &&
        t.data.getFullYear() === mesAtual.getFullYear()
      )
    : transacoes;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Transações Recentes</h2>
        <div className="mt-4 space-y-4">
          {transacoesFiltradas.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-4">
              Nenhuma transação registrada
            </p>
          ) : (
            transacoesFiltradas.map((transacao) => (
              <div
                key={transacao.id}
                className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg group"
              >
                <div className="flex items-center space-x-4">
                  <div
                    className={`p-2 rounded-lg ${
                      transacao.tipo === 'entrada'
                        ? 'bg-green-100 dark:bg-green-900/20'
                        : 'bg-red-100 dark:bg-red-900/20'
                    }`}
                  >
                    <span
                      className={`text-sm font-medium ${
                        transacao.tipo === 'entrada'
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-red-600 dark:text-red-400'
                      }`}
                    >
                      {transacao.tipo === 'entrada' ? '+' : '-'}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{transacao.descricao}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{transacao.categoria}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p
                      className={`font-medium ${
                        transacao.tipo === 'entrada'
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-red-600 dark:text-red-400'
                      }`}
                    >
                      R$ {transacao.valor.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {format(transacao.data, "dd 'de' MMMM", { locale: ptBR })}
                    </p>
                  </div>
                  <button
                    onClick={() => onRemover(transacao.id)}
                    className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-all"
                  >
                    <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
