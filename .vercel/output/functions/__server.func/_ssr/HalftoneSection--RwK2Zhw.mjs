import { r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { t as motion } from "../_libs/motion.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/HalftoneSection--RwK2Zhw.js
var import_jsx_runtime = require_jsx_runtime();
function HalftoneSection() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "relative bg-black text-white py-16 md:py-24 px-6 grain scanlines overflow-hidden border-t border-white/10",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-3xl mx-auto relative z-10 flex flex-col items-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
				initial: {
					opacity: 0,
					scale: 1.04
				},
				whileInView: {
					opacity: 1,
					scale: 1
				},
				viewport: {
					once: true,
					amount: .3
				},
				transition: {
					duration: .9,
					ease: [
						.22,
						1,
						.36,
						1
					]
				},
				className: "w-full max-w-lg relative",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: "/images/halftone-face.webp",
					alt: "Serigrafía halftone INTI(t)",
					width: 900,
					height: 849,
					loading: "lazy",
					decoding: "async",
					className: "w-full h-auto invert contrast-150 mix-blend-screen opacity-90 glitch"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 pointer-events-none scanlines" })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "micro mt-6 text-white/45 text-center",
				children: "Serigrafía · half-tone · 45°"
			})]
		})
	});
}
//#endregion
export { HalftoneSection as default };
