import { r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { t as motion } from "../_libs/motion.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/AdultsOnlySection-DHNSvtE-.js
var import_jsx_runtime = require_jsx_runtime();
var adults_only_png_asset_default = {
	version: 1,
	asset_id: "0d849cd3-9b84-4536-83ce-770b915eaa80",
	project_id: "a597067b-b02c-465f-a484-04190d5b9887",
	url: "/images/adults-only.webp",
	r2_key: "",
	original_filename: "adults-only.png",
	size: 143595,
	content_type: "image/png",
	created_at: "2026-06-23T04:56:02Z"
};
function AdultsOnlySection() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "relative bg-black text-white py-20 md:py-28 px-6 overflow-hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pointer-events-none absolute inset-0 opacity-[0.18] mix-blend-overlay",
				style: {
					backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.6 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
					animation: "noiseShift 0.8s steps(4) infinite"
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: `
        @keyframes noiseShift {
          0% { transform: translate(0,0); }
          25% { transform: translate(-6px,4px); }
          50% { transform: translate(4px,-6px); }
          75% { transform: translate(-3px,-3px); }
          100% { transform: translate(0,0); }
        }
        @keyframes spin3d {
          0% { transform: perspective(800px) rotateY(0deg) rotateX(8deg); }
          100% { transform: perspective(800px) rotateY(360deg) rotateX(8deg); }
        }
      ` }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "max-w-5xl mx-auto flex flex-col items-center text-center gap-8 relative z-10",
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
						className: "text-xs tracking-[0.4em] uppercase font-mono text-red-500",
						children: "Warning // Mature Content"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
						initial: {
							opacity: 0,
							scale: .8
						},
						whileInView: {
							opacity: 1,
							scale: 1
						},
						viewport: { once: true },
						transition: {
							duration: .7,
							ease: [
								.22,
								1,
								.36,
								1
							]
						},
						className: "relative",
						style: {
							width: 220,
							height: 320
						},
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "absolute inset-0 flex items-center justify-center",
							style: {
								transformStyle: "preserve-3d",
								animation: "spin3d 6s linear infinite"
							},
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: adults_only_png_asset_default.url,
								alt: "Adults Only 18+",
								loading: "lazy",
								decoding: "async",
								onError: (e) => {
									e.currentTarget.src = "data:image/svg+xml;utf8," + encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 220 320'><rect width='220' height='320' fill='#000'/><text x='50%' y='50%' fill='#fff' font-family='monospace' font-size='40' font-weight='900' text-anchor='middle' dominant-baseline='middle'>18+</text></svg>`);
								},
								className: "w-full h-full object-contain drop-shadow-[0_0_30px_rgba(255,255,255,0.25)] invert"
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.h2, {
						initial: { opacity: 0 },
						whileInView: { opacity: 1 },
						viewport: { once: true },
						transition: { duration: .6 },
						className: "text-2xl md:text-4xl font-black tracking-tight",
						children: "DROP RESERVADO PARA MAYORES"
					})
				]
			})
		]
	});
}
//#endregion
export { AdultsOnlySection as default };
