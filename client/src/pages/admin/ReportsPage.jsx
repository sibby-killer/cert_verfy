import { useState, useEffect } from 'react';
import { adminApi } from '../../services/admin.api';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  User, 
  MessageSquare, 
  Loader2,
  ChevronRight,
  ShieldCheck,
  ShieldAlert
} from 'lucide-react';
import { clsx } from 'clsx';

export default function ReportsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const [adminNotes, setAdminNotes] = useState('');

  useEffect(() => {
    async function load() {
      setLoading(true);
      const res = await adminApi.getReports();
      if (res.success) setReports(res.data.data);
      setLoading(false);
    }
    load();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    setLoading(true);
    const res = await adminApi.updateReport(id, { status, adminNotes });
    if (res.success) {
      setReports(reports.map(r => r.id === id ? res.data : r));
      setSelectedReport(null);
      setAdminNotes('');
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Forgery Incidents</h1>
          <p className="text-sm text-slate-500">Review and investigate reports from external employers.</p>
        </div>
        <div className="flex items-center gap-2">
           <span className="flex h-3 w-3 relative">
             <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-danger opacity-75"></span>
             <span className="relative inline-flex rounded-full h-3 w-3 bg-danger"></span>
           </span>
           <span className="text-[10px] font-black text-danger uppercase tracking-widest">Awaiting Review</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Reports List */}
        <div className="space-y-4">
           {loading && reports.length === 0 ? (
             <div className="py-20 text-center"><Loader2 className="animate-spin mx-auto text-primary" /></div>
           ) : reports.length > 0 ? reports.map(report => (
             <button 
               key={report.id}
               onClick={() => setSelectedReport(report)}
               className={clsx(
                 "w-full card p-6 text-left transition-all hover:border-primary/20 flex items-start gap-4",
                 selectedReport?.id === report.id ? "border-primary bg-primary/5 ring-1 ring-primary/5" : "border-slate-100"
               )}
             >
               <div className={clsx(
                 "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm",
                 report.status === 'pending' ? 'bg-red-50 text-danger' : 'bg-green-50 text-success'
               )}>
                  <AlertTriangle size={24} />
               </div>
               <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                       {new Date(report.submitted_at * 1000).toLocaleDateString()}
                     </span>
                     <span className={clsx(
                       "text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded",
                       report.status === 'pending' ? 'bg-danger text-white' : 'bg-success text-white'
                     )}>
                       {report.status}
                     </span>
                  </div>
                  <h4 className="font-bold text-slate-800 text-sm truncate uppercase tracking-tight">{report.certificate_number}</h4>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{report.description}</p>
               </div>
               <ChevronRight size={16} className="text-slate-300 mt-4" />
             </button>
           )) : (
             <div className="py-20 text-center text-slate-400">No forgery reports found.</div>
           )}
        </div>

        {/* Report Detail View */}
        <div className="sticky top-28 h-fit">
           {selectedReport ? (
             <div className="card overflow-hidden animate-in slide-in-from-right-4 duration-300">
                <div className="bg-slate-900 p-6 text-white">
                   <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Investigative View</h3>
                   <div className="text-xl font-bold tracking-tight mb-2">{selectedReport.certificate_number}</div>
                   <div className="flex items-center gap-2 text-xs text-slate-400">
                      <Clock size={14} /> Submitted {new Date(selectedReport.submitted_at * 1000).toLocaleString()}
                   </div>
                </div>
                <div className="p-8 space-y-8">
                   <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                      <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
                         <User size={14} /> Reporter Attribution
                      </div>
                      <div className="space-y-4">
                         <div className="flex justify-between">
                            <span className="text-xs text-slate-500">Name</span>
                            <span className="text-xs font-bold text-slate-800">{selectedReport.reporter_name || 'Anonymous'}</span>
                         </div>
                         <div className="flex justify-between">
                            <span className="text-xs text-slate-500">Contact</span>
                            <span className="text-xs font-bold text-slate-800">{selectedReport.reporter_contact || 'None Provided'}</span>
                         </div>
                      </div>
                   </div>

                   <div>
                      <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                         <MessageSquare size={14} /> Narrative
                      </div>
                      <div className="p-4 bg-red-50 rounded-xl border border-red-100 text-sm text-danger font-medium leading-relaxed italic">
                         "{selectedReport.description}"
                      </div>
                   </div>

                   <hr className="border-slate-50" />

                   <div className="space-y-4">
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Internal Resolution Notes</div>
                      <textarea 
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm focus:ring-2 focus:ring-primary/10 transition-all min-h-[100px]"
                        placeholder="Log findings, student contact, or revocation status..."
                        value={adminNotes}
                        onChange={(e) => setAdminNotes(e.target.value)}
                      />
                      <div className="grid grid-cols-2 gap-4 pt-4">
                        <button 
                          onClick={() => handleUpdateStatus(selectedReport.id, 'investigated')}
                          className="py-3 bg-slate-100 text-slate-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
                        >
                           <ShieldCheck size={14} /> Mark Investigated
                        </button>
                        <button 
                          onClick={() => handleUpdateStatus(selectedReport.id, 'forgery_confirmed')}
                          className="py-3 bg-danger text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:opacity-90 transition-all flex items-center justify-center gap-2"
                        >
                           <ShieldAlert size={14} /> Confirm Forgery
                        </button>
                      </div>
                   </div>
                </div>
             </div>
           ) : (
             <div className="h-[400px] border-2 border-dashed border-slate-100 rounded-3xl flex flex-col items-center justify-center text-slate-300 p-12 text-center">
                <ShieldCheck size={48} className="mb-4 opacity-20" />
                <p className="text-xs font-black uppercase tracking-widest">Select an incident to begin investigation</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
