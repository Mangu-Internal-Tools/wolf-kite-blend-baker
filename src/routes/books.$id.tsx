import { createFileRoute, Link } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { JsonBlock } from "@/components/json-block";
import { PipelineRail } from "@/components/pipeline-rail";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useAiStatus, useConcept, useRuns } from "@/hooks/use-house";
import { getAgent } from "@/lib/agents";
import { chapterWordTotal, plannedChapterCount } from "@/lib/house";
import { addEvent, logRun, updateConcept } from "@/lib/server/concepts";
import { invokeAgent } from "@/lib/server/xai";
import { milestoneForStatus } from "@/lib/status";
import type { ChapterDraft, Concept, JsonMap } from "@/lib/types";
import { formatTime, wordCount } from "@/lib/utils";

export const Route = createFileRoute("/books/$id")({ component: BookPage });

function BookPage() {
  const { id } = Route.useParams();
  const q = useConcept(id);
  const runs = useRuns(id);
  const concept = q.data;

  if (q.isLoading) {
    return <p className="text-sm text-muted-foreground">Pulling the folder…</p>;
  }
  if (!concept) {
    return (
      <div className="space-y-3">
        <h1 className="text-3xl">Missing folder</h1>
        <Button asChild variant="secondary">
          <Link to="/ledger">Back to ledger</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <p className="text-[11px] tracking-[0.22em] text-muted-foreground uppercase">
            {concept.genre} · {concept.source_tab}
          </p>
          <h1 className="mt-1 text-3xl sm:text-4xl">{concept.working_title}</h1>
          {concept.subtitle ? (
            <p className="mt-1 text-muted-foreground">{concept.subtitle}</p>
          ) : null}
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground">{concept.logline}</p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <StatusBadge status={concept.status} />
            <span className="text-xs text-muted-foreground">
              {chapterWordTotal(concept).toLocaleString()} words drafted
            </span>
          </div>
        </div>
      </div>

      <PipelineRail active={milestoneForStatus(concept.status)} />
      <BookActions concept={concept} />

      <Tabs defaultValue="overview">
        <TabsList className="mb-4 w-full justify-start overflow-x-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="row">Concept row</TabsTrigger>
          <TabsTrigger value="plan">Story plan</TabsTrigger>
          <TabsTrigger value="ms">Manuscript</TabsTrigger>
          <TabsTrigger value="press">Press</TabsTrigger>
          <TabsTrigger value="log">Log</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-3 md:grid-cols-2">
            <Fact label="Protagonist" value={concept.protagonist_sketch} />
            <Fact label="Setting" value={concept.setting} />
            <Fact label="Fresh because" value={concept.fresh_because} />
            <Fact
              label="Comps"
              value={
                concept.comps.length
                  ? concept.comps.map((c) => c.title).join(" · ")
                  : "None listed"
              }
            />
          </div>
          {concept.critic ? <JsonBlock value={concept.critic} /> : null}
        </TabsContent>

        <TabsContent value="row">
          <JsonBlock value={concept.concept_row} />
        </TabsContent>

        <TabsContent value="plan">
          <JsonBlock value={concept.story_plan} />
        </TabsContent>

        <TabsContent value="ms" className="space-y-6">
          {concept.chapters.length === 0 ? (
            <p className="text-sm text-muted-foreground">No chapters on the spindle yet.</p>
          ) : (
            concept.chapters
              .slice()
              .sort((a, b) => a.chapter_number - b.chapter_number)
              .map((ch) => (
                <article key={ch.chapter_number} className="paper-sheet rounded-xl px-6 py-8 sm:px-10">
                  <p className="text-[11px] tracking-[0.2em] uppercase">
                    Chapter {String(ch.chapter_number).padStart(2, "0")}
                    {ch.chapter_title ? ` · ${ch.chapter_title}` : ""}
                  </p>
                  <p className="mt-1 text-xs opacity-60">{ch.word_count} words</p>
                  <div className="mt-6 space-y-4 font-display text-[1.05rem] leading-8">
                    {ch.prose.split(/\n\n+/).map((para, i) => (
                      <p key={i}>{para}</p>
                    ))}
                  </div>
                </article>
              ))
          )}
        </TabsContent>

        <TabsContent value="press" className="space-y-4">
          <h3 className="font-display text-lg">Metadata</h3>
          <JsonBlock value={concept.metadata_pkg} />
          <h3 className="font-display text-lg">Production pack</h3>
          <JsonBlock value={concept.production_pack} />
        </TabsContent>

        <TabsContent value="log">
          <Card>
            <CardContent className="divide-y divide-border p-0">
              {(runs.data ?? []).length === 0 ? (
                <p className="p-5 text-sm text-muted-foreground">No agent runs on this title yet.</p>
              ) : (
                (runs.data ?? []).map((r) => (
                  <div key={r.id} className="px-4 py-3">
                    <p className="text-sm">
                      {r.agent_name} · {r.status}
                    </p>
                    <p className="font-mono text-[11px] text-muted-foreground tabular-nums">
                      {formatTime(r.created_at)}
                      {r.duration_ms ? ` · ${Math.round(r.duration_ms / 1000)}s` : ""}
                    </p>
                    {r.error ? <p className="mt-1 text-xs text-destructive">{r.error}</p> : null}
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Fact({ label, value }: { label: string; value?: string | null }) {
  return (
    <Card>
      <CardContent className="py-4">
        <p className="text-[11px] tracking-widest text-muted-foreground uppercase">{label}</p>
        <p className="mt-1 text-sm">{value || "—"}</p>
      </CardContent>
    </Card>
  );
}

function BookActions({ concept }: { concept: Concept }) {
  const qc = useQueryClient();
  const ai = useAiStatus();
  const [busy, setBusy] = useState<string | null>(null);
  const [notes, setNotes] = useState(concept.tap_notes ?? "");

  async function refresh() {
    await qc.invalidateQueries({ queryKey: ["concept", concept.id] });
    await qc.invalidateQueries({ queryKey: ["concepts"] });
    await qc.invalidateQueries({ queryKey: ["events"] });
    await qc.invalidateQueries({ queryKey: ["runs", concept.id] });
  }

  async function callAgent(agentId: string, payload: string) {
    const agent = getAgent(agentId);
    const res = await invokeAgent({ data: { agentId, payload } });
    await logRun({
      data: {
        conceptId: concept.id,
        agentName: agentId,
        milestone: agent.milestone,
        status: res.ok ? "done" : "error",
        output: res.ok ? res.json : null,
        error: res.ok ? null : res.error,
        durationMs: res.ok ? res.durationMs : undefined,
      },
    });
    if (!res.ok) throw new Error(res.error);
    return res.json;
  }

  async function wrap(label: string, fn: () => Promise<void>) {
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

  return (
    <Card>
      <CardContent className="space-y-4 py-5">
        {busy ? <p className="shimmer text-sm">{busy}</p> : null}

        {concept.status === "TOP10" ? (
          <Gate
            title="TAP 1 — Approve this concept?"
            disabled={Boolean(busy)}
            onYes={() =>
              wrap("Tap 1", async () => {
                await updateConcept({
                  data: { id: concept.id, patch: { status: "APPROVED" } },
                });
                await addEvent({
                  data: {
                    conceptId: concept.id,
                    message: `${concept.working_title} approved. Architect may build the row.`,
                  },
                });
                toast.success("Approved. Run the Architect next.");
              })
            }
            onSkip={() =>
              wrap("Tap 1", async () => {
                await updateConcept({
                  data: { id: concept.id, patch: { status: "BANKED" } },
                });
                await addEvent({
                  data: {
                    conceptId: concept.id,
                    message: `${concept.working_title} returned to the bank.`,
                  },
                });
              })
            }
            onNo={() =>
              wrap("Tap 1", async () => {
                await updateConcept({
                  data: { id: concept.id, patch: { status: "REJECTED" } },
                });
              })
            }
          />
        ) : null}

        {concept.status === "APPROVED" ? (
          <Button
            disabled={Boolean(busy)}
            onClick={() =>
              wrap("Architect is expanding the Concept Row", async () => {
                const json = await callAgent(
                  "M2-Architect",
                  `Approved concept:\n${JSON.stringify({
                    title: concept.working_title,
                    logline: concept.logline,
                    genre: concept.genre,
                    protagonist_sketch: concept.protagonist_sketch,
                    setting: concept.setting,
                    fresh_because: concept.fresh_because,
                    comps: concept.comps,
                    critic: concept.critic,
                    scout_brief: concept.scout_brief,
                  })}`,
                );
                const title = String(json.working_title || concept.working_title);
                await updateConcept({
                  data: {
                    id: concept.id,
                    patch: {
                      working_title: title,
                      subtitle: json.subtitle ? String(json.subtitle) : concept.subtitle,
                      concept_row: json,
                      status: "LOCKED",
                    },
                  },
                });
                await addEvent({
                  data: {
                    conceptId: concept.id,
                    message: `${title} Concept Row is locked.`,
                  },
                });
                toast.success("Row locked. Story plan is next.");
              })
            }
          >
            Run Architect
          </Button>
        ) : null}

        {concept.status === "LOCKED" ? (
          <div className="space-y-3">
            {!concept.story_plan ? (
              <Button
                disabled={Boolean(busy)}
                onClick={() =>
                  wrap("Blueprint Maker is on the floor", async () => {
                    const row = concept.concept_row ?? {};
                    const blueprint = await callAgent(
                      "M3-BlueprintMaker",
                      `Concept Row:\n${JSON.stringify(row)}`,
                    );
                    setBusy("Beat Writer is laying the spine");
                    const beats = await callAgent(
                      "M3-BeatWriter",
                      `Concept Row:\n${JSON.stringify(row)}\nBlueprint:\n${JSON.stringify(blueprint)}`,
                    );
                    setBusy("Chapter Mapper is grouping beats");
                    const chapters = await callAgent(
                      "M3-ChapterMapper",
                      `Concept Row:\n${JSON.stringify(row)}\nBlueprint:\n${JSON.stringify(blueprint)}\nBeats:\n${JSON.stringify(beats)}`,
                    );
                    await updateConcept({
                      data: {
                        id: concept.id,
                        patch: {
                          story_plan: { blueprint, beats, chapters },
                        },
                      },
                    });
                    await addEvent({
                      data: {
                        conceptId: concept.id,
                        message: `Story plan for ${concept.working_title} is ready for TAP 2.`,
                      },
                    });
                    toast.success("Plan is on your desk.");
                  })
                }
              >
                Build story plan
              </Button>
            ) : (
              <Gate
                title="TAP 2 — Sign this story plan?"
                disabled={Boolean(busy)}
                onYes={() =>
                  wrap("Tap 2", async () => {
                    await updateConcept({
                      data: { id: concept.id, patch: { status: "PLAN_APPROVED", tap_notes: notes } },
                    });
                    await addEvent({
                      data: {
                        conceptId: concept.id,
                        message: `Story plan signed for ${concept.working_title}. Press may open.`,
                      },
                    });
                    toast.success("Plan signed.");
                  })
                }
                onNo={() =>
                  wrap("Tap 2", async () => {
                    await updateConcept({
                      data: {
                        id: concept.id,
                        patch: { tap_notes: notes, story_plan: null },
                      },
                    });
                    toast.success("Plan cleared. Rebuild when ready.");
                  })
                }
              />
            )}
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Notes for the floor (optional)"
            />
          </div>
        ) : null}

        {concept.status === "PLAN_APPROVED" || concept.status === "DRAFTING" ? (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              {drafted} of {planned || "?"} chapters on the spindle.
            </p>
            {planned > 0 && drafted < planned ? (
              <Button
                disabled={Boolean(busy)}
                onClick={() =>
                  wrap("Ghostwriter is at the desk", async () => {
                    await draftNextChapter(concept, callAgent, setBusy);
                  })
                }
              >
                Draft next chapter
              </Button>
            ) : null}
            {planned > 0 && drafted >= planned && !concept.quality_report ? (
              <Button
                disabled={Boolean(busy)}
                onClick={() =>
                  wrap("Quality Gate is reading the book", async () => {
                    const report = await callAgent(
                      "M4-QualityGate",
                      `Manuscript:\n${concept.chapters.map((c) => `Ch ${c.chapter_number}: ${c.prose}`).join("\n\n")}\n\nPlan:\n${JSON.stringify(concept.story_plan)}\n\nContinuity:\n${JSON.stringify(concept.continuity)}`,
                    );
                    await updateConcept({
                      data: {
                        id: concept.id,
                        patch: { quality_report: report, status: "DRAFTING" },
                      },
                    });
                    await addEvent({
                      data: {
                        conceptId: concept.id,
                        message: `Quality Gate finished ${concept.working_title}. TAP 3 is open.`,
                      },
                    });
                  })
                }
              >
                Run Quality Gate
              </Button>
            ) : null}
            {concept.quality_report ? (
              <Gate
                title="TAP 3 — Sign this manuscript?"
                disabled={Boolean(busy)}
                onYes={() =>
                  wrap("Tap 3", async () => {
                    await updateConcept({
                      data: { id: concept.id, patch: { status: "MANUSCRIPT_SIGNED" } },
                    });
                    await addEvent({
                      data: {
                        conceptId: concept.id,
                        message: `${concept.working_title} manuscript signed. Editorial may begin.`,
                      },
                    });
                    toast.success("Signed.");
                  })
                }
                onNo={() =>
                  wrap("Tap 3", async () => {
                    await updateConcept({
                      data: {
                        id: concept.id,
                        patch: { tap_notes: notes, quality_report: null },
                      },
                    });
                  })
                }
              />
            ) : null}
          </div>
        ) : null}

        {concept.status === "MANUSCRIPT_SIGNED" || concept.status === "IN_PRODUCTION" ? (
          <Button
            disabled={Boolean(busy)}
            onClick={() =>
              wrap("Editor is on the first chapter", async () => {
                await runProduction(concept, callAgent, setBusy);
                toast.success("Production complete.");
              })
            }
          >
            Run editorial & production
          </Button>
        ) : null}

        {concept.status === "PUBLISHED" ? (
          <p className="text-sm text-muted-foreground">This title has left the house.</p>
        ) : null}
      </CardContent>
    </Card>
  );
}

function Gate({
  title,
  disabled,
  onYes,
  onNo,
  onSkip,
}: {
  title: string;
  disabled?: boolean;
  onYes: () => void;
  onNo: () => void;
  onSkip?: () => void;
}) {
  return (
    <div className="space-y-3">
      <p className="font-display text-lg">{title}</p>
      <div className="flex flex-wrap gap-2">
        <Button disabled={disabled} onClick={onYes}>
          Approve
        </Button>
        {onSkip ? (
          <Button disabled={disabled} variant="secondary" onClick={onSkip}>
            Bank it
          </Button>
        ) : null}
        <Button disabled={disabled} variant="outline" onClick={onNo}>
          {onSkip ? "Reject" : "Request changes"}
        </Button>
      </div>
    </div>
  );
}

type AgentCaller = (agentId: string, payload: string) => Promise<JsonMap>;

async function draftNextChapter(
  concept: Concept,
  callAgent: AgentCaller,
  setBusy: (s: string) => void,
) {
  const plan = concept.story_plan ?? {};
  const chapterBlock = (plan.chapters ?? plan) as Record<string, unknown>;
  const mapped = Array.isArray((chapterBlock as { chapters?: unknown }).chapters)
    ? ((chapterBlock as { chapters: Record<string, unknown>[] }).chapters)
    : Array.isArray(chapterBlock)
      ? (chapterBlock as Record<string, unknown>[])
      : [];
  const nextIndex = concept.chapters.length;
  const assignment = mapped[nextIndex];
  if (!assignment) throw new Error("No chapter assignment remaining in the plan.");
  const previous = concept.chapters[concept.chapters.length - 1];
  const lastPara = previous?.prose.split(/\n\n+/).slice(-1)[0] ?? "";
  const ghost = await callAgent(
    "M4-Ghostwriter",
    `Concept Row:\n${JSON.stringify(concept.concept_row)}\nChapter assignment:\n${JSON.stringify(assignment)}\nContinuity:\n${JSON.stringify(concept.continuity ?? {})}\nPrevious ending:\n${lastPara}`,
  );
  const prose = String(ghost.prose ?? "");
  const chapter: ChapterDraft = {
    chapter_number: Number(ghost.chapter_number ?? assignment.chapter_number ?? nextIndex + 1),
    chapter_title: String(assignment.chapter_title ?? ""),
    word_count: Number(ghost.word_count ?? wordCount(prose)),
    prose,
    new_elements: Array.isArray(ghost.new_elements)
      ? (ghost.new_elements as ChapterDraft["new_elements"])
      : [],
  };
  setBusy("Continuity Guardian is updating the ledger");
  const cont = await callAgent(
    "M4-ContinuityGuardian",
    `Chapter ${chapter.chapter_number} prose:\n${prose}\nCurrent ledger:\n${JSON.stringify(concept.continuity ?? {})}`,
  );
  setBusy("Voice Coach is listening");
  const baseline = concept.chapters[0]?.prose ?? prose;
  const voice = await callAgent(
    "M4-VoiceCoach",
    `New chapter:\n${prose}\nConcept Row:\n${JSON.stringify(concept.concept_row)}\nChapter 1 baseline:\n${baseline}`,
  );
  chapter.voice_pass = Boolean(voice.voice_pass);
  chapter.voice_notes = String(voice.revision_notes ?? "");
  const chapters = [...concept.chapters, chapter];
  await updateConcept({
    data: {
      id: concept.id,
      patch: {
        chapters,
        continuity: cont.ledger_updates &&
        typeof cont.ledger_updates === "object" &&
        !Array.isArray(cont.ledger_updates)
          ? {
              ...(concept.continuity ?? {}),
              ...(cont.ledger_updates as JsonMap),
              last: cont,
            }
          : { ...(concept.continuity ?? {}), last: cont },
        status: "DRAFTING",
      },
    },
  });
  await addEvent({
    data: {
      conceptId: concept.id,
      message: `${concept.working_title}: chapter ${chapter.chapter_number} drafted (${chapter.word_count} words).`,
    },
  });
}

async function runProduction(
  concept: Concept,
  callAgent: AgentCaller,
  setBusy: (s: string) => void,
) {
  await updateConcept({
    data: { id: concept.id, patch: { status: "IN_PRODUCTION" } },
  });
  const edited: ChapterDraft[] = [];
  for (const ch of concept.chapters) {
    setBusy(`Editor is on chapter ${ch.chapter_number}`);
    const ed = await callAgent(
      "M5-Editor",
      `Chapter ${ch.chapter_number} (${ch.chapter_title ?? ""}):\n${ch.prose}`,
    );
    edited.push({
      ...ch,
      prose: String(ed.edited_prose ?? ch.prose),
      word_count: Number(ed.word_count_after ?? wordCount(String(ed.edited_prose ?? ch.prose))),
    });
  }
  setBusy("Metadata Builder is packing the launch file");
  const meta = await callAgent(
    "M5-MetadataBuilder",
    `Concept Row:\n${JSON.stringify(concept.concept_row)}\nManuscript summary:\n${edited
      .map((c) => `Ch ${c.chapter_number} ${c.chapter_title}: ${c.prose.slice(0, 400)}`)
      .join("\n")}`,
  );
  setBusy("Packager is assembling deliverables");
  const pack = await callAgent(
    "M5-Packager",
    `Title: ${concept.working_title}\nMetadata:\n${JSON.stringify(meta)}\nChapters:\n${edited
      .map((c) => `<h2>${c.chapter_title ?? c.chapter_number}</h2>${c.prose}`)
      .join("\n")}`,
  );
  await updateConcept({
    data: {
      id: concept.id,
      patch: {
        chapters: edited,
        metadata_pkg: meta,
        production_pack: pack,
        status: "PUBLISHED",
      },
    },
  });
  await addEvent({
    data: {
      conceptId: concept.id,
      message: `${concept.working_title} production complete. Files ready.`,
    },
  });
}
