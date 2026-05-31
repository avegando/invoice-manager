import { useMemo } from 'react';
import { useInvoices } from '../context/InvoiceContext';
import { Link } from 'react-router-dom';
import { TrendingUp, Clock, CheckCircle, AlertCircle, PlusCircle, ArrowRight } from 'lucide-react';
import StatusBadge from '../components/UI/StatusBadge';
import { formatCurrency, formatDate } from '../utils/format';

export default function DashboardPage() {
  const { invoices } = useInvoices();
  const stats = useMemo(() => ({
    total: invoices.reduce((s, i) => s + i.grossTotal, 0),
    paid: invoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.grossTotal, 0),
    pending: invoices.filter(i => i.status === 'pending').reduce((s, i) => s + i.grossTotal, 0),
    overdue: invoices.filter(i => i.status === 'overdue').reduce((s, i) => s + i.grossTotal, 0),
    countPaid: invoices.filter(i => i.status === 'paid').length,
    countPending: invoices.filter(i => i.status === 'pending').length,
    countOverdue: invoices.filter(i => i.status === 'overdue').length,
  }), [invoices]);

  const recent = invoices.slice(0, 5);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-slate-100">Dashboard</h1><p className="text-slate-500 text-sm">Übersicht deiner Rechnungen</p></div>
        <Link to="/invoices/new" className="btn-primary"><PlusCircle size={16} />Neue Rechnung</Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[{ label: 'Gesamtumsatz', value: stats.total, icon: TrendingUp, color: 'text-violet-400', bg: 'bg-violet-500/10' },
          { label: 'Bezahlt', value: stats.paid, icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10', sub: `${stats.countPaid} Rechnungen` },
          { label: 'Offen', value: stats.pending, icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10', sub: `${stats.countPending} Rechnungen` },
          { label: 'Überfällig', value: stats.overdue, icon: AlertCircle, color: 'text-red-400', bg: 'bg-red-500/10', sub: `${stats.countOverdue} Rechnungen` },
        ].map(({ label, value, icon: Icon, color, bg, sub }) => (
          <div key={label} className="card">
            <div className={`inline-flex p-2 rounded-lg ${bg} mb-3`}><Icon size={20} className={color} /></div>
            <div className="text-xl font-bold text-slate-100">{formatCurrency(value)}</div>
            <div className="text-xs text-slate-500 mt-0.5">{sub || label}</div>
            <div className="text-xs text-slate-600 mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-slate-200">Letzte Rechnungen</h2>
          <Link to="/invoices" className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1">Alle <ArrowRight size={12} /></Link>
        </div>
        <table className="w-full text-sm">
          <thead><tr className="text-left text-xs text-slate-600 border-b border-white/5">
            <th className="pb-2 font-medium">Nr.</th><th className="pb-2 font-medium">Kunde</th>
            <th className="pb-2 font-medium">Betrag</th><th className="pb-2 font-medium">Fällig</th>
            <th className="pb-2 font-medium">Status</th>
          </tr></thead>
          <tbody className="divide-y divide-white/5">
            {recent.map(inv => (
              <tr key={inv.id} className="hover:bg-surface-2 transition-colors">
                <td className="py-2.5"><Link to={`/invoices/${inv.id}`} className="text-violet-400 hover:underline font-mono text-xs">{inv.invoiceNumber}</Link></td>
                <td className="py-2.5 text-slate-300">{inv.customer.name}</td>
                <td className="py-2.5 text-slate-200 font-medium">{formatCurrency(inv.grossTotal)}</td>
                <td className="py-2.5 text-slate-500">{formatDate(inv.dueDate)}</td>
                <td className="py-2.5"><StatusBadge status={inv.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
