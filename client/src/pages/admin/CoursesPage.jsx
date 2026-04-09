import { useState, useEffect } from 'react';
import { adminApi } from '../../services/admin.api';
import { 
  BookOpen, 
  Plus, 
  Edit2, 
  Trash2, 
  Loader2,
  GraduationCap,
  Building2,
  Bookmark
} from 'lucide-react';

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ course_name: '', course_code: '', department: '', duration_years: 3, level: 'Diploma' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    const res = await adminApi.getCourses();
    if (res.success) setCourses(res.data);
    setLoading(false);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    let res;
    if (editingId) {
      res = await adminApi.updateCourse(editingId, form);
    } else {
      res = await adminApi.createCourse(form);
    }

    if (res.success) {
      load();
      setShowModal(false);
      setForm({ course_name: '', course_code: '', department: '', duration_years: 3, level: 'Diploma' });
      setEditingId(null);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Academic Programs</h1>
          <p className="text-sm text-slate-500">Configure courses and certificate metadata.</p>
        </div>
        <button 
          onClick={() => { setEditingId(null); setForm({ course_name: '', course_code: '', department: '', duration_years: 3, level: 'Diploma' }); setShowModal(true); }}
          className="btn-primary flex items-center gap-2 text-sm"
        >
          <Plus size={18} /> ADD NEW COURSE
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading && courses.length === 0 ? (
          <div className="col-span-full py-20 text-center"><Loader2 className="animate-spin mx-auto text-primary" /></div>
        ) : courses.length > 0 ? courses.map(course => (
          <div key={course.id} className="card p-6 flex flex-col justify-between group hover:border-primary/20 transition-all">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center text-secondary">
                  <BookOpen size={20} />
                </div>
                <div className="flex items-center gap-1">
                   <button 
                    onClick={() => { setEditingId(course.id); setForm(course); setShowModal(true); }}
                    className="p-2 text-slate-300 hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                   >
                     <Edit2 size={16} />
                   </button>
                   <button className="p-2 text-slate-300 hover:text-danger hover:bg-danger/5 rounded-lg transition-all">
                     <Trash2 size={16} />
                   </button>
                </div>
              </div>
              <h3 className="font-bold text-slate-800 leading-tight mb-1">{course.course_name}</h3>
              <div className="text-xs font-mono font-black text-primary uppercase tracking-tighter mb-4">{course.course_code}</div>
              
              <div className="space-y-2 pt-4 border-t border-slate-50">
                 <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <Building2 size={12} /> {course.department}
                 </div>
                 <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <GraduationCap size={12} /> {course.level} • {course.duration_years} Years
                 </div>
              </div>
            </div>
          </div>
        )) : (
          <div className="col-span-full py-20 text-center text-slate-400">No courses defined.</div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-6 z-50">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-10 animate-in zoom-in-95 duration-300">
             <div className="mb-8">
                <h2 className="text-2xl font-black text-slate-800">{editingId ? 'Edit Course' : 'Create New Course'}</h2>
                <p className="text-sm text-slate-500">Define academic program structure.</p>
             </div>
             <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-1">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Course Name</label>
                   <input required className="input" placeholder="e.g. Diploma in Electrical Engineering" value={form.course_name} onChange={e => setForm({...form, course_name: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-6">
                   <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Course Code</label>
                      <input required className="input font-mono" placeholder="EE-2024" value={form.course_code} onChange={e => setForm({...form, course_code: e.target.value.toUpperCase()})} />
                   </div>
                   <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Department</label>
                      <input required className="input" placeholder="Engineering" value={form.department} onChange={e => setForm({...form, department: e.target.value})} />
                   </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                   <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Level</label>
                      <select className="input" value={form.level} onChange={e => setForm({...form, level: e.target.value})}>
                         <option>Certificate</option>
                         <option>Diploma</option>
                         <option>Higher Diploma</option>
                      </select>
                   </div>
                   <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Duration (Years)</label>
                      <input type="number" step="1" className="input" value={form.duration_years} onChange={e => setForm({...form, duration_years: parseInt(e.target.value)})} />
                   </div>
                </div>
                <div className="flex gap-4 pt-6">
                   <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-4 text-slate-400 font-bold text-xs uppercase tracking-widest hover:text-slate-600 transition-all">Cancel</button>
                   <button type="submit" disabled={loading} className="btn-primary flex-1">
                      {loading ? <Loader2 className="animate-spin mx-auto" size={18} /> : (editingId ? 'UPDATE COURSE' : 'SAVE COURSE')}
                   </button>
                </div>
             </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .input {
          @apply w-full px-4 py-3 rounded-xl border border-slate-100 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all text-sm font-medium;
        }
      `}</style>
    </div>
  );
}
