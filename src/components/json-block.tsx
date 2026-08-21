import { cn } from "@/lib/utils";

export function JsonBlock({
  value,
  className,
}: {
  value: unknown;
  className?: string;
}) {
  if (value == null) {
    return <p className="text-sm text-muted-foreground">Not written yet.</p>;
  }
  return (
    <pre
      className={cn(
        "max-h-[480px] overflow-auto rounded-lg bg-muted p-4 font-mono text-xs leading-relaxed text-foreground/90",
        className,
      )}
    >
      {JSON.stringify(value, null, 2)}
    </pre>
  );
}
