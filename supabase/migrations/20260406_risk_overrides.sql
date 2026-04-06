-- 2026.04.06: Subscriber Risk Management Layer & "Ironclad" Watchdog Infrastructure
-- Goal: Add execution overrides and Drawdown Kill-Switch for "Hands-Free" risk control.

-- 1. ADD RISK ENGINE & WATCHDOG OVERRIDES TO user_strategies
ALTER TABLE user_strategies ADD COLUMN IF NOT EXISTS engine_mode TEXT DEFAULT 'MULTIPLIER'; -- EA: ALWAYS 'FIXED_QTY', INDICATOR: 'MULTIPLIER' or 'PCT_BALANCE'
ALTER TABLE user_strategies ADD COLUMN IF NOT EXISTS engine_value FLOAT DEFAULT 1.0;
ALTER TABLE user_strategies ADD COLUMN IF NOT EXISTS leverage_override INTEGER DEFAULT 1; -- For Indicators (1x to 100x)
ALTER TABLE user_strategies ADD COLUMN IF NOT EXISTS is_paused BOOLEAN DEFAULT false; -- Global/Manual/Auto Kill Switch

-- 2. "IRONCLAD" WATCHDOG COLUMNS (Drawdown Protection)
ALTER TABLE user_strategies ADD COLUMN IF NOT EXISTS base_balance FLOAT DEFAULT 10000.0; -- Initial equity for drawdown calculation
ALTER TABLE user_strategies ADD COLUMN IF NOT EXISTS drawdown_threshold FLOAT DEFAULT 50.0; -- Kill node if loss > X%
ALTER TABLE user_strategies ADD COLUMN IF NOT EXISTS last_kill_reason TEXT; -- 'DRAWDOWN_LIMIT_REACHED' or 'MANUAL_STOP'

-- 3. ENUMERATION COMMENTS FOR DOCUMENTATION
COMMENT ON COLUMN user_strategies.engine_mode IS 'EA Bots: FIXED_QTY | Indicators: MULTIPLIER, PCT_BALANCE';
COMMENT ON COLUMN user_strategies.drawdown_threshold IS 'Global Kill Switch threshold in %. If Balance drops more than this vs base_balance, is_paused sets to TRUE.';

-- 4. INDEX FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_user_strategies_paused ON user_strategies(is_paused) WHERE is_paused = false;

-- FINAL ARRANGE COMPLETED
