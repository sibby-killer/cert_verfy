import { useState, useEffect } from 'react';
import { adminApi } from '../../services/admin.api';
import { 
  History, 
  Search, 
  Filter, 
  Calendar,
  Globe,
  Loader2,
  AlertCircle,
  Clock,
  ExternalLink
} from 'lucide-react';
import { clsx } from 'clsx';

export default function LogsPage() {
  const [logs, setLogs] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ page: 1, limit: 20 });

  useEffect(() => {
    async function load() {
      setLoading(true);
      const res = await adminApi.getLogs(filters);
      if (res.success) {
        setLogs(res.data.logs);
        setTotal(res.data.total);
      }
      setLoading(false);
    }
    load();
  }, [filters]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Digital Audit Trail</h1>
          <p className="text-sm text-slate-500">Every verification attempt is recorded with precise metadata.</p>
        </div>
        <div className="bg-white border border-slate-100 rounded-lg px-4 py-2 flex items-center gap-4 shadow-sm">
           <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-success"></div>
              <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Live monitoring Active</span>
           </div>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Timestamp</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">IP Address</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Method</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Ref Number</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-20 text-center">
                    <Loader2 className="animate-spin text-primary mx-auto mb-2" />
                    <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">Retrieving Log Stream...</span>
                  </td>
                </tr>
              ) : logs.length > 0 ? logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/50 transition-all text-sm">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 text-slate-700 font-medium">
                       <Clock size={14} className="text-slate-300" />
                       {new Date(log.timestamp * 1000).toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 text-slate-500 font-mono text-xs">
                       <Globe size={14} className="text-slate-300" />
                       {log.ip_address}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                      {log.method}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className={clsx(
                      "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter",
                      log.result === 'success' ? 'bg-green-50 text-success' : 'bg-red-50 text-danger'
                    )}>
                       {log.result === 'success' ? 'VALID' : 'FAILED'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-mono text-[10px] text-slate-400 max-w-[120px] truncate">
                       {log.security_number || 'N/A'}
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="px-6 py-20 text-center text-slate-400">
                    No activity logs found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 bg-slate-50/20 border-t border-slate-100 flex items-center justify-between">
           <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest ml-2">Displaying stream of {logs.length} events</span>
           <div className="flex gap-2">
              <button 
                disabled={filters.page === 1}
                onClick={() => setFilters({...filters, page: filters.page - 1})}
                className="px-3 py-1 bg-white border border-slate-200 rounded text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
              >
                PREVIOUS
              </button>
              <button 
                disabled={logs.length < filters.limit}
                onClick={() => setFilters({...filters, page: filters.page + 1})}
                className="px-3 py-1 bg-white border border-slate-200 rounded text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
              >
                NEXT
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
