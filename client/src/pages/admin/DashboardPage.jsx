import { useState, useEffect } from 'react';
import { adminApi } from '../../services/admin.api';
import { 
  Award, 
  Users, 
  AlertTriangle, 
  History, 
  ArrowUpRight, 
  ArrowDownRight,
  ShieldCheck,
  ShieldAlert,
  Loader2
} from 'lucide-react';
import { clsx } from 'clsx';

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await adminApi.getDashboard();
      if (res.success) setData(res.data);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return (
    <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin text-primary" size={40} />
      <p className="text-slate-400 font-medium animate-pulse uppercase tracking-widest text-[10px]">Loading Intelligence Dashboard</p>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Intelligence Dashboard</h1>
        <p className="text-slate-500 mt-1">Real-time overview of certificate verification and system security.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          label="Total Certificates" 
          value={data.stats.totalCertificates} 
          icon={Award} 
          trend="+12% from last month"
          color="primary"
        />
        <StatsCard 
          label="Verification Requests" 
          value={data.stats.totalVerifications} 
          icon={ShieldCheck} 
          trend="+85 today"
          color="success"
        />
        <StatsCard 
          label="Flagged Activities" 
          value={data.stats.failedVerifications} 
          icon={ShieldAlert} 
          trend="3 unusual spikes detect"
          color="warning"
        />
        <StatsCard 
          label="Forgery Reports" 
          value={data.stats.forgeryReports} 
          icon={AlertTriangle} 
          trend="2 pending review"
          color="danger"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Suspicious Activity */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <ShieldAlert size={20} className="text-danger" />
              Recent Flagged Activity
            </h3>
            <button className="text-primary text-sm font-bold hover:underline">View All Logs</button>
          </div>
          <div className="card divide-y divide-slate-50">
            {data.suspicious.length > 0 ? data.suspicious.map((log) => (
              <div key={log.id} className="p-4 flex items-center justify-between hover:bg-slate-50/50 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-danger">
                    <History size={18} />
                  </div>
                  <div>
                    <div className="font-bold text-slate-800 text-sm">{log.ip_address}</div>
                    <div className="text-xs text-slate-400">{log.method} • {new Date(log.timestamp * 1000).toLocaleString()}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="badge-invalid text-[10px] py-0.5 uppercase tracking-tighter">Suspicious</div>
                  <div className="text-[10px] text-slate-400 mt-1">Spike in {log.method} requests</div>
                </div>
              </div>
            )) : (
              <div className="p-12 text-center">
                <ShieldCheck size={40} className="text-slate-200 mx-auto mb-3" />
                <p className="text-slate-400 text-sm">No suspicious activity found at this time.</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats / Info */}
        <div className="space-y-4">
           <h3 className="text-lg font-bold text-slate-800">System Status</h3>
           <div className="card p-6 bg-slate-900 border-none text-white">
              <div className="space-y-6">
                 <div>
                    <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                       <span>Database Health</span>
                       <span className="text-success tracking-normal capitalize">Optimal</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                       <div className="w-[98%] h-full bg-success"></div>
                    </div>
                 </div>
                 <div>
                    <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                       <span>Verification Latency</span>
                       <span>45ms</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                       <div className="w-[85%] h-full bg-primary"></div>
                    </div>
                 </div>
                 <div className="pt-4 border-t border-white/5">
                    <p className="text-[10px] text-slate-400 leading-relaxed uppercase tracking-tight">
                       System is currently monitoring all DNS and IP traffic for Bungoma National Polytechnic Verification Portal.
                    </p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

function StatsCard({ label, value, icon: Icon, trend, color }) {
  const colors = {
    primary: "bg-primary/5 text-primary",
    success: "bg-success/5 text-success",
    warning: "bg-warning/5 text-warning",
    danger: "bg-danger/5 text-danger",
  };

  return (
    <div className="card p-6 group hover:border-primary/20 transition-all cursor-default relative overflow-hidden">
      <div className="flex items-start justify-between relative z-10">
        <div>
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
          <h4 className="text-3xl font-black text-slate-900 tracking-tight">{value.toLocaleString()}</h4>
          <p className={clsx("text-[10px] font-bold mt-2", trend.includes(' spikes') || trend.includes('spike') ? 'text-danger' : 'text-slate-400')}>
            {trend}
          </p>
        </div>
        <div className={clsx("w-12 h-12 rounded-xl flex items-center justify-center transition-all group-hover:scale-110 shadow-sm", colors[color])}>
          <Icon size={24} />
        </div>
      </div>
      
      {/* Decorative background shape */}
      <div className={clsx("absolute -right-4 -bottom-4 w-24 h-24 rounded-full opacity-[0.03] group-hover:scale-150 transition-all", colors[color].split(' ')[0])}></div>
    </div>
  );
}
