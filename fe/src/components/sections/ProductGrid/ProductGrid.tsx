'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { Product } from '@/types';
import { FEATURED_PRODUCTS, CATEGORIES } from '@/data/mockData';
import ProductCard from '@/components/ui/ProductCard/ProductCard';
import ProductDetailModal from '@/components/ui/ProductDetailModal/ProductDetailModal';
import AnimatedLuxuryLine from '@/components/ui/AnimatedLuxuryLine/AnimatedLuxuryLine';
import styles from './ProductGrid.module.css';

const ITEMS_PER_PAGE = 6;

export default function ProductGrid() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  useEffect(() => {
    const handleCategoryEvent = (e: CustomEvent<string>) => {
      handleCategoryChange(e.detail);
    };

    window.addEventListener('categoryChange', handleCategoryEvent as EventListener);
    return () => window.removeEventListener('categoryChange', handleCategoryEvent as EventListener);
  }, []);

  const filteredProducts = activeCategory === 'all' 
    ? FEATURED_PRODUCTS 
    : FEATURED_PRODUCTS.filter(p => p.category === activeCategory);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const visibleProducts = filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <section className={styles.section} aria-label="Sản phẩm nổi bật">
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.titleWrapper}>
            <h2 className={styles.title}>SẢN PHẨM NỔI BẬT</h2>
            <AnimatedLuxuryLine />
          </div>
          <Link href="/products" className={styles.viewAll}>
            Xem tất cả
            <span aria-hidden="true"> →</span>
          </Link>
        </div>

        {/* Filter categories */}
        <div className={styles.filterContainer}>
          <button
            className={`${styles.filterBtn} ${activeCategory === 'all' ? styles.activeFilterBtn : ''}`}
            onClick={() => handleCategoryChange('all')}
          >
            Tất cả
          </button>
          {CATEGORIES.map(category => (
            <button
              key={category.id}
              className={`${styles.filterBtn} ${activeCategory === category.slug ? styles.activeFilterBtn : ''}`}
              onClick={() => handleCategoryChange(category.slug)}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className={styles.grid}>
          {visibleProducts.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              isFeatured={true}
              onClick={() => setSelectedProduct(product)}
            />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className={styles.paginationContainer}>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                className={`${styles.pageBtn} ${currentPage === i + 1 ? styles.activePageBtn : ''}`}
                onClick={() => handlePageChange(i + 1)}
                aria-label={`Trang ${i + 1}`}
                aria-current={currentPage === i + 1 ? 'page' : undefined}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      <ProductDetailModal 
        isOpen={selectedProduct !== null}
        onClose={() => setSelectedProduct(null)}
        product={selectedProduct}
      />
    </section>
  );
}
