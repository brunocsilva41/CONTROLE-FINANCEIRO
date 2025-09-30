import { useEffect, useState } from 'react';
import { Transacao } from '../types';

export function useTransacoes() {
  const [transacoes, setTransacoes] = useState<Transacao[]>(() => {
    const saved = localStorage.getItem('transacoes');
    if (saved) {
      return JSON.parse(saved).map((t: any) => ({
        ...t,
        data: new Date(t.data)
      }));
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('transacoes', JSON.stringify(transacoes));
  }, [transacoes]);

  const adicionarTransacao = (transacao: Omit<Transacao, 'id'>) => {
    const novaTransacao = {
      ...transacao,
      id: crypto.randomUUID()
    };
    setTransacoes(prev => [...prev, novaTransacao]);
  };

  const removerTransacao = (id: string) => {
    setTransacoes(prev => prev.filter(t => t.id !== id));
  };

  return {
    transacoes,
    adicionarTransacao,
    removerTransacao
  };
}