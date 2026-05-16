import styles from '../Dashboard.module.css';

export default function OrdersPage() {
  return (
    <div>
      <h1 className={styles.pageTitle}>Đơn hàng</h1>
      <div style={{
        background: '#fff',
        borderRadius: '12px',
        padding: '40px',
        textAlign: 'center' as const,
        color: '#7A5F48',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      }}>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#A67B5B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '16px' }}>
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <path d="M16 10a4 4 0 0 1-8 0" />
        </svg>
        <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#2C2019', marginBottom: '8px' }}>Quản lý Đơn hàng</h2>
        <p style={{ fontSize: '14px', margin: 0 }}>Trang này đang được phát triển. Bạn sẽ có thể quản lý toàn bộ đơn hàng tại đây.</p>
      </div>
    </div>
  );
}
