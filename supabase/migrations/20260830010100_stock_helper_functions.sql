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

-- Solo callable por service_role (las funciones no son visibles para
-- anon/authenticated salvo que se otorgue explícitamente, y aquí no se hace).
revoke all on function public.decrement_stock_if_available(uuid, integer) from public;
revoke all on function public.increment_stock(uuid, integer) from public;
