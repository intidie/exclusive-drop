import { r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { t as motion } from "../_libs/motion.mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { d as PRODUCTS, s as useDisplayCurrency } from "./router-D51RQ65e.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/CatalogSection-DNwo-yCT.js
var import_jsx_runtime = require_jsx_runtime();
function CatalogSection() {
	const { format, formatAlt, isInternational } = useDisplayCurrency();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		id: "drop",
		className: "relative bg-black text-white pt-10 md:pt-14 pb-24 md:pb-32 px-6 grain scanlines overflow-hidden",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-6xl mx-auto relative z-10",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
				initial: {
					opacity: 0,
					y: 16,
					scale: .97
				},
				whileInView: {
					opacity: 1,
					y: 0,
					scale: 1
				},
				viewport: {
					once: true,
					amount: .3
				},
				transition: {
					duration: .7,
					ease: [
						.22,
						1,
						.36,
						1
					]
				},
				style: { willChange: "transform, opacity" },
				className: "mb-8 md:mb-12 flex flex-col items-center text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: "/images/inti-net-logo.webp",
						alt: "inti-net",
						width: 1774,
						height: 887,
						loading: "lazy",
						decoding: "async",
						className: "w-full max-w-md md:max-w-lg h-auto glitch animate-logo-pulse"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: "/images/eternity-ornament.webp",
						alt: "",
						"aria-hidden": true,
						width: 1199,
						height: 628,
						loading: "lazy",
						decoding: "async",
						className: "w-full max-w-xs md:max-w-sm h-auto -mt-2 opacity-40 mix-blend-screen animate-decor-drift"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "micro mt-4 text-white/45",
						children: "Catálogo · edición única"
					}),
					isInternational && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "micro mt-2 text-white/35",
						children: "Precios en USD · TRM fija 4.000 COP"
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 lg:grid-cols-3 gap-px bg-white/15",
				children: [PRODUCTS.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/producto/$slug",
					params: { slug: p.slug },
					className: "group relative block bg-black transition-colors duration-300 hover:bg-white/[0.04]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "absolute top-0 left-0 z-10 px-2 py-1 micro text-white/60 bg-black/60",
							children: String(i + 1).padStart(2, "0")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "aspect-[4/5] overflow-hidden bg-neutral-950",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: p.image,
								alt: p.name,
								width: 1200,
								height: 1500,
								loading: i < 2 ? "eager" : "lazy",
								decoding: "async",
								className: "w-full h-full object-cover contrast-125 transition-all duration-700 ease-out md:grayscale group-hover:grayscale-0 group-hover:scale-105"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-3 md:p-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "micro text-white/40",
									children: p.tag
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "mt-1 text-lg md:text-2xl font-display tracking-wide leading-none",
									children: p.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-2 flex items-center gap-2 flex-wrap",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm font-mono text-white/70",
											children: format(p.price ?? 89999)
										}),
										!isInternational && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-[11px] font-mono text-white/40",
											children: ["≈ ", formatAlt(p.price ?? 89999)]
										}),
										p.slug === "machine-girl" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[9px] tracking-[0.15em] uppercase bg-red-600 text-white px-1.5 py-0.5",
											children: "Oferta única"
										})
									]
								})
							]
						})
					]
				}, p.slug)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative flex min-h-full flex-col overflow-hidden bg-black",
					"aria-label": "Próximo archivo: señal entrante",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "relative aspect-[4/5] overflow-hidden bg-neutral-950",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: "/images/intinet-ornament.webp",
							alt: "inti-net — próximo archivo",
							width: 1200,
							height: 628,
							loading: "lazy",
							decoding: "async",
							className: "absolute inset-0 m-auto w-[85%] h-auto animate-logo-pulse"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-3 md:p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "micro text-white/40",
							children: "Próximo archivo"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-lg font-display uppercase tracking-wide leading-none text-white/70 md:text-2xl",
							children: "Señal entrante"
						})]
					})]
				})]
			})]
		})
	});
}
//#endregion
export { CatalogSection as default };
