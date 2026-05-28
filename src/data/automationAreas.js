import {
  Bot,
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
    title: 'Customer Service',
    description: 'Classify requests, suggest replies, and route urgent issues faster.',
    icon: MessageSquare,
  },
  {
    title: 'Lead Management',
    description: 'Capture leads from forms, ads, email, and WhatsApp into one CRM flow.',
    icon: Target,
  },
  {
    title: 'Scheduling',
    description: 'Reduce manual coordination with reminders, calendars, and booking rules.',
    icon: CalendarClock,
  },
  {
    title: 'Documents & Invoices',
    description: 'Extract information, create reminders, and organize business files.',
    icon: FileText,
  },
  {
    title: 'Social Media',
    description: 'Turn weekly business updates into draft posts and content calendars.',
    icon: Megaphone,
  },
  {
    title: 'CRM Workflows',
    description: 'Move deals, update records, and notify staff when customer status changes.',
    icon: Users,
  },
  {
    title: 'Internal Processes',
    description: 'Connect operations across task management, email, sheets, and approvals.',
    icon: Network,
  },
  {
    title: 'AI Assistants',
    description: 'Summarize messages, generate drafts, and support employee decision making.',
    icon: Bot,
  },
];
