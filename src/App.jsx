import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  BarChart3,
  BookOpenCheck,
  BrainCircuit,
  BriefcaseBusiness,
  CheckCircle2,
  ClipboardList,
  Download,
  ExternalLink,
  FileSearch,
  GraduationCap,
  LayoutDashboard,
  LockKeyhole,
  LogIn,
  LogOut,
  Menu,
  Network,
  Route,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  Table2,
  UserPlus,
  Users,
  WalletCards,
  X,
} from 'lucide-react';
import { tools, toolLinks } from './data/tools.js';
import { useCases } from './data/useCases.js';
import { generateRecommendation } from './utils/recommendation.js';
import { clearLeads, createLead, exportLeadsToCsv, getLeads } from './utils/leads.js';
import { getCurrentUser, isAdminUser, loginDemoUser, logoutDemoUser, signUpDemoUser } from './utils/auth.js';
import { sendSignupNotification } from './utils/notifications.js';
import { generateAutomationRoadmap } from './utils/roadmap.js';
import { calculateAutomationROI } from './utils/roiCalculator.js';
import { businessTypes, generateMarketResearchDemo } from './utils/marketResearchDemo.js';

const assessmentStorageKey = 'autobiz_last_assessment';
const roiStorageKey = 'autobiz_last_roi';
const guestAssessmentStorageKey = 'autobiz_guest_assessment';

const hashPageMap = {
  '#home': 'home',
  '#ai-demo': 'aiDemo',
  '#assessment': 'assessment',
  '#roi-calculator': 'roiCalculator',
  '#roadmap': 'roadmap',
  '#tools': 'toolsLessons',
  '#comparison': 'comparison',
  '#use-cases': 'library',
  '#plans': 'plans',
  '#consultation': 'consultation',
  '#admin-leads': 'admin',
  '#admin': 'admin',
  '#methodology': 'methodology',
  '#about-project': 'aboutProject',
  '#summary': 'summary',
  '#signup': 'signup',
  '#login': 'login',
  '#dashboard': 'dashboard',
};

const pageHashMap = {
  home: 'home',
  aiDemo: 'ai-demo',
  assessment: 'assessment',
  roiCalculator: 'roi-calculator',
  roadmap: 'roadmap',
  comparison: 'comparison',
  toolsLessons: 'tools',
  library: 'use-cases',
  plans: 'plans',
  consultation: 'consultation',
  admin: 'admin-leads',
  methodology: 'methodology',
  aboutProject: 'about-project',
  summary: 'summary',
  signup: 'signup',
  login: 'login',
  dashboard: 'dashboard',
};

const baseNavItems = [
  { id: 'home', label: 'בית', icon: LayoutDashboard },
  { id: 'aiDemo', label: 'הדגמת יכולות AI', icon: BrainCircuit },
  { id: 'roiCalculator', label: 'מחשבון חיסכון', icon: WalletCards },
  { id: 'roadmap', label: 'מפת אוטומציה', icon: Route },
  { id: 'methodology', label: 'מתודולוגיה', icon: BrainCircuit },
  { id: 'toolsLessons', label: 'תוצר, כלים ולקחים', icon: BookOpenCheck },
  { id: 'aboutProject', label: 'על הפרויקט', icon: FileSearch },
  { id: 'github', label: 'GitHub', icon: ExternalLink, href: 'https://github.com/idocarmi1/ai-business-automation-advisor' },
];

const initialAnswers = {
  businessType: '',
  employees: '',
  painPoints: [],
  currentTools: '',
  budget: '',
  skillLevel: '',
  channels: [],
  goal: '',
};

const painPointOptions = [
  ['customer-service', 'שירות לקוחות'],
  ['lead-management', 'ניהול לידים'],
  ['appointment-scheduling', 'תיאום פגישות'],
  ['email-whatsapp', 'מיילים ו-WhatsApp'],
  ['invoice-documents', 'חשבוניות ומסמכים'],
  ['social-media-content', 'תוכן לרשתות חברתיות'],
  ['task-management', 'ניהול משימות'],
  ['crm-workflows', 'תהליכי CRM'],
  ['internal-processes', 'תהליכים פנימיים'],
];

const channelOptions = [
  ['email', 'אימייל'],
  ['whatsapp', 'WhatsApp'],
  ['website', 'אתר'],
  ['crm', 'CRM'],
  ['calendar', 'יומן'],
  ['social-media', 'רשתות חברתיות'],
];

const plans = [
  {
    name: 'מסלול חינמי',
    price: '₪0',
    features: ['אבחון בסיסי', 'המלצה ראשונית', 'גישה להשוואת כלים'],
    button: 'שמירת התעניינות במסלול חינמי',
  },
  {
    name: 'מסלול עסקי',
    price: 'לפי צורך',
    features: ['מפת דרכים לאוטומציה', 'המלצות מתקדמות', 'תיעדוף תהליכים עסקיים'],
    button: 'בקשת מסלול עסקי',
    featured: true,
  },
  {
    name: 'מסלול ייעוץ',
    price: 'פגישה אישית',
    features: ['שיחת ייעוץ אישית', 'תכנון אוטומציה לעסק', 'ליווי ביישום'],
    button: 'בקשת שיחת ייעוץ',
  },
];

const eventTypeLabels = {
  'Sign Up': 'הרשמה',
  'Assessment Completed': 'שאלון הושלם',
  'Plan Interest': 'התעניינות במסלול',
  'Consultation Request': 'בקשת ייעוץ',
  'ROI Calculated': 'חישוב ROI',
  'Recommendation Saved': 'שמירת המלצה',
  'Roadmap Generated': 'יצירת מפת אוטומציה',
};

function App() {
  const [activePage, setActivePage] = useState(() => getPageFromHash());
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(() => getCurrentUser());
  const [selectedPlan, setSelectedPlan] = useState('');
  const [accessMessage, setAccessMessage] = useState('');
  const isAdmin = isAdminUser(user);

  useEffect(() => {
    if (activePage === 'admin' && !isAdmin) {
      setAccessMessage('אין לך הרשאה לצפות בעמוד ניהול הפניות.');
      const fallbackPage = user ? 'home' : 'login';
      setActivePage(fallbackPage);
      window.history.replaceState(null, '', `#${pageHashMap[fallbackPage]}`);
    }
  }, [activePage, isAdmin, user]);

  const goTo = (page, options = {}) => {
    if (page === 'admin' && !isAdmin) {
      setAccessMessage('אין לך הרשאה לצפות בעמוד ניהול הפניות.');
      page = user ? 'home' : 'login';
    } else {
      setAccessMessage('');
    }
    setActivePage(page);
    setMenuOpen(false);
    if (options.selectedPlan) setSelectedPlan(options.selectedPlan);
    const hash = pageHashMap[page];
    if (hash) window.history.replaceState(null, '', `#${hash}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const refreshUser = () => setUser(getCurrentUser());
  const handleLogout = () => {
    logoutDemoUser();
    setUser(null);
    goTo('home');
  };

  return (
    <div className="app-shell" dir="rtl">
      <Header
        activePage={activePage}
        goTo={goTo}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        user={user}
        isAdmin={isAdmin}
        onLogout={handleLogout}
      />
      {accessMessage && <div className="access-message">{accessMessage}</div>}
      <main>
        {activePage === 'home' && <HomePage goTo={goTo} />}
        {activePage === 'aiDemo' && <AIDemoPage />}
        {activePage === 'assessment' && <AssessmentPage user={user} goTo={goTo} />}
        {activePage === 'roiCalculator' && <ROICalculatorPage user={user} />}
        {activePage === 'roadmap' && <RoadmapPage user={user} goTo={goTo} />}
        {activePage === 'comparison' && <ToolsComparisonPage />}
        {activePage === 'library' && <UseCaseLibraryPage />}
        {activePage === 'plans' && <PlansPage user={user} goTo={goTo} />}
        {activePage === 'consultation' && <ConsultationPage user={user} selectedPlan={selectedPlan} />}
        {activePage === 'admin' && isAdmin && <AdminLeadsPage />}
        {activePage === 'methodology' && <MethodologyPage />}
        {activePage === 'toolsLessons' && <ToolsLessonsPage />}
        {activePage === 'aboutProject' && <AboutProjectPage />}
        {activePage === 'summary' && <AcademicSummaryPage />}
        {activePage === 'signup' && <SignUpPage goTo={goTo} onAuth={refreshUser} />}
        {activePage === 'login' && <LoginPage goTo={goTo} onAuth={refreshUser} initialMessage={accessMessage} />}
        {activePage === 'forgot' && <ForgotPasswordPage goTo={goTo} />}
        {activePage === 'dashboard' && <DashboardPage user={user} goTo={goTo} />}
      </main>
      <Footer />
    </div>
  );
}

function Header({ activePage, goTo, menuOpen, setMenuOpen, user, isAdmin, onLogout }) {
  const authItems = user
    ? [
        { id: 'dashboard', label: 'אזור אישי', icon: ShieldCheck },
        { id: 'logout', label: 'התנתקות', icon: LogOut },
      ]
    : [
        { id: 'login', label: 'התחברות', icon: LogIn },
        { id: 'signup', label: 'הרשמה', icon: UserPlus },
      ];

  const adminOnlyNavItems = ['admin', 'summary'];
  const visibleNavItems = baseNavItems.filter((item) => isAdmin || !adminOnlyNavItems.includes(item.id));

  return (
    <header className="site-header">
      <button className="brand" type="button" onClick={() => goTo('home')}>
        <span className="brand-mark">
          <img src="/images/autobiz-ai-advisor-logo.png" alt="AutoBiz AI Advisor" />
        </span>
        <span>
          <strong>יועץ אוטומציה עסקית</strong>
          <small>אבחון תהליכים ואוטומציה</small>
        </span>
      </button>
      <button className="menu-button" type="button" onClick={() => setMenuOpen(!menuOpen)} aria-label="פתיחת ניווט">
        {menuOpen ? <X size={22} /> : <Menu size={22} />}
      </button>
      <nav className={menuOpen ? 'nav open' : 'nav'}>
        {visibleNavItems.map((item) => {
          const Icon = item.icon;
          const isLogout = item.id === 'logout';
          if (item.href) {
            return (
              <a className="nav-link" key={item.id} href={item.href} target="_blank" rel="noopener noreferrer">
                <Icon size={16} />
                {item.label}
              </a>
            );
          }
          return (
            <button
              className={activePage === item.id ? 'nav-link active' : 'nav-link'}
              key={item.id}
              type="button"
              onClick={() => (isLogout ? onLogout() : goTo(item.id))}
            >
              <Icon size={16} />
              {item.label}
            </button>
          );
        })}
      </nav>
    </header>
  );
}

function HomePage({ goTo }) {
  const githubUrl = 'https://github.com/idocarmi1/ai-business-automation-advisor';
  const overviewCards = [
    ['הבעיה', 'עסקים קטנים ובינוניים מבזבזים זמן על משימות ידניות, מעקב אחרי לקוחות, דוחות והודעות שחוזרות על עצמן.'],
    ['הפתרון', 'AutoBiz מדמה שימוש ב-AI כדי לחקור תחום עסקי, לזהות כאבים תפעוליים ולהציע אוטומציות פרקטיות.'],
    ['התוצאה', 'תובנות ברורות, טבלת אוטומציות וציון כדאיות שמסייעים להבין איפה כדאי להתחיל.'],
  ];
  const previewSteps = [
    ['01', 'מגדירים תחום עסקי'],
    ['02', 'מדמים חקר שוק בעזרת AI'],
    ['03', 'מקבלים המלצות אוטומציה'],
  ];

  return (
    <section className="page home-page">
      <div className="hero compact-hero">
        <div className="hero-copy">
          <span className="eyebrow">דמו לאוטומציה עסקית</span>
          <h1>יועץ אוטומציה עסקית מבוסס AI</h1>
          <p>
            מערכת דמו שמראה כיצד ניתן להשתמש ב-AI כדי לחקור תחום עסקי, לזהות בעיות תפעוליות ולהציע אוטומציות מעשיות.
          </p>
          <div className="hero-actions">
            <button className="primary-button" type="button" onClick={() => goTo('aiDemo')}>
              צפה בהדגמת יכולות AI <ArrowLeft size={18} />
            </button>
            <button className="secondary-button" type="button" onClick={() => goTo('methodology')}>מתודולוגיה</button>
            <button className="secondary-button" type="button" onClick={() => goTo('toolsLessons')}>תוצר, כלים ולקחים</button>
            <a className="secondary-button" href={githubUrl} target="_blank" rel="noopener noreferrer">
              GitHub <ExternalLink size={17} />
            </a>
          </div>
        </div>
        <div className="hero-panel" aria-label="תקציר יכולות המערכת">
          <div className="workflow-card">
            <div className="workflow-header">
              <span>תצוגה מקדימה</span>
              <Badge label="דמו מבוסס AI" compact />
            </div>
            <strong>חקר שוק → כאבים עסקיים → אוטומציות</strong>
            <div className="workflow-line">
              <span>תחום עסקי</span>
              <span>תובנות AI</span>
              <span>תוכנית פעולה</span>
            </div>
          </div>
        </div>
      </div>

      <div className="presentation-card-grid home-overview-grid">
        {overviewCards.map(([title, text]) => (
          <article className="presentation-card" key={title}>
            <Badge label={title} compact />
            <h3>{title}</h3>
            <p>{text}</p>
          </article>
        ))}
      </div>

      <section className="process-section home-preview-section">
        <SectionIntro
          title="איך זה עובד בקצרה"
          text="העמוד הראשי נשאר ממוקד. ההסבר המלא, הטבלאות והדמו נמצאים בעמודים הייעודיים."
        />
        <div className="step-grid">
          {previewSteps.map(([number, title]) => (
            <article className="step-card" key={title}>
              <span>{number}</span>
              <h3>{title}</h3>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}

function AIDemoPage() {
  const automationTableRef = useRef(null);
  const [aiDemo, setAiDemo] = useState({
    businessField: 'מסעדה',
    businessSize: 'עסק קטן',
    businessGoal: 'חיסכון בזמן',
    runs: 1,
  });
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const researchFlow = ['חקר שוק', 'זיהוי כאבים עסקיים', 'מיפוי תהליכים ידניים', 'איתור אוטומציות', 'בניית תוכנית פעולה'];
  const automationOpportunities = [
    ['טיפול איטי בלידים', 'מעבר ידני על טפסים, הודעות WhatsApp ומיילים', 'סיווג ליד, שליחת הודעת המשך אוטומטית ועדכון CRM', ['Make', 'Zapier', 'HubSpot CRM', 'WhatsApp/Email Automation'], 'גבוהה', 'בינונית', 'חוסך זמן תגובה ומקטין אובדן לקוחות פוטנציאליים'],
    ['חוסר מעקב אחרי לקוחות', 'תזכורות ידניות ביומן, Excel או WhatsApp', 'תזכורות אוטומטיות לפי סטטוס לקוח ושלב בתהליך', ['Google Sheets', 'Airtable', 'Make', 'Zapier'], 'גבוהה', 'נמוכה', 'קל להתחיל, מתאים לעסק קטן, ונותן ערך מהיר'],
    ['דוחות ובקרה ידניים', 'איסוף נתונים ידני בסוף שבוע או חודש', 'Dashboard שמתעדכן אוטומטית ממקורות מידע שונים', ['Looker Studio', 'Google Sheets', 'Airtable', 'API Integration'], 'בינונית-גבוהה', 'בינונית', 'משפר קבלת החלטות ומציג תמונת מצב עסקית ברורה'],
    ['עומס בשירות לקוחות', 'מענה חוזר על שאלות דומות', 'FAQ Bot / Chatbot לשאלות נפוצות והפניית פניות מורכבות', ['AI Chatbot', 'Intercom', 'Tidio', 'Zendesk'], 'גבוהה', 'בינונית', 'מוריד עומס ומקצר זמני מענה'],
    ['תהליכי תפעול פנימיים', 'העברת משימות ידנית בין עובדים וכלים', 'Workflow אוטומטי בין טפסים, משימות, CRM ומיילים', ['n8n', 'Make', 'Zapier', 'Microsoft Power Automate'], 'גבוהה', 'בינונית-גבוהה', 'מתאים לעסק שרוצה לגדול ולחבר מערכות שונות'],
    ['ניהול פגישות ותורים', 'תיאום ידני, ביטולים והודעות חוזרות', 'תיאום תורים, תזכורות לפני פגישה ועדכון סטטוס לקוח', ['Calendly', 'Google Calendar', 'Make', 'WhatsApp/Email Automation'], 'גבוהה', 'נמוכה-בינונית', 'רלוונטי לקליניקות, יועצים, נותני שירות ועסקים מבוססי פגישות'],
    ['ניהול משימות וצוות', 'משימות מפוזרות בין WhatsApp, מיילים ושיחות', 'פתיחת משימה אוטומטית, שיוך אחראי ועדכון סטטוס', ['Monday.com', 'Trello', 'Asana', 'ClickUp', 'Make'], 'בינונית-גבוהה', 'בינונית', 'משפר סדר, אחריות ומעקב תפעולי'],
    ['סיכום פגישות ושיחות', 'סיכום ידני או איבוד מידע אחרי פגישה', 'תמלול, סיכום אוטומטי ושליחת משימות המשך', ['Fireflies.ai', 'Otter.ai', 'Notion AI', 'Google Docs'], 'בינונית', 'נמוכה', 'חוסך זמן ניהולי ומשמר ידע עסקי'],
  ];
  const toolReasonCards = [
    ['Make / Zapier', 'מתאימים לעסקים שרוצים לחבר מערכות במהירות ולבנות אוטומציות ללא קוד.'],
    ['n8n', 'מתאים יותר למשתמשים טכניים שרוצים שליטה גבוהה, גמישות וחיבורי API מורכבים.'],
    ['Microsoft Power Automate', 'מתאים לארגונים שכבר עובדים עם Microsoft 365 ורוצים אוטומציה עסקית ו-RPA.'],
    ['HubSpot / CRM', 'מתאים לניהול לידים, לקוחות, סטטוסים ותהליכי מכירה.'],
    ['Looker Studio / Sheets / Airtable', 'מתאים לדוחות, בקרה, מעקב נתונים ו-Dashboard עסקי.'],
  ];
  const automationScores = [
    ['הודעה אוטומטית לליד חדש', 'גבוהה', 'נמוכה', '92/100'],
    ['תזכורות ללקוחות', 'גבוהה', 'נמוכה', '88/100'],
    ['Dashboard חודשי', 'בינונית', 'בינונית', '74/100'],
    ['Chatbot שאלות נפוצות', 'גבוהה', 'בינונית', '81/100'],
  ];
  const marketResearch = useMemo(() => generateMarketResearchDemo(aiDemo), [aiDemo]);
  const modalBusinessField = aiDemo.businessField.trim() || 'קליניקה';

  const runAiDemo = () => {
    if (loading) return;
    setCopied(false);
    setLoading(true);
    window.setTimeout(() => {
      setAiDemo((current) => ({ ...current, runs: current.runs + 1 }));
      setLoading(false);
      setModalOpen(true);
    }, 1000);
  };
  const showAutomationTable = () => {
    setModalOpen(false);
    window.setTimeout(() => {
      automationTableRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      automationTableRef.current?.classList.add('table-highlight');
      window.setTimeout(() => automationTableRef.current?.classList.remove('table-highlight'), 1800);
    }, 120);
  };

  return (
    <section className="page">
      <SectionIntro
        title="הדגמת יכולות AI"
        text="כאן מוצג כיצד AutoBiz מדמה שימוש ב-AI כדי לבצע חקר שוק, לזהות כאבים עסקיים ולהפוך אותם להמלצות אוטומציה פרקטיות."
      />

      <section className="ai-demo-section">
        <div className="ai-demo-heading">
          <div>
            <span className="eyebrow">סימולציית מוצר</span>
            <h2>חקר שוק ואיתור אוטומציות בעזרת AI</h2>
            <p>הדמו ממחיש את לוגיקת המוצר: תחום עסקי נכנס, תובנות עסקיות יוצאות, והמערכת מציגה הזדמנויות אוטומציה.</p>
          </div>
          <span className="research-badge">Perplexity-style research demo</span>
        </div>

        <div className="ai-dashboard-grid">
          <div className="ai-input-panel">
            <label className="form-group compact-form-group">
              <span>תחום עסקי</span>
              <select
                value={aiDemo.businessField}
                onChange={(event) => setAiDemo({ ...aiDemo, businessField: event.target.value })}
              >
                {businessTypes.map((businessType) => <option key={businessType}>{businessType}</option>)}
              </select>
            </label>
            <div className="form-grid">
              <label className="form-group compact-form-group">
                <span>גודל העסק</span>
                <select value={aiDemo.businessSize} onChange={(event) => setAiDemo({ ...aiDemo, businessSize: event.target.value })}>
                  <option>עסק קטן</option>
                  <option>עסק בינוני</option>
                  <option>סטארטאפ</option>
                </select>
              </label>
              <label className="form-group compact-form-group">
                <span>מטרה מרכזית</span>
                <select value={aiDemo.businessGoal} onChange={(event) => setAiDemo({ ...aiDemo, businessGoal: event.target.value })}>
                  <option>חיסכון בזמן</option>
                  <option>שיפור שירות לקוחות</option>
                  <option>הגדלת מכירות</option>
                  <option>שיפור תפעול</option>
                </select>
              </label>
            </div>
            <button className="primary-button" type="button" onClick={runAiDemo} disabled={loading}>
              {loading ? 'מנתח בעזרת AI...' : 'הרץ ניתוח AI'}
            </button>
          </div>

          <div className="ai-output-panel">
            <div className="workflow-header">
              <span>תוצר לדוגמה מה-AI</span>
              <Badge label={`ניתוח דמו ${aiDemo.runs}`} compact />
            </div>
            <h3>{marketResearch.productTitle}</h3>
            <p>{marketResearch.explanation}</p>
            <div className="analysis-context-grid">
              {marketResearch.analysisContext.map(([label, value]) => (
                <span key={label}><strong>{label}</strong>{value}</span>
              ))}
            </div>
            <div className="ai-output-meta">
              <span>{marketResearch.businessType}</span>
              <span>{aiDemo.businessGoal}</span>
              <span>Frontend demo בלבד</span>
            </div>
          </div>
        </div>

        <div className="research-flow">
          {researchFlow.map((step, index) => (
            <div className="research-step" key={step}>
              <span>{index + 1}</span>
              <strong>{step}</strong>
            </div>
          ))}
        </div>

        <div className="market-insight-grid">
          {marketResearch.painPoints.map((insight) => (
            <article className="market-insight-card" key={insight}>
              <Sparkles size={20} />
              <h3>{insight}</h3>
            </article>
          ))}
        </div>

        <section className="dynamic-research-section">
          <div className="ai-demo-heading">
            <div>
              <span className="eyebrow">פלט חקר שוק מותאם</span>
              <h2>אוטומציות וכלים לפי {marketResearch.businessType}</h2>
              <p>{marketResearch.marketInsight}</p>
            </div>
            <span className="research-badge">Rule-Based, deterministic</span>
          </div>

          <div className="market-insight-grid automation-recommendation-grid">
            {marketResearch.recommendedAutomations.map((automation, index) => (
              <article className="market-insight-card" key={automation}>
                <span className="step-mini-number">{index + 1}</span>
                <h3>{automation}</h3>
              </article>
            ))}
          </div>

          <div className="first-step-card">
            <span className="eyebrow">צעד ראשון מומלץ</span>
            <h3>{marketResearch.firstStep}</h3>
          </div>

          <div className="ai-table-wrap">
            <table className="ai-opportunities-table business-tools-table">
              <thead>
                <tr>
                  <th>כלי</th>
                  <th>שימוש מומלץ</th>
                  <th>למה מתאים לעסק הזה</th>
                  <th>רמת מורכבות</th>
                  <th>קישור רשמי</th>
                </tr>
              </thead>
              <tbody>
                {marketResearch.tools.map((tool) => (
                  <tr key={tool.tool}>
                    <td><strong>{tool.tool}</strong></td>
                    <td>{tool.useCase}</td>
                    <td>{tool.fit}</td>
                    <td><Badge label={tool.complexity} compact /></td>
                    <td>
                      <div className="official-link-list">
                        {tool.links.map((link) => (
                          <a className="table-link" href={link.url} target="_blank" rel="noopener noreferrer" key={`${tool.tool}-${link.label}`}>
                            {link.label}
                          </a>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="future-note rule-based-note">{marketResearch.note}</p>
        </section>

        <section id="automation-table" ref={automationTableRef} className="automation-table-section">
          <div className="ai-demo-heading">
            <div>
              <span className="eyebrow">תוצר אחרי חקר שוק</span>
              <h2>טבלת אוטומציות מומלצות אחרי חקר שוק</h2>
              <p>הטבלה מציגה תהליכים עסקיים נפוצים, הצעת אוטומציה, כלים מתאימים, רמת השפעה ומורכבות יישום.</p>
            </div>
            <span className="research-badge">Market research → AI recommendation → Automation tools</span>
          </div>
          <div className="ai-table-wrap">
            <table className="ai-opportunities-table enhanced-opportunities-table">
              <thead>
                <tr>
                  <th>תהליך / בעיה עסקית</th>
                  <th>מה קורה היום</th>
                  <th>אוטומציה מומלצת</th>
                  <th>כלים מתאימים</th>
                  <th>השפעה</th>
                  <th>מורכבות</th>
                  <th>למה זה מתאים</th>
                </tr>
              </thead>
              <tbody>
                {automationOpportunities.map(([problem, currentState, automation, rowTools, impact, complexity, reason]) => (
                  <tr key={problem}>
                    <td><strong>{problem}</strong></td>
                    <td>{currentState}</td>
                    <td>{automation}</td>
                    <td>
                      <div className="table-tool-list">
                        {rowTools.map((tool) => <span className="tool-badge" key={tool}>{tool}</span>)}
                      </div>
                    </td>
                    <td><Badge label={impact} compact /></td>
                    <td><Badge label={complexity} compact /></td>
                    <td>{reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="tool-rationale-section">
          <SectionIntro
            title="למה בחרנו בכלים האלה?"
            text="חקר השוק הראה שרוב הערך העסקי מגיע מחיבור בין שלושה חלקים: איסוף מידע, קבלת החלטה אוטומטית, וביצוע פעולה בכלי עבודה קיים."
          />
          <div className="presentation-card-grid">
            {toolReasonCards.map(([title, text]) => (
              <article className="presentation-card" key={title}>
                <Badge label={title} compact />
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <div className="score-section">
          <div>
            <span className="eyebrow">תיעדוף יישום</span>
            <h2>ציון כדאיות לאוטומציה</h2>
            <p>הציון עוזר להבין באיזו אוטומציה כדאי להתחיל לפי שילוב של ערך עסקי, השפעה ומורכבות יישום.</p>
          </div>
          <div className="ai-table-wrap">
            <table className="automation-score-table">
              <thead>
                <tr>
                  <th>אוטומציה</th>
                  <th>השפעה</th>
                  <th>מורכבות</th>
                  <th>ציון</th>
                </tr>
              </thead>
              <tbody>
                {automationScores.map(([automation, impact, complexity, score]) => (
                  <tr key={automation}>
                    <td>{automation}</td>
                    <td><Badge label={impact} compact /></td>
                    <td><Badge label={complexity} compact /></td>
                    <td><span className="score-label">{score}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <p className="future-note">
          בדמו הנוכחי מדובר בסימולציה שמציגה את לוגיקת המוצר. בגרסה עתידית ניתן לחבר API של Perplexity או מודל AI אחר בצד שרת, כדי לייצר חקר שוק והמלצות בזמן אמת.
        </p>
      </section>
      {modalOpen && (
        <AIDemoRecommendationModal
          businessField={modalBusinessField}
          businessSize={aiDemo.businessSize}
          businessGoal={aiDemo.businessGoal}
          copied={copied}
          setCopied={setCopied}
          onClose={() => setModalOpen(false)}
          onShowTable={showAutomationTable}
        />
      )}
    </section>
  );
}

function AssessmentPage({ user, goTo }) {
  const [answers, setAnswers] = useState(initialAnswers);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const recommendation = useMemo(() => generateRecommendation(answers), [answers]);
  const roadmap = useMemo(() => generateAutomationRoadmap(answers, recommendation), [answers, recommendation]);

  const toggleArrayValue = (field, value) => {
    setAnswers((current) => {
      const exists = current[field].includes(value);
      return { ...current, [field]: exists ? current[field].filter((item) => item !== value) : [...current[field], value] };
    });
  };

  const submitAssessment = () => {
    const missing = !answers.businessType || !answers.employees || !answers.budget || !answers.skillLevel || !answers.goal
      || answers.painPoints.length === 0 || answers.channels.length === 0;
    if (missing) {
      setError('יש להשלים את השדות המרכזיים לפני קבלת ההמלצה.');
      return;
    }
    const saved = { answers, recommendation, createdAt: new Date().toISOString(), savedAt: new Date().toISOString() };
    saveAssessmentResult(saved, user);
    createLead({
      eventType: 'Assessment Completed',
      fullName: user?.fullName,
      email: user?.email,
      businessName: user?.businessName,
      assessment: answers,
      recommendation,
    });
    setError('');
    setModalOpen(true);
  };

  return (
    <section className="page content-page">
      <SectionIntro
        title="שאלון התאמה לאוטומציה"
        text="ענו על השאלות וקבלו המלצה ממוקדת. הלוגיקה מבוססת על כאבים עסקיים, ערוצים, תקציב, רמת ידע ומטרת האוטומציה."
      />
      <form className="assessment-form" onSubmit={(event) => event.preventDefault()}>
        <div className="form-grid">
          <FormGroup label="מה סוג העסק שלך?">
            <select value={answers.businessType} onChange={(event) => setAnswers({ ...answers, businessType: event.target.value })}>
              <option value="">בחרו סוג עסק</option>
              <option value="service">עסק שירות</option>
              <option value="retail">קמעונאות / חנות</option>
              <option value="clinic">קליניקה / תורים</option>
              <option value="agency">סוכנות / ייעוץ</option>
              <option value="ecommerce">מסחר אונליין</option>
              <option value="professional">משרד מקצועי</option>
            </select>
          </FormGroup>
          <FormGroup label="כמה עובדים יש בעסק?">
            <select value={answers.employees} onChange={(event) => setAnswers({ ...answers, employees: event.target.value })}>
              <option value="">בחרו טווח</option>
              <option value="1">1</option>
              <option value="2-10">2-10</option>
              <option value="11-30">11-30</option>
              <option value="31-plus">31+</option>
            </select>
          </FormGroup>
        </div>
        <FormGroup label="מהם האתגרים המרכזיים בעסק?">
          <ChipGroup options={painPointOptions} values={answers.painPoints} onToggle={(value) => toggleArrayValue('painPoints', value)} />
        </FormGroup>
        <FormGroup label="באילו כלים העסק משתמש כיום?">
          <input value={answers.currentTools} onChange={(event) => setAnswers({ ...answers, currentTools: event.target.value })} placeholder="לדוגמה: Gmail, Excel, WhatsApp, יומן, CRM" />
        </FormGroup>
        <div className="form-grid">
          <FormGroup label="מה התקציב החודשי המשוער?">
            <select value={answers.budget} onChange={(event) => setAnswers({ ...answers, budget: event.target.value })}>
              <option value="">בחרו תקציב</option>
              <option value="under-50">עד $50</option>
              <option value="50-200">$50-$200</option>
              <option value="200-500">$200-$500</option>
              <option value="500-plus">$500+</option>
            </select>
          </FormGroup>
          <FormGroup label="מה רמת הידע הטכני שלך?">
            <select value={answers.skillLevel} onChange={(event) => setAnswers({ ...answers, skillLevel: event.target.value })}>
              <option value="">בחרו רמה</option>
              <option value="beginner">מתחיל/ה</option>
              <option value="intermediate">בינוני/ת</option>
              <option value="advanced">מתקדם/ת</option>
            </select>
          </FormGroup>
        </div>
        <FormGroup label="אילו ערוצים רלוונטיים לעסק?">
          <ChipGroup options={channelOptions} values={answers.channels} onToggle={(value) => toggleArrayValue('channels', value)} />
        </FormGroup>
        <FormGroup label="מה המטרה המרכזית שלך באוטומציה?">
          <select value={answers.goal} onChange={(event) => setAnswers({ ...answers, goal: event.target.value })}>
            <option value="">בחרו מטרה</option>
            <option value="save-time">חיסכון בזמן</option>
            <option value="reduce-costs">הפחתת עלויות</option>
            <option value="improve-sales">שיפור מכירות</option>
            <option value="improve-service">שיפור שירות לקוחות</option>
            <option value="organize-data">ארגון מידע</option>
            <option value="improve-processes">שיפור תהליכים פנימיים</option>
          </select>
        </FormGroup>
        {error && <p className="form-error">{error}</p>}
        <div className="form-actions">
          <button className="primary-button" type="button" onClick={submitAssessment}>קבלו את ההמלצה</button>
        </div>
      </form>
      {modalOpen && <RecommendationModal answers={answers} recommendation={recommendation} roadmap={roadmap} user={user} goTo={goTo} onClose={() => setModalOpen(false)} />}
    </section>
  );
}

function RecommendationModal({ answers, recommendation, roadmap, user, goTo, onClose }) {
  const [showRoadmap, setShowRoadmap] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [roadmapMessage, setRoadmapMessage] = useState('');
  const [recommendationSaved, setRecommendationSaved] = useState(false);
  const [roadmapGenerated, setRoadmapGenerated] = useState(() => Boolean(readSavedAssessment(user)?.roadmap));

  const saveRecommendation = () => {
    const existing = readSavedAssessment(user);
    const saved = {
      answers,
      recommendation,
      roadmap: roadmapGenerated ? roadmap : existing?.roadmap || null,
      createdAt: new Date().toISOString(),
      savedAt: new Date().toISOString(),
    };
    saveAssessmentResult(saved, user);
    createLead({
      eventType: 'Recommendation Saved',
      fullName: user?.fullName,
      email: user?.email,
      businessName: user?.businessName,
      assessment: answers,
      recommendation,
      roadmap: saved.roadmap,
      readinessScore: saved.roadmap?.readinessScore,
      quickWin: saved.roadmap?.quickWin,
      roadmapSummary: saved.roadmap ? `${saved.roadmap.roadmapTitle}: ${saved.roadmap.steps.map((step) => step.title).join(' | ')}` : '',
    });
    setSaveMessage('ההמלצה נשמרה בהצלחה.');
    setRecommendationSaved(true);
  };

  const generateRoadmap = ({ navigate = false } = {}) => {
    const saved = {
      answers,
      recommendation,
      roadmap,
      createdAt: new Date().toISOString(),
      savedAt: new Date().toISOString(),
      roadmapGeneratedAt: new Date().toISOString(),
    };
    saveAssessmentResult(saved, user);
    createLead({
      eventType: 'Roadmap Generated',
      fullName: user?.fullName,
      email: user?.email,
      businessName: user?.businessName,
      assessment: answers,
      recommendation,
      roadmap,
      readinessScore: roadmap.readinessScore,
      quickWin: roadmap.quickWin,
      roadmapSummary: `${roadmap.roadmapTitle}: ${roadmap.steps.map((step) => step.title).join(' | ')}`,
    });
    setShowRoadmap(true);
    setRoadmapGenerated(true);
    setRoadmapMessage('מפת האוטומציה נוצרה בהצלחה.');
    if (navigate) {
      onClose();
      goTo('roadmap');
    }
  };

  const openRoadmapPage = () => {
    if (!roadmapGenerated) {
      generateRoadmap({ navigate: true });
      return;
    }
    onClose();
    goTo('roadmap');
  };

  const goToSavedArea = () => {
    onClose();
    goTo(user ? 'dashboard' : 'signup');
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="recommendation-modal">
        <button className="modal-close" type="button" onClick={onClose} aria-label="סגירת חלון"><X size={22} /></button>
        <span className="eyebrow">התוצאה נשמרה בדמו המקומי</span>
        <h2>ההמלצה שלך מוכנה</h2>
        <div className="modal-highlight">
          <strong>קטגוריית האוטומציה המומלצת</strong>
          <p>{recommendation.category}</p>
        </div>
        <div className="badge-row">
          <Badge label={`רמת מורכבות: ${recommendation.complexity}`} />
          <Badge label={`השפעה עסקית צפויה: ${recommendation.impact}`} />
        </div>
        <h3>כלים מומלצים</h3>
        <div className="modal-tool-grid">
          {recommendation.tools.map((tool) => (
            <div className="modal-tool-card" key={tool}>
              <strong className="ltr-text">{tool}</strong>
              <a href={toolLinks[tool]} target="_blank" rel="noopener noreferrer">
                לאתר הכלי <ExternalLink size={15} />
              </a>
            </div>
          ))}
        </div>
        <h3>למה הכלים מתאימים לעסק?</h3>
        <ul className="clean-list">
          {recommendation.why.map((reason) => <li key={reason}>{reason}</li>)}
        </ul>
        <InfoBlock label="צעד ראשון מומלץ" value={recommendation.firstStep} />
        <div className="roadmap-action-strip">
          <div>
            <strong>מחולל מפת אוטומציה לעסק</strong>
            <p>המערכת מתרגמת את ההמלצה לתוכנית פעולה הדרגתית עם ציון מוכנות, quick win ושלבי יישום. ניתן לעבור למפה המלאה מהכפתור הראשי בתחתית החלון.</p>
          </div>
        </div>
        {saveMessage && <p className="success-message modal-status-message">{saveMessage}</p>}
        {roadmapMessage && <p className="success-message modal-status-message">{roadmapMessage}</p>}
        {showRoadmap && (
          <>
            <RoadmapPanel roadmap={roadmap} />
            {!user && <p className="auth-note">כדי לשמור את מפת האוטומציה להמשך, ניתן ליצור חשבון חינמי.</p>}
          </>
        )}
        {!user && <p className="auth-note">כדי לשמור את ההמלצה באופן קבוע, ניתן ליצור חשבון חינמי.</p>}
        <div className="modal-actions">
          <button className="primary-button" type="button" onClick={openRoadmapPage}>מעבר למפת האוטומציה</button>
          <button className="secondary-button" type="button" onClick={saveRecommendation}>שמירת ההמלצה באזור האישי</button>
          {recommendationSaved && (
            <button className="secondary-button" type="button" onClick={goToSavedArea}>
              {user ? 'מעבר לאזור האישי' : 'יצירת חשבון לשמירת ההמלצה'}
            </button>
          )}
          <button className="secondary-button" type="button" onClick={() => { onClose(); goTo('consultation'); }}>בקשת ייעוץ</button>
          <a className="secondary-button" href={toolLinks[recommendation.tools[0]]} target="_blank" rel="noopener noreferrer">פתיחת כלי מומלץ</a>
        </div>
      </div>
    </div>
  );
}

function RoadmapPanel({ roadmap, compact = false }) {
  const [openStepIndex, setOpenStepIndex] = useState(null);
  if (!roadmap) return null;

  return (
    <section className={compact ? 'roadmap-panel compact' : 'roadmap-panel'}>
      <div className="roadmap-header">
        <div>
          <span className="eyebrow">מחולל מפת אוטומציה לעסק</span>
          <h3>{roadmap.roadmapTitle}</h3>
          <p>{roadmap.businessSummary}</p>
        </div>
        <div className="roadmap-score-ring" style={{ '--score': `${roadmap.readinessScore}%` }}>
          <strong>{roadmap.readinessScore}</strong>
          <span>ציון מוכנות לאוטומציה</span>
        </div>
      </div>

      <div className="roadmap-meta-grid">
        <InfoBlock label="רמת עדיפות" value={roadmap.priorityLevel} />
        <InfoBlock label="Quick win" value={roadmap.quickWin} />
        <InfoBlock label="שדרוג עתידי" value={roadmap.futureUpgrade} />
      </div>

      <div className="roadmap-step-grid">
        {roadmap.steps.map((step, index) => (
          <article className="roadmap-step-card" key={step.title}>
            <div className="roadmap-step-topline">
              <span>שלב {index + 1}</span>
              <div className="badge-row">
                <Badge label={`קושי: ${step.difficulty}`} compact />
                <Badge label={step.estimatedTime} compact />
              </div>
            </div>
            <h4>{step.title}</h4>
            <InfoBlock label="מטרה" value={step.goal} />
            <InfoBlock label="הסבר" value={step.explanation} />
            <InfoBlock label="תועלת צפויה" value={step.expectedBenefit} />
            <div className="tool-pill-list">
              {step.recommendedTools.map((tool) => <span className="ltr-text" key={tool}>{tool}</span>)}
            </div>
            <button
              className="secondary-button roadmap-guide-toggle"
              type="button"
              onClick={() => setOpenStepIndex(openStepIndex === index ? null : index)}
            >
              {openStepIndex === index ? 'סגירת מדריך ביצוע' : 'פתיחת מדריך ביצוע'}
            </button>
            {openStepIndex === index && <RoadmapImplementationGuide step={step} />}
          </article>
        ))}
      </div>
    </section>
  );
}

function RoadmapImplementationGuide({ step }) {
  return (
    <div className="roadmap-implementation-guide">
      <RoadmapGuideList title="Checklist התחלה" items={step.setupChecklist} />
      <RoadmapGuideList title="מה עושים בפועל" items={step.implementationSteps} ordered />
      <RoadmapGuideList title="מה צריך להכין" items={step.requiredData} />
      <RoadmapGuideList title="אילו מערכות מחברים" items={step.systemConnections} />
      <RoadmapGuideList title="פעולות שבעל העסק צריך לבצע" items={step.ownerActionItems} />
      <RoadmapGuideList title="מדד הצלחה" items={step.successMetric} />
      <RoadmapGuideList title="טעויות נפוצות" items={step.commonMistakes} />
      <InfoBlock label="למה הכלים האלו מתאימים לשלב הזה" value={step.suggestedToolsExplanation} />
    </div>
  );
}

function RoadmapGuideList({ title, items, ordered = false }) {
  const ListTag = ordered ? 'ol' : 'ul';
  return (
    <div className="roadmap-guide-block">
      <strong>{title}</strong>
      <ListTag>
        {items.map((item) => <li key={item}>{item}</li>)}
      </ListTag>
    </div>
  );
}

function AIDemoRecommendationModal({ businessField, businessSize, businessGoal, copied, setCopied, onClose, onShowTable }) {
  const recommendationMap = {
    'חיסכון בזמן': 'אוטומציה של מעקב אחרי לקוחות ותזכורות',
    'שיפור שירות לקוחות': 'מענה אוטומטי לשאלות נפוצות ותיעוד פניות',
    'הגדלת מכירות': 'סיווג לידים ושליחת הודעת המשך אוטומטית',
    'שיפור תפעול': 'Dashboard תפעולי ודוחות אוטומטיים',
  };
  const recommendation = recommendationMap[businessGoal] || 'אוטומציה של טיפול בלידים ומעקב לקוחות';
  const tools = ['Make', 'Zapier', 'Google Sheets', 'CRM', 'WhatsApp / Email Automation'];
  const nextSteps = [
    'למפות את התהליך הידני הקיים',
    'לבחור כלי אוטומציה מתאים',
    'לבנות תהליך ניסיון קטן ולמדוד תוצאה',
  ];
  const summary = `המלצת AI עבור ${businessField}: ${recommendation}. מטרה מרכזית: ${businessGoal}. ציון כדאיות: 92/100.`;

  const copyRecommendation = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(summary);
      }
      setCopied(true);
    } catch {
      setCopied(true);
    }
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="recommendation-modal ai-result-modal">
        <button className="modal-close" type="button" onClick={onClose} aria-label="סגירת חלון"><X size={22} /></button>
        <span className="eyebrow">תוצאת דמו</span>
        <h2>הניתוח הושלם בהצלחה</h2>
        <p className="modal-subtitle">
          AutoBiz ניתח את התחום העסקי שהוזן והחזיר המלצת אוטומציה ראשונית.
        </p>

        <div className="business-summary-grid">
          <InfoBlock label="תחום עסקי" value={businessField} />
          <InfoBlock label="גודל העסק" value={businessSize} />
          <InfoBlock label="מטרה מרכזית" value={businessGoal} />
        </div>

        <div className="modal-highlight ai-main-recommendation">
          <strong>האוטומציה המומלצת להתחלה</strong>
          <p>{recommendation}</p>
        </div>

        <InfoBlock
          label="למה זה מתאים?"
          value="המלצה זו מתאימה כי היא משלבת השפעה עסקית גבוהה עם מורכבות יישום יחסית נמוכה, ולכן מאפשרת להתחיל באוטומציה בצורה הדרגתית וברורה."
        />

        <div className="ai-score-card">
          <div>
            <span>ציון כדאיות</span>
            <strong>92/100</strong>
          </div>
          <div className="badge-row">
            <Badge label="השפעה: גבוהה" />
            <Badge label="מורכבות: נמוכה-בינונית" />
            <Badge label="זמן יישום משוער: קצר" />
          </div>
        </div>

        <h3>כלים מומלצים</h3>
        <div className="tool-pill-list">
          {tools.map((tool) => <span className="ltr-text" key={tool}>{tool}</span>)}
        </div>

        <h3>צעדים הבאים</h3>
        <ol className="next-step-list">
          {nextSteps.map((step) => <li key={step}>{step}</li>)}
        </ol>

        <p className="auth-note">
          זהו דמו Frontend שמציג כיצד המערכת יכולה להפוך חקר שוק ותובנות AI להמלצות אוטומציה מעשיות. בגרסה עתידית ניתן לחבר Perplexity API בצד שרת.
        </p>

        {copied && <p className="success-message">ההמלצה הועתקה</p>}
        <div className="modal-actions">
          <button className="secondary-button" type="button" onClick={onClose}>סגור</button>
          <button className="primary-button" type="button" onClick={copyRecommendation}>העתק המלצה</button>
          <button className="secondary-button" type="button" onClick={onShowTable}>ראה טבלת אוטומציות</button>
        </div>
      </div>
    </div>
  );
}

function ToolsComparisonPage() {
  const [query, setQuery] = useState('');
  const [ease, setEase] = useState('הכל');
  const filteredTools = tools.filter((tool) => {
    const matchesQuery = `${tool.name} ${tool.mainUseCase} ${tool.bestFor} ${tool.recommendedBusinessType}`.toLowerCase().includes(query.toLowerCase());
    const matchesEase = ease === 'הכל' || tool.easeOfUse === ease;
    return matchesQuery && matchesEase;
  });

  return (
    <section className="page">
      <SectionIntro title="השוואת כלי אוטומציה" text="השוואה ממוקדת לעסקים קטנים: שימוש מרכזי, התאמה, קלות שימוש, אינטגרציות, מחיר, יתרונות וחסרונות." />
      <div className="filter-bar">
        <label className="search-box"><Search size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="חיפוש כלי, שימוש או סוג עסק" /></label>
        <select value={ease} onChange={(event) => setEase(event.target.value)}>
          <option>הכל</option>
          <option>גבוהה</option>
          <option>בינונית</option>
          <option>נמוכה</option>
        </select>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>כלי</th><th>שימוש מרכזי</th><th>מתאים במיוחד ל</th><th>קלות שימוש</th><th>רמת אינטגרציה</th><th>רמת מחיר</th><th>יתרונות</th><th>חסרונות</th><th>סוג עסק מומלץ</th><th>קישור</th>
            </tr>
          </thead>
          <tbody>
            {filteredTools.map((tool) => (
              <tr key={tool.name}>
                <td><a className="table-link ltr-text" href={tool.url} target="_blank" rel="noopener noreferrer">{tool.name}</a></td>
                <td>{tool.mainUseCase}</td>
                <td>{tool.bestFor}</td>
                <td><Badge label={tool.easeOfUse} compact /></td>
                <td>{tool.integrationLevel}</td>
                <td>{tool.pricingLevel}</td>
                <td>{tool.advantages}</td>
                <td>{tool.disadvantages}</td>
                <td>{tool.recommendedBusinessType}</td>
                <td><a className="small-link-button" href={tool.url} target="_blank" rel="noopener noreferrer">לאתר הרשמי</a></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function UseCaseLibraryPage() {
  const [query, setQuery] = useState('');
  const [difficulty, setDifficulty] = useState('הכל');
  const filteredUseCases = useCases.filter((useCase) => {
    const matchesQuery = `${useCase.title} ${useCase.problem} ${useCase.solution} ${useCase.area} ${useCase.tools.join(' ')}`.toLowerCase().includes(query.toLowerCase());
    const matchesDifficulty = difficulty === 'הכל' || useCase.difficulty === difficulty;
    return matchesQuery && matchesDifficulty;
  });

  return (
    <section className="page">
      <SectionIntro title="ספריית מקרי שימוש" text="דוגמאות מעשיות לאוטומציות שעסקים קטנים יכולים להבין, לתעדף וליישם בהדרגה." />
      <div className="filter-bar">
        <label className="search-box"><Search size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="חיפוש לפי בעיה, כלי או תחום" /></label>
        <select value={difficulty} onChange={(event) => setDifficulty(event.target.value)}>
          <option>הכל</option><option>נמוכה</option><option>בינונית</option><option>גבוהה</option>
        </select>
      </div>
      <div className="usecase-grid">
        {filteredUseCases.map((useCase) => (
          <article className="usecase-card" key={useCase.title}>
            <div className="card-topline"><Badge label={useCase.area} /><Badge label={`רמת קושי: ${useCase.difficulty}`} /></div>
            <h3>{useCase.title}</h3>
            <InfoBlock label="הבעיה העסקית" value={useCase.problem} />
            <InfoBlock label="פתרון האוטומציה" value={useCase.solution} />
            <InfoBlock label="תועלת צפויה" value={useCase.benefit} />
            <div className="tool-pill-list">
              {useCase.tools.map((tool) => toolLinks[tool]
                ? <a key={tool} className="tool-pill-link ltr-text" href={toolLinks[tool]} target="_blank" rel="noopener noreferrer">{tool}</a>
                : <span className="ltr-text" key={tool}>{tool}</span>)}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function SignUpPage({ goTo, onAuth }) {
  const [form, setForm] = useState({ fullName: '', email: '', businessName: '', password: '' });
  const [message, setMessage] = useState('');
  const submit = async () => {
    if (!form.fullName || !form.email || !form.businessName || !form.password) {
      setMessage('יש למלא את כל השדות להרשמה.');
      return;
    }
    const createdAt = new Date().toISOString();
    signUpDemoUser(form);
    createLead({ eventType: 'Sign Up', ...form });
    try {
      await sendSignupNotification({
        fullName: form.fullName,
        email: form.email,
        businessName: form.businessName,
        createdAt,
        eventType: 'Sign Up',
      });
    } catch (error) {
      console.warn('User signed up, but email notification failed.', error);
    }
    onAuth();
    goTo('dashboard');
  };
  return <AuthForm title="הרשמה" form={form} setForm={setForm} message={message} submitLabel="יצירת חשבון חינמי" onSubmit={submit} goTo={goTo} showBusiness />;
}

function LoginPage({ goTo, onAuth, initialMessage = '' }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState(initialMessage);
  const submit = () => {
    const user = loginDemoUser(form.email, form.password);
    if (!user) {
      setMessage('פרטי ההתחברות אינם תואמים לחשבון הדמו השמור.');
      return;
    }
    onAuth();
    goTo('dashboard');
  };
  return <AuthForm title="התחברות" form={form} setForm={setForm} message={message} submitLabel="התחברות" onSubmit={submit} goTo={goTo} />;
}

function AuthForm({ title, form, setForm, message, submitLabel, onSubmit, goTo, showBusiness = false }) {
  return (
    <section className="page auth-page">
      <div className="auth-card">
        <span className="eyebrow">דמו אקדמי</span>
        <h2>{title}</h2>
        <p>המערכת משתמשת ב-localStorage לצורך הדגמה בלבד. אין להזין סיסמאות אמיתיות.</p>
        {showBusiness && <input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} placeholder="שם מלא" />}
        <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="אימייל" />
        {showBusiness && <input value={form.businessName} onChange={(e) => setForm({ ...form, businessName: e.target.value })} placeholder="שם העסק" />}
        <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="סיסמה" />
        {message && <p className="form-error">{message}</p>}
        <button className="primary-button" type="button" onClick={onSubmit}>{submitLabel}</button>
        {!showBusiness && <button className="link-button" type="button" onClick={() => goTo('forgot')}>שכחתי סיסמה</button>}
      </div>
    </section>
  );
}

function ForgotPasswordPage({ goTo }) {
  return (
    <section className="page auth-page">
      <div className="auth-card">
        <LockKeyhole size={28} />
        <h2>שכחתי סיסמה</h2>
        <p>זהו עמוד דמו לפרויקט אקדמי. בגרסה אמיתית תישלח הודעת איפוס מאובטחת דרך שרת.</p>
        <button className="secondary-button" type="button" onClick={() => goTo('login')}>חזרה להתחברות</button>
      </div>
    </section>
  );
}

function DashboardPage({ user, goTo }) {
  const saved = readSavedAssessment(user);
  const savedRoi = readSavedROI();
  const savedRoadmap = saved?.roadmap || null;
  if (!user) {
    return (
      <section className="page auth-page">
        <div className="auth-card">
          <h2>האזור האישי דורש התחברות</h2>
          <p>צרו חשבון דמו או התחברו כדי לראות המלצות שמורות.</p>
          <button className="primary-button" type="button" onClick={() => goTo('login')}>התחברות</button>
        </div>
      </section>
    );
  }
  return (
    <section className="page content-page">
      <SectionIntro title={`ברוך הבא, ${user.fullName}`} text={`שם העסק: ${user.businessName}`} />
      {saved ? (
        <div className="dashboard-grid">
          <article className="summary-item wide saved-recommendation-card">
            <span className="eyebrow">ההמלצה השמורה שלך</span>
            <h3>קטגוריית האוטומציה המומלצת</h3>
            <p>{saved.recommendation.category}</p>
            <div className="badge-row">
              <Badge label={`רמת מורכבות: ${saved.recommendation.complexity}`} />
              <Badge label={`השפעה עסקית צפויה: ${saved.recommendation.impact}`} />
              {saved.createdAt && <Badge label={`תאריך יצירה: ${new Date(saved.createdAt).toLocaleDateString('he-IL')}`} />}
            </div>
            <InfoBlock label="צעד ראשון מומלץ" value={saved.recommendation.firstStep} />
            <div className="form-actions">
              <button className="secondary-button" type="button" onClick={() => goTo('roadmap')}>פתיחת מפת האוטומציה</button>
              <button className="primary-button" type="button" onClick={() => goTo('consultation')}>בקשת ייעוץ</button>
              <button className="secondary-button" type="button" onClick={() => goTo('assessment')}>עדכון המלצה דרך שאלון חדש</button>
            </div>
          </article>
          <article className="summary-item">
            <h3>כלים מומלצים</h3>
            <div className="tool-pill-list">{saved.recommendation.tools.map((tool) => <span className="ltr-text" key={tool}>{tool}</span>)}</div>
          </article>
          <article className="summary-item">
            <h3>כלי החלטה נוספים</h3>
            <p>ניתן לפתוח את מפת האוטומציה או להעריך חיסכון כספי בעזרת מחשבון החיסכון.</p>
            <button className="secondary-button" type="button" onClick={() => goTo('roiCalculator')}>מעבר למחשבון חיסכון</button>
          </article>
          <section className="summary-item wide saved-roadmap-card">
            <span className="eyebrow">מפת האוטומציה שלך</span>
            {savedRoadmap ? (
              <>
                <div className="dashboard-roadmap-summary">
                  <InfoBlock label="ציון מוכנות לאוטומציה" value={`${savedRoadmap.readinessScore}/100`} />
                  <InfoBlock label="רמת עדיפות" value={savedRoadmap.priorityLevel} />
                  <InfoBlock label="Quick Win" value={savedRoadmap.quickWin} />
                </div>
                <div className="dashboard-next-step-card">
                  <span className="eyebrow">הצעד הבא שלך</span>
                  <h3>להתחיל ממיפוי תהליך ידני אחד</h3>
                  <p>{savedRoadmap.steps?.[0]?.implementationSteps?.[0] || savedRoadmap.quickWin}</p>
                  <button className="primary-button" type="button" onClick={() => goTo('roadmap')}>פתיחת מדריך הביצוע</button>
                </div>
              </>
            ) : (
              <div className="dashboard-empty-roadmap">
                <h3>עדיין לא נוצרה מפת אוטומציה.</h3>
                <p>מלאו את שאלון ההתאמה ולחצו על יצירת מפת אוטומציה לעסק.</p>
                <button className="primary-button" type="button" onClick={() => goTo('assessment')}>מעבר לשאלון התאמה</button>
              </div>
            )}
          </section>
          {savedRoadmap && <RoadmapPanel roadmap={savedRoadmap} compact />}
          {savedRoi?.result && <ROIResultCard result={savedRoi.result} compact />}
        </div>
      ) : (
        <article className="summary-item">
          <p>עדיין לא שמרת המלצה. מלא את שאלון ההתאמה כדי לקבל המלצה מותאמת.</p>
          <div className="form-actions">
            <button className="primary-button" type="button" onClick={() => goTo('assessment')}>מעבר לשאלון</button>
            <button className="secondary-button" type="button" onClick={() => goTo('roiCalculator')}>מחשבון חיסכון</button>
          </div>
        </article>
      )}
    </section>
  );
}

function ROICalculatorPage({ user }) {
  const resultRef = useRef(null);
  const saved = readSavedAssessment(user);
  const savedRoadmap = saved?.roadmap || null;
  const savedRoi = readSavedROI();
  const [inputs, setInputs] = useState(() => buildInitialRoiInputs(saved, savedRoadmap));
  const [result, setResult] = useState(savedRoi?.result || null);

  const calculate = () => {
    const roi = calculateAutomationROI(inputs, saved?.recommendation, savedRoadmap);
    const savedResult = {
      inputs,
      result: roi,
      recommendation: saved?.recommendation || null,
      roadmap: savedRoadmap || null,
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem(roiStorageKey, JSON.stringify(savedResult));
    createLead({
      eventType: 'ROI Calculated',
      fullName: user?.fullName,
      email: user?.email,
      businessName: user?.businessName,
      roi,
      monthlyHoursSaved: roi.monthlyHoursSaved,
      monthlyMoneySaved: roi.monthlyMoneySaved,
      yearlyMoneySaved: roi.yearlyMoneySaved,
      roiLevel: roi.roiLevel,
      recommendedFirstAutomation: roi.recommendedFirstAutomation,
    });
    setResult(roi);
    window.setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
  };

  return (
    <section className="page content-page">
      <SectionIntro
        title="מחשבון חיסכון מאוטומציה"
        text="מחשבון זה מעריך כמה זמן וכסף העסק יכול לחסוך באמצעות אוטומציה של תהליכים ידניים. החישוב מבוסס על נתוני העסק שהוזנו ומהווה הערכה ראשונית לקבלת החלטה."
      />

      <section className="roi-calculator-section">
        <div className="roi-form-panel">
          <div className="form-grid">
            <FormGroup label="כמה שעות בשבוע מתבזבזות על משימות ידניות?">
              <input type="number" min="0" value={inputs.weeklyManualHours} onChange={(event) => setInputs({ ...inputs, weeklyManualHours: event.target.value })} />
            </FormGroup>
            <FormGroup label="כמה עובדים מעורבים בתהליך?">
              <input type="number" min="1" value={inputs.employeesInvolved} onChange={(event) => setInputs({ ...inputs, employeesInvolved: event.target.value })} />
            </FormGroup>
          </div>
          <div className="form-grid">
            <FormGroup label="מה העלות הממוצעת לשעת עבודה?">
              <input type="number" min="0" value={inputs.hourlyCost} onChange={(event) => setInputs({ ...inputs, hourlyCost: event.target.value })} />
            </FormGroup>
            <FormGroup label="כמה פניות / לקוחות נכנסים בחודש?">
              <input type="number" min="0" value={inputs.monthlyLeads} onChange={(event) => setInputs({ ...inputs, monthlyLeads: event.target.value })} />
            </FormGroup>
          </div>
          <FormGroup label="מה התהליך הידני המרכזי?">
            <input value={inputs.mainManualProcess} onChange={(event) => setInputs({ ...inputs, mainManualProcess: event.target.value })} placeholder="לדוגמה: מעקב לקוחות, ניהול לידים, דוחות חודשיים" />
          </FormGroup>
          <FormGroup label="מה תחום האוטומציה שהכי חשוב לעסק?">
            <select value={inputs.automationPriority} onChange={(event) => setInputs({ ...inputs, automationPriority: event.target.value })}>
              <option>נמוכה</option>
              <option>בינונית</option>
              <option>גבוהה</option>
            </select>
          </FormGroup>
          <div className="form-actions">
            <button className="primary-button roi-calculate-button" type="button" onClick={calculate}>
              <BarChart3 size={19} />
              חשב חיסכון משוער
            </button>
          </div>
        </div>

        <div className="roi-preview-panel">
          <span className="eyebrow">ערך עסקי משוער</span>
          <h3>מה תקבלו מהחישוב?</h3>
          <p>המחשבון מציג הערכה עסקית פשוטה וברורה כדי להבין אם כדאי להתחיל באוטומציה כבר עכשיו.</p>
          <ul className="roi-benefit-list">
            <li>חיסכון חודשי בשעות</li>
            <li>חיסכון כספי חודשי</li>
            <li>חיסכון שנתי משוער</li>
            <li>רמת כדאיות</li>
            <li>תהליך ראשון מומלץ לאוטומציה</li>
          </ul>
          {saved?.recommendation && <Badge label={`מבוסס על ההמלצה האחרונה: ${saved.recommendation.category}`} />}
          {savedRoadmap && <Badge label={`עדיפות מהמפה: ${savedRoadmap.priorityLevel}`} />}
        </div>
      </section>

      {result && <div ref={resultRef} className="roi-result-anchor"><ROIResultCard result={result} /></div>}
    </section>
  );
}

function ROIResultCard({ result, compact = false }) {
  return (
    <section className={compact ? 'roi-result-card compact' : 'roi-result-card'}>
      <div className="roi-result-header">
        <div>
          <span className="eyebrow">תוצאת מחשבון חיסכון</span>
          <h3>תוצאות החיסכון המשוערות</h3>
        </div>
        <Badge label={`רמת כדאיות: ${result.roiLevel}`} />
      </div>
      <div className="roi-metric-grid">
        <article className="roi-metric">
          <span>חיסכון חודשי בשעות</span>
          <strong>{result.monthlyHoursSaved}</strong>
          <small>שעות בחודש</small>
        </article>
        <article className="roi-metric">
          <span>חיסכון חודשי בכסף</span>
          <strong>₪{result.monthlyMoneySaved.toLocaleString('he-IL')}</strong>
          <small>הערכה חודשית</small>
        </article>
        <article className="roi-metric">
          <span>חיסכון שנתי משוער</span>
          <strong>₪{result.yearlyMoneySaved.toLocaleString('he-IL')}</strong>
          <small>12 חודשים</small>
        </article>
      </div>
      <div className="roi-result-details">
        <InfoBlock label="החזר משוער" value={result.paybackEstimate} />
        <InfoBlock label="תהליך ראשון מומלץ לאוטומציה" value={result.recommendedFirstAutomation} />
        <InfoBlock label="הסבר" value={result.explanation} />
      </div>
      <p className="demo-note">החישוב הוא הערכה ראשונית ואינו מהווה ייעוץ פיננסי.</p>
    </section>
  );
}

function RoadmapPage({ user, goTo }) {
  const saved = readSavedAssessment(user);
  const roadmap = saved?.roadmap || null;

  return (
    <section className="page content-page">
      <SectionIntro
        title="מפת אוטומציה"
        text="מחולל מפת האוטומציה מתרגם את תשובות העסק לתוכנית פעולה בשלושה שלבים: התחלה מהירה, חיבור מערכות, ושיפור מתקדם בעזרת AI ודוחות."
      />

      {roadmap ? (
        <>
          <section className="roadmap-start-section">
            <span className="eyebrow">איך מתחילים ליישם?</span>
            <h3>מתקדמים בשלבים ולא מחברים הכול בבת אחת</h3>
            <p>
              מפת האוטומציה בנויה כך שהעסק לא יתחיל מכל הכלים בבת אחת, אלא יתקדם בשלבים: קודם פעולה פשוטה ומהירה, אחר כך חיבור בין מערכות, ובסוף שימוש מתקדם יותר ב-AI ודוחות. כך ניתן לבדוק ערך עסקי לפני השקעה גדולה.
            </p>
          </section>
          <section className="roadmap-page-intro">
            <div>
              <span className="eyebrow">מערכת תומכת החלטה</span>
              <h3>מפת פעולה מוכנה לפי השאלון האחרון</h3>
              <p>
                המפה מציגה ציון מוכנות, רמת עדיפות, Quick Win ושלושה שלבי יישום כדי לעזור לבעל העסק להבין איפה להתחיל ומה לחבר בהמשך.
              </p>
            </div>
            <button className="secondary-button" type="button" onClick={() => goTo('assessment')}>עדכון שאלון התאמה</button>
          </section>
          <RoadmapPanel roadmap={roadmap} />
          <RoadmapSevenDayPlan plan={roadmap.firstSevenDaysPlan} />
          <RoadmapStarterRecipe recipe={roadmap.starterRecipe} />
        </>
      ) : (
        <section className="roadmap-empty-state">
          <Route size={34} />
          <h3>עדיין אין מפת אוטומציה לעסק</h3>
          <p>כדי ליצור מפת אוטומציה, מלאו קודם את שאלון ההתאמה וקבלו המלצה.</p>
          <button className="primary-button" type="button" onClick={() => goTo('assessment')}>מעבר לשאלון התאמה</button>
        </section>
      )}
    </section>
  );
}

function RoadmapSevenDayPlan({ plan }) {
  if (!plan?.length) return null;
  return (
    <section className="roadmap-action-plan-section">
      <span className="eyebrow">תוכנית פעולה ל-7 ימים ראשונים</span>
      <h3>מה עושים בשבוע הראשון?</h3>
      <div className="seven-day-grid">
        {plan.map((item) => (
          <article className="seven-day-card" key={item.day}>
            <Badge label={item.day} compact />
            <p>{item.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function RoadmapStarterRecipe({ recipe }) {
  if (!recipe) return null;
  return (
    <section className="starter-recipe-section">
      <span className="eyebrow">מתכון אוטומציה ראשוני</span>
      <h3>{recipe.title}</h3>
      <div className="starter-recipe-grid">
        <InfoBlock label="Trigger" value={recipe.trigger} />
        <div className="recipe-actions-card">
          <strong>פעולות</strong>
          <ol>
            {recipe.actions.map((action) => <li key={action}>{action}</li>)}
          </ol>
        </div>
        <InfoBlock label="Result" value={recipe.result} />
      </div>
    </section>
  );
}

function PlansPage({ user, goTo }) {
  const handlePlan = (planName) => {
    createLead({
      eventType: 'Plan Interest',
      selectedPlan: planName,
      fullName: user?.fullName,
      email: user?.email,
      businessName: user?.businessName,
    });
    if (!user) goTo('consultation', { selectedPlan: planName });
    else goTo('consultation', { selectedPlan: planName });
  };

  return (
    <section className="page">
      <SectionIntro title="מסלולים" text="מסלולי דמו עסקיים. אין כאן סליקה אמיתית או תשלום בפועל." />
      <div className="plans-grid">
        {plans.map((plan) => (
          <article className={plan.featured ? 'plan-card featured' : 'plan-card'} key={plan.name}>
            <h3>{plan.name}</h3>
            <strong className="plan-price">{plan.price}</strong>
            <ul className="clean-list">{plan.features.map((feature) => <li key={feature}>{feature}</li>)}</ul>
            <button className="primary-button" type="button" onClick={() => handlePlan(plan.name)}>{plan.button}</button>
          </article>
        ))}
      </div>
    </section>
  );
}

function ConsultationPage({ user, selectedPlan }) {
  const [form, setForm] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: '',
    businessName: user?.businessName || '',
    businessType: '',
    need: '',
    selectedPlan: selectedPlan || '',
    message: '',
  });
  const [status, setStatus] = useState('');

  const submit = () => {
    if (!form.fullName || !form.email || !form.phone || !form.businessName || !form.need) {
      setStatus('יש למלא את שדות החובה לפני שליחת הבקשה.');
      return;
    }
    createLead({ eventType: 'Consultation Request', ...form });
    setStatus('תודה! הבקשה נשמרה. בגרסה עסקית מלאה הפנייה תישלח לצוות הפרויקט.');
  };

  return (
    <section className="page content-page">
      <SectionIntro title="בקשת ייעוץ" text="השאירו פרטים לצורך הדגמת יצירת פנייה ושמירתה במערכת ניהול הפניות המקומית." />
      <div className="consultation-form">
        <input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} placeholder="שם מלא" />
        <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="אימייל" />
        <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="מספר טלפון" />
        <input value={form.businessName} onChange={(e) => setForm({ ...form, businessName: e.target.value })} placeholder="שם העסק" />
        <input value={form.businessType} onChange={(e) => setForm({ ...form, businessType: e.target.value })} placeholder="סוג העסק" />
        <select value={form.selectedPlan} onChange={(e) => setForm({ ...form, selectedPlan: e.target.value })}>
          <option value="">מסלול נבחר</option>
          <option>מסלול חינמי</option><option>מסלול עסקי</option><option>מסלול ייעוץ</option>
        </select>
        <textarea value={form.need} onChange={(e) => setForm({ ...form, need: e.target.value })} placeholder="הצורך המרכזי באוטומציה" />
        <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="הודעה חופשית" />
        {status && <p className={status.startsWith('תודה') ? 'success-message' : 'form-error'}>{status}</p>}
        <button className="primary-button" type="button" onClick={submit}>שליחת בקשה</button>
      </div>
    </section>
  );
}

function AdminLeadsPage() {
  const [leads, setLeads] = useState(() => getLeads());
  const [filter, setFilter] = useState('הכל');
  const eventTypes = ['הכל', ...Array.from(new Set(leads.map((lead) => lead.eventType)))];
  const visible = filter === 'הכל' ? leads : leads.filter((lead) => lead.eventType === filter);

  const downloadCsv = () => {
    const blob = new Blob([exportLeadsToCsv()], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'autobiz-leads.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  const clearDemo = () => {
    clearLeads();
    setLeads([]);
  };

  return (
    <section className="page">
      <SectionIntro title="ניהול פניות" text="עמוד ניהול דמו: הפניות נשמרות מקומית בדפדפן לצורך הפרויקט האקדמי בלבד." />
      <div className="admin-toolbar">
        <Badge label={`סה״כ פניות: ${leads.length}`} />
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>{eventTypes.map((type) => <option value={type} key={type}>{type === 'הכל' ? type : eventTypeLabels[type] || type}</option>)}</select>
        <button className="secondary-button" type="button" onClick={downloadCsv}><Download size={17} /> ייצוא לקובץ CSV</button>
        <button className="secondary-button" type="button" onClick={clearDemo}>ניקוי פניות דמו</button>
      </div>
      <p className="demo-note">עמוד ניהול דמו: הפניות נשמרות מקומית בדפדפן לצורך הפרויקט האקדמי בלבד.</p>
      <div className="lead-grid">
        {visible.map((lead) => (
          <article className="lead-card" key={lead.id}>
            <Badge label={eventTypeLabels[lead.eventType] || lead.eventType} />
            <h3>{lead.fullName || 'ללא שם'}</h3>
            <p className="ltr-text">{lead.email || 'ללא אימייל'}</p>
            <p>שם העסק: {lead.businessName || 'לא צוין'}</p>
            <p>מסלול נבחר: {lead.selectedPlan || 'לא צוין'}</p>
            {lead.recommendation?.category && <p>קטגוריית המלצה: {lead.recommendation.category}</p>}
            {lead.recommendation?.tools?.length > 0 && <p>כלים מומלצים: {lead.recommendation.tools.join(', ')}</p>}
            {lead.readinessScore && <p>ציון מוכנות לאוטומציה: {lead.readinessScore}/100</p>}
            {lead.quickWin && <p>Quick win: {lead.quickWin}</p>}
            {lead.roadmapSummary && <p>סיכום מפת אוטומציה: {lead.roadmapSummary}</p>}
            {lead.monthlyHoursSaved && <p>חיסכון חודשי בשעות: {lead.monthlyHoursSaved}</p>}
            {lead.monthlyMoneySaved && <p>חיסכון חודשי בכסף: ₪{Number(lead.monthlyMoneySaved).toLocaleString('he-IL')}</p>}
            {lead.yearlyMoneySaved && <p>חיסכון שנתי משוער: ₪{Number(lead.yearlyMoneySaved).toLocaleString('he-IL')}</p>}
            {lead.roiLevel && <p>רמת כדאיות: {lead.roiLevel}</p>}
            {lead.recommendedFirstAutomation && <p>אוטומציה ראשונה מומלצת: {lead.recommendedFirstAutomation}</p>}
            <p>תאריך יצירה: {new Date(lead.createdAt).toLocaleString('he-IL')}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function MethodologyPage() {
  const methodologyCards = [
    ['שלב 1: הגדרת הבעיה העסקית', 'הגדרנו בעיה של עסקים קטנים ובינוניים: עומס תפעולי, משימות ידניות, חוסר מעקב אחרי לקוחות וקושי להבין איפה כדאי להתחיל אוטומציה.'],
    ['שלב 2: חקר שוק בעזרת Perplexity', 'Perplexity שימש כהשראה וככלי חקר שוק: ניסוח שאלות מחקר, בדיקת בעיות נפוצות בתחומים עסקיים, הבנת צרכים של בעלי עסקים והשוואת כיווני פתרון אפשריים.'],
    ['שלב 3: תרגום התובנות לאוטומציות', 'הפכנו את התובנות העסקיות לטבלת המלצות: בעיה עסקית, תהליך ידני כיום, אוטומציה מוצעת, כלי אפשרי, השפעה ומורכבות.'],
    ['שלב 4: מחולל מפת אוטומציה לעסק', 'הוספנו מנגנון Rule-based שמתרגם תשובות מהשאלון והמלצה עסקית לשלושה שלבי יישום, ציון מוכנות, quick win ושדרוג עתידי. זה הופך את הדמו למערכת תומכת החלטה ולא רק למסך המלצה.'],
    ['שלב 5: מחשבון חיסכון מאוטומציה', 'הוספנו חישוב Rule-based שמעריך חיסכון חודשי ושנתי בשעות ובכסף. כך בעל העסק רואה לא רק איזו אוטומציה לבצע, אלא גם מה הערך העסקי המשוער שלה.'],
    ['שלב 6: בניית הדמו בעזרת Codex', 'Codex שימש לבניית האתר, שיפור הקומפוננטות, עיצוב UI/UX, תיקון שגיאות, בדיקת Build ושיפור מבנה הפרויקט.'],
    ['שלב 7: בדיקה ושיפור', 'בדקנו שהאתר מציג בעיה, פתרון, הדגמת יכולת, כלים ולקחים בצורה ברורה כדי שהמרצה והמשתמש יבינו את הערך של המערכת.'],
  ];
  const perplexityBullets = [
    'חקר שוק ראשוני לפי תחום עסקי.',
    'זיהוי בעיות נפוצות שחוזרות על עצמן.',
    'השוואת פתרונות אפשריים לאוטומציה.',
    'סיוע בניסוח שאלות מחקר מדויקות.',
    'השראה ללוגיקת הדמו שמציגה תובנות והמלצות.',
  ];

  return (
    <section className="page content-page">
      <SectionIntro
        title="מתודולוגיית העבודה"
        text="הפרויקט נבנה בתהליך עבודה שמשלב חשיבה עסקית, חקר שוק, תכנון מוצר ופיתוח Frontend. השימוש בכלי AI לא היה רק לכתיבת טקסט, אלא כחלק מתהליך הבנה, תכנון, בדיקה ושיפור."
      />
      <div className="method-grid">
        {methodologyCards.map(([title, text]) => (
          <article className="method-card" key={title}>
            <h3>{title}</h3>
            <p>{text}</p>
          </article>
        ))}
      </div>
      <section className="research-example-panel">
        <div>
          <span className="eyebrow">דוגמת שאלת מחקר</span>
          <h2>איך Perplexity בא לידי ביטוי?</h2>
        </div>
        <div className="research-query-box">
          מהן הבעיות הנפוצות בעסקי קליניקות קטנות, ואילו תהליכים ניתן לאוטומט?
        </div>
        <p>
          בעזרת Perplexity ניתן לקבל תמונה ראשונית של השוק, לזהות כאבים שחוזרים על עצמם, להבין אילו תהליכים מבזבזים זמן, ולתרגם את המידע להזדמנויות אוטומציה.
        </p>
        <div className="ai-explanation-grid">
          {perplexityBullets.map((item) => (
            <article className="ai-explanation-card" key={item}>
              <Search size={21} />
              <p>{item}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="classroom-section">
        <span className="eyebrow">תמיכה בקבלת החלטות</span>
        <h2>למה מחולל מפת האוטומציה מוסיף ערך?</h2>
        <p>
          מחולל מפת האוטומציה משתמש בלוגיקה מבוססת כללים כדי לתרגם כאבים עסקיים, רמת ידע, תקציב, כלים קיימים ומטרת העסק לתוכנית פעולה הדרגתית. עבור עסקים קטנים זה חשוב כי במקום לקבל רק המלצה כללית, בעל העסק רואה איפה להתחיל, מה לחבר בהמשך, ואיך להשתמש ב-AI ודוחות לקבלת החלטות טובה יותר.
        </p>
        <p>
          בגרסה עתידית ניתן לשדרג את המנגנון בעזרת מודל AI אמיתי או בסיס נתונים של תהליכים עסקיים, כך שהמפה תתעדכן לפי נתוני שימוש, ביצועים ומשוב לקוחות.
        </p>
        <p>
          מחשבון החיסכון מוסיף שכבת ערך עסקי נוספת: הוא מעריך כמה שעות וכסף ניתן לחסוך, ולכן עוזר לתעדף אוטומציות לפי השפעה כלכלית ולא רק לפי נוחות טכנית.
        </p>
        <p>
          יחד, מחולל מפת האוטומציה ומחשבון החיסכון הופכים את האתר ממסך דמו סטטי למערכת תומכת החלטה שמייצרת תוצרים עסקיים: תוכנית פעולה, ציון מוכנות, הערכת חיסכון ותעדוף יישום.
        </p>
        <p>
          הוספנו למפת האוטומציה מדריך תפעול ראשוני שמראה לבעל העסק מה לבצע בפועל: אילו נתונים להכין, אילו מערכות לחבר, באיזה סדר לפעול, ואיך למדוד הצלחה. כך המערכת מייצרת תוצר יישומי ולא רק המלצה כללית.
        </p>
        <p>
          בנוסף, ההמלצה ומפת האוטומציה נשמרות באזור האישי בעזרת localStorage, כך שהמשתמש יכול לחזור אליהן בהמשך דרך Dashboard. זה מדגים תוצר תומך החלטה מתמשך ולא רק חלון תוצאה זמני.
        </p>
      </section>
    </section>
  );
}

function ToolsLessonsPage() {
  const toolCards = [
    ['ChatGPT / Gemini', 'שימשו לחשיבה, ניסוח, יצירת רעיונות, שיפור תוכן ובדיקת כיווני פתרון.'],
    ['Perplexity', 'שימש לחקר שוק, הבנת בעיות עסקיות, ניסוח שאלות מחקר וזיהוי תהליכים שאפשר לאוטומט.'],
    ['Codex', 'שימש לפיתוח האתר, שיפור React/CSS, תיקון שגיאות ובדיקת מבנה הפרויקט.'],
    ['React + Vite', 'שימשו לבניית ממשק Frontend מהיר ורספונסיבי.'],
    ['GitHub + Vercel', 'שימשו לניהול גרסאות ופריסת האתר ל-Production.'],
  ];
  const lessons = [
    'AI נותן ערך רק כאשר מחברים אותו לבעיה עסקית ברורה.',
    'חשוב להציג תובנות בצורה פשוטה: טבלה, ציון, השפעה ומורכבות.',
    'Perplexity מתאים לחקר שוק ראשוני, אך עדיין נדרשת בדיקה אנושית.',
    'Codex מזרז פיתוח, אבל חייבים לבדוק Build, Git ופריסה.',
    'דמו טוב צריך להראות לא רק עיצוב, אלא תהליך חשיבה ויכולת.',
  ];

  return (
    <section className="page">
      <SectionIntro title="תוצר, כלים ולקחים" text="עמוד שמרכז את מה שנבנה, אילו כלים שימשו בתהליך ומהם הלקחים המרכזיים מהפרויקט." />
      <section className="classroom-section">
        <h2>תוצר</h2>
        <p>
          אתר דמו המציג מערכת לניתוח עסקי ואיתור אוטומציות בעזרת AI. המשתמש רואה כיצד תחום עסקי יכול להפוך לתובנות, טבלת אוטומציות וציון כדאיות.
        </p>
      </section>
      <section className="classroom-section">
        <h2>כלים</h2>
        <div className="presentation-card-grid">
          {toolCards.map(([title, text]) => (
            <article className="presentation-card" key={title}>
              <Badge label={title} compact />
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="classroom-section">
        <h2>לקחים</h2>
        <div className="market-insight-grid">
          {lessons.map((lesson) => (
            <article className="market-insight-card" key={lesson}>
              <CheckCircle2 size={20} />
              <h3>{lesson}</h3>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}

function AboutProjectPage() {
  const blocks = [
    ['מה הפרויקט פותר', 'הפרויקט עוזר להסביר איך עסק יכול לזהות תהליכים ידניים, להבין איפה הזמן מתבזבז, ולבחור אוטומציות ראשונות בעלות ערך גבוה.'],
    ['מה מדומה כרגע', 'חקר השוק, ניתוח הבעיות, טבלת האוטומציות וציון הכדאיות מוצגים כדמו Frontend שממחיש את לוגיקת המוצר.'],
    ['מה יכול להיות אמיתי בעתיד', 'בגרסה עתידית ניתן לחבר API של Perplexity או מודל AI אחר בצד שרת, לחבר CRM/Google Sheets/Make/Zapier, ולייצר המלצות דינמיות לפי תחום עסקי אמיתי.'],
    ['למה זה שימושי לבעלי עסקים', 'בעלי עסקים מקבלים תמונה פשוטה וברורה: איזו בעיה קיימת, איזו אוטומציה מתאימה, באיזה כלי אפשר להשתמש ומה רמת הכדאיות.'],
  ];

  return (
    <section className="page content-page">
      <SectionIntro
        title="על הפרויקט"
        text="AutoBiz הוא דמו למערכת ייעוץ אוטומציה עסקית מבוססת AI. המערכת מציגה כיצד ניתן לקחת תחום עסקי, לבצע חקר שוק ראשוני, לזהות בעיות תפעוליות ולהפוך אותן לטבלת אוטומציות עם השפעה, מורכבות וציון כדאיות."
      />
      <div className="method-grid">
        {blocks.map(([title, text]) => (
          <article className="method-card" key={title}>
            <h3>{title}</h3>
            <p>{text}</p>
          </article>
        ))}
      </div>
      <p className="future-note">
        בגרסה עתידית ניתן לחבר API של Perplexity או מודל AI אחר בצד שרת, לחבר CRM/Google Sheets/Make/Zapier, ולייצר המלצות דינמיות לפי תחום עסקי אמיתי.
      </p>
    </section>
  );
}

function AcademicSummaryPage() {
  const sections = [
    ['איך הגענו לרעיון?', 'זיהינו שעסקים קטנים רוצים להשתמש באוטומציות AI אך מתקשים לבחור כלים בגלל עומס אפשרויות, מחירים ורמות מורכבות.'],
    ['אילו כלים בחנו?', 'בחננו כלי אוטומציה, CRM, כלי AI לכתיבה וסיכום, וכלים משרדיים כמו Google Workspace ו-Microsoft Power Automate.'],
    ['באילו כלים השתמשנו בסוף ולמה?', 'Codex שימש לבנייה ושיפור הקוד. ChatGPT / Gemini שימשו למחקר, ניסוח, מקרי שימוש וחשיבה על קריטריונים.'],
    ['פרומפטים משמעותיים', 'פרומפטים שביקשו אתר React + Vite, RTL בעברית, שאלון התאמה, המלצה במודל Popout, מערכת פניות ודמו אקדמי.'],
    ['פידבק שקיבלנו ממשתמשים', 'מומלץ לבדוק האם השאלון ברור, האם ההמלצה מרגישה מעשית, והאם טבלת הכלים עוזרת לקבל החלטה.'],
    ['שיפורים בעקבות פידבק', 'ניתן להוסיף ענפים עסקיים, משקולות ניקוד, מחירים עדכניים, דוח PDF ושפה נוספת.'],
    ['מה היה טוב בתהליך?', 'הדרישות המפורטות עזרו להפוך רעיון מופשט למוצר שניתן להציג בכיתה.'],
    ['מה ניתן היה לשפר?', 'בגרסה הבאה כדאי לשלב נתוני שוק אמיתיים, שרת, אימיילים, ושמירת משתמשים מאובטחת.'],
    ['מחולל מפת אוטומציה לעסק', 'הפיצ׳ר החדש מדגים מערכת תומכת החלטה: הוא לוקח תשובות מהשאלון, מחשב ציון מוכנות לאוטומציה, ומציג תוכנית בשלושה שלבים עם כלים, תועלת, קושי וזמן משוער.'],
    ['מדריך תפעול למפת האוטומציה', 'המפה אינה רק המלצה אסטרטגית. היא כוללת מדריך ביצוע: מה לעשות בפועל, אילו נתונים להכין, אילו מערכות לחבר, טעויות נפוצות ומדדי הצלחה.'],
    ['מחשבון חיסכון מאוטומציה', 'המחשבון מדגים כיצד ניתן לתרגם תהליכים ידניים לערך עסקי מדיד: שעות שנחסכות, חיסכון כספי חודשי ושנתי, רמת כדאיות ותהליך ראשון מומלץ לאוטומציה.'],
    ['מערכת תומכת החלטה', 'שילוב ההמלצה, מפת האוטומציה ומחשבון החיסכון הופך את הפרויקט מממשק תצוגה בלבד לכלי שמפיק תוצרים עסקיים שימושיים לבעל עסק קטן.'],
    ['שמירת תוצרים באזור האישי', 'המשתמש יכול לשמור את ההמלצה ואת מפת האוטומציה ולחזור אליהן דרך Dashboard. כך התוצאה אינה זמנית בלבד אלא נשמרת כתוצר החלטה להמשך עבודה.'],
    ['לקחים אישיים וקבוצתיים', 'AI מקצר תהליכים אך אינו מחליף חשיבה ביקורתית, בדיקות איכות והבנת הערך העסקי.'],
    ['שימוש בכלי AI בכתיבת המסמך', 'ניתן להשתמש בתוכן העמודים כבסיס למסמך DOCX, אך יש לערוך, לאמת ולהוסיף רפלקציה אישית.'],
  ];
  return (
    <section className="page content-page">
      <SectionIntro title="סיכום אקדמי" text="תוכן מובנה שיכול לשמש בסיס לכתיבת מסמך הסיכום הסופי של הפרויקט." />
      <div className="summary-list">{sections.map(([title, text]) => <article className="summary-item" key={title}><h3>{title}</h3><p>{text}</p></article>)}</div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div>
        <strong>יועץ אוטומציה עסקית מבוסס AI</strong>
        <p>פרויקט תיק עבודות לניתוח תהליכים עסקיים, זיהוי הזדמנויות אוטומציה והצגת המלצות מעשיות.</p>
      </div>
      <a href="https://github.com/idocarmi1/ai-business-automation-advisor" target="_blank" rel="noopener noreferrer">
        מאגר הפרויקט ב-GitHub <ExternalLink size={16} />
      </a>
    </footer>
  );
}

function SectionIntro({ title, text }) {
  return <div className="section-intro"><span className="eyebrow">אוטומציה עסקית מבוססת AI</span><h2>{title}</h2><p>{text}</p></div>;
}

function FormGroup({ label, children }) {
  return <label className="form-group"><span>{label}</span>{children}</label>;
}

function ChipGroup({ options, values, onToggle }) {
  return <div className="chip-group">{options.map(([value, label]) => <button className={values.includes(value) ? 'chip selected' : 'chip'} key={value} type="button" onClick={() => onToggle(value)}>{label}</button>)}</div>;
}

function Badge({ label, compact = false }) {
  return <span className={compact ? 'badge compact' : 'badge'}>{label}</span>;
}

function InfoBlock({ label, value }) {
  return <div className="info-block"><strong>{label}</strong><p>{value}</p></div>;
}

function MethodCard({ title, items }) {
  return <article className="method-card"><h3>{title}</h3><ul className="clean-list">{items.map((item) => <li key={item}>{item}</li>)}</ul></article>;
}

function saveAssessmentResult(record, user) {
  const normalized = {
    ...record,
    createdAt: record.createdAt || new Date().toISOString(),
    savedAt: record.savedAt || new Date().toISOString(),
  };
  localStorage.setItem(assessmentStorageKey, JSON.stringify(normalized));
  localStorage.setItem(userAssessmentStorageKey(user), JSON.stringify(normalized));
  if (!user) localStorage.setItem(guestAssessmentStorageKey, JSON.stringify(normalized));
  return normalized;
}

function readSavedAssessment(user) {
  try {
    const userRecord = user ? JSON.parse(localStorage.getItem(userAssessmentStorageKey(user))) : null;
    if (userRecord) return userRecord;
    const latestRecord = JSON.parse(localStorage.getItem(assessmentStorageKey));
    if (latestRecord) return latestRecord;
    return JSON.parse(localStorage.getItem(guestAssessmentStorageKey));
  } catch {
    return null;
  }
}

function userAssessmentStorageKey(user) {
  return user?.email ? `autobiz_assessment_${user.email.toLowerCase()}` : guestAssessmentStorageKey;
}

function readSavedROI() {
  try {
    return JSON.parse(localStorage.getItem(roiStorageKey));
  } catch {
    return null;
  }
}

function buildInitialRoiInputs(savedAssessment, roadmap) {
  const answers = savedAssessment?.answers;
  const recommendation = savedAssessment?.recommendation;
  return {
    weeklyManualHours: answers ? Math.max(4, (answers.painPoints?.length || 1) * 3) : 8,
    employeesInvolved: estimateEmployeesInvolved(answers?.employees),
    hourlyCost: 85,
    monthlyLeads: estimateMonthlyLeads(answers),
    mainManualProcess: recommendation?.category || firstSelectedLabel(painPointOptions, answers?.painPoints?.[0]) || 'מעקב לקוחות',
    automationPriority: roadmap?.priorityLevel || 'בינונית',
  };
}

function estimateEmployeesInvolved(employees) {
  if (employees === '1') return 1;
  if (employees === '2-10') return 2;
  if (employees === '11-30') return 5;
  if (employees === '31-plus') return 8;
  return 2;
}

function estimateMonthlyLeads(answers) {
  if (!answers) return 40;
  if (answers.businessType === 'ecommerce') return 180;
  if (answers.businessType === 'clinic') return 80;
  if (answers.goal === 'improve-sales') return 100;
  return 55;
}

function firstSelectedLabel(options, value) {
  return options.find(([optionValue]) => optionValue === value)?.[1] || '';
}

function getPageFromHash() {
  if (typeof window === 'undefined') return 'home';
  return hashPageMap[window.location.hash] || 'home';
}

export default App;
