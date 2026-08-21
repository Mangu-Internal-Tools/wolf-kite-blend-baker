import { o as __toESM } from "../_runtime.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as useQueryClient } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { r as cn } from "./router-CNTpse4e.mjs";
import { n as CardContent, t as Card } from "./card-DdJaY46_.mjs";
import { t as Button } from "./button-Cp5rZOib.mjs";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-Ccjxlw2w.mjs";
import { i as logRun, n as insertConcepts, o as useAiStatus, r as invokeAgent, t as addEvent } from "./use-house-C_PgiLxI.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ideate-C5RHXQYZ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var GENRES = [
	{
		id: "lcgft-domestic",
		tab: "LCGFT",
		name: "Domestic fiction",
		note: "Households, marriages, quiet ruptures"
	},
	{
		id: "lcgft-historical",
		tab: "LCGFT",
		name: "Historical fiction",
		note: "Past as pressure, not costume"
	},
	{
		id: "lcgft-mystery",
		tab: "LCGFT",
		name: "Detective and mystery fiction",
		note: "Crime as moral architecture"
	},
	{
		id: "lcgft-sf",
		tab: "LCGFT",
		name: "Science fiction",
		note: "Systems, futures, consequence"
	},
	{
		id: "lcgft-fantasy",
		tab: "LCGFT",
		name: "Fantasy fiction",
		note: "World-rules with costs"
	},
	{
		id: "lcgft-romance",
		tab: "LCGFT",
		name: "Romance fiction",
		note: "Want vs. self-knowledge"
	},
	{
		id: "lcgft-horror",
		tab: "LCGFT",
		name: "Horror fiction",
		note: "Dread with a thesis"
	},
	{
		id: "lcgft-bildungsroman",
		tab: "LCGFT",
		name: "Bildungsromans",
		note: "Becoming, not montage"
	},
	{
		id: "lcgft-psych",
		tab: "LCGFT",
		name: "Psychological fiction",
		note: "Interior weather"
	},
	{
		id: "lcgft-althist",
		tab: "LCGFT",
		name: "Alternative histories",
		note: "One hinge, many lives"
	},
	{
		id: "lcgft-epistolary",
		tab: "LCGFT",
		name: "Epistolary fiction",
		note: "Voice as evidence"
	},
	{
		id: "lcgft-noir",
		tab: "LCGFT",
		name: "Noir fiction",
		note: "City as accomplice"
	},
	{
		id: "pop-romantasy",
		tab: "Popular",
		name: "Romantasy",
		note: "Court, magic, irreversible want"
	},
	{
		id: "pop-dark-ac",
		tab: "Popular",
		name: "Dark academia",
		note: "Archives, ambition, rot"
	},
	{
		id: "pop-cozy",
		tab: "Popular",
		name: "Cozy mystery",
		note: "Community, tea, a body"
	},
	{
		id: "pop-litrpg",
		tab: "Popular",
		name: "LitRPG",
		note: "Stats as character"
	},
	{
		id: "pop-cli-fi",
		tab: "Popular",
		name: "Climate fiction",
		note: "Weather as antagonist"
	},
	{
		id: "pop-romantasy-cozy",
		tab: "Popular",
		name: "Cozy romantasy",
		note: "Low-stakes magic, high feeling"
	},
	{
		id: "pop-domestic-suspense",
		tab: "Popular",
		name: "Domestic suspense",
		note: "The house knows"
	},
	{
		id: "pop-booktok-ya",
		tab: "Popular",
		name: "YA rivals-to-lovers",
		note: "School, status, spark"
	},
	{
		id: "pop-found-family",
		tab: "Popular",
		name: "Found-family adventure",
		note: "Crew as home"
	},
	{
		id: "pop-second-chance",
		tab: "Popular",
		name: "Second-chance romance",
		note: "Time as the third lover"
	},
	{
		id: "int-magical-realism",
		tab: "International",
		name: "Magical realism",
		note: "Miracle as weather report"
	},
	{
		id: "int-nordic-noir",
		tab: "International",
		name: "Nordic noir",
		note: "Cold light, long memory"
	},
	{
		id: "int-i-novel",
		tab: "International",
		name: "Japanese I-novel",
		note: "Self as specimen"
	},
	{
		id: "int-lagos",
		tab: "International",
		name: "Lagos city novel",
		note: "Hustle, kinship, heat"
	},
	{
		id: "int-partition",
		tab: "International",
		name: "Partition histories",
		note: "Border as family wound"
	},
	{
		id: "int-caribbean",
		tab: "International",
		name: "Caribbean gothic",
		note: "Island, inheritance, haunt"
	},
	{
		id: "int-sao-paulo",
		tab: "International",
		name: "São Paulo night fiction",
		note: "Vertical city, hidden floors"
	},
	{
		id: "int-seoul",
		tab: "International",
		name: "Seoul workplace noir",
		note: "Hierarchy as horror"
	},
	{
		id: "com-memoir",
		tab: "Comics",
		name: "Graphic memoir",
		note: "Drawn memory, spare captions"
	},
	{
		id: "com-decon",
		tab: "Comics",
		name: "Superhero deconstruction",
		note: "Power after the costume"
	},
	{
		id: "com-manga-ya",
		tab: "Comics",
		name: "Manga-inspired YA",
		note: "Panel rhythm, school heat"
	},
	{
		id: "com-slice",
		tab: "Comics",
		name: "Slice-of-life comics",
		note: "Small rooms, large feeling"
	},
	{
		id: "com-myth",
		tab: "Comics",
		name: "Myth retelling graphic",
		note: "Old gods, new linework"
	},
	{
		id: "com-reporter",
		tab: "Comics",
		name: "Comics journalism",
		note: "Witness in ink"
	}
];
var TABS = [
	"LCGFT",
	"Popular",
	"International",
	"Comics"
];
function Ideate() {
	const ai = useAiStatus();
	const qc = useQueryClient();
	const [tab, setTab] = (0, import_react.useState)("Popular");
	const [picked, setPicked] = (0, import_react.useState)(GENRES.find((g) => g.id === "pop-cli-fi") ?? GENRES[0]);
	const [stage, setStage] = (0, import_react.useState)("idle");
	const [statusLine, setStatusLine] = (0, import_react.useState)("");
	const [scout, setScout] = (0, import_react.useState)(null);
	const [ideas, setIdeas] = (0, import_react.useState)([]);
	const [critic, setCritic] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)(null);
	async function runNightly() {
		if (!picked) return;
		if (!ai.data?.available) {
			toast.error("The press floor is dark — AI is not available.");
			return;
		}
		setError(null);
		setCritic(null);
		setIdeas([]);
		setScout(null);
		try {
			setStage("scout");
			setStatusLine(`Scout is walking the ${picked.name} landscape`);
			const scoutRes = await invokeAgent({ data: {
				agentId: "M1-Scout",
				payload: `Genre: ${picked.name}\nSource tab: ${picked.tab}\nNote: ${picked.note}\nRun date: ${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}\nResearch this genre cell and return the Scout JSON.`
			} });
			if (!scoutRes.ok) throw new Error(scoutRes.error);
			setScout(scoutRes.json);
			await logRun({ data: {
				agentName: "M1-Scout",
				milestone: "M1",
				status: "done",
				output: scoutRes.json,
				durationMs: scoutRes.durationMs
			} });
			setStage("ideator");
			setStatusLine("Ideator is drafting eight original concepts");
			const ideaRes = await invokeAgent({ data: {
				agentId: "M1-Ideator",
				payload: `Genre: ${picked.name}\nScout brief:\n${JSON.stringify(scoutRes.json)}`
			} });
			if (!ideaRes.ok) throw new Error(ideaRes.error);
			const conceptList = Array.isArray(ideaRes.json.concepts) ? ideaRes.json.concepts : [];
			setIdeas(conceptList);
			await logRun({ data: {
				agentName: "M1-Ideator",
				milestone: "M1",
				status: "done",
				output: ideaRes.json,
				durationMs: ideaRes.durationMs
			} });
			setStage("critic");
			setStatusLine("Critic is scoring the eight and keeping three");
			const criticRes = await invokeAgent({ data: {
				agentId: "M1-Critic",
				payload: `Genre: ${picked.name}\nConcepts:\n${JSON.stringify(conceptList)}`
			} });
			if (!criticRes.ok) throw new Error(criticRes.error);
			setCritic(criticRes.json);
			await logRun({ data: {
				agentName: "M1-Critic",
				milestone: "M1",
				status: "done",
				output: criticRes.json,
				durationMs: criticRes.durationMs
			} });
			setStage("saving");
			setStatusLine("Writing the ledger");
			const kept = new Set((Array.isArray(criticRes.json.kept) ? criticRes.json.kept : []).map((k) => k.title).filter(Boolean));
			const criticByTitle = {};
			if (Array.isArray(criticRes.json.kept)) {
				for (const k of criticRes.json.kept) if (k.title) criticByTitle[k.title] = k;
			}
			await insertConcepts({ data: { items: conceptList.map((c) => ({
				working_title: c.title,
				logline: c.logline,
				genre: picked.name,
				source_tab: picked.tab,
				status: kept.has(c.title) ? "TOP10" : "BANKED",
				confidence: c.confidence,
				protagonist_sketch: c.protagonist_sketch,
				setting: c.setting,
				fresh_because: c.fresh_because,
				comps: c.comps ?? [],
				critic: criticByTitle[c.title] ?? null,
				scout_brief: scoutRes.json
			})) } });
			await addEvent({ data: { message: `Nightly ideation on ${picked.name}: ${kept.size} promoted to Top 10, ${Math.max(conceptList.length - kept.size, 0)} banked.` } });
			await qc.invalidateQueries({ queryKey: ["concepts"] });
			await qc.invalidateQueries({ queryKey: ["events"] });
			setStage("done");
			setStatusLine("The night's list is on the table.");
			toast.success("Top 10 is waiting for TAP 1.");
		} catch (err) {
			setStage("error");
			const message = err instanceof Error ? err.message : "The run failed.";
			setError(message);
			toast.error(message);
		}
	}
	const running = [
		"scout",
		"ideator",
		"critic",
		"saving"
	].includes(stage);
	const keptTitles = new Set((Array.isArray(critic?.kept) ? critic?.kept : []).map((k) => k.title).filter(Boolean));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] tracking-[0.22em] text-muted-foreground uppercase",
						children: "M1 · Nightly ideation"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-1 text-3xl",
						children: "Pick a cell. Let the house think."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 max-w-xl text-sm text-muted-foreground",
						children: "Scout, Ideator, and Critic run in sequence. Three titles land in Top 10. Five wait in the bank. You tap in the morning."
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: runNightly,
					disabled: !picked || running,
					size: "lg",
					children: running ? "On the floor…" : "Run this cell"
				})]
			}),
			running || stage === "done" || stage === "error" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "py-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: cn("text-sm", running && "shimmer"),
					children: statusLine || "Working"
				}), error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-destructive",
					children: error
				}) : null]
			}) }) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
				value: tab,
				onValueChange: (v) => setTab(v),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsList, {
					className: "w-full justify-start overflow-x-auto",
					children: TABS.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
						value: t,
						children: t
					}, t))
				}), TABS.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: t,
					className: "mt-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid gap-2 sm:grid-cols-2 lg:grid-cols-3",
						children: GENRES.filter((g) => g.tab === t).map((g) => {
							const on = picked?.id === g.id;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setPicked(g),
								className: cn("rounded-xl px-4 py-3 text-left transition-colors", on ? "bg-primary text-primary-foreground" : "bg-card shadow-[var(--shadow-border)] hover:bg-accent"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-medium",
									children: g.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: cn("mt-1 text-xs", on ? "opacity-80" : "text-muted-foreground"),
									children: g.note
								})]
							}, g.id);
						})
					})
				}, t))]
			}),
			scout ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "space-y-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-xl",
					children: "Scout"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "space-y-2 py-5 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: String(scout.landscape ?? "") }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-muted-foreground",
						children: ["Saturation: ", String(scout.saturation_level ?? "—")]
					})]
				}) })]
			}) : null,
			ideas.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "space-y-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-xl",
					children: "Eight from the Ideator"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-3 md:grid-cols-2",
					children: ideas.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						className: cn(keptTitles.has(c.title) && "ring-1 ring-primary"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
							className: "py-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-display text-lg leading-tight",
									children: c.title
								}), keptTitles.has(c.title) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] tracking-widest uppercase",
									children: "Top 10"
								}) : null]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm text-muted-foreground",
								children: c.logline
							})]
						})
					}, c.title))
				})]
			}) : null,
			stage === "done" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/taps",
					children: "Review TAP 1"
				})
			}) : null
		]
	});
}
//#endregion
export { Ideate as component };
