import { useState } from "react";
import { Shield } from "lucide-react";
import { MessageInput } from "@/components/message-input";
import { ResultCard } from "@/components/result-card";
import { Loader } from "@/components/loader";
import { Badge } from "@/components/ui/badge";
import { analyzeMessage, AnalysisResult } from "@/lib/mock-api";
import { addToHistory } from "@/lib/history-store";

export default function Home() {
  const [message, setMessage] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleAnalyze = async () => {
    if (!message.trim()) return;
    setIsAnalyzing(true);
    setResult(null);
    
    try {
      const res = await analyzeMessage(message);
      addToHistory(message, res);
      setResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setMessage("");
    setResult(null);
  };

  return (
    <div className="min-h-screen w-full pt-16 pb-24 px-4 sm:px-6 relative z-10 flex flex-col">
      
      <header className="max-w-3xl mx-auto text-center mb-12 space-y-4">
        <div className="inline-flex items-center justify-center mb-2">
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 px-3 py-1 rounded-full text-xs font-mono tracking-wide uppercase">
            <Shield className="w-3 h-3 mr-2 inline" />
            Powered by AI
          </Badge>
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-500 to-pink-500">
            AI Scam Detector
          </span>
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto font-light">
          Detect fraud, phishing, and suspicious messages instantly. Paste any message below for an immediate threat analysis.
        </p>
      </header>

      <main className="flex-1 w-full max-w-4xl mx-auto flex flex-col items-center">
        {!result && !isAnalyzing && (
          <MessageInput 
            value={message} 
            onChange={setMessage} 
            onAnalyze={handleAnalyze} 
            isAnalyzing={isAnalyzing}
          />
        )}
        
        {isAnalyzing && <Loader />}
        
        {result && <ResultCard result={result} onReset={handleReset} />}
      </main>

      <footer className="mt-auto pt-16 text-center text-sm text-muted-foreground/60 font-mono">
        <p>Consumer Safety Intelligence</p>
      </footer>
    </div>
  );
}
