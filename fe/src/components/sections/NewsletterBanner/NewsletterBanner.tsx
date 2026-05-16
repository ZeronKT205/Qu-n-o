'use client';

import styles from './NewsletterBanner.module.css';

export default function NewsletterBanner() {
  return (
    <section className={styles.newsletterBanner}>
      <div className={styles.container}>
        <div className={styles.left}>
          <div className={styles.iconWrapper}>
            {/* Gift Icon Placeholder */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 12 20 22 4 22 4 12"></polyline>
              <rect x="2" y="7" width="20" height="5"></rect>
              <line x1="12" y1="22" x2="12" y2="7"></line>
              <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path>
              <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path>
            </svg>
          </div>
          <div className={styles.textContent}>
            <h2 className={styles.title}>ĐĂNG KÝ NHẬN TIN</h2>
            <p className={styles.description}>
              Nhận ngay 10% ưu đãi cho đơn hàng đầu tiên và cập nhật những bộ sưu tập mới nhất.
            </p>
          </div>
        </div>
        
        <div className={styles.middle}>
          <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
            <input 
              type="email" 
              placeholder="Nhập email của bạn..." 
              className={styles.input}
              required
            />
            <button type="submit" className={styles.button}>ĐĂNG KÝ</button>
          </form>
        </div>

        <div className={styles.right}>
          {/* Decorative element resembling cropped model image */}
          <div className={styles.imagePlaceholder}></div>
        </div>
      </div>
    </section>
  );
}
