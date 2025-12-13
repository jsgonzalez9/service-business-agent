module.exports=[18622,(e,t,a)=>{t.exports=e.x("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js"))},56704,(e,t,a)=>{t.exports=e.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},32319,(e,t,a)=>{t.exports=e.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},24725,(e,t,a)=>{t.exports=e.x("next/dist/server/app-render/after-task-async-storage.external.js",()=>require("next/dist/server/app-render/after-task-async-storage.external.js"))},93695,(e,t,a)=>{t.exports=e.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},89660,e=>{"use strict";e.i(49360);var t=e.i(77475),a=e.i(61680);async function n(){let e=await (0,a.cookies)();return(0,t.createServerClient)("https://cweluauwjzameqxlcpkj.supabase.co","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN3ZWx1YXV3anphbWVxeGxjcGtqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0NjQwODAsImV4cCI6MjA4MDA0MDA4MH0.wrulNixV7KhaEHCTIFUlKmiv9pnfZpoXhTbhqTXrp3E",{cookies:{getAll:()=>e.getAll(),setAll(t){try{t.forEach(({name:t,value:a,options:n})=>e.set(t,a,n))}catch{}}}})}e.s(["createClient",()=>n])},14747,(e,t,a)=>{t.exports=e.x("path",()=>require("path"))},24361,(e,t,a)=>{t.exports=e.x("util",()=>require("util"))},22734,(e,t,a)=>{t.exports=e.x("fs",()=>require("fs"))},32721,e=>{"use strict";var t=e.i(12396),a=e.i(89660);let n=process.env.TWILIO_ACCOUNT_SID,o=process.env.TWILIO_AUTH_TOKEN,r=process.env.TWILIO_PHONE_NUMBER,i=process.env.TWILIO_CALLER_ID,s=(process.env.TWILIO_NUMBER_POOL||"").split(",").map(e=>e.trim()).filter(e=>e.length>0),l=Number(process.env.SMS_MONTHLY_LIMIT_PER_NUMBER||1e4);async function c(){let e=s.length>0?s:r?[r]:[];if(0===e.length)return[];try{let t,n=await (0,a.createClient)(),{data:o}=await n.from("call_events").select("event_data, created_at").eq("event_type","sms_sent").gte("created_at",((t=new Date).setDate(1),t.setHours(0,0,0,0),t.toISOString())),r={};for(let e of o||[]){let t=e.event_data?.from;"string"==typeof t&&(r[t]=(r[t]||0)+1)}return e.filter(e=>(r[e]||0)<l).sort((e,t)=>(r[e]||0)-(r[t]||0))}catch{return e}}function d(){return n&&o?(0,t.default)(n,o):(console.warn("Twilio credentials not configured"),null)}function u(){if(i&&i.length>0)return i;let e=s.length>0?s:r?[r]:[];return e.length>0?e[0]:null}async function p(e,t,n){let o=d();if(!o){let a=n?.withFooter??!0?"\n\nReply STOP to unsubscribe":"",o=`${t}${a}`;return console.log(`[MOCK SMS] To: ${e}
Message: ${o}`),{sid:`mock_${Date.now()}`,error:null}}let r=Number(process.env.SMS_QUIET_HOURS_START||8),i=Number(process.env.SMS_QUIET_HOURS_END||21),s=new Date().getHours();if(s<r||s>=i)return{sid:null,error:"Quiet hours active; message not sent"};if(!n?.bypassSuppression)try{let t=await (0,a.createClient)(),n=e.replace(/\D/g,"");10===n.length?n=`+1${n}`:11===n.length&&n.startsWith("1")?n=`+${n}`:n.startsWith("+")||(n=`+${n}`);let{data:o}=await t.from("leads").select("*").eq("phone_number",n).single();if(o&&o.is_opted_out)return{sid:null,error:"Recipient has opted out"}}catch{}let l=await c();if(0===l.length)return{sid:null,error:"No available Twilio sender number (check pool or config)"};try{try{let e=await (0,a.createClient)(),t=new Date(Date.now()-6e4).toISOString(),{count:n}=await e.from("sms_events").select("id",{count:"exact",head:!0}).gte("created_at",t),o=Number(process.env.SMS_RATE_LIMIT_PER_MIN||25);if((n||0)>=o)return{sid:null,error:"Rate limit exceeded, try later"}}catch{}let r=[];try{let e=await (0,a.createClient)(),{data:t}=await e.from("agent_config").select("*").limit(1).single(),n=t?.company_name||"Your Company";r.push(`${n}: real estate lead generation`)}catch{r.push("Real estate lead generation")}r.push("Msg & data rates may apply"),r.push("Reply HELP for help"),r.push("Reply STOP to unsubscribe");let i=r.join(" • "),s=n?.withFooter??!0?`

${i}`:"",c=`${t}${s}`,d=`${process.env.NEXT_PUBLIC_APP_URL||"http://localhost:3000"}/api/twilio/status`,u=null;for(let n of l)try{let r=await o.messages.create({body:c,from:n,to:e,statusCallback:d});try{let o=await (0,a.createClient)();await o.from("sms_events").insert({sid:r.sid,to_number:e,from_number:n,status:"sent",error:null,body:t})}catch{}return{sid:r.sid,error:null}}catch(e){u=e?.message?String(e.message):"Failed to send SMS";continue}try{let n=await (0,a.createClient)();await n.from("sms_events").insert({sid:null,to_number:e,from_number:l[0],status:"failed",error:u||"Failed to send SMS",body:t})}catch{}return{sid:null,error:u||"Failed to send SMS"}}catch(e){return console.error("Error sending SMS:",e),{sid:null,error:e instanceof Error?e.message:"Failed to send SMS"}}}function f(e,a,n){return!o||t.default.validateRequest(o,e,a,n)}e.s(["chooseCallerId",()=>u,"eligibleNumbersSorted",()=>c,"getTwilioClient",()=>d,"sendSMS",()=>p,"validateTwilioRequest",()=>f])},16303,e=>{"use strict";var t=e.i(89660);e.i(86864);var a=e.i(77058);let n=`You are the Lead Outreach Agent for a real estate wholesaling company. 
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
}`,o=`You are the Advanced Negotiation & Closing Agent for a real estate wholesaling company.
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

OUTPUT: SMS text messages only. Keep responses professional but concise.`,r=["agree","accept","deal","ready to sell","let's do it","sounds good","too low","not enough","more money","higher","counteroffer","counter offer","my price","i want","need at least","won't accept","can't accept","final offer","best offer","walk away","not interested anymore","lawyer","attorney","legal","contract terms","contingency"],i=new a.default({apiKey:process.env.OPENAI_API_KEY});async function s(e,t){let a=await i.chat.completions.create({model:"gpt-5.1",max_tokens:800,temperature:.7,messages:[{role:"system",content:e},{role:"user",content:t}]});return{text:a.choices[0]?.message?.content||"",usage:a.usage}}async function l(){let e=await (0,t.createClient)(),{data:a,error:n}=await e.from("agent_config").select("*").single();return n||!a?{id:"",company_name:"CashBuyer Properties",wholesaling_fee:1e4,arv_multiplier:.7,follow_up_hours:24,max_follow_ups:3,followup_backoff_minutes:15,followup_max_attempts:3,llm_cache_enabled:!0,llm_cache_confidence_floor:.85,llm_cache_ttl_faq_days:30,llm_cache_ttl_objection_days:14,auto_dispo_eval_enabled:!0,auto_renegotiate_days_threshold:5,auto_cancel_days_threshold:10,auto_dispo_require_human_confirm:!0,created_at:new Date().toISOString(),updated_at:new Date().toISOString()}:a}async function c(e){let a=await (0,t.createClient)(),{data:n,error:o}=await a.from("messages").select("*").eq("lead_id",e).order("created_at",{ascending:!0});return o?(console.error("Error fetching conversation history:",o),[]):n}async function d(t,a,i){let l,d;try{let{classifyIntent:n,normalizeQuestion:o,lookupCached:r}=await e.A(83768),{findCachedByEmbedding:s}=await e.A(56504),l=n(a);if(!1!==i.llm_cache_enabled&&l.startsWith("FAQ")){let e=o(a),{text:n,confidence:c}=await r(l,e);if(n&&c>=.85)return{message:n,updatedLead:{},newState:void 0,modelUsed:"gpt-5.1",escalated:!1,callIntent:{action:"none"}};{let e="number"==typeof i.llm_cache_confidence_floor?i.llm_cache_confidence_floor:.85,n=l.startsWith("FAQ")?i.llm_cache_ttl_faq_days??30:i.llm_cache_ttl_objection_days??14,o=t.state||void 0,r=i.llm_cache_market_overrides||{};o&&r[o]&&(e=r[o].confidence_floor??e,n=l.startsWith("FAQ")?r[o].ttl_faq_days??n:r[o].ttl_objection_days??n);let c=await s(l,a,o,e,n);if(c.text&&c.confidence>=.85)return{message:c.text,updatedLead:{},newState:void 0,modelUsed:"gpt-5.1",escalated:!1,callIntent:{action:"none"}}}}}catch{}let u=await c(t.id),p=function(e,t){let a=e.toLowerCase();if(["offer_made","contract_sent","offer_accepted"].includes(t))return!0;for(let e of r)if(a.includes(e))return!0;if(/\$[\d,]+|\d+k|\d+\s*(thousand|k)/i.test(a)){for(let e of["but","however","actually","really","honestly","no","not"])if(a.includes(e))return!0}return!1}(a,t.conversation_state),f="HOT"===t.pipeline_status?"closer, professional, concise":"friendly, helpful, concise",m=`
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
- Company Name: ${i.company_name}
- Wholesaling Fee: $${i.wholesaling_fee.toLocaleString()}
- ARV Multiplier: ${i.arv_multiplier}
 
TONE: ${f}
`,_=u.map(e=>`${"inbound"===e.direction?"SELLER":"AGENT"}: ${e.content}`).join("\n"),h=p?`${m}

CONVERSATION HISTORY:
${_||"No previous messages"}

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
${_||"No previous messages"}

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
}`,{text:g}=await s(p?o:n,h);try{let e=g.match(/\{[\s\S]*\}/);l=e?JSON.parse(e[0]):{smsResponse:g,callIntent:{action:"none"},extractedInfo:{}}}catch{l={smsResponse:g,callIntent:{action:"none"},extractedInfo:{}}}let y={};l.extractedInfo?.propertyCondition&&(y.property_condition=l.extractedInfo.propertyCondition),l.extractedInfo?.motivation&&(y.motivation=l.extractedInfo.motivation),l.extractedInfo?.timeline&&(y.timeline=l.extractedInfo.timeline),l.extractedInfo?.priceExpectation&&(y.price_expectation=Number(l.extractedInfo.priceExpectation)),l.counterOfferAmount&&(y.notes=`${t.notes||""}
Seller counter offer: $${l.counterOfferAmount}`.trim(),y.offer_amount=Number(l.counterOfferAmount));try{let{scoreLead:a}=await e.A(54934);y.score=a(t,u),y.score_updated_at=new Date().toISOString()}catch{}l.offerAccepted||l.readyForContract?d="offer_accepted":l.shouldMakeOffer&&"offer_made"!==t.conversation_state?d="offer_made":l.suggestedState&&(d=l.suggestedState),l.extractedInfo?.mortgageOwed&&(y.mortgage_owed=Number(l.extractedInfo.mortgageOwed));let w=l.callIntent||{action:"none"};(l.shouldMakeOffer||l.readyForContract)&&t.arv&&t.repair_estimate&&(y.offer_amount=function(e,t,a,n=.7){return Math.max(0,Math.round(e*n-t-a))}(t.arv,t.repair_estimate,i.wholesaling_fee,i.arv_multiplier));try{let{enforceRails:a,mao:n}=await e.A(23608),o=n(t.arv||0,t.repair_estimate||0,i.wholesaling_fee,i.arv_multiplier),r=a(t,o,y.offer_amount||void 0);!r.allowed&&r.nextAmount&&(y.offer_amount=r.nextAmount)}catch{}return{message:l.smsResponse,updatedLead:y,newState:d,modelUsed:"gpt-5.1",escalated:p,callIntent:w}}async function u(e,t){return`Hi ${e.name}, this is ${t.company_name}. Are you still interested in selling ${e.address}? We make fair cash offers and can close quickly. Reply YES if you'd like to learn more!`}async function p(e,t){switch(e.conversation_state){case"contacted":return`Hi ${e.name}, just following up on my message about ${e.address}. We're still interested in making you a fair cash offer. Let me know if you have any questions!`;case"offer_made":return`Hi ${e.name}, just checking if you had a chance to consider our offer of $${e.offer_amount?.toLocaleString()} for ${e.address}. Let me know your thoughts!`;case"contract_sent":return`Hi ${e.name}, just checking if you had a chance to review the contract for ${e.address}. Let me know if you have any questions!`;default:return`Hi ${e.name}, this is ${t.company_name} following up about ${e.address}. Are you still interested in selling? We'd love to help!`}}e.s(["generateAgentResponse",()=>d,"generateFollowUp",()=>p,"generateInitialOutreach",()=>u,"getAgentConfig",()=>l])},23875,e=>{"use strict";function t(e,t,a,n){return Math.max(0,Math.round(e*n-t-a))}function a(e,t,a){let n=Math.round(1.02*t),o=Math.round(.9*t),r=a??e.offer_amount??0;return r?r>n?{allowed:!1,nextAmount:n}:r<o?{allowed:!1,nextAmount:o}:{allowed:!0,nextAmount:r}:{allowed:!0,nextAmount:o}}e.s(["enforceRails",()=>a,"mao",()=>t])},33543,e=>{"use strict";var t=e.i(55454),a=e.i(78872),n=e.i(51045),o=e.i(17396),r=e.i(37276),i=e.i(63400),s=e.i(51826),l=e.i(52747),c=e.i(59428),d=e.i(81124),u=e.i(46569),p=e.i(21392),f=e.i(12613),m=e.i(2254),_=e.i(7707),h=e.i(55431),g=e.i(93695);e.i(33109);var y=e.i(30833),w=e.i(61760),v=e.i(89660),x=e.i(23875),S=e.i(32721),I=e.i(16303);async function R(){let e=await (0,v.createClient)(),t=await (0,I.getAgentConfig)();if(!1===t.auto_dispo_eval_enabled)return w.NextResponse.json({success:!0,skipped:!0});let{data:a}=await e.from("leads").select("*").or("conversation_state.eq.contract_signed,deal_state.eq.DISPO").eq("dispo_status","pending").limit(200),n=0,o=0;for(let r of a||[]){let a=r.dispo_started_at?new Date(r.dispo_started_at).getTime():void 0;if(a||"contract_signed"!==r.conversation_state||(a=Date.now(),await e.from("leads").update({dispo_started_at:new Date().toISOString()}).eq("id",r.id)),!a)continue;let i=Math.floor((Date.now()-a)/864e5),s=r.offers_received||0;if(n++,0===s&&i>=(t.auto_cancel_days_threshold??10)){if(t.auto_dispo_require_human_confirm){let t=`
[AUTO] Recommend cancel during inspection period (no interest in ${i}d).`;await e.from("leads").update({notes:(r.notes||"")+t}).eq("id",r.id)}else await (0,S.sendSMS)(r.phone_number,`We weren’t able to secure a buyer at the current terms. To keep things simple, we’ll cancel during the inspection period. If you’d like to revisit pricing, just let me know.`),await e.from("leads").update({conversation_state:"lost",deal_state:"DEAD",dispo_status:"cancelled"}).eq("id",r.id),o++;continue}if(0===s&&i>=(t.auto_renegotiate_days_threshold??5)){let a=(0,x.mao)(r.arv||0,r.repair_estimate||0,t.wholesaling_fee,t.arv_multiplier),n=Math.round(.95*a),s=(0,x.enforceRails)(r,a,n).nextAmount||n;if(t.auto_dispo_require_human_confirm){let t=`
[AUTO] Recommend renegotiate to $${s.toLocaleString()} (no interest in ${i}d).`;await e.from("leads").update({notes:(r.notes||"")+t}).eq("id",r.id)}else await e.from("leads").update({offer_amount:s,dispo_status:"renegotiated"}).eq("id",r.id),await (0,S.sendSMS)(r.phone_number,`Quick update: to get this done, we can adjust the offer to $${s.toLocaleString()}. Does that work for you? If not, we can cancel during the inspection period.`),o++;continue}}return w.NextResponse.json({success:!0,evaluated:n,actions:o})}e.s(["POST",()=>R,"dynamic",0,"force-dynamic"],15963);var A=e.i(15963);let E=new t.AppRouteRouteModule({definition:{kind:a.RouteKind.APP_ROUTE,page:"/api/dispo/auto/run/route",pathname:"/api/dispo/auto/run",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/app/api/dispo/auto/run/route.ts",nextConfigOutput:"",userland:A}),{workAsyncStorage:O,workUnitAsyncStorage:b,serverHooks:T}=E;function C(){return(0,n.patchFetch)({workAsyncStorage:O,workUnitAsyncStorage:b})}async function N(e,t,n){E.isDev&&(0,o.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let w="/api/dispo/auto/run/route";w=w.replace(/\/index$/,"")||"/";let v=await E.prepare(e,t,{srcPage:w,multiZoneDraftMode:!1});if(!v)return t.statusCode=400,t.end("Bad Request"),null==n.waitUntil||n.waitUntil.call(n,Promise.resolve()),null;let{buildId:x,params:S,nextConfig:I,parsedUrl:R,isDraftMode:A,prerenderManifest:O,routerServerContext:b,isOnDemandRevalidate:T,revalidateOnlyGenerated:C,resolvedPathname:N,clientReferenceManifest:$,serverActionsManifest:M}=v,k=(0,l.normalizeAppPath)(w),L=!!(O.dynamicRoutes[k]||O.routes[N]),P=async()=>((null==b?void 0:b.render404)?await b.render404(e,t,R,!1):t.end("This page could not be found"),null);if(L&&!A){let e=!!O.routes[N],t=O.dynamicRoutes[k];if(t&&!1===t.fallback&&!e){if(I.experimental.adapterPath)return await P();throw new g.NoFallbackError}}let q=null;!L||E.isDev||A||(q="/index"===(q=N)?"/":q);let D=!0===E.isDev||!L,U=L&&!D;M&&$&&(0,i.setReferenceManifestsSingleton)({page:w,clientReferenceManifest:$,serverActionsManifest:M,serverModuleMap:(0,s.createServerModuleMap)({serverActionsManifest:M})});let j=e.method||"GET",F=(0,r.getTracer)(),H=F.getActiveScopeSpan(),W={params:S,prerenderManifest:O,renderOpts:{experimental:{authInterrupts:!!I.experimental.authInterrupts},cacheComponents:!!I.cacheComponents,supportsDynamicResponse:D,incrementalCache:(0,o.getRequestMeta)(e,"incrementalCache"),cacheLifeProfiles:I.cacheLife,waitUntil:n.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,a,n)=>E.onRequestError(e,t,n,b)},sharedContext:{buildId:x}},Y=new c.NodeNextRequest(e),G=new c.NodeNextResponse(t),K=d.NextRequestAdapter.fromNodeNextRequest(Y,(0,d.signalFromNodeResponse)(t));try{let i=async e=>E.handle(K,W).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let a=F.getRootSpanAttributes();if(!a)return;if(a.get("next.span_type")!==u.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${a.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let n=a.get("next.route");if(n){let t=`${j} ${n}`;e.setAttributes({"next.route":n,"http.route":n,"next.span_name":t}),e.updateName(t)}else e.updateName(`${j} ${w}`)}),s=!!(0,o.getRequestMeta)(e,"minimalMode"),l=async o=>{var r,l;let c=async({previousCacheEntry:a})=>{try{if(!s&&T&&C&&!a)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let r=await i(o);e.fetchMetrics=W.renderOpts.fetchMetrics;let l=W.renderOpts.pendingWaitUntil;l&&n.waitUntil&&(n.waitUntil(l),l=void 0);let c=W.renderOpts.collectedTags;if(!L)return await (0,f.sendResponse)(Y,G,r,W.renderOpts.pendingWaitUntil),null;{let e=await r.blob(),t=(0,m.toNodeOutgoingHttpHeaders)(r.headers);c&&(t[h.NEXT_CACHE_TAGS_HEADER]=c),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let a=void 0!==W.renderOpts.collectedRevalidate&&!(W.renderOpts.collectedRevalidate>=h.INFINITE_CACHE)&&W.renderOpts.collectedRevalidate,n=void 0===W.renderOpts.collectedExpire||W.renderOpts.collectedExpire>=h.INFINITE_CACHE?void 0:W.renderOpts.collectedExpire;return{value:{kind:y.CachedRouteKind.APP_ROUTE,status:r.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:a,expire:n}}}}catch(t){throw(null==a?void 0:a.isStale)&&await E.onRequestError(e,t,{routerKind:"App Router",routePath:w,routeType:"route",revalidateReason:(0,p.getRevalidateReason)({isStaticGeneration:U,isOnDemandRevalidate:T})},b),t}},d=await E.handleResponse({req:e,nextConfig:I,cacheKey:q,routeKind:a.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:O,isRoutePPREnabled:!1,isOnDemandRevalidate:T,revalidateOnlyGenerated:C,responseGenerator:c,waitUntil:n.waitUntil,isMinimalMode:s});if(!L)return null;if((null==d||null==(r=d.value)?void 0:r.kind)!==y.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==d||null==(l=d.value)?void 0:l.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});s||t.setHeader("x-nextjs-cache",T?"REVALIDATED":d.isMiss?"MISS":d.isStale?"STALE":"HIT"),A&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let u=(0,m.fromNodeOutgoingHttpHeaders)(d.value.headers);return s&&L||u.delete(h.NEXT_CACHE_TAGS_HEADER),!d.cacheControl||t.getHeader("Cache-Control")||u.get("Cache-Control")||u.set("Cache-Control",(0,_.getCacheControlHeader)(d.cacheControl)),await (0,f.sendResponse)(Y,G,new Response(d.value.body,{headers:u,status:d.value.status||200})),null};H?await l(H):await F.withPropagatedContext(e.headers,()=>F.trace(u.BaseServerSpan.handleRequest,{spanName:`${j} ${w}`,kind:r.SpanKind.SERVER,attributes:{"http.method":j,"http.target":e.url}},l))}catch(t){if(t instanceof g.NoFallbackError||await E.onRequestError(e,t,{routerKind:"App Router",routePath:k,routeType:"route",revalidateReason:(0,p.getRevalidateReason)({isStaticGeneration:U,isOnDemandRevalidate:T})}),L)throw t;return await (0,f.sendResponse)(Y,G,new Response(null,{status:500})),null}}e.s(["handler",()=>N,"patchFetch",()=>C,"routeModule",()=>E,"serverHooks",()=>T,"workAsyncStorage",()=>O,"workUnitAsyncStorage",()=>b],33543)},83768,e=>{e.v(t=>Promise.all(["server/chunks/lib_cache-router_ts_c67d7e26._.js"].map(t=>e.l(t))).then(()=>t(84204)))},56504,e=>{e.v(t=>Promise.all(["server/chunks/lib_8af6ed8c._.js"].map(t=>e.l(t))).then(()=>t(15794)))},54934,e=>{e.v(t=>Promise.all(["server/chunks/lib_scoring_ts_dbd9e788._.js"].map(t=>e.l(t))).then(()=>t(77618)))},23608,e=>{e.v(e=>Promise.resolve().then(()=>e(23875)))}];

//# sourceMappingURL=%5Broot-of-the-server%5D__b54afd5d._.js.map