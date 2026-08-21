import { t as AGENTS } from "./agents-ChgnjoDS.mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as CardContent, t as Card } from "./card-DdJaY46_.mjs";
import { t as MILESTONES } from "./status-G5BHUc_P.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/agents-CG_COnDP.js
var import_jsx_runtime = require_jsx_runtime();
function Agents() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] tracking-[0.22em] text-muted-foreground uppercase",
				children: "Sixteen seats"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-1 text-3xl",
				children: "The floor roster"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 max-w-xl text-sm text-muted-foreground",
				children: "Each agent has one job. Temperature and tools are house law. They speak JSON. You speak yes or no."
			})
		] }), MILESTONES.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "space-y-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-baseline gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "text-xl",
					children: [
						m.id,
						" · ",
						m.name
					]
				}), m.gate ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs tracking-widest text-muted-foreground uppercase",
					children: m.gate
				}) : null]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-3 md:grid-cols-2",
				children: AGENTS.filter((a) => a.milestone === m.id).map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "py-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-[11px] tracking-widest text-muted-foreground uppercase",
							children: a.id
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 font-display text-xl",
							children: a.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-muted-foreground",
							children: a.role
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-3 font-mono text-[11px] text-muted-foreground",
							children: [
								"temp ",
								a.temperature.toFixed(1),
								" · max ",
								a.maxTokens
							]
						})
					]
				}) }, a.id))
			})]
		}, m.id))]
	});
}
//#endregion
export { Agents as component };
