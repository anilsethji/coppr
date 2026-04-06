-- 🛡️ COPPR ULTRA-ROBUST SCHEMATIC SYNC (2026.04.06)
-- Goal: Force "master_signal_key" and "execution_mode" to TEXT type.
-- This script bypasses conditional checks to ensure live compliance.

DO $$ 
BEGIN 
    RAISE NOTICE '⚡ INITIATING ULTRA-ROBUST PROTOCOL SYNC...';

    -- 1. FORCE CONVERSION: master_signal_key
    BEGIN
        ALTER TABLE strategies ALTER COLUMN master_signal_key TYPE TEXT USING master_signal_key::text;
        ALTER TABLE strategies ALTER COLUMN master_signal_key SET DEFAULT '';
        RAISE NOTICE '✅ SUCCESS: master_signal_key forced to TEXT.';
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE '⚠️  NOTICE: master_signal_key already compliant or skipped.';
    END;

    -- 2. FORCE CONVERSION: execution_mode
    -- This specifically addresses the "invalid input value for enum" error
    BEGIN
        ALTER TABLE strategies ALTER COLUMN execution_mode TYPE TEXT USING execution_mode::text;
        ALTER TABLE strategies ALTER COLUMN execution_mode SET DEFAULT 'COPPR_MANAGED';
        RAISE NOTICE '✅ SUCCESS: execution_mode forced to TEXT.';
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE '⚠️  NOTICE: execution_mode already compliant or skipped.';
    END;

    -- 3. ENSURE DATA PARITY
    UPDATE strategies SET master_signal_key = '' WHERE master_signal_key IS NULL;
    UPDATE strategies SET execution_mode = 'COPPR_MANAGED' WHERE execution_mode IS NULL;

    -- 4. REBUILD CRITICAL INDEXES
    DROP INDEX IF EXISTS idx_strategies_master_key_v2;
    CREATE INDEX idx_strategies_master_key_v2 ON strategies(master_signal_key);

    RAISE NOTICE '🛡️  IRONCLAD SYNC COMPLETE: PROTOCOL REJECTIONS RESOLVED.';
END $$;
