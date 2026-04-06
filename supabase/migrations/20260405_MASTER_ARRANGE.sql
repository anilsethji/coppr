-- COPPR MASTER BACKEND ARRANGE (2026.04.05)
-- Goal: Ensure full technical and business logic synchronization for the Creator Submission Terminal.

-- 1. CREATOR BRANDING & PROFILES
ALTER TABLE creator_profiles ADD COLUMN IF NOT EXISTS display_name TEXT;
ALTER TABLE creator_profiles ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE creator_profiles ADD COLUMN IF NOT EXISTS avatar_type TEXT DEFAULT 'EMOJI';
ALTER TABLE creator_profiles ADD COLUMN IF NOT EXISTS avatar_data TEXT DEFAULT '🤖';

-- 2. STRATEGY DISTRIBUTION & VISIBILITY
ALTER TABLE strategies ADD COLUMN IF NOT EXISTS origin TEXT DEFAULT 'MARKETPLACE'; -- 'PERSONAL', 'MARKETPLACE', 'OFFICIAL'
ALTER TABLE strategies ADD COLUMN IF NOT EXISTS tier TEXT DEFAULT 'PAID'; -- 'FREE', 'PAID'
ALTER TABLE strategies ADD COLUMN IF NOT EXISTS monthly_price_inr INTEGER DEFAULT 1999;
ALTER TABLE strategies ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'PENDING'; -- 'PENDING', 'APPROVED', 'REJECTED'

-- 3. TECHNICAL LOGIC ARK (EA / INDICATORS)
ALTER TABLE strategies ADD COLUMN IF NOT EXISTS script_code TEXT; -- For Pine Script logic
ALTER TABLE strategies ADD COLUMN IF NOT EXISTS ea_file_url TEXT; -- For EX5 Binary path
ALTER TABLE strategies ADD COLUMN IF NOT EXISTS video_url TEXT; -- For Educational guides
ALTER TABLE strategies ADD COLUMN IF NOT EXISTS master_signal_key TEXT DEFAULT '';
ALTER TABLE strategies ADD COLUMN IF NOT EXISTS execution_mode TEXT; -- 'COPPR_MANAGED', 'WEBHOOK_BRIDGE'
ALTER TABLE strategies ADD COLUMN IF NOT EXISTS is_managed BOOLEAN DEFAULT false;

-- 4. STORAGE BUCKET HANDLER
-- This ensures the bucket exists for EA binary uploads
INSERT INTO storage.buckets (id, name, public) 
VALUES ('strategy-files', 'strategy-files', false)
ON CONFLICT (id) DO NOTHING;

-- RLS Update for Secure Uploads
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Creators can upload their own EA files') THEN
        CREATE POLICY "Creators can upload their own EA files"
        ON storage.objects FOR INSERT TO authenticated
        WITH CHECK (bucket_id = 'strategy-files' AND (storage.foldername(name))[1] = auth.uid()::text);
    END IF;
END $$;

-- 5. ENUMERATION COMMENTS
COMMENT ON COLUMN strategies.origin IS 'Product Visibility: PERSONAL (Private Algo Hub) vs MARKETPLACE (Public Hub)';
COMMENT ON COLUMN strategies.tier IS 'Monetization: FREE (Community Open Node) vs PAID (Elite Protocol)';
COMMENT ON COLUMN strategies.script_code IS 'Technical Protocol Archive for Pine Script or Detect logic';
COMMENT ON COLUMN strategies.ea_file_url IS 'Managed Node binary storage link';
COMMENT ON COLUMN strategies.execution_mode IS 'Bridge Protocol: COPPR_MANAGED vs WEBHOOK_BRIDGE';

-- FINAL CHECK: All arranged till 2026-04-05
