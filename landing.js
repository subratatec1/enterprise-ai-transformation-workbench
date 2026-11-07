// Editorial executive landing page. All figures count MVP capabilities, not client outcomes.
const LANDING_DISCIPLINES=[
  {id:'strategy',number:'01',name:'AI Strategy & Roadmap',mandate:'Set ambition. Choose the right bets.',summary:'Connect enterprise AI priorities to business strategy, investment decisions and a sequenced transformation roadmap.',outputs:'Maturity baseline · Opportunity portfolio · Roadmap'},
  {id:'operating',number:'02',name:'AI Operating Model',mandate:"Make AI everyone's accountability.",summary:'Define the CoE, business ownership, decision rights and talent model required to move beyond isolated pilots.',outputs:'Decision rights · Federated delivery · Adoption'},
  {id:'governance',number:'03',name:'Governance & Risk',mandate:'Enable confident, controlled autonomy.',summary:'Classify agent actions by impact and reversibility, then translate policy into clear human and technical control gates.',outputs:'Risk controls · Autonomy tiers · Assurance'},
  {id:'architecture',number:'04',name:'Architecture that Scales',mandate:'Industrialize the foundations.',summary:'Shape a cloud-neutral, composable enterprise AI architecture with reusable skills, trusted context and orchestration.',outputs:'Reference architecture · Platform patterns · Reuse'},
  {id:'economics',number:'05',name:'AI Economics',mandate:'Prove what changes in the P&L.',summary:'Separate potential from bankable benefits, make AI operating cost visible and test investment scenarios.',outputs:'Unit economics · Investment case · Value tracking'}
];

function landingOverview(){
  const proof=assessmentReport(),registry=skillInventoryReport();
  return `<div class="landing">
    <section class="landing-hero" aria-labelledby="landing-title">
      <div class="landing-hero-grid">
        <div class="landing-hero-copy">
          <div class="landing-overline"><span class="landing-signal"></span>ENTERPRISE AI TRANSFORMATION <span class="landing-overline-rule"></span> ADVISORY WORKBENCH</div>
          <h1 id="landing-title">From AI ambition to <em>enterprise impact.</em></h1>
          <p class="landing-hero-intro">A consulting-led framework to define the strategy, build the foundations, govern agentic AI and realize measurable value—across the enterprise.</p>
          <div class="landing-hero-actions"><button type="button" class="landing-button landing-button-primary" data-go="strategy">Explore the framework <span aria-hidden="true">↗</span></button><a class="landing-button landing-button-ghost" href="#landing-framework">See five disciplines <span aria-hidden="true">↓</span></a></div>
          <p class="landing-hero-footnote">For CIOs, CTOs and transformation leaders who need clarity from strategy through execution.</p>
        </div>
        <div class="landing-hero-panel" aria-label="Five connected disciplines of enterprise AI transformation">
          <div class="landing-panel-head"><span>TRANSFORMATION BLUEPRINT</span><span>01—05</span></div>
          <div class="landing-panel-core"><div class="landing-panel-rule"></div>
            <div class="landing-panel-step"><span class="landing-panel-node"></span><div><small>DEFINE</small><strong>AI ambition & priorities</strong></div><b>01</b></div>
            <div class="landing-panel-step"><span class="landing-panel-node"></span><div><small>ORGANIZE</small><strong>Ownership & adoption</strong></div><b>02</b></div>
            <div class="landing-panel-step"><span class="landing-panel-node"></span><div><small>CONTROL</small><strong>Governance & autonomy</strong></div><b>03</b></div>
            <div class="landing-panel-step"><span class="landing-panel-node"></span><div><small>ENABLE</small><strong>Architecture & reuse</strong></div><b>04</b></div>
            <div class="landing-panel-step"><span class="landing-panel-node"></span><div><small>REALIZE</small><strong>Value & economics</strong></div><b>05</b></div>
          </div>
          <div class="landing-panel-foot"><span class="landing-panel-pulse"></span>Evidence-led decisions. Accountable outcomes.</div>
        </div>
      </div>
      <div class="landing-hero-bottom"><span>ADVISORY × TECHNOLOGY × VALUE REALIZATION</span><span>FROM PILOTS TO ENTERPRISE SCALE</span></div>
    </section>

    <div class="landing-counts" aria-label="Workbench capability inventory">
      <div><b>05</b><span>Interactive accelerators</span></div>
      <div><b>10</b><span>AI readiness dimensions</span></div>
      <div><b>43</b><span>Evidence-led assessment criteria</span></div>
      <div><b>${String(registry.total).padStart(2,'0')}</b><span>Consulting skill candidates</span></div>
    </div>

    <section class="landing-section landing-thesis" aria-labelledby="landing-thesis-title">
      <div class="landing-section-marker"><span>01 / THE IMPERATIVE</span><span>THE CxO PERSPECTIVE</span></div>
      <div class="landing-thesis-grid"><h2 id="landing-thesis-title">The challenge is no longer <em>starting AI.</em><br>It is making AI work at scale.</h2><div><p>Across enterprises, promising experiments compete with fragmented data, unclear ownership, inconsistent controls and uncertain economics. The result: activity is visible, but value is harder to prove.</p><p>Transformation needs a connected decision system—not another one-off technology assessment.</p></div></div>
      <div class="landing-tensions">
        <article><span>01</span><h3>Ambition without prioritization</h3><p>Too many opportunities, too little clarity on where investment will change business outcomes.</p></article>
        <article><span>02</span><h3>Intelligence without control</h3><p>Agentic use cases move toward enterprise systems before identity, policy and accountability are ready.</p></article>
        <article><span>03</span><h3>Adoption without realized value</h3><p>Productivity gains remain theoretical when baselines, ownership and financial validation are missing.</p></article>
      </div>
    </section>

    <section class="landing-section landing-framework" id="landing-framework" aria-labelledby="landing-framework-title">
      <div class="landing-section-marker"><span>02 / THE FRAMEWORK</span><span>FIVE CONNECTED DISCIPLINES</span></div>
      <div class="landing-framework-intro"><div><h2 id="landing-framework-title">One transformation agenda.<br><em>Five ways to make it actionable.</em></h2></div><p>Each discipline has a clear consulting mandate, practical decisions and an interactive accelerator. Together they form the path from enterprise ambition to sustained value.</p></div>
      <div class="landing-discipline-list">${LANDING_DISCIPLINES.map(d=>`<button class="landing-discipline" data-go="${d.id}" type="button" aria-label="Open ${d.name} accelerator"><span class="landing-discipline-number">${d.number}</span><div class="landing-discipline-content"><h3>${d.name}</h3><strong>${d.mandate}</strong><p>${d.summary}</p><small>${d.outputs}</small></div><span class="landing-discipline-arrow" aria-hidden="true">↗</span></button>`).join('')}</div>
    </section>

    <section class="landing-operating-story" aria-labelledby="landing-operating-title"><div class="landing-operating-inner"><div class="landing-operating-copy"><div class="landing-section-marker dark"><span>03 / HOW IT WORKS</span></div><h2 id="landing-operating-title">From an assessment to an <em>evidence-led decision.</em></h2><p>Bring together enterprise evidence, maturity findings, design choices and value hypotheses. Every step strengthens the next—creating traceability from discovery through execution.</p><button class="landing-text-link" type="button" data-go="evidence">Explore evidence-led assessment <span>↗</span></button></div><div class="landing-operating-chain"><div><span>DISCOVER</span><strong>Evidence & context</strong><small>Documents, systems, interviews, validation</small></div><div><span>ASSESS</span><strong>Readiness & opportunity</strong><small>43 criteria, 10 capability dimensions</small></div><div><span>DESIGN</span><strong>Architecture & guardrails</strong><small>Operating model, controls, skill reuse</small></div><div><span>REALIZE</span><strong>Decision & value tracking</strong><small>Investment choices, financial outcomes</small></div></div></div></section>

    <section class="landing-section landing-enablers" aria-labelledby="landing-enablers-title"><div class="landing-section-marker"><span>04 / REUSABLE ASSETS</span><span>BUILT FOR CONSULTING DELIVERY</span></div><div class="landing-enablers-head"><h2 id="landing-enablers-title">A framework backed by <em>working accelerators.</em></h2><p>Explore the supporting tools that make discovery structured, evidence traceable and reusable AI capabilities easier to govern.</p></div><div class="landing-enabler-grid">
      <article class="landing-enabler"><div class="landing-enabler-top"><span>ASSESSMENT INTELLIGENCE</span><span class="landing-enabler-icon">▤</span></div><h3>Evidence & Assessment Workspace</h3><p>Collect and evaluate client proof against the ${proof.total}-question catalogue, track ownership and confidence, and move validated scores into the AI roadmap.</p><div class="landing-enabler-bottom"><span>${proof.rated} / ${proof.total} questions scored in this browser</span><button type="button" data-go="evidence">Open workspace ↗</button></div></article>
      <article class="landing-enabler"><div class="landing-enabler-top"><span>REUSABLE CONSULTING IP</span><span class="landing-enabler-icon">✦</span></div><h3>Consulting Skill Inventory</h3><p>Browse ${registry.total} skill candidates for research, advisory, visualization and delivery. Track package verification before introducing governed agent routing.</p><div class="landing-enabler-bottom"><span>${registry.markedReady} / ${registry.total} marked integration-ready</span><button type="button" data-go="skills">Explore skill inventory ↗</button></div></article>
    </div></section>

    <section class="landing-close" aria-labelledby="landing-close-title"><div><span class="landing-close-kicker">YOUR TRANSFORMATION STARTING POINT</span><h2 id="landing-close-title">Start with clarity.<br><em>Move with confidence.</em></h2><p>Use the framework to establish an evidence-based view of AI readiness, agree what matters most and shape a pragmatic enterprise roadmap.</p></div><div class="landing-close-actions"><button type="button" class="landing-button landing-button-primary" data-go="strategy">Start the AI assessment <span>↗</span></button><button type="button" class="landing-button landing-button-dark" data-go="architecture">Explore target architecture <span>↗</span></button></div></section>
    <p class="landing-disclaimer">Framework prototype · Illustrative assumptions and sample values only. Client decisions require validated evidence and accountable approval. No confidential documents or skill packages are stored in this public site.</p>
  </div>`;
}
