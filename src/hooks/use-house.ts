import { useQuery } from "@tanstack/react-query";
import { getAiStatus } from "@/lib/server/xai";
import { getConcept, listConcepts, listEvents, listRuns } from "@/lib/server/concepts";

export function useConcepts() {
  return useQuery({ queryKey: ["concepts"], queryFn: () => listConcepts() });
}

export function useConcept(id: string) {
  return useQuery({
    queryKey: ["concept", id],
    queryFn: () => getConcept({ data: { id } }),
    enabled: Boolean(id),
  });
}

export function useEvents() {
  return useQuery({ queryKey: ["events"], queryFn: () => listEvents() });
}

export function useRuns(conceptId?: string) {
  return useQuery({
    queryKey: ["runs", conceptId ?? "all"],
    queryFn: () => listRuns({ data: { conceptId } }),
  });
}

export function useAiStatus() {
  return useQuery({ queryKey: ["ai-status"], queryFn: () => getAiStatus() });
}
