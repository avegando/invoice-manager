export const formatCurrency = (n: number) =>
  new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(n);

export const formatDate = (s: string) =>
  new Intl.DateTimeFormat('de-DE').format(new Date(s));
