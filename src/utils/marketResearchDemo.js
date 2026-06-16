import { toolLinks } from '../data/tools.js';

export const businessTypes = [
  'מסעדה',
  'קליניקה',
  'חנות אונליין',
  'נותן שירותים',
  'משרד קטן',
  'יועץ/פרילנסר',
];

const externalToolLinks = {
  Zapier: toolLinks.Zapier,
  Make: toolLinks.Make,
  n8n: toolLinks.n8n,
  'Monday.com': toolLinks['Monday.com'],
  HubSpot: toolLinks.HubSpot,
  'ChatGPT/OpenAI': toolLinks['ChatGPT / OpenAI API'],
  'Google Workspace': toolLinks['Google Workspace Automation'],
  'Microsoft Power Automate': toolLinks['Microsoft Power Automate'],
  'Google Calendar': toolLinks['Google Calendar'],
  'Google Sheets': toolLinks['Google Sheets'],
  Shopify: toolLinks.Shopify,
  WooCommerce: toolLinks.WooCommerce,
  'WhatsApp Automation': toolLinks['WhatsApp Business'],
  'WhatsApp reminders': toolLinks['WhatsApp Business'],
  'Email/WhatsApp automation': toolLinks.Zapier,
  CRM: toolLinks.HubSpot,
};

const defaultConfig = {
  titleOptions: [
    'מפת אוטומציות לעסק שירות',
    'ניתוח תהליכים והזדמנויות אוטומציה',
    'תוכנית אוטומציה ראשונית לעסק',
  ],
  insightOptions: [
    'בעסקי שירות קטנים הערך המהיר ביותר מגיע מצמצום מעקבים ידניים, סידור פניות לקוחות ושיפור רצף העבודה בין שיווק, מכירה וביצוע.',
    'האתגר המרכזי הוא להפוך פניות, משימות ותזכורות לתהליך ברור שלא תלוי בזיכרון אישי או בהודעות מפוזרות.',
    'ככל שהעסק גדל, חשוב לחבר בין איסוף הפניות, ניהול הלקוחות והמעקב התפעולי כדי למנוע איבוד הזדמנויות.',
  ],
  painPoints: [
    'מעקב ידני אחרי לקוחות ופניות',
    'משימות מפוזרות בין מיילים, WhatsApp וגיליונות',
    'קושי לדעת באיזה שלב נמצא כל לקוח',
    'דוחות ובקרה שמתבצעים רק בדיעבד',
  ],
  automations: [
    'רישום אוטומטי של פנייה חדשה ועדכון סטטוס',
    'שליחת הודעת המשך אוטומטית אחרי פנייה',
    'פתיחת משימה אוטומטית לפי סוג שירות',
    'Dashboard בסיסי למעקב אחר לקוחות פתוחים',
  ],
  firstStep: 'להתחיל מטופס פנייה אחד שמעדכן גיליון או CRM ושולח הודעת המשך אוטומטית.',
  tools: [
    ['CRM', 'ניהול לקוחות, סטטוסים והיסטוריית פניות', 'מרכז את כל הקשר עם הלקוח במקום אחד', 'בינונית'],
    ['Monday.com', 'ניהול משימות ותהליכי שירות', 'מתאים לעסק שרוצה סדר ברור בין פניות, משימות ואחריות', 'בינונית'],
    ['Google Sheets', 'מעקב ראשוני ודוחות פשוטים', 'קל להתחיל ממנו לפני מעבר למערכת CRM מלאה', 'נמוכה'],
    ['Email/WhatsApp automation', 'שליחת הודעות ותזכורות אוטומטיות', 'חוסך טיפול ידני ומקטין פספוסי המשך', 'נמוכה-בינונית'],
  ],
};

const marketConfigs = {
  מסעדה: {
    titleOptions: [
      'מפת אוטומציות למסעדה',
      'ניתוח תפעול, הזמנות ושירות למסעדה',
      'תוכנית AI ראשונית לשיפור תפעול במסעדה',
    ],
    insightOptions: [
      'במסעדות, רוב החיסכון מגיע מסידור הזמנות, תיאום צוות, מעקב אחרי לקוחות חוזרים ודוחות יומיים פשוטים.',
      'מסעדה קטנה יכולה להרוויח מהר מאוטומציה שמקטינה הודעות ידניות ומרכזת הזמנות, משמרות ותזכורות במקום אחד.',
      'כאשר פניות, הזמנות ודוחות מנוהלים ידנית, קל לפספס לקוחות ולבזבז זמן ניהולי על תיאומים חוזרים.',
    ],
    painPoints: [
      'ניהול ידני של הזמנות ופניות מלקוחות',
      'מעקב לא מסודר אחרי לקוחות חוזרים או אירועים',
      'תיאום משמרות ותזכורות שמתבצע בהודעות מפוזרות',
      'דוחות יומיים או שבועיים שנבנים ידנית',
    ],
    automations: [
      'ריכוז פניות והזמנות מגוגל/WhatsApp לגיליון אחד',
      'תזכורת אוטומטית ללקוח לפני הזמנה או אירוע',
      'עדכון יומן למסעדה לפי הזמנה חדשה',
      'דוח מכירות והזמנות יומי שמתעדכן אוטומטית',
    ],
    firstStep: 'להתחיל מחיבור פניות WhatsApp או טופס הזמנה ל-Google Sheets עם תזכורת אוטומטית ללקוח.',
    tools: [
      ['WhatsApp Automation', 'אישור הזמנות, תזכורות ופניות לקוחות', 'מתאים למסעדה כי רוב התקשורת עם לקוחות מתרחשת בהודעות קצרות ומהירות', 'נמוכה-בינונית'],
      ['Google Sheets', 'ריכוז הזמנות, רשימות לקוחות ודוחות יומיים', 'מאפשר התחלה מהירה בלי מערכת מורכבת ונותן תמונת מצב בסיסית', 'נמוכה'],
      ['Make', 'חיבור בין טפסים, WhatsApp, גיליונות ויומן', 'מתאים לבניית תרחיש שמחבר כמה כלים בלי קוד', 'בינונית'],
      ['Google Calendar', 'ניהול אירועים, הזמנות ותזכורות', 'עוזר למנוע כפילויות ולשפר תיאום סביב אירועים ותפוסה', 'נמוכה'],
    ],
  },
  קליניקה: {
    titleOptions: [
      'מפת אוטומציות לקליניקה',
      'ניתוח תורים, מטופלים ותזכורות לקליניקה',
      'תוכנית AI לשיפור ניהול קליניקה',
    ],
    insightOptions: [
      'בקליניקות, נקודת הערך הראשונה היא הקטנת ביטולים ואי-הגעות באמצעות תזכורות, יומן מסודר ומעקב אחרי מטופלים.',
      'קליניקה קטנה סובלת לעיתים מעומס תיאום, הודעות חוזרות וחוסר רצף אחרי פגישה. אוטומציה בסיסית יכולה לשפר זאת מהר.',
      'כאשר היומן, המעקב והתקשורת אינם מחוברים, נוצרים פספוסים בתורים, תזכורות ושימור לקוחות.',
    ],
    painPoints: [
      'תיאום תורים וביטולים שמתבצע ידנית',
      'תזכורות למטופלים שנשלחות אחת-אחת',
      'מעקב לא רציף אחרי לקוח לאחר טיפול',
      'קושי לראות עומס, הכנסות או תורים עתידיים בצורה מסודרת',
    ],
    automations: [
      'תזכורות WhatsApp אוטומטיות לפני תור',
      'עדכון Google Calendar לפי טופס קביעת תור',
      'CRM בסיסי למעקב אחרי מטופלים וסטטוסים',
      'דוח שבועי על תורים, ביטולים ופניות חדשות',
    ],
    firstStep: 'להתחיל מתזכורת אוטומטית לפני פגישה שמחוברת ליומן ולרשימת המטופלים.',
    tools: [
      ['Google Calendar', 'ניהול תורים, זמינות ותזכורות', 'מתאים לקליניקה כי ליבת הפעילות היא פגישות וזמנים מדויקים', 'נמוכה'],
      ['WhatsApp reminders', 'שליחת תזכורת לפני תור והודעות המשך', 'מפחית אי-הגעות ומוריד עומס תיאום ידני', 'נמוכה-בינונית'],
      ['CRM', 'מעקב אחרי מטופלים, סטטוסים והיסטוריית קשר', 'מאפשר לראות מי צריך המשך טיפול, תזכורת או פנייה חוזרת', 'בינונית'],
      ['Make', 'חיבור בין יומן, טפסים, WhatsApp ו-CRM', 'עוזר לבנות תהליך רציף בלי לפתח מערכת מאפס', 'בינונית'],
    ],
  },
  'חנות אונליין': {
    titleOptions: [
      'מפת אוטומציות לחנות אונליין',
      'ניתוח מכירות, לידים ושירות לחנות דיגיטלית',
      'תוכנית AI לצמיחת חנות אונליין',
    ],
    insightOptions: [
      'בחנות אונליין הערך המרכזי נמצא בחיבור בין הזמנות, לקוחות, שירות ומסרים שיווקיים לאחר רכישה.',
      'חנות דיגיטלית יכולה להגדיל מכירות כאשר היא מזהה נטישות, עוקבת אחרי לקוחות חוזרים ומבצעת הודעות המשך בזמן.',
      'כאשר נתוני מכירה, שירות ושיווק מנותקים, קשה להבין איפה נופלות הזדמנויות ומה כדאי לשפר קודם.',
    ],
    painPoints: [
      'נטישת עגלה ללא הודעת המשך',
      'שירות לקוחות שחוזר על אותן שאלות',
      'חוסר סיווג בין לקוחות חדשים, חוזרים ומתעניינים',
      'דוחות מכירה ושיווק שאינם מחוברים לתמונה אחת',
    ],
    automations: [
      'הודעת המשך אוטומטית לנטישת עגלה או ליד חדש',
      'סיווג לקוחות לפי רכישה, עניין או פנייה',
      'מענה AI לשאלות נפוצות על משלוחים והחזרות',
      'דוח שבועי על הזמנות, פניות ולקוחות חוזרים',
    ],
    firstStep: 'להתחיל מאוטומציית הודעת המשך ללקוח חדש או נטישת עגלה, עם עדכון CRM בסיסי.',
    tools: [
      ['Shopify / WooCommerce', 'ניהול החנות, מוצרים, הזמנות ולקוחות', 'מתאים כי הוא מרכז את פעילות המכירה ומייצר נתונים לאוטומציה', 'בינונית'],
      ['Zapier', 'חיבור הזמנות, טפסים, CRM ודיוור', 'מאפשר להתחיל מהר עם חיבורים מוכנים בין כלים נפוצים', 'נמוכה-בינונית'],
      ['HubSpot', 'CRM, סיווג לקוחות ומעקב אחרי מכירה', 'מתאים לחנות שרוצה להבין לקוחות חוזרים ולנהל פניות בצורה מסודרת', 'בינונית'],
      ['ChatGPT/OpenAI', 'מענה לשאלות, ניסוח הודעות וסיכום פניות', 'מתאים לעומס טקסטואלי בשירות לקוחות ותוכן מוצר', 'בינונית'],
    ],
  },
  'נותן שירותים': defaultConfig,
  'משרד קטן': {
    titleOptions: [
      'מפת אוטומציות למשרד קטן',
      'ניתוח תפעול, מסמכים ומשימות למשרד',
      'תוכנית AI לסידור תהליכים במשרד קטן',
    ],
    insightOptions: [
      'במשרד קטן הערך מגיע מסידור משימות, מסמכים, אישורים ודוחות כך שהתהליך לא יישען על זיכרון או העברות ידניות.',
      'משרדים קטנים נוטים לעבוד עם הרבה קבצים, מיילים ומשימות חוזרות. חיבור נכון ביניהם משפר בקרה ומקטין טעויות.',
      'כאשר המשרד גדל, חשוב להפוך משימות חוזרות לתהליך מובנה עם אחראים, סטטוסים ודוחות.',
    ],
    painPoints: [
      'משימות שמתפזרות בין מיילים ושיחות',
      'מסמכים ואישורים שעוברים ידנית',
      'קושי לדעת מי אחראי על כל פעולה',
      'דוחות תקופתיים שנבנים באיחור',
    ],
    automations: [
      'פתיחת משימה אוטומטית לפי טופס או מייל נכנס',
      'אישור מסמך או בקשה במסלול מובנה',
      'סנכרון נתונים בין Google Workspace לגיליונות',
      'דוח ניהולי שבועי על משימות פתוחות',
    ],
    firstStep: 'להתחיל מתהליך אחד שחוזר הרבה: טופס או מייל נכנס שפותח משימה ומעדכן גיליון מעקב.',
    tools: [
      ['Monday.com', 'ניהול משימות, אחריות וסטטוסים', 'מתאים למשרד קטן שרוצה לראות את כל העבודה במקום אחד', 'בינונית'],
      ['Google Workspace', 'מיילים, מסמכים, Forms ו-Drive', 'מתאים כי רוב המשרדים כבר עובדים עם מסמכים וקבצים בענן', 'נמוכה'],
      ['Microsoft Power Automate', 'אוטומציה של אישורים, מסמכים ותהליכי Office', 'מתאים למשרד שעובד עם Microsoft 365 וצריך תהליכי אישור', 'בינונית-גבוהה'],
      ['Google Sheets', 'מעקב, דוחות וסיכום נתונים', 'מאפשר התחלה פשוטה לפני הטמעת מערכת כבדה יותר', 'נמוכה'],
    ],
  },
  'יועץ/פרילנסר': {
    titleOptions: [
      'מפת אוטומציות ליועץ או פרילנסר',
      'ניתוח לידים, פגישות ותוצרים לפרילנסר',
      'תוכנית AI לשיפור ניהול לקוחות עצמאי',
    ],
    insightOptions: [
      'אצל יועצים ופרילנסרים, הזמן היקר ביותר מתבזבז לרוב על תיאום פגישות, מעקב אחרי לידים וסיכום פעולות המשך.',
      'אוטומציה נכונה עוזרת לשמור על רצף מקצועי בין פנייה, פגישה, הצעת מחיר והמשך קשר.',
      'כאשר בעל העסק עושה גם מכירות, שירות וביצוע, כדאי להוריד ממנו משימות חוזרות ולהפוך אותן למסלול קבוע.',
    ],
    painPoints: [
      'פניות חדשות שלא מקבלות המשך בזמן',
      'תיאום פגישות ידני עם הרבה הודעות הלוך ושוב',
      'סיכום פגישות ומשימות המשך שמתבצע ידנית',
      'חוסר מעקב אחרי הצעות מחיר ולקוחות מתעניינים',
    ],
    automations: [
      'קביעת פגישה אוטומטית עם עדכון יומן',
      'רישום ליד חדש ב-HubSpot ושליחת הודעת המשך',
      'סיכום AI לפגישה ויצירת משימות המשך',
      'תזכורת אוטומטית להצעת מחיר שלא נסגרה',
    ],
    firstStep: 'להתחיל מחיבור טופס פנייה ל-HubSpot ול-Google Calendar, כולל הודעת המשך אוטומטית.',
    tools: [
      ['HubSpot', 'ניהול לידים, הצעות מחיר ומעקב לקוחות', 'מתאים ליועץ שצריך לראות איפה כל לקוח נמצא בתהליך', 'בינונית'],
      ['Google Calendar', 'קביעת פגישות ותזכורות', 'חוסך תיאומים ידניים ומסדר את תהליך הפגישה', 'נמוכה'],
      ['ChatGPT/OpenAI', 'סיכום פגישות, ניסוח הודעות ותוצרים', 'מתאים לעבודה מבוססת ידע, טקסט ותקשורת לקוחות', 'בינונית'],
      ['Zapier', 'חיבור טפסים, יומן, CRM ומייל', 'מאפשר להקים תהליך אוטומטי קצר ללא פיתוח', 'נמוכה-בינונית'],
    ],
  },
};

const focusedRecommendationRows = {
  מסעדה: [
    ['ניהול הזמנות ותזכורות', 'הזמנות ופניות מטופלות ידנית בין טלפון, WhatsApp וגיליונות', 'אישור הזמנה, עדכון גיליון ותזכורת אוטומטית ללקוח', ['WhatsApp Automation', 'Google Sheets', 'Make'], 'גבוהה', 'נמוכה-בינונית'],
    ['לקוחות חוזרים והודעות', 'אין מעקב מסודר אחרי לקוחות חוזרים או אירועים', 'רשימת לקוחות חוזרים ושליחת הודעות לפי תאריך או אירוע', ['Google Sheets', 'WhatsApp Automation'], 'בינונית-גבוהה', 'נמוכה'],
    ['דוחות הזמנות', 'סיכום הזמנות ומכירות מתבצע ידנית בסוף יום', 'דוח יומי אוטומטי שמרכז הזמנות, ביטולים ותפוסה', ['Google Sheets', 'Make'], 'בינונית', 'נמוכה'],
    ['תיאום משמרות / תפעול', 'תיאום משמרות ועדכונים מתפזרים בהודעות', 'יומן תפעולי עם תזכורות ועדכונים לצוות', ['Google Calendar', 'Make'], 'בינונית', 'בינונית'],
  ],
  קליניקה: [
    ['תיאום פגישות ותזכורות', 'תורים, ביטולים ותזכורות מנוהלים ידנית', 'תזכורת אוטומטית לפני תור ועדכון יומן', ['Google Calendar', 'WhatsApp reminders', 'Make'], 'גבוהה', 'נמוכה-בינונית'],
    ['ניהול מטופלים / לקוחות', 'קשה לראות סטטוס, היסטוריית קשר והמשך טיפול', 'CRM בסיסי למעקב אחרי מטופלים ופעולות המשך', ['CRM', 'Make'], 'גבוהה', 'בינונית'],
    ['סיכום פניות', 'פניות חדשות מגיעות ממקורות שונים ולא תמיד מתועדות', 'ריכוז פניות, שיוך סטטוס ושליחת הודעת המשך', ['CRM', 'WhatsApp reminders'], 'בינונית-גבוהה', 'בינונית'],
    ['דוחות פעילות', 'אין תמונת מצב רציפה על תורים, ביטולים ופניות', 'דוח שבועי על תורים, ביטולים ופניות חדשות', ['Google Sheets', 'Make'], 'בינונית', 'נמוכה'],
  ],
  'חנות אונליין': [
    ['מעקב הזמנות', 'הזמנות, פניות ועדכוני לקוח לא תמיד מחוברים', 'סנכרון הזמנה ל-CRM ושליחת הודעת סטטוס', ['Shopify', 'WooCommerce', 'Zapier', 'HubSpot'], 'גבוהה', 'בינונית'],
    ['שירות לקוחות', 'שאלות חוזרות על משלוחים, החזרות ומוצרים מטופלות ידנית', 'מענה AI ראשוני וסיכום פניות שירות', ['ChatGPT/OpenAI', 'HubSpot'], 'גבוהה', 'בינונית'],
    ['נטישת עגלה / שימור לקוחות', 'לקוחות נוטשים או לא מקבלים המשך קשר בזמן', 'הודעת המשך אוטומטית לנטישת עגלה ולקוחות חוזרים', ['Zapier', 'HubSpot'], 'גבוהה', 'נמוכה-בינונית'],
    ['דוחות מכירות', 'דוחות מכירה ושירות נבדקים בנפרד', 'דוח שבועי שמרכז הזמנות, פניות ולקוחות חוזרים', ['Shopify', 'WooCommerce', 'Google Sheets'], 'בינונית-גבוהה', 'בינונית'],
  ],
  'נותן שירותים': [
    ['ניהול לידים', 'פניות חדשות מגיעות ממייל, טפסים ו-WhatsApp בלי תיעוד אחיד', 'רישום ליד חדש, שיוך מקור ושליחת הודעת המשך', ['CRM', 'Email/WhatsApp automation'], 'גבוהה', 'נמוכה-בינונית'],
    ['הצעות מחיר', 'מעקב אחרי הצעות פתוחות מתבצע ידנית', 'תזכורת אוטומטית להצעת מחיר שלא נסגרה', ['CRM', 'Monday.com'], 'בינונית-גבוהה', 'נמוכה-בינונית'],
    ['מעקב לקוחות', 'אין סטטוס ברור לכל לקוח בתהליך', 'Pipeline לקוחות עם משימות המשך ועדכון סטטוס', ['CRM', 'Google Sheets'], 'גבוהה', 'בינונית'],
    ['תזכורות ותיאום', 'פגישות ומשימות המשך נשכחות או נדחות', 'תזכורות אוטומטיות לפי סטטוס לקוח ותאריך יעד', ['Monday.com', 'Email/WhatsApp automation'], 'בינונית-גבוהה', 'נמוכה'],
  ],
  'משרד קטן': [
    ['ניהול משימות', 'משימות מתפזרות בין מיילים, הודעות ושיחות', 'פתיחת משימה אוטומטית לפי פנייה נכנסת ושיוך אחראי', ['Monday.com', 'Google Workspace'], 'בינונית-גבוהה', 'בינונית'],
    ['מסמכים ואישורים', 'אישורים ומסמכים עוברים ידנית בין עובדים', 'מסלול אישור אוטומטי למסמכים ובקשות', ['Microsoft Power Automate', 'Google Workspace'], 'בינונית-גבוהה', 'בינונית-גבוהה'],
    ['דוחות פנימיים', 'נתונים נאספים ידנית בסוף שבוע או חודש', 'דוח פנימי שמתעדכן מגיליונות ומשימות', ['Google Sheets', 'Monday.com'], 'בינונית', 'נמוכה-בינונית'],
    ['חיבור צוותים וכלים', 'צוותים עובדים בכלים שונים בלי תמונת מצב אחת', 'חיבור בין משימות, מסמכים ודוחות ניהוליים', ['Monday.com', 'Microsoft Power Automate'], 'בינונית', 'בינונית-גבוהה'],
  ],
  'יועץ/פרילנסר': [
    ['ניהול לידים', 'פניות חדשות לא תמיד מקבלות המשך בזמן', 'רישום ליד ב-CRM ושליחת הודעת המשך אוטומטית', ['HubSpot', 'Zapier'], 'גבוהה', 'נמוכה-בינונית'],
    ['תיאום פגישות', 'תיאום פגישות דורש הודעות חוזרות', 'קביעת פגישה אוטומטית ועדכון יומן', ['Google Calendar', 'Zapier'], 'גבוהה', 'נמוכה'],
    ['סיכום פגישות', 'סיכום ידני ומשימות המשך עלולים להישכח', 'סיכום AI לפגישה ויצירת משימות המשך', ['ChatGPT/OpenAI', 'HubSpot'], 'בינונית-גבוהה', 'בינונית'],
    ['מעקב הצעות מחיר', 'הצעות פתוחות נשארות ללא תזכורת', 'תזכורת אוטומטית להצעת מחיר שלא נסגרה', ['HubSpot', 'Zapier'], 'בינונית-גבוהה', 'נמוכה-בינונית'],
  ],
};

function stableIndex(parts, length) {
  const key = parts.filter(Boolean).join('|');
  let hash = 0;
  for (let index = 0; index < key.length; index += 1) {
    hash = (hash * 31 + key.charCodeAt(index)) % 9973;
  }
  return hash % length;
}

function normalizeBusinessType(value = '') {
  const trimmed = value.trim();
  if (businessTypes.includes(trimmed)) return trimmed;
  if (trimmed.includes('מסעד')) return 'מסעדה';
  if (trimmed.includes('קלינ') || trimmed.includes('רופא') || trimmed.includes('טיפול')) return 'קליניקה';
  if (trimmed.includes('חנות') || trimmed.includes('אונליין') || trimmed.includes('איקומרס') || trimmed.includes('ecommerce')) return 'חנות אונליין';
  if (trimmed.includes('משרד')) return 'משרד קטן';
  if (trimmed.includes('יועץ') || trimmed.includes('פרילנס') || trimmed.includes('עצמאי')) return 'יועץ/פרילנסר';
  return 'נותן שירותים';
}

function withToolLinks(toolRows) {
  return toolRows.map(([tool, useCase, fit, complexity]) => {
    const links = tool === 'Shopify / WooCommerce'
      ? [
          { label: 'Shopify', url: externalToolLinks.Shopify },
          { label: 'WooCommerce', url: externalToolLinks.WooCommerce },
        ]
      : [{ label: 'פתיחת אתר', url: externalToolLinks[tool] || externalToolLinks.CRM }];

    return {
      tool,
      useCase,
      fit,
      complexity,
      links,
    };
  });
}

function linksForTools(rowTools) {
  return rowTools.flatMap((tool) => {
    if (tool === 'Shopify / WooCommerce') {
      return [
        { label: 'Shopify', url: externalToolLinks.Shopify },
        { label: 'WooCommerce', url: externalToolLinks.WooCommerce },
      ];
    }

    return [{ label: tool, url: externalToolLinks[tool] || externalToolLinks.CRM }];
  });
}

function withFocusedLinks(rows) {
  return rows.map(([process, currentState, automation, rowTools, impact, complexity]) => ({
    process,
    currentState,
    automation,
    tools: rowTools,
    impact,
    complexity,
    links: linksForTools(rowTools),
  }));
}

function adaptToGoal(goal, businessType) {
  const goalMap = {
    'חיסכון בזמן': `הדגש הוא להתחיל מאוטומציה שמורידה עבודה ידנית חוזרת ב${businessType === 'חנות אונליין' ? 'ניהול הזמנות ופניות' : 'מעקב ותזכורות'}.`,
    'שיפור שירות לקוחות': 'הדגש הוא לקצר זמני תגובה, לשלוח הודעות המשך בזמן ולתעד כל פנייה בצורה מסודרת.',
    'הגדלת מכירות': 'הדגש הוא למנוע איבוד לידים, לסווג פניות חדשות ולייצר המשך קשר אוטומטי.',
    'שיפור תפעול': 'הדגש הוא לחבר משימות, נתונים ודוחות כדי לתת לבעל העסק תמונת מצב תפעולית ברורה.',
  };

  return goalMap[goal] || 'הדגש הוא לבחור פעולה ראשונה עם ערך עסקי ברור ומורכבות יישום נמוכה.';
}

function complexityValue(complexity = '') {
  if (complexity.includes('גבוהה') && complexity.includes('בינונית')) return 2.7;
  if (complexity.includes('גבוהה')) return 3;
  if (complexity.includes('בינונית') && complexity.includes('נמוכה')) return 1.5;
  if (complexity.includes('בינונית')) return 2;
  return 1;
}

function impactValue(impact = '') {
  if (impact.includes('גבוהה') && impact.includes('בינונית')) return 2.5;
  if (impact.includes('גבוהה')) return 3;
  if (impact.includes('בינונית')) return 2;
  return 1;
}

function scoreLabel(score) {
  if (score >= 80) return 'כדאיות גבוהה';
  if (score >= 65) return 'כדאיות בינונית';
  return 'כדאיות נמוכה';
}

function calculateFeasibilityScore({ businessType, businessSize, businessGoal, focusedRows, toolCount }) {
  const repetitiveProcessBonus = ['מסעדה', 'קליניקה', 'חנות אונליין', 'משרד קטן'].includes(businessType) ? 8 : 6;
  const goalValueBonus = {
    'חיסכון בזמן': 8,
    'שיפור שירות לקוחות': 8,
    'הגדלת מכירות': 9,
    'שיפור תפעול': 6,
  }[businessGoal] || 0;
  const sizeBonus = {
    'עסק קטן': 4,
    'עסק בינוני': 8,
    סטארטאפ: 10,
  }[businessSize] || 0;
  const averageComplexity = focusedRows.reduce((sum, row) => sum + complexityValue(row.complexity), 0) / focusedRows.length;
  const averageImpact = focusedRows.reduce((sum, row) => sum + impactValue(row.impact), 0) / focusedRows.length;
  const simplicityBonus = averageComplexity <= 1.55 ? 6 : averageComplexity <= 2.1 ? 4 : 2;
  const impactBonus = averageImpact >= 2.6 ? 5 : averageImpact >= 2.1 ? 4 : 2;
  const toolsBonus = toolCount >= 4 ? 4 : 2;
  const highComplexityPenalty = focusedRows.filter((row) => complexityValue(row.complexity) >= 2.7).length * 5;
  const verySmallAdvancedPenalty = businessSize === 'עסק קטן' && averageComplexity > 2.2 ? 5 : 0;
  const broadGoalPenalty = businessGoal ? 0 : 5;
  const businessAdjustment = businessType === 'משרד קטן' ? 4 : businessType === 'נותן שירותים' ? -2 : 0;
  const deterministicVariation = stableIndex([businessType, businessSize, businessGoal, 'score'], 5) - 2;

  const rawScore = 55
    + repetitiveProcessBonus
    + goalValueBonus
    + sizeBonus
    + simplicityBonus
    + impactBonus
    + toolsBonus
    + businessAdjustment
    - highComplexityPenalty
    - verySmallAdvancedPenalty
    - broadGoalPenalty
    + deterministicVariation;

  return Math.max(45, Math.min(95, rawScore));
}

export function generateMarketResearchDemo({ businessField, businessSize, businessGoal }) {
  const businessType = normalizeBusinessType(businessField);
  const config = marketConfigs[businessType] || defaultConfig;
  const focusedRows = withFocusedLinks(focusedRecommendationRows[businessType] || focusedRecommendationRows['נותן שירותים']);
  const variant = stableIndex([businessType, businessSize, businessGoal], config.titleOptions.length);
  const insightVariant = stableIndex([businessGoal, businessSize, businessType], config.insightOptions.length);
  const feasibilityScore = calculateFeasibilityScore({
    businessType,
    businessSize,
    businessGoal,
    focusedRows,
    toolCount: config.tools.length,
  });
  const feasibilityLabel = scoreLabel(feasibilityScore);
  const sizeContext = businessSize === 'סטארטאפ'
    ? 'בשלב צמיחה, חשוב לבנות תהליך מדיד שניתן להרחיב בהמשך.'
    : businessSize === 'עסק בינוני'
      ? 'לעסק בינוני כדאי לתעדף חיבור בין מערכות כדי לצמצם צווארי בקבוק בין עובדים.'
      : 'לעסק קטן כדאי להתחיל בפעולה אחת פשוטה שמחזירה ערך מהר.';

  return {
    businessType,
    productTitle: config.titleOptions[variant],
    explanation: `${config.insightOptions[insightVariant]} ${adaptToGoal(businessGoal, businessType)} ${sizeContext}`,
    marketInsight: config.insightOptions[insightVariant],
    painPoints: config.painPoints,
    recommendedAutomations: config.automations,
    mainRecommendation: config.automations[0],
    summaryInsights: [
      config.painPoints[0],
      config.painPoints[1],
      config.automations[0],
    ],
    tools: withToolLinks(config.tools),
    focusedRecommendations: focusedRows,
    firstStep: config.firstStep,
    feasibilityScore,
    feasibilityLabel,
    scoreExplanation: `הציון משקלל התאמה עסקית, מורכבות יישום, השפעה צפויה ורלוונטיות הכלים שנבחרו. במקרה של ${businessType}, ההמלצה נבחנה מול ${businessGoal} ו${businessSize}.`,
    analysisContext: [
      ['תחום עסקי', businessType],
      ['גודל העסק', businessSize],
      ['מטרה מרכזית', businessGoal],
    ],
    note: 'התוצאה מבוססת על סימולציית חקר שוק Rule-Based לצורך הפרויקט האקדמי.',
  };
}
