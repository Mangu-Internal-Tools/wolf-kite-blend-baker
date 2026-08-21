import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { AGENTS } from "@/lib/agents";
import { MILESTONES } from "@/lib/status";

export const Route = createFileRoute("/agents")({ component: Agents });

function Agents() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-[11px] tracking-[0.22em] text-muted-foreground uppercase">
          Sixteen seats
        </p>
        <h1 className="mt-1 text-3xl">The floor roster</h1>
        <p className="mt-2 max-w-xl text-sm text-muted-foreground">
          Each agent has one job. Temperature and tools are house law. They speak JSON.
          You speak yes or no.
        </p>
      </div>

      {MILESTONES.map((m) => (
        <section key={m.id} className="space-y-3">
          <div className="flex items-baseline gap-3">
            <h2 className="text-xl">
              {m.id} · {m.name}
            </h2>
            {m.gate ? (
              <span className="text-xs tracking-widest text-muted-foreground uppercase">
                {m.gate}
              </span>
            ) : null}
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {AGENTS.filter((a) => a.milestone === m.id).map((a) => (
              <Card key={a.id}>
                <CardContent className="py-5">
                  <p className="font-mono text-[11px] tracking-widest text-muted-foreground uppercase">
                    {a.id}
                  </p>
                  <p className="mt-1 font-display text-xl">{a.name}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{a.role}</p>
                  <p className="mt-3 font-mono text-[11px] text-muted-foreground">
                    temp {a.temperature.toFixed(1)} · max {a.maxTokens}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
