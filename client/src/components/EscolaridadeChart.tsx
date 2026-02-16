import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface EscolaridadeData {
  name: string;
  value: number;
  numero: number;
}

interface EscolaridadeChartProps {
  data: EscolaridadeData[];
}

export default function EscolaridadeChart({ data }: EscolaridadeChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      const percentage = ((item.value / total) * 100).toFixed(1);
      return (
        <div className="bg-white p-3 border border-gray-300 rounded shadow-lg">
          <p className="text-sm font-semibold text-black">{item.numero} - {item.name}</p>
          <p className="text-sm text-black font-medium">{item.value} ({percentage}%)</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
          <XAxis 
            dataKey="numero" 
            tick={{ fill: '#000000', fontSize: 12, fontWeight: 500 }}
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

      {/* Legenda em formato de tabela */}
      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-xs border-collapse">
          <tbody>
            {data.map((item, index) => {
              const percentage = ((item.value / total) * 100).toFixed(1);
              return (
                <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-1 px-2">
                    <span className="text-black font-medium text-xs">{item.numero} - {item.name}</span>
                  </td>
                  <td className="py-1 px-2 text-right text-black font-medium text-xs">{item.value}</td>
                  <td className="py-1 px-2 text-right text-gray-600 text-xs">{percentage}%</td>
                </tr>
              );
            })}
            <tr className="bg-gray-50 font-semibold">
              <td className="py-1 px-2 text-black text-xs">Total</td>
              <td className="py-1 px-2 text-right text-black text-xs">{total}</td>
              <td className="py-1 px-2 text-right text-black text-xs">100%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
