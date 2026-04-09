import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Award, 
  Users, 
  BookOpen, 
  History, 
  AlertTriangle, 
  Settings, 
  LogOut, 
  ChevronRight
} from 'lucide-react';
import { clsx } from 'clsx';

export default function Sidebar() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const role = user.role || 'staff';

  const menuItems = [
    { id: 'dash', label: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard', roles: ['it_admin', 'registrar', 'principal', 'staff'] },
    { id: 'certs', label: 'Certificates', icon: Award, path: '/admin/certificates', roles: ['it_admin', 'registrar', 'principal'] },
    { id: 'students', label: 'Students', icon: Users, path: '/admin/students', roles: ['it_admin', 'registrar', 'principal'] },
    { id: 'courses', label: 'Courses', icon: BookOpen, path: '/admin/courses', roles: ['it_admin'] },
    { id: 'logs', label: 'Verification Logs', icon: History, path: '/admin/logs', roles: ['it_admin', 'registrar', 'principal', 'staff'] },
    { id: 'reports', label: 'Forgery Reports', icon: AlertTriangle, path: '/admin/reports', roles: ['it_admin', 'registrar', 'principal'] },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/admin/settings', roles: ['it_admin'] },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/admin/login';
  };

  const filteredItems = menuItems.filter(item => item.roles.includes(role));

  return (
    <aside className="w-64 bg-slate-900 h-screen sticky top-0 flex flex-col transition-all overflow-hidden hidden md:flex shrink-0">
      <div className="p-6 flex items-center gap-3 border-b border-white/5">
        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center font-black text-slate-900 text-sm">BNP</div>
        <span className="text-white font-bold tracking-tight">BNP Admin</span>
      </div>

      <nav className="flex-1 py-6 px-4 space-y-1">
        {filteredItems.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            className={({ isActive }) => clsx(
              "flex items-center gap-3 px-3 py-3 rounded-xl transition-all group",
              isActive 
                ? "bg-primary text-secondary" 
                : "text-slate-400 hover:text-white hover:bg-white/5"
            )}
          >
            <item.icon size={20} />
            <span className="font-semibold text-sm flex-1">{item.label}</span>
            <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-all translate-x-1" />
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-white/5">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-all font-semibold text-sm"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
