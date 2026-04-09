import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Ban, ArrowLeft, Printer, RotateCcw, Phone, Mail, AlertTriangle, Building2, User } from 'lucide-react';
import { verifyByNumber } from '../../services/verify.api';

export default function ResultPage() {
  const { state } = useLocation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [data, setData] = useState(state?.result || null);
  const [loading, setLoading] = useState(!state?.result);

  useEffect(() => {
    async function fetchResult() {
      const certId = searchParams.get('cert');
      if (certId && !data) {
        const res = await verifyByNumber(certId);
        if (res.success) setData(res.data);
        else setData({ status: 'invalid' });
        setLoading(false);
      }
    }
    fetchResult();
  }, [searchParams, data]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-primary"></div>
    </div>
  );

  const status = data?.status || 'invalid';

  return (
    <div className="min-h-screen pb-20">
      {/* Banner */}
      <div className={`w-full py-12 px-6 text-center text-white shadow-xl ${
        status === 'valid' ? 'bg-success' : 
        status === 'revoked' ? 'bg-orange-500' : 'bg-danger'
      }`}>
        <div className="mb-4 flex justify-center">
          {status === 'valid' && <CheckCircle size={80} strokeWidth={1.5} />}
          {status === 'revoked' && <Ban size={80} strokeWidth={1.5} />}
          {status === 'invalid' && <XCircle size={80} strokeWidth={1.5} />}
        </div>
        <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-2">
          {status === 'valid' && 'Certificate is Genuine'}
          {status === 'revoked' && 'Certificate Has Been Revoked'}
          {status === 'invalid' && 'Certificate Not Found'}
        </h1>
        <p className="text-white/80 max-w-md mx-auto">
          {status === 'valid' && 'This certificate exists in official Bungoma National Polytechnic records'}
          {status === 'revoked' && 'This certificate was officially cancelled by the institution.'}
          {status === 'invalid' && 'This certificate does NOT exist in official records.'}
        </p>
      </div>

      <div className="max-w-2xl mx-auto px-6 -mt-8">
        {status === 'valid' ? (
          <div className="space-y-6">
            <div className="card p-8">
              <div className="flex items-center gap-3 mb-8 border-b border-slate-50 pb-4">
                <Building2 size={24} className="text-primary" />
                <h3 className="font-bold text-lg text-primary">Certificate Details</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                <DetailRow label="Full Name" value={data.studentName} icon={User} />
                <DetailRow label="Course" value={data.course} />
                <DetailRow label="Level" value={data.level} />
                <DetailRow label="Graduation Year" value={data.graduationYear} />
                <DetailRow label="Certificate Number" value={data.certNumber} isMono />
                <DetailRow label="Issued Date" value={data.issuedDate} />
                <DetailRow label="Issued By" value={data.issuedBy} isBold />
                <div className="md:col-span-2 mt-4 pt-6 border-t border-slate-50">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Digital Status</span>
                    <span className="badge-valid">VALID / GENUINE</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <button 
                onClick={() => window.print()}
                className="flex-1 btn-primary flex items-center justify-center gap-2"
              >
                <Printer size={18} /> PRINT RESULT
              </button>
              <button 
                onClick={() => navigate('/')}
                className="flex-1 bg-white border border-slate-200 text-slate-600 px-6 py-3 rounded-lg font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
              >
                <RotateCcw size={18} /> VERIFY ANOTHER
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="card p-8">
              <h3 className="font-bold text-lg text-slate-800 mb-6 flex items-center gap-2">
                <AlertTriangle size={20} className={status === 'revoked' ? 'text-orange-500' : 'text-danger'} />
                {status === 'revoked' ? 'Revocation Details' : 'What this could mean'}
              </h3>
              
              {status === 'revoked' ? (
                <div className="space-y-4">
                  <div className="p-4 bg-orange-50 border border-orange-100 rounded-lg">
                    <p className="text-xs font-bold text-orange-400 uppercase tracking-wider mb-1">Reason for Revocation</p>
                    <p className="text-orange-950 font-medium">{data?.reason || 'No reason provided.'}</p>
                  </div>
                  <div className="text-sm text-slate-500 italic">Revoked on: {data?.revokedAt ? new Date(data.revokedAt * 1000).toLocaleDateString() : 'N/A'}</div>
                </div>
              ) : (
                <ul className="space-y-4">
                  <li className="flex gap-3 text-slate-600">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 shrink-0"></div>
                    <p>This certificate may be forged or tampered with.</p>
                  </li>
                  <li className="flex gap-3 text-slate-600">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 shrink-0"></div>
                    <p>The security number was entered incorrectly.</p>
                  </li>
                  <li className="flex gap-3 text-slate-600">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 shrink-0"></div>
                    <p>The certificate predates this digital verification system.</p>
                  </li>
                </ul>
              )}
            </div>

            <div className="card p-8 bg-slate-900 border-none text-white">
              <h4 className="font-bold mb-4 uppercase text-xs tracking-widest text-slate-400">Official Contact</h4>
              <p className="text-sm text-slate-300 mb-6">If you believe this is an error, please contact the institution registrar directly.</p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-secondary font-medium">
                  <Phone size={18} /> +254 700 XXX XXX
                </div>
                <div className="flex items-center gap-3 text-secondary font-medium">
                  <Mail size={18} /> registrar@bungomapoly.ac.ke
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <button 
                onClick={() => navigate('/')}
                className="flex-1 btn-primary flex items-center justify-center gap-2"
              >
                <ArrowLeft size={18} /> TRY AGAIN
              </button>
              {status === 'invalid' && (
                <button 
                  onClick={() => navigate('/report')}
                  className="flex-1 bg-white border border-slate-200 text-danger px-6 py-3 rounded-lg font-bold hover:bg-red-50 transition-all flex items-center justify-center gap-2"
                >
                  <AlertTriangle size={18} /> REPORT FORGERY
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function DetailRow({ label, value, isMono, isBold, icon: Icon }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        {Icon && <Icon size={14} className="text-slate-400" />}
        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{label}</span>
      </div>
      <div className={`${isMono ? 'font-mono' : ''} ${isBold ? 'font-black' : 'font-semibold'} text-slate-800`}>
        {value || 'Not available'}
      </div>
    </div>
  );
}
