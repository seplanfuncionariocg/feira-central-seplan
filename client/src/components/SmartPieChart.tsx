import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

interface PieData {
  name: string;
  value: number;
}

interface SmartPieChartProps {
  data: PieData[];
  colors: string[];
  maxCategoriesInChart?: number;
}

export default function SmartPieChart({ data, colors, maxCategoriesInChart = 3 }: SmartPieChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  // Se temos mais categorias que o limite, mostrar apenas as maiores no gráfico
  const chartData = data.length > maxCategoriesInChart 
    ? data.slice(0, maxCategoriesInChart)
    : data;

  const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name, value }: any) => {
    // Só mostrar labels para itens que representam mais de 5% do total
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

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const percentage = ((data.value / total) * 100).toFixed(1);
      return (
        <div className="bg-white p-3 border border-gray-300 rounded shadow-lg">
          <p className="text-sm font-semibold text-black">{data.name}</p>
          <p className="text-sm text-black font-medium">{data.value} ({percentage}%)</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={<CustomLabel />}
            outerRadius={80}
            fill="#1B7D3F"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>

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
