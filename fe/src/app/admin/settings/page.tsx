'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { apiChangePassword } from '@/utils/authService';
import { getSiteConfig, saveSiteConfig } from '@/utils/siteConfig';
import styles from './SettingsPage.module.css';

function parseVnd(str: string): number {
  return parseInt(str.replace(/\./g, '').replace(/,/g, ''), 10) || 0;
}

function formatVnd(n: number): string {
  return n.toLocaleString('vi-VN').replace(/,/g, '.');
}

/* ===== MOCK DATA FOR STAFF ===== */
const MOCK_STAFF = [
  { id: 1, name: 'Levents Admin', email: 'admin@levents.vn', role: 'Super Admin', roleClass: 'super', lastActive: 'Vừa xong' },
  { id: 2, name: 'Nguyễn Nhân Viên', email: 'nhanvien@levents.vn', role: 'Admin', roleClass: 'admin', lastActive: '10 phút trước' },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');

  // General Settings Form States
  const [storeName, setStoreName] = useState('LEVENTS° CLONE');
  const [hotline, setHotline] = useState('1900 1234');
  const [email, setEmail] = useState('support@levents.vn');
  const [address, setAddress] = useState('54-56 Nguyễn Trãi, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh');

  // Shipping States
  const [codEnabled, setCodEnabled] = useState(true);
  const [bankingEnabled, setBankingEnabled] = useState(true);
  const [shipFee, setShipFee] = useState('30.000');
  const [freeShipThreshold, setFreeShipThreshold] = useState('499.000');

  // Appearance States
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  // General save feedback
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Load persisted config from localStorage on mount
  useEffect(() => {
    const cfg = getSiteConfig();
    setStoreName(cfg.storeName);
    setHotline(cfg.hotline);
    setEmail(cfg.email);
    setAddress(cfg.address);
    setCodEnabled(cfg.codEnabled);
    setBankingEnabled(cfg.bankingEnabled);
    setShipFee(formatVnd(cfg.shipFee));
    setFreeShipThreshold(formatVnd(cfg.freeShipThreshold));
  }, []);

  // Change Password States
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passError, setPassError] = useState('');
  const [passSuccess, setPassSuccess] = useState('');
  const [passLoading, setPassLoading] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassError('');
    setPassSuccess('');

    if (activeTab === 'password') {
      if (newPassword !== confirmPassword) {
        setPassError('Mật khẩu xác nhận không khớp.');
        return;
      }

      setPassLoading(true);
      try {
        await apiChangePassword(oldPassword, newPassword);
        setPassSuccess('Đổi mật khẩu thành công!');
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } catch (err: any) {
        setPassError(err.message || 'Không thể đổi mật khẩu. Vui lòng kiểm tra lại mật khẩu cũ.');
      } finally {
        setPassLoading(false);
      }
    } else {
      saveSiteConfig({
        storeName,
        hotline,
        email,
        address,
        codEnabled,
        bankingEnabled,
        shipFee: parseVnd(shipFee),
        freeShipThreshold: parseVnd(freeShipThreshold),
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  return (
    <div className={styles.container}>
      {/* --- Header Section --- */}
      <div className={styles.headerSection}>
        <div className={styles.titleWrapper}>
          <h1 className={styles.pageTitle}>Cài đặt</h1>
          <p className={styles.pageSubtitle}>Quản lý cấu hình hệ thống, giao diện cửa hàng và phân quyền nhân viên.</p>
        </div>
      </div>

      {/* --- Layout Grid --- */}
      <div className={styles.layoutGrid}>
        
        {/* --- Sidebar Nav --- */}
        <aside className={styles.settingsNav}>
          <button 
            className={`${styles.navItem} ${activeTab === 'general' ? styles.navItemActive : ''}`}
            onClick={() => setActiveTab('general')}
          >
            <span className={styles.navIcon}>🌐</span>
            Cấu hình chung
          </button>
          <button 
            className={`${styles.navItem} ${activeTab === 'appearance' ? styles.navItemActive : ''}`}
            onClick={() => setActiveTab('appearance')}
          >
            <span className={styles.navIcon}>🖼️</span>
            Giao diện & Banner
          </button>
          <button 
            className={`${styles.navItem} ${activeTab === 'payment' ? styles.navItemActive : ''}`}
            onClick={() => setActiveTab('payment')}
          >
            <span className={styles.navIcon}>💳</span>
            Thanh toán & Vận chuyển
          </button>
          <button 
            className={`${styles.navItem} ${activeTab === 'password' ? styles.navItemActive : ''}`}
            onClick={() => setActiveTab('password')}
          >
            <span className={styles.navIcon}>🔒</span>
            Đổi mật khẩu
          </button>
          <button 
            className={`${styles.navItem} ${activeTab === 'staff' ? styles.navItemActive : ''}`}
            onClick={() => setActiveTab('staff')}
          >
            <span className={styles.navIcon}>👥</span>
            Nhân viên & Phân quyền
          </button>
        </aside>

        {/* --- Main Content Panel --- */}
        <form onSubmit={handleSave} className={styles.mainPanel}>
          {saveSuccess && (
            <div style={{ padding: '12px 16px', background: '#DCFCE7', border: '1px solid #86EFAC', color: '#16A34A', borderRadius: '8px', fontSize: '14px', fontWeight: 500 }}>
              ✅ Cài đặt đã được lưu thành công!
            </div>
          )}
          
          {/* TAB 1: GENERAL CONFIG */}
          {activeTab === 'general' && (
            <>
              <div className={styles.panelHeader}>
                <h2 className={styles.panelTitle}>Cấu hình chung</h2>
                <p className={styles.panelSubtitle}>Thông tin cơ bản về cửa hàng hiển thị trên Website.</p>
              </div>

              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Tên cửa hàng</label>
                  <input 
                    type="text" 
                    className={styles.input} 
                    value={storeName} 
                    onChange={(e) => setStoreName(e.target.value)} 
                    required 
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Số Hotline chăm sóc khách hàng</label>
                  <input 
                    type="text" 
                    className={styles.input} 
                    value={hotline} 
                    onChange={(e) => setHotline(e.target.value)} 
                    required 
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Email liên hệ</label>
                  <input 
                    type="email" 
                    className={styles.input} 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Múi giờ hệ thống</label>
                  <select className={styles.select} defaultValue="GMT+7">
                    <option value="GMT+7">GMT +07:00 (Băng Cốc, Hà Nội, Jakarta)</option>
                    <option value="GMT+8">GMT +08:00 (Singapore, Manila, Bắc Kinh)</option>
                  </select>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Địa chỉ hiển thị trên chân trang (Footer)</label>
                <textarea 
                  className={styles.textarea} 
                  rows={3} 
                  value={address} 
                  onChange={(e) => setAddress(e.target.value)} 
                  required
                />
              </div>
            </>
          )}

          {/* TAB 2: APPEARANCE & BANNERS */}
          {activeTab === 'appearance' && (
            <>
              <div className={styles.panelHeader}>
                <h2 className={styles.panelTitle}>Giao diện & Banner</h2>
                <p className={styles.panelSubtitle}>Quản lý hình ảnh chạy trang chủ và các thiết lập hiển thị.</p>
              </div>

              {/* Maintenance Toggle */}
              <div className={styles.switchRow}>
                <div className={styles.switchInfo}>
                  <span className={styles.switchLabel}>Chế độ bảo trì Website (Maintenance Mode)</span>
                  <span className={styles.switchDesc}>Khi bật, khách hàng truy cập Web sẽ thấy trang thông báo bảo trì, khóa mọi thao tác mua hàng.</span>
                </div>
                <label className={styles.switch}>
                  <input 
                    type="checkbox" 
                    checked={maintenanceMode} 
                    onChange={(e) => setMaintenanceMode(e.target.checked)} 
                  />
                  <span className={styles.slider}></span>
                </label>
              </div>

              {/* Banner Upload Mockups */}
              <div className={styles.formGroup}>
                <label className={styles.label} style={{ marginBottom: 12 }}>Banner Quảng Cáo Trang Chủ (Khuyên dùng: 1920x800px)</label>
                <div className={styles.bannerGrid}>
                  <div className={styles.bannerCard}>
                    <div className={styles.bannerPreview}>
                      <Image 
                        src="/images/login/login.png" 
                        alt="Banner 1" 
                        fill 
                        className={styles.bannerPreviewImg} 
                      />
                    </div>
                    <div className={styles.bannerActions}>
                      <button type="button" className={styles.btnUpload}>Thay đổi ảnh</button>
                      <button type="button" className={styles.btnDelete}>🗑️</button>
                    </div>
                  </div>
                  <div className={styles.bannerCard}>
                    <div className={styles.bannerPreview}>
                      <div style={{ color: '#9CA3AF', fontSize: 13, textAlign: 'center' }}>
                        ➕<br />Tải banner mới lên
                      </div>
                    </div>
                    <div className={styles.bannerActions}>
                      <button type="button" className={styles.btnUpload} style={{ width: '100%' }}>Chọn tập tin</button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* TAB 3: PAYMENT & SHIPPING */}
          {activeTab === 'payment' && (
            <>
              <div className={styles.panelHeader}>
                <h2 className={styles.panelTitle}>Thanh toán & Vận chuyển</h2>
                <p className={styles.panelSubtitle}>Cấu hình phí ship và bật/tắt các phương thức thanh toán.</p>
              </div>

              {/* Toggles */}
              <div className={styles.switchRow}>
                <div className={styles.switchInfo}>
                  <span className={styles.switchLabel}>Thanh toán khi nhận hàng (COD)</span>
                  <span className={styles.switchDesc}>Khách đặt hàng và trả tiền mặt cho shipper khi giao nhận sản phẩm.</span>
                </div>
                <label className={styles.switch}>
                  <input 
                    type="checkbox" 
                    checked={codEnabled} 
                    onChange={(e) => setCodEnabled(e.target.checked)} 
                  />
                  <span className={styles.slider}></span>
                </label>
              </div>

              <div className={styles.switchRow}>
                <div className={styles.switchInfo}>
                  <span className={styles.switchLabel}>Chuyển khoản Ngân hàng</span>
                  <span className={styles.switchDesc}>Cho phép thanh toán trước qua QR Code ngân hàng.</span>
                </div>
                <label className={styles.switch}>
                  <input 
                    type="checkbox" 
                    checked={bankingEnabled} 
                    onChange={(e) => setBankingEnabled(e.target.checked)} 
                  />
                  <span className={styles.slider}></span>
                </label>
              </div>

              {/* Shipping Inputs */}
              <div className={styles.formGrid} style={{ marginTop: 12 }}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Phí vận chuyển mặc định (VNĐ)</label>
                  <input 
                    type="text" 
                    className={styles.input} 
                    value={shipFee} 
                    onChange={(e) => setShipFee(e.target.value)} 
                    required 
                  />
                  <span className={styles.helperText}>Ví dụ: 30.000</span>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Ngưỡng miễn phí vận chuyển (VNĐ)</label>
                  <input 
                    type="text" 
                    className={styles.input} 
                    value={freeShipThreshold} 
                    onChange={(e) => setFreeShipThreshold(e.target.value)} 
                    required 
                  />
                  <span className={styles.helperText}>Ví dụ: 499.000</span>
                </div>
              </div>
            </>
          )}

          {/* TAB 4: STAFF MANAGEMENT */}
          {activeTab === 'staff' && (
            <>
              <div className={styles.panelHeader} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h2 className={styles.panelTitle}>Nhân viên & Phân quyền</h2>
                  <p className={styles.panelSubtitle}>Danh sách tài khoản có quyền truy cập trang quản trị này.</p>
                </div>
                <button type="button" className={styles.btnSave} style={{ height: 38, fontSize: 13 }}>
                  ➕ Thêm nhân viên
                </button>
              </div>

              <table className={styles.staffTable}>
                <thead>
                  <tr>
                    <th>Họ và tên</th>
                    <th>Email đăng nhập</th>
                    <th>Quyền hạn</th>
                    <th>Hoạt động</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_STAFF.map(staff => (
                    <tr key={staff.id}>
                      <td style={{ fontWeight: 600 }}>{staff.name}</td>
                      <td>{staff.email}</td>
                      <td>
                        <span className={`${styles.badge} ${styles[staff.roleClass]}`}>
                          {staff.role}
                        </span>
                      </td>
                      <td style={{ color: '#6B7280', fontSize: 13 }}>{staff.lastActive}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

          {/* TAB 5: CHANGE PASSWORD */}
          {activeTab === 'password' && (
            <>
              <div className={styles.panelHeader}>
                <h2 className={styles.panelTitle}>Đổi mật khẩu</h2>
                <p className={styles.panelSubtitle}>Cập nhật mật khẩu mới bảo mật hơn cho tài khoản của bạn.</p>
              </div>

              {passError && (
                <div style={{ padding: '12px 16px', background: '#FEE2E2', border: '1px solid #FCA5A5', color: '#EF4444', borderRadius: '8px', fontSize: '14px', fontWeight: 500 }}>
                  ⚠️ {passError}
                </div>
              )}

              {passSuccess && (
                <div style={{ padding: '12px 16px', background: '#DCFCE7', border: '1px solid #86EFAC', color: '#16A34A', borderRadius: '8px', fontSize: '14px', fontWeight: 500 }}>
                  ✅ {passSuccess}
                </div>
              )}

              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Mật khẩu hiện tại</label>
                  <input 
                    type="password" 
                    className={styles.input} 
                    value={oldPassword} 
                    onChange={(e) => setOldPassword(e.target.value)} 
                    required 
                  />
                </div>
                <div style={{ display: 'none' }}></div> {/* Spacer to keep 2-column alignment neat */}
                
                <div className={styles.formGroup}>
                  <label className={styles.label}>Mật khẩu mới</label>
                  <input 
                    type="password" 
                    className={styles.input} 
                    value={newPassword} 
                    onChange={(e) => setNewPassword(e.target.value)} 
                    required 
                  />
                  <span className={styles.helperText}>Mật khẩu phải từ 8 ký tự, có 1 chữ hoa và 1 chữ số.</span>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Xác nhận mật khẩu mới</label>
                  <input 
                    type="password" 
                    className={styles.input} 
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)} 
                    required 
                  />
                </div>
              </div>
            </>
          )}

          {/* --- Common Save/Cancel Actions Bar --- */}
          {activeTab !== 'staff' && (
            <div className={styles.actionBar}>
              <button 
                type="button" 
                className={styles.btnCancel}
                onClick={() => {
                  setOldPassword('');
                  setNewPassword('');
                  setConfirmPassword('');
                  setPassError('');
                  setPassSuccess('');
                }}
              >
                Đặt lại
              </button>
              <button type="submit" className={styles.btnSave} disabled={passLoading}>
                {passLoading ? 'Đang cập nhật...' : 'Lưu thay đổi'}
              </button>
            </div>
          )}

        </form>

      </div>
    </div>
  );
}
