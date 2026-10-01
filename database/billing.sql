CREATE TABLE IF NOT EXISTS purchases (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 product_name TEXT NOT NULL,
 product_id TEXT,
 amount_cents INTEGER NOT NULL DEFAULT 0,
 currency TEXT NOT NULL DEFAULT 'EUR',
 provider TEXT,
 provider_payment_id TEXT,
 status TEXT NOT NULL DEFAULT 'pending',
 metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
 updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS invoices (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 purchase_id UUID REFERENCES purchases(id) ON DELETE SET NULL,
 invoice_number TEXT NOT NULL,
 amount_cents INTEGER NOT NULL DEFAULT 0,
 currency TEXT NOT NULL DEFAULT 'EUR',
 status TEXT NOT NULL DEFAULT 'draft',
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_purchases_user ON purchases(user_id,created_at DESC);
CREATE INDEX IF NOT EXISTS idx_invoices_user ON invoices(user_id,created_at DESC);
