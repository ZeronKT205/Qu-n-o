'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import type { Product } from '@/types';
import type { ApiProductVariant } from '@/utils/productService';
import { fetchProductBySlug } from '@/utils/productService';
import { formatPrice } from '@/utils/formatPrice';
import { useCartStore } from '@/store/useCartStore';
import styles from './ProductDetailModal.module.css';

interface ProductDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

// Extract unique colors from variants
function getUniqueColors(variants: ApiProductVariant[]) {
  const seen = new Set<string>();
  return variants
    .filter(v => v.is_active)
    .filter(v => {
      if (seen.has(v.color_hex)) return false;
      seen.add(v.color_hex);
      return true;
    })
    .map(v => ({ hex: v.color_hex, name: v.color_name }));
}

// Get available sizes for a given color
function getSizesForColor(variants: ApiProductVariant[], colorHex: string) {
  return variants
    .filter(v => v.is_active && v.color_hex === colorHex)
    .map(v => ({ size: v.size, stock: v.stock_quantity }));
}

export default function ProductDetailModal({ isOpen, onClose, product }: ProductDetailModalProps) {
  const [mounted, setMounted] = useState(false);
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [openSection, setOpenSection] = useState<string | null>('desc');

  // Variants state
  const [variants, setVariants] = useState<ApiProductVariant[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [variantsLoading, setVariantsLoading] = useState(false);

  // Selection state (color = hex string, size = size string)
  const [selectedColorHex, setSelectedColorHex] = useState('');
  const [selectedSize, setSelectedSize] = useState('');

  const { addItem } = useCartStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen || !product) {
      document.body.style.overflow = '';
      return;
    }

    document.body.style.overflow = 'hidden';
    setActiveImg(0);
    setQty(1);
    setOpenSection('desc');
    setVariants([]);
    setImages([product.image]);
    setSelectedColorHex('');
    setSelectedSize('');

    // Fetch real variants + images
    setVariantsLoading(true);
    fetchProductBySlug(product.slug).then(detail => {
      if (!detail) return;

      // Real images
      const sortedImages = [...(detail.product_images || [])]
        .sort((a, b) => a.sort_order - b.sort_order)
        .map(img => img.image_url);
      setImages(sortedImages.length > 0 ? sortedImages : [product.image]);

      // Real variants
      const activeVariants = (detail.product_variants || []).filter(v => v.is_active);
      setVariants(activeVariants);

      // Pre-select first color + first size for that color
      const firstColor = activeVariants[0]?.color_hex ?? '';
      const firstSize = activeVariants.find(v => v.color_hex === firstColor)?.size ?? '';
      setSelectedColorHex(firstColor);
      setSelectedSize(firstSize);
    }).finally(() => setVariantsLoading(false));

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, product]);

  if (!mounted || !isOpen || !product) return null;

  const uniqueColors = getUniqueColors(variants);
  const sizesForColor = getSizesForColor(variants, selectedColorHex);
  const selectedVariant = variants.find(
    v => v.is_active && v.color_hex === selectedColorHex && v.size === selectedSize
  );
  const stockCount = selectedVariant?.stock_quantity ?? 0;

  // If no real variants yet, fall back to showing the product's fixed price
  const effectivePrice = selectedVariant
    ? product.price + selectedVariant.additional_price
    : product.price;

  const handleColorSelect = (hex: string) => {
    setSelectedColorHex(hex);
    // Reset to first available size for this color
    const firstSize = variants.find(v => v.is_active && v.color_hex === hex)?.size ?? '';
    setSelectedSize(firstSize);
  };

  const handleAddToCart = () => {
    if (!selectedColorHex || !selectedSize) return;
    const colorName = uniqueColors.find(c => c.hex === selectedColorHex)?.name ?? '';
    addItem({
      productId: product.id,
      variantId: selectedVariant?.id,
      name: product.name,
      price: effectivePrice,
      originalPrice: product.originalPrice,
      image: images[0] || product.image,
      color: selectedColorHex,
      colorName,
      size: selectedSize,
      quantity: qty,
    });
    onClose();
  };

  const toggleSection = (id: string) => {
    setOpenSection(openSection === id ? null : id);
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
                {product.badge === 'sale' ? `-${product.discountPercent}%` : product.badge.toUpperCase()}
              </span>
            )}
            <button className={styles.wishBtn} aria-label="Thêm vào yêu thích">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
            </button>
            <button className={styles.galleryPrev} aria-label="Hình trước" onClick={() => setActiveImg(i => Math.max(0, i - 1))}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="15 18 9 12 15 6"></polyline></svg>
            </button>
            <button className={styles.galleryNext} aria-label="Hình tiếp theo" onClick={() => setActiveImg(i => Math.min(images.length - 1, i + 1))}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </button>
            <Image src={images[activeImg] || product.image} alt={product.name} fill className={styles.mainImg} />
          </div>
          <div className={styles.thumbnails}>
            {images.slice(0, 5).map((img, idx) => (
              <div
                key={idx}
                className={`${styles.thumb} ${activeImg === idx ? styles.thumbActive : ''}`}
                onClick={() => setActiveImg(idx)}
              >
                <Image src={img} alt={`${product.name} ${idx + 1}`} fill className={styles.thumbImg} />
              </div>
            ))}
          </div>

          <div className={styles.galleryFeatures}>
            <div className={styles.featureItem}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
              <div className={styles.featureTitle}>CHẤT LIỆU</div>
              <div className={styles.featureDesc}>Cotton 100%<br />cao cấp</div>
            </div>
            <div className={styles.featureItem}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
              <div className={styles.featureTitle}>THOÁNG MÁT</div>
              <div className={styles.featureDesc}>Thấm hút mồ hôi,<br />mềm mại</div>
            </div>
            <div className={styles.featureItem}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"></path><line x1="16" y1="8" x2="2" y2="22"></line><line x1="17.5" y1="15" x2="9" y2="6.5"></line></svg>
              <div className={styles.featureTitle}>FORM OVERSIZE</div>
              <div className={styles.featureDesc}>Rộng rãi, thoải mái<br />vận động</div>
            </div>
            <div className={styles.featureItem}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>
              <div className={styles.featureTitle}>DỄ PHỐI ĐỒ</div>
              <div className={styles.featureDesc}>Phong cách basic,<br />phù hợp mọi outfit</div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN - DETAILS */}
        <div className={styles.details}>
          <div>
            <h2 className={styles.productName}>{product.name.toUpperCase()}</h2>

            <div className={styles.metaRow}>
              <div className={styles.rating}>
                {[1, 2, 3, 4].map(i => (
                  <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                ))}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                <span>(128 đánh giá)</span>
              </div>
            </div>

            <div className={styles.priceRow}>
              <span className={styles.currentPrice}>{formatPrice(effectivePrice)}</span>
              {product.originalPrice && (
                <span className={styles.origPrice}>{formatPrice(product.originalPrice)}</span>
              )}
            </div>
          </div>

          <div className={styles.trustRow}>
            <div className={styles.trustItem}>
              <svg className={styles.trustIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
              <span>Miễn phí vận chuyển<br />đơn từ 499K</span>
            </div>
            <div className={styles.trustItem}>
              <svg className={styles.trustIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="1 4 1 10 7 10"></polyline><polyline points="23 20 23 14 17 14"></polyline><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path></svg>
              <span>Đổi trả trong 7 ngày<br />nếu không vừa size</span>
            </div>
            <div className={styles.trustItem}>
              <svg className={styles.trustIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><polyline points="9 12 11 14 15 10"></polyline></svg>
              <span>Cam kết chính hãng<br />100%</span>
            </div>
          </div>

          {/* Color */}
          <div>
            <div className={styles.optionLabel}>
              MÀU SẮC
              {selectedColorHex && (
                <span style={{ fontWeight: 400, marginLeft: 8, color: '#6B7280' }}>
                  — {uniqueColors.find(c => c.hex === selectedColorHex)?.name}
                </span>
              )}
            </div>
            {variantsLoading ? (
              <div style={{ height: 36, display: 'flex', alignItems: 'center', gap: 8, color: '#9CA3AF', fontSize: 13 }}>
                <span>Đang tải...</span>
              </div>
            ) : uniqueColors.length > 0 ? (
              <div className={styles.colorOptions}>
                {uniqueColors.map((c) => (
                  <button
                    key={c.hex}
                    className={`${styles.colorBtn} ${selectedColorHex === c.hex ? styles.colorBtnActive : ''}`}
                    style={{ backgroundColor: c.hex, border: c.hex === '#ffffff' || c.hex === '#FFFFFF' ? '1px solid #ddd' : 'none' }}
                    onClick={() => handleColorSelect(c.hex)}
                    aria-label={`Chọn màu ${c.name}`}
                    title={c.name}
                  />
                ))}
              </div>
            ) : (
              <div className={styles.colorOptions}>
                <span style={{ fontSize: 13, color: '#9CA3AF' }}>Không có dữ liệu màu</span>
              </div>
            )}
          </div>

          {/* Size */}
          <div>
            <div className={styles.sizeHeader}>
              <div className={styles.optionLabel}>SIZE</div>
              <button className={styles.sizeGuide}>Hướng dẫn chọn size</button>
            </div>
            {variantsLoading ? (
              <div style={{ height: 40, display: 'flex', alignItems: 'center', gap: 8, color: '#9CA3AF', fontSize: 13 }}>
                <span>Đang tải...</span>
              </div>
            ) : sizesForColor.length > 0 ? (
              <div className={styles.sizeOptions}>
                {sizesForColor.map(({ size, stock }) => (
                  <button
                    key={size}
                    className={`${styles.sizeBtn} ${selectedSize === size ? styles.sizeBtnActive : ''} ${stock === 0 ? styles.sizeBtnDisabled : ''}`}
                    onClick={() => stock > 0 && setSelectedSize(size)}
                    disabled={stock === 0}
                    title={stock === 0 ? 'Hết hàng' : undefined}
                  >
                    {size}
                  </button>
                ))}
              </div>
            ) : (
              <div className={styles.sizeOptions}>
                <span style={{ fontSize: 13, color: '#9CA3AF' }}>Chọn màu để xem size</span>
              </div>
            )}
          </div>

          {/* Quantity */}
          <div>
            <div className={styles.optionLabel}>SỐ LƯỢNG</div>
            <div className={styles.quantityRow}>
              <div className={styles.quantityControl}>
                <button className={styles.qtyBtn} onClick={() => setQty(Math.max(1, qty - 1))}>-</button>
                <div className={styles.qtyValue}>{qty}</div>
                <button
                  className={styles.qtyBtn}
                  onClick={() => setQty(Math.min(stockCount || 99, qty + 1))}
                >+</button>
              </div>
              <div className={styles.stockStatus}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                {variantsLoading ? (
                  <span>Đang kiểm tra...</span>
                ) : selectedVariant ? (
                  stockCount > 0
                    ? <span>Còn hàng: {stockCount} sản phẩm</span>
                    : <span style={{ color: '#EF4444' }}>Hết hàng</span>
                ) : (
                  <span>Chọn màu & size</span>
                )}
              </div>
            </div>
          </div>

          {/* CTAs */}
          <div className={styles.ctaRow}>
            <button
              className={styles.addToCartBtn}
              onClick={handleAddToCart}
              disabled={!selectedVariant || stockCount === 0}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
              THÊM VÀO GIỎ HÀNG
            </button>
            <button
              className={styles.buyNowBtn}
              onClick={handleAddToCart}
              disabled={!selectedVariant || stockCount === 0}
            >
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
