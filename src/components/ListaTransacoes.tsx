import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Trash2 } from 'lucide-react';
import type { Transacao } from '../types';

interface ListaTransacoesProps {
  transacoes: Transacao[];
  onRemover: (id: string) => void;
}

export function ListaTransacoes({ transacoes, onRemover }: ListaTransacoesProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="p-6">
        <h2 className="text-lg font-semibold">Transações Recentes</h2>
        <div className="mt-4 space-y-4">
          {transacoes.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              Nenhuma transação registrada
            </p>
          ) : (
            transacoes.map((transacao) => (
              <div
                key={transacao.id}
                className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg group"
              >
                <div className="flex items-center space-x-4">
                  <div
                    className={`p-2 rounded-lg ${
                      transacao.tipo === 'entrada'
                        ? 'bg-green-100'
                        : 'bg-red-100'
                    }`}
                  >
                    <span
                      className={`text-sm font-medium ${
                        transacao.tipo === 'entrada'
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}
                    >
                      {transacao.tipo === 'entrada' ? '+' : '-'}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">{transacao.descricao}</p>
                    <p className="text-sm text-gray-500">{transacao.categoria}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p
                      className={`font-medium ${
                        transacao.tipo === 'entrada'
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}
                    >
                      R$ {transacao.valor.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {format(transacao.data, "dd 'de' MMMM", { locale: ptBR })}
                    </p>
                  </div>
                  <button
                    onClick={() => onRemover(transacao.id)}
                    className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-100 rounded-lg transition-all"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
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