import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, CheckCircle2, AlertCircle, ShieldAlert, Loader2 } from 'lucide-react';
import { submitReport } from '../../services/verify.api';

export default function ReportPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  
  const [form, setForm] = useState({
    reporterName: '',
    reporterContact: '',
    certificateNumber: '',
    description: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await submitReport(form);
      if (res.success) {
        setSuccess(true);
      } else {
        setError(res.error || 'Failed to submit report. Please try again.');
      }
    } catch (err) {
      setError('A system error occurred. Please call us directly.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="card max-w-md w-full p-10 text-center">
          <div className="flex justify-center mb-6">
            <CheckCircle2 size={72} className="text-success" strokeWidth={1.5} />
          </div>
          <h2 className="text-2xl font-black text-primary mb-4">Report Submitted Successfully</h2>
          <p className="text-slate-500 mb-8 leading-relaxed">
            Thank you for helping us maintain the integrity of our academic records. Our security team will investigate this report immediately.
          </p>
          <button 
            onClick={() => navigate('/')}
            className="btn-primary w-full"
          >
            RETURN TO HOME
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 py-6 px-6">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-slate-50 rounded-full transition-colors"
          >
            <ArrowLeft size={20} className="text-slate-600" />
          </button>
          <h1 className="text-xl font-black text-primary uppercase tracking-tight">Report forgeries</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 mt-12">
        <div className="mb-8">
          <h2 className="text-2xl font-black text-slate-800 mb-2">Suspicious Document Incident</h2>
          <p className="text-slate-500">Provide as much detail as possible about the suspicious certificate you encountered.</p>
        </div>

        <div className="card p-8 md:p-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-lg flex items-center gap-3 text-danger text-sm font-medium">
                <AlertCircle size={18} />
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="label">Your Name <span className="text-slate-400 font-normal italic">(optional)</span></label>
                <input 
                  type="text" 
                  className="input" 
                  placeholder="John Doe"
                  value={form.reporterName}
                  onChange={(e) => setForm({...form, reporterName: e.target.value})}
                />
              </div>
              <div>
                <label className="label">Contact Info <span className="text-slate-400 font-normal italic">(optional)</span></label>
                <input 
                  type="text" 
                  className="input" 
                  placeholder="Email or Phone"
                  value={form.reporterContact}
                  onChange={(e) => setForm({...form, reporterContact: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="label">Certificate Number <span className="text-danger">*</span></label>
              <input 
                required
                type="text" 
                className="input font-mono" 
                placeholder="BNP-XXXX-XX-XXXXX-XXX"
                value={form.certificateNumber}
                onChange={(e) => setForm({...form, certificateNumber: e.target.value.toUpperCase()})}
              />
            </div>

            <div>
              <label className="label">Incident Description <span className="text-danger">*</span></label>
              <textarea 
                required
                rows={5}
                className="input" 
                placeholder="Describe where and how you encountered this certificate. What makes it suspicious?"
                value={form.description}
                onChange={(e) => setForm({...form, description: e.target.value})}
              />
            </div>

            <button 
              disabled={loading}
              type="submit" 
              className="w-full bg-danger text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-red-700 transition-all shadow-lg active:scale-95 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" /> : <><Send size={18} /> SUBMIT INCIDENT REPORT</>}
            </button>
          </form>
        </div>

        <div className="mt-8 flex items-center gap-3 justify-center text-slate-400 text-xs font-medium uppercase tracking-widest">
          <ShieldAlert size={16} />
          <span>All reports are handled with absolute confidentiality</span>
        </div>
      </main>

      <style jsx>{`
        .label {
          @apply block text-xs font-black text-slate-400 uppercase tracking-widest mb-2.5;
        }
        .input {
          @apply w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50/30 focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary focus:bg-white transition-all text-slate-800 placeholder:text-slate-300;
        }
      `}</style>
    </div>
  );
}
