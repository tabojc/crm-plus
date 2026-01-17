-- Migration generated from scripts/add_quote_number_migration.ts

-- 1. Add number column to quotes
ALTER TABLE quotes 
ADD COLUMN IF NOT EXISTS "number" SERIAL;

-- 2. Add address column to contacts
ALTER TABLE contacts 
ADD COLUMN IF NOT EXISTS address TEXT DEFAULT 'Maracay';
