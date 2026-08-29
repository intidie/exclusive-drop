GRANT INSERT ON public.orders TO anon;
CREATE POLICY "orders_insert_guest" ON public.orders
  FOR INSERT TO anon
  WITH CHECK (status = 'pending' AND user_id IS NULL);