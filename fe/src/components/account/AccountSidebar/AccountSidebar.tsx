'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/store/AuthContext';
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
  const { user, logout } = useAuth();

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (confirm('Bạn có chắc chắn muốn đăng xuất tài khoản?')) {
      try {
        await logout();
      } catch (err) {
        console.error('Logout error:', err);
      }
    }
  };

  return (
    <aside className={styles.sidebar}>
      {/* Profile Info */}
      <div className={styles.profileSection}>
        <div className={styles.avatarWrap}>
          {user?.avatar_url ? (
            <img
              src={user.avatar_url}
              alt={user.full_name}
              className={styles.avatarImg}
            />
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%', backgroundColor: '#A67B5B', color: '#fff', fontWeight: 700, fontSize: '18px' }}>
              {user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
            </div>
          )}
        </div>
        <div className={styles.profileInfo}>
          <h3 className={styles.profileName}>{user?.full_name || 'Khách hàng'}</h3>
          <p className={styles.profileEmail}>{user?.email || ''}</p>
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
            
            if (item.id === 'logout') {
              return (
                <li key={item.id} className={styles.navItem}>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className={styles.navLink}
                    style={{ 
                      background: 'none', 
                      border: 'none', 
                      width: '100%', 
                      textAlign: 'left', 
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      paddingLeft: '16px'
                    }}
                  >
                    <span className={styles.navIcon}>{item.icon}</span>
                    <span className={styles.navLabel}>{item.label}</span>
                  </button>
                </li>
              );
            }

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
