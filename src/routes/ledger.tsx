import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState, type ReactNode } from "react";
import { StatusBadge } from "@/components/status-badge";
import { Input } from "@/components/ui/input";
import { useConcepts } from "@/hooks/use-house";
import { STATUSES, STATUS_LABEL, type Status } from "@/lib/status";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/ledger")({ component: Ledger });

function Ledger() {
  const q = useConcepts();
  const [filter, setFilter] = useState<Status | "ALL">("ALL");
  const [query, setQuery] = useState("");
  const rows = useMemo(() => {
    const list = q.data ?? [];
    return list.filter((c) => {
      if (filter !== "ALL" && c.status !== filter) return false;
      if (!query.trim()) return true;
      const hay = `${c.working_title} ${c.genre} ${c.logline}`.toLowerCase();
      return hay.includes(query.toLowerCase());
    });
  }, [q.data, filter, query]);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[11px] tracking-[0.22em] text-muted-foreground uppercase">
          Concept ledger
        </p>
        <h1 className="mt-1 text-3xl">Every title the house has touched</h1>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search title, genre, logline"
          className="sm:max-w-sm"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        <FilterChip active={filter === "ALL"} onClick={() => setFilter("ALL")}>
          All
        </FilterChip>
        {STATUSES.map((s) => (
          <FilterChip key={s} active={filter === s} onClick={() => setFilter(s)}>
            {STATUS_LABEL[s]}
          </FilterChip>
        ))}
      </div>

      <div className="overflow-x-auto rounded-xl shadow-[var(--shadow-border)]">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-muted text-[11px] tracking-widest text-muted-foreground uppercase">
            <tr>
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Genre</th>
              <th className="px-4 py-3 font-medium">Tab</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Confidence</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((c) => (
              <tr key={c.id} className="border-t border-border hover:bg-accent/60">
                <td className="px-4 py-3">
                  <Link
                    to="/books/$id"
                    params={{ id: c.id }}
                    className="font-medium hover:underline"
                  >
                    {c.working_title}
                  </Link>
                  <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                    {c.logline}
                  </p>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{c.genre}</td>
                <td className="px-4 py-3 text-muted-foreground">{c.source_tab}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={c.status} />
                </td>
                <td className="px-4 py-3 text-muted-foreground">{c.confidence ?? "—"}</td>
              </tr>
            ))}
            {rows.length === 0 && !q.isLoading ? (
              <tr>
                <td className="px-4 py-8 text-muted-foreground" colSpan={5}>
                  Nothing in this slice of the ledger.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "h-9 shrink-0 rounded-full px-3 text-xs transition-colors",
        active
          ? "bg-primary text-primary-foreground"
          : "bg-muted text-muted-foreground hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}
