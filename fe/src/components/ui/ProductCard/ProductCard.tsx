'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { Product } from '@/types';
import { formatPrice } from '@/utils/formatPrice';
import styles from './ProductCard.module.css';

interface ProductCardProps {
  product: Product;
  onClick?: () => void;
  isFeatured?: boolean;
}

export default function ProductCard({ product, onClick, isFeatured = false }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);

  return (
    <article className={styles.card} aria-label={`Sản phẩm: ${product.name}`}>
      <div className={styles.imageContainer}>
        <div 
          className={styles.imageLink} 
          tabIndex={0} 
          onClick={onClick}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onClick?.();
            }
          }}
          role="button"
        >
          <Image
            src={product.image}
            alt={product.description}
            fill
            sizes="(max-width: 767px) 50vw, (max-width: 1023px) 33vw, 25vw"
            className={styles.image}
            loading="lazy"
          />
        </div>

        {/* Badge */}
        {product.badge && (
          <span
            className={`${styles.badge} ${product.badge === 'sale' ? styles.badgeSale : styles.badgeNew}`}
            aria-label={product.badge === 'sale' ? `Giảm giá ${product.discountPercent}%` : 'Sản phẩm mới'}
          >
            {product.badge === 'sale' ? `-${product.discountPercent}%` : 'NEW'}
          </span>
        )}

        {/* Wishlist button */}
        <button
          className={`${styles.wishlistBtn} ${isWishlisted ? styles.wishlisted : ''}`}
          onClick={(e) => { e.stopPropagation(); setIsWishlisted(!isWishlisted); }}
          aria-label={isWishlisted ? `Bỏ yêu thích ${product.name}` : `Thêm ${product.name} vào yêu thích`}
          aria-pressed={isWishlisted}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill={isWishlisted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>

        {/* Overlay based on isFeatured */}
        {isFeatured ? (
          <button 
            className={styles.featuredOverlay} 
            aria-label={`Mua ngay ${product.name}`}
            onClick={(e) => { e.stopPropagation(); onClick?.(); }}
          >
            <span className={styles.featuredText}>MUA NGAY</span>
          </button>
        ) : (
          <button 
            className={styles.quickAdd} 
            aria-label={`Thêm ${product.name} vào giỏ hàng`}
            onClick={(e) => { e.stopPropagation(); onClick?.(); }}
          >
            XEM NHANH
          </button>
        )}
      </div>

      {/* Product Info */}
      <div 
        className={styles.info} 
        onClick={onClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick?.();
          }
        }}
      >
        <h3 className={styles.name}>{product.name}</h3>
        <div className={styles.pricingRow}>
          <div className={styles.pricing}>
            <span className={styles.price}>{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className={styles.originalPrice}>{formatPrice(product.originalPrice)}</span>
            )}
          </div>
          {product.soldCount && (
            <span className={styles.soldCount}>
              Đã bán {product.soldCount >= 1000 ? (product.soldCount / 1000).toFixed(1).replace('.0', '') + 'k' : product.soldCount}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
