'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CATEGORIES } from '@/data/mockData';
import { useCartStore } from '@/store/useCartStore';
import { useAuth } from '@/store/AuthContext';
import CartDrawer from '@/components/ui/CartDrawer/CartDrawer';
import styles from './Header.module.css';

const NAV_LINKS = [
  { label: 'PHONG CÁCH', id: 'mix-styles' },
  { label: 'SẢN PHẨM', id: 'products', hasDropdown: true },
  { label: 'VOUCHER', id: 'promos' },
];

export default function Header() {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  const { isAuthenticated, isAdmin } = useAuth();

  // Cart Store
  const { getTotalItems, toggleCart } = useCartStore();
  const [cartCount, setCartCount] = useState(0);

  // Avoid hydration mismatch for persisted store
  useEffect(() => {
    setCartCount(getTotalItems());
  }, [getTotalItems]);

  const handleCategorySelect = (slug: string) => {
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
    // Dispatch custom event to ProductGrid to change category
    window.dispatchEvent(new CustomEvent('categoryChange', { detail: slug }));
    scrollToSection('products');
  };

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;
    setIsScrolled(currentScrollY > 10);
    setIsVisible(currentScrollY < lastScrollY || currentScrollY < 80);
    setLastScrollY(currentScrollY);
  }, [lastScrollY]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      // Offset by header height
      const y = element.getBoundingClientRect().top + window.scrollY - 60;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  const headerClassName = [
    styles.header,
    isScrolled ? styles.scrolled : '',
    isVisible ? styles.visible : styles.hidden,
  ].filter(Boolean).join(' ');

  return (
    <>
      <header className={headerClassName} role="banner">
        <div className={styles.container}>
          {/* Mobile hamburger */}
          <button
            className={styles.hamburger}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? 'Đóng menu' : 'Mở menu điều hướng'}
            aria-expanded={isMobileMenuOpen}
          >
            <span className={`${styles.hamburgerLine} ${isMobileMenuOpen ? styles.open : ''}`} />
            <span className={`${styles.hamburgerLine} ${isMobileMenuOpen ? styles.open : ''}`} />
            <span className={`${styles.hamburgerLine} ${isMobileMenuOpen ? styles.open : ''}`} />
          </button>

          {/* Logo */}
          <Link href="/" className={`${styles.logo} ${styles.hideLogoOnMobile}`} aria-label="Levents Clone - Trang chủ">
            LEVENTS<sup className={styles.logoSup}>&deg;</sup>
          </Link>

          {/* Desktop Nav */}
          <nav className={styles.nav} aria-label="Điều hướng chính">
            <ul className={styles.navList}>
              <li className={styles.navItem}>
                <Link href="/#mix-styles" className={styles.navLink}>PHONG CÁCH</Link>
              </li>
              <li 
                className={styles.navItem}
                onMouseEnter={() => setIsDropdownOpen(true)}
                onMouseLeave={() => setIsDropdownOpen(false)}
              >
                <button 
                  className={styles.navLink}
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  aria-expanded={isDropdownOpen}
                >
                  <Link href="/products" style={{ color: 'inherit', textDecoration: 'none' }}>SẢN PHẨM ▾</Link>
                </button>

                {isDropdownOpen && (
                  <div className={styles.dropdownMenu}>
                    <Link href="/products" className={styles.dropdownItem}>Tất cả</Link>
                    {CATEGORIES.map(cat => (
                      <Link 
                        key={cat.id} 
                        href={`/products?category=${cat.slug}`}
                        className={styles.dropdownItem}
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                )}
              </li>
              <li className={styles.navItem}>
                <Link href="/#promos" className={styles.navLink}>VOUCHER</Link>
              </li>
            </ul>
          </nav>

          {/* Actions */}
          <div className={styles.actions}>
            <div className={`${styles.searchContainer} ${isSearchOpen ? styles.searchOpen : ''}`}>
              <input 
                type="text" 
                className={styles.searchInput} 
                placeholder="Tìm kiếm..."
                ref={searchInputRef}
                onBlur={() => setIsSearchOpen(false)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const value = e.currentTarget.value.trim();
                    if (value) {
                      router.push(`/products?search=${encodeURIComponent(value)}`);
                    } else {
                      router.push('/products');
                    }
                    setIsSearchOpen(false);
                  }
                }}
              />
            </div>
            <button 
              className={styles.actionBtn} 
              aria-label="Tìm kiếm sản phẩm"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
            </button>
            {isAuthenticated ? (
              <Link href={isAdmin ? '/admin' : '/account/profile'} className={styles.actionBtn} aria-label="Tài khoản cá nhân">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                  {isAdmin && <circle cx="18" cy="18" r="2" fill="currentColor"/>}
                </svg>
              </Link>
            ) : (
              <Link href="/login" className={styles.actionBtn} aria-label="Tài khoản cá nhân">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </Link>
            )}
            <Link href="/products" className={`${styles.actionBtn} ${styles.hideOnMobile}`} aria-label="Tất cả sản phẩm">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
            </Link>
            <button 
              className={styles.cartBtn} 
              aria-label={`Giỏ hàng - ${cartCount} sản phẩm`}
              onClick={toggleCart}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
              <span className={styles.cartBadge}>{cartCount}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay — OUTSIDE header to avoid stacking context trap */}
      {isMobileMenuOpen && (
        <div className={styles.mobileOverlay} onClick={() => setIsMobileMenuOpen(false)}>
          <aside
            className={styles.mobileSidebar}
            onClick={(e) => e.stopPropagation()}
            aria-label="Menu điều hướng di động"
          >
            <div className={styles.sidebarHeader}>
              <Link href="/" className={styles.sidebarLogo} onClick={() => setIsMobileMenuOpen(false)}>
                LEVENTS<sup className={styles.logoSup}>®</sup>
              </Link>
              <button 
                className={styles.closeSidebarBtn} 
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Đóng menu"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
            
            <nav className={styles.sidebarNav}>
              <ul className={styles.mobileNavList}>
                {NAV_LINKS.map((link) => (
                  <li key={link.id} className={styles.mobileNavItem}>
                    <button
                      className={styles.mobileNavLink}
                      onClick={() => scrollToSection(link.id)}
                    >
                      {link.label}
                      <span className={styles.navArrow}>›</span>
                    </button>
                  </li>
                ))}
              </ul>
            </nav>

            <div className={styles.sidebarFooter}>
              <div className={styles.sidebarLinks}>
                <Link href="/about" className={styles.sidebarSubLink}>Về chúng tôi</Link>
                <Link href="/stores" className={styles.sidebarSubLink}>Hệ thống cửa hàng</Link>
                <Link href="/contact" className={styles.sidebarSubLink}>Liên hệ</Link>
              </div>
              <p className={styles.sidebarCopyright}>© 2024 Levents</p>
            </div>
          </aside>
        </div>
      )}

      {/* Cart Drawer */}
      <CartDrawer />
    </>
  );
}

