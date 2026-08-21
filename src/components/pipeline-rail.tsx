import { MILESTONES } from "@/lib/status";
import { cn } from "@/lib/utils";

export function PipelineRail({ active }: { active?: string }) {
  return (
    <ol className="flex gap-2 overflow-x-auto pb-1">
      {MILESTONES.map((m, i) => {
        const on = active === m.id;
        return (
          <li key={m.id} className="flex min-w-max items-center gap-2">
            <div
              className={cn(
                "rounded-lg px-3 py-2 shadow-[var(--shadow-border)]",
                on ? "bg-primary text-primary-foreground" : "bg-card",
              )}
            >
              <p className="font-mono text-[10px] tracking-widest uppercase opacity-70">
                {m.id}
              </p>
              <p className="text-sm font-medium">{m.name}</p>
              {m.gate ? (
                <p className="text-[11px] opacity-70">{m.gate}</p>
              ) : null}
            </div>
            {i < MILESTONES.length - 1 ? (
              <span className="text-muted-foreground" aria-hidden>
                →
              </span>
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
