/**
 * Convert a Vietnamese string to a URL-friendly slug.
 * Example: "Áo Thun Basic" → "ao-thun-basic"
 */
export function slugify(text: string): string {
  return text
    .normalize('NFD')
    // Remove diacritical marks (accents)
    .replace(/[\u0300-\u036f]/g, '')
    // Replace đ/Đ
    .replace(/[đĐ]/g, 'd')
    // Lowercase
    .toLowerCase()
    // Replace non-alphanumeric characters with hyphens
    .replace(/[^a-z0-9\s-]/g, '')
    // Replace whitespace/multiple hyphens with single hyphen
    .replace(/[\s-]+/g, '-')
    // Trim leading/trailing hyphens
    .replace(/^-+|-+$/g, '');
}

/**
 * Create a unique slug by appending a timestamp suffix.
 * Use when the base slug already exists in the database.
 */
export function uniqueSlug(text: string): string {
  return `${slugify(text)}-${Date.now().toString(36)}`;
}
