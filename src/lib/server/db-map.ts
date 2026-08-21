import type { Concept, AgentRun, HouseEvent, Comp, ChapterDraft, JsonMap } from "@/lib/types";
import type { Status } from "@/lib/status";

function asObject(value: unknown): JsonMap | null {
  if (value == null) return null;
  if (typeof value === "string") {
    try {
      const parsed: unknown = JSON.parse(value);
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        return parsed as JsonMap;
      }
      return null;
    } catch {
      return null;
    }
  }
  if (typeof value === "object" && !Array.isArray(value)) return value as JsonMap;
  return null;
}

function asArray<T>(value: unknown, fallback: T[] = []): T[] {
  if (!value) return fallback;
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? (parsed as T[]) : fallback;
    } catch {
      return fallback;
    }
  }
  return Array.isArray(value) ? (value as T[]) : fallback;
}

export function mapConcept(row: Record<string, unknown>): Concept {
  return {
    id: String(row.id),
    working_title: String(row.working_title),
    subtitle: row.subtitle ? String(row.subtitle) : null,
    logline: String(row.logline ?? ""),
    genre: String(row.genre ?? ""),
    source_tab: String(row.source_tab ?? "Popular"),
    status: String(row.status) as Status,
    confidence: row.confidence ? String(row.confidence) : null,
    protagonist_sketch: row.protagonist_sketch ? String(row.protagonist_sketch) : null,
    setting: row.setting ? String(row.setting) : null,
    fresh_because: row.fresh_because ? String(row.fresh_because) : null,
    comps: asArray<Comp>(row.comps),
    critic: asObject(row.critic),
    scout_brief: asObject(row.scout_brief),
    concept_row: asObject(row.concept_row),
    story_plan: asObject(row.story_plan),
    continuity: asObject(row.continuity),
    chapters: asArray<ChapterDraft>(row.chapters),
    quality_report: asObject(row.quality_report),
    metadata_pkg: asObject(row.metadata_pkg),
    production_pack: asObject(row.production_pack),
    tap_notes: row.tap_notes ? String(row.tap_notes) : null,
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
  };
}

export function mapRun(row: Record<string, unknown>): AgentRun {
  return {
    id: String(row.id),
    concept_id: row.concept_id ? String(row.concept_id) : null,
    agent_name: String(row.agent_name),
    milestone: String(row.milestone),
    status: String(row.status),
    output: asObject(row.output),
    error: row.error ? String(row.error) : null,
    duration_ms: typeof row.duration_ms === "number" ? row.duration_ms : null,
    created_at: String(row.created_at),
  };
}

export function mapEvent(row: Record<string, unknown>): HouseEvent {
  return {
    id: String(row.id),
    concept_id: row.concept_id ? String(row.concept_id) : null,
    message: String(row.message),
    created_at: String(row.created_at),
  };
}
