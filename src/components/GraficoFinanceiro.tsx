import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import type { Transacao } from '../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface GraficoFinanceiroProps {
  transacoes: Transacao[];
  tipo: 'linha' | 'barra';
  mesAtual?: Date;
}

export function GraficoFinanceiro({ transacoes, tipo, mesAtual }: GraficoFinanceiroProps) {
  // Filtrar transações do mês atual se mesAtual for fornecido
  const transacoesFiltradas = mesAtual
    ? transacoes.filter(t =>
        t.data.getMonth() === mesAtual.getMonth() &&
        t.data.getFullYear() === mesAtual.getFullYear()
      )
    : transacoes;

  const dadosPorDia = transacoesFiltradas.reduce((acc, transacao) => {
    const data = transacao.data.toISOString().split('T')[0];
    if (!acc[data]) {
      acc[data] = { entradas: 0, saidas: 0 };
    }
    if (transacao.tipo === 'entrada') {
      acc[data].entradas += transacao.valor;
    } else {
      acc[data].saidas += transacao.valor;
    }
    return acc;
  }, {} as Record<string, { entradas: number; saidas: number }>);

  const labels = Object.keys(dadosPorDia).sort();
  const dados = {
    labels,
    datasets: [
      {
        label: 'Entradas',
        data: labels.map(data => dadosPorDia[data].entradas),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.5)',
      },
      {
        label: 'Saídas',
        data: labels.map(data => dadosPorDia[data].saidas),
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
      },
    ],
  };

  const opcoes = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Visão Geral Financeira',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: string | number) => {
            const numValue = typeof value === 'string' ? parseFloat(value) : value;
            return `R$ ${numValue.toFixed(2)}`;
          },
        },
      },
    },
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
      <div className="mb-4">
        {tipo === 'linha' ? (
          <Line options={opcoes} data={dados} />
        ) : (
          <Bar options={opcoes} data={dados} />
        )}
      </div>
    </div>
  );
}
