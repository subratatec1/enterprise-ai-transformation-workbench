// Consulting question catalogue based on the 43 criteria in the BFSI starter toolkit.
// The criteria are prompts for client assessment, not statements about an actual client.
const EVIDENCE_CHANNELS = [
  {id:'Document',label:'A. Document collection',icon:'▣',theme:'evidence-doc',description:'Strategies, policies, architecture designs, operating models, process documentation and business cases.',formats:'PDF · DOCX · PPTX · XLSX'},
  {id:'System',label:'B. Enterprise system evidence',icon:'▤',theme:'evidence-system',description:'Approved, read-only extracts from AI platforms, ITSM, DevOps, GRC, finance and monitoring systems.',formats:'API · CSV · JSON'},
  {id:'Interview',label:'C. Stakeholder interviews',icon:'♧',theme:'evidence-interview',description:'Structured CIO, business, architecture, engineering, risk and finance interviews.',formats:'Questionnaire · Workshop notes'},
  {id:'Validation',label:'D. Operational validation',icon:'✓',theme:'evidence-validation',description:'Demonstrations, sampled transactions, deployment checks, control tests and KPI reconciliation.',formats:'Observations · Test results'}
];

const DIMENSION_GUIDE = {
  STR:{label:'Strategy',owner:'CIO / Strategy Office'},
  VAL:{label:'Value',owner:'AI Portfolio / Product Office'},
  ORG:{label:'Organization',owner:'AI CoE / HR / CIO Office'},
  PPL:{label:'People & culture',owner:'HR / Change & Adoption'},
  GOV:{label:'Governance',owner:'Risk / Compliance / Legal'},
  ENG:{label:'Engineering',owner:'AI Engineering / Platform Lead'},
  DAT:{label:'Data',owner:'Chief Data Office'},
  AGT:{label:'Agentic readiness',owner:'Agent Platform / Enterprise Architecture'},
  ARC:{label:'AI architecture',owner:'Enterprise Architecture / AI Platform'},
  VRL:{label:'Value realization',owner:'Business Owner / Finance / VRO'}
};

// Fields: statement ID, assessment criterion, suggested proof to request, preferred intake channel.
const QUESTION_DATA = [
  ['STR.1','A board-endorsed AI vision states where AI will create advantage for the bank or insurer.','Approved AI strategy; board or executive-committee decision record','Document'],
  ['STR.2','AI ambition is translated into a funded, multi-year roadmap linked to business strategy.','Funded AI roadmap; investment plan; strategy-to-initiative traceability','Document'],
  ['STR.3','AI maturity is assessed periodically and used to steer investment.','Prior maturity reports; review cadence; investment steering minutes','Document'],
  ['STR.4','Strategy success measures are defined and reviewed by the executive committee.','AI strategy scorecard; KPI owners; executive review packs','Document'],
  ['VAL.1','Use cases are prioritized with a consistent value-versus-feasibility method.','Use-case inventory; evaluation matrix; investment-ranking decisions','Document'],
  ['VAL.2','Pilots have pre-agreed success criteria and a go/no-go decision point.','Pilot charters; acceptance criteria; stage-gate decision records','Document'],
  ['VAL.3','AI run-costs (inference, platform, licences) are tracked and allocated (AI FinOps).','Model-usage telemetry; cloud bills; cost allocation extracts','System'],
  ['VAL.4','AI products have owners, roadmaps and product-management practices.','Product ownership register; delivery backlog; release roadmap','System'],
  ['ORG.1','A senior AI leader has clear mandate, budget and decision rights.','Signed AI leadership charter; budget ownership; decision-rights RACI','Document'],
  ['ORG.2','A centre of excellence or AI team provides shared skills, standards and reuse.','CoE charter; service catalogue; shared capability adoption evidence','Document'],
  ['ORG.3','A target operating model defines how central and business-line AI teams work together.','Target operating model; organization design; delivery responsibility map','Document'],
  ['ORG.4','External AI partnerships (vendors, fintechs, academia) are managed as a portfolio.','Vendor and partner register; contracts; periodic portfolio review','Document'],
  ['PPL.1','Workforce plans model how AI changes roles, skills and capacity.','Workforce-impact assessment; capability matrix; role transition plans','Document'],
  ['PPL.2','Role-based AI literacy programmes reach front office, operations and control functions.','Training curriculum; completion records by role and function','System'],
  ['PPL.3','Business champions drive adoption inside each line of business.','Champion network roster; interview evidence; adoption activities','Interview'],
  ['PPL.4','Employee readiness and AI adoption are measured and acted upon.','Adoption dashboard; employee surveys; interventions and outcomes','System'],
  ['GOV.1','AI risks are inventoried and mapped to the enterprise risk framework and model risk policy.','AI risk inventory; model-risk mapping; regulatory classification','Document'],
  ['GOV.2','AI policies and ethical principles are approved and enforced, not just published.','Approved AI policies; enforcement tests; exceptions and remediation','Validation'],
  ['GOV.3','A cross-functional governance board (risk, compliance, legal, tech, business) approves high-risk AI.','Committee charter; attendance and approval evidence; decision log','Document'],
  ['GOV.4','Governance is supported by tooling: AI inventory, model cards, approval workflow, audit evidence.','AI system registry extract; model cards; approval and audit logs','System'],
  ['ENG.1','A build-vs-buy framework and vendor strategy guide AI sourcing decisions.','Architecture decision records; sourcing evaluations; vendor standards','Document'],
  ['ENG.2','Teams use sandboxes, reference architectures and reusable design patterns.','Approved architecture patterns; sandbox walkthrough; reuse statistics','Validation'],
  ['ENG.3','MLOps/LLMOps practices cover versioning, testing, deployment and rollback.','CI/CD pipeline configuration; version history; deployment/rollback test','Validation'],
  ['ENG.4','AI observability monitors quality, drift, cost and latency in production.','Production telemetry dashboard; alerts; quality and latency logs','System'],
  ['DAT.1','Data readiness is assessed for each priority use case before build.','Data-readiness gates; source assessments; sampled project decisions','Document'],
  ['DAT.2','Data governance covers unstructured data (documents, call transcripts, emails).','Unstructured-data policies; access controls; retention evidence','Document'],
  ['DAT.3','Data quality and metadata are managed with owners and service levels.','Data catalogue; ownership register; DQ SLAs and scorecards','System'],
  ['DAT.4','Data observability detects quality and lineage issues before they reach AI systems.','Lineage dashboards; DQ alerts; incident traces and response times','System'],
  ['AGT.1','Autonomy tiers and action controls are defined for agents that can act in systems.','Autonomy policy; action-risk matrix; approval and exception tests','Validation'],
  ['AGT.2','Tools and APIs are exposed to agents through a standard integration layer (e.g. MCP).','Agent tool catalogue; API/MCP access policy; integration demo','Validation'],
  ['AGT.3','Context engineering and agent memory follow defined patterns with retention rules.','Context architecture; memory TTL/retention policy; access tests','Document'],
  ['AGT.4','Multi-agent orchestration, agent identity and agent-to-agent communication are standardized.','Agent orchestration specification; identity model; protocol demo','Validation'],
  ['AGT.5','Agents are evaluated continuously and have kill switches, limits and full audit trails.','Evaluation reports; audit trails; rate-limit and emergency-stop tests','Validation'],
  ['ARC.1','A target-state AI reference architecture is approved by enterprise architecture.','Signed reference architecture; design authority approval; standards','Document'],
  ['ARC.2','An AI gateway centralizes model access, policy enforcement, logging and cost allocation.','AI gateway topology; traffic/access logs; policy-control test','Validation'],
  ['ARC.3','Multiple models are routed by cost, latency, quality and data sensitivity.','Routing rules; model benchmarks; sensitivity controls and traces','Validation'],
  ['ARC.4','Reusable AI skills and a knowledge graph are shared across business units.','Skills catalogue; graph schema; consumer adoption and reuse logs','System'],
  ['ARC.5','AI integrates with core platforms (core banking, policy admin, CRM, LOS) through governed APIs and events.','Integration architecture; API inventory; event/access audit records','System'],
  ['VRL.1','Every funded use case has a value hypothesis linked to a business KPI and a measured baseline.','Approved business cases; KPI baseline report; benefit owner sign-off','Document'],
  ['VRL.2','KPI trees connect AI metrics to operational and financial outcomes.','KPI tree; metric definitions; business-to-model traceability','Document'],
  ['VRL.3','Finance validates realized benefits and distinguishes hard from soft benefits.','Finance-signed benefit reports; validation and reconciliation notes','Validation'],
  ['VRL.4','Time saved is converted into banked value (capacity redeployed, cost removed or revenue gained).','Capacity plans; cost-center reconciliation; achieved benefit evidence','Validation'],
  ['VRL.5','Value is tracked continuously and funding is stage-gated on realized value.','Portfolio value dashboard; funding-gate decisions; actuals-versus-plan','System']
].map(([id,text,expectedEvidence,channel])=>({id,dimension:id.split('.')[0],text,expectedEvidence,channel,owner:DIMENSION_GUIDE[id.split('.')[0]].owner}));
