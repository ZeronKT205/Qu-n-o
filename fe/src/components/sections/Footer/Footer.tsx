import Link from 'next/link';
import styles from './Footer.module.css';

const FOOTER_LINKS = {
  about: {
    title: 'VỀ LEVENTS',
    links: [
      { label: 'Giới thiệu', href: '/about' },
      { label: 'Tuyển dụng', href: '/careers' },
      { label: 'Hệ thống cửa hàng', href: '/stores' },
      { label: 'Tin tức', href: '/blog' },
      { label: 'Liên hệ', href: '/contact' },
    ],
  },
  policy: {
    title: 'CHÍNH SÁCH',
    links: [
      { label: 'Chính sách đổi trả', href: '/policy/returns' },
      { label: 'Chính sách bảo mật', href: '/policy/privacy' },
      { label: 'Chính sách thanh toán', href: '/policy/payment' },
      { label: 'Điều khoản sử dụng', href: '/policy/terms' },
    ],
  },
  support: {
    title: 'HỖ TRỢ',
    links: [
      { label: 'Hướng dẫn mua hàng', href: '/guide' },
      { label: 'Câu hỏi thường gặp', href: '/faq' },
      { label: 'Kiểm tra đơn hàng', href: '/track' },
      { label: 'Đăng ký bảo hành', href: '/warranty' },
    ],
  },
};

const SOCIAL_LINKS = [
  { label: 'Facebook', href: '#', icon: 'f' },
  { label: 'Instagram', href: '#', icon: 'ig' },
  { label: 'TikTok', href: '#', icon: 'tk' },
  { label: 'YouTube', href: '#', icon: 'yt' },
];

export default function Footer() {
  return (
    <footer className={styles.footer} role="contentinfo">
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Brand Column */}
          <div className={styles.brandCol}>
            <Link href="/" className={styles.logo} aria-label="Levents Clone - Trang chủ">
              LEVENTS<sup className={styles.logoSup}>®</sup>
            </Link>
            <p className={styles.brandDesc}>
              Levents mang đến những sản phẩm thời trang chất lượng với thiết kế tối giản, phù hợp với phong cách của bạn.
            </p>
            <div className={styles.socialLinks}>
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className={styles.socialLink}
                  aria-label={`Theo dõi chúng tôi trên ${social.label}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.values(FOOTER_LINKS).map((column) => (
            <div key={column.title} className={styles.linkCol}>
              <h3 className={styles.colTitle}>{column.title}</h3>
              <ul className={styles.linkList}>
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className={styles.link}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact Column */}
          <div className={styles.linkCol}>
            <h3 className={styles.colTitle}>THÔNG TIN LIÊN HỆ</h3>
            <ul className={styles.linkList}>
              <li className={styles.contactItem}>
                <span className={styles.contactIcon} aria-hidden="true">📞</span>
                <span>1900 1234</span>
              </li>
              <li className={styles.contactItem}>
                <span className={styles.contactIcon} aria-hidden="true">✉️</span>
                <span>support@levents.vn</span>
              </li>
              <li className={styles.contactItem}>
                <span className={styles.contactIcon} aria-hidden="true">📍</span>
                <span>123 Nguyễn Trãi, P. Bến Thành, Q.1, TP. Hồ Chí Minh</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className={styles.bottom}>
          <p className={styles.copyright}>© 2024 Levents. All rights reserved.</p>
          <div className={styles.paymentMethods} aria-label="Phương thức thanh toán">
            <span className={styles.paymentBadge}>VISA</span>
            <span className={styles.paymentBadge}>MC</span>
            <span className={styles.paymentBadge}>MOMO</span>
            <span className={styles.paymentBadge}>ZaloPay</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
