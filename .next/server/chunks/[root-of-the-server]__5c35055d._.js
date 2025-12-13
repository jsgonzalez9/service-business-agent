module.exports=[18622,(e,t,a)=>{t.exports=e.x("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js"))},56704,(e,t,a)=>{t.exports=e.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},32319,(e,t,a)=>{t.exports=e.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},24725,(e,t,a)=>{t.exports=e.x("next/dist/server/app-render/after-task-async-storage.external.js",()=>require("next/dist/server/app-render/after-task-async-storage.external.js"))},93695,(e,t,a)=>{t.exports=e.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},89660,e=>{"use strict";e.i(49360);var t=e.i(77475),a=e.i(61680);async function r(){let e=await (0,a.cookies)();return(0,t.createServerClient)("https://cweluauwjzameqxlcpkj.supabase.co","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN3ZWx1YXV3anphbWVxeGxjcGtqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0NjQwODAsImV4cCI6MjA4MDA0MDA4MH0.wrulNixV7KhaEHCTIFUlKmiv9pnfZpoXhTbhqTXrp3E",{cookies:{getAll:()=>e.getAll(),setAll(t){try{t.forEach(({name:t,value:a,options:r})=>e.set(t,a,r))}catch{}}}})}e.s(["createClient",()=>r])},14747,(e,t,a)=>{t.exports=e.x("path",()=>require("path"))},24361,(e,t,a)=>{t.exports=e.x("util",()=>require("util"))},22734,(e,t,a)=>{t.exports=e.x("fs",()=>require("fs"))},32721,e=>{"use strict";var t=e.i(12396),a=e.i(89660);let r=process.env.TWILIO_ACCOUNT_SID,n=process.env.TWILIO_AUTH_TOKEN,o=process.env.TWILIO_PHONE_NUMBER,s=process.env.TWILIO_CALLER_ID,i=(process.env.TWILIO_NUMBER_POOL||"").split(",").map(e=>e.trim()).filter(e=>e.length>0),l=Number(process.env.SMS_MONTHLY_LIMIT_PER_NUMBER||1e4);async function c(){let e=i.length>0?i:o?[o]:[];if(0===e.length)return[];try{let t,r=await (0,a.createClient)(),{data:n}=await r.from("call_events").select("event_data, created_at").eq("event_type","sms_sent").gte("created_at",((t=new Date).setDate(1),t.setHours(0,0,0,0),t.toISOString())),o={};for(let e of n||[]){let t=e.event_data?.from;"string"==typeof t&&(o[t]=(o[t]||0)+1)}return e.filter(e=>(o[e]||0)<l).sort((e,t)=>(o[e]||0)-(o[t]||0))}catch{return e}}function u(){return r&&n?(0,t.default)(r,n):(console.warn("Twilio credentials not configured"),null)}function d(){if(s&&s.length>0)return s;let e=i.length>0?i:o?[o]:[];return e.length>0?e[0]:null}async function p(e,t,r){let n=u();if(!n){let a=r?.withFooter??!0?"\n\nReply STOP to unsubscribe":"",n=`${t}${a}`;return console.log(`[MOCK SMS] To: ${e}
Message: ${n}`),{sid:`mock_${Date.now()}`,error:null}}let o=Number(process.env.SMS_QUIET_HOURS_START||8),s=Number(process.env.SMS_QUIET_HOURS_END||21),i=new Date().getHours();if(i<o||i>=s)return{sid:null,error:"Quiet hours active; message not sent"};if(!r?.bypassSuppression)try{let t=await (0,a.createClient)(),r=e.replace(/\D/g,"");10===r.length?r=`+1${r}`:11===r.length&&r.startsWith("1")?r=`+${r}`:r.startsWith("+")||(r=`+${r}`);let{data:n}=await t.from("leads").select("*").eq("phone_number",r).single();if(n&&n.is_opted_out)return{sid:null,error:"Recipient has opted out"}}catch{}let l=await c();if(0===l.length)return{sid:null,error:"No available Twilio sender number (check pool or config)"};try{try{let e=await (0,a.createClient)(),t=new Date(Date.now()-6e4).toISOString(),{count:r}=await e.from("sms_events").select("id",{count:"exact",head:!0}).gte("created_at",t),n=Number(process.env.SMS_RATE_LIMIT_PER_MIN||25);if((r||0)>=n)return{sid:null,error:"Rate limit exceeded, try later"}}catch{}let o=[];try{let e=await (0,a.createClient)(),{data:t}=await e.from("agent_config").select("*").limit(1).single(),r=t?.company_name||"Your Company";o.push(`${r}: real estate lead generation`)}catch{o.push("Real estate lead generation")}o.push("Msg & data rates may apply"),o.push("Reply HELP for help"),o.push("Reply STOP to unsubscribe");let s=o.join(" • "),i=r?.withFooter??!0?`

${s}`:"",c=`${t}${i}`,u=`${process.env.NEXT_PUBLIC_APP_URL||"http://localhost:3000"}/api/twilio/status`,d=null;for(let r of l)try{let o=await n.messages.create({body:c,from:r,to:e,statusCallback:u});try{let n=await (0,a.createClient)();await n.from("sms_events").insert({sid:o.sid,to_number:e,from_number:r,status:"sent",error:null,body:t})}catch{}return{sid:o.sid,error:null}}catch(e){d=e?.message?String(e.message):"Failed to send SMS";continue}try{let r=await (0,a.createClient)();await r.from("sms_events").insert({sid:null,to_number:e,from_number:l[0],status:"failed",error:d||"Failed to send SMS",body:t})}catch{}return{sid:null,error:d||"Failed to send SMS"}}catch(e){return console.error("Error sending SMS:",e),{sid:null,error:e instanceof Error?e.message:"Failed to send SMS"}}}function f(e,a,r){return!n||t.default.validateRequest(n,e,a,r)}e.s(["chooseCallerId",()=>d,"eligibleNumbersSorted",()=>c,"getTwilioClient",()=>u,"sendSMS",()=>p,"validateTwilioRequest",()=>f])},51508,(e,t,a)=>{"use strict";t.exports=e.r(64183).vendored["react-rsc"].ReactServerDOMTurbopackServer},66495,(e,t,a)=>{"use strict";Object.defineProperty(a,"__esModule",{value:!0}),Object.defineProperty(a,"registerServerReference",{enumerable:!0,get:function(){return r.registerServerReference}});let r=e.r(51508)},83939,(e,t,a)=>{"use strict";function r(e){for(let t=0;t<e.length;t++){let a=e[t];if("function"!=typeof a)throw Object.defineProperty(Error(`A "use server" file can only export async functions, found ${typeof a}.
Read more: https://nextjs.org/docs/messages/invalid-use-server-value`),"__NEXT_ERROR_CODE",{value:"E352",enumerable:!1,configurable:!0})}}Object.defineProperty(a,"__esModule",{value:!0}),Object.defineProperty(a,"ensureServerEntryExports",{enumerable:!0,get:function(){return r}})},16303,e=>{"use strict";var t=e.i(89660);e.i(86864);var a=e.i(77058);let r=`You are the Lead Outreach Agent for a real estate wholesaling company. 
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
}`,n=`You are the Advanced Negotiation & Closing Agent for a real estate wholesaling company.
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

OUTPUT: SMS text messages only. Keep responses professional but concise.`,o=["agree","accept","deal","ready to sell","let's do it","sounds good","too low","not enough","more money","higher","counteroffer","counter offer","my price","i want","need at least","won't accept","can't accept","final offer","best offer","walk away","not interested anymore","lawyer","attorney","legal","contract terms","contingency"],s=new a.default({apiKey:process.env.OPENAI_API_KEY});async function i(e,t){let a=await s.chat.completions.create({model:"gpt-5.1",max_tokens:800,temperature:.7,messages:[{role:"system",content:e},{role:"user",content:t}]});return{text:a.choices[0]?.message?.content||"",usage:a.usage}}async function l(){let e=await (0,t.createClient)(),{data:a,error:r}=await e.from("agent_config").select("*").single();return r||!a?{id:"",company_name:"CashBuyer Properties",wholesaling_fee:1e4,arv_multiplier:.7,follow_up_hours:24,max_follow_ups:3,followup_backoff_minutes:15,followup_max_attempts:3,llm_cache_enabled:!0,llm_cache_confidence_floor:.85,llm_cache_ttl_faq_days:30,llm_cache_ttl_objection_days:14,auto_dispo_eval_enabled:!0,auto_renegotiate_days_threshold:5,auto_cancel_days_threshold:10,auto_dispo_require_human_confirm:!0,created_at:new Date().toISOString(),updated_at:new Date().toISOString()}:a}async function c(e){let a=await (0,t.createClient)(),{data:r,error:n}=await a.from("messages").select("*").eq("lead_id",e).order("created_at",{ascending:!0});return n?(console.error("Error fetching conversation history:",n),[]):r}async function u(t,a,s){let l,u;try{let{classifyIntent:r,normalizeQuestion:n,lookupCached:o}=await e.A(83768),{findCachedByEmbedding:i}=await e.A(56504),l=r(a);if(!1!==s.llm_cache_enabled&&l.startsWith("FAQ")){let e=n(a),{text:r,confidence:c}=await o(l,e);if(r&&c>=.85)return{message:r,updatedLead:{},newState:void 0,modelUsed:"gpt-5.1",escalated:!1,callIntent:{action:"none"}};{let e="number"==typeof s.llm_cache_confidence_floor?s.llm_cache_confidence_floor:.85,r=l.startsWith("FAQ")?s.llm_cache_ttl_faq_days??30:s.llm_cache_ttl_objection_days??14,n=t.state||void 0,o=s.llm_cache_market_overrides||{};n&&o[n]&&(e=o[n].confidence_floor??e,r=l.startsWith("FAQ")?o[n].ttl_faq_days??r:o[n].ttl_objection_days??r);let c=await i(l,a,n,e,r);if(c.text&&c.confidence>=.85)return{message:c.text,updatedLead:{},newState:void 0,modelUsed:"gpt-5.1",escalated:!1,callIntent:{action:"none"}}}}}catch{}let d=await c(t.id),p=function(e,t){let a=e.toLowerCase();if(["offer_made","contract_sent","offer_accepted"].includes(t))return!0;for(let e of o)if(a.includes(e))return!0;if(/\$[\d,]+|\d+k|\d+\s*(thousand|k)/i.test(a)){for(let e of["but","however","actually","really","honestly","no","not"])if(a.includes(e))return!0}return!1}(a,t.conversation_state),f="HOT"===t.pipeline_status?"closer, professional, concise":"friendly, helpful, concise",m=`
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
`,_=d.map(e=>`${"inbound"===e.direction?"SELLER":"AGENT"}: ${e.content}`).join("\n"),h=p?`${m}

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
}`,{text:g}=await i(p?n:r,h);try{let e=g.match(/\{[\s\S]*\}/);l=e?JSON.parse(e[0]):{smsResponse:g,callIntent:{action:"none"},extractedInfo:{}}}catch{l={smsResponse:g,callIntent:{action:"none"},extractedInfo:{}}}let w={};l.extractedInfo?.propertyCondition&&(w.property_condition=l.extractedInfo.propertyCondition),l.extractedInfo?.motivation&&(w.motivation=l.extractedInfo.motivation),l.extractedInfo?.timeline&&(w.timeline=l.extractedInfo.timeline),l.extractedInfo?.priceExpectation&&(w.price_expectation=Number(l.extractedInfo.priceExpectation)),l.counterOfferAmount&&(w.notes=`${t.notes||""}
Seller counter offer: $${l.counterOfferAmount}`.trim(),w.offer_amount=Number(l.counterOfferAmount));try{let{scoreLead:a}=await e.A(54934);w.score=a(t,d),w.score_updated_at=new Date().toISOString()}catch{}l.offerAccepted||l.readyForContract?u="offer_accepted":l.shouldMakeOffer&&"offer_made"!==t.conversation_state?u="offer_made":l.suggestedState&&(u=l.suggestedState),l.extractedInfo?.mortgageOwed&&(w.mortgage_owed=Number(l.extractedInfo.mortgageOwed));let y=l.callIntent||{action:"none"};(l.shouldMakeOffer||l.readyForContract)&&t.arv&&t.repair_estimate&&(w.offer_amount=function(e,t,a,r=.7){return Math.max(0,Math.round(e*r-t-a))}(t.arv,t.repair_estimate,s.wholesaling_fee,s.arv_multiplier));try{let{enforceRails:a,mao:r}=await e.A(23608),n=r(t.arv||0,t.repair_estimate||0,s.wholesaling_fee,s.arv_multiplier),o=a(t,n,w.offer_amount||void 0);!o.allowed&&o.nextAmount&&(w.offer_amount=o.nextAmount)}catch{}return{message:l.smsResponse,updatedLead:w,newState:u,modelUsed:"gpt-5.1",escalated:p,callIntent:y}}async function d(e,t){return`Hi ${e.name}, this is ${t.company_name}. Are you still interested in selling ${e.address}? We make fair cash offers and can close quickly. Reply YES if you'd like to learn more!`}async function p(e,t){switch(e.conversation_state){case"contacted":return`Hi ${e.name}, just following up on my message about ${e.address}. We're still interested in making you a fair cash offer. Let me know if you have any questions!`;case"offer_made":return`Hi ${e.name}, just checking if you had a chance to consider our offer of $${e.offer_amount?.toLocaleString()} for ${e.address}. Let me know your thoughts!`;case"contract_sent":return`Hi ${e.name}, just checking if you had a chance to review the contract for ${e.address}. Let me know if you have any questions!`;default:return`Hi ${e.name}, this is ${t.company_name} following up about ${e.address}. Are you still interested in selling? We'd love to help!`}}e.s(["generateAgentResponse",()=>u,"generateFollowUp",()=>p,"generateInitialOutreach",()=>d,"getAgentConfig",()=>l])},87972,e=>{"use strict";var t=e.i(55454),a=e.i(78872),r=e.i(51045),n=e.i(17396),o=e.i(37276),s=e.i(63400),i=e.i(51826),l=e.i(52747),c=e.i(59428),u=e.i(81124),d=e.i(46569),p=e.i(21392),f=e.i(12613),m=e.i(2254),_=e.i(7707),h=e.i(55431),g=e.i(93695);e.i(33109);var w=e.i(30833),y=e.i(61760),v=e.i(89660),x=e.i(16303),S=e.i(54233),R=e.i(32721);async function I(e){try{let e=await (0,v.createClient)(),t=await (0,x.getAgentConfig)(),a=new Date;a.setHours(a.getHours()-t.follow_up_hours);let{data:r,error:n}=await e.from("leads").select("*").in("conversation_state",["contacted","offer_made","contract_sent"]).lt("last_message_at",a.toISOString()).lt("follow_up_count",t.max_follow_ups).order("last_message_at",{ascending:!0});if(n)return console.error("Error fetching leads for follow-up:",n),y.NextResponse.json({error:"Failed to fetch leads"},{status:500});let o=[];for(let e of r||[])try{let a=await (0,x.generateFollowUp)(e,t),{sid:r,error:n}=await (0,R.sendSMS)(e.phone_number,a);if(n){o.push({leadId:e.id,success:!1,error:n});continue}await (0,S.saveMessage)({lead_id:e.id,direction:"outbound",content:a,twilio_sid:r||void 0}),await (0,S.updateLead)(e.id,{follow_up_count:e.follow_up_count+1,last_message_at:new Date().toISOString()}),o.push({leadId:e.id,success:!0,message:a})}catch(t){console.error(`Error following up with lead ${e.id}:`,t),o.push({leadId:e.id,success:!1,error:t instanceof Error?t.message:"Unknown error"})}return y.NextResponse.json({success:!0,processed:o.length,results:o})}catch(e){return console.error("Error in follow-up job:",e),y.NextResponse.json({error:"Follow-up job failed"},{status:500})}}async function E(){try{let e=await (0,v.createClient)(),t=await (0,x.getAgentConfig)(),a=new Date;a.setHours(a.getHours()-t.follow_up_hours);let{data:r,error:n}=await e.from("leads").select("id, name, phone_number, address, conversation_state, last_message_at, follow_up_count").in("conversation_state",["contacted","offer_made","contract_sent"]).lt("last_message_at",a.toISOString()).lt("follow_up_count",t.max_follow_ups).order("last_message_at",{ascending:!0});if(n)return y.NextResponse.json({error:"Failed to fetch leads"},{status:500});return y.NextResponse.json({count:r?.length||0,leads:r||[],config:{follow_up_hours:t.follow_up_hours,max_follow_ups:t.max_follow_ups}})}catch(e){return console.error("Error checking follow-ups:",e),y.NextResponse.json({error:"Failed to check follow-ups"},{status:500})}}e.s(["GET",()=>E,"POST",()=>I],38430);var b=e.i(38430);let O=new t.AppRouteRouteModule({definition:{kind:a.RouteKind.APP_ROUTE,page:"/api/follow-up/route",pathname:"/api/follow-up",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/app/api/follow-up/route.ts",nextConfigOutput:"",userland:b}),{workAsyncStorage:A,workUnitAsyncStorage:T,serverHooks:N}=O;function C(){return(0,r.patchFetch)({workAsyncStorage:A,workUnitAsyncStorage:T})}async function $(e,t,r){O.isDev&&(0,n.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let y="/api/follow-up/route";y=y.replace(/\/index$/,"")||"/";let v=await O.prepare(e,t,{srcPage:y,multiZoneDraftMode:!1});if(!v)return t.statusCode=400,t.end("Bad Request"),null==r.waitUntil||r.waitUntil.call(r,Promise.resolve()),null;let{buildId:x,params:S,nextConfig:R,parsedUrl:I,isDraftMode:E,prerenderManifest:b,routerServerContext:A,isOnDemandRevalidate:T,revalidateOnlyGenerated:N,resolvedPathname:C,clientReferenceManifest:$,serverActionsManifest:M}=v,k=(0,l.normalizeAppPath)(y),P=!!(b.dynamicRoutes[k]||b.routes[C]),L=async()=>((null==A?void 0:A.render404)?await A.render404(e,t,I,!1):t.end("This page could not be found"),null);if(P&&!E){let e=!!b.routes[C],t=b.dynamicRoutes[k];if(t&&!1===t.fallback&&!e){if(R.experimental.adapterPath)return await L();throw new g.NoFallbackError}}let j=null;!P||O.isDev||E||(j="/index"===(j=C)?"/":j);let D=!0===O.isDev||!P,U=P&&!D;M&&$&&(0,s.setReferenceManifestsSingleton)({page:y,clientReferenceManifest:$,serverActionsManifest:M,serverModuleMap:(0,i.createServerModuleMap)({serverActionsManifest:M})});let q=e.method||"GET",F=(0,o.getTracer)(),H=F.getActiveScopeSpan(),W={params:S,prerenderManifest:b,renderOpts:{experimental:{authInterrupts:!!R.experimental.authInterrupts},cacheComponents:!!R.cacheComponents,supportsDynamicResponse:D,incrementalCache:(0,n.getRequestMeta)(e,"incrementalCache"),cacheLifeProfiles:R.cacheLife,waitUntil:r.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,a,r)=>O.onRequestError(e,t,r,A)},sharedContext:{buildId:x}},Y=new c.NodeNextRequest(e),G=new c.NodeNextResponse(t),K=u.NextRequestAdapter.fromNodeNextRequest(Y,(0,u.signalFromNodeResponse)(t));try{let s=async e=>O.handle(K,W).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let a=F.getRootSpanAttributes();if(!a)return;if(a.get("next.span_type")!==d.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${a.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let r=a.get("next.route");if(r){let t=`${q} ${r}`;e.setAttributes({"next.route":r,"http.route":r,"next.span_name":t}),e.updateName(t)}else e.updateName(`${q} ${y}`)}),i=!!(0,n.getRequestMeta)(e,"minimalMode"),l=async n=>{var o,l;let c=async({previousCacheEntry:a})=>{try{if(!i&&T&&N&&!a)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let o=await s(n);e.fetchMetrics=W.renderOpts.fetchMetrics;let l=W.renderOpts.pendingWaitUntil;l&&r.waitUntil&&(r.waitUntil(l),l=void 0);let c=W.renderOpts.collectedTags;if(!P)return await (0,f.sendResponse)(Y,G,o,W.renderOpts.pendingWaitUntil),null;{let e=await o.blob(),t=(0,m.toNodeOutgoingHttpHeaders)(o.headers);c&&(t[h.NEXT_CACHE_TAGS_HEADER]=c),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let a=void 0!==W.renderOpts.collectedRevalidate&&!(W.renderOpts.collectedRevalidate>=h.INFINITE_CACHE)&&W.renderOpts.collectedRevalidate,r=void 0===W.renderOpts.collectedExpire||W.renderOpts.collectedExpire>=h.INFINITE_CACHE?void 0:W.renderOpts.collectedExpire;return{value:{kind:w.CachedRouteKind.APP_ROUTE,status:o.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:a,expire:r}}}}catch(t){throw(null==a?void 0:a.isStale)&&await O.onRequestError(e,t,{routerKind:"App Router",routePath:y,routeType:"route",revalidateReason:(0,p.getRevalidateReason)({isStaticGeneration:U,isOnDemandRevalidate:T})},A),t}},u=await O.handleResponse({req:e,nextConfig:R,cacheKey:j,routeKind:a.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:b,isRoutePPREnabled:!1,isOnDemandRevalidate:T,revalidateOnlyGenerated:N,responseGenerator:c,waitUntil:r.waitUntil,isMinimalMode:i});if(!P)return null;if((null==u||null==(o=u.value)?void 0:o.kind)!==w.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==u||null==(l=u.value)?void 0:l.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});i||t.setHeader("x-nextjs-cache",T?"REVALIDATED":u.isMiss?"MISS":u.isStale?"STALE":"HIT"),E&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let d=(0,m.fromNodeOutgoingHttpHeaders)(u.value.headers);return i&&P||d.delete(h.NEXT_CACHE_TAGS_HEADER),!u.cacheControl||t.getHeader("Cache-Control")||d.get("Cache-Control")||d.set("Cache-Control",(0,_.getCacheControlHeader)(u.cacheControl)),await (0,f.sendResponse)(Y,G,new Response(u.value.body,{headers:d,status:u.value.status||200})),null};H?await l(H):await F.withPropagatedContext(e.headers,()=>F.trace(d.BaseServerSpan.handleRequest,{spanName:`${q} ${y}`,kind:o.SpanKind.SERVER,attributes:{"http.method":q,"http.target":e.url}},l))}catch(t){if(t instanceof g.NoFallbackError||await O.onRequestError(e,t,{routerKind:"App Router",routePath:k,routeType:"route",revalidateReason:(0,p.getRevalidateReason)({isStaticGeneration:U,isOnDemandRevalidate:T})}),P)throw t;return await (0,f.sendResponse)(Y,G,new Response(null,{status:500})),null}}e.s(["handler",()=>$,"patchFetch",()=>C,"routeModule",()=>O,"serverHooks",()=>N,"workAsyncStorage",()=>A,"workUnitAsyncStorage",()=>T],87972)},83768,e=>{e.v(t=>Promise.all(["server/chunks/lib_cache-router_ts_c67d7e26._.js"].map(t=>e.l(t))).then(()=>t(84204)))},56504,e=>{e.v(t=>Promise.all(["server/chunks/lib_8af6ed8c._.js"].map(t=>e.l(t))).then(()=>t(15794)))},54934,e=>{e.v(t=>Promise.all(["server/chunks/lib_scoring_ts_dbd9e788._.js"].map(t=>e.l(t))).then(()=>t(77618)))},23608,e=>{e.v(t=>Promise.all(["server/chunks/lib_negotiation-rails_ts_f535b509._.js"].map(t=>e.l(t))).then(()=>t(23875)))}];

//# sourceMappingURL=%5Broot-of-the-server%5D__5c35055d._.js.map