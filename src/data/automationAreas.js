import {
  BarChart3,
  CalendarClock,
  FileText,
  Megaphone,
  MessageSquare,
  Network,
  Target,
  Users,
} from 'lucide-react';

export const automationAreas = [
  {
    title: 'שירות לקוחות',
    description: 'סיווג פניות, סיכום הודעות, ניסוח תגובות והעברה לאדם הנכון.',
    icon: MessageSquare,
  },
  {
    title: 'ניהול לידים',
    description: 'שמירת לידים מטפסים, פרסומות, מיילים ו-WhatsApp במקום אחד.',
    icon: Target,
  },
  {
    title: 'תיאום פגישות',
    description: 'תזכורות, יומנים, אישורי הגעה וצמצום עבודה ידנית.',
    icon: CalendarClock,
  },
  {
    title: 'מיילים ו-WhatsApp',
    description: 'תגובות אוטומטיות, תיוג הודעות ותזכורות ללקוחות.',
    icon: Network,
  },
  {
    title: 'חשבוניות ומסמכים',
    description: 'מעקב אחרי מסמכים, חילוץ מידע ותזכורות תשלום.',
    icon: FileText,
  },
  {
    title: 'רשתות חברתיות',
    description: 'טיוטות פוסטים, לוחות תוכן ואוטומציה של עדכונים שיווקיים.',
    icon: Megaphone,
  },
  {
    title: 'CRM',
    description: 'עדכון סטטוסים, שיוך משימות, מעקב לקוחות ודוחות מכירה.',
    icon: Users,
  },
  {
    title: 'דוחות עסקיים',
    description: 'איסוף נתונים, סיכומים שבועיים ותובנות לשיפור החלטות.',
    icon: BarChart3,
  },
];
