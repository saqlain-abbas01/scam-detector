import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ExampleList } from "./example-list";
import { Card, CardContent } from "@/components/ui/card";
import { ScanSearch } from "lucide-react";

interface MessageInputProps {
  value: string;
  onChange: (val: string) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
}

export function MessageInput({ value, onChange, onAnalyze, isAnalyzing }: MessageInputProps) {
  const maxLength = 2000;
  
  return (
    <Card className="bg-white/5 backdrop-blur-md border border-white/10 shadow-xl w-full max-w-2xl mx-auto overflow-hidden">
      <CardContent className="p-6">
        <div className="relative">
          <Textarea 
            placeholder="Paste your SMS, WhatsApp, or email message here..."
            className="min-h-[160px] bg-black/20 border-white/10 focus-visible:ring-purple-500/50 resize-none text-base placeholder:text-muted-foreground/60 p-4"
            value={value}
            onChange={(e) => onChange(e.target.value.slice(0, maxLength))}
            data-testid="input-message"
          />
          <div className="absolute bottom-3 right-3 text-xs text-muted-foreground font-mono">
            {value.length} / {maxLength}
          </div>
        </div>
        
        <div className="mt-6 flex flex-col sm:flex-row gap-3 items-center">
          <Button 
            className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-xl h-12 px-8 text-base font-medium shadow-lg hover:shadow-purple-500/25 transition-all duration-200 hover:scale-105"
            onClick={onAnalyze}
            disabled={!value.trim() || isAnalyzing}
            data-testid="button-analyze"
          >
            <ScanSearch className="w-5 h-5 mr-2" />
            Analyze Message
          </Button>
          
          <Button 
            variant="ghost" 
            className="w-full sm:w-auto text-muted-foreground hover:text-white"
            onClick={() => onChange("")}
            disabled={!value || isAnalyzing}
            data-testid="button-clear"
          >
            Clear
          </Button>
        </div>
        
        <ExampleList onSelect={onChange} />
      </CardContent>
    </Card>
  );
}
