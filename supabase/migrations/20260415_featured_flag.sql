-- Migration: Add is_featured flag for community spotlights
-- Created: 2026-04-15

-- 1. Add is_featured column if not exists
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'strategies' AND column_name = 'is_featured') THEN
        ALTER TABLE strategies ADD COLUMN is_featured BOOLEAN DEFAULT FALSE;
    END IF;
END $$;

-- 2. Add origin column to distinguish institutional releases
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'strategies' AND column_name = 'origin') THEN
        ALTER TABLE strategies ADD COLUMN origin TEXT DEFAULT 'MARKETPLACE';
    END IF;
END $$;

-- 3. Ensure is_official exists (matches API logic)
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'strategies' AND column_name = 'is_official') THEN
        ALTER TABLE strategies ADD COLUMN is_official BOOLEAN DEFAULT FALSE;
    END IF;
END $$;

-- 4. Create indexes for Spotlight fetching
CREATE INDEX IF NOT EXISTS idx_strategies_is_featured ON strategies(is_featured) WHERE is_featured = TRUE;
CREATE INDEX IF NOT EXISTS idx_strategies_is_official ON strategies(is_official) WHERE is_official = TRUE;
CREATE INDEX IF NOT EXISTS idx_strategies_origin ON strategies(origin);
