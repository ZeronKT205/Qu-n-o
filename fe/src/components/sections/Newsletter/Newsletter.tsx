'use client';

import styles from './Newsletter.module.css';

export default function Newsletter() {

  return (
    <section className={styles.section} aria-label="Cam kết từ Levents">
      <div className={styles.container}>
        <div className={styles.trustRow}>
          <div className={styles.trustItem}>
            <div className={styles.trustIconWrapper}>
              <svg className={styles.trustIcon} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
              </svg>
            </div>
            <div className={styles.trustContent}>
              <strong className={styles.trustTitle}>MIỄN PHÍ GIAO HÀNG</strong>
              <span className={styles.trustDesc}>Cho đơn từ 499K</span>
            </div>
          </div>
          <div className={styles.trustItem}>
            <div className={styles.trustIconWrapper}>
              <svg className={styles.trustIcon} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
              </svg>
            </div>
            <div className={styles.trustContent}>
              <strong className={styles.trustTitle}>ĐỔI TRẢ DỄ DÀNG</strong>
              <span className={styles.trustDesc}>Trong 7 ngày</span>
            </div>
          </div>
          <div className={styles.trustItem}>
            <div className={styles.trustIconWrapper}>
              <svg className={styles.trustIcon} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <div className={styles.trustContent}>
              <strong className={styles.trustTitle}>THANH TOÁN AN TOÀN</strong>
              <span className={styles.trustDesc}>Bảo mật tuyệt đối</span>
            </div>
          </div>
          <div className={styles.trustItem}>
            <div className={styles.trustIconWrapper}>
              <svg className={styles.trustIcon} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
            </div>
            <div className={styles.trustContent}>
              <strong className={styles.trustTitle}>HỖ TRỢ 24/7</strong>
              <span className={styles.trustDesc}>Hotline: 1900 1234</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
