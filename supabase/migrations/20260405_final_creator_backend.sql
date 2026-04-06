-- Final Backend Arrangement for Creator Submission Terminal
-- Adds columns for Visibility, Tier, and Pricing to the strategies table.

-- 1. DISTRIBUTION & MONETIZATION
ALTER TABLE strategies ADD COLUMN IF NOT EXISTS origin TEXT DEFAULT 'MARKETPLACE';
ALTER TABLE strategies ADD COLUMN IF NOT EXISTS tier TEXT DEFAULT 'PAID';
-- Ensure monthly_price_inr exists
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='strategies' AND column_name='monthly_price_inr') THEN
        ALTER TABLE strategies ADD COLUMN monthly_price_inr INTEGER DEFAULT 1999;
    END IF;
END $$;

-- 2. TECHNICAL INTEGRITY
ALTER TABLE strategies ADD COLUMN IF NOT EXISTS script_code TEXT;
ALTER TABLE strategies ADD COLUMN IF NOT EXISTS video_url TEXT;

-- 3. ENUMERATION COMMENTS
COMMENT ON COLUMN strategies.origin IS 'Visibility Protocol: PERSONAL, MARKETPLACE, OFFICIAL';
COMMENT ON COLUMN strategies.tier IS 'Monetization Tier: FREE, PAID';
COMMENT ON COLUMN strategies.monthly_price_inr IS 'Subscription Fee in INR';
COMMENT ON COLUMN strategies.script_code IS 'Pine Script or EA Template logic archive';
COMMENT ON COLUMN strategies.video_url IS 'Marketplace educational guide (YouTube/Reel)';
