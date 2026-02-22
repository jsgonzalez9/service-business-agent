# AI Revenue Automation Agent for Service Businesses

This project is an adaptation of the Wholesaling AI Agent, tailored for local service businesses (Roofing, HVAC, Med Spa, etc.).

## Key Features

1.  **Instant Missed Call Response**:
    - Automatically detects missed calls.
    - Sends an immediate SMS: "Sorry we missed your call. What service do you need help with?"
    - Logic located in `app/api/twilio/voice/incoming/route.ts`.

2.  **Lead Qualification**:
    - AI Agent (`lib/service-agent.ts`) qualifies leads based on:
        - **Service Type** (mapped to `motivation`)
        - **Urgency** (mapped to `timeline`)
        - **Property Type** (mapped to `property_condition`)
        - **Address**
    - Uses GPT-4o for intelligent conversation.

3.  **Automated Appointment Booking**:
    - Checks availability (Mocked in `lib/booking.ts`).
    - Proposes time slots to the user.
    - Confirms booking when user agrees (Status: `booked`).
    - Creates a booking record (Mocked).

4.  **Web Lead Integration**:
    - Endpoint: `/api/leads/web-inbound`
    - Accepts JSON: `{ name, phone, service_needed, address, message }`
    - Sends immediate confirmation SMS and starts the qualification flow.

5.  **7-Day Follow-up Sequence**:
    - Automated follow-ups on Day 1, 3, 5, 7.
    - Logic in `lib/followup-sequences.ts`.

6.  **Multi-tenancy Support**:
    - Database migration script provided: `scripts/042_add_tenancy.sql`.
    - Codebase updated to support `business_id` in `Lead` and `AgentConfig`.

## Setup

1.  **Environment Variables**:
    - Ensure `OPENAI_API_KEY` and `SUPABASE_URL`/`SUPABASE_SERVICE_ROLE_KEY` are set.
    - Set `COMPANY_NAME` for the initial SMS greeting.

2.  **Database Migration**:
    - Run `scripts/042_add_tenancy.sql` in your Supabase SQL Editor to enable multi-tenancy columns.

3.  **Twilio Configuration**:
    - Point your Twilio Phone Number's **Voice** Webhook to: `[YOUR_APP_URL]/api/twilio/voice/incoming`
    - Point your Twilio Phone Number's **Messaging** Webhook to: `[YOUR_APP_URL]/api/twilio/incoming`

## API Endpoints

- **Inbound SMS**: `/api/twilio/incoming`
- **Missed Call**: `/api/twilio/voice/incoming`
- **Web Lead**: `/api/leads/web-inbound`
- **Follow-up Cron**: `/api/followup/send-pending` (Schedule hourly)
