import { o as __toESM } from "../_runtime.mjs";
import { n as getAgent } from "./agents-ChgnjoDS.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as useQueryClient } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as wordCount, i as formatTime, n as Route, r as cn } from "./router-CNTpse4e.mjs";
import { n as CardContent, t as Card } from "./card-DdJaY46_.mjs";
import { a as milestoneForStatus } from "./status-G5BHUc_P.mjs";
import { t as PipelineRail } from "./pipeline-rail-CCnJvIrx.mjs";
import { t as StatusBadge } from "./status-badge-aLYy22Ya.mjs";
import { t as Button } from "./button-Cp5rZOib.mjs";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-Ccjxlw2w.mjs";
import { a as updateConcept, i as logRun, o as useAiStatus, r as invokeAgent, s as useConcept, t as addEvent, u as useRuns } from "./use-house-C_PgiLxI.mjs";
import { i as plannedChapterCount, t as chapterWordTotal } from "./house-BNTZLD23.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/books._id-CJ1k_kfL.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function JsonBlock({ value, className }) {
	if (value == null) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-muted-foreground",
		children: "Not written yet."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
		className: cn("max-h-[480px] overflow-auto rounded-lg bg-muted p-4 font-mono text-xs leading-relaxed text-foreground/90", className),
		children: JSON.stringify(value, null, 2)
	});
}
var Textarea = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
	ref,
	className: cn("flex min-h-28 w-full rounded-md bg-secondary px-3 py-2 text-sm text-foreground shadow-[var(--shadow-border)] placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", className),
	...props
}));
Textarea.displayName = "Textarea";
function BookPage() {
	const { id } = Route.useParams();
	const q = useConcept(id);
	const runs = useRuns(id);
	const concept = q.data;
	if (q.isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-muted-foreground",
		children: "Pulling the folder…"
	});
	if (!concept) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "text-3xl",
			children: "Missing folder"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			asChild: true,
			variant: "secondary",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/ledger",
				children: "Back to ledger"
			})
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-[11px] tracking-[0.22em] text-muted-foreground uppercase",
							children: [
								concept.genre,
								" · ",
								concept.source_tab
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "mt-1 text-3xl sm:text-4xl",
							children: concept.working_title
						}),
						concept.subtitle ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-muted-foreground",
							children: concept.subtitle
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 max-w-2xl text-sm text-muted-foreground",
							children: concept.logline
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 flex flex-wrap items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: concept.status }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-xs text-muted-foreground",
								children: [chapterWordTotal(concept).toLocaleString(), " words drafted"]
							})]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PipelineRail, { active: milestoneForStatus(concept.status) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookActions, { concept }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
				defaultValue: "overview",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
						className: "mb-4 w-full justify-start overflow-x-auto",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "overview",
								children: "Overview"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "row",
								children: "Concept row"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "plan",
								children: "Story plan"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "ms",
								children: "Manuscript"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "press",
								children: "Press"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "log",
								children: "Log"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
						value: "overview",
						className: "space-y-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-3 md:grid-cols-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
									label: "Protagonist",
									value: concept.protagonist_sketch
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
									label: "Setting",
									value: concept.setting
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
									label: "Fresh because",
									value: concept.fresh_because
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
									label: "Comps",
									value: concept.comps.length ? concept.comps.map((c) => c.title).join(" · ") : "None listed"
								})
							]
						}), concept.critic ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(JsonBlock, { value: concept.critic }) : null]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "row",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(JsonBlock, { value: concept.concept_row })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "plan",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(JsonBlock, { value: concept.story_plan })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "ms",
						className: "space-y-6",
						children: concept.chapters.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: "No chapters on the spindle yet."
						}) : concept.chapters.slice().sort((a, b) => a.chapter_number - b.chapter_number).map((ch) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
							className: "paper-sheet rounded-xl px-6 py-8 sm:px-10",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-[11px] tracking-[0.2em] uppercase",
									children: [
										"Chapter ",
										String(ch.chapter_number).padStart(2, "0"),
										ch.chapter_title ? ` · ${ch.chapter_title}` : ""
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-1 text-xs opacity-60",
									children: [ch.word_count, " words"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-6 space-y-4 font-display text-[1.05rem] leading-8",
									children: ch.prose.split(/\n\n+/).map((para, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: para }, i))
								})
							]
						}, ch.chapter_number))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
						value: "press",
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-display text-lg",
								children: "Metadata"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(JsonBlock, { value: concept.metadata_pkg }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-display text-lg",
								children: "Production pack"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(JsonBlock, { value: concept.production_pack })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "log",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
							className: "divide-y divide-border p-0",
							children: (runs.data ?? []).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "p-5 text-sm text-muted-foreground",
								children: "No agent runs on this title yet."
							}) : (runs.data ?? []).map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "px-4 py-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-sm",
										children: [
											r.agent_name,
											" · ",
											r.status
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "font-mono text-[11px] text-muted-foreground tabular-nums",
										children: [formatTime(r.created_at), r.duration_ms ? ` · ${Math.round(r.duration_ms / 1e3)}s` : ""]
									}),
									r.error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-xs text-destructive",
										children: r.error
									}) : null
								]
							}, r.id))
						}) })
					})
				]
			})
		]
	});
}
function Fact({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
		className: "py-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-[11px] tracking-widest text-muted-foreground uppercase",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-sm",
			children: value || "—"
		})]
	}) });
}
function BookActions({ concept }) {
	const qc = useQueryClient();
	const ai = useAiStatus();
	const [busy, setBusy] = (0, import_react.useState)(null);
	const [notes, setNotes] = (0, import_react.useState)(concept.tap_notes ?? "");
	async function refresh() {
		await qc.invalidateQueries({ queryKey: ["concept", concept.id] });
		await qc.invalidateQueries({ queryKey: ["concepts"] });
		await qc.invalidateQueries({ queryKey: ["events"] });
		await qc.invalidateQueries({ queryKey: ["runs", concept.id] });
	}
	async function callAgent(agentId, payload) {
		const agent = getAgent(agentId);
		const res = await invokeAgent({ data: {
			agentId,
			payload
		} });
		await logRun({ data: {
			conceptId: concept.id,
			agentName: agentId,
			milestone: agent.milestone,
			status: res.ok ? "done" : "error",
			output: res.ok ? res.json : null,
			error: res.ok ? null : res.error,
			durationMs: res.ok ? res.durationMs : void 0
		} });
		if (!res.ok) throw new Error(res.error);
		return res.json;
	}
	async function wrap(label, fn) {
		if (ai.data && ai.data.available === false && !label.startsWith("Tap")) {
			toast.error("AI is not available in this environment.");
			return;
		}
		setBusy(label);
		try {
			await fn();
			await refresh();
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "The floor stalled.");
		} finally {
			setBusy(null);
		}
	}
	const planned = plannedChapterCount(concept);
	const drafted = concept.chapters.length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
		className: "space-y-4 py-5",
		children: [
			busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "shimmer text-sm",
				children: busy
			}) : null,
			concept.status === "TOP10" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gate, {
				title: "TAP 1 — Approve this concept?",
				disabled: Boolean(busy),
				onYes: () => wrap("Tap 1", async () => {
					await updateConcept({ data: {
						id: concept.id,
						patch: { status: "APPROVED" }
					} });
					await addEvent({ data: {
						conceptId: concept.id,
						message: `${concept.working_title} approved. Architect may build the row.`
					} });
					toast.success("Approved. Run the Architect next.");
				}),
				onSkip: () => wrap("Tap 1", async () => {
					await updateConcept({ data: {
						id: concept.id,
						patch: { status: "BANKED" }
					} });
					await addEvent({ data: {
						conceptId: concept.id,
						message: `${concept.working_title} returned to the bank.`
					} });
				}),
				onNo: () => wrap("Tap 1", async () => {
					await updateConcept({ data: {
						id: concept.id,
						patch: { status: "REJECTED" }
					} });
				})
			}) : null,
			concept.status === "APPROVED" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				disabled: Boolean(busy),
				onClick: () => wrap("Architect is expanding the Concept Row", async () => {
					const json = await callAgent("M2-Architect", `Approved concept:\n${JSON.stringify({
						title: concept.working_title,
						logline: concept.logline,
						genre: concept.genre,
						protagonist_sketch: concept.protagonist_sketch,
						setting: concept.setting,
						fresh_because: concept.fresh_because,
						comps: concept.comps,
						critic: concept.critic,
						scout_brief: concept.scout_brief
					})}`);
					const title = String(json.working_title || concept.working_title);
					await updateConcept({ data: {
						id: concept.id,
						patch: {
							working_title: title,
							subtitle: json.subtitle ? String(json.subtitle) : concept.subtitle,
							concept_row: json,
							status: "LOCKED"
						}
					} });
					await addEvent({ data: {
						conceptId: concept.id,
						message: `${title} Concept Row is locked.`
					} });
					toast.success("Row locked. Story plan is next.");
				}),
				children: "Run Architect"
			}) : null,
			concept.status === "LOCKED" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3",
				children: [!concept.story_plan ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					disabled: Boolean(busy),
					onClick: () => wrap("Blueprint Maker is on the floor", async () => {
						const row = concept.concept_row ?? {};
						const blueprint = await callAgent("M3-BlueprintMaker", `Concept Row:\n${JSON.stringify(row)}`);
						setBusy("Beat Writer is laying the spine");
						const beats = await callAgent("M3-BeatWriter", `Concept Row:\n${JSON.stringify(row)}\nBlueprint:\n${JSON.stringify(blueprint)}`);
						setBusy("Chapter Mapper is grouping beats");
						const chapters = await callAgent("M3-ChapterMapper", `Concept Row:\n${JSON.stringify(row)}\nBlueprint:\n${JSON.stringify(blueprint)}\nBeats:\n${JSON.stringify(beats)}`);
						await updateConcept({ data: {
							id: concept.id,
							patch: { story_plan: {
								blueprint,
								beats,
								chapters
							} }
						} });
						await addEvent({ data: {
							conceptId: concept.id,
							message: `Story plan for ${concept.working_title} is ready for TAP 2.`
						} });
						toast.success("Plan is on your desk.");
					}),
					children: "Build story plan"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gate, {
					title: "TAP 2 — Sign this story plan?",
					disabled: Boolean(busy),
					onYes: () => wrap("Tap 2", async () => {
						await updateConcept({ data: {
							id: concept.id,
							patch: {
								status: "PLAN_APPROVED",
								tap_notes: notes
							}
						} });
						await addEvent({ data: {
							conceptId: concept.id,
							message: `Story plan signed for ${concept.working_title}. Press may open.`
						} });
						toast.success("Plan signed.");
					}),
					onNo: () => wrap("Tap 2", async () => {
						await updateConcept({ data: {
							id: concept.id,
							patch: {
								tap_notes: notes,
								story_plan: null
							}
						} });
						toast.success("Plan cleared. Rebuild when ready.");
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
					value: notes,
					onChange: (e) => setNotes(e.target.value),
					placeholder: "Notes for the floor (optional)"
				})]
			}) : null,
			concept.status === "PLAN_APPROVED" || concept.status === "DRAFTING" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-muted-foreground",
						children: [
							drafted,
							" of ",
							planned || "?",
							" chapters on the spindle."
						]
					}),
					planned > 0 && drafted < planned ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						disabled: Boolean(busy),
						onClick: () => wrap("Ghostwriter is at the desk", async () => {
							await draftNextChapter(concept, callAgent, setBusy);
						}),
						children: "Draft next chapter"
					}) : null,
					planned > 0 && drafted >= planned && !concept.quality_report ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						disabled: Boolean(busy),
						onClick: () => wrap("Quality Gate is reading the book", async () => {
							const report = await callAgent("M4-QualityGate", `Manuscript:\n${concept.chapters.map((c) => `Ch ${c.chapter_number}: ${c.prose}`).join("\n\n")}\n\nPlan:\n${JSON.stringify(concept.story_plan)}\n\nContinuity:\n${JSON.stringify(concept.continuity)}`);
							await updateConcept({ data: {
								id: concept.id,
								patch: {
									quality_report: report,
									status: "DRAFTING"
								}
							} });
							await addEvent({ data: {
								conceptId: concept.id,
								message: `Quality Gate finished ${concept.working_title}. TAP 3 is open.`
							} });
						}),
						children: "Run Quality Gate"
					}) : null,
					concept.quality_report ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gate, {
						title: "TAP 3 — Sign this manuscript?",
						disabled: Boolean(busy),
						onYes: () => wrap("Tap 3", async () => {
							await updateConcept({ data: {
								id: concept.id,
								patch: { status: "MANUSCRIPT_SIGNED" }
							} });
							await addEvent({ data: {
								conceptId: concept.id,
								message: `${concept.working_title} manuscript signed. Editorial may begin.`
							} });
							toast.success("Signed.");
						}),
						onNo: () => wrap("Tap 3", async () => {
							await updateConcept({ data: {
								id: concept.id,
								patch: {
									tap_notes: notes,
									quality_report: null
								}
							} });
						})
					}) : null
				]
			}) : null,
			concept.status === "MANUSCRIPT_SIGNED" || concept.status === "IN_PRODUCTION" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				disabled: Boolean(busy),
				onClick: () => wrap("Editor is on the first chapter", async () => {
					await runProduction(concept, callAgent, setBusy);
					toast.success("Production complete.");
				}),
				children: "Run editorial & production"
			}) : null,
			concept.status === "PUBLISHED" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "This title has left the house."
			}) : null
		]
	}) });
}
function Gate({ title, disabled, onYes, onNo, onSkip }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-display text-lg",
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap gap-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					disabled,
					onClick: onYes,
					children: "Approve"
				}),
				onSkip ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					disabled,
					variant: "secondary",
					onClick: onSkip,
					children: "Bank it"
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					disabled,
					variant: "outline",
					onClick: onNo,
					children: onSkip ? "Reject" : "Request changes"
				})
			]
		})]
	});
}
async function draftNextChapter(concept, callAgent, setBusy) {
	const plan = concept.story_plan ?? {};
	const chapterBlock = plan.chapters ?? plan;
	const mapped = Array.isArray(chapterBlock.chapters) ? chapterBlock.chapters : Array.isArray(chapterBlock) ? chapterBlock : [];
	const nextIndex = concept.chapters.length;
	const assignment = mapped[nextIndex];
	if (!assignment) throw new Error("No chapter assignment remaining in the plan.");
	const lastPara = concept.chapters[concept.chapters.length - 1]?.prose.split(/\n\n+/).slice(-1)[0] ?? "";
	const ghost = await callAgent("M4-Ghostwriter", `Concept Row:\n${JSON.stringify(concept.concept_row)}\nChapter assignment:\n${JSON.stringify(assignment)}\nContinuity:\n${JSON.stringify(concept.continuity ?? {})}\nPrevious ending:\n${lastPara}`);
	const prose = String(ghost.prose ?? "");
	const chapter = {
		chapter_number: Number(ghost.chapter_number ?? assignment.chapter_number ?? nextIndex + 1),
		chapter_title: String(assignment.chapter_title ?? ""),
		word_count: Number(ghost.word_count ?? wordCount(prose)),
		prose,
		new_elements: Array.isArray(ghost.new_elements) ? ghost.new_elements : []
	};
	setBusy("Continuity Guardian is updating the ledger");
	const cont = await callAgent("M4-ContinuityGuardian", `Chapter ${chapter.chapter_number} prose:\n${prose}\nCurrent ledger:\n${JSON.stringify(concept.continuity ?? {})}`);
	setBusy("Voice Coach is listening");
	const baseline = concept.chapters[0]?.prose ?? prose;
	const voice = await callAgent("M4-VoiceCoach", `New chapter:\n${prose}\nConcept Row:\n${JSON.stringify(concept.concept_row)}\nChapter 1 baseline:\n${baseline}`);
	chapter.voice_pass = Boolean(voice.voice_pass);
	chapter.voice_notes = String(voice.revision_notes ?? "");
	const chapters = [...concept.chapters, chapter];
	await updateConcept({ data: {
		id: concept.id,
		patch: {
			chapters,
			continuity: cont.ledger_updates && typeof cont.ledger_updates === "object" && !Array.isArray(cont.ledger_updates) ? {
				...concept.continuity ?? {},
				...cont.ledger_updates,
				last: cont
			} : {
				...concept.continuity ?? {},
				last: cont
			},
			status: "DRAFTING"
		}
	} });
	await addEvent({ data: {
		conceptId: concept.id,
		message: `${concept.working_title}: chapter ${chapter.chapter_number} drafted (${chapter.word_count} words).`
	} });
}
async function runProduction(concept, callAgent, setBusy) {
	await updateConcept({ data: {
		id: concept.id,
		patch: { status: "IN_PRODUCTION" }
	} });
	const edited = [];
	for (const ch of concept.chapters) {
		setBusy(`Editor is on chapter ${ch.chapter_number}`);
		const ed = await callAgent("M5-Editor", `Chapter ${ch.chapter_number} (${ch.chapter_title ?? ""}):\n${ch.prose}`);
		edited.push({
			...ch,
			prose: String(ed.edited_prose ?? ch.prose),
			word_count: Number(ed.word_count_after ?? wordCount(String(ed.edited_prose ?? ch.prose)))
		});
	}
	setBusy("Metadata Builder is packing the launch file");
	const meta = await callAgent("M5-MetadataBuilder", `Concept Row:\n${JSON.stringify(concept.concept_row)}\nManuscript summary:\n${edited.map((c) => `Ch ${c.chapter_number} ${c.chapter_title}: ${c.prose.slice(0, 400)}`).join("\n")}`);
	setBusy("Packager is assembling deliverables");
	const pack = await callAgent("M5-Packager", `Title: ${concept.working_title}\nMetadata:\n${JSON.stringify(meta)}\nChapters:\n${edited.map((c) => `<h2>${c.chapter_title ?? c.chapter_number}</h2>${c.prose}`).join("\n")}`);
	await updateConcept({ data: {
		id: concept.id,
		patch: {
			chapters: edited,
			metadata_pkg: meta,
			production_pack: pack,
			status: "PUBLISHED"
		}
	} });
	await addEvent({ data: {
		conceptId: concept.id,
		message: `${concept.working_title} production complete. Files ready.`
	} });
}
//#endregion
export { BookPage as component };
