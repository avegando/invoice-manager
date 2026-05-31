import type { InvoiceStatus } from '../../types';

const cfg: Record<InvoiceStatus, string> = {
  paid:    'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  pending: 'bg-amber-500/15   text-amber-400   border-amber-500/30',
  overdue: 'bg-red-500/15     text-red-400     border-red-500/30',
};
const label: Record<InvoiceStatus, string> = { paid: 'Bezahlt', pending: 'Offen', overdue: 'Überfällig' };

export default function StatusBadge({ status }: { status: InvoiceStatus }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${cfg[status]}`}>
      {label[status]}
    </span>
  );
}
