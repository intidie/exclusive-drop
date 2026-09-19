import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useCart } from "@/lib/cart-context";
import { FREE_SHIPPING_THRESHOLD_COP, PRICE, PRODUCTS, XXL_SURCHARGE_COP } from "@/lib/drop-data";
import { useDisplayCurrency } from "@/lib/use-currency";
import WompiCheckout from "@/components/WompiCheckout";

// Precio estimado para mostrar en el carrito antes de pagar. El monto real
// que se cobra siempre lo recalcula el servidor (src/routes/api.checkout.ts)
// contra Supabase — esto es solo para que el usuario vea un total mientras
// arma su pedido.
function estimateUnitPrice(slug: string, size: string) {
  const base = PRODUCTS.find((p) => p.slug === slug)?.price ?? PRICE;
  return base + (size === "XXL" ? XXL_SURCHARGE_COP : 0);
}

export function CartButton() {
  const { count, openCart } = useCart();
  return (
    <button
      type="button"
      onClick={openCart}
      aria-label="Abrir carrito"
      className="fixed bottom-5 left-5 z-40 w-12 h-12 flex items-center justify-center bg-white text-black border border-white hover:bg-black hover:text-white transition-colors"
    >
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.6">
        <circle cx="9" cy="20" r="1.4" fill="currentColor" stroke="none" />
        <circle cx="18" cy="20" r="1.4" fill="currentColor" stroke="none" />
        <path d="M2.5 3h2l2.2 12.1a2 2 0 0 0 2 1.6h8.6a2 2 0 0 0 2-1.6L21 7H6" />
      </svg>
      {count > 0 && (
        <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] px-1 rounded-full bg-red-600 text-white text-[10px] flex items-center justify-center font-mono">
          {count}
        </span>
      )}
    </button>
  );
}

export default function CartDrawer() {
  const { items, removeItem, updateQty, isOpen, closeCart } = useCart();
  const { format, isInternational } = useDisplayCurrency();
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeCart();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, closeCart]);

  const subtotal = items.reduce((sum, i) => sum + estimateUnitPrice(i.slug, i.size) * i.qty, 0);
  const missing = Math.max(0, FREE_SHIPPING_THRESHOLD_COP - subtotal);
  const progress = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD_COP) * 100));

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[95] bg-black/70"
            onClick={closeCart}
          >
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="absolute right-0 top-0 h-full w-full sm:w-[420px] bg-black text-white border-l border-white/25 flex flex-col"
            >
              <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
                <p className="text-[10px] tracking-[0.3em] uppercase">Tu carrito</p>
                <button
                  onClick={closeCart}
                  aria-label="Cerrar carrito"
                  className="w-9 h-9 flex items-center justify-center border border-white/25 hover:bg-white hover:text-black transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                {items.length === 0 && (
                  <p className="text-sm text-white/50 py-10 text-center">Tu carrito está vacío.</p>
                )}
                {items.map((i) => {
                  const thumb = PRODUCTS.find((p) => p.slug === i.slug)?.image;
                  return (
                    <div key={`${i.slug}-${i.size}`} className="border border-white/15 p-3 flex flex-col gap-2">
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex items-start gap-3 min-w-0">
                          {thumb && (
                            <div className="w-14 h-14 shrink-0 border border-white/20 bg-white overflow-hidden">
                              <img src={thumb} alt={i.name} className="w-full h-full object-cover" loading="lazy" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="text-sm font-semibold leading-tight">{i.name}</p>
                            <p className="text-xs text-white/50 mt-1">Talla {i.size}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => removeItem(i.slug, i.size)}
                          aria-label={`Quitar ${i.name}`}
                          className="text-xs text-white/50 hover:text-red-400 underline underline-offset-4 shrink-0"
                        >
                          Quitar
                        </button>
                      </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center border border-white/25">
                        <button
                          type="button"
                          onClick={() => updateQty(i.slug, i.size, i.qty - 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-white hover:text-black"
                          aria-label="Restar"
                        >
                          −
                        </button>
                        <span className="w-8 text-center text-sm font-mono">{i.qty}</span>
                        <button
                          type="button"
                          onClick={() => updateQty(i.slug, i.size, i.qty + 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-white hover:text-black"
                          aria-label="Sumar"
                        >
                          +
                        </button>
                      </div>
                      <p className="text-sm font-mono">
                        {format(estimateUnitPrice(i.slug, i.size) * i.qty)}
                      </p>
                    </div>
                  </div>
                );
              })}
              </div>

              {items.length > 0 && (
                <div className="border-t border-white/10 px-6 py-4 space-y-3">
                  <div className="h-1 bg-white/10">
                    <div className="h-1 bg-emerald-400 transition-all" style={{ width: `${progress}%` }} />
                  </div>
                  {isInternational ? (
                    <p className="text-[11px] text-white/55">
                      El envío internacional se cotiza en el formulario de pago y no se cobra por Wompi (salvo la opción ultra-económica, solo México).
                    </p>
                  ) : missing > 0 ? (
                    <p className="text-[11px] text-white/55">
                      Agrega ${missing.toLocaleString("es-CO")} más y el envío nacional es gratis.
                    </p>
                  ) : (
                    <p className="text-[11px] text-emerald-400">Envío nacional gratis desbloqueado.</p>
                  )}
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span className="font-mono">{format(subtotal)}</span>
                  </div>
                  <p className="text-[10px] text-white/40">
                    El envío (si aplica) no se cobra por Wompi, salvo la opción ultra-económica para México. Talla XXL
                    incluye un recargo de {format(XXL_SURCHARGE_COP)}.
                  </p>
                  <button
                    type="button"
                    onClick={() => setCheckoutOpen(true)}
                    className="group w-full bg-white text-black hover:bg-transparent hover:text-white border border-white transition-colors"
                  >
                    <span className="flex items-center justify-center gap-2 h-12">
                      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.6">
                        <circle cx="9" cy="20" r="1.4" fill="currentColor" stroke="none" />
                        <circle cx="18" cy="20" r="1.4" fill="currentColor" stroke="none" />
                        <path d="M2.5 3h2l2.2 12.1a2 2 0 0 0 2 1.6h8.6a2 2 0 0 0 2-1.6L21 7H6" />
                      </svg>
                      <span className="text-sm tracking-[0.2em] uppercase font-semibold">Comprar</span>
                    </span>
                    <span className="flex items-center justify-center gap-2 h-8 border-t border-black/10 group-hover:border-white/10">
                      <img src="/images/bancolombia-white.png" alt="Bancolombia" className="h-3.5 w-auto invert group-hover:invert-0" />
                      <span className="text-[9px] tracking-[0.15em] uppercase opacity-70">Compra verificada por Bancolombia</span>
                    </span>
                  </button>
                </div>
              )}
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      <WompiCheckout open={checkoutOpen} onClose={() => setCheckoutOpen(false)} items={items} />
    </>
  );
}
