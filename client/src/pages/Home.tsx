import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, TrendingUp, HomeIcon, Briefcase } from 'lucide-react';
import PopulationPyramid from '@/components/PopulationPyramid';
import SmartChart from '@/components/SmartChart';
import EscolaridadeChart from '@/components/EscolaridadeChart';
import DataTable from '@/components/DataTable';

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

interface TabelaRow {
  'Disponibilidade do Comerciante': string;
  'Número da Selagem': string;
  'Gênero': string;
  'Etnia / Cor': string;
  'Renda Média Mensal do Feirante': string;
}

export default function Home() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [piramideData, setPiramideData] = useState<PiramideData | null>(null);
  const [conjugeData, setConjugeData] = useState<ConjugeData | null>(null);
  const [piramideConjuge, setPiramideConjuge] = useState<PiramideData | null>(null);
  const [disponibilidade, setDisponibilidade] = useState<Record<string, number> | null>(null);
  const [tabelaDados, setTabelaDados] = useState<TabelaRow[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [aba, setAba] = useState<'titular' | 'conjuge' | 'tabela'>('titular');

  useEffect(() => {
    const basePath = import.meta.env.BASE_URL || '/';
    Promise.all([
      fetch(`${basePath}dashboard_data.json`).then(res => res.json()),
      fetch(`${basePath}piramide_etaria.json`).then(res => res.json()),
      fetch(`${basePath}dashboard_data_conjuge.json`).then(res => res.json()),
      fetch(`${basePath}piramide_etaria_conjuge.json`).then(res => res.json()),
      fetch(`${basePath}possui_conjuge.json`).then(res => res.json()),
      fetch(`${basePath}disponibilidade.json`).then(res => res.json()),
      fetch(`${basePath}tabela_dados_tratados.json`).then(res => res.json())
    ]).then(([dashData, pirData, conjData, pirConjData, possuiConjData, dispData, tabelaData]) => {
      setData(dashData);
      setPiramideData(pirData);
      setConjugeData(conjData);
      setPiramideConjuge(pirConjData);
      setDisponibilidade(dispData);
      setTabelaDados(tabelaData);
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

  // Normalizar "Não informado" para "NI"
  const normalizarChave = (chave: string) => {
    return chave.replace(/Não informado/gi, 'NI');
  };

  const generoData = toChartData(data.genero).map(item => ({
    ...item,
    name: normalizarChave(item.name)
  }));
  const etniaData = toChartData(data.etnia).map(item => ({
    ...item,
    name: normalizarChave(item.name)
  }));
  
  // Escolaridade com números
  const escolaridadeMap: Record<string, number> = {
    'Ensino Fundamental Incompleto': 1,
    'Ensino Fundamental Completo': 2,
    'Ensino Médio Incompleto': 3,
    'Ensino Médio Completo': 4,
    'Ensino Superior Incompleto': 5,
    'Ensino Superior Completo': 6,
    'Não informado': 7,
    'NI': 7
  };
  
  const escolaridadeData = toChartData(data.escolaridade)
    .map(item => ({
      name: item.name,
      value: item.value,
      numero: escolaridadeMap[item.name] || 0
    }))
    .sort((a, b) => a.numero - b.numero);
  
  const estadoCivilData = toChartData(data.estado_civil).map(item => ({
    ...item,
    name: normalizarChave(item.name)
  }));
  const moradiaData = toChartData(data.moradia).map(item => ({
    ...item,
    name: normalizarChave(item.name)
  }));
  const habitacaoData = toChartData(data.habitacao).map(item => ({
    ...item,
    name: normalizarChave(item.name)
  }));
  const ocupacaoEstabelecimentoData = toChartData(data.ocupacao_estabelecimento).map(item => ({
    ...item,
    name: normalizarChave(item.name)
  }));
  
  const cidadeData = Object.entries(data.cidade)
    .map(([name, value]) => ({ name: normalizarCidade(name), value }))
    .sort((a, b) => b.value - a.value)
    .reduce((acc: any[], curr) => {
      // Remover duplicatas mantendo o maior valor
      const existing = acc.find(item => item.name === curr.name);
      if (!existing) {
        acc.push(curr);
      }
      return acc;
    }, [])
    .slice(0, 10);
  
  const fontesRendaData = toChartData(data.fontes_renda).map(item => ({
    ...item,
    name: normalizarChave(item.name)
  }));
  const beneficiosData = toChartData(data.beneficios_governo).map(item => ({
    ...item,
    name: normalizarChave(item.name)
  }));
  const infraestruturaData = toChartData(data.infraestrutura).map(item => ({
    ...item,
    name: normalizarChave(item.name)
  }));
  const equipamentosData = toChartData(data.equipamentos).slice(0, 15);
  const tipoMercadoriaData = toChartData(data.tipo_mercadoria).slice(0, 12);
  const estruturaComercioData = toChartData(data.estrutura_comercio).map(item => ({
    ...item,
    name: normalizarChave(item.name)
  }));
  const funcionariosData = toChartData(
    Object.fromEntries(
      Object.entries(data.funcionarios as Record<string, number | string>)
        .filter(([key]) => key !== 'Média de funcionários')
    ) as Record<string, number>
  ).map(item => ({
    ...item,
    name: normalizarChave(item.name)
  }));
  const familiaData = toChartData(data.familia).map(item => ({
    ...item,
    name: normalizarChave(item.name)
  }));
  const meiData = toChartData(data.mei).map(item => ({
    ...item,
    name: normalizarChave(item.name)
  }));

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
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-white mb-2">Pesquisa Comerciantes Feira Central</h1>
          <p className="text-white">Pesquisa Completa com Comerciantes de Campina Grande</p>
        </div>
      </header>

      {/* Abas */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-8">
            <button
              onClick={() => setAba('titular')}
              className={`px-4 py-2 font-semibold border-b-2 transition ${
                aba === 'titular'
                  ? 'border-[#1B7D3F] text-[#1B7D3F]'
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              Titular do Imóvel ({data?.total_comerciantes || 0})
            </button>
            <button
              onClick={() => setAba('conjuge')}
              className={`px-4 py-2 font-semibold border-b-2 transition ${
                aba === 'conjuge'
                  ? 'border-[#1B7D3F] text-[#1B7D3F]'
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              Cônjuge/Companheiro ({conjugeData?.total_conjuge || 0})
            </button>
            <button
              onClick={() => setAba('tabela')}
              className={`px-4 py-2 font-semibold border-b-2 transition ${
                aba === 'tabela'
                  ? 'border-[#1B7D3F] text-[#1B7D3F]'
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              Tabela de Dados
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
                <SmartChart data={generoData} colors={COLORS} barColor="#1B7D3F" />
              </div>

              {/* Possui Cônjuge */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-bold text-[#1B7D3F] mb-4">Possui Cônjuge/Companheiro</h2>
                <SmartChart data={toChartData({ 'Sim': 501, 'Não': 348, 'NI': 10 })} colors={COLORS} barColor="#FFD700" />
              </div>
            </div>

            {/* Disponibilidade */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-bold text-[#1B7D3F] mb-4">Disponibilidade do Comerciante</h2>
                {disponibilidade && <SmartChart data={toChartData(disponibilidade)} colors={COLORS} barColor="#1B7D3F" />}
              </div>
              <div></div>
            </div>

            {/* Gráficos - Linha 1.5 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Etnia */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-bold text-[#1B7D3F] mb-4">Distribuição por Etnia</h2>
                <SmartChart data={etniaData} colors={COLORS} barColor="#FFD700" />
              </div>

              {/* Placeholder */}
              <div></div>
            </div>

            {/* Pirâmide Etária */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm mb-8">
              <h2 className="text-xl font-bold text-[#1B7D3F] mb-4">Distribuição por Faixa Etária</h2>
              <PopulationPyramid data={piramideData.piramide} naoInformado={piramideData.nao_informado} />
            </div>

            {/* Gráficos - Linha 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Estado Civil */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-bold text-[#1B7D3F] mb-4">Distribuição por Estado Civil</h2>
                <SmartChart data={estadoCivilData} colors={COLORS} barColor="#1B7D3F" />
              </div>

              {/* Escolaridade */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-bold text-[#1B7D3F] mb-4">Distribuição por Escolaridade</h2>
                <EscolaridadeChart data={escolaridadeData} />
              </div>
            </div>

            {/* Gráficos - Linha 3 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Moradia */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-bold text-[#1B7D3F] mb-4">Forma de Ocupação de Moradia</h2>
                <SmartChart data={moradiaData} colors={COLORS} barColor="#FFD700" />
              </div>

              {/* Habitação */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-bold text-[#1B7D3F] mb-4">Condição da Habitação</h2>
                <SmartChart data={habitacaoData} colors={COLORS} barColor="#1B7D3F" />
              </div>
            </div>

            {/* Gráficos - Linha 4 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Ocupação Estabelecimento */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-bold text-[#1B7D3F] mb-4">Forma de Ocupação do Estabelecimento</h2>
                <SmartChart data={ocupacaoEstabelecimentoData} colors={COLORS} barColor="#FFD700" />
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
                <SmartChart data={fontesRendaData} colors={COLORS} barColor="#1B7D3F" />
              </div>

              {/* Benefícios do Governo */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-bold text-[#1B7D3F] mb-4">Benefícios do Governo</h2>
                <SmartChart data={beneficiosData} colors={COLORS} barColor="#FFD700" />
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
                <SmartChart data={estruturaComercioData} colors={COLORS} barColor="#FFD700" />
              </div>
            </div>

            {/* Gráficos - Linha 8 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Funcionários */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-bold text-[#1B7D3F] mb-4">Funcionários</h2>
                <SmartChart data={equipamentosData} colors={COLORS} barColor="#FFD700" />
              </div>

              {/* Família */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-bold text-[#1B7D3F] mb-4">Composição Familiar (Crianças e Adolescentes)</h2>
                <SmartChart data={familiaData} colors={COLORS} barColor="#FFD700" />
              </div>
            </div>

            {/* MEI */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm mb-8">
              <h2 className="text-xl font-bold text-[#1B7D3F] mb-4">Cadastro MEI</h2>
                <SmartChart data={meiData} colors={COLORS} barColor="#1B7D3F" />
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
                <SmartChart data={funcionariosData} colors={COLORS} barColor="#1B7D3F" />
              </div>
            </div>

            {/* Pirâmide Etária Cônjuge */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm mb-8">
              <h2 className="text-xl font-bold text-[#1B7D3F] mb-4">Distribuição por Faixa Etária</h2>
              <PopulationPyramid data={piramideConjuge.piramide} naoInformado={piramideConjuge.nao_informado} />
            </div>
          </>
        )}

        {/* ABA TABELA */}
        {aba === 'tabela' && (
          <>
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm mb-8">
              <h2 className="text-xl font-bold text-[#1B7D3F] mb-4">Tabela de Dados Tratados</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-[#1B7D3F] text-white">
                      <th className="border border-gray-300 px-4 py-2 text-left">Disponibilidade</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Número da Selagem</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Gênero</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Etnia</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Renda Média Mensal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tabelaDados && tabelaDados.map((row, idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="border border-gray-300 px-4 py-2">{row['Disponibilidade do Comerciante']}</td>
                        <td className="border border-gray-300 px-4 py-2">{row['Número da Selagem']}</td>
                        <td className="border border-gray-300 px-4 py-2">{row['Gênero']}</td>
                        <td className="border border-gray-300 px-4 py-2">{row['Etnia / Cor']}</td>
                        <td className="border border-gray-300 px-4 py-2">{row['Renda Média Mensal do Feirante']}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-gray-600 text-sm mt-4">Total de registros: {tabelaDados?.length || 0}</p>
            </div>
          </>
        )}

        {/* Rodapé */}
        <footer className="bg-[#1B7D3F] border-t border-gray-200 py-8 text-center text-white text-sm">
          <p className="text-xs">Gerência de Desenvolvimento de Informações - GDI</p>
          <p className="text-xs mt-3">Desenvolvido por A. Matias, 2026</p>
        </footer>
      </main>
    </div>
  );
}
