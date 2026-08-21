import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Clock3 } from "lucide-react";
import { PipelineRail } from "@/components/pipeline-rail";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAiStatus, useConcepts, useEvents } from "@/hooks/use-house";
import { countByStatus, pendingTaps } from "@/lib/house";
import { formatTime } from "@/lib/utils";

export const Route = createFileRoute("/")({ component: House });

function House() {
  const conceptsQ = useConcepts();
  const eventsQ = useEvents();
  const aiQ = useAiStatus();
  const concepts = conceptsQ.data ?? [];
  const counts = countByStatus(concepts);
  const taps = pendingTaps(concepts);
  const published = counts.PUBLISHED ?? 0;
  const inPress =
    (counts.DRAFTING ?? 0) + (counts.IN_PRODUCTION ?? 0) + (counts.PLAN_APPROVED ?? 0);

  return (
    <div className="stagger-in space-y-8">
      <section className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] tracking-[0.22em] text-muted-foreground uppercase">
            The house is awake
          </p>
          <h1 className="mt-1 max-w-xl text-4xl font-medium sm:text-5xl">
            Idea to market, with three taps of a human hand.
          </h1>
          <p className="mt-3 max-w-lg text-sm text-muted-foreground">
            Sixteen agents. Five milestones. A ledger that does not forget.
            Nightly ideation at 3:00 AM ET — or whenever you open the press.
          </p>
        </div>
        <div className="flex flex-col items-start gap-2 sm:items-end">
          <p className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock3 className="size-3.5" />
            {aiQ.data?.available ? "Press floor is live" : "Agents unavailable"}
          </p>
          <Button asChild>
            <Link to="/ideate">
              Run tonight's list
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </section>

      <PipelineRail active="M1" />

      <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label="In the ledger" value={conceptsQ.isLoading ? "—" : String(concepts.length)} />
        <Stat label="Awaiting a tap" value={String(taps.length)} />
        <Stat label="On press" value={String(inPress)} />
        <Stat label="Published" value={String(published)} />
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-3">
          <div className="flex items-baseline justify-between">
            <h2 className="text-xl">Waiting on you</h2>
            <Link to="/taps" className="text-sm text-muted-foreground hover:text-foreground">
              All taps
            </Link>
          </div>
          {conceptsQ.isLoading ? (
            <Skeleton className="h-40 rounded-xl" />
          ) : taps.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-sm text-muted-foreground">
                No human gates are open. Run ideation, or advance a locked book.
              </CardContent>
            </Card>
          ) : (
            <ul className="space-y-3">
              {taps.slice(0, 4).map((c) => (
                <li key={c.id}>
                  <Link to="/books/$id" params={{ id: c.id }} className="block">
                    <Card className="transition-colors hover:bg-accent">
                      <CardContent className="flex flex-col gap-2 py-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                          <p className="font-display text-lg leading-tight">
                            {c.working_title}
                          </p>
                          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                            {c.logline}
                          </p>
                        </div>
                        <StatusBadge status={c.status} />
                      </CardContent>
                    </Card>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="space-y-3">
          <h2 className="text-xl">House log</h2>
          <Card>
            <CardContent className="divide-y divide-border p-0">
              {eventsQ.isLoading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="p-4">
                      <Skeleton className="h-4 w-full" />
                    </div>
                  ))
                : (eventsQ.data ?? []).slice(0, 6).map((e) => (
                    <div key={e.id} className="px-4 py-3">
                      <p className="text-sm">{e.message}</p>
                      <p className="mt-1 font-mono text-[11px] text-muted-foreground tabular-nums">
                        {formatTime(e.created_at)}
                      </p>
                    </div>
                  ))}
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-baseline justify-between">
          <h2 className="text-xl">On the table</h2>
          <Link to="/ledger" className="text-sm text-muted-foreground hover:text-foreground">
            Open ledger
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {concepts.slice(0, 6).map((c) => (
            <Link key={c.id} to="/books/$id" params={{ id: c.id }}>
              <Card className="h-full transition-colors hover:bg-accent">
                <CardHeader>
                  <p className="text-[11px] tracking-widest text-muted-foreground uppercase">
                    {c.genre}
                  </p>
                  <CardTitle className="text-base">{c.working_title}</CardTitle>
                </CardHeader>
                <CardContent className="pt-3">
                  <p className="line-clamp-3 text-sm text-muted-foreground">{c.logline}</p>
                  <div className="mt-3">
                    <StatusBadge status={c.status} />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <CardContent className="py-4">
        <p className="text-[11px] tracking-widest text-muted-foreground uppercase">{label}</p>
        <p className="mt-1 font-display text-3xl font-medium tabular-nums">{value}</p>
      </CardContent>
    </Card>
  );
}
