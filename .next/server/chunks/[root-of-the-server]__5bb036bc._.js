module.exports=[18622,(e,t,r)=>{t.exports=e.x("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js"))},56704,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},32319,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},24725,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/after-task-async-storage.external.js",()=>require("next/dist/server/app-render/after-task-async-storage.external.js"))},93695,(e,t,r)=>{t.exports=e.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},89660,e=>{"use strict";e.i(94879);var t=e.i(87022),r=e.i(93458);async function a(){let e=await (0,r.cookies)();return(0,t.createServerClient)("http://localhost:54321","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxvY2FsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDQwNjcyMDAsImV4cCI6MjAxOTY0MzIwMH0.local",{cookies:{getAll:()=>e.getAll(),setAll(t){try{t.forEach(({name:t,value:r,options:a})=>e.set(t,r,a))}catch{}}}})}e.s(["createClient",()=>a])},14747,(e,t,r)=>{t.exports=e.x("path",()=>require("path"))},24361,(e,t,r)=>{t.exports=e.x("util",()=>require("util"))},22734,(e,t,r)=>{t.exports=e.x("fs",()=>require("fs"))},32721,e=>{"use strict";var t=e.i(74461),r=e.i(89660);let a=process.env.TWILIO_ACCOUNT_SID,n=process.env.TWILIO_AUTH_TOKEN,s=process.env.TWILIO_PHONE_NUMBER,o=process.env.TWILIO_CALLER_ID,i=(process.env.TWILIO_NUMBER_POOL||"").split(",").map(e=>e.trim()).filter(e=>e.length>0),l=Number(process.env.SMS_MONTHLY_LIMIT_PER_NUMBER||1e4);async function c(){let e=i.length>0?i:s?[s]:[];if(0===e.length)return[];try{let t,a=await (0,r.createClient)(),{data:n}=await a.from("call_events").select("event_data, created_at").eq("event_type","sms_sent").gte("created_at",((t=new Date).setDate(1),t.setHours(0,0,0,0),t.toISOString())),s={};for(let e of n||[]){let t=e.event_data?.from;"string"==typeof t&&(s[t]=(s[t]||0)+1)}return e.filter(e=>(s[e]||0)<l).sort((e,t)=>(s[e]||0)-(s[t]||0))}catch{return e}}function u(){return a&&n?(0,t.default)(a,n):(console.warn("Twilio credentials not configured"),null)}function d(){if(o&&o.length>0)return o;let e=i.length>0?i:s?[s]:[];return e.length>0?e[0]:null}async function p(e,t,a){let n=u();if(!n){let r=a?.withFooter??!0?"\n\nReply STOP to unsubscribe":"",n=`${t}${r}`;return console.log(`[MOCK SMS] To: ${e}
Message: ${n}`),{sid:`mock_${Date.now()}`,error:null}}let s=Number(process.env.SMS_QUIET_HOURS_START||8),o=Number(process.env.SMS_QUIET_HOURS_END||21),i=new Date().getHours();if(i<s||i>=o)return{sid:null,error:"Quiet hours active; message not sent"};if(!a?.bypassSuppression)try{let t=await (0,r.createClient)(),a=e.replace(/\D/g,"");10===a.length?a=`+1${a}`:11===a.length&&a.startsWith("1")?a=`+${a}`:a.startsWith("+")||(a=`+${a}`);let{data:n}=await t.from("leads").select("*").eq("phone_number",a).single();if(n&&n.is_opted_out)return{sid:null,error:"Recipient has opted out"}}catch{}let l=await c();if(0===l.length)return{sid:null,error:"No available Twilio sender number (check pool or config)"};try{try{let e=await (0,r.createClient)(),t=new Date(Date.now()-6e4).toISOString(),{count:a}=await e.from("sms_events").select("id",{count:"exact",head:!0}).gte("created_at",t),n=Number(process.env.SMS_RATE_LIMIT_PER_MIN||25);if((a||0)>=n)return{sid:null,error:"Rate limit exceeded, try later"}}catch{}let s=[];try{let e=await (0,r.createClient)(),{data:t}=await e.from("agent_config").select("*").limit(1).single(),a=t?.company_name||"Your Company";s.push(`${a}: real estate lead generation`)}catch{s.push("Real estate lead generation")}s.push("Msg & data rates may apply"),s.push("Reply HELP for help"),s.push("Reply STOP to unsubscribe");let o=s.join(" • "),i=a?.withFooter??!0?`

${o}`:"",c=`${t}${i}`,u=null;for(let a of l)try{let s=await n.messages.create({body:c,from:a,to:e,statusCallback:"http://localhost:3000/api/twilio/status"});try{let n=await (0,r.createClient)();await n.from("sms_events").insert({sid:s.sid,to_number:e,from_number:a,status:"sent",error:null,body:t})}catch{}return{sid:s.sid,error:null}}catch(e){u=e?.message?String(e.message):"Failed to send SMS";continue}try{let a=await (0,r.createClient)();await a.from("sms_events").insert({sid:null,to_number:e,from_number:l[0],status:"failed",error:u||"Failed to send SMS",body:t})}catch{}return{sid:null,error:u||"Failed to send SMS"}}catch(e){return console.error("Error sending SMS:",e),{sid:null,error:e instanceof Error?e.message:"Failed to send SMS"}}}function h(e,r,a){return!n||t.default.validateRequest(n,e,r,a)}e.s(["chooseCallerId",()=>d,"eligibleNumbersSorted",()=>c,"getTwilioClient",()=>u,"sendSMS",()=>p,"validateTwilioRequest",()=>h])},97953,(e,t,r)=>{"use strict";t.exports=e.r(42315).vendored["react-rsc"].ReactServerDOMTurbopackServer},45015,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"registerServerReference",{enumerable:!0,get:function(){return a.registerServerReference}});let a=e.r(97953)},95975,(e,t,r)=>{"use strict";function a(e){for(let t=0;t<e.length;t++){let r=e[t];if("function"!=typeof r)throw Object.defineProperty(Error(`A "use server" file can only export async functions, found ${typeof r}.
Read more: https://nextjs.org/docs/messages/invalid-use-server-value`),"__NEXT_ERROR_CODE",{value:"E352",enumerable:!1,configurable:!0})}}Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"ensureServerEntryExports",{enumerable:!0,get:function(){return a}})},66893,56542,e=>{"use strict";var t=e.i(89660);e.i(89228);var r=e.i(91601);async function a(e=3){let t=[],r=new Date(new Date);r.setDate(r.getDate()+1),r.setHours(9,0,0,0);let n=0;for(;n<e;){if(0===r.getDay()||6===r.getDay()){r.setDate(r.getDate()+1);continue}for(let e of[9,13,15]){let a=new Date(r);a.setHours(e,0,0,0);let n=new Date(a);n.setHours(e+1,0,0,0),t.push({start:a.toISOString(),end:n.toISOString()})}r.setDate(r.getDate()+1),n++}return t}function n(e){return e.map(e=>new Date(e.start).toLocaleString("en-US",{weekday:"long",month:"short",day:"numeric",hour:"numeric",minute:"2-digit"})).join("\n- ")}async function s(e,r,a){let n=await (0,t.createClient)();console.log(`[BOOKING CREATED] Lead: ${e}, Time: ${r}, Desc: ${a}`);let{data:s}=await n.from("leads").select("notes").eq("id",e).single(),o=(s?.notes||"")+`

[BOOKING CONFIRMED] ${r} - ${a}`;return await n.from("leads").update({notes:o}).eq("id",e),{success:!0}}e.s(["createBooking",()=>s,"formatSlotsForPrompt",()=>n,"getNextAvailableSlots",()=>a],56542);let o=`You are the AI Receptionist & Booking Agent for a local service business (e.g., Roofing, HVAC, Med Spa).
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
`,i=new r.default({apiKey:process.env.OPENAI_API_KEY});async function l(){let e=await (0,t.createClient)(),{data:r,error:a}=await e.from("agent_config").select("*").single();return a||!r?{id:"",company_name:"Service Business",wholesaling_fee:0,arv_multiplier:0,follow_up_hours:24,max_follow_ups:3,followup_backoff_minutes:15,followup_max_attempts:3,llm_cache_enabled:!0,llm_cache_confidence_floor:.85,llm_cache_ttl_faq_days:30,llm_cache_ttl_objection_days:14,auto_dispo_eval_enabled:!1,auto_renegotiate_days_threshold:5,auto_cancel_days_threshold:10,auto_dispo_require_human_confirm:!0,created_at:new Date().toISOString(),updated_at:new Date().toISOString()}:r}async function c(e){let r=await (0,t.createClient)(),{data:a,error:n}=await r.from("messages").select("*").eq("lead_id",e).order("created_at",{ascending:!0});return n?(console.error("Error fetching conversation history:",n),[]):a}async function u(e,t,r){let s=await c(e.id),l=n(await a()),u=s.map(e=>`${"inbound"===e.direction?"Customer":"Agent"}: ${e.content}`).join("\n"),d=`
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
${u}
Customer: ${t}

Provide the next SMS response and the JSON data at the end.
`,p=await i.chat.completions.create({model:"gpt-4o",messages:[{role:"system",content:o},{role:"user",content:d}],temperature:.7}),h=p.choices[0]?.message?.content||"",f=h,m={},_=h.match(/\{[\s\S]*\}$/);if(_)try{m=JSON.parse(_[0]),f=h.replace(_[0],"").trim()}catch(e){console.error("Failed to parse JSON from agent response",e)}let g=m.extractedData||{},y=m.callIntent||{action:"none"},v={};g.service_type&&(v.motivation=g.service_type),g.urgency&&(v.timeline=g.urgency),g.property_type&&(v.property_condition=g.property_type);let w=e.conversation_state;return"update_lead_status"===y.action&&y.lead_status&&(w=y.lead_status),{message:f,updatedLead:v,newState:w,modelUsed:"gpt-4o",escalated:!1,callIntent:y}}async function d(e,t){let r=e.motivation||"your project";return`Hi ${e.name}, this is ${t.company_name}. We're offering priority scheduling this week — still need help with ${r}?`}async function p(e,t){return`Hi ${e.name}, just checking back to see if you still need help? Let us know!`}e.s(["generateAgentResponse",()=>u,"generateFollowUp",()=>p,"generateInitialOutreach",()=>d,"getAgentConfig",()=>l],66893)},93012,e=>{"use strict";var t=e.i(47909),r=e.i(74017),a=e.i(96250),n=e.i(59756),s=e.i(61916),o=e.i(14444),i=e.i(37092),l=e.i(69741),c=e.i(16795),u=e.i(87718),d=e.i(95169),p=e.i(47587),h=e.i(66012),f=e.i(70101),m=e.i(26937),_=e.i(10372),g=e.i(93695);e.i(52474);var y=e.i(5232),v=e.i(89171),w=e.i(54233),R=e.i(66893),S=e.i(32721),x=e.i(89660);async function I(e){try{let{leadId:t}=await e.json();if(!t)return v.NextResponse.json({error:"Lead ID required"},{status:400});let r=await (0,x.createClient)(),{data:a,error:n}=await r.from("leads").select("*").eq("id",t).single();if(n||!a)return v.NextResponse.json({error:"Lead not found"},{status:404});if("cold_lead"!==a.conversation_state)return v.NextResponse.json({error:"Lead has already been contacted",state:a.conversation_state},{status:400});let s=await (0,R.getAgentConfig)(),o=await (0,R.generateInitialOutreach)(a,s),{sid:i,error:l}=await (0,S.sendSMS)(a.phone_number,o);if(l)return v.NextResponse.json({error:l},{status:500});return await (0,w.saveMessage)({lead_id:a.id,direction:"outbound",content:o,twilio_sid:i||void 0}),await (0,w.updateLead)(a.id,{conversation_state:"contacted",last_message_at:new Date().toISOString()}),v.NextResponse.json({success:!0,message:o,messageSid:i})}catch(e){return console.error("Error sending outreach:",e),v.NextResponse.json({error:"Failed to send outreach"},{status:500})}}e.s(["POST",()=>I],84985);var O=e.i(84985);let E=new t.AppRouteRouteModule({definition:{kind:r.RouteKind.APP_ROUTE,page:"/api/send-outreach/route",pathname:"/api/send-outreach",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/app/api/send-outreach/route.ts",nextConfigOutput:"",userland:O}),{workAsyncStorage:b,workUnitAsyncStorage:C,serverHooks:T}=E;function A(){return(0,a.patchFetch)({workAsyncStorage:b,workUnitAsyncStorage:C})}async function N(e,t,a){E.isDev&&(0,n.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let v="/api/send-outreach/route";v=v.replace(/\/index$/,"")||"/";let w=await E.prepare(e,t,{srcPage:v,multiZoneDraftMode:!1});if(!w)return t.statusCode=400,t.end("Bad Request"),null==a.waitUntil||a.waitUntil.call(a,Promise.resolve()),null;let{buildId:R,params:S,nextConfig:x,parsedUrl:I,isDraftMode:O,prerenderManifest:b,routerServerContext:C,isOnDemandRevalidate:T,revalidateOnlyGenerated:A,resolvedPathname:N,clientReferenceManifest:M,serverActionsManifest:D}=w,k=(0,l.normalizeAppPath)(v),P=!!(b.dynamicRoutes[k]||b.routes[N]),$=async()=>((null==C?void 0:C.render404)?await C.render404(e,t,I,!1):t.end("This page could not be found"),null);if(P&&!O){let e=!!b.routes[N],t=b.dynamicRoutes[k];if(t&&!1===t.fallback&&!e){if(x.experimental.adapterPath)return await $();throw new g.NoFallbackError}}let q=null;!P||E.isDev||O||(q="/index"===(q=N)?"/":q);let j=!0===E.isDev||!P,L=P&&!j;D&&M&&(0,o.setReferenceManifestsSingleton)({page:v,clientReferenceManifest:M,serverActionsManifest:D,serverModuleMap:(0,i.createServerModuleMap)({serverActionsManifest:D})});let U=e.method||"GET",H=(0,s.getTracer)(),F=H.getActiveScopeSpan(),B={params:S,prerenderManifest:b,renderOpts:{experimental:{authInterrupts:!!x.experimental.authInterrupts},cacheComponents:!!x.cacheComponents,supportsDynamicResponse:j,incrementalCache:(0,n.getRequestMeta)(e,"incrementalCache"),cacheLifeProfiles:x.cacheLife,waitUntil:a.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,r,a)=>E.onRequestError(e,t,a,C)},sharedContext:{buildId:R}},K=new c.NodeNextRequest(e),Y=new c.NodeNextResponse(t),W=u.NextRequestAdapter.fromNodeNextRequest(K,(0,u.signalFromNodeResponse)(t));try{let o=async e=>E.handle(W,B).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let r=H.getRootSpanAttributes();if(!r)return;if(r.get("next.span_type")!==d.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${r.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let a=r.get("next.route");if(a){let t=`${U} ${a}`;e.setAttributes({"next.route":a,"http.route":a,"next.span_name":t}),e.updateName(t)}else e.updateName(`${U} ${v}`)}),i=!!(0,n.getRequestMeta)(e,"minimalMode"),l=async n=>{var s,l;let c=async({previousCacheEntry:r})=>{try{if(!i&&T&&A&&!r)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let s=await o(n);e.fetchMetrics=B.renderOpts.fetchMetrics;let l=B.renderOpts.pendingWaitUntil;l&&a.waitUntil&&(a.waitUntil(l),l=void 0);let c=B.renderOpts.collectedTags;if(!P)return await (0,h.sendResponse)(K,Y,s,B.renderOpts.pendingWaitUntil),null;{let e=await s.blob(),t=(0,f.toNodeOutgoingHttpHeaders)(s.headers);c&&(t[_.NEXT_CACHE_TAGS_HEADER]=c),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let r=void 0!==B.renderOpts.collectedRevalidate&&!(B.renderOpts.collectedRevalidate>=_.INFINITE_CACHE)&&B.renderOpts.collectedRevalidate,a=void 0===B.renderOpts.collectedExpire||B.renderOpts.collectedExpire>=_.INFINITE_CACHE?void 0:B.renderOpts.collectedExpire;return{value:{kind:y.CachedRouteKind.APP_ROUTE,status:s.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:r,expire:a}}}}catch(t){throw(null==r?void 0:r.isStale)&&await E.onRequestError(e,t,{routerKind:"App Router",routePath:v,routeType:"route",revalidateReason:(0,p.getRevalidateReason)({isStaticGeneration:L,isOnDemandRevalidate:T})},C),t}},u=await E.handleResponse({req:e,nextConfig:x,cacheKey:q,routeKind:r.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:b,isRoutePPREnabled:!1,isOnDemandRevalidate:T,revalidateOnlyGenerated:A,responseGenerator:c,waitUntil:a.waitUntil,isMinimalMode:i});if(!P)return null;if((null==u||null==(s=u.value)?void 0:s.kind)!==y.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==u||null==(l=u.value)?void 0:l.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});i||t.setHeader("x-nextjs-cache",T?"REVALIDATED":u.isMiss?"MISS":u.isStale?"STALE":"HIT"),O&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let d=(0,f.fromNodeOutgoingHttpHeaders)(u.value.headers);return i&&P||d.delete(_.NEXT_CACHE_TAGS_HEADER),!u.cacheControl||t.getHeader("Cache-Control")||d.get("Cache-Control")||d.set("Cache-Control",(0,m.getCacheControlHeader)(u.cacheControl)),await (0,h.sendResponse)(K,Y,new Response(u.value.body,{headers:d,status:u.value.status||200})),null};F?await l(F):await H.withPropagatedContext(e.headers,()=>H.trace(d.BaseServerSpan.handleRequest,{spanName:`${U} ${v}`,kind:s.SpanKind.SERVER,attributes:{"http.method":U,"http.target":e.url}},l))}catch(t){if(t instanceof g.NoFallbackError||await E.onRequestError(e,t,{routerKind:"App Router",routePath:k,routeType:"route",revalidateReason:(0,p.getRevalidateReason)({isStaticGeneration:L,isOnDemandRevalidate:T})}),P)throw t;return await (0,h.sendResponse)(K,Y,new Response(null,{status:500})),null}}e.s(["handler",()=>N,"patchFetch",()=>A,"routeModule",()=>E,"serverHooks",()=>T,"workAsyncStorage",()=>b,"workUnitAsyncStorage",()=>C],93012)}];

//# sourceMappingURL=%5Broot-of-the-server%5D__5bb036bc._.js.map