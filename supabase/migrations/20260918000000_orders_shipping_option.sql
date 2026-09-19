-- Guarda en cada pedido la opción de envío que escogió el cliente en el
-- checkout. Es idempotente: si alguna columna ya existe en tu base de datos
-- (por ejemplo, creada desde el panel), no pasa nada.
--
-- Importante: `shipping_cop` (ya existente) sigue siendo el ÚNICO monto de
-- envío que se suma al cobro de Wompi (83.050 solo para intl_ultra_mx, 0 en
-- todo lo demás). `shipping_estimate_cop` es solo lo que el cliente vio en
-- pantalla (informativo).

alter table public.orders
  add column if not exists shipping_method text,
  add column if not exists shipping_carrier text,
  add column if not exists shipping_service text,
  add column if not exists shipping_estimate_cop integer,
  add column if not exists shipping_confirmed_at timestamptz;

-- Valores permitidos. Se incluyen intl_premium e intl_ultra solo por si ya
-- existen pedidos de pruebas anteriores con esos valores.
alter table public.orders drop constraint if exists orders_shipping_method_check;
alter table public.orders add constraint orders_shipping_method_check
  check (
    shipping_method is null
    or shipping_method in (
      'domestic',
      'domestic_unquoted',
      'intl_express',
      'intl_economica',
      'intl_ultra_mx',
      'intl_unquoted',
      'intl_premium',
      'intl_ultra'
    )
  );

comment on column public.orders.shipping_method is
  'Opción de envío elegida: domestic | domestic_unquoted | intl_express | intl_economica | intl_ultra_mx | intl_unquoted';
comment on column public.orders.shipping_estimate_cop is
  'Estimado de envío que vio el cliente (informativo, no se cobra por Wompi salvo intl_ultra_mx).';
comment on column public.orders.shipping_confirmed_at is
  'Momento en que el cliente marcó la casilla de confirmación de la información de envío.';
