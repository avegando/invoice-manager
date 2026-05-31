import { useParams, useNavigate, Link } from 'react-router-dom';
import { useInvoices } from '../context/InvoiceContext';
import { ArrowLeft, Pencil, Trash2, Printer } from 'lucide-react';
import StatusBadge from '../components/UI/StatusBadge';
import { formatCurrency, formatDate } from '../utils/format';
import type { InvoiceStatus } from '../types';

export default function InvoiceDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getInvoice, updateInvoice, deleteInvoice } = useInvoices();
  const inv = getInvoice(id!);

  if (!inv) return <div className="text-center py-20 text-slate-500">Rechnung nicht gefunden.</div>;

  const setStatus = (status: InvoiceStatus) => updateInvoice({ ...inv, status });

  const handleDelete = () => {
    if (confirm('Rechnung wirklich löschen?')) { deleteInvoice(inv.id); navigate('/invoices'); }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between no-print">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-surface-2 text-slate-400 transition-colors"><ArrowLeft size={18} /></button>
          <div><h1 className="text-xl font-bold text-slate-100">{inv.invoiceNumber}</h1><p className="text-slate-500 text-sm">{inv.description}</p></div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => window.print()} className="btn-secondary text-sm"><Printer size={16} />Drucken</button>
          <Link to={`/invoices/${inv.id}/edit`} className="btn-secondary text-sm"><Pencil size={16} />Bearbeiten</Link>
          <button onClick={handleDelete} className="px-3 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm font-medium flex items-center gap-2 transition-colors"><Trash2 size={16} />Löschen</button>
        </div>
      </div>

      <div className="card space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-100">{inv.invoiceNumber}</h2>
            <p className="text-slate-500 text-sm mt-1">{inv.description}</p>
          </div>
          <StatusBadge status={inv.status} />
        </div>

        <div className="grid grid-cols-2 gap-6 text-sm">
          <div><p className="text-xs text-slate-600 uppercase tracking-wide mb-2">Kunde</p>
            <p className="text-slate-200 font-medium">{inv.customer.name}</p>
            <p className="text-slate-500">{inv.customer.street}</p>
            <p className="text-slate-500">{inv.customer.zip} {inv.customer.city}</p>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between"><span className="text-slate-500">Ausgestellt</span><span className="text-slate-300">{formatDate(inv.issueDate)}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Fällig am</span><span className="text-slate-300">{formatDate(inv.dueDate)}</span></div>
          </div>
        </div>

        <table className="w-full text-sm border-t border-white/10 pt-4">
          <thead><tr className="text-xs text-slate-600 border-b border-white/10">
            <th className="py-2 text-left font-medium">Beschreibung</th>
            <th className="py-2 text-right font-medium">Menge</th>
            <th className="py-2 text-right font-medium">Einzelpreis</th>
            <th className="py-2 text-right font-medium">Gesamt</th>
          </tr></thead>
          <tbody className="divide-y divide-white/5">
            {inv.lineItems.map(item => (
              <tr key={item.id}>
                <td className="py-2.5 text-slate-300">{item.description}</td>
                <td className="py-2.5 text-right text-slate-500">{item.quantity}</td>
                <td className="py-2.5 text-right text-slate-500">{formatCurrency(item.unitPrice)}</td>
                <td className="py-2.5 text-right text-slate-200 font-medium">{formatCurrency(item.quantity * item.unitPrice)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="border-t border-white/10 pt-3 space-y-1 text-sm">
          <div className="flex justify-between text-slate-500"><span>Netto</span><span>{formatCurrency(inv.netTotal)}</span></div>
          <div className="flex justify-between text-slate-500"><span>MwSt. 19%</span><span>{formatCurrency(inv.vatAmount)}</span></div>
          <div className="flex justify-between font-bold text-slate-100 text-lg pt-2 border-t border-white/10"><span>Gesamtbetrag</span><span>{formatCurrency(inv.grossTotal)}</span></div>
        </div>

        <div className="border-t border-white/10 pt-4 no-print">
          <p className="text-xs text-slate-600 uppercase tracking-wide mb-2">Status ändern</p>
          <div className="flex gap-2">
            {(['paid', 'pending', 'overdue'] as InvoiceStatus[]).map(s => (
              <button key={s} onClick={() => setStatus(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                  inv.status === s ? 'bg-violet-600 text-white border-violet-500' : 'bg-surface-2 text-slate-400 border-white/10 hover:border-violet-500/50'
                }`}>
                {s === 'paid' ? 'Bezahlt' : s === 'pending' ? 'Offen' : 'Überfällig'}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
