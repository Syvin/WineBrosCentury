-- Wine Century Bros performance indexes for common read/write paths
create index if not exists idx_inventory_vintage_desc on public.inventory (vintage desc);
create index if not exists idx_inventory_category on public.inventory (category);
create index if not exists idx_inventory_region on public.inventory (region);

create index if not exists idx_inquiries_created_at_desc on public.inquiries (created_at desc);
create index if not exists idx_inquiries_status on public.inquiries (status);
