import { useState, useEffect } from 'react';
import { adminApi } from '../../services/admin.api';
import { 
  Building2, 
  Users, 
  Mail, 
  MapPin, 
  Phone, 
  ShieldCheck,
  UserPlus,
  Loader2,
  Lock,
  Globe,
  Camera
} from 'lucide-react';
import { clsx } from 'clsx';

export default function SettingsPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('users');
  const [showUserModal, setShowUserModal] = useState(false);
  const [userForm, setUserForm] = useState({ username: '', full_name: '', email: '', role: 'staff', password: '' });

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    if (activeTab === 'users') loadUsers();
  }, [activeTab]);

  async function loadUsers() {
    setLoading(true);
    const res = await adminApi.getUsers();
    if (res.success) setUsers(res.data);
    setLoading(false);
  }

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await adminApi.createUser(userForm);
    if (res.success) {
      loadUsers();
      setShowUserModal(false);
      setUserForm({ username: '', full_name: '', email: '', role: 'staff', password: '' });
    }
    setLoading(false);
  };

  const handleToggleUserStatus = async (user) => {
    const newStatus = user.is_active ? 0 : 1;
    const res = await adminApi.updateUser(user.id, { is_active: newStatus });
    if (res.success) loadUsers();
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">System Configuration</h1>
        <p className="text-slate-500">Manage portal identity and staff access levels.</p>
      </div>

      <div className="flex gap-8 flex-col lg:flex-row">
        {/* Navigation */}
        <div className="lg:w-64 shrink-0 space-y-2">
           <TabButton active={activeTab === 'institution'} onClick={() => setActiveTab('institution')} icon={Building2} label="Institution Profile" />
           <TabButton active={activeTab === 'users'} onClick={() => setActiveTab('users')} icon={Users} label="Staff Management" />
           <TabButton active={activeTab === 'security'} onClick={() => setActiveTab('security')} icon={ShieldCheck} label="Security Settings" />
        </div>

        {/* Content */}
        <div className="flex-1 space-y-8">
           {activeTab === 'institution' && (
             <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="card p-8">
                   <div className="flex items-center gap-6 mb-10">
                      <div className="w-24 h-24 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-300 hover:text-primary hover:bg-slate-100 transition-all cursor-pointer relative group">
                         <Camera size={24} />
                         <span className="text-[8px] font-black uppercase tracking-widest mt-2 group-hover:block hidden">Upload Logo</span>
                      </div>
                      <div>
                         <h3 className="text-xl font-black text-slate-800 tracking-tight">Institution Identity</h3>
                         <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-bold">Official details appearing on portal and certificates.</p>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <Field label="Full Institution Name" value="Bungoma National Polytechnic" />
                      <Field label="Postal Address" value="P.O. Box 1599 - 50200, Bungoma, Kenya" icon={MapPin} />
                      <Field label="Primary Contact Email" value="info@bungomapoly.ac.ke" icon={Mail} />
                      <Field label="Phone Registry" value="+254 700 000 000" icon={Phone} />
                      <Field label="Portal Domain" value="verify.bungomapoly.ac.ke" icon={Globe} />
                   </div>
                   
                   <div className="mt-10 pt-8 border-t border-slate-50">
                      <button className="btn-primary px-8">UPDATE PROFILE</button>
                   </div>
                </div>
             </div>
           )}

           {activeTab === 'users' && (
             <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="flex items-center justify-between">
                   <h3 className="text-lg font-bold text-slate-800">Portal Staff</h3>
                   <button onClick={() => setShowUserModal(true)} className="flex items-center gap-2 text-xs font-black text-primary uppercase tracking-widest hover:underline">
                      <UserPlus size={16} /> Add New User
                   </button>
                </div>

                <div className="card divide-y divide-slate-50">
                   {loading ? (
                     <div className="p-12 text-center"><Loader2 className="animate-spin mx-auto text-primary" /></div>
                   ) : users.map(user => (
                     <div key={user.id} className="p-6 flex items-center justify-between hover:bg-slate-50/50 transition-all">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-primary border border-slate-200 uppercase">
                              {user.username[0]}
                           </div>
                           <div>
                              <div className="font-bold text-slate-800 text-sm">{user.fullName}</div>
                              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{user.role.replace('_', ' ')} • {user.email}</div>
                           </div>
                        </div>
                        <div className="flex items-center gap-4">
                           <button 
                             onClick={() => handleToggleUserStatus(user)}
                             disabled={user.id === currentUser.id}
                             className={clsx(
                               "text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full transition-all border",
                               user.is_active ? "bg-green-50 text-success border-success/20 hover:bg-red-50 hover:text-danger hover:border-danger/20" : "bg-red-50 text-danger border-danger/20 hover:bg-green-50 hover:text-success hover:border-success/20",
                               user.id === currentUser.id && "opacity-30 cursor-not-allowed"
                             )}
                           >
                              {user.is_active ? 'ACTIVE' : 'DISABLED'}
                           </button>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
           )}
        </div>
      </div>

      {/* User Modal */}
      {showUserModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-6 z-50">
           <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-10 animate-in zoom-in-95 duration-300">
              <div className="mb-8">
                 <h2 className="text-2xl font-black text-slate-800">Add Staff Account</h2>
                 <p className="text-sm text-slate-500">Provide credentials for the new institution staff member.</p>
              </div>
              <form onSubmit={handleCreateUser} className="space-y-6">
                 <div className="grid grid-cols-2 gap-4">
                    <FieldInput label="Username" value={userForm.username} onChange={v => setUserForm({...userForm, username: v})} icon={Users} />
                    <FieldInput label="Role" type="select" value={userForm.role} onChange={v => setUserForm({...userForm, role: v})}>
                       <option value="registrar">Registrar</option>
                       <option value="principal">Principal</option>
                       <option value="staff">Standard Staff</option>
                       <option value="it_admin" disabled>IT Admin</option>
                    </FieldInput>
                 </div>
                 <FieldInput label="Full Name" value={userForm.full_name} onChange={v => setUserForm({...userForm, full_name: v})} />
                 <FieldInput label="Email Address" type="email" value={userForm.email} onChange={v => setUserForm({...userForm, email: v})} icon={Mail} />
                 <FieldInput label="Password" type="password" value={userForm.password} onChange={v => setUserForm({...userForm, password: v})} icon={Lock} />
                 
                 <div className="flex gap-4 pt-6">
                    <button type="button" onClick={() => setShowUserModal(false)} className="flex-1 py-4 text-slate-400 font-bold text-xs uppercase tracking-widest hover:text-slate-600 transition-all">Cancel</button>
                    <button type="submit" disabled={loading} className="btn-primary flex-1">
                       {loading ? <Loader2 className="animate-spin mx-auto" size={18} /> : 'CREATE USER'}
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
}

function TabButton({ active, icon: Icon, label, onClick }) {
  return (
    <button 
      onClick={onClick}
      className={clsx(
        "w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all text-sm",
        active ? "bg-primary text-secondary shadow-lg shadow-primary/10 pl-6" : "text-slate-400 hover:bg-white hover:text-slate-600"
      )}
    >
      <Icon size={20} />
      {label}
    </button>
  );
}

function Field({ label, value, icon: Icon }) {
  return (
    <div className="space-y-1">
       <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-2">
          {Icon && <Icon size={12} />} {label}
       </div>
       <div className="font-bold text-slate-700">{value}</div>
    </div>
  );
}

function FieldInput({ label, value, onChange, type = 'text', icon: Icon, children }) {
  return (
    <div className="space-y-1">
       <label className="text-[10px] font-black text-slate-300 uppercase tracking-widest ml-1">{label}</label>
       <div className="relative">
          {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />}
          {type === 'select' ? (
            <select className={clsx("w-full px-4 py-3 rounded-xl border border-slate-100 bg-slate-50 focus:ring-2 focus:ring-primary/10 transition-all text-sm font-medium", Icon && "pl-10")} value={value} onChange={e => onChange(e.target.value)}>
               {children}
            </select>
          ) : (
            <input 
              type={type} 
              className={clsx("w-full px-4 py-3 rounded-xl border border-slate-100 bg-slate-50 focus:ring-2 focus:ring-primary/10 transition-all text-sm font-medium", Icon && "pl-10")} 
              value={value} 
              onChange={e => onChange(e.target.value)} 
            />
          )}
       </div>
    </div>
  );
}
