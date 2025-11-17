import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type Status = "pending" | "reviewed" | "approved" | "rejected" | "revision";

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const variants = {
    pending: "bg-warning/10 text-warning border-warning/20",
    reviewed: "bg-primary/10 text-primary border-primary/20",
    approved: "bg-success/10 text-success border-success/20",
    rejected: "bg-destructive/10 text-destructive border-destructive/20",
    revision: "bg-accent/10 text-accent border-accent/20",
  };

  const labels = {
    pending: "Pending",
    reviewed: "Reviewed",
    approved: "Approved",
    rejected: "Rejected",
    revision: "Needs Revision",
  };

  return (
    <Badge
      variant="outline"
      className={cn("font-medium", variants[status], className)}
    >
      {labels[status]}
    </Badge>
  );
}
