/* ============================================
   Levents Clone - Type Definitions
   ============================================ */

export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  image: string;
  imageHover?: string;
  badge?: 'new' | 'sale';
  discountPercent?: number;
  category: string;
  description: string;
  soldCount?: number;
  colors?: string[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
}

export interface PromoBanner {
  id: string;
  title: string;
  subtitle: string;
  cta: string;
  ctaLink: string;
  bgColor: string;
  textColor: string;
  accentColor?: string;
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  image: string;
  slug: string;
}

export interface AnnouncementItem {
  id: string;
  icon: string;
  text: string;
  highlight?: string;
}
