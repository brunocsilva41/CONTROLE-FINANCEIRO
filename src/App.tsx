import React, { useState } from 'react';
import { Wallet, TrendingUp, TrendingDown, PieChart, BarChart2, LineChart } from 'lucide-react';
import { DashboardCard } from './components/DashboardCard';
import { ListaTransacoes } from './components/ListaTransacoes';
import { GraficoFinanceiro } from './components/GraficoFinanceiro';
import { NovaTransacao } from './components/NovaTransacao';
import { useTransacoes } from './hooks/useTransacoes';

function App() {
  const [modalAberto, setModalAberto] = useState(false);
  const [tipoGrafico, setTipoGrafico] = useState<'linha' | 'barra'>('linha');
  const { transacoes, adicionarTransacao, removerTransacao } = useTransacoes();

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const transacoesHoje = transacoes.filter(t => {
    const dataTransacao = new Date(t.data);
    dataTransacao.setHours(0, 0, 0, 0);
    return dataTransacao.getTime() === hoje.getTime();
  });

  const calcularTotal = (tipo: 'entrada' | 'saida', apenasHoje = false) => {
    const transacoesParaCalcular = apenasHoje ? transacoesHoje : transacoes;
    return transacoesParaCalcular
      .filter(t => t.tipo === tipo)
      .reduce((total, t) => total + t.valor, 0);
  };

  const entradasHoje = calcularTotal('entrada', true);
  const saidasHoje = calcularTotal('saida', true);
  const saldoHoje = entradasHoje - saidasHoje;

  const entradasTotal = calcularTotal('entrada');
  const saidasTotal = calcularTotal('saida');
  const saldoTotal = entradasTotal - saidasTotal;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Controle Financeiro</h1>
          <div className="flex gap-4">
            <button
              onClick={() => setTipoGrafico(tipo => tipo === 'linha' ? 'barra' : 'linha')}
              className="p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors"
            >
              {tipoGrafico === 'linha' ? <BarChart2 /> : <LineChart />}
            </button>
            <button
              onClick={() => setModalAberto(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Nova Transação
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <DashboardCard
            title="Saldo Total"
            value={`R$ ${saldoTotal.toFixed(2)}`}
            icon={Wallet}
            trend={{
              value: saldoTotal > 0 ? 100 : -100,
              isPositive: saldoTotal > 0
            }}
          />
          <DashboardCard
            title="Entradas Hoje"
            value={`R$ ${entradasHoje.toFixed(2)}`}
            icon={TrendingUp}
            trend={{
              value: entradasHoje > 0 ? 100 : 0,
              isPositive: true
            }}
          />
          <DashboardCard
            title="Saídas Hoje"
            value={`R$ ${saidasHoje.toFixed(2)}`}
            icon={TrendingDown}
            trend={{
              value: saidasHoje > 0 ? 100 : 0,
              isPositive: false
            }}
          />
          <DashboardCard
            title="Saldo Hoje"
            value={`R$ ${saldoHoje.toFixed(2)}`}
            icon={PieChart}
            trend={{
              value: saldoHoje > 0 ? 100 : -100,
              isPositive: saldoHoje > 0
            }}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <GraficoFinanceiro
              transacoes={transacoes}
              tipo={tipoGrafico}
            />
          </div>
          <div className="lg:col-span-1">
            <ListaTransacoes
              transacoes={transacoes}
              onRemover={removerTransacao}
            />
          </div>
        </div>
      </div>

      {modalAberto && (
        <NovaTransacao
          onAdicionar={adicionarTransacao}
          onFechar={() => setModalAberto(false)}
        />
      )}
    </div>
  );
}

export default App;