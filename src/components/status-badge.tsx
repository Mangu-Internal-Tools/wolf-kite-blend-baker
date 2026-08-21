import { Badge } from "@/components/ui/badge";
import { STATUS_LABEL, type Status } from "@/lib/status";
import { cn } from "@/lib/utils";

export function StatusBadge({ status }: { status: Status }) {
  const tone =
    status === "PUBLISHED"
      ? "bg-paper text-ink"
      : status === "REJECTED"
        ? "bg-destructive/15 text-destructive"
        : status === "TOP10" || status === "LOCKED" || status === "DRAFTING"
          ? "bg-primary text-primary-foreground"
          : "bg-muted text-muted-foreground";
  return (
    <Badge className={cn("normal-case tracking-normal", tone)}>
      {STATUS_LABEL[status]}
    </Badge>
  );
}
