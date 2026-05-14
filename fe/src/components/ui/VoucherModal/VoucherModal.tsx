'use client';

import { useEffect, useState } from 'react';
import styles from './VoucherModal.module.css';

interface VoucherModalProps {
  isOpen: boolean;
  onClose: () => void;
  voucher: {
    title: string;
    subtitle: string;
  } | null;
}

export default function VoucherModal({ isOpen, onClose, voucher }: VoucherModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!mounted || !isOpen || !voucher) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <button className={styles.closeBtn} onClick={onClose} aria-label="Đóng popup">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>

        {/* Left Column - Info */}
        <div className={styles.leftCol}>
          <span className={styles.voucherLabel}>VOUCHER</span>
          <h2 className={styles.voucherValue}>{voucher.title.replace('VOUCHER ', '').replace('ƯU ĐÃI ', '').replace('SALE UP TO ', '')}</h2>
          <p className={styles.voucherCondition}>{voucher.subtitle}</p>

          <div className={styles.ticketGraphic}>
            <svg width="120" height="80" viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10,0 L110,0 C115.5,0 120,4.5 120,10 L120,25 C114.5,25 110,29.5 110,35 C110,40.5 114.5,45 120,45 L120,70 C120,75.5 115.5,80 110,80 L10,80 C4.5,80 0,75.5 0,70 L0,45 C5.5,45 10,40.5 10,35 C10,29.5 5.5,25 0,25 L0,10 C0,4.5 4.5,0 10,0 Z" fill="#e8dacb"/>
              <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fill="#c3b09e" fontSize="40" fontWeight="bold">%</text>
            </svg>
          </div>

          <div className={styles.bulletList}>
            <div className={styles.bulletItem}>
              <svg className={styles.bulletIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>
              <div className={styles.bulletText}>
                <span className={styles.bulletTitle}>Áp dụng cho tất cả sản phẩm</span>
                <span className={styles.bulletDesc}>Không áp dụng cho sản phẩm đang giảm giá đặc biệt</span>
              </div>
            </div>
            <div className={styles.bulletItem}>
              <svg className={styles.bulletIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
              <div className={styles.bulletText}>
                <span className={styles.bulletTitle}>Hiệu lực voucher</span>
                <span className={styles.bulletDesc}>30 ngày kể từ ngày nhận</span>
              </div>
            </div>
            <div className={styles.bulletItem}>
              <svg className={styles.bulletIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 12 20 22 4 22 4 12"></polyline><rect x="2" y="7" width="20" height="5"></rect><line x1="12" y1="22" x2="12" y2="7"></line><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path></svg>
              <div className={styles.bulletText}>
                <span className={styles.bulletTitle}>Mỗi khách hàng</span>
                <span className={styles.bulletDesc}>chỉ nhận 1 lần</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Form */}
        <div className={styles.rightCol}>
          <div className={styles.formHeader}>
            <h2 className={styles.formTitle}>NHẬN {voucher.title}</h2>
            <p className={styles.formDesc}>Điền đầy đủ thông tin bên dưới để nhận voucher áp dụng cho {voucher.subtitle.toLowerCase()}.</p>
          </div>

          <form className={styles.form} onSubmit={(e) => { e.preventDefault(); onClose(); alert('Đã nhận voucher thành công!'); }}>
            <div className={styles.inputGroup}>
              <svg className={styles.inputIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              <input type="text" className={styles.input} placeholder="Họ và tên *" required />
            </div>

            <div className={styles.inputGroup}>
              <svg className={styles.inputIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              <input type="email" className={styles.input} placeholder="Email *" required />
            </div>

            <div className={styles.inputGroup}>
              <svg className={styles.inputIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              <input type="tel" className={styles.input} placeholder="Số điện thoại *" required />
            </div>

            <div className={styles.row}>
              <div className={styles.inputGroup}>
                <svg className={styles.inputIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                <input type="text" className={styles.input} placeholder="Ngày sinh (DD/MM/YYYY)" />
              </div>
              <div className={styles.inputGroup}>
                <svg className={styles.inputIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                <select className={`${styles.input} ${styles.select}`} required defaultValue="">
                  <option value="" disabled>Chọn giới tính</option>
                  <option value="nam">Nam</option>
                  <option value="nu">Nữ</option>
                  <option value="khac">Khác</option>
                </select>
                <svg className={styles.selectIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </div>
            </div>

            <div className={styles.checkboxGroup}>
              <input type="checkbox" id="terms" className={styles.checkbox} required />
              <label htmlFor="terms" className={styles.checkboxLabel}>
                Tôi đồng ý với <a href="#" className={styles.link}>điều khoản & chính sách bảo mật</a>
              </label>
            </div>

            <button type="submit" className={styles.submitBtn}>
              NHẬN VOUCHER NGAY
            </button>

            <div className={styles.securityNote}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" color="var(--color-text-secondary)"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><polyline points="9 12 11 14 15 10"></polyline></svg>
              <span className={styles.securityText}>
                Thông tin của bạn được bảo mật tuyệt đối<br/>và chỉ sử dụng để gửi voucher.
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
