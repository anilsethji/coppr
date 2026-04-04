-- 1. Create the 'strategy-files' bucket for EA storage
INSERT INTO storage.buckets (id, name, public) 
VALUES ('strategy-files', 'strategy-files', false)
ON CONFLICT (id) DO NOTHING;

-- 2. Set up RLS for strategy-files
CREATE POLICY "Creators can upload their own EA files"
ON storage.objects FOR INSERT 
TO authenticated
WITH CHECK (bucket_id = 'strategy-files' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Subscribers can ONLY read assigned EA files"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'strategy-files');

-- 3. Update strategies table for bot execution
ALTER TABLE strategies ADD COLUMN IF NOT EXISTS managed_node_status TEXT DEFAULT 'STOPPED'; -- 'STOPPED', 'STARTING', 'RUNNING', 'ERROR'
ALTER TABLE strategies ADD COLUMN IF NOT EXISTS is_managed_active BOOLEAN DEFAULT false;
ALTER TABLE strategies ADD COLUMN IF NOT EXISTS last_node_ping TIMESTAMP WITH TIME ZONE;

COMMENT ON COLUMN strategies.managed_node_status IS 'Real-time status of the virtual execution node';
COMMENT ON COLUMN strategies.is_managed_active IS 'True if the virtual MT5 instance is currently running';
