revoke execute on function public.decrement_stock_if_available(uuid, integer) from anon, authenticated;
revoke execute on function public.increment_stock(uuid, integer) from anon, authenticated;
alter type public.order_status add value if not exists 'VENTA REALIZADA';