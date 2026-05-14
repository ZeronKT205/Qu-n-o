'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCartStore } from '@/store/useCartStore';
import { formatPrice } from '@/utils/formatPrice';
import styles from './CartDrawer.module.css';

export default function CartDrawer() {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, getTotalPrice } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!mounted) return null;

  const total = getTotalPrice();

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className={styles.overlay} 
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <div className={`${styles.drawer} ${isOpen ? styles.open : ''}`} role="dialog" aria-modal="true" aria-label="Giỏ hàng của bạn">
        <div className={styles.header}>
          <h2 className={styles.title}>GIỎ HÀNG</h2>
          <button 
            className={styles.closeBtn} 
            onClick={() => setIsOpen(false)}
            aria-label="Đóng giỏ hàng"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className={styles.content}>
          {items.length === 0 ? (
            <div className={styles.emptyState}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
              <p>Giỏ hàng của bạn đang trống</p>
              <button className={styles.continueBtn} onClick={() => setIsOpen(false)}>
                TIẾP TỤC MUA SẮM
              </button>
            </div>
          ) : (
            <div className={styles.cartItems}>
              {items.map((item) => (
                <div key={item.id} className={styles.item}>
                  <div className={styles.itemImage}>
                    <Image src={item.image} alt={item.name} fill className={styles.img} />
                  </div>
                  <div className={styles.itemDetails}>
                    <div className={styles.itemHeader}>
                      <h3 className={styles.itemName}>{item.name}</h3>
                      <button 
                        className={styles.removeBtn} 
                        onClick={() => removeItem(item.id)}
                        aria-label={`Xóa ${item.name} khỏi giỏ hàng`}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                      </button>
                    </div>
                    
                    <div className={styles.itemVariant}>
                      {item.colorName || item.color} / {item.size}
                    </div>
                    
                    <div className={styles.itemFooter}>
                      <div className={styles.quantityControl}>
                        <button 
                          className={styles.qtyBtn} 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          -
                        </button>
                        <span className={styles.qtyValue}>{item.quantity}</span>
                        <button 
                          className={styles.qtyBtn} 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                      
                      <div className={styles.priceContainer}>
                        {item.originalPrice && (
                          <span className={styles.originalPrice}>{formatPrice(item.originalPrice)}</span>
                        )}
                        <span className={styles.price}>{formatPrice(item.price)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className={styles.footer}>
            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>TẠM TÍNH</span>
              <span className={styles.summaryValue}>{formatPrice(total)}</span>
            </div>
            <p className={styles.shippingNotice}>Phí vận chuyển sẽ được tính ở trang thanh toán.</p>
            <Link href="/checkout" className={styles.checkoutBtn} onClick={() => setIsOpen(false)}>
              THANH TOÁN • {formatPrice(total)}
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
