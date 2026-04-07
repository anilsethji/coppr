-- Economic Hub: Transactions & Revenue Split Logic
-- Facilitates Triple-Tier Payments and 80/20 Creator Attribution

-- 1. TRANSACTIONS LEDGER
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    strategy_id UUID REFERENCES strategies(id) NOT NULL,
    order_id TEXT UNIQUE NOT NULL,
    cf_payment_id TEXT, -- Cashfree Payment Session ID or Transaction ID
    amount DECIMAL(12, 2) NOT NULL,
    currency TEXT DEFAULT 'INR',
    status TEXT DEFAULT 'pending', -- pending, completed, failed
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. CREATOR REVENUE SPLIT LEDGER
CREATE TABLE IF NOT EXISTS creator_revenue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_id UUID REFERENCES creator_profiles(id) NOT NULL,
    strategy_id UUID REFERENCES strategies(id) NOT NULL,
    transaction_id UUID REFERENCES transactions(id),
    gross_amount DECIMAL(12, 2) NOT NULL,
    creator_net DECIMAL(12, 2) NOT NULL, -- 80%
    coppr_fee DECIMAL(12, 2) NOT NULL,    -- 20%
    status TEXT DEFAULT 'PENDING_PAYOUT', -- PENDING_PAYOUT, PAID_OUT
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. CREATOR PAYOUT ROUTING
ALTER TABLE creator_profiles ADD COLUMN IF NOT EXISTS payout_upi TEXT;

-- 4. RLS PROTOCOLS
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE creator_revenue ENABLE ROW LEVEL SECURITY;

-- Users can see their own transactions
CREATE POLICY "Users can view own transactions" ON transactions
    FOR SELECT USING (auth.uid() = user_id);

-- Creators can see their own revenue
CREATE POLICY "Creators can view own revenue" ON creator_revenue
    FOR SELECT USING (auth.uid() IN (
        SELECT user_id FROM creator_profiles WHERE id = creator_id
    ));

-- Comments for Clarity
COMMENT ON TABLE transactions IS 'Main ledger for marketplace payment attempts';
COMMENT ON TABLE creator_revenue IS 'Revenue split ledger for automated 80/20 payouts';
COMMENT ON COLUMN creator_profiles.payout_upi IS 'Creator payment handle for receiving algorithmic earnings (VPA)';
