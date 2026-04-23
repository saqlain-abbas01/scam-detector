import { RiskLevel } from "@/lib/mock-api";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface RiskBadgeProps {
  risk: RiskLevel;
  className?: string;
}

export function RiskBadge({ risk, className }: RiskBadgeProps) {
  if (risk === "High") {
    return (
      <Badge 
        className={cn(
          "bg-destructive/10 text-destructive border border-destructive/20 animate-pulse-subtle px-3 py-1 text-sm font-semibold uppercase tracking-wider",
          className
        )}
        variant="outline"
      >
        High Risk
      </Badge>
    );
  }
  
  if (risk === "Medium") {
    return (
      <Badge 
        className={cn(
          "bg-amber-500/10 text-amber-500 border border-amber-500/20 px-3 py-1 text-sm font-semibold uppercase tracking-wider",
          className
        )}
        variant="outline"
      >
        Medium Risk
      </Badge>
    );
  }

  return (
    <Badge 
      className={cn(
        "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-3 py-1 text-sm font-semibold uppercase tracking-wider",
        className
      )}
      variant="outline"
    >
      Low Risk
    </Badge>
  );
}
