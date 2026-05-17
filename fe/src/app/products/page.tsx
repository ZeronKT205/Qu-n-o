import { Metadata } from 'next';
import { Suspense } from 'react';
import Image from 'next/image';
import Header from '@/components/sections/Header/Header';
import Footer from '@/components/sections/Footer/Footer';
import ShopClient from '@/components/sections/Shop/ShopClient';
import NewsletterBanner from '@/components/sections/NewsletterBanner/NewsletterBanner';
import { FEATURED_PRODUCTS } from '@/data/mockData';
import { fetchProducts, mapApiProduct } from '@/utils/productService';
import type { Product } from '@/types';
import styles from './ProductsPage.module.css';

export const metadata: Metadata = {
  title: 'Tất cả sản phẩm | Levents Clone',
  description: 'Khám phá các thiết kế tối giản dành cho phong cách hàng ngày.',
};

export default async function ProductsPage() {
  let initialProducts: Product[] = [];

  try {
    const { data } = await fetchProducts({ limit: 50 });
    if (data.length > 0) {
      initialProducts = data.map(mapApiProduct);
    }
  } catch {
    // ignore
  }

  // Fallback to mock data if API returned nothing
  if (initialProducts.length === 0) {
    initialProducts = FEATURED_PRODUCTS;
  }

  return (
    <>
      <Header />
      <main id="main-content" role="main" style={{ marginTop: 'var(--header-height, 70px)' }}>

        {/* HERO BANNER */}
        <section className={styles.heroBanner}>
          <div className={styles.heroImageContainer}>
            <Image
              src="/images/hero_product/hero_product.png"
              alt="Sống chất, mặc gu riêng"
              fill
              className={styles.heroImage}
              sizes="100vw"
              quality={100}
              priority
            />
          </div>
        </section>

        {/* SHOP CLIENT (Filters + Grid) */}
        <Suspense fallback={
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px', gap: '16px' }}>
            <div style={{ border: '3px solid #E5E7EB', borderTop: '3px solid #111827', borderRadius: '50%', width: '32px', height: '32px', animation: 'spin 1s linear infinite' }}></div>
            <span style={{ fontSize: '14px', color: '#6B7280', fontWeight: 500 }}>Đang tải danh sách sản phẩm...</span>
          </div>
        }>
          <ShopClient initialProducts={initialProducts} />
        </Suspense>

        {/* NEWSLETTER BANNER */}
        <NewsletterBanner />

      </main>
      <Footer />
    </>
  );
}
