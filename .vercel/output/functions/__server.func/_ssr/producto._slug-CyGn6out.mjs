import { o as __toESM } from "../_runtime.mjs";
import { n as require_react, r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { n as AnimatePresence } from "../_libs/framer-motion.mjs";
import { t as motion } from "../_libs/motion.mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as CONTACT, d as PRODUCTS, f as SIZES, l as ORIGINAL_PRICE, m as XXL_SURCHARGE_COP, n as Route, p as SIZE_GUIDE, r as useCart, s as useDisplayCurrency, u as PRINT_SPEC } from "./router-D51RQ65e.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/producto._slug-CyGn6out.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var KEY = "intit_discount_deadline_v1";
var DURATION_MS = 288e5;
function getDeadline() {
	if (typeof window === "undefined") return Date.now() + DURATION_MS;
	const raw = window.localStorage.getItem(KEY);
	const parsed = raw ? parseInt(raw, 10) : NaN;
	if (!raw || Number.isNaN(parsed) || parsed < Date.now()) {
		const d = Date.now() + DURATION_MS;
		window.localStorage.setItem(KEY, String(d));
		return d;
	}
	return parsed;
}
function CountdownTimer() {
	const [remaining, setRemaining] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		const deadline = getDeadline();
		const tick = () => setRemaining(Math.max(0, deadline - Date.now()));
		tick();
		const id = setInterval(tick, 1e3);
		return () => clearInterval(id);
	}, []);
	if (remaining === null) return null;
	const h = Math.floor(remaining / 36e5);
	const m = Math.floor(remaining % 36e5 / 6e4);
	const s = Math.floor(remaining % 6e4 / 1e3);
	const pad = (n) => String(n).padStart(2, "0");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: "inline-flex items-center gap-1 text-[10px] tracking-[0.2em] uppercase font-mono bg-black text-white px-2 py-0.5",
		children: [
			pad(h),
			":",
			pad(m),
			":",
			pad(s)
		]
	});
}
var size_front_png_asset_default = {
	version: 1,
	asset_id: "9537dbdb-4f02-44ce-80b6-eade5be6b986",
	project_id: "a597067b-b02c-465f-a484-04190d5b9887",
	url: "/images/size-front.webp",
	r2_key: "",
	original_filename: "size-front.png",
	size: 2146678,
	content_type: "image/png",
	created_at: "2026-07-12T01:21:19Z"
};
var size_back_png_asset_default = {
	version: 1,
	asset_id: "73720d7c-6080-4c09-961f-3bbc24020490",
	project_id: "a597067b-b02c-465f-a484-04190d5b9887",
	url: "/images/size-back.webp",
	r2_key: "",
	original_filename: "size-back.png",
	size: 1662252,
	content_type: "image/png",
	created_at: "2026-07-12T01:21:19Z"
};
function SizeGuideModal({ open, onClose }) {
	(0, import_react.useEffect)(() => {
		if (!open) return;
		const onKey = (e) => e.key === "Escape" && onClose();
		document.addEventListener("keydown", onKey);
		document.body.style.overflow = "hidden";
		return () => {
			document.removeEventListener("keydown", onKey);
			document.body.style.overflow = "";
		};
	}, [open, onClose]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, { children: open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
		className: "fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm",
		initial: { opacity: 0 },
		animate: { opacity: 1 },
		exit: { opacity: 0 },
		onClick: onClose,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
			initial: {
				y: 30,
				opacity: 0,
				scale: .96
			},
			animate: {
				y: 0,
				opacity: 1,
				scale: 1
			},
			exit: {
				y: 20,
				opacity: 0,
				scale: .97
			},
			transition: {
				duration: .35,
				ease: [
					.22,
					1,
					.36,
					1
				]
			},
			onClick: (e) => e.stopPropagation(),
			className: "bg-black text-white w-full max-w-5xl max-h-[92vh] overflow-y-auto border border-white/25 relative",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "sticky top-0 z-10 flex justify-end p-2 bg-neutral-900 border-b border-white/10",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: onClose,
					"aria-label": "Cerrar",
					type: "button",
					className: "w-11 h-11 flex items-center justify-center border border-white/40 text-white text-2xl leading-none active:bg-white active:text-black hover:bg-white hover:text-black transition-colors",
					children: "×"
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "p-6 md:p-10 pt-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[10px] tracking-[0.3em] uppercase opacity-60",
						children: "Guía"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-2xl md:text-4xl font-display tracking-wide mt-1",
						children: "Tallas — Medidas en cm"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-white/60 mt-2",
						children: [
							"La camisa es ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "talla única (oversize)" }),
							". Estas son las medidas equivalentes en XL y XXL, tomadas con la prenda tendida."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8 grid sm:grid-cols-2 gap-6 items-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShirtDiagram, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-4",
							children: SIZE_GUIDE.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "border border-white/25 p-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs tracking-[0.3em] uppercase opacity-60",
										children: "Talla"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-3xl font-black",
										children: s.size
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
										className: "mt-3 text-sm space-y-1 font-mono",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: ["A · Pecho: ", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [s.chest, " cm"] })] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: ["B · Largo: ", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [s.length, " cm"] })] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: ["C · Hombro a hombro: ", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [s.shoulder, " cm"] })] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: ["D · Manga: ", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [s.sleeve, " cm"] })] })
										]
									})
								]
							}, s.size))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-10 flex flex-col gap-8",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: size_front_png_asset_default.url,
							alt: "Medidas frontales de la camisa talla XL",
							loading: "lazy",
							decoding: "async",
							className: "w-full h-auto object-contain border border-white/25 bg-white"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("figcaption", {
							className: "mt-3 text-sm tracking-[0.2em] uppercase text-white/60",
							children: "Frente"
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: size_back_png_asset_default.url,
							alt: "Medidas traseras de la camisa talla XL",
							loading: "lazy",
							decoding: "async",
							className: "w-full h-auto object-contain border border-white/25 bg-white"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("figcaption", {
							className: "mt-3 text-sm tracking-[0.2em] uppercase text-white/60",
							children: "Espalda"
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-6 text-xs text-white/45",
						children: "±1cm de tolerancia. Para dudas, escríbenos por Instagram antes de comprar."
					})
				]
			})]
		})
	}) });
}
function ShirtDiagram() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 220 260",
		className: "w-full max-w-xs mx-auto",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("g", {
			fill: "none",
			stroke: "white",
			strokeWidth: "1.5",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M50 40 L90 25 Q110 45 130 25 L170 40 L200 70 L175 95 L165 80 L165 230 L55 230 L55 80 L45 95 L20 70 Z" })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
			stroke: "#dc2626",
			strokeWidth: "1",
			fill: "#dc2626",
			fontSize: "10",
			fontFamily: "monospace",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
					x1: "55",
					y1: "130",
					x2: "165",
					y2: "130"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
					x: "105",
					y: "125",
					textAnchor: "middle",
					children: "A"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
					x1: "180",
					y1: "40",
					x2: "180",
					y2: "230"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
					x: "190",
					y: "140",
					children: "B"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
					x1: "55",
					y1: "55",
					x2: "165",
					y2: "55"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
					x: "105",
					y: "50",
					textAnchor: "middle",
					children: "C"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
					x1: "20",
					y1: "70",
					x2: "45",
					y2: "95"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
					x: "10",
					y: "85",
					children: "D"
				})
			]
		})]
	});
}
var formatCOP = (n) => new Intl.NumberFormat("es-CO", {
	style: "currency",
	currency: "COP",
	maximumFractionDigits: 0
}).format(n);
function ProductPage() {
	const { product } = Route.useLoaderData();
	const price = product.price ?? 89999;
	const [size, setSize] = (0, import_react.useState)("XL");
	const [guideOpen, setGuideOpen] = (0, import_react.useState)(false);
	const [justAdded, setJustAdded] = (0, import_react.useState)(false);
	const [everAdded, setEverAdded] = (0, import_react.useState)(false);
	const { addItem, openCart } = useCart();
	const { format, formatAlt, isInternational, trm } = useDisplayCurrency();
	function handleAddToCart() {
		addItem({
			slug: product.slug,
			name: product.name,
			size
		});
		setEverAdded(true);
		setJustAdded(true);
		setTimeout(() => setJustAdded(false), 1800);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "bg-black text-white min-h-screen font-sans grain",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "relative z-10 border-b border-white/10 px-6 py-4 flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					className: "font-mono text-sm md:text-[10px] tracking-[0.34em] uppercase font-semibold hover:opacity-60",
					children: "← INTI(t)"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: CONTACT.instagram,
					target: "_blank",
					rel: "noreferrer",
					className: "micro hover:opacity-60",
					children: CONTACT.instagramHandle
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "max-w-6xl mx-auto px-6 py-10 md:py-16 grid md:grid-cols-2 gap-8 md:gap-16 items-start relative z-10",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-4",
					children: product.images.map((src, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "aspect-[4/5] overflow-hidden bg-neutral-950 hairline group cursor-zoom-in",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src,
							alt: `${product.name} vista ${i + 1}`,
							width: 1200,
							height: 1500,
							loading: i === 0 ? "eager" : "lazy",
							decoding: "async",
							className: "w-full h-full object-contain transition-transform duration-500 ease-out group-hover:scale-105"
						})
					}, src))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-6 md:sticky md:top-10",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "micro opacity-50",
								children: product.tag
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "mt-2 text-4xl md:text-6xl font-display tracking-wide leading-none",
								children: product.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 flex items-baseline gap-3 flex-wrap",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-base text-white/40 line-through",
										children: format(ORIGINAL_PRICE)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] tracking-[0.3em] uppercase bg-red-600 text-white px-2 py-0.5",
										children: "Oferta"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CountdownTimer, {})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-4xl md:text-5xl font-black tracking-tight animate-price-flash",
								children: format(price)
							}),
							!isInternational && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm text-white/60 mt-1 font-mono",
								children: [
									"≈ ",
									formatAlt(price),
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-xs opacity-60",
										children: [
											"(TRM ",
											formatCOP(trm),
											"/USD)"
										]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-white/50 mt-1",
								children: [
									"Talla XXL: +",
									format(XXL_SURCHARGE_COP),
									" adicionales."
								]
							}),
							isInternational && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-white/45 mt-2 leading-relaxed",
								children: [
									"Precios en dólares calculados con la TRM real del día (",
									formatCOP(trm),
									"/USD). El cobro se procesa en pesos colombianos (COP); no somos responsables por la conversión ni por los cargos que aplique el banco emisor de tu tarjeta."
								]
							})
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-white/70 leading-relaxed",
							children: product.description
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "micro font-semibold hairline px-3 py-2 leading-relaxed",
							children: PRINT_SPEC
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between mb-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "micro",
								children: "Talla"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setGuideOpen(true),
								className: "micro underline underline-offset-4 hover:opacity-60",
								children: "Guía de tallas"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap gap-2",
							children: SIZES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setSize(s),
								className: `inline-flex items-center justify-center h-12 px-6 hairline text-sm font-mono transition-colors ${size === s ? "bg-white text-black" : "bg-transparent text-white hover:bg-white/10"}`,
								children: s
							}, s))
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: handleAddToCart,
							className: "inline-flex items-center justify-center h-14 px-8 micro font-semibold bg-white text-black border border-white hover:bg-transparent hover:text-white transition-colors",
							children: justAdded ? "Agregado ✓" : "Agregar al carrito"
						}),
						everAdded && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: openCart,
							className: "micro underline underline-offset-4 text-left hover:opacity-60",
							children: "Ver carrito →"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-white/55 leading-relaxed",
							children: "Pago seguro con Wompi: tarjeta, PSE, Nequi, botón Bancolombia y efectivo. Envío nacional gratis en compras superiores a $250.000 (solo Colombia); por debajo de ese monto el envío corre por cuenta del comprador y se coordina aparte."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "micro text-white/55",
							children: "Drop limitado y único — pocas unidades por talla."
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "max-w-6xl mx-auto px-6 pb-20 relative z-10",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "micro mb-6 text-white/50",
					children: "Más del drop"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-2 md:grid-cols-4 gap-4",
					children: PRODUCTS.filter((p) => p.slug !== product.slug).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/producto/$slug",
						params: { slug: p.slug },
						className: "group block",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "aspect-[4/5] overflow-hidden bg-neutral-950 hairline",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: p.image,
								alt: p.name,
								loading: "lazy",
								decoding: "async",
								className: "w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 grayscale contrast-125 group-hover:grayscale-0"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-base font-display tracking-wide",
							children: p.name
						})]
					}, p.slug))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SizeGuideModal, {
				open: guideOpen,
				onClose: () => setGuideOpen(false)
			})
		]
	});
}
//#endregion
export { ProductPage as component };
