'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import styles from './OrdersPage.module.css';
import {
  apiGetOrders,
  apiUpdateOrderStatus,
  type AdminOrder,
  formatVND,
  formatDate,
  getOrderStatus,
  getPaymentMethod,
} from '@/utils/adminService';

/* ===== TYPES ===== */
type TabKey = 'all' | 'awaiting_payment' | 'awaiting_confirm' | 'confirmed' | 'cancelled';

const TABS: { label: string; key: TabKey }[] = [
  { label: 'Tất cả', key: 'all' },
  { label: 'Chờ thanh toán', key: 'awaiting_payment' },
  { label: 'Chờ xác nhận', key: 'awaiting_confirm' },
  { label: 'Đã xác nhận', key: 'confirmed' },
  { label: 'Đã hủy', key: 'cancelled' },
];

const TAB_FILTERS: Record<TabKey, { status?: string; payment_method?: string }> = {
  all: {},
  awaiting_payment: { status: 'pending_payment', payment_method: 'bank_transfer' },
  awaiting_confirm: { status: 'pending_payment', payment_method: 'cod' },
  confirmed: { status: 'confirmed' },
  cancelled: { status: 'cancelled' },
};

// Only pending_payment orders can be acted on
const NEXT_STATUS: Record<string, string[]> = {
  pending_payment: ['confirmed', 'cancelled'],
  confirmed: [],
  cancelled: [],
};

/* ===== HELPERS ===== */
function getInitial(name: string) {
  const parts = name?.split(' ') || [];
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return (name?.[0] || '?').toUpperCase();
}

function getDisplayStatus(order: AdminOrder) {
  if (order.status === 'pending_payment') {
    if (order.payment_method === 'cod') {
      return { label: 'Chờ xác nhận', style: 'awaiting_confirm' };
    }
    return { label: 'Chờ thanh toán', style: 'pending_payment' };
  }
  return getOrderStatus(order.status);
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [activeTab, setActiveTab] = useState<TabKey>('all');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [sortDir, setSortDir] = useState<'desc' | 'asc'>('desc');

  // Stats
  const [statsTotal, setStatsTotal] = useState(0);
  const [statsAwaitPayment, setStatsAwaitPayment] = useState(0);
  const [statsAwaitConfirm, setStatsAwaitConfirm] = useState(0);
  const [statsConfirmed, setStatsConfirmed] = useState(0);

  // Modals
  const [detailOrder, setDetailOrder] = useState<AdminOrder | null>(null);
  const [statusModal, setStatusModal] = useState<AdminOrder | null>(null);
  const [newStatus, setNewStatus] = useState('');
  const [statusLoading, setStatusLoading] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const filters = TAB_FILTERS[activeTab];
      const res = await apiGetOrders({
        page,
        limit,
        ...filters,
        search: search || undefined,
        sort_by: 'created_at',
        sort_dir: sortDir,
      });
      setOrders(res.data);
      setTotal(res.pagination.total);
      setTotalPages(res.pagination.totalPages);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [page, limit, activeTab, search, sortDir]);

  const fetchStats = useCallback(async () => {
    try {
      const [all, awaitPay, awaitConfirm, confirmed] = await Promise.all([
        apiGetOrders({ limit: 1 }),
        apiGetOrders({ limit: 1, status: 'pending_payment', payment_method: 'bank_transfer' }),
        apiGetOrders({ limit: 1, status: 'pending_payment', payment_method: 'cod' }),
        apiGetOrders({ limit: 1, status: 'confirmed' }),
      ]);
      setStatsTotal(all.pagination.total);
      setStatsAwaitPayment(awaitPay.pagination.total);
      setStatsAwaitConfirm(awaitConfirm.pagination.total);
      setStatsConfirmed(confirmed.pagination.total);
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdownId(null);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  function handleTabChange(key: TabKey) {
    setActiveTab(key);
    setPage(1);
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  }

  function handleSortChange(val: string) {
    if (val === 'newest') setSortDir('desc');
    else if (val === 'oldest') setSortDir('asc');
    setPage(1);
  }

  async function handleStatusUpdate() {
    if (!statusModal || !newStatus) return;
    setStatusLoading(true);
    try {
      await apiUpdateOrderStatus(statusModal.id, newStatus);
      setStatusModal(null);
      fetchOrders();
      fetchStats();
    } catch (err: any) {
      alert(err.message || 'Cập nhật thất bại');
    } finally {
      setStatusLoading(false);
    }
  }

  const awaitPayPct = statsTotal > 0 ? Math.round((statsAwaitPayment / statsTotal) * 100) : 0;
  const awaitConfirmPct = statsTotal > 0 ? Math.round((statsAwaitConfirm / statsTotal) * 100) : 0;
  const confirmedPct = statsTotal > 0 ? Math.round((statsConfirmed / statsTotal) * 100) : 0;

  return (
    <div className={styles.container}>
      {/* --- Header --- */}
      <div className={styles.headerSection}>
        <div className={styles.titleWrapper}>
          <h1 className={styles.pageTitle}>Đơn hàng</h1>
          <p className={styles.pageSubtitle}>Quản lý đơn hàng của cửa hàng.</p>
        </div>
      </div>

      {/* --- Stat Cards --- */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={`${styles.statIconWrap} ${styles.total}`}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
          </div>
          <div className={styles.statInfo}>
            <p className={styles.statLabel}>Tổng đơn hàng</p>
            <div className={styles.statValueRow}><h3 className={styles.statValue}>{statsTotal.toLocaleString('vi-VN')}</h3></div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={`${styles.statIconWrap} ${styles.transfer}`}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
          <div className={styles.statInfo}>
            <p className={styles.statLabel}>Chờ thanh toán</p>
            <div className={styles.statValueRow}>
              <h3 className={styles.statValue}>{statsAwaitPayment.toLocaleString('vi-VN')}</h3>
              <span className={`${styles.statSubtext} ${styles.transfer}`}>({awaitPayPct}%)</span>
            </div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={`${styles.statIconWrap} ${styles.cash}`}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="6" width="20" height="12" rx="2" /><circle cx="12" cy="12" r="2" /><path d="M6 12h.01M18 12h.01" />
            </svg>
          </div>
          <div className={styles.statInfo}>
            <p className={styles.statLabel}>Chờ xác nhận (COD)</p>
            <div className={styles.statValueRow}>
              <h3 className={styles.statValue}>{statsAwaitConfirm.toLocaleString('vi-VN')}</h3>
              <span className={`${styles.statSubtext} ${styles.cash}`}>({awaitConfirmPct}%)</span>
            </div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={`${styles.statIconWrap} ${styles.pending}`}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <div className={styles.statInfo}>
            <p className={styles.statLabel}>Đã xác nhận</p>
            <div className={styles.statValueRow}>
              <h3 className={styles.statValue}>{statsConfirmed.toLocaleString('vi-VN')}</h3>
              <span className={`${styles.statSubtext} ${styles.pending}`}>({confirmedPct}%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* --- Main Table Area --- */}
      <div className={styles.tableContainer}>
        {/* Toolbar */}
        <div className={styles.toolbar}>
          <div className={styles.toolbarLeft}>
            <form className={styles.searchBox} onSubmit={handleSearch}>
              <svg className={styles.searchIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input
                type="text"
                className={styles.searchInput}
                placeholder="Tìm kiếm theo mã đơn, tên khách hàng, SĐT..."
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
              />
            </form>
          </div>
          <div className={styles.toolbarRight}>
            <select
              className={styles.sortSelect}
              onChange={e => handleSortChange(e.target.value)}
            >
              <option value="newest">Sắp xếp: Mới nhất</option>
              <option value="oldest">Sắp xếp: Cũ nhất</option>
            </select>
          </div>
        </div>

        {/* Tabs */}
        <div className={styles.tabs}>
          {TABS.map(tab => (
            <button
              key={tab.key}
              className={`${styles.tabBtn} ${activeTab === tab.key ? styles.active : ''}`}
              onClick={() => handleTabChange(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Table */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#A67B5B' }}>Đang tải...</div>
        ) : orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#6B7280' }}>Không có đơn hàng nào</div>
        ) : (
          <>
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th style={{ width: 40 }}><input type="checkbox" className={styles.checkbox} /></th>
                    <th>Mã đơn hàng</th>
                    <th>Khách hàng</th>
                    <th>SĐT</th>
                    <th>Ngày đặt</th>
                    <th>Thanh toán</th>
                    <th>Tổng tiền</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => {
                    const statusInfo = getDisplayStatus(order);
                    const customerName = order.user?.full_name || order.shipping_name || 'N/A';
                    const phone = order.user?.phone || order.shipping_phone || 'N/A';
                    const nextStatuses = NEXT_STATUS[order.status] ?? [];
                    return (
                      <tr key={order.id}>
                        <td><input type="checkbox" className={styles.checkbox} /></td>
                        <td className={styles.orderId}>#{order.order_number}</td>
                        <td>
                          <div className={styles.userInfo}>
                            <div className={styles.avatar}>{getInitial(customerName)}</div>
                            <span className={styles.userName}>{customerName}</span>
                          </div>
                        </td>
                        <td>{phone}</td>
                        <td>{formatDate(order.created_at)}</td>
                        <td className={styles.paymentMethod}>{getPaymentMethod(order.payment_method)}</td>
                        <td className={styles.totalAmount}>{formatVND(order.total_amount)}</td>
                        <td>
                          <span className={`${styles.statusBadge} ${styles[statusInfo.style]}`}>
                            {statusInfo.label}
                          </span>
                        </td>
                        <td>
                          <div className={styles.actions}>
                            <button className={styles.actionBtn} title="Xem chi tiết" onClick={() => setDetailOrder(order)}>
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                            </button>
                            {nextStatuses.length > 0 && (
                              <div
                                style={{ position: 'relative' }}
                                ref={openDropdownId === order.id ? dropdownRef : null}
                              >
                                <button
                                  className={styles.actionBtn}
                                  title="Cập nhật trạng thái"
                                  onClick={() => setOpenDropdownId(openDropdownId === order.id ? null : order.id)}
                                >
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
                                </button>
                                {openDropdownId === order.id && (
                                  <div className={styles.dropdownMenu}>
                                    {nextStatuses.map(s => (
                                      <button
                                        key={s}
                                        className={`${styles.dropdownItem} ${s === 'cancelled' ? styles.dropdownItemDanger : ''}`}
                                        onClick={() => {
                                          setStatusModal(order);
                                          setNewStatus(s);
                                          setOpenDropdownId(null);
                                        }}
                                      >
                                        {s === 'confirmed' ? 'Xác nhận đơn' : 'Hủy đơn'}
                                      </button>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className={styles.tableFooter}>
              <div className={styles.footerText}>
                Hiển thị {Math.min((page - 1) * limit + 1, total)} - {Math.min(page * limit, total)} trong {total.toLocaleString('vi-VN')} đơn hàng
              </div>
              <div className={styles.paginationWrapper}>
                <select className={styles.perPageSelect} value={limit} onChange={() => {}}>
                  <option value={10}>10 / trang</option>
                </select>
                <div className={styles.pagination}>
                  <button className={`${styles.pageBtn} ${styles.navBtn}`} disabled={page === 1} onClick={() => setPage(p => p - 1)}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
                  </button>
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let p = i + 1;
                    if (totalPages > 5 && page > 3) p = page - 2 + i;
                    if (p > totalPages) return null;
                    return (
                      <button
                        key={p}
                        className={`${styles.pageBtn} ${page === p ? styles.pageActive : ''}`}
                        onClick={() => setPage(p)}
                      >
                        {p}
                      </button>
                    );
                  })}
                  {totalPages > 5 && page < totalPages - 2 && (
                    <>
                      <span className={styles.pageBtn} style={{ cursor: 'default' }}>...</span>
                      <button className={styles.pageBtn} onClick={() => setPage(totalPages)}>{totalPages}</button>
                    </>
                  )}
                  <button className={`${styles.pageBtn} ${styles.navBtn}`} disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* === Detail Modal === */}
      {detailOrder && (
        <div className={styles.modalOverlay} onClick={() => setDetailOrder(null)}>
          <div className={styles.modalCard} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <span className={styles.modalTitle}>Chi tiết đơn hàng #{detailOrder.order_number}</span>
              <button className={styles.modalClose} onClick={() => setDetailOrder(null)}>✕</button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.detailGrid}>
                <div className={styles.detailItem}><span className={styles.detailLabel}>Khách hàng</span><span className={styles.detailValue}>{detailOrder.user?.full_name || detailOrder.shipping_name}</span></div>
                <div className={styles.detailItem}><span className={styles.detailLabel}>Email</span><span className={styles.detailValue}>{detailOrder.user?.email || '—'}</span></div>
                <div className={styles.detailItem}><span className={styles.detailLabel}>SĐT</span><span className={styles.detailValue}>{detailOrder.shipping_phone}</span></div>
                <div className={styles.detailItem}><span className={styles.detailLabel}>Ngày đặt</span><span className={styles.detailValue}>{formatDate(detailOrder.created_at)}</span></div>
                <div className={styles.detailItem}><span className={styles.detailLabel}>Thanh toán</span><span className={styles.detailValue}>{getPaymentMethod(detailOrder.payment_method)}</span></div>
                <div className={styles.detailItem}><span className={styles.detailLabel}>Trạng thái TT</span><span className={styles.detailValue}>{detailOrder.payment_status}</span></div>
                <div className={styles.detailItem} style={{ gridColumn: '1 / -1' }}>
                  <span className={styles.detailLabel}>Địa chỉ giao hàng</span>
                  <span className={styles.detailValue}>{detailOrder.shipping_address}</span>
                </div>
                <div className={styles.detailItem}><span className={styles.detailLabel}>Tổng tiền</span><span className={styles.detailValue} style={{ fontWeight: 700, color: '#A67B5B', fontSize: 16 }}>{formatVND(detailOrder.total_amount)}</span></div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Trạng thái đơn</span>
                  <span className={`${styles.statusBadge} ${styles[getDisplayStatus(detailOrder).style]}`}>
                    {getDisplayStatus(detailOrder).label}
                  </span>
                </div>
              </div>
            </div>
            <div className={styles.modalFooter}>
              {(NEXT_STATUS[detailOrder.status] ?? []).length > 0 && (
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {NEXT_STATUS[detailOrder.status].map(s => (
                    <button
                      key={s}
                      className={s === 'cancelled' ? styles.btnDanger : styles.btnPrimary}
                      onClick={() => { setStatusModal(detailOrder); setNewStatus(s); setDetailOrder(null); }}
                    >
                      {s === 'confirmed' ? 'Xác nhận đơn' : 'Hủy đơn'}
                    </button>
                  ))}
                </div>
              )}
              <button className={styles.btnSecondary} onClick={() => setDetailOrder(null)}>Đóng</button>
            </div>
          </div>
        </div>
      )}

      {/* === Status Confirm Modal === */}
      {statusModal && (
        <div className={styles.modalOverlay} onClick={() => setStatusModal(null)}>
          <div className={styles.modalCardSm} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <span className={styles.modalTitle}>Xác nhận cập nhật</span>
              <button className={styles.modalClose} onClick={() => setStatusModal(null)}>✕</button>
            </div>
            <div className={styles.modalBody}>
              <p style={{ margin: 0, color: '#374151' }}>
                {newStatus === 'confirmed'
                  ? <>Xác nhận đơn hàng <strong>#{statusModal.order_number}</strong>?</>
                  : <>Hủy đơn hàng <strong>#{statusModal.order_number}</strong>? Thao tác này không thể hoàn tác.</>
                }
              </p>
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.btnSecondary} onClick={() => setStatusModal(null)}>Đóng</button>
              <button
                className={newStatus === 'cancelled' ? styles.btnDanger : styles.btnPrimary}
                disabled={statusLoading}
                onClick={handleStatusUpdate}
              >
                {statusLoading ? 'Đang xử lý...' : newStatus === 'confirmed' ? 'Xác nhận' : 'Hủy đơn'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
