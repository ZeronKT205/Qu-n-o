import { Suspense } from 'react';
import AnnouncementBar from '@/components/sections/AnnouncementBar/AnnouncementBar';
import Header from '@/components/sections/Header/Header';
import HeroBanner from '@/components/sections/HeroBanner/HeroBanner';
import MixStyles from '@/components/sections/MixStyles/MixStyles';
import CategoryPills from '@/components/sections/CategoryPills/CategoryPills';
import ProductGrid from '@/components/sections/ProductGrid/ProductGrid';
import PromoBanners from '@/components/sections/PromoBanners/PromoBanners';
import CollectionShowcase from '@/components/sections/CollectionShowcase/CollectionShowcase';
import Newsletter from '@/components/sections/Newsletter/Newsletter';
import BrandPartners from '@/components/sections/BrandPartners/BrandPartners';
import Footer from '@/components/sections/Footer/Footer';

/* ============================================
   JSON-LD Structured Data for SEO
   ============================================ */
const webPageJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'BST Sống Chất Mặc Chất | Thời Trang Streetwear Nam Nữ - Levents Clone',
  description:
    'Khám phá bộ sưu tập Sống chất mặc chất từ Levents Clone. Thời trang streetwear nam nữ thiết kế tối giản, cao cấp và năng động.',
  url: 'https://levents-clone.vercel.app/collections/song-chat-mac-chat',
  publisher: {
    '@type': 'Organization',
    name: 'Levents Clone',
    logo: {
      '@type': 'ImageObject',
      url: 'https://levents-clone.vercel.app/images/logo.png',
    },
  },
};

const productJsonLd = [
  {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: 'Áo Polo Basic Streetwear',
    image: ['https://levents-clone.vercel.app/images/products/product-6.png'],
    description: 'Áo Polo Basic cao cấp mang phong cách streetwear, form rộng thoải mái.',
    sku: 'LEVENTS-POLO-001',
    brand: { '@type': 'Brand', name: 'Levents Clone' },
    offers: {
      '@type': 'Offer',
      url: 'https://levents-clone.vercel.app/products/ao-polo-basic',
      priceCurrency: 'VND',
      price: '350000',
      itemCondition: 'https://schema.org/NewCondition',
      availability: 'https://schema.org/InStock',
    },
  },
  {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: 'Áo Thun Nữ Oversize',
    image: ['https://levents-clone.vercel.app/images/products/product-2.png'],
    description: 'Áo thun nữ oversize phong cách streetwear trẻ trung, năng động.',
    sku: 'LEVENTS-TEE-002',
    brand: { '@type': 'Brand', name: 'Levents Clone' },
    offers: {
      '@type': 'Offer',
      url: 'https://levents-clone.vercel.app/products/ao-thun-nu-oversize',
      priceCurrency: 'VND',
      price: '290000',
      itemCondition: 'https://schema.org/NewCondition',
      availability: 'https://schema.org/InStock',
    },
  },
];

export default function HomePage() {
  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />

      {/* Header */}
      <Header />

      {/* Main Content */}
      <main id="main-content" role="main">
        {/* Hero Banner - Above the fold (LCP element) */}
        <div id="hero"><HeroBanner /></div>

        {/* Category Navigation */}
        <div id="categories"><CategoryPills /></div>

        {/* Mix Styles Suggestion */}
        <div id="mix-styles"><MixStyles /></div>

        {/* Featured Products */}
        <div id="products">
          <Suspense fallback={<ProductGridSkeleton />}>
            <ProductGrid />
          </Suspense>
        </div>

        {/* Promo Banners */}
        <div id="promos"><PromoBanners /></div>

        {/* Collection Showcase */}
        <div id="collections"><CollectionShowcase /></div>

        {/* Brand Partners */}
        <div id="brands"><BrandPartners /></div>

        {/* Newsletter CTA */}
        <div id="newsletter"><Newsletter /></div>
      </main>

      {/* Footer */}
      <Footer />
    </>
  );
}

/**
 * Skeleton placeholder for ProductGrid while loading.
 * Prevents CLS by reserving the same layout space.
 */
function ProductGridSkeleton() {
  return (
    <section style={{ padding: '40px 16px' }} aria-label="Đang tải sản phẩm..." aria-busy="true">
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              style={{
                aspectRatio: '3/4',
                backgroundColor: '#f4f4f5',
                borderRadius: '4px',
                animation: 'pulse 1.5s ease-in-out infinite',
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
