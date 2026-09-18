import { r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { t as motion } from "../_libs/motion.mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as WompiBancolombiaLogos, o as WompiVerifiedBadge } from "./router-D51RQ65e.mjs";
import SiteFooter from "./SiteFooter-v8hm7Vy5.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/pagos-B-F8Jznl.js
var import_jsx_runtime = require_jsx_runtime();
var fadeUp = {
	initial: {
		opacity: 0,
		y: 40
	},
	whileInView: {
		opacity: 1,
		y: 0
	},
	viewport: {
		once: true,
		amount: .2
	},
	transition: {
		duration: .7,
		ease: [
			.22,
			1,
			.36,
			1
		]
	}
};
var METHODS = [
	{
		tag: "Wompi",
		title: "Tarjeta débito / crédito",
		desc: "Visa, Mastercard y Amex procesadas de forma segura por Wompi."
	},
	{
		tag: "Wompi",
		title: "PSE",
		desc: "Débito directo desde tu cuenta bancaria en Colombia."
	},
	{
		tag: "Wompi",
		title: "Nequi",
		desc: "Aprueba el pago desde tu app Nequi en segundos."
	},
	{
		tag: "Wompi",
		title: "Botón Bancolombia",
		desc: "Paga con tu cuenta de ahorros o corriente Bancolombia."
	},
	{
		tag: "Wompi",
		title: "Corresponsales y efectivo",
		desc: "Genera tu recibo y paga en efectivo en los puntos habilitados por Wompi."
	},
	{
		tag: "Internacional",
		title: "Tarjetas internacionales (precio en USD)",
		desc: "Si compras desde fuera de Colombia, ves el precio fijo en dólares, pero el cobro se procesa en pesos colombianos con la misma pasarela de Wompi."
	}
];
function CheckoutSection() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		id: "checkout",
		className: "bg-black text-white py-24 md:py-32 px-6 border-t border-white/10",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-5xl mx-auto",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
					...fadeUp,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs tracking-[0.3em] uppercase mb-3",
							children: "Métodos de pago & envíos"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-4xl md:text-6xl font-display tracking-wide",
							children: "Paga seguro con Wompi."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 text-sm md:text-base text-white/60 max-w-2xl",
							children: "Todos los pagos se procesan a través de la pasarela Wompi, siempre en pesos colombianos: tarjeta, PSE, Nequi, botón Bancolombia y efectivo en corresponsales para Colombia; tarjeta internacional con precio fijo mostrado en dólares si compras desde fuera del país."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-white/50 max-w-2xl",
							children: "Talla XXL tiene un recargo de $15.000. Envío nacional gratis en compras superiores a $250.000; por debajo de ese monto el envío corre por cuenta del comprador y se coordina aparte. Los envíos internacionales siempre se coordinan aparte con nuestro equipo después del pago."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WompiVerifiedBadge, { className: "mt-4" })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-4",
					children: METHODS.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PaymentCard, { ...m }, m.title))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
					...fadeUp,
					className: "mt-12 border border-white/25 p-6 md:p-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[10px] tracking-[0.3em] uppercase opacity-60",
							children: "Aviso"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "mt-2 text-2xl md:text-3xl font-display tracking-wide",
							children: "Envíos internacionales"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-sm text-white/60",
							children: "Ya puedes comprar desde fuera de Colombia con precio fijo en dólares. El costo y tiempo de envío internacional se coordina directamente contigo por Instagram una vez registrado el pedido."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-xs text-amber-300/90 border border-amber-300/30 bg-amber-300/5 px-3 py-2 leading-relaxed",
							children: "⚠ El cobro real se procesa en pesos colombianos (COP) a la TRM oficial del día (Banco de la República) que se muestra en el checkout. No somos responsables por la tasa de cambio o comisiones que aplique el banco o la entidad emisora de tu tarjeta al convertir el monto a tu moneda local."
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
					...fadeUp,
					className: "mt-8",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WompiBancolombiaLogos, {})
				})
			]
		})
	});
}
function PaymentCard({ tag, title, desc }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
		...fadeUp,
		whileHover: { y: -4 },
		className: "border border-white/25 p-6 md:p-8 transition-colors duration-300 hover:bg-white hover:text-black group",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[10px] tracking-[0.3em] uppercase opacity-60",
				children: tag
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "mt-2 text-xl font-display tracking-wide",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm opacity-80",
				children: desc
			})
		]
	});
}
function PagosPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "bg-black text-white min-h-screen font-sans",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "px-6 py-5 border-b border-white/10",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					className: "text-sm md:text-xs tracking-[0.3em] uppercase hover:opacity-60",
					children: "← Volver"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckoutSection, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {})
		]
	});
}
//#endregion
export { PagosPage as component };
