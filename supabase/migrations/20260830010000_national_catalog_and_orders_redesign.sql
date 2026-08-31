-- ============================================================
-- CATÁLOGO (fuente de verdad para precio y stock, solo nacional)
-- ============================================================
drop table if exists public.products cascade;

create table public.products (
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

create table public.product_sizes (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  size text not null check (size in ('S','M','L','XL','XXL')),
  stock integer not null default 0 check (stock >= 0),
  extra_price_cop integer not null default 0 check (extra_price_cop >= 0),
  unique (product_id, size)
);

create table public.shipping_zones (
  id uuid primary key default gen_random_uuid(),
  department text unique not null,
  shipping_cop integer not null check (shipping_cop >= 0)
);

alter table public.products enable row level security;
alter table public.product_sizes enable row level security;
alter table public.shipping_zones enable row level security;

-- Lectura pública del catálogo (no sensible), sin escritura para nadie
-- fuera de service_role.
create policy "products_public_read" on public.products
  for select to anon, authenticated using (active = true);
create policy "product_sizes_public_read" on public.product_sizes
  for select to anon, authenticated using (true);

-- shipping_zones NO se expone públicamente (evita que el cliente calcule
-- su propio envío); el servidor la consulta con service_role.

-- Semilla: catálogo real actual (5 camisas), tallas S-XXL, stock inicial
-- de ejemplo (AJUSTA el stock real desde el editor de tablas de Supabase).
insert into public.products (slug, name, description, price_cop, image_front_url) values
  ('machine-girl', 'INTI(t) MACHINE GIRL', 'Camisa oversize negra con print full-front inspirado en el artwork japonés de breakcore.', 79999, '/images/machine_girl.webp'),
  ('aphex', 'INTI(t) AFX-47', 'Negro lavado con print AFX-47 en frente, logo circular morado y lettering INTI-net.', 79999, '/images/aphex.webp'),
  ('creeper', 'INTI(t) CREEPER', 'Verde bosque con print pixelado y tribal cyber-sigil en negro.', 79999, '/images/creeper.webp'),
  ('2003', 'INTI(t) 2003', 'Blanco oversize con número 2003 en efecto de baja resolución.', 79999, '/images/2003.webp'),
  ('2005', 'INTI(t) 2005', 'Blanco oversize con número 2005 pixelado en alto contraste.', 79999, '/images/2005.webp');

insert into public.product_sizes (product_id, size, stock, extra_price_cop)
select p.id, s.size, 10, case when s.size = 'XXL' then 15000 else 0 end
from public.products p
cross join (values ('S'),('M'),('L'),('XL'),('XXL')) as s(size);

insert into public.shipping_zones (department, shipping_cop) values
  ('Bogotá D.C.', 10000),
  ('Cundinamarca', 11000),
  ('Antioquia', 12000),
  ('Valle del Cauca', 12000),
  ('Atlántico', 13000),
  ('Santander', 13000),
  ('Otro', 17000);

-- ============================================================
-- PEDIDOS (multi-producto, nacional, sin lógica internacional)
-- ============================================================
alter table public.orders
  drop column if exists product_id,
  drop column if exists product_slug,
  drop column if exists product_name,
  drop column if exists size,
  drop column if exists quantity,
  drop column if exists price,
  drop column if exists payment_method,
  drop column if exists full_name,
  drop column if exists phone,
  drop column if exists city,
  drop column if exists address,
  drop column if exists customer_city,
  drop column if exists customer_address,
  drop column if exists shipping_name,
  drop column if exists shipping_phone,
  drop column if exists region,
  drop column if exists subtotal_cents,
  drop column if exists shipping_cents;

update public.orders set items = '[]'::jsonb where items is null;
alter table public.orders
  alter column items set default '[]'::jsonb,
  alter column items set not null;

alter table public.orders
  add column if not exists subtotal_cop integer not null default 0,
  add column if not exists shipping_cop integer not null default 0,
  add column if not exists customer_email text,
  add column if not exists shipping_department text,
  add column if not exists updated_at timestamptz not null default now();

alter table public.orders alter column status set default 'pending';
update public.orders set status = 'pending' where status = 'PENDING';
alter table public.orders drop constraint if exists orders_status_check;
alter table public.orders add constraint orders_status_check
  check (status in ('pending','VENTA REALIZADA','declined','error'));

-- Ya estaba correctamente bloqueado, se reafirma explícitamente:
revoke all on public.orders from anon, authenticated;
