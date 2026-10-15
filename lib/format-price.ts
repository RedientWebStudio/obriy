/** Format UAH amounts as in Figma: `18 900 ₴`. */
export function formatPriceUah(amount: number): string {
  const digits = Math.round(amount).toString();
  const grouped = digits.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return `${grouped} ₴`;
}

export function discountPercent(
  salePrice: number,
  compareAtPrice: number,
): number {
  if (compareAtPrice <= 0 || salePrice >= compareAtPrice) return 0;
  return Math.round(((compareAtPrice - salePrice) / compareAtPrice) * 100);
}
