export function formatCurrency(value) {
  if (!value && value !== 0) return '';
  return Number(value).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
}