-- 1. Create signal_logs table (To track incoming Master signals)
CREATE TABLE IF NOT EXISTS signal_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    strategy_id UUID REFERENCES strategies(id) ON DELETE CASCADE,
    action TEXT NOT NULL, -- BUY/SELL/CLOSE
    symbol TEXT NOT NULL,
    price FLOAT NOT NULL,
    sl FLOAT,
    tp FLOAT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create strategy_reviews table (As mentioned in manifest)
CREATE TABLE IF NOT EXISTS strategy_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    strategy_id UUID REFERENCES strategies(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Update Strategies Table
ALTER TABLE strategies ADD COLUMN IF NOT EXISTS master_signal_key UUID DEFAULT gen_random_uuid();
ALTER TABLE strategies ADD COLUMN IF NOT EXISTS is_managed BOOLEAN DEFAULT false;

-- 4. Create Broker Accounts table (Zerodha, AngelOne, MT5)
CREATE TABLE IF NOT EXISTS broker_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    broker_type TEXT NOT NULL, -- MT5, ZERODHA, ANGELONE
    account_id TEXT NOT NULL UNIQUE,
    api_key TEXT,
    api_secret TEXT,
    access_token TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Update user_strategies (Subscriptions)
ALTER TABLE user_strategies ADD COLUMN IF NOT EXISTS broker_account_id UUID REFERENCES broker_accounts(id) ON DELETE SET NULL;
ALTER TABLE user_strategies ADD COLUMN IF NOT EXISTS risk_multiplier FLOAT DEFAULT 1.0;
ALTER TABLE user_strategies ADD COLUMN IF NOT EXISTS sync_active BOOLEAN DEFAULT false;

-- 6. Create subscription_logs (For propagation tracking)
-- Note: Re-creating if manifest implies it's needed or expanding
CREATE TABLE IF NOT EXISTS subscription_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subscription_id UUID REFERENCES user_strategies(id) ON DELETE CASCADE,
    action TEXT NOT NULL, -- SIGNAL_INGESTED, SIGNAL_PROPAGATED, EXECUTION_SUCCESS, EXECUTION_FAIL
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
