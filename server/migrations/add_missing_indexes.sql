-- ============================================================
-- Migration: Add missing indexes for frequently filtered/sorted columns
-- Run this against existing production database
-- ============================================================

-- Users: admin list sorts by created_at DESC
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users (created_at DESC);

-- Rentals: manage dashboard counts filter by event_date range
CREATE INDEX IF NOT EXISTS idx_rentals_event_date ON rentals (event_date);

-- Staff accounts: staff list sorts by created_at DESC
CREATE INDEX IF NOT EXISTS idx_staff_accounts_created_at ON staff_accounts (created_at DESC);

-- Staff accounts: login OR query searches by phone
CREATE INDEX IF NOT EXISTS idx_staff_accounts_phone ON staff_accounts (phone);

-- Production houses: houses list sorts by created_at DESC
CREATE INDEX IF NOT EXISTS idx_production_houses_created_at ON production_houses (created_at DESC);

-- Production houses: slug lookup uses ILIKE on name (exact match after hyphen→space)
CREATE INDEX IF NOT EXISTS idx_production_houses_name ON production_houses (name);

-- House payments: payments list sorts by payment_date DESC, created_at DESC
CREATE INDEX IF NOT EXISTS idx_house_payments_created_at ON house_payments (created_at DESC);
