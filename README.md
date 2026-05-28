# AI Business Automation Advisor

AI Business Automation Advisor is a modern frontend web application for the course **AI Applications in Business - Information Systems Program**. The project helps small businesses evaluate, compare, and choose AI automation systems and business automation tools.

## Project Purpose

Small business owners often know that automation can save time and improve service, but they struggle to decide which tools fit their real needs, budget, channels, and technical skill level. This website acts as a decision-support platform that turns business context into a practical automation recommendation.

## Main Features

- Professional landing page for the business problem and automation value.
- Interactive business automation assessment with React state.
- Rule-based recommendation engine with explainable results.
- Suggested automation category, tools, complexity, impact, and first implementation step.
- Comparison table for Zapier, Make, n8n, Monday.com, HubSpot, ChatGPT / OpenAI API, Google Workspace automation, and Microsoft Power Automate.
- Search and filtering for tools and AI use cases.
- AI use case library with business problem, solution, tools, benefit, and difficulty.
- AI methodology page explaining meaningful use of Codex and ChatGPT-style research tools.
- Academic project summary page for later DOCX writing.
- Fully responsive layout for desktop and mobile.

## AI Tools Used

### Codex

Codex was used to:

- Plan the React + Vite code structure.
- Build the frontend pages and reusable components.
- Create the questionnaire and recommendation logic.
- Improve the UI/UX, responsive design, and navigation.
- Debug, refactor, and verify the local build.

### ChatGPT or Another AI Research Tool

A ChatGPT-style AI research tool was used conceptually to:

- Support market research about automation categories and platforms.
- Define comparison criteria for small businesses.
- Create practical automation use cases.
- Improve explanations for business owners.
- Validate that the recommendation logic is understandable and realistic.

## How to Run Locally

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## How This Project Answers the Academic Requirements

The project demonstrates meaningful AI use by combining product design, information systems thinking, and business value:

- **AI applications in business:** The app focuses on real automation use cases such as customer service, lead management, scheduling, invoice reminders, CRM workflows, and AI message summaries.
- **Decision support:** The assessment collects business context and generates a recommendation based on transparent rule-based logic.
- **Critical thinking:** The tools comparison includes advantages, disadvantages, pricing level, integration strength, ease of use, and recommended business type.
- **Business value:** Recommendations include estimated impact, complexity, and a first implementation step.
- **Information systems thinking:** The site considers workflows, data flow, integrations, channels, user skill level, and process improvement.
- **AI methodology:** The methodology page documents what worked, what did not work, prompt improvement, quality checking, and recommendations for future students.

## Recommendation Logic

The recommendation engine is located in `src/utils/recommendation.js`. It scores automation categories based on:

- Selected business pain points.
- Preferred communication and work channels.
- Most important business goal.
- Employee count.
- Monthly budget.
- Technical skill level.

The result is intentionally explainable for a class presentation. It does not claim to be a machine-learning model; it is a practical rule-based decision-support model.

## Suggested Presentation Flow

Start with the home page to explain the problem. Then open the assessment, enter a sample business scenario, and show how the recommendation changes. Continue to the tools comparison page to explain trade-offs between platforms. Then show the use case library and methodology page to connect the product to the academic requirements.

## 10-Minute Presentation Plan

1. **Problem and target audience**  
   Explain that small businesses want automation but do not know which tools fit their needs, budget, and technical ability.

2. **Website demo**  
   Show the home page, run through the assessment, present the generated recommendation, and explain the suggested category, tools, complexity, impact, and first step.

3. **AI tools used**  
   Explain how Codex helped build the frontend and how ChatGPT or another AI research tool helped define criteria, use cases, and explanations.

4. **What did not work and how we improved**  
   Explain that broad prompts produced generic results at first. The team improved prompts by adding exact pages, tool lists, academic requirements, and quality expectations.

5. **Quality checking**  
   Show that navigation works, the questionnaire updates dynamically, filters work, the comparison table is complete, and the build runs locally.

6. **Lessons learned**  
   Explain that AI tools speed up ideation and development, but students still need to define the business problem, verify outputs, check assumptions, and make final product decisions.

## Project Structure

```text
src/
  components/
  data/
    automationAreas.js
    tools.js
    useCases.js
  pages/
  utils/
    recommendation.js
  App.jsx
  main.jsx
  styles.css
```

The current implementation keeps the reusable UI components inside `App.jsx` because the project is compact. The data and recommendation rules are already separated so they can be expanded easily.
