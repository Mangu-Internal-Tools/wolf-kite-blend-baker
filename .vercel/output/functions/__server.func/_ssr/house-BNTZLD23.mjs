import { i as TAP_STATUSES } from "./status-G5BHUc_P.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/house-BNTZLD23.js
function pendingTaps(concepts) {
	return concepts.filter((c) => TAP_STATUSES.includes(c.status));
}
function countByStatus(concepts) {
	const counts = {};
	for (const c of concepts) counts[c.status] = (counts[c.status] ?? 0) + 1;
	return counts;
}
function chapterWordTotal(concept) {
	return concept.chapters.reduce((n, ch) => n + (ch.word_count || 0), 0);
}
function plannedChapterCount(concept) {
	const plan = concept.story_plan;
	if (!plan) return 0;
	const chapters = plan.chapters;
	if (Array.isArray(chapters)) return chapters.length;
	const target = plan.chapter_target;
	return typeof target === "number" ? target : 0;
}
//#endregion
export { plannedChapterCount as i, countByStatus as n, pendingTaps as r, chapterWordTotal as t };
