-- Update signal_logs to support Limit/Stop orders
ALTER TABLE signal_logs ADD COLUMN IF NOT EXISTS order_type TEXT DEFAULT 'MARKET';
ALTER TABLE signal_logs ADD COLUMN IF NOT EXISTS limit_price FLOAT;

-- Update strategies table to track execution mode
ALTER TABLE strategies ADD COLUMN IF NOT EXISTS execution_mode TEXT DEFAULT 'SELF_HOSTED'; -- 'SELF_HOSTED' or 'COPPR_MANAGED'

-- Comment for documentation
COMMENT ON COLUMN signal_logs.order_type IS 'MARKET, LIMIT, or STOP';
COMMENT ON COLUMN signal_logs.limit_price IS 'Trigger price for LIMIT/STOP orders';
COMMENT ON COLUMN strategies.execution_mode IS 'Managed Hosting Status node';
