-- QUOTES TABLE
create table quotes (
  id uuid primary key default gen_random_uuid(),
  contact_id uuid references contacts(id),
  total numeric default 0,
  status text check (status in ('draft', 'sent', 'closed')) default 'draft',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- QUOTE ITEMS TABLE
create table quote_items (
  id uuid primary key default gen_random_uuid(),
  quote_id uuid references quotes(id) on delete cascade,
  product_id uuid references products(id),
  product_name text, -- Snapshot incase product deleted/changed
  quantity numeric default 1,
  unit_price numeric default 0,
  total numeric default 0
);

-- RLS
alter table quotes enable row level security;
alter table quote_items enable row level security;

-- Policies (Single Tenant)
create policy "Enable all access for authenticated users" on quotes for all to authenticated using (true) with check (true);
create policy "Enable all access for authenticated users" on quote_items for all to authenticated using (true) with check (true);

-- Indexes
create index quotes_contact_idx on quotes(contact_id);
create index quote_items_quote_idx on quote_items(quote_id);
