-- 20260404_signal_security.sql
-- ADD MASTER SECURITY KEY FOR AUTHORIZED SIGNAL BROADCASTS

-- 1. ADD master_signal_key TO strategies
ALTER TABLE strategies 
ADD COLUMN IF NOT EXISTS master_signal_key TEXT UNIQUE;

-- 2. ADD last_signal_at TO TRACK NODE HEALTH
ALTER TABLE strategies 
ADD COLUMN IF NOT EXISTS last_signal_at TIMESTAMP WITH TIME ZONE;

-- 3. GENEREATE INITIAL KEYS FOR EXISTING STRATEGIES
UPDATE strategies 
SET master_signal_key = 'COPPR-' || upper(substring(replace(gen_random_uuid()::text, '-', ''), 1, 12))
WHERE master_signal_key IS NULL;

-- 4. ENSURE INDEXING FOR FAST AUTHORIZATION
CREATE INDEX IF NOT EXISTS idx_strategies_master_key ON strategies(master_signal_key);

COMMENT ON COLUMN strategies.master_signal_key IS 'Secret key required for Expert Advisors to broadcast signals to the hub.';
