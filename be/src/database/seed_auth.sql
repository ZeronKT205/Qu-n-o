-- ============================================
-- AUTH SEED DATA - TEST USERS
-- Dữ liệu test cho hệ thống đăng nhập & phân quyền
-- ============================================
-- Chạy file này trên Supabase SQL Editor sau khi đã chạy schema.sql
-- ============================================

-- Xóa users cũ nếu chạy lại (safe for dev only)
DELETE FROM refresh_tokens WHERE user_id IN (
  SELECT id FROM users WHERE email IN (
    'admin@levents.vn', 'nhanvien@levents.vn', 'customer@gmail.com', 'customer2@gmail.com'
  )
);
DELETE FROM users WHERE email IN (
  'admin@levents.vn', 'nhanvien@levents.vn', 'customer@gmail.com', 'customer2@gmail.com'
);

-- ============================================
-- 1. SUPER ADMIN
--    Email: admin@levents.vn
--    Password: Admin@123
-- ============================================
INSERT INTO users (email, phone, password_hash, full_name, role, email_verified, is_active)
VALUES (
  'admin@levents.vn',
  '0900000001',
  '$2b$12$8JHCOnPZWZFcccS0c/ye3elczNhg.m6lW8FHFizw/phOHwRujRp5m',
  'Super Admin Levents',
  'super_admin',
  true,
  true
);

-- ============================================
-- 2. ADMIN (Staff)
--    Email: nhanvien@levents.vn
--    Password: Staff@123
-- ============================================
INSERT INTO users (email, phone, password_hash, full_name, role, email_verified, is_active)
VALUES (
  'nhanvien@levents.vn',
  '0900000002',
  '$2b$12$OcnSUqZ3dsgmxKr1f/XMG.hxRY1AXUgCGLRFbPkINXYQGHOL68m3C',
  'Nhân Viên Quản Lý',
  'admin',
  true,
  true
);

-- ============================================
-- 3. CUSTOMER (active)
--    Email: customer@gmail.com
--    Password: Customer@123
-- ============================================
INSERT INTO users (email, phone, password_hash, full_name, role, email_verified, is_active)
VALUES (
  'customer@gmail.com',
  '0987654321',
  '$2b$12$co2P.Qe/XV4XUHL.pyNhau9JdBZ1Lqx9rR2YF.EprwkQNS6/6Rgzu',
  'Nguyễn Văn Khách',
  'customer',
  true,
  true
);

-- ============================================
-- 4. CUSTOMER (inactive - locked)
--    Email: customer2@gmail.com
--    Password: Customer@123
-- ============================================
INSERT INTO users (email, phone, password_hash, full_name, role, email_verified, is_active)
VALUES (
  'customer2@gmail.com',
  '0977123456',
  '$2b$12$co2P.Qe/XV4XUHL.pyNhau9JdBZ1Lqx9rR2YF.EprwkQNS6/6Rgzu',
  'Trần Thị Bị Khóa',
  'customer',
  false,
  false
);

-- ============================================
-- DONE! Test credentials:
--
--  👑 Super Admin : admin@levents.vn      / Admin@123
--  🛠️  Admin       : nhanvien@levents.vn   / Staff@123
--  👤 Customer    : customer@gmail.com    / Customer@123
--  🔒 Locked      : customer2@gmail.com   / Customer@123 (bị khóa)
-- ============================================
