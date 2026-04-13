-- Add active_assets whitelist column to user_strategies
-- This stores an array of authorized symbols (e.g. ["BTCUSD", "ETHUSD"])
ALTER TABLE user_strategies ADD COLUMN IF NOT EXISTS active_assets JSONB DEFAULT '[]'::jsonb;

-- Add comment for institutional auditability
COMMENT ON COLUMN user_strategies.active_assets IS 'Institutional symbol whitelist for signal mirroring. Enforcement handled by PropagationService.';
