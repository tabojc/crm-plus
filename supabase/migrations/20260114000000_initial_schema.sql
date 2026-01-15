
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- CONTACTS TABLE (13k+ records)
-- RLS: Enabled (Private data)
create table contacts (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text,             -- Raw formatting
  waid text unique,       -- WhatsApp ID (Clean version for API)
  organization text,
  email text,
  tags text[] default '{}', -- e.g. ['vip', 'proveedor']
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table contacts enable row level security;

-- Policy: Allow authenticated users to do everything (Single Tenant / Admin-only for now)
create policy "Enable all access for authenticated users" 
on contacts for all 
to authenticated 
using (true) 
with check (true);


-- PRODUCTS TABLE (Catalog)
create table products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  
  -- The 3 Price Tiers
  price_list numeric not null default 0,    -- PRECIO VENTA USD/BCV (Standard)
  price_min numeric default 0,              -- PRECIO MINIMO (Floor)
  price_offer numeric default 0,            -- DTO 30% (Promo)
  
  category text,
  image_url text, -- To be populated later or from PDF extraction
  
  in_stock boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table products enable row level security;

create policy "Enable all access for authenticated users" 
on products for all 
to authenticated 
using (true) 
with check (true);

-- Indexes for fast search
create index contacts_name_idx on contacts using gin(to_tsvector('english', full_name));
create index contacts_waid_idx on contacts(waid);
create index products_name_idx on products using gin(to_tsvector('spanish', name));
