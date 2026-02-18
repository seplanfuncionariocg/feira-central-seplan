import React, { useState, useMemo } from 'react';
import { Search, Download } from 'lucide-react';

interface DataTableProps {
  data: Record<string, any>[];
}

export default function DataTable({ data }: DataTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  // Colunas visíveis
  const columns = [
    'Disponibilidade do Comerciante',
    'Número da Selagem',
    'Gênero',
    'Etnia / Cor',
    'Data de Nascimento',
    'Renda Média Mensal do Feirante',
    'Possui Cônjuge/Companheiro',
    'Bairro',
    'Cidade',
    'Forma de Ocupação de Moradia',
    'Condição da Habitação?',
    'Estrutura do Comércio (Estabelecimento)',
    'Tipo de Mercadoria (Estabelecimento)',
    'Tem taxa de funcionamento? (Estabelecimento)',
    'Energia Elétrica? (Estabelecimento)',
    'Abastecimento de Água? (Estabelecimento)',
    'Unidade Sanitária (Estabelecimento)',
    'Coleta de Lixo (Estabelecimento)'
  ];

  // Filtrar e buscar
  const filteredData = useMemo(() => {
    return data.filter(row => {
      // Busca por termo
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = columns.some(col => 
          String(row[col] || '').toLowerCase().includes(searchLower)
        );
        if (!matchesSearch) return false;
      }

      // Filtros específicos
      for (const [col, value] of Object.entries(filters)) {
        if (value && String(row[col] || '') !== value) {
          return false;
        }
      }

      return true;
    });
  }, [data, searchTerm, filters]);

  // Ordenar
  const sortedData = useMemo(() => {
    if (!sortConfig) return filteredData;

    const sorted = [...filteredData].sort((a, b) => {
      const aVal = a[sortConfig.key] || '';
      const bVal = b[sortConfig.key] || '';

      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [filteredData, sortConfig]);

  // Obter valores únicos para filtros
  const getUniqueValues = (column: string) => {
    const values = new Set(data.map(row => row[column]));
    return Array.from(values).sort();
  };

  // Download CSV
  const downloadCSV = () => {
    const headers = columns;
    const rows = sortedData.map(row => 
      columns.map(col => {
        const value = row[col] || '';
        // Escapar aspas em CSV
        return `"${String(value).replace(/"/g, '""')}"`;
      }).join(',')
    );

    const csv = [headers.map(h => `"${h}"`).join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'feira_central_dados.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {/* Controles */}
      <div className="flex flex-col gap-4">
        {/* Busca */}
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar em todos os campos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B7D3F]"
          />
        </div>

        {/* Filtros */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <select
            value={filters['Disponibilidade do Comerciante'] || ''}
            onChange={(e) => setFilters({ ...filters, 'Disponibilidade do Comerciante': e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1B7D3F]"
          >
            <option value="">Todos - Disponibilidade</option>
            {getUniqueValues('Disponibilidade do Comerciante').map(val => (
              <option key={val} value={val}>{val}</option>
            ))}
          </select>

          <select
            value={filters['Gênero'] || ''}
            onChange={(e) => setFilters({ ...filters, 'Gênero': e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1B7D3F]"
          >
            <option value="">Todos - Gênero</option>
            {getUniqueValues('Gênero').map(val => (
              <option key={val} value={val}>{val}</option>
            ))}
          </select>

          <select
            value={filters['Cidade'] || ''}
            onChange={(e) => setFilters({ ...filters, 'Cidade': e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1B7D3F]"
          >
            <option value="">Todas - Cidades</option>
            {getUniqueValues('Cidade').map(val => (
              <option key={val} value={val}>{val}</option>
            ))}
          </select>

          <select
            value={filters['Renda Média Mensal do Feirante'] || ''}
            onChange={(e) => setFilters({ ...filters, 'Renda Média Mensal do Feirante': e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1B7D3F]"
          >
            <option value="">Todas - Rendas</option>
            {getUniqueValues('Renda Média Mensal do Feirante').map(val => (
              <option key={val} value={val}>{val}</option>
            ))}
          </select>
        </div>

        {/* Botão Download */}
        <button
          onClick={downloadCSV}
          className="flex items-center gap-2 px-4 py-2 bg-[#1B7D3F] text-white rounded-lg hover:bg-[#155a30] transition font-medium"
        >
          <Download className="w-4 h-4" />
          Download CSV ({sortedData.length} registros)
        </button>
      </div>

      {/* Tabela */}
      <div className="overflow-x-auto border border-gray-300 rounded-lg">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="bg-[#1B7D3F] text-white sticky top-0">
              {columns.map(col => (
                <th
                  key={col}
                  onClick={() => setSortConfig(
                    sortConfig?.key === col && sortConfig.direction === 'asc'
                      ? { key: col, direction: 'desc' }
                      : { key: col, direction: 'asc' }
                  )}
                  className="border border-gray-300 px-3 py-2 text-left cursor-pointer hover:bg-[#155a30] transition whitespace-nowrap"
                >
                  {col} {sortConfig?.key === col && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedData.map((row, idx) => (
              <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                {columns.map(col => (
                  <td key={col} className="border border-gray-300 px-3 py-2 text-gray-700">
                    {row[col] || 'NI'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Resumo */}
      <div className="text-sm text-gray-600">
        <p>Exibindo <strong>{sortedData.length}</strong> de <strong>{data.length}</strong> registros</p>
      </div>
    </div>
  );
}
