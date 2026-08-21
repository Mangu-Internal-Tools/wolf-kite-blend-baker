import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { r as cn } from "./router-CNTpse4e.mjs";
import { t as MILESTONES } from "./status-G5BHUc_P.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/pipeline-rail-CCnJvIrx.js
var import_jsx_runtime = require_jsx_runtime();
function PipelineRail({ active }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
		className: "flex gap-2 overflow-x-auto pb-1",
		children: MILESTONES.map((m, i) => {
			const on = active === m.id;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "flex min-w-max items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: cn("rounded-lg px-3 py-2 shadow-[var(--shadow-border)]", on ? "bg-primary text-primary-foreground" : "bg-card"),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-[10px] tracking-widest uppercase opacity-70",
							children: m.id
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-medium",
							children: m.name
						}),
						m.gate ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] opacity-70",
							children: m.gate
						}) : null
					]
				}), i < MILESTONES.length - 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-muted-foreground",
					"aria-hidden": true,
					children: "→"
				}) : null]
			}, m.id);
		})
	});
}
//#endregion
export { PipelineRail as t };
