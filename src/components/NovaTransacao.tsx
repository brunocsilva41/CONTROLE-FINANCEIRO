import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { CATEGORIAS } from '../data/categorias';

interface NovaTransacaoProps {
  onAdicionar: (transacao: {
    tipo: 'entrada' | 'saida';
    valor: number;
    categoria: string;
    descricao: string;
    data: Date;
  }) => void;
  onFechar: () => void;
}

export function NovaTransacao({ onAdicionar, onFechar }: NovaTransacaoProps) {
  const [tipo, setTipo] = useState<'entrada' | 'saida'>('entrada');
  const [valor, setValor] = useState('');
  const [categoria, setCategoria] = useState('');
  const [descricao, setDescricao] = useState('');
  const [data, setData] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdicionar({
      tipo,
      valor: parseFloat(valor),
      categoria,
      descricao,
      data: new Date(data)
    });
    onFechar();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Nova Transação</h2>
          <button onClick={onFechar} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
            <X className="w-5 h-5 text-gray-900 dark:text-white" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-4">
            <button
              type="button"
              className={`flex-1 py-2 px-4 rounded-lg ${
                tipo === 'entrada'
                  ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
              onClick={() => setTipo('entrada')}
            >
              Entrada
            </button>
            <button
              type="button"
              className={`flex-1 py-2 px-4 rounded-lg ${
                tipo === 'saida'
                  ? 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
              onClick={() => setTipo('saida')}
            >
              Saída
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Valor
            </label>
            <input
              type="number"
              step="0.01"
              required
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="0,00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Categoria
            </label>
            <select
              required
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">Selecione uma categoria</option>
              {CATEGORIAS.filter(cat => cat.tipo === tipo).map(cat => (
                <option key={cat.id} value={cat.nome}>
                  {cat.nome}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Descrição
            </label>
            <input
              type="text"
              required
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Descrição da transação"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Data
            </label>
            <input
              type="date"
              required
              value={data}
              onChange={(e) => setData(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Adicionar Transação
          </button>
        </form>
      </div>
    </div>
  );
}