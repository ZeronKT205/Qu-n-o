'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import styles from './AccountSidebar.module.css';

const MENU_ITEMS = [
  {
    id: 'account',
    label: 'Tài khoản của tôi',
    href: '/account/profile',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
      </svg>
    ),
  },

  {
    id: 'history',
    label: 'Lịch sử mua hàng',
    href: '/account/orders',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <polyline points="12 6 12 12 16 14"></polyline>
      </svg>
    ),
  },
  {
    id: 'wishlist',
    label: 'Sản phẩm yêu thích',
    href: '/account/wishlist',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
      </svg>
    ),
  },
  {
    id: 'address',
    label: 'Địa chỉ của tôi',
    href: '/account/address',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
        <circle cx="12" cy="10" r="3"></circle>
      </svg>
    ),
  },
  {
    id: 'voucher',
    label: 'Voucher của tôi',
    href: '/account/voucher',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21.5 12H16c-.7 2-3 3-4.5 1.5c-1.5 1.5-3.8.5-4.5-1.5H2.5"></path>
        <path d="M21.5 12C21.5 17.5228 17.0228 22 11.5 22C5.97715 22 1.5 17.5228 1.5 12C1.5 6.47715 5.97715 2 11.5 2C17.0228 2 21.5 6.47715 21.5 12Z" strokeDasharray="4 4"></path>
        <rect x="3" y="8" width="18" height="8" rx="2"></rect>
        <line x1="8" y1="8" x2="8" y2="16" strokeDasharray="2 2"></line>
      </svg>
    ),
  },

  {
    id: 'logout',
    label: 'Đăng xuất',
    href: '/login',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
        <polyline points="16 17 21 12 16 7"></polyline>
        <line x1="21" y1="12" x2="9" y2="12"></line>
      </svg>
    ),
  },
];

export default function AccountSidebar() {
  const pathname = usePathname();

  return (
    <aside className={styles.sidebar}>
      {/* Profile Info */}
      <div className={styles.profileSection}>
        <div className={styles.avatarWrap}>
          <Image
            src="/images/user-avatar-placeholder.jpg" // We'll need a placeholder or let it break gracefully if not found
            alt="Nguyễn Văn A"
            width={64}
            height={64}
            className={styles.avatarImg}
          />
        </div>
        <div className={styles.profileInfo}>
          <h3 className={styles.profileName}>Nguyễn Văn A</h3>
          <p className={styles.profileEmail}>nguyenvana@gmail.com</p>
          <Link href="/account/profile" className={styles.viewProfileLink}>
            Xem hồ sơ <span className={styles.arrow}>&gt;</span>
          </Link>
        </div>
      </div>

      {/* Navigation */}
      <nav className={styles.navMenu}>
        <ul className={styles.navList}>
          {MENU_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.id} className={styles.navItem}>
                <Link
                  href={item.href}
                  className={`${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
                >
                  <span className={styles.navIcon}>{item.icon}</span>
                  <span className={styles.navLabel}>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Support Card */}
      <div className={styles.supportCard}>
        <div className={styles.supportIconWrap}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 18v-6a9 9 0 0 1 18 0v6"></path>
            <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path>
          </svg>
        </div>
        <div className={styles.supportInfo}>
          <h4 className={styles.supportTitle}>Hỗ trợ khách hàng</h4>
          <p className={styles.supportHotline}>1900 1234</p>
          <p className={styles.supportTime}>Thứ 2 - Chủ nhật: 8:00 - 22:00</p>
        </div>
      </div>
    </aside>
  );
}
