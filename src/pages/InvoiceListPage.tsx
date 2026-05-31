import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useInvoices } from '../context/InvoiceContext';
import { PlusCircle, Search, Trash2, Eye } from 'lucide-react';
import StatusBadge from '../components/UI/StatusBadge';
import { formatCurrency, formatDate } from '../utils/format';
import type { InvoiceStatus } from '../types';

type Filter = 'all' | InvoiceStatus;

export default function InvoiceListPage() {
  const { invoices, deleteInvoice } = useInvoices();
  const [filter, setFilter] = useState<Filter>('all');
  const [q, setQ] = useState('');

  const filtered = useMemo(() =>
    invoices.filter(i =>
      (filter === 'all' || i.status === filter) &&
      (i.customer.name.toLowerCase().includes(q.toLowerCase()) || i.invoiceNumber.toLowerCase().includes(q.toLowerCase()))
    ), [invoices, filter, q]);

  const tabs: { value: Filter; label: string }[] = [
    { value: 'all', label: 'Alle' }, { value: 'paid', label: 'Bezahlt' },
    { value: 'pending', label: 'Offen' }, { value: 'overdue', label: 'Überfällig' },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-slate-100">Rechnungen</h1><p className="text-slate-500 text-sm">{invoices.length} Rechnungen gesamt</p></div>
        <Link to="/invoices/new" className="btn-primary"><PlusCircle size={16} />Neu</Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input className="input pl-9" placeholder="Suchen..." value={q} onChange={e => setQ(e.target.value)} />
        </div>
        <div className="flex gap-1 bg-surface rounded-lg p-1 border border-white/10">
          {tabs.map(t => (
            <button key={t.value} onClick={() => setFilter(t.value)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                filter === t.value ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}>{t.label}</button>
          ))}
        </div>
      </div>

      <div className="card p-0 overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="text-left text-xs text-slate-600 border-b border-white/10 bg-surface-2">
            {['Nummer', 'Kunde', 'Betrag', 'Ausgestellt', 'Fällig', 'Status', ''].map(h => (
              <th key={h} className="px-4 py-3 font-medium">{h}</th>
            ))}
          </tr></thead>
          <tbody className="divide-y divide-white/5">
            {filtered.length === 0 && <tr><td colSpan={7} className="px-4 py-8 text-center text-slate-600">Keine Rechnungen gefunden</td></tr>}
            {filtered.map(inv => (
              <tr key={inv.id} className="hover:bg-surface-2 transition-colors">
                <td className="px-4 py-3"><Link to={`/invoices/${inv.id}`} className="text-violet-400 hover:underline font-mono text-xs">{inv.invoiceNumber}</Link></td>
                <td className="px-4 py-3 text-slate-300">{inv.customer.name}</td>
                <td className="px-4 py-3 font-medium text-slate-100">{formatCurrency(inv.grossTotal)}</td>
                <td className="px-4 py-3 text-slate-500">{formatDate(inv.issueDate)}</td>
                <td className="px-4 py-3 text-slate-500">{formatDate(inv.dueDate)}</td>
                <td className="px-4 py-3"><StatusBadge status={inv.status} /></td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    <Link to={`/invoices/${inv.id}`} className="p-1.5 rounded hover:bg-violet-600/20 text-slate-500 hover:text-violet-400 transition-colors"><Eye size={15} /></Link>
                    <button onClick={() => { if(confirm('Rechnung löschen?')) deleteInvoice(inv.id); }} className="p-1.5 rounded hover:bg-red-500/20 text-slate-500 hover:text-red-400 transition-colors"><Trash2 size={15} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
