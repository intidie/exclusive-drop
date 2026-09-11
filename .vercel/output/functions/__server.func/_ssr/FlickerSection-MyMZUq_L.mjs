import { r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/FlickerSection-MyMZUq_L.js
var import_jsx_runtime = require_jsx_runtime();
function FlickerSection() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "relative bg-black text-white py-14 md:py-20 px-6 overflow-hidden grain",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "max-w-4xl mx-auto flex flex-col items-center relative z-10",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: "/images/heart-scan.webp",
				alt: "INTI(t) heart scan",
				width: 736,
				height: 736,
				loading: "lazy",
				decoding: "async",
				className: "w-[75vw] max-w-lg h-auto invert mix-blend-screen animate-flicker-frenetic"
			})
		})
	});
}
//#endregion
export { FlickerSection as default };
