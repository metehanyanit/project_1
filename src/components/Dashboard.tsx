import React, { useMemo, useState } from 'react';
import { useStore } from '../store/useStore';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ScrollText, Book, Sword, Shield, Terminal, StopCircle } from 'lucide-react';

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
    <div className="w-full space-y-8 mt-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          icon={<Scroll className="w-8 h-8 text-amber-700" />}
          title="Total Artifacts"
          value={stats.total}
          className="bg-gradient-to-br from-amber-50 to-amber-100 border-2 border-amber-200"
        />
        <StatCard
          icon={<Book className="w-8 h-8 text-emerald-700" />}
          title="Types of Lore"
          value={stats.byType.length}
          className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-2 border-emerald-200"
        />
        <StatCard
          icon={<Sword className="w-8 h-8 text-red-700" />}
          title="Most Common"
          value={stats.byType[0]?.name || 'N/A'}
          className="bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200"
        />
        <StatCard
          icon={<Shield className="w-8 h-8 text-blue-700" />}
          title="Sources"
          value={stats.bySource.length}
          className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200"
        />
      </div>

      {/* Charts with themed styling */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-parchment p-6 rounded-lg shadow-md border-2 border-amber-300">
          <h3 className="text-xl font-medieval text-amber-900 mb-4">Distribution of Artifacts</h3>
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

        <div className="bg-parchment p-6 rounded-lg shadow-md border-2 border-amber-300">
          <h3 className="text-xl font-medieval text-amber-900 mb-4">Source Origins</h3>
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
      <div className="bg-parchment rounded-lg shadow-md overflow-hidden border-2 border-amber-300">
        <div className="p-4 border-b border-amber-300 bg-gradient-to-r from-amber-100/50">
          <h3 className="text-xl font-medieval text-amber-900">Recent Discoveries</h3>
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

export function ProcessingTerminal() {
  const { processingLogs, isProcessing, setShouldStop, processedCount } = useStore();
  const terminalRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [processingLogs]);

  const handleStop = () => {
    setShouldStop(true);
  };

  if (!processingLogs.length) return null;

  return (
    <div className="w-full max-w-2xl mx-auto mt-4">
      <div className="bg-gray-900 rounded-lg shadow-lg overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2 bg-gray-800">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-mono text-gray-300">Processing Log</span>
          </div>
          {isProcessing && (
            <button
              onClick={handleStop}
              className="flex items-center gap-1 px-2 py-1 text-sm text-red-400 hover:text-red-300 transition-colors"
            >
              <StopCircle className="w-4 h-4" />
              Stop Processing
            </button>
          )}
        </div>
        <div className="px-4 py-2 bg-gray-800 border-t border-gray-700">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-300">
              Processed Items: <span className="text-green-400">{processedCount}</span>
            </span>
          </div>
        </div>
        <div 
          ref={terminalRef}
          className="p-4 h-48 overflow-y-auto font-mono text-sm"
        >
          {processingLogs.map((log, index) => (
            <div
              key={index}
              className={`mb-1 ${
                log.type === 'error' 
                  ? 'text-red-400' 
                  : log.type === 'success'
                    ? 'text-green-400'
                    : log.type === 'progress'
                      ? 'text-blue-400'
                      : 'text-gray-300'
              }`}
            >
              <span className="text-gray-500">[{log.timestamp}]</span>{' '}
              {log.message}
              {log.data && (
                <pre className="ml-4 text-xs text-gray-400 overflow-x-auto">
                  {JSON.stringify(log.data, null, 2)}
                </pre>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}