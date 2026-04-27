import { apiRequest } from "./api-client";
import type { RiskLevel } from "./mock-api";

export interface UserHistoryEntry {
  id: string;
  message: string;
  result: {
    risk: RiskLevel;
    confidence: number;
    reasons: string[];
    suggestion: string;
  };
  timestamp: number;
}

interface HistoryApiResponse {
  success: boolean;
  data: Array<{
    id: string;
    message: string;
    result: {
      risk: string;
      confidence: number;
      reasons: string[];
      suggestion: string;
    };
    createdAt: string;
  }>;
}

interface DeleteHistoryResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
  };
}

const mapHistoryEntries = (
  entries: HistoryApiResponse["data"],
): UserHistoryEntry[] => {
  return (entries || []).map((item) => {
    const confidenceRaw = Number(item?.result?.confidence || 0);
    const confidencePercent =
      confidenceRaw <= 1
        ? Math.round(confidenceRaw * 100)
        : Math.max(0, Math.min(100, Math.round(confidenceRaw)));

    return {
      id: item.id,
      message: item.message,
      result: {
        risk: (item?.result?.risk as RiskLevel) || "Low",
        confidence: confidencePercent,
        reasons: Array.isArray(item?.result?.reasons)
          ? item.result.reasons
          : [],
        suggestion: item?.result?.suggestion || "",
      },
      timestamp: new Date(item.createdAt).getTime(),
    };
  });
};

export async function fetchUserHistory(): Promise<UserHistoryEntry[]> {
  const response = await apiRequest<HistoryApiResponse>("/api/analyze/history");

  return mapHistoryEntries(response.data || []);
}

export async function searchUserHistory(
  query: string,
): Promise<UserHistoryEntry[]> {
  const encoded = encodeURIComponent(query);
  const response = await apiRequest<HistoryApiResponse>(
    `/api/analyze/history/search?q=${encoded}`,
  );

  return mapHistoryEntries(response.data || []);
}

export async function deleteHistoryMessage(id: string): Promise<string> {
  const response = await apiRequest<DeleteHistoryResponse>(
    `/api/analyze/history/${id}`,
    {
      method: "DELETE",
    },
  );

  return response.message;
}
