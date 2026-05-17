-- ============================================
-- SEED: 30 KHÁCH HÀNG + ĐỊA CHỈ
-- Password tất cả: Customer@123
-- Chạy độc lập, không phụ thuộc bảng khác
-- ============================================

BEGIN;

-- Cleanup (by UUID)
DELETE FROM addresses WHERE id BETWEEN 'ee000001-0000-0000-0000-000000000000'
                                    AND 'ee000030-0000-0000-0000-000000000000';
DELETE FROM users WHERE id BETWEEN 'dd000001-0000-0000-0000-000000000000'
                                AND 'dd000030-0000-0000-0000-000000000000';

-- ============================================
-- USERS — 30 khách hàng
-- ============================================
INSERT INTO users (id, email, phone, password_hash, full_name, role, email_verified, is_active, is_deleted, created_at) VALUES
('dd000001-0000-0000-0000-000000000000','nguyen.thi.lan@gmail.com',   '0901234501','$2b$12$co2P.Qe/XV4XUHL.pyNhau9JdBZ1Lqx9rR2YF.EprwkQNS6/6Rgzu','Nguyễn Thị Lan',       'customer',true,true,false,'2026-04-17T10:00:00+07:00'),
('dd000002-0000-0000-0000-000000000000','tran.minh.tuan@gmail.com',   '0912345602','$2b$12$co2P.Qe/XV4XUHL.pyNhau9JdBZ1Lqx9rR2YF.EprwkQNS6/6Rgzu','Trần Minh Tuấn',       'customer',true,true,false,'2026-04-22T14:30:00+07:00'),
('dd000003-0000-0000-0000-000000000000','le.thi.hoa@gmail.com',       '0923456703','$2b$12$co2P.Qe/XV4XUHL.pyNhau9JdBZ1Lqx9rR2YF.EprwkQNS6/6Rgzu','Lê Thị Hoa',           'customer',true,true,false,'2026-04-27T09:15:00+07:00'),
('dd000004-0000-0000-0000-000000000000','pham.quoc.bao@gmail.com',    '0934567804','$2b$12$co2P.Qe/XV4XUHL.pyNhau9JdBZ1Lqx9rR2YF.EprwkQNS6/6Rgzu','Phạm Quốc Bảo',        'customer',true,true,false,'2026-04-29T11:00:00+07:00'),
('dd000005-0000-0000-0000-000000000000','hoang.thu.linh@gmail.com',   '0945678905','$2b$12$co2P.Qe/XV4XUHL.pyNhau9JdBZ1Lqx9rR2YF.EprwkQNS6/6Rgzu','Hoàng Thu Linh',       'customer',true,true,false,'2026-05-02T08:00:00+07:00'),
('dd000006-0000-0000-0000-000000000000','vu.thanh.nam@gmail.com',     '0956789006','$2b$12$co2P.Qe/XV4XUHL.pyNhau9JdBZ1Lqx9rR2YF.EprwkQNS6/6Rgzu','Vũ Thanh Nam',         'customer',true,true,false,'2026-05-08T13:00:00+07:00'),
('dd000007-0000-0000-0000-000000000000','dang.thi.mai@gmail.com',     '0967890107','$2b$12$co2P.Qe/XV4XUHL.pyNhau9JdBZ1Lqx9rR2YF.EprwkQNS6/6Rgzu','Đặng Thị Mai',         'customer',true,true,false,'2026-05-10T09:00:00+07:00'),
('dd000008-0000-0000-0000-000000000000','bui.van.khanh@gmail.com',    '0978901208','$2b$12$co2P.Qe/XV4XUHL.pyNhau9JdBZ1Lqx9rR2YF.EprwkQNS6/6Rgzu','Bùi Văn Khánh',        'customer',true,true,false,'2026-05-12T10:00:00+07:00'),
('dd000009-0000-0000-0000-000000000000','dinh.thi.ngoc@gmail.com',    '0901112009','$2b$12$co2P.Qe/XV4XUHL.pyNhau9JdBZ1Lqx9rR2YF.EprwkQNS6/6Rgzu','Đinh Thị Ngọc',        'customer',true,true,false,'2026-04-05T08:30:00+07:00'),
('dd000010-0000-0000-0000-000000000000','ly.van.hung@gmail.com',      '0912223010','$2b$12$co2P.Qe/XV4XUHL.pyNhau9JdBZ1Lqx9rR2YF.EprwkQNS6/6Rgzu','Lý Văn Hùng',          'customer',true,true,false,'2026-04-08T11:20:00+07:00'),
('dd000011-0000-0000-0000-000000000000','nguyen.thu.ha@gmail.com',    '0923334011','$2b$12$co2P.Qe/XV4XUHL.pyNhau9JdBZ1Lqx9rR2YF.EprwkQNS6/6Rgzu','Nguyễn Thị Thu Hà',    'customer',true,true,false,'2026-04-10T14:00:00+07:00'),
('dd000012-0000-0000-0000-000000000000','vu.minh.khoa@gmail.com',     '0934445012','$2b$12$co2P.Qe/XV4XUHL.pyNhau9JdBZ1Lqx9rR2YF.EprwkQNS6/6Rgzu','Vũ Minh Khoa',         'customer',true,true,false,'2026-04-12T09:45:00+07:00'),
('dd000013-0000-0000-0000-000000000000','tran.ngoc.han@gmail.com',    '0945556013','$2b$12$co2P.Qe/XV4XUHL.pyNhau9JdBZ1Lqx9rR2YF.EprwkQNS6/6Rgzu','Trần Thị Ngọc Hân',    'customer',true,true,false,'2026-04-14T16:30:00+07:00'),
('dd000014-0000-0000-0000-000000000000','pham.van.dat@gmail.com',     '0956667014','$2b$12$co2P.Qe/XV4XUHL.pyNhau9JdBZ1Lqx9rR2YF.EprwkQNS6/6Rgzu','Phạm Văn Đạt',         'customer',true,true,false,'2026-04-16T10:15:00+07:00'),
('dd000015-0000-0000-0000-000000000000','le.thanh.thao@gmail.com',    '0967778015','$2b$12$co2P.Qe/XV4XUHL.pyNhau9JdBZ1Lqx9rR2YF.EprwkQNS6/6Rgzu','Lê Thị Thanh Thảo',    'customer',true,true,false,'2026-04-19T13:00:00+07:00'),
('dd000016-0000-0000-0000-000000000000','ngo.van.phuc@gmail.com',     '0978889016','$2b$12$co2P.Qe/XV4XUHL.pyNhau9JdBZ1Lqx9rR2YF.EprwkQNS6/6Rgzu','Ngô Văn Phúc',         'customer',true,true,false,'2026-04-21T15:30:00+07:00'),
('dd000017-0000-0000-0000-000000000000','do.lan.anh@gmail.com',       '0909990017','$2b$12$co2P.Qe/XV4XUHL.pyNhau9JdBZ1Lqx9rR2YF.EprwkQNS6/6Rgzu','Đỗ Thị Lan Anh',        'customer',true,true,false,'2026-04-23T08:00:00+07:00'),
('dd000018-0000-0000-0000-000000000000','huynh.van.trong@gmail.com',  '0761112018','$2b$12$co2P.Qe/XV4XUHL.pyNhau9JdBZ1Lqx9rR2YF.EprwkQNS6/6Rgzu','Huỳnh Văn Trọng',      'customer',true,true,false,'2026-04-25T10:00:00+07:00'),
('dd000019-0000-0000-0000-000000000000','phan.my.linh@gmail.com',     '0772223019','$2b$12$co2P.Qe/XV4XUHL.pyNhau9JdBZ1Lqx9rR2YF.EprwkQNS6/6Rgzu','Phan Thị Mỹ Linh',     'customer',true,true,false,'2026-04-27T14:45:00+07:00'),
('dd000020-0000-0000-0000-000000000000','duong.kim.oanh@gmail.com',   '0783334020','$2b$12$co2P.Qe/XV4XUHL.pyNhau9JdBZ1Lqx9rR2YF.EprwkQNS6/6Rgzu','Dương Thị Kim Oanh',   'customer',true,true,false,'2026-04-30T09:30:00+07:00'),
('dd000021-0000-0000-0000-000000000000','to.van.binh@gmail.com',      '0794445021','$2b$12$co2P.Qe/XV4XUHL.pyNhau9JdBZ1Lqx9rR2YF.EprwkQNS6/6Rgzu','Tô Văn Bình',          'customer',true,true,false,'2026-05-01T11:00:00+07:00'),
('dd000022-0000-0000-0000-000000000000','trinh.hong.nhung@gmail.com', '0705556022','$2b$12$co2P.Qe/XV4XUHL.pyNhau9JdBZ1Lqx9rR2YF.EprwkQNS6/6Rgzu','Trịnh Thị Hồng Nhung', 'customer',true,true,false,'2026-05-03T16:00:00+07:00'),
('dd000023-0000-0000-0000-000000000000','nguyen.minh.quang@gmail.com','0796667023','$2b$12$co2P.Qe/XV4XUHL.pyNhau9JdBZ1Lqx9rR2YF.EprwkQNS6/6Rgzu','Nguyễn Minh Quang',    'customer',true,true,false,'2026-05-05T08:30:00+07:00'),
('dd000024-0000-0000-0000-000000000000','hoang.dieu.linh@gmail.com',  '0787778024','$2b$12$co2P.Qe/XV4XUHL.pyNhau9JdBZ1Lqx9rR2YF.EprwkQNS6/6Rgzu','Hoàng Thị Diệu Linh',  'customer',true,true,false,'2026-05-06T10:15:00+07:00'),
('dd000025-0000-0000-0000-000000000000','luu.thi.ngan@gmail.com',     '0778889025','$2b$12$co2P.Qe/XV4XUHL.pyNhau9JdBZ1Lqx9rR2YF.EprwkQNS6/6Rgzu','Lưu Thị Ngân',         'customer',true,true,false,'2026-05-07T14:00:00+07:00'),
('dd000026-0000-0000-0000-000000000000','dang.van.son@gmail.com',     '0769990026','$2b$12$co2P.Qe/XV4XUHL.pyNhau9JdBZ1Lqx9rR2YF.EprwkQNS6/6Rgzu','Đặng Văn Sơn',         'customer',true,true,false,'2026-05-09T09:30:00+07:00'),
('dd000027-0000-0000-0000-000000000000','tran.bich.phuong@gmail.com', '0901010127','$2b$12$co2P.Qe/XV4XUHL.pyNhau9JdBZ1Lqx9rR2YF.EprwkQNS6/6Rgzu','Trần Thị Bích Phương',  'customer',true,true,false,'2026-05-11T13:00:00+07:00'),
('dd000028-0000-0000-0000-000000000000','vo.van.dung@gmail.com',      '0912121228','$2b$12$co2P.Qe/XV4XUHL.pyNhau9JdBZ1Lqx9rR2YF.EprwkQNS6/6Rgzu','Võ Văn Dũng',          'customer',true,true,false,'2026-05-13T15:30:00+07:00'),
('dd000029-0000-0000-0000-000000000000','kieu.thanh.van@gmail.com',   '0923232329','$2b$12$co2P.Qe/XV4XUHL.pyNhau9JdBZ1Lqx9rR2YF.EprwkQNS6/6Rgzu','Kiều Thị Thanh Vân',   'customer',true,true,false,'2026-05-15T10:00:00+07:00'),
('dd000030-0000-0000-0000-000000000000','le.van.hai@gmail.com',       '0934343430','$2b$12$co2P.Qe/XV4XUHL.pyNhau9JdBZ1Lqx9rR2YF.EprwkQNS6/6Rgzu','Lê Văn Hải',           'customer',true,true,false,'2026-05-16T08:00:00+07:00')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- ADDRESSES — 1 địa chỉ mặc định / khách
-- ============================================
INSERT INTO addresses (id, user_id, full_name, phone, province, district, ward, street_address, is_default, is_deleted) VALUES
('ee000001-0000-0000-0000-000000000000','dd000001-0000-0000-0000-000000000000','Nguyễn Thị Lan',       '0901234501','TP. Hồ Chí Minh','Quận 1',           'Phường Bến Nghé',    '12 Đường Lê Lợi',              true,false),
('ee000002-0000-0000-0000-000000000000','dd000002-0000-0000-0000-000000000000','Trần Minh Tuấn',       '0912345602','TP. Hồ Chí Minh','Quận 3',           'Phường 7',           '45 Nguyễn Thị Minh Khai',      true,false),
('ee000003-0000-0000-0000-000000000000','dd000003-0000-0000-0000-000000000000','Lê Thị Hoa',           '0923456703','Hà Nội',          'Quận Đống Đa',     'Phường Láng Hạ',     '78 Đường Láng',                true,false),
('ee000004-0000-0000-0000-000000000000','dd000004-0000-0000-0000-000000000000','Phạm Quốc Bảo',        '0934567804','TP. Hồ Chí Minh','Quận Bình Thạnh',  'Phường 25',          '23 Đinh Bộ Lĩnh',              true,false),
('ee000005-0000-0000-0000-000000000000','dd000005-0000-0000-0000-000000000000','Hoàng Thu Linh',       '0945678905','Đà Nẵng',         'Quận Hải Châu',    'Phường Thạch Thang', '56 Phan Châu Trinh',           true,false),
('ee000006-0000-0000-0000-000000000000','dd000006-0000-0000-0000-000000000000','Vũ Thanh Nam',         '0956789006','TP. Hồ Chí Minh','Quận 7',           'Phường Tân Phú',     '89 Nguyễn Thị Thập',           true,false),
('ee000007-0000-0000-0000-000000000000','dd000007-0000-0000-0000-000000000000','Đặng Thị Mai',         '0967890107','Hà Nội',          'Quận Cầu Giấy',    'Phường Dịch Vọng',   '34 Trần Thái Tông',            true,false),
('ee000008-0000-0000-0000-000000000000','dd000008-0000-0000-0000-000000000000','Bùi Văn Khánh',        '0978901208','TP. Hồ Chí Minh','Quận 10',          'Phường 12',          '67 Tô Hiến Thành',             true,false),
('ee000009-0000-0000-0000-000000000000','dd000009-0000-0000-0000-000000000000','Đinh Thị Ngọc',        '0901112009','TP. Hồ Chí Minh','Thành phố Thủ Đức','Phường An Phú',      '15 Xa Lộ Hà Nội',              true,false),
('ee000010-0000-0000-0000-000000000000','dd000010-0000-0000-0000-000000000000','Lý Văn Hùng',          '0912223010','Hà Nội',          'Quận Hoàn Kiếm',   'Phường Hàng Bông',   '8 Phố Hàng Gai',               true,false),
('ee000011-0000-0000-0000-000000000000','dd000011-0000-0000-0000-000000000000','Nguyễn Thị Thu Hà',    '0923334011','TP. Hồ Chí Minh','Quận Gò Vấp',      'Phường 12',          '102 Quang Trung',               true,false),
('ee000012-0000-0000-0000-000000000000','dd000012-0000-0000-0000-000000000000','Vũ Minh Khoa',         '0934445012','Hà Nội',          'Quận Hai Bà Trưng','Phường Bạch Mai',    '37 Phố Bạch Mai',              true,false),
('ee000013-0000-0000-0000-000000000000','dd000013-0000-0000-0000-000000000000','Trần Thị Ngọc Hân',    '0945556013','TP. Hồ Chí Minh','Quận Tân Bình',    'Phường 4',           '55 Bàu Cát 2',                 true,false),
('ee000014-0000-0000-0000-000000000000','dd000014-0000-0000-0000-000000000000','Phạm Văn Đạt',         '0956667014','Đà Nẵng',         'Quận Hải Châu',    'Phường Thanh Bình',  '21 Ông Ích Khiêm',             true,false),
('ee000015-0000-0000-0000-000000000000','dd000015-0000-0000-0000-000000000000','Lê Thị Thanh Thảo',    '0967778015','TP. Hồ Chí Minh','Quận Phú Nhuận',   'Phường 10',          '44 Phan Đình Phùng',           true,false),
('ee000016-0000-0000-0000-000000000000','dd000016-0000-0000-0000-000000000000','Ngô Văn Phúc',         '0978889016','Hà Nội',          'Quận Long Biên',   'Phường Thạch Bàn',   '19 Đường Thạch Bàn',           true,false),
('ee000017-0000-0000-0000-000000000000','dd000017-0000-0000-0000-000000000000','Đỗ Thị Lan Anh',       '0909990017','TP. Hồ Chí Minh','Quận 4',           'Phường 14',          '73 Đoàn Văn Bơ',               true,false),
('ee000018-0000-0000-0000-000000000000','dd000018-0000-0000-0000-000000000000','Huỳnh Văn Trọng',      '0761112018','Cần Thơ',         'Quận Ninh Kiều',   'Phường Xuân Khánh',  '66 Đường 3/2',                 true,false),
('ee000019-0000-0000-0000-000000000000','dd000019-0000-0000-0000-000000000000','Phan Thị Mỹ Linh',     '0772223019','TP. Hồ Chí Minh','Quận 5',           'Phường 7',           '28 Trần Hưng Đạo B',           true,false),
('ee000020-0000-0000-0000-000000000000','dd000020-0000-0000-0000-000000000000','Dương Thị Kim Oanh',   '0783334020','Hải Phòng',       'Quận Lê Chân',     'Phường Dư Hàng',     '14 Phố Lê Đại Hành',           true,false),
('ee000021-0000-0000-0000-000000000000','dd000021-0000-0000-0000-000000000000','Tô Văn Bình',          '0794445021','Hà Nội',          'Quận Thanh Xuân',  'Phường Khương Mai',  '31 Khương Trung',               true,false),
('ee000022-0000-0000-0000-000000000000','dd000022-0000-0000-0000-000000000000','Trịnh Thị Hồng Nhung', '0705556022','TP. Hồ Chí Minh','Quận 8',           'Phường 5',           '90 Tùng Thiện Vương',           true,false),
('ee000023-0000-0000-0000-000000000000','dd000023-0000-0000-0000-000000000000','Nguyễn Minh Quang',    '0796667023','TP. Hồ Chí Minh','Quận 6',           'Phường Bình Trị Đông','47 Hậu Giang',                 true,false),
('ee000024-0000-0000-0000-000000000000','dd000024-0000-0000-0000-000000000000','Hoàng Thị Diệu Linh',  '0787778024','Hà Nội',          'Quận Ba Đình',     'Phường Đội Cấn',     '5 Phố Đội Cấn',                true,false),
('ee000025-0000-0000-0000-000000000000','dd000025-0000-0000-0000-000000000000','Lưu Thị Ngân',         '0778889025','TP. Hồ Chí Minh','Thành phố Thủ Đức','Phường Hiệp Bình Phước','120 Kha Vạn Cân',            true,false),
('ee000026-0000-0000-0000-000000000000','dd000026-0000-0000-0000-000000000000','Đặng Văn Sơn',         '0769990026','Đà Nẵng',         'Quận Liên Chiểu',  'Phường Hòa Khánh Bắc','83 Ngô Quyền',               true,false),
('ee000027-0000-0000-0000-000000000000','dd000027-0000-0000-0000-000000000000','Trần Thị Bích Phương', '0901010127','TP. Hồ Chí Minh','Quận 11',          'Phường 13',          '29 Lý Thường Kiệt',            true,false),
('ee000028-0000-0000-0000-000000000000','dd000028-0000-0000-0000-000000000000','Võ Văn Dũng',          '0912121228','Hà Nội',          'Quận Đống Đa',     'Phường Nam Đồng',    '62 Chùa Bộc',                  true,false),
('ee000029-0000-0000-0000-000000000000','dd000029-0000-0000-0000-000000000000','Kiều Thị Thanh Vân',   '0923232329','TP. Hồ Chí Minh','Quận 12',          'Phường An Phú Đông', '37 Nguyễn Ảnh Thủ',            true,false),
('ee000030-0000-0000-0000-000000000000','dd000030-0000-0000-0000-000000000000','Lê Văn Hải',           '0934343430','Cần Thơ',         'Quận Ninh Kiều',   'Phường An Hội',      '11 Đường Nguyễn Văn Cừ',       true,false)
ON CONFLICT (id) DO NOTHING;

COMMIT;
-- DONE: 30 khách hàng + 30 địa chỉ
