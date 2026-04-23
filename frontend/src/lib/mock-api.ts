export type RiskLevel = "High" | "Medium" | "Low";

export interface AnalysisResult {
  risk: RiskLevel;
  confidence: number;
  reasons: string[];
  suggestion: string;
}

const results: Record<string, AnalysisResult> = {
  high: {
    risk: "High",
    confidence: 94,
    reasons: ["Suspicious link detected", "Urgency language used", "Financial bait (prize/reward)", "Unknown sender pattern"],
    suggestion: "Do not click any links in this message. Report it to your carrier (forward to 7726). Delete immediately.",
  },
  medium: {
    risk: "Medium",
    confidence: 67,
    reasons: ["Urgency language used", "Requests personal information"],
    suggestion: "Exercise caution. Verify the sender through official channels before responding or clicking any links.",
  },
  low: {
    risk: "Low",
    confidence: 18,
    reasons: ["No suspicious links detected", "No urgency language"],
    suggestion: "This message appears safe, but always stay alert to unexpected requests for personal information.",
  },
};

export async function analyzeMessage(message: string): Promise<AnalysisResult> {
  await new Promise(res => setTimeout(res, 1800));
  const lower = message.toLowerCase();
  if (lower.includes("won") || lower.includes("click") || lower.includes("free") || lower.includes("urgent") || lower.includes("irs")) {
    return results.high;
  }
  if (lower.includes("bank") || lower.includes("verify") || lower.includes("account") || lower.includes("blocked")) {
    return results.medium;
  }
  return results.low;
}
