-- Migration: Add Asset Whitelist for Mirroring
-- Created: 2026-04-12
-- Goal: Allow users to specify which symbols are permitted for mirroring.

ALTER TABLE user_strategies ADD COLUMN IF NOT EXISTS active_assets JSONB DEFAULT '[]';

-- Comment for documentation
COMMENT ON COLUMN user_strategies.active_assets IS 'List of authorized symbols for mirroring (e.g., ["BTCUSDT", "XAUUSD"]). If empty, mirroring is restricted for safety.';
