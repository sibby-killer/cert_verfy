import { useState, useEffect } from 'react';
import { adminApi } from '../../services/admin.api';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Trash2, 
  Ban, 
  ExternalLink,
  Loader2,
  Award,
  Calendar
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CertificatesPage() {
  const [certs, setCerts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      setLoading(true);
      const res = await adminApi.getCertificates({ page, search, limit: 10 });
      if (res.success) {
        setCerts(res.data);
        setTotal(res.total);
      }
      setLoading(false);
    }
    load();
  }, [page, search]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Certificate Registry</h1>
          <p className="text-sm text-slate-500">Manage, search, and revoke student certificates.</p>
        </div>
        <button 
          onClick={() => navigate('/admin/certificates/issue')}
          className="btn-primary flex items-center justify-center gap-2 text-sm"
        >
          <Plus size={18} /> ISSUE NEW CERTIFICATE
        </button>
      </div>

      {/* Filters */}
      <div className="card p-4 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by name, course, or security number..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-lg text-sm focus:ring-2 focus:ring-primary/5 focus:border-primary transition-all"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 text-slate-600 font-semibold border border-slate-100 rounded-lg hover:bg-slate-50 transition-all text-sm">
          <Filter size={18} /> Advanced Filter
        </button>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Student</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Course & Year</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Security ID</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-20 text-center">
                    <Loader2 className="animate-spin text-primary mx-auto mb-2" />
                    <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">Retrieving Registry...</span>
                  </td>
                </tr>
              ) : certs.length > 0 ? certs.map((cert) => (
                <tr key={cert.id} className="hover:bg-slate-50/50 transition-all group">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-800 text-sm whitespace-nowrap">{cert.studentName}</div>
                    <div className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter">Student ID: {cert.studentId}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-slate-600 text-sm whitespace-nowrap">
                      <Award size={14} className="text-secondary" />
                      {cert.course}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-tight">
                      <Calendar size={12} /> Class of {cert.graduationYear}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <code className="text-xs font-mono bg-slate-100 px-2 py-1 rounded text-slate-600">
                      {cert.securityNumber}
                    </code>
                  </td>
                  <td className="px-6 py-4">
                    {cert.status === 'valid' && <span className="badge-valid text-[10px] uppercase">Active</span>}
                    {cert.status === 'revoked' && <span className="badge-revoked text-[10px] uppercase">Revoked</span>}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                       <button 
                         title="Revoke Certificate" 
                         disabled={cert.status === 'revoked'}
                         className="p-2 text-slate-400 hover:text-danger hover:bg-danger/5 rounded-lg transition-all disabled:opacity-30"
                        >
                         <Ban size={18} />
                       </button>
                       <button 
                         title="View Details"
                         className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                       >
                         <ExternalLink size={18} />
                       </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="px-6 py-20 text-center">
                    <Award size={40} className="text-slate-100 mx-auto mb-4" />
                    <p className="text-slate-400 font-medium tracking-tight">No certificates found in the registry.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination placeholder */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/20 flex items-center justify-between">
           <span className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-2">Total: {total} Records</span>
           <div className="flex gap-2">
              <button 
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
                className="px-3 py-1 bg-white border border-slate-200 rounded text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
              >
                PREVIOUS
              </button>
              <button 
                disabled={certs.length < 10}
                onClick={() => setPage(p => p + 1)}
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
