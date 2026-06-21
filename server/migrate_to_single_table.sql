-- ============================================================
-- Camera Rental House — Full Database Schema Migration
-- Run this in the Supabase SQL Editor
-- ============================================================

-- ── Enable required extensions ──────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- USERS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id   TEXT UNIQUE,
  full_name   TEXT NOT NULL,
  phone       TEXT,
  email       TEXT UNIQUE,
  password_hash TEXT NOT NULL,

  -- Identity documents
  aadhaar_no      TEXT UNIQUE,
  aadhaar_doc_url TEXT,
  voter_no        TEXT UNIQUE,
  voter_doc_url   TEXT,

  -- Profile
  avatar_url  TEXT,
  facebook    TEXT,
  instagram   TEXT,
  youtube     TEXT,
  user_qr_base64 TEXT,

  -- Flags
  is_verified         BOOLEAN NOT NULL DEFAULT false,
  is_house_owner      BOOLEAN NOT NULL DEFAULT false,
  is_blocked          BOOLEAN NOT NULL DEFAULT false,
  role                TEXT NOT NULL DEFAULT 'user'
                      CHECK (role IN ('user', 'admin', 'manager', 'staff', 'partner')),

  -- Tracks sensitive fields changed by user (cleared on admin verification)
  changed_fields      JSONB NOT NULL DEFAULT '[]'::jsonb,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for users
CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);
CREATE INDEX IF NOT EXISTS idx_users_phone ON users (phone);
CREATE INDEX IF NOT EXISTS idx_users_member_id ON users (member_id);
CREATE INDEX IF NOT EXISTS idx_users_role ON users (role);
CREATE INDEX IF NOT EXISTS idx_users_is_house_owner ON users (is_house_owner);

-- ============================================================
-- PRODUCTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS products (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name              TEXT NOT NULL,
  brand             TEXT,
  category          TEXT,
  description       TEXT,
  price_per_day     NUMERIC(10,2) NOT NULL DEFAULT 0,
  price_2_days      NUMERIC(10,2),
  price_5_days      NUMERIC(10,2),
  available_quantity INTEGER NOT NULL DEFAULT 1,
  unique_code       TEXT UNIQUE NOT NULL,
  qr_base64         TEXT,
  images            JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for products
CREATE INDEX IF NOT EXISTS idx_products_category ON products (category);
CREATE INDEX IF NOT EXISTS idx_products_brand ON products (brand);
CREATE INDEX IF NOT EXISTS idx_products_unique_code ON products (unique_code);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products (created_at DESC);

-- ============================================================
-- RENTALS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS rentals (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rental_no     TEXT UNIQUE NOT NULL,
  user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  pickup_date   TIMESTAMPTZ NOT NULL,
  event_date    TIMESTAMPTZ NOT NULL,
  status        TEXT NOT NULL DEFAULT 'confirmed'
                CHECK (status IN ('confirmed', 'released', 'returned', 'cancelled', 'pending_pickup')),
  total_amount  NUMERIC(10,2) NOT NULL DEFAULT 0,
  products      JSONB NOT NULL DEFAULT '[]'::jsonb,
  assistant_crew_count INTEGER NOT NULL DEFAULT 0,
  crew_price    NUMERIC(10,2) NOT NULL DEFAULT 0,

  -- Release tracking (when items are handed over)
  released_at                 TIMESTAMPTZ,
  released_by_staff_name      TEXT,
  handover_proof_url          TEXT,
  released_to_representative_name TEXT,

  -- Return tracking (when items are received back)
  received_at                 TIMESTAMPTZ,
  received_by_staff_name      TEXT,
  returned_by_representative_name TEXT,

  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for rentals
CREATE INDEX IF NOT EXISTS idx_rentals_user_id ON rentals (user_id);
CREATE INDEX IF NOT EXISTS idx_rentals_status ON rentals (status);
CREATE INDEX IF NOT EXISTS idx_rentals_pickup_date ON rentals (pickup_date);
CREATE INDEX IF NOT EXISTS idx_rentals_created_at ON rentals (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_rentals_rental_no ON rentals (rental_no);

-- ============================================================
-- STAFF ACCOUNTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS staff_accounts (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username        TEXT UNIQUE NOT NULL,
  full_name       TEXT NOT NULL,
  phone           TEXT,
  role            TEXT NOT NULL DEFAULT 'staff'
                  CHECK (role IN ('admin', 'manager', 'staff', 'accountant')),
  password_hash   TEXT NOT NULL,
  avatar_url      TEXT,
  is_active       BOOLEAN NOT NULL DEFAULT true,
  last_login_at   TIMESTAMPTZ,
  last_logout_at  TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for staff_accounts
CREATE INDEX IF NOT EXISTS idx_staff_accounts_username ON staff_accounts (username);
CREATE INDEX IF NOT EXISTS idx_staff_accounts_role ON staff_accounts (role);

-- ============================================================
-- PRODUCTION HOUSES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS production_houses (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  house_id    TEXT UNIQUE NOT NULL,
  name        TEXT NOT NULL,
  owner_name  TEXT,
  phone       TEXT,
  address     TEXT,
  user_id     UUID REFERENCES users(id) ON DELETE SET NULL,
  status      TEXT NOT NULL DEFAULT 'Active'
              CHECK (status IN ('Active', 'Inactive')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for production_houses
CREATE INDEX IF NOT EXISTS idx_production_houses_user_id ON production_houses (user_id);
CREATE INDEX IF NOT EXISTS idx_production_houses_house_id ON production_houses (house_id);
CREATE INDEX IF NOT EXISTS idx_production_houses_status ON production_houses (status);

-- ============================================================
-- HOUSE PAYMENTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS house_payments (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  house_id      UUID NOT NULL REFERENCES production_houses(id) ON DELETE CASCADE,
  amount        NUMERIC(10,2) NOT NULL DEFAULT 0,
  payment_date  TIMESTAMPTZ NOT NULL DEFAULT now(),
  status        TEXT NOT NULL DEFAULT 'pending'
                CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for house_payments
CREATE INDEX IF NOT EXISTS idx_house_payments_house_id ON house_payments (house_id);
CREATE INDEX IF NOT EXISTS idx_house_payments_status ON house_payments (status);
CREATE INDEX IF NOT EXISTS idx_house_payments_payment_date ON house_payments (payment_date);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- Enable RLS on all tables so the anon key cannot read anything
-- The server uses the service_role key which bypasses RLS.
-- ============================================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE rentals ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE production_houses ENABLE ROW LEVEL SECURITY;
ALTER TABLE house_payments ENABLE ROW LEVEL SECURITY;

-- ── Users: only allow users to read/update their own record ──
CREATE POLICY "users_select_own" ON users
  FOR SELECT USING (id = auth.uid());

CREATE POLICY "users_update_own" ON users
  FOR UPDATE USING (id = auth.uid());

-- ── Products: public read access ──
CREATE POLICY "products_select_all" ON products
  FOR SELECT USING (true);

-- ── Rentals: users can read their own ──
CREATE POLICY "rentals_select_own" ON rentals
  FOR SELECT USING (user_id = auth.uid());

-- ── Production houses & payments: read for house owners & admins ──
CREATE POLICY "houses_select_own" ON production_houses
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "payments_select_own" ON house_payments
  FOR SELECT USING (
    house_id IN (SELECT id FROM production_houses WHERE user_id = auth.uid())
  );

-- Note: Admin/Staff access is granted via the service_role key in the server,
-- so no additional RLS policies are needed for staff operations.

-- ============================================================
-- SEED DATA: Default Admin Account
-- IMPORTANT: Change these credentials after first login!
-- ============================================================
INSERT INTO staff_accounts (username, full_name, role, password_hash, is_active)
VALUES (
  'admin',
  'System Administrator',
  'admin',
  crypt('admin123', gen_salt('bf')),
  true
) ON CONFLICT (username) DO NOTHING;
