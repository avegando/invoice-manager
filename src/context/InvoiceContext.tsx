import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Invoice } from '../types';
import { loadInvoices, saveInvoices } from '../utils/storage';
import { seedIfNeeded } from '../utils/seed';

interface InvoiceCtx {
  invoices: Invoice[];
  addInvoice: (inv: Invoice) => void;
  updateInvoice: (inv: Invoice) => void;
  deleteInvoice: (id: string) => void;
  getInvoice: (id: string) => Invoice | undefined;
}

const Ctx = createContext<InvoiceCtx>(null!);

export function InvoiceProvider({ children }: { children: ReactNode }) {
  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    seedIfNeeded();
    return loadInvoices();
  });

  useEffect(() => { saveInvoices(invoices); }, [invoices]);

  const addInvoice = (inv: Invoice) => setInvoices(p => [inv, ...p]);
  const updateInvoice = (inv: Invoice) => setInvoices(p => p.map(x => x.id === inv.id ? inv : x));
  const deleteInvoice = (id: string) => setInvoices(p => p.filter(x => x.id !== id));
  const getInvoice = (id: string) => invoices.find(x => x.id === id);

  return <Ctx.Provider value={{ invoices, addInvoice, updateInvoice, deleteInvoice, getInvoice }}>{children}</Ctx.Provider>;
}

export const useInvoices = () => useContext(Ctx);
