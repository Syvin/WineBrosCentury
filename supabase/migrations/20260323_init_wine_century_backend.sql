-- Wine Century Bros initial backend schema
-- Enables UUID generation helper.
create extension if not exists pgcrypto;

-- INVENTORY TABLE
create table if not exists public.inventory (
  id uuid primary key default gen_random_uuid(),
  sku text not null unique,
  name text not null,
  vintage integer not null,
  region text not null,
  price numeric(12,2) not null check (price >= 0),
  stock integer not null check (stock >= 0),
  image_url text,
  category text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- INQUIRIES TABLE
create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  full_name text not null,
  email text not null,
  message text not null,
  status text not null default 'new' check (status in ('new', 'contacted', 'archived'))
);

-- RLS
alter table public.inventory enable row level security;
alter table public.inquiries enable row level security;

-- SECURITY POLICIES: inventory
create policy "inventory_public_select"
  on public.inventory
  for select
  to anon, authenticated
  using (true);

create policy "inventory_service_role_all"
  on public.inventory
  for all
  to service_role
  using (true)
  with check (true);

-- SECURITY POLICIES: inquiries
create policy "inquiries_public_insert"
  on public.inquiries
  for insert
  to anon, authenticated
  with check (true);

create policy "inquiries_service_role_all"
  on public.inquiries
  for all
  to service_role
  using (true)
  with check (true);
