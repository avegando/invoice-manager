import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import type { Invoice } from '../types';

export async function downloadInvoicePdf(inv: Invoice, elementId: string) {
  const el = document.getElementById(elementId);
  if (!el) return;

  const canvas = await html2canvas(el, {
    scale: 2,
    useCORS: true,
    backgroundColor: '#1a1a24',
  });

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();
  const ratio = canvas.height / canvas.width;
  const imgH = pageW * ratio;

  if (imgH <= pageH) {
    pdf.addImage(imgData, 'PNG', 0, 0, pageW, imgH);
  } else {
    // Multi-page support
    let yOffset = 0;
    while (yOffset < imgH) {
      if (yOffset > 0) pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, -yOffset, pageW, imgH);
      yOffset += pageH;
    }
  }

  pdf.save(`${inv.invoiceNumber}.pdf`);
}
