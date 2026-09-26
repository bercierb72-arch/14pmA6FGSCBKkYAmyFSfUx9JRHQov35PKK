import { useMemo, useState } from 'react'
import './App.css'

const resources = [
  {
    title: 'Lab-Grown Advertising Guide',
    description:
      'Keep marketing teams aligned on compliant terminology, disclosures, and consumer-facing claims.',
    tag: 'FTC guidance',
    href: '#updates',
    cta: 'Review alerts',
  },
  {
    title: 'Supplier Code of Conduct',
    description:
      'Standardize sourcing expectations across natural-diamond vendors with one reusable template.',
    tag: 'Template',
    href: '#checklist',
    cta: 'Run self-audit',
  },
  {
    title: 'Mixed Inventory Disclosure Pack',
    description:
      'Equip sales teams to distinguish natural and laboratory-grown goods at every handoff.',
    tag: 'Operations',
    href: '#toolkit',
    cta: 'View toolkit',
  },
]

const workflowSteps = [
  {
    title: 'Collect supplier attestations',
    body: 'Request signed disclosures, sourcing statements, and code-of-conduct acknowledgements before onboarding.',
  },
  {
    title: 'Review advertising language',
    body: 'Check product copy, labels, and sales scripts against FTC-aligned terminology for natural and lab-grown diamonds.',
  },
  {
    title: 'Track remediation deadlines',
    body: 'Flag gaps, assign owners, and retain evidence showing how compliance issues were closed.',
  },
]

const checklistItems = [
  'Separate natural and laboratory-grown inventory descriptions across catalog, POS, and marketing channels.',
  'Confirm supplier disclosure agreements are signed and current for every active vendor.',
  'Document escalation steps for sourcing concerns, inconsistent paperwork, or missing representations.',
  'Train frontline staff on compliant terminology before new collections launch.',
]

const updates = [
  {
    title: 'Advertising review window',
    detail: 'Re-validate campaign language before holiday launch materials are released to stores and ecommerce.',
  },
  {
    title: 'Supplier audit refresh',
    detail: 'Focus the next review cycle on mixed-inventory suppliers and incomplete disclosure packets.',
  },
  {
    title: 'Responsible sourcing briefing',
    detail: 'Pair portal workflows with AML and due-diligence training for compliance, merchandising, and sales leads.',
  },
]

function App() {
  const [checkedItems, setCheckedItems] = useState(() => checklistItems.map((_, index) => index < 2))

  const completedCount = useMemo(
    () => checkedItems.filter(Boolean).length,
    [checkedItems],
  )

  const completion = Math.round((completedCount / checklistItems.length) * 100)

  const toggleItem = (index) => {
    setCheckedItems((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index ? !item : item,
      ),
    )
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">JVC-inspired compliance workspace</p>
          <h1>Diamond Supply Chain Portal</h1>
        </div>
        <a className="topbar-link" href="#toolkit">
          Open toolkit
        </a>
      </header>

      <main>
        <section className="hero card">
          <div>
            <p className="eyebrow">Protecting your diamond supply chain</p>
            <h2>Keep supplier disclosures, advertising guidance, and team readiness in one place.</h2>
            <p className="lede">
              This portal turns diamond compliance priorities into a single operating hub for responsible sourcing,
              FTC-aligned messaging, and supplier accountability.
            </p>
            <div className="hero-actions">
              <a href="#checklist" className="button primary">
                Run self-audit
              </a>
              <a href="#updates" className="button secondary">
                Review alerts
              </a>
            </div>
          </div>
          <div className="hero-panel">
            <div>
              <span>Supplier files in good standing</span>
              <strong>24 / 28</strong>
            </div>
            <div>
              <span>Disclosure checklist completion</span>
              <strong>{completion}%</strong>
            </div>
            <div>
              <span>Priority review focus</span>
              <strong>Mixed inventory messaging</strong>
            </div>
          </div>
        </section>

        <section className="metrics-grid">
          <article className="metric card">
            <span>Resources</span>
            <strong>3 core kits</strong>
            <p>Templates and quick-reference handouts for legal, merchandising, and sales teams.</p>
          </article>
          <article className="metric card">
            <span>Workflow</span>
            <strong>3 control points</strong>
            <p>Collect attestations, review claims, and close findings with retained evidence.</p>
          </article>
          <article className="metric card">
            <span>Training</span>
            <strong>Role-based guidance</strong>
            <p>Prepare customer-facing teams to describe products accurately and consistently.</p>
          </article>
        </section>

        <section id="toolkit" className="card section-block">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Toolkit</p>
              <h2>Compliance resources your team can act on now</h2>
            </div>
            <p>Mirror the article’s focus on disclosure support, supplier standards, and daily operational readiness.</p>
          </div>
          <div className="resource-grid">
            {resources.map((resource) => (
              <article key={resource.title} className="resource-card">
                <span className="badge">{resource.tag}</span>
                <h3>{resource.title}</h3>
                <p>{resource.description}</p>
                <a href={resource.href} className="resource-link">
                  {resource.cta}
                </a>
              </article>
            ))}
          </div>
        </section>

        <section className="split-layout">
          <article className="card section-block">
            <div className="section-heading compact">
              <div>
                <p className="eyebrow">Workflow</p>
                <h2>Supplier review path</h2>
              </div>
            </div>
            <ol className="workflow-list">
              {workflowSteps.map((step) => (
                <li key={step.title}>
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                </li>
              ))}
            </ol>
          </article>

          <article id="checklist" className="card section-block">
            <div className="section-heading compact">
              <div>
                <p className="eyebrow">Self-audit</p>
                <h2>Disclosure readiness checklist</h2>
              </div>
              <div className="completion-pill">{completedCount} of 4 done</div>
            </div>
            <div
              className="progress-bar"
              role="progressbar"
              aria-label="Disclosure readiness completion"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={completion}
            >
              <span style={{ width: `${completion}%` }} />
            </div>
            <ul className="checklist">
              {checklistItems.map((item, index) => (
                <li key={item}>
                  <label>
                    <input
                      type="checkbox"
                      checked={checkedItems[index]}
                      onChange={() => toggleItem(index)}
                    />
                    <span>{item}</span>
                  </label>
                </li>
              ))}
            </ul>
          </article>
        </section>

        <section id="updates" className="card section-block">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Updates</p>
              <h2>What leadership should monitor next</h2>
            </div>
            <p>Use scheduled reviews to keep supply chain controls, product messaging, and training materials aligned.</p>
          </div>
          <div className="updates-list">
            {updates.map((update) => (
              <article key={update.title} className="update-item">
                <h3>{update.title}</h3>
                <p>{update.detail}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
