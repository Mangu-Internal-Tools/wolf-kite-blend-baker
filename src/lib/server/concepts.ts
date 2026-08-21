import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import { mapConcept, mapEvent, mapRun } from "./db-map";
import { ensureSeed } from "./seed";
import type { Concept, Json } from "@/lib/types";
import type { Status } from "@/lib/status";

export const listConcepts = createServerFn({ method: "GET" }).handler(async () => {
  await ensureSeed();
  const sql = await getSql();
  const rows = await sql.query<Record<string, unknown>>(
    "select * from concepts order by updated_at desc",
  );
  return rows.map(mapConcept);
});

export const getConcept = createServerFn({ method: "GET" })
  .validator((input: { id: string }) => input)
  .handler(async ({ data }) => {
    await ensureSeed();
    const sql = await getSql();
    const rows = await sql.query<Record<string, unknown>>(
      "select * from concepts where id = $1",
      [data.id],
    );
    return rows[0] ? mapConcept(rows[0]) : null;
  });

export const listEvents = createServerFn({ method: "GET" }).handler(async () => {
  await ensureSeed();
  const sql = await getSql();
  const rows = await sql.query<Record<string, unknown>>(
    "select * from events order by created_at desc limit 24",
  );
  return rows.map(mapEvent);
});

export const listRuns = createServerFn({ method: "GET" })
  .validator((input: { conceptId?: string } = {}) => input)
  .handler(async ({ data }) => {
    const sql = await getSql();
    const rows = data.conceptId
      ? await sql.query<Record<string, unknown>>(
          "select * from agent_runs where concept_id = $1 order by created_at desc limit 40",
          [data.conceptId],
        )
      : await sql.query<Record<string, unknown>>(
          "select * from agent_runs order by created_at desc limit 40",
        );
    return rows.map(mapRun);
  });

export const addEvent = createServerFn({ method: "POST" })
  .validator((input: { conceptId?: string; message: string }) => input)
  .handler(async ({ data }) => {
    const sql = await getSql();
    const id = crypto.randomUUID();
    await sql.query(
      "insert into events (id, concept_id, message) values ($1,$2,$3)",
      [id, data.conceptId ?? null, data.message],
    );
    return { id };
  });

export const logRun = createServerFn({ method: "POST" })
  .validator(
    (input: {
      conceptId?: string;
      agentName: string;
      milestone: string;
      status: string;
      output?: Json | null;
      error?: string | null;
      durationMs?: number;
    }) => input,
  )
  .handler(async ({ data }) => {
    const sql = await getSql();
    const id = crypto.randomUUID();
    await sql.query(
      `insert into agent_runs (id, concept_id, agent_name, milestone, status, output, error, duration_ms)
       values ($1,$2,$3,$4,$5,$6::jsonb,$7,$8)`,
      [
        id,
        data.conceptId ?? null,
        data.agentName,
        data.milestone,
        data.status,
        JSON.stringify(data.output ?? null),
        data.error ?? null,
        data.durationMs ?? null,
      ],
    );
    return { id };
  });

export type ConceptPatch = Partial<
  Omit<Concept, "id" | "created_at" | "updated_at">
> & { status?: Status };

export const updateConcept = createServerFn({ method: "POST" })
  .validator((input: { id: string; patch: ConceptPatch }) => input)
  .handler(async ({ data }) => {
    const sql = await getSql();
    const p = data.patch;
    const fields: string[] = [];
    const values: unknown[] = [];
    let i = 1;
    const jsonCols = new Set([
      "comps",
      "critic",
      "scout_brief",
      "concept_row",
      "story_plan",
      "continuity",
      "chapters",
      "quality_report",
      "metadata_pkg",
      "production_pack",
    ]);
    for (const [key, value] of Object.entries(p)) {
      if (value === undefined) continue;
      if (jsonCols.has(key)) {
        fields.push(`${key} = $${i}::jsonb`);
        values.push(JSON.stringify(value));
      } else {
        fields.push(`${key} = $${i}`);
        values.push(value);
      }
      i += 1;
    }
    fields.push("updated_at = now()");
    values.push(data.id);
    await sql.query(
      `update concepts set ${fields.join(", ")} where id = $${i}`,
      values,
    );
    const rows = await sql.query<Record<string, unknown>>(
      "select * from concepts where id = $1",
      [data.id],
    );
    return rows[0] ? mapConcept(rows[0]) : null;
  });

export const insertConcepts = createServerFn({ method: "POST" })
  .validator(
    (input: {
      items: Array<{
        working_title: string;
        logline: string;
        genre: string;
        source_tab: string;
        status: Status;
        confidence?: string;
        protagonist_sketch?: string;
        setting?: string;
        fresh_because?: string;
        comps?: Json;
        critic?: Json;
        scout_brief?: Json;
      }>;
    }) => input,
  )
  .handler(async ({ data }) => {
    const sql = await getSql();
    const created: string[] = [];
    for (const item of data.items) {
      const id = `c_${crypto.randomUUID().slice(0, 8)}`;
      await sql.query(
        `insert into concepts (
          id, working_title, logline, genre, source_tab, status, confidence,
          protagonist_sketch, setting, fresh_because, comps, critic, scout_brief
        ) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11::jsonb,$12::jsonb,$13::jsonb)`,
        [
          id,
          item.working_title,
          item.logline,
          item.genre,
          item.source_tab,
          item.status,
          item.confidence ?? null,
          item.protagonist_sketch ?? null,
          item.setting ?? null,
          item.fresh_because ?? null,
          JSON.stringify(item.comps ?? []),
          JSON.stringify(item.critic ?? null),
          JSON.stringify(item.scout_brief ?? null),
        ],
      );
      created.push(id);
    }
    return { ids: created };
  });
