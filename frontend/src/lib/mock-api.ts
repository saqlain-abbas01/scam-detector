export type RiskLevel = "High" | "Medium" | "Low";

export interface AnalysisResult {
  risk: RiskLevel;
  confidence: number;
  reasons: string[];
  suggestion: string;
}

import { apiRequest } from "./api-client";

interface AnalyzeResponse {
  success: boolean;
  data: {
    risk: string;
    confidence: number;
    reasons: string[];
    suggestion: string;
  };
}

export async function analyzeMessage(message: string): Promise<AnalysisResult> {
  const response = await apiRequest<AnalyzeResponse>("/api/analyze", {
    method: "POST",
    body: JSON.stringify({ message }),
  });

  const confidenceRaw = Number(response?.data?.confidence || 0);
  const confidencePercent =
    confidenceRaw <= 1
      ? Math.round(confidenceRaw * 100)
      : Math.max(0, Math.min(100, Math.round(confidenceRaw)));

  return {
    risk: (response?.data?.risk as RiskLevel) || "Low",
    confidence: confidencePercent,
    reasons: Array.isArray(response?.data?.reasons)
      ? response.data.reasons
      : [],
    suggestion: response?.data?.suggestion || "",
  };
}
