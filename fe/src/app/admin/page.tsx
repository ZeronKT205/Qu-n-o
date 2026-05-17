'use client';

import { useEffect, useState } from 'react';
import styles from './Dashboard.module.css';
import {
  apiGetDashboard,
  type DashboardData,
  type RevenuePoint,
  formatVND,
  formatPercent,
  getOrderStatus,
  getPaymentMethod,
  formatDate,
} from '@/utils/adminService';

/* ===== SVG ICONS ===== */
const IconRevenue = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
    <line x1="8" y1="21" x2="16" y2="21" />
    <line x1="12" y1="17" x2="12" y2="21" />
  </svg>
);
const IconOrders = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);
const IconCustomers = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
const IconProducts = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
);
const IconTag = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
    <line x1="7" y1="7" x2="7.01" y2="7" />
  </svg>
);

/* ===== SVG CHART ===== */
function RevenueChart({ data }: { data: RevenuePoint[] }) {
  if (!data || data.length === 0) return null;

  const maxVal = Math.max(...data.map(d => d.revenue), 1);
  const roundedMax = Math.ceil(maxVal / 10000000) * 10000000 || 10000000;
  const chartW = 520;
  const chartH = 200;
  const padL = 60;
  const padR = 20;
  const padT = 10;
  const padB = 30;
  const innerW = chartW - padL - padR;
  const innerH = chartH - padT - padB;

  const points = data.map((d, i) => {
    const x = padL + (i / (data.length - 1 || 1)) * innerW;
    const y = padT + innerH - (d.revenue / roundedMax) * innerH;
    return { x, y, ...d };
  });

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const ySteps = 5;
  const yLabels = Array.from({ length: ySteps + 1 }, (_, i) => Math.round((roundedMax / ySteps) * i));

  return (
    <svg viewBox={`0 0 ${chartW} ${chartH}`} className={styles.chartSvg} preserveAspectRatio="xMidYMid meet">
      {yLabels.map((val) => {
        const y = padT + innerH - (val / roundedMax) * innerH;
        const label = val >= 1000000 ? `${val / 1000000}M` : `${val / 1000}K`;
        return (
          <g key={val}>
            <line x1={padL} y1={y} x2={chartW - padR} y2={y} stroke="#E8DCC8" strokeWidth="0.5" strokeDasharray="4 4" />
            <text x={padL - 8} y={y + 4} textAnchor="end" fontSize="10" fill="#A67B5B">{label}</text>
          </g>
        );
      })}
      {points.map((p) => (
        <text key={p.label} x={p.x} y={chartH - 6} textAnchor="middle" fontSize="10" fill="#A67B5B">{p.label}</text>
      ))}
      <path d={pathD} fill="none" stroke="#2C2621" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {points.map((p) => (
        <circle key={p.label} cx={p.x} cy={p.y} r="4" fill="#FFFFFF" stroke="#2C2621" strokeWidth="2" />
      ))}
    </svg>
  );
}

/* ===== DASHBOARD PAGE ===== */
export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiGetDashboard()
      .then(setData)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className={styles.dashboard}>
        <h1 className={styles.pageTitle}>Tổng quan</h1>
        <div style={{ textAlign: 'center', padding: '60px', color: '#A67B5B' }}>Đang tải dữ liệu...</div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className={styles.dashboard}>
        <h1 className={styles.pageTitle}>Tổng quan</h1>
        <div style={{ textAlign: 'center', padding: '60px', color: '#EF4444' }}>
          {error || 'Không thể tải dữ liệu. Vui lòng thử lại.'}
        </div>
      </div>
    );
  }

  const revChange = formatPercent(data.revenue_today, data.revenue_yesterday);
  const ordChange = formatPercent(data.orders_today, data.orders_yesterday);
  const custChange = formatPercent(data.new_customers_today, data.new_customers_yesterday);

  const STATS = [
    {
      label: 'Doanh thu hôm nay',
      value: formatVND(data.revenue_today),
      change: revChange.value,
      changeType: revChange.type,
      icon: <IconRevenue />,
    },
    {
      label: 'Đơn hàng hôm nay',
      value: String(data.orders_today),
      change: ordChange.value,
      changeType: ordChange.type,
      icon: <IconOrders />,
    },
    {
      label: 'Khách hàng mới',
      value: String(data.new_customers_today),
      change: custChange.value,
      changeType: custChange.type,
      icon: <IconCustomers />,
    },
    {
      label: 'Sản phẩm',
      value: String(data.total_products),
      change: '— Không đổi',
      changeType: 'neutral' as const,
      icon: <IconProducts />,
    },
  ];

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
          </div>
          <div className={styles.chartBody}>
            <RevenueChart data={data.revenue_last_7days} />
          </div>
        </div>

        {/* Recent Orders */}
        <div className={styles.ordersCard}>
          <div className={styles.ordersHeader}>
            <h2 className={styles.sectionTitle}>Đơn hàng mới nhất</h2>
            <a href="/admin/orders" className={styles.viewAllLink}>Xem tất cả</a>
          </div>
          <div className={styles.ordersList}>
            {data.recent_orders.map((order) => {
              const statusInfo = getOrderStatus(order.status);
              const statusStyleMap: Record<string, 'success' | 'info' | 'warning' | 'danger'> = {
                completed: 'success',
                delivered: 'info',
                confirmed: 'info',
                processing: 'warning',
                shipping: 'warning',
                pending_payment: 'warning',
                cancelled: 'danger',
                returned: 'danger',
              };
              const badgeType = statusStyleMap[order.status] ?? 'warning';
              return (
                <div key={order.id} className={styles.orderItem}>
                  <div className={styles.orderThumb}>
                    <IconTag />
                  </div>
                  <div className={styles.orderInfo}>
                    <span className={styles.orderId}>#{order.order_number}</span>
                    <span className={styles.orderCustomer}>{order.shipping_name}</span>
                  </div>
                  <div className={styles.orderMeta}>
                    <span className={styles.orderDate}>{formatDate(order.created_at)}</span>
                    <span className={styles.orderAmount}>{formatVND(order.total_amount)}</span>
                  </div>
                  <span className={`${styles.orderBadge} ${styles[`badge_${badgeType}`]}`}>
                    {statusInfo.label}
                  </span>
                </div>
              );
            })}
            {data.recent_orders.length === 0 && (
              <div style={{ textAlign: 'center', padding: '20px', color: '#A67B5B', fontSize: '14px' }}>
                Chưa có đơn hàng nào
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- Suggestion Bar --- */}
      <div className={styles.suggestionBar}>
        <div className={styles.suggestionLeft}>
          <span className={styles.quoteIcon}>❝</span>
          <div>
            <strong className={styles.suggestionTitle}>Gợi ý hôm nay</strong>
            <p className={styles.suggestionText}>
              {data.pending_orders > 0
                ? `Bạn có ${data.pending_orders} đơn hàng đang chờ xử lý.`
                : 'Không có đơn hàng nào đang chờ xử lý.'}
            </p>
          </div>
        </div>
        <a href="/admin/orders" className={styles.suggestionBtn}>Xem đơn hàng</a>
      </div>
    </div>
  );
}
