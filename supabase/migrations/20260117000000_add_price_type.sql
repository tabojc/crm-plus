-- Add price_type column to quote_items table
-- 1 = List Price, 2 = Offer Price, 3 = Min Price
ALTER TABLE quote_items 
ADD COLUMN price_type SMALLINT DEFAULT 1;

COMMENT ON COLUMN quote_items.price_type IS '1=List, 2=Offer, 3=Min';
