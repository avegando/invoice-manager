import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FileText, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@demo.de');
  const [pw, setPw] = useState('admin123');
  const [show, setShow] = useState(false);
  const [err, setErr] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(email, pw)) navigate('/');
    else setErr('E-Mail oder Passwort falsch.');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex w-16 h-16 bg-violet-600/20 rounded-2xl items-center justify-center mb-4 border border-violet-500/30">
            <FileText size={32} className="text-violet-400" />
          </div>
          <h1 className="text-2xl font-bold text-slate-100">Invoice Manager</h1>
          <p className="text-slate-500 text-sm mt-1">Melde dich mit deinen Zugangsdaten an</p>
        </div>
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">E-Mail</label>
              <input className="input" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Passwort</label>
              <div className="relative">
                <input className="input pr-10" type={show ? 'text' : 'password'} value={pw} onChange={e => setPw(e.target.value)} required />
                <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            {err && <p className="text-red-400 text-sm">{err}</p>}
            <button type="submit" className="btn-primary w-full justify-center">Anmelden</button>
          </form>
          <div className="mt-4 pt-4 border-t border-white/10 text-center">
            <p className="text-xs text-slate-600">Demo: admin@demo.de / admin123</p>
          </div>
        </div>
      </div>
    </div>
  );
}
