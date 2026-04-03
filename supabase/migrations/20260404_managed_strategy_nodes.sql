-- Add Managed Strategy Node Fields
ALTER TABLE strategies ADD COLUMN IF NOT EXISTS ea_file_url TEXT;
ALTER TABLE strategies ADD COLUMN IF NOT EXISTS is_managed_active BOOLEAN DEFAULT FALSE;
ALTER TABLE strategies ADD COLUMN IF NOT EXISTS managed_node_status TEXT DEFAULT 'STOPPED'; -- 'STOPPED', 'STARTING', 'RUNNING', 'ERROR'
ALTER TABLE strategies ADD COLUMN IF NOT EXISTS ea_config JSONB DEFAULT '{}';

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_strategies_managed_active ON strategies(is_managed_active) WHERE is_managed_active = TRUE;

-- Comment for documentation
COMMENT ON COLUMN strategies.ea_file_url IS 'Private storage URL for the uploaded bot file (.ex5/.mq5)';
COMMENT ON COLUMN strategies.is_managed_active IS 'Whether this strategy is currently running on Coppr Managed Nodes';
COMMENT ON COLUMN strategies.managed_node_status IS 'Real-time status of the virtual execution node';
