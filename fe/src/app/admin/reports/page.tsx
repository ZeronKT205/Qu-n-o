'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import styles from './ReportsPage.module.css';
import {
  apiGetReports,
  type ReportsData,
  formatVND,
  formatReportPercent,
} from '@/utils/adminService';

/* ===== HELPERS ===== */
function toDateStr(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function formatDisplayDate(iso: string): string {
  const [y, m, day] = iso.split('-');
  return `${day}/${m}/${y}`;
}

function getLast7Range() {
  const to = new Date();
  const from = new Date();
  from.setDate(from.getDate() - 6);
  return { from: toDateStr(from), to: toDateStr(to) };
}

/* ===== CUSTOM TOOLTIP ===== */
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: '#fff', border: '1px solid #eee', padding: '10px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <p style={{ margin: '0 0 8px', fontWeight: 600, color: '#374151' }}>{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ margin: 0, color: entry.color, fontSize: '13px' }}>
            {entry.name}: {typeof entry.value === 'number' && entry.value > 100000 ? formatVND(entry.value) : entry.value.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

/* ===== REPORTS PAGE ===== */
export default function ReportsPage() {
  const defaultRange = getLast7Range();
  const [fromDate, setFromDate] = useState(defaultRange.from);
  const [toDate, setToDate] = useState(defaultRange.to);
  const [tempFrom, setTempFrom] = useState(defaultRange.from);
  const [tempTo, setTempTo] = useState(defaultRange.to);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [data, setData] = useState<ReportsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiGetReports(fromDate, toDate);
      setData(res);
    } catch (err: any) {
      setError(err.message || 'Không thể tải dữ liệu');
    } finally {
      setLoading(false);
    }
  }, [fromDate, toDate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  function applyDateRange() {
    if (tempFrom && tempTo && tempFrom <= tempTo) {
      setFromDate(tempFrom);
      setToDate(tempTo);
      setShowDatePicker(false);
    }
  }

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.headerSection}>
          <div className={styles.titleWrapper}>
            <h1 className={styles.pageTitle}>Báo cáo</h1>
          </div>
        </div>
        <div style={{ textAlign: 'center', padding: '60px', color: '#A67B5B' }}>Đang tải dữ liệu...</div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className={styles.container}>
        <div className={styles.headerSection}>
          <div className={styles.titleWrapper}>
            <h1 className={styles.pageTitle}>Báo cáo</h1>
          </div>
        </div>
        <div style={{ textAlign: 'center', padding: '60px', color: '#EF4444' }}>
          {error || 'Không thể tải dữ liệu'}
        </div>
      </div>
    );
  }

  const { summary, orders_chart, revenue_chart, top_customers, top_products, date_range } = data;

  const ordersChange = formatReportPercent(summary.total_orders, summary.prev_total_orders);
  const revenueChange = formatReportPercent(summary.total_revenue, summary.prev_total_revenue);

  const prevDateLabel = (() => {
    const from = new Date(date_range.from);
    const to = new Date(date_range.to);
    const dur = to.getTime() - from.getTime();
    const prevTo = new Date(from); prevTo.setDate(prevTo.getDate() - 1);
    const prevFrom = new Date(prevTo.getTime() - dur);
    return `${formatDisplayDate(toDateStr(prevFrom))} - ${formatDisplayDate(toDateStr(prevTo))}`;
  })();

  const revenueChartInMillions = revenue_chart.map(d => ({
    ...d,
    current: Math.round(d.current / 1000000),
    prev: Math.round(d.prev / 1000000),
  }));

  const PAYMENT_ORDERS_DATA = summary.payment_orders_breakdown.map((b, i) => ({
    name: b.label,
    value: b.count,
    color: i === 0 ? '#4ADE80' : '#60A5FA',
  }));

  const PAYMENT_REVENUE_DATA = summary.payment_revenue_breakdown.map((b, i) => ({
    name: b.label,
    value: b.revenue,
    color: i === 0 ? '#4ADE80' : '#60A5FA',
  }));

  const totalRevDisplay = formatVND(summary.total_revenue);

  return (
    <div className={styles.container}>
      {/* --- Header --- */}
      <div className={styles.headerSection}>
        <div className={styles.titleWrapper}>
          <h1 className={styles.pageTitle}>Báo cáo</h1>
          <p className={styles.pageSubtitle}>Theo dõi hiệu quả kinh doanh của cửa hàng.</p>
        </div>
        <div className={styles.headerActions}>
          {/* Date picker */}
          <div style={{ position: 'relative' }}>
            <button className={styles.datePicker} onClick={() => setShowDatePicker(v => !v)}>
              {formatDisplayDate(fromDate)} - {formatDisplayDate(toDate)}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 4 }}>
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </button>
            {showDatePicker && (
              <div className={styles.datePickerDropdown}>
                <div className={styles.datePickerRow}>
                  <label className={styles.datePickerLabel}>Từ ngày</label>
                  <input type="date" className={styles.dateInput} value={tempFrom} onChange={e => setTempFrom(e.target.value)} />
                </div>
                <div className={styles.datePickerRow}>
                  <label className={styles.datePickerLabel}>Đến ngày</label>
                  <input type="date" className={styles.dateInput} value={tempTo} onChange={e => setTempTo(e.target.value)} />
                </div>
                <div className={styles.datePickerQuickBtns}>
                  {[
                    { label: '7 ngày', days: 6 },
                    { label: '30 ngày', days: 29 },
                    { label: '90 ngày', days: 89 },
                  ].map(({ label, days }) => (
                    <button key={label} className={styles.quickBtn} onClick={() => {
                      const to = new Date(); const from = new Date(); from.setDate(from.getDate() - days);
                      setTempFrom(toDateStr(from)); setTempTo(toDateStr(to));
                    }}>{label}</button>
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 12 }}>
                  <button className={styles.cancelBtn} onClick={() => setShowDatePicker(false)}>Hủy</button>
                  <button className={styles.applyBtn} onClick={applyDateRange}>Áp dụng</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- Stat Cards --- */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={`${styles.statIconWrap} ${styles.total}`}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
          </div>
          <div className={styles.statInfo}>
            <p className={styles.statLabel}>Tổng đơn hàng</p>
            <h3 className={styles.statValue}>{summary.total_orders.toLocaleString('vi-VN')}</h3>
            <span className={`${styles.statTrend} ${styles[ordersChange.type]}`}>
              {ordersChange.value} <span className={styles.statTrendSub}>so với {prevDateLabel}</span>
            </span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statIconWrap} ${styles.transfer}`}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          </div>
          <div className={styles.statInfo}>
            <p className={styles.statLabel}>Đơn chuyển khoản</p>
            <h3 className={styles.statValue}>{summary.transfer_orders.toLocaleString('vi-VN')}</h3>
            <span className={`${styles.statTrend} ${styles.neutral}`}>
              {summary.payment_orders_breakdown[0]?.percent ?? 0}% tổng đơn
            </span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statIconWrap} ${styles.cash}`}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/></svg>
          </div>
          <div className={styles.statInfo}>
            <p className={styles.statLabel}>Đơn tiền mặt</p>
            <h3 className={styles.statValue}>{summary.cash_orders.toLocaleString('vi-VN')}</h3>
            <span className={`${styles.statTrend} ${styles.neutral}`}>
              {summary.payment_orders_breakdown[1]?.percent ?? 0}% tổng đơn
            </span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statIconWrap} ${styles.pending}`}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          </div>
          <div className={styles.statInfo}>
            <p className={styles.statLabel}>Đơn chờ xác nhận</p>
            <h3 className={styles.statValue}>{summary.pending_orders.toLocaleString('vi-VN')}</h3>
          </div>
        </div>
      </div>

      {/* --- Charts Row 1: Orders + Payment Breakdown --- */}
      <div className={styles.gridSection1}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Biểu đồ đơn hàng</h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', fontSize: '13px', color: '#A67B5B', fontWeight: 500 }}>
            <span style={{ width: 12, height: 4, backgroundColor: '#A67B5B', borderRadius: 2, display: 'inline-block' }}></span>
            Số đơn hàng
          </div>
          <div className={styles.chartContainer}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={orders_chart} margin={{ top: 5, right: 20, bottom: 5, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="orders" name="Số đơn hàng" stroke="#A67B5B" strokeWidth={3} dot={{ r: 4, fill: '#A67B5B', strokeWidth: 0 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Tỷ lệ phương thức thanh toán</h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', height: '100%', gap: '24px' }}>
            <div style={{ width: '50%', height: '180px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={PAYMENT_ORDERS_DATA} innerRadius={60} outerRadius={80} paddingAngle={2} dataKey="value" stroke="none">
                    {PAYMENT_ORDERS_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className={styles.customLegend} style={{ width: '50%' }}>
              {summary.payment_orders_breakdown.map((b, i) => (
                <div key={b.method} className={styles.legendItem}>
                  <div className={styles.legendLeft}>
                    <span className={styles.legendDot} style={{ backgroundColor: i === 0 ? '#4ADE80' : '#60A5FA' }}></span>
                    {b.label}
                  </div>
                  <div className={styles.legendRight}>
                    {b.percent}% <span className={styles.legendCount}>({b.count.toLocaleString()} đơn)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* --- Charts Row 2: Revenue + Revenue breakdown + Top customers --- */}
      <div className={styles.gridSection2}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Doanh thu</h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px', fontSize: '13px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#D97706', fontWeight: 500 }}>
              <span style={{ width: 12, height: 4, backgroundColor: '#D97706', borderRadius: 2, display: 'inline-block' }}></span>
              Doanh thu
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#FBBF24', fontWeight: 500 }}>
              <span style={{ width: 12, height: 4, borderTop: '2px dashed #FBBF24', display: 'inline-block' }}></span>
              Kỳ trước
            </div>
          </div>
          <div className={styles.cardValueWrap}>
            <h3 className={styles.cardValue}>{totalRevDisplay}</h3>
            <span className={`${styles.statTrend} ${styles[revenueChange.type]}`} style={{ margin: 0 }}>
              {revenueChange.value}
            </span>
          </div>
          <div className={styles.chartContainer}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueChartInMillions} margin={{ top: 5, right: 20, bottom: 5, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} tickFormatter={(v) => `${v}M`} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="current" name="Doanh thu (M)" stroke="#D97706" strokeWidth={3} dot={{ r: 4, fill: '#D97706', strokeWidth: 0 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="prev" name="Kỳ trước (M)" stroke="#FBBF24" strokeWidth={2} strokeDasharray="5 5" dot={false} activeDot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Doanh thu theo phương thức</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px', height: '100%' }}>
            <div style={{ width: '100%', height: '180px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={PAYMENT_REVENUE_DATA} innerRadius={60} outerRadius={80} paddingAngle={2} dataKey="value" stroke="none">
                    {PAYMENT_REVENUE_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatVND(Number(value))} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className={styles.customLegend} style={{ width: '100%' }}>
              {summary.payment_revenue_breakdown.map((b, i) => (
                <React.Fragment key={b.method}>
                  <div className={styles.legendItem} style={{ marginTop: i > 0 ? 8 : 0 }}>
                    <div className={styles.legendLeft}>
                      <span className={styles.legendDot} style={{ backgroundColor: i === 0 ? '#4ADE80' : '#60A5FA' }}></span>
                      {b.label}
                    </div>
                    <div className={styles.legendRight}>{b.percent}%</div>
                  </div>
                  <div style={{ textAlign: 'right', fontSize: '13px', color: '#6B7280', marginTop: '-8px' }}>{formatVND(b.revenue)}</div>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Top khách hàng</h2>
            <a href="/admin/customers" className={styles.cardViewAll}>Xem tất cả</a>
          </div>
          <div className={styles.customerList}>
            {top_customers.length === 0 && (
              <div style={{ textAlign: 'center', padding: '20px', color: '#6B7280', fontSize: '14px' }}>Chưa có dữ liệu</div>
            )}
            {top_customers.map(c => (
              <div key={c.id} className={styles.customerItem}>
                <div className={styles.customerLeft}>
                  <div className={styles.customerAvatar}>
                    {c.avatar_url ? (
                      <img src={c.avatar_url} alt={c.full_name} className={styles.customerAvatarImg} />
                    ) : (
                      <span style={{ fontSize: 13, fontWeight: 600, color: '#8F6A4E' }}>
                        {(c.full_name?.[0] || '?').toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className={styles.customerInfo}>
                    <span className={styles.customerName}>{c.full_name}</span>
                    <span className={styles.customerOrders}>{c.orders} đơn</span>
                  </div>
                </div>
                <span className={styles.customerTotal}>{formatVND(c.total_spent)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- Top Products --- */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>Sản phẩm bán chạy</h2>
        </div>
        {top_products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '20px', color: '#6B7280', fontSize: '14px' }}>Chưa có dữ liệu</div>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.productsTable}>
              <thead>
                <tr>
                  <th>Sản phẩm</th>
                  <th>Số lượng bán</th>
                  <th>Doanh thu</th>
                  <th>Tỷ lệ</th>
                </tr>
              </thead>
              <tbody>
                {top_products.map((p, i) => (
                  <tr key={i}>
                    <td>
                      <div className={styles.productNameCell}>
                        <div className={styles.productThumb}>
                          <div style={{ width: '100%', height: '100%', background: '#E6DCD1' }}></div>
                        </div>
                        <span style={{ fontWeight: 500, color: '#374151' }}>{p.name}</span>
                      </div>
                    </td>
                    <td>{p.sales.toLocaleString('vi-VN')}</td>
                    <td>{formatVND(p.revenue)}</td>
                    <td>{p.ratio}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
