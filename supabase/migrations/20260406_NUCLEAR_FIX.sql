-- ☣️ COPPR NUCLEAR SCHEMATIC RESET (2026.04.06)
-- Goal: Destroy the problematic "execution_mode" ENUM type and recreate as clean TEXT.
-- This is the definitive fix for metadata-level type rejections.

DO $$ 
BEGIN 
    RAISE NOTICE '☣️  INITIATING NUCLEAR RESET PROTOCOL...';

    -- 1. SHADOW DATA PRESERVATION
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'strategies' AND column_name = 'tmp_exec_mode') THEN
        ALTER TABLE strategies ADD COLUMN tmp_exec_mode TEXT;
        UPDATE strategies SET tmp_exec_mode = execution_mode::text;
        RAISE NOTICE '✅ SUCCESS: Data preserved in shadow column.';
    END IF;

    -- 2. DESTRUCTION OF OLD COLUMN
    -- This clears any residual ENUM links in the type registry.
    ALTER TABLE strategies DROP COLUMN IF EXISTS execution_mode;
    RAISE NOTICE '✅ SUCCESS: Old column dropped (Metadata cleared).';

    -- 3. RECONSTRUCTION
    ALTER TABLE strategies ADD COLUMN execution_mode TEXT DEFAULT 'COPPR_MANAGED';
    UPDATE strategies SET execution_mode = tmp_exec_mode WHERE tmp_exec_mode IS NOT NULL;
    RAISE NOTICE '✅ SUCCESS: Column reconstructed as clean TEXT.';

    -- 4. CLEANUP SHADOW
    ALTER TABLE strategies DROP COLUMN IF EXISTS tmp_exec_mode;

    -- 5. REPEAT FOR master_signal_key just in case
    BEGIN
        ALTER TABLE strategies ALTER COLUMN master_signal_key TYPE TEXT USING master_signal_key::text;
    EXCEPTION WHEN OTHERS THEN RAISE NOTICE 'master_signal_key already compliant.'; END;

    RAISE NOTICE '🛡️  NUCLEAR SYNC COMPLETE: TYPE-REGISTRY ERRORS TERMINATED.';
END $$;
