import { Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export function Loader() {
  return (
    <Card className="bg-white/5 backdrop-blur-md border border-white/10 shadow-xl w-full max-w-2xl mx-auto overflow-hidden mt-8">
      <CardContent className="p-8 flex flex-col items-center justify-center space-y-6">
        <div className="flex items-center gap-3 text-primary">
          <Loader2 className="w-6 h-6 animate-spin" />
          <h3 className="text-lg font-medium text-foreground">Analyzing message with AI...</h3>
        </div>
        
        <div className="w-full space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-1/4 bg-white/10" />
            <Skeleton className="h-8 w-full bg-white/10" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-1/3 bg-white/10" />
            <Skeleton className="h-20 w-full bg-white/10" />
          </div>
          <div className="flex gap-2 pt-4">
            <Skeleton className="h-10 w-24 bg-white/10 rounded-md" />
            <Skeleton className="h-10 w-24 bg-white/10 rounded-md" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
