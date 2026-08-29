import { createClient } from "@supabase/supabase-js";

// Cliente de navegador tolerante: usa las variables VITE_* si existen,
// y si no, cae en los valores públicos del proyecto (no son secretos).
const URL_FALLBACK = "https://jsshkhhhighvvnlvyezs.supabase.co";
const KEY_FALLBACK = "sb_publishable_X7yv-oBxgN7R9TrYav1oMg_hYmV_k2Y";

const url =
  (import.meta.env["VITE_SUPABASE_URL"] as string | undefined) || URL_FALLBACK;
const key =
  (import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"] as string | undefined) ||
  (import.meta.env["VITE_SUPABASE_ANON_KEY"] as string | undefined) ||
  KEY_FALLBACK;

export const supabaseBrowser = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
  global: {
    fetch: (input, init) => {
      const headers = new Headers(init?.headers);
      if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) {
        headers.delete("Authorization");
      }
      headers.set("apikey", key);
      return fetch(input, { ...init, headers });
    },
  },
});
