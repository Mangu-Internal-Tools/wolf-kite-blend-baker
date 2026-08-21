import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { r as cn } from "./router-CNTpse4e.mjs";
import { r as STATUS_LABEL } from "./status-G5BHUc_P.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/status-badge-aLYy22Ya.js
var import_jsx_runtime = require_jsx_runtime();
var badgeVariants = cva("inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium tracking-wide uppercase", {
	variants: { variant: {
		default: "bg-primary text-primary-foreground",
		muted: "bg-muted text-muted-foreground",
		outline: "shadow-[var(--shadow-border)] text-muted-foreground",
		paper: "bg-paper text-ink"
	} },
	defaultVariants: { variant: "muted" }
});
function Badge({ className, variant, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn(badgeVariants({ variant }), className),
		...props
	});
}
function StatusBadge({ status }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
		className: cn("normal-case tracking-normal", status === "PUBLISHED" ? "bg-paper text-ink" : status === "REJECTED" ? "bg-destructive/15 text-destructive" : status === "TOP10" || status === "LOCKED" || status === "DRAFTING" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"),
		children: STATUS_LABEL[status]
	});
}
//#endregion
export { StatusBadge as t };
