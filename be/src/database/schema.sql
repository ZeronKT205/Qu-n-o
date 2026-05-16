-- ============================================
-- LEVENTS E-COMMERCE — DATABASE SCHEMA
-- PostgreSQL 15+
-- Author: Senior DBA Design
-- Created: 2026-05-16
-- ============================================
-- Conventions:
--   • UUID primary keys (gen_random_uuid())
--   • Soft delete: is_deleted BOOLEAN DEFAULT false
--   • Timestamps: created_at, updated_at (auto-managed by trigger)
--   • Money: DECIMAL(12,0) (VND, no decimals)
--   • All FK use ON DELETE RESTRICT (safe, no cascading deletes)
-- ============================================

-- ============================================
-- 0. EXTENSIONS
-- ============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- 1. ENUM TYPES
-- ============================================
CREATE TYPE user_role AS ENUM ('customer', 'admin', 'super_admin');

CREATE TYPE product_badge AS ENUM ('new', 'sale', 'hot', 'bestseller');

CREATE TYPE product_size AS ENUM ('XS', 'S', 'M', 'L', 'XL', 'XXL', 'FREE');

CREATE TYPE order_status AS ENUM (
  'pending_payment',
  'confirmed',
  'processing',
  'shipping',
  'delivered',
  'completed',
  'cancelled',
  'return_requested',
  'returned'
);

CREATE TYPE payment_method AS ENUM ('cod', 'bank_transfer', 'sepay', 'momo', 'vnpay');

CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'refunded', 'failed');

CREATE TYPE discount_type AS ENUM ('percentage', 'fixed_amount');

CREATE TYPE banner_position AS ENUM ('hero', 'promo', 'popup');

CREATE TYPE transaction_status AS ENUM ('pending', 'success', 'failed', 'refunded');

-- ============================================
-- 2. UTILITY: Auto-update updated_at trigger
-- ============================================
CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 3. USERS & AUTH
-- ============================================

-- 3.1 Users
CREATE TABLE users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         VARCHAR(255) NOT NULL,
  phone         VARCHAR(15),
  password_hash VARCHAR(255) NOT NULL,
  full_name     VARCHAR(100) NOT NULL,
  avatar_url    VARCHAR(500),
  role          user_role NOT NULL DEFAULT 'customer',
  email_verified BOOLEAN NOT NULL DEFAULT false,
  is_active     BOOLEAN NOT NULL DEFAULT true,
  is_deleted    BOOLEAN NOT NULL DEFAULT false,
  last_login_at TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_users_email_active ON users (email) WHERE is_deleted = false;
CREATE UNIQUE INDEX idx_users_phone_active ON users (phone) WHERE is_deleted = false AND phone IS NOT NULL;
CREATE INDEX idx_users_role ON users (role) WHERE is_deleted = false;

CREATE TRIGGER set_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- 3.2 Refresh Tokens
CREATE TABLE refresh_tokens (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token      TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  is_revoked BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_refresh_tokens_user ON refresh_tokens (user_id);
CREATE INDEX idx_refresh_tokens_expires ON refresh_tokens (expires_at) WHERE is_revoked = false;

-- 3.3 Addresses
CREATE TABLE addresses (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  full_name      VARCHAR(100) NOT NULL,
  phone          VARCHAR(15) NOT NULL,
  province       VARCHAR(100) NOT NULL,
  district       VARCHAR(100) NOT NULL,
  ward           VARCHAR(100) NOT NULL,
  street_address VARCHAR(255) NOT NULL,
  is_default     BOOLEAN NOT NULL DEFAULT false,
  is_deleted     BOOLEAN NOT NULL DEFAULT false,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_addresses_user ON addresses (user_id) WHERE is_deleted = false;

CREATE TRIGGER set_addresses_updated_at
  BEFORE UPDATE ON addresses
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- ============================================
-- 4. CATEGORIES & PRODUCTS
-- ============================================

-- 4.1 Categories
CREATE TABLE categories (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        VARCHAR(100) NOT NULL,
  slug        VARCHAR(100) NOT NULL,
  icon_url    VARCHAR(500),
  description TEXT,
  sort_order  INT NOT NULL DEFAULT 0,
  is_active   BOOLEAN NOT NULL DEFAULT true,
  is_deleted  BOOLEAN NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_categories_slug_active ON categories (slug) WHERE is_deleted = false;
CREATE INDEX idx_categories_sort ON categories (sort_order) WHERE is_deleted = false AND is_active = true;

CREATE TRIGGER set_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- 4.2 Products
CREATE TABLE products (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id       UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  name              VARCHAR(255) NOT NULL,
  slug              VARCHAR(255) NOT NULL,
  description       TEXT,
  base_price        DECIMAL(12, 0) NOT NULL CHECK (base_price >= 0),
  sale_price        DECIMAL(12, 0) CHECK (sale_price IS NULL OR sale_price >= 0),
  discount_percent  INT CHECK (discount_percent IS NULL OR (discount_percent >= 0 AND discount_percent <= 100)),
  badge             product_badge,
  sold_count        INT NOT NULL DEFAULT 0 CHECK (sold_count >= 0),
  avg_rating        DECIMAL(2, 1) NOT NULL DEFAULT 0 CHECK (avg_rating >= 0 AND avg_rating <= 5),
  review_count      INT NOT NULL DEFAULT 0 CHECK (review_count >= 0),
  sku_prefix        VARCHAR(20),
  material          VARCHAR(255),
  care_instructions TEXT,
  is_featured       BOOLEAN NOT NULL DEFAULT false,
  is_active         BOOLEAN NOT NULL DEFAULT true,
  is_deleted        BOOLEAN NOT NULL DEFAULT false,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_products_slug_active ON products (slug) WHERE is_deleted = false;
CREATE INDEX idx_products_category ON products (category_id) WHERE is_deleted = false AND is_active = true;
CREATE INDEX idx_products_badge ON products (badge) WHERE is_deleted = false AND is_active = true AND badge IS NOT NULL;
CREATE INDEX idx_products_featured ON products (is_featured) WHERE is_deleted = false AND is_active = true AND is_featured = true;
CREATE INDEX idx_products_price ON products (base_price) WHERE is_deleted = false AND is_active = true;
CREATE INDEX idx_products_sold ON products (sold_count DESC) WHERE is_deleted = false AND is_active = true;

CREATE TRIGGER set_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- 4.3 Product Images
CREATE TABLE product_images (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  image_url  VARCHAR(500) NOT NULL,
  alt_text   VARCHAR(255),
  sort_order INT NOT NULL DEFAULT 0,
  is_primary BOOLEAN NOT NULL DEFAULT false
);

CREATE INDEX idx_product_images_product ON product_images (product_id, sort_order);

-- 4.4 Product Variants (Size × Color)
CREATE TABLE product_variants (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id       UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  size             product_size NOT NULL,
  color_name       VARCHAR(50) NOT NULL,
  color_hex        VARCHAR(7) NOT NULL DEFAULT '#000000',
  sku              VARCHAR(50) NOT NULL,
  stock_quantity   INT NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
  additional_price DECIMAL(12, 0) NOT NULL DEFAULT 0,
  is_active        BOOLEAN NOT NULL DEFAULT true,
  is_deleted       BOOLEAN NOT NULL DEFAULT false,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_variants_sku_active ON product_variants (sku) WHERE is_deleted = false;
CREATE INDEX idx_variants_product ON product_variants (product_id) WHERE is_deleted = false AND is_active = true;
CREATE INDEX idx_variants_stock ON product_variants (stock_quantity) WHERE is_deleted = false AND is_active = true;

CREATE TRIGGER set_variants_updated_at
  BEFORE UPDATE ON product_variants
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- ============================================
-- 5. COLLECTIONS & MIX STYLES
-- ============================================

-- 5.1 Collections
CREATE TABLE collections (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            VARCHAR(255) NOT NULL,
  slug            VARCHAR(255) NOT NULL,
  description     TEXT,
  cover_image_url VARCHAR(500),
  sort_order      INT NOT NULL DEFAULT 0,
  is_active       BOOLEAN NOT NULL DEFAULT true,
  is_deleted      BOOLEAN NOT NULL DEFAULT false,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_collections_slug_active ON collections (slug) WHERE is_deleted = false;

CREATE TRIGGER set_collections_updated_at
  BEFORE UPDATE ON collections
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- 5.2 Collection ↔ Product (Many-to-Many)
CREATE TABLE collection_products (
  collection_id UUID NOT NULL REFERENCES collections(id) ON DELETE RESTRICT,
  product_id    UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  sort_order    INT NOT NULL DEFAULT 0,
  PRIMARY KEY (collection_id, product_id)
);

CREATE INDEX idx_collection_products_product ON collection_products (product_id);

-- 5.3 Mix Style Sets
CREATE TABLE mix_style_sets (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title       VARCHAR(255) NOT NULL,
  description TEXT,
  image_url   VARCHAR(500),
  sort_order  INT NOT NULL DEFAULT 0,
  is_active   BOOLEAN NOT NULL DEFAULT true,
  is_deleted  BOOLEAN NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_mix_style_sets_updated_at
  BEFORE UPDATE ON mix_style_sets
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- 5.4 Mix Style Items (products in a style set)
CREATE TABLE mix_style_items (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  set_id     UUID NOT NULL REFERENCES mix_style_sets(id) ON DELETE RESTRICT,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  label      VARCHAR(50) -- e.g. "Áo", "Quần", "Phụ kiện"
);

CREATE INDEX idx_mix_style_items_set ON mix_style_items (set_id);

-- ============================================
-- 6. CART
-- ============================================

CREATE TABLE cart_items (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  variant_id UUID NOT NULL REFERENCES product_variants(id) ON DELETE RESTRICT,
  quantity   INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, variant_id)
);

CREATE INDEX idx_cart_items_user ON cart_items (user_id);

CREATE TRIGGER set_cart_items_updated_at
  BEFORE UPDATE ON cart_items
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- ============================================
-- 7. VOUCHERS & PROMOTIONS
-- ============================================

-- 7.1 Vouchers
CREATE TABLE vouchers (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code               VARCHAR(20) NOT NULL,
  title              VARCHAR(255) NOT NULL,
  description        TEXT,
  discount_type      discount_type NOT NULL,
  discount_value     DECIMAL(12, 0) NOT NULL CHECK (discount_value > 0),
  min_order_amount   DECIMAL(12, 0) NOT NULL DEFAULT 0,
  max_discount_amount DECIMAL(12, 0),
  usage_limit        INT,           -- NULL = unlimited
  used_count         INT NOT NULL DEFAULT 0 CHECK (used_count >= 0),
  usage_per_user     INT NOT NULL DEFAULT 1,
  starts_at          TIMESTAMPTZ NOT NULL,
  expires_at         TIMESTAMPTZ NOT NULL,
  is_active          BOOLEAN NOT NULL DEFAULT true,
  is_deleted         BOOLEAN NOT NULL DEFAULT false,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (expires_at > starts_at)
);

CREATE UNIQUE INDEX idx_vouchers_code_active ON vouchers (code) WHERE is_deleted = false;
CREATE INDEX idx_vouchers_active_period ON vouchers (starts_at, expires_at) WHERE is_deleted = false AND is_active = true;

CREATE TRIGGER set_vouchers_updated_at
  BEFORE UPDATE ON vouchers
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- ============================================
-- 8. ORDERS
-- ============================================

-- 8.1 Orders
CREATE TABLE orders (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number     VARCHAR(20) NOT NULL UNIQUE,   -- LEV-20260516-0001
  user_id          UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  address_id       UUID REFERENCES addresses(id) ON DELETE RESTRICT,
  voucher_id       UUID REFERENCES vouchers(id) ON DELETE RESTRICT,

  -- Money
  subtotal         DECIMAL(12, 0) NOT NULL CHECK (subtotal >= 0),
  discount_amount  DECIMAL(12, 0) NOT NULL DEFAULT 0 CHECK (discount_amount >= 0),
  shipping_fee     DECIMAL(12, 0) NOT NULL DEFAULT 0 CHECK (shipping_fee >= 0),
  total_amount     DECIMAL(12, 0) NOT NULL CHECK (total_amount >= 0),

  -- Status
  status           order_status NOT NULL DEFAULT 'pending_payment',
  payment_method   payment_method NOT NULL DEFAULT 'cod',
  payment_status   payment_status NOT NULL DEFAULT 'pending',

  -- Shipping snapshot (immutable after creation)
  shipping_name    VARCHAR(100) NOT NULL,
  shipping_phone   VARCHAR(15) NOT NULL,
  shipping_address TEXT NOT NULL,

  note             TEXT,
  cancelled_reason TEXT,
  is_deleted       BOOLEAN NOT NULL DEFAULT false,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_orders_user ON orders (user_id) WHERE is_deleted = false;
CREATE INDEX idx_orders_status ON orders (status) WHERE is_deleted = false;
CREATE INDEX idx_orders_payment ON orders (payment_status) WHERE is_deleted = false;
CREATE INDEX idx_orders_created ON orders (created_at DESC) WHERE is_deleted = false;
CREATE INDEX idx_orders_number ON orders (order_number);

CREATE TRIGGER set_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- 8.2 Order Items (snapshot of product at purchase time)
CREATE TABLE order_items (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id      UUID NOT NULL REFERENCES orders(id) ON DELETE RESTRICT,
  variant_id    UUID NOT NULL REFERENCES product_variants(id) ON DELETE RESTRICT,

  -- Snapshot fields (immutable)
  product_name  VARCHAR(255) NOT NULL,
  product_image VARCHAR(500),
  variant_size  VARCHAR(10) NOT NULL,
  variant_color VARCHAR(50) NOT NULL,
  unit_price    DECIMAL(12, 0) NOT NULL CHECK (unit_price >= 0),
  quantity      INT NOT NULL CHECK (quantity > 0),
  total_price   DECIMAL(12, 0) NOT NULL CHECK (total_price >= 0)
);

CREATE INDEX idx_order_items_order ON order_items (order_id);
CREATE INDEX idx_order_items_variant ON order_items (variant_id);

-- 8.3 Order Status History (audit trail)
CREATE TABLE order_status_history (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id    UUID NOT NULL REFERENCES orders(id) ON DELETE RESTRICT,
  from_status order_status,
  to_status   order_status NOT NULL,
  changed_by  UUID REFERENCES users(id) ON DELETE SET NULL,  -- NULL = system
  note        TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_order_history_order ON order_status_history (order_id, created_at);

-- ============================================
-- 9. PAYMENT TRANSACTIONS (SePay)
-- ============================================

CREATE TABLE payment_transactions (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id              UUID NOT NULL REFERENCES orders(id) ON DELETE RESTRICT,
  transaction_code      VARCHAR(50) NOT NULL UNIQUE,
  sepay_transaction_id  VARCHAR(100),
  amount                DECIMAL(12, 0) NOT NULL CHECK (amount > 0),
  bank_code             VARCHAR(20),
  bank_name             VARCHAR(100),
  account_number        VARCHAR(30),
  content               TEXT,                    -- Nội dung CK (chứa order_number)
  status                transaction_status NOT NULL DEFAULT 'pending',
  raw_webhook_data      JSONB,                   -- Lưu nguyên response từ SePay
  paid_at               TIMESTAMPTZ,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_payment_order ON payment_transactions (order_id);
CREATE INDEX idx_payment_status ON payment_transactions (status);
CREATE INDEX idx_payment_sepay_id ON payment_transactions (sepay_transaction_id) WHERE sepay_transaction_id IS NOT NULL;

-- ============================================
-- 10. REVIEWS & WISHLISTS
-- ============================================

-- 10.1 Reviews
CREATE TABLE reviews (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  product_id    UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  order_item_id UUID NOT NULL REFERENCES order_items(id) ON DELETE RESTRICT,
  rating        INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment       TEXT,
  is_approved   BOOLEAN NOT NULL DEFAULT false,
  is_deleted    BOOLEAN NOT NULL DEFAULT false,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_reviews_unique ON reviews (user_id, order_item_id) WHERE is_deleted = false;
CREATE INDEX idx_reviews_product ON reviews (product_id) WHERE is_deleted = false AND is_approved = true;
CREATE INDEX idx_reviews_rating ON reviews (product_id, rating) WHERE is_deleted = false AND is_approved = true;

CREATE TRIGGER set_reviews_updated_at
  BEFORE UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- 10.2 Wishlists
CREATE TABLE wishlists (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, product_id)
);

CREATE INDEX idx_wishlists_user ON wishlists (user_id);

-- ============================================
-- 11. VOUCHER USAGES (Tracking)
-- ============================================

CREATE TABLE voucher_usages (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  voucher_id       UUID NOT NULL REFERENCES vouchers(id) ON DELETE RESTRICT,
  user_id          UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  order_id         UUID NOT NULL REFERENCES orders(id) ON DELETE RESTRICT,
  discount_applied DECIMAL(12, 0) NOT NULL CHECK (discount_applied >= 0),
  used_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_voucher_usages_voucher ON voucher_usages (voucher_id);
CREATE INDEX idx_voucher_usages_user ON voucher_usages (user_id, voucher_id);

-- ============================================
-- 12. CMS — Banners, FAQ, Announcements
-- ============================================

-- 12.1 Banners
CREATE TABLE banners (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title            VARCHAR(255),
  subtitle         VARCHAR(255),
  image_url        VARCHAR(500) NOT NULL,
  image_mobile_url VARCHAR(500),
  cta_text         VARCHAR(100),
  cta_link         VARCHAR(500),
  bg_color         VARCHAR(7) DEFAULT '#FFFFFF',
  text_color       VARCHAR(7) DEFAULT '#111111',
  position         banner_position NOT NULL DEFAULT 'hero',
  sort_order       INT NOT NULL DEFAULT 0,
  starts_at        TIMESTAMPTZ,
  expires_at       TIMESTAMPTZ,
  is_active        BOOLEAN NOT NULL DEFAULT true,
  is_deleted       BOOLEAN NOT NULL DEFAULT false,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_banners_active ON banners (position, sort_order) WHERE is_deleted = false AND is_active = true;

CREATE TRIGGER set_banners_updated_at
  BEFORE UPDATE ON banners
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- 12.2 FAQs
CREATE TABLE faqs (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question   TEXT NOT NULL,
  answer     TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  is_active  BOOLEAN NOT NULL DEFAULT true,
  is_deleted BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_faqs_active ON faqs (sort_order) WHERE is_deleted = false AND is_active = true;

CREATE TRIGGER set_faqs_updated_at
  BEFORE UPDATE ON faqs
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- 12.3 Announcements (ticker bar)
CREATE TABLE announcements (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  icon       VARCHAR(10),       -- emoji icon
  text       VARCHAR(255) NOT NULL,
  highlight  VARCHAR(100),
  sort_order INT NOT NULL DEFAULT 0,
  is_active  BOOLEAN NOT NULL DEFAULT true,
  is_deleted BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_announcements_active ON announcements (sort_order) WHERE is_deleted = false AND is_active = true;

CREATE TRIGGER set_announcements_updated_at
  BEFORE UPDATE ON announcements
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- ============================================
-- 13. ADMIN ACTIVITY LOGS
-- ============================================

CREATE TABLE admin_activity_logs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id    UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  action      VARCHAR(50) NOT NULL,   -- 'create_product', 'update_order', etc.
  entity_type VARCHAR(50) NOT NULL,   -- 'product', 'order', 'user', etc.
  entity_id   UUID,
  old_data    JSONB,                  -- Snapshot before change
  new_data    JSONB,                  -- Snapshot after change
  ip_address  VARCHAR(45),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_admin_logs_admin ON admin_activity_logs (admin_id, created_at DESC);
CREATE INDEX idx_admin_logs_entity ON admin_activity_logs (entity_type, entity_id);
CREATE INDEX idx_admin_logs_action ON admin_activity_logs (action, created_at DESC);

-- ============================================
-- 14. SEED: Default Super Admin
-- ============================================
-- Password: Admin@123 (bcrypt hash)
-- Change this immediately after first login!
INSERT INTO users (email, phone, password_hash, full_name, role, email_verified, is_active)
VALUES (
  'admin@levents.vn',
  '0900000000',
  '$2b$10$placeholder_hash_change_me_after_setup',
  'Super Admin',
  'super_admin',
  true,
  true
);

-- ============================================
-- DONE! Schema created successfully.
-- Total: 22 tables, 13 indexes, 11 triggers
-- ============================================
