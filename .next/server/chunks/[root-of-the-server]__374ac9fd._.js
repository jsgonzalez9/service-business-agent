module.exports=[18622,(e,t,n)=>{t.exports=e.x("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js"))},56704,(e,t,n)=>{t.exports=e.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},32319,(e,t,n)=>{t.exports=e.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},24725,(e,t,n)=>{t.exports=e.x("next/dist/server/app-render/after-task-async-storage.external.js",()=>require("next/dist/server/app-render/after-task-async-storage.external.js"))},93695,(e,t,n)=>{t.exports=e.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},89660,e=>{"use strict";e.i(49360);var t=e.i(77475),n=e.i(61680);async function o(){let e=await (0,n.cookies)();return(0,t.createServerClient)("https://cweluauwjzameqxlcpkj.supabase.co","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN3ZWx1YXV3anphbWVxeGxjcGtqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0NjQwODAsImV4cCI6MjA4MDA0MDA4MH0.wrulNixV7KhaEHCTIFUlKmiv9pnfZpoXhTbhqTXrp3E",{cookies:{getAll:()=>e.getAll(),setAll(t){try{t.forEach(({name:t,value:n,options:o})=>e.set(t,n,o))}catch{}}}})}e.s(["createClient",()=>o])},14747,(e,t,n)=>{t.exports=e.x("path",()=>require("path"))},24361,(e,t,n)=>{t.exports=e.x("util",()=>require("util"))},22734,(e,t,n)=>{t.exports=e.x("fs",()=>require("fs"))},32721,e=>{"use strict";var t=e.i(12396),n=e.i(89660);let o=process.env.TWILIO_ACCOUNT_SID,r=process.env.TWILIO_AUTH_TOKEN,a=process.env.TWILIO_PHONE_NUMBER,s=process.env.TWILIO_CALLER_ID,i=(process.env.TWILIO_NUMBER_POOL||"").split(",").map(e=>e.trim()).filter(e=>e.length>0),l=Number(process.env.SMS_MONTHLY_LIMIT_PER_NUMBER||1e4);async function c(){let e=i.length>0?i:a?[a]:[];if(0===e.length)return[];try{let t,o=await (0,n.createClient)(),{data:r}=await o.from("call_events").select("event_data, created_at").eq("event_type","sms_sent").gte("created_at",((t=new Date).setDate(1),t.setHours(0,0,0,0),t.toISOString())),a={};for(let e of r||[]){let t=e.event_data?.from;"string"==typeof t&&(a[t]=(a[t]||0)+1)}return e.filter(e=>(a[e]||0)<l).sort((e,t)=>(a[e]||0)-(a[t]||0))}catch{return e}}function d(){return o&&r?(0,t.default)(o,r):(console.warn("Twilio credentials not configured"),null)}function u(){if(s&&s.length>0)return s;let e=i.length>0?i:a?[a]:[];return e.length>0?e[0]:null}async function p(e,t,o){let r=d();if(!r){let n=o?.withFooter??!0?"\n\nReply STOP to unsubscribe":"",r=`${t}${n}`;return console.log(`[MOCK SMS] To: ${e}
Message: ${r}`),{sid:`mock_${Date.now()}`,error:null}}let a=Number(process.env.SMS_QUIET_HOURS_START||8),s=Number(process.env.SMS_QUIET_HOURS_END||21),i=new Date().getHours();if(i<a||i>=s)return{sid:null,error:"Quiet hours active; message not sent"};if(!o?.bypassSuppression)try{let t=await (0,n.createClient)(),o=e.replace(/\D/g,"");10===o.length?o=`+1${o}`:11===o.length&&o.startsWith("1")?o=`+${o}`:o.startsWith("+")||(o=`+${o}`);let{data:r}=await t.from("leads").select("*").eq("phone_number",o).single();if(r&&r.is_opted_out)return{sid:null,error:"Recipient has opted out"}}catch{}let l=await c();if(0===l.length)return{sid:null,error:"No available Twilio sender number (check pool or config)"};try{try{let e=await (0,n.createClient)(),t=new Date(Date.now()-6e4).toISOString(),{count:o}=await e.from("sms_events").select("id",{count:"exact",head:!0}).gte("created_at",t),r=Number(process.env.SMS_RATE_LIMIT_PER_MIN||25);if((o||0)>=r)return{sid:null,error:"Rate limit exceeded, try later"}}catch{}let a=[];try{let e=await (0,n.createClient)(),{data:t}=await e.from("agent_config").select("*").limit(1).single(),o=t?.company_name||"Your Company";a.push(`${o}: real estate lead generation`)}catch{a.push("Real estate lead generation")}a.push("Msg & data rates may apply"),a.push("Reply HELP for help"),a.push("Reply STOP to unsubscribe");let s=a.join(" • "),i=o?.withFooter??!0?`

${s}`:"",c=`${t}${i}`,d=`${process.env.NEXT_PUBLIC_APP_URL||"http://localhost:3000"}/api/twilio/status`,u=null;for(let o of l)try{let a=await r.messages.create({body:c,from:o,to:e,statusCallback:d});try{let r=await (0,n.createClient)();await r.from("sms_events").insert({sid:a.sid,to_number:e,from_number:o,status:"sent",error:null,body:t})}catch{}return{sid:a.sid,error:null}}catch(e){u=e?.message?String(e.message):"Failed to send SMS";continue}try{let o=await (0,n.createClient)();await o.from("sms_events").insert({sid:null,to_number:e,from_number:l[0],status:"failed",error:u||"Failed to send SMS",body:t})}catch{}return{sid:null,error:u||"Failed to send SMS"}}catch(e){return console.error("Error sending SMS:",e),{sid:null,error:e instanceof Error?e.message:"Failed to send SMS"}}}function f(e,n,o){return!r||t.default.validateRequest(r,e,n,o)}e.s(["chooseCallerId",()=>u,"eligibleNumbersSorted",()=>c,"getTwilioClient",()=>d,"sendSMS",()=>p,"validateTwilioRequest",()=>f])},51508,(e,t,n)=>{"use strict";t.exports=e.r(64183).vendored["react-rsc"].ReactServerDOMTurbopackServer},66495,(e,t,n)=>{"use strict";Object.defineProperty(n,"__esModule",{value:!0}),Object.defineProperty(n,"registerServerReference",{enumerable:!0,get:function(){return o.registerServerReference}});let o=e.r(51508)},83939,(e,t,n)=>{"use strict";function o(e){for(let t=0;t<e.length;t++){let n=e[t];if("function"!=typeof n)throw Object.defineProperty(Error(`A "use server" file can only export async functions, found ${typeof n}.
Read more: https://nextjs.org/docs/messages/invalid-use-server-value`),"__NEXT_ERROR_CODE",{value:"E352",enumerable:!1,configurable:!0})}}Object.defineProperty(n,"__esModule",{value:!0}),Object.defineProperty(n,"ensureServerEntryExports",{enumerable:!0,get:function(){return o}})},55156,e=>{"use strict";var t=e.i(46761);function n(){let e=process.env.SUPABASE_SERVICE_ROLE_KEY;return(0,t.createClient)("https://cweluauwjzameqxlcpkj.supabase.co",e)}e.s(["createServiceClient",()=>n])},16303,e=>{"use strict";var t=e.i(89660);e.i(86864);var n=e.i(77058);let o=`You are the Lead Outreach Agent for a real estate wholesaling company. 
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

OUTPUT: SMS text messages only. Keep responses professional but concise.`,a=["agree","accept","deal","ready to sell","let's do it","sounds good","too low","not enough","more money","higher","counteroffer","counter offer","my price","i want","need at least","won't accept","can't accept","final offer","best offer","walk away","not interested anymore","lawyer","attorney","legal","contract terms","contingency"],s=new n.default({apiKey:process.env.OPENAI_API_KEY});async function i(e,t){let n=await s.chat.completions.create({model:"gpt-5.1",max_tokens:800,temperature:.7,messages:[{role:"system",content:e},{role:"user",content:t}]});return{text:n.choices[0]?.message?.content||"",usage:n.usage}}async function l(){let e=await (0,t.createClient)(),{data:n,error:o}=await e.from("agent_config").select("*").single();return o||!n?{id:"",company_name:"CashBuyer Properties",wholesaling_fee:1e4,arv_multiplier:.7,follow_up_hours:24,max_follow_ups:3,followup_backoff_minutes:15,followup_max_attempts:3,llm_cache_enabled:!0,llm_cache_confidence_floor:.85,llm_cache_ttl_faq_days:30,llm_cache_ttl_objection_days:14,auto_dispo_eval_enabled:!0,auto_renegotiate_days_threshold:5,auto_cancel_days_threshold:10,auto_dispo_require_human_confirm:!0,created_at:new Date().toISOString(),updated_at:new Date().toISOString()}:n}async function c(e){let n=await (0,t.createClient)(),{data:o,error:r}=await n.from("messages").select("*").eq("lead_id",e).order("created_at",{ascending:!0});return r?(console.error("Error fetching conversation history:",r),[]):o}async function d(t,n,s){let l,d;try{let{classifyIntent:o,normalizeQuestion:r,lookupCached:a}=await e.A(83768),{findCachedByEmbedding:i}=await e.A(56504),l=o(n);if(!1!==s.llm_cache_enabled&&l.startsWith("FAQ")){let e=r(n),{text:o,confidence:c}=await a(l,e);if(o&&c>=.85)return{message:o,updatedLead:{},newState:void 0,modelUsed:"gpt-5.1",escalated:!1,callIntent:{action:"none"}};{let e="number"==typeof s.llm_cache_confidence_floor?s.llm_cache_confidence_floor:.85,o=l.startsWith("FAQ")?s.llm_cache_ttl_faq_days??30:s.llm_cache_ttl_objection_days??14,r=t.state||void 0,a=s.llm_cache_market_overrides||{};r&&a[r]&&(e=a[r].confidence_floor??e,o=l.startsWith("FAQ")?a[r].ttl_faq_days??o:a[r].ttl_objection_days??o);let c=await i(l,n,r,e,o);if(c.text&&c.confidence>=.85)return{message:c.text,updatedLead:{},newState:void 0,modelUsed:"gpt-5.1",escalated:!1,callIntent:{action:"none"}}}}}catch{}let u=await c(t.id),p=function(e,t){let n=e.toLowerCase();if(["offer_made","contract_sent","offer_accepted"].includes(t))return!0;for(let e of a)if(n.includes(e))return!0;if(/\$[\d,]+|\d+k|\d+\s*(thousand|k)/i.test(n)){for(let e of["but","however","actually","really","honestly","no","not"])if(n.includes(e))return!0}return!1}(n,t.conversation_state),f="HOT"===t.pipeline_status?"closer, professional, concise":"friendly, helpful, concise",m=`
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
`,_=u.map(e=>`${"inbound"===e.direction?"SELLER":"AGENT"}: ${e.content}`).join("\n"),h=p?`${m}

CONVERSATION HISTORY:
${_||"No previous messages"}

LATEST MESSAGE FROM SELLER (ESCALATED - Complex negotiation/agreement detected):
${n}

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
${n}

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
}`,{text:y}=await i(p?r:o,h);try{let e=y.match(/\{[\s\S]*\}/);l=e?JSON.parse(e[0]):{smsResponse:y,callIntent:{action:"none"},extractedInfo:{}}}catch{l={smsResponse:y,callIntent:{action:"none"},extractedInfo:{}}}let g={};l.extractedInfo?.propertyCondition&&(g.property_condition=l.extractedInfo.propertyCondition),l.extractedInfo?.motivation&&(g.motivation=l.extractedInfo.motivation),l.extractedInfo?.timeline&&(g.timeline=l.extractedInfo.timeline),l.extractedInfo?.priceExpectation&&(g.price_expectation=Number(l.extractedInfo.priceExpectation)),l.counterOfferAmount&&(g.notes=`${t.notes||""}
Seller counter offer: $${l.counterOfferAmount}`.trim(),g.offer_amount=Number(l.counterOfferAmount));try{let{scoreLead:n}=await e.A(54934);g.score=n(t,u),g.score_updated_at=new Date().toISOString()}catch{}l.offerAccepted||l.readyForContract?d="offer_accepted":l.shouldMakeOffer&&"offer_made"!==t.conversation_state?d="offer_made":l.suggestedState&&(d=l.suggestedState),l.extractedInfo?.mortgageOwed&&(g.mortgage_owed=Number(l.extractedInfo.mortgageOwed));let w=l.callIntent||{action:"none"};(l.shouldMakeOffer||l.readyForContract)&&t.arv&&t.repair_estimate&&(g.offer_amount=function(e,t,n,o=.7){return Math.max(0,Math.round(e*o-t-n))}(t.arv,t.repair_estimate,s.wholesaling_fee,s.arv_multiplier));try{let{enforceRails:n,mao:o}=await e.A(23608),r=o(t.arv||0,t.repair_estimate||0,s.wholesaling_fee,s.arv_multiplier),a=n(t,r,g.offer_amount||void 0);!a.allowed&&a.nextAmount&&(g.offer_amount=a.nextAmount)}catch{}return{message:l.smsResponse,updatedLead:g,newState:d,modelUsed:"gpt-5.1",escalated:p,callIntent:w}}async function u(e,t){return`Hi ${e.name}, this is ${t.company_name}. Are you still interested in selling ${e.address}? We make fair cash offers and can close quickly. Reply YES if you'd like to learn more!`}async function p(e,t){switch(e.conversation_state){case"contacted":return`Hi ${e.name}, just following up on my message about ${e.address}. We're still interested in making you a fair cash offer. Let me know if you have any questions!`;case"offer_made":return`Hi ${e.name}, just checking if you had a chance to consider our offer of $${e.offer_amount?.toLocaleString()} for ${e.address}. Let me know your thoughts!`;case"contract_sent":return`Hi ${e.name}, just checking if you had a chance to review the contract for ${e.address}. Let me know if you have any questions!`;default:return`Hi ${e.name}, this is ${t.company_name} following up about ${e.address}. Are you still interested in selling? We'd love to help!`}}e.s(["generateAgentResponse",()=>d,"generateFollowUp",()=>p,"generateInitialOutreach",()=>u,"getAgentConfig",()=>l])},76296,e=>{"use strict";var t=e.i(66495);e.i(49360);var n=e.i(77475),o=e.i(61680),r=e.i(83939);let a=(0,n.createServerClient)("https://cweluauwjzameqxlcpkj.supabase.co",process.env.SUPABASE_SERVICE_ROLE_KEY,{cookies:{getAll:async()=>(await (0,o.cookies)()).getAll(),setAll:async e=>{let t=await (0,o.cookies)();e.forEach(({name:e,value:n,options:o})=>{t.set(e,n,o)})}}});async function s(e,t){try{let{data:n,error:o}=await a.from("calls").insert({lead_id:e,call_type:t,call_status:"pending"});if(o)return console.error("[Voice Calls] Create error:",o),null;return n?n[0]:null}catch(e){return console.error("[Voice Calls] Unexpected error:",e),null}}async function i(e,t){try{let{data:n,error:o}=await a.from("calls").update(t).eq("id",e).select();if(o)return console.error("[Voice Calls] Update error:",o),null;return n?n[0]:null}catch(e){return console.error("[Voice Calls] Unexpected error:",e),null}}async function l(e){try{let{data:t,error:n}=await a.from("calls").select("*").eq("lead_id",e).order("created_at",{ascending:!1});if(n)return console.error("[Voice Calls] Get error:",n),[];return t||[]}catch(e){return console.error("[Voice Calls] Unexpected error:",e),[]}}async function c(e,t,n){try{await a.from("call_events").insert({call_id:e,event_type:t,event_data:n})}catch(e){console.error("[Call Events] Error:",e)}}async function d(e){try{let{data:t,error:n}=await a.from("calls").select("*").eq("id",e).single();if(n||!t)return null;return t}catch(e){return console.error("[Voice Calls] Get by id error:",e),null}}async function u(e,t,n){try{let o=await s(e,"outbound");if(!o)return void console.error(`[Voice Call] Failed to create call record for lead: ${e}`);if(await c(o.id,"call_intent_detected",{intent_status:t,scheduled_time:n,triggered_at:new Date().toISOString()}),console.log(`[Voice Call Triggered] Call ID: ${o.id}, Lead ID: ${e}, Status: ${t}`),n)await c(o.id,"call_scheduled",{scheduled_time:n});else if("warm_call_requested"===t||"ready_for_offer_call"===t)try{let n=await fetch(`${process.env.NEXT_PUBLIC_APP_URL||"http://localhost:3000"}/api/twilio/voice/outbound`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({leadId:e,callIntentStatus:t})});n.ok||console.error("[Voice Call] Outbound call API failed:",await n.text())}catch(e){console.error("[Voice Call] Error initiating outbound call:",e)}}catch(t){console.error(`[Voice Call] Error triggering voice call for lead ${e}:`,t)}}(0,r.ensureServerEntryExports)([s,i,l,c,d,u]),(0,t.registerServerReference)(s,"60c4f3651eddf2a05452cf4a252465bf5986f70eb9",null),(0,t.registerServerReference)(i,"6091cbc9e18212fab4fc4cb820b5dfbbb5d7ea47ce",null),(0,t.registerServerReference)(l,"40d95380a22496e2bb96f2c8f0eda2ce9ecf3c9649",null),(0,t.registerServerReference)(c,"7017dae3015a5e4d437e384d004810d2637ab91c99",null),(0,t.registerServerReference)(d,"403459a7113e6f4c857714e455d7f0a1d490492282",null),(0,t.registerServerReference)(u,"70c7ca52c90d08b1548ddc89002077c9cb99af99ef",null),e.s(["addCallEvent",()=>c,"createCall",()=>s,"getCallById",()=>d,"triggerVoiceCall",()=>u,"updateCall",()=>i])},84204,e=>{"use strict";var t=e.i(89660);let n=[{intent:"FAQ_PROCESS",question:"How does this process work?",response:"We purchase homes directly for cash. After your property details are verified, we send a contract, and once signed, we match your property with buyers and move to closing."},{intent:"FAQ_PROCESS",question:"How long does it take to close?",response:"Closing typically takes 14–30 days depending on inspections, title, and buyer readiness."},{intent:"FAQ_CONTRACT",question:"Do I need an inspection?",response:"We buy as‑is. Inspections are optional and used to confirm details during the due‑diligence period."},{intent:"FAQ_GENERAL",question:"Do you buy homes as‑is?",response:"Yes, we purchase properties in their current condition. No repairs or cleaning needed."},{intent:"FAQ_PROCESS",question:"How do you determine your offer?",response:"We calculate offers using recent comps, repair estimates, and our MAO formula to ensure a fair, realistic price."},{intent:"NEGOTIATION",question:"Your offer is too low",response:"I understand. We aim to be competitive while factoring repairs and market data. Can we review comps together and see where we can meet?"},{intent:"NEGOTIATION",question:"I want more for my home",response:"I hear you. Our offer reflects current market and repairs. Let’s walk through the numbers and see if adjustments make sense."},{intent:"FAQ_CONTRACT",question:"Do I need to put down earnest money?",response:"No. As the seller, you do not provide earnest money. We handle earnest deposits with title when applicable."},{intent:"FAQ_FEES",question:"Do I pay closing costs?",response:"We typically cover standard closing costs, so you won’t pay anything out of pocket."},{intent:"FAQ_PROCESS",question:"When will I get paid?",response:"Funds are disbursed at closing — typically same day via wire or cashier’s check."},{intent:"FAQ_GENERAL",question:"Do I need to provide access?",response:"We’ll coordinate access with you, a key, or a lockbox so qualified buyers can view the property if needed."},{intent:"FAQ_GENERAL",question:"Do I need to fix anything before selling?",response:"No, we buy as‑is. Any repairs are factored into our offer — you don’t need to spend upfront."},{intent:"FAQ_TRUST",question:"Are you a wholesaler?",response:"Yes, we operate as compliant investors/wholesalers. We use standard agreements and licensed title companies."},{intent:"FAQ_GENERAL",question:"Can you take over my mortgage?",response:"In some cases we can take over payments subject‑to existing financing. We review details case by case."},{intent:"FAQ_GENERAL",question:"How do I opt‑out?",response:"Reply STOP at any time to unsubscribe from SMS updates."},{intent:"NEGOTIATION",question:"I need to think about it",response:"Absolutely — take the time you need. We can follow up in a few days if that works for you."},{intent:"NEGOTIATION",question:"Contact me later",response:"No problem. Tell me a good date and time, and I’ll follow up then."},{intent:"NEGOTIATION",question:"I’m not sure this is right for me",response:"Totally fair. I’m happy to answer questions so you can decide what’s best for your situation."},{intent:"NEGOTIATION",question:"I’m too busy right now",response:"Understood. We can schedule a quick call or text at a convenient time for you."},{intent:"FAQ_GENERAL",question:"Do I need to paint or fix small things?",response:"No — we buy as‑is, including minor issues. No prep needed."},{intent:"FAQ_GENERAL",question:"What about big repairs?",response:"We account for major repairs in our offer, so you won’t have to fix them first."},{intent:"FAQ_PROCESS",question:"Do I get multiple offers?",response:"Yes. We broadcast to vetted buyers and help you evaluate the strongest offers."},{intent:"FAQ_PROCESS",question:"How do I know which offer is best?",response:"We compare offers by price, terms, and buyer reliability to help you choose confidently."},{intent:"FAQ_FEES",question:"What is an assignment fee?",response:"It’s the fee paid to the wholesaler for securing the contract and finding a buyer."},{intent:"FAQ_CONTRACT",question:"How long is your offer valid?",response:"Offers are typically valid 48–72 hours to give you time to review and decide."},{intent:"FAQ_PROCESS",question:"I need to sell fast",response:"We specialize in quick closings and can often close in 14–21 days."},{intent:"FAQ_PROCESS",question:"Can I wait longer?",response:"Yes, we can accommodate your timeline. Just note the market can shift, affecting price."},{intent:"FAQ_PROCESS",question:"How do you calculate market value?",response:"We use recent comparable sales near your property along with current demand and condition."},{intent:"FAQ_PROCESS",question:"Do you subtract repair costs?",response:"Yes. Repair estimates are built into the offer so the number is realistic."},{intent:"FAQ_GENERAL",question:"How will you contact me?",response:"We use SMS and phone, aligned to your preferences."},{intent:"FAQ_TRUST",question:"Is my info confidential?",response:"Yes. Your information is kept confidential and only used for evaluating the property and closing."},{intent:"FAQ_FEES",question:"Are there any hidden fees?",response:"No hidden fees. Our process is transparent, and you won’t pay out‑of‑pocket."},{intent:"FAQ_GENERAL",question:"I’m moving out of state",response:"We can work remotely and handle documents online with the title company."},{intent:"FAQ_PROCESS",question:"Can we close same‑day?",response:"Rarely; proper processing is needed. 1–2 weeks is typical, though we expedite when possible."},{intent:"FAQ_GENERAL",question:"Do I need a real estate agent?",response:"No agent is required — we handle the purchase directly."},{intent:"FAQ_GENERAL",question:"I have a bankruptcy, can I sell?",response:"Yes. We review the specifics but bankruptcy doesn’t necessarily prevent closing."},{intent:"FAQ_GENERAL",question:"I have multiple properties",response:"We can evaluate each and even structure portfolio deals."}];function o(e){return e.toLowerCase().replace(/[^\w\s]/g,"").replace(/\s+/g," ").trim()}function r(e){let t=e.toLowerCase(),n=(...e)=>e.some(e=>t.includes(e));return n("how does","how it works","process","timeline","close","closing","offer","cash offer","sell fast","same-day","comps","valuation")?"FAQ_PROCESS":n("fee","fees","commission","commissions","costs","closing costs","assignment fee")?"FAQ_FEES":n("scam","legitimate","legit","credentials","license","are you real","wholesaler")?"FAQ_TRUST":n("contract","assignable","assignability","cancel","cancellation","inspection","inspection period","earnest","valid","validity","expires")?"FAQ_CONTRACT":n("tenants","mortgage","liens","inherited","probate","as-is","repairs","access","lockbox","opt-out","unsubscribe","agent","broker","bankruptcy","multiple properties")?"FAQ_GENERAL":n("address","street","zip","city","state")?"PROPERTY_SPECIFIC":n("price","offer more","counter","too low","higher")?"NEGOTIATION":n("stress","urgent","emergency","foreclosure","behind on payments")?"EMOTIONAL":"UNKNOWN"}async function a(e,o){try{let n=await (0,t.createClient)(),{data:r}=await n.from("cached_responses").select("id,response_text").eq("intent",e).eq("normalized_question",o).limit(1).maybeSingle();if(r?.response_text)return await n.from("cached_hits").insert({cached_response_id:r.id,question_raw:o,matched_confidence:1}),{text:r.response_text,confidence:1};let{data:a}=await n.from("cached_responses").select("id,response_text,normalized_question").eq("intent",e).limit(5),s=(a||[]).find(e=>String(e.normalized_question||"").includes(o.split(" ").slice(0,4).join(" ")));if(s?.response_text)return await n.from("cached_hits").insert({cached_response_id:s.id,question_raw:o,matched_confidence:.85}),{text:s.response_text,confidence:.85}}catch{}let r=e=>e.toLowerCase().replace(/[^\w\s]/g,"").replace(/\s+/g," ").trim(),a=n.find(t=>t.intent===e&&r(t.question)===o);if(a)return{text:a.response,confidence:.95};let s=n.find(t=>t.intent===e&&r(t.question).includes(o.split(" ").slice(0,4).join(" ")));return s?{text:s.response,confidence:.9}:{text:null,confidence:0}}async function s(e,n,o){let r=await (0,t.createClient)();await r.from("cached_responses").upsert({intent:e,normalized_question:n,response_text:o,updated_at:new Date().toISOString()},{onConflict:"intent,normalized_question"})}e.s(["classifyIntent",()=>r,"lookupCached",()=>a,"normalizeQuestion",()=>o,"storeCached",()=>s],84204)},84359,e=>{"use strict";var t=e.i(89660),n=e.i(12396);async function o(e){try{let n=await (0,t.createClient)();await n.from("a2p_logs").insert({entity_type:"lead",entity_id:e.id,level:"info",message:"hot_lead",meta:{name:e.name,phone:e.phone_number,address:e.address}})}catch{}let o=`HOT Lead: ${e.name}
${e.address}
Phone: ${e.phone_number}`;try{let e,t,r=process.env.ADMIN_NOTIFY_PHONE,a=process.env.TWILIO_PHONE_NUMBER,s=(e=process.env.TWILIO_ACCOUNT_SID,t=process.env.TWILIO_AUTH_TOKEN,e&&t?(0,n.default)(e,t):null);s&&r&&a&&await s.messages.create({to:r,from:a,body:o})}catch{}try{let e=process.env.TELEGRAM_BOT_TOKEN,t=process.env.TELEGRAM_CHAT_ID;e&&t&&await fetch(`https://api.telegram.org/bot${e}/sendMessage`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({chat_id:t,text:o})})}catch{}}e.s(["notifyHotLead",()=>o])},15794,e=>{"use strict";e.i(86864);var t=e.i(77058),n=e.i(55156);function o(e){return Math.sqrt(e.reduce((e,t)=>e+t*t,0))}async function r(e){let n=new t.default({apiKey:process.env.OPENAI_API_KEY});return(await n.embeddings.create({model:"text-embedding-3-small",input:e})).data[0].embedding}async function a(e,t,s,i=.85,l){let c=(0,n.createServiceClient)(),d=await r(t),u=c.from("cached_responses").select("id,response_text,embedding,intent,market,usage_count,created_at").eq("intent",e);s&&(u=u.eq("market",s));let{data:p}=await u.limit(200),f=Date.now(),m="number"==typeof l&&l>0?24*l*36e5:void 0,_=(p||[]).filter(e=>!m||f-new Date(e.created_at).getTime()<=m).map(e=>{var t;let n,r;return{id:e.id,text:e.response_text,score:(t=e.embedding||[],n=o(d),r=o(t),n&&r?function(e,t){let n=0;for(let o=0;o<Math.min(e.length,t.length);o++)n+=e[o]*t[o];return n}(d,t)/(n*r):0)}});_.sort((e,t)=>t.score-e.score);let h=_[0];if(h&&h.score>=i){let e=(p||[]).find(e=>e.id===h.id);return await c.from("cached_responses").update({usage_count:(e?.usage_count||0)+1,last_used_at:new Date().toISOString()}).eq("id",h.id),{text:h.text,confidence:h.score,id:h.id}}return{text:null,confidence:0}}e.s(["embedQuery",()=>r,"findCachedByEmbedding",()=>a])},83768,e=>{e.v(e=>Promise.resolve().then(()=>e(84204)))},56504,e=>{e.v(e=>Promise.resolve().then(()=>e(15794)))},54934,e=>{e.v(t=>Promise.all(["server/chunks/lib_scoring_ts_dbd9e788._.js"].map(t=>e.l(t))).then(()=>t(77618)))},23608,e=>{e.v(t=>Promise.all(["server/chunks/lib_negotiation-rails_ts_f535b509._.js"].map(t=>e.l(t))).then(()=>t(23875)))}];

//# sourceMappingURL=%5Broot-of-the-server%5D__374ac9fd._.js.map