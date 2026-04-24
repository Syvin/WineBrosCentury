-- Add brand column to inventory for grouping products by brand.
ALTER TABLE public.inventory ADD COLUMN IF NOT EXISTS brand text;

-- Index for fast brand-based lookups and grouping.
CREATE INDEX IF NOT EXISTS idx_inventory_brand ON public.inventory(brand);

-- Auto-populate brand for existing rows by extracting the first word of the name if brand is blank. 
-- For complex brands like "DOM PERIGNON", the application fallback will group correctly, or you can manually adjust.
UPDATE public.inventory 
SET brand = split_part(name, ' ', 1)
WHERE brand IS NULL;
