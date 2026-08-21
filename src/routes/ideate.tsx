import { createFileRoute, Link } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAiStatus } from "@/hooks/use-house";
import { GENRES, TABS, type GenreCell } from "@/lib/genres";
import { addEvent, insertConcepts, logRun } from "@/lib/server/concepts";
import { invokeAgent } from "@/lib/server/xai";
import { cn } from "@/lib/utils";
import type { Json, JsonMap } from "@/lib/types";

export const Route = createFileRoute("/ideate")({ component: Ideate });

type Stage = "idle" | "scout" | "ideator" | "critic" | "saving" | "done" | "error";

type IdeatorConcept = {
  title: string;
  logline: string;
  protagonist_sketch?: string;
  setting?: string;
  fresh_because?: string;
  comps?: Json;
  confidence?: string;
};

function Ideate() {
  const ai = useAiStatus();
  const qc = useQueryClient();
  const [tab, setTab] = useState<(typeof TABS)[number]>("Popular");
  const [picked, setPicked] = useState<GenreCell | null>(
    GENRES.find((g) => g.id === "pop-cli-fi") ?? GENRES[0],
  );
  const [stage, setStage] = useState<Stage>("idle");
  const [statusLine, setStatusLine] = useState("");
  const [scout, setScout] = useState<JsonMap | null>(null);
  const [ideas, setIdeas] = useState<IdeatorConcept[]>([]);
  const [critic, setCritic] = useState<JsonMap | null>(null);
  const [error, setError] = useState<string | null>(null);

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
      const scoutRes = await invokeAgent({
        data: {
          agentId: "M1-Scout",
          payload: `Genre: ${picked.name}\nSource tab: ${picked.tab}\nNote: ${picked.note}\nRun date: ${new Date().toISOString().slice(0, 10)}\nResearch this genre cell and return the Scout JSON.`,
        },
      });
      if (!scoutRes.ok) throw new Error(scoutRes.error);
      setScout(scoutRes.json);
      await logRun({
        data: {
          agentName: "M1-Scout",
          milestone: "M1",
          status: "done",
          output: scoutRes.json,
          durationMs: scoutRes.durationMs,
        },
      });

      setStage("ideator");
      setStatusLine("Ideator is drafting eight original concepts");
      const ideaRes = await invokeAgent({
        data: {
          agentId: "M1-Ideator",
          payload: `Genre: ${picked.name}\nScout brief:\n${JSON.stringify(scoutRes.json)}`,
        },
      });
      if (!ideaRes.ok) throw new Error(ideaRes.error);
      const conceptList = Array.isArray(ideaRes.json.concepts)
        ? (ideaRes.json.concepts as IdeatorConcept[])
        : [];
      setIdeas(conceptList);
      await logRun({
        data: {
          agentName: "M1-Ideator",
          milestone: "M1",
          status: "done",
          output: ideaRes.json,
          durationMs: ideaRes.durationMs,
        },
      });

      setStage("critic");
      setStatusLine("Critic is scoring the eight and keeping three");
      const criticRes = await invokeAgent({
        data: {
          agentId: "M1-Critic",
          payload: `Genre: ${picked.name}\nConcepts:\n${JSON.stringify(conceptList)}`,
        },
      });
      if (!criticRes.ok) throw new Error(criticRes.error);
      setCritic(criticRes.json);
      await logRun({
        data: {
          agentName: "M1-Critic",
          milestone: "M1",
          status: "done",
          output: criticRes.json,
          durationMs: criticRes.durationMs,
        },
      });

      setStage("saving");
      setStatusLine("Writing the ledger");
      const kept = new Set(
        (Array.isArray(criticRes.json.kept)
          ? (criticRes.json.kept as { title?: string }[])
          : []
        )
          .map((k) => k.title)
          .filter(Boolean) as string[],
      );
      const criticByTitle: Record<string, Json> = {};
      if (Array.isArray(criticRes.json.kept)) {
        for (const k of criticRes.json.kept as { title?: string }[]) {
          if (k.title) criticByTitle[k.title] = k as unknown as Json;
        }
      }
      await insertConcepts({
        data: {
          items: conceptList.map((c) => ({
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
            scout_brief: scoutRes.json,
          })),
        },
      });
      await addEvent({
        data: {
          message: `Nightly ideation on ${picked.name}: ${kept.size} promoted to Top 10, ${Math.max(conceptList.length - kept.size, 0)} banked.`,
        },
      });
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

  const running = ["scout", "ideator", "critic", "saving"].includes(stage);
  const keptTitles = new Set(
    (Array.isArray(critic?.kept) ? (critic?.kept as { title?: string }[]) : [])
      .map((k) => k.title)
      .filter(Boolean) as string[],
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] tracking-[0.22em] text-muted-foreground uppercase">
            M1 · Nightly ideation
          </p>
          <h1 className="mt-1 text-3xl">Pick a cell. Let the house think.</h1>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            Scout, Ideator, and Critic run in sequence. Three titles land in Top 10.
            Five wait in the bank. You tap in the morning.
          </p>
        </div>
        <Button onClick={runNightly} disabled={!picked || running} size="lg">
          {running ? "On the floor…" : "Run this cell"}
        </Button>
      </div>

      {running || stage === "done" || stage === "error" ? (
        <Card>
          <CardContent className="py-5">
            <p className={cn("text-sm", running && "shimmer")}>
              {statusLine || "Working"}
            </p>
            {error ? <p className="mt-2 text-sm text-destructive">{error}</p> : null}
          </CardContent>
        </Card>
      ) : null}

      <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
        <TabsList className="w-full justify-start overflow-x-auto">
          {TABS.map((t) => (
            <TabsTrigger key={t} value={t}>
              {t}
            </TabsTrigger>
          ))}
        </TabsList>
        {TABS.map((t) => (
          <TabsContent key={t} value={t} className="mt-4">
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {GENRES.filter((g) => g.tab === t).map((g) => {
                const on = picked?.id === g.id;
                return (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setPicked(g)}
                    className={cn(
                      "rounded-xl px-4 py-3 text-left transition-colors",
                      on
                        ? "bg-primary text-primary-foreground"
                        : "bg-card shadow-[var(--shadow-border)] hover:bg-accent",
                    )}
                  >
                    <p className="font-medium">{g.name}</p>
                    <p className={cn("mt-1 text-xs", on ? "opacity-80" : "text-muted-foreground")}>
                      {g.note}
                    </p>
                  </button>
                );
              })}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {scout ? (
        <section className="space-y-2">
          <h2 className="text-xl">Scout</h2>
          <Card>
            <CardContent className="space-y-2 py-5 text-sm">
              <p>{String(scout.landscape ?? "")}</p>
              <p className="text-muted-foreground">
                Saturation: {String(scout.saturation_level ?? "—")}
              </p>
            </CardContent>
          </Card>
        </section>
      ) : null}

      {ideas.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-xl">Eight from the Ideator</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {ideas.map((c) => (
              <Card
                key={c.title}
                className={cn(keptTitles.has(c.title) && "ring-1 ring-primary")}
              >
                <CardContent className="py-4">
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-display text-lg leading-tight">{c.title}</p>
                    {keptTitles.has(c.title) ? (
                      <span className="text-[11px] tracking-widest uppercase">Top 10</span>
                    ) : null}
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{c.logline}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      ) : null}

      {stage === "done" ? (
        <Button asChild>
          <Link to="/taps">Review TAP 1</Link>
        </Button>
      ) : null}
    </div>
  );
}
