module.exports=[18622,(e,t,a)=>{t.exports=e.x("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js"))},56704,(e,t,a)=>{t.exports=e.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},32319,(e,t,a)=>{t.exports=e.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},24725,(e,t,a)=>{t.exports=e.x("next/dist/server/app-render/after-task-async-storage.external.js",()=>require("next/dist/server/app-render/after-task-async-storage.external.js"))},93695,(e,t,a)=>{t.exports=e.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},89660,e=>{"use strict";e.i(49360);var t=e.i(77475),a=e.i(61680);async function n(){let e=await (0,a.cookies)();return(0,t.createServerClient)("https://cweluauwjzameqxlcpkj.supabase.co","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN3ZWx1YXV3anphbWVxeGxjcGtqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0NjQwODAsImV4cCI6MjA4MDA0MDA4MH0.wrulNixV7KhaEHCTIFUlKmiv9pnfZpoXhTbhqTXrp3E",{cookies:{getAll:()=>e.getAll(),setAll(t){try{t.forEach(({name:t,value:a,options:n})=>e.set(t,a,n))}catch{}}}})}e.s(["createClient",()=>n])},51508,(e,t,a)=>{"use strict";t.exports=e.r(64183).vendored["react-rsc"].ReactServerDOMTurbopackServer},66495,(e,t,a)=>{"use strict";Object.defineProperty(a,"__esModule",{value:!0}),Object.defineProperty(a,"registerServerReference",{enumerable:!0,get:function(){return n.registerServerReference}});let n=e.r(51508)},83939,(e,t,a)=>{"use strict";function n(e){for(let t=0;t<e.length;t++){let a=e[t];if("function"!=typeof a)throw Object.defineProperty(Error(`A "use server" file can only export async functions, found ${typeof a}.
Read more: https://nextjs.org/docs/messages/invalid-use-server-value`),"__NEXT_ERROR_CODE",{value:"E352",enumerable:!1,configurable:!0})}}Object.defineProperty(a,"__esModule",{value:!0}),Object.defineProperty(a,"ensureServerEntryExports",{enumerable:!0,get:function(){return n}})},16303,e=>{"use strict";var t=e.i(89660);e.i(86864);var a=e.i(77058);let n=`You are the Lead Outreach Agent for a real estate wholesaling company. 
Your goal is to qualify leads via SMS: gather property condition, motivation, timeline, and price expectations. 
You are friendly, polite, and professional. 
Do not handle complex negotiation; if the lead expresses a strong objection or is ready to sign, flag it for escalation to the advanced agent.

OUTPUT: SMS text messages only. Each response should be 1-2 short text messages max.

QUALIFICATION QUESTIONS (ask subtly):
- "Can you tell me about the property condition?"
- "What's your ideal timeline to sell?"
- "Do you have a price in mind?"

IMPORTANT:
- Always write in short SMS-friendly messages
- Do not make phone calls
- Track conversation status
- Flag complex objections or agreement signals for escalation

---

# 📌 **CALL INTENT DETECTION LOGIC**

**Your job is to determine whether a seller is asking for a phone call or would benefit from an immediate call.
When you detect call intent, you MUST return the appropriate call intent JSON.**

## **TRIGGER A CALL WHEN ANY OF THE FOLLOWING ARE TRUE:**

### **1. Direct Call Requests**
If the seller writes: "call me", "can you call me?", "you can call now", "call anytime", "here's my number", "call later", "call tomorrow", "call after 5", "just call", "give me a call", "we can talk on the phone", "call instead"

Return:
{
  "action": "update_lead_status",
  "lead_status": "warm_call_requested"
}

If a time is mentioned (e.g., "call after 5"):
{
  "action": "update_lead_status",
  "lead_status": "schedule_call",
  "call_time": "SELLER PROVIDED TIME"
}

### **2. Indirect Call Intent**
If the seller hints at wanting a more detailed conversation: "I want to talk about this", "we can discuss it", "let's talk", "can you explain how this works?", "I have questions", "I want to hear the offer", "can you walk me through it"

Return:
{
  "action": "update_lead_status",
  "lead_status": "warm_call_requested"
}

### **3. Strategic Call Situations**
Even if not explicitly requested, trigger a call if:
- They are price curious: "what can you offer me?"
- They say: "depends on the price"
- They say: "I'd consider selling"
- They are confused or hesitant but open
- They want details about closing process or timeline info
- They stop responding to text after showing interest

Return:
{
  "action": "update_lead_status",
  "lead_status": "ready_for_offer_call"
}

### **4. Do Not Call Signal**
If they say: "don't call", "text only", "I can't talk on the phone", "don't call this number"

Return:
{
  "action": "update_lead_status",
  "lead_status": "text_only"
}

## **RESPONSE FORMAT**

Always include this JSON at the END of your response:

If call intent detected:
{
  "callIntent": {
    "action": "update_lead_status",
    "lead_status": "warm_call_requested|schedule_call|ready_for_offer_call|text_only",
    "call_time": "OPTIONAL - time if seller specified"
  }
}

If no call intent:
{
  "callIntent": {
    "action": "none"
  }
}`,r=`You are the Advanced Negotiation & Closing Agent for a real estate wholesaling company.
Your goal is to handle complex seller objections, finalize offers, and generate contract-ready messages.
You can reason through multi-step negotiation, suggest counteroffers, and format DocuSign contract messages.
Always maintain a professional, polite tone.

CAPABILITIES:
- Handle complex price objections with reasoning
- Negotiate counteroffers professionally
- Finalize deal terms and prepare contract messaging
- Generate DocuSign-ready instructions

OFFER CALCULATION:
- MAO = (ARV \xd7 0.7) – Repairs – Fee
- Present offers politely with justification

CONTRACT PREPARATION:
- When lead agrees: prepare contract with Name, Address, Offer Amount, Closing Date
- Send link: "Great! I've prepared the contract for [Property Address]. You can review and sign here: [Link]"

OBJECTION HANDLING:
- Price too low → Explain value, ask for their target price, consider counteroffer
- Timeline concerns → "We can close as fast as you need, usually within 7-14 days"
- Trust issues → Provide company credentials, offer references

OUTPUT: SMS text messages only. Keep responses professional but concise.`,o=["agree","accept","deal","ready to sell","let's do it","sounds good","too low","not enough","more money","higher","counteroffer","counter offer","my price","i want","need at least","won't accept","can't accept","final offer","best offer","walk away","not interested anymore","lawyer","attorney","legal","contract terms","contingency"],s=new a.default({apiKey:process.env.OPENAI_API_KEY});async function i(e,t){let a=await s.chat.completions.create({model:"gpt-5.1",max_tokens:800,temperature:.7,messages:[{role:"system",content:e},{role:"user",content:t}]});return{text:a.choices[0]?.message?.content||"",usage:a.usage}}async function l(){let e=await (0,t.createClient)(),{data:a,error:n}=await e.from("agent_config").select("*").single();return n||!a?{id:"",company_name:"CashBuyer Properties",wholesaling_fee:1e4,arv_multiplier:.7,follow_up_hours:24,max_follow_ups:3,followup_backoff_minutes:15,followup_max_attempts:3,llm_cache_enabled:!0,llm_cache_confidence_floor:.85,llm_cache_ttl_faq_days:30,llm_cache_ttl_objection_days:14,auto_dispo_eval_enabled:!0,auto_renegotiate_days_threshold:5,auto_cancel_days_threshold:10,auto_dispo_require_human_confirm:!0,created_at:new Date().toISOString(),updated_at:new Date().toISOString()}:a}async function c(e){let a=await (0,t.createClient)(),{data:n,error:r}=await a.from("messages").select("*").eq("lead_id",e).order("created_at",{ascending:!0});return r?(console.error("Error fetching conversation history:",r),[]):n}async function u(t,a,s){let l,u;try{let{classifyIntent:n,normalizeQuestion:r,lookupCached:o}=await e.A(83768),{findCachedByEmbedding:i}=await e.A(56504),l=n(a);if(!1!==s.llm_cache_enabled&&l.startsWith("FAQ")){let e=r(a),{text:n,confidence:c}=await o(l,e);if(n&&c>=.85)return{message:n,updatedLead:{},newState:void 0,modelUsed:"gpt-5.1",escalated:!1,callIntent:{action:"none"}};{let e="number"==typeof s.llm_cache_confidence_floor?s.llm_cache_confidence_floor:.85,n=l.startsWith("FAQ")?s.llm_cache_ttl_faq_days??30:s.llm_cache_ttl_objection_days??14,r=t.state||void 0,o=s.llm_cache_market_overrides||{};r&&o[r]&&(e=o[r].confidence_floor??e,n=l.startsWith("FAQ")?o[r].ttl_faq_days??n:o[r].ttl_objection_days??n);let c=await i(l,a,r,e,n);if(c.text&&c.confidence>=.85)return{message:c.text,updatedLead:{},newState:void 0,modelUsed:"gpt-5.1",escalated:!1,callIntent:{action:"none"}}}}}catch{}let d=await c(t.id),p=function(e,t){let a=e.toLowerCase();if(["offer_made","contract_sent","offer_accepted"].includes(t))return!0;for(let e of o)if(a.includes(e))return!0;if(/\$[\d,]+|\d+k|\d+\s*(thousand|k)/i.test(a)){for(let e of["but","however","actually","really","honestly","no","not"])if(a.includes(e))return!0}return!1}(a,t.conversation_state),f="HOT"===t.pipeline_status?"closer, professional, concise":"friendly, helpful, concise",m=`
LEAD INFORMATION:
- Name: ${t.name}
- Address: ${t.address}
- Phone: ${t.phone_number}
- Current State: ${t.conversation_state}
- Property Condition: ${t.property_condition||"Unknown"}
- Motivation: ${t.motivation||"Unknown"}
- Timeline: ${t.timeline||"Unknown"}
- Price Expectation: ${t.price_expectation?`$${t.price_expectation.toLocaleString()}`:"Unknown"}
- Mortgage Owed: ${"number"==typeof t.mortgage_owed?`$${t.mortgage_owed.toLocaleString()}`:"Unknown"}
- ARV (if available): ${t.arv?`$${t.arv.toLocaleString()}`:"Not yet determined"}
- Repair Estimate: ${t.repair_estimate?`$${t.repair_estimate.toLocaleString()}`:"Not yet determined"}
- Offer Amount: ${t.offer_amount?`$${t.offer_amount.toLocaleString()}`:"Not yet made"}
- Notes: ${t.notes||"None"}

COMPANY CONFIG:
- Company Name: ${s.company_name}
- Wholesaling Fee: $${s.wholesaling_fee.toLocaleString()}
- ARV Multiplier: ${s.arv_multiplier}
 
TONE: ${f}
`,h=d.map(e=>`${"inbound"===e.direction?"SELLER":"AGENT"}: ${e.content}`).join("\n"),_=p?`${m}

CONVERSATION HISTORY:
${h||"No previous messages"}

LATEST MESSAGE FROM SELLER (ESCALATED - Complex negotiation/agreement detected):
${a}

This conversation has been escalated to you because the seller is either:
- Ready to accept an offer
- Raising complex objections requiring negotiation
- Discussing contract terms

Generate an appropriate SMS response handling this advanced scenario.

Also analyze and extract any new information about:
- Property condition, motivation, timeline, price expectation

Respond in JSON format:
{
  "smsResponse": "Your SMS response (professional, can be slightly longer for complex topics)",
  "callIntent": {
    "action": "update_lead_status|none",
    "lead_status": "warm_call_requested|schedule_call|ready_for_offer_call|text_only|null",
    "call_time": "optional"
  },
  "extractedInfo": {
    "propertyCondition": "extracted or null",
    "motivation": "extracted or null",
    "timeline": "extracted or null",
    "priceExpectation": "number or null"
  },
  "suggestedState": "new state or null",
  "shouldMakeOffer": true/false,
  "offerAccepted": true/false,
  "counterOfferAmount": "number if seller made counter, else null",
  "readyForContract": true/false
}`:`${m}

CONVERSATION HISTORY:
${h||"No previous messages"}

LATEST MESSAGE FROM SELLER:
${a}

Generate an appropriate SMS response to qualify this lead. Focus on gathering information about property condition, motivation, timeline, price expectations, and mortgage owed if mentioned.

Also analyze call intent - the seller may be hinting they want to talk on the phone instead of text.

Respond in JSON format:
{
  "smsResponse": "Your SMS response (keep it short, 1-2 messages max)",
  "callIntent": {
    "action": "update_lead_status|none",
    "lead_status": "warm_call_requested|schedule_call|ready_for_offer_call|text_only|null",
    "call_time": "optional"
  },
  "extractedInfo": {
    "propertyCondition": "extracted or null",
    "motivation": "extracted or null",
    "timeline": "extracted or null",
    "priceExpectation": "number or null",
    "mortgageOwed": "number or null"
  },
  "suggestedState": "new state or null",
  "shouldMakeOffer": true/false,
  "needsEscalation": true/false
}`,{text:g}=await i(p?r:n,_);try{let e=g.match(/\{[\s\S]*\}/);l=e?JSON.parse(e[0]):{smsResponse:g,callIntent:{action:"none"},extractedInfo:{}}}catch{l={smsResponse:g,callIntent:{action:"none"},extractedInfo:{}}}let y={};l.extractedInfo?.propertyCondition&&(y.property_condition=l.extractedInfo.propertyCondition),l.extractedInfo?.motivation&&(y.motivation=l.extractedInfo.motivation),l.extractedInfo?.timeline&&(y.timeline=l.extractedInfo.timeline),l.extractedInfo?.priceExpectation&&(y.price_expectation=Number(l.extractedInfo.priceExpectation)),l.counterOfferAmount&&(y.notes=`${t.notes||""}
Seller counter offer: $${l.counterOfferAmount}`.trim(),y.offer_amount=Number(l.counterOfferAmount));try{let{scoreLead:a}=await e.A(54934);y.score=a(t,d),y.score_updated_at=new Date().toISOString()}catch{}l.offerAccepted||l.readyForContract?u="offer_accepted":l.shouldMakeOffer&&"offer_made"!==t.conversation_state?u="offer_made":l.suggestedState&&(u=l.suggestedState),l.extractedInfo?.mortgageOwed&&(y.mortgage_owed=Number(l.extractedInfo.mortgageOwed));let w=l.callIntent||{action:"none"};(l.shouldMakeOffer||l.readyForContract)&&t.arv&&t.repair_estimate&&(y.offer_amount=function(e,t,a,n=.7){return Math.max(0,Math.round(e*n-t-a))}(t.arv,t.repair_estimate,s.wholesaling_fee,s.arv_multiplier));try{let{enforceRails:a,mao:n}=await e.A(23608),r=n(t.arv||0,t.repair_estimate||0,s.wholesaling_fee,s.arv_multiplier),o=a(t,r,y.offer_amount||void 0);!o.allowed&&o.nextAmount&&(y.offer_amount=o.nextAmount)}catch{}return{message:l.smsResponse,updatedLead:y,newState:u,modelUsed:"gpt-5.1",escalated:p,callIntent:w}}async function d(e,t){return`Hi ${e.name}, this is ${t.company_name}. Are you still interested in selling ${e.address}? We make fair cash offers and can close quickly. Reply YES if you'd like to learn more!`}async function p(e,t){switch(e.conversation_state){case"contacted":return`Hi ${e.name}, just following up on my message about ${e.address}. We're still interested in making you a fair cash offer. Let me know if you have any questions!`;case"offer_made":return`Hi ${e.name}, just checking if you had a chance to consider our offer of $${e.offer_amount?.toLocaleString()} for ${e.address}. Let me know your thoughts!`;case"contract_sent":return`Hi ${e.name}, just checking if you had a chance to review the contract for ${e.address}. Let me know if you have any questions!`;default:return`Hi ${e.name}, this is ${t.company_name} following up about ${e.address}. Are you still interested in selling? We'd love to help!`}}e.s(["generateAgentResponse",()=>u,"generateFollowUp",()=>p,"generateInitialOutreach",()=>d,"getAgentConfig",()=>l])},22474,e=>{"use strict";var t=e.i(66495),a=e.i(89660),n=e.i(16303),r=e.i(83939);let o=[{day:0,message:"Hey! Quick question — are you open to an offer on your property at [ADDRESS]?"},{day:1,message:"Just making sure this reached the right person. If not, sorry about that!"},{day:2,message:"No rush — just curious if you'd consider selling if the price made sense?"},{day:4,message:"I can usually give a rough estimate in under 60 seconds if you want one."},{day:7,message:"Have you gotten any offers recently? Just trying to see where things stand."},{day:10,message:"Still thinking about selling the place? Totally fine either way."},{day:15,message:"Hey, just checking back in — any chance you'd consider an offer this month?"},{day:21,message:"We've got a few buyers looking in your area specifically — want me to see what they'd pay?"},{day:30,message:"Just a heads up: we're short on properties right now. Could move fast if you're interested."},{day:38,message:"We're locking in offers for this month. Want me to run your place through?"},{day:45,message:"Out of curiosity… if you did sell, what price would make you consider it?"},{day:52,message:"Should I close your file or keep you on the list in case something opens up? Either is fine."}];async function s(e,t){let n=await (0,a.createClient)();try{let{data:a,error:r}=await n.from("leads").select("*").eq("id",e).single();if(r||!a)return{success:!1,error:"Lead not found"};let s=o.map((a,n)=>{let r=new Date;return r.setDate(r.getDate()+a.day),r.setHours(9,0,0,0),{lead_id:e,sequence_number:n+1,scheduled_for:r.toISOString(),status:"pending",attempts:0,next_attempt_at:null,reason:t?.reason||null,next_action:t?.next_action||null}}),{error:i}=await n.from("follow_up_sequences").insert(s);if(i)return{success:!1,error:i.message};return{success:!0}}catch(e){return{success:!1,error:String(e)}}}async function i(e=50){let t=await (0,a.createClient)(),r=new Date().toISOString(),s=Number((await (0,n.getAgentConfig)()).followup_max_attempts??process.env.FOLLOWUP_MAX_ATTEMPTS??3),{data:l,error:c}=await t.from("follow_up_sequences").select(`
      id,
      lead_id,
      sequence_number,
      scheduled_for,
      attempts,
      next_attempt_at,
      leads(name, phone_number, address)
    `).eq("status","pending").lte("scheduled_for",r).lt("attempts",s).or(`next_attempt_at.is.null,next_attempt_at.lte.${r}`).limit(e).order("scheduled_for",{ascending:!0});return c?(console.error("Error fetching pending follow-ups:",c),[]):(l||[]).map(e=>({id:e.id,lead_id:e.lead_id,lead_name:e.leads?.name||"Unknown",phone_number:e.leads?.phone_number||"",address:e.leads?.address||"",sequence_number:e.sequence_number,message:o[e.sequence_number-1].message.replace("[ADDRESS]",e.leads?.address||""),scheduled_for:e.scheduled_for,attempts:e.attempts||0}))}async function l(e){let t=await (0,a.createClient)(),{error:n}=await t.from("follow_up_sequences").update({status:"sent",sent_at:new Date().toISOString()}).eq("id",e);return n?{success:!1,error:n.message}:{success:!0}}async function c(e){let t=await (0,a.createClient)(),{error:n}=await t.from("follow_up_sequences").update({status:"skipped"}).eq("id",e);return n?{success:!1,error:n.message}:{success:!0}}async function u(e){let t=await (0,a.createClient)(),{data:n,error:r}=await t.from("follow_up_sequences").select("*").eq("lead_id",e).order("sequence_number",{ascending:!0});return r?(console.error("Error fetching follow-up sequence:",r),[]):n||[]}async function d(e,t){let r=await (0,a.createClient)(),o=Number((await (0,n.getAgentConfig)()).followup_backoff_minutes??process.env.FOLLOWUP_BACKOFF_MINUTES??15),s=new Date;s.setMinutes(s.getMinutes()+o);let{error:i}=await r.from("follow_up_sequences").update({attempts:void r.rpc,next_attempt_at:s.toISOString(),error_last:t}).eq("id",e);if(i){let{data:a}=await r.from("follow_up_sequences").select("attempts").eq("id",e).single(),n=(a?.attempts||0)+1,{error:o}=await r.from("follow_up_sequences").update({attempts:n,next_attempt_at:s.toISOString(),error_last:t}).eq("id",e);if(o)return{success:!1,error:o.message}}return{success:!0}}(0,r.ensureServerEntryExports)([s,i,l,c,u,d]),(0,t.registerServerReference)(s,"60cc9ca78ce4d5591b75ae160980b277915f77fe23",null),(0,t.registerServerReference)(i,"405d9a77094e69a2388acadee6a1e00501a8a5ce37",null),(0,t.registerServerReference)(l,"40f0b55834ec9096fd46a4f3e466730865eb0e845e",null),(0,t.registerServerReference)(c,"400ff5fb586596e70bed08a75c66cf2b4422190936",null),(0,t.registerServerReference)(u,"40356cc98e4cdcf941926018f0bbfc4fe455776fe5",null),(0,t.registerServerReference)(d,"6035672dfcece34e0bce491461698f4bc9fe35e4d7",null),e.s(["getPendingFollowUps",()=>i,"markFollowUpAsSent",()=>l,"markFollowUpFailed",()=>d,"scheduleFollowUpSequence",()=>s])},67847,e=>{"use strict";var t=e.i(55454),a=e.i(78872),n=e.i(51045),r=e.i(17396),o=e.i(37276),s=e.i(63400),i=e.i(51826),l=e.i(52747),c=e.i(59428),u=e.i(81124),d=e.i(46569),p=e.i(21392),f=e.i(12613),m=e.i(2254),h=e.i(7707),_=e.i(55431),g=e.i(93695);e.i(33109);var y=e.i(30833),w=e.i(61760),v=e.i(22474);async function x(e){try{let{leadId:t,reason:a,next_action:n}=await e.json();if(!t)return w.NextResponse.json({success:!1,error:"leadId required"},{status:400});let r=await (0,v.scheduleFollowUpSequence)(t,{reason:a,next_action:n});if(!r.success)return w.NextResponse.json(r,{status:500});return w.NextResponse.json({success:!0})}catch(e){return w.NextResponse.json({success:!1,error:"Failed to schedule"},{status:500})}}e.s(["POST",()=>x],82777);var S=e.i(82777);let R=new t.AppRouteRouteModule({definition:{kind:a.RouteKind.APP_ROUTE,page:"/api/followup/schedule/route",pathname:"/api/followup/schedule",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/app/api/followup/schedule/route.ts",nextConfigOutput:"",userland:S}),{workAsyncStorage:b,workUnitAsyncStorage:E,serverHooks:A}=R;function I(){return(0,n.patchFetch)({workAsyncStorage:b,workUnitAsyncStorage:E})}async function O(e,t,n){R.isDev&&(0,r.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let w="/api/followup/schedule/route";w=w.replace(/\/index$/,"")||"/";let v=await R.prepare(e,t,{srcPage:w,multiZoneDraftMode:!1});if(!v)return t.statusCode=400,t.end("Bad Request"),null==n.waitUntil||n.waitUntil.call(n,Promise.resolve()),null;let{buildId:x,params:S,nextConfig:b,parsedUrl:E,isDraftMode:A,prerenderManifest:I,routerServerContext:O,isOnDemandRevalidate:C,revalidateOnlyGenerated:N,resolvedPathname:T,clientReferenceManifest:k,serverActionsManifest:q}=v,$=(0,l.normalizeAppPath)(w),P=!!(I.dynamicRoutes[$]||I.routes[T]),M=async()=>((null==O?void 0:O.render404)?await O.render404(e,t,E,!1):t.end("This page could not be found"),null);if(P&&!A){let e=!!I.routes[T],t=I.dynamicRoutes[$];if(t&&!1===t.fallback&&!e){if(b.experimental.adapterPath)return await M();throw new g.NoFallbackError}}let j=null;!P||R.isDev||A||(j="/index"===(j=T)?"/":j);let L=!0===R.isDev||!P,D=P&&!L;q&&k&&(0,s.setReferenceManifestsSingleton)({page:w,clientReferenceManifest:k,serverActionsManifest:q,serverModuleMap:(0,i.createServerModuleMap)({serverActionsManifest:q})});let U=e.method||"GET",F=(0,o.getTracer)(),H=F.getActiveScopeSpan(),W={params:S,prerenderManifest:I,renderOpts:{experimental:{authInterrupts:!!b.experimental.authInterrupts},cacheComponents:!!b.cacheComponents,supportsDynamicResponse:L,incrementalCache:(0,r.getRequestMeta)(e,"incrementalCache"),cacheLifeProfiles:b.cacheLife,waitUntil:n.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,a,n)=>R.onRequestError(e,t,n,O)},sharedContext:{buildId:x}},G=new c.NodeNextRequest(e),Y=new c.NodeNextResponse(t),J=u.NextRequestAdapter.fromNodeNextRequest(G,(0,u.signalFromNodeResponse)(t));try{let s=async e=>R.handle(J,W).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let a=F.getRootSpanAttributes();if(!a)return;if(a.get("next.span_type")!==d.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${a.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let n=a.get("next.route");if(n){let t=`${U} ${n}`;e.setAttributes({"next.route":n,"http.route":n,"next.span_name":t}),e.updateName(t)}else e.updateName(`${U} ${w}`)}),i=!!(0,r.getRequestMeta)(e,"minimalMode"),l=async r=>{var o,l;let c=async({previousCacheEntry:a})=>{try{if(!i&&C&&N&&!a)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let o=await s(r);e.fetchMetrics=W.renderOpts.fetchMetrics;let l=W.renderOpts.pendingWaitUntil;l&&n.waitUntil&&(n.waitUntil(l),l=void 0);let c=W.renderOpts.collectedTags;if(!P)return await (0,f.sendResponse)(G,Y,o,W.renderOpts.pendingWaitUntil),null;{let e=await o.blob(),t=(0,m.toNodeOutgoingHttpHeaders)(o.headers);c&&(t[_.NEXT_CACHE_TAGS_HEADER]=c),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let a=void 0!==W.renderOpts.collectedRevalidate&&!(W.renderOpts.collectedRevalidate>=_.INFINITE_CACHE)&&W.renderOpts.collectedRevalidate,n=void 0===W.renderOpts.collectedExpire||W.renderOpts.collectedExpire>=_.INFINITE_CACHE?void 0:W.renderOpts.collectedExpire;return{value:{kind:y.CachedRouteKind.APP_ROUTE,status:o.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:a,expire:n}}}}catch(t){throw(null==a?void 0:a.isStale)&&await R.onRequestError(e,t,{routerKind:"App Router",routePath:w,routeType:"route",revalidateReason:(0,p.getRevalidateReason)({isStaticGeneration:D,isOnDemandRevalidate:C})},O),t}},u=await R.handleResponse({req:e,nextConfig:b,cacheKey:j,routeKind:a.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:I,isRoutePPREnabled:!1,isOnDemandRevalidate:C,revalidateOnlyGenerated:N,responseGenerator:c,waitUntil:n.waitUntil,isMinimalMode:i});if(!P)return null;if((null==u||null==(o=u.value)?void 0:o.kind)!==y.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==u||null==(l=u.value)?void 0:l.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});i||t.setHeader("x-nextjs-cache",C?"REVALIDATED":u.isMiss?"MISS":u.isStale?"STALE":"HIT"),A&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let d=(0,m.fromNodeOutgoingHttpHeaders)(u.value.headers);return i&&P||d.delete(_.NEXT_CACHE_TAGS_HEADER),!u.cacheControl||t.getHeader("Cache-Control")||d.get("Cache-Control")||d.set("Cache-Control",(0,h.getCacheControlHeader)(u.cacheControl)),await (0,f.sendResponse)(G,Y,new Response(u.value.body,{headers:d,status:u.value.status||200})),null};H?await l(H):await F.withPropagatedContext(e.headers,()=>F.trace(d.BaseServerSpan.handleRequest,{spanName:`${U} ${w}`,kind:o.SpanKind.SERVER,attributes:{"http.method":U,"http.target":e.url}},l))}catch(t){if(t instanceof g.NoFallbackError||await R.onRequestError(e,t,{routerKind:"App Router",routePath:$,routeType:"route",revalidateReason:(0,p.getRevalidateReason)({isStaticGeneration:D,isOnDemandRevalidate:C})}),P)throw t;return await (0,f.sendResponse)(G,Y,new Response(null,{status:500})),null}}e.s(["handler",()=>O,"patchFetch",()=>I,"routeModule",()=>R,"serverHooks",()=>A,"workAsyncStorage",()=>b,"workUnitAsyncStorage",()=>E],67847)},83768,e=>{e.v(t=>Promise.all(["server/chunks/lib_cache-router_ts_c67d7e26._.js"].map(t=>e.l(t))).then(()=>t(84204)))},56504,e=>{e.v(t=>Promise.all(["server/chunks/lib_8af6ed8c._.js"].map(t=>e.l(t))).then(()=>t(15794)))},54934,e=>{e.v(t=>Promise.all(["server/chunks/lib_scoring_ts_dbd9e788._.js"].map(t=>e.l(t))).then(()=>t(77618)))},23608,e=>{e.v(t=>Promise.all(["server/chunks/lib_negotiation-rails_ts_f535b509._.js"].map(t=>e.l(t))).then(()=>t(23875)))}];

//# sourceMappingURL=%5Broot-of-the-server%5D__08f8e253._.js.map