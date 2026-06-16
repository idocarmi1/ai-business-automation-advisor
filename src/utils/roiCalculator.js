const priorityFactors = {
  נמוכה: 0.35,
  בינונית: 0.5,
  גבוהה: 0.65,
};

const processFactors = {
  'ניהול לידים': 0.68,
  'מעקב לקוחות': 0.62,
  'תיאום פגישות': 0.58,
  'דוחות ובקרה': 0.52,
  'שירות לקוחות': 0.55,
  'מסמכים וחשבוניות': 0.48,
  'תפעול פנימי': 0.5,
};

export function calculateAutomationROI(inputs, recommendation, roadmap) {
  const weeklyManualHours = toNumber(inputs.weeklyManualHours);
  const employeesInvolved = Math.max(1, toNumber(inputs.employeesInvolved));
  const hourlyCost = toNumber(inputs.hourlyCost);
  const monthlyLeads = toNumber(inputs.monthlyLeads);
  const automationPriority = inputs.automationPriority || roadmap?.priorityLevel || 'בינונית';
  const mainManualProcess = inputs.mainManualProcess || recommendation?.category || 'תהליך ידני מרכזי';

  const priorityFactor = priorityFactors[automationPriority] || 0.5;
  const processFactor = getProcessFactor(mainManualProcess);
  const leadFactor = Math.min(monthlyLeads / 250, 0.18);
  const roadmapBonus = roadmap?.readinessScore >= 75 ? 0.08 : roadmap?.readinessScore >= 55 ? 0.04 : 0;
  const efficiencyFactor = Math.min(0.78, priorityFactor + leadFactor + roadmapBonus);

  const totalMonthlyManualHours = weeklyManualHours * 4.33 * employeesInvolved;
  const monthlyHoursSaved = roundOne(totalMonthlyManualHours * Math.max(processFactor, efficiencyFactor));
  const monthlyMoneySaved = Math.round(monthlyHoursSaved * hourlyCost);
  const yearlyMoneySaved = monthlyMoneySaved * 12;
  const roiLevel = getRoiLevel(monthlyMoneySaved, monthlyHoursSaved);
  const recommendedFirstAutomation = buildRecommendedFirstAutomation(inputs, recommendation, roadmap);

  return {
    monthlyHoursSaved,
    monthlyMoneySaved,
    yearlyMoneySaved,
    roiLevel,
    paybackEstimate: getPaybackEstimate(roiLevel, monthlyMoneySaved),
    recommendedFirstAutomation,
    explanation: `החישוב משלב את היקף השעות הידניות, מספר העובדים, עלות שעת עבודה, כמות פניות חודשית ורמת עדיפות. לפי הנתונים שהוזנו, כדאי להתחיל מ-${recommendedFirstAutomation}, כי זהו תהליך בעל פוטנציאל חיסכון ברור ויישום הדרגתי.`,
  };
}

function getProcessFactor(processName) {
  const match = Object.entries(processFactors).find(([label]) => processName?.includes(label));
  return match?.[1] || 0.48;
}

function buildRecommendedFirstAutomation(inputs, recommendation, roadmap) {
  if (roadmap?.quickWin) return roadmap.quickWin;
  if (recommendation?.firstStep) return recommendation.firstStep;
  if (inputs.mainManualProcess) return `אוטומציה ראשונית של ${inputs.mainManualProcess}`;
  return 'אוטומציה ראשונית של מעקב אחרי לקוחות ותזכורות';
}

function getRoiLevel(monthlyMoneySaved, monthlyHoursSaved) {
  if (monthlyMoneySaved >= 4500 || monthlyHoursSaved >= 45) return 'גבוהה';
  if (monthlyMoneySaved >= 1800 || monthlyHoursSaved >= 20) return 'בינונית';
  return 'נמוכה';
}

function getPaybackEstimate(roiLevel, monthlyMoneySaved) {
  if (roiLevel === 'גבוהה') return 'החזר פוטנציאלי בתוך חודש עד חודשיים';
  if (roiLevel === 'בינונית') return 'החזר פוטנציאלי בתוך 2-4 חודשים';
  if (monthlyMoneySaved > 0) return 'החזר הדרגתי לאחר מספר חודשי שימוש';
  return 'נדרש מידע נוסף כדי להעריך החזר';
}

function toNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

function roundOne(value) {
  return Math.round(value * 10) / 10;
}
