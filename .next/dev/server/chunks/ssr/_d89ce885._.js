module.exports = [
"[project]/lib/supabase/server.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createClient",
    ()=>createClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/ssr/dist/module/index.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createServerClient$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@supabase/ssr/dist/module/createServerClient.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/headers.js [app-rsc] (ecmascript)");
;
;
async function createClient() {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createServerClient$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServerClient"])(("TURBOPACK compile-time value", "http://127.0.0.1:54321"), ("TURBOPACK compile-time value", "sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH"), {
        cookies: {
            getAll () {
                return cookieStore.getAll();
            },
            setAll (cookiesToSet) {
                try {
                    cookiesToSet.forEach(({ name, value, options })=>cookieStore.set(name, value, options));
                } catch  {
                // Server Component - ignore
                }
            }
        }
    });
}
}),
"[project]/lib/lead-actions.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"001b4b738469126f549534d57c0621ef6a49089d42":"checkDatabaseSetup","0064b0efb5596dafa1d3149940f14d31aef82511e4":"getAllLeads","401b6fc917a3b36b348ad5cc9e5682ae3022237132":"saveMessage","40237b65f6520e20bcedf9b359912135aaaea7ec6a":"bulkImportLeads","403c04d99b26ef8c3157969ddcb2223f30f55d7ded":"getLeadByPhone","405ddfb65bf737b66e7524a1ddd8ca1ed780a3c244":"getLeadById","40bfdad60d08efe26e0d874dc18b03bc1f1bda1715":"getLeadMessages","40c7941166a943a98335b4fa91d8aa6fcae70dbd57":"deleteLead","40df671716b6bb07ccda3b62123d601f721ef7841b":"createLead","609ca117ab494588ba7a1f77d4c61da1f788d153a6":"updateLead"},"",""] */ __turbopack_context__.s([
    "bulkImportLeads",
    ()=>bulkImportLeads,
    "checkDatabaseSetup",
    ()=>checkDatabaseSetup,
    "createLead",
    ()=>createLead,
    "deleteLead",
    ()=>deleteLead,
    "getAllLeads",
    ()=>getAllLeads,
    "getLeadById",
    ()=>getLeadById,
    "getLeadByPhone",
    ()=>getLeadByPhone,
    "getLeadMessages",
    ()=>getLeadMessages,
    "saveMessage",
    ()=>saveMessage,
    "updateLead",
    ()=>updateLead
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase/server.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/cache.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
async function createLead(data) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    // Format phone number (ensure it starts with +1 for US)
    let phone = data.phone_number.replace(/\D/g, "");
    if (phone.length === 10) {
        phone = `+1${phone}`;
    } else if (phone.length === 11 && phone.startsWith("1")) {
        phone = `+${phone}`;
    } else if (!phone.startsWith("+")) {
        phone = `+${phone}`;
    }
    function extractState(addr) {
        try {
            const parts = addr.split(",").map((p)=>p.trim().toUpperCase());
            for (const p of parts.reverse()){
                const m = p.match(/\b([A-Z]{2})\b/);
                if (m) return m[1];
            }
            return null;
        } catch  {
            return null;
        }
    }
    const state = data.state || extractState(data.address || "");
    const { data: lead, error } = await supabase.from("leads").insert({
        name: data.name,
        phone_number: phone,
        address: data.address,
        state: state || null,
        notes: data.notes || null,
        arv: data.arv || null,
        repair_estimate: data.repair_estimate || null,
        motivation: data.motivation || null,
        timeline: data.timeline || null,
        property_condition: data.property_condition || null,
        conversation_state: data.conversation_state || "cold_lead",
        business_id: data.business_id || null
    }).select().single();
    if (error) {
        console.error("Error creating lead:", error);
        return {
            lead: null,
            error: error.message
        };
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/dashboard");
    return {
        lead: lead,
        error: null
    };
}
async function updateLead(id, data) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    const { data: lead, error } = await supabase.from("leads").update({
        ...data,
        updated_at: new Date().toISOString()
    }).eq("id", id).select().single();
    if (error) {
        console.error("Error updating lead:", error);
        return {
            lead: null,
            error: error.message
        };
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/dashboard");
    return {
        lead: lead,
        error: null
    };
}
async function getLeadByPhone(phone) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    // Normalize phone number
    let normalizedPhone = phone.replace(/\D/g, "");
    if (normalizedPhone.length === 10) {
        normalizedPhone = `+1${normalizedPhone}`;
    } else if (normalizedPhone.length === 11 && normalizedPhone.startsWith("1")) {
        normalizedPhone = `+${normalizedPhone}`;
    } else if (!normalizedPhone.startsWith("+")) {
        normalizedPhone = `+${normalizedPhone}`;
    }
    const { data, error } = await supabase.from("leads").select("*").eq("phone_number", normalizedPhone).single();
    if (error || !data) {
        return null;
    }
    return data;
}
async function getLeadById(id) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    const { data, error } = await supabase.from("leads").select("*").eq("id", id).single();
    if (error || !data) {
        return null;
    }
    return data;
}
async function getAllLeads() {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    const { data, error } = await supabase.from("leads").select("*").order("updated_at", {
        ascending: false
    });
    if (error) {
        console.error("Error fetching leads:", error);
        return [];
    }
    return data;
}
async function saveMessage(data) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    const { data: message, error } = await supabase.from("messages").insert({
        lead_id: data.lead_id,
        direction: data.direction,
        content: data.content,
        twilio_sid: data.twilio_sid || null,
        model_used: data.model_used || null,
        was_escalated: data.was_escalated || false
    }).select().single();
    if (error) {
        console.error("Error saving message:", error);
        return {
            message: null,
            error: error.message
        };
    }
    // Update lead's last_message_at
    await supabase.from("leads").update({
        last_message_at: new Date().toISOString()
    }).eq("id", data.lead_id);
    return {
        message: message,
        error: null
    };
}
async function getLeadMessages(leadId) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    const { data, error } = await supabase.from("messages").select("*").eq("lead_id", leadId).order("created_at", {
        ascending: true
    });
    if (error) {
        console.error("Error fetching messages:", error);
        return [];
    }
    return data;
}
async function deleteLead(id) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    const { error } = await supabase.from("leads").delete().eq("id", id);
    if (error) {
        console.error("Error deleting lead:", error);
        return {
            error: error.message
        };
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/dashboard");
    return {
        error: null
    };
}
async function checkDatabaseSetup() {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    try {
        // Try to query the leads table with a minimal query
        const { error } = await supabase.from("leads").select("id").limit(1);
        return !error;
    } catch  {
        return false;
    }
}
async function bulkImportLeads(leads) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    let successCount = 0;
    let failedCount = 0;
    const errors = [];
    for (const leadData of leads){
        // Format phone number
        let phone = leadData.phone_number.replace(/\D/g, "");
        if (phone.length === 10) {
            phone = `+1${phone}`;
        } else if (phone.length === 11 && phone.startsWith("1")) {
            phone = `+${phone}`;
        } else if (!phone.startsWith("+")) {
            phone = `+${phone}`;
        }
        // Check if lead already exists
        const { data: existing } = await supabase.from("leads").select("id").eq("phone_number", phone).single();
        if (existing) {
            errors.push(`Lead with phone ${leadData.phone_number} already exists`);
            failedCount++;
            continue;
        }
        function extractState(addr) {
            try {
                const parts = addr.split(",").map((p)=>p.trim().toUpperCase());
                for (const p of parts.reverse()){
                    const m = p.match(/\b([A-Z]{2})\b/);
                    if (m) return m[1];
                }
                return null;
            } catch  {
                return null;
            }
        }
        const st = leadData.state || extractState(leadData.address || "");
        const { error } = await supabase.from("leads").insert({
            name: leadData.name,
            phone_number: phone,
            address: leadData.address,
            state: st || null,
            notes: leadData.notes || null,
            arv: leadData.arv || null,
            repair_estimate: leadData.repair_estimate || null,
            conversation_state: "cold_lead"
        });
        if (error) {
            errors.push(`Failed to import ${leadData.name}: ${error.message}`);
            failedCount++;
        } else {
            successCount++;
        }
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/dashboard");
    return {
        successCount,
        failedCount,
        errors
    };
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    createLead,
    updateLead,
    getLeadByPhone,
    getLeadById,
    getAllLeads,
    saveMessage,
    getLeadMessages,
    deleteLead,
    checkDatabaseSetup,
    bulkImportLeads
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(createLead, "40df671716b6bb07ccda3b62123d601f721ef7841b", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(updateLead, "609ca117ab494588ba7a1f77d4c61da1f788d153a6", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getLeadByPhone, "403c04d99b26ef8c3157969ddcb2223f30f55d7ded", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getLeadById, "405ddfb65bf737b66e7524a1ddd8ca1ed780a3c244", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getAllLeads, "0064b0efb5596dafa1d3149940f14d31aef82511e4", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(saveMessage, "401b6fc917a3b36b348ad5cc9e5682ae3022237132", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getLeadMessages, "40bfdad60d08efe26e0d874dc18b03bc1f1bda1715", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(deleteLead, "40c7941166a943a98335b4fa91d8aa6fcae70dbd57", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(checkDatabaseSetup, "001b4b738469126f549534d57c0621ef6a49089d42", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(bulkImportLeads, "40237b65f6520e20bcedf9b359912135aaaea7ec6a", null);
}),
"[project]/.next-internal/server/app/dashboard/page/actions.js { ACTIONS_MODULE0 => \"[project]/lib/lead-actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$lead$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/lead-actions.ts [app-rsc] (ecmascript)");
;
;
;
;
;
;
;
;
;
;
}),
"[project]/.next-internal/server/app/dashboard/page/actions.js { ACTIONS_MODULE0 => \"[project]/lib/lead-actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "001b4b738469126f549534d57c0621ef6a49089d42",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$lead$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["checkDatabaseSetup"],
    "0064b0efb5596dafa1d3149940f14d31aef82511e4",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$lead$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getAllLeads"],
    "401b6fc917a3b36b348ad5cc9e5682ae3022237132",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$lead$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["saveMessage"],
    "40237b65f6520e20bcedf9b359912135aaaea7ec6a",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$lead$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["bulkImportLeads"],
    "403c04d99b26ef8c3157969ddcb2223f30f55d7ded",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$lead$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getLeadByPhone"],
    "405ddfb65bf737b66e7524a1ddd8ca1ed780a3c244",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$lead$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getLeadById"],
    "40bfdad60d08efe26e0d874dc18b03bc1f1bda1715",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$lead$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getLeadMessages"],
    "40c7941166a943a98335b4fa91d8aa6fcae70dbd57",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$lead$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["deleteLead"],
    "40df671716b6bb07ccda3b62123d601f721ef7841b",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$lead$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createLead"],
    "609ca117ab494588ba7a1f77d4c61da1f788d153a6",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$lead$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateLead"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$dashboard$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$lib$2f$lead$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/dashboard/page/actions.js { ACTIONS_MODULE0 => "[project]/lib/lead-actions.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$lead$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/lead-actions.ts [app-rsc] (ecmascript)");
}),
];

//# sourceMappingURL=_d89ce885._.js.map