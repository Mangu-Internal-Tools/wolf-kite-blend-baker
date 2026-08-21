create table if not exists concepts (
  id text primary key,
  working_title text not null,
  subtitle text,
  logline text not null default '',
  genre text not null default '',
  source_tab text not null default 'Popular',
  status text not null default 'BANKED',
  confidence text,
  protagonist_sketch text,
  setting text,
  fresh_because text,
  comps jsonb not null default '[]',
  critic jsonb,
  scout_brief jsonb,
  concept_row jsonb,
  story_plan jsonb,
  continuity jsonb,
  chapters jsonb not null default '[]',
  quality_report jsonb,
  metadata_pkg jsonb,
  production_pack jsonb,
  tap_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists concepts_status_idx on concepts (status);
create index if not exists concepts_updated_idx on concepts (updated_at desc);

create table if not exists agent_runs (
  id text primary key,
  concept_id text,
  agent_name text not null,
  milestone text not null,
  status text not null,
  output jsonb,
  error text,
  duration_ms integer,
  created_at timestamptz not null default now()
);

create index if not exists agent_runs_concept_idx on agent_runs (concept_id, created_at desc);

create table if not exists events (
  id text primary key,
  concept_id text,
  message text not null,
  created_at timestamptz not null default now()
);

create index if not exists events_created_idx on events (created_at desc);
