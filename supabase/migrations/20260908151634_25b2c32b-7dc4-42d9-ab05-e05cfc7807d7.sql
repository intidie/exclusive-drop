-- Columnas que el checkout ya envía para pedidos nacionales e internacionales
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS doc_type text,
  ADD COLUMN IF NOT EXISTS doc_number text,
  ADD COLUMN IF NOT EXISTS id_number text,
  ADD COLUMN IF NOT EXISTS postal_code text,
  ADD COLUMN IF NOT EXISTS state text,
  ADD COLUMN IF NOT EXISTS destination_country text;

-- Registro de visitas por origen (ej. bio de Instagram)
CREATE TABLE public.site_visits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source text NOT NULL DEFAULT 'direct',
  referrer text,
  user_agent text,
  path text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.site_visits TO service_role;
ALTER TABLE public.site_visits ENABLE ROW LEVEL SECURITY;