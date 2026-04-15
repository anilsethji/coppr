-- Migration: Add Institutional Metadata for Official Releases
-- Description: Adds testimonials, promo videos, and performance screenshots to the strategies table.
-- Created: 2026-04-15

-- 1. Add testimonials column (JSONB for Hinglish AI narratives)
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'strategies' AND column_name = 'testimonials') THEN
        ALTER TABLE strategies ADD COLUMN testimonials JSONB DEFAULT '[]'::jsonb;
    END IF;
END $$;

-- 2. Add video_url column (Promo/Tutorial)
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'strategies' AND column_name = 'video_url') THEN
        ALTER TABLE strategies ADD COLUMN video_url TEXT;
    END IF;
END $$;

-- 3. Add thumbnail_url column (Video cover)
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'strategies' AND column_name = 'thumbnail_url') THEN
        ALTER TABLE strategies ADD COLUMN thumbnail_url TEXT;
    END IF;
END $$;

-- 4. Add screenshot_urls column (Array of performance proof images)
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'strategies' AND column_name = 'screenshot_urls') THEN
        ALTER TABLE strategies ADD COLUMN screenshot_urls TEXT[] DEFAULT '{}';
    END IF;
END $$;

-- 5. Add comment for documentation
COMMENT ON COLUMN strategies.testimonials IS 'AI-generated Hinglish testimonials stored as JSONB array';
COMMENT ON COLUMN strategies.screenshot_urls IS 'Array of URLs for verification screenshots';
