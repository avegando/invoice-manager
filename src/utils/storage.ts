import type { Invoice } from '../types';

const KEY = 'invoiceapp_data';
const SEEDED = 'invoiceapp_seeded';

export const isSeeded = () => !!localStorage.getItem(SEEDED);
export const markSeeded = () => localStorage.setItem(SEEDED, '1');

export const loadInvoices = (): Invoice[] => {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]'); }
  catch { return []; }
};

export const saveInvoices = (invoices: Invoice[]) =>
  localStorage.setItem(KEY, JSON.stringify(invoices));
