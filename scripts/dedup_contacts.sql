-- 1. Identify Duplicates by Name (Optional check)
/*
SELECT full_name, COUNT(*)
FROM contacts
GROUP BY full_name
HAVING COUNT(*) > 1;
*/

-- 2. Deduplicate: Keep the row with a WAID if possible, otherwise keep the oldest.
-- We use a CTE to identify records to delete.
WITH duplicates AS (
  SELECT id,
         ROW_NUMBER() OVER (
           PARTITION BY full_name 
           ORDER BY 
             CASE WHEN waid IS NOT NULL THEN 0 ELSE 1 END, -- Prioritize records with WAID
             created_at ASC -- Then keep the oldest (original)
         ) as rn
  FROM contacts
)
DELETE FROM contacts
WHERE id IN (
  SELECT id FROM duplicates WHERE rn > 1
);

-- 3. (Optional) Add full_name unique constraint? 
-- typically names can repeat in real life, but for this CRM maybe we want uniqueness?
-- ALTER TABLE contacts ADD CONSTRAINT contacts_fullname_key UNIQUE (full_name);
