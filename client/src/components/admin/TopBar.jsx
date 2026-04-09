import { Bell, Search, User, Menu } from 'lucide-react';

export default function TopBar() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-8 sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <button className="md:hidden p-2 hover:bg-slate-50 rounded-lg">
          <Menu size={20} className="text-slate-600" />
        </button>
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
          <input 
            type="text" 
            placeholder="Search records..." 
            className="pl-10 pr-4 py-2 bg-slate-50 border-none rounded-lg text-sm w-64 focus:ring-2 focus:ring-primary/5 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button className="relative p-2 text-slate-400 hover:bg-slate-50 rounded-full transition-all">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-danger rounded-full border-2 border-white"></span>
        </button>
        
        <div className="flex items-center gap-3 pl-6 border-l border-slate-100">
          <div className="text-right hidden sm:block">
            <div className="text-sm font-bold text-slate-900 leading-none">{user.fullName || 'Admin User'}</div>
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{user.role?.replace('_', ' ') || 'Staff'}</div>
          </div>
          <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-primary font-bold border-2 border-white shadow-sm">
            {user.username?.[0]?.toUpperCase() || 'A'}
          </div>
        </div>
      </div>
    </header>
  );
}
