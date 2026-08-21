import { n as getAgent } from "./agents-ChgnjoDS.mjs";
import { t as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-A6pJPYTF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/xai-D4OiY8aL.js
function extractJson(text) {
	const trimmed = text.trim();
	const fence = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
	const raw = fence ? fence[1].trim() : trimmed;
	const start = raw.indexOf("{");
	const end = raw.lastIndexOf("}");
	if (start < 0 || end <= start) throw new Error("Model did not return a JSON object");
	return JSON.parse(raw.slice(start, end + 1));
}
async function chatJson(opts) {
	const apiKey = process.env.XAI_API_KEY;
	if (!apiKey) throw new Error("AI is not available in this environment");
	const started = Date.now();
	const res = await fetch("https://api.x.ai/v1/chat/completions", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${apiKey}`
		},
		body: JSON.stringify({
			model: "grok-4.5",
			temperature: opts.temperature,
			max_tokens: opts.maxTokens,
			response_format: { type: "json_object" },
			messages: [{
				role: "system",
				content: opts.system
			}, {
				role: "user",
				content: opts.user
			}]
		})
	});
	if (!res.ok) {
		const errText = await res.text().catch(() => "");
		throw new Error(`xAI API error ${res.status}${errText ? `: ${errText.slice(0, 180)}` : ""}`);
	}
	const text = (await res.json()).choices[0]?.message.content ?? "";
	return {
		json: extractJson(text),
		text,
		ms: Date.now() - started
	};
}
var getAiStatus_createServerFn_handler = createServerRpc({
	id: "f55cc7fbc6a3f1723661e714229c1354f86446d6ed78ff423694f7068df3dfcf",
	name: "getAiStatus",
	filename: "src/lib/server/xai.ts"
}, (opts) => getAiStatus.__executeServer(opts));
var getAiStatus = createServerFn({ method: "GET" }).handler(getAiStatus_createServerFn_handler, async () => {
	return { available: Boolean(process.env.XAI_API_KEY) };
});
var invokeAgent_createServerFn_handler = createServerRpc({
	id: "69be088350ed6be75715e8d2643adacf55b3ea5838bfccd6874395c60803a2f3",
	name: "invokeAgent",
	filename: "src/lib/server/xai.ts"
}, (opts) => invokeAgent.__executeServer(opts));
var invokeAgent = createServerFn({ method: "POST" }).validator((input) => input).handler(invokeAgent_createServerFn_handler, async ({ data }) => {
	const agent = getAgent(data.agentId);
	try {
		const result = await chatJson({
			system: agent.system,
			user: data.payload,
			temperature: agent.temperature,
			maxTokens: agent.maxTokens
		});
		return {
			ok: true,
			agentId: agent.id,
			json: result.json,
			durationMs: result.ms
		};
	} catch (err) {
		return {
			ok: false,
			agentId: agent.id,
			error: err instanceof Error ? err.message : "Agent failed"
		};
	}
});
//#endregion
export { getAiStatus_createServerFn_handler, invokeAgent_createServerFn_handler };
