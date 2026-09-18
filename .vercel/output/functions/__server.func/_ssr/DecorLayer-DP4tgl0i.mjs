import { r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/DecorLayer-DP4tgl0i.js
var import_jsx_runtime = require_jsx_runtime();
/**
* Decorative skeleton sketch repeated down the whole page (inverted, no background).
* Purely visual: fixed, non-interactive, very low opacity.
*/
function DecorLayer() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		"aria-hidden": true,
		className: "pointer-events-none fixed inset-0 z-0 overflow-hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: "/images/decor-skeleton.webp",
				alt: "",
				loading: "lazy",
				decoding: "async",
				className: "absolute -left-16 top-[6%] w-56 md:w-96 opacity-[0.65] mix-blend-screen animate-decor-drift"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: "/images/decor-skeleton.webp",
				alt: "",
				loading: "lazy",
				decoding: "async",
				className: "absolute -right-20 top-[42%] w-64 md:w-[26rem] opacity-[0.65] mix-blend-screen scale-x-[-1] animate-decor-drift",
				style: { animationDelay: "-6s" }
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: "/images/decor-skeleton.webp",
				alt: "",
				loading: "lazy",
				decoding: "async",
				className: "absolute left-[8%] bottom-[-8%] w-36 md:w-56 opacity-[0.07] mix-blend-screen rotate-12 animate-decor-drift",
				style: { animationDelay: "-12s" }
			})
		]
	});
}
//#endregion
export { DecorLayer as default };
