import { useEffect, useMemo, useState } from 'react';
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

const assessmentStorageKey = 'autobiz_last_assessment';

const hashPageMap = {
  '#home': 'home',
  '#assessment': 'assessment',
  '#tools': 'comparison',
  '#comparison': 'comparison',
  '#use-cases': 'library',
  '#plans': 'plans',
  '#consultation': 'consultation',
  '#admin-leads': 'admin',
  '#admin': 'admin',
  '#methodology': 'methodology',
  '#summary': 'summary',
  '#signup': 'signup',
  '#login': 'login',
  '#dashboard': 'dashboard',
};

const pageHashMap = {
  home: 'home',
  assessment: 'assessment',
  comparison: 'tools',
  library: 'use-cases',
  plans: 'plans',
  consultation: 'consultation',
  admin: 'admin-leads',
  methodology: 'methodology',
  summary: 'summary',
  signup: 'signup',
  login: 'login',
  dashboard: 'dashboard',
};

const baseNavItems = [
  { id: 'home', label: 'דף הבית', icon: LayoutDashboard },
  { id: 'assessment', label: 'שאלון התאמה', icon: ClipboardList },
  { id: 'comparison', label: 'השוואת כלים', icon: Table2 },
  { id: 'library', label: 'מקרי שימוש', icon: BookOpenCheck },
  { id: 'plans', label: 'מסלולים', icon: WalletCards },
  { id: 'consultation', label: 'בקשת ייעוץ', icon: Send },
  { id: 'admin', label: 'ניהול פניות', icon: Users },
  { id: 'methodology', label: 'מתודולוגיה', icon: BrainCircuit },
  { id: 'summary', label: 'סיכום אקדמי', icon: GraduationCap },
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
        {activePage === 'assessment' && <AssessmentPage user={user} goTo={goTo} />}
        {activePage === 'comparison' && <ToolsComparisonPage />}
        {activePage === 'library' && <UseCaseLibraryPage />}
        {activePage === 'plans' && <PlansPage user={user} goTo={goTo} />}
        {activePage === 'consultation' && <ConsultationPage user={user} selectedPlan={selectedPlan} />}
        {activePage === 'admin' && isAdmin && <AdminLeadsPage />}
        {activePage === 'methodology' && <MethodologyPage />}
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

  const adminOnlyNavItems = ['admin', 'methodology', 'summary'];
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
        {[...visibleNavItems, ...authItems].map((item) => {
          const Icon = item.icon;
          const isLogout = item.id === 'logout';
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
  const features = [
    ['ניתוח תהליכי עבודה', 'פירוק תהליך עסקי לשלבים ברורים, נקודות החלטה, בעלי אחריות ותלות בין כלים.', FileSearch],
    ['זיהוי הזדמנויות אוטומציה', 'איתור משימות חוזרות, כפילויות, צווארי בקבוק ונקודות שבהן אוטומציה יכולה לחסוך זמן.', Sparkles],
    ['מיפוי תהליכים עסקיים', 'הצגת זרימת העבודה בצורה מסודרת כדי להבין איפה הנתונים עוברים ואיפה הם נתקעים.', Route],
    ['המלצות מבוססות AI', 'הצעת כיווני פעולה וכלים רלוונטיים בהתאם לסוג העסק, הערוצים והיעדים התפעוליים.', BrainCircuit],
    ['שיפור יעילות תפעולית', 'מיקוד בתהליכים שמפחיתים עומס ידני, טעויות, מעקבים חוזרים ועבודה אדמיניסטרטיבית.', BarChart3],
    ['הפקת תובנות מעשיות', 'תרגום האבחון לצעד ראשון ברור, מדיד וניתן ליישום בעסק אמיתי.', CheckCircle2],
  ];
  const steps = [
    ['01', 'מתארים את התהליך העסקי', 'מזינים את סוג העסק, הערוצים, האתגרים והיעד המרכזי לשיפור.'],
    ['02', 'המערכת מזהה משימות חוזרות וצווארי בקבוק', 'הלוגיקה מנתחת כאבים תפעוליים, כפילויות ומקומות שבהם העבודה נשארת ידנית מדי.'],
    ['03', 'מקבלים המלצות אוטומציה פרקטיות', 'הפלט כולל קטגוריית אוטומציה, כלים מומלצים וצעד ראשון ליישום.'],
  ];
  const examples = [
    'מעקב אחר לקוחות ופניות',
    'ניהול לידים',
    'דוחות ובקרה',
    'אוטומציה של מיילים ומשימות',
    'תהליכי תפעול פנימיים',
    'שיפור תהליכי שירות',
  ];
  const portfolioItems = ['React', 'Vite', 'חשיבה מוצרית', 'ניתוח עסקי בעזרת AI', 'אוטומציית תהליכי עבודה', 'עיצוב Frontend', 'אסטרטגיית אוטומציה מעשית'];

  return (
    <section className="page">
      <div className="hero">
        <div className="hero-copy">
          <span className="eyebrow">אבחון תהליכים ואוטומציה עסקית</span>
          <h1>יועץ אוטומציה עסקית מבוסס AI</h1>
          <p>
            ניתוח תהליכים עסקיים, זיהוי צווארי בקבוק והצעת הזדמנויות אוטומציה מעשיות בעזרת חשיבה מבוססת AI.
          </p>
          <div className="hero-actions">
            <button className="primary-button" type="button" onClick={() => goTo('assessment')}>
              התחל ניתוח <ArrowLeft size={18} />
            </button>
            <a className="secondary-button" href={githubUrl} target="_blank" rel="noopener noreferrer">
              צפה ב-GitHub <ExternalLink size={17} />
            </a>
          </div>
        </div>
        <div className="hero-panel" aria-label="תצוגת ניתוח תהליך אוטומציה">
          <div className="workflow-card">
            <div className="workflow-header">
              <span>תוצאת ניתוח לדוגמה</span>
              <Badge label="השפעה גבוהה" compact />
            </div>
            <strong>תהליך לידים ופניות לקוחות</strong>
            <div className="workflow-line">
              <span>פנייה נכנסת</span>
              <span>סיווג AI</span>
              <span>שיוך ל-CRM</span>
              <span>מעקב אוטומטי</span>
            </div>
          </div>
          <div className="insight-stack">
            <div className="mini-metric"><CheckCircle2 size={20} /><span>צוואר בקבוק: מענה ראשוני ידני</span></div>
            <div className="mini-metric"><Network size={20} /><span>ערוצים: אתר, אימייל ו-WhatsApp</span></div>
            <div className="mini-metric"><ShieldCheck size={20} /><span>צעד מומלץ: חיבור טופס ל-CRM</span></div>
          </div>
        </div>
      </div>

      <div className="split-section">
        <article className="statement-card">
          <span className="eyebrow">הבעיה</span>
          <h2>הבעיה בעסקים רבים</h2>
          <p>
            עסקים רבים מבזבזים זמן יקר על משימות ידניות שחוזרות על עצמן, תהליכים לא ברורים, מעקבים ידניים וחוסר סדר בין כלים שונים.
            התוצאה היא עומס תפעולי, טעויות, ועיכוב בקבלת החלטות.
          </p>
        </article>
        <article className="statement-card accent">
          <span className="eyebrow">הפתרון</span>
          <h2>הפתרון</h2>
          <p>
            המערכת מאפשרת לתאר תהליך עסקי קיים, לנתח אותו בצורה מובנית, לזהות נקודות לשיפור ולהציע המלצות אוטומציה פרקטיות שניתן ליישם בעסק.
          </p>
        </article>
      </div>

      <SectionIntro
        title="יכולות מרכזיות"
        text="המערכת מתמקדת בהבנת העבודה בפועל: איפה הזמן נאבד, אילו פעולות חוזרות על עצמן, ומה ניתן לשפר בלי להעמיס על העסק."
      />
      <div className="area-grid feature-grid">
        {features.map(([title, description, Icon]) => (
          <article className="area-card" key={title}>
            <Icon size={24} />
            <h3>{title}</h3>
            <p>{description}</p>
          </article>
        ))}
      </div>

      <section className="process-section">
        <SectionIntro
          title="איך זה עובד"
          text="תהליך קצר שמתרגם תיאור עסקי להמלצה מסודרת, עם דגש על יישום מדורג ותועלת תפעולית."
        />
        <div className="step-grid">
          {steps.map(([number, title, text]) => (
            <article className="step-card" key={title}>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <SectionIntro
        title="דוגמאות לשימוש"
        text="מקרי שימוש נפוצים שבהם עסקים יכולים להתחיל באוטומציה ממוקדת, למדוד שיפור ולהרחיב בהדרגה."
      />
      <div className="usecase-strip">
        {examples.map((example) => (
          <div className="usecase-pill" key={example}>
            <BriefcaseBusiness size={18} />
            <span>{example}</span>
          </div>
        ))}
      </div>

      <section className="portfolio-section">
        <div>
          <span className="eyebrow">תיק עבודות</span>
          <h2>על הפרויקט</h2>
          <p>
            הפרויקט נבנה כתיק עבודות המציג חשיבה מוצרית, עיצוב Frontend, ניתוח תהליכים עסקיים ושימוש ב-AI לצורך זיהוי הזדמנויות אוטומציה.
          </p>
        </div>
        <div className="portfolio-list">
          {portfolioItems.map((item) => <span key={item}>{item}</span>)}
        </div>
      </section>
    </section>
  );
}

function AssessmentPage({ user, goTo }) {
  const [answers, setAnswers] = useState(initialAnswers);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const recommendation = useMemo(() => generateRecommendation(answers), [answers]);

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
    const saved = { answers, recommendation, createdAt: new Date().toISOString() };
    localStorage.setItem(assessmentStorageKey, JSON.stringify(saved));
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
      {modalOpen && <RecommendationModal recommendation={recommendation} user={user} goTo={goTo} onClose={() => setModalOpen(false)} />}
    </section>
  );
}

function RecommendationModal({ recommendation, user, goTo, onClose }) {
  const saveAndGoDashboard = () => {
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
        {!user && <p className="auth-note">כדי לשמור את ההמלצה להמשך, ניתן ליצור חשבון חינמי.</p>}
        <div className="modal-actions">
          <button className="secondary-button" type="button" onClick={saveAndGoDashboard}>שמירת ההמלצה באזור האישי</button>
          <button className="primary-button" type="button" onClick={() => { onClose(); goTo('consultation'); }}>בקשת ייעוץ</button>
          <a className="secondary-button" href={toolLinks[recommendation.tools[0]]} target="_blank" rel="noopener noreferrer">פתיחת כלי מומלץ</a>
          {!user && <button className="secondary-button" type="button" onClick={() => { onClose(); goTo('signup'); }}>יצירת חשבון חינמי</button>}
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
  const saved = readSavedAssessment();
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
          <article className="summary-item">
            <h3>תוצאת השאלון האחרונה</h3>
            <p>{saved.recommendation.category}</p>
            <div className="badge-row"><Badge label={`מורכבות: ${saved.recommendation.complexity}`} /><Badge label={`השפעה: ${saved.recommendation.impact}`} /></div>
          </article>
          <article className="summary-item">
            <h3>כלים מומלצים</h3>
            <div className="tool-pill-list">{saved.recommendation.tools.map((tool) => <span className="ltr-text" key={tool}>{tool}</span>)}</div>
          </article>
          <article className="summary-item wide">
            <h3>הצעדים הבאים</h3>
            <p>{saved.recommendation.firstStep}</p>
            <button className="primary-button" type="button" onClick={() => goTo('consultation')}>בקשת ייעוץ לאוטומציה</button>
          </article>
        </div>
      ) : (
        <article className="summary-item">
          <p>עדיין לא שמרת המלצה. מלא את שאלון ההתאמה כדי לקבל המלצה מותאמת.</p>
          <button className="primary-button" type="button" onClick={() => goTo('assessment')}>מעבר לשאלון</button>
        </article>
      )}
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
            <p>תאריך יצירה: {new Date(lead.createdAt).toLocaleString('he-IL')}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function MethodologyPage() {
  return (
    <section className="page content-page">
      <SectionIntro title="מתודולוגיית שימוש ב-AI" text="תיעוד שימוש משמעותי בכלי AI בפרויקט, כולל בדיקות איכות, שיפור פרומפטים ותובנות." />
      <div className="method-grid">
        <MethodCard title="איך השתמשנו ב-Codex" items={['תכנון מבנה הקוד', 'בניית האתר', 'יצירת קומפוננטות', 'שיפור UI/UX', 'תיקון שגיאות', 'שיפור מבנה הפרויקט']} />
        <MethodCard title="איך השתמשנו ב-ChatGPT / Gemini" items={['מחקר שוק', 'הגדרת קריטריונים להשוואה', 'יצירת מקרי שימוש עסקיים', 'שיפור לוגיקת ההמלצה', 'ניסוח תוכן', 'הכנה למסמך הסיכום']} />
      </div>
      <div className="insight-band">
        <InfoBlock label="מה עבד טוב" value="כאשר הדרישות היו ברורות, כלי ה-AI עזרו להפוך רעיון למוצר עובד במהירות." />
        <InfoBlock label="מה לא עבד בהתחלה" value="פרומפטים כלליים יצרו תוכן גנרי מדי. התוצאה השתפרה אחרי הגדרת קהל יעד, עמודים וקריטריונים." />
        <InfoBlock label="איך שיפרנו פרומפטים" value="הוספנו דרישות מדויקות, שמות כלים, מגבלות אקדמיות, לוגיקה מוסברת ודרישות בדיקה." />
        <InfoBlock label="בדיקת איכות" value="בדקנו ניווט, טפסים, מודל המלצה, קישורים רשמיים, שמירת פניות, ויכולת הצגה בכיתה." />
      </div>
      <div className="method-grid">
        <MethodCard title="יתרונות וחסרונות של כלי AI" items={['יתרון: האצה משמעותית של תכנון ופיתוח.', 'יתרון: עזרה בניסוח עסקי ובהשוואת חלופות.', 'חיסרון: נדרשת בדיקה אנושית של הנחות עסקיות.', 'חיסרון: אסור להכניס מפתחות API או סיסמאות לקוד frontend.']} />
        <MethodCard title="המלצות לסטודנט חדש" items={['להגדיר בעיה עסקית לפני שמבקשים קוד.', 'לבקש לוגיקה שקל להסביר.', 'לבדוק כל פיצ׳ר שנוצר.', 'לתעד פרומפטים ותובנות לתוצר הסופי.']} />
      </div>
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

function readSavedAssessment() {
  try {
    return JSON.parse(localStorage.getItem(assessmentStorageKey));
  } catch {
    return null;
  }
}

function getPageFromHash() {
  if (typeof window === 'undefined') return 'home';
  return hashPageMap[window.location.hash] || 'home';
}

export default App;
