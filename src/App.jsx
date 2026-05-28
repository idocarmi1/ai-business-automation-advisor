import { useMemo, useState } from 'react';
import {
  ArrowRight,
  BarChart3,
  BookOpenCheck,
  BrainCircuit,
  CheckCircle2,
  ClipboardList,
  GraduationCap,
  LayoutDashboard,
  Menu,
  Search,
  SlidersHorizontal,
  Sparkles,
  Table2,
  X,
} from 'lucide-react';
import { automationAreas } from './data/automationAreas.js';
import { tools } from './data/tools.js';
import { useCases } from './data/useCases.js';
import { generateRecommendation } from './utils/recommendation.js';

const navItems = [
  { id: 'home', label: 'Home', icon: LayoutDashboard },
  { id: 'assessment', label: 'Assessment', icon: ClipboardList },
  { id: 'comparison', label: 'Tools', icon: Table2 },
  { id: 'library', label: 'Use Cases', icon: BookOpenCheck },
  { id: 'methodology', label: 'Methodology', icon: BrainCircuit },
  { id: 'summary', label: 'Academic Summary', icon: GraduationCap },
];

const initialAnswers = {
  businessType: 'service',
  employees: '2-10',
  painPoints: [],
  currentTools: '',
  budget: '50-200',
  skillLevel: 'beginner',
  channels: [],
  goal: 'save-time',
};

const painPointOptions = [
  ['customer-service', 'Customer service'],
  ['lead-management', 'Lead management'],
  ['appointment-scheduling', 'Appointment scheduling'],
  ['email-whatsapp', 'Email / WhatsApp communication'],
  ['invoice-documents', 'Invoice and documents'],
  ['social-media-content', 'Social media content'],
  ['task-management', 'Task management'],
  ['crm-workflows', 'CRM workflows'],
  ['internal-processes', 'Internal processes'],
];

const channelOptions = [
  ['email', 'Email'],
  ['whatsapp', 'WhatsApp'],
  ['website', 'Website'],
  ['crm', 'CRM'],
  ['calendar', 'Calendar'],
  ['social-media', 'Social media'],
];

function App() {
  const [activePage, setActivePage] = useState('home');
  const [menuOpen, setMenuOpen] = useState(false);

  const goTo = (page) => {
    setActivePage(page);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="app-shell">
      <Header activePage={activePage} goTo={goTo} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <main>
        {activePage === 'home' && <HomePage goTo={goTo} />}
        {activePage === 'assessment' && <AssessmentPage />}
        {activePage === 'comparison' && <ToolsComparisonPage />}
        {activePage === 'library' && <UseCaseLibraryPage />}
        {activePage === 'methodology' && <MethodologyPage />}
        {activePage === 'summary' && <AcademicSummaryPage />}
      </main>
    </div>
  );
}

function Header({ activePage, goTo, menuOpen, setMenuOpen }) {
  return (
    <header className="site-header">
      <button className="brand" type="button" onClick={() => goTo('home')}>
        <span className="brand-mark"><BarChart3 size={21} /></span>
        <span>
          <strong>Automation Advisor</strong>
          <small>AI Applications in Business</small>
        </span>
      </button>
      <button className="menu-button" type="button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation">
        {menuOpen ? <X size={22} /> : <Menu size={22} />}
      </button>
      <nav className={menuOpen ? 'nav open' : 'nav'}>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              className={activePage === item.id ? 'nav-link active' : 'nav-link'}
              key={item.id}
              type="button"
              onClick={() => goTo(item.id)}
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
  return (
    <section className="page">
      <div className="hero">
        <div className="hero-copy">
          <span className="eyebrow">Decision support for small business automation</span>
          <h1>Choose the right AI automation tools before investing time and money.</h1>
          <p>
            Small businesses know they need automation, but comparing platforms is difficult. This site turns business
            needs, budget, channels, and technical skill into practical recommendations.
          </p>
          <div className="hero-actions">
            <button className="primary-button" type="button" onClick={() => goTo('assessment')}>
              Start assessment <ArrowRight size={18} />
            </button>
            <button className="secondary-button" type="button" onClick={() => goTo('comparison')}>
              Compare tools
            </button>
          </div>
        </div>
        <div className="hero-panel" aria-label="Platform highlights">
          <div className="score-card">
            <span>Recommendation Logic</span>
            <strong>Rule based + explainable</strong>
          </div>
          <div className="mini-metric">
            <CheckCircle2 size={20} />
            <span>Business value</span>
          </div>
          <div className="mini-metric">
            <SlidersHorizontal size={20} />
            <span>Tool fit analysis</span>
          </div>
          <div className="mini-metric">
            <Sparkles size={20} />
            <span>AI use cases</span>
          </div>
        </div>
      </div>

      <SectionIntro
        title="Where AI Automation Helps"
        text="The platform focuses on daily operational work where small businesses lose time, miss leads, or struggle to keep data organized."
      />
      <div className="area-grid">
        {automationAreas.map((area) => {
          const Icon = area.icon;
          return (
            <article className="area-card" key={area.title}>
              <Icon size={24} />
              <h3>{area.title}</h3>
              <p>{area.description}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function AssessmentPage() {
  const [answers, setAnswers] = useState(initialAnswers);
  const recommendation = useMemo(() => generateRecommendation(answers), [answers]);

  const toggleArrayValue = (field, value) => {
    setAnswers((current) => {
      const exists = current[field].includes(value);
      return {
        ...current,
        [field]: exists ? current[field].filter((item) => item !== value) : [...current[field], value],
      };
    });
  };

  return (
    <section className="page two-column-page">
      <div>
        <SectionIntro
          title="Business Automation Assessment"
          text="Answer the questions below. The result updates instantly using transparent rules based on pain points, channels, goals, budget, and technical readiness."
        />
        <form className="assessment-form">
          <FormGroup label="Business type">
            <select value={answers.businessType} onChange={(event) => setAnswers({ ...answers, businessType: event.target.value })}>
              <option value="service">Service business</option>
              <option value="retail">Retail / store</option>
              <option value="clinic">Clinic / appointments</option>
              <option value="agency">Marketing / consulting agency</option>
              <option value="ecommerce">E-commerce</option>
              <option value="professional">Professional office</option>
            </select>
          </FormGroup>

          <FormGroup label="Number of employees">
            <select value={answers.employees} onChange={(event) => setAnswers({ ...answers, employees: event.target.value })}>
              <option value="1">1</option>
              <option value="2-10">2-10</option>
              <option value="11-30">11-30</option>
              <option value="31-plus">31+</option>
            </select>
          </FormGroup>

          <FormGroup label="Main business pain points">
            <ChipGroup options={painPointOptions} values={answers.painPoints} onToggle={(value) => toggleArrayValue('painPoints', value)} />
          </FormGroup>

          <FormGroup label="Current tools used">
            <input
              value={answers.currentTools}
              onChange={(event) => setAnswers({ ...answers, currentTools: event.target.value })}
              placeholder="Example: Gmail, Excel, WhatsApp, calendar, CRM"
            />
          </FormGroup>

          <FormGroup label="Monthly budget">
            <select value={answers.budget} onChange={(event) => setAnswers({ ...answers, budget: event.target.value })}>
              <option value="under-50">Under $50</option>
              <option value="50-200">$50-$200</option>
              <option value="200-500">$200-$500</option>
              <option value="500-plus">$500+</option>
            </select>
          </FormGroup>

          <FormGroup label="Technical skill level">
            <select value={answers.skillLevel} onChange={(event) => setAnswers({ ...answers, skillLevel: event.target.value })}>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </FormGroup>

          <FormGroup label="Preferred channels">
            <ChipGroup options={channelOptions} values={answers.channels} onToggle={(value) => toggleArrayValue('channels', value)} />
          </FormGroup>

          <FormGroup label="Most important goal">
            <select value={answers.goal} onChange={(event) => setAnswers({ ...answers, goal: event.target.value })}>
              <option value="save-time">Save time</option>
              <option value="reduce-costs">Reduce costs</option>
              <option value="improve-sales">Improve sales</option>
              <option value="improve-service">Improve service</option>
              <option value="organize-data">Organize data</option>
            </select>
          </FormGroup>
        </form>
      </div>
      <RecommendationPanel recommendation={recommendation} />
    </section>
  );
}

function RecommendationPanel({ recommendation }) {
  return (
    <aside className="recommendation-panel">
      <span className="eyebrow">Generated recommendation</span>
      <h2>{recommendation.category}</h2>
      <div className="badge-row">
        <Badge label={`Complexity: ${recommendation.complexity}`} />
        <Badge label={`Impact: ${recommendation.impact}`} />
      </div>
      <h3>Suggested tools</h3>
      <div className="tool-pill-list">
        {recommendation.tools.map((tool) => <span key={tool}>{tool}</span>)}
      </div>
      <h3>Why this fits</h3>
      <ul className="clean-list">
        {recommendation.why.map((reason) => <li key={reason}>{reason}</li>)}
      </ul>
      <h3>First implementation step</h3>
      <p>{recommendation.firstStep}</p>
    </aside>
  );
}

function ToolsComparisonPage() {
  const [query, setQuery] = useState('');
  const [ease, setEase] = useState('All');
  const filteredTools = tools.filter((tool) => {
    const matchesQuery = `${tool.name} ${tool.mainUseCase} ${tool.bestFor} ${tool.recommendedBusinessType}`
      .toLowerCase()
      .includes(query.toLowerCase());
    const matchesEase = ease === 'All' || tool.easeOfUse === ease;
    return matchesQuery && matchesEase;
  });

  return (
    <section className="page">
      <SectionIntro
        title="Tools Comparison"
        text="Compare common automation platforms by use case, ease of use, integration strength, pricing, and fit for small business types."
      />
      <div className="filter-bar">
        <label className="search-box">
          <Search size={18} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search tools, use cases, business types" />
        </label>
        <select value={ease} onChange={(event) => setEase(event.target.value)}>
          <option>All</option>
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Tool</th>
              <th>Main use case</th>
              <th>Best for</th>
              <th>Ease</th>
              <th>Integration</th>
              <th>Pricing</th>
              <th>Advantages</th>
              <th>Disadvantages</th>
              <th>Recommended business type</th>
            </tr>
          </thead>
          <tbody>
            {filteredTools.map((tool) => (
              <tr key={tool.name}>
                <td><strong>{tool.name}</strong></td>
                <td>{tool.mainUseCase}</td>
                <td>{tool.bestFor}</td>
                <td><Badge label={tool.easeOfUse} compact /></td>
                <td>{tool.integrationLevel}</td>
                <td>{tool.pricingLevel}</td>
                <td>{tool.advantages}</td>
                <td>{tool.disadvantages}</td>
                <td>{tool.recommendedBusinessType}</td>
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
  const [difficulty, setDifficulty] = useState('All');
  const filteredUseCases = useCases.filter((useCase) => {
    const matchesQuery = `${useCase.title} ${useCase.problem} ${useCase.solution} ${useCase.area} ${useCase.tools.join(' ')}`
      .toLowerCase()
      .includes(query.toLowerCase());
    const matchesDifficulty = difficulty === 'All' || useCase.difficulty === difficulty;
    return matchesQuery && matchesDifficulty;
  });

  return (
    <section className="page">
      <SectionIntro
        title="AI Use Case Library"
        text="Practical automation ideas that small businesses can understand, evaluate, and implement gradually."
      />
      <div className="filter-bar">
        <label className="search-box">
          <Search size={18} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by problem, tool, or area" />
        </label>
        <select value={difficulty} onChange={(event) => setDifficulty(event.target.value)}>
          <option>All</option>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>
      </div>
      <div className="usecase-grid">
        {filteredUseCases.map((useCase) => (
          <article className="usecase-card" key={useCase.title}>
            <div className="card-topline">
              <Badge label={useCase.area} />
              <Badge label={useCase.difficulty} />
            </div>
            <h3>{useCase.title}</h3>
            <InfoBlock label="Business problem" value={useCase.problem} />
            <InfoBlock label="Automation solution" value={useCase.solution} />
            <InfoBlock label="Expected benefit" value={useCase.benefit} />
            <div className="tool-pill-list">
              {useCase.tools.map((tool) => <span key={tool}>{tool}</span>)}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function MethodologyPage() {
  return (
    <section className="page content-page">
      <SectionIntro
        title="AI Tools Methodology"
        text="This page documents how AI tools were used as part of the academic project, including strengths, limitations, prompt improvement, and quality checks."
      />
      <div className="method-grid">
        <MethodCard
          title="AI Tool 1: Codex"
          items={[
            'Planned the React code structure and component hierarchy.',
            'Built the frontend, page routing, responsive layout, and UI components.',
            'Created reusable data files for tools, use cases, and automation areas.',
            'Improved UI/UX through navigation, filtering, badges, tables, and recommendation panels.',
            'Debugged and refactored the project to make it easier to present and maintain.',
          ]}
        />
        <MethodCard
          title="AI Tool 2: ChatGPT / AI Research Tool"
          items={[
            'Supported market research on automation categories and common small-business tools.',
            'Helped define comparison criteria such as ease of use, integration level, and pricing level.',
            'Generated and refined practical business use cases.',
            'Improved explanations so non-technical business owners can understand the value.',
            'Helped validate that the recommendation logic is explainable and realistic.',
          ]}
        />
      </div>
      <div className="insight-band">
        <InfoBlock label="What worked well" value="AI was strongest when the task had clear structure: pages, fields, comparison criteria, and a target audience. It helped move from idea to working prototype quickly." />
        <InfoBlock label="What did not work at first" value="Broad prompts produced generic results. The output improved after adding exact pages, academic requirements, tool lists, and evaluation criteria." />
        <InfoBlock label="How prompts improved" value="Prompts became more specific, included constraints, asked for explainable logic, and separated design, functionality, and academic documentation." />
        <InfoBlock label="Quality checking" value="The project was checked by running the app, reviewing navigation, testing the questionnaire, validating filters, and making sure content supports a 10-minute presentation." />
      </div>
      <div className="method-grid">
        <MethodCard
          title="Advantages and disadvantages"
          items={[
            'Codex advantage: fast implementation and refactoring inside the real project files.',
            'Codex disadvantage: it still needs human review for business assumptions and academic accuracy.',
            'ChatGPT advantage: useful for brainstorming market criteria, prompts, and explanations.',
            'ChatGPT disadvantage: research-style output must be verified and adapted to the project context.',
          ]}
        />
        <MethodCard
          title="Recommendations for students"
          items={[
            'Start with a clear product goal before asking AI to code.',
            'Ask AI to explain business logic in a way that can be defended in class.',
            'Test every generated feature instead of assuming it works.',
            'Keep prompts and changes documented for the final academic summary.',
          ]}
        />
      </div>
    </section>
  );
}

function AcademicSummaryPage() {
  const sections = [
    ['How we came up with the idea', 'Small businesses often hear about AI automation but struggle to choose tools. The idea was to build a decision-support website that connects business needs to practical automation options.'],
    ['AI tools tested', 'Codex was used for frontend planning and implementation. ChatGPT or another AI research tool was used for market framing, comparison criteria, and use-case drafting.'],
    ['Tools finally used and why', 'Codex was selected for coding because it can work directly with project files. ChatGPT-style research support was used because it is effective for brainstorming and explanation refinement.'],
    ['Important prompts used', 'Prompts asked for a React + Vite app, an explainable questionnaire, real automation tool comparison, AI use cases, methodology documentation, and a README presentation plan.'],
    ['Feedback received from users', 'Suggested feedback areas include whether the questionnaire is understandable, whether recommendations feel realistic, and whether the comparison table supports decision making.'],
    ['Improvements made based on feedback', 'The project can be improved by adding more industries, scoring weights, local pricing, Hebrew language support, and exportable reports.'],
    ['What was good in the process', 'The structured requirements helped AI produce a complete product with clear academic relevance and class-demo readiness.'],
    ['What could be improved', 'Future work could include real market data, user accounts, saved assessments, and verified pricing from vendor websites.'],
    ['Personal and group lessons learned', 'AI tools are powerful for prototyping, but students still need to define the business problem, check outputs, and explain decisions critically.'],
  ];

  return (
    <section className="page content-page">
      <SectionIntro
        title="Project Summary"
        text="Structured material the team can later adapt into the final DOCX summary for the course."
      />
      <div className="summary-list">
        {sections.map(([title, text]) => (
          <article className="summary-item" key={title}>
            <h3>{title}</h3>
            <p>{text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function SectionIntro({ title, text }) {
  return (
    <div className="section-intro">
      <span className="eyebrow">AI Business Automation Advisor</span>
      <h2>{title}</h2>
      <p>{text}</p>
    </div>
  );
}

function FormGroup({ label, children }) {
  return (
    <label className="form-group">
      <span>{label}</span>
      {children}
    </label>
  );
}

function ChipGroup({ options, values, onToggle }) {
  return (
    <div className="chip-group">
      {options.map(([value, label]) => (
        <button
          className={values.includes(value) ? 'chip selected' : 'chip'}
          key={value}
          type="button"
          onClick={() => onToggle(value)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

function Badge({ label, compact = false }) {
  return <span className={compact ? 'badge compact' : 'badge'}>{label}</span>;
}

function InfoBlock({ label, value }) {
  return (
    <div className="info-block">
      <strong>{label}</strong>
      <p>{value}</p>
    </div>
  );
}

function MethodCard({ title, items }) {
  return (
    <article className="method-card">
      <h3>{title}</h3>
      <ul className="clean-list">
        {items.map((item) => <li key={item}>{item}</li>)}
      </ul>
    </article>
  );
}

export default App;
