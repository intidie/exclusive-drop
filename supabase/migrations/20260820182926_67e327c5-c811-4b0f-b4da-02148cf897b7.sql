CREATE TYPE public.order_status AS ENUM ('pending','approved','declined','error');

CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NULL,
  product_slug TEXT NOT NULL,
  product_name TEXT NOT NULL,
  size TEXT NOT NULL,
  amount_in_cents BIGINT NOT NULL CHECK (amount_in_cents > 0),
  currency TEXT NOT NULL DEFAULT 'COP',
  status public.order_status NOT NULL DEFAULT 'pending',
  wompi_reference TEXT NOT NULL UNIQUE,
  wompi_transaction_id TEXT NULL,
  access_token UUID NOT NULL DEFAULT gen_random_uuid(),
  customer_name TEXT NULL,
  customer_phone TEXT NULL,
  customer_email TEXT NULL,
  shipping_address TEXT NULL,
  shipping_city TEXT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX orders_user_id_idx ON public.orders (user_id);
CREATE INDEX orders_access_token_idx ON public.orders (access_token);

GRANT SELECT, INSERT ON public.orders TO authenticated;
GRANT ALL ON public.orders TO service_role;

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "orders_select_own" ON public.orders
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "orders_insert_own" ON public.orders
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER orders_set_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.orders REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;