const categoryRules = {
  'אוטומציית שירות לקוחות': ['customer-service', 'improve-service', 'website', 'whatsapp'],
  'אוטומציית CRM וניהול לידים': ['lead-management', 'crm-workflows', 'improve-sales', 'crm'],
  'אוטומציית תיאום ותקשורת': ['appointment-scheduling', 'email-whatsapp', 'whatsapp', 'calendar', 'save-time'],
  'אוטומציית מסמכים וחשבוניות': ['invoice-documents', 'organize-data', 'email'],
  'אוטומציית שיווק ותוכן': ['social-media-content', 'social-media', 'improve-sales'],
  'אוטומציית תהליכים פנימיים': ['task-management', 'internal-processes', 'reduce-costs', 'organize-data'],
};

const categoryToolMap = {
  'אוטומציית שירות לקוחות': ['HubSpot', 'ChatGPT / OpenAI API', 'Make'],
  'אוטומציית CRM וניהול לידים': ['HubSpot', 'Zapier', 'Monday.com'],
  'אוטומציית תיאום ותקשורת': ['Make', 'Zapier', 'Google Workspace Automation'],
  'אוטומציית מסמכים וחשבוניות': ['Microsoft Power Automate', 'Google Workspace Automation', 'Make'],
  'אוטומציית שיווק ותוכן': ['ChatGPT / OpenAI API', 'Zapier', 'Google Workspace Automation'],
  'אוטומציית תהליכים פנימיים': ['Monday.com', 'Make', 'n8n'],
};

const labels = {
  service: 'עסק שירות',
  retail: 'קמעונאות / חנות',
  clinic: 'קליניקה / תורים',
  agency: 'סוכנות / ייעוץ',
  ecommerce: 'מסחר אונליין',
  professional: 'משרד מקצועי',
  'customer-service': 'שירות לקוחות',
  'lead-management': 'ניהול לידים',
  'appointment-scheduling': 'תיאום פגישות',
  'email-whatsapp': 'מיילים ו-WhatsApp',
  'invoice-documents': 'חשבוניות ומסמכים',
  'social-media-content': 'תוכן לרשתות חברתיות',
  'task-management': 'ניהול משימות',
  'crm-workflows': 'תהליכי CRM',
  'internal-processes': 'תהליכים פנימיים',
  email: 'אימייל',
  whatsapp: 'WhatsApp',
  website: 'אתר',
  crm: 'CRM',
  calendar: 'יומן',
  'social-media': 'רשתות חברתיות',
  'save-time': 'חיסכון בזמן',
  'reduce-costs': 'הפחתת עלויות',
  'improve-sales': 'שיפור מכירות',
  'improve-service': 'שיפור שירות לקוחות',
  'organize-data': 'ארגון מידע',
  'improve-processes': 'שיפור תהליכים פנימיים',
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

  const best = scored.sort((a, b) => b.score - a.score)[0]?.category || 'אוטומציית תהליכים פנימיים';
  const selectedPainPoints = answers.painPoints.map((item) => labels[item]).filter(Boolean);
  const selectedChannels = answers.channels.map((item) => labels[item]).filter(Boolean);
  const isTechnical = answers.skillLevel === 'advanced' || answers.skillLevel === 'intermediate';
  const lowBudget = answers.budget === 'under-50';
  const highComplexitySignals = answers.painPoints.length >= 4 || answers.channels.length >= 5 || best.includes('מסמכים');

  let complexity = 'נמוכה';
  if (highComplexitySignals || answers.skillLevel === 'beginner') complexity = 'בינונית';
  if (answers.skillLevel === 'advanced' && answers.painPoints.length >= 5) complexity = 'גבוהה';

  let impact = 'בינונית';
  if (answers.employees === '11-30' || answers.employees === '31-plus' || answers.goal === 'improve-sales') impact = 'גבוהה';
  if (answers.employees === '1' && answers.painPoints.length <= 1) impact = 'נמוכה';

  let suggestedTools = categoryToolMap[best] || ['Make', 'Zapier', 'ChatGPT / OpenAI API'];
  if (isTechnical && !suggestedTools.includes('n8n')) suggestedTools = [...suggestedTools.slice(0, 2), 'n8n'];
  if (lowBudget) {
    suggestedTools = suggestedTools
      .map((tool) => (tool === 'HubSpot' ? 'Google Workspace Automation' : tool))
      .filter((tool, index, list) => list.indexOf(tool) === index);
  }

  const why = [
    `העסק סימן את ${selectedPainPoints.join(', ') || 'התהליכים התפעוליים'} כאתגרים מרכזיים.`,
    `הערוצים הרלוונטיים הם ${selectedChannels.join(', ') || 'ערוצים דיגיטליים בסיסיים'}, ולכן ההמלצה מתמקדת בכלים עם אינטגרציות שימושיות.`,
    `המטרה המרכזית היא ${labels[answers.goal] || 'שיפור עסקי'}, ולכן נבחרו תהליכים שאפשר למדוד בהם ערך במהירות.`,
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
  const channel = labels[answers.channels[0]] || 'הערוץ הפעיל ביותר מול לקוחות';
  const painPoint = labels[answers.painPoints[0]] || 'המשימה הידנית המרכזית';

  if (category.includes('CRM')) {
    return `למפות את תהליך הליד הנוכחי מ-${channel} ועד תגובה ראשונה, ואז לחבר זרימת ליד אחת ל-CRM.`;
  }
  if (category.includes('תיאום')) {
    return `להתחיל בתזכורת אחת דרך ${channel}, למדוד ירידה באי-הופעות במשך שבועיים, ואז להרחיב.`;
  }
  if (category.includes('מסמכים')) {
    return 'לבחור תהליך מסמכים אחד, למשל תזכורות לחשבוניות, ולהגדיר מראש אילו שדות נתונים נדרשים.';
  }
  if (category.includes('שיווק')) {
    return 'להכין תבנית תוכן שבועית ולהשתמש ב-AI ליצירת טיוטות מפוסטים ועדכונים מאושרים.';
  }
  if (category.includes('שירות')) {
    return `לאסוף דוגמאות של פניות בנושא ${painPoint}, להגדיר קטגוריות, ולבדוק סיכומי AI לפני אוטומציה מלאה.`;
  }
  return `לתעד את שלבי העבודה סביב ${painPoint}, ואז לאוטומט את ההעברה הידנית הראשונה עם מדד הצלחה ברור.`;
}
