import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';

interface PieData {
  name: string;
  value: number;
}

interface SmartPieChartProps {
  data: PieData[];
  colors: string[];
}

export default function SmartPieChart({ data, colors }: SmartPieChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  // Separar dados grandes e pequenos
  const largeItems = data.filter(item => (item.value / total) > 0.08);
  const smallItems = data.filter(item => (item.value / total) <= 0.08);

  const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name, value }: any) => {
    // Só mostrar labels para itens grandes (> 8%)
    if (percent <= 0.08) return null;

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
      <ResponsiveContainer width="100%" height={350}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={<CustomLabel />}
            outerRadius={100}
            fill="#1B7D3F"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            wrapperStyle={{ paddingTop: '20px' }}
            formatter={(value, entry: any) => {
              const item = entry?.payload;
              if (!item) return value;
              const percentage = ((item.value / total) * 100).toFixed(1);
              return `${item.name}: ${item.value} (${percentage}%)`;
            }}
            verticalAlign="bottom"
            height={36}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Legenda adicional para itens pequenos */}
      {smallItems.length > 0 && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-xs font-semibold text-black mb-2">Categorias com menor representação:</p>
          <div className="grid grid-cols-2 gap-2">
            {smallItems.map((item, index) => {
              const percentage = ((item.value / total) * 100).toFixed(1);
              return (
                <div key={index} className="text-xs text-black">
                  <span className="font-medium">{item.name}:</span> {item.value} ({percentage}%)
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
