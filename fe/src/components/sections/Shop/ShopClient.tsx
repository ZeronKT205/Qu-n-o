'use client';

import { useState, useMemo } from 'react';
import type { Product } from '@/types';
import ProductCard from '@/components/ui/ProductCard/ProductCard';
import ProductDetailModal from '@/components/ui/ProductDetailModal/ProductDetailModal';
import styles from './ShopClient.module.css';

interface ShopClientProps {
  initialProducts: Product[];
}

export default function ShopClient({ initialProducts }: ShopClientProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Filter state for UI purpose
  const [activeSize, setActiveSize] = useState<string | null>(null);
  const [activeColor, setActiveColor] = useState<string | null>(null);

  const sizes = ['S', 'M', 'L', 'XL'];
  const colors = [
    { id: 'black', hex: '#000000' },
    { id: 'white', hex: '#ffffff' },
    { id: 'beige', hex: '#f5f5dc' },
    { id: 'brown', hex: '#8b4513' },
    { id: 'gray', hex: '#808080' },
  ];

  const categories = [
    { id: 'ao-thun', name: 'Áo thun', count: 52 },
    { id: 'ao-so-mi', name: 'Áo sơ mi', count: 48 },
    { id: 'quan', name: 'Quần', count: 36 },
    { id: 'vay-dam', name: 'Váy/Đầm', count: 24 },
    { id: 'phu-kien', name: 'Phụ kiện', count: 18 },
  ];

  const collections = ['Summer Collection', 'Minimal Essentials', 'Office Chic', 'Street Casual'];
  const materials = ['Cotton', 'Linen', 'Denim', 'Polyester'];

  const filteredProducts = initialProducts; // Assuming initialProducts are exactly the 12 we mocked for display.

  return (
    <div className={styles.shopLayout}>
      
      {/* FILTER BAR (Mobile/Tablet Top) */}
      <div className={styles.topFilterBar}>
        <div className={styles.filterBarLeft}>
          <button className={styles.filterToggleBtn}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
            BỘ LỌC
          </button>
          <button className={styles.clearAllBtn}>Xóa tất cả</button>
        </div>
        <div className={styles.filterBarMiddle}>
          <button className={styles.dropdownBtn}>Danh mục ▾</button>
          <button className={styles.dropdownBtn}>Size ▾</button>
          <button className={styles.dropdownBtn}>Màu sắc ▾</button>
          <button className={styles.dropdownBtn}>Giá ▾</button>
        </div>
        <div className={styles.filterBarRight}>
          <select className={styles.sortSelect} defaultValue="newest">
            <option value="newest">Sắp xếp: Mới nhất ▾</option>
            <option value="price-asc">Giá: Thấp đến Cao</option>
            <option value="price-desc">Giá: Cao đến Thấp</option>
          </select>
        </div>
      </div>

      <div className={styles.mainContent}>
        {/* SIDEBAR (Desktop) */}
        <aside className={styles.sidebar}>
          
          {/* Danh mục */}
          <div className={styles.filterBlock}>
            <div className={styles.filterHeader}>
              <span>DANH MỤC</span>
              <span className={styles.collapseIcon}>−</span>
            </div>
            <ul className={styles.categoryList}>
              {categories.map(c => (
                <li key={c.id} className={styles.categoryItem}>
                  <span className={styles.categoryName}>{c.name}</span>
                  <span className={styles.categoryCount}>({c.count})</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Size */}
          <div className={styles.filterBlock}>
            <div className={styles.filterHeader}>
              <span>SIZE</span>
              <span className={styles.collapseIcon}>−</span>
            </div>
            <div className={styles.sizeGrid}>
              {sizes.map(s => (
                <button 
                  key={s} 
                  className={`${styles.sizeBtn} ${activeSize === s ? styles.sizeActive : ''}`}
                  onClick={() => setActiveSize(s === activeSize ? null : s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Màu sắc */}
          <div className={styles.filterBlock}>
            <div className={styles.filterHeader}>
              <span>MÀU SẮC</span>
              <span className={styles.collapseIcon}>−</span>
            </div>
            <div className={styles.colorGrid}>
              {colors.map(c => (
                <button 
                  key={c.id} 
                  className={`${styles.colorSwatch} ${activeColor === c.id ? styles.colorActive : ''}`}
                  style={{ backgroundColor: c.hex }}
                  onClick={() => setActiveColor(c.id === activeColor ? null : c.id)}
                  aria-label={`Màu ${c.id}`}
                />
              ))}
            </div>
          </div>

          {/* Khoảng giá */}
          <div className={styles.filterBlock}>
            <div className={styles.filterHeader}>
              <span>KHOẢNG GIÁ</span>
              <span className={styles.collapseIcon}>−</span>
            </div>
            <div className={styles.priceRange}>
              <span className={styles.priceText}>200.000đ – 2.000.000đ</span>
              <div className={styles.sliderMock}>
                <div className={styles.sliderTrack}>
                  <div className={styles.sliderFill} style={{ left: '10%', right: '20%' }}></div>
                  <div className={styles.sliderThumb} style={{ left: '10%' }}></div>
                  <div className={styles.sliderThumb} style={{ right: '20%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Bộ sưu tập */}
          <div className={styles.filterBlock}>
            <div className={styles.filterHeader}>
              <span>BỘ SƯU TẬP</span>
              <span className={styles.collapseIcon}>−</span>
            </div>
            <div className={styles.checkboxList}>
              {collections.map(coll => (
                <label key={coll} className={styles.checkboxItem}>
                  <input type="checkbox" />
                  <span>{coll}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Chất liệu */}
          <div className={styles.filterBlock}>
            <div className={styles.filterHeader}>
              <span>CHẤT LIỆU</span>
              <span className={styles.collapseIcon}>−</span>
            </div>
            <div className={styles.checkboxList}>
              {materials.map(mat => (
                <label key={mat} className={styles.checkboxItem}>
                  <input type="checkbox" />
                  <span>{mat}</span>
                </label>
              ))}
            </div>
          </div>

        </aside>

        {/* PRODUCT GRID */}
        <div className={styles.productsArea}>
          <div className={styles.gridSubHeader}>
            <span className={styles.resultText}>Hiển thị 1–12 trong 168 sản phẩm</span>
            <div className={styles.viewToggles}>
              <button className={styles.viewBtnActive}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
              </button>
              <button className={styles.viewBtn}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
              </button>
            </div>
          </div>

          <div className={styles.grid}>
            {filteredProducts.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onClick={() => setSelectedProduct(product)}
              />
            ))}
          </div>

          {/* PAGINATION */}
          <div className={styles.pagination}>
            <button className={`${styles.pageItem} ${styles.pageActive}`}>1</button>
            <button className={styles.pageItem}>2</button>
            <button className={styles.pageItem}>3</button>
            <button className={styles.pageItem}>4</button>
            <button className={styles.pageItem}>5</button>
            <span className={styles.pageEllipsis}>...</span>
            <button className={styles.pageItem}>7</button>
            <button className={styles.pageItem}>&gt;</button>
          </div>
        </div>
      </div>

      <ProductDetailModal 
        isOpen={selectedProduct !== null}
        onClose={() => setSelectedProduct(null)}
        product={selectedProduct}
      />
    </div>
  );
}
