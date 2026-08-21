import { createFileRoute, Link } from "@tanstack/react-router";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useConcepts } from "@/hooks/use-house";
import { pendingTaps } from "@/lib/house";
import { tapForStatus } from "@/lib/status";

export const Route = createFileRoute("/taps")({ component: Taps });

const COPY: Record<1 | 2 | 3, { title: string; body: string }> = {
  1: {
    title: "TAP 1 · Approve a concept",
    body: "Morning list. Keep one. Bank or skip the rest. Architect waits on your yes.",
  },
  2: {
    title: "TAP 2 · Sign the story plan",
    body: "Blueprint, beats, chapter map. Approve to open the press. Request changes if the spine is wrong.",
  },
  3: {
    title: "TAP 3 · Sign the manuscript",
    body: "Quality Gate has read the book. Sign it to editorial, or send it back with a note.",
  },
};

function Taps() {
  const q = useConcepts();
  const taps = pendingTaps(q.data ?? []);
  const groups = [1, 2, 3] as const;

  return (
    <div className="space-y-8">
      <div>
        <p className="text-[11px] tracking-[0.22em] text-muted-foreground uppercase">
          Human gates
        </p>
        <h1 className="mt-1 text-3xl">Three taps. The rest is machinery.</h1>
      </div>

      {groups.map((n) => {
        const items = taps.filter((c) => tapForStatus(c.status) === n);
        const copy = COPY[n];
        return (
          <section key={n} className="space-y-3">
            <div>
              <h2 className="text-xl">{copy.title}</h2>
              <p className="text-sm text-muted-foreground">{copy.body}</p>
            </div>
            {items.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nothing waiting.</p>
            ) : (
              <ul className="space-y-3">
                {items.map((c) => (
                  <li key={c.id}>
                    <Card>
                      <CardContent className="flex flex-col gap-4 py-5 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                          <StatusBadge status={c.status} />
                          <p className="mt-2 font-display text-2xl leading-tight">
                            {c.working_title}
                          </p>
                          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
                            {c.logline}
                          </p>
                          {c.fresh_because ? (
                            <p className="mt-2 max-w-xl text-sm">
                              <span className="text-muted-foreground">Fresh because · </span>
                              {c.fresh_because}
                            </p>
                          ) : null}
                        </div>
                        <Button asChild className="shrink-0">
                          <Link to="/books/$id" params={{ id: c.id }}>
                            Open the book
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  </li>
                ))}
              </ul>
            )}
          </section>
        );
      })}
    </div>
  );
}
