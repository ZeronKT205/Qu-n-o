import styles from '../Dashboard.module.css';

export default function ProductsPage() {
  return (
    <div>
      <h1 className={styles.pageTitle}>Sản phẩm</h1>
      <div style={{
        background: '#fff',
        borderRadius: '12px',
        padding: '40px',
        textAlign: 'center' as const,
        color: '#7A5F48',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      }}>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#A67B5B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '16px' }}>
          <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
          <line x1="7" y1="7" x2="7.01" y2="7" />
        </svg>
        <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#2C2019', marginBottom: '8px' }}>Quản lý Sản phẩm</h2>
        <p style={{ fontSize: '14px', margin: 0 }}>Trang này đang được phát triển. Bạn sẽ có thể quản lý danh mục, biến thể và tồn kho tại đây.</p>
      </div>
    </div>
  );
}
