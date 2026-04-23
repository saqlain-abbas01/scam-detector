import { Badge } from "@/components/ui/badge";

const examples = [
  "You won $1,000 — click here to claim",
  "Your bank account is blocked. Verify now",
  "URGENT: IRS notice — pay immediately",
  "Free iPhone 15 — limited offer, act fast"
];

interface ExampleListProps {
  onSelect: (msg: string) => void;
}

export function ExampleList({ onSelect }: ExampleListProps) {
  return (
    <div className="mt-6 flex flex-wrap gap-2">
      {examples.map((ex, i) => (
        <Badge 
          key={i}
          variant="outline" 
          className="cursor-pointer bg-white/5 border-white/10 text-muted-foreground hover:text-foreground hover:bg-white/10 hover:border-purple-500/50 transition-all duration-200 py-1.5 px-3 rounded-full text-xs font-normal"
          onClick={() => onSelect(ex)}
          data-testid={`example-chip-${i}`}
        >
          {ex}
        </Badge>
      ))}
    </div>
  );
}
