-- 1. Add is_official flag to strategies for easy high-fidelity filtering
ALTER TABLE strategies ADD COLUMN IF NOT EXISTS is_official BOOLEAN DEFAULT false;

-- 2. Set the initial official bots (Assuming Coppr Official account)
-- In a real scenario, we'd target a specific UUID, but for now we'll support the flag
COMMENT ON COLUMN strategies.is_official IS 'Flag to prioritize Coppr Labs official releases over the community marketplace.';

-- 3. Update existing official content pointers if needed
-- (Assuming we update these via the Admin Console later)
