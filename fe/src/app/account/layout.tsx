'use client';

import React from 'react';
import Header from '@/components/sections/Header/Header';
import Footer from '@/components/sections/Footer/Footer';
import AccountSidebar from '@/components/account/AccountSidebar/AccountSidebar';
import styles from './AccountLayout.module.css';

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className={styles.mainContent}>
        <div className={styles.container}>
          <div className={styles.layoutWrapper}>
            <div className={styles.sidebarColumn}>
              <AccountSidebar />
            </div>
            <div className={styles.contentColumn}>
              {children}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
