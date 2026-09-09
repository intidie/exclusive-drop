-- `email` y `tax_id` son residuos de una versión anterior del checkout
-- internacional (antes de que se consolidara en `customer_email`). Ningún
-- archivo del código actual (api.checkout.ts, api.wompi-webhook.ts,
-- WompiCheckout.tsx) los lee ni los escribe.
ALTER TABLE public.orders
  DROP COLUMN IF EXISTS email,
  DROP COLUMN IF EXISTS tax_id;
