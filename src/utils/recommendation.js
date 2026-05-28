const categoryRules = {
  'Customer Service Automation': ['customer-service', 'improve-service', 'website', 'whatsapp'],
  'CRM & Lead Management Automation': ['lead-management', 'crm-workflows', 'improve-sales', 'crm'],
  'Scheduling & Communication Automation': ['appointment-scheduling', 'email-whatsapp', 'whatsapp', 'calendar', 'save-time'],
  'Document & Invoice Automation': ['invoice-documents', 'organize-data', 'email'],
  'Marketing Content Automation': ['social-media-content', 'social-media', 'improve-sales'],
  'Internal Workflow Automation': ['task-management', 'internal-processes', 'reduce-costs', 'organize-data'],
};

const categoryToolMap = {
  'Customer Service Automation': ['HubSpot', 'ChatGPT / OpenAI API', 'Make'],
  'CRM & Lead Management Automation': ['HubSpot', 'Zapier', 'Monday.com'],
  'Scheduling & Communication Automation': ['Make', 'Zapier', 'Google Workspace automation'],
  'Document & Invoice Automation': ['Microsoft Power Automate', 'Google Workspace automation', 'Make'],
  'Marketing Content Automation': ['ChatGPT / OpenAI API', 'Zapier', 'Google Workspace automation'],
  'Internal Workflow Automation': ['Monday.com', 'Make', 'n8n'],
};

const labels = {
  'customer-service': 'customer service',
  'lead-management': 'lead management',
  'appointment-scheduling': 'appointment scheduling',
  'email-whatsapp': 'email and WhatsApp communication',
  'invoice-documents': 'invoice and document handling',
  'social-media-content': 'social media content',
  'task-management': 'task management',
  'crm-workflows': 'CRM workflows',
  'internal-processes': 'internal business processes',
  email: 'email',
  whatsapp: 'WhatsApp',
  website: 'website',
  crm: 'CRM',
  calendar: 'calendar',
  'social-media': 'social media',
  'save-time': 'saving time',
  'reduce-costs': 'reducing costs',
  'improve-sales': 'improving sales',
  'improve-service': 'improving service',
  'organize-data': 'organizing data',
};

export function generateRecommendation(answers) {
  const signals = [
    ...answers.painPoints,
    ...answers.channels,
    answers.goal,
  ].filter(Boolean);

  const scored = Object.entries(categoryRules).map(([category, rules]) => ({
    category,
    score: rules.reduce((total, rule) => total + (signals.includes(rule) ? 1 : 0), 0),
  }));

  const best = scored.sort((a, b) => b.score - a.score)[0]?.category || 'Internal Workflow Automation';
  const selectedPainPoints = answers.painPoints.map((item) => labels[item]).filter(Boolean);
  const selectedChannels = answers.channels.map((item) => labels[item]).filter(Boolean);
  const isTechnical = answers.skillLevel === 'advanced' || answers.skillLevel === 'intermediate';
  const lowBudget = answers.budget === 'under-50';
  const highComplexitySignals = answers.painPoints.length >= 4 || answers.channels.length >= 5 || best.includes('Document');

  let complexity = 'Low';
  if (highComplexitySignals || answers.skillLevel === 'beginner') complexity = 'Medium';
  if (answers.skillLevel === 'advanced' && answers.painPoints.length >= 5) complexity = 'High';

  let impact = 'Medium';
  if (answers.employees === '11-30' || answers.employees === '31-plus' || answers.goal === 'improve-sales') impact = 'High';
  if (answers.employees === '1' && answers.painPoints.length <= 1) impact = 'Low';

  let suggestedTools = categoryToolMap[best] || ['Make', 'Zapier', 'ChatGPT / OpenAI API'];
  if (isTechnical && !suggestedTools.includes('n8n')) suggestedTools = [...suggestedTools.slice(0, 2), 'n8n'];
  if (lowBudget) {
    suggestedTools = suggestedTools
      .map((tool) => (tool === 'HubSpot' ? 'Google Workspace automation' : tool))
      .filter((tool, index, list) => list.indexOf(tool) === index);
  }

  const why = [
    `The business selected ${selectedPainPoints.join(', ') || 'general operational work'} as main pain points.`,
    `The preferred channels are ${selectedChannels.join(', ') || 'standard digital channels'}, so the recommendation favors tools with practical integrations.`,
    `The goal of ${labels[answers.goal] || 'business improvement'} points to workflows that create measurable value quickly.`,
  ];

  return {
    category: best,
    tools: suggestedTools.slice(0, 3),
    why,
    complexity,
    impact,
    firstStep: buildFirstStep(best, answers),
  };
}

function buildFirstStep(category, answers) {
  const channel = labels[answers.channels[0]] || 'the most active customer channel';
  const painPoint = labels[answers.painPoints[0]] || 'the highest-volume manual task';

  if (category.includes('CRM')) {
    return `Map the current lead process from ${channel} to first customer response, then automate one lead capture flow into a CRM.`;
  }
  if (category.includes('Scheduling')) {
    return `Start with one reminder workflow for ${channel}, measure no-shows for two weeks, and expand only after the message is reliable.`;
  }
  if (category.includes('Document')) {
    return `Choose one document process, such as invoice reminders, and define the data fields needed before connecting automation tools.`;
  }
  if (category.includes('Marketing')) {
    return `Create a weekly content template and use AI to draft posts from approved business updates before publishing manually.`;
  }
  if (category.includes('Customer')) {
    return `Collect common ${painPoint} messages, create categories, and test AI summaries with human review before automating responses.`;
  }
  return `Document the manual steps for ${painPoint}, then automate the first repetitive handoff with clear ownership and a success metric.`;
}
