'use client';

import styles from './Dashboard.module.css';

/* ===== MOCK DATA ===== */
const STATS = [
  {
    label: 'Doanh thu hôm nay',
    value: '25.400.000 đ',
    change: '↑ 12.5% so với hôm qua',
    changeType: 'up' as const,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
  },
  {
    label: 'Đơn hàng hôm nay',
    value: '128',
    change: '↑ 8.3% so với hôm qua',
    changeType: 'up' as const,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
    ),
  },
  {
    label: 'Khách hàng mới',
    value: '32',
    change: '↑ 15.6% so với hôm qua',
    changeType: 'up' as const,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    label: 'Sản phẩm',
    value: '256',
    change: '— Không đổi',
    changeType: 'neutral' as const,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
    ),
  },
];

const CHART_DATA = [
  { day: '19/05', value: 12000000 },
  { day: '20/05', value: 8000000 },
  { day: '21/05', value: 18000000 },
  { day: '22/05', value: 25000000 },
  { day: '23/05', value: 30000000 },
  { day: '24/05', value: 22000000 },
  { day: '25/05', value: 25400000 },
];

const RECENT_ORDERS = [
  { id: '#LV25052501', customer: 'Nguyễn Minh Anh', date: '25/05/2025 14:32', amount: '1.250.000 đ', status: 'Đã thanh toán', statusType: 'success' as const },
  { id: '#LV25052500', customer: 'Trần Hoàng Nam', date: '25/05/2025 14:21', amount: '890.000 đ', status: 'Đã giao hàng', statusType: 'info' as const },
  { id: '#LV25052499', customer: 'Lê Thu Hà', date: '25/05/2025 14:02', amount: '650.000 đ', status: 'Đang xử lý', statusType: 'warning' as const },
  { id: '#LV25052498', customer: 'Phạm Quang Huy', date: '25/05/2025 13:47', amount: '1.120.000 đ', status: 'Đã thanh toán', statusType: 'success' as const },
];

/* ===== SVG CHART HELPER ===== */
function RevenueChart() {
  const maxVal = 40000000;
  const chartW = 520;
  const chartH = 200;
  const padL = 50;
  const padR = 20;
  const padT = 10;
  const padB = 30;
  const innerW = chartW - padL - padR;
  const innerH = chartH - padT - padB;

  const points = CHART_DATA.map((d, i) => {
    const x = padL + (i / (CHART_DATA.length - 1)) * innerW;
    const y = padT + innerH - (d.value / maxVal) * innerH;
    return { x, y, ...d };
  });

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  const yLabels = [0, 10, 20, 30, 40];

  return (
    <svg viewBox={`0 0 ${chartW} ${chartH}`} className={styles.chartSvg} preserveAspectRatio="xMidYMid meet">
      {/* Grid lines */}
      {yLabels.map((val) => {
        const y = padT + innerH - (val / 40) * innerH;
        return (
          <g key={val}>
            <line x1={padL} y1={y} x2={chartW - padR} y2={y} stroke="#E8DCC8" strokeWidth="0.5" strokeDasharray="4 4" />
            <text x={padL - 8} y={y + 4} textAnchor="end" fontSize="10" fill="#A67B5B">{val}M</text>
          </g>
        );
      })}

      {/* X labels */}
      {points.map((p) => (
        <text key={p.day} x={p.x} y={chartH - 6} textAnchor="middle" fontSize="10" fill="#A67B5B">{p.day}</text>
      ))}

      {/* Line */}
      <path d={pathD} fill="none" stroke="#2C2621" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

      {/* Dots */}
      {points.map((p) => (
        <circle key={p.day} cx={p.x} cy={p.y} r="4" fill="#FFFFFF" stroke="#2C2621" strokeWidth="2" />
      ))}
    </svg>
  );
}

/* ===== DASHBOARD PAGE ===== */
export default function AdminDashboardPage() {
  return (
    <div className={styles.dashboard}>
      <h1 className={styles.pageTitle}>Tổng quan</h1>

      {/* --- Stat Cards --- */}
      <div className={styles.statsGrid}>
        {STATS.map((stat) => (
          <div key={stat.label} className={styles.statCard}>
            <div className={styles.statTop}>
              <div className={styles.statIconWrap}>{stat.icon}</div>
              <span className={styles.statLabel}>{stat.label}</span>
            </div>
            <div className={styles.statValue}>{stat.value}</div>
            <div className={`${styles.statChange} ${styles[`change_${stat.changeType}`]}`}>
              {stat.change}
            </div>
          </div>
        ))}
      </div>

      {/* --- Middle Row: Chart + Recent Orders --- */}
      <div className={styles.middleRow}>
        {/* Revenue Chart */}
        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <h2 className={styles.sectionTitle}>Doanh thu 7 ngày qua</h2>
            <button className={styles.chartDropdown}>
              7 ngày qua
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
            </button>
          </div>
          <div className={styles.chartBody}>
            <RevenueChart />
          </div>
        </div>

        {/* Recent Orders */}
        <div className={styles.ordersCard}>
          <div className={styles.ordersHeader}>
            <h2 className={styles.sectionTitle}>Đơn hàng mới nhất</h2>
            <a href="/admin/orders" className={styles.viewAllLink}>Xem tất cả</a>
          </div>
          <div className={styles.ordersList}>
            {RECENT_ORDERS.map((order) => (
              <div key={order.id} className={styles.orderItem}>
                <div className={styles.orderThumb}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                    <line x1="7" y1="7" x2="7.01" y2="7" />
                  </svg>
                </div>
                <div className={styles.orderInfo}>
                  <span className={styles.orderId}>{order.id}</span>
                  <span className={styles.orderCustomer}>{order.customer}</span>
                </div>
                <div className={styles.orderMeta}>
                  <span className={styles.orderDate}>{order.date}</span>
                  <span className={styles.orderAmount}>{order.amount}</span>
                </div>
                <span className={`${styles.orderBadge} ${styles[`badge_${order.statusType}`]}`}>
                  {order.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- Suggestion Bar --- */}
      <div className={styles.suggestionBar}>
        <div className={styles.suggestionLeft}>
          <span className={styles.quoteIcon}>❝</span>
          <div>
            <strong className={styles.suggestionTitle}>Gợi ý hôm nay</strong>
            <p className={styles.suggestionText}>Bạn có 12 đơn hàng đang chờ xử lý.</p>
          </div>
        </div>
        <a href="/admin/orders" className={styles.suggestionBtn}>Xem đơn hàng</a>
      </div>
    </div>
  );
}
