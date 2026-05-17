'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import styles from './ProductsClient.module.css';
import { FEATURED_PRODUCTS } from '@/data/mockData';

/* ===== TYPES ===== */
type ProductModalType = 'add' | 'edit' | 'view' | 'delete' | 'categories' | null;

interface ProductVariant {
  id: string;
  size: string;
  colorName: string;
  colorHex: string;
  sku: string;
  stock: number;
  additionalPrice: number;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  sortOrder: number;
  isActive: boolean;
}

interface AdminProduct {
  id: string;
  name: string;
  image: string;
  category: string;
  description: string;
  basePrice: number;
  salePrice: number;
  badge: string;
  skuPrefix: string;
  material: string;
  careInstructions: string;
  isFeatured: boolean;
  isActive: boolean;
  variants: ProductVariant[];
  soldCount: number;
  createdAt: string;
}

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'FREE'];

/* ===== HELPERS ===== */
function toSlug(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
}

function getCreatedDate(index: number): string {
  return `${15 - (index % 10)}/05/2025`;
}

/* Convert FEATURED_PRODUCTS to AdminProduct format */
const INITIAL_PRODUCTS: AdminProduct[] = FEATURED_PRODUCTS.map((p, index) => ({
  id: p.id,
  name: p.name,
  image: p.image,
  category: p.category,
  description: p.description || '',
  basePrice: p.price,
  salePrice: p.originalPrice ? p.price : 0,
  badge: p.badge || '',
  skuPrefix: p.id.toUpperCase(),
  material: 'Cotton',
  careInstructions: 'Giặt máy ở nhiệt độ thường.',
  isFeatured: index < 3,
  isActive: index % 5 !== 4,
  variants: [
    { id: '1', size: 'M', colorName: 'Đen', colorHex: '#000000', sku: `${p.id}-M-BLACK`, stock: 20, additionalPrice: 0 },
    { id: '2', size: 'L', colorName: 'Trắng', colorHex: '#FFFFFF', sku: `${p.id}-L-WHITE`, stock: 15, additionalPrice: 0 },
  ],
  soldCount: p.soldCount || 0,
  createdAt: getCreatedDate(index),
}));

/* ===== ICONS ===== */
const XIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const PlusIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);
const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" />
    <path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4h6v2" />
  </svg>
);
const EditIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);
const AlertIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);
const LayersIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 2 7 12 12 22 7 12 2" />
    <polyline points="2 12 12 17 22 12" />
    <polyline points="2 17 12 22 22 17" />
  </svg>
);

/* ===== COMPONENT ===== */
export default function ProductsClient() {
  const [products, setProducts] = useState<AdminProduct[]>(INITIAL_PRODUCTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Product modal state
  const [productModal, setProductModal] = useState<ProductModalType>(null);
  const [selectedProduct, setSelectedProduct] = useState<AdminProduct | null>(null);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  // Product form fields
  const [pName, setPName] = useState('');
  const [pCategory, setPCategory] = useState('');
  const [pDescription, setPDescription] = useState('');
  const [pBasePrice, setPBasePrice] = useState('');
  const [pSalePrice, setPSalePrice] = useState('');
  const [pBadge, setPBadge] = useState('');
  const [pSkuPrefix, setPSkuPrefix] = useState('');
  const [pMaterial, setPMaterial] = useState('');
  const [pCareInstructions, setPCareInstructions] = useState('');
  const [pIsFeatured, setPIsFeatured] = useState(false);
  const [pIsActive, setPIsActive] = useState(true);
  const [pVariants, setPVariants] = useState<ProductVariant[]>([
    { id: '1', size: 'M', colorName: '', colorHex: '#000000', sku: '', stock: 0, additionalPrice: 0 },
  ]);

  // Categories state
  const [categories, setCategories] = useState<Category[]>([
    { id: 'cat-1', name: 'Áo Thun', slug: 'ao-thun', description: '', sortOrder: 1, isActive: true },
    { id: 'cat-2', name: 'Áo Sơ Mi', slug: 'ao-so-mi', description: '', sortOrder: 2, isActive: true },
    { id: 'cat-3', name: 'Quần', slug: 'quan', description: '', sortOrder: 3, isActive: true },
    { id: 'cat-4', name: 'Váy Đầm', slug: 'vay-dam', description: '', sortOrder: 4, isActive: true },
    { id: 'cat-5', name: 'Áo Khoác', slug: 'ao-khoac', description: '', sortOrder: 5, isActive: true },
    { id: 'cat-6', name: 'Phụ Kiện', slug: 'phu-kien', description: '', sortOrder: 6, isActive: true },
  ]);

  const [catModal, setCatModal] = useState<'add' | 'edit' | 'delete' | null>(null);
  const [selectedCat, setSelectedCat] = useState<Category | null>(null);
  const [catName, setCatName] = useState('');
  const [catSlug, setCatSlug] = useState('');
  const [catDescription, setCatDescription] = useState('');
  const [catSortOrder, setCatSortOrder] = useState('');
  const [catIsActive, setCatIsActive] = useState(true);

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  /* ---- Filtering ---- */
  const filteredProducts = products.filter(p => {
    const matchSearch = !searchTerm ||
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.skuPrefix.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = !categoryFilter || p.category === categoryFilter;
    const matchStatus = !statusFilter ||
      (statusFilter === 'hien_thi' && p.isActive) ||
      (statusFilter === 'an' && !p.isActive);
    return matchSearch && matchCat && matchStatus;
  });

  /* ---- Selection ---- */
  const toggleSelectAll = () => {
    if (selectedProducts.size === filteredProducts.length) {
      setSelectedProducts(new Set());
    } else {
      setSelectedProducts(new Set(filteredProducts.map(p => p.id)));
    }
  };

  const toggleSelectProduct = (id: string) => {
    const s = new Set(selectedProducts);
    if (s.has(id)) s.delete(id);
    else s.add(id);
    setSelectedProducts(s);
  };

  /* ---- Close dropdown on outside click ---- */
  useEffect(() => {
    if (!openDropdownId) return;
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [openDropdownId]);

  /* ---- Close modal on Escape ---- */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const closeModal = useCallback(() => {
    setProductModal(null);
    setSelectedProduct(null);
    setCatModal(null);
    setSelectedCat(null);
  }, []);

  /* ---- Populate product form ---- */
  const populateForm = (p: AdminProduct) => {
    setPName(p.name);
    setPCategory(p.category);
    setPDescription(p.description);
    setPBasePrice(String(p.basePrice));
    setPSalePrice(p.salePrice ? String(p.salePrice) : '');
    setPBadge(p.badge);
    setPSkuPrefix(p.skuPrefix);
    setPMaterial(p.material);
    setPCareInstructions(p.careInstructions);
    setPIsFeatured(p.isFeatured);
    setPIsActive(p.isActive);
    setPVariants(p.variants.length > 0 ? p.variants : [
      { id: '1', size: 'M', colorName: '', colorHex: '#000000', sku: '', stock: 0, additionalPrice: 0 },
    ]);
  };

  const clearForm = () => {
    setPName('');
    setPCategory(categories[0]?.slug || '');
    setPDescription('');
    setPBasePrice('');
    setPSalePrice('');
    setPBadge('');
    setPSkuPrefix('');
    setPMaterial('');
    setPCareInstructions('');
    setPIsFeatured(false);
    setPIsActive(true);
    setPVariants([{ id: '1', size: 'M', colorName: '', colorHex: '#000000', sku: '', stock: 0, additionalPrice: 0 }]);
  };

  /* ---- Submit Add ---- */
  const handleAddProduct = () => {
    if (!pName.trim() || !pBasePrice) return;
    const newProduct: AdminProduct = {
      id: Date.now().toString(),
      name: pName.trim(),
      image: '/images/products/product-1.png',
      category: pCategory,
      description: pDescription,
      basePrice: Number(pBasePrice),
      salePrice: Number(pSalePrice) || 0,
      badge: pBadge,
      skuPrefix: pSkuPrefix || toSlug(pName),
      material: pMaterial,
      careInstructions: pCareInstructions,
      isFeatured: pIsFeatured,
      isActive: pIsActive,
      variants: pVariants,
      soldCount: 0,
      createdAt: new Date().toLocaleDateString('vi-VN'),
    };
    setProducts(prev => [newProduct, ...prev]);
    closeModal();
  };

  /* ---- Submit Edit ---- */
  const handleEditProduct = () => {
    if (!selectedProduct || !pName.trim() || !pBasePrice) return;
    setProducts(prev =>
      prev.map(p =>
        p.id === selectedProduct.id
          ? {
              ...p,
              name: pName.trim(),
              category: pCategory,
              description: pDescription,
              basePrice: Number(pBasePrice),
              salePrice: Number(pSalePrice) || 0,
              badge: pBadge,
              skuPrefix: pSkuPrefix,
              material: pMaterial,
              careInstructions: pCareInstructions,
              isFeatured: pIsFeatured,
              isActive: pIsActive,
              variants: pVariants,
            }
          : p
      )
    );
    closeModal();
  };

  /* ---- Confirm Delete Product ---- */
  const handleDeleteProduct = () => {
    if (!selectedProduct) return;
    setProducts(prev => prev.filter(p => p.id !== selectedProduct.id));
    closeModal();
  };

  /* ---- Variant helpers ---- */
  const addVariant = () => {
    setPVariants(prev => [
      ...prev,
      { id: Date.now().toString(), size: 'M', colorName: '', colorHex: '#000000', sku: '', stock: 0, additionalPrice: 0 },
    ]);
  };

  const removeVariant = (id: string) => {
    setPVariants(prev => prev.filter(v => v.id !== id));
  };

  const updateVariant = (id: string, field: keyof ProductVariant, value: string | number) => {
    setPVariants(prev =>
      prev.map(v => (v.id === id ? { ...v, [field]: value } : v))
    );
  };

  /* ---- Category helpers ---- */
  const getCategoryName = (slug: string): string => {
    const cat = categories.find(c => c.slug === slug);
    return cat ? cat.name : slug;
  };

  const openCatAdd = () => {
    setCatName('');
    setCatSlug('');
    setCatDescription('');
    setCatSortOrder(String(categories.length + 1));
    setCatIsActive(true);
    setSelectedCat(null);
    setCatModal('add');
  };

  const openCatEdit = (cat: Category) => {
    setCatName(cat.name);
    setCatSlug(cat.slug);
    setCatDescription(cat.description);
    setCatSortOrder(String(cat.sortOrder));
    setCatIsActive(cat.isActive);
    setSelectedCat(cat);
    setCatModal('edit');
  };

  const handleCatSave = () => {
    if (!catName.trim()) return;
    if (catModal === 'add') {
      const newCat: Category = {
        id: Date.now().toString(),
        name: catName.trim(),
        slug: catSlug || toSlug(catName),
        description: catDescription,
        sortOrder: Number(catSortOrder) || categories.length + 1,
        isActive: catIsActive,
      };
      setCategories(prev => [...prev, newCat]);
    } else if (catModal === 'edit' && selectedCat) {
      setCategories(prev =>
        prev.map(c =>
          c.id === selectedCat.id
            ? { ...c, name: catName.trim(), slug: catSlug, description: catDescription, sortOrder: Number(catSortOrder), isActive: catIsActive }
            : c
        )
      );
    }
    setCatModal(null);
    setSelectedCat(null);
  };

  const handleCatDelete = () => {
    if (!selectedCat) return;
    setCategories(prev => prev.filter(c => c.id !== selectedCat.id));
    setCatModal(null);
    setSelectedCat(null);
  };

  const toggleCatActive = (id: string) => {
    setCategories(prev =>
      prev.map(c => (c.id === id ? { ...c, isActive: !c.isActive } : c))
    );
  };

  /* ---- Status badge helper ---- */
  const getStatusInfo = (p: AdminProduct, index: number) => {
    if (!p.isActive) return { label: 'Ẩn', type: 'an' };
    const totalStock = p.variants.reduce((sum, v) => sum + v.stock, 0);
    if (totalStock === 0) return { label: 'Hết hàng', type: 'het_hang' };
    return { label: 'Hiển thị', type: 'hien_thi' };
  };

  const getTotalStock = (p: AdminProduct) => p.variants.reduce((s, v) => s + v.stock, 0);

  return (
    <div>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div className={styles.pageTitleBlock}>
          <h1>Quản lý sản phẩm</h1>
          <p>Quản lý thông tin sản phẩm, danh mục, tồn kho và trạng thái hiển thị.</p>
        </div>
        <div className={styles.headerActions}>
          <button
            className={styles.secondaryBtn}
            onClick={() => { setProductModal('categories'); }}
          >
            <LayersIcon />
            Quản lý danh mục
          </button>
          <button className={styles.secondaryBtn}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Xuất dữ liệu
          </button>
          <button
            className={styles.primaryBtn}
            onClick={() => { clearForm(); setSelectedProduct(null); setProductModal('add'); }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Thêm sản phẩm
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.iconBox}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" />
            </svg>
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Tổng sản phẩm</span>
            <span className={styles.statValue}>{products.length}</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.iconTag}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
              <line x1="7" y1="7" x2="7.01" y2="7" />
            </svg>
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Đang hiển thị</span>
            <div className={styles.statValueRow}>
              <span className={styles.statValue}>{products.filter(p => p.isActive).length}</span>
              <span className={`${styles.statChange} ${styles.changePositive}`}>↑ 12%</span>
            </div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.iconEmpty}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Hết hàng</span>
            <div className={styles.statValueRow}>
              <span className={styles.statValue}>{products.filter(p => getTotalStock(p) === 0).length}</span>
              <span className={`${styles.statChange} ${styles.changeNegative}`}>↑ 8%</span>
            </div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.iconHidden}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
              <line x1="1" y1="1" x2="23" y2="23" />
            </svg>
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Ẩn</span>
            <div className={styles.statValueRow}>
              <span className={styles.statValue}>{products.filter(p => !p.isActive).length}</span>
              <span className={`${styles.statChange} ${styles.changeWarning}`}>↑ 5%</span>
            </div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.iconLayers}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 2 7 12 12 22 7 12 2" />
              <polyline points="2 12 12 17 22 12" /><polyline points="2 17 12 22 22 17" />
            </svg>
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Danh mục</span>
            <span className={styles.statValue}>{categories.length}</span>
          </div>
        </div>
      </div>

      <div className={styles.container}>
        {/* Filter Bar */}
        <div className={styles.filterBar}>
          <div className={styles.filterLeft}>
            <div className={styles.searchWrap}>
              <svg className={styles.searchIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Tìm kiếm theo tên, mã sản phẩm..."
                className={styles.searchInput}
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <div className={styles.dropdownGroup}>
              <select
                className={styles.filterSelect}
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
              >
                <option value="">Danh mục</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.slug}>{cat.name}</option>
                ))}
              </select>
              <select
                className={styles.filterSelect}
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
              >
                <option value="">Trạng thái</option>
                <option value="hien_thi">Hiển thị</option>
                <option value="an">Ẩn</option>
              </select>
              <select className={styles.filterSelect} defaultValue="">
                <option value="" disabled hidden>Kho hàng</option>
                <option value="in_stock">Còn hàng</option>
                <option value="out_stock">Hết hàng</option>
              </select>
              <select className={styles.filterSelect} defaultValue="">
                <option value="" disabled hidden>Khoảng giá</option>
                <option value="0-500">Dưới 500.000đ</option>
                <option value="500-1000">500.000đ - 1.000.000đ</option>
              </select>
            </div>
          </div>
          <button className={styles.filterBtn} onClick={() => { setSearchTerm(''); setCategoryFilter(''); setStatusFilter(''); }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
            Bộ lọc
          </button>
        </div>

        {/* Table */}
        <div className={styles.tableContainer}>
          <table className={styles.productTable}>
            <thead>
              <tr>
                <th className={styles.checkboxCell}>
                  <input
                    type="checkbox"
                    className={styles.checkbox}
                    checked={selectedProducts.size === filteredProducts.length && filteredProducts.length > 0}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th>Sản phẩm</th>
                <th>Danh mục</th>
                <th>Giá</th>
                <th>Kho</th>
                <th>Đã bán</th>
                <th>Trạng thái</th>
                <th>Ngày tạo</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: '32px', color: '#9CA3AF' }}>
                    Không tìm thấy sản phẩm nào.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product, index) => {
                  const statusInfo = getStatusInfo(product, index);
                  return (
                    <tr key={product.id}>
                      <td className={styles.checkboxCell}>
                        <input
                          type="checkbox"
                          className={styles.checkbox}
                          checked={selectedProducts.has(product.id)}
                          onChange={() => toggleSelectProduct(product.id)}
                        />
                      </td>
                      <td>
                        <div className={styles.productIdentity}>
                          <div style={{ position: 'relative', width: '48px', height: '48px', flexShrink: 0 }}>
                            <Image
                              src={product.image}
                              alt={product.name}
                              fill
                              className={styles.productImage}
                            />
                          </div>
                          <div className={styles.productInfo}>
                            <span className={styles.productName}>{product.name}</span>
                            <span className={styles.productSku}>{product.skuPrefix.toUpperCase()}</span>
                          </div>
                        </div>
                      </td>
                      <td>{getCategoryName(product.category)}</td>
                      <td className={styles.priceCol}>{formatPrice(product.basePrice)}</td>
                      <td>{getTotalStock(product)}</td>
                      <td>{product.soldCount}</td>
                      <td>
                        <span className={`${styles.badge} ${styles[`badge_${statusInfo.type}`]}`}>
                          {statusInfo.label}
                        </span>
                      </td>
                      <td>{product.createdAt}</td>
                      <td>
                        <div className={styles.actionGroup}>
                          {/* View */}
                          <button
                            className={styles.actionIconBtn}
                            aria-label="View"
                            onClick={() => { setSelectedProduct(product); setProductModal('view'); }}
                          >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                            </svg>
                          </button>
                          {/* Edit */}
                          <button
                            className={styles.actionIconBtn}
                            aria-label="Edit"
                            onClick={() => { setSelectedProduct(product); populateForm(product); setProductModal('edit'); }}
                          >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                          </button>
                          {/* More dropdown */}
                          <div
                            className={styles.actionDropdown}
                            ref={openDropdownId === product.id ? dropdownRef : null}
                          >
                            <button
                              className={styles.actionIconBtn}
                              aria-label="More"
                              onClick={() => setOpenDropdownId(openDropdownId === product.id ? null : product.id)}
                            >
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="1" /><circle cx="12" cy="5" r="1" /><circle cx="12" cy="19" r="1" />
                              </svg>
                            </button>
                            {openDropdownId === product.id && (
                              <div className={styles.dropdownMenu}>
                                <button
                                  className={`${styles.dropdownItem} ${styles.dropdownItemDanger}`}
                                  onClick={() => { setSelectedProduct(product); setProductModal('delete'); setOpenDropdownId(null); }}
                                >
                                  <TrashIcon />
                                  Xóa sản phẩm
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className={styles.pagination}>
          <div className={styles.pageInfo}>
            Hiển thị 1 - {filteredProducts.length} trong {products.length} sản phẩm
          </div>
          <div className={styles.pageControls}>
            <select className={styles.pageSelect} defaultValue="10">
              <option value="10">10 / trang</option>
              <option value="20">20 / trang</option>
              <option value="50">50 / trang</option>
            </select>
            <div className={styles.pageNumbers}>
              <button className={`${styles.pageBtn} ${styles.disabled}`}>&lt;</button>
              <button className={`${styles.pageBtn} ${styles.active}`}>1</button>
              <button className={`${styles.pageBtn} ${styles.disabled}`}>&gt;</button>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================
          MODALS
          ====================================================== */}

      {/* --- Add / Edit Product Modal --- */}
      {(productModal === 'add' || productModal === 'edit') && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modalCard} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>
                {productModal === 'add' ? 'Thêm sản phẩm' : 'Sửa thông tin sản phẩm'}
              </h2>
              <button className={styles.modalCloseBtn} onClick={closeModal}><XIcon /></button>
            </div>
            <div className={styles.modalBody}>

              {/* Section 1: Thông tin cơ bản */}
              <div className={styles.formSection}>
                <p className={styles.sectionTitle}>Thông tin cơ bản</p>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Tên sản phẩm *</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    placeholder="Nhập tên sản phẩm"
                    value={pName}
                    onChange={e => setPName(e.target.value)}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Danh mục *</label>
                  <select
                    className={styles.formSelect}
                    value={pCategory}
                    onChange={e => setPCategory(e.target.value)}
                  >
                    <option value="">-- Chọn danh mục --</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.slug}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Mô tả</label>
                  <textarea
                    className={styles.formTextarea}
                    rows={3}
                    placeholder="Mô tả ngắn về sản phẩm..."
                    value={pDescription}
                    onChange={e => setPDescription(e.target.value)}
                  />
                </div>
              </div>

              {/* Section 2: Giá & Hiển thị */}
              <div className={styles.formSection}>
                <p className={styles.sectionTitle}>Giá &amp; Hiển thị</p>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Giá gốc (VND) *</label>
                    <input
                      type="number"
                      className={styles.formInput}
                      placeholder="0"
                      value={pBasePrice}
                      onChange={e => setPBasePrice(e.target.value)}
                      min="0"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Giá sale (VND)</label>
                    <input
                      type="number"
                      className={styles.formInput}
                      placeholder="0"
                      value={pSalePrice}
                      onChange={e => setPSalePrice(e.target.value)}
                      min="0"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Badge</label>
                    <select
                      className={styles.formSelect}
                      value={pBadge}
                      onChange={e => setPBadge(e.target.value)}
                    >
                      <option value="">Không có</option>
                      <option value="new">New</option>
                      <option value="sale">Sale</option>
                      <option value="hot">Hot</option>
                      <option value="bestseller">Bestseller</option>
                    </select>
                  </div>
                </div>
                <label className={styles.checkboxRow}>
                  <input
                    type="checkbox"
                    checked={pIsFeatured}
                    onChange={e => setPIsFeatured(e.target.checked)}
                  />
                  Sản phẩm nổi bật
                </label>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Trạng thái</label>
                  <div className={styles.toggleGroup}>
                    <button
                      type="button"
                      className={`${styles.toggleBtn} ${pIsActive ? styles.toggleBtnActive : ''}`}
                      onClick={() => setPIsActive(true)}
                    >
                      Hiển thị
                    </button>
                    <button
                      type="button"
                      className={`${styles.toggleBtn} ${!pIsActive ? styles.toggleBtnActive : ''}`}
                      onClick={() => setPIsActive(false)}
                    >
                      Ẩn
                    </button>
                  </div>
                </div>
              </div>

              {/* Section 3: Thông tin thêm */}
              <div className={styles.formSection}>
                <p className={styles.sectionTitle}>Thông tin thêm</p>
                <div className={styles.formRow2}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>SKU Prefix</label>
                    <input
                      type="text"
                      className={styles.formInput}
                      placeholder="VD: SP001"
                      value={pSkuPrefix}
                      onChange={e => setPSkuPrefix(e.target.value)}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Chất liệu</label>
                    <input
                      type="text"
                      className={styles.formInput}
                      placeholder="VD: Cotton 100%"
                      value={pMaterial}
                      onChange={e => setPMaterial(e.target.value)}
                    />
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Hướng dẫn giặt</label>
                  <textarea
                    className={styles.formTextarea}
                    rows={2}
                    placeholder="VD: Giặt máy ở 30°C..."
                    value={pCareInstructions}
                    onChange={e => setPCareInstructions(e.target.value)}
                  />
                </div>
              </div>

              {/* Section 4: Biến thể */}
              <div className={styles.formSection}>
                <p className={styles.sectionTitle}>Phân loại (Biến thể)</p>
                <div style={{ overflowX: 'auto' }}>
                  <table className={styles.variantsTable}>
                    <thead>
                      <tr>
                        <th>Size</th>
                        <th>Màu sắc</th>
                        <th>Mã hex</th>
                        <th>SKU</th>
                        <th>Số lượng</th>
                        <th>Giá thêm</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {pVariants.map(v => (
                        <tr key={v.id}>
                          <td style={{ minWidth: 80 }}>
                            <select
                              className={styles.variantSelect}
                              value={v.size}
                              onChange={e => updateVariant(v.id, 'size', e.target.value)}
                            >
                              {SIZES.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                          </td>
                          <td style={{ minWidth: 100 }}>
                            <input
                              type="text"
                              className={styles.variantInput}
                              placeholder="Đen"
                              value={v.colorName}
                              onChange={e => updateVariant(v.id, 'colorName', e.target.value)}
                            />
                          </td>
                          <td style={{ minWidth: 100 }}>
                            <div className={styles.colorInputWrap}>
                              <input
                                type="color"
                                value={v.colorHex}
                                onChange={e => updateVariant(v.id, 'colorHex', e.target.value)}
                              />
                              <input
                                type="text"
                                className={styles.variantInput}
                                value={v.colorHex}
                                onChange={e => updateVariant(v.id, 'colorHex', e.target.value)}
                                style={{ width: 70 }}
                              />
                            </div>
                          </td>
                          <td style={{ minWidth: 110 }}>
                            <input
                              type="text"
                              className={styles.variantInput}
                              placeholder="SKU-M-DEN"
                              value={v.sku}
                              onChange={e => updateVariant(v.id, 'sku', e.target.value)}
                            />
                          </td>
                          <td style={{ minWidth: 80 }}>
                            <input
                              type="number"
                              className={styles.variantInput}
                              value={v.stock}
                              min={0}
                              onChange={e => updateVariant(v.id, 'stock', Number(e.target.value))}
                            />
                          </td>
                          <td style={{ minWidth: 100 }}>
                            <input
                              type="number"
                              className={styles.variantInput}
                              value={v.additionalPrice}
                              min={0}
                              onChange={e => updateVariant(v.id, 'additionalPrice', Number(e.target.value))}
                            />
                          </td>
                          <td>
                            <button
                              type="button"
                              className={styles.removeVariantBtn}
                              onClick={() => removeVariant(v.id)}
                              title="Xóa biến thể"
                            >
                              <XIcon />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <button type="button" className={styles.addVariantBtn} onClick={addVariant}>
                  <PlusIcon />
                  Thêm biến thể
                </button>
              </div>

            </div>
            <div className={styles.modalFooter}>
              <button className={styles.btnSecondaryModal} onClick={closeModal}>Hủy</button>
              <button
                className={styles.btnPrimary}
                onClick={productModal === 'add' ? handleAddProduct : handleEditProduct}
              >
                Lưu sản phẩm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- View Product Modal --- */}
      {productModal === 'view' && selectedProduct && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={`${styles.modalCard} ${styles.modalCardMd}`} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Chi tiết sản phẩm</h2>
              <button className={styles.modalCloseBtn} onClick={closeModal}><XIcon /></button>
            </div>
            <div className={styles.modalBody}>
              {/* Top section */}
              <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <div style={{ position: 'relative', width: 80, height: 80, borderRadius: 8, overflow: 'hidden', flexShrink: 0, background: '#F3F4F6' }}>
                  <Image src={selectedProduct.image} alt={selectedProduct.name} fill style={{ objectFit: 'cover' }} />
                </div>
                <div>
                  <p style={{ fontWeight: 700, fontSize: 16, color: '#1F2937', margin: '0 0 4px' }}>{selectedProduct.name}</p>
                  <p style={{ fontSize: 13, color: '#9CA3AF', margin: 0 }}>{selectedProduct.skuPrefix.toUpperCase()}</p>
                  {selectedProduct.badge && (
                    <span style={{ marginTop: 6, display: 'inline-block', fontSize: 12, padding: '2px 10px', borderRadius: 20, background: '#FEF3C7', color: '#92400E', fontWeight: 600 }}>
                      {selectedProduct.badge.toUpperCase()}
                    </span>
                  )}
                </div>
              </div>

              {/* Info grid */}
              <div className={styles.detailSection}>
                <p className={styles.detailSectionTitle}>Thông tin sản phẩm</p>
                <div className={styles.detailGrid}>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Danh mục</span>
                    <span className={styles.detailValue}>{getCategoryName(selectedProduct.category)}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Giá gốc</span>
                    <span className={styles.detailValue} style={{ color: '#A67B5B', fontWeight: 700 }}>{formatPrice(selectedProduct.basePrice)}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Giá sale</span>
                    <span className={styles.detailValue}>{selectedProduct.salePrice ? formatPrice(selectedProduct.salePrice) : '—'}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Trạng thái</span>
                    <span className={styles.detailValue}>
                      <span className={`${styles.badge} ${selectedProduct.isActive ? styles.badge_hien_thi : styles.badge_an}`}>
                        {selectedProduct.isActive ? 'Hiển thị' : 'Ẩn'}
                      </span>
                    </span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Nổi bật</span>
                    <span className={styles.detailValue}>{selectedProduct.isFeatured ? 'Có' : 'Không'}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Chất liệu</span>
                    <span className={styles.detailValue}>{selectedProduct.material || '—'}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Đã bán</span>
                    <span className={styles.detailValue}>{selectedProduct.soldCount}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Ngày tạo</span>
                    <span className={styles.detailValue}>{selectedProduct.createdAt}</span>
                  </div>
                </div>
              </div>

              {/* Variants */}
              {selectedProduct.variants.length > 0 && (
                <div className={styles.detailSection}>
                  <p className={styles.detailSectionTitle}>Biến thể</p>
                  <table className={styles.variantsTable}>
                    <thead>
                      <tr>
                        <th>Size</th>
                        <th>Màu</th>
                        <th>Stock</th>
                        <th>Giá thêm</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedProduct.variants.map(v => (
                        <tr key={v.id}>
                          <td>{v.size}</td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              <span style={{ width: 14, height: 14, borderRadius: '50%', background: v.colorHex, border: '1px solid #E5E7EB', display: 'inline-block' }} />
                              {v.colorName}
                            </div>
                          </td>
                          <td>{v.stock}</td>
                          <td>{v.additionalPrice ? formatPrice(v.additionalPrice) : '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.btnSecondaryModal} onClick={closeModal}>Đóng</button>
              <button
                className={styles.btnPrimary}
                onClick={() => { populateForm(selectedProduct); setProductModal('edit'); }}
              >
                Chỉnh sửa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- Delete Product Modal --- */}
      {productModal === 'delete' && selectedProduct && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={`${styles.modalCard} ${styles.modalCardXs}`} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Xóa sản phẩm</h2>
              <button className={styles.modalCloseBtn} onClick={closeModal}><XIcon /></button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.confirmIcon}>
                <AlertIcon />
              </div>
              <p className={styles.confirmText}>
                Bạn có chắc chắn muốn xóa{' '}
                <strong style={{ color: '#111827', fontWeight: 600 }}>{selectedProduct.name}</strong>?{' '}
                Hành động này không thể hoàn tác.
              </p>
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.btnSecondaryModal} onClick={closeModal}>Hủy</button>
              <button className={styles.btnDanger} onClick={handleDeleteProduct}>Xóa</button>
            </div>
          </div>
        </div>
      )}

      {/* --- Categories Modal --- */}
      {productModal === 'categories' && (
        <div className={styles.modalOverlay} onClick={e => { if (catModal) return; closeModal(); }}>
          <div
            className={`${styles.modalCard} ${styles.modalCardSm}`}
            style={{ maxHeight: '85vh' }}
            onClick={e => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <div className={styles.catModalHeaderRow}>
                <h2 className={styles.modalTitle}>Quản lý danh mục</h2>
                <button className={styles.btnSmPrimary} onClick={openCatAdd}>
                  <PlusIcon />
                  Thêm danh mục
                </button>
              </div>
              <button className={styles.modalCloseBtn} onClick={closeModal} style={{ marginLeft: 8 }}><XIcon /></button>
            </div>
            <div className={styles.modalBody}>
              {/* Category add/edit form */}
              {(catModal === 'add' || catModal === 'edit') && (
                <div className={styles.catFormBox}>
                  <p className={styles.catFormTitle}>
                    {catModal === 'add' ? 'Thêm danh mục mới' : 'Chỉnh sửa danh mục'}
                  </p>
                  <div className={styles.formRow2}>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Tên danh mục *</label>
                      <input
                        type="text"
                        className={styles.formInput}
                        placeholder="VD: Áo Thun"
                        value={catName}
                        onChange={e => {
                          setCatName(e.target.value);
                          setCatSlug(toSlug(e.target.value));
                        }}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Slug</label>
                      <input
                        type="text"
                        className={styles.formInput}
                        placeholder="ao-thun"
                        value={catSlug}
                        onChange={e => setCatSlug(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Mô tả</label>
                    <input
                      type="text"
                      className={styles.formInput}
                      placeholder="Mô tả ngắn (tùy chọn)"
                      value={catDescription}
                      onChange={e => setCatDescription(e.target.value)}
                    />
                  </div>
                  <div className={styles.formRow2}>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Thứ tự hiển thị</label>
                      <input
                        type="number"
                        className={styles.formInput}
                        value={catSortOrder}
                        min={1}
                        onChange={e => setCatSortOrder(e.target.value)}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Trạng thái</label>
                      <div className={styles.toggleGroup}>
                        <button
                          type="button"
                          className={`${styles.toggleBtn} ${catIsActive ? styles.toggleBtnActive : ''}`}
                          onClick={() => setCatIsActive(true)}
                          style={{ fontSize: 13 }}
                        >
                          Hiện
                        </button>
                        <button
                          type="button"
                          className={`${styles.toggleBtn} ${!catIsActive ? styles.toggleBtnActive : ''}`}
                          onClick={() => setCatIsActive(false)}
                          style={{ fontSize: 13 }}
                        >
                          Ẩn
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className={styles.catFormFooter}>
                    <button className={styles.btnSmSecondary} onClick={() => { setCatModal(null); setSelectedCat(null); }}>Hủy</button>
                    <button className={styles.btnSmPrimary} onClick={handleCatSave}>Lưu</button>
                  </div>
                </div>
              )}

              {/* Delete confirm for category */}
              {catModal === 'delete' && selectedCat && (
                <div className={styles.catFormBox} style={{ background: '#FEF2F2', borderColor: '#FCA5A5' }}>
                  <p style={{ fontSize: 14, color: '#374151', margin: 0, lineHeight: 1.6 }}>
                    Xóa danh mục <strong style={{ color: '#111827' }}>{selectedCat.name}</strong>?
                    Hành động này không thể hoàn tác.
                  </p>
                  <div className={styles.catFormFooter}>
                    <button className={styles.btnSmSecondary} onClick={() => { setCatModal(null); setSelectedCat(null); }}>Hủy</button>
                    <button className={styles.btnDanger} style={{ padding: '6px 14px', fontSize: 13 }} onClick={handleCatDelete}>Xóa</button>
                  </div>
                </div>
              )}

              {/* Category list */}
              <div className={styles.catList}>
                {categories.map(cat => (
                  <div key={cat.id} className={styles.catRow}>
                    <span style={{ color: '#D1D5DB', fontSize: 16, cursor: 'grab' }}>⠿</span>
                    <span className={styles.catName}>{cat.name}</span>
                    <span className={styles.catSlugBadge}>{cat.slug}</span>
                    <div className={styles.catActions}>
                      <button
                        className={`${styles.toggleSwitch} ${cat.isActive ? styles.toggleSwitchOn : ''}`}
                        onClick={() => toggleCatActive(cat.id)}
                        title={cat.isActive ? 'Đang hiển thị — click để ẩn' : 'Đang ẩn — click để hiện'}
                        aria-label="Toggle active"
                      />
                      <button className={styles.catIconBtn} onClick={() => openCatEdit(cat)} title="Chỉnh sửa">
                        <EditIcon />
                      </button>
                      <button
                        className={`${styles.catIconBtn} ${styles.catIconBtnDanger}`}
                        onClick={() => { setSelectedCat(cat); setCatModal('delete'); }}
                        title="Xóa"
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.btnSecondaryModal} onClick={closeModal}>Đóng</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
