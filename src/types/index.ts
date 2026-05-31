export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export type InvoiceStatus = 'paid' | 'pending' | 'overdue';

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customer: { name: string; street: string; city: string; zip: string; country: string };
  issueDate: string;
  dueDate: string;
  lineItems: LineItem[];
  vatRate: number;
  status: InvoiceStatus;
  netTotal: number;
  vatAmount: number;
  grossTotal: number;
  description: string;
}

export interface AuthUser { email: string; name: string; }
