import type { Concept } from "./types";
import { TAP_STATUSES, type Status } from "./status";

export function pendingTaps(concepts: Concept[]) {
  return concepts.filter((c) => TAP_STATUSES.includes(c.status));
}

export function countByStatus(concepts: Concept[]) {
  const counts: Partial<Record<Status, number>> = {};
  for (const c of concepts) counts[c.status] = (counts[c.status] ?? 0) + 1;
  return counts;
}

export function chapterWordTotal(concept: Concept) {
  return concept.chapters.reduce((n, ch) => n + (ch.word_count || 0), 0);
}

export function plannedChapterCount(concept: Concept) {
  const plan = concept.story_plan;
  if (!plan) return 0;
  const chapters = plan.chapters;
  if (Array.isArray(chapters)) return chapters.length;
  const target = plan.chapter_target;
  return typeof target === "number" ? target : 0;
}
