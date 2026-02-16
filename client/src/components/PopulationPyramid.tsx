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
  // Preparar dados para o gráfico (masculino negativo para ficar à esquerda)
  const chartData = data.map(item => ({
    faixa: item.faixa,
    masculino: -item.masculino,
    feminino: item.feminino,
    masculinoAbs: item.masculino,
    femininoAbs: item.feminino
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-300 rounded shadow-lg">
          <p className="text-sm font-semibold text-gray-800">{data.faixa}</p>
          <p className="text-sm text-[#1B7D3F]">Masculino: {data.masculinoAbs}</p>
          <p className="text-sm text-[#FFD700]">Feminino: {data.femininoAbs}</p>
        </div>
      );
    }
    return null;
  };

  const CustomXAxis = (props: any) => {
    const { x, y, payload } = props;
    const value = Math.abs(payload.value);
    return (
      <text 
        x={x} 
        y={y} 
        textAnchor={payload.value < 0 ? 'end' : 'start'}
        fill="#000000"
        fontSize={12}
        fontWeight={500}
      >
        {value}
      </text>
    );
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-center gap-8 mb-6">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-[#1B7D3F] rounded"></div>
          <span className="text-sm font-medium text-gray-800">Masculino</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-[#FFD700] rounded"></div>
          <span className="text-sm font-medium text-gray-800">Feminino</span>
        </div>
        {naoInformado > 0 && (
          <div className="text-sm text-gray-600">
            <span className="font-medium">Não informado:</span> {naoInformado}
          </div>
        )}
      </div>

      <ResponsiveContainer width="100%" height={350}>
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
          <XAxis 
            type="number" 
            tick={<CustomXAxis />}
            tickFormatter={(value) => Math.abs(value).toString()}
            stroke="#000000"
            style={{ fontSize: '12px', fontWeight: 500 }}
          />
          <YAxis 
            dataKey="faixa" 
            type="category" 
            width={90}
            tick={{ fill: '#000000', fontSize: 12, fontWeight: 500 }}
            stroke="#000000"
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="masculino" fill="#1B7D3F" radius={[0, 8, 8, 0]} />
          <Bar dataKey="feminino" fill="#FFD700" radius={[8, 0, 0, 8]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
