# AutoBiz AI Advisor

AutoBiz AI Advisor הוא פרויקט גמר אקדמי המדגים אפליקציית Web בעברית ובכיוון RTL, שמטרתה לעזור לעסקים קטנים לבחור כלי אוטומציה ו-AI המתאימים לצרכים העסקיים שלהם.

המערכת בנויה כיישום React + Vite, כוללת שאלון התאמה אינטראקטיבי, מנוע המלצה Rule-Based, השוואת כלי אוטומציה, ספריית מקרי שימוש, שמירת פניות דמו, התראות מייל דרך Serverless Function, ואזור ניהול מוגן ברמת דמו.

> זהו פרויקט אקדמי / דמו. אין להזין אליו מידע אישי אמיתי, סיסמאות אמיתיות או נתוני לקוחות אמיתיים.

## מטרת הפרויקט

עסקים קטנים רבים רוצים להשתמש באוטומציות AI כדי לחסוך זמן, לשפר שירות, לארגן מידע ולהגדיל מכירות, אך מתקשים לבחור בין כלים רבים בעלי מחירים, רמות מורכבות ואפשרויות אינטגרציה שונות.

AutoBiz AI Advisor משמש כפלטפורמת Decision Support ראשונית:

- איסוף מידע על העסק דרך שאלון התאמה.
- ניתוח צרכים באמצעות לוגיקת המלצה מוסברת.
- הצגת קטגוריית אוטומציה מומלצת וכלים רלוונטיים.
- יצירת פניות דמו לצורך הצגה וניהול בסיסי.
- תיעוד שימוש בכלי AI במסגרת הפרויקט האקדמי.

## קהל יעד

- בעלי עסקים קטנים
- עצמאים ופרילנסרים
- צוותים קטנים
- עסקים שרוצים להתחיל להשתמש באוטומציות AI ולא יודעים מאיפה להתחיל

## תכונות מרכזיות

- ממשק עברי מלא עם תמיכה ב-RTL.
- דף בית מקצועי בסגנון SaaS עסקי.
- שאלון התאמה עם ולידציה והצגת המלצה במודל Popout.
- מנוע המלצה Rule-Based שקל להסביר ולהציג.
- טבלת השוואת כלים עם חיפוש, סינון וקישורים לאתרים רשמיים.
- ספריית מקרי שימוש עסקיים לאוטומציות AI.
- Mock Authentication באמצעות localStorage.
- אזור אישי המציג המלצה שמורה.
- עמוד מסלולים וטופס בקשת ייעוץ.
- ניהול פניות דמו עם סינון, ניקוי וייצוא CSV.
- התראת מייל בהרשמת משתמש דרך Vercel Serverless Function ו-Resend.
- הגנת דמו על עמוד Admin לפי כתובת אימייל של מנהל.
- עמוד מתודולוגיה וסיכום אקדמי.

## ארכיטקטורת המערכת

המערכת בנויה כארכיטקטורת Frontend-first המותאמת לפרויקט דמו אקדמי:

- **Frontend:** React + Vite.
- **Hosting:** Vercel.
- **Demo Data Storage:** שימוש ב-localStorage לשמירת משתמש דמו, המלצה אחרונה ופניות.
- **Lead Management:** פניות דמו נשמרות מקומית בדפדפן דרך `src/utils/leads.js`.
- **Email Notifications:** שליחת התראת מייל בהרשמה דרך `api/send-signup-notification.js`, Vercel Serverless Function ו-Resend.
- **Authentication:** Mock Authentication בלבד, ללא Backend אמיתי.
- **Admin Access:** בדיקת תפקיד דמו לפי כתובת אימייל של מנהל.
- **External Links:** קישורים רשמיים לכלי אוטומציה כגון Zapier, Make, n8n, HubSpot, OpenAI, Google Workspace ו-Microsoft Power Automate.

## זרימת המערכת

1. משתמש נכנס לאתר.
2. המשתמש ממלא שאלון התאמה.
3. המערכת מפעילה לוגיקת המלצה Rule-Based.
4. התוצאה מוצגת במודל Popout.
5. המשתמש יכול להירשם ולשמור המלצה.
6. נוצר Lead דמו ב-localStorage.
7. בהרשמה, פונקציית Serverless יכולה לשלוח התראת מייל דרך Resend.
8. Admin יכול להיכנס לעמוד ניהול פניות ולראות פניות דמו.

## תרשים ארכיטקטורה

```text
משתמש
  ↓
React + Vite Frontend
  ↓
שאלון התאמה + Rule-Based Recommendation
  ↓
localStorage Demo Data
  ↓
Vercel Serverless Function
  ↓
Resend Email Notification
  ↓
Business Email Inbox
```

## מבנה הפרויקט

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
```

### הסבר מבנה

- `src/data` - נתונים סטטיים עסקיים: אזורי אוטומציה, כלי אוטומציה ומקרי שימוש.
- `src/utils/auth.js` - לוגיקת Mock Authentication ובדיקת Admin דמו.
- `src/utils/leads.js` - יצירה, קריאה, ניקוי וייצוא של פניות דמו.
- `src/utils/notifications.js` - קריאה מה-Frontend ל-Serverless Function של התראות מייל.
- `src/utils/recommendation.js` - מנוע המלצה Rule-Based.
- `src/App.jsx` - ניהול state, ניווט פנימי, עמודים ורכיבי UI מרכזיים.
- `src/styles.css` - עיצוב RTL, רספונסיביות, מודלים, טבלאות וכרטיסים.
- `api/send-signup-notification.js` - Endpoint בצד שרת לשליחת התראת מייל בהרשמה.

## כלי AI שבהם השתמשנו

### Codex

Codex שימש לתכנון מבנה הקוד, בניית ממשק React, יצירת רכיבים, שיפור חוויית משתמש, תיקון בעיות, ארגון קבצים וכתיבת לוגיקה.

### ChatGPT / Gemini

כלי AI נוספים שימשו למחקר שוק, הגדרת קריטריונים להשוואת כלים, ניסוח מקרי שימוש עסקיים, שיפור לוגיקת ההמלצה והכנת תוכן אקדמי.

## איך להריץ מקומית

```bash
npm install
npm run dev
```

בניית גרסת Production:

```bash
npm run build
```

תצוגה מקדימה אחרי build:

```bash
npm run preview
```

## פריסה ב-Vercel

1. מעלים את הפרויקט ל-GitHub.
2. יוצרים פרויקט חדש ב-Vercel.
3. בוחרים Framework: Vite.
4. מגדירים:
   - Install Command: `npm install`
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. מוסיפים Environment Variables לפי הצורך.
6. מבצעים Deploy.

## משתני סביבה

אין לשמור מפתחות API או סודות בקוד או ב-GitHub. יש להגדיר אותם ב-Vercel Environment Variables בלבד.

```bash
RESEND_API_KEY=your_resend_api_key_here
LEAD_NOTIFICATION_EMAIL=autobiz.advisor.ai@gmail.com
APP_BASE_URL=https://ai-business-automation-advisor.vercel.app
```

`APP_BASE_URL` משמש ליצירת קישורים בתוך התראות מייל, לדוגמה קישור לעמוד ניהול הפניות:

```text
https://ai-business-automation-advisor.vercel.app/#admin-leads
```

## התראות מייל בהרשמת משתמש

כאשר משתמש חדש נרשם, האפליקציה שומרת את המשתמש ב-localStorage לצורך דמו, יוצרת Lead מקומי, ומנסה לשלוח התראת מייל עסקית דרך Serverless Function.

השליחה מתבצעת רק בצד שרת:

```text
POST /api/send-signup-notification
```

ספק המיילים: Resend.

כתובת ההתראה הרשמית של הפרויקט:

```text
autobiz.advisor.ai@gmail.com
```

אם `RESEND_API_KEY` חסר או שהשליחה נכשלת, ההרשמה לא נחסמת. המשתמש ממשיך לאזור האישי, והכשל נרשם ב-console.

## הגנת דמו על עמוד Admin

עמוד `ניהול פניות` מוגן בפרויקט הדמו באמצעות בדיקת אימייל מנהל:

```text
autobiz.advisor.ai@gmail.com
```

רק משתמש שמחובר עם כתובת זו יראה את פריט הניווט `ניהול פניות` ויוכל לפתוח:

```text
https://ai-business-automation-advisor.vercel.app/#admin-leads
```

זוהי הגנת דמו בלבד. בגרסת Production יש להחליף זאת באימות משתמשים אמיתי וב-Role-Based Access Control.

## אבטחה ופרטיות

- אין לשמור API keys, tokens, סיסמאות או SMTP credentials ב-GitHub.
- סודות צריכים להישמר ב-Vercel Environment Variables בלבד.
- מערכת ההתחברות היא Mock Authentication בלבד.
- localStorage משמש רק לצורך הדגמה אקדמית.
- אין להזין נתוני לקוחות אמיתיים או סיסמאות אמיתיות.
- גרסת Production צריכה לכלול Backend מאובטח, בסיס נתונים, Sessions, הרשאות תפקידים, ולידציה בצד שרת וניהול סודות מוצפן.

## איך הפרויקט עונה על דרישות הקורס

- **יישומי AI בעולם העסקי:** האתר מציג שימושים עסקיים מעשיים ב-AI ואוטומציה.
- **חשיבה של מערכות מידע:** קיימת התייחסות לזרימת נתונים, משתמשים, הרשאות, פניות, אינטגרציות ותהליכים עסקיים.
- **ערך עסקי:** ההמלצה כוללת קטגוריה, כלים, מורכבות, השפעה עסקית וצעד ראשון.
- **חשיבה ביקורתית:** טבלת הכלים מציגה יתרונות, חסרונות, רמות מחיר, רמות אינטגרציה וסוגי עסקים מתאימים.
- **שימוש משמעותי בכלי AI:** הפרויקט מתעד שימוש ב-Codex וב-ChatGPT / Gemini לתכנון, מחקר, ניסוח, פיתוח ושיפור.

## תוכנית הצגה ל-10 דקות

1. **הצגת הבעיה וקהל היעד**  
   להסביר מדוע עסקים קטנים מתקשים לבחור כלי AI ואוטומציה.

2. **הדגמת דף הבית**  
   להראות את מטרת המוצר ואת אזורי האוטומציה המרכזיים.

3. **מילוי שאלון התאמה**  
   למלא דוגמה עסקית ולהציג את ההמלצה במודל Popout.

4. **השוואת כלים**  
   להציג חיפוש, סינון וקישורים לאתרים רשמיים.

5. **הרשמה ואזור אישי**  
   להדגים יצירת משתמש דמו ושמירת המלצה.

6. **ניהול פניות דמו**  
   להתחבר כ-Admin ולהציג פניות, סינון וייצוא CSV.

7. **שימוש בכלי AI**  
   להסביר כיצד Codex ו-ChatGPT / Gemini שימשו בפרויקט.

8. **לקחים ושיפורים עתידיים**  
   להציג מגבלות דמו ומה נדרש לגרסת Production.

## שדרוגים נדרשים לגרסת Production

- החלפת Mock Authentication ב-Supabase, Firebase, Clerk או פתרון Auth מאובטח אחר.
- שמירת משתמשים ופניות בבסיס נתונים אמיתי.
- הרשאות Admin אמיתיות ו-Role-Based Access Control.
- ולידציה בצד שרת לכל טופס ופעולה.
- Audit logs לפעולות ניהוליות.
- דומיין מייל מאומת ומאובטח לשליחת התראות.
- מערכת תשלומים אם מסלולים יהפכו למסלולים בתשלום.
- מדיניות פרטיות ותנאי שימוש.
- ניטור שגיאות, גיבויים ואבטחת מידע.

## סטטוס הפרויקט

הפרויקט מתאים להצגה אקדמית ולתיק עבודות כיישום Frontend מתקדם עם Serverless Function בסיסית. הוא אינו מיועד לשימוש Production ללא שדרוגי אבטחה, אימות, בסיס נתונים וניהול הרשאות.
