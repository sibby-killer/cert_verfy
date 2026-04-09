import { useState, useEffect } from 'react';
import { adminApi } from '../../services/admin.api';
import { 
  Plus, 
  FileUp, 
  Search, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  Award,
  Users,
  Calendar,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function IssuePage() {
  const [activeMode, setActiveMode] = useState('single');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  // Single Issuance Form
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [studentSearch, setStudentSearch] = useState('');
  
  const [form, setForm] = useState({
    studentId: '',
    courseId: '',
    graduationDate: new Date().toISOString().split('T')[0],
    grade: 'PASS'
  });

  useEffect(() => {
    async function load() {
      const [sRes, cRes] = await Promise.all([
        adminApi.getStudents(),
        adminApi.getCourses()
      ]);
      if (sRes.success) {
        setStudents(sRes.data);
        setFilteredStudents(sRes.data);
      }
      if (cRes.success) setCourses(cRes.data);
    }
    load();
  }, []);

  useEffect(() => {
    setFilteredStudents(
      students.filter(s => 
        s.first_name.toLowerCase().includes(studentSearch.toLowerCase()) || 
        s.last_name.toLowerCase().includes(studentSearch.toLowerCase()) ||
        s.student_id.toLowerCase().includes(studentSearch.toLowerCase())
      )
    );
  }, [studentSearch, students]);

  const handleSingleIssue = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await adminApi.issueSingle(form);
    if (res.success) {
      setSuccess({
        message: 'Certificate issued successfully',
        data: res.data
      });
    } else {
      setError(res.error || 'Failed to issue certificate');
    }
    setLoading(false);
  };

  const handleBulkIssue = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append('file', file);

    const res = await adminApi.issueBulk(formData);
    if (res.success) {
      setSuccess({
        message: `Successfully processed ${res.data.processed} certificates`,
        data: res.data
      });
    } else {
      setError(res.error || 'Bulk processing failed');
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="h-[70vh] flex items-center justify-center animate-in zoom-in-95 duration-300">
        <div className="card max-w-md w-full p-10 text-center">
          <div className="flex justify-center mb-6">
            <CheckCircle2 size={72} className="text-success" strokeWidth={1.5} />
          </div>
          <h2 className="text-2xl font-black text-slate-800 mb-2">Issuance Complete</h2>
          <p className="text-slate-500 mb-8">{success.message}</p>
          <div className="space-y-3">
             <button onClick={() => { setSuccess(null); setStep(1); }} className="btn-primary w-full">ISSUE ANOTHER</button>
             <button onClick={() => navigate('/admin/certificates')} className="w-full py-3 text-slate-400 font-bold hover:text-slate-600 transition-all text-sm uppercase tracking-widest">Back to Registry</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Issue Certificate</h1>
        <p className="text-slate-500">Official academic credentials issuance center.</p>
      </div>

      <div className="card">
        <div className="flex border-b border-slate-100 bg-slate-50/50">
          <button 
            onClick={() => setActiveMode('single')}
            className={`flex-1 flex items-center justify-center gap-2 py-5 text-sm font-bold transition-all ${activeMode === 'single' ? 'text-primary bg-white border-b-2 border-primary' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <Plus size={18} /> SINGLE ISSUANCE
          </button>
          <button 
            onClick={() => setActiveMode('bulk')}
            className={`flex-1 flex items-center justify-center gap-2 py-5 text-sm font-bold transition-all ${activeMode === 'bulk' ? 'text-primary bg-white border-b-2 border-primary' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <FileUp size={18} /> BULK CSV UPLOAD
          </button>
        </div>

        <div className="p-8 md:p-10">
          {error && (
            <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-xl text-danger text-sm font-bold flex items-center gap-2">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          {activeMode === 'single' ? (
            <div className="space-y-8">
              {/* Step Indicator */}
              <div className="flex items-center gap-4">
                 {[1, 2, 3].map(i => (
                   <div key={i} className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${step >= i ? 'bg-primary text-secondary' : 'bg-slate-100 text-slate-400'}`}>
                        {i}
                      </div>
                      {i < 3 && <div className={`w-12 h-0.5 ${step > i ? 'bg-primary' : 'bg-slate-100'}`}></div>}
                   </div>
                 ))}
                 <span className="ml-4 text-xs font-black text-slate-400 uppercase tracking-widest">
                    {step === 1 && 'Select Student'}
                    {step === 2 && 'Academic Details'}
                    {step === 3 && 'Final Review'}
                 </span>
              </div>

              {step === 1 && (
                <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input 
                      type="text" 
                      placeholder="Search students by name or ID..." 
                      value={studentSearch}
                      onChange={(e) => setStudentSearch(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-100 bg-slate-50 focus:ring-2 focus:ring-primary/10 transition-all font-medium"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {filteredStudents.map(student => (
                      <button 
                        key={student.id}
                        onClick={() => { setForm({...form, studentId: student.id}); setStep(2); }}
                        className={`p-4 rounded-xl border text-left transition-all ${form.studentId === student.id ? 'border-primary bg-primary/5' : 'border-slate-100 hover:border-slate-300'}`}
                      >
                        <div className="font-bold text-slate-800">{student.first_name} {student.last_name}</div>
                        <div className="text-xs text-slate-400 flex items-center gap-1 mt-1 font-mono">
                           <Users size={12} /> {student.student_id}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Select Course</label>
                       <select 
                        required
                        className="w-full px-4 py-4 rounded-xl border border-slate-100 bg-slate-50 focus:ring-2 focus:ring-primary/10 transition-all font-medium text-slate-700"
                        value={form.courseId}
                        onChange={(e) => setForm({...form, courseId: e.target.value})}
                       >
                         <option value="">Choose Course...</option>
                         {courses.map(c => <option key={c.id} value={c.id}>{c.course_name} ({c.course_code})</option>)}
                       </select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Graduation Date</label>
                       <div className="relative">
                          <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                          <input 
                            type="date" 
                            className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-100 bg-slate-50 font-medium" 
                            value={form.graduationDate}
                            onChange={(e) => setForm({...form, graduationDate: e.target.value})}
                          />
                       </div>
                    </div>
                  </div>
                  <div className="flex justify-between pt-4">
                    <button onClick={() => setStep(1)} className="flex items-center gap-2 text-slate-400 font-bold hover:text-slate-600 transition-all text-xs tracking-widest uppercase">
                       <ChevronLeft size={16} /> Previous
                    </button>
                    <button 
                      disabled={!form.courseId || !form.graduationDate}
                      onClick={() => setStep(3)} 
                      className="btn-primary flex items-center gap-2 text-xs"
                    >
                       REVIEW DETAILS <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-8 animate-in slide-in-from-right-4 duration-300 text-center">
                   <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-400 mb-2">
                      <Award size={32} />
                   </div>
                   <div>
                      <h3 className="text-xl font-black text-slate-800">Final Confirmation</h3>
                      <p className="text-slate-500 mt-2">Please verify that all academic details are accurate before issuing. This action will be logged.</p>
                   </div>
                   <div className="flex flex-col gap-4 border-t border-b border-slate-50 py-6 max-w-sm mx-auto">
                      <div className="flex justify-between"><span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Student</span> <span className="text-sm font-bold text-slate-700">{students.find(s => s.id === form.studentId)?.first_name} {students.find(s => s.id === form.studentId)?.last_name}</span></div>
                      <div className="flex justify-between"><span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Course</span> <span className="text-sm font-bold text-slate-700">{courses.find(c => c.id === form.courseId)?.course_name}</span></div>
                      <div className="flex justify-between"><span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Year</span> <span className="text-sm font-bold text-slate-700">{new Date(form.graduationDate).getFullYear()}</span></div>
                   </div>
                   <div className="flex justify-between pt-4">
                    <button onClick={() => setStep(2)} className="flex items-center gap-2 text-slate-400 font-bold hover:text-slate-600 transition-all text-xs tracking-widest uppercase">
                       <ChevronLeft size={16} /> Previous
                    </button>
                    <button 
                      disabled={loading}
                      onClick={handleSingleIssue} 
                      className="btn-primary flex items-center gap-2 text-xs"
                    >
                       {loading ? <Loader2 className="animate-spin" /> : <>ISSUE CERTIFICATE <CheckCircle2 size={16} /></>}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="py-12 text-center space-y-8 animate-in fade-in duration-500">
               <div className="max-w-xs mx-auto p-12 bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl relative group hover:bg-slate-100 transition-all cursor-pointer">
                  <input 
                    type="file" 
                    accept=".csv"
                    onChange={handleBulkIssue}
                    className="absolute inset-0 opacity-0 cursor-pointer" 
                  />
                  <FileUp size={48} className="text-slate-300 mx-auto mb-4 group-hover:text-primary transition-colors" />
                  <p className="text-slate-600 font-bold">Drop CSV File Here</p>
                  <p className="text-xs text-slate-400 mt-1">or click to browse from system</p>
               </div>
               
               <div className="space-y-4 max-w-lg mx-auto bg-slate-50 p-6 rounded-2xl border border-slate-100/50">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center justify-center gap-2">
                    <AlertCircle size={14} /> Format Requirements
                  </h4>
                  <ul className="text-xs text-slate-500 space-y-2 text-left list-disc pl-4">
                     <li>First column must be <strong>student_id</strong> as registered in system.</li>
                     <li>Second column <strong>course_code</strong> (e.g., EE-2024).</li>
                     <li>Third column <strong>graduation_date</strong> (YYYY-MM-DD).</li>
                     <li>File must be standard UTF-8 encoded CSV.</li>
                  </ul>
                  <button className="text-primary font-bold text-xs hover:underline pt-2">Download Sample CSV Template</button>
               </div>

               {loading && (
                 <div className="flex items-center justify-center gap-3 text-primary font-bold animate-pulse">
                    <Loader2 className="animate-spin" size={24} />
                    <span className="uppercase tracking-widest text-xs">Processing Bulk Issuance...</span>
                 </div>
               )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
