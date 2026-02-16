import { useEffect, useState } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter } from 'recharts';
import { Users, TrendingUp, HomeIcon, Briefcase } from 'lucide-react';

interface DashboardData {
  total_comerciantes: number;
  genero: Record<string, number>;
  etnia: Record<string, number>;
  faixa_etaria: Record<string, number>;
  escolaridade: Record<string, number>;
  estado_civil: Record<string, number>;
  moradia: Record<string, number>;
  habitacao: Record<string, number>;
  ocupacao_estabelecimento: Record<string, number>;
  cidade: Record<string, number>;
  fontes_renda: Record<string, number>;
  beneficios_governo: Record<string, number>;
  infraestrutura: Record<string, number>;
  equipamentos: Record<string, number>;
  equipamentos_total_por_comerciante: number;
  tipo_mercadoria: Record<string, number>;
  estrutura_comercio: Record<string, number>;
  funcionarios: Record<string, number | string>;
  familia: Record<string, number>;
  renda_stats: { media: number; mediana: number; min: number; max: number };
  renda_domiciliar_stats: { media: number; mediana: number; min: number; max: number };
  mei: Record<string, number>;
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

  const COLORS = ['#1B7D3F', '#FFD700', '#156B32', '#FFC700', '#0F5C28', '#2D9B5F', '#FFE066', '#1A6B35'];

  // Preparar dados para gráficos
  const toChartData = (obj: Record<string, number>) => 
    Object.entries(obj).map(([name, value]) => ({ name, value }));

  const generoData = toChartData(data.genero);
  const etniaData = toChartData(data.etnia);
  const faixaEtariaData = toChartData(data.faixa_etaria);
  const escolaridadeData = toChartData(data.escolaridade);
  const estadoCivilData = toChartData(data.estado_civil);
  const moradiaData = toChartData(data.moradia);
  const habitacaoData = toChartData(data.habitacao);
  const ocupacaoEstabelecimentoData = toChartData(data.ocupacao_estabelecimento);
  const cidadeData = toChartData(data.cidade).sort((a, b) => b.value - a.value).slice(0, 10);
  const fontesRendaData = toChartData(data.fontes_renda);
  const beneficiosData = toChartData(data.beneficios_governo);
  const infraestruturaData = toChartData(data.infraestrutura);
  const equipamentosData = toChartData(data.equipamentos).slice(0, 15);
  const tipoMercadoriaData = toChartData(data.tipo_mercadoria).slice(0, 12);
  const estruturaComercioData = toChartData(data.estrutura_comercio);
  const funcionariosData = toChartData(data.funcionarios as Record<string, number>);
  const familiaData = toChartData(data.familia);
  const meiData = toChartData(data.mei);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-[#1B7D3F] text-white py-6 px-4 shadow-md">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Dashboard Feira Central</h1>
          <p className="text-green-100">Pesquisa Completa com Comerciantes de Campina Grande</p>
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

        {/* Gráficos - Linha 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Gênero */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-bold text-[#1B7D3F] mb-4">Distribuição por Gênero</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={generoData} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name}: ${value}`} outerRadius={100} fill="#1B7D3F" dataKey="value">
                  {generoData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Etnia */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-bold text-[#1B7D3F] mb-4">Distribuição por Etnia</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={etniaData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#1B7D3F" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráficos - Linha 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Faixa Etária */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-bold text-[#1B7D3F] mb-4">Distribuição por Faixa Etária</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={faixaEtariaData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#FFD700" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Estado Civil */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-bold text-[#1B7D3F] mb-4">Distribuição por Estado Civil</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={estadoCivilData} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name}: ${value}`} outerRadius={100} fill="#1B7D3F" dataKey="value">
                  {estadoCivilData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráficos - Linha 3 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Escolaridade */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-bold text-[#1B7D3F] mb-4">Distribuição por Escolaridade</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={escolaridadeData} layout="vertical" margin={{ top: 5, right: 30, left: 200, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={190} />
                <Tooltip />
                <Bar dataKey="value" fill="#156B32" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Moradia */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-bold text-[#1B7D3F] mb-4">Forma de Ocupação de Moradia</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={moradiaData} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name}: ${value}`} outerRadius={100} fill="#1B7D3F" dataKey="value">
                  {moradiaData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráficos - Linha 4 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Habitação */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-bold text-[#1B7D3F] mb-4">Condição da Habitação</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={habitacaoData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#FFD700" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Ocupação Estabelecimento */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-bold text-[#1B7D3F] mb-4">Forma de Ocupação do Estabelecimento</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={ocupacaoEstabelecimentoData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#1B7D3F" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráficos - Linha 5 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Top 10 Cidades */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-bold text-[#1B7D3F] mb-4">Top 10 Cidades com Mais Comerciantes</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={cidadeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#156B32" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Fontes de Renda */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-bold text-[#1B7D3F] mb-4">Fontes de Renda</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={fontesRendaData} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name}: ${value}`} outerRadius={100} fill="#1B7D3F" dataKey="value">
                  {fontesRendaData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráficos - Linha 6 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Benefícios do Governo */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-bold text-[#1B7D3F] mb-4">Benefícios do Governo</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={beneficiosData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#FFD700" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Infraestrutura */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-bold text-[#1B7D3F] mb-4">Infraestrutura dos Estabelecimentos</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={infraestruturaData} layout="vertical" margin={{ top: 5, right: 30, left: 200, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={190} />
                <Tooltip />
                <Bar dataKey="value" fill="#1B7D3F" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráficos - Linha 7 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Top 15 Equipamentos */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-bold text-[#1B7D3F] mb-4">Top 15 Equipamentos</h2>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={equipamentosData} layout="vertical" margin={{ top: 5, right: 30, left: 150, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={140} />
                <Tooltip />
                <Bar dataKey="value" fill="#156B32" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Tipo de Mercadoria */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-bold text-[#1B7D3F] mb-4">Top 12 Tipos de Mercadoria</h2>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={tipoMercadoriaData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#FFD700" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráficos - Linha 8 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Estrutura do Comércio */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-bold text-[#1B7D3F] mb-4">Estrutura do Comércio</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={estruturaComercioData} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name}: ${value}`} outerRadius={100} fill="#1B7D3F" dataKey="value">
                  {estruturaComercioData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Funcionários */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-bold text-[#1B7D3F] mb-4">Funcionários</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={funcionariosData} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name}: ${value}`} outerRadius={100} fill="#1B7D3F" dataKey="value">
                  {funcionariosData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráficos - Linha 9 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Família */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-bold text-[#1B7D3F] mb-4">Composição Familiar (Crianças e Adolescentes)</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={familiaData} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name}: ${value}`} outerRadius={100} fill="#1B7D3F" dataKey="value">
                  {familiaData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* MEI */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-bold text-[#1B7D3F] mb-4">Cadastro MEI</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={meiData} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name}: ${value}`} outerRadius={100} fill="#1B7D3F" dataKey="value">
                  {meiData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Rodapé */}
        <div className="bg-[#1B7D3F] text-white rounded-lg p-6 text-center">
          <p className="text-sm">Dashboard Feira Central - Pesquisa Completa com Comerciantes de Campina Grande</p>
          <p className="text-xs text-green-100 mt-2">ETL Robusto | Limpeza de Dados | Análise Completa</p>
        </div>
      </main>
    </div>
  );
}
