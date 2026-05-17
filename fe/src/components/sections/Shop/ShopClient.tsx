'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
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

  // Active filters state
  const [activeSize, setActiveSize] = useState<string | null>(null);
  const [activeColor, setActiveColor] = useState<string | null>(null);
  const [maxPrice, setMaxPrice] = useState<number>(2000000);
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>('newest');
  const [searchText, setSearchText] = useState<string>('');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const shopContainerRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const router = useRouter();

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

  // Handle URL Category & Search Params and Auto-Scroll
  useEffect(() => {
    const categoryParam = searchParams.get('category') || 'all';
    setActiveCategory(categoryParam);

    const searchParam = searchParams.get('search') || searchParams.get('q') || '';
    setSearchText(searchParam);

    // If it is a specific category or search param, smoothly scroll to the product list block
    if ((categoryParam !== 'all' || searchParam) && shopContainerRef.current) {
      setTimeout(() => {
        if (shopContainerRef.current) {
          const y = shopContainerRef.current.getBoundingClientRect().top + window.scrollY - 100;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 150);
    }
  }, [searchParams]);

  // Click handler for category filter
  const handleCategoryClick = (categorySlug: string) => {
    const newCategory = activeCategory === categorySlug ? 'all' : categorySlug;
    setActiveCategory(newCategory);
    
    const params = new URLSearchParams(searchParams.toString());
    if (newCategory === 'all') {
      params.delete('category');
    } else {
      params.set('category', newCategory);
    }
    router.push(`/products?${params.toString()}`, { scroll: false });
  };

  // Filter products dynamically based on all states
  const filteredProducts = useMemo(() => {
    let result = [...initialProducts];

    // 1. Search filter
    if (searchText) {
      const q = searchText.toLowerCase().trim();
      result = result.filter(product => 
        product.name.toLowerCase().includes(q) || 
        product.description.toLowerCase().includes(q)
      );
    }

    // 2. Category filter
    if (activeCategory !== 'all') {
      result = result.filter(product => product.category === activeCategory);
    }

    // 3. Size filter (simulate sizing for mock products based on id parity)
    if (activeSize) {
      result = result.filter(product => {
        const idNum = parseInt(product.id.replace(/\D/g, '')) || 0;
        const availableSizes = idNum % 2 === 0 ? ['S', 'M', 'L'] : ['M', 'L', 'XL'];
        return availableSizes.includes(activeSize);
      });
    }

    // 4. Color filter
    if (activeColor) {
      const colorObj = colors.find(c => c.id === activeColor);
      if (colorObj) {
        result = result.filter(product => 
          product.colors?.some(c => c.toLowerCase() === colorObj.hex.toLowerCase())
        );
      }
    }

    // 5. Price filter
    result = result.filter(product => product.price <= maxPrice);

    // 6. Collections filter (simulate mapping)
    if (selectedCollections.length > 0) {
      result = result.filter(product => {
        const idNum = parseInt(product.id.replace(/\D/g, '')) || 0;
        const colIndex = idNum % collections.length;
        const pCollection = collections[colIndex];
        return selectedCollections.includes(pCollection);
      });
    }

    // 7. Materials filter (simulate mapping)
    if (selectedMaterials.length > 0) {
      result = result.filter(product => {
        const idNum = parseInt(product.id.replace(/\D/g, '')) || 0;
        const matIndex = idNum % materials.length;
        const pMaterial = materials[matIndex];
        return selectedMaterials.includes(pMaterial);
      });
    }

    // 8. Sorting
    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'newest') {
      // Keep default / newest sort
    }

    return result;
  }, [initialProducts, searchText, activeCategory, activeSize, activeColor, maxPrice, selectedCollections, selectedMaterials, sortBy]);

  // Pagination logic
  const ITEMS_PER_PAGE = 8;
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE) || 1;

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchText, activeCategory, activeSize, activeColor, maxPrice, selectedCollections, selectedMaterials, sortBy]);

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  return (
    <div className={styles.shopLayout} ref={shopContainerRef}>
      
      {/* FILTER BAR (Mobile/Tablet Top) */}
      <div className={styles.topFilterBar}>
        <div className={styles.filterBarLeft}>
          <button 
            className={styles.filterToggleBtn}
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
            BỘ LỌC
          </button>
          <button 
            className={styles.clearAllBtn}
            onClick={() => {
              setActiveCategory('all');
              setActiveSize(null);
              setActiveColor(null);
              setMaxPrice(2000000);
              setSelectedCollections([]);
              setSelectedMaterials([]);
              setSortBy('newest');
              setSearchText('');
              router.push('/products', { scroll: false });
            }}
          >
            Xóa tất cả
          </button>
        </div>
        <div className={styles.filterBarMiddle}>
          <span className={styles.luxurySlogan}>
            Uy tín tạo nên thương hiệu
          </span>
        </div>
        <div className={styles.filterBarRight}>
          <select 
            className={styles.sortSelect} 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">Sắp xếp: Mới nhất ▾</option>
            <option value="price-asc">Giá: Thấp đến Cao</option>
            <option value="price-desc">Giá: Cao đến Thấp</option>
          </select>
        </div>
      </div>

      <div className={styles.mainContent}>
        {/* SIDEBAR (Desktop / Mobile Drawer) */}
        {isMobileSidebarOpen && (
          <div 
            style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.4)', zIndex: 999 }} 
            onClick={() => setIsMobileSidebarOpen(false)}
          />
        )}
        <aside className={`${styles.sidebar} ${isMobileSidebarOpen ? styles.sidebarMobileActive : ''}`}>
          
          {/* Mobile Close Button */}
          <div className={styles.mobileSidebarHeader}>
            <span style={{ fontWeight: 'bold' }}>BỘ LỌC</span>
            <button 
              onClick={() => setIsMobileSidebarOpen(false)}
              className={styles.mobileCloseBtn}
            >
              ×
            </button>
          </div>

          {/* Tìm kiếm */}
          <div className={styles.filterBlock}>
            <div className={styles.filterHeader} style={{ cursor: 'default' }}>
              <span>TÌM KIẾM</span>
            </div>
            <div className={styles.searchBox}>
              <input 
                type="text" 
                placeholder="Nhập tên sản phẩm..."
                value={searchText}
                onChange={(e) => {
                  const value = e.target.value;
                  setSearchText(value);
                  const params = new URLSearchParams(searchParams.toString());
                  if (value) {
                    params.set('search', value);
                  } else {
                    params.delete('search');
                  }
                  router.push(`/products?${params.toString()}`, { scroll: false });
                }}
                className={styles.searchInput}
              />
            </div>
          </div>

          {/* Danh mục */}
          <div className={styles.filterBlock}>
            <div className={styles.filterHeader}>
              <span>DANH MỤC</span>
              <span className={styles.collapseIcon}>−</span>
            </div>
            <ul className={styles.categoryList}>
              <li 
                className={`${styles.categoryItem} ${activeCategory === 'all' ? styles.categoryActive : ''}`}
                onClick={() => handleCategoryClick('all')}
              >
                <span className={styles.categoryName}>Tất cả sản phẩm</span>
                <span className={styles.categoryCount}>({initialProducts.length})</span>
              </li>
              {categories.map(c => {
                const isActive = activeCategory === c.id;
                // Count products in this category dynamically
                const count = initialProducts.filter(p => p.category === c.id).length;
                return (
                  <li 
                    key={c.id} 
                    className={`${styles.categoryItem} ${isActive ? styles.categoryActive : ''}`}
                    onClick={() => handleCategoryClick(c.id)}
                  >
                    <span className={styles.categoryName}>{c.name}</span>
                    <span className={styles.categoryCount}>({count || c.count})</span>
                  </li>
                );
              })}
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
              <span className={styles.priceText}>Dưới {maxPrice.toLocaleString('vi-VN')}đ</span>
              <input 
                type="range" 
                min="200000" 
                max="2000000" 
                step="50000" 
                value={maxPrice} 
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--color-primary)', cursor: 'pointer' }}
              />
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
                  <input 
                    type="checkbox" 
                    checked={selectedCollections.includes(coll)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedCollections([...selectedCollections, coll]);
                      } else {
                        setSelectedCollections(selectedCollections.filter(c => c !== coll));
                      }
                    }}
                  />
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
                  <input 
                    type="checkbox" 
                    checked={selectedMaterials.includes(mat)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedMaterials([...selectedMaterials, mat]);
                      } else {
                        setSelectedMaterials(selectedMaterials.filter(m => m !== mat));
                      }
                    }}
                  />
                  <span>{mat}</span>
                </label>
              ))}
            </div>
          </div>

        </aside>

        {/* PRODUCT GRID */}
        <div className={styles.productsArea}>
          <div className={styles.gridSubHeader}>
            <span className={styles.resultText}>
              {filteredProducts.length === 0 
                ? 'Không tìm thấy sản phẩm' 
                : `Hiển thị ${Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, filteredProducts.length)}–${Math.min(currentPage * ITEMS_PER_PAGE, filteredProducts.length)} trong ${filteredProducts.length} sản phẩm`
              }
            </span>
            <div className={styles.viewToggles}>
              <button 
                className={viewMode === 'grid' ? styles.viewBtnActive : styles.viewBtn}
                onClick={() => setViewMode('grid')}
                aria-label="Xem dạng lưới"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
              </button>
              <button 
                className={viewMode === 'list' ? styles.viewBtnActive : styles.viewBtn}
                onClick={() => setViewMode('list')}
                aria-label="Xem dạng danh sách"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
              </button>
            </div>
          </div>

          {paginatedProducts.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px', width: '100%', gap: '16px' }}>
              <span style={{ fontSize: '32px' }}>🔍</span>
              <span style={{ fontSize: '15px', color: '#6B7280', fontWeight: 500 }}>Không tìm thấy sản phẩm phù hợp.</span>
              <button 
                onClick={() => {
                  setActiveCategory('all');
                  setActiveSize(null);
                  setActiveColor(null);
                  setMaxPrice(2000000);
                  setSelectedCollections([]);
                  setSelectedMaterials([]);
                  setSortBy('newest');
                  setSearchText('');
                  router.push('/products', { scroll: false });
                }}
                style={{ padding: '8px 20px', background: '#111827', color: '#fff', border: 'none', borderRadius: '2px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}
              >
                Xóa tất cả bộ lọc
              </button>
            </div>
          ) : (
            <div className={viewMode === 'grid' ? styles.grid : styles.listView}>
              {paginatedProducts.map(product => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onClick={() => setSelectedProduct(product)}
                />
              ))}
            </div>
          )}

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className={styles.pagination}>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button 
                  key={page} 
                  className={`${styles.pageItem} ${currentPage === page ? styles.pageActive : ''}`}
                  onClick={() => {
                    setCurrentPage(page);
                    if (shopContainerRef.current) {
                      const y = shopContainerRef.current.getBoundingClientRect().top + window.scrollY - 100;
                      window.scrollTo({ top: y, behavior: 'smooth' });
                    }
                  }}
                >
                  {page}
                </button>
              ))}
            </div>
          )}
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
