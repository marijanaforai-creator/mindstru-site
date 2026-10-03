CREATE TABLE IF NOT EXISTS mockup_projects (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 name TEXT NOT NULL,
 status TEXT NOT NULL DEFAULT 'draft',
 scene JSONB NOT NULL DEFAULT '{}'::jsonb,
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
 updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS mockup_templates (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id UUID REFERENCES users(id) ON DELETE CASCADE,
 name TEXT NOT NULL,
 category TEXT NOT NULL,
 template_type TEXT NOT NULL,
 config JSONB NOT NULL DEFAULT '{}'::jsonb,
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS mockup_assets (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 project_id UUID REFERENCES mockup_projects(id) ON DELETE CASCADE,
 name TEXT NOT NULL,
 asset_type TEXT NOT NULL,
 storage_key TEXT,
 metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_mockup_projects_user ON mockup_projects(user_id,updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_mockup_templates_category ON mockup_templates(category);
CREATE INDEX IF NOT EXISTS idx_mockup_assets_project ON mockup_assets(project_id,created_at DESC);

-- Flexible monetization catalog. Prices/limits can be changed later without changing the Mockup Engine.
CREATE TABLE IF NOT EXISTS mockup_service_plans (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 code TEXT UNIQUE NOT NULL,
 name TEXT NOT NULL,
 description TEXT,
 billing_type TEXT NOT NULL DEFAULT 'subscription',
 price_amount NUMERIC(12,2),
 currency TEXT NOT NULL DEFAULT 'EUR',
 interval TEXT,
 credits INTEGER NOT NULL DEFAULT 0,
 active BOOLEAN NOT NULL DEFAULT TRUE,
 features JSONB NOT NULL DEFAULT '[]'::jsonb,
 limits JSONB NOT NULL DEFAULT '{}'::jsonb,
 sort_order INTEGER NOT NULL DEFAULT 0,
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
 updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS mockup_credit_packages (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 code TEXT UNIQUE NOT NULL,
 name TEXT NOT NULL,
 description TEXT,
 price_amount NUMERIC(12,2) NOT NULL,
 currency TEXT NOT NULL DEFAULT 'EUR',
 credits INTEGER NOT NULL,
 active BOOLEAN NOT NULL DEFAULT TRUE,
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS mockup_entitlements (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 plan_id UUID REFERENCES mockup_service_plans(id),
 credits_balance INTEGER NOT NULL DEFAULT 0,
 status TEXT NOT NULL DEFAULT 'active',
 starts_at TIMESTAMPTZ,
 ends_at TIMESTAMPTZ,
 metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
 UNIQUE(user_id)
);
CREATE TABLE IF NOT EXISTS mockup_usage (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 project_id UUID REFERENCES mockup_projects(id) ON DELETE SET NULL,
 action TEXT NOT NULL,
 units INTEGER NOT NULL DEFAULT 1,
 credits_used INTEGER NOT NULL DEFAULT 0,
 metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_mockup_entitlements_user ON mockup_entitlements(user_id);
CREATE INDEX IF NOT EXISTS idx_mockup_usage_user_date ON mockup_usage(user_id,created_at DESC);

INSERT INTO mockup_service_plans(code,name,description,billing_type,price_amount,currency,interval,credits,features,limits,sort_order)
VALUES
('free','Free','Osnovni Canva-like editor i 2D mockupi.','free',0,'EUR',NULL,20,'["editor","2d","basic_mockups","templates"]','{"exports_per_month":5,"projects":10}',1),
('creator','Creator','Kompletna 2D biblioteka i HD export.','subscription',9.90,'EUR','month',150,'["editor","2d","all_mockups","templates","hd_export","brand_kit"]','{"exports_per_month":100,"projects":100}',2),
('3d_pro','3D Pro','Napredne 3D, isometric i scene funkcije.','subscription',19.90,'EUR','month',400,'["everything_creator","3d","isometric","perspective","depth","web_gallery","bulk_variants"]','{"exports_per_month":300,"projects":500}',3),
('business','Business','Bulk mockup, brand sistem i komercijalni workflow.','subscription',39.90,'EUR','month',1000,'["everything_3d_pro","bulk_edit","batch_export","brand_kit_pro","commercial_workflow"]','{"exports_per_month":1000,"projects":2000}',4),
('ai_mockup','AI Mockup','Prompt-to-mockup i automatsko kreiranje više scena.','subscription',49.90,'EUR','month',1500,'["everything_business","prompt_to_scene","auto_layout","multi_variant","social_formats"]','{"exports_per_month":2000,"projects":5000}',5)
ON CONFLICT (code) DO NOTHING;

INSERT INTO mockup_credit_packages(code,name,description,price_amount,currency,credits)
VALUES
('credits_100','100 kredita','Za dodatne AI/mockup operacije.',7.00,'EUR',100),
('credits_500','500 kredita','Veći paket dodatnih operacija.',25.00,'EUR',500),
('credits_1500','1500 kredita','Veliki paket za intenzivan workflow.',59.00,'EUR',1500)
ON CONFLICT (code) DO NOTHING;