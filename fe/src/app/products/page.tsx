import { Metadata } from 'next';
import Image from 'next/image';
import Header from '@/components/sections/Header/Header';
import Footer from '@/components/sections/Footer/Footer';
import ShopClient from '@/components/sections/Shop/ShopClient';
import NewsletterBanner from '@/components/sections/NewsletterBanner/NewsletterBanner';
import { FEATURED_PRODUCTS } from '@/data/mockData';
import styles from './ProductsPage.module.css';

export const metadata: Metadata = {
  title: 'Tất cả sản phẩm | Levents Clone',
  description: 'Khám phá các thiết kế tối giản dành cho phong cách hàng ngày.',
};

export default function ProductsPage() {
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
        <ShopClient initialProducts={FEATURED_PRODUCTS} />

        {/* NEWSLETTER BANNER */}
        <NewsletterBanner />
        
      </main>
      <Footer />
    </>
  );
}
