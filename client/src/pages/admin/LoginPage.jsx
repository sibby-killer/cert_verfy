import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminApi } from '../../services/admin.api';
import { User, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await adminApi.login(username, password);
      if (res.success) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        navigate('/admin/dashboard');
      } else {
        setError('Invalid username or password');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-white rounded-2xl mx-auto shadow-2xl flex items-center justify-center font-black text-primary text-3xl mb-6">BNP</div>
          <h1 className="text-white text-3xl font-black uppercase tracking-tight">Admin Portal</h1>
          <p className="text-white/60 mt-2">Bungoma National Polytechnic</p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="p-8 md:p-10">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-danger text-sm font-bold flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-danger animate-pulse"></div>
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Username</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text" 
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-100 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all"
                    placeholder="Enter username"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-12 py-4 rounded-xl border border-slate-100 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all"
                    placeholder="Enter password"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button 
                disabled={loading}
                type="submit"
                className="w-full bg-primary text-secondary py-4 rounded-xl font-black text-lg shadow-xl hover:opacity-95 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" /> : 'LOGIN TO DASHBOARD'}
              </button>
            </form>
          </div>
          <div className="bg-slate-50 p-6 text-center border-t border-slate-100">
            <p className="text-xs text-slate-400 font-medium">Secured with 256-bit encryption</p>
          </div>
        </div>
      </div>
    </div>
  );
}
