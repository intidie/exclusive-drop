import { r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { t as motion } from "../_libs/motion.mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import SiteFooter from "./SiteFooter-v8hm7Vy5.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/terminos-D5mji4Bp.js
var import_jsx_runtime = require_jsx_runtime();
var fadeUp = {
	initial: {
		opacity: 0,
		y: 30
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
		duration: .6,
		ease: [
			.22,
			1,
			.36,
			1
		]
	}
};
var TERMS = [
	{
		t: "Pedidos y reservas",
		d: "El pedido se confirma únicamente cuando el pago es aprobado por la pasarela Wompi. Mientras la transacción esté pendiente la unidad no queda reservada."
	},
	{
		t: "Pagos",
		d: "Todos los pagos se procesan exclusivamente a través de Wompi: tarjeta débito/crédito, PSE, Nequi, botón Bancolombia y efectivo en corresponsales. No aceptamos otros medios de pago. Para compras internacionales, el cobro también se hace en pesos colombianos (COP); la conversión a tu moneda la hace tu banco o tarjeta. El monto es calculado y validado en nuestro servidor; nunca manejamos los datos de tu tarjeta."
	},
	{
		t: "Envíos",
		d: "Envíos nacionales dentro de Colombia y envíos internacionales (costo y tiempo se coordinan aparte por Instagram tras la compra). Cada camisa es realizada a mano, por lo que el despacho se hace 1 semana después de la compra. El envío nacional es gratuito en compras superiores a $250.000; por debajo de ese monto, el costo de envío corre por cuenta del comprador y se coordina aparte (no se cobra a través de Wompi)."
	},
	{
		t: "Cambios y devoluciones",
		d: "Por tratarse de un drop limitado de edición única, no hay devoluciones por cambio de opinión. Solo se aceptan cambios por defectos de fábrica reportados dentro de las 48 horas tras la entrega, con foto y empaque original."
	},
	{
		t: "Datos personales",
		d: "Los datos de envío (nombre, teléfono, dirección, ciudad) se usan únicamente para procesar y despachar tu pedido. Los datos de pago son gestionados directamente por Wompi y nunca se almacenan en nuestros servidores."
	}
];
function TermsSection() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		id: "terms",
		className: "bg-black text-white py-24 px-6 border-t border-white/10",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-4xl mx-auto",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
					...fadeUp,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs tracking-[0.3em] uppercase mb-3",
							children: "Legal"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-3xl md:text-5xl font-display tracking-wide",
							children: "Términos y condiciones"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-sm text-white/60 max-w-xl",
							children: "Compras, pedidos y políticas del drop LIVE LEAKS by INTI(t)."
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-12 grid sm:grid-cols-2 gap-6",
					children: TERMS.map((item, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
						...fadeUp,
						transition: {
							...fadeUp.transition,
							delay: i * .05
						},
						className: "border border-white/25 p-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[10px] tracking-[0.3em] uppercase opacity-60",
								children: String(i + 1).padStart(2, "0")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "mt-1 text-lg font-display tracking-wide",
								children: item.t
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm text-white/70 leading-relaxed",
								children: item.d
							})
						]
					}, item.t))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-10 text-xs text-white/45 tracking-wide",
					children: "Al confirmar tu compra aceptas estos términos. Última actualización: 2026."
				})
			]
		})
	});
}
function TerminosPage() {
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
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TermsSection, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {})
		]
	});
}
//#endregion
export { TerminosPage as component };
