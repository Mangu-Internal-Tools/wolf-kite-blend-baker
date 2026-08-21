import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as CardContent, t as Card } from "./card-DdJaY46_.mjs";
import { o as tapForStatus } from "./status-G5BHUc_P.mjs";
import { t as StatusBadge } from "./status-badge-aLYy22Ya.mjs";
import { t as Button } from "./button-Cp5rZOib.mjs";
import { c as useConcepts } from "./use-house-C_PgiLxI.mjs";
import { r as pendingTaps } from "./house-BNTZLD23.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/taps-BMNz-oKd.js
var import_jsx_runtime = require_jsx_runtime();
var COPY = {
	1: {
		title: "TAP 1 · Approve a concept",
		body: "Morning list. Keep one. Bank or skip the rest. Architect waits on your yes."
	},
	2: {
		title: "TAP 2 · Sign the story plan",
		body: "Blueprint, beats, chapter map. Approve to open the press. Request changes if the spine is wrong."
	},
	3: {
		title: "TAP 3 · Sign the manuscript",
		body: "Quality Gate has read the book. Sign it to editorial, or send it back with a note."
	}
};
function Taps() {
	const q = useConcepts();
	const taps = pendingTaps(q.data ?? []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-[11px] tracking-[0.22em] text-muted-foreground uppercase",
			children: "Human gates"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "mt-1 text-3xl",
			children: "Three taps. The rest is machinery."
		})] }), [
			1,
			2,
			3
		].map((n) => {
			const items = taps.filter((c) => tapForStatus(c.status) === n);
			const copy = COPY[n];
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "space-y-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-xl",
					children: copy.title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: copy.body
				})] }), items.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "Nothing waiting."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-3",
					children: items.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "flex flex-col gap-4 py-5 sm:flex-row sm:items-start sm:justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: c.status }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 font-display text-2xl leading-tight",
									children: c.working_title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 max-w-xl text-sm text-muted-foreground",
									children: c.logline
								}),
								c.fresh_because ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-2 max-w-xl text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "Fresh because · "
									}), c.fresh_because]
								}) : null
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							className: "shrink-0",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/books/$id",
								params: { id: c.id },
								children: "Open the book"
							})
						})]
					}) }) }, c.id))
				})]
			}, n);
		})]
	});
}
//#endregion
export { Taps as component };
