import { AnalysisResult } from "@/lib/mock-api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RiskBadge } from "./risk-badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { 
  AlertTriangle, 
  Link2, 
  DollarSign, 
  PhoneOff, 
  ShieldAlert,
  Copy,
  RefreshCcw,
  CheckCircle2,
  Info
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

interface ResultCardProps {
  result: AnalysisResult;
  onReset: () => void;
}

function getIconForReason(reason: string) {
  const r = reason.toLowerCase();
  if (r.includes("link")) return <Link2 className="w-4 h-4 text-blue-400" />;
  if (r.includes("urgency") || r.includes("urgent")) return <AlertTriangle className="w-4 h-4 text-amber-400" />;
  if (r.includes("financial") || r.includes("prize")) return <DollarSign className="w-4 h-4 text-emerald-400" />;
  if (r.includes("sender")) return <PhoneOff className="w-4 h-4 text-muted-foreground" />;
  return <Info className="w-4 h-4 text-muted-foreground" />;
}

export function ResultCard({ result, onReset }: ResultCardProps) {
  const [urduMode, setUrduMode] = useState(false);
  const { toast } = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(`Risk: ${result.risk}\nConfidence: ${result.confidence}%\nReasons: ${result.reasons.join(", ")}\nSuggestion: ${result.suggestion}`);
    toast({
      title: "Copied to clipboard",
      description: "Analysis results copied successfully.",
    });
  };

  const getProgressColor = () => {
    if (result.risk === "High") return "bg-destructive";
    if (result.risk === "Medium") return "bg-amber-500";
    return "bg-emerald-500";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full max-w-2xl mx-auto mt-8"
    >
      <Card className="bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl overflow-hidden">
        <CardHeader className="bg-black/20 border-b border-white/5 pb-4">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl font-medium text-foreground/80 mb-3">Analysis Verdict</CardTitle>
              <RiskBadge risk={result.risk} />
            </div>
            <div className="flex items-center space-x-2 bg-black/20 p-2 rounded-lg border border-white/5">
              <Switch 
                id="urdu-toggle" 
                checked={urduMode} 
                onCheckedChange={setUrduMode}
                data-testid="toggle-urdu"
              />
              <Label htmlFor="urdu-toggle" className="text-xs text-muted-foreground cursor-pointer">Explain in Urdu</Label>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-6 space-y-8">
          
          {/* Confidence Score */}
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground font-medium uppercase tracking-wider">AI Confidence Score</span>
              <span className="font-mono text-lg font-bold text-foreground">{result.confidence}%</span>
            </div>
            <Progress 
              value={result.confidence} 
              className="h-2 bg-white/5" 
              indicatorClassName={getProgressColor()}
            />
          </div>
          
          <Separator className="bg-white/5" />

          {/* Reasons */}
          <div className="space-y-4">
            <h4 className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Why we flagged this</h4>
            <div className="grid gap-2">
              {result.reasons.map((reason, idx) => (
                <div key={idx} className="flex items-center gap-3 bg-white/5 border border-white/5 p-3 rounded-lg">
                  {getIconForReason(reason)}
                  <span className="text-sm font-medium">{reason}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Suggestion */}
          <div className="space-y-4">
            <h4 className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Recommendation</h4>
            
            {urduMode ? (
              <Alert className="bg-primary/10 border-primary/20 text-primary-foreground">
                <Info className="h-5 w-5 text-primary" />
                <AlertTitle className="text-primary font-bold text-lg text-right" dir="rtl">تجویز</AlertTitle>
                <AlertDescription className="text-sm text-right mt-2" dir="rtl">
                  یہ پیغام مشکوک ہے۔ براہ کرم کسی بھی لنک پر کلک نہ کریں اور ذاتی معلومات فراہم کرنے سے گریز کریں۔
                </AlertDescription>
              </Alert>
            ) : (
              <Alert 
                variant={result.risk === "High" ? "destructive" : "default"}
                className={
                  result.risk === "High" ? "bg-destructive/10 border-destructive/20" :
                  result.risk === "Medium" ? "bg-amber-500/10 border-amber-500/20 text-amber-500" :
                  "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
                }
              >
                {result.risk === "High" ? <ShieldAlert className="h-5 w-5" /> : 
                 result.risk === "Medium" ? <AlertTriangle className="h-5 w-5" /> : 
                 <CheckCircle2 className="h-5 w-5" />}
                <AlertTitle className="font-bold text-lg mb-1">
                  {result.risk === "High" ? "Critical Action Required" : 
                   result.risk === "Medium" ? "Exercise Caution" : 
                   "Safe to Proceed"}
                </AlertTitle>
                <AlertDescription className="text-sm font-medium opacity-90 leading-relaxed text-foreground">
                  {result.suggestion}
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button 
              variant="outline" 
              className="flex-1 border-white/10 hover:bg-white/5"
              onClick={handleCopy}
              data-testid="button-copy"
            >
              <Copy className="w-4 h-4 mr-2" /> Copy Result
            </Button>
            <Button 
              variant="secondary" 
              className="flex-1 bg-white/10 hover:bg-white/20 text-white"
              onClick={onReset}
              data-testid="button-reset"
            >
              <RefreshCcw className="w-4 h-4 mr-2" /> Check Another
            </Button>
          </div>

        </CardContent>
      </Card>
    </motion.div>
  );
}
