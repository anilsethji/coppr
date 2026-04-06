-- ADDITION OF LANDING PAGE METADATA TO STRATEGIES TABLE (CORRECTED)

-- 1. Add 'how_it_works' array for 4-point strategic logic
ALTER TABLE strategies 
ADD COLUMN IF NOT EXISTS how_it_works JSONB DEFAULT '[]'::jsonb;

-- 2. Add 'screenshot_urls' for marketplace gallery (3 screenshots)
ALTER TABLE strategies 
ADD COLUMN IF NOT EXISTS screenshot_urls TEXT[] DEFAULT '{}'::text[];

-- 3. Ensure win_rate, total_trades, etc. are available (if not already)
ALTER TABLE strategies 
ADD COLUMN IF NOT EXISTS win_rate NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_trades INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS avg_gain NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS max_drawdown NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS avg_rating NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS review_count INTEGER DEFAULT 0;

-- 4. Protocol Clearance Check (Policy Upsert)
-- We drop and recreate the policy to ensure the correct access logic is applied.
DROP POLICY IF EXISTS "Allow public read-only access to strategies" ON strategies;

CREATE POLICY "Allow public read-only access to strategies" 
ON strategies FOR SELECT 
USING (status = 'ACTIVE');
