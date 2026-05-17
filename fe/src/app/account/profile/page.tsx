'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/store/AuthContext';
import { apiChangePassword } from '@/utils/authService';
import styles from './ProfilePage.module.css';

export default function ProfilePage() {
  const { user } = useAuth();

  // General profile state
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');

  // Password change state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Status alerts
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');
  const [passSuccess, setPassSuccess] = useState('');
  const [passError, setPassError] = useState('');
  const [isPassLoading, setIsPassLoading] = useState(false);

  // Initialize values
  useEffect(() => {
    if (user) {
      setFullName(user.full_name || '');
      setPhone(user.phone || '');
      setEmail(user.email || '');
    }
    
    // Load address from localStorage
    if (typeof window !== 'undefined') {
      const savedAddress = localStorage.getItem('lv_user_address') || '';
      setAddress(savedAddress);
    }
  }, [user]);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSuccess('');
    setProfileError('');

    try {
      if (fullName.trim().length < 2) {
        setProfileError('Họ và tên tối thiểu phải có 2 ký tự.');
        return;
      }
      
      // Save address to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('lv_user_address', address);
      }
      
      // Simulating Supabase / Backend update
      setProfileSuccess('Cập nhật thông tin tài khoản thành công!');
    } catch (err: any) {
      setProfileError(err.message || 'Có lỗi xảy ra khi cập nhật thông tin.');
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassSuccess('');
    setPassError('');

    if (newPassword !== confirmPassword) {
      setPassError('Mật khẩu xác nhận không khớp.');
      return;
    }

    setIsPassLoading(true);
    try {
      await apiChangePassword(oldPassword, newPassword);
      setPassSuccess('Đổi mật khẩu thành công!');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setPassError(err.message || 'Mật khẩu cũ không chính xác hoặc có lỗi xảy ra.');
    } finally {
      setIsPassLoading(false);
    }
  };

  const getInitial = (name: string) => {
    if (!name) return 'U';
    return name.trim().charAt(0).toUpperCase();
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>Hồ sơ cá nhân</h1>
        <p className={styles.subtitle}>Quản lý thông tin tài khoản và cấu hình bảo mật của bạn.</p>
      </div>

      <div className={styles.profileCard}>
        {/* Avatar Section */}
        <div className={styles.avatarSection}>
          <div className={styles.avatarWrap}>
            {user?.avatar_url ? (
              <img src={user.avatar_url} alt={fullName} className={styles.avatarImg} />
            ) : (
              <span className={styles.avatarText}>{getInitial(fullName || 'User')}</span>
            )}
          </div>
          <div className={styles.avatarUpload}>
            <button type="button" className={styles.uploadBtn}>Thay đổi ảnh đại diện</button>
            <span className={styles.avatarNote}>Khuyên dùng: Định dạng JPG, PNG. Dung lượng tối đa 2MB.</span>
          </div>
        </div>

        {/* Update Profile Form */}
        <form onSubmit={handleUpdateProfile}>
          {profileSuccess && <div className={styles.alertSuccess}>✅ {profileSuccess}</div>}
          {profileError && <div className={styles.alertError}>⚠️ {profileError}</div>}

          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Họ và tên</label>
              <input
                type="text"
                className={styles.input}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
            
            <div className={styles.formGroup}>
              <label className={styles.label}>Số điện thoại</label>
              <input
                type="tel"
                className={styles.input}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Nhập số điện thoại"
              />
            </div>

            <div className={`${styles.formGroup} ${styles.spanFull}`}>
              <label className={styles.label}>Địa chỉ Email (Không thể thay đổi)</label>
              <input
                type="email"
                className={styles.input}
                value={email}
                disabled
              />
            </div>

            <div className={`${styles.formGroup} ${styles.spanFull}`}>
              <label className={styles.label}>Địa chỉ giao hàng</label>
              <textarea
                className={styles.textarea}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Nhập địa chỉ giao hàng chi tiết (Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố)..."
                rows={3}
              />
            </div>
          </div>

          <div className={styles.actionsBar} style={{ marginBottom: '32px' }}>
            <button type="submit" className={styles.btnSave}>Cập nhật thông tin</button>
          </div>
        </form>

        {/* Change Password Section */}
        <div className={styles.passwordSection}>
          <h2 className={styles.sectionTitle}>🔒 Bảo mật & Đổi mật khẩu</h2>
          
          <form onSubmit={handleChangePassword}>
            {passSuccess && <div className={styles.alertSuccess}>✅ {passSuccess}</div>}
            {passError && <div className={styles.alertError}>⚠️ {passError}</div>}

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
              <div></div> {/* Spacer */}

              <div className={styles.formGroup}>
                <label className={styles.label}>Mật khẩu mới</label>
                <input
                  type="password"
                  className={styles.input}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
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

            <div className={styles.actionsBar}>
              <button 
                type="button" 
                className={styles.btnCancel}
                onClick={() => {
                  setOldPassword('');
                  setNewPassword('');
                  setConfirmPassword('');
                  setPassSuccess('');
                  setPassError('');
                }}
              >
                Đặt lại
              </button>
              <button 
                type="submit" 
                className={styles.btnSave}
                disabled={isPassLoading}
              >
                {isPassLoading ? 'Đang lưu...' : 'Thay đổi mật khẩu'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
