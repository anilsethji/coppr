-- Migration: Add Dynamic Credentials Support
-- Created: 2026-04-13
-- Goal: Store broker-specific fields (Passwords, Servers, PINs) in a flexible JSONB column.

ALTER TABLE broker_accounts ADD COLUMN IF NOT EXISTS meta JSONB DEFAULT '{}';

-- Documentation
COMMENT ON COLUMN broker_accounts.meta IS 'Flexible storage for broker-specific credentials like Server names, Passwords, PINs, or TOTP secrets.';
