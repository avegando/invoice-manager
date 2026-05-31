import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useInvoices } from '../context/InvoiceContext';
import type { Invoice, LineItem } from '../types';
import { PlusCircle, Trash2, ArrowLeft, Save } from 'lucide-react';
import { formatCurrency } from '../utils/format';

const uid = () => Math.random().toString(36).slice(2, 10);

export default function InvoiceFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addInvoice, updateInvoice, getInvoice } = useInvoices();
  const existing = id ? getInvoice(id) : undefined;

  const [num, setNum] = useState(existing?.invoiceNumber || `RE-${new Date().getFullYear()}-${String(Math.floor(Math.random()*900)+100)}`);
  const [name, setName] = useState(existing?.customer.name || '');
  const [street, setStreet] = useState(existing?.customer.street || '');
  const [city, setCity] = useState(existing?.customer.city || '');
  const [zip, setZip] = useState(existing?.customer.zip || '');
  const [country, setCountry] = useState(existing?.customer.country || 'Deutschland');
  const [issueDate, setIssueDate] = useState(existing?.issueDate || new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState(existing?.dueDate || '');
  const [desc, setDesc] = useState(existing?.description || '');
  const [items, setItems] = useState<LineItem[]>(existing?.lineItems || [{ id: uid(), description: '', quantity: 1, unitPrice: 0 }]);

  const net = items.reduce((s, i) => s + i.quantity * i.unitPrice, 0);
  const vat = net * 0.19;
  const gross = net + vat;

  const addItem = () => setItems(p => [...p, { id: uid(), description: '', quantity: 1, unitPrice: 0 }]);
  const removeItem = (id: string) => setItems(p => p.filter(x => x.id !== id));
  const updateItem = (id: string, field: keyof LineItem, value: string | number) =>
    setItems(p => p.map(x => x.id === id ? { ...x, [field]: value } : x));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const inv: Invoice = {
      id: existing?.id || uid(),
      invoiceNumber: num, description: desc,
      customer: { name, street, city, zip, country },
      issueDate, dueDate, lineItems: items, vatRate: 0.19,
      status: existing?.status || 'pending',
      netTotal: net, vatAmount: vat, grossTotal: gross,
    };
    if (existing) updateInvoice(inv); else addInvoice(inv);
    navigate('/invoices');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-surface-2 text-slate-400 transition-colors"><ArrowLeft size={18} /></button>
        <div><h1 className="text-2xl font-bold text-slate-100">{existing ? 'Rechnung bearbeiten' : 'Neue Rechnung'}</h1></div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="card space-y-4">
          <h2 className="font-semibold text-slate-300 text-sm uppercase tracking-wide">Rechnungsdetails</h2>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-xs text-slate-500 mb-1">Rechnungsnummer</label><input className="input" value={num} onChange={e => setNum(e.target.value)} required /></div>
            <div><label className="block text-xs text-slate-500 mb-1">Beschreibung</label><input className="input" value={desc} onChange={e => setDesc(e.target.value)} /></div>
            <div><label className="block text-xs text-slate-500 mb-1">Ausstellungsdatum</label><input className="input" type="date" value={issueDate} onChange={e => setIssueDate(e.target.value)} required /></div>
            <div><label className="block text-xs text-slate-500 mb-1">Fälligkeitsdatum</label><input className="input" type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} required /></div>
          </div>
        </div>

        <div className="card space-y-4">
          <h2 className="font-semibold text-slate-300 text-sm uppercase tracking-wide">Kunde</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2"><label className="block text-xs text-slate-500 mb-1">Name</label><input className="input" value={name} onChange={e => setName(e.target.value)} required /></div>
            <div className="col-span-2"><label className="block text-xs text-slate-500 mb-1">Straße</label><input className="input" value={street} onChange={e => setStreet(e.target.value)} /></div>
            <div><label className="block text-xs text-slate-500 mb-1">PLZ</label><input className="input" value={zip} onChange={e => setZip(e.target.value)} /></div>
            <div><label className="block text-xs text-slate-500 mb-1">Stadt</label><input className="input" value={city} onChange={e => setCity(e.target.value)} /></div>
          </div>
        </div>

        <div className="card space-y-3">
          <h2 className="font-semibold text-slate-300 text-sm uppercase tracking-wide">Positionen</h2>
          {items.map((item) => (
            <div key={item.id} className="grid grid-cols-12 gap-2 items-center">
              <div className="col-span-5"><input className="input" placeholder="Beschreibung" value={item.description} onChange={e => updateItem(item.id, 'description', e.target.value)} /></div>
              <div className="col-span-2"><input className="input" type="number" min="1" placeholder="Menge" value={item.quantity} onChange={e => updateItem(item.id, 'quantity', +e.target.value)} /></div>
              <div className="col-span-3"><input className="input" type="number" min="0" step="0.01" placeholder="Einzelpreis €" value={item.unitPrice} onChange={e => updateItem(item.id, 'unitPrice', +e.target.value)} /></div>
              <div className="col-span-1 text-xs text-slate-500 text-right">{formatCurrency(item.quantity * item.unitPrice)}</div>
              <div className="col-span-1"><button type="button" onClick={() => removeItem(item.id)} className="p-1.5 rounded hover:bg-red-500/20 text-slate-600 hover:text-red-400 transition-colors"><Trash2 size={14} /></button></div>
            </div>
          ))}
          <button type="button" onClick={addItem} className="btn-secondary text-xs"><PlusCircle size={14} />Position hinzufügen</button>
          <div className="border-t border-white/10 pt-3 space-y-1 text-sm">
            <div className="flex justify-between text-slate-500"><span>Netto</span><span>{formatCurrency(net)}</span></div>
            <div className="flex justify-between text-slate-500"><span>MwSt. 19%</span><span>{formatCurrency(vat)}</span></div>
            <div className="flex justify-between font-bold text-slate-100 text-base pt-1 border-t border-white/10"><span>Gesamt</span><span>{formatCurrency(gross)}</span></div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button type="button" onClick={() => navigate(-1)} className="btn-secondary">Abbrechen</button>
          <button type="submit" className="btn-primary"><Save size={16} />{existing ? 'Speichern' : 'Rechnung erstellen'}</button>
        </div>
      </form>
    </div>
  );
}
