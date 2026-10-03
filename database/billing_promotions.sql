-- Marijana Billing — Promotions foundation
-- UI labels remain Serbian; technical identifiers stay English.
CREATE TABLE IF NOT EXISTS billing_coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percent','fixed','free_period','bonus_credits','free_feature')),
  discount_value NUMERIC(12,2),
  currency TEXT,
  bonus_credits INTEGER,
  free_period_days INTEGER,
  scope JSONB NOT NULL DEFAULT '{}'::jsonb,
  eligibility JSONB NOT NULL DEFAULT '{}'::jsonb,
  starts_at TIMESTAMPTZ,
  ends_at TIMESTAMPTZ,
  usage_limit INTEGER,
  usage_limit_per_user INTEGER,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS billing_coupon_redemptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coupon_id UUID NOT NULL REFERENCES billing_coupons(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  order_reference TEXT,
  discount_amount NUMERIC(12,2),
  currency TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  redeemed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS billing_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  channel TEXT,
  campaign_type TEXT NOT NULL DEFAULT 'promotion',
  starts_at TIMESTAMPTZ,
  ends_at TIMESTAMPTZ,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_billing_coupons_active_dates ON billing_coupons(active,starts_at,ends_at);
CREATE INDEX IF NOT EXISTS idx_billing_coupon_redemptions_user ON billing_coupon_redemptions(user_id,redeemed_at DESC);
CREATE INDEX IF NOT EXISTS idx_billing_coupon_redemptions_coupon ON billing_coupon_redemptions(coupon_id,redeemed_at DESC);
CREATE INDEX IF NOT EXISTS idx_billing_campaigns_active_dates ON billing_campaigns(active,starts_at,ends_at);

-- Seed examples are intentionally disabled until Billing is live.
