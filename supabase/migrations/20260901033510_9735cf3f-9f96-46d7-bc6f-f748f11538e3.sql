create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text,
  price_cop integer not null check (price_cop > 0),
  image_front_url text,
  image_back_url text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.product_sizes (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  size text not null check (size in ('S','M','L','XL','XXL')),
  stock integer not null default 0 check (stock >= 0),
  extra_price_cop integer not null default 0 check (extra_price_cop >= 0),
  unique (product_id, size)
);

create table if not exists public.shipping_zones (
  id uuid primary key default gen_random_uuid(),
  department text unique not null,
  shipping_cop integer not null check (shipping_cop >= 0)
);

grant select on public.products to anon, authenticated;
grant select on public.product_sizes to anon, authenticated;
grant all on public.products to service_role;
grant all on public.product_sizes to service_role;
grant all on public.shipping_zones to service_role;

alter table public.products enable row level security;
alter table public.product_sizes enable row level security;
alter table public.shipping_zones enable row level security;

drop policy if exists products_public_read on public.products;
create policy products_public_read on public.products
  for select to anon, authenticated using (active = true);
drop policy if exists product_sizes_public_read on public.product_sizes;
create policy product_sizes_public_read on public.product_sizes
  for select to anon, authenticated using (true);

insert into public.products (slug, name, description, price_cop, image_front_url) values
  ('machine-girl', 'INTI(t) MACHINE GIRL', 'Camisa oversize negra con print full-front.', 79999, '/images/machine_girl.webp'),
  ('aphex', 'INTI(t) AFX-47', 'Negro lavado con print AFX-47.', 79999, '/images/aphex.webp'),
  ('creeper', 'INTI(t) CREEPER', 'Verde bosque con print pixelado.', 79999, '/images/creeper.webp'),
  ('2003', 'INTI(t) 2003', 'Blanco oversize con numero 2003.', 79999, '/images/2003.webp'),
  ('2005', 'INTI(t) 2005', 'Blanco oversize con numero 2005.', 79999, '/images/2005.webp')
on conflict (slug) do nothing;

insert into public.product_sizes (product_id, size, stock, extra_price_cop)
select p.id, s.size, 10, 0
from public.products p
cross join (values ('S'),('M'),('L'),('XL'),('XXL')) as s(size)
on conflict (product_id, size) do nothing;

insert into public.shipping_zones (department, shipping_cop) values
  ('Bogota D.C.', 10000),
  ('Cundinamarca', 11000),
  ('Antioquia', 12000),
  ('Valle del Cauca', 12000),
  ('Atlantico', 13000),
  ('Santander', 13000),
  ('Otro', 17000)
on conflict (department) do nothing;

alter table public.orders
  add column if not exists items jsonb not null default '[]'::jsonb,
  add column if not exists subtotal_cop integer not null default 0,
  add column if not exists shipping_cop integer not null default 0,
  add column if not exists shipping_department text;

alter table public.orders
  alter column product_slug drop not null,
  alter column product_name drop not null,
  alter column size drop not null;

create or replace function public.decrement_stock_if_available(p_size_id uuid, p_qty integer)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_updated integer;
begin
  update public.product_sizes
    set stock = stock - p_qty
    where id = p_size_id and stock >= p_qty;
  get diagnostics v_updated = row_count;
  return v_updated > 0;
end;
$$;

create or replace function public.increment_stock(p_size_id uuid, p_qty integer)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.product_sizes set stock = stock + p_qty where id = p_size_id;
end;
$$;

revoke all on function public.decrement_stock_if_available(uuid, integer) from public;
revoke all on function public.increment_stock(uuid, integer) from public;