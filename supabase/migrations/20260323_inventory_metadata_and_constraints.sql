-- Add metadata jsonb column to inventory (as specified in BACKEND_RULES).
alter table public.inventory
  add column if not exists metadata jsonb;

-- Enforce category values to match the WineCategory enum.
alter table public.inventory
  add constraint inventory_category_check
  check (category in ('Red', 'White', 'Sparkling'));

-- Function to automatically update updated_at on row modification.
create or replace function public.set_updated_at()
  returns trigger
  language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Trigger: keep inventory.updated_at in sync.
create trigger inventory_set_updated_at
  before update on public.inventory
  for each row
  execute function public.set_updated_at();
