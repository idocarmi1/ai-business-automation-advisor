# AutoBiz AI Advisor

AutoBiz AI Advisor is a Hebrew RTL demo website for an AI-powered business automation advisor.

The project demonstrates how AI-assisted market research, inspired by tools like Perplexity, can help identify business pain points and turn them into practical automation recommendations.

Live Demo: https://ai-business-automation-advisor.vercel.app/

## Main Idea

- The user enters a business field, business size, and main goal.
- The system simulates an AI analysis flow.
- The result includes a recommended automation, automation score, suggested tools, and next steps.
- The project is designed for a classroom presentation showing product, tools, and lessons learned.

## Problem

Small businesses often waste time on manual processes such as:

- lead follow-ups
- customer tracking
- reporting
- repetitive operations
- manual communication
- disconnected tools

## Solution

AutoBiz demonstrates how AI can turn market research and business context into:

- business pain points
- automation opportunities
- suggested tools
- impact level
- complexity level
- practical next steps

## Features

- Hebrew RTL interface
- Premium dark SaaS-style design
- AI capabilities demo
- Perplexity-style market research simulation
- Business pain-point discovery
- Automation opportunities table
- Automation score
- AI recommendation modal after clicking `הרץ ניתוח AI`
- מחולל מפת אוטומציה לעסק
- מחשבון חיסכון מאוטומציה
- Suggested automation tools
- Tools and lessons section for classroom presentation
- Responsive design for desktop and mobile

## Tools & Technologies

- React
- Vite
- JavaScript
- CSS
- GitHub
- Vercel
- Codex
- ChatGPT / Gemini
- Perplexity-style research
- Make / Zapier / n8n / CRM examples

## How AI is represented in this project

This project does not currently call a real AI API from the frontend. Instead, it demonstrates the product logic and user experience of an AI-assisted advisor.

The AI flow is represented through:

- market research simulation
- business context analysis
- automation recommendation logic
- automation scoring
- rule-based automation roadmap generation
- rule-based automation ROI calculation
- tool suggestions
- next-step planning

Future versions could connect to Perplexity API or another AI model through a secure server-side route.

## Architecture Note

The automation roadmap generator and automation ROI calculator are currently rule-based and run in the frontend.

They use:

- assessment answers
- recommendation output
- business pain points
- current tools
- budget and technical skill level
- estimated manual hours, hourly cost, employees involved, and monthly leads

No private customer data is sent to an external AI API. The roadmap and ROI estimate are generated locally as part of the demo experience.

## Classroom Presentation Focus

The project demonstrates:

- Product: a business automation advisor demo
- Tools: React, Vite, GitHub, Vercel, Codex, AI research tools
- Lessons: AI is most useful when connected to a clear business problem and presented through practical recommendations

Presentation flow:

```text
Problem → AI research → automation recommendation → tools → lessons learned
```

## Run Locally

```bash
npm install
npm run dev
npm run build
```

## Security Notes

- No real API keys are stored in the frontend.
- Secrets should only be stored in environment variables.
- Real AI API integration should be implemented only through a backend/serverless route.

## Hebrew UI Note

The user interface is in Hebrew and RTL because the project was built for a classroom presentation in Israel.
