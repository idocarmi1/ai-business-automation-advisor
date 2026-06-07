# AutoBiz AI Advisor

Live demo:

https://ai-business-automation-advisor.vercel.app/

AutoBiz AI Advisor is a Hebrew AI business automation advisor demo that shows how AI-assisted market research can identify business pain points and recommend practical automation workflows.

The project is built as a dark, premium, RTL business SaaS-style website for a classroom presentation and portfolio use case. It demonstrates how a business owner could move from market research and pain-point discovery to concrete automation recommendations, relevant tools, complexity level, business impact, automation score, and next steps.

## Problem

Small businesses waste time on manual processes, lead follow-ups, customer tracking, reporting, messages, and repetitive operations.

These workflows often happen across disconnected tools such as WhatsApp, email, spreadsheets, calendars, CRM systems, and task boards. The result is slow response time, missed leads, operational overload, inconsistent follow-up, and limited visibility into business performance.

## Solution

AutoBiz demonstrates how AI can turn market research and business context into practical automation recommendations.

The demo shows a Perplexity-style research flow that identifies business pain points, maps manual processes, suggests automation opportunities, recommends tools, estimates complexity and impact, and presents a clear next step for implementation.

## Main Features

- Hebrew RTL interface
- AI analysis demo
- Perplexity-style research simulation
- Business pain-point discovery
- Automation opportunities table
- Automation score
- AI recommendation modal after clicking `הרץ ניתוח AI`
- Recommended tools and implementation steps
- Tools and lessons presentation section
- Responsive dark premium SaaS design

## AI Capabilities Demo

The AI demo page shows how the product could work in a real business context:

1. The user enters a business field.
2. The user selects business size and main goal.
3. The user clicks `הרץ ניתוח AI`.
4. The website shows a short analyzing state.
5. A result modal presents a simulated AI recommendation.
6. The user can jump to the automation recommendations table.

The result includes:

- Business field
- Business size
- Main goal
- Recommended automation
- Automation score
- Suggested tools
- Practical next steps
- Demo note explaining that this is a frontend mock

## Automation Recommendations

The automation table presents examples such as:

- Lead classification and automatic follow-up
- Customer tracking reminders
- Automatic dashboards and reporting
- FAQ bots and customer service routing
- Internal workflow automation
- Meeting and appointment automation
- Task management automation
- Meeting transcription and summaries

Each row includes:

- Business process or pain point
- Current manual workflow
- Recommended automation
- Relevant tools
- Impact
- Complexity
- Why the automation is useful

## Tools Used

- React
- Vite
- GitHub
- Vercel
- Codex
- ChatGPT / Gemini
- Perplexity-style research
- Make / Zapier / n8n / CRM examples
- Google Sheets, Airtable, Looker Studio, HubSpot, Microsoft Power Automate examples

## Important Note

This is currently a frontend demo/mock.

No real API keys are exposed. The Perplexity-style research flow and AI recommendation logic are simulated on the frontend for demonstration purposes.

Future versions can connect to Perplexity API or another AI model through a secure server-side route. Real API integration should be implemented only through environment variables and backend/serverless routes, never directly in frontend code.

## How to Run Locally

Install dependencies:

```bash
npm install
```

Start local development server:

```bash
npm run dev
```

Build production version:

```bash
npm run build
```

Optional preview after build:

```bash
npm run preview
```

## Classroom Presentation

The project demonstrates:

```text
תוצר + כלים + לקחים
```

Presentation flow:

```text
Problem → AI research → automation recommendation → tools → lessons learned
```

Suggested explanation:

1. Present the business problem: small businesses lose time on repetitive manual operations.
2. Show how AI-assisted market research can identify recurring pain points.
3. Demonstrate the `הרץ ניתוח AI` flow.
4. Explain the automation recommendation modal.
5. Show the automation opportunities table.
6. Explain the tools that could implement each automation.
7. Summarize the lessons learned from building the demo.

## Project Structure

```text
src/
  data/
    automationAreas.js
    tools.js
    useCases.js
  utils/
    auth.js
    leads.js
    notifications.js
    recommendation.js
  App.jsx
  main.jsx
  styles.css

api/
  send-signup-notification.js

public/
  images/
    autobiz-ai-advisor-logo.png
```

## Current Status

AutoBiz AI Advisor is suitable for a classroom presentation and portfolio demonstration.

It does not claim to perform live Perplexity or AI API research yet. The current version demonstrates the product concept, UI flow, research logic, recommendation structure, and business automation strategy through a polished frontend demo.
