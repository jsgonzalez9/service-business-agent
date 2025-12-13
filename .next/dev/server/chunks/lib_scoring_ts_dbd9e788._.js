module.exports = [
"[project]/lib/scoring.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "scoreLead",
    ()=>scoreLead
]);
function scoreLead(lead, recentMsgs) {
    let s = 0;
    const m = (lead.motivation || "").toLowerCase();
    if (m.includes("urgent") || m.includes("need") || m.includes("must") || m.includes("foreclosure")) s += 20;
    const price = lead.price_expectation || 0;
    const offer = lead.offer_amount || 0;
    if (price && offer && price <= offer * 1.2) s += 20;
    const t = (lead.timeline || "").toLowerCase();
    if (t.includes("week") || t.includes("asap") || t.includes("days")) s += 15;
    const cond = (lead.property_condition || "").toLowerCase();
    if (cond.includes("needs") || cond.includes("repairs") || cond.includes("distress")) s += 15;
    const responsiveness = recentMsgs.slice(-5).length >= 3 ? 15 : 0;
    s += responsiveness;
    const objections = recentMsgs.filter((r)=>r.content.toLowerCase().includes("too low") || r.content.toLowerCase().includes("more")).length;
    s -= Math.min(objections * 5, 15);
    return Math.max(0, Math.min(100, s));
}
}),
];

//# sourceMappingURL=lib_scoring_ts_dbd9e788._.js.map