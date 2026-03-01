module.exports=[18622,(e,t,r)=>{t.exports=e.x("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js"))},56704,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},32319,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},24725,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/after-task-async-storage.external.js",()=>require("next/dist/server/app-render/after-task-async-storage.external.js"))},93695,(e,t,r)=>{t.exports=e.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},89660,e=>{"use strict";e.i(94879);var t=e.i(87022),r=e.i(93458);async function a(){let e=await (0,r.cookies)();return(0,t.createServerClient)("http://localhost:54321","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxvY2FsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDQwNjcyMDAsImV4cCI6MjAxOTY0MzIwMH0.local",{cookies:{getAll:()=>e.getAll(),setAll(t){try{t.forEach(({name:t,value:r,options:a})=>e.set(t,r,a))}catch{}}}})}e.s(["createClient",()=>a])},97953,(e,t,r)=>{"use strict";t.exports=e.r(42315).vendored["react-rsc"].ReactServerDOMTurbopackServer},45015,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"registerServerReference",{enumerable:!0,get:function(){return a.registerServerReference}});let a=e.r(97953)},95975,(e,t,r)=>{"use strict";function a(e){for(let t=0;t<e.length;t++){let r=e[t];if("function"!=typeof r)throw Object.defineProperty(Error(`A "use server" file can only export async functions, found ${typeof r}.
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
`,p=await i.chat.completions.create({model:"gpt-4o",messages:[{role:"system",content:o},{role:"user",content:d}],temperature:.7}),f=p.choices[0]?.message?.content||"",m=f,h={},_=f.match(/\{[\s\S]*\}$/);if(_)try{h=JSON.parse(_[0]),m=f.replace(_[0],"").trim()}catch(e){console.error("Failed to parse JSON from agent response",e)}let g=h.extractedData||{},w=h.callIntent||{action:"none"},y={};g.service_type&&(y.motivation=g.service_type),g.urgency&&(y.timeline=g.urgency),g.property_type&&(y.property_condition=g.property_type);let v=e.conversation_state;return"update_lead_status"===w.action&&w.lead_status&&(v=w.lead_status),{message:m,updatedLead:y,newState:v,modelUsed:"gpt-4o",escalated:!1,callIntent:w}}async function d(e,t){let r=e.motivation||"your project";return`Hi ${e.name}, this is ${t.company_name}. We're offering priority scheduling this week — still need help with ${r}?`}async function p(e,t){return`Hi ${e.name}, just checking back to see if you still need help? Let us know!`}e.s(["generateAgentResponse",()=>u,"generateFollowUp",()=>p,"generateInitialOutreach",()=>d,"getAgentConfig",()=>l],66893)},22474,e=>{"use strict";var t=e.i(45015),r=e.i(89660),a=e.i(66893),n=e.i(95975);let s=[{day:1,message:"Hi [NAME], just checking back — did you still need help with [SERVICE_TYPE]? We have openings this week."},{day:3,message:"Hey [NAME], we offer free estimates and a 100% satisfaction guarantee. Let me know if you want to get this sorted!"},{day:5,message:"Check out what our neighbors are saying: 'Best service in town!' ⭐⭐⭐⭐⭐. We'd love to help you too."},{day:7,message:"I don't want to bother you! I'll close this file for now, but feel free to text back if you need us later."}];async function o(e,t){let a=await (0,r.createClient)();try{let{data:r,error:n}=await a.from("leads").select("*").eq("id",e).single();if(n||!r)return{success:!1,error:"Lead not found"};let o=s.map((r,a)=>{let n=new Date;return n.setDate(n.getDate()+r.day),n.setHours(9,0,0,0),{lead_id:e,sequence_number:a+1,scheduled_for:n.toISOString(),status:"pending",attempts:0,next_attempt_at:null,reason:t?.reason||null,next_action:t?.next_action||null}}),{error:i}=await a.from("follow_up_sequences").insert(o);if(i)return{success:!1,error:i.message};return{success:!0}}catch(e){return{success:!1,error:String(e)}}}async function i(e=50){let t=await (0,r.createClient)(),n=new Date().toISOString(),o=Number((await (0,a.getAgentConfig)()).followup_max_attempts??process.env.FOLLOWUP_MAX_ATTEMPTS??3),{data:l,error:c}=await t.from("follow_up_sequences").select(`
      id,
      lead_id,
      sequence_number,
      scheduled_for,
      attempts,
      next_attempt_at,
      leads(name, phone_number, address, motivation)
    `).eq("status","pending").lte("scheduled_for",n).lt("attempts",o).or(`next_attempt_at.is.null,next_attempt_at.lte.${n}`).limit(e).order("scheduled_for",{ascending:!0});return c?(console.error("Error fetching pending follow-ups:",c),[]):(l||[]).map(e=>{let t=s[e.sequence_number-1]?.message||"Just checking in!",r=e.leads?.name||"there",a=e.leads?.motivation||"your project",n=e.leads?.address||"";return t=(t=(t=t.replace("[NAME]",r)).replace("[SERVICE_TYPE]",a)).replace("[ADDRESS]",n),{id:e.id,lead_id:e.lead_id,lead_name:e.leads?.name||"Unknown",phone_number:e.leads?.phone_number||"",address:e.leads?.address||"",sequence_number:e.sequence_number,message:t,scheduled_for:e.scheduled_for,attempts:e.attempts||0}})}async function l(e){let t=await (0,r.createClient)(),{error:a}=await t.from("follow_up_sequences").update({status:"sent",sent_at:new Date().toISOString()}).eq("id",e);return a?{success:!1,error:a.message}:{success:!0}}async function c(e,t){let a=await (0,r.createClient)(),{data:n}=await a.from("follow_up_sequences").select("attempts").eq("id",e).single(),s=(n?.attempts||0)+1,{error:o}=await a.from("follow_up_sequences").update({attempts:s,next_attempt_at:new Date(Date.now()+9e5).toISOString()}).eq("id",e);return o?{success:!1,error:o.message}:{success:!0}}async function u(e){let t=await (0,r.createClient)(),{error:a}=await t.from("follow_up_sequences").update({status:"skipped"}).eq("id",e);return a?{success:!1,error:a.message}:{success:!0}}async function d(e){let t=await (0,r.createClient)(),{data:a,error:n}=await t.from("follow_up_sequences").select("*").eq("lead_id",e).order("sequence_number",{ascending:!0});return n?(console.error("Error fetching follow-up sequence:",n),[]):a}(0,n.ensureServerEntryExports)([o,i,l,c,u,d]),(0,t.registerServerReference)(o,"607ef9401785a2e20d13216a527e9287cad122bfd4",null),(0,t.registerServerReference)(i,"4011e7d4b467062dc4ffc7b5151ee030903a676fa4",null),(0,t.registerServerReference)(l,"40e04df19031446cc5d1704ec213d4d73b49579d56",null),(0,t.registerServerReference)(c,"60a60653e823c0382a2c8e52897b4288a80456757e",null),(0,t.registerServerReference)(u,"408f83f28597b3e896aa701837e05bb9b78e24a530",null),(0,t.registerServerReference)(d,"40f79f7dc74cb3f6da3be42dfb1279c2812b71aeb4",null),e.s(["getPendingFollowUps",()=>i,"markFollowUpAsSent",()=>l,"markFollowUpFailed",()=>c,"scheduleFollowUpSequence",()=>o])},62111,e=>{"use strict";var t=e.i(47909),r=e.i(74017),a=e.i(96250),n=e.i(59756),s=e.i(61916),o=e.i(14444),i=e.i(37092),l=e.i(69741),c=e.i(16795),u=e.i(87718),d=e.i(95169),p=e.i(47587),f=e.i(66012),m=e.i(70101),h=e.i(26937),_=e.i(10372),g=e.i(93695);e.i(52474);var w=e.i(5232),y=e.i(89171),v=e.i(22474);async function R(e){try{let{leadId:t,reason:r,next_action:a}=await e.json();if(!t)return y.NextResponse.json({success:!1,error:"leadId required"},{status:400});let n=await (0,v.scheduleFollowUpSequence)(t,{reason:r,next_action:a});if(!n.success)return y.NextResponse.json(n,{status:500});return y.NextResponse.json({success:!0})}catch(e){return y.NextResponse.json({success:!1,error:"Failed to schedule"},{status:500})}}e.s(["POST",()=>R],82777);var x=e.i(82777);let S=new t.AppRouteRouteModule({definition:{kind:r.RouteKind.APP_ROUTE,page:"/api/followup/schedule/route",pathname:"/api/followup/schedule",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/app/api/followup/schedule/route.ts",nextConfigOutput:"",userland:x}),{workAsyncStorage:b,workUnitAsyncStorage:E,serverHooks:I}=S;function O(){return(0,a.patchFetch)({workAsyncStorage:b,workUnitAsyncStorage:E})}async function C(e,t,a){S.isDev&&(0,n.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let y="/api/followup/schedule/route";y=y.replace(/\/index$/,"")||"/";let v=await S.prepare(e,t,{srcPage:y,multiZoneDraftMode:!1});if(!v)return t.statusCode=400,t.end("Bad Request"),null==a.waitUntil||a.waitUntil.call(a,Promise.resolve()),null;let{buildId:R,params:x,nextConfig:b,parsedUrl:E,isDraftMode:I,prerenderManifest:O,routerServerContext:C,isOnDemandRevalidate:A,revalidateOnlyGenerated:k,resolvedPathname:N,clientReferenceManifest:T,serverActionsManifest:q}=v,D=(0,l.normalizeAppPath)(y),P=!!(O.dynamicRoutes[D]||O.routes[N]),M=async()=>((null==C?void 0:C.render404)?await C.render404(e,t,E,!1):t.end("This page could not be found"),null);if(P&&!I){let e=!!O.routes[N],t=O.dynamicRoutes[D];if(t&&!1===t.fallback&&!e){if(b.experimental.adapterPath)return await M();throw new g.NoFallbackError}}let j=null;!P||S.isDev||I||(j="/index"===(j=N)?"/":j);let U=!0===S.isDev||!P,$=P&&!U;q&&T&&(0,o.setReferenceManifestsSingleton)({page:y,clientReferenceManifest:T,serverActionsManifest:q,serverModuleMap:(0,i.createServerModuleMap)({serverActionsManifest:q})});let H=e.method||"GET",L=(0,s.getTracer)(),F=L.getActiveScopeSpan(),B={params:x,prerenderManifest:O,renderOpts:{experimental:{authInterrupts:!!b.experimental.authInterrupts},cacheComponents:!!b.cacheComponents,supportsDynamicResponse:U,incrementalCache:(0,n.getRequestMeta)(e,"incrementalCache"),cacheLifeProfiles:b.cacheLife,waitUntil:a.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,r,a)=>S.onRequestError(e,t,a,C)},sharedContext:{buildId:R}},Y=new c.NodeNextRequest(e),K=new c.NodeNextResponse(t),G=u.NextRequestAdapter.fromNodeNextRequest(Y,(0,u.signalFromNodeResponse)(t));try{let o=async e=>S.handle(G,B).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let r=L.getRootSpanAttributes();if(!r)return;if(r.get("next.span_type")!==d.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${r.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let a=r.get("next.route");if(a){let t=`${H} ${a}`;e.setAttributes({"next.route":a,"http.route":a,"next.span_name":t}),e.updateName(t)}else e.updateName(`${H} ${y}`)}),i=!!(0,n.getRequestMeta)(e,"minimalMode"),l=async n=>{var s,l;let c=async({previousCacheEntry:r})=>{try{if(!i&&A&&k&&!r)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let s=await o(n);e.fetchMetrics=B.renderOpts.fetchMetrics;let l=B.renderOpts.pendingWaitUntil;l&&a.waitUntil&&(a.waitUntil(l),l=void 0);let c=B.renderOpts.collectedTags;if(!P)return await (0,f.sendResponse)(Y,K,s,B.renderOpts.pendingWaitUntil),null;{let e=await s.blob(),t=(0,m.toNodeOutgoingHttpHeaders)(s.headers);c&&(t[_.NEXT_CACHE_TAGS_HEADER]=c),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let r=void 0!==B.renderOpts.collectedRevalidate&&!(B.renderOpts.collectedRevalidate>=_.INFINITE_CACHE)&&B.renderOpts.collectedRevalidate,a=void 0===B.renderOpts.collectedExpire||B.renderOpts.collectedExpire>=_.INFINITE_CACHE?void 0:B.renderOpts.collectedExpire;return{value:{kind:w.CachedRouteKind.APP_ROUTE,status:s.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:r,expire:a}}}}catch(t){throw(null==r?void 0:r.isStale)&&await S.onRequestError(e,t,{routerKind:"App Router",routePath:y,routeType:"route",revalidateReason:(0,p.getRevalidateReason)({isStaticGeneration:$,isOnDemandRevalidate:A})},C),t}},u=await S.handleResponse({req:e,nextConfig:b,cacheKey:j,routeKind:r.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:O,isRoutePPREnabled:!1,isOnDemandRevalidate:A,revalidateOnlyGenerated:k,responseGenerator:c,waitUntil:a.waitUntil,isMinimalMode:i});if(!P)return null;if((null==u||null==(s=u.value)?void 0:s.kind)!==w.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==u||null==(l=u.value)?void 0:l.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});i||t.setHeader("x-nextjs-cache",A?"REVALIDATED":u.isMiss?"MISS":u.isStale?"STALE":"HIT"),I&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let d=(0,m.fromNodeOutgoingHttpHeaders)(u.value.headers);return i&&P||d.delete(_.NEXT_CACHE_TAGS_HEADER),!u.cacheControl||t.getHeader("Cache-Control")||d.get("Cache-Control")||d.set("Cache-Control",(0,h.getCacheControlHeader)(u.cacheControl)),await (0,f.sendResponse)(Y,K,new Response(u.value.body,{headers:d,status:u.value.status||200})),null};F?await l(F):await L.withPropagatedContext(e.headers,()=>L.trace(d.BaseServerSpan.handleRequest,{spanName:`${H} ${y}`,kind:s.SpanKind.SERVER,attributes:{"http.method":H,"http.target":e.url}},l))}catch(t){if(t instanceof g.NoFallbackError||await S.onRequestError(e,t,{routerKind:"App Router",routePath:D,routeType:"route",revalidateReason:(0,p.getRevalidateReason)({isStaticGeneration:$,isOnDemandRevalidate:A})}),P)throw t;return await (0,f.sendResponse)(Y,K,new Response(null,{status:500})),null}}e.s(["handler",()=>C,"patchFetch",()=>O,"routeModule",()=>S,"serverHooks",()=>I,"workAsyncStorage",()=>b,"workUnitAsyncStorage",()=>E],62111)}];

//# sourceMappingURL=%5Broot-of-the-server%5D__a5f91270._.js.map