import { r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { t as motion } from "../_libs/motion.mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as WompiBancolombiaLogos, c as CONTACT } from "./router-D51RQ65e.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/SiteFooter-v8hm7Vy5.js
var import_jsx_runtime = require_jsx_runtime();
function SiteFooter() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
		className: "bg-black text-white border-t border-white/10 py-12 px-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-6xl mx-auto flex flex-col gap-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col md:flex-row items-center justify-between gap-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "micro",
						children: "© LIVE LEAKS by INTI(t)"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center justify-center gap-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/pagos",
							className: "micro underline underline-offset-4 hover:opacity-60",
							children: "Pagos y envíos"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/terminos",
							className: "micro underline underline-offset-4 hover:opacity-60",
							children: "Términos y condiciones"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center gap-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SocialLink, {
							href: CONTACT.instagram,
							label: "Instagram",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
								viewBox: "0 0 24 24",
								className: "w-5 h-5",
								fill: "none",
								stroke: "currentColor",
								strokeWidth: "1.6",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
										x: "3",
										y: "3",
										width: "18",
										height: "18",
										rx: "5"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
										cx: "12",
										cy: "12",
										r: "4"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
										cx: "17.5",
										cy: "6.5",
										r: "1",
										fill: "currentColor",
										stroke: "none"
									})
								]
							})
						})
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "border-t border-white/10 pt-6 flex justify-center md:justify-start",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WompiBancolombiaLogos, {})
			})]
		})
	});
}
function SocialLink({ href, label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.a, {
		href,
		target: "_blank",
		rel: "noreferrer",
		"aria-label": label,
		whileHover: { scale: 1.05 },
		whileTap: { scale: .95 },
		className: "w-11 h-11 flex items-center justify-center hairline text-white hover:bg-white hover:text-black transition-colors duration-300",
		children
	});
}
//#endregion
export { SiteFooter as default };
