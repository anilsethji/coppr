-- 20260405_indicator_script.sql
-- ADD SCRIPT CODE STORAGE FOR PINE SCRIPT INDICATORS

ALTER TABLE strategies 
ADD COLUMN IF NOT EXISTS script_code TEXT;

COMMENT ON COLUMN strategies.script_code IS 'Source code or configuration script for the strategy (Indicator/EA).';
