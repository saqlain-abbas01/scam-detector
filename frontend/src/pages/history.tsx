import { useState, useCallback } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  History,
  Trash2,
  ChevronDown,
  ChevronUp,
  Shield,
  AlertTriangle,
  CheckCircle2,
  Search,
  Clock,
  BarChart3,
  Flame,
  Leaf,
  Copy,
  LogIn,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth-context";
import {
  getHistory,
  clearHistory,
  deleteEntry,
  type HistoryEntry,
} from "@/lib/history-store";
import { type RiskLevel } from "@/lib/mock-api";
import { useToast } from "@/hooks/use-toast";

type Filter = "All" | RiskLevel;

const RISK_CONFIG: Record<
  RiskLevel,
  {
    label: string;
    icon: React.ReactNode;
    gradient: string;
    bg: string;
    border: string;
    text: string;
  }
> = {
  High: {
    label: "High Risk",
    icon: <Flame className="w-4 h-4" />,
    gradient: "from-red-600 to-rose-600",
    bg: "bg-red-500/10",
    border: "border-red-500/30",
    text: "text-red-400",
  },
  Medium: {
    label: "Medium Risk",
    icon: <AlertTriangle className="w-4 h-4" />,
    gradient: "from-amber-500 to-orange-500",
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    text: "text-amber-400",
  },
  Low: {
    label: "Low Risk",
    icon: <Leaf className="w-4 h-4" />,
    gradient: "from-emerald-500 to-teal-500",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    text: "text-emerald-400",
  },
};

function formatDate(ts: number) {
  const d = new Date(ts);
  const now = new Date();
  const diff = now.getTime() - ts;
  if (diff < 60_000) return "Just now";
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function HistoryCard({
  entry,
  onDelete,
}: {
  entry: HistoryEntry;
  onDelete: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const { toast } = useToast();
  const cfg = RISK_CONFIG[entry.result.risk];

  const handleCopy = () => {
    navigator.clipboard.writeText(entry.message);
    toast({ title: "Copied", description: "Message copied to clipboard." });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      layout
    >
      <Card
        className={`bg-white/5 backdrop-blur-md border ${cfg.border} shadow-lg overflow-hidden hover:bg-white/[0.07] transition-colors`}
      >
        <CardContent className="p-0">
          {/* Colored top bar */}
          <div className={`h-1 bg-gradient-to-r ${cfg.gradient}`} />

          <div className="p-5">
            {/* Header row */}
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge
                  className={`${cfg.bg} ${cfg.text} ${cfg.border} border gap-1.5 font-medium`}
                >
                  {cfg.icon}
                  {cfg.label}
                </Badge>
                <Badge
                  variant="outline"
                  className="border-white/10 bg-white/5 text-muted-foreground text-xs font-mono"
                >
                  {entry.result.confidence}% confidence
                </Badge>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  onClick={handleCopy}
                  className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors"
                  title="Copy message"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onDelete(entry.id)}
                  className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                  title="Delete entry"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Message preview */}
            <p className="text-sm text-foreground/70 leading-relaxed line-clamp-2 mb-3 font-mono bg-black/20 rounded-lg px-3 py-2 border border-white/5">
              {entry.message}
            </p>

            {/* Confidence bar */}
            <div className="mb-3">
              <Progress
                value={entry.result.confidence}
                className={`h-1.5 bg-white/5 [&>div]:bg-gradient-to-r [&>div]:${cfg.gradient}`}
              />
            </div>

            {/* Footer row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="w-3.5 h-3.5" />
                {formatDate(entry.timestamp)}
              </div>
              <button
                onClick={() => setExpanded((e) => !e)}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                {expanded ? "Hide details" : "Show details"}
                {expanded ? (
                  <ChevronUp className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
              </button>
            </div>

            {/* Expanded details */}
            <AnimatePresence>
              {expanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="pt-4 mt-3 border-t border-white/10 space-y-3">
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                        Why flagged
                      </p>
                      <ul className="space-y-1">
                        {entry.result.reasons.map((r) => (
                          <li
                            key={r}
                            className="flex items-center gap-2 text-sm text-foreground/70"
                          >
                            <div
                              className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${cfg.gradient} flex-shrink-0`}
                            />
                            {r}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div
                      className={`rounded-lg ${cfg.bg} border ${cfg.border} px-3 py-2`}
                    >
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                        Recommendation
                      </p>
                      <p className={`text-sm ${cfg.text}`}>
                        {entry.result.suggestion}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function HistoryPage() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [entries, setEntries] = useState<HistoryEntry[]>(() => getHistory());
  const [filter, setFilter] = useState<Filter>("All");
  const [search, setSearch] = useState("");

  const handleDelete = useCallback((id: string) => {
    deleteEntry(id);
    setEntries(getHistory());
  }, []);

  const handleClearAll = () => {
    clearHistory();
    setEntries([]);
    toast({
      title: "History cleared",
      description: "All scan history has been deleted.",
    });
  };

  const filtered = entries.filter((e) => {
    const matchFilter = filter === "All" || e.result.risk === filter;
    const matchSearch =
      !search || e.message.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const stats = {
    total: entries.length,
    high: entries.filter((e) => e.result.risk === "High").length,
    medium: entries.filter((e) => e.result.risk === "Medium").length,
    low: entries.filter((e) => e.result.risk === "Low").length,
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-sm"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-600/20 to-blue-600/20 border border-white/10 mb-6">
            <History className="w-10 h-10 text-purple-400" />
          </div>
          <h2 className="text-2xl font-extrabold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
            Sign in to view history
          </h2>
          <p className="text-muted-foreground mb-6">
            Your scan history is saved to your account. Sign in to access it.
          </p>
          <Button
            onClick={() => navigate("/login")}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-xl px-8 h-12"
          >
            <LogIn className="w-4 h-4 mr-2" />
            Sign In
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-24 px-4 sm:px-6 relative z-10">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge
                  variant="outline"
                  className="bg-primary/10 text-primary border-primary/30 px-3 py-1 rounded-full text-xs font-mono tracking-wide uppercase"
                >
                  <History className="w-3 h-3 mr-1.5 inline" />
                  Scan History
                </Badge>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-500 to-pink-500">
                  Your Scan History
                </span>
              </h1>
              <p className="text-muted-foreground mt-1">
                All your previous scam analysis results
              </p>
            </div>
            {entries.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearAll}
                className="border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="w-4 h-4 mr-1.5" />
                Clear All
              </Button>
            )}
          </div>
        </motion.div>

        {/* Stats cards */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8"
        >
          {[
            {
              label: "Total Scans",
              value: stats.total,
              icon: <BarChart3 className="w-5 h-5" />,
              gradient: "from-purple-600 to-blue-600",
              bg: "bg-purple-500/10",
              text: "text-purple-400",
            },
            {
              label: "High Risk",
              value: stats.high,
              icon: <Flame className="w-5 h-5" />,
              gradient: "from-red-600 to-rose-600",
              bg: "bg-red-500/10",
              text: "text-red-400",
            },
            {
              label: "Medium Risk",
              value: stats.medium,
              icon: <AlertTriangle className="w-5 h-5" />,
              gradient: "from-amber-500 to-orange-500",
              bg: "bg-amber-500/10",
              text: "text-amber-400",
            },
            {
              label: "Low Risk",
              value: stats.low,
              icon: <CheckCircle2 className="w-5 h-5" />,
              gradient: "from-emerald-500 to-teal-500",
              bg: "bg-emerald-500/10",
              text: "text-emerald-400",
            },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + i * 0.05 }}
            >
              <Card className={`${s.bg} border border-white/10 shadow-md`}>
                <CardContent className="p-4">
                  <div className={`${s.text} mb-2`}>{s.icon}</div>
                  <div
                    className={`text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r ${s.gradient}`}
                  >
                    {s.value}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {s.label}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Filters + Search */}
        {entries.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-3 mb-6"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Search messages..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-black/20 border-white/10 focus-visible:ring-purple-500/50 h-10"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {(["All", "High", "Medium", "Low"] as Filter[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all duration-150 ${
                    filter === f
                      ? f === "All"
                        ? "bg-primary/20 text-primary border-primary/40"
                        : `${RISK_CONFIG[f as RiskLevel].bg} ${RISK_CONFIG[f as RiskLevel].text} ${RISK_CONFIG[f as RiskLevel].border}`
                      : "bg-white/5 border-white/10 text-muted-foreground hover:bg-white/10 hover:text-foreground"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Entries list */}
        {filtered.length > 0 ? (
          <motion.div layout className="space-y-4">
            <AnimatePresence mode="popLayout">
              {filtered.map((entry) => (
                <HistoryCard
                  key={entry.id}
                  entry={entry}
                  onDelete={handleDelete}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : entries.length === 0 ? (
          /* Empty state — no history at all */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-purple-600/20 to-blue-600/20 border border-white/10 mb-6">
              <Shield className="w-12 h-12 text-purple-400/60" />
            </div>
            <h3 className="text-xl font-bold text-foreground/80 mb-2">
              No scans yet
            </h3>
            <p className="text-muted-foreground max-w-xs mx-auto mb-6">
              Analyze a message on the home page and your results will appear
              here automatically.
            </p>
            <Button
              onClick={() => navigate("/")}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-xl px-8 h-11"
            >
              Analyze a Message
            </Button>
          </motion.div>
        ) : (
          /* Empty state — no matches for filter/search */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <Search className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-muted-foreground">
              No results match your filter.
            </p>
            <button
              onClick={() => {
                setFilter("All");
                setSearch("");
              }}
              className="text-primary text-sm mt-2 hover:underline"
            >
              Clear filters
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
