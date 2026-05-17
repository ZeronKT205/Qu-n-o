-- ============================================
-- LEVENTS — FULL SEED DATA v2.0
-- Chạy file này trên Supabase SQL Editor
-- Yêu cầu: schema.sql + seed_auth.sql đã chạy trước
-- ============================================
-- UUID scheme (valid hex only):
--   categories : aa000001-0000-0000-0000-000000000000
--   products   : bb000001-0000-0000-0000-000000000000
--   variants   : cc000001-0000-0000-0000-000000000000
--   customers  : dd000001-0000-0000-0000-000000000000
--   addresses  : ee000001-0000-0000-0000-000000000000
--   orders     : ff000001-0000-0000-0000-000000000000
--   order_items: 20000001-0000-0000-0000-000000000000
-- ============================================

BEGIN;

-- ============================================
-- PART 0: CLEANUP (FK-safe reverse order)
-- ============================================
DELETE FROM order_items WHERE order_id IN (
  'ff000001-0000-0000-0000-000000000000','ff000002-0000-0000-0000-000000000000',
  'ff000003-0000-0000-0000-000000000000','ff000004-0000-0000-0000-000000000000',
  'ff000005-0000-0000-0000-000000000000','ff000006-0000-0000-0000-000000000000',
  'ff000007-0000-0000-0000-000000000000','ff000008-0000-0000-0000-000000000000',
  'ff000009-0000-0000-0000-000000000000','ff000010-0000-0000-0000-000000000000',
  'ff000011-0000-0000-0000-000000000000','ff000012-0000-0000-0000-000000000000',
  'ff000013-0000-0000-0000-000000000000','ff000014-0000-0000-0000-000000000000',
  'ff000015-0000-0000-0000-000000000000','ff000016-0000-0000-0000-000000000000',
  'ff000017-0000-0000-0000-000000000000','ff000018-0000-0000-0000-000000000000',
  'ff000019-0000-0000-0000-000000000000','ff000020-0000-0000-0000-000000000000',
  'ff000021-0000-0000-0000-000000000000','ff000022-0000-0000-0000-000000000000',
  'ff000023-0000-0000-0000-000000000000','ff000024-0000-0000-0000-000000000000',
  'ff000025-0000-0000-0000-000000000000','ff000026-0000-0000-0000-000000000000',
  'ff000027-0000-0000-0000-000000000000','ff000028-0000-0000-0000-000000000000',
  'ff000029-0000-0000-0000-000000000000','ff000030-0000-0000-0000-000000000000'
);
DELETE FROM orders WHERE id IN (
  'ff000001-0000-0000-0000-000000000000','ff000002-0000-0000-0000-000000000000',
  'ff000003-0000-0000-0000-000000000000','ff000004-0000-0000-0000-000000000000',
  'ff000005-0000-0000-0000-000000000000','ff000006-0000-0000-0000-000000000000',
  'ff000007-0000-0000-0000-000000000000','ff000008-0000-0000-0000-000000000000',
  'ff000009-0000-0000-0000-000000000000','ff000010-0000-0000-0000-000000000000',
  'ff000011-0000-0000-0000-000000000000','ff000012-0000-0000-0000-000000000000',
  'ff000013-0000-0000-0000-000000000000','ff000014-0000-0000-0000-000000000000',
  'ff000015-0000-0000-0000-000000000000','ff000016-0000-0000-0000-000000000000',
  'ff000017-0000-0000-0000-000000000000','ff000018-0000-0000-0000-000000000000',
  'ff000019-0000-0000-0000-000000000000','ff000020-0000-0000-0000-000000000000',
  'ff000021-0000-0000-0000-000000000000','ff000022-0000-0000-0000-000000000000',
  'ff000023-0000-0000-0000-000000000000','ff000024-0000-0000-0000-000000000000',
  'ff000025-0000-0000-0000-000000000000','ff000026-0000-0000-0000-000000000000',
  'ff000027-0000-0000-0000-000000000000','ff000028-0000-0000-0000-000000000000',
  'ff000029-0000-0000-0000-000000000000','ff000030-0000-0000-0000-000000000000'
);
DELETE FROM addresses WHERE id IN (
  'ee000001-0000-0000-0000-000000000000','ee000002-0000-0000-0000-000000000000',
  'ee000003-0000-0000-0000-000000000000','ee000004-0000-0000-0000-000000000000',
  'ee000005-0000-0000-0000-000000000000','ee000006-0000-0000-0000-000000000000',
  'ee000007-0000-0000-0000-000000000000','ee000008-0000-0000-0000-000000000000'
);
DELETE FROM users WHERE id IN (
  'dd000001-0000-0000-0000-000000000000','dd000002-0000-0000-0000-000000000000',
  'dd000003-0000-0000-0000-000000000000','dd000004-0000-0000-0000-000000000000',
  'dd000005-0000-0000-0000-000000000000','dd000006-0000-0000-0000-000000000000',
  'dd000007-0000-0000-0000-000000000000','dd000008-0000-0000-0000-000000000000'
);
DELETE FROM product_variants WHERE product_id IN (
  'bb000001-0000-0000-0000-000000000000','bb000002-0000-0000-0000-000000000000',
  'bb000003-0000-0000-0000-000000000000','bb000004-0000-0000-0000-000000000000',
  'bb000005-0000-0000-0000-000000000000','bb000006-0000-0000-0000-000000000000',
  'bb000007-0000-0000-0000-000000000000','bb000008-0000-0000-0000-000000000000',
  'bb000009-0000-0000-0000-000000000000','bb000010-0000-0000-0000-000000000000',
  'bb000011-0000-0000-0000-000000000000','bb000012-0000-0000-0000-000000000000'
);
DELETE FROM product_images WHERE product_id IN (
  'bb000001-0000-0000-0000-000000000000','bb000002-0000-0000-0000-000000000000',
  'bb000003-0000-0000-0000-000000000000','bb000004-0000-0000-0000-000000000000',
  'bb000005-0000-0000-0000-000000000000','bb000006-0000-0000-0000-000000000000',
  'bb000007-0000-0000-0000-000000000000','bb000008-0000-0000-0000-000000000000',
  'bb000009-0000-0000-0000-000000000000','bb000010-0000-0000-0000-000000000000',
  'bb000011-0000-0000-0000-000000000000','bb000012-0000-0000-0000-000000000000'
);
DELETE FROM products WHERE id IN (
  'bb000001-0000-0000-0000-000000000000','bb000002-0000-0000-0000-000000000000',
  'bb000003-0000-0000-0000-000000000000','bb000004-0000-0000-0000-000000000000',
  'bb000005-0000-0000-0000-000000000000','bb000006-0000-0000-0000-000000000000',
  'bb000007-0000-0000-0000-000000000000','bb000008-0000-0000-0000-000000000000',
  'bb000009-0000-0000-0000-000000000000','bb000010-0000-0000-0000-000000000000',
  'bb000011-0000-0000-0000-000000000000','bb000012-0000-0000-0000-000000000000'
);
DELETE FROM categories WHERE id IN (
  'aa000001-0000-0000-0000-000000000000','aa000002-0000-0000-0000-000000000000',
  'aa000003-0000-0000-0000-000000000000','aa000004-0000-0000-0000-000000000000',
  'aa000005-0000-0000-0000-000000000000','aa000006-0000-0000-0000-000000000000'
);

-- ============================================
-- PART 1: CATEGORIES
-- Slugs phải khớp với mockData.ts frontend
-- ============================================
INSERT INTO categories (id, name, slug, icon_url, sort_order, is_active, is_deleted) VALUES
  ('aa000001-0000-0000-0000-000000000000','Áo Thun',  'ao-thun',  '/images/categories/ao-thun.png',  1, true, false),
  ('aa000002-0000-0000-0000-000000000000','Áo Sơ Mi', 'ao-so-mi', '/images/categories/ao-so-mi.png', 2, true, false),
  ('aa000003-0000-0000-0000-000000000000','Quần',      'quan',     '/images/categories/quan.png',      3, true, false),
  ('aa000004-0000-0000-0000-000000000000','Váy Đầm',  'vay-dam',  '/images/categories/vay-dam.png',   4, true, false),
  ('aa000005-0000-0000-0000-000000000000','Áo Khoác', 'ao-khoac', '/images/categories/ao-khoac.png',  5, true, false),
  ('aa000006-0000-0000-0000-000000000000','Phụ Kiện', 'phu-kien', '/images/categories/phu-kien.png',  6, true, false);

-- ============================================
-- PART 2: CUSTOMERS (8)
-- Password: Customer@123
-- ============================================
INSERT INTO users (id, email, phone, password_hash, full_name, role, email_verified, is_active, is_deleted, created_at) VALUES
  ('dd000001-0000-0000-0000-000000000000','nguyen.thi.lan@gmail.com', '0901234501',
   '$2b$12$co2P.Qe/XV4XUHL.pyNhau9JdBZ1Lqx9rR2YF.EprwkQNS6/6Rgzu',
   'Nguyễn Thị Lan','customer',true,true,false,'2026-04-17T10:00:00+07:00'),
  ('dd000002-0000-0000-0000-000000000000','tran.minh.tuan@gmail.com','0912345602',
   '$2b$12$co2P.Qe/XV4XUHL.pyNhau9JdBZ1Lqx9rR2YF.EprwkQNS6/6Rgzu',
   'Trần Minh Tuấn','customer',true,true,false,'2026-04-22T14:30:00+07:00'),
  ('dd000003-0000-0000-0000-000000000000','le.thi.hoa@gmail.com','0923456703',
   '$2b$12$co2P.Qe/XV4XUHL.pyNhau9JdBZ1Lqx9rR2YF.EprwkQNS6/6Rgzu',
   'Lê Thị Hoa','customer',true,true,false,'2026-04-27T09:15:00+07:00'),
  ('dd000004-0000-0000-0000-000000000000','pham.quoc.bao@gmail.com','0934567804',
   '$2b$12$co2P.Qe/XV4XUHL.pyNhau9JdBZ1Lqx9rR2YF.EprwkQNS6/6Rgzu',
   'Phạm Quốc Bảo','customer',true,true,false,'2026-04-29T11:00:00+07:00'),
  ('dd000005-0000-0000-0000-000000000000','hoang.thu.linh@gmail.com','0945678905',
   '$2b$12$co2P.Qe/XV4XUHL.pyNhau9JdBZ1Lqx9rR2YF.EprwkQNS6/6Rgzu',
   'Hoàng Thu Linh','customer',true,true,false,'2026-05-02T08:00:00+07:00'),
  ('dd000006-0000-0000-0000-000000000000','vu.thanh.nam@gmail.com','0956789006',
   '$2b$12$co2P.Qe/XV4XUHL.pyNhau9JdBZ1Lqx9rR2YF.EprwkQNS6/6Rgzu',
   'Vũ Thanh Nam','customer',true,true,false,'2026-05-08T13:00:00+07:00'),
  ('dd000007-0000-0000-0000-000000000000','dang.thi.mai@gmail.com','0967890107',
   '$2b$12$co2P.Qe/XV4XUHL.pyNhau9JdBZ1Lqx9rR2YF.EprwkQNS6/6Rgzu',
   'Đặng Thị Mai','customer',true,true,false,'2026-05-10T09:00:00+07:00'),
  ('dd000008-0000-0000-0000-000000000000','bui.van.khanh@gmail.com','0978901208',
   '$2b$12$co2P.Qe/XV4XUHL.pyNhau9JdBZ1Lqx9rR2YF.EprwkQNS6/6Rgzu',
   'Bùi Văn Khánh','customer',true,true,false,'2026-05-12T10:00:00+07:00');

-- ============================================
-- PART 3: ADDRESSES (1 per customer)
-- ============================================
INSERT INTO addresses (id, user_id, full_name, phone, province, district, ward, street_address, is_default, is_deleted) VALUES
  ('ee000001-0000-0000-0000-000000000000','dd000001-0000-0000-0000-000000000000',
   'Nguyễn Thị Lan','0901234501','TP. Hồ Chí Minh','Quận 1','Phường Bến Nghé','12 Đường Lê Lợi',true,false),
  ('ee000002-0000-0000-0000-000000000000','dd000002-0000-0000-0000-000000000000',
   'Trần Minh Tuấn','0912345602','TP. Hồ Chí Minh','Quận 3','Phường 7','45 Nguyễn Thị Minh Khai',true,false),
  ('ee000003-0000-0000-0000-000000000000','dd000003-0000-0000-0000-000000000000',
   'Lê Thị Hoa','0923456703','Hà Nội','Quận Đống Đa','Phường Láng Hạ','78 Đường Láng',true,false),
  ('ee000004-0000-0000-0000-000000000000','dd000004-0000-0000-0000-000000000000',
   'Phạm Quốc Bảo','0934567804','TP. Hồ Chí Minh','Quận Bình Thạnh','Phường 25','23 Đinh Bộ Lĩnh',true,false),
  ('ee000005-0000-0000-0000-000000000000','dd000005-0000-0000-0000-000000000000',
   'Hoàng Thu Linh','0945678905','Đà Nẵng','Quận Hải Châu','Phường Thạch Thang','56 Phan Châu Trinh',true,false),
  ('ee000006-0000-0000-0000-000000000000','dd000006-0000-0000-0000-000000000000',
   'Vũ Thanh Nam','0956789006','TP. Hồ Chí Minh','Quận 7','Phường Tân Phú','89 Nguyễn Thị Thập',true,false),
  ('ee000007-0000-0000-0000-000000000000','dd000007-0000-0000-0000-000000000000',
   'Đặng Thị Mai','0967890107','Hà Nội','Quận Cầu Giấy','Phường Dịch Vọng','34 Trần Thái Tông',true,false),
  ('ee000008-0000-0000-0000-000000000000','dd000008-0000-0000-0000-000000000000',
   'Bùi Văn Khánh','0978901208','TP. Hồ Chí Minh','Quận 10','Phường 12','67 Tô Hiến Thành',true,false);

-- ============================================
-- PART 4: PRODUCTS (12)
-- Slugs, tên, hình ảnh khớp với mockData.ts
-- ============================================
INSERT INTO products (id, category_id, name, slug, description, base_price, sale_price, discount_percent,
  badge, sold_count, avg_rating, review_count, sku_prefix, material, is_featured, is_active, is_deleted) VALUES
  -- Áo Thun (aa000001)
  ('bb000001-0000-0000-0000-000000000000','aa000001-0000-0000-0000-000000000000',
   'Áo Polo Pique','ao-polo-pique','Áo polo pique thoáng mát, thiết kế basic.',
   290000,NULL,NULL,'new',3189,4.7,89,'POLO','100% Cotton Pique',true,true,false),
  ('bb000002-0000-0000-0000-000000000000','aa000001-0000-0000-0000-000000000000',
   'Áo Thun Minimal','ao-thun-minimal','Áo thun minimal thiết kế tối giản, chất liệu cao cấp.',
   720000,NULL,NULL,NULL,4338,4.8,126,'TMIN','100% Cotton Combed',true,true,false),
  ('bb000006-0000-0000-0000-000000000000','aa000001-0000-0000-0000-000000000000',
   'Áo Thun Oversize','ao-thun-oversize','Áo thun oversize streetwear trẻ trung.',
   320000,NULL,NULL,NULL,3612,4.5,98,'TOVS','Cotton 180gsm',false,true,false),
  -- Áo Sơ Mi (aa000002)
  ('bb000005-0000-0000-0000-000000000000','aa000002-0000-0000-0000-000000000000',
   'Áo Sơ Mi Linen','ao-so-mi-linen','Áo sơ mi linen cao cấp, mỏng nhẹ thoáng mát.',
   590000,NULL,NULL,'new',4512,4.8,142,'SOMI','Linen 100%',true,true,false),
  -- Quần (aa000003)
  ('bb000004-0000-0000-0000-000000000000','aa000003-0000-0000-0000-000000000000',
   'Quần Chinos Basic','quan-chinos-basic','Quần chinos dáng cơ bản, dễ phối đồ.',
   690000,NULL,NULL,NULL,104,4.6,28,'CHIN','Cotton Chino 97%',true,true,false),
  ('bb000011-0000-0000-0000-000000000000','aa000003-0000-0000-0000-000000000000',
   'Quần Tây Ống Sương','quan-tay-ong-suong','Quần tây ống sương lịch lãm, phù hợp công sở.',
   790000,NULL,NULL,NULL,3244,4.7,87,'QTAY','Polyester Blend',true,true,false),
  -- Váy Đầm (aa000004)
  ('bb000003-0000-0000-0000-000000000000','aa000004-0000-0000-0000-000000000000',
   'Váy Linen Tay Phồng','vay-linen-tay-phong','Váy linen mềm mại, tay phồng thanh lịch.',
   900000,720000,20,'sale',782,4.6,56,'VLIN','Linen 100%',true,true,false),
  ('bb000007-0000-0000-0000-000000000000','aa000004-0000-0000-0000-000000000000',
   'Váy Midi Dây Lưng','vay-midi-day-lung','Váy midi kèm dây lưng tôn dáng, thanh lịch.',
   750000,NULL,NULL,NULL,4062,4.8,118,'VMID','Viscose 95%',true,true,false),
  -- Áo Khoác (aa000005)
  ('bb000008-0000-0000-0000-000000000000','aa000005-0000-0000-0000-000000000000',
   'Áo Khoác Shirt Jacket','ao-khoac-shirt-jacket','Áo khoác dáng shirt jacket thời trang, đa năng.',
   890000,NULL,NULL,'new',3689,4.9,104,'KJKT','Cotton Canvas',true,true,false),
  -- Phụ Kiện (aa000006)
  ('bb000009-0000-0000-0000-000000000000','aa000006-0000-0000-0000-000000000000',
   'Nón Classic Logo','non-classic-logo','Nón lưỡi trai cổ điển, logo thêu tinh tế.',
   290000,NULL,NULL,NULL,2107,4.5,63,'NON','Cotton Twill',false,true,false),
  ('bb000010-0000-0000-0000-000000000000','aa000006-0000-0000-0000-000000000000',
   'Túi Tote Minimal','tui-tote-minimal','Túi tote thiết kế basic, canvas dày dặn.',
   490000,NULL,NULL,'new',2107,4.6,71,'TOTE','Canvas 12oz',false,true,false),
  ('bb000012-0000-0000-0000-000000000000','aa000006-0000-0000-0000-000000000000',
   'Thắt Lưng Da Basic','that-lung-da-basic','Thắt lưng da phong cách tối giản.',
   390000,NULL,NULL,NULL,224,4.4,19,'TLUNG','Genuine Leather',false,true,false);

-- ============================================
-- PART 5: PRODUCT IMAGES
-- Dùng đúng ảnh từ mockData.ts
-- ============================================
INSERT INTO product_images (product_id, image_url, alt_text, sort_order, is_primary) VALUES
  ('bb000001-0000-0000-0000-000000000000','/images/products/product-6.png','Áo Polo Pique',0,true),
  ('bb000002-0000-0000-0000-000000000000','/images/products/product-2.png','Áo Thun Minimal',0,true),
  ('bb000006-0000-0000-0000-000000000000','/images/products/product-2.png','Áo Thun Oversize',0,true),
  ('bb000005-0000-0000-0000-000000000000','/images/products/product-1.png','Áo Sơ Mi Linen',0,true),
  ('bb000004-0000-0000-0000-000000000000','/images/products/product-3.png','Quần Chinos Basic',0,true),
  ('bb000011-0000-0000-0000-000000000000','/images/products/product-3.png','Quần Tây Ống Sương',0,true),
  ('bb000003-0000-0000-0000-000000000000','/images/products/product-4.png','Váy Linen Tay Phồng',0,true),
  ('bb000007-0000-0000-0000-000000000000','/images/products/product-4.png','Váy Midi Dây Lưng',0,true),
  ('bb000008-0000-0000-0000-000000000000','/images/products/product-5.png','Áo Khoác Shirt Jacket',0,true),
  ('bb000009-0000-0000-0000-000000000000','/images/products/product-6.png','Nón Classic Logo',0,true),
  ('bb000010-0000-0000-0000-000000000000','/images/products/product-3.png','Túi Tote Minimal',0,true),
  ('bb000012-0000-0000-0000-000000000000','/images/products/product-1.png','Thắt Lưng Da Basic',0,true);

-- ============================================
-- PART 6: PRODUCT VARIANTS (59 variants)
-- size ENUM: 'XS','S','M','L','XL','XXL','FREE'
-- ============================================

-- Áo Polo Pique (bb000001, 290000) — 6 variants
INSERT INTO product_variants (id, product_id, size, color_name, color_hex, sku, stock_quantity, additional_price, is_active, is_deleted) VALUES
  ('cc000001-0000-0000-0000-000000000000','bb000001-0000-0000-0000-000000000000','S','Đen','#000000','POLO-BLK-S',50,0,true,false),
  ('cc000002-0000-0000-0000-000000000000','bb000001-0000-0000-0000-000000000000','M','Đen','#000000','POLO-BLK-M',45,0,true,false),
  ('cc000003-0000-0000-0000-000000000000','bb000001-0000-0000-0000-000000000000','L','Đen','#000000','POLO-BLK-L',30,0,true,false),
  ('cc000004-0000-0000-0000-000000000000','bb000001-0000-0000-0000-000000000000','M','Trắng','#ffffff','POLO-WHT-M',40,0,true,false),
  ('cc000005-0000-0000-0000-000000000000','bb000001-0000-0000-0000-000000000000','L','Trắng','#ffffff','POLO-WHT-L',35,0,true,false),
  ('cc000006-0000-0000-0000-000000000000','bb000001-0000-0000-0000-000000000000','M','Be','#f5f5dc','POLO-BEI-M',28,0,true,false);

-- Áo Thun Minimal (bb000002, 720000) — 6 variants
INSERT INTO product_variants (id, product_id, size, color_name, color_hex, sku, stock_quantity, additional_price, is_active, is_deleted) VALUES
  ('cc000007-0000-0000-0000-000000000000','bb000002-0000-0000-0000-000000000000','S','Đen','#000000','TMIN-BLK-S',30,0,true,false),
  ('cc000008-0000-0000-0000-000000000000','bb000002-0000-0000-0000-000000000000','M','Đen','#000000','TMIN-BLK-M',35,0,true,false),
  ('cc000009-0000-0000-0000-000000000000','bb000002-0000-0000-0000-000000000000','L','Đen','#000000','TMIN-BLK-L',25,0,true,false),
  ('cc000010-0000-0000-0000-000000000000','bb000002-0000-0000-0000-000000000000','S','Trắng','#ffffff','TMIN-WHT-S',25,0,true,false),
  ('cc000011-0000-0000-0000-000000000000','bb000002-0000-0000-0000-000000000000','M','Trắng','#ffffff','TMIN-WHT-M',30,0,true,false),
  ('cc000012-0000-0000-0000-000000000000','bb000002-0000-0000-0000-000000000000','M','Xám','#808080','TMIN-GRY-M',20,0,true,false);

-- Váy Linen Tay Phồng (bb000003, base 900000 / sale 720000) — 5 variants
INSERT INTO product_variants (id, product_id, size, color_name, color_hex, sku, stock_quantity, additional_price, is_active, is_deleted) VALUES
  ('cc000013-0000-0000-0000-000000000000','bb000003-0000-0000-0000-000000000000','S','Be','#f5f5dc','VLIN-BEI-S',20,0,true,false),
  ('cc000014-0000-0000-0000-000000000000','bb000003-0000-0000-0000-000000000000','M','Be','#f5f5dc','VLIN-BEI-M',25,0,true,false),
  ('cc000015-0000-0000-0000-000000000000','bb000003-0000-0000-0000-000000000000','L','Be','#f5f5dc','VLIN-BEI-L',15,0,true,false),
  ('cc000016-0000-0000-0000-000000000000','bb000003-0000-0000-0000-000000000000','S','Trắng','#ffffff','VLIN-WHT-S',18,0,true,false),
  ('cc000017-0000-0000-0000-000000000000','bb000003-0000-0000-0000-000000000000','M','Trắng','#ffffff','VLIN-WHT-M',22,0,true,false);

-- Quần Chinos Basic (bb000004, 690000) — 6 variants
INSERT INTO product_variants (id, product_id, size, color_name, color_hex, sku, stock_quantity, additional_price, is_active, is_deleted) VALUES
  ('cc000018-0000-0000-0000-000000000000','bb000004-0000-0000-0000-000000000000','S','Be','#f5f5dc','CHIN-BEI-S',25,0,true,false),
  ('cc000019-0000-0000-0000-000000000000','bb000004-0000-0000-0000-000000000000','M','Be','#f5f5dc','CHIN-BEI-M',30,0,true,false),
  ('cc000020-0000-0000-0000-000000000000','bb000004-0000-0000-0000-000000000000','L','Be','#f5f5dc','CHIN-BEI-L',20,0,true,false),
  ('cc000021-0000-0000-0000-000000000000','bb000004-0000-0000-0000-000000000000','S','Đen','#000000','CHIN-BLK-S',20,0,true,false),
  ('cc000022-0000-0000-0000-000000000000','bb000004-0000-0000-0000-000000000000','M','Đen','#000000','CHIN-BLK-M',25,0,true,false),
  ('cc000023-0000-0000-0000-000000000000','bb000004-0000-0000-0000-000000000000','S','Nâu','#8b4513','CHIN-BRN-S',18,0,true,false);

-- Áo Sơ Mi Linen (bb000005, 590000) — 6 variants
INSERT INTO product_variants (id, product_id, size, color_name, color_hex, sku, stock_quantity, additional_price, is_active, is_deleted) VALUES
  ('cc000024-0000-0000-0000-000000000000','bb000005-0000-0000-0000-000000000000','S','Trắng','#ffffff','SOMI-WHT-S',35,0,true,false),
  ('cc000025-0000-0000-0000-000000000000','bb000005-0000-0000-0000-000000000000','M','Trắng','#ffffff','SOMI-WHT-M',40,0,true,false),
  ('cc000026-0000-0000-0000-000000000000','bb000005-0000-0000-0000-000000000000','L','Trắng','#ffffff','SOMI-WHT-L',28,0,true,false),
  ('cc000027-0000-0000-0000-000000000000','bb000005-0000-0000-0000-000000000000','S','Be','#f5f5dc','SOMI-BEI-S',30,0,true,false),
  ('cc000028-0000-0000-0000-000000000000','bb000005-0000-0000-0000-000000000000','M','Be','#f5f5dc','SOMI-BEI-M',35,0,true,false),
  ('cc000029-0000-0000-0000-000000000000','bb000005-0000-0000-0000-000000000000','M','Xám','#808080','SOMI-GRY-M',22,0,true,false);

-- Áo Thun Oversize (bb000006, 320000) — 6 variants
INSERT INTO product_variants (id, product_id, size, color_name, color_hex, sku, stock_quantity, additional_price, is_active, is_deleted) VALUES
  ('cc000030-0000-0000-0000-000000000000','bb000006-0000-0000-0000-000000000000','S','Đen','#000000','TOVS-BLK-S',40,0,true,false),
  ('cc000031-0000-0000-0000-000000000000','bb000006-0000-0000-0000-000000000000','M','Đen','#000000','TOVS-BLK-M',50,0,true,false),
  ('cc000032-0000-0000-0000-000000000000','bb000006-0000-0000-0000-000000000000','L','Đen','#000000','TOVS-BLK-L',35,0,true,false),
  ('cc000033-0000-0000-0000-000000000000','bb000006-0000-0000-0000-000000000000','XL','Đen','#000000','TOVS-BLK-XL',25,0,true,false),
  ('cc000034-0000-0000-0000-000000000000','bb000006-0000-0000-0000-000000000000','M','Trắng','#ffffff','TOVS-WHT-M',45,0,true,false),
  ('cc000035-0000-0000-0000-000000000000','bb000006-0000-0000-0000-000000000000','M','Nâu','#8b4513','TOVS-BRN-M',30,0,true,false);

-- Váy Midi Dây Lưng (bb000007, 750000) — 5 variants
INSERT INTO product_variants (id, product_id, size, color_name, color_hex, sku, stock_quantity, additional_price, is_active, is_deleted) VALUES
  ('cc000036-0000-0000-0000-000000000000','bb000007-0000-0000-0000-000000000000','S','Đen','#000000','VMID-BLK-S',20,0,true,false),
  ('cc000037-0000-0000-0000-000000000000','bb000007-0000-0000-0000-000000000000','M','Đen','#000000','VMID-BLK-M',25,0,true,false),
  ('cc000038-0000-0000-0000-000000000000','bb000007-0000-0000-0000-000000000000','L','Đen','#000000','VMID-BLK-L',15,0,true,false),
  ('cc000039-0000-0000-0000-000000000000','bb000007-0000-0000-0000-000000000000','S','Be','#f5f5dc','VMID-BEI-S',18,0,true,false),
  ('cc000040-0000-0000-0000-000000000000','bb000007-0000-0000-0000-000000000000','M','Be','#f5f5dc','VMID-BEI-M',22,0,true,false);

-- Áo Khoác Shirt Jacket (bb000008, 890000) — 6 variants
INSERT INTO product_variants (id, product_id, size, color_name, color_hex, sku, stock_quantity, additional_price, is_active, is_deleted) VALUES
  ('cc000041-0000-0000-0000-000000000000','bb000008-0000-0000-0000-000000000000','S','Xám','#808080','KJKT-GRY-S',15,0,true,false),
  ('cc000042-0000-0000-0000-000000000000','bb000008-0000-0000-0000-000000000000','M','Xám','#808080','KJKT-GRY-M',20,0,true,false),
  ('cc000043-0000-0000-0000-000000000000','bb000008-0000-0000-0000-000000000000','L','Xám','#808080','KJKT-GRY-L',15,0,true,false),
  ('cc000044-0000-0000-0000-000000000000','bb000008-0000-0000-0000-000000000000','XL','Xám','#808080','KJKT-GRY-XL',10,0,true,false),
  ('cc000045-0000-0000-0000-000000000000','bb000008-0000-0000-0000-000000000000','M','Đen','#000000','KJKT-BLK-M',18,0,true,false),
  ('cc000046-0000-0000-0000-000000000000','bb000008-0000-0000-0000-000000000000','L','Đen','#000000','KJKT-BLK-L',12,0,true,false);

-- Nón Classic Logo (bb000009, 290000) — 3 variants (FREE size)
INSERT INTO product_variants (id, product_id, size, color_name, color_hex, sku, stock_quantity, additional_price, is_active, is_deleted) VALUES
  ('cc000047-0000-0000-0000-000000000000','bb000009-0000-0000-0000-000000000000','FREE','Đen','#000000','NON-BLK-FREE',60,0,true,false),
  ('cc000048-0000-0000-0000-000000000000','bb000009-0000-0000-0000-000000000000','FREE','Trắng','#ffffff','NON-WHT-FREE',50,0,true,false),
  ('cc000049-0000-0000-0000-000000000000','bb000009-0000-0000-0000-000000000000','FREE','Nâu','#8b4513','NON-BRN-FREE',40,0,true,false);

-- Túi Tote Minimal (bb000010, 490000) — 2 variants
INSERT INTO product_variants (id, product_id, size, color_name, color_hex, sku, stock_quantity, additional_price, is_active, is_deleted) VALUES
  ('cc000050-0000-0000-0000-000000000000','bb000010-0000-0000-0000-000000000000','FREE','Trắng','#ffffff','TOTE-WHT-FREE',45,0,true,false),
  ('cc000051-0000-0000-0000-000000000000','bb000010-0000-0000-0000-000000000000','FREE','Đen','#000000','TOTE-BLK-FREE',40,0,true,false);

-- Quần Tây Ống Sương (bb000011, 790000) — 6 variants
INSERT INTO product_variants (id, product_id, size, color_name, color_hex, sku, stock_quantity, additional_price, is_active, is_deleted) VALUES
  ('cc000052-0000-0000-0000-000000000000','bb000011-0000-0000-0000-000000000000','S','Đen','#000000','QTAY-BLK-S',25,0,true,false),
  ('cc000053-0000-0000-0000-000000000000','bb000011-0000-0000-0000-000000000000','M','Đen','#000000','QTAY-BLK-M',30,0,true,false),
  ('cc000054-0000-0000-0000-000000000000','bb000011-0000-0000-0000-000000000000','L','Đen','#000000','QTAY-BLK-L',20,0,true,false),
  ('cc000055-0000-0000-0000-000000000000','bb000011-0000-0000-0000-000000000000','S','Xám','#808080','QTAY-GRY-S',20,0,true,false),
  ('cc000056-0000-0000-0000-000000000000','bb000011-0000-0000-0000-000000000000','M','Xám','#808080','QTAY-GRY-M',25,0,true,false),
  ('cc000057-0000-0000-0000-000000000000','bb000011-0000-0000-0000-000000000000','M','Nâu','#8b4513','QTAY-BRN-M',18,0,true,false);

-- Thắt Lưng Da Basic (bb000012, 390000) — 2 variants
INSERT INTO product_variants (id, product_id, size, color_name, color_hex, sku, stock_quantity, additional_price, is_active, is_deleted) VALUES
  ('cc000058-0000-0000-0000-000000000000','bb000012-0000-0000-0000-000000000000','FREE','Đen','#000000','TLUNG-BLK-FREE',55,0,true,false),
  ('cc000059-0000-0000-0000-000000000000','bb000012-0000-0000-0000-000000000000','FREE','Nâu','#8b4513','TLUNG-BRN-FREE',45,0,true,false);

-- ============================================
-- PART 7: ORDERS (30 đơn hàng)
-- Timestamps dùng +07:00 (Vietnam)
-- Dashboard coverage:
--   Hôm nay (05/17): orders 001-005  → revenue 3,930,000
--   Hôm qua (05/16): orders 006-009  → revenue 3,900,000
--   05/15: orders 010-012 → 2,540,000
--   05/14: orders 013-015 → 2,220,000
--   05/13: orders 016-017 → 1,930,000
--   05/12: orders 018-020 → 3,150,000
--   05/11: không có đơn   → 0
-- ============================================
INSERT INTO orders (id, order_number, user_id, address_id,
  subtotal, discount_amount, shipping_fee, total_amount,
  status, payment_method, payment_status,
  shipping_name, shipping_phone, shipping_address,
  is_deleted, created_at) VALUES

-- ─── HÔM NAY (05/17) ────────────────────────
('ff000001-0000-0000-0000-000000000000','LEV-20260517-0001',
 'dd000001-0000-0000-0000-000000000000','ee000001-0000-0000-0000-000000000000',
 580000,0,0,580000,
 'pending_payment','bank_transfer','pending',
 'Nguyễn Thị Lan','0901234501',
 '12 Đường Lê Lợi, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
 false,'2026-05-17T10:23:00+07:00'),

('ff000002-0000-0000-0000-000000000000','LEV-20260517-0002',
 'dd000002-0000-0000-0000-000000000000','ee000002-0000-0000-0000-000000000000',
 1310000,0,0,1310000,
 'confirmed','cod','pending',
 'Trần Minh Tuấn','0912345602',
 '45 Nguyễn Thị Minh Khai, Phường 7, Quận 3, TP. Hồ Chí Minh',
 false,'2026-05-17T11:45:00+07:00'),

('ff000003-0000-0000-0000-000000000000','LEV-20260517-0003',
 'dd000003-0000-0000-0000-000000000000','ee000003-0000-0000-0000-000000000000',
 720000,0,0,720000,
 'pending_payment','bank_transfer','pending',
 'Lê Thị Hoa','0923456703',
 '78 Đường Láng, Phường Láng Hạ, Quận Đống Đa, Hà Nội',
 false,'2026-05-17T13:12:00+07:00'),

('ff000004-0000-0000-0000-000000000000','LEV-20260517-0004',
 'dd000004-0000-0000-0000-000000000000','ee000004-0000-0000-0000-000000000000',
 970000,0,0,970000,
 'confirmed','cod','pending',
 'Phạm Quốc Bảo','0934567804',
 '23 Đinh Bộ Lĩnh, Phường 25, Quận Bình Thạnh, TP. Hồ Chí Minh',
 false,'2026-05-17T14:30:00+07:00'),

('ff000005-0000-0000-0000-000000000000','LEV-20260517-0005',
 'dd000005-0000-0000-0000-000000000000','ee000005-0000-0000-0000-000000000000',
 320000,0,30000,350000,
 'pending_payment','cod','pending',
 'Hoàng Thu Linh','0945678905',
 '56 Phan Châu Trinh, Phường Thạch Thang, Quận Hải Châu, Đà Nẵng',
 false,'2026-05-17T16:05:00+07:00'),

-- ─── HÔM QUA (05/16) ────────────────────────
('ff000006-0000-0000-0000-000000000000','LEV-20260516-0006',
 'dd000006-0000-0000-0000-000000000000','ee000006-0000-0000-0000-000000000000',
 890000,0,0,890000,
 'confirmed','bank_transfer','paid',
 'Vũ Thanh Nam','0956789006',
 '89 Nguyễn Thị Thập, Phường Tân Phú, Quận 7, TP. Hồ Chí Minh',
 false,'2026-05-16T09:15:00+07:00'),

('ff000007-0000-0000-0000-000000000000','LEV-20260516-0007',
 'dd000007-0000-0000-0000-000000000000','ee000007-0000-0000-0000-000000000000',
 1280000,0,0,1280000,
 'processing','cod','pending',
 'Đặng Thị Mai','0967890107',
 '34 Trần Thái Tông, Phường Dịch Vọng, Quận Cầu Giấy, Hà Nội',
 false,'2026-05-16T10:30:00+07:00'),

('ff000008-0000-0000-0000-000000000000','LEV-20260516-0008',
 'dd000008-0000-0000-0000-000000000000','ee000008-0000-0000-0000-000000000000',
 750000,0,0,750000,
 'confirmed','bank_transfer','paid',
 'Bùi Văn Khánh','0978901208',
 '67 Tô Hiến Thành, Phường 12, Quận 10, TP. Hồ Chí Minh',
 false,'2026-05-16T13:45:00+07:00'),

('ff000009-0000-0000-0000-000000000000','LEV-20260516-0009',
 'dd000001-0000-0000-0000-000000000000','ee000001-0000-0000-0000-000000000000',
 980000,0,0,980000,
 'processing','cod','pending',
 'Nguyễn Thị Lan','0901234501',
 '12 Đường Lê Lợi, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
 false,'2026-05-16T15:20:00+07:00'),

-- ─── 05/15 ──────────────────────────────────
('ff000010-0000-0000-0000-000000000000','LEV-20260515-0010',
 'dd000002-0000-0000-0000-000000000000','ee000002-0000-0000-0000-000000000000',
 790000,0,0,790000,
 'processing','bank_transfer','paid',
 'Trần Minh Tuấn','0912345602',
 '45 Nguyễn Thị Minh Khai, Phường 7, Quận 3, TP. Hồ Chí Minh',
 false,'2026-05-15T08:55:00+07:00'),

('ff000011-0000-0000-0000-000000000000','LEV-20260515-0011',
 'dd000003-0000-0000-0000-000000000000','ee000003-0000-0000-0000-000000000000',
 1110000,0,0,1110000,
 'shipping','cod','pending',
 'Lê Thị Hoa','0923456703',
 '78 Đường Láng, Phường Láng Hạ, Quận Đống Đa, Hà Nội',
 false,'2026-05-15T11:30:00+07:00'),

('ff000012-0000-0000-0000-000000000000','LEV-20260515-0012',
 'dd000004-0000-0000-0000-000000000000','ee000004-0000-0000-0000-000000000000',
 640000,0,0,640000,
 'processing','bank_transfer','paid',
 'Phạm Quốc Bảo','0934567804',
 '23 Đinh Bộ Lĩnh, Phường 25, Quận Bình Thạnh, TP. Hồ Chí Minh',
 false,'2026-05-15T14:10:00+07:00'),

-- ─── 05/14 ──────────────────────────────────
('ff000013-0000-0000-0000-000000000000','LEV-20260514-0013',
 'dd000005-0000-0000-0000-000000000000','ee000005-0000-0000-0000-000000000000',
 290000,0,30000,320000,
 'shipping','cod','pending',
 'Hoàng Thu Linh','0945678905',
 '56 Phan Châu Trinh, Phường Thạch Thang, Quận Hải Châu, Đà Nẵng',
 false,'2026-05-14T09:05:00+07:00'),

('ff000014-0000-0000-0000-000000000000','LEV-20260514-0014',
 'dd000006-0000-0000-0000-000000000000','ee000006-0000-0000-0000-000000000000',
 1010000,0,0,1010000,
 'shipping','bank_transfer','paid',
 'Vũ Thanh Nam','0956789006',
 '89 Nguyễn Thị Thập, Phường Tân Phú, Quận 7, TP. Hồ Chí Minh',
 false,'2026-05-14T12:20:00+07:00'),

('ff000015-0000-0000-0000-000000000000','LEV-20260514-0015',
 'dd000007-0000-0000-0000-000000000000','ee000007-0000-0000-0000-000000000000',
 890000,0,0,890000,
 'shipping','cod','pending',
 'Đặng Thị Mai','0967890107',
 '34 Trần Thái Tông, Phường Dịch Vọng, Quận Cầu Giấy, Hà Nội',
 false,'2026-05-14T16:45:00+07:00'),

-- ─── 05/13 ──────────────────────────────────
('ff000016-0000-0000-0000-000000000000','LEV-20260513-0016',
 'dd000008-0000-0000-0000-000000000000','ee000008-0000-0000-0000-000000000000',
 690000,0,0,690000,
 'delivered','bank_transfer','paid',
 'Bùi Văn Khánh','0978901208',
 '67 Tô Hiến Thành, Phường 12, Quận 10, TP. Hồ Chí Minh',
 false,'2026-05-13T10:30:00+07:00'),

('ff000017-0000-0000-0000-000000000000','LEV-20260513-0017',
 'dd000001-0000-0000-0000-000000000000','ee000001-0000-0000-0000-000000000000',
 1240000,0,0,1240000,
 'delivered','cod','paid',
 'Nguyễn Thị Lan','0901234501',
 '12 Đường Lê Lợi, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
 false,'2026-05-13T14:00:00+07:00'),

-- ─── 05/12 ──────────────────────────────────
('ff000018-0000-0000-0000-000000000000','LEV-20260512-0018',
 'dd000002-0000-0000-0000-000000000000','ee000002-0000-0000-0000-000000000000',
 1080000,0,0,1080000,
 'delivered','bank_transfer','paid',
 'Trần Minh Tuấn','0912345602',
 '45 Nguyễn Thị Minh Khai, Phường 7, Quận 3, TP. Hồ Chí Minh',
 false,'2026-05-12T09:30:00+07:00'),

('ff000019-0000-0000-0000-000000000000','LEV-20260512-0019',
 'dd000003-0000-0000-0000-000000000000','ee000003-0000-0000-0000-000000000000',
 1180000,0,0,1180000,
 'completed','cod','paid',
 'Lê Thị Hoa','0923456703',
 '78 Đường Láng, Phường Láng Hạ, Quận Đống Đa, Hà Nội',
 false,'2026-05-12T11:15:00+07:00'),

('ff000020-0000-0000-0000-000000000000','LEV-20260512-0020',
 'dd000004-0000-0000-0000-000000000000','ee000004-0000-0000-0000-000000000000',
 890000,0,0,890000,
 'completed','bank_transfer','paid',
 'Phạm Quốc Bảo','0934567804',
 '23 Đinh Bộ Lĩnh, Phường 25, Quận Bình Thạnh, TP. Hồ Chí Minh',
 false,'2026-05-12T15:20:00+07:00'),

-- ─── 05/10 ──────────────────────────────────
('ff000021-0000-0000-0000-000000000000','LEV-20260510-0021',
 'dd000005-0000-0000-0000-000000000000','ee000005-0000-0000-0000-000000000000',
 1410000,0,0,1410000,
 'completed','bank_transfer','paid',
 'Hoàng Thu Linh','0945678905',
 '56 Phan Châu Trinh, Phường Thạch Thang, Quận Hải Châu, Đà Nẵng',
 false,'2026-05-10T08:40:00+07:00'),

('ff000022-0000-0000-0000-000000000000','LEV-20260510-0022',
 'dd000006-0000-0000-0000-000000000000','ee000006-0000-0000-0000-000000000000',
 750000,0,0,750000,
 'completed','cod','paid',
 'Vũ Thanh Nam','0956789006',
 '89 Nguyễn Thị Thập, Phường Tân Phú, Quận 7, TP. Hồ Chí Minh',
 false,'2026-05-10T13:00:00+07:00'),

-- ─── 05/07 ──────────────────────────────────
('ff000023-0000-0000-0000-000000000000','LEV-20260507-0023',
 'dd000007-0000-0000-0000-000000000000','ee000007-0000-0000-0000-000000000000',
 1510000,0,0,1510000,
 'completed','bank_transfer','paid',
 'Đặng Thị Mai','0967890107',
 '34 Trần Thái Tông, Phường Dịch Vọng, Quận Cầu Giấy, Hà Nội',
 false,'2026-05-07T09:20:00+07:00'),

('ff000024-0000-0000-0000-000000000000','LEV-20260507-0024',
 'dd000008-0000-0000-0000-000000000000','ee000008-0000-0000-0000-000000000000',
 870000,0,0,870000,
 'completed','cod','paid',
 'Bùi Văn Khánh','0978901208',
 '67 Tô Hiến Thành, Phường 12, Quận 10, TP. Hồ Chí Minh',
 false,'2026-05-07T14:30:00+07:00'),

-- ─── 05/03 ──────────────────────────────────
('ff000025-0000-0000-0000-000000000000','LEV-20260503-0025',
 'dd000001-0000-0000-0000-000000000000','ee000001-0000-0000-0000-000000000000',
 1310000,0,0,1310000,
 'completed','bank_transfer','paid',
 'Nguyễn Thị Lan','0901234501',
 '12 Đường Lê Lợi, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
 false,'2026-05-03T10:15:00+07:00'),

('ff000026-0000-0000-0000-000000000000','LEV-20260503-0026',
 'dd000002-0000-0000-0000-000000000000','ee000002-0000-0000-0000-000000000000',
 320000,0,30000,350000,
 'cancelled','cod','failed',
 'Trần Minh Tuấn','0912345602',
 '45 Nguyễn Thị Minh Khai, Phường 7, Quận 3, TP. Hồ Chí Minh',
 false,'2026-05-03T13:45:00+07:00'),

-- ─── 04/29 ──────────────────────────────────
('ff000027-0000-0000-0000-000000000000','LEV-20260429-0027',
 'dd000003-0000-0000-0000-000000000000','ee000003-0000-0000-0000-000000000000',
 890000,0,0,890000,
 'completed','bank_transfer','paid',
 'Lê Thị Hoa','0923456703',
 '78 Đường Láng, Phường Láng Hạ, Quận Đống Đa, Hà Nội',
 false,'2026-04-29T09:00:00+07:00'),

('ff000028-0000-0000-0000-000000000000','LEV-20260429-0028',
 'dd000004-0000-0000-0000-000000000000','ee000004-0000-0000-0000-000000000000',
 1080000,0,0,1080000,
 'completed','cod','paid',
 'Phạm Quốc Bảo','0934567804',
 '23 Đinh Bộ Lĩnh, Phường 25, Quận Bình Thạnh, TP. Hồ Chí Minh',
 false,'2026-04-29T15:20:00+07:00'),

-- ─── 04/25 ──────────────────────────────────
('ff000029-0000-0000-0000-000000000000','LEV-20260425-0029',
 'dd000005-0000-0000-0000-000000000000','ee000005-0000-0000-0000-000000000000',
 1470000,0,0,1470000,
 'completed','bank_transfer','paid',
 'Hoàng Thu Linh','0945678905',
 '56 Phan Châu Trinh, Phường Thạch Thang, Quận Hải Châu, Đà Nẵng',
 false,'2026-04-25T11:30:00+07:00'),

('ff000030-0000-0000-0000-000000000000','LEV-20260425-0030',
 'dd000006-0000-0000-0000-000000000000','ee000006-0000-0000-0000-000000000000',
 1070000,0,0,1070000,
 'completed','cod','paid',
 'Vũ Thanh Nam','0956789006',
 '89 Nguyễn Thị Thập, Phường Tân Phú, Quận 7, TP. Hồ Chí Minh',
 false,'2026-04-25T16:00:00+07:00');

-- ============================================
-- PART 8: ORDER ITEMS (43 dòng)
-- Snapshot: product_name, product_image, variant_size, variant_color
-- Tất cả unit_price = base_price (hoặc sale_price với sản phẩm giảm giá)
-- Xác minh: subtotal = SUM(total_price) cho từng đơn hàng
-- ============================================

-- Order 001 (subtotal 580000 = 2×290000)
INSERT INTO order_items (id,order_id,variant_id,product_name,product_image,variant_size,variant_color,unit_price,quantity,total_price) VALUES
('20000001-0000-0000-0000-000000000000','ff000001-0000-0000-0000-000000000000','cc000002-0000-0000-0000-000000000000',
 'Áo Polo Pique','/images/products/product-6.png','M','Đen',290000,2,580000);

-- Order 002 (subtotal 1310000 = 720000+590000)
INSERT INTO order_items (id,order_id,variant_id,product_name,product_image,variant_size,variant_color,unit_price,quantity,total_price) VALUES
('20000002-0000-0000-0000-000000000000','ff000002-0000-0000-0000-000000000000','cc000008-0000-0000-0000-000000000000',
 'Áo Thun Minimal','/images/products/product-2.png','M','Đen',720000,1,720000),
('20000003-0000-0000-0000-000000000000','ff000002-0000-0000-0000-000000000000','cc000025-0000-0000-0000-000000000000',
 'Áo Sơ Mi Linen','/images/products/product-1.png','M','Trắng',590000,1,590000);

-- Order 003 (subtotal 720000)
INSERT INTO order_items (id,order_id,variant_id,product_name,product_image,variant_size,variant_color,unit_price,quantity,total_price) VALUES
('20000004-0000-0000-0000-000000000000','ff000003-0000-0000-0000-000000000000','cc000014-0000-0000-0000-000000000000',
 'Váy Linen Tay Phồng','/images/products/product-4.png','M','Be',720000,1,720000);

-- Order 004 (subtotal 970000 = 2×290000+390000)
INSERT INTO order_items (id,order_id,variant_id,product_name,product_image,variant_size,variant_color,unit_price,quantity,total_price) VALUES
('20000005-0000-0000-0000-000000000000','ff000004-0000-0000-0000-000000000000','cc000047-0000-0000-0000-000000000000',
 'Nón Classic Logo','/images/products/product-6.png','FREE','Đen',290000,2,580000),
('20000006-0000-0000-0000-000000000000','ff000004-0000-0000-0000-000000000000','cc000058-0000-0000-0000-000000000000',
 'Thắt Lưng Da Basic','/images/products/product-1.png','FREE','Đen',390000,1,390000);

-- Order 005 (subtotal 320000)
INSERT INTO order_items (id,order_id,variant_id,product_name,product_image,variant_size,variant_color,unit_price,quantity,total_price) VALUES
('20000007-0000-0000-0000-000000000000','ff000005-0000-0000-0000-000000000000','cc000031-0000-0000-0000-000000000000',
 'Áo Thun Oversize','/images/products/product-2.png','M','Đen',320000,1,320000);

-- Order 006 (subtotal 890000)
INSERT INTO order_items (id,order_id,variant_id,product_name,product_image,variant_size,variant_color,unit_price,quantity,total_price) VALUES
('20000008-0000-0000-0000-000000000000','ff000006-0000-0000-0000-000000000000','cc000042-0000-0000-0000-000000000000',
 'Áo Khoác Shirt Jacket','/images/products/product-5.png','M','Xám',890000,1,890000);

-- Order 007 (subtotal 1280000 = 690000+590000)
INSERT INTO order_items (id,order_id,variant_id,product_name,product_image,variant_size,variant_color,unit_price,quantity,total_price) VALUES
('20000009-0000-0000-0000-000000000000','ff000007-0000-0000-0000-000000000000','cc000019-0000-0000-0000-000000000000',
 'Quần Chinos Basic','/images/products/product-3.png','M','Be',690000,1,690000),
('20000010-0000-0000-0000-000000000000','ff000007-0000-0000-0000-000000000000','cc000025-0000-0000-0000-000000000000',
 'Áo Sơ Mi Linen','/images/products/product-1.png','M','Trắng',590000,1,590000);

-- Order 008 (subtotal 750000)
INSERT INTO order_items (id,order_id,variant_id,product_name,product_image,variant_size,variant_color,unit_price,quantity,total_price) VALUES
('20000011-0000-0000-0000-000000000000','ff000008-0000-0000-0000-000000000000','cc000037-0000-0000-0000-000000000000',
 'Váy Midi Dây Lưng','/images/products/product-4.png','M','Đen',750000,1,750000);

-- Order 009 (subtotal 980000 = 2×490000)
INSERT INTO order_items (id,order_id,variant_id,product_name,product_image,variant_size,variant_color,unit_price,quantity,total_price) VALUES
('20000012-0000-0000-0000-000000000000','ff000009-0000-0000-0000-000000000000','cc000051-0000-0000-0000-000000000000',
 'Túi Tote Minimal','/images/products/product-3.png','FREE','Đen',490000,2,980000);

-- Order 010 (subtotal 790000)
INSERT INTO order_items (id,order_id,variant_id,product_name,product_image,variant_size,variant_color,unit_price,quantity,total_price) VALUES
('20000013-0000-0000-0000-000000000000','ff000010-0000-0000-0000-000000000000','cc000053-0000-0000-0000-000000000000',
 'Quần Tây Ống Sương','/images/products/product-3.png','M','Đen',790000,1,790000);

-- Order 011 (subtotal 1110000 = 720000+390000)
INSERT INTO order_items (id,order_id,variant_id,product_name,product_image,variant_size,variant_color,unit_price,quantity,total_price) VALUES
('20000014-0000-0000-0000-000000000000','ff000011-0000-0000-0000-000000000000','cc000009-0000-0000-0000-000000000000',
 'Áo Thun Minimal','/images/products/product-2.png','L','Đen',720000,1,720000),
('20000015-0000-0000-0000-000000000000','ff000011-0000-0000-0000-000000000000','cc000059-0000-0000-0000-000000000000',
 'Thắt Lưng Da Basic','/images/products/product-1.png','FREE','Nâu',390000,1,390000);

-- Order 012 (subtotal 640000 = 2×320000)
INSERT INTO order_items (id,order_id,variant_id,product_name,product_image,variant_size,variant_color,unit_price,quantity,total_price) VALUES
('20000016-0000-0000-0000-000000000000','ff000012-0000-0000-0000-000000000000','cc000034-0000-0000-0000-000000000000',
 'Áo Thun Oversize','/images/products/product-2.png','M','Trắng',320000,2,640000);

-- Order 013 (subtotal 290000)
INSERT INTO order_items (id,order_id,variant_id,product_name,product_image,variant_size,variant_color,unit_price,quantity,total_price) VALUES
('20000017-0000-0000-0000-000000000000','ff000013-0000-0000-0000-000000000000','cc000004-0000-0000-0000-000000000000',
 'Áo Polo Pique','/images/products/product-6.png','M','Trắng',290000,1,290000);

-- Order 014 (subtotal 1010000 = 720000+290000)
INSERT INTO order_items (id,order_id,variant_id,product_name,product_image,variant_size,variant_color,unit_price,quantity,total_price) VALUES
('20000018-0000-0000-0000-000000000000','ff000014-0000-0000-0000-000000000000','cc000016-0000-0000-0000-000000000000',
 'Váy Linen Tay Phồng','/images/products/product-4.png','S','Trắng',720000,1,720000),
('20000019-0000-0000-0000-000000000000','ff000014-0000-0000-0000-000000000000','cc000049-0000-0000-0000-000000000000',
 'Nón Classic Logo','/images/products/product-6.png','FREE','Nâu',290000,1,290000);

-- Order 015 (subtotal 890000)
INSERT INTO order_items (id,order_id,variant_id,product_name,product_image,variant_size,variant_color,unit_price,quantity,total_price) VALUES
('20000020-0000-0000-0000-000000000000','ff000015-0000-0000-0000-000000000000','cc000043-0000-0000-0000-000000000000',
 'Áo Khoác Shirt Jacket','/images/products/product-5.png','L','Xám',890000,1,890000);

-- Order 016 (subtotal 690000)
INSERT INTO order_items (id,order_id,variant_id,product_name,product_image,variant_size,variant_color,unit_price,quantity,total_price) VALUES
('20000021-0000-0000-0000-000000000000','ff000016-0000-0000-0000-000000000000','cc000020-0000-0000-0000-000000000000',
 'Quần Chinos Basic','/images/products/product-3.png','L','Be',690000,1,690000);

-- Order 017 (subtotal 1240000 = 750000+490000)
INSERT INTO order_items (id,order_id,variant_id,product_name,product_image,variant_size,variant_color,unit_price,quantity,total_price) VALUES
('20000022-0000-0000-0000-000000000000','ff000017-0000-0000-0000-000000000000','cc000039-0000-0000-0000-000000000000',
 'Váy Midi Dây Lưng','/images/products/product-4.png','S','Be',750000,1,750000),
('20000023-0000-0000-0000-000000000000','ff000017-0000-0000-0000-000000000000','cc000050-0000-0000-0000-000000000000',
 'Túi Tote Minimal','/images/products/product-3.png','FREE','Trắng',490000,1,490000);

-- Order 018 (subtotal 1080000 = 790000+290000)
INSERT INTO order_items (id,order_id,variant_id,product_name,product_image,variant_size,variant_color,unit_price,quantity,total_price) VALUES
('20000024-0000-0000-0000-000000000000','ff000018-0000-0000-0000-000000000000','cc000056-0000-0000-0000-000000000000',
 'Quần Tây Ống Sương','/images/products/product-3.png','M','Xám',790000,1,790000),
('20000025-0000-0000-0000-000000000000','ff000018-0000-0000-0000-000000000000','cc000001-0000-0000-0000-000000000000',
 'Áo Polo Pique','/images/products/product-6.png','S','Đen',290000,1,290000);

-- Order 019 (subtotal 1180000 = 2×590000)
INSERT INTO order_items (id,order_id,variant_id,product_name,product_image,variant_size,variant_color,unit_price,quantity,total_price) VALUES
('20000026-0000-0000-0000-000000000000','ff000019-0000-0000-0000-000000000000','cc000028-0000-0000-0000-000000000000',
 'Áo Sơ Mi Linen','/images/products/product-1.png','M','Be',590000,2,1180000);

-- Order 020 (subtotal 890000)
INSERT INTO order_items (id,order_id,variant_id,product_name,product_image,variant_size,variant_color,unit_price,quantity,total_price) VALUES
('20000027-0000-0000-0000-000000000000','ff000020-0000-0000-0000-000000000000','cc000045-0000-0000-0000-000000000000',
 'Áo Khoác Shirt Jacket','/images/products/product-5.png','M','Đen',890000,1,890000);

-- Order 021 (subtotal 1410000 = 720000+690000)
INSERT INTO order_items (id,order_id,variant_id,product_name,product_image,variant_size,variant_color,unit_price,quantity,total_price) VALUES
('20000028-0000-0000-0000-000000000000','ff000021-0000-0000-0000-000000000000','cc000007-0000-0000-0000-000000000000',
 'Áo Thun Minimal','/images/products/product-2.png','S','Đen',720000,1,720000),
('20000029-0000-0000-0000-000000000000','ff000021-0000-0000-0000-000000000000','cc000018-0000-0000-0000-000000000000',
 'Quần Chinos Basic','/images/products/product-3.png','S','Be',690000,1,690000);

-- Order 022 (subtotal 750000)
INSERT INTO order_items (id,order_id,variant_id,product_name,product_image,variant_size,variant_color,unit_price,quantity,total_price) VALUES
('20000030-0000-0000-0000-000000000000','ff000022-0000-0000-0000-000000000000','cc000036-0000-0000-0000-000000000000',
 'Váy Midi Dây Lưng','/images/products/product-4.png','S','Đen',750000,1,750000);

-- Order 023 (subtotal 1510000 = 720000+790000)
INSERT INTO order_items (id,order_id,variant_id,product_name,product_image,variant_size,variant_color,unit_price,quantity,total_price) VALUES
('20000031-0000-0000-0000-000000000000','ff000023-0000-0000-0000-000000000000','cc000010-0000-0000-0000-000000000000',
 'Áo Thun Minimal','/images/products/product-2.png','S','Trắng',720000,1,720000),
('20000032-0000-0000-0000-000000000000','ff000023-0000-0000-0000-000000000000','cc000057-0000-0000-0000-000000000000',
 'Quần Tây Ống Sương','/images/products/product-3.png','M','Nâu',790000,1,790000);

-- Order 024 (subtotal 870000 = 3×290000)
INSERT INTO order_items (id,order_id,variant_id,product_name,product_image,variant_size,variant_color,unit_price,quantity,total_price) VALUES
('20000033-0000-0000-0000-000000000000','ff000024-0000-0000-0000-000000000000','cc000048-0000-0000-0000-000000000000',
 'Nón Classic Logo','/images/products/product-6.png','FREE','Trắng',290000,3,870000);

-- Order 025 (subtotal 1310000 = 720000+590000)
INSERT INTO order_items (id,order_id,variant_id,product_name,product_image,variant_size,variant_color,unit_price,quantity,total_price) VALUES
('20000034-0000-0000-0000-000000000000','ff000025-0000-0000-0000-000000000000','cc000013-0000-0000-0000-000000000000',
 'Váy Linen Tay Phồng','/images/products/product-4.png','S','Be',720000,1,720000),
('20000035-0000-0000-0000-000000000000','ff000025-0000-0000-0000-000000000000','cc000029-0000-0000-0000-000000000000',
 'Áo Sơ Mi Linen','/images/products/product-1.png','M','Xám',590000,1,590000);

-- Order 026 (subtotal 320000, cancelled)
INSERT INTO order_items (id,order_id,variant_id,product_name,product_image,variant_size,variant_color,unit_price,quantity,total_price) VALUES
('20000036-0000-0000-0000-000000000000','ff000026-0000-0000-0000-000000000000','cc000030-0000-0000-0000-000000000000',
 'Áo Thun Oversize','/images/products/product-2.png','S','Đen',320000,1,320000);

-- Order 027 (subtotal 890000)
INSERT INTO order_items (id,order_id,variant_id,product_name,product_image,variant_size,variant_color,unit_price,quantity,total_price) VALUES
('20000037-0000-0000-0000-000000000000','ff000027-0000-0000-0000-000000000000','cc000046-0000-0000-0000-000000000000',
 'Áo Khoác Shirt Jacket','/images/products/product-5.png','L','Đen',890000,1,890000);

-- Order 028 (subtotal 1080000 = 690000+390000)
INSERT INTO order_items (id,order_id,variant_id,product_name,product_image,variant_size,variant_color,unit_price,quantity,total_price) VALUES
('20000038-0000-0000-0000-000000000000','ff000028-0000-0000-0000-000000000000','cc000023-0000-0000-0000-000000000000',
 'Quần Chinos Basic','/images/products/product-3.png','S','Nâu',690000,1,690000),
('20000039-0000-0000-0000-000000000000','ff000028-0000-0000-0000-000000000000','cc000059-0000-0000-0000-000000000000',
 'Thắt Lưng Da Basic','/images/products/product-1.png','FREE','Nâu',390000,1,390000);

-- Order 029 (subtotal 1470000 = 750000+720000)
INSERT INTO order_items (id,order_id,variant_id,product_name,product_image,variant_size,variant_color,unit_price,quantity,total_price) VALUES
('20000040-0000-0000-0000-000000000000','ff000029-0000-0000-0000-000000000000','cc000040-0000-0000-0000-000000000000',
 'Váy Midi Dây Lưng','/images/products/product-4.png','M','Be',750000,1,750000),
('20000041-0000-0000-0000-000000000000','ff000029-0000-0000-0000-000000000000','cc000012-0000-0000-0000-000000000000',
 'Áo Thun Minimal','/images/products/product-2.png','M','Xám',720000,1,720000);

-- Order 030 (subtotal 1070000 = 290000+2×390000)
INSERT INTO order_items (id,order_id,variant_id,product_name,product_image,variant_size,variant_color,unit_price,quantity,total_price) VALUES
('20000042-0000-0000-0000-000000000000','ff000030-0000-0000-0000-000000000000','cc000003-0000-0000-0000-000000000000',
 'Áo Polo Pique','/images/products/product-6.png','L','Đen',290000,1,290000),
('20000043-0000-0000-0000-000000000000','ff000030-0000-0000-0000-000000000000','cc000058-0000-0000-0000-000000000000',
 'Thắt Lưng Da Basic','/images/products/product-1.png','FREE','Đen',390000,2,780000);

COMMIT;

-- ============================================
-- DONE! Tổng kết:
--   6 categories, 12 products, 59 variants
--   8 customers, 8 addresses
--   30 orders (3 pending_payment, 27 processed)
--   43 order items
--
-- Dashboard hôm nay (05/17):
--   orders_today    = 5
--   revenue_today   = 3,930,000đ
--   orders_yesterday = 4
--   revenue_yesterday = 3,900,000đ
--   pending_orders  = 3
--   total_products  = 12
--
-- Đăng nhập test:
--   Admin     : admin@levents.vn     / Admin@123
--   Customer  : nguyen.thi.lan@gmail.com / Customer@123
-- ============================================
