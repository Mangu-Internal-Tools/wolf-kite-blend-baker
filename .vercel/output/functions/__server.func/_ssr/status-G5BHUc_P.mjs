//#region node_modules/.nitro/vite/services/ssr/assets/status-G5BHUc_P.js
var STATUSES = [
	"BANKED",
	"TOP10",
	"APPROVED",
	"LOCKED",
	"PLAN_APPROVED",
	"DRAFTING",
	"MANUSCRIPT_SIGNED",
	"IN_PRODUCTION",
	"PUBLISHED",
	"REJECTED"
];
var STATUS_LABEL = {
	BANKED: "Banked",
	TOP10: "Top 10",
	APPROVED: "Approved",
	LOCKED: "Row locked",
	PLAN_APPROVED: "Plan signed",
	DRAFTING: "On press",
	MANUSCRIPT_SIGNED: "Manuscript signed",
	IN_PRODUCTION: "In production",
	PUBLISHED: "Published",
	REJECTED: "Rejected"
};
var TAP_STATUSES = [
	"TOP10",
	"LOCKED",
	"DRAFTING"
];
function tapForStatus(status) {
	if (status === "TOP10") return 1;
	if (status === "LOCKED") return 2;
	if (status === "DRAFTING") return 3;
	return null;
}
var MILESTONES = [
	{
		id: "M1",
		name: "Ideation",
		agents: [
			"M1-Scout",
			"M1-Ideator",
			"M1-Critic"
		],
		gate: "TAP 1"
	},
	{
		id: "M2",
		name: "Concept row",
		agents: ["M2-Architect"],
		gate: null
	},
	{
		id: "M3",
		name: "Story plan",
		agents: [
			"M3-BlueprintMaker",
			"M3-BeatWriter",
			"M3-ChapterMapper"
		],
		gate: "TAP 2"
	},
	{
		id: "M4",
		name: "Drafting",
		agents: [
			"M4-Ghostwriter",
			"M4-ContinuityGuardian",
			"M4-VoiceCoach",
			"M4-QualityGate"
		],
		gate: "TAP 3"
	},
	{
		id: "M5",
		name: "Press",
		agents: [
			"M5-Editor",
			"M5-MetadataBuilder",
			"M5-Packager"
		],
		gate: null
	}
];
function milestoneForStatus(status) {
	switch (status) {
		case "BANKED":
		case "TOP10": return "M1";
		case "APPROVED": return "M2";
		case "LOCKED": return "M3";
		case "PLAN_APPROVED":
		case "DRAFTING": return "M4";
		case "MANUSCRIPT_SIGNED":
		case "IN_PRODUCTION": return "M5";
		case "PUBLISHED": return "M5";
		case "REJECTED": return "M1";
	}
}
//#endregion
export { milestoneForStatus as a, TAP_STATUSES as i, STATUSES as n, tapForStatus as o, STATUS_LABEL as r, MILESTONES as t };
