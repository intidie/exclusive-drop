-- Los pedidos ahora se crean exclusivamente desde el servidor
-- (src/routes/api.checkout.ts), que valida el precio contra el catálogo y
-- usa la service role key. El cliente ya no debe poder insertar filas
-- directamente en `orders`, para que nadie pueda fijar su propio
-- amount_in_cents desde el navegador.

DROP POLICY IF EXISTS "orders_insert_guest" ON public.orders;
DROP POLICY IF EXISTS "orders_insert_own" ON public.orders;

REVOKE INSERT ON public.orders FROM anon;
REVOKE INSERT ON public.orders FROM authenticated;

-- Nadie por fuera de service_role puede actualizar el status del pedido:
-- eso solo lo hace el webhook (src/routes/api.wompi-webhook.ts) tras
-- verificar la firma del evento de Wompi.
REVOKE UPDATE ON public.orders FROM anon;
REVOKE UPDATE ON public.orders FROM authenticated;
