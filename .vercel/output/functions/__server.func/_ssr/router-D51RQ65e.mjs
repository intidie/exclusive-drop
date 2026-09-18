import { o as __toESM } from "../_runtime.mjs";
import { n as require_react, r as require_jsx_runtime, t as QueryClientProvider } from "../_libs/react+tanstack__react-query.mjs";
import { n as AnimatePresence } from "../_libs/framer-motion.mjs";
import { t as motion } from "../_libs/motion.mjs";
import { t as __exportAll } from "./rolldown-runtime-D7D4PA-g.mjs";
import { L as notFound, _ as Link, f as createRouter, g as createRootRouteWithContext, h as createFileRoute, l as Scripts, m as lazyRouteComponent, p as Outlet, u as HeadContent, v as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/drop-data-P2Vrpqco.js
var SIZES = [
	"S",
	"M",
	"L",
	"XL",
	"XXL"
];
var PRINT_SPEC = "Estampado en DTF máxima calidad. No le salen motas, máxima calidad.";
var XXL_SURCHARGE_COP = 15e3;
var ORIGINAL_PRICE = 99999;
var FREE_SHIPPING_THRESHOLD_COP = 25e4;
var DOC_TYPES = [
	{
		value: "CC",
		label: "Cédula de ciudadanía"
	},
	{
		value: "NIT",
		label: "NIT"
	},
	{
		value: "CE",
		label: "Cédula de extranjería"
	},
	{
		value: "PASAPORTE",
		label: "Pasaporte"
	},
	{
		value: "OTRO",
		label: "Otro"
	}
];
var DESTINATION_COUNTRIES = [
	{
		name: "Estados Unidos",
		dial: "+1"
	},
	{
		name: "México",
		dial: "+52"
	},
	{
		name: "Canadá",
		dial: "+1"
	},
	{
		name: "España",
		dial: "+34"
	},
	{
		name: "Argentina",
		dial: "+54"
	},
	{
		name: "Chile",
		dial: "+56"
	},
	{
		name: "Perú",
		dial: "+51"
	},
	{
		name: "Ecuador",
		dial: "+593"
	},
	{
		name: "Panamá",
		dial: "+507"
	},
	{
		name: "Costa Rica",
		dial: "+506"
	},
	{
		name: "Otro país",
		dial: ""
	}
];
function formatCop(cop) {
	return `$${Math.round(cop).toLocaleString("es-CO")}`;
}
function copToUsd(cop, trm) {
	return Math.round(cop / trm * 100) / 100;
}
function formatUsd(usd) {
	return `US$${usd.toLocaleString("en-US", {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2
	})}`;
}
var PRODUCTS = [
	{
		slug: "machine-girl",
		name: "INTI(t) MACHINE GIRL",
		image: "/images/machine_girl.webp",
		images: ["/images/machine_girl.webp", "/images/machine_girl_back.webp"],
		tag: "Footwork / Breakcore",
		description: "Camisa oversize negra con print full-front inspirado en el artwork japonés de breakcore. Tipografía kanji y gradientes ácidos sobre algodón pesado.",
		price: 79999
	},
	{
		slug: "aphex",
		name: "INTI(t) AFX-47",
		image: "/images/aphex.webp",
		images: ["/images/aphex.webp"],
		tag: "Ambient / IDM",
		description: "Negro lavado con print AFX-47 en frente, logo circular morado y lettering INTI-net en caligrafía. Detalles en mangas."
	},
	{
		slug: "creeper",
		name: "INTI(t) CREEPER",
		image: "/images/creeper.webp",
		images: ["/images/creeper.webp"],
		tag: "Cyber / Tribal",
		description: "Verde bosque con print pixelado y tribal cyber-sigil en negro. Prints laterales en ambas mangas."
	},
	{
		slug: "2003",
		name: "INTI(t) 2003",
		image: "/images/2003.webp",
		images: ["/images/2003.webp"],
		tag: "Blur Series",
		description: "Blanco oversize con número 2003 en efecto de baja resolución. Print INTI-net en manga izquierda."
	},
	{
		slug: "2005",
		name: "INTI(t) 2005",
		image: "/images/2005.webp",
		images: ["/images/2005.webp"],
		tag: "Blur Series",
		description: "Blanco oversize con número 2005 pixelado en alto contraste. Print INTI-net en manga izquierda."
	}
];
var getProduct = (slug) => PRODUCTS.find((p) => p.slug === slug);
var SIZE_GUIDE = [
	{
		size: "S",
		chest: 52,
		length: 68,
		shoulder: 48,
		sleeve: 21
	},
	{
		size: "M",
		chest: 55,
		length: 70,
		shoulder: 51,
		sleeve: 22
	},
	{
		size: "L",
		chest: 57,
		length: 72,
		shoulder: 53,
		sleeve: 23
	},
	{
		size: "XL",
		chest: 60,
		length: 74,
		shoulder: 56,
		sleeve: 24
	},
	{
		size: "XXL",
		chest: 64,
		length: 76,
		shoulder: 60,
		sleeve: 25
	}
];
var CONTACT = {
	instagram: "https://www.instagram.com/intitnet/",
	instagramHandle: "@intitnet"
};
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/router-D51RQ65e.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var cached;
var inflight = null;
var FALLBACK_TRM_GUESS = 4e3;
var cachedTrm;
var trmInflight = null;
function loadTrm() {
	if (cachedTrm !== void 0) return Promise.resolve(cachedTrm);
	if (!trmInflight) trmInflight = fetch("/api/fx").then((r) => r.ok ? r.json() : null).then((d) => {
		const rate = typeof d?.rate === "number" && d.rate > 0 ? d.rate : FALLBACK_TRM_GUESS;
		cachedTrm = rate;
		return rate;
	}).catch(() => {
		cachedTrm = FALLBACK_TRM_GUESS;
		return FALLBACK_TRM_GUESS;
	});
	return trmInflight;
}
function guessFromTimeZone() {
	try {
		const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
		if (!tz) return null;
		return tz === "America/Bogota" ? "CO" : "INTL";
	} catch {
		return null;
	}
}
function loadCountry() {
	if (cached !== void 0) return Promise.resolve(cached ?? null);
	if (!inflight) inflight = fetch("/api/geo").then((r) => r.ok ? r.json() : null).then((d) => d?.country ?? null).catch(() => null).then((c) => {
		cached = c ?? guessFromTimeZone();
		return cached ?? null;
	});
	return inflight;
}
function useDisplayCurrency() {
	const [country, setCountry] = (0, import_react.useState)(cached ?? null);
	const [trm, setTrm] = (0, import_react.useState)(cachedTrm ?? FALLBACK_TRM_GUESS);
	(0, import_react.useEffect)(() => {
		let alive = true;
		loadCountry().then((c) => {
			if (alive) setCountry(c);
		});
		loadTrm().then((rate) => {
			if (alive) setTrm(rate);
		});
		return () => {
			alive = false;
		};
	}, []);
	const isInternational = country != null && country !== "CO";
	return {
		country,
		isInternational,
		trm,
		/** Precio principal a mostrar según el país detectado. */
		format: (cop) => isInternational ? formatUsd(copToUsd(cop, trm)) : formatCop(cop),
		/** Equivalencia secundaria (la otra moneda). */
		formatAlt: (cop) => isInternational ? formatCop(cop) : formatUsd(copToUsd(cop, trm))
	};
}
function WompiVerifiedBadge({ className = "" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `flex items-center gap-2 ${className}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src: "/images/wompi-white.png",
			alt: "Wompi",
			className: "h-4 w-auto opacity-90"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-[10px] tracking-[0.15em] uppercase text-white/60",
			children: "Verificado por Bancolombia"
		})]
	});
}
function WompiBancolombiaLogos({ className = "" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `flex flex-col gap-2 ${className}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-[10px] tracking-[0.15em] uppercase text-white/45",
			children: "Wompi es parte del Grupo Bancolombia"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: "/images/wompi-white.png",
					alt: "Wompi",
					className: "h-5 w-auto opacity-90"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-white/20 text-lg leading-none",
					children: "×"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: "/images/bancolombia-white.png",
					alt: "Bancolombia",
					className: "h-4 w-auto opacity-90"
				})
			]
		})]
	});
}
var FALLBACK_TRM = 4e3;
var TTL_MS = 216e5;
var cache = null;
async function getUsdCopRate() {
	if (cache && Date.now() - cache.at < TTL_MS) return {
		rate: cache.rate,
		live: true
	};
	try {
		const res = await fetch("https://open.er-api.com/v6/latest/USD", { headers: { Accept: "application/json" } });
		if (res.ok) {
			const cop = (await res.json()).rates?.["COP"];
			if (typeof cop === "number" && cop > 500 && cop < 2e4) {
				cache = {
					rate: Math.round(cop),
					at: Date.now()
				};
				return {
					rate: cache.rate,
					live: true
				};
			}
		}
	} catch {}
	return {
		rate: cache?.rate ?? FALLBACK_TRM,
		live: cache != null
	};
}
var styles_default = "/assets/styles-DY5PgSBj.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
}
var STORAGE_KEY = "inti-cart-v1";
var CartContext = (0, import_react.createContext)(null);
function CartProvider({ children }) {
	const [items, setItems] = (0, import_react.useState)([]);
	const [isOpen, setIsOpen] = (0, import_react.useState)(false);
	const [hydrated, setHydrated] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		try {
			const raw = window.localStorage.getItem(STORAGE_KEY);
			if (raw) setItems(JSON.parse(raw));
		} catch {}
		setHydrated(true);
	}, []);
	(0, import_react.useEffect)(() => {
		if (!hydrated) return;
		try {
			window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
		} catch {}
	}, [items, hydrated]);
	function addItem(item, qty = 1) {
		setItems((prev) => {
			const idx = prev.findIndex((i) => i.slug === item.slug && i.size === item.size);
			if (idx >= 0) {
				const next = [...prev];
				next[idx] = {
					...next[idx],
					qty: Math.min(next[idx].qty + qty, 10)
				};
				return next;
			}
			return [...prev, {
				...item,
				qty: Math.min(qty, 10)
			}];
		});
	}
	function removeItem(slug, size) {
		setItems((prev) => prev.filter((i) => !(i.slug === slug && i.size === size)));
	}
	function updateQty(slug, size, qty) {
		setItems((prev) => prev.map((i) => i.slug === slug && i.size === size ? {
			...i,
			qty: Math.max(0, Math.min(qty, 10))
		} : i).filter((i) => i.qty > 0));
	}
	function clear() {
		setItems([]);
	}
	const count = items.reduce((sum, i) => sum + i.qty, 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartContext.Provider, {
		value: {
			items,
			addItem,
			removeItem,
			updateQty,
			clear,
			count,
			isOpen,
			openCart: () => setIsOpen(true),
			closeCart: () => setIsOpen(false)
		},
		children
	});
}
function useCart() {
	const ctx = (0, import_react.useContext)(CartContext);
	if (!ctx) throw new Error("useCart debe usarse dentro de <CartProvider>");
	return ctx;
}
function loadWidget() {
	if (typeof window === "undefined") return Promise.resolve();
	if (window.WidgetCheckout) return Promise.resolve();
	return new Promise((resolve, reject) => {
		const s = document.createElement("script");
		s.src = "https://checkout.wompi.co/widget.js";
		s.async = true;
		s.onload = () => resolve();
		s.onerror = () => reject(/* @__PURE__ */ new Error("No pudimos cargar el checkout de Wompi."));
		document.head.appendChild(s);
	});
}
var DRAFT_KEY = "inti-checkout-draft-v1";
var EMPTY_DRAFT = {
	name: "",
	phone: "",
	email: "",
	city: "",
	address: "",
	country: "",
	docType: "",
	docNumber: "",
	department: "",
	idNumber: "",
	postalCode: "",
	state: "",
	destinationCountry: ""
};
function loadDraft() {
	if (typeof window === "undefined") return EMPTY_DRAFT;
	try {
		const raw = window.localStorage.getItem(DRAFT_KEY);
		if (!raw) return EMPTY_DRAFT;
		return {
			...EMPTY_DRAFT,
			...JSON.parse(raw)
		};
	} catch {
		return EMPTY_DRAFT;
	}
}
function saveDraft(draft) {
	try {
		window.localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
	} catch {}
}
function estimateUnitPriceCop(slug, size) {
	return (PRODUCTS.find((p) => p.slug === slug)?.price ?? 89999) + (size === "XXL" ? XXL_SURCHARGE_COP : 0);
}
function WompiCheckout({ open, onClose, items }) {
	const [phase, setPhase] = (0, import_react.useState)("form");
	const [error, setError] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [draft, setDraft] = (0, import_react.useState)(EMPTY_DRAFT);
	const [totalCop, setTotalCop] = (0, import_react.useState)(null);
	const [turnstileToken, setTurnstileToken] = (0, import_react.useState)("");
	const [trm, setTrm] = (0, import_react.useState)(4e3);
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		fetch("/api/fx").then((r) => r.ok ? r.json() : null).then((d) => {
			if (!cancelled && typeof d?.rate === "number" && d.rate > 0) setTrm(d.rate);
		}).catch(() => {});
		return () => {
			cancelled = true;
		};
	}, []);
	const turnstileContainerRef = (0, import_react.useRef)(null);
	const turnstileWidgetIdRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		if (open) setDraft(loadDraft());
	}, [open]);
	(0, import_react.useEffect)(() => {
		if (!open || draft.country !== "") return;
		let cancelled = false;
		fetch("/api/geo").then((r) => r.json()).then((data) => {
			if (cancelled || !data?.country) return;
			updateDraft({ country: data.country === "CO" ? "CO" : "INTL" });
		}).catch(() => {});
		return () => {
			cancelled = true;
		};
	}, [open, draft.country]);
	(0, import_react.useEffect)(() => {
		if (!open) {
			setPhase("form");
			setError(null);
			setBusy(false);
			setTotalCop(null);
			setTurnstileToken("");
			return;
		}
		console.error("Falta VITE_TURNSTILE_SITE_KEY.");
	}, [open]);
	function updateDraft(patch) {
		setDraft((prev) => {
			const next = {
				...prev,
				...patch
			};
			saveDraft(next);
			return next;
		});
	}
	const estimatedSubtotalCop = items.reduce((sum, i) => sum + estimateUnitPriceCop(i.slug, i.size) * i.qty, 0);
	const estimatedSubtotalUsd = copToUsd(estimatedSubtotalCop, trm);
	const isNational = draft.country === "CO";
	const isInternational = draft.country === "INTL";
	const missingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD_COP - estimatedSubtotalCop);
	const isKnownDestination = DESTINATION_COUNTRIES.map((c) => c.name).filter((n) => n !== "Otro país").includes(draft.destinationCountry);
	const destinationSelectValue = draft.destinationCountry === "" ? "" : isKnownDestination ? draft.destinationCountry : "Otro país";
	const showOtherDestinationInput = destinationSelectValue === "Otro país";
	async function handleSubmit(e) {
		e.preventDefault();
		setError(null);
		if (!draft.country) {
			setError("Selecciona si tu compra es nacional (Colombia) o internacional.");
			return;
		}
		if (draft.country === "CO" && (!draft.docType || !draft.docNumber || !draft.department)) {
			setError("Faltan datos: tipo/número de documento de identidad o departamento.");
			return;
		}
		if (draft.country === "INTL" && (!draft.idNumber || !draft.email || !draft.postalCode || !draft.state || !draft.destinationCountry)) {
			setError("Para compras internacionales faltan datos: documento de identificación, correo, código postal, estado/provincia o país de destino.");
			return;
		}
		if (!turnstileToken) {
			setError("Completa la verificación de seguridad antes de continuar.");
			return;
		}
		setBusy(true);
		try {
			if (items.length === 0) throw new Error("Tu carrito está vacío.");
			const res = await fetch("/api/checkout", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					items: items.map((i) => ({
						slug: i.slug,
						size: i.size,
						qty: i.qty
					})),
					name: draft.name,
					phone: draft.phone,
					email: draft.email,
					city: draft.city,
					address: draft.address,
					country: draft.country,
					docType: draft.docType,
					docNumber: draft.docNumber,
					department: draft.department,
					idNumber: draft.idNumber,
					postalCode: draft.postalCode,
					state: draft.state,
					destinationCountry: draft.destinationCountry,
					turnstileToken
				})
			});
			const checkout = await res.json().catch(() => null);
			if (!res.ok || !checkout?.reference || !checkout.signature) throw new Error(checkout?.error ?? "No pudimos registrar tu pedido.");
			if (checkout.total != null) setTotalCop(checkout.total);
			await loadWidget();
			const Widget = window.WidgetCheckout;
			if (!Widget) throw new Error("No pudimos cargar el checkout de Wompi.");
			new Widget({
				currency: "COP",
				amountInCents: checkout.amountInCents,
				reference: checkout.reference,
				publicKey: checkout.publicKey,
				signature: { integrity: checkout.signature },
				redirectUrl: `${window.location.origin}/`
			}).open(() => {
				setPhase("sent");
				try {
					window.localStorage.removeItem(DRAFT_KEY);
				} catch {}
			});
		} catch (err) {
			setError(err instanceof Error ? err.message : "No pudimos iniciar el pago.");
			setTurnstileToken("");
			if (window.turnstile && turnstileWidgetIdRef.current) window.turnstile.reset(turnstileWidgetIdRef.current);
		} finally {
			setBusy(false);
		}
	}
	const field = "w-full bg-transparent border border-white/25 px-3 py-3 text-sm outline-none focus:border-white placeholder:text-white/35";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, { children: open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
		initial: { opacity: 0 },
		animate: { opacity: 1 },
		exit: { opacity: 0 },
		transition: { duration: .2 },
		className: "fixed inset-0 z-[100] bg-black/85 flex items-end sm:items-center justify-center p-0 sm:p-6",
		role: "dialog",
		"aria-modal": "true",
		"aria-label": "Pago con Wompi",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
			initial: {
				y: 40,
				opacity: 0
			},
			animate: {
				y: 0,
				opacity: 1
			},
			exit: {
				y: 40,
				opacity: 0
			},
			transition: {
				duration: .28,
				ease: [
					.22,
					1,
					.36,
					1
				]
			},
			className: "w-full sm:max-w-lg max-h-[92dvh] sm:max-h-[85dvh] bg-black text-white border border-white/25 flex flex-col overscroll-contain",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between border-b border-white/10 px-6 py-4 shrink-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[10px] tracking-[0.3em] uppercase",
					children: "Pago seguro · Wompi"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: onClose,
					"aria-label": "Cerrar",
					className: "w-9 h-9 flex items-center justify-center border border-white/25 hover:bg-white hover:text-black transition-colors",
					children: "✕"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "px-6 py-6 space-y-4 overflow-y-auto overscroll-contain flex-1",
				children: [
					phase === "form" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleSubmit,
						className: "space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-2xl font-display tracking-wide",
								children: "Tu pedido"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "text-sm text-white/70 space-y-1 border border-white/15 p-3",
								children: items.map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
									className: "flex justify-between",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
										i.name,
										" · ",
										i.size,
										" × ",
										i.qty
									] })
								}, `${i.slug}-${i.size}`))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[10px] tracking-[0.2em] uppercase text-white/55 mb-2",
								children: "¿Dónde recibes tu pedido?"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => updateDraft({ country: "CO" }),
									"aria-pressed": isNational,
									className: `border px-3 py-3 text-xs tracking-[0.1em] uppercase transition-colors ${isNational ? "bg-white text-black border-white" : "border-white/25 hover:border-white/60"}`,
									children: "Colombia"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => updateDraft({ country: "INTL" }),
									"aria-pressed": isInternational,
									className: `border px-3 py-3 text-xs tracking-[0.1em] uppercase transition-colors ${isInternational ? "bg-white text-black border-white" : "border-white/25 hover:border-white/60"}`,
									children: "Internacional"
								})]
							})] }),
							isNational && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-[11px] text-white/60",
								children: [
									"Subtotal estimado: ",
									formatCop(estimatedSubtotalCop),
									".",
									" ",
									missingForFreeShipping > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
										"Agrega ",
										formatCop(missingForFreeShipping),
										" más y el envío es gratis (solo Colombia)."
									] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-emerald-400",
										children: "Tu compra supera $250.000 — el envío nacional es gratis."
									})
								]
							}),
							isInternational && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-[11px] text-white/60 space-y-1.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
										"Subtotal estimado: ",
										formatUsd(estimatedSubtotalUsd),
										" USD (cobro procesado en pesos colombianos, TRM del día ",
										formatCop(trm),
										"/USD)."
									] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "El cobro se realiza en pesos colombianos (COP); si tu tarjeta o banco está en el extranjero, ellos hacen la conversión a tu moneda al momento de pagar. No somos responsables por la tasa de cambio ni por comisiones que aplique tu banco." }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "El envío internacional no está incluido en este pago: se cotiza y coordina aparte con nuestro equipo por Instagram después de la compra." })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between border-y border-white/10 py-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[10px] text-white/55 leading-relaxed max-w-[70%]",
									children: "Compra supervisada por Bancolombia · segura de extremo a extremo."
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: "/images/bancolombia-white.png",
									alt: "Bancolombia",
									className: "h-4 w-auto opacity-90"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: draft.name,
								onChange: (e) => updateDraft({ name: e.target.value }),
								required: true,
								maxLength: 80,
								placeholder: "Nombre completo o razón social",
								className: field
							}),
							isNational && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: draft.docType,
									onChange: (e) => updateDraft({ docType: e.target.value }),
									required: true,
									className: `${field} ${draft.docType === "" ? "text-white/35" : ""}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "",
										disabled: true,
										children: "Tipo de documento"
									}), DOC_TYPES.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: d.value,
										className: "bg-black",
										children: d.label
									}, d.value))]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: draft.docNumber,
									onChange: (e) => updateDraft({ docNumber: e.target.value }),
									required: true,
									maxLength: 40,
									placeholder: "Número de documento",
									className: field
								})]
							}),
							isInternational && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: draft.idNumber,
								onChange: (e) => updateDraft({ idNumber: e.target.value }),
								required: true,
								maxLength: 40,
								placeholder: "Documento de identificación / pasaporte del destinatario",
								className: field
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: draft.phone,
								onChange: (e) => updateDraft({ phone: e.target.value }),
								required: true,
								maxLength: 30,
								placeholder: isInternational ? "Teléfono de contacto (del país de destino, con código)" : "Teléfono celular o fijo",
								className: field
							}),
							isInternational && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: draft.email,
								onChange: (e) => updateDraft({ email: e.target.value }),
								type: "email",
								required: true,
								maxLength: 120,
								placeholder: "Correo electrónico",
								className: field
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: draft.address,
								onChange: (e) => updateDraft({ address: e.target.value }),
								required: true,
								maxLength: 200,
								placeholder: isInternational ? "Dirección exacta detallada" : "Dirección exacta (incluye barrio o indicaciones)",
								className: field
							}),
							isNational && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: draft.city,
									onChange: (e) => updateDraft({ city: e.target.value }),
									required: true,
									maxLength: 60,
									placeholder: "Ciudad",
									className: field
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: draft.department,
									onChange: (e) => updateDraft({ department: e.target.value }),
									required: true,
									maxLength: 60,
									placeholder: "Departamento",
									className: field
								})]
							}),
							isInternational && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										value: draft.postalCode,
										onChange: (e) => updateDraft({ postalCode: e.target.value }),
										required: true,
										maxLength: 20,
										placeholder: "Código postal (Zip Code)",
										className: field
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										value: draft.city,
										onChange: (e) => updateDraft({ city: e.target.value }),
										required: true,
										maxLength: 60,
										placeholder: "Ciudad",
										className: field
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: draft.state,
									onChange: (e) => updateDraft({ state: e.target.value }),
									required: true,
									maxLength: 60,
									placeholder: "Estado / provincia",
									className: field
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: destinationSelectValue,
									onChange: (e) => {
										const value = e.target.value;
										updateDraft({ destinationCountry: value === "Otro país" ? "" : value });
									},
									required: true,
									className: `${field} ${destinationSelectValue === "" ? "text-white/35" : ""}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "",
										disabled: true,
										children: "País de destino"
									}), DESTINATION_COUNTRIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
										value: c.name,
										className: "bg-black",
										children: [c.name, c.dial ? ` (${c.dial})` : ""]
									}, c.name))]
								}),
								showOtherDestinationInput && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: draft.destinationCountry,
									onChange: (e) => updateDraft({ destinationCountry: e.target.value }),
									required: true,
									maxLength: 60,
									placeholder: "Escribe tu país de destino",
									className: field
								})
							] }),
							error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-red-400",
								children: error
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								ref: turnstileContainerRef,
								className: "flex justify-center py-1"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "submit",
								disabled: busy || items.length === 0 || !turnstileToken,
								className: "group w-full h-16 flex flex-col items-center justify-center gap-1 bg-white text-black border border-white hover:bg-transparent hover:text-white transition-colors disabled:opacity-40",
								children: busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs tracking-[0.2em] uppercase font-semibold",
									children: "Preparando pago…"
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[9px] tracking-[0.2em] uppercase text-black/50 group-hover:text-white/50 transition-colors",
									children: "Pagar de forma segura"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: "/images/wompi-white.png",
											alt: "Wompi",
											className: "h-4 w-auto invert group-hover:invert-0 transition-[filter]"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-black/20 group-hover:text-white/20 text-sm leading-none transition-colors",
											children: "×"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: "/images/bancolombia-white.png",
											alt: "Bancolombia",
											className: "h-3.5 w-auto invert group-hover:invert-0 transition-[filter]"
										})
									]
								})] })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WompiVerifiedBadge, { className: "justify-center" }),
							isInternational ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[10px] text-white/45 leading-relaxed",
								children: "Pago internacional: se cobra en pesos colombianos (COP); tu banco hace la conversión a tu moneda. Tu camisa se hace a mano y se despacha 1 semana después de la compra; el envío internacional no está incluido en este pago y se coordina aparte con nuestro equipo."
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[10px] text-white/45 leading-relaxed",
								children: "Envío nacional: tu camisa se hace a mano y se despacha 1 semana después de la compra. Envío gratis en compras superiores a $250.000 (solo Colombia); por debajo de ese monto, el envío corre por cuenta del comprador y se coordina aparte."
							})
						]
					}),
					phase === "form" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-[45vh] shrink-0",
						"aria-hidden": "true"
					}),
					phase === "sent" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4 py-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-3xl font-display tracking-wide",
								children: "Pedido registrado"
							}),
							totalCop != null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-sm text-white/70 space-y-1 border-t border-white/10 pt-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between font-semibold text-white",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Total" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatCop(totalCop) })]
								}), isInternational && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-[11px] text-white/50",
									children: [
										"≈ ",
										formatUsd(copToUsd(totalCop, trm)),
										" USD (referencial). El monto cobrado por Wompi es siempre en pesos colombianos; la conversión final la hace tu banco."
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-white/70",
								children: "Tu pedido quedó registrado. Si el pago fue aprobado, tus camisas se elaboran a mano y se despachan 1 semana después de la compra. Cualquier duda escríbenos por Instagram."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: CONTACT.instagram,
								target: "_blank",
								rel: "noreferrer",
								className: "block text-center py-4 text-xs tracking-[0.2em] uppercase font-semibold border border-white/25 hover:bg-white hover:text-black transition-colors",
								children: [
									"Escríbenos por Instagram (",
									CONTACT.instagramHandle,
									")"
								]
							})
						]
					})
				]
			})]
		})
	}) });
}
function estimateUnitPrice(slug, size) {
	return (PRODUCTS.find((p) => p.slug === slug)?.price ?? 89999) + (size === "XXL" ? XXL_SURCHARGE_COP : 0);
}
function CartButton() {
	const { count, openCart } = useCart();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick: openCart,
		"aria-label": "Abrir carrito",
		className: "fixed bottom-5 left-5 z-40 w-12 h-12 flex items-center justify-center bg-white text-black border border-white hover:bg-black hover:text-white transition-colors",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			viewBox: "0 0 24 24",
			className: "w-5 h-5",
			fill: "none",
			stroke: "currentColor",
			strokeWidth: "1.6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "9",
					cy: "20",
					r: "1.4",
					fill: "currentColor",
					stroke: "none"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "18",
					cy: "20",
					r: "1.4",
					fill: "currentColor",
					stroke: "none"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M2.5 3h2l2.2 12.1a2 2 0 0 0 2 1.6h8.6a2 2 0 0 0 2-1.6L21 7H6" })
			]
		}), count > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "absolute -top-2 -right-2 min-w-[18px] h-[18px] px-1 rounded-full bg-red-600 text-white text-[10px] flex items-center justify-center font-mono",
			children: count
		})]
	});
}
function CartDrawer() {
	const { items, removeItem, updateQty, isOpen, closeCart } = useCart();
	const { format, isInternational } = useDisplayCurrency();
	const [checkoutOpen, setCheckoutOpen] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (!isOpen) return;
		const onKey = (e) => e.key === "Escape" && closeCart();
		document.addEventListener("keydown", onKey);
		return () => document.removeEventListener("keydown", onKey);
	}, [isOpen, closeCart]);
	const subtotal = items.reduce((sum, i) => sum + estimateUnitPrice(i.slug, i.size) * i.qty, 0);
	const missing = Math.max(0, FREE_SHIPPING_THRESHOLD_COP - subtotal);
	const progress = Math.min(100, Math.round(subtotal / FREE_SHIPPING_THRESHOLD_COP * 100));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, { children: isOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
		initial: { opacity: 0 },
		animate: { opacity: 1 },
		exit: { opacity: 0 },
		className: "fixed inset-0 z-[95] bg-black/70",
		onClick: closeCart,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.aside, {
			initial: { x: "100%" },
			animate: { x: 0 },
			exit: { x: "100%" },
			transition: {
				duration: .3,
				ease: [
					.22,
					1,
					.36,
					1
				]
			},
			onClick: (e) => e.stopPropagation(),
			className: "absolute right-0 top-0 h-full w-full sm:w-[420px] bg-black text-white border-l border-white/25 flex flex-col",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between border-b border-white/10 px-6 py-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[10px] tracking-[0.3em] uppercase",
						children: "Tu carrito"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: closeCart,
						"aria-label": "Cerrar carrito",
						className: "w-9 h-9 flex items-center justify-center border border-white/25 hover:bg-white hover:text-black transition-colors",
						children: "✕"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1 overflow-y-auto px-6 py-4 space-y-4",
					children: [items.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-white/50 py-10 text-center",
						children: "Tu carrito está vacío."
					}), items.map((i) => {
						const thumb = PRODUCTS.find((p) => p.slug === i.slug)?.image;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "border border-white/15 p-3 flex flex-col gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between items-start gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start gap-3 min-w-0",
									children: [thumb && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "w-14 h-14 shrink-0 border border-white/20 bg-white overflow-hidden",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: thumb,
											alt: i.name,
											className: "w-full h-full object-cover",
											loading: "lazy"
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm font-semibold leading-tight",
											children: i.name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-xs text-white/50 mt-1",
											children: ["Talla ", i.size]
										})]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => removeItem(i.slug, i.size),
									"aria-label": `Quitar ${i.name}`,
									className: "text-xs text-white/50 hover:text-red-400 underline underline-offset-4 shrink-0",
									children: "Quitar"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center border border-white/25",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => updateQty(i.slug, i.size, i.qty - 1),
											className: "w-8 h-8 flex items-center justify-center hover:bg-white hover:text-black",
											"aria-label": "Restar",
											children: "−"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "w-8 text-center text-sm font-mono",
											children: i.qty
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => updateQty(i.slug, i.size, i.qty + 1),
											className: "w-8 h-8 flex items-center justify-center hover:bg-white hover:text-black",
											"aria-label": "Sumar",
											children: "+"
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-mono",
									children: format(estimateUnitPrice(i.slug, i.size) * i.qty)
								})]
							})]
						}, `${i.slug}-${i.size}`);
					})]
				}),
				items.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "border-t border-white/10 px-6 py-4 space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-1 bg-white/10",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-1 bg-emerald-400 transition-all",
								style: { width: `${progress}%` }
							})
						}),
						isInternational ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] text-white/55",
							children: "El envío internacional se cotiza y coordina aparte con nuestro equipo."
						}) : missing > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-[11px] text-white/55",
							children: [
								"Agrega $",
								missing.toLocaleString("es-CO"),
								" más y el envío nacional es gratis."
							]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] text-emerald-400",
							children: "Envío nacional gratis desbloqueado."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Subtotal" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono",
								children: format(subtotal)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-[10px] text-white/40",
							children: [
								"El envío (si aplica) se coordina aparte y no se cobra por Wompi. Talla XXL incluye un recargo de ",
								format(15e3),
								"."
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setCheckoutOpen(true),
							className: "group w-full bg-white text-black hover:bg-transparent hover:text-white border border-white transition-colors",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center justify-center gap-2 h-12",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
									viewBox: "0 0 24 24",
									className: "w-5 h-5",
									fill: "none",
									stroke: "currentColor",
									strokeWidth: "1.6",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
											cx: "9",
											cy: "20",
											r: "1.4",
											fill: "currentColor",
											stroke: "none"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
											cx: "18",
											cy: "20",
											r: "1.4",
											fill: "currentColor",
											stroke: "none"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M2.5 3h2l2.2 12.1a2 2 0 0 0 2 1.6h8.6a2 2 0 0 0 2-1.6L21 7H6" })
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm tracking-[0.2em] uppercase font-semibold",
									children: "Comprar"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center justify-center gap-2 h-8 border-t border-black/10 group-hover:border-white/10",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: "/images/bancolombia-white.png",
									alt: "Bancolombia",
									className: "h-3.5 w-auto invert group-hover:invert-0"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[9px] tracking-[0.15em] uppercase opacity-70",
									children: "Compra verificada por Bancolombia"
								})]
							})]
						})
					]
				})
			]
		})
	}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WompiCheckout, {
		open: checkoutOpen,
		onClose: () => setCheckoutOpen(false),
		items
	})] });
}
var SHORT_SOURCE_PARAMS = {
	ig: "instagram_bio",
	instagram: "instagram_bio"
};
function detectSource(params) {
	for (const [key, source] of Object.entries(SHORT_SOURCE_PARAMS)) if (params.has(key)) return source;
	const utmSource = params.get("utm_source")?.toLowerCase();
	if (utmSource === "instagram" || utmSource === "ig") return "instagram_bio";
	return null;
}
function useBioLinkTracking() {
	(0, import_react.useEffect)(() => {
		if (typeof window === "undefined") return;
		const source = detectSource(new URLSearchParams(window.location.search));
		if (!source) return;
		const payload = {
			source,
			path: window.location.pathname,
			referrer: document.referrer || null
		};
		fetch("/api/track-visit", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(payload),
			keepalive: true
		}).catch(() => {});
		const cleanUrl = window.location.pathname + window.location.hash;
		window.history.replaceState({}, document.title, cleanUrl);
	}, []);
}
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$12 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1, interactive-widget=resizes-content"
			},
			{ title: "LIVE LEAKS by INTI(t)" },
			{
				name: "description",
				content: "Drop exclusivo de camisas LIVE LEAKS by INTI(t). Estampado DTF de máxima calidad, envíos a Colombia y a todo el mundo."
			},
			{
				name: "author",
				content: "INTI(t)"
			},
			{
				property: "og:site_name",
				content: "LIVE LEAKS by INTI(t)"
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "icon",
				type: "image/png",
				href: "/favicon.png"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;700&family=IBM+Plex+Sans:wght@400;500;600;700;800&family=Pirata+One&display=swap"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "es",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", {
			className: "bg-black",
			children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})]
		})]
	});
}
function RootComponent() {
	const { queryClient } = Route$12.useRouteContext();
	useBioLinkTracking();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CartProvider, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartButton, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartDrawer, {})
		] })
	});
}
var $$splitComponentImporter$3 = () => import("./routes-DA3ge2kJ.mjs");
var Route$11 = createFileRoute("/")({
	head: () => ({
		meta: [
			{ title: "LIVE LEAKS by INTI(t) — Drop único" },
			{
				name: "description",
				content: "Drop exclusivo de camisas LIVE LEAKS by INTI(t). Todas las tallas, pago seguro con Wompi y envíos nacionales."
			},
			{
				property: "og:title",
				content: "LIVE LEAKS by INTI(t) — Drop único"
			},
			{
				property: "og:description",
				content: "Drop exclusivo de camisas LIVE LEAKS by INTI(t), con todas las tallas disponibles."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				property: "og:url",
				content: "/"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			}
		],
		links: [
			{
				rel: "canonical",
				href: "/"
			},
			{
				rel: "icon",
				href: "/favicon.png"
			},
			{
				rel: "preload",
				as: "image",
				href: "/images/machine_girl.webp",
				fetchpriority: "high"
			}
		],
		scripts: [{
			type: "application/ld+json",
			children: JSON.stringify({
				"@context": "https://schema.org",
				"@type": "Organization",
				name: "LIVE LEAKS by INTI(t)",
				url: "https://inti-net.vercel.app",
				sameAs: ["https://www.instagram.com/intitnet/"]
			})
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var Route$10 = createFileRoute("/ig")({ server: { handlers: { GET: async ({ request }) => {
	try {
		const { supabaseAdmin } = await import("./client.server-KzwUIAkW.mjs");
		const url = new URL(request.url);
		await supabaseAdmin.from("site_visits").insert({
			source: "instagram_bio",
			referrer: request.headers.get("referer") ?? null,
			user_agent: request.headers.get("user-agent") ?? null,
			path: url.pathname
		});
	} catch (err) {
		console.error("[ig] No se pudo registrar la visita:", err);
	}
	return new Response(null, {
		status: 302,
		headers: { Location: "/" }
	});
} } } });
var $$splitComponentImporter$2 = () => import("./pagos-B-F8Jznl.mjs");
var Route$9 = createFileRoute("/pagos")({
	head: () => ({
		meta: [
			{ title: "Métodos de pago y envíos — LIVE LEAKS by INTI(t)" },
			{
				name: "description",
				content: "Pagos seguros con Wompi: tarjeta, PSE, Nequi y Bancolombia. Envíos nacionales en Colombia."
			},
			{
				property: "og:title",
				content: "Métodos de pago y envíos — INTI(t)"
			},
			{
				property: "og:description",
				content: "Pago seguro con Wompi. Envíos nacionales e internacionales."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				property: "og:url",
				content: "/pagos"
			},
			{
				name: "twitter:card",
				content: "summary"
			}
		],
		links: [{
			rel: "canonical",
			href: "/pagos"
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var BASE_URL = "https://inti-net.vercel.app";
var Route$8 = createFileRoute("/sitemap.xml")({ server: { handlers: { GET: async () => {
	const xml = [
		`<?xml version="1.0" encoding="UTF-8"?>`,
		`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
		...[
			{
				path: "/",
				changefreq: "weekly",
				priority: "1.0"
			},
			{
				path: "/pagos",
				changefreq: "monthly",
				priority: "0.6"
			},
			{
				path: "/terminos",
				changefreq: "yearly",
				priority: "0.3"
			},
			...PRODUCTS.map((p) => ({
				path: `/producto/${p.slug}`,
				changefreq: "weekly",
				priority: "0.9"
			}))
		].map((e) => [
			`  <url>`,
			`    <loc>${BASE_URL}${e.path}</loc>`,
			e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
			e.priority ? `    <priority>${e.priority}</priority>` : null,
			`  </url>`
		].filter(Boolean).join("\n")),
		`</urlset>`
	].join("\n");
	return new Response(xml, { headers: {
		"Content-Type": "application/xml",
		"Cache-Control": "public, max-age=3600"
	} });
} } } });
var $$splitComponentImporter$1 = () => import("./terminos-D5mji4Bp.mjs");
var Route$7 = createFileRoute("/terminos")({
	head: () => ({
		meta: [
			{ title: "Términos y condiciones — LIVE LEAKS by INTI(t)" },
			{
				name: "description",
				content: "Condiciones de compra, pagos, envíos, cambios y datos personales del drop LIVE LEAKS by INTI(t)."
			},
			{
				property: "og:title",
				content: "Términos y condiciones — INTI(t)"
			},
			{
				property: "og:description",
				content: "Compras, pedidos y políticas del drop LIVE LEAKS."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				property: "og:url",
				content: "/terminos"
			},
			{
				name: "twitter:card",
				content: "summary"
			}
		],
		links: [{
			rel: "canonical",
			href: "/terminos"
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var VALID_SIZES = [
	"S",
	"M",
	"L",
	"XL",
	"XXL"
];
var VALID_COUNTRIES = ["CO", "INTL"];
var VALID_DOC_TYPES = [
	"CC",
	"NIT",
	"CE",
	"PASAPORTE",
	"OTRO"
];
function jsonResponse$3(body, status = 200) {
	return new Response(JSON.stringify(body), {
		status,
		headers: { "Content-Type": "application/json" }
	});
}
function sanitize$1(value, maxLength) {
	return String(value ?? "").trim().slice(0, maxLength);
}
async function sha256Hex$1(input) {
	const data = new TextEncoder().encode(input);
	const digest = await crypto.subtle.digest("SHA-256", data);
	return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, "0")).join("");
}
async function verifyTurnstile(token, remoteIp) {
	const secret = process.env["TURNSTILE_SECRET_KEY"]?.trim();
	if (!secret) {
		console.error("[checkout] Falta TURNSTILE_SECRET_KEY.");
		return false;
	}
	if (!token) return false;
	const form = new URLSearchParams();
	form.set("secret", secret);
	form.set("response", token);
	if (remoteIp) form.set("remoteip", remoteIp);
	try {
		const data = await (await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
			method: "POST",
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
			body: form
		})).json();
		if (!data.success) console.warn("[checkout] Turnstile rechazado:", data["error-codes"]);
		return data.success === true;
	} catch (err) {
		console.error("[checkout] Error verificando Turnstile:", err);
		return false;
	}
}
var Route$6 = createFileRoute("/api/checkout")({ server: { handlers: { POST: async ({ request }) => {
	let body;
	try {
		body = await request.json();
	} catch {
		return jsonResponse$3({ error: "JSON inválido." }, 400);
	}
	const cart = (Array.isArray(body["items"]) ? body["items"] : []).map((it) => {
		const o = it;
		const qty = Math.floor(Number(o["qty"] ?? 1));
		return {
			slug: sanitize$1(o["slug"], 60),
			size: sanitize$1(o["size"], 10).toUpperCase(),
			qty: Number.isFinite(qty) && qty > 0 ? Math.min(qty, 10) : 1
		};
	}).filter((it) => it.slug && VALID_SIZES.includes(it.size));
	if (!await verifyTurnstile(sanitize$1(body["turnstileToken"], 2e3), request.headers.get("cf-connecting-ip") ?? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null)) return jsonResponse$3({ error: "No pudimos verificar que eres una persona real. Intenta de nuevo." }, 403);
	const name = sanitize$1(body["name"], 80);
	const phone = sanitize$1(body["phone"], 30);
	const email = sanitize$1(body["email"], 120);
	const city = sanitize$1(body["city"], 60);
	const address = sanitize$1(body["address"], 200);
	const docType = sanitize$1(body["docType"], 15).toUpperCase();
	const docNumber = sanitize$1(body["docNumber"], 40);
	const department = sanitize$1(body["department"], 60);
	const idNumber = sanitize$1(body["idNumber"], 40);
	const postalCode = sanitize$1(body["postalCode"], 20);
	const state = sanitize$1(body["state"], 60);
	const destinationCountry = sanitize$1(body["destinationCountry"], 60);
	const rawCountry = sanitize$1(body["country"], 10).toUpperCase();
	if (!VALID_COUNTRIES.includes(rawCountry)) return jsonResponse$3({ error: "Selecciona si tu compra es nacional (Colombia) o internacional." }, 400);
	const country = rawCountry;
	const isNational = country === "CO";
	if (cart.length === 0) return jsonResponse$3({ error: "El carrito está vacío o es inválido." }, 400);
	if (!name || !phone || !city || !address) return jsonResponse$3({ error: "Faltan datos de envío." }, 400);
	if (isNational) {
		if (!VALID_DOC_TYPES.includes(docType) || !docNumber || !department) return jsonResponse$3({ error: "Para compras nacionales faltan datos: tipo/número de documento de identidad o departamento." }, 400);
	} else if (!idNumber || !email || !postalCode || !state || !destinationCountry) return jsonResponse$3({ error: "Para compras internacionales faltan datos: documento de identificación, correo, código postal, estado/provincia o país de destino." }, 400);
	const integritySecret = process.env["WOMPI_INTEGRITY_SECRET"]?.trim();
	const publicKey = (process.env["VITE_WOMPI_PUBLIC_KEY"] ?? process.env["WOMPI_PUBLIC_KEY"])?.trim();
	if (!integritySecret || !publicKey) {
		console.error("[checkout] Faltan credenciales de Wompi.");
		return jsonResponse$3({ error: "El pago no está disponible en este momento." }, 500);
	}
	const { supabaseAdmin } = await import("./client.server-KzwUIAkW.mjs");
	const slugs = [...new Set(cart.map((c) => c.slug))];
	const { data: products, error: prodError } = await supabaseAdmin.from("products").select("id, slug, name, price_cop, active").in("slug", slugs).eq("active", true);
	if (prodError || !products || products.length === 0) return jsonResponse$3({ error: "Uno o más productos no existen." }, 400);
	const { data: sizeRows, error: sizeError } = await supabaseAdmin.from("product_sizes").select("id, product_id, size, stock, extra_price_cop").in("product_id", products.map((p) => p.id));
	if (sizeError || !sizeRows) return jsonResponse$3({ error: "No pudimos validar el inventario." }, 500);
	const lines = [];
	for (const item of cart) {
		const product = products.find((p) => p.slug === item.slug);
		if (!product) return jsonResponse$3({ error: `Producto inválido: ${item.slug}` }, 400);
		const sizeRow = sizeRows.find((s) => s.product_id === product.id && s.size === item.size);
		if (!sizeRow) return jsonResponse$3({ error: `Talla inválida para ${item.slug}.` }, 400);
		if (sizeRow.stock < item.qty) return jsonResponse$3({ error: `Sin stock suficiente de ${product.name} talla ${item.size}.` }, 409);
		lines.push({
			slug: product.slug,
			name: product.name,
			size: item.size,
			qty: item.qty,
			unitPriceCop: product.price_cop + sizeRow.extra_price_cop,
			sizeRowId: sizeRow.id
		});
	}
	const subtotalCop = lines.reduce((sum, l) => sum + l.unitPriceCop * l.qty, 0);
	const currency = "COP";
	const amountInCents = subtotalCop * 100;
	const fxRateUsed = isNational ? null : (await (await import("./fx.server-D7wm6BRM.mjs")).getUsdCopRate()).rate;
	for (const line of lines) {
		const { data: updated, error: stockError } = await supabaseAdmin.rpc("decrement_stock_if_available", {
			p_size_id: line.sizeRowId,
			p_qty: line.qty
		});
		if (stockError || updated !== true) {
			const idx = lines.indexOf(line);
			for (const done of lines.slice(0, idx)) await supabaseAdmin.rpc("increment_stock", {
				p_size_id: done.sizeRowId,
				p_qty: done.qty
			});
			return jsonResponse$3({ error: `Se agotó el stock de ${line.name} talla ${line.size}.` }, 409);
		}
	}
	const reference = crypto.randomUUID();
	const itemsSnapshot = lines.map((l) => ({
		slug: l.slug,
		name: l.name,
		size: l.size,
		qty: l.qty,
		unit_price_cop: l.unitPriceCop,
		line_total_cop: l.unitPriceCop * l.qty
	}));
	const { data: order, error: dbError } = await supabaseAdmin.from("orders").insert({
		reference,
		items: itemsSnapshot,
		subtotal_cop: subtotalCop,
		amount_in_cents: amountInCents,
		currency,
		country,
		fx_rate_used: fxRateUsed,
		status: "pending",
		customer_name: name,
		customer_phone: phone,
		customer_email: email || null,
		shipping_city: city,
		shipping_address: address,
		doc_type: isNational ? docType : null,
		doc_number: isNational ? docNumber : null,
		shipping_department: isNational ? department : null,
		id_number: isNational ? null : idNumber,
		postal_code: isNational ? null : postalCode,
		state: isNational ? null : state,
		destination_country: isNational ? null : destinationCountry
	}).select("id, reference").single();
	if (dbError || !order) {
		console.error("[checkout] Error creando el pedido:", dbError);
		for (const line of lines) await supabaseAdmin.rpc("increment_stock", {
			p_size_id: line.sizeRowId,
			p_qty: line.qty
		});
		return jsonResponse$3({ error: "No pudimos registrar tu pedido." }, 500);
	}
	return jsonResponse$3({
		reference,
		amountInCents,
		currency,
		country,
		publicKey,
		signature: await sha256Hex$1(`${reference}${amountInCents}${currency}${integritySecret}`),
		subtotal: subtotalCop,
		total: subtotalCop,
		fxRateUsed
	});
} } } });
var Route$5 = createFileRoute("/api/fx")({ server: { handlers: { GET: async () => {
	const { rate, live } = await getUsdCopRate();
	return new Response(JSON.stringify({
		rate,
		live
	}), {
		status: 200,
		headers: {
			"Content-Type": "application/json",
			"Cache-Control": "public, max-age=3600"
		}
	});
} } } });
function jsonResponse$2(body, status = 200) {
	return new Response(JSON.stringify(body), {
		status,
		headers: { "Content-Type": "application/json" }
	});
}
var Route$4 = createFileRoute("/api/geo")({ server: { handlers: { GET: async ({ request }) => {
	return jsonResponse$2({ country: request.headers.get("x-vercel-ip-country") ?? request.headers.get("cf-ipcountry") ?? null });
} } } });
function jsonResponse$1(body, status = 200) {
	return new Response(JSON.stringify(body), {
		status,
		headers: { "Content-Type": "application/json" }
	});
}
function sanitize(value, maxLength) {
	return String(value ?? "").trim().slice(0, maxLength);
}
var Route$3 = createFileRoute("/api/track-visit")({ server: { handlers: { POST: async ({ request }) => {
	let body;
	try {
		body = await request.json();
	} catch {
		return jsonResponse$1({ error: "JSON inválido." }, 400);
	}
	const source = sanitize(body["source"], 40) || "direct";
	const path = sanitize(body["path"], 300) || "/";
	const referrer = sanitize(body["referrer"], 500) || null;
	const userAgent = sanitize(request.headers.get("user-agent"), 300) || null;
	try {
		const { supabaseAdmin } = await import("./client.server-KzwUIAkW.mjs");
		const { error } = await supabaseAdmin.from("site_visits").insert({
			source,
			path,
			referrer,
			user_agent: userAgent
		});
		if (error) console.error("[track-visit] Error insertando visita:", error);
	} catch (err) {
		console.error("[track-visit] Error registrando visita:", err);
	}
	return jsonResponse$1({ ok: true });
} } } });
var Route$2 = createFileRoute("/api/trm")({ server: { handlers: { GET: async () => {
	const { getTrm } = await import("./trm-Hnh6Pl1U.mjs");
	const { trm, source } = await getTrm();
	return new Response(JSON.stringify({
		trm,
		source
	}), {
		status: 200,
		headers: {
			"Content-Type": "application/json",
			"Cache-Control": "public, max-age=1800"
		}
	});
} } } });
function jsonResponse(body, status = 200) {
	return new Response(JSON.stringify(body), {
		status,
		headers: { "Content-Type": "application/json" }
	});
}
async function sha256Hex(input) {
	const data = new TextEncoder().encode(input);
	const digest = await crypto.subtle.digest("SHA-256", data);
	return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, "0")).join("");
}
function getByPath(obj, path) {
	return path.split(".").reduce((acc, key) => {
		if (acc && typeof acc === "object") return acc[key];
	}, obj);
}
var STATUS_MAP = {
	APPROVED: "VENTA REALIZADA",
	DECLINED: "declined",
	ERROR: "error",
	VOIDED: "declined"
};
var Route$1 = createFileRoute("/api/wompi-webhook")({ server: { handlers: { POST: async ({ request }) => {
	const eventsSecret = process.env["WOMPI_EVENTS_SECRET"]?.trim();
	if (!eventsSecret) {
		console.error("[wompi-webhook] Falta WOMPI_EVENTS_SECRET.");
		return jsonResponse({ error: "No configurado." }, 500);
	}
	let payload;
	try {
		payload = await request.json();
	} catch {
		return jsonResponse({ error: "JSON inválido." }, 400);
	}
	const { data, timestamp, signature } = payload;
	if (!data?.transaction || !signature?.properties || !signature?.checksum || !timestamp) return jsonResponse({ error: "Payload incompleto." }, 400);
	if ((await sha256Hex(signature.properties.map((p) => String(getByPath(payload, p) ?? "")).join("") + String(timestamp) + eventsSecret)).toUpperCase() !== signature.checksum.toUpperCase()) {
		console.error("[wompi-webhook] Checksum inválido, evento rechazado.");
		return jsonResponse({ error: "Firma inválida." }, 401);
	}
	const transaction = data.transaction;
	const reference = String(transaction["reference"] ?? "");
	const wompiStatus = String(transaction["status"] ?? "");
	const wompiTransactionId = String(transaction["id"] ?? "");
	const wompiAmountInCents = Number(transaction["amount_in_cents"] ?? -1);
	const wompiCurrency = String(transaction["currency"] ?? "");
	const mappedStatus = STATUS_MAP[wompiStatus];
	if (!reference || !mappedStatus) return jsonResponse({
		ok: true,
		ignored: true
	});
	const { supabaseAdmin } = await import("./client.server-KzwUIAkW.mjs");
	const { data: order, error: fetchError } = await supabaseAdmin.from("orders").select("id, amount_in_cents, currency, status, items").eq("reference", reference).single();
	if (fetchError || !order) {
		console.error("[wompi-webhook] Pedido no encontrado para reference:", reference);
		return jsonResponse({
			ok: true,
			ignored: true
		});
	}
	if (order.amount_in_cents !== wompiAmountInCents || order.currency !== wompiCurrency) {
		console.error(`[wompi-webhook] Monto/moneda no coinciden para ${reference}: esperado ${order.amount_in_cents} ${order.currency}, recibido ${wompiAmountInCents} ${wompiCurrency}.`);
		return jsonResponse({
			ok: true,
			ignored: true
		});
	}
	if (order.status !== "pending") return jsonResponse({ ok: true });
	const { error: updateError } = await supabaseAdmin.from("orders").update({
		status: mappedStatus,
		wompi_transaction_id: wompiTransactionId,
		updated_at: (/* @__PURE__ */ new Date()).toISOString()
	}).eq("id", order.id).eq("status", "pending");
	if (updateError) {
		console.error("[wompi-webhook] Error actualizando pedido:", updateError);
		return jsonResponse({ error: "Error interno." }, 500);
	}
	if (mappedStatus !== "VENTA REALIZADA") {
		const items = Array.isArray(order.items) ? order.items : [];
		for (const item of items) {
			const { data: sizeRow } = await supabaseAdmin.from("product_sizes").select("id, product_id, products!inner(slug)").eq("size", String(item["size"])).eq("products.slug", String(item["slug"])).maybeSingle();
			if (sizeRow) await supabaseAdmin.rpc("increment_stock", {
				p_size_id: sizeRow.id,
				p_qty: Number(item["qty"] ?? 0)
			});
		}
	}
	return jsonResponse({ ok: true });
} } } });
var $$splitComponentImporter = () => import("./producto._slug-CyGn6out.mjs");
var Route = createFileRoute("/producto/$slug")({
	loader: ({ params }) => {
		const product = getProduct(params.slug);
		if (!product) throw notFound();
		return { product };
	},
	head: ({ loaderData }) => {
		if (!loaderData) return { meta: [{ title: "Producto no disponible — INTI(t)" }, {
			name: "robots",
			content: "noindex"
		}] };
		const { product } = loaderData;
		const url = `/producto/${product.slug}`;
		return {
			meta: [
				{ title: `${product.name} — LIVE LEAKS by INTI(t)` },
				{
					name: "description",
					content: product.description.slice(0, 155)
				},
				{
					property: "og:title",
					content: `${product.name} — LIVE LEAKS by INTI(t)`
				},
				{
					property: "og:description",
					content: product.description.slice(0, 155)
				},
				{
					property: "og:type",
					content: "product"
				},
				{
					property: "og:url",
					content: url
				},
				{
					name: "twitter:card",
					content: "summary_large_image"
				}
			],
			links: [{
				rel: "canonical",
				href: url
			}, {
				rel: "preload",
				as: "image",
				href: product.image,
				fetchpriority: "high"
			}],
			scripts: [{
				type: "application/ld+json",
				children: JSON.stringify({
					"@context": "https://schema.org",
					"@type": "Product",
					name: product.name,
					description: product.description,
					image: `https://inti-net.vercel.app${product.image}`,
					brand: {
						"@type": "Brand",
						name: "INTI(t)"
					},
					offers: {
						"@type": "Offer",
						price: product.price ?? 89999,
						priceCurrency: "COP",
						availability: "https://schema.org/InStock",
						url: `https://inti-net.vercel.app${url}`
					}
				})
			}]
		};
	},
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var rootRouteChildren = {
	IndexRoute: Route$11.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$12
	}),
	IgRoute: Route$10.update({
		id: "/ig",
		path: "/ig",
		getParentRoute: () => Route$12
	}),
	PagosRoute: Route$9.update({
		id: "/pagos",
		path: "/pagos",
		getParentRoute: () => Route$12
	}),
	SitemapDotxmlRoute: Route$8.update({
		id: "/sitemap.xml",
		path: "/sitemap.xml",
		getParentRoute: () => Route$12
	}),
	TerminosRoute: Route$7.update({
		id: "/terminos",
		path: "/terminos",
		getParentRoute: () => Route$12
	}),
	ApiCheckoutRoute: Route$6.update({
		id: "/api/checkout",
		path: "/api/checkout",
		getParentRoute: () => Route$12
	}),
	ApiFxRoute: Route$5.update({
		id: "/api/fx",
		path: "/api/fx",
		getParentRoute: () => Route$12
	}),
	ApiGeoRoute: Route$4.update({
		id: "/api/geo",
		path: "/api/geo",
		getParentRoute: () => Route$12
	}),
	ApiTrackVisitRoute: Route$3.update({
		id: "/api/track-visit",
		path: "/api/track-visit",
		getParentRoute: () => Route$12
	}),
	ApiTrmRoute: Route$2.update({
		id: "/api/trm",
		path: "/api/trm",
		getParentRoute: () => Route$12
	}),
	ApiWompiWebhookRoute: Route$1.update({
		id: "/api/wompi-webhook",
		path: "/api/wompi-webhook",
		getParentRoute: () => Route$12
	}),
	ProductoSlugRoute: Route.update({
		id: "/producto/$slug",
		path: "/producto/$slug",
		getParentRoute: () => Route$12
	})
};
var routeTree = Route$12._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
var getRouter = () => {
	const queryClient = new QueryClient();
	return createRouter({
		routeTree,
		context: { queryClient },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { WompiBancolombiaLogos as a, CONTACT as c, PRODUCTS as d, SIZES as f, getUsdCopRate as i, ORIGINAL_PRICE as l, XXL_SURCHARGE_COP as m, Route as n, WompiVerifiedBadge as o, SIZE_GUIDE as p, useCart as r, useDisplayCurrency as s, router_exports as t, PRINT_SPEC as u };
