import { useState, useEffect } from 'react';
import { adminApi } from '../../services/admin.api';
import { 
  Plus, 
  Search, 
  UserPlus, 
  Mail, 
  Phone, 
  Calendar,
  Loader2,
  MoreVertical,
  Edit2
} from 'lucide-react';

export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ first_name: '', last_name: '', student_id: '', email: '', phone: '' });

  useEffect(() => {
    async function load() {
      setLoading(true);
      const res = await adminApi.getStudents({ search });
      if (res.success) setStudents(res.data);
      setLoading(false);
    }
    load();
  }, [search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await adminApi.createStudent(form);
    if (res.success) {
      setStudents([res.data, ...students]);
      setShowModal(false);
      setForm({ first_name: '', last_name: '', student_id: '', email: '', phone: '' });
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Student Database</h1>
          <p className="text-sm text-slate-500">Official registry of Bungoma National Polytechnic students.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center gap-2 text-sm"
        >
          <UserPlus size={18} /> REGISTER STUDENT
        </button>
      </div>

      <div className="card p-4">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by ID, name, or email..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-lg text-sm focus:ring-2 focus:ring-primary/5 transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-20 text-center">
            <Loader2 className="animate-spin text-primary mx-auto mb-4" size={32} />
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Accessing Student Records...</p>
          </div>
        ) : students.length > 0 ? students.map(student => (
          <div key={student.id} className="card p-6 group hover:border-primary/20 transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-primary font-bold border-2 border-white shadow-sm group-hover:bg-primary group-hover:text-secondary transition-all">
                {student.first_name[0]}{student.last_name[0]}
              </div>
              <button className="p-2 text-slate-300 hover:text-slate-600 hover:bg-slate-50 rounded-lg">
                <MoreVertical size={18} />
              </button>
            </div>
            <div className="mb-4">
              <h3 className="font-bold text-slate-800 tracking-tight">{student.first_name} {student.last_name}</h3>
              <p className="text-xs font-mono text-slate-400 uppercase tracking-tighter">ID: {student.student_id}</p>
            </div>
            <div className="space-y-3 pt-4 border-t border-slate-50">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Mail size={14} className="text-slate-300" />
                {student.email || 'No email provided'}
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Phone size={14} className="text-slate-300" />
                {student.phone || 'No phone provided'}
              </div>
            </div>
          </div>
        )) : (
          <div className="col-span-full py-20 text-center">
             <Calendar size={48} className="text-slate-100 mx-auto mb-4" />
             <p className="text-slate-400 font-medium">No student records found.</p>
          </div>
        )}
      </div>

      {/* Register Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-6 z-50">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-10 animate-in zoom-in-95 duration-300">
            <div className="mb-8">
              <h2 className="text-2xl font-black text-slate-800">Register Student</h2>
              <p className="text-sm text-slate-500">Enter new student personal details.</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">First Name</label>
                  <input required className="input" value={form.first_name} onChange={e => setForm({...form, first_name: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Last Name</label>
                  <input required className="input" value={form.last_name} onChange={e => setForm({...form, last_name: e.target.value})} />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Student ID (Internal)</label>
                <input required className="input font-mono" placeholder="BC-2024-..." value={form.student_id} onChange={e => setForm({...form, student_id: e.target.value.toUpperCase()})} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                <input type="email" className="input" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
              </div>
              <div className="flex gap-4 pt-6">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-4 text-slate-400 font-bold text-xs uppercase tracking-widest hover:text-slate-600 transition-all">Cancel</button>
                <button type="submit" className="btn-primary flex-1">REGISTER</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .input {
          @apply w-full px-4 py-3 rounded-xl border border-slate-100 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all text-sm font-medium;
        }
      `}</style>
    </div>
  );
}
