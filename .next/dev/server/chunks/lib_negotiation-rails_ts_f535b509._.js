module.exports = [
"[project]/lib/negotiation-rails.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "enforceRails",
    ()=>enforceRails,
    "mao",
    ()=>mao
]);
function mao(arv, repairs, fee, multiplier) {
    const v = arv * multiplier - repairs - fee;
    return Math.max(0, Math.round(v));
}
function enforceRails(lead, maoValue, proposed) {
    const softCeil = Math.round(maoValue * 1.02);
    const hardFloor = Math.round(maoValue * 0.9);
    const p = proposed ?? lead.offer_amount ?? 0;
    if (!p) return {
        allowed: true,
        nextAmount: hardFloor
    };
    if (p > softCeil) return {
        allowed: false,
        nextAmount: softCeil
    };
    if (p < hardFloor) return {
        allowed: false,
        nextAmount: hardFloor
    };
    return {
        allowed: true,
        nextAmount: p
    };
}
}),
];

//# sourceMappingURL=lib_negotiation-rails_ts_f535b509._.js.map