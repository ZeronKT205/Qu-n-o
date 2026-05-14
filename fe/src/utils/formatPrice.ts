/**
 * Format a number to Vietnamese Dong currency string.
 * @param price - Price in VND (e.g., 350000)
 * @returns Formatted string (e.g., "350.000đ")
 */
export function formatPrice(price: number): string {
  return price.toLocaleString('vi-VN') + 'đ';
}
