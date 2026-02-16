import { useEffect, useState } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, TrendingUp, Home as HomeIcon, Briefcase } from 'lucide-react';

interface DashboardData {
  total_comerciantes: number;
  genero: Record<string, number>;
  etnia: Record<string, number>;
  faixa_etaria: Record<string, number>;
  escolaridade: Record<string, number>;
  estado_civil: Record<string, number>;
  renda_mensal: Record<string, number>;
  mei: Record<string, number>;
  beneficio_governo: Record<string, number>;
  fontes_renda: Record<string, number>;
  tipo_mercadoria: Record<string, number>;
  estrutura_comercio: Record<string, number>;
  ocupacao_estabelecimento: Record<string, number>;
  possui_funcionarios: Record<string, number>;
  equipamentos: Record<string, number>;
  infraestrutura: Record<string, number>;
  renda_stats: { media: number; mediana: number; min: number; max: number };
  renda_domiciliar_stats: { media: number; mediana: number; min: number; max: number };
  cidade: Record<string, number>;
  moradia: Record<string, number>;
  habitacao: Record<string, number>;
}

export default function Home() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/dashboard_data.json')
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Erro ao carregar dados:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1B7D3F] mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dados...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-600">Erro ao carregar dados</p>
      </div>
    );
  }

  // Preparar dados para gráficos
  const generoData = Object.entries(data.genero).map(([name, value]) => ({ name, value }));
  const faixaEtariaData = Object.entries(data.faixa_etaria).map(([name, value]) => ({ name, value }));
  const rendaMensalData = Object.entries(data.renda_mensal).map(([name, value]) => ({ name, value }));
  const equipamentosData = Object.entries(data.equipamentos).slice(0, 8).map(([name, value]) => ({ name, value }));
  const infraestruturaData = Object.entries(data.infraestrutura).map(([name, value]) => ({ name, value }));
  const cidadeData = Object.entries(data.cidade).map(([name, value]) => ({ name, value }));

  const COLORS = ['#1B7D3F', '#FFD700', '#156B32', '#FFC700', '#0F5C28'];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-[#1B7D3F] text-white py-6 px-4 shadow-md">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Dashboard Feira Central</h1>
          <p className="text-green-100">Pesquisa com Comerciantes de Campina Grande</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white border-2 border-[#1B7D3F] rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total de Comerciantes</p>
                <p className="text-3xl font-bold text-[#1B7D3F] mt-2">{data.total_comerciantes}</p>
              </div>
              <Users className="w-12 h-12 text-[#FFD700]" />
            </div>
          </div>

          <div className="bg-white border-2 border-[#FFD700] rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Renda Média Mensal</p>
                <p className="text-3xl font-bold text-[#1B7D3F] mt-2">R$ {data.renda_stats.media.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}</p>
              </div>
              <TrendingUp className="w-12 h-12 text-[#1B7D3F]" />
            </div>
          </div>

          <div className="bg-white border-2 border-[#1B7D3F] rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Possui MEI</p>
                <p className="text-3xl font-bold text-[#1B7D3F] mt-2">{data.mei['Sim'] || 0}</p>
              </div>
              <Briefcase className="w-12 h-12 text-[#FFD700]" />
            </div>
          </div>

          <div className="bg-white border-2 border-[#FFD700] rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Renda Domiciliar Média</p>
                <p className="text-3xl font-bold text-[#1B7D3F] mt-2">R$ {data.renda_domiciliar_stats.media.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}</p>
              </div>
              <HomeIcon className="w-12 h-12 text-[#1B7D3F]" />
            </div>
          </div>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Distribuição por Gênero */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-bold text-[#1B7D3F] mb-4">Distribuição por Gênero</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={generoData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#1B7D3F"
                  dataKey="value"
                >
                  {generoData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Faixa Etária */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-bold text-[#1B7D3F] mb-4">Distribuição por Faixa Etária</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={faixaEtariaData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#1B7D3F" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Renda Mensal */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-bold text-[#1B7D3F] mb-4">Distribuição de Renda Mensal</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={rendaMensalData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#FFD700" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Equipamentos Top 8 */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-bold text-[#1B7D3F] mb-4">Top 8 Equipamentos</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={equipamentosData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 200, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={190} />
                <Tooltip />
                <Bar dataKey="value" fill="#1B7D3F" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Infraestrutura */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-bold text-[#1B7D3F] mb-4">Infraestrutura dos Estabelecimentos</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={infraestruturaData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#156B32" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Cidades */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-bold text-[#1B7D3F] mb-4">Distribuição por Cidade</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={cidadeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#FFD700" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tabelas de Dados */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Etnia */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-bold text-[#1B7D3F] mb-4">Distribuição por Etnia</h2>
            <div className="space-y-2">
              {Object.entries(data.etnia).map(([name, value]) => (
                <div key={name} className="flex justify-between items-center pb-2 border-b border-gray-100">
                  <span className="text-gray-700">{name}</span>
                  <span className="font-bold text-[#1B7D3F]">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Escolaridade */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-bold text-[#1B7D3F] mb-4">Distribuição por Escolaridade</h2>
            <div className="space-y-2">
              {Object.entries(data.escolaridade).slice(0, 8).map(([name, value]) => (
                <div key={name} className="flex justify-between items-center pb-2 border-b border-gray-100">
                  <span className="text-gray-700 text-sm">{name}</span>
                  <span className="font-bold text-[#1B7D3F]">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Fontes de Renda */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-bold text-[#1B7D3F] mb-4">Fontes de Renda</h2>
            <div className="space-y-2">
              {Object.entries(data.fontes_renda).map(([name, value]) => (
                <div key={name} className="flex justify-between items-center pb-2 border-b border-gray-100">
                  <span className="text-gray-700">{name}</span>
                  <span className="font-bold text-[#1B7D3F]">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Forma de Ocupação */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-bold text-[#1B7D3F] mb-4">Forma de Ocupação do Estabelecimento</h2>
            <div className="space-y-2">
              {Object.entries(data.ocupacao_estabelecimento).map(([name, value]) => (
                <div key={name} className="flex justify-between items-center pb-2 border-b border-gray-100">
                  <span className="text-gray-700 text-sm">{name}</span>
                  <span className="font-bold text-[#1B7D3F]">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Rodapé */}
        <div className="bg-[#1B7D3F] text-white rounded-lg p-6 text-center">
          <p className="text-sm">Dashboard Feira Central - Pesquisa com Comerciantes de Campina Grande</p>
          <p className="text-xs text-green-100 mt-2">Dados processados e visualizados para análise e acompanhamento</p>
        </div>
      </main>
    </div>
  );
}
