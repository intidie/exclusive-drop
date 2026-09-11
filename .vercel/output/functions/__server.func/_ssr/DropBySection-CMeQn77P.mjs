import { r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { t as motion } from "../_libs/motion.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/DropBySection-CMeQn77P.js
var import_jsx_runtime = require_jsx_runtime();
var intit_pack_png_asset_default = {
	version: 1,
	asset_id: "0a420da3-ea6a-48b7-9d65-4abdb7e8ea2f",
	project_id: "a597067b-b02c-465f-a484-04190d5b9887",
	url: "/images/intit-pack.webp",
	r2_key: "",
	original_filename: "intit-pack.png",
	size: 174222,
	content_type: "image/webp",
	created_at: "2026-06-23T04:56:02Z"
};
function DropBySection() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "relative bg-black text-white py-12 md:py-16 px-6 grain scanlines overflow-hidden",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-3xl mx-auto flex flex-col items-center text-center gap-5 relative z-10",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.p, {
					initial: {
						opacity: 0,
						y: 20
					},
					whileInView: {
						opacity: 1,
						y: 0
					},
					viewport: { once: true },
					transition: { duration: .6 },
					className: "text-xs md:text-sm tracking-[0.5em] uppercase font-mono text-white/70",
					children: "Drop By:"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.img, {
					initial: {
						opacity: 0,
						scale: .92
					},
					whileInView: {
						opacity: 1,
						scale: 1
					},
					viewport: { once: true },
					transition: {
						duration: .8,
						ease: [
							.22,
							1,
							.36,
							1
						]
					},
					whileHover: { scale: 1.04 },
					src: intit_pack_png_asset_default.url,
					alt: "INTI(t) Pleasure Pack",
					loading: "lazy",
					decoding: "async",
					onError: (e) => {
						e.currentTarget.src = "data:image/svg+xml;utf8," + encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'><rect width='600' height='600' fill='#111'/><text x='50%' y='50%' fill='#fff' font-family='monospace' font-size='48' font-weight='900' text-anchor='middle' dominant-baseline='middle'>INTI(t)</text></svg>`);
					},
					className: "w-full max-w-[220px] md:max-w-xs shadow-[0_20px_60px_rgba(255,255,255,0.08)]"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.p, {
					initial: { opacity: 0 },
					whileInView: { opacity: 1 },
					viewport: { once: true },
					transition: {
						duration: .6,
						delay: .2
					},
					className: "text-3xl md:text-4xl font-display tracking-wide",
					children: "INTI(t)"
				})
			]
		})
	});
}
//#endregion
export { DropBySection as default };
