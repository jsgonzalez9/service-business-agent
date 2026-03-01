module.exports=[18622,(e,t,a)=>{t.exports=e.x("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js"))},56704,(e,t,a)=>{t.exports=e.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},32319,(e,t,a)=>{t.exports=e.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},24725,(e,t,a)=>{t.exports=e.x("next/dist/server/app-render/after-task-async-storage.external.js",()=>require("next/dist/server/app-render/after-task-async-storage.external.js"))},93695,(e,t,a)=>{t.exports=e.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},89660,e=>{"use strict";e.i(94879);var t=e.i(87022),a=e.i(93458);async function r(){let e=await (0,a.cookies)();return(0,t.createServerClient)("http://localhost:54321","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxvY2FsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDQwNjcyMDAsImV4cCI6MjAxOTY0MzIwMH0.local",{cookies:{getAll:()=>e.getAll(),setAll(t){try{t.forEach(({name:t,value:a,options:r})=>e.set(t,a,r))}catch{}}}})}e.s(["createClient",()=>r])},14747,(e,t,a)=>{t.exports=e.x("path",()=>require("path"))},24361,(e,t,a)=>{t.exports=e.x("util",()=>require("util"))},22734,(e,t,a)=>{t.exports=e.x("fs",()=>require("fs"))},32721,e=>{"use strict";var t=e.i(74461),a=e.i(89660);let r=process.env.TWILIO_ACCOUNT_SID,n=process.env.TWILIO_AUTH_TOKEN,o=process.env.TWILIO_PHONE_NUMBER,s=process.env.TWILIO_CALLER_ID,i=(process.env.TWILIO_NUMBER_POOL||"").split(",").map(e=>e.trim()).filter(e=>e.length>0),l=Number(process.env.SMS_MONTHLY_LIMIT_PER_NUMBER||1e4);async function c(){let e=i.length>0?i:o?[o]:[];if(0===e.length)return[];try{let t,r=await (0,a.createClient)(),{data:n}=await r.from("call_events").select("event_data, created_at").eq("event_type","sms_sent").gte("created_at",((t=new Date).setDate(1),t.setHours(0,0,0,0),t.toISOString())),o={};for(let e of n||[]){let t=e.event_data?.from;"string"==typeof t&&(o[t]=(o[t]||0)+1)}return e.filter(e=>(o[e]||0)<l).sort((e,t)=>(o[e]||0)-(o[t]||0))}catch{return e}}function d(){return r&&n?(0,t.default)(r,n):(console.warn("Twilio credentials not configured"),null)}function u(){if(s&&s.length>0)return s;let e=i.length>0?i:o?[o]:[];return e.length>0?e[0]:null}async function p(e,t,r){let n=d();if(!n){let a=r?.withFooter??!0?"\n\nReply STOP to unsubscribe":"",n=`${t}${a}`;return console.log(`[MOCK SMS] To: ${e}
Message: ${n}`),{sid:`mock_${Date.now()}`,error:null}}let o=Number(process.env.SMS_QUIET_HOURS_START||8),s=Number(process.env.SMS_QUIET_HOURS_END||21),i=new Date().getHours();if(i<o||i>=s)return{sid:null,error:"Quiet hours active; message not sent"};if(!r?.bypassSuppression)try{let t=await (0,a.createClient)(),r=e.replace(/\D/g,"");10===r.length?r=`+1${r}`:11===r.length&&r.startsWith("1")?r=`+${r}`:r.startsWith("+")||(r=`+${r}`);let{data:n}=await t.from("leads").select("*").eq("phone_number",r).single();if(n&&n.is_opted_out)return{sid:null,error:"Recipient has opted out"}}catch{}let l=await c();if(0===l.length)return{sid:null,error:"No available Twilio sender number (check pool or config)"};try{try{let e=await (0,a.createClient)(),t=new Date(Date.now()-6e4).toISOString(),{count:r}=await e.from("sms_events").select("id",{count:"exact",head:!0}).gte("created_at",t),n=Number(process.env.SMS_RATE_LIMIT_PER_MIN||25);if((r||0)>=n)return{sid:null,error:"Rate limit exceeded, try later"}}catch{}let o=[];try{let e=await (0,a.createClient)(),{data:t}=await e.from("agent_config").select("*").limit(1).single(),r=t?.company_name||"Your Company";o.push(`${r}: real estate lead generation`)}catch{o.push("Real estate lead generation")}o.push("Msg & data rates may apply"),o.push("Reply HELP for help"),o.push("Reply STOP to unsubscribe");let s=o.join(" • "),i=r?.withFooter??!0?`

${s}`:"",c=`${t}${i}`,d=null;for(let r of l)try{let o=await n.messages.create({body:c,from:r,to:e,statusCallback:"http://localhost:3000/api/twilio/status"});try{let n=await (0,a.createClient)();await n.from("sms_events").insert({sid:o.sid,to_number:e,from_number:r,status:"sent",error:null,body:t})}catch{}return{sid:o.sid,error:null}}catch(e){d=e?.message?String(e.message):"Failed to send SMS";continue}try{let r=await (0,a.createClient)();await r.from("sms_events").insert({sid:null,to_number:e,from_number:l[0],status:"failed",error:d||"Failed to send SMS",body:t})}catch{}return{sid:null,error:d||"Failed to send SMS"}}catch(e){return console.error("Error sending SMS:",e),{sid:null,error:e instanceof Error?e.message:"Failed to send SMS"}}}function m(e,a,r){return!n||t.default.validateRequest(n,e,a,r)}e.s(["chooseCallerId",()=>u,"eligibleNumbersSorted",()=>c,"getTwilioClient",()=>d,"sendSMS",()=>p,"validateTwilioRequest",()=>m])},66893,56542,e=>{"use strict";var t=e.i(89660);e.i(89228);var a=e.i(91601);async function r(e=3){let t=[],a=new Date(new Date);a.setDate(a.getDate()+1),a.setHours(9,0,0,0);let n=0;for(;n<e;){if(0===a.getDay()||6===a.getDay()){a.setDate(a.getDate()+1);continue}for(let e of[9,13,15]){let r=new Date(a);r.setHours(e,0,0,0);let n=new Date(r);n.setHours(e+1,0,0,0),t.push({start:r.toISOString(),end:n.toISOString()})}a.setDate(a.getDate()+1),n++}return t}function n(e){return e.map(e=>new Date(e.start).toLocaleString("en-US",{weekday:"long",month:"short",day:"numeric",hour:"numeric",minute:"2-digit"})).join("\n- ")}async function o(e,a,r){let n=await (0,t.createClient)();console.log(`[BOOKING CREATED] Lead: ${e}, Time: ${a}, Desc: ${r}`);let{data:o}=await n.from("leads").select("notes").eq("id",e).single(),s=(o?.notes||"")+`

[BOOKING CONFIRMED] ${a} - ${r}`;return await n.from("leads").update({notes:s}).eq("id",e),{success:!0}}e.s(["createBooking",()=>o,"formatSlotsForPrompt",()=>n,"getNextAvailableSlots",()=>r],56542);let s=`You are the AI Receptionist & Booking Agent for a local service business (e.g., Roofing, HVAC, Med Spa).
Your goal is to qualify leads, determine their needs, and book an appointment.

You are friendly, professional, and efficient.
Do not handle complex technical questions; if the lead asks something technical, flag it for human escalation.

OUTPUT: SMS text messages only. Each response should be 1-2 short text messages max.

QUALIFICATION LOGIC:
1. Service Type: What do they need? (Map to 'motivation')
2. Urgency: Is this an emergency or routine estimate? (Map to 'timeline')
3. Property Type: Residential or Commercial? (Map to 'property_condition')
4. Address: Where is the service needed?

IMPORTANT:
- Always write in short SMS-friendly messages.
- Do not confirm a specific time slot unless you have checked availability.
- AVAILABLE SLOTS will be provided in the context. Only offer times from that list.
- If the user seems ready to book, offer 2-3 time slots from the provided list.
- If confidence is low or user is frustrated, escalate.

---

# 📌 **CALL INTENT / BOOKING LOGIC**

**Your job is to determine whether a customer wants to book, talk on the phone, or needs immediate assistance.**

## **TRIGGER ACTIONS WHEN:**

### **1. Booking Request / Availability Check**
If customer says: "I want to book", "do you have openings?", "can you come tomorrow?", "schedule an appointment"
Return:
{
  "action": "update_lead_status",
  "lead_status": "schedule_call"
}

### **2. Direct Call Requests**
If customer says: "call me", "can we talk?"
Return:
{
  "action": "update_lead_status",
  "lead_status": "warm_call_requested"
}

### 3. Qualification Complete
If you have gathered Service Type, Urgency, and Address.
Return:
{
  "action": "update_lead_status",
  "lead_status": "qualified"
}

### 4. Booking Confirmed
If the user agrees to a specific time.
Return:
{
  "action": "update_lead_status",
  "lead_status": "booked",
  "call_time": "YYYY-MM-DD HH:mm"
}

## **RESPONSE FORMAT**

Always include this JSON at the END of your response:

{
  "callIntent": {
    "action": "update_lead_status" | "none",
    "lead_status": "warm_call_requested" | "schedule_call" | "qualified" | "text_only" | "booked",
    "call_time": "OPTIONAL - time if customer specified"
  },
  "extractedData": {
    "service_type": "...",
    "urgency": "...",
    "property_type": "...",
    "address": "..."
  }
}
`,i=new a.default({apiKey:process.env.OPENAI_API_KEY});async function l(){let e=await (0,t.createClient)(),{data:a,error:r}=await e.from("agent_config").select("*").single();return r||!a?{id:"",company_name:"Service Business",wholesaling_fee:0,arv_multiplier:0,follow_up_hours:24,max_follow_ups:3,followup_backoff_minutes:15,followup_max_attempts:3,llm_cache_enabled:!0,llm_cache_confidence_floor:.85,llm_cache_ttl_faq_days:30,llm_cache_ttl_objection_days:14,auto_dispo_eval_enabled:!1,auto_renegotiate_days_threshold:5,auto_cancel_days_threshold:10,auto_dispo_require_human_confirm:!0,created_at:new Date().toISOString(),updated_at:new Date().toISOString()}:a}async function c(e){let a=await (0,t.createClient)(),{data:r,error:n}=await a.from("messages").select("*").eq("lead_id",e).order("created_at",{ascending:!0});return n?(console.error("Error fetching conversation history:",n),[]):r}async function d(e,t,a){let o=await c(e.id),l=n(await r()),d=o.map(e=>`${"inbound"===e.direction?"Customer":"Agent"}: ${e.content}`).join("\n"),u=`
LEAD CONTEXT:
Name: ${e.name}
Address: ${e.address}
Current State: ${e.conversation_state}
Current Data:
- Service Type: ${e.motivation||"Unknown"}
- Urgency: ${e.timeline||"Unknown"}
- Property Type: ${e.property_condition||"Unknown"}

AVAILABLE BOOKING SLOTS:
- ${l}

CONVERSATION HISTORY:
${d}
Customer: ${t}

Provide the next SMS response and the JSON data at the end.
`,p=await i.chat.completions.create({model:"gpt-4o",messages:[{role:"system",content:s},{role:"user",content:u}],temperature:.7}),m=p.choices[0]?.message?.content||"",h=m,f={},_=m.match(/\{[\s\S]*\}$/);if(_)try{f=JSON.parse(_[0]),h=m.replace(_[0],"").trim()}catch(e){console.error("Failed to parse JSON from agent response",e)}let g=f.extractedData||{},w=f.callIntent||{action:"none"},y={};g.service_type&&(y.motivation=g.service_type),g.urgency&&(y.timeline=g.urgency),g.property_type&&(y.property_condition=g.property_type);let v=e.conversation_state;return"update_lead_status"===w.action&&w.lead_status&&(v=w.lead_status),{message:h,updatedLead:y,newState:v,modelUsed:"gpt-4o",escalated:!1,callIntent:w}}async function u(e,t){let a=e.motivation||"your project";return`Hi ${e.name}, this is ${t.company_name}. We're offering priority scheduling this week — still need help with ${a}?`}async function p(e,t){return`Hi ${e.name}, just checking back to see if you still need help? Let us know!`}e.s(["generateAgentResponse",()=>d,"generateFollowUp",()=>p,"generateInitialOutreach",()=>u,"getAgentConfig",()=>l],66893)},23875,e=>{"use strict";function t(e,t,a,r){return Math.max(0,Math.round(e*r-t-a))}function a(e,t,a){let r=Math.round(1.02*t),n=Math.round(.9*t),o=a??e.offer_amount??0;return o?o>r?{allowed:!1,nextAmount:r}:o<n?{allowed:!1,nextAmount:n}:{allowed:!0,nextAmount:o}:{allowed:!0,nextAmount:n}}e.s(["enforceRails",()=>a,"mao",()=>t])},87423,e=>{"use strict";var t=e.i(47909),a=e.i(74017),r=e.i(96250),n=e.i(59756),o=e.i(61916),s=e.i(14444),i=e.i(37092),l=e.i(69741),c=e.i(16795),d=e.i(87718),u=e.i(95169),p=e.i(47587),m=e.i(66012),h=e.i(70101),f=e.i(26937),_=e.i(10372),g=e.i(93695);e.i(52474);var w=e.i(5232),y=e.i(89171),v=e.i(89660),S=e.i(23875),R=e.i(32721),I=e.i(66893);async function x(){let e=await (0,v.createClient)(),t=await (0,I.getAgentConfig)();if(!1===t.auto_dispo_eval_enabled)return y.NextResponse.json({success:!0,skipped:!0});let{data:a}=await e.from("leads").select("*").or("conversation_state.eq.contract_signed,deal_state.eq.DISPO").eq("dispo_status","pending").limit(200),r=0,n=0;for(let o of a||[]){let a=o.dispo_started_at?new Date(o.dispo_started_at).getTime():void 0;if(a||"contract_signed"!==o.conversation_state||(a=Date.now(),await e.from("leads").update({dispo_started_at:new Date().toISOString()}).eq("id",o.id)),!a)continue;let s=Math.floor((Date.now()-a)/864e5),i=o.offers_received||0;if(r++,0===i&&s>=(t.auto_cancel_days_threshold??10)){if(t.auto_dispo_require_human_confirm){let t=`
[AUTO] Recommend cancel during inspection period (no interest in ${s}d).`;await e.from("leads").update({notes:(o.notes||"")+t}).eq("id",o.id)}else await (0,R.sendSMS)(o.phone_number,`We weren’t able to secure a buyer at the current terms. To keep things simple, we’ll cancel during the inspection period. If you’d like to revisit pricing, just let me know.`),await e.from("leads").update({conversation_state:"lost",deal_state:"DEAD",dispo_status:"cancelled"}).eq("id",o.id),n++;continue}if(0===i&&s>=(t.auto_renegotiate_days_threshold??5)){let a=(0,S.mao)(o.arv||0,o.repair_estimate||0,t.wholesaling_fee,t.arv_multiplier),r=Math.round(.95*a),i=(0,S.enforceRails)(o,a,r).nextAmount||r;if(t.auto_dispo_require_human_confirm){let t=`
[AUTO] Recommend renegotiate to $${i.toLocaleString()} (no interest in ${s}d).`;await e.from("leads").update({notes:(o.notes||"")+t}).eq("id",o.id)}else await e.from("leads").update({offer_amount:i,dispo_status:"renegotiated"}).eq("id",o.id),await (0,R.sendSMS)(o.phone_number,`Quick update: to get this done, we can adjust the offer to $${i.toLocaleString()}. Does that work for you? If not, we can cancel during the inspection period.`),n++;continue}}return y.NextResponse.json({success:!0,evaluated:r,actions:n})}e.s(["POST",()=>x,"dynamic",0,"force-dynamic"],15963);var O=e.i(15963);let C=new t.AppRouteRouteModule({definition:{kind:a.RouteKind.APP_ROUTE,page:"/api/dispo/auto/run/route",pathname:"/api/dispo/auto/run",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/app/api/dispo/auto/run/route.ts",nextConfigOutput:"",userland:O}),{workAsyncStorage:A,workUnitAsyncStorage:E,serverHooks:T}=C;function b(){return(0,r.patchFetch)({workAsyncStorage:A,workUnitAsyncStorage:E})}async function N(e,t,r){C.isDev&&(0,n.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let y="/api/dispo/auto/run/route";y=y.replace(/\/index$/,"")||"/";let v=await C.prepare(e,t,{srcPage:y,multiZoneDraftMode:!1});if(!v)return t.statusCode=400,t.end("Bad Request"),null==r.waitUntil||r.waitUntil.call(r,Promise.resolve()),null;let{buildId:S,params:R,nextConfig:I,parsedUrl:x,isDraftMode:O,prerenderManifest:A,routerServerContext:E,isOnDemandRevalidate:T,revalidateOnlyGenerated:b,resolvedPathname:N,clientReferenceManifest:M,serverActionsManifest:D}=v,k=(0,l.normalizeAppPath)(y),q=!!(A.dynamicRoutes[k]||A.routes[N]),$=async()=>((null==E?void 0:E.render404)?await E.render404(e,t,x,!1):t.end("This page could not be found"),null);if(q&&!O){let e=!!A.routes[N],t=A.dynamicRoutes[k];if(t&&!1===t.fallback&&!e){if(I.experimental.adapterPath)return await $();throw new g.NoFallbackError}}let P=null;!q||C.isDev||O||(P="/index"===(P=N)?"/":P);let U=!0===C.isDev||!q,H=q&&!U;D&&M&&(0,s.setReferenceManifestsSingleton)({page:y,clientReferenceManifest:M,serverActionsManifest:D,serverModuleMap:(0,i.createServerModuleMap)({serverActionsManifest:D})});let L=e.method||"GET",j=(0,o.getTracer)(),F=j.getActiveScopeSpan(),B={params:R,prerenderManifest:A,renderOpts:{experimental:{authInterrupts:!!I.experimental.authInterrupts},cacheComponents:!!I.cacheComponents,supportsDynamicResponse:U,incrementalCache:(0,n.getRequestMeta)(e,"incrementalCache"),cacheLifeProfiles:I.cacheLife,waitUntil:r.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,a,r)=>C.onRequestError(e,t,r,E)},sharedContext:{buildId:S}},K=new c.NodeNextRequest(e),Y=new c.NodeNextResponse(t),W=d.NextRequestAdapter.fromNodeNextRequest(K,(0,d.signalFromNodeResponse)(t));try{let s=async e=>C.handle(W,B).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let a=j.getRootSpanAttributes();if(!a)return;if(a.get("next.span_type")!==u.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${a.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let r=a.get("next.route");if(r){let t=`${L} ${r}`;e.setAttributes({"next.route":r,"http.route":r,"next.span_name":t}),e.updateName(t)}else e.updateName(`${L} ${y}`)}),i=!!(0,n.getRequestMeta)(e,"minimalMode"),l=async n=>{var o,l;let c=async({previousCacheEntry:a})=>{try{if(!i&&T&&b&&!a)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let o=await s(n);e.fetchMetrics=B.renderOpts.fetchMetrics;let l=B.renderOpts.pendingWaitUntil;l&&r.waitUntil&&(r.waitUntil(l),l=void 0);let c=B.renderOpts.collectedTags;if(!q)return await (0,m.sendResponse)(K,Y,o,B.renderOpts.pendingWaitUntil),null;{let e=await o.blob(),t=(0,h.toNodeOutgoingHttpHeaders)(o.headers);c&&(t[_.NEXT_CACHE_TAGS_HEADER]=c),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let a=void 0!==B.renderOpts.collectedRevalidate&&!(B.renderOpts.collectedRevalidate>=_.INFINITE_CACHE)&&B.renderOpts.collectedRevalidate,r=void 0===B.renderOpts.collectedExpire||B.renderOpts.collectedExpire>=_.INFINITE_CACHE?void 0:B.renderOpts.collectedExpire;return{value:{kind:w.CachedRouteKind.APP_ROUTE,status:o.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:a,expire:r}}}}catch(t){throw(null==a?void 0:a.isStale)&&await C.onRequestError(e,t,{routerKind:"App Router",routePath:y,routeType:"route",revalidateReason:(0,p.getRevalidateReason)({isStaticGeneration:H,isOnDemandRevalidate:T})},E),t}},d=await C.handleResponse({req:e,nextConfig:I,cacheKey:P,routeKind:a.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:A,isRoutePPREnabled:!1,isOnDemandRevalidate:T,revalidateOnlyGenerated:b,responseGenerator:c,waitUntil:r.waitUntil,isMinimalMode:i});if(!q)return null;if((null==d||null==(o=d.value)?void 0:o.kind)!==w.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==d||null==(l=d.value)?void 0:l.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});i||t.setHeader("x-nextjs-cache",T?"REVALIDATED":d.isMiss?"MISS":d.isStale?"STALE":"HIT"),O&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let u=(0,h.fromNodeOutgoingHttpHeaders)(d.value.headers);return i&&q||u.delete(_.NEXT_CACHE_TAGS_HEADER),!d.cacheControl||t.getHeader("Cache-Control")||u.get("Cache-Control")||u.set("Cache-Control",(0,f.getCacheControlHeader)(d.cacheControl)),await (0,m.sendResponse)(K,Y,new Response(d.value.body,{headers:u,status:d.value.status||200})),null};F?await l(F):await j.withPropagatedContext(e.headers,()=>j.trace(u.BaseServerSpan.handleRequest,{spanName:`${L} ${y}`,kind:o.SpanKind.SERVER,attributes:{"http.method":L,"http.target":e.url}},l))}catch(t){if(t instanceof g.NoFallbackError||await C.onRequestError(e,t,{routerKind:"App Router",routePath:k,routeType:"route",revalidateReason:(0,p.getRevalidateReason)({isStaticGeneration:H,isOnDemandRevalidate:T})}),q)throw t;return await (0,m.sendResponse)(K,Y,new Response(null,{status:500})),null}}e.s(["handler",()=>N,"patchFetch",()=>b,"routeModule",()=>C,"serverHooks",()=>T,"workAsyncStorage",()=>A,"workUnitAsyncStorage",()=>E],87423)}];

//# sourceMappingURL=%5Broot-of-the-server%5D__84cff458._.js.map