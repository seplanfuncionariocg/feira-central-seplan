import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, TrendingUp, HomeIcon, Briefcase } from 'lucide-react';
import PopulationPyramid from '@/components/PopulationPyramid';
import SmartChart from '@/components/SmartChart';

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

interface PiramideData {
  piramide: Array<{ faixa: string; masculino: number; feminino: number }>;
  nao_informado: number;
}

interface ConjugeData {
  total_conjuge: number;
  genero: Record<string, number>;
  faixa_etaria: Record<string, number>;
  etnia: Record<string, number>;
}

export default function Home() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [piramideData, setPiramideData] = useState<PiramideData | null>(null);
  const [conjugeData, setConjugeData] = useState<ConjugeData | null>(null);
  const [piramideConjuge, setPiramideConjuge] = useState<PiramideData | null>(null);
  const [loading, setLoading] = useState(true);
  const [aba, setAba] = useState<'titular' | 'conjuge'>('titular');

  useEffect(() => {
    Promise.all([
      fetch('/dashboard_data.json').then(res => res.json()),
      fetch('/piramide_etaria.json').then(res => res.json()),
      fetch('/dashboard_data_conjuge.json').then(res => res.json()),
      fetch('/piramide_etaria_conjuge.json').then(res => res.json())
    ]).then(([dashData, pirData, conjData, pirConjData]) => {
      setData(dashData);
      setPiramideData(pirData);
      setConjugeData(conjData);
      setPiramideConjuge(pirConjData);
      setLoading(false);
    }).catch(err => {
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

  if (!data || !piramideData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-600">Erro ao carregar dados</p>
      </div>
    );
  }

  // Paleta de cores variada - Verde, Amarelo, Azul, Turquesa e outros tons
  const COLORS = [
    '#1B7D3F',      // Verde escuro (principal)
    '#FFD700',      // Amarelo (principal)
    '#0066CC',      // Azul
    '#00BCD4',      // Turquesa
    '#156B32',      // Verde médio
    '#FFC700',      // Amarelo médio
    '#0052A3',      // Azul escuro
    '#00ACC1',      // Turquesa escuro
    '#2D9B5F',      // Verde claro
    '#FFE066',      // Amarelo claro
    '#1E88E5',      // Azul claro
    '#26C6DA',      // Turquesa claro
  ];

  // Função para converter para dados de gráfico e ordenar por valor
  const toChartData = (obj: Record<string, number>, sort = true) => {
    let result = Object.entries(obj).map(([name, value]) => ({ name, value }));
    if (sort) {
      result = result.sort((a, b) => b.value - a.value);
    }
    return result;
  };

  // Normalizar nomes de cidades (CG -> Campina Grande)
  const normalizarCidade = (nome: string) => {
    if (nome === 'Cg') return 'Campina Grande';
    return nome;
  };

  const generoData = toChartData(data.genero);
  const etniaData = toChartData(data.etnia);
  const escolaridadeData = toChartData(data.escolaridade);
  const estadoCivilData = toChartData(data.estado_civil);
  const moradiaData = toChartData(data.moradia);
  const habitacaoData = toChartData(data.habitacao);
  const ocupacaoEstabelecimentoData = toChartData(data.ocupacao_estabelecimento);
  
  const cidadeData = Object.entries(data.cidade)
    .map(([name, value]) => ({ name: normalizarCidade(name), value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);
  
  const fontesRendaData = toChartData(data.fontes_renda);
  const beneficiosData = toChartData(data.beneficios_governo);
  const infraestruturaData = toChartData(data.infraestrutura);
  const equipamentosData = toChartData(data.equipamentos).slice(0, 15);
  const tipoMercadoriaData = toChartData(data.tipo_mercadoria).slice(0, 12);
  const estruturaComercioData = toChartData(data.estrutura_comercio);
  const funcionariosData = toChartData(data.funcionarios as Record<string, number>);
  const familiaData = toChartData(data.familia);
  const meiData = toChartData(data.mei);

  // Dados de cônjuge
  const generoConjugeData = conjugeData ? toChartData(conjugeData.genero) : [];
  const etniaConjugeData = conjugeData ? toChartData(conjugeData.etnia) : [];

  // Componente customizado para tooltip com texto preto
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-300 rounded shadow-lg">
          <p className="text-sm font-semibold text-black">{payload[0].payload.name}</p>
          <p className="text-sm text-black font-medium">{payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-[#1B7D3F] text-white py-6 px-4 shadow-md">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Dashboard Feira Central</h1>
          <p className="text-green-100">Pesquisa Completa com Comerciantes de Campina Grande</p>
        </div>
      </header>

      {/* Abas */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-8">
            <button
              onClick={() => setAba('titular')}
              className={`py-4 px-6 font-semibold border-b-2 transition-colors ${
                aba === 'titular'
                  ? 'border-[#1B7D3F] text-[#1B7D3F]'
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              Titular do Imóvel ({data.total_comerciantes})
            </button>
            <button
              onClick={() => setAba('conjuge')}
              className={`py-4 px-6 font-semibold border-b-2 transition-colors ${
                aba === 'conjuge'
                  ? 'border-[#1B7D3F] text-[#1B7D3F]'
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              Cônjuge/Companheiro ({conjugeData?.total_conjuge || 0})
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* ABA TITULAR */}
        {aba === 'titular' && (
          <>
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
                <SmartChart data={generoData} colors={COLORS} />
              </div>

              {/* Etnia */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-bold text-[#1B7D3F] mb-4">Distribuição por Etnia</h2>
                <SmartChart data={etniaData} colors={COLORS} />
              </div>
            </div>

            {/* Pirâmide Etária */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm mb-8">
              <h2 className="text-xl font-bold text-[#1B7D3F] mb-4">Distribuição por Faixa Etária (Pirâmide Populacional)</h2>
              <PopulationPyramid data={piramideData.piramide} naoInformado={piramideData.nao_informado} />
            </div>

            {/* Gráficos - Linha 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Estado Civil */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-bold text-[#1B7D3F] mb-4">Distribuição por Estado Civil</h2>
                <SmartChart data={estadoCivilData} colors={COLORS} />
              </div>

              {/* Escolaridade */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-bold text-[#1B7D3F] mb-4">Distribuição por Escolaridade</h2>
                <SmartChart data={escolaridadeData} colors={COLORS} />
              </div>
            </div>

            {/* Gráficos - Linha 3 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Moradia */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-bold text-[#1B7D3F] mb-4">Forma de Ocupação de Moradia</h2>
                <SmartChart data={moradiaData} colors={COLORS} />
              </div>

              {/* Habitação */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-bold text-[#1B7D3F] mb-4">Condição da Habitação</h2>
                <SmartChart data={habitacaoData} colors={COLORS} />
              </div>
            </div>

            {/* Gráficos - Linha 4 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Ocupação Estabelecimento */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-bold text-[#1B7D3F] mb-4">Forma de Ocupação do Estabelecimento</h2>
                <SmartChart data={ocupacaoEstabelecimentoData} colors={COLORS} />
              </div>

              {/* Top 10 Cidades */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-bold text-[#1B7D3F] mb-4">Top 10 Cidades com Mais Comerciantes</h2>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={cidadeData} margin={{ top: 5, right: 30, left: 0, bottom: 80 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
                    <XAxis 
                      dataKey="name" 
                      angle={-45} 
                      textAnchor="end" 
                      height={100}
                      tick={{ fill: '#000000', fontSize: 12, fontWeight: 500 }}
                      interval={0}
                    />
                    <YAxis tick={{ fill: '#000000', fontSize: 12, fontWeight: 500 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar 
                      dataKey="value" 
                      fill="#156B32" 
                      radius={[8, 8, 0, 0]}
                      label={{ position: 'top', fill: '#000000', fontSize: 12, fontWeight: 500 }}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Gráficos - Linha 5 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Fontes de Renda */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-bold text-[#1B7D3F] mb-4">Fontes de Renda</h2>
                <SmartChart data={fontesRendaData} colors={COLORS} />
              </div>

              {/* Benefícios do Governo */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-bold text-[#1B7D3F] mb-4">Benefícios do Governo</h2>
                <SmartChart data={beneficiosData} colors={COLORS} />
              </div>
            </div>

            {/* Gráficos - Linha 6 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Infraestrutura */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-bold text-[#1B7D3F] mb-4">Infraestrutura dos Estabelecimentos</h2>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={infraestruturaData} layout="vertical" margin={{ top: 5, right: 30, left: 200, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
                    <XAxis type="number" tick={{ fill: '#000000', fontSize: 12, fontWeight: 500 }} />
                    <YAxis dataKey="name" type="category" width={190} tick={{ fill: '#000000', fontSize: 11, fontWeight: 500 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar 
                      dataKey="value" 
                      fill="#1B7D3F" 
                      radius={[0, 8, 8, 0]}
                      label={{ position: 'right', fill: '#000000', fontSize: 12, fontWeight: 500 }}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Top 15 Equipamentos */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-bold text-[#1B7D3F] mb-4">Top 15 Equipamentos</h2>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={equipamentosData} layout="vertical" margin={{ top: 5, right: 30, left: 150, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
                    <XAxis type="number" tick={{ fill: '#000000', fontSize: 12, fontWeight: 500 }} />
                    <YAxis dataKey="name" type="category" width={140} tick={{ fill: '#000000', fontSize: 10, fontWeight: 500 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar 
                      dataKey="value" 
                      fill="#156B32" 
                      radius={[0, 8, 8, 0]}
                      label={{ position: 'right', fill: '#000000', fontSize: 12, fontWeight: 500 }}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Gráficos - Linha 7 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Tipo de Mercadoria */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-bold text-[#1B7D3F] mb-4">Top 12 Tipos de Mercadoria</h2>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={tipoMercadoriaData} margin={{ top: 5, right: 30, left: 0, bottom: 80 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
                    <XAxis 
                      dataKey="name" 
                      angle={-45} 
                      textAnchor="end" 
                      height={100}
                      tick={{ fill: '#000000', fontSize: 12, fontWeight: 500 }}
                      interval={0}
                    />
                    <YAxis tick={{ fill: '#000000', fontSize: 12, fontWeight: 500 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar 
                      dataKey="value" 
                      fill="#FFD700" 
                      radius={[8, 8, 0, 0]}
                      label={{ position: 'top', fill: '#000000', fontSize: 12, fontWeight: 500 }}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Estrutura do Comércio */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-bold text-[#1B7D3F] mb-4">Estrutura do Comércio</h2>
                <SmartChart data={estruturaComercioData} colors={COLORS} />
              </div>
            </div>

            {/* Gráficos - Linha 8 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Funcionários */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-bold text-[#1B7D3F] mb-4">Funcionários</h2>
                <SmartChart data={funcionariosData} colors={COLORS} />
              </div>

              {/* Família */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-bold text-[#1B7D3F] mb-4">Composição Familiar (Crianças e Adolescentes)</h2>
                <SmartChart data={familiaData} colors={COLORS} />
              </div>
            </div>

            {/* MEI */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm mb-8">
              <h2 className="text-xl font-bold text-[#1B7D3F] mb-4">Cadastro MEI</h2>
              <SmartChart data={meiData} colors={COLORS} />
            </div>
          </>
        )}

        {/* ABA CÔNJUGE */}
        {aba === 'conjuge' && conjugeData && piramideConjuge && (
          <>
            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-white border-2 border-[#1B7D3F] rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Total de Cônjuges</p>
                    <p className="text-3xl font-bold text-[#1B7D3F] mt-2">{conjugeData.total_conjuge}</p>
                  </div>
                  <Users className="w-12 h-12 text-[#FFD700]" />
                </div>
              </div>

              <div className="bg-white border-2 border-[#FFD700] rounded-lg p-6 shadow-sm">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Percentual do Total</p>
                  <p className="text-3xl font-bold text-[#1B7D3F] mt-2">{((conjugeData.total_conjuge / data.total_comerciantes) * 100).toFixed(1)}%</p>
                </div>
              </div>

              <div className="bg-white border-2 border-[#1B7D3F] rounded-lg p-6 shadow-sm">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Sem Cônjuge</p>
                  <p className="text-3xl font-bold text-[#1B7D3F] mt-2">{data.total_comerciantes - conjugeData.total_conjuge}</p>
                </div>
              </div>

              <div className="bg-white border-2 border-[#FFD700] rounded-lg p-6 shadow-sm">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Percentual sem Cônjuge</p>
                  <p className="text-3xl font-bold text-[#1B7D3F] mt-2">{(((data.total_comerciantes - conjugeData.total_conjuge) / data.total_comerciantes) * 100).toFixed(1)}%</p>
                </div>
              </div>
            </div>

            {/* Gráficos Cônjuge */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Gênero Cônjuge */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-bold text-[#1B7D3F] mb-4">Distribuição por Gênero</h2>
                <SmartChart data={generoConjugeData} colors={COLORS} />
              </div>

              {/* Etnia Cônjuge */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-bold text-[#1B7D3F] mb-4">Distribuição por Etnia</h2>
                <SmartChart data={etniaConjugeData} colors={COLORS} />
              </div>
            </div>

            {/* Pirâmide Etária Cônjuge */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm mb-8">
              <h2 className="text-xl font-bold text-[#1B7D3F] mb-4">Distribuição por Faixa Etária (Pirâmide Populacional)</h2>
              <PopulationPyramid data={piramideConjuge.piramide} naoInformado={piramideConjuge.nao_informado} />
            </div>
          </>
        )}

        {/* Rodapé */}
        <div className="bg-[#1B7D3F] text-white rounded-lg p-6 text-center">
          <p className="text-sm">Dashboard Feira Central - Pesquisa Completa com Comerciantes de Campina Grande</p>
          <p className="text-xs text-green-100 mt-2">ETL Robusto | Limpeza de Dados | Análise Completa</p>
          <p className="text-xs text-green-100 mt-3">Desenvolvido por Matias 2026</p>
        </div>
      </main>
    </div>
  );
}
