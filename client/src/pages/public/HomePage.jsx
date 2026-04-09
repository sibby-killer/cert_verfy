import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Hash, FileUp, ShieldCheck, Loader2, AlertCircle } from 'lucide-react';
import QRScanner from '../../components/public/QRScanner';
import { verifyByNumber, verifyByFile, verifyByQR } from '../../services/verify.api';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('number');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [secNum, setSecNum] = useState('');
  const [showScanner, setShowScanner] = useState(false);
  const navigate = useNavigate();

  const handleVerify = async (method, data) => {
    setLoading(true);
    setError(null);
    let response;

    try {
      if (method === 'number') response = await verifyByNumber(data);
      if (method === 'file') response = await verifyByFile(data);
      if (method === 'qr') response = await verifyByQR(data);

      if (response.success) {
        navigate('/result', { state: { result: response.data } });
      } else {
        setError(response.error || 'Verification failed');
      }
    } catch (err) {
      setError('A system error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const onFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) handleVerify('file', file);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-primary py-4 px-6 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-md flex items-center justify-center font-bold text-primary">BNP</div>
          <h1 className="text-white font-semibold text-lg hidden md:block">Certificate Verification Portal</h1>
        </div>
        <div className="bg-secondary/20 border border-secondary/30 px-3 py-1 rounded-full flex items-center gap-2">
          <div className="w-2 h-2 bg-secondary rounded-full animate-pulse"></div>
          <span className="text-secondary text-xs font-bold uppercase tracking-wider">Official Portal</span>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-12 md:py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black text-primary mb-4">Verify Certificate Authenticity</h2>
          <p className="text-slate-500 max-w-lg mx-auto">
            Enter the security number or scan the QR code printed on the official Bungoma National Polytechnic certificate.
          </p>
        </div>

        {/* Verification Card */}
        <div className="card max-w-xl mx-auto">
          {/* Tabs */}
          <div className="flex border-b border-slate-100 bg-slate-50/50">
            {[
              { id: 'qr', label: 'Scan QR', icon: Camera },
              { id: 'number', label: 'Security Number', icon: Hash },
              { id: 'file', label: 'Upload File', icon: FileUp },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setShowScanner(false); }}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-4 text-sm font-semibold transition-colors",
                  activeTab === tab.id ? "text-primary border-b-2 border-primary bg-white" : "text-slate-400 hover:text-slate-600"
                )}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-lg flex items-center gap-3 text-danger text-sm">
                <AlertCircle size={18} />
                {error}
              </div>
            )}

            {/* Tab: QR Scanner */}
            {activeTab === 'qr' && (
              <div className="space-y-6">
                {!showScanner ? (
                  <div className="text-center py-6">
                    <button 
                      onClick={() => setShowScanner(true)}
                      className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-4 hover:bg-slate-100 transition-colors group"
                    >
                      <Camera size={32} className="text-slate-400 group-hover:text-primary transition-colors" />
                    </button>
                    <p className="text-slate-600 font-medium">Tap to open camera scanner</p>
                  </div>
                ) : (
                  <QRScanner 
                    onScanSuccess={(data) => handleVerify('qr', data)}
                    onScanError={(err) => console.warn(err)}
                    onClose={() => setShowScanner(false)}
                  />
                )}
              </div>
            )}

            {/* Tab: Security Number */}
            {activeTab === 'number' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Certificate Security Number</label>
                  <input 
                    type="text" 
                    value={secNum}
                    onChange={(e) => setSecNum(e.target.value.toUpperCase())}
                    placeholder="e.g. BNP-2024-EE-00456-X7K"
                    className="w-full px-4 py-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-lg font-mono tracking-tight"
                  />
                </div>
                <button 
                  disabled={loading || !secNum}
                  onClick={() => handleVerify('number', secNum)}
                  className="btn-primary w-full flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="animate-spin" /> : 'VERIFY NOW →'}
                </button>
              </div>
            )}

            {/* Tab: Upload File */}
            {activeTab === 'file' && (
              <div className="space-y-6">
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-xl p-10 bg-slate-50/50 hover:bg-slate-50 transition-colors cursor-pointer relative">
                  <input 
                    type="file" 
                    accept=".json"
                    onChange={onFileUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer" 
                  />
                  <FileUp size={40} className="text-slate-300 mb-4" />
                  <p className="text-slate-600 font-medium mb-1">Drop .json certificate file here</p>
                  <p className="text-xs text-slate-400">or click to browse from device</p>
                </div>
                {loading && (
                  <div className="flex items-center justify-center gap-3 text-primary font-medium">
                    <Loader2 className="animate-spin" />
                    Verifying certificate...
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 py-10 px-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-4 text-slate-400 text-sm">
          <ShieldCheck size={16} />
          <span>Blockchain-ready verification powered by standard protocol</span>
        </div>
        <p className="text-slate-500 text-sm mb-4">© 2024 Bungoma National Polytechnic. All rights reserved.</p>
        <div className="flex items-center justify-center gap-1 text-sm">
          <span className="text-slate-400">⚠️ Spotted a fake?</span>
          <a href="/report" className="text-danger font-bold hover:underline">Report Forgery</a>
        </div>
      </footer>
    </div>
  );
}
