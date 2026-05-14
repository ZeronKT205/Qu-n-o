'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import type { Product } from '@/types';
import { formatPrice } from '@/utils/formatPrice';
import { useCartStore } from '@/store/useCartStore';
import styles from './ProductDetailModal.module.css';

interface ProductDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

export default function ProductDetailModal({ isOpen, onClose, product }: ProductDetailModalProps) {
  const [mounted, setMounted] = useState(false);
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [openSection, setOpenSection] = useState<string | null>('desc');
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState('M');

  const { addItem } = useCartStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Reset state when opening new product
      setActiveImg(0);
      setQty(1);
      setOpenSection('desc');
      setSelectedColor(0);
      setSelectedSize('M');
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, product]);

  if (!mounted || !isOpen || !product) return null;

  // Mock colors and sizes for demo
  const colors = [
    { hex: '#ffffff', name: 'Trắng' },
    { hex: '#000000', name: 'Đen' },
    { hex: '#d4c4b7', name: 'Be' },
    { hex: '#9e9e9e', name: 'Xám' }
  ];
  const sizes = ['S', 'M', 'L', 'XL'];
  const images = [product.image, product.image, product.image, product.image]; // Duplicating for demo

  const toggleSection = (id: string) => {
    setOpenSection(openSection === id ? null : id);
  };

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      color: colors[selectedColor].hex,
      colorName: colors[selectedColor].name,
      size: selectedSize,
      quantity: qty
    });
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <button className={styles.closeBtn} onClick={onClose} aria-label="Đóng popup">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>

        {/* LEFT COLUMN - GALLERY */}
        <div className={styles.gallery}>
          <div className={styles.mainImage}>
             {product.badge && (
               <span className={`${styles.galleryBadge} ${product.badge === 'sale' ? styles.badgeSale : styles.badgeNew}`}>
                 {product.badge === 'sale' ? `-${product.discountPercent}%` : 'NEW'}
               </span>
             )}
             <button className={styles.wishBtn} aria-label="Thêm vào yêu thích">
               <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
             </button>
             <button className={styles.galleryPrev} aria-label="Hình trước">
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="15 18 9 12 15 6"></polyline></svg>
             </button>
             <button className={styles.galleryNext} aria-label="Hình tiếp theo">
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
             </button>
             <Image src={images[activeImg]} alt={product.name} fill className={styles.mainImg} />
          </div>
          <div className={styles.thumbnails}>
             {images.map((img, idx) => (
               <div 
                 key={idx} 
                 className={`${styles.thumb} ${activeImg === idx ? styles.thumbActive : ''}`}
                 onClick={() => setActiveImg(idx)}
               >
                 <Image src={img} alt={`${product.name} thumb ${idx}`} fill className={styles.thumbImg} />
               </div>
             ))}
             {/* 5th thumb to match the 5 thumbnails in screenshot */}
             <div className={styles.thumb} onClick={() => setActiveImg(0)}>
               <Image src={images[0]} alt={`${product.name} thumb 4`} fill className={styles.thumbImg} />
             </div>
          </div>
          
          <div className={styles.galleryFeatures}>
            <div className={styles.featureItem}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
              <div className={styles.featureTitle}>CHẤT LIỆU</div>
              <div className={styles.featureDesc}>Cotton 100%<br/>cao cấp</div>
            </div>
            <div className={styles.featureItem}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
              <div className={styles.featureTitle}>THOÁNG MÁT</div>
              <div className={styles.featureDesc}>Thấm hút mồ hôi,<br/>mềm mại</div>
            </div>
            <div className={styles.featureItem}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"></path><line x1="16" y1="8" x2="2" y2="22"></line><line x1="17.5" y1="15" x2="9" y2="6.5"></line></svg>
              <div className={styles.featureTitle}>FORM OVERSIZE</div>
              <div className={styles.featureDesc}>Rộng rãi, thoải mái<br/>vận động</div>
            </div>
            <div className={styles.featureItem}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>
              <div className={styles.featureTitle}>DỄ PHỐI ĐỒ</div>
              <div className={styles.featureDesc}>Phong cách basic,<br/>phù hợp mọi outfit</div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN - DETAILS */}
        <div className={styles.details}>
          <div>
            <h2 className={styles.productName}>{product.name.toUpperCase()}</h2>
            
            <div className={styles.metaRow}>
              <div className={styles.rating}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                <span>(128 đánh giá)</span>
              </div>
              <span className={styles.metaDivider}>|</span>
              <span className={styles.sku}>SKU: ATN-OV-WHT</span>
            </div>

            <div className={styles.priceRow}>
              <span className={styles.currentPrice}>{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <>
                  <span className={styles.origPrice}>{formatPrice(product.originalPrice)}</span>
                </>
              )}
            </div>
          </div>

          <div className={styles.trustRow}>
            <div className={styles.trustItem}>
              <svg className={styles.trustIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
              <span>Miễn phí vận chuyển<br/>đơn từ 499K</span>
            </div>
            <div className={styles.trustItem}>
              <svg className={styles.trustIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="1 4 1 10 7 10"></polyline><polyline points="23 20 23 14 17 14"></polyline><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path></svg>
              <span>Đổi trả trong 7 ngày<br/>nếu không vừa size</span>
            </div>
            <div className={styles.trustItem}>
              <svg className={styles.trustIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><polyline points="9 12 11 14 15 10"></polyline></svg>
              <span>Cam kết chính hãng<br/>100%</span>
            </div>
          </div>

          {/* Color */}
          <div>
             <div className={styles.optionLabel}>MÀU SẮC</div>
             <div className={styles.colorOptions}>
               {colors.map((c, i) => (
                 <button 
                   key={i} 
                   className={`${styles.colorBtn} ${selectedColor === i ? styles.colorBtnActive : ''}`}
                   style={{ backgroundColor: c.hex, border: c.hex === '#ffffff' ? '1px solid #ddd' : 'none' }}
                   onClick={() => setSelectedColor(i)}
                   aria-label={`Chọn màu ${c.name}`}
                 />
               ))}
             </div>
          </div>

          {/* Size */}
          <div>
             <div className={styles.sizeHeader}>
               <div className={styles.optionLabel}>SIZE</div>
               <button className={styles.sizeGuide}>Hướng dẫn chọn size</button>
             </div>
             <div className={styles.sizeOptions}>
               {sizes.map((s) => (
                 <button 
                   key={s} 
                   className={`${styles.sizeBtn} ${selectedSize === s ? styles.sizeBtnActive : ''}`}
                   onClick={() => setSelectedSize(s)}
                 >
                   {s}
                 </button>
               ))}
             </div>
          </div>

          {/* Quantity */}
          <div>
            <div className={styles.optionLabel}>SỐ LƯỢNG</div>
            <div className={styles.quantityRow}>
              <div className={styles.quantityControl}>
                <button className={styles.qtyBtn} onClick={() => setQty(Math.max(1, qty - 1))}>-</button>
                <div className={styles.qtyValue}>{qty}</div>
                <button className={styles.qtyBtn} onClick={() => setQty(qty + 1)}>+</button>
              </div>
              <div className={styles.stockStatus}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                <span>Còn hàng: 32 sản phẩm</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </div>
            </div>
          </div>

          {/* CTAs */}
          <div className={styles.ctaRow}>
            <button className={styles.addToCartBtn} onClick={handleAddToCart}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
              THÊM VÀO GIỎ HÀNG
            </button>
            <button className={styles.buyNowBtn} onClick={handleAddToCart}>
              <div className={styles.buyNowContent}>
                <div className={styles.buyNowTop}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
                  <span>MUA NGAY</span>
                </div>
                <span className={styles.buyNowSub}>Giao hàng nhanh chóng</span>
              </div>
            </button>
          </div>

          {/* Auth Badge */}
          <div className={styles.authBadge}>
             <svg className={styles.authIcon} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><polyline points="9 12 11 14 15 10"></polyline></svg>
             <div className={styles.authText}>
               <span className={styles.authTitle}>Sản phẩm chính hãng 100%</span>
               <span className={styles.authDesc}>Hoàn tiền 100% nếu phát hiện hàng giả</span>
             </div>
          </div>

          {/* Accordion */}
          <div className={styles.accordion}>
            <div className={styles.accordionItem}>
              <button className={styles.accordionBtn} onClick={() => toggleSection('desc')}>
                MÔ TẢ SẢN PHẨM
                <svg className={`${styles.accordionArrow} ${openSection === 'desc' ? styles.accordionArrowOpen : ''}`} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </button>
              {openSection === 'desc' && <div className={styles.accordionContent}>{product.description}</div>}
            </div>
            <div className={styles.accordionItem}>
              <button className={styles.accordionBtn} onClick={() => toggleSection('care')}>
                CHẤT LIỆU & HƯỚNG DẪN BẢO QUẢN
                <svg className={`${styles.accordionArrow} ${openSection === 'care' ? styles.accordionArrowOpen : ''}`} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </button>
              {openSection === 'care' && <div className={styles.accordionContent}>Giặt máy ở nhiệt độ thường. Không sử dụng hóa chất tẩy. Phơi trong bóng râm.</div>}
            </div>
            <div className={styles.accordionItem}>
              <button className={styles.accordionBtn} onClick={() => toggleSection('policy')}>
                CHÍNH SÁCH ĐỔI TRẢ & BẢO HÀNH
                <svg className={`${styles.accordionArrow} ${openSection === 'policy' ? styles.accordionArrowOpen : ''}`} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </button>
              {openSection === 'policy' && <div className={styles.accordionContent}>Hỗ trợ đổi size trong vòng 7 ngày kể từ ngày nhận hàng với điều kiện sản phẩm còn nguyên tem mác.</div>}
            </div>
            <div className={styles.accordionItem}>
              <button className={styles.accordionBtn} onClick={() => toggleSection('shipping')}>
                THÔNG TIN GIAO HÀNG
                <svg className={`${styles.accordionArrow} ${openSection === 'shipping' ? styles.accordionArrowOpen : ''}`} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </button>
              {openSection === 'shipping' && <div className={styles.accordionContent}>Giao hàng tiêu chuẩn 2-4 ngày. Có hỏa tốc tại TP.HCM.</div>}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
