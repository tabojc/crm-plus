-- Migration generated from scripts/fix_quote_items.ts

-- Link quote items to products where the link is missing but the name matches
UPDATE quote_items qi
SET product_id = p.id
FROM products p
WHERE qi.product_name = p.name
AND qi.product_id IS NULL;
