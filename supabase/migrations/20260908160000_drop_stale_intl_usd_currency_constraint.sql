-- Esta constraint es un residuo de cuando los pedidos internacionales se
-- cobraban en USD con una cuenta Wompi aparte. Esa lógica ya se quitó del
-- código (ahora TODO se cobra en COP, nacional o internacional), pero esta
-- constraint se quedó exigiendo currency='USD' para country='INTL', lo cual
-- contradice a orders_currency_check (que solo permite 'COP'). Resultado:
-- CUALQUIER pedido internacional fallaba al insertarse ("No pudimos
-- registrar tu pedido"), porque ninguna fila puede satisfacer ambas a la vez.
ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_country_currency_consistency;
