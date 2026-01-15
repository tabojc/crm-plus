
# Workflow: Deploy to Supabase Production

## Prerequisites
- A created project at [database.new](https://database.new)
- Usage of `supabase` CLI

## Steps

### 1. Link Project (Connect Local to Prod)
Link your local environment to the remote project. You need the **Project Ref** (e.g., `yqjlz...` from the URL).

```bash
npx supabase link --project-ref <PROJECT_ID>
```
*You will need the Database Password you set when creating the project.*

### 2. Push Schema (Structure)
Apply the `contacts` and `products` tables to production.

```bash
npx supabase db push
```

### 3. Push Data (Content)
We reuse our import script, but we need to feed it the **Production Credentials**.

1. Create `.env.production` (or just edit `.env.local` temporarily) with:
   - `NEXT_PUBLIC_SUPABASE_URL` = (Your Prod URL)
   - `SUPABASE_SERVICE_ROLE_KEY` = (Your Prod Service Role Key - Find in Project Settings > API)

2. Run the script:
   ```bash
   npx tsx scripts/import-to-supabase.ts
   ```
