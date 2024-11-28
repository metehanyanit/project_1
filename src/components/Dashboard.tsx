import React, { useMemo, useState } from 'react';
import { useStore } from '../store/useStore';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ScrollText, Book, Sword, Shield } from 'lucide-react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

interface SearchFilters {
  type: string[];
  source: string[];
  minLevel?: number;
  maxLevel?: number;
  searchTerm: string;
}

export function Dashboard() {
  const { data } = useStore();
  const [filters, setFilters] = useState<SearchFilters>({
    type: [],
    source: [],
    searchTerm: ''
  });

  const stats = useMemo(() => {
    const typeCount = data.reduce((acc, item) => {
      acc[item.type] = (acc[item.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const sourceCount = data.reduce((acc, item) => {
      acc[item.source] = (acc[item.source] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total: data.length,
      byType: Object.entries(typeCount).map(([name, value]) => ({ name, value })),
      bySource: Object.entries(sourceCount).map(([name, value]) => ({ name, value }))
    };
  }, [data]);

  if (data.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          icon={<ScrollText className="w-6 h-6" />}
          title="Total Entries"
          value={stats.total}
        />
        <StatCard
          icon={<Book className="w-6 h-6" />}
          title="Unique Types"
          value={stats.byType.length}
        />
        <StatCard
          icon={<Sword className="w-6 h-6" />}
          title="Most Common Type"
          value={stats.byType[0]?.name || 'N/A'}
        />
        <StatCard
          icon={<Shield className="w-6 h-6" />}
          title="Sources"
          value={stats.bySource.length}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Distribution by Type */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Distribution by Type</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.byType}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Source Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Source Distribution</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.bySource}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {stats.bySource.map((entry, index) => (
                    <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Entries Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold">Recent Entries</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.slice(0, 5).map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.source}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 truncate max-w-xs">{item.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, title, value }: { icon: React.ReactNode; title: string; value: string | number }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
          {icon}
        </div>
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-semibold">{value}</p>
        </div>
      </div>
    </div>
  );
}

function SearchBar() {
  const [filters, setFilters] = useState<SearchFilters>({
    type: [],
    source: [],
    searchTerm: ''
  });

  return (
    <div className="w-full max-w-6xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <div className="flex flex-col gap-4">
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search entities..."
            className="flex-1 px-4 py-2 border rounded-lg"
            onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
          />
          <select 
            multiple
            className="px-4 py-2 border rounded-lg"
            onChange={(e) => setFilters(prev => ({ 
              ...prev, 
              type: Array.from(e.target.selectedOptions, option => option.value)
            }))}
          >
            <option value="character">Characters</option>
            <option value="spell">Spells</option>
            <option value="item">Items</option>
          </select>
        </div>
        
        <div className="flex gap-4">
          <input
            type="number"
            placeholder="Min Level"
            className="w-32 px-4 py-2 border rounded-lg"
            onChange={(e) => setFilters(prev => ({ ...prev, minLevel: parseInt(e.target.value) }))}
          />
          <input
            type="number"
            placeholder="Max Level"
            className="w-32 px-4 py-2 border rounded-lg"
            onChange={(e) => setFilters(prev => ({ ...prev, maxLevel: parseInt(e.target.value) }))}
          />
        </div>
      </div>
    </div>
  );
}