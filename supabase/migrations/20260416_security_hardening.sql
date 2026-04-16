-- Migration: Supabase Security Hardening
-- Description: Enables Row-Level Security (RLS) on all sensitive tables and defines strict access policies to prevent data leakage.
-- Created: 2026-04-16

-- 1. Enable RLS on all sensitive tables
ALTER TABLE public.broker_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.strategies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creator_revenue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_strategies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.strategy_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.signal_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_logs ENABLE ROW LEVEL SECURITY;

-- 2. Define Policies for public.broker_accounts
-- Goal: Users can only see and manage their own broker credentials.
DROP POLICY IF EXISTS "Users can manage own broker accounts" ON public.broker_accounts;
CREATE POLICY "Users can manage own broker accounts" 
ON public.broker_accounts 
FOR ALL 
USING (auth.uid() = user_id);

-- 3. Define Policies for public.strategies
-- Goal: Anyone can view active strategies, but only creators can edit them.
DROP POLICY IF EXISTS "Anyone can view strategies" ON public.strategies;
CREATE POLICY "Anyone can view strategies" 
ON public.strategies 
FOR SELECT 
USING (status = 'ACTIVE' OR auth.uid() = creator_id);

DROP POLICY IF EXISTS "Creators can manage own strategies" ON public.strategies;
CREATE POLICY "Creators can manage own strategies" 
ON public.strategies 
FOR ALL 
USING (auth.uid() = creator_id);

-- 4. Define Policies for public.creator_revenue
-- Goal: Creators can only see their own revenue data.
DROP POLICY IF EXISTS "Creators can view own revenue" ON public.creator_revenue;
CREATE POLICY "Creators can view own revenue" 
ON public.creator_revenue 
FOR SELECT 
USING (auth.uid() = creator_id);

-- 5. Define Policies for public.user_strategies (Subscriptions)
-- Goal: Users can only see their own strategy activations/subscriptions.
DROP POLICY IF EXISTS "Users can view own subscriptions" ON public.user_strategies;
CREATE POLICY "Users can view own subscriptions" 
ON public.user_strategies 
FOR SELECT 
USING (auth.uid() = user_id);

-- 6. Define Policies for public.strategy_reviews
-- Goal: Public reading, restricted writing.
DROP POLICY IF EXISTS "Anyone can read reviews" ON public.strategy_reviews;
CREATE POLICY "Anyone can read reviews" 
ON public.strategy_reviews 
FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Users can manage own reviews" ON public.strategy_reviews;
CREATE POLICY "Users can manage own reviews" 
ON public.strategy_reviews 
FOR ALL 
USING (auth.uid() = user_id);

-- 7. Define Policies for public.signal_logs
-- Goal: Only creators can see logs for their strategies.
DROP POLICY IF EXISTS "Creators can view own signal logs" ON public.signal_logs;
CREATE POLICY "Creators can view own signal logs" 
ON public.signal_logs 
FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.strategies 
        WHERE id = public.signal_logs.strategy_id 
        AND creator_id = auth.uid()
    )
);

-- 8. Define Policies for public.subscription_logs
-- Goal: Users can view logs for their own subscriptions.
DROP POLICY IF EXISTS "Users can view own subscription logs" ON public.subscription_logs;
CREATE POLICY "Users can view own subscription logs" 
ON public.subscription_logs 
FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.user_strategies 
        WHERE id = public.subscription_logs.subscription_id 
        AND user_id = auth.uid()
    )
);

-- Documentation
COMMENT ON TABLE public.broker_accounts IS 'Sensitive broker credentials. RLS enforced.';
COMMENT ON TABLE public.creator_revenue IS 'Creator financial data. RLS enforced.';
