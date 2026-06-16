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
  const starterRecipe = buildStarterRecipe(recommendation.category);

  return {
    roadmapTitle: 'מפת אוטומציה לעסק',
    businessSummary: `${businessType} עם מטרה מרכזית של ${goal}, כאבים מרכזיים כמו ${painLabels.join(', ') || 'תהליכים ידניים'}, וערוצים רלוונטיים כמו ${channelLabels.join(', ') || 'כלי עבודה דיגיטליים'}.`,
    readinessScore,
    priorityLevel,
    quickWin,
    futureUpgrade: 'בשלב עתידי ניתן לחבר מודל AI או בסיס נתונים כדי לייצר מפה דינמית לפי נתוני עסק אמיתיים, היסטוריית לקוחות ודוחות ביצוע.',
    firstSevenDaysPlan: buildSevenDayPlan(primaryPain, recommendation.category),
    starterRecipe,
    steps: [
      {
        title: 'שלב 1 – אוטומציה מהירה להתחלה',
        goal: 'להתחיל בפעולה אחת פשוטה שמייצרת ערך מהיר ומוכיחה שהאוטומציה משתלמת.',
        recommendedTools: uniqueTools([firstTool, 'Google Sheets', primaryChannel === 'WhatsApp' ? 'WhatsApp / Email Automation' : secondTool]),
        explanation: quickWin,
        expectedBenefit: 'חיסכון בזמן, פחות פעולות ידניות ויכולת למדוד תוצאה כבר בשבועות הראשונים.',
        difficulty: 'נמוכה',
        estimatedTime: 'שבוע 1',
        setupChecklist: [
          'למפות את התהליך הידני הקיים מתחילתו ועד סופו.',
          'לבחור פעולה אחת שחוזרת על עצמה הרבה.',
          'להגדיר כלי בסיסי כמו Google Forms, Google Sheets או Make.',
          'לבדוק את התהליך על ליד אחד או לקוח אחד.',
          'לתקן בעיות לפני שמפעילים את האוטומציה לכל העסק.',
        ],
        implementationSteps: [
          `בחרו תהליך אחד סביב ${primaryPain} ולא את כל העסק בבת אחת.`,
          'כתבו מה מפעיל את התהליך, מה קורה אחריו ומי אחראי לטיפול.',
          'צרו מקור נתונים פשוט: טופס, גיליון או רשימת פניות.',
          'בנו אוטומציה אחת קצרה ושמרו תיעוד של כל בדיקה.',
          'הריצו בדיקה אמיתית אחת לפני הפעלה שוטפת.',
        ],
        requiredData: [
          'רשימת פניות או לקוחות לדוגמה.',
          'כתובת מייל עסקית פעילה.',
          'טופס פנייה, מקור לידים או גיליון נתונים.',
          'הודעת אישור מוכנה ללקוח.',
        ],
        systemConnections: [
          'טופס → Google Sheets / CRM',
          'CRM → מייל אישור',
          'יומן → תזכורת ללקוח',
        ],
        ownerActionItems: [
          'להחליט מי בודק את הליד הראשון.',
          'לאשר את נוסח ההודעה ללקוח.',
          'להגדיר מה נחשב תהליך מוצלח.',
        ],
        successMetric: [
          'פחות זמן טיפול ידני.',
          'פחות פניות שנשכחות.',
          'תגובה מהירה יותר ללקוחות.',
        ],
        commonMistakes: [
          'להתחיל מתהליך מסובך מדי.',
          'לחבר יותר מדי מערכות בבת אחת.',
          'לא לבדוק את האוטומציה לפני שימוש אמיתי.',
        ],
        suggestedToolsExplanation: `${firstTool} ו-Google Sheets מתאימים להתחלה כי הם מאפשרים לבנות תהליך קטן, לבדוק אותו מהר, ולראות ערך לפני השקעה גדולה.`,
      },
      {
        title: 'שלב 2 – חיבור תהליכים ומערכות',
        goal: 'לחבר בין מקורות מידע, לקוחות, טפסים, יומן, CRM ומשימות כדי לצמצם עבודה כפולה.',
        recommendedTools: integrationTools.slice(0, 4),
        explanation: `אחרי שהשלב הראשון עובד, מחברים את ${primaryChannel} לתהליך מסודר של מעקב, תיעוד ועדכון סטטוס. כך העסק מפסיק להסתמך על זיכרון, הודעות ידניות וקבצים מפוזרים.`,
        expectedBenefit: 'שיפור סדר תפעולי, מעקב ברור אחרי לקוחות והקטנת טעויות בין מערכות.',
        difficulty: readinessScore >= 70 ? 'בינונית' : 'בינונית-גבוהה',
        estimatedTime: '2-3 שבועות',
        setupChecklist: [
          'להגדיר באילו מערכות העסק משתמש בפועל.',
          'לקבוע שדות חובה כמו שם, טלפון, סטטוס, מקור פנייה ואחראי טיפול.',
          'לבחור מערכת מרכזית אחת לניהול המעקב.',
          'להגדיר סטטוסים ברורים לתהליך.',
          'לחבר רק את הערוצים החשובים ביותר בשלב הראשון.',
        ],
        implementationSteps: [
          `חברו את ${primaryChannel} למקום מרכזי שבו נשמרים הנתונים.`,
          'צרו סטטוסים קבועים כמו חדש, בטיפול, ממתין, נסגר.',
          'הגדירו משימת מעקב אוטומטית כאשר סטטוס משתנה.',
          'שלחו הודעה אוטומטית רק כאשר התנאים ברורים.',
          'בדקו שהמידע לא נשמר פעמיים ולא הולך לאיבוד.',
        ],
        requiredData: [
          'רשימת סטטוסים עסקיים.',
          'שדות לקוח בסיסיים.',
          'רשימת אנשי צוות או אחראים.',
          'תבניות הודעה למייל או WhatsApp.',
        ],
        systemConnections: [
          'טופס / אתר → CRM',
          'CRM → משימה לבעל העסק',
          'CRM / גיליון → הודעת WhatsApp או אימייל',
          'יומן → תזכורת פנימית',
        ],
        ownerActionItems: [
          'להחליט איזו מערכת היא מקור האמת.',
          'לנקות כפילויות ברשימת הלקוחות.',
          'להגדיר מי מקבל התראות ומתי.',
        ],
        successMetric: [
          'כל פנייה מקבלת סטטוס ברור.',
          'פחות עבודה כפולה בין כלים.',
          'קל יותר לדעת מי מטפל בכל לקוח.',
        ],
        commonMistakes: [
          'להחזיק מידע זהה בכמה מקומות בלי סנכרון.',
          'להגדיר יותר מדי סטטוסים.',
          'לא לקבוע בעל אחריות לכל שלב.',
        ],
        suggestedToolsExplanation: `${integrationTools.slice(0, 3).join(', ')} מתאימים לשלב הזה כי הם מחברים בין מערכות קיימות ומאפשרים מעקב מסודר בלי לפתח מערכת חדשה מאפס.`,
      },
      {
        title: 'שלב 3 – שיפור בעזרת AI ודוחות',
        goal: 'להפוך נתונים ותהליכים לתובנות ניהוליות, סיכומים והמלצות להמשך פעולה.',
        recommendedTools: uniqueTools(['ChatGPT / OpenAI API', 'Looker Studio', 'Google Sheets', 'Notion AI']),
        explanation: `בשלב זה מוסיפים שכבת AI ודוחות: סיכום פניות, זיהוי מגמות, מדידת ביצועים ותמונת מצב למנהל. זה מתאים במיוחד כאשר כבר קיימים נתונים מהשלבים הקודמים.`,
        expectedBenefit: 'קבלת החלטות טובה יותר, זיהוי צווארי בקבוק ושיפור רציף של השירות או המכירות.',
        difficulty: 'בינונית',
        estimatedTime: 'חודש 2',
        setupChecklist: [
          'להגדיר אילו מדדים חשובים לעסק.',
          'לוודא שהנתונים מהשלבים הקודמים נשמרים בצורה עקבית.',
          'לבנות דוח פשוט לפני שמוסיפים AI.',
          'להגדיר אילו סיכומים או תובנות AI באמת עוזרים לבעל העסק.',
          'לקבוע תדירות בדיקה שבועית או חודשית.',
        ],
        implementationSteps: [
          'בחרו 3-5 מדדים חשובים כמו כמות פניות, זמן תגובה, סטטוס טיפול וסגירות.',
          'חברו גיליון או CRM לדוח בסיסי.',
          'הוסיפו סיכום AI לפניות, פגישות או משימות רק אחרי שהנתונים מסודרים.',
          'צרו תצוגת Dashboard קצרה לבעל העסק.',
          'בדקו פעם בשבוע מה השתפר ומה דורש שינוי.',
        ],
        requiredData: [
          'נתוני פניות או לקוחות מהחודש האחרון.',
          'סטטוסים ותאריכי טיפול.',
          'מדד הצלחה עסקי ברור.',
          'דוגמאות לפניות או שיחות לסיכום AI.',
        ],
        systemConnections: [
          'CRM / Google Sheets → Dashboard',
          'פניות לקוחות → סיכום AI',
          'נתוני פעילות → דוח שבועי / חודשי',
        ],
        ownerActionItems: [
          'לבחור מדדים שמקבלים החלטות לפיהם.',
          'לאשר אילו נתונים מותר לסכם בעזרת AI.',
          'לקבוע זמן קבוע לסקירת הדוח.',
        ],
        successMetric: [
          'תמונת מצב עסקית ברורה בכל שבוע.',
          'זיהוי צווארי בקבוק מהר יותר.',
          'שיפור מתמשך בתהליך השירות או המכירה.',
        ],
        commonMistakes: [
          'להוסיף AI לפני שהנתונים מסודרים.',
          'למדוד יותר מדי דברים בלי החלטה עסקית.',
          'לא לבדוק את איכות הסיכומים לפני שימוש קבוע.',
        ],
        suggestedToolsExplanation: 'ChatGPT / OpenAI API, Looker Studio ו-Google Sheets מתאימים לשלב מתקדם כי הם עוזרים להפוך נתונים קיימים לתובנות ודוחות קצרים וברורים.',
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

function buildSevenDayPlan(primaryPain, category) {
  return [
    ['יום 1', `מיפוי התהליך הידני סביב ${primaryPain} והגדרת הבעיה המרכזית.`],
    ['יום 2', 'בחירת כלי ראשון והכנת הנתונים הדרושים להפעלה ראשונית.'],
    ['יום 3', 'יצירת טופס, גיליון או מקור נתונים ראשוני שממנו האוטומציה תתחיל.'],
    ['יום 4', `חיבור התהליך לכלי אוטומציה שמתאים ל-${category}.`],
    ['יום 5', 'בדיקה על תרחיש אמיתי אחד עם ליד, לקוח או משימה אחת.'],
    ['יום 6', 'שיפור נוסחים, הודעות, תנאים וסטטוסים לפי תוצאת הבדיקה.'],
    ['יום 7', 'הפעלה ראשונית ומדידת תוצאה: זמן טיפול, תגובה ללקוח ושגיאות שנמנעו.'],
  ].map(([day, text]) => ({ day, text }));
}

function buildStarterRecipe(category) {
  if (category.includes('CRM') || category.includes('לידים')) {
    return {
      title: 'מתכון אוטומציה לניהול לידים',
      trigger: 'לקוח ממלא טופס באתר או שולח פנייה חדשה.',
      actions: [
        'שמירת פרטי הלקוח בטבלה או CRM.',
        'שליחת מייל אישור או WhatsApp ללקוח.',
        'יצירת משימת מעקב לבעל העסק.',
      ],
      result: 'אין ליד שנשכח והתגובה ללקוח מהירה יותר.',
    };
  }
  if (category.includes('שירות')) {
    return {
      title: 'מתכון אוטומציה לשירות לקוחות',
      trigger: 'לקוח שולח פנייה חדשה.',
      actions: [
        'סיווג הפנייה לפי נושא.',
        'יצירת תשובה ראשונית לפי תבנית.',
        'העברה לגורם מתאים להמשך טיפול.',
      ],
      result: 'טיפול מהיר ומסודר יותר בפניות לקוחות.',
    };
  }
  if (category.includes('מסמכים') || category.includes('דוחות') || category.includes('נתונים')) {
    return {
      title: 'מתכון אוטומציה לדוחות ובקרה',
      trigger: 'סוף שבוע, סוף חודש או עדכון נתונים חדש.',
      actions: [
        'איסוף נתונים ממקור אחד או יותר.',
        'סיכום הנתונים לפי מדדים קבועים.',
        'יצירת דוח קצר לבעל העסק.',
      ],
      result: 'תמונת מצב עסקית ברורה בלי איסוף ידני חוזר.',
    };
  }
  return {
    title: 'מתכון אוטומציה ראשוני',
    trigger: 'פעולה ידנית שחוזרת על עצמה בעסק.',
    actions: [
      'שמירת הנתונים במקום מסודר.',
      'שליחת הודעה או יצירת משימה אוטומטית.',
      'בדיקת סטטוס ומדידת תוצאה.',
    ],
    result: 'פחות עבודה ידנית ויותר שליטה בתהליך העסקי.',
  };
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
