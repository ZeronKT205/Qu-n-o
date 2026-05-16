'use client';

import { useState } from 'react';
import Link from 'next/link';
import { COLLECTIONS } from '@/data/mockData';
import type { Product } from '@/types';
import AnimatedLuxuryLine from '@/components/ui/AnimatedLuxuryLine/AnimatedLuxuryLine';
import ProductCard from '@/components/ui/ProductCard/ProductCard';
import ProductDetailModal from '@/components/ui/ProductDetailModal/ProductDetailModal';
import styles from './CollectionShowcase.module.css';

export default function CollectionShowcase() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Map collections to products so they look like featured products
  const collectionProducts: Product[] = COLLECTIONS.map((col, idx) => ({
    id: col.id,
    name: col.name,
    slug: col.slug,
    price: [250000, 350000, 480000, 290000][idx] || 350000,
    originalPrice: [300000, 450000, 600000, 350000][idx] || undefined,
    image: col.image,
    category: 'collection',
    description: col.description,
    badge: idx === 0 ? 'new' : idx === 2 ? 'sale' : undefined,
    discountPercent: idx === 2 ? 20 : undefined,
  }));

  return (
    <section className={styles.section} aria-label="Bộ sưu tập nổi bật">
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.titleWrapper}>
            <h2 className={styles.title}>BỘ SƯU TẬP NỔI BẬT</h2>
            <AnimatedLuxuryLine />
          </div>
          <Link href="/collections" className={styles.viewAll}>
            Xem tất cả
            <span aria-hidden="true"> →</span>
          </Link>
        </div>

        <div className={styles.grid}>
          {collectionProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isFeatured={true}
              onClick={() => setSelectedProduct(product)}
            />
          ))}
        </div>
      </div>

      <ProductDetailModal 
        isOpen={selectedProduct !== null}
        onClose={() => setSelectedProduct(null)}
        product={selectedProduct}
      />
    </section>
  );
}
