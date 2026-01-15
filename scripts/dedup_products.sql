-- 1. Identify Duplicates (Optional check)
/*
SELECT name, COUNT(*)
FROM products
GROUP BY name
HAVING COUNT(*) > 1;
*/

-- 2. Delete Duplicates (Keep the oldest entry based on created_at or id)
DELETE FROM products a
USING products b
WHERE a.id < b.id
AND a.name = b.name;

-- 3. Add Unique Constraint to prevent future duplicates
ALTER TABLE products ADD CONSTRAINT products_name_key UNIQUE (name);
