module.exports = [
"[project]/lib/supabase/service.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createServiceClient",
    ()=>createServiceClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$supabase$2d$js$40$2$2e$86$2e$2$2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$esm$2f$wrapper$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@supabase+supabase-js@2.86.2/node_modules/@supabase/supabase-js/dist/esm/wrapper.mjs [app-route] (ecmascript)");
;
function createServiceClient() {
    const url = ("TURBOPACK compile-time value", "https://cweluauwjzameqxlcpkj.supabase.co");
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$supabase$2d$js$40$2$2e$86$2e$2$2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$esm$2f$wrapper$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createClient"])(url, key);
}
}),
"[project]/lib/llm-cache.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "embedQuery",
    ()=>embedQuery,
    "findCachedByEmbedding",
    ()=>findCachedByEmbedding
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$openai$40$6$2e$10$2e$0_ws$40$8$2e$18$2e$3_zod$40$3$2e$25$2e$76$2f$node_modules$2f$openai$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/openai@6.10.0_ws@8.18.3_zod@3.25.76/node_modules/openai/index.mjs [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$openai$40$6$2e$10$2e$0_ws$40$8$2e$18$2e$3_zod$40$3$2e$25$2e$76$2f$node_modules$2f$openai$2f$client$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__OpenAI__as__default$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/openai@6.10.0_ws@8.18.3_zod@3.25.76/node_modules/openai/client.mjs [app-route] (ecmascript) <export OpenAI as default>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase/service.ts [app-route] (ecmascript)");
;
;
function dot(a, b) {
    let s = 0;
    for(let i = 0; i < Math.min(a.length, b.length); i++)s += a[i] * b[i];
    return s;
}
function norm(a) {
    return Math.sqrt(a.reduce((s, v)=>s + v * v, 0));
}
function cosine(a, b) {
    const na = norm(a);
    const nb = norm(b);
    if (!na || !nb) return 0;
    return dot(a, b) / (na * nb);
}
async function embedQuery(text) {
    const openai = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$openai$40$6$2e$10$2e$0_ws$40$8$2e$18$2e$3_zod$40$3$2e$25$2e$76$2f$node_modules$2f$openai$2f$client$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__OpenAI__as__default$3e$__["default"]({
        apiKey: process.env.OPENAI_API_KEY
    });
    const emb = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: text
    });
    return emb.data[0].embedding;
}
async function findCachedByEmbedding(intent, query, market, floor = 0.85, ttlDays) {
    const svc = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createServiceClient"])();
    const vec = await embedQuery(query);
    let q = svc.from("cached_responses").select("id,response_text,embedding,intent,market,usage_count,created_at").eq("intent", intent);
    if (market) q = q.eq("market", market);
    const { data } = await q.limit(200);
    const now = Date.now();
    const maxAgeMs = typeof ttlDays === "number" && ttlDays > 0 ? ttlDays * 24 * 60 * 60 * 1000 : undefined;
    const filtered = (data || []).filter((row)=>{
        if (!maxAgeMs) return true;
        const created = new Date(row.created_at).getTime();
        return now - created <= maxAgeMs;
    });
    const scored = filtered.map((row)=>({
            id: row.id,
            text: row.response_text,
            score: cosine(vec, row.embedding || [])
        }));
    scored.sort((a, b)=>b.score - a.score);
    const best = scored[0];
    if (best && best.score >= floor) {
        const current = (data || []).find((d)=>d.id === best.id);
        await svc.from("cached_responses").update({
            usage_count: (current?.usage_count || 0) + 1,
            last_used_at: new Date().toISOString()
        }).eq("id", best.id);
        return {
            text: best.text,
            confidence: best.score,
            id: best.id
        };
    }
    return {
        text: null,
        confidence: 0
    };
}
}),
];

//# sourceMappingURL=lib_8af6ed8c._.js.map