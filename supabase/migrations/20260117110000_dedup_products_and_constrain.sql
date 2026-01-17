-- Migration generated from scripts/dedup_products.sql

-- 1. Delete Duplicates (Keep the newest entry based on id logic from original script)
-- The original script used: DELETE FROM products a USING products b WHERE a.id < b.id AND a.name = b.name;
-- This keeps the one with the *largest* ID (typically the newest if UUIDs are sequential-ish or just arbitrary).
DELETE FROM products a
USING products b
WHERE a.id < b.id
AND a.name = b.name;

-- 2. Add Unique Constraint to prevent future duplicates (Idempotent)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'products_name_key'
    ) THEN
        ALTER TABLE products ADD CONSTRAINT products_name_key UNIQUE (name);
    END IF;
END $$;
