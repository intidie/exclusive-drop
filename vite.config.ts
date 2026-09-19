// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only using cloudflare as a default target),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// El tipo de `nitro` que expone `@lovable.dev/vite-tanstack-config` es
// intencionalmente angosto y no incluye `noExternals` (ver su propio
// comentario: "File an issue if you need more"), aunque Nitro sí lo
// soporta en runtime. Se tipa acá aparte, como variable, para que el
// chequeo de propiedades excedentes de TypeScript (que solo aplica a
// objetos literales pasados directo) no lo rechace.
const nitroConfig: { preset: string; noExternals: string[] } = {
  preset: "vercel",
  // `tslib` (dependencia interna de @supabase/functions-js y otros
  // paquetes compilados con TypeScript) tiene un "exports" map
  // condicional que el rastreador de dependencias de Nitro/Vercel no
  // siempre copia completo al bundle de la función — eso causaba
  // "Cannot find package 'tslib'" en producción aunque localmente
  // compilaba bien. Forzamos a que se empaquete DENTRO del chunk (en
  // vez de quedar como dependencia externa a resolver en runtime), así
  // no depende de que el trace la encuentre.
  noExternals: ["tslib"],
};

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  nitro: nitroConfig,
});
