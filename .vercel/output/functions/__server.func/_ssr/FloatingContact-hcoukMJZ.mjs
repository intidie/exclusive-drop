import { r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { t as motion } from "../_libs/motion.mjs";
import { c as CONTACT } from "./router-D51RQ65e.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/FloatingContact-hcoukMJZ.js
var import_jsx_runtime = require_jsx_runtime();
function FloatingContact() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed bottom-5 right-5 z-50 flex flex-col gap-3",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.a, {
			initial: {
				opacity: 0,
				y: 20
			},
			animate: {
				opacity: 1,
				y: 0
			},
			transition: {
				delay: 1,
				duration: .6
			},
			href: CONTACT.instagram,
			target: "_blank",
			rel: "noreferrer",
			"aria-label": "Instagram",
			whileHover: { scale: 1.08 },
			whileTap: { scale: .92 },
			className: "w-12 h-12 flex items-center justify-center bg-white text-black border border-black hover:bg-black hover:text-white transition-colors duration-300",
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
	});
}
//#endregion
export { FloatingContact as default };
