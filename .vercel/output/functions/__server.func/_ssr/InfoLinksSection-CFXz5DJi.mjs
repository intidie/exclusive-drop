import { r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { t as motion } from "../_libs/motion.mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/InfoLinksSection-CFXz5DJi.js
var import_jsx_runtime = require_jsx_runtime();
var LINKS = [{
	to: "/pagos",
	tag: "Pagos & envíos",
	title: "Paga como prefieras",
	desc: "Wompi: tarjeta, PSE, Nequi y Bancolombia. Envíos nacionales en Colombia."
}, {
	to: "/terminos",
	tag: "Legal",
	title: "Términos y condiciones",
	desc: "Compras, pedidos, envíos, cambios y datos personales del drop."
}];
function InfoLinksSection() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "relative bg-black text-white py-20 md:py-24 px-6 border-t border-white/10 grain",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "max-w-5xl mx-auto grid sm:grid-cols-2 gap-4 relative z-10",
			children: LINKS.map((l, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
				initial: {
					opacity: 0,
					y: 24
				},
				whileInView: {
					opacity: 1,
					y: 0
				},
				viewport: {
					once: true,
					amount: .3
				},
				transition: {
					duration: .5,
					delay: i * .08,
					ease: [
						.22,
						1,
						.36,
						1
					]
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: l.to,
					className: "block h-full hairline p-6 md:p-8 transition-colors duration-300 hover:bg-white hover:text-black",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "micro opacity-50",
							children: l.tag
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "mt-3 text-2xl md:text-3xl font-display tracking-wide leading-none",
							children: l.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-sm opacity-70",
							children: l.desc
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-5 micro underline underline-offset-4",
							children: "Ver más →"
						})
					]
				})
			}, l.to))
		})
	});
}
//#endregion
export { InfoLinksSection as default };
