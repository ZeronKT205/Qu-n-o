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

        {/* Hover Overlay */}
        <div className={styles.hoverOverlay}>
          {/* Center Actions */}
          <div className={styles.centerActions}>
            <div className={styles.bagCircle}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
            </div>
            <button 
              className={styles.buyNowBtn}
              onClick={(e) => { e.stopPropagation(); onClick?.(); }}
              aria-label={`Mua ngay ${product.name}`}
            >
              MUA NGAY
            </button>
          </div>

          {/* Bottom Features */}
          <div className={styles.featuresRow}>
            <div className={styles.featureItem}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              <span>Chất liệu cao cấp</span>
            </div>
            <div className={styles.featureDivider} />
            <div className={styles.featureItem}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M4 12h16M4 8h16M4 16h16" strokeDasharray="4 4" />
              </svg>
              <span>Thoáng mát</span>
            </div>
            <div className={styles.featureDivider} />
            <div className={styles.featureItem}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="M9 12l2 2 4-4" />
              </svg>
              <span>Bền bỉ</span>
            </div>
          </div>
        </div>
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
        </div>
        {product.colors && product.colors.length > 0 && (
          <div className={styles.colorDots}>
            {product.colors.map((color, idx) => (
              <span key={idx} className={styles.colorDot} style={{ backgroundColor: color }} aria-label={`Màu ${color}`} />
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
