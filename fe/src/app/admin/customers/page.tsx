import styles from '../Dashboard.module.css';

export default function CustomersPage() {
  return (
    <div>
      <h1 className={styles.pageTitle}>Khách hàng</h1>
      <div style={{
        background: '#fff',
        borderRadius: '12px',
        padding: '40px',
        textAlign: 'center' as const,
        color: '#7A5F48',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      }}>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#A67B5B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '16px' }}>
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
        <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#2C2019', marginBottom: '8px' }}>Quản lý Khách hàng</h2>
        <p style={{ fontSize: '14px', margin: 0 }}>Trang này đang được phát triển. Bạn sẽ có thể quản lý hồ sơ, lịch sử mua hàng và phân hạng thành viên tại đây.</p>
      </div>
    </div>
  );
}
