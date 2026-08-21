import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/use-house-C_PgiLxI.js
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var getAiStatus = createServerFn({ method: "GET" }).handler(createSsrRpc("f55cc7fbc6a3f1723661e714229c1354f86446d6ed78ff423694f7068df3dfcf"));
var invokeAgent = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("69be088350ed6be75715e8d2643adacf55b3ea5838bfccd6874395c60803a2f3"));
var listConcepts = createServerFn({ method: "GET" }).handler(createSsrRpc("3bf0a3420cad6f77d64017c58b8782998d147e3e52c8ac4d80fe9aeea02616ae"));
var getConcept = createServerFn({ method: "GET" }).validator((input) => input).handler(createSsrRpc("c5facea4f90298467a7e0c46098c248214841f86b634036145e97323821f0e72"));
var listEvents = createServerFn({ method: "GET" }).handler(createSsrRpc("a9ef60dc38d6778265de3f9ec6f7bc25bad345fe9f337917e4767156d9a0bcce"));
var listRuns = createServerFn({ method: "GET" }).validator((input = {}) => input).handler(createSsrRpc("402bb3ba2373dc893309c2fbd799539fe0b7a1ec9fae88b11bbb4da6a2c622f5"));
var addEvent = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("a106f73af9f80ab88173405db481f1dd91b308ad5c1f3ac993ceb55b8c6a889f"));
var logRun = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("512b227342c2dde1a27913af606f5c54fd424c3417c2e9b9f0322baf39d4c1ee"));
var updateConcept = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("a54a164aa950a959f09b408d7203b5c8790ccadd5533dd65a8e55d7c4c66a1dd"));
var insertConcepts = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("de8146a0dfb1ad519eb0211d9274261820d65f8fab8695d2e40df06c06ce5d4c"));
function useConcepts() {
	return useQuery({
		queryKey: ["concepts"],
		queryFn: () => listConcepts()
	});
}
function useConcept(id) {
	return useQuery({
		queryKey: ["concept", id],
		queryFn: () => getConcept({ data: { id } }),
		enabled: Boolean(id)
	});
}
function useEvents() {
	return useQuery({
		queryKey: ["events"],
		queryFn: () => listEvents()
	});
}
function useRuns(conceptId) {
	return useQuery({
		queryKey: ["runs", conceptId ?? "all"],
		queryFn: () => listRuns({ data: { conceptId } })
	});
}
function useAiStatus() {
	return useQuery({
		queryKey: ["ai-status"],
		queryFn: () => getAiStatus()
	});
}
//#endregion
export { updateConcept as a, useConcepts as c, logRun as i, useEvents as l, insertConcepts as n, useAiStatus as o, invokeAgent as r, useConcept as s, addEvent as t, useRuns as u };
