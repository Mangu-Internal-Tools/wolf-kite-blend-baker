import { t as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-A6pJPYTF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/concepts-nSSTh6L_.js
var _0002_mangu_default = "create table if not exists concepts (\n  id text primary key,\n  working_title text not null,\n  subtitle text,\n  logline text not null default '',\n  genre text not null default '',\n  source_tab text not null default 'Popular',\n  status text not null default 'BANKED',\n  confidence text,\n  protagonist_sketch text,\n  setting text,\n  fresh_because text,\n  comps jsonb not null default '[]',\n  critic jsonb,\n  scout_brief jsonb,\n  concept_row jsonb,\n  story_plan jsonb,\n  continuity jsonb,\n  chapters jsonb not null default '[]',\n  quality_report jsonb,\n  metadata_pkg jsonb,\n  production_pack jsonb,\n  tap_notes text,\n  created_at timestamptz not null default now(),\n  updated_at timestamptz not null default now()\n);\n\ncreate index if not exists concepts_status_idx on concepts (status);\ncreate index if not exists concepts_updated_idx on concepts (updated_at desc);\n\ncreate table if not exists agent_runs (\n  id text primary key,\n  concept_id text,\n  agent_name text not null,\n  milestone text not null,\n  status text not null,\n  output jsonb,\n  error text,\n  duration_ms integer,\n  created_at timestamptz not null default now()\n);\n\ncreate index if not exists agent_runs_concept_idx on agent_runs (concept_id, created_at desc);\n\ncreate table if not exists events (\n  id text primary key,\n  concept_id text,\n  message text not null,\n  created_at timestamptz not null default now()\n);\n\ncreate index if not exists events_created_idx on events (created_at desc);\n";
/**
* Migration bookkeeping shared by the two appliers — `scripts/migrate.mjs`
* (deploy, `readdir`) and `src/lib/db.ts` (PGLite preview, `import.meta.glob`).
*
* Applied files are keyed by BASENAME, so the same file applies once no matter
* which directory it is globbed from. That is what makes the auth schema safe to
* copy from `migrations/auth/` into `migrations/` when an app turns sign-in on:
* a database that already has `0001_auth.sql` will not re-run it.
*
* Neither applier descends into subdirectories, so `migrations/auth/*.sql` is
* out of scope for both until it is copied up.
*/
/**
* The `_migrations` key for a migration path (or bare filename).
* @param {string} path
* @returns {string}
*/
function migrationName(path) {
	return path.split("/").pop() ?? path;
}
/**
* @param {string} path
* @returns {boolean}
*/
function isMigrationFile(path) {
	return path.endsWith(".sql");
}
/**
* Migrations in `paths` that are not yet in `applied`, in apply order.
* Non-`.sql` entries (a `readdir` also yields `migrations/auth/`) are dropped.
* @param {Iterable<string>} paths
* @param {Iterable<string>} applied
* @returns {Array<{ name: string, path: string }>}
*/
function pendingMigrations(paths, applied) {
	const done = new Set(applied);
	return [...paths].filter(isMigrationFile).map((path) => ({
		name: migrationName(path),
		path
	})).sort((a, b) => a.name.localeCompare(b.name)).filter(({ name }) => !done.has(name));
}
var rawDatabaseUrl = typeof process !== "undefined" ? process.env.DATABASE_URL : void 0;
var databaseUrl = rawDatabaseUrl && rawDatabaseUrl.trim() ? rawDatabaseUrl : void 0;
/**
* Active backend: real **Neon** when `DATABASE_URL` is set (deployed / configured
* sandbox), otherwise a local embedded **PGLite** (Postgres compiled to WASM) so
* the app has a working database even with nothing configured — the live preview
* included. Swap in Neon later by just setting `DATABASE_URL`; no code changes.
*/
var dbSource = databaseUrl ? "neon" : "pglite";
/**
* Init state lives on globalThis as promises: dev HMR creates new instances of
* this module, and two instances racing module-level state would open a second
* pool or run two concurrent PGLite migration passes (whose duplicate
* `_migrations` insert rejects — and would get memoized, poisoning every later
* `getSql()`). A failed init clears its slot so the next call retries.
*/
var globalRef = globalThis;
/**
* Result-type parity: Postgres sends every value as text plus a type OID — the
* JS value is the DRIVER's parsing choice, and pg and PGLite disagree (pg:
* int8 -> string, date -> local-midnight Date; PGLite: int8 -> BigInt, which
* JSON.stringify rejects, date -> UTC Date). Normalize both so preview and
* production return identical, JSON-safe shapes:
*   int8/bigint (incl. count(*)) -> number (past 2^53 loses precision — cast
*                                   `::text` if you ever need huge integers)
*   date                         -> 'YYYY-MM-DD' string
*   interval                     -> Postgres interval text
* numeric already comes back as a string on both (arbitrary precision).
*/
var OID_INT8 = 20;
var OID_DATE = 1082;
var OID_INTERVAL = 1186;
var identity = (v) => v;
/** Wrap a query runner in the tagged-template + `.query()` `Sql` surface. */
function toSql(run) {
	const sql = (async (strings, ...values) => {
		let text = strings[0];
		for (let i = 0; i < values.length; i += 1) text += `$${i + 1}${strings[i + 1]}`;
		return run(text, values);
	});
	sql.query = (text, params = []) => run(text, params);
	return sql;
}
function createNeonSql() {
	globalRef.__pgSqlPromise__ ??= (async () => {
		const { Pool, types } = await import("../_libs/pg.mjs").then((n) => n.t);
		types.setTypeParser(OID_INT8, Number);
		types.setTypeParser(OID_DATE, identity);
		types.setTypeParser(OID_INTERVAL, identity);
		const pool = new Pool({ connectionString: databaseUrl });
		return toSql(async (text, params) => {
			return (await pool.query(text, params)).rows;
		});
	})().catch((err) => {
		globalRef.__pgSqlPromise__ = void 0;
		throw err;
	});
	return globalRef.__pgSqlPromise__;
}
async function createPgliteSql() {
	globalRef.__pgliteInstance__ ??= (async () => {
		const { PGlite } = await import("../_libs/electric-sql__pglite.mjs").then((n) => n.t);
		const pg = new PGlite({ parsers: {
			[OID_INT8]: Number,
			[OID_DATE]: identity,
			[OID_INTERVAL]: identity
		} });
		await pg.waitReady;
		await pg.exec("create table if not exists _migrations (name text primary key, applied_at timestamptz not null default now())");
		return pg;
	})().catch((err) => {
		globalRef.__pgliteInstance__ = void 0;
		throw err;
	});
	const pg = await globalRef.__pgliteInstance__;
	const migrate = async () => {
		const migrations = /* #__PURE__ */ Object.assign({ "/migrations/0002_mangu.sql": _0002_mangu_default });
		const done = (await pg.query("select name from _migrations")).rows.map((r) => r.name);
		for (const { name, path } of pendingMigrations(Object.keys(migrations), done)) await pg.transaction(async (tx) => {
			await tx.exec(migrations[path]);
			await tx.query("insert into _migrations (name) values ($1)", [name]);
		});
	};
	const pass = (globalRef.__pgliteMigrateChain__ ?? Promise.resolve()).catch(() => void 0).then(migrate);
	globalRef.__pgliteMigrateChain__ = pass;
	await pass;
	return toSql(async (text, params) => {
		return (await pg.query(text, params)).rows;
	});
}
var sqlPromise = null;
async function createSql() {
	if (typeof window !== "undefined") throw new Error("@/lib/db is server-only — call getSql() from a createServerFn handler or a server route loader, never from client code.");
	return dbSource === "neon" ? createNeonSql() : createPgliteSql();
}
/**
* Get the shared, **server-only** SQL client. Neon when `DATABASE_URL` is set,
* otherwise the local PGLite fallback. Memoized — safe to call per request.
*
* Schema comes from `migrations/*.sql`, auto-applied before the first query on
* both backends — define tables there, never inline in server functions.
*/
function getSql() {
	sqlPromise ??= createSql().catch((err) => {
		sqlPromise = null;
		throw err;
	});
	return sqlPromise;
}
/**
* Finish DB bootstrap before the server handles traffic.
*
* - **PGLite** (preview / no `DATABASE_URL`): open the in-memory DB and apply
*   `migrations/*.sql`. Idempotent — concurrent callers share one promise.
* - **Neon**: no-op (pool is created lazily on first query).
*
* Vite `configureServer` awaits this at dev startup; production imports of this
* module kick it off immediately (see bottom of file).
*/
function ensureDbReady() {
	if (dbSource !== "pglite") return Promise.resolve();
	return getSql().then(() => void 0);
}
var globalBoot = globalThis;
if (typeof window === "undefined" && dbSource === "pglite") globalBoot.__pgBootstrapPromise__ ??= ensureDbReady().catch((err) => {
	globalBoot.__pgBootstrapPromise__ = void 0;
	console.error("[db] PGLite bootstrap failed:", err);
	throw err;
});
function asObject(value) {
	if (value == null) return null;
	if (typeof value === "string") try {
		const parsed = JSON.parse(value);
		if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) return parsed;
		return null;
	} catch {
		return null;
	}
	if (typeof value === "object" && !Array.isArray(value)) return value;
	return null;
}
function asArray(value, fallback = []) {
	if (!value) return fallback;
	if (typeof value === "string") try {
		const parsed = JSON.parse(value);
		return Array.isArray(parsed) ? parsed : fallback;
	} catch {
		return fallback;
	}
	return Array.isArray(value) ? value : fallback;
}
function mapConcept(row) {
	return {
		id: String(row.id),
		working_title: String(row.working_title),
		subtitle: row.subtitle ? String(row.subtitle) : null,
		logline: String(row.logline ?? ""),
		genre: String(row.genre ?? ""),
		source_tab: String(row.source_tab ?? "Popular"),
		status: String(row.status),
		confidence: row.confidence ? String(row.confidence) : null,
		protagonist_sketch: row.protagonist_sketch ? String(row.protagonist_sketch) : null,
		setting: row.setting ? String(row.setting) : null,
		fresh_because: row.fresh_because ? String(row.fresh_because) : null,
		comps: asArray(row.comps),
		critic: asObject(row.critic),
		scout_brief: asObject(row.scout_brief),
		concept_row: asObject(row.concept_row),
		story_plan: asObject(row.story_plan),
		continuity: asObject(row.continuity),
		chapters: asArray(row.chapters),
		quality_report: asObject(row.quality_report),
		metadata_pkg: asObject(row.metadata_pkg),
		production_pack: asObject(row.production_pack),
		tap_notes: row.tap_notes ? String(row.tap_notes) : null,
		created_at: String(row.created_at),
		updated_at: String(row.updated_at)
	};
}
function mapRun(row) {
	return {
		id: String(row.id),
		concept_id: row.concept_id ? String(row.concept_id) : null,
		agent_name: String(row.agent_name),
		milestone: String(row.milestone),
		status: String(row.status),
		output: asObject(row.output),
		error: row.error ? String(row.error) : null,
		duration_ms: typeof row.duration_ms === "number" ? row.duration_ms : null,
		created_at: String(row.created_at)
	};
}
function mapEvent(row) {
	return {
		id: String(row.id),
		concept_id: row.concept_id ? String(row.concept_id) : null,
		message: String(row.message),
		created_at: String(row.created_at)
	};
}
var SEED = [
	{
		id: "c_tide",
		working_title: "The Tide Clock",
		subtitle: "A novella of the Ironbound",
		logline: "A shopkeeper in a drowning Newark keeps an unsanctioned tide clock that begins to forecast more than water — and the city wants it silenced.",
		genre: "Climate fiction",
		source_tab: "Popular",
		status: "PUBLISHED",
		confidence: "high",
		protagonist_sketch: "Mira Patel, 38, precise, refuses higher ground; contradiction: she sells forecasts while refusing to leave the floodplain.",
		setting: "Ironbound, Newark, New Jersey — the decade after the second surge",
		fresh_because: "Climate fiction told as a shop ledger, not a disaster movie; the instrument is local, analog, and morally stubborn.",
		comps: [{
			title: "The Ministry for the Future",
			author: "Kim Stanley Robinson"
		}],
		concept_row: {
			working_title: "The Tide Clock",
			subgenre: "Climate noir",
			hook_line: "The official clock is lying. Hers is not allowed to exist.",
			logline: "A shopkeeper in a drowning Newark keeps an unsanctioned tide clock that begins to forecast more than water.",
			protagonist: "Mira Patel, 38, shopkeeper",
			pov_tense: "Third person limited, past",
			audience: "Adult literary / climate fiction readers",
			age_category: "Adult",
			word_target: 8200,
			heat_level: "None",
			mood_tone: "Quiet, brackish, stubbornly tender",
			bisac_heading: "FIC037000 / Political",
			cover_direction: "Brass clock face half-submerged, Ironbound street at dusk, no people.",
			format_priority: "ebook, paperback, audio",
			tagline: "The water is on time. The city is not."
		},
		story_plan: {
			structure: "Three-act ledger",
			chapter_target: 3,
			central_question: "Will Mira abandon the shop, or make the unofficial record the city's only honest clock?",
			ending_type: "Earned remaining"
		},
		chapters: [
			{
				chapter_number: 1,
				chapter_title: "The Hour the Bay Came In",
				word_count: 412,
				prose: `Mira Patel kept the tide clock in the shop window because people still wanted to know when the water would lie. It was a brass-faced thing, older than the surge maps, older than the federal buyout that never quite arrived in Ironbound. At 4:11 a.m. it clicked one minute past the printed high, and Mira, who slept on a cot behind the counter, sat up as if someone had said her name.\n\nThe street was a black sheet. Not rain. Not the old Passaic smell. A quiet, sliding dark that took the bottom step of St. Stephen's and kept going.\n\nShe put on her father's rubber boots and waded to the door. The bell did not ring. Water had already lifted it off the strike plate. Across the street, Mr. Alvarez's grocery lights were on, and he was stacking canned milk on the butcher block as if height were a theology.\n\n"It's early," he called.\n\n"It's honest," she said.\n\nThe clock behind her clicked again. Two minutes past. Mira wrote the deviation in the ledger she was not supposed to keep — the one the city called anecdotal and the insurers called fraudulent and the old women on Ferry Street called the only news that mattered. She wrote: water at the lintel. She wrote: Alvarez stacking. She wrote: I am still here.\n\nBy dawn the bay had taken the bus shelter and left a heron on the roof of a Camry. Mira opened anyway. People came in wet to the knee and bought batteries, salt, and the last of the mango candy because sweetness, too, was a kind of forecast.`
			},
			{
				chapter_number: 2,
				chapter_title: "A Ledger of Minutes",
				word_count: 398,
				prose: `The man from the hydrology office arrived in a canoe that had been a billboard. He wore a city lanyard and a look of someone who had learned to apologize with data.\n\n"You're the one filing the unapproved deviations," he said.\n\nMira did not offer him a chair. The chairs were on the counter. "I'm the one whose floor is a river."\n\nHe opened a tablet that still believed in maps. "The official clock is the battery at Kearny. Your instrument is decorative."\n\n"My instrument," she said, "has never missed a funeral."\n\nHe looked at the brass face. It was two minutes fast again, or the world was two minutes slow. He photographed it like a crime. "If I put you in the model, the model breaks."\n\n"Then the model is the thing that's lying."\n\nHe stayed until the afternoon high. He watched the water climb the same mark her ledger had predicted, not the city's. He did not write that down. He asked, instead, if she had family on higher ground.\n\n"I have a sister in Belleville who thinks I should sell candles online," Mira said. "I have a clock."\n\nWhen he left, the canoe took a can of mango candy as if it were a bribe. Mira added a line: man with lanyard, believes in Kearny. She underlined believes. Belief, she had learned, was the first thing the water ate.`
			},
			{
				chapter_number: 3,
				chapter_title: "What the Water Keeps",
				word_count: 421,
				prose: `On the third night the clock stopped being two minutes fast and became a voice. Not a metaphor. A dry click, then a woman's breath, then coordinates Mira recognized as the lot where the old Portuguese bakery had been, the one that sold bread in paper that always tore.\n\nShe went because the ledger had a blank line and she did not permit blank lines.\n\nThe lot was a bowl of black water and a roof peak like a shark. Something pale moved under the peak. Not a body. A box. She hooked it with a boat hook that had been a mop. Inside: baptism records, 1962 to 1988, the ink running but the names still arguing for themselves.\n\nAlvarez found her there. He had a flashlight strapped to his hat like a miner. "You can't save the parish," he said.\n\n"I'm not," she said. "I'm timestamping it."\n\nThey hauled the box to the shop and laid the pages on the butcher paper he had donated, which was to say abandoned. Names bloomed. A whole street of them. Mira copied the ones the water had not yet claimed into the back of the tide ledger, because a ledger that only counted minutes was a kind of cowardice.\n\nAt 4:11 the clock clicked, on time, as if it had been waiting for her to finish. The hydrology man would later call this coincidence. The old women on Ferry Street would call it the shop staying open. Mira called it the work. She dried the names. She sold salt. She kept the door unlatched, even when the bay asked otherwise.`
			}
		],
		continuity: {
			characters_introduced: [
				"Mira Patel",
				"Mr. Alvarez",
				"hydrology man"
			],
			locations: [
				"Ironbound shop",
				"Ferry Street",
				"bakery lot"
			],
			objects: [
				"tide clock",
				"ledger",
				"baptism records"
			]
		},
		quality_report: {
			manuscript_pass: true,
			total_words: 1231,
			verdict: "Signed and shipped. Beats covered. Central question resolved by remaining."
		},
		metadata_pkg: {
			title: "The Tide Clock",
			author_name: "Mangu Publishers",
			bisac_primary: "FIC037000",
			amazon_keywords: [
				"climate fiction",
				"Newark novel",
				"literary novella",
				"flood story",
				"shopkeeper heroine",
				"climate noir",
				"New Jersey fiction"
			],
			back_cover_blurb: "In the Ironbound, the bay no longer waits for the maps. Mira Patel keeps a brass tide clock the city calls decorative and the old women call the only news that matters. When the clock begins to run fast — then to speak in coordinates — Mira has to decide whether an honest record is worth a shop the water already owns. A novella about ledgers, neighbors, and the minutes a city refuses to count.",
			price_ebook: "$4.99",
			price_paperback: "$12.00",
			distribution_channels: [
				"KDP",
				"IngramSpark",
				"Draft2Digital"
			],
			cover_brief: "Brass clock half in black water, cream type, Ironbound brick, no figures. Quiet, not apocalyptic."
		},
		production_pack: {
			front_matter: {
				title_page: "The Tide Clock",
				copyright_page: "© 2026 Mangu Publishers. All rights reserved.",
				dedication: "For the shops that opened anyway."
			},
			audiobook_brief: {
				narrator: "Low, unhurried alto; slight Mid-Atlantic; never performative grief.",
				pronunciation: ["Passaic: puh-SAYK", "Ironbound: as two words, stress on Iron"]
			},
			distribution_checklist: [
				"KDP: EPUB + 2560×1600 cover",
				"IngramSpark: PDF interior, 5×8 trim",
				"D2D: EPUB, metadata JSON",
				"ACX: 192k mp3, retail audio"
			]
		}
	},
	{
		id: "c_letters",
		working_title: "Index of Unsent Letters",
		logline: "A junior archivist at a decaying municipal library discovers an index of letters that were never mailed — each one altering a living person's legal identity.",
		genre: "Dark academia",
		source_tab: "Popular",
		status: "LOCKED",
		confidence: "high",
		protagonist_sketch: "Jonah Reeve, 29, meticulous, allergic to confrontation; contradiction: he forges a catalog card to hide a truth he cannot stop reading.",
		setting: "Trenton municipal annex, present day, winter",
		fresh_because: "Dark academia without a campus — bureaucracy as the secret society; the occult is filing practice.",
		comps: [{
			title: "The Library of the Unwritten",
			author: "A. J. Hackwith"
		}],
		concept_row: {
			working_title: "Index of Unsent Letters",
			subgenre: "Bureaucratic dark academia",
			hook_line: "The unsent are still addressed.",
			protagonist: "Jonah Reeve, 29, junior archivist",
			antagonist: "The Index itself — and Deputy Clerk Voss, who needs it to stay lost",
			pov_tense: "First person, past",
			mood_tone: "Dust, fluorescent dread, dry wit",
			heat_level: "None",
			audience: "Adult",
			age_category: "Adult",
			word_target: 9e3,
			central_conflict: "Jonah must decide whether to mail one letter that would erase his own appointment.",
			cover_direction: "Card catalog drawer half-open, a single envelope glowing faintly, winter light.",
			tagline: "Some records are kinder unsent."
		},
		story_plan: {
			working_title: "Index of Unsent Letters",
			structure: "Three-act mystery",
			act_count: 3,
			chapter_target: 8,
			central_question: "Who is still writing the unsent letters — and what happens if Jonah files them?",
			opening_state: "Jonah is the last person who still cards by hand.",
			midpoint_shift: "He finds a letter addressed to himself, dated tomorrow.",
			climax_shape: "He mails one letter and burns the index card of another.",
			ending_type: "Bittersweet remaining",
			ending_emotion: "Quiet complicity",
			antagonist_model: "Institution as predator",
			subplot_threads: ["Voss's missing sister", "the annex boiler"],
			tonal_arc: "Dusty competence → moral nausea → chosen small courage",
			beats: [{
				beat_number: 1,
				description: "Jonah finds a drawer labeled UNMAILED.",
				state_delta: "The annex has a secret series."
			}, {
				beat_number: 2,
				description: "A letter changes a living woman's surname in the city database overnight.",
				state_delta: "The index is operational, not historical."
			}],
			chapters: [{
				chapter_number: 1,
				chapter_title: "Drawer 0",
				beats_included: [1, 2],
				word_target: 1100,
				purpose: "Install the annex and the first impossibility.",
				hook_close: "The letter is addressed in his own handwriting."
			}, {
				chapter_number: 2,
				chapter_title: "Voss",
				beats_included: [3],
				word_target: 1e3,
				purpose: "Introduce the clerk who needs the index lost.",
				hook_close: "Voss knows Jonah opened Drawer 0."
			}]
		}
	},
	{
		id: "c_stars",
		working_title: "A Mouthful of Stars",
		logline: "A spice-stall heir in Jackson Heights inherits a cracked celadon bowl that buys and sells what the night market misplaces — voices, hours, names.",
		genre: "Magical realism",
		source_tab: "International",
		status: "DRAFTING",
		confidence: "high",
		protagonist_sketch: "Leila Hassan, 26, practical, night-owl; contradiction: she prices miracles like cumin.",
		setting: "Jackson Heights night market, present",
		fresh_because: "Immigrant magical realism in a working stall, not a mythic village; the magic has a second shift and a lease.",
		comps: [{
			title: "The Particular Sadness of Lemon Cake",
			author: "Aimee Bender"
		}],
		concept_row: {
			working_title: "A Mouthful of Stars",
			subgenre: "Urban magical realism",
			protagonist: "Leila Hassan, 26",
			pov_tense: "Third person limited, past",
			mood_tone: "Spice, neon, tender uncanny",
			heat_level: "Low",
			audience: "Adult",
			age_category: "Adult",
			word_target: 7200,
			tagline: "The stall stays open after the fruit is gone."
		},
		story_plan: {
			structure: "Inheritance novella",
			chapter_target: 3,
			central_question: "Will Leila sell the bowl and close the second shift, or become the market's night clerk?"
		},
		chapters: [
			{
				chapter_number: 1,
				chapter_title: "The Night Market Opens Inward",
				word_count: 360,
				prose: `Leila Hassan inherited the stall the way other people inherit debt: overnight, with a key that still smelled like her aunt's rose oil, and a rule written on the underside of the cash box. Do not sell the bowl. The bowl was cracked celadon, big enough for a winter melon, ugly in the way holy things often are.\n\nThe night market in Jackson Heights did not close so much as change its mind. After midnight the fruit sellers left and the other sellers arrived — the ones who dealt in names, in lost hours, in the particular grief of a language you almost remembered. Leila had worked days at the stall since she was fourteen. She had never been told there was a second shift.\n\nAunt Noor was dead three days. The funeral had been efficient. The key was not.\n\nAt 12:07 a man with a cricket club bag asked for star anise and, when she turned, asked for his brother's voice back. Leila said she sold spices. He put two hundred dollars on the saffron and did not pick up the anise. The bowl, on the high shelf, made a sound like a fingernail on porcelain.\n\nShe did not sell it. She sold him a story her aunt used to tell about a train from Lahore that arrived with extra passengers who paid in mangoes. He left lighter. The bowl was heavier. Leila wrote that down on a paper bag, which is how ledgers start when you are not yet ready to admit you are keeping one.`
			},
			{
				chapter_number: 2,
				chapter_title: "Celadon",
				word_count: 344,
				prose: `The second-shift customers had manners and terrible timing. A girl wanted last year's July. A cook wanted the smell of a kitchen that had been demolished for a pharmacy. A priest wanted to forget a confession he was not allowed to forget. Leila learned the prices by watching the bowl. When the crack brightened, the price was too low. When it dimmed, she had been cruel.\n\nShe called her cousin in Queens who worked at a lab and believed in molecules. "It's grief," he said. "You're sleeping at the stall. Come over."\n\nShe did not. She slept under the counter with the rose oil and a knife that had only ever cut turmeric. In the morning the stall was ordinary: chili, cumin, the radio on a Bengali station, Mrs. Chen arguing about fennel. Noor had run both worlds without explaining the hinge.\n\nOn the fourth night a woman in a hospital badge asked to buy the bowl. She knew the rule. She named a number that would have paid the lease for a year. "Your aunt sat in my ward," she said. "She told me the bowl was a mouth. She told me it was tired."\n\nLeila looked at the crack. It looked like a river seen from a plane. "If I sell it," she said, "what happens to the second shift?"\n\nThe woman smiled with professional sadness. "Then the market closes inward on someone else. That is not your problem unless you make it one."\n\nLeila did not sell. She lowered the bowl to the counter. It was warm. It was waiting to be a decision.`
			},
			{
				chapter_number: 3,
				chapter_title: "What She Kept",
				word_count: 352,
				prose: `The man with the cricket bag came back without the bag. He said his brother had spoken in a dream and asked for cardamom, which was either a miracle or a grocery list. Leila sold him cardamom at the day price. The bowl approved, which was new.\n\nShe began to understand the inheritance. Not the magic. The hours. Aunt Noor had not been a sorceress. She had been a woman who stayed after midnight because someone had to count what the city misplaced.\n\nLeila wrote a new rule under the old one. Do not sell the bowl. Do not pretend it is only a bowl. Do not go home before the last customer has a place to put what they carried in.\n\nOn Friday she opened the stall at the ordinary hour and told Mrs. Chen the fennel was cheaper if she came back after twelve. Mrs. Chen looked at her as if she had grown a second head, then nodded, because Jackson Heights has always known there are two economies.\n\nThe hospital woman did not return. The cousin texted a link about sleep hygiene. The bowl sat on the counter in daylight, ugly, cracked, public. A child asked if it was for punch. Leila said it was for keeping. The child, who understood keeping, put a bottle cap in it and ran. The cap remained. Some offerings are small on purpose.\n\nAt 12:07 the market changed its mind. Leila turned on the second light, the one Noor had hidden behind the chili strings, and waited for the city to remember her.`
			}
		],
		continuity: {
			characters_introduced: [
				"Leila Hassan",
				"Aunt Noor",
				"cricket-bag man",
				"hospital woman",
				"Mrs. Chen"
			],
			objects: [
				"celadon bowl",
				"cash-box rule",
				"rose oil"
			],
			open_threads: []
		},
		quality_report: {
			manuscript_pass: true,
			total_words: 1056,
			beats_covered: 18,
			beats_total: 18,
			central_question_resolved: true,
			blocking_issues: [],
			verdict: "Ready for TAP 3. Inheritance chosen; second shift remains open."
		}
	},
	{
		id: "c_orchard",
		working_title: "The Glass Orchard",
		logline: "A disgraced botanist is hired to tend a private orchard whose fruit only ripens when someone nearby tells the truth — and the estate's heiress has not spoken honestly in twelve years.",
		genre: "Romantasy",
		source_tab: "Popular",
		status: "TOP10",
		confidence: "high",
		protagonist_sketch: "Sera Quinn, 34, blunt, dirt under the nails; contradiction: she left science for silence and is paid to make things confess.",
		setting: "Hudson Valley glasshouse estate, late autumn, lightly enchanted present",
		fresh_because: "Romantasy with no court and no chosen one — the magic is horticultural and socially awkward.",
		critic: {
			total: 42,
			strength: "High-concept with a human-scale engine; title is ownable.",
			risk: "Could tilt twee if the heiress is only icy."
		}
	},
	{
		id: "c_recife",
		working_title: "Night Bus to Recife",
		logline: "A São Paulo dispatcher who can hear unfinished conversations on empty night buses rides the last route south to find the passenger whose voice has been looping for nine years.",
		genre: "São Paulo night fiction",
		source_tab: "International",
		status: "TOP10",
		confidence: "medium",
		protagonist_sketch: "Rafael Costa, 41, insomniac, kind; contradiction: he is paid to keep buses empty of trouble and is about to fill one with it.",
		setting: "São Paulo to Recife by night bus, present",
		fresh_because: "City-night fiction that treats the interstate as a haunted house, without ghosts as special effects.",
		critic: {
			total: 40,
			strength: "Voice-forward, geographically specific, commercially unusual in English.",
			risk: "Travelogue drift if the looping voice isn't given a body soon."
		}
	},
	{
		id: "c_capes",
		working_title: "Capes Without Cities",
		logline: "Retired sidekicks in a flyover town run a hardware store and try not to notice that the new big-box chain is staffed entirely by their old villains, now on pensions.",
		genre: "Superhero deconstruction",
		source_tab: "Comics",
		status: "TOP10",
		confidence: "high",
		protagonist_sketch: "Dee 'Latch' Moreno, 52, former gadget sidekick, bad knees; contradiction: she misses the work and will not say so.",
		setting: "Fictional Millfield, Ohio, present, graphic-novel prose (comics-native)",
		fresh_because: "Deconstruction without cynicism — the joke is pensions, not moral collapse.",
		critic: {
			total: 41,
			strength: "Immediately filmable, friendly to graphic adaptation, rare warmth in the subgenre.",
			risk: "Could become sitcom if the villains are only quirky."
		}
	},
	{
		id: "c_auction",
		working_title: "The Quiet Auction",
		logline: "An estate-sale appraiser in Berlin, New Jersey realizes the objects she prices are bidding on her memories instead of the other way around.",
		genre: "Psychological fiction",
		source_tab: "LCGFT",
		status: "BANKED",
		confidence: "medium",
		protagonist_sketch: "Helen Rao, 57, dry, formerly a violinist.",
		setting: "Berlin, NJ and Philadelphia auction houses, present",
		fresh_because: "Object-horror as appraisal practice, suburban not gothic-castle."
	},
	{
		id: "c_monsoon",
		working_title: "The Monsoon Archive",
		logline: "A Mumbai radio archivist must recover a week of monsoon broadcasts that never aired — because the weather in those tapes is still arriving.",
		genre: "Science fiction",
		source_tab: "LCGFT",
		status: "BANKED",
		confidence: "medium",
		protagonist_sketch: "Arjun Mehta, 33, collector of dead air.",
		setting: "Mumbai, 1998 and 2026 braided",
		fresh_because: "Time-weather as media archaeology, not time travel tourism."
	},
	{
		id: "c_kitchen",
		working_title: "Kitchen Ghosts",
		logline: "A line cook in a Newark diner starts plating dishes her dead grandmother used to make — dishes that compel whoever eats them to tell a withheld apology.",
		genre: "Domestic fiction",
		source_tab: "LCGFT",
		status: "IN_PRODUCTION",
		confidence: "high",
		protagonist_sketch: "Priya Shah, 31, fastest hands on the night grill.",
		setting: "Newark diner, one winter",
		fresh_because: "Ghost story as service-industry realism; the haunt is a recipe, not a house.",
		concept_row: {
			working_title: "Kitchen Ghosts",
			pov_tense: "First person present",
			mood_tone: "Grease, grief, humor",
			word_target: 7800,
			heat_level: "Low",
			tagline: "The special is an apology."
		},
		chapters: [{
			chapter_number: 1,
			chapter_title: "Ticket 14",
			word_count: 280,
			prose: `I burn the first omelette of the shift on purpose so the grill remembers who is in charge. Grandma used to say a stove is a gossip. Tonight it smells like cardamom that is not on the ticket. Table 14 ordered eggs. I plate eggs. I also plate a smear of something brown and sweet I did not cook. The man at 14 takes a bite and says, to no one, "I should have called her from the hospital." He tips thirty percent and leaves his number on a napkin for a woman who is not me. I wash the plate twice. The smell stays.`
		}],
		metadata_pkg: {
			title: "Kitchen Ghosts",
			back_cover_blurb: "Priya Shah works the night grill in a Newark diner that should not still be open. When her late grandmother's recipes begin finishing other people's sentences, the special becomes an apology no one ordered. A compact ghost story about service, spice, and the people who eat what they cannot say.",
			price_ebook: "$3.99"
		}
	},
	{
		id: "c_kish",
		working_title: "Last Light on the Kish",
		logline: "A river-guide on the Kish in northern Iran smuggles a banned poet's last collection downstream, one stanza at a time, past checkpoints that test for metaphor.",
		genre: "Literary thriller",
		source_tab: "International",
		status: "APPROVED",
		confidence: "high",
		protagonist_sketch: "Neda Farahani, 44, river-guide, former engineer; contradiction: she claims to hate poetry and has memorized the book.",
		setting: "Kish River corridor, near-future Iran",
		fresh_because: "Censorship thriller whose unit of contraband is a stanza, not a flash drive.",
		critic: {
			total: 44,
			strength: "High stakes, distinct geography, protagonist contradiction is load-bearing.",
			risk: "Needs care with cultural specificity; do not flatten into a generic dissident plot."
		}
	}
];
var SEED_EVENTS = [
	{
		id: "e1",
		concept_id: "c_tide",
		message: "The Tide Clock cleared M5. Files in the book folder. House notice posted."
	},
	{
		id: "e2",
		concept_id: "c_stars",
		message: "Quality Gate passed on A Mouthful of Stars. TAP 3 is waiting."
	},
	{
		id: "e3",
		concept_id: "c_letters",
		message: "Story plan locked for Index of Unsent Letters. TAP 2 is waiting."
	},
	{
		id: "e4",
		concept_id: null,
		message: "Nightly ideation complete. Three concepts promoted to Top 10."
	},
	{
		id: "e5",
		concept_id: "c_kish",
		message: "Last Light on the Kish approved at TAP 1. Architect is queued."
	},
	{
		id: "e6",
		concept_id: "c_kitchen",
		message: "Kitchen Ghosts entered production. Metadata draft is in."
	}
];
async function ensureSeed() {
	const sql = await getSql();
	if (((await sql`select count(*)::int as c from concepts`)[0]?.c ?? 0) > 0) return;
	for (const c of SEED) await sql.query(`insert into concepts (
        id, working_title, subtitle, logline, genre, source_tab, status, confidence,
        protagonist_sketch, setting, fresh_because, comps, critic, scout_brief,
        concept_row, story_plan, continuity, chapters, quality_report, metadata_pkg, production_pack
      ) values (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12::jsonb,$13::jsonb,$14::jsonb,
        $15::jsonb,$16::jsonb,$17::jsonb,$18::jsonb,$19::jsonb,$20::jsonb,$21::jsonb
      )`, [
		c.id,
		c.working_title,
		c.subtitle ?? null,
		c.logline,
		c.genre,
		c.source_tab,
		c.status,
		c.confidence ?? null,
		c.protagonist_sketch ?? null,
		c.setting ?? null,
		c.fresh_because ?? null,
		JSON.stringify(c.comps ?? []),
		JSON.stringify(c.critic ?? null),
		JSON.stringify(c.scout_brief ?? null),
		JSON.stringify(c.concept_row ?? null),
		JSON.stringify(c.story_plan ?? null),
		JSON.stringify(c.continuity ?? null),
		JSON.stringify(c.chapters ?? []),
		JSON.stringify(c.quality_report ?? null),
		JSON.stringify(c.metadata_pkg ?? null),
		JSON.stringify(c.production_pack ?? null)
	]);
	for (const e of SEED_EVENTS) await sql.query(`insert into events (id, concept_id, message) values ($1,$2,$3)`, [
		e.id,
		e.concept_id,
		e.message
	]);
}
var listConcepts_createServerFn_handler = createServerRpc({
	id: "3bf0a3420cad6f77d64017c58b8782998d147e3e52c8ac4d80fe9aeea02616ae",
	name: "listConcepts",
	filename: "src/lib/server/concepts.ts"
}, (opts) => listConcepts.__executeServer(opts));
var listConcepts = createServerFn({ method: "GET" }).handler(listConcepts_createServerFn_handler, async () => {
	await ensureSeed();
	return (await (await getSql()).query("select * from concepts order by updated_at desc")).map(mapConcept);
});
var getConcept_createServerFn_handler = createServerRpc({
	id: "c5facea4f90298467a7e0c46098c248214841f86b634036145e97323821f0e72",
	name: "getConcept",
	filename: "src/lib/server/concepts.ts"
}, (opts) => getConcept.__executeServer(opts));
var getConcept = createServerFn({ method: "GET" }).validator((input) => input).handler(getConcept_createServerFn_handler, async ({ data }) => {
	await ensureSeed();
	const rows = await (await getSql()).query("select * from concepts where id = $1", [data.id]);
	return rows[0] ? mapConcept(rows[0]) : null;
});
var listEvents_createServerFn_handler = createServerRpc({
	id: "a9ef60dc38d6778265de3f9ec6f7bc25bad345fe9f337917e4767156d9a0bcce",
	name: "listEvents",
	filename: "src/lib/server/concepts.ts"
}, (opts) => listEvents.__executeServer(opts));
var listEvents = createServerFn({ method: "GET" }).handler(listEvents_createServerFn_handler, async () => {
	await ensureSeed();
	return (await (await getSql()).query("select * from events order by created_at desc limit 24")).map(mapEvent);
});
var listRuns_createServerFn_handler = createServerRpc({
	id: "402bb3ba2373dc893309c2fbd799539fe0b7a1ec9fae88b11bbb4da6a2c622f5",
	name: "listRuns",
	filename: "src/lib/server/concepts.ts"
}, (opts) => listRuns.__executeServer(opts));
var listRuns = createServerFn({ method: "GET" }).validator((input = {}) => input).handler(listRuns_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	return (data.conceptId ? await sql.query("select * from agent_runs where concept_id = $1 order by created_at desc limit 40", [data.conceptId]) : await sql.query("select * from agent_runs order by created_at desc limit 40")).map(mapRun);
});
var addEvent_createServerFn_handler = createServerRpc({
	id: "a106f73af9f80ab88173405db481f1dd91b308ad5c1f3ac993ceb55b8c6a889f",
	name: "addEvent",
	filename: "src/lib/server/concepts.ts"
}, (opts) => addEvent.__executeServer(opts));
var addEvent = createServerFn({ method: "POST" }).validator((input) => input).handler(addEvent_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const id = crypto.randomUUID();
	await sql.query("insert into events (id, concept_id, message) values ($1,$2,$3)", [
		id,
		data.conceptId ?? null,
		data.message
	]);
	return { id };
});
var logRun_createServerFn_handler = createServerRpc({
	id: "512b227342c2dde1a27913af606f5c54fd424c3417c2e9b9f0322baf39d4c1ee",
	name: "logRun",
	filename: "src/lib/server/concepts.ts"
}, (opts) => logRun.__executeServer(opts));
var logRun = createServerFn({ method: "POST" }).validator((input) => input).handler(logRun_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const id = crypto.randomUUID();
	await sql.query(`insert into agent_runs (id, concept_id, agent_name, milestone, status, output, error, duration_ms)
       values ($1,$2,$3,$4,$5,$6::jsonb,$7,$8)`, [
		id,
		data.conceptId ?? null,
		data.agentName,
		data.milestone,
		data.status,
		JSON.stringify(data.output ?? null),
		data.error ?? null,
		data.durationMs ?? null
	]);
	return { id };
});
var updateConcept_createServerFn_handler = createServerRpc({
	id: "a54a164aa950a959f09b408d7203b5c8790ccadd5533dd65a8e55d7c4c66a1dd",
	name: "updateConcept",
	filename: "src/lib/server/concepts.ts"
}, (opts) => updateConcept.__executeServer(opts));
var updateConcept = createServerFn({ method: "POST" }).validator((input) => input).handler(updateConcept_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const p = data.patch;
	const fields = [];
	const values = [];
	let i = 1;
	const jsonCols = /* @__PURE__ */ new Set([
		"comps",
		"critic",
		"scout_brief",
		"concept_row",
		"story_plan",
		"continuity",
		"chapters",
		"quality_report",
		"metadata_pkg",
		"production_pack"
	]);
	for (const [key, value] of Object.entries(p)) {
		if (value === void 0) continue;
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
	await sql.query(`update concepts set ${fields.join(", ")} where id = $${i}`, values);
	const rows = await sql.query("select * from concepts where id = $1", [data.id]);
	return rows[0] ? mapConcept(rows[0]) : null;
});
var insertConcepts_createServerFn_handler = createServerRpc({
	id: "de8146a0dfb1ad519eb0211d9274261820d65f8fab8695d2e40df06c06ce5d4c",
	name: "insertConcepts",
	filename: "src/lib/server/concepts.ts"
}, (opts) => insertConcepts.__executeServer(opts));
var insertConcepts = createServerFn({ method: "POST" }).validator((input) => input).handler(insertConcepts_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const created = [];
	for (const item of data.items) {
		const id = `c_${crypto.randomUUID().slice(0, 8)}`;
		await sql.query(`insert into concepts (
          id, working_title, logline, genre, source_tab, status, confidence,
          protagonist_sketch, setting, fresh_because, comps, critic, scout_brief
        ) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11::jsonb,$12::jsonb,$13::jsonb)`, [
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
			JSON.stringify(item.scout_brief ?? null)
		]);
		created.push(id);
	}
	return { ids: created };
});
//#endregion
export { addEvent_createServerFn_handler, getConcept_createServerFn_handler, insertConcepts_createServerFn_handler, listConcepts_createServerFn_handler, listEvents_createServerFn_handler, listRuns_createServerFn_handler, logRun_createServerFn_handler, updateConcept_createServerFn_handler };
