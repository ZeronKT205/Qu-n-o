import styles from '../Dashboard.module.css';

export default function ReportsPage() {
  return (
    <div>
      <h1 className={styles.pageTitle}>Báo cáo</h1>
      <div style={{
        background: '#fff',
        borderRadius: '12px',
        padding: '40px',
        textAlign: 'center' as const,
        color: '#7A5F48',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      }}>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#A67B5B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '16px' }}>
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
        <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#2C2019', marginBottom: '8px' }}>Báo cáo & Thống kê</h2>
        <p style={{ fontSize: '14px', margin: 0 }}>Trang này đang được phát triển. Bạn sẽ có thể xem doanh thu, top sản phẩm bán chạy và phân tích khách hàng tại đây.</p>
      </div>
    </div>
  );
}
