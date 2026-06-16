const answerLabels = {
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
  beginner: 'מתחיל/ה',
  intermediate: 'בינוני/ת',
  advanced: 'מתקדם/ת',
  'under-50': 'עד $50',
  '50-200': '$50-$200',
  '200-500': '$200-$500',
  '500-plus': '$500+',
};

const skillScores = { beginner: 8, intermediate: 16, advanced: 22 };
const budgetScores = { 'under-50': 8, '50-200': 14, '200-500': 18, '500-plus': 22 };
const goalScores = {
  'save-time': 8,
  'reduce-costs': 8,
  'improve-sales': 10,
  'improve-service': 10,
  'organize-data': 12,
  'improve-processes': 12,
};

export function generateAutomationRoadmap(answers, recommendation) {
  const currentTools = parseCurrentTools(answers.currentTools);
  const painLabels = answers.painPoints.map((item) => answerLabels[item]).filter(Boolean);
  const channelLabels = answers.channels.map((item) => answerLabels[item]).filter(Boolean);
  const readinessScore = calculateReadinessScore(answers, currentTools.length);
  const priorityLevel = getPriorityLevel(answers, recommendation, readinessScore);
  const firstTool = recommendation.tools?.[0] || 'Make';
  const secondTool = recommendation.tools?.[1] || 'Zapier';
  const primaryPain = painLabels[0] || 'המשימה הידנית המרכזית';
  const primaryChannel = channelLabels[0] || 'ערוץ העבודה המרכזי';
  const businessType = answerLabels[answers.businessType] || 'עסק';
  const goal = answerLabels[answers.goal] || 'שיפור תהליך עסקי';
  const quickWin = buildQuickWin(recommendation.category, primaryPain, primaryChannel);
  const integrationTools = uniqueTools([firstTool, secondTool, 'CRM', 'Google Sheets', 'WhatsApp / Email Automation']);

  return {
    roadmapTitle: 'מפת אוטומציה לעסק',
    businessSummary: `${businessType} עם מטרה מרכזית של ${goal}, כאבים מרכזיים כמו ${painLabels.join(', ') || 'תהליכים ידניים'}, וערוצים רלוונטיים כמו ${channelLabels.join(', ') || 'כלי עבודה דיגיטליים'}.`,
    readinessScore,
    priorityLevel,
    quickWin,
    futureUpgrade: 'בשלב עתידי ניתן לחבר מודל AI או בסיס נתונים כדי לייצר מפה דינמית לפי נתוני עסק אמיתיים, היסטוריית לקוחות ודוחות ביצוע.',
    steps: [
      {
        title: 'שלב 1 – אוטומציה מהירה להתחלה',
        goal: 'להתחיל בפעולה אחת פשוטה שמייצרת ערך מהיר ומוכיחה שהאוטומציה משתלמת.',
        recommendedTools: uniqueTools([firstTool, 'Google Sheets', primaryChannel === 'WhatsApp' ? 'WhatsApp / Email Automation' : secondTool]),
        explanation: quickWin,
        expectedBenefit: 'חיסכון בזמן, פחות פעולות ידניות ויכולת למדוד תוצאה כבר בשבועות הראשונים.',
        difficulty: 'נמוכה',
        estimatedTime: 'שבוע 1',
      },
      {
        title: 'שלב 2 – חיבור תהליכים ומערכות',
        goal: 'לחבר בין מקורות מידע, לקוחות, טפסים, יומן, CRM ומשימות כדי לצמצם עבודה כפולה.',
        recommendedTools: integrationTools.slice(0, 4),
        explanation: `אחרי שהשלב הראשון עובד, מחברים את ${primaryChannel} לתהליך מסודר של מעקב, תיעוד ועדכון סטטוס. כך העסק מפסיק להסתמך על זיכרון, הודעות ידניות וקבצים מפוזרים.`,
        expectedBenefit: 'שיפור סדר תפעולי, מעקב ברור אחרי לקוחות והקטנת טעויות בין מערכות.',
        difficulty: readinessScore >= 70 ? 'בינונית' : 'בינונית-גבוהה',
        estimatedTime: '2-3 שבועות',
      },
      {
        title: 'שלב 3 – שיפור בעזרת AI ודוחות',
        goal: 'להפוך נתונים ותהליכים לתובנות ניהוליות, סיכומים והמלצות להמשך פעולה.',
        recommendedTools: uniqueTools(['ChatGPT / OpenAI API', 'Looker Studio', 'Google Sheets', 'Notion AI']),
        explanation: `בשלב זה מוסיפים שכבת AI ודוחות: סיכום פניות, זיהוי מגמות, מדידת ביצועים ותמונת מצב למנהל. זה מתאים במיוחד כאשר כבר קיימים נתונים מהשלבים הקודמים.`,
        expectedBenefit: 'קבלת החלטות טובה יותר, זיהוי צווארי בקבוק ושיפור רציף של השירות או המכירות.',
        difficulty: 'בינונית',
        estimatedTime: 'חודש 2',
      },
    ],
  };
}

function calculateReadinessScore(answers, currentToolsCount) {
  const base = 20;
  const score = base
    + (skillScores[answers.skillLevel] || 0)
    + (budgetScores[answers.budget] || 0)
    + Math.min(currentToolsCount * 4, 16)
    + Math.min((answers.painPoints?.length || 0) * 5, 20)
    + (goalScores[answers.goal] || 0);

  return Math.max(0, Math.min(100, score));
}

function getPriorityLevel(answers, recommendation, readinessScore) {
  const manyPainPoints = (answers.painPoints?.length || 0) >= 4;
  const highImpact = recommendation.impact === 'גבוהה';
  const strategicGoal = ['improve-sales', 'improve-service', 'improve-processes'].includes(answers.goal);

  if (readinessScore >= 72 || manyPainPoints || highImpact || strategicGoal) return 'גבוהה';
  if (readinessScore >= 52 || (answers.painPoints?.length || 0) >= 2) return 'בינונית';
  return 'נמוכה';
}

function buildQuickWin(category, primaryPain, primaryChannel) {
  if (category.includes('CRM')) {
    return `להתחיל מסיווג ליד חדש ועדכון סטטוס ב-CRM דרך ${primaryChannel}, כדי לא לאבד פניות חשובות.`;
  }
  if (category.includes('שירות')) {
    return `לאסוף שאלות חוזרות בנושא ${primaryPain} ולבנות מענה אוטומטי ראשוני לפני טיפול אנושי.`;
  }
  if (category.includes('תיאום')) {
    return `להגדיר תזכורת אוטומטית אחת דרך ${primaryChannel} לפני פגישה או תור.`;
  }
  if (category.includes('מסמכים')) {
    return 'לבחור תהליך מסמך אחד שחוזר על עצמו ולהפוך אותו לתבנית עם שליחה או תזכורת אוטומטית.';
  }
  if (category.includes('שיווק')) {
    return 'לבנות תבנית תוכן שבועית ולייצר טיוטות ראשונות בעזרת AI לפני אישור אנושי.';
  }
  return `למפות את ${primaryPain} ולהפוך פעולה ידנית אחת לאוטומציה קטנה שניתן למדוד.`;
}

function parseCurrentTools(currentTools) {
  if (!currentTools) return [];
  return currentTools
    .split(/[,;|\n]/)
    .map((tool) => tool.trim())
    .filter(Boolean);
}

function uniqueTools(tools) {
  return tools.filter(Boolean).filter((tool, index, list) => list.indexOf(tool) === index);
}
