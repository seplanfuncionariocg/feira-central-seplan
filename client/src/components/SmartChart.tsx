import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ChartData {
  name: string;
  value: number;
}

interface SmartChartProps {
  data: ChartData[];
  colors: string[];
  title?: string;
}

export default function SmartChart({ data, colors }: SmartChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  // Se temos 3 ou menos categorias, usar gráfico de pizza
  // Se temos mais de 3, usar gráfico de barras
  const usePie = data.length <= 3;

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      const percentage = ((item.value / total) * 100).toFixed(1);
      return (
        <div className="bg-white p-3 border border-gray-300 rounded shadow-lg">
          <p className="text-sm font-semibold text-black">{item.name}</p>
          <p className="text-sm text-black font-medium">{item.value} ({percentage}%)</p>
        </div>
      );
    }
    return null;
  };

  const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name, value }: any) => {
    if (percent <= 0.05) return null;

    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="black" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={12}
        fontWeight={500}
      >
        {`${name}: ${value}`}
      </text>
    );
  };

  return (
    <div className="w-full">
      {usePie ? (
        // GRÁFICO DE PIZZA
        <>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={<CustomLabel />}
                outerRadius={80}
                fill="#1B7D3F"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </>
      ) : (
        // GRÁFICO DE BARRAS (para mais de 3 categorias)
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 80 }}>
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
              fill={colors[0]}
              radius={[8, 8, 0, 0]}
              label={{ position: 'top', fill: '#000000', fontSize: 12, fontWeight: 500 }}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}

      {/* Legenda em formato de tabela */}
      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <tbody>
            {data.map((item, index) => {
              const percentage = ((item.value / total) * 100).toFixed(1);
              return (
                <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-2 px-3">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-4 h-4 rounded" 
                        style={{ backgroundColor: colors[index % colors.length] }}
                      ></div>
                      <span className="text-black font-medium">{item.name}</span>
                    </div>
                  </td>
                  <td className="py-2 px-3 text-right text-black font-medium">{item.value}</td>
                  <td className="py-2 px-3 text-right text-gray-600">{percentage}%</td>
                </tr>
              );
            })}
            <tr className="bg-gray-50 font-semibold">
              <td className="py-2 px-3 text-black">Total</td>
              <td className="py-2 px-3 text-right text-black">{total}</td>
              <td className="py-2 px-3 text-right text-black">100%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
