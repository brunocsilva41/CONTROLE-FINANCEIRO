import { BarChart2, ChevronLeft, ChevronRight, LineChart, Moon, PieChart, Sun, TrendingDown, TrendingUp, Wallet } from 'lucide-react';
import { useState } from 'react';
import { DashboardCard } from './components/DashboardCard';
import { GraficoFinanceiro } from './components/GraficoFinanceiro';
import { ListaTransacoes } from './components/ListaTransacoes';
import { NovaTransacao } from './components/NovaTransacao';
import { useTheme } from './contexts/ThemeContext';
import { useTransacoes } from './hooks/useTransacoes';

function App() {
  const [modalAberto, setModalAberto] = useState(false);
  const [tipoGrafico, setTipoGrafico] = useState<'linha' | 'barra'>('linha');
  const [mesAtual, setMesAtual] = useState(new Date());
  const { transacoes, adicionarTransacao, removerTransacao } = useTransacoes();
  const { theme, toggleTheme } = useTheme();

  // Funções para navegação entre meses
  const navegarMes = (direcao: 'anterior' | 'proximo') => {
    setMesAtual(prev => {
      const novoMes = new Date(prev);
      if (direcao === 'anterior') {
        novoMes.setMonth(prev.getMonth() - 1);
      } else {
        novoMes.setMonth(prev.getMonth() + 1);
      }
      return novoMes;
    });
  };

  const irParaHoje = () => {
    setMesAtual(new Date());
  };

  // Filtrar transações do mês atual
  const transacoesDoMes = transacoes.filter(t => {
    const dataTransacao = new Date(t.data);
    return dataTransacao.getMonth() === mesAtual.getMonth() &&
           dataTransacao.getFullYear() === mesAtual.getFullYear();
  });

  // Calcular totais do mês atual
  const calcularTotal = (tipo: 'entrada' | 'saida') => {
    return transacoesDoMes
      .filter(t => t.tipo === tipo)
      .reduce((total, t) => total + t.valor, 0);
  };

  // Calcular dados do dia atual para os cards principais
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const transacoesHoje = transacoes.filter(t => {
    const dataTransacao = new Date(t.data);
    dataTransacao.setHours(0, 0, 0, 0);
    return dataTransacao.getTime() === hoje.getTime();
  });

  const entradasHoje = transacoesHoje
    .filter(t => t.tipo === 'entrada')
    .reduce((total, t) => total + t.valor, 0);

  const saidasHoje = transacoesHoje
    .filter(t => t.tipo === 'saida')
    .reduce((total, t) => total + t.valor, 0);

  const saldoHoje = entradasHoje - saidasHoje;

  // Calcular totais gerais (todos os tempos)
  const entradasTotal = transacoes
    .filter(t => t.tipo === 'entrada')
    .reduce((total, t) => total + t.valor, 0);

  const saidasTotal = transacoes
    .filter(t => t.tipo === 'saida')
    .reduce((total, t) => total + t.valor, 0);

  const saldoTotal = entradasTotal - saidasTotal;

  // Calcular totais do mês atual
  const entradasMes = calcularTotal('entrada');
  const saidasMes = calcularTotal('saida');
  const saldoMes = entradasMes - saidasMes;

  // Formatação do nome do mês
  const nomeMes = mesAtual.toLocaleDateString('pt-BR', {
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Controle Financeiro</h1>
          <div className="flex gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {theme === 'light' ? <Moon className="w-5 h-5 text-gray-800 dark:text-white" /> : <Sun className="w-5 h-5 text-gray-800 dark:text-white" />}
            </button>
            <button
              onClick={() => setTipoGrafico(tipo => tipo === 'linha' ? 'barra' : 'linha')}
              className="p-2 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {tipoGrafico === 'linha' ? <BarChart2 className="w-5 h-5 text-gray-800 dark:text-white" /> : <LineChart className="w-5 h-5 text-gray-800 dark:text-white" />}
            </button>
            <button
              onClick={() => setModalAberto(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Nova Transação
            </button>
          </div>
        </div>

        {/* Controles de navegação por mês */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navegarMes('anterior')}
                className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </button>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
                {nomeMes}
              </h2>
              <button
                onClick={() => navegarMes('proximo')}
                className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </button>
            </div>
            <button
              onClick={irParaHoje}
              className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                mesAtual.getMonth() === new Date().getMonth() &&
                mesAtual.getFullYear() === new Date().getFullYear()
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Hoje
            </button>
          </div>

          {/* Cards do mês atual */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
              <div className="text-sm text-gray-600 dark:text-gray-400">Entradas do Mês</div>
              <div className="text-lg font-semibold text-green-600 dark:text-green-400">
                R$ {entradasMes.toFixed(2)}
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
              <div className="text-sm text-gray-600 dark:text-gray-400">Saídas do Mês</div>
              <div className="text-lg font-semibold text-red-600 dark:text-red-400">
                R$ {saidasMes.toFixed(2)}
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
              <div className="text-sm text-gray-600 dark:text-gray-400">Saldo do Mês</div>
              <div className={`text-lg font-semibold ${
                saldoMes >= 0
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'
              }`}>
                R$ {saldoMes.toFixed(2)}
              </div>
            </div>
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
              mesAtual={mesAtual}
            />
          </div>
          <div className="lg:col-span-1">
            <ListaTransacoes
              transacoes={transacoes}
              onRemover={removerTransacao}
              mesAtual={mesAtual}
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
