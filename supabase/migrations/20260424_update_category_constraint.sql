-- Migration: Update category constraint to match new multi-sheet tab names.
-- The old constraint only allowed 'Red', 'White', 'Sparkling'.
-- The new constraint allows all 11 product category sheet names.

alter table public.inventory
  drop constraint if exists inventory_category_check;

alter table public.inventory
  add constraint inventory_category_check
  check (category in (
    'WHISKY',
    'BEER',
    'WINES',
    'COGNAC',
    'VODKA-TEQUILA',
    'CHINESE-BAIJIU',
    'JAPANESE',
    'KOREAN',
    'LIQUEUR-GIN',
    'RUM-BRANDY',
    'SPARKLING-NON-ALCOHOLIC'
  ));
