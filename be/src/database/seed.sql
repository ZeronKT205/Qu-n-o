-- ============================================
-- LEVENTS E-COMMERCE — SEED DATA
-- Dữ liệu mẫu khởi tạo từ frontend mockData
-- ============================================

-- ============================================
-- CATEGORIES (từ CategoryPills)
-- ============================================
INSERT INTO categories (name, slug, icon_url, sort_order) VALUES
  ('Áo Thun',   'ao-thun',   '/images/categories/ao-thun.png',   1),
  ('Áo Sơ Mi',  'ao-so-mi',  '/images/categories/ao-so-mi.png',  2),
  ('Quần',      'quan',      '/images/categories/quan.png',      3),
  ('Váy Đầm',   'vay-dam',   '/images/categories/vay-dam.png',   4),
  ('Áo Khoác',  'ao-khoac',  '/images/categories/ao-khoac.png',  5),
  ('Phụ Kiện',  'phu-kien',  '/images/categories/phu-kien.png',  6);

-- ============================================
-- COLLECTIONS (từ CollectionShowcase)
-- ============================================
INSERT INTO collections (name, slug, description, cover_image_url, sort_order) VALUES
  ('Urban Essentials', 'urban-essentials', 'Phong cách tối giản, hiện đại',      '/images/products/product-1.png', 1),
  ('Office Chic',      'office-chic',      'Thanh lịch, tự tin nơi công sở',      '/images/products/product-6.png', 2),
  ('Beach Day',        'beach-day',        'Tươi mát, năng động ngày hè',         '/images/products/product-4.png', 3),
  ('Timeless Basics',  'timeless-basics',  'Cơ bản nhưng không nhàm chán',        '/images/products/product-2.png', 4);

-- ============================================
-- ANNOUNCEMENTS (từ AnnouncementBar)
-- ============================================
INSERT INTO announcements (icon, text, highlight, sort_order) VALUES
  ('🚚', 'Miễn phí vận chuyển', 'Cho đơn từ 499K', 1),
  ('🔄', 'Đổi trả dễ dàng',    'Trong 7 ngày',     2),
  ('📞', 'Hotline: 1900 1234',  '7 - 22h',          3);

-- ============================================
-- FAQs (từ FaqSection)
-- ============================================
INSERT INTO faqs (question, answer, sort_order) VALUES
  ('Tôi có thể đổi trả sản phẩm không?',
   'Có. Bạn có thể đổi hoặc trả sản phẩm trong vòng 7 ngày kể từ ngày nhận hàng nếu sản phẩm còn nguyên nhãn mác, chưa qua sử dụng và không thuộc danh mục sản phẩm cuối cùng (final sale). Vui lòng liên hệ đội ngũ hỗ trợ để được hướng dẫn chi tiết.',
   1),
  ('Thời gian giao hàng là bao lâu?',
   'Đối với khu vực nội thành TP.HCM và Hà Nội, đơn hàng sẽ được giao trong 1-2 ngày làm việc. Các tỉnh thành khác từ 3-5 ngày làm việc. Đơn hàng trên 499.000đ được miễn phí vận chuyển toàn quốc.',
   2),
  ('LEVENTS có những phương thức thanh toán nào?',
   'LEVENTS hỗ trợ đa dạng phương thức thanh toán: COD (thanh toán khi nhận hàng), chuyển khoản ngân hàng, ví điện tử (MoMo, ZaloPay, VNPay), và thanh toán qua thẻ tín dụng/ghi nợ (Visa, Mastercard). Mọi giao dịch đều được bảo mật tuyệt đối.',
   3),
  ('Làm thế nào để chọn size phù hợp?',
   'Mỗi sản phẩm đều có bảng size chi tiết kèm hướng dẫn đo. Bạn có thể tham khảo bảng size trên trang sản phẩm hoặc liên hệ hotline 1900 1234 để được tư vấn trực tiếp.',
   4),
  ('Tôi muốn theo dõi đơn hàng thì làm thế nào?',
   'Sau khi đặt hàng thành công, bạn sẽ nhận được email và SMS xác nhận kèm mã đơn hàng. Bạn có thể theo dõi trạng thái đơn hàng tại mục "Kiểm tra đơn hàng" trên website hoặc liên hệ hotline để được hỗ trợ.',
   5),
  ('LEVENTS có cửa hàng offline không?',
   'Có, LEVENTS hiện có hệ thống cửa hàng tại TP.HCM và Hà Nội. Bạn có thể ghé thăm trực tiếp để trải nghiệm sản phẩm.',
   6);

-- ============================================
-- BANNERS (từ PromoBanners)
-- ============================================
INSERT INTO banners (title, subtitle, cta_text, cta_link, bg_color, text_color, position, sort_order) VALUES
  ('ƯU ĐÃI 10%',      'CHO BỘ SƯU TẬP MỚI', 'EARN NOW →', '/collections/new-in', '#f5f0eb', '#18181b', 'promo', 1),
  ('SALE UP TO 50%',   'TOÀN BỘ SẢN PHẨM',    'EARN NOW →', '/sale',               '#18181b', '#fafafa', 'promo', 2),
  ('VOUCHER 100K',     'CHO ĐƠN TỪ 999K',     'EARN NOW →', '/voucher',            '#f4f4f5', '#18181b', 'promo', 3);

-- ============================================
-- SAMPLE VOUCHERS
-- ============================================
INSERT INTO vouchers (code, title, description, discount_type, discount_value, min_order_amount, max_discount_amount, usage_limit, usage_per_user, starts_at, expires_at) VALUES
  ('WELCOME10', 'Giảm 10% cho khách mới',       'Áp dụng cho đơn đầu tiên',  'percentage',   10,     200000, 100000, 1000, 1, NOW(), NOW() + INTERVAL '90 days'),
  ('LEVENTS50K', 'Giảm 50K cho đơn từ 500K',     'Không giới hạn số lần',     'fixed_amount', 50000,  500000, NULL,   NULL, 3, NOW(), NOW() + INTERVAL '30 days'),
  ('FREESHIP',  'Miễn phí ship cho đơn từ 499K', 'Free ship toàn quốc',       'fixed_amount', 30000,  499000, NULL,   5000, 5, NOW(), NOW() + INTERVAL '60 days');

-- ============================================
-- DONE! Seed data inserted.
-- ============================================
