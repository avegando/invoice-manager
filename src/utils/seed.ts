import type { Invoice, LineItem } from '../types';
import { isSeeded, markSeeded, saveInvoices } from './storage';

const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
const li = (description: string, quantity: number, unitPrice: number): LineItem => ({ id: uid(), description, quantity, unitPrice });
const d = (daysAgo: number) => { const x = new Date(); x.setDate(x.getDate() - daysAgo); return x.toISOString().split('T')[0]; };

const calcTotals = (items: LineItem[], vat: number) => {
  const net = items.reduce((s, i) => s + i.quantity * i.unitPrice, 0);
  return { netTotal: net, vatAmount: net * vat, grossTotal: net * (1 + vat) };
};

export function seedIfNeeded() {
  if (isSeeded()) return;
  const VAT = 0.19;
  const raw: Omit<Invoice, 'netTotal' | 'vatAmount' | 'grossTotal'>[] = [
    { id: uid(), invoiceNumber: 'RE-2024-001', customer: { name: 'Müller GmbH', street: 'Hauptstraße 12', city: 'Berlin', zip: '10115', country: 'Deutschland' }, issueDate: d(165), dueDate: d(135), lineItems: [li('Webdesign & Entwicklung', 1, 4200), li('SEO-Optimierung', 1, 800), li('Hosting Setup', 1, 350)], vatRate: VAT, status: 'paid', description: 'Webprojekt Q1 2024' },
    { id: uid(), invoiceNumber: 'RE-2024-002', customer: { name: 'TechCorp AG', street: 'Innovationsweg 5', city: 'München', zip: '80331', country: 'Deutschland' }, issueDate: d(150), dueDate: d(120), lineItems: [li('React Frontend', 1, 3600), li('API Integration', 1, 1200)], vatRate: VAT, status: 'paid', description: 'Frontend-Entwicklung' },
    { id: uid(), invoiceNumber: 'RE-2024-003', customer: { name: 'StartUp Labs GmbH', street: 'Gründerstraße 1', city: 'Hamburg', zip: '20095', country: 'Deutschland' }, issueDate: d(120), dueDate: d(90), lineItems: [li('MVP Entwicklung', 60, 120), li('Projektmanagement', 10, 95)], vatRate: VAT, status: 'paid', description: 'MVP Phase 1' },
    { id: uid(), invoiceNumber: 'RE-2024-004', customer: { name: 'Digital Solutions KG', street: 'Technikpark 8', city: 'Stuttgart', zip: '70173', country: 'Deutschland' }, issueDate: d(90), dueDate: d(60), lineItems: [li('Backend API', 40, 130), li('Datenbank Design', 10, 110)], vatRate: VAT, status: 'overdue', description: 'Backend-Entwicklung' },
    { id: uid(), invoiceNumber: 'RE-2024-005', customer: { name: 'Kreativ Studio', street: 'Kunstallee 12', city: 'Köln', zip: '50667', country: 'Deutschland' }, issueDate: d(75), dueDate: d(45), lineItems: [li('UI/UX Design', 20, 105), li('Prototyping', 8, 90)], vatRate: VAT, status: 'paid', description: 'Design Sprint' },
    { id: uid(), invoiceNumber: 'RE-2024-006', customer: { name: 'E-Commerce Plus', street: 'Handelsstraße 99', city: 'Düsseldorf', zip: '40213', country: 'Deutschland' }, issueDate: d(60), dueDate: d(30), lineItems: [li('Shop-Entwicklung', 70, 135), li('Payment Integration', 1, 800)], vatRate: VAT, status: 'overdue', description: 'Online-Shop Projekt' },
    { id: uid(), invoiceNumber: 'RE-2024-007', customer: { name: 'FinTech Ventures', street: 'Bankenviertel 1', city: 'Frankfurt', zip: '60311', country: 'Deutschland' }, issueDate: d(45), dueDate: d(15), lineItems: [li('Finanz-App Entwicklung', 80, 150), li('Security Audit', 1, 600)], vatRate: VAT, status: 'pending', description: 'Finanz-App Phase 1' },
    { id: uid(), invoiceNumber: 'RE-2024-008', customer: { name: 'MediaGroup AG', street: 'Medienallee 7', city: 'München', zip: '85774', country: 'Deutschland' }, issueDate: d(30), dueDate: d(0), lineItems: [li('Social Media Dashboard', 1, 2100), li('Analytics Integration', 1, 900)], vatRate: VAT, status: 'pending', description: 'Media Dashboard' },
    { id: uid(), invoiceNumber: 'RE-2024-009', customer: { name: 'GreenTech Solutions', street: 'Ökopark 22', city: 'Freiburg', zip: '79098', country: 'Deutschland' }, issueDate: d(20), dueDate: d(10), lineItems: [li('Nachhaltigkeits-Dashboard', 1, 3300)], vatRate: VAT, status: 'pending', description: 'Green Dashboard' },
    { id: uid(), invoiceNumber: 'RE-2024-010', customer: { name: 'Retail Chain GmbH', street: 'Einkaufsring 88', city: 'Nürnberg', zip: '90402', country: 'Deutschland' }, issueDate: d(15), dueDate: d(15), lineItems: [li('POS-System Integration', 1, 5500), li('Schulung & Support', 8, 175)], vatRate: VAT, status: 'pending', description: 'POS Integration' },
    { id: uid(), invoiceNumber: 'RE-2024-011', customer: { name: 'Logistik Express', street: 'Lagerstraße 55', city: 'Bremen', zip: '28195', country: 'Deutschland' }, issueDate: d(10), dueDate: d(20), lineItems: [li('Tracking-System', 1, 4200), li('API-Entwicklung', 20, 125)], vatRate: VAT, status: 'pending', description: 'Logistik Software' },
    { id: uid(), invoiceNumber: 'RE-2024-012', customer: { name: 'Beratung Nord GmbH', street: 'Alsterring 3', city: 'Hamburg', zip: '20354', country: 'Deutschland' }, issueDate: d(5), dueDate: d(25), lineItems: [li('IT-Beratung', 28, 195)], vatRate: VAT, status: 'pending', description: 'IT-Strategie Beratung' },
  ];
  const invoices: Invoice[] = raw.map(r => ({ ...r, ...calcTotals(r.lineItems, r.vatRate) }));
  saveInvoices(invoices);
  markSeeded();
}
