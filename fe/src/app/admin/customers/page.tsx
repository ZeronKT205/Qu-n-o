'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import styles from './CustomersPage.module.css';
import {
  apiGetCustomers,
  apiGetCustomerDetail,
  apiUpdateAdminCustomer,
  apiDeleteAdminCustomer,
  type AdminCustomer,
  type AdminCustomerDetail,
  formatVND,
  formatDate,
} from '@/utils/adminService';

/* ===== TYPES ===== */
type StatusStyle = 'active' | 'inactive';
type ModalType = 'detail' | 'edit' | 'delete' | null;

/* ===== ICONS ===== */


const XIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const EyeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
  </svg>
);

const MoreIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="1" /><circle cx="12" cy="5" r="1" /><circle cx="12" cy="19" r="1" />
  </svg>
);

const EditIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const LockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const UnlockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 9.9-1" />
  </svg>
);

const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4h6v2" />
  </svg>
);

const AlertIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

/* ===== HELPERS ===== */
function getInitial(name: string): string {
  if (!name) return '?';
  const parts = name.trim().split(' ');
  if (parts.length >= 2) return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  return name.charAt(0).toUpperCase();
}



function formatCreatedAt(iso: string): string {
  const d = new Date(iso);
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
}

/* ===== COMPONENT ===== */
export default function CustomersPage() {
  // List state
  const [customers, setCustomers] = useState<AdminCustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Filters
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [isActiveFilter, setIsActiveFilter] = useState<'' | 'true' | 'false'>('');

  // Modal state
  const [modal, setModal] = useState<ModalType>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<AdminCustomer | null>(null);
  const [detailData, setDetailData] = useState<AdminCustomerDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Edit form
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formStatus, setFormStatus] = useState<StatusStyle>('active');

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Reset selected checkboxes on data change
  useEffect(() => {
    setSelectedIds([]);
  }, [customers]);

  /* ---- Fetch list ---- */
  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiGetCustomers({
        page,
        limit,
        search: search || undefined,
        is_active: isActiveFilter !== '' ? isActiveFilter === 'true' : undefined,
        sort_by: 'created_at',
        sort_dir: 'desc',
      });
      setCustomers(res.data);
      setTotal(res.pagination.total);
      setTotalPages(res.pagination.totalPages);
    } catch {
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, isActiveFilter]);

  useEffect(() => { fetchCustomers(); }, [fetchCustomers]);

  /* ---- Outside click for dropdown ---- */
  useEffect(() => {
    if (!openDropdownId) return;
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [openDropdownId]);

  /* ---- Escape closes modal ---- */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') closeModal(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const closeModal = useCallback(() => {
    setModal(null);
    setSelectedCustomer(null);
    setDetailData(null);
    setActionError(null);
  }, []);

  /* ---- Open detail modal ---- */
  const openDetail = async (c: AdminCustomer) => {
    setSelectedCustomer(c);
    setDetailData(null);
    setDetailLoading(true);
    setModal('detail');
    try {
      const detail = await apiGetCustomerDetail(c.id);
      setDetailData(detail);
    } catch { /* ignore */ }
    finally { setDetailLoading(false); }
  };

  /* ---- Open edit modal ---- */
  const openEdit = (c: AdminCustomer) => {
    setSelectedCustomer(c);
    setFormName(c.full_name);
    setFormPhone(c.phone || '');
    setFormStatus(c.is_active ? 'active' : 'inactive');
    setActionError(null);
    setModal('edit');
    setOpenDropdownId(null);
  };

  /* ---- Toggle is_active ---- */
  const toggleStatus = async (c: AdminCustomer) => {
    setOpenDropdownId(null);
    try {
      await apiUpdateAdminCustomer(c.id, { is_active: !c.is_active });
      fetchCustomers();
    } catch (err: any) {
      alert(err.message || 'Không thể cập nhật trạng thái');
    }
  };

  /* ---- Submit edit ---- */
  const handleEdit = async () => {
    if (!selectedCustomer || !formName.trim()) return;
    setActionLoading(true);
    setActionError(null);
    try {
      await apiUpdateAdminCustomer(selectedCustomer.id, {
        full_name: formName.trim(),
        phone: formPhone.trim() || null,
        is_active: formStatus === 'active',
      });
      fetchCustomers();
      closeModal();
    } catch (err: any) {
      setActionError(err.message || 'Lưu thất bại');
    } finally {
      setActionLoading(false);
    }
  };

  /* ---- Confirm delete ---- */
  const handleDelete = async () => {
    if (!selectedCustomer) return;
    setActionLoading(true);
    try {
      await apiDeleteAdminCustomer(selectedCustomer.id);
      fetchCustomers();
      closeModal();
    } catch (err: any) {
      setActionError(err.message || 'Xóa thất bại');
    } finally {
      setActionLoading(false);
    }
  };

  /* ---- Search submit ---- */
  function handleSearchSubmit(e: React.FormEvent) {
    if (e) e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  }

  /* ---- Export data to CSV ---- */
  const handleExport = async () => {
    if (exporting) return;
    setExporting(true);
    try {
      // Fetch up to 1000 customers for exporting
      const res = await apiGetCustomers({ page: 1, limit: 1000 });
      const exportList = res.data;
      if (!exportList || exportList.length === 0) {
        alert('Không có dữ liệu khách hàng để xuất.');
        return;
      }

      // CSV headers and content mapping
      const headers = ['ID', 'Họ tên', 'Email', 'Số điện thoại', 'Vai trò', 'Trạng thái', 'Ngày tham gia'];
      const rows = exportList.map(c => [
        c.id,
        c.full_name,
        c.email,
        c.phone || '',
        c.role === 'super_admin' ? 'Super Admin' : c.role === 'admin' ? 'Admin' : 'Khách hàng',
        c.is_active ? 'Hoạt động' : 'Không hoạt động',
        formatCreatedAt(c.created_at)
      ]);

      // Unicode BOM for Excel compatibility with UTF-8 Vietnamese chars
      const csvContent = "\uFEFF" + [headers.join(','), ...rows.map(r => r.map(val => `"${val.replace(/"/g, '""')}"`).join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `danh_sach_khach_hang_${new Date().toISOString().slice(0, 10)}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err: any) {
      alert('Không thể xuất dữ liệu: ' + (err.message || 'Lỗi kết nối server'));
    } finally {
      setExporting(false);
    }
  };

  /* ---- Stats (computed from current page — not ideal but fine without aggregate endpoint) ---- */
  const activeCount = customers.filter(c => c.is_active).length;

  return (
    <div className={styles.container}>
      {/* --- Header --- */}
      <div className={styles.headerSection}>
        <div className={styles.titleWrapper}>
          <h1 className={styles.pageTitle}>Quản lý Khách hàng</h1>
          <p className={styles.pageSubtitle}>Quản lý thông tin khách hàng và lịch sử mua hàng của họ.</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.btnExport} onClick={handleExport} disabled={exporting}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            {exporting ? 'Đang xuất...' : 'Xuất dữ liệu'}
          </button>
        </div>
      </div>

      {/* --- Stat Cards --- */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statCardRow}>
            <div className={styles.statIconWrap}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <div className={styles.statInfo}>
              <p className={styles.statLabel}>Tổng khách hàng</p>
              <div className={styles.statValueRow}>
                <h3 className={styles.statValue}>{total.toLocaleString('vi-VN')}</h3>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statInfo}>
            <p className={styles.statLabel}>Đang hoạt động</p>
            <div className={styles.statValueRow}>
              <h3 className={styles.statValue}>{activeCount}</h3>
              <span className={styles.statChange}>trên trang này</span>
            </div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statInfo}>
            <p className={styles.statLabel}>Trang hiện tại</p>
            <div className={styles.statValueRow}>
              <h3 className={styles.statValue}>{page} / {totalPages}</h3>
            </div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statInfo}>
            <p className={styles.statLabel}>Kết quả tìm kiếm</p>
            <div className={styles.statValueRow}>
              <h3 className={styles.statValue}>{total.toLocaleString('vi-VN')}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* --- Main Table --- */}
      <div className={styles.tableContainer}>
        {/* Toolbar */}
        <div className={styles.toolbar}>
          <div className={styles.toolbarLeft}>
            <form className={styles.searchBox} onSubmit={handleSearchSubmit}>
              <svg 
                className={styles.searchIcon} 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  setSearch(searchInput);
                  setPage(1);
                }}
              >
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                className={styles.searchInput}
                placeholder="Tìm kiếm theo tên, email, SĐT..."
                value={searchInput}
                onChange={e => {
                  setSearchInput(e.target.value);
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </form>
            <div className={styles.dropdownGroup}>
              <select
                className={styles.filterSelect}
                value={isActiveFilter}
                onChange={e => { setIsActiveFilter(e.target.value as '' | 'true' | 'false'); setPage(1); }}
              >
                <option value="">Trạng thái</option>
                <option value="true">Hoạt động</option>
                <option value="false">Không hoạt động</option>
              </select>
            </div>
          </div>
          <div className={styles.toolbarRight}>
            <button 
              className={styles.btnFilter} 
              onClick={() => { 
                setSearchInput(''); 
                setSearch(''); 
                setIsActiveFilter(''); 
                setPage(1); 
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
              </svg>
              Đặt lại
            </button>
          </div>
        </div>

        {/* Table */}
        <div className={styles.tableWrapper}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#A67B5B' }}>Đang tải...</div>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th style={{ width: 40 }}>
                    <input 
                      type="checkbox" 
                      className={styles.checkbox} 
                      checked={customers.length > 0 && selectedIds.length === customers.length}
                      onChange={e => {
                        if (e.target.checked) {
                          setSelectedIds(customers.map(c => c.id));
                        } else {
                          setSelectedIds([]);
                        }
                      }}
                    />
                  </th>
                  <th>Khách hàng</th>
                  <th>Email</th>
                  <th>Số điện thoại</th>
                  <th>Trạng thái</th>
                  <th>Ngày tạo</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {customers.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '32px', color: '#9CA3AF' }}>
                      Không tìm thấy khách hàng nào.
                    </td>
                  </tr>
                ) : (
                  customers.map(customer => {
                    const statusStyle: StatusStyle = customer.is_active ? 'active' : 'inactive';
                    const statusLabel = customer.is_active ? 'Hoạt động' : 'Không hoạt động';
                    return (
                      <tr key={customer.id}>
                        <td>
                          <input 
                            type="checkbox" 
                            className={styles.checkbox} 
                            checked={selectedIds.includes(customer.id)}
                            onChange={e => {
                              if (e.target.checked) {
                                setSelectedIds(prev => [...prev, customer.id]);
                              } else {
                                setSelectedIds(prev => prev.filter(id => id !== customer.id));
                              }
                            }}
                          />
                        </td>
                        <td>
                          <div className={styles.userInfo}>
                            <div className={styles.avatar} style={{ backgroundColor: customer.is_active ? '#F4E8DB' : '#FCE7F3', color: customer.is_active ? '#8F6A4E' : '#DB2777' }}>
                              {customer.avatar_url ? (
                                <Image src={customer.avatar_url} alt={customer.full_name} width={32} height={32} className={styles.avatarImg} />
                              ) : (
                                getInitial(customer.full_name)
                              )}
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                              <span className={styles.userName}>{customer.full_name}</span>
                              <span className={styles.userPhoneMobile}>{customer.phone || '—'}</span>
                            </div>
                          </div>
                        </td>
                        <td>{customer.email}</td>
                        <td>{customer.phone || '—'}</td>
                        <td>
                          <span className={`${styles.statusBadge} ${styles[statusStyle]}`}>
                            {statusLabel}
                          </span>
                        </td>
                        <td>{formatCreatedAt(customer.created_at)}</td>
                        <td className={styles.actionsCell}>
                          <div className={styles.actions}>
                            <button className={styles.actionBtn} title="Xem chi tiết" onClick={() => openDetail(customer)}>
                              <EyeIcon />
                            </button>
                            <div style={{ position: 'relative' }} ref={openDropdownId === customer.id ? dropdownRef : null}>
                              <button
                                className={styles.actionBtn}
                                title="Thêm tùy chọn"
                                onClick={() => setOpenDropdownId(openDropdownId === customer.id ? null : customer.id)}
                              >
                                <MoreIcon />
                              </button>
                              {openDropdownId === customer.id && (
                                <div className={styles.dropdownMenu}>
                                  <button className={styles.dropdownItem} onClick={() => openEdit(customer)}>
                                    <EditIcon /> Sửa thông tin
                                  </button>
                                  <button className={styles.dropdownItem} onClick={() => toggleStatus(customer)}>
                                    {customer.is_active ? <LockIcon /> : <UnlockIcon />}
                                    {customer.is_active ? 'Khóa tài khoản' : 'Mở tài khoản'}
                                  </button>
                                  <button
                                    className={`${styles.dropdownItem} ${styles.dropdownItemDanger}`}
                                    onClick={() => { setSelectedCustomer(customer); setModal('delete'); setOpenDropdownId(null); }}
                                  >
                                    <TrashIcon /> Xóa khách hàng
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        <div className={styles.tableFooter}>
          <div className={styles.footerText}>
            Hiển thị {Math.min((page - 1) * limit + 1, total)} - {Math.min(page * limit, total)} trong {total.toLocaleString('vi-VN')} khách hàng
          </div>
          <div className={styles.paginationWrapper}>
            <select 
              className={styles.perPageSelect} 
              value={limit} 
              onChange={e => {
                setLimit(Number(e.target.value));
                setPage(1);
              }}
            >
              <option value={10}>10 / trang</option>
              <option value={20}>20 / trang</option>
              <option value={50}>50 / trang</option>
            </select>
            <div className={styles.pagination}>
              <button className={styles.pageBtn} disabled={page === 1} onClick={() => setPage(p => p - 1)}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
              </button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let p = i + 1;
                if (totalPages > 5 && page > 3) p = page - 2 + i;
                if (p > totalPages) return null;
                return (
                  <button key={p} className={`${styles.pageBtn} ${page === p ? styles.pageActive : ''}`} onClick={() => setPage(p)}>{p}</button>
                );
              })}
              {totalPages > 5 && page < totalPages - 2 && (
                <>
                  <span className={styles.pageBtn} style={{ cursor: 'default' }}>...</span>
                  <button className={styles.pageBtn} onClick={() => setPage(totalPages)}>{totalPages}</button>
                </>
              )}
              <button className={styles.pageBtn} disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================
          MODALS
          ======================================== */}

      {/* --- Detail Modal --- */}
      {modal === 'detail' && selectedCustomer && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={`${styles.modalCard} ${styles.modalCardLg}`} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Chi tiết khách hàng</h2>
              <button className={styles.modalCloseBtn} onClick={closeModal}><XIcon /></button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.detailTop}>
                <div className={styles.detailAvatar}>
                  {selectedCustomer.avatar_url ? (
                    <Image src={selectedCustomer.avatar_url} alt={selectedCustomer.full_name} width={56} height={56} style={{ borderRadius: '50%', objectFit: 'cover' }} />
                  ) : (
                    getInitial(selectedCustomer.full_name)
                  )}
                </div>
                <div>
                  <p className={styles.detailName}>{selectedCustomer.full_name}</p>
                  <div className={styles.detailBadges}>
                    <span className={`${styles.statusBadge} ${styles[selectedCustomer.is_active ? 'active' : 'inactive']}`}>
                      {selectedCustomer.is_active ? 'Hoạt động' : 'Không hoạt động'}
                    </span>
                  </div>
                </div>
              </div>
              {detailLoading ? (
                <div style={{ textAlign: 'center', padding: '24px', color: '#A67B5B' }}>Đang tải...</div>
              ) : (
                <div className={styles.infoGrid}>
                  <div className={styles.infoItem}><span className={styles.infoLabel}>Email</span><span className={styles.infoValue}>{selectedCustomer.email}</span></div>
                  <div className={styles.infoItem}><span className={styles.infoLabel}>Số điện thoại</span><span className={styles.infoValue}>{selectedCustomer.phone || '—'}</span></div>
                  <div className={styles.infoItem}><span className={styles.infoLabel}>Ngày tham gia</span><span className={styles.infoValue}>{formatCreatedAt(selectedCustomer.created_at)}</span></div>
                  <div className={styles.infoItem}><span className={styles.infoLabel}>Quyền</span><span className={styles.infoValue}>{selectedCustomer.role}</span></div>
                  {detailData && (
                    <>
                      <div className={styles.infoItem}><span className={styles.infoLabel}>Tổng đơn hàng</span><span className={styles.infoValue}>{detailData.order_count} đơn</span></div>
                      <div className={styles.infoItem}><span className={styles.infoLabel}>Tổng chi tiêu</span><span className={styles.infoValue}>{formatVND(detailData.total_spent)}</span></div>
                    </>
                  )}
                  {detailData?.recent_orders && detailData.recent_orders.length > 0 && (
                    <div className={styles.infoItem} style={{ gridColumn: '1 / -1' }}>
                      <span className={styles.infoLabel}>Đơn hàng gần đây</span>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 4 }}>
                        {detailData.recent_orders.map((o, i) => (
                          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#374151' }}>
                            <span>#{o.order_number} · {formatCreatedAt(o.created_at)}</span>
                            <span style={{ fontWeight: 600 }}>{formatVND(o.total_amount)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.btnSecondary} onClick={closeModal}>Đóng</button>
              <button className={styles.btnPrimary} onClick={() => { closeModal(); openEdit(selectedCustomer); }}>Chỉnh sửa</button>
            </div>
          </div>
        </div>
      )}

      {/* --- Edit Modal --- */}
      {modal === 'edit' && selectedCustomer && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modalCard} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Sửa thông tin khách hàng</h2>
              <button className={styles.modalCloseBtn} onClick={closeModal}><XIcon /></button>
            </div>
            <div className={styles.modalBody}>
              {actionError && <div style={{ color: '#DC2626', fontSize: 13, marginBottom: 12, padding: '8px 12px', background: '#FEF2F2', borderRadius: 6 }}>{actionError}</div>}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Họ và tên *</label>
                <input type="text" className={styles.formInput} placeholder="Nhập họ và tên" value={formName} onChange={e => setFormName(e.target.value)} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Email</label>
                <input type="email" className={styles.formInput} value={selectedCustomer.email} disabled style={{ backgroundColor: '#F9FAFB', color: '#9CA3AF' }} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Số điện thoại</label>
                <input type="tel" className={styles.formInput} placeholder="0xxx xxx xxx" value={formPhone} onChange={e => setFormPhone(e.target.value)} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Trạng thái</label>
                <div className={styles.radioGroup}>
                  <button type="button" className={`${styles.radioBtn} ${formStatus === 'active' ? styles.radioBtnActive : ''}`} onClick={() => setFormStatus('active')}>
                    Hoạt động
                  </button>
                  <button type="button" className={`${styles.radioBtn} ${formStatus === 'inactive' ? styles.radioBtnActive : ''}`} onClick={() => setFormStatus('inactive')}>
                    Không hoạt động
                  </button>
                </div>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.btnSecondary} onClick={closeModal} disabled={actionLoading}>Hủy</button>
              <button className={styles.btnPrimary} onClick={handleEdit} disabled={actionLoading || !formName.trim()}>
                {actionLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- Delete Modal --- */}
      {modal === 'delete' && selectedCustomer && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={`${styles.modalCard} ${styles.modalCardSm}`} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Xóa khách hàng</h2>
              <button className={styles.modalCloseBtn} onClick={closeModal}><XIcon /></button>
            </div>
            <div className={styles.modalBody}>
              {actionError && <div style={{ color: '#DC2626', fontSize: 13, marginBottom: 12 }}>{actionError}</div>}
              <div className={styles.confirmIcon}><AlertIcon /></div>
              <p className={styles.confirmText}>
                Bạn có chắc chắn muốn xóa <strong>{selectedCustomer.full_name}</strong>?{' '}
                Hành động này không thể hoàn tác.
              </p>
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.btnSecondary} onClick={closeModal} disabled={actionLoading}>Hủy</button>
              <button className={styles.btnDanger} onClick={handleDelete} disabled={actionLoading}>
                {actionLoading ? 'Đang xóa...' : 'Xóa'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
