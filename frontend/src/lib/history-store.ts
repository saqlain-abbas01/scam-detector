import { type AnalysisResult } from "./mock-api";

export interface HistoryEntry {
  id: string;
  message: string;
  result: AnalysisResult;
  timestamp: number;
}

const STORAGE_KEY = "scam_detector_history";
const MAX_ENTRIES = 50;

export function getHistory(): HistoryEntry[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as HistoryEntry[]) : [];
  } catch {
    return [];
  }
}

export function addToHistory(
  message: string,
  result: AnalysisResult,
): HistoryEntry {
  const entry: HistoryEntry = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    message,
    result,
    timestamp: Date.now(),
  };
  const history = getHistory();
  const updated = [entry, ...history].slice(0, MAX_ENTRIES);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return entry;
}

export function clearHistory(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function deleteEntry(id: string): void {
  const history = getHistory().filter((e) => e.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}
