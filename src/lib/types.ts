import type { Status } from "./status";

export type Json =
  | string
  | number
  | boolean
  | null
  | Json[]
  | { [key: string]: Json };

export type JsonMap = { [key: string]: Json };

export type Comp = { title: string; author?: string };

export type ChapterDraft = {
  chapter_number: number;
  chapter_title?: string;
  word_count: number;
  prose: string;
  new_elements?: { type: string; name: string; description: string }[];
  voice_pass?: boolean;
  voice_notes?: string;
};

export type Concept = {
  id: string;
  working_title: string;
  subtitle: string | null;
  logline: string;
  genre: string;
  source_tab: string;
  status: Status;
  confidence: string | null;
  protagonist_sketch: string | null;
  setting: string | null;
  fresh_because: string | null;
  comps: Comp[];
  critic: JsonMap | null;
  scout_brief: JsonMap | null;
  concept_row: JsonMap | null;
  story_plan: JsonMap | null;
  continuity: JsonMap | null;
  chapters: ChapterDraft[];
  quality_report: JsonMap | null;
  metadata_pkg: JsonMap | null;
  production_pack: JsonMap | null;
  tap_notes: string | null;
  created_at: string;
  updated_at: string;
};

export type AgentRun = {
  id: string;
  concept_id: string | null;
  agent_name: string;
  milestone: string;
  status: string;
  output: JsonMap | null;
  error: string | null;
  duration_ms: number | null;
  created_at: string;
};

export type HouseEvent = {
  id: string;
  concept_id: string | null;
  message: string;
  created_at: string;
};

export type AgentDef = {
  id: string;
  name: string;
  milestone: "M1" | "M2" | "M3" | "M4" | "M5";
  role: string;
  temperature: number;
  maxTokens: number;
  system: string;
};
