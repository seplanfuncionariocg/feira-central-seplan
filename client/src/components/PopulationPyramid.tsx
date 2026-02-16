import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

interface PyramidData {
  faixa: string;
  masculino: number;
  feminino: number;
}

interface PopulationPyramidProps {
  data: PyramidData[];
  naoInformado?: number;
}

export default function PopulationPyramid({ data, naoInformado = 0 }: PopulationPyramidProps) {
  // Preparar dados para o gráfico com barras lado a lado
  const chartData = data.map(item => ({
    faixa: item.faixa,
    masculino: item.masculino,
    feminino: item.feminino
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-300 rounded shadow-lg">
          <p className="text-sm font-semibold text-black">{payload[0].payload.faixa}</p>
          <p className="text-sm text-black font-medium">
            {payload[0].name}: {payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-center gap-8 mb-6">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-[#1B7D3F] rounded"></div>
          <span className="text-sm font-medium text-black">Masculino</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-[#FFD700] rounded"></div>
          <span className="text-sm font-medium text-black">Feminino</span>
        </div>
        {naoInformado > 0 && (
          <div className="text-sm text-black font-medium">
            NI: {naoInformado}
          </div>
        )}
      </div>

      <ResponsiveContainer width="100%" height={350}>
        <BarChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
          <XAxis 
            dataKey="faixa"
            tick={{ fill: '#000000', fontSize: 12, fontWeight: 500 }}
            stroke="#000000"
          />
          <YAxis 
            tick={{ fill: '#000000', fontSize: 12, fontWeight: 500 }}
            stroke="#000000"
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            dataKey="masculino" 
            name="Masculino"
            fill="#1B7D3F" 
            radius={[8, 0, 0, 8]}
            label={{ position: 'top', fill: '#000000', fontSize: 12, fontWeight: 500 }}
          />
          <Bar 
            dataKey="feminino" 
            name="Feminino"
            fill="#FFD700" 
            radius={[8, 0, 0, 8]}
            label={{ position: 'top', fill: '#000000', fontSize: 12, fontWeight: 500 }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
