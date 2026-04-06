-- 2026.04.06: FIX UUID Type Mismatch for master_signal_key
-- Goal: Convert column from UUID to TEXT to support "COPPR-" custom IDs.

DO $$ 
BEGIN 
    -- 1. Check if the column is UUID and Convert to TEXT
    IF (SELECT data_type FROM information_schema.columns 
        WHERE table_name = 'strategies' AND column_name = 'master_signal_key') = 'uuid' THEN
        
        ALTER TABLE strategies ALTER COLUMN master_signal_key TYPE TEXT USING master_signal_key::text;
        ALTER TABLE strategies ALTER COLUMN master_signal_key SET DEFAULT '';
        
        RAISE NOTICE 'SUCCESS: master_signal_key converted from UUID to TEXT.';
    ELSE
        RAISE NOTICE 'SKIPPED: master_signal_key is already TEXT or does not exist.';
    END IF;

    -- 2. Ensure default is empty string if null
    UPDATE strategies SET master_signal_key = '' WHERE master_signal_key IS NULL;
    
END $$;

-- 3. RE-INDEX FOR SEARCH PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_strategies_master_key_v2 ON strategies(master_signal_key);

-- FIXED FOR IRONCLAD ERA
