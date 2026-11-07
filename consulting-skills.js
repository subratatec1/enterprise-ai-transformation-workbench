// User-supplied metadata inventory. No skill package, instruction body, credential or runtime is bundled.
// Suggested triggers and inputs/outputs below are directional and must be confirmed against each package.
const CONSULTING_SKILL_GROUPS=[
  {id:'research',label:'Research and client intelligence',short:'Research',description:'Find facts, understand client context and prepare stakeholder briefings.'},
  {id:'strategy',label:'Strategy and consulting deliverables',short:'Strategy',description:'Shape narratives, improve advisory content and challenge assumptions.'},
  {id:'visual',label:'Presentations and visualization',short:'Presentations',description:'Create presentations, diagrams, prototypes and executive talking points.'},
  {id:'delivery',label:'Bid management and engagement delivery',short:'Delivery',description:'Support qualification, meetings, decisions and actions.'},
  {id:'governance',label:'Skill governance and development',short:'Governance',description:'Establish common standards for new reusable skills.'}
];

// ID · exact supplied skill name · group · supplied purpose · intended application · indicative routing intent · suggested inputs · outputs.
const CONSULTING_SKILL_DATA=[
  ['CS-001','Invent Primer: Fast Readiness Briefings for Consultants','research','Quickly prepares background on a market, person or subject before a meeting.','Automatically prepare industry and topic briefings.','quick briefing, sector research','Topic, market and meeting objective','Pre-meeting background brief'],
  ['CS-002','Consulting Research Fact Finder','research','Retrieves cited facts and figures from research sources.','Support industry benchmarks, market analysis and evidence gathering.','fact check, industry benchmarks','Research question, timeframe and source scope','Evidence-backed fact table and citations'],
  ['CS-003','Client Briefing Assistant','research','Converts scattered research and documents into sourced client meeting briefs.','Generate consolidated client intelligence packs.','client intelligence, meeting brief','Approved client context, public research and documents','Consolidated sourced client briefing'],
  ['CS-004','Executive Meeting Brief and Pitch Strategy','research','Prepares executive profiles and meeting/pitch strategies.','Support CIO/CTO stakeholder preparation.','executive pitch, stakeholder prep','Executive role, meeting agenda and engagement objective','Executive brief and pitch approach'],
  ['CS-005','Invent Enterprise Context Router','research',"Answers questions about Invent's organization, identity and governance.",'Supply approved enterprise context and guidance.','internal policy, Invent context','Authorized enterprise-context query','Approved context response with provenance'],
  ['CS-006','Storyboarding Coach','strategy','Builds structured consulting storylines and message architecture.','Develop an executive narrative before preparing slides.','storyboard, executive narrative','Audience, problem statement, evidence and recommendation','Message architecture and slide storyline'],
  ['CS-007','Strategy Writing: AI Pattern Remover and Prose Editor','strategy','Refines strategy documents, making the writing more natural and professional.','Improve advisory reports and strategic recommendations.','edit strategy, prose polish','Approved strategy draft and desired tone','Refined advisory prose'],
  ['CS-008','Management Summary Generator','strategy','Transforms documents and notes into concise executive summaries.','Generate management and steering committee summaries.','executive summary, steering note','Document or meeting notes','Concise decision-oriented summary'],
  ['CS-009','Action Title Creator','strategy','Creates insight-led slide headlines.','Improve consulting presentation headlines.','action title, slide headline','Slide takeaway and supporting evidence','Insight-led action title options'],
  ['CS-010','Storyline Logic & Evidence Reviewer','strategy','Reviews narrative logic, evidence and slide structure.','Validate storyline quality and supporting claims.','storyline review, citation check','Draft storyline, claims and sources','Logic, evidence and consistency review'],
  ['CS-011','Blind Spots: Red-Team Risk Reviewer for Consulting Work','strategy','Identifies potential risks, weaknesses and omissions in consulting work.','Challenge recommendations and risk assumptions.','red-team, risk challenge','Recommendations, assumptions and risk context','Challenges, gaps and mitigation questions'],
  ['CS-012','INVENT Presentation Skill: On-Brand Capgemini Invent PPTX Builder','visual','Generates branded consulting PowerPoint presentations.','Produce PPTX deliverables using approved templates.','PPTX, on-brand slides','Approved slide content and licensed brand template','Editable PowerPoint deliverable'],
  ['CS-013','INVENT HTML Template','visual','Creates branded, self-contained HTML prototypes.','Generate interactive HTML consulting prototypes.','HTML prototype, on-brand web','Approved visual template and content brief','Self-contained consulting HTML prototype'],
  ['CS-014','Pitch Prep Dashboard Builder','visual','Produces a structured HTML dashboard for pitch preparation.','Build pursuit and client meeting preparation dashboards.','pitch dashboard, pursuit prep','Pursuit context, stakeholders and pitch workplan','Interactive preparation dashboard'],
  ['CS-015','Process Diagram Builder','visual','Converts process descriptions into structured diagrams.','Generate business process and operating model diagrams.','process map, operating model','Process narrative, roles and decision points','Structured process diagram'],
  ['CS-016','Visual Diagram Builder: Flowcharts, Process Maps & Architecture','visual','Generates architecture maps, flowcharts and other visuals.','Develop technical architecture and process visualizations.','architecture diagram, flowchart','System components, interactions and flows','Architecture or process visual'],
  ['CS-017','Presentation Talking Points','visual','Creates slide-by-slide presentation speaker notes.','Prepare executive pitch scripts and talking points.','speaker notes, presentation script','Presentation and audience context','Slide-by-slide speaker notes'],
  ['CS-018','Invent RFP Intelligence','delivery','Analyzes bid documents and prepares qualification briefs.','Support RFP analysis and bid/no-bid recommendations.','RFP qualification, bid analysis','Authorized RFP package and pursuit criteria','Qualification brief and decision support'],
  ['CS-019','Post-Meeting Summary & Action Items','delivery','Extracts decisions, responsibilities and actions from meeting transcripts.','Automatically update engagement actions and decisions.','action log, meeting follow-up','Authorized transcript or meeting notes','Decision and action-item register'],
  ['CS-020','Meeting Minutes Generator','delivery','Converts meeting notes into structured meeting minutes.','Produce standardized client meeting minutes.','meeting minutes, MoM','Approved meeting notes and attendee context','Structured minutes with owners and actions'],
  ['CS-021','Invent Skill Standard: Claude Skill Authoring Framework','governance','Provides a standard method for designing and governing reusable Skills.','Standardize new Skill development and onboarding.','skill authoring, governance standards','Skill requirements, design and validation criteria','Standardized skill specification and checklist']
].map(([id,name,group,purpose,application,routingIntent,inputHint,outputHint])=>({id,name,group,purpose,application,routingIntent,inputHint,outputHint}));

const SKILL_VERIFICATION_STEPS=[
  ['package','Source package obtained and its complete instructions inspected'],
  ['rights','Ownership, licensing and publishing/usage permissions approved'],
  ['schema','Actual triggers, inputs, outputs and failure modes documented'],
  ['runtime','Runtime dependencies, connectors and permissions validated'],
  ['security','Security, privacy and enterprise data controls reviewed'],
  ['tested','Sandbox execution, quality checks and failure handling passed']
];

let skillUI={selectedId:'CS-001',group:'All',status:'All',search:'',notice:''};

function ensureSkillState(){if(!state.skillReviews||typeof state.skillReviews!=='object')state.skillReviews={}}
function skillReview(id){ensureSkillState();return state.skillReviews[id]||{packageRef:'',reviewer:'',notes:'',checks:{}}}
function checkedSteps(review){return SKILL_VERIFICATION_STEPS.filter(([k])=>Boolean(review.checks?.[k])).length}
function skillReadiness(id){
  const r=skillReview(id),count=checkedSteps(r);
  if(r.packageRef&&count===SKILL_VERIFICATION_STEPS.length)return {key:'Ready',label:'Marked integration-ready',tone:'high',count};
  if(r.packageRef||count)return {key:'Review',label:'Verification in progress',tone:'low',count};
  return {key:'Missing',label:'Package not supplied',tone:'neutral',count};
}
function skillInventoryReport(){
  ensureSkillState();return {total:CONSULTING_SKILL_DATA.length,groups:CONSULTING_SKILL_GROUPS.length,packagesReferenced:CONSULTING_SKILL_DATA.filter(s=>Boolean(skillReview(s.id).packageRef)).length,inReview:CONSULTING_SKILL_DATA.filter(s=>skillReadiness(s.id).key==='Review').length,markedReady:CONSULTING_SKILL_DATA.filter(s=>skillReadiness(s.id).key==='Ready').length};
}
function skillCsv(){
  const rows=[['Skill ID','Skill name','Category','Purpose','Suggested accelerator application','Indicative routing intent','Indicative input','Indicative output','Package reference','Reviewer / owner','Verification state','Checklist completed','Notes']];
  CONSULTING_SKILL_DATA.forEach(s=>{const r=skillReview(s.id),st=skillReadiness(s.id);rows.push([s.id,s.name,CONSULTING_SKILL_GROUPS.find(g=>g.id===s.group).label,s.purpose,s.application,s.routingIntent,s.inputHint,s.outputHint,r.packageRef||'',r.reviewer||'',st.label,`${st.count}/${SKILL_VERIFICATION_STEPS.length}`,r.notes||''])});
  downloadCsv('enterprise-ai-consulting-skill-inventory.csv',rows);
}
function skillRouterJson(){
  const data={version:'0.3',exportedAt:new Date().toISOString(),warning:'Descriptive catalogue only; not an executable tool manifest. Verify real packages and enforce runtime authorization before any orchestration.',skills:CONSULTING_SKILL_DATA.map(s=>{const review=skillReview(s.id),st=skillReadiness(s.id);return {id:s.id,name:s.name,category:s.group,indicativeIntent:s.routingIntent,expectedInput:s.inputHint,expectedOutput:s.outputHint,packageReference:review.packageRef||null,executionEligible:st.key==='Ready',reviewChecklistComplete:st.count===SKILL_VERIFICATION_STEPS.length}})};
  const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='consulting-skill-router-candidates.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
function skillCardRow(skill){
  const group=CONSULTING_SKILL_GROUPS.find(g=>g.id===skill.group),st=skillReadiness(skill.id);
  return `<button type="button" class="skill-item ${skillUI.selectedId===skill.id?'selected':''}" data-skill-select="${skill.id}" aria-pressed="${skillUI.selectedId===skill.id}"><span class="skill-row-top"><b>${skill.id}</b><span class="tag ${st.tone==='neutral'?'':st.tone}">${st.key==='Ready'?'Ready for gate review':st.key==='Review'?'In verification':'Package missing'}</span></span><strong>${esc(skill.name)}</strong><span class="small muted">${esc(group.short)} · ${esc(skill.application)}</span></button>`;
}
function skillDetail(skill){
  const review=skillReview(skill.id),st=skillReadiness(skill.id),group=CONSULTING_SKILL_GROUPS.find(g=>g.id===skill.group);
  return `<div class="skill-detail-head"><span class="eyebrow">${skill.id} · ${esc(group.label)}</span><h2>${esc(skill.name)}</h2><p>${esc(skill.purpose)}</p><span class="tag ${st.tone==='neutral'?'':st.tone}">${st.label} · ${st.count}/${SKILL_VERIFICATION_STEPS.length} checks</span></div>
  <div class="skill-application"><b>Suggested consulting application</b><p>${esc(skill.application)}</p><div class="skill-io"><div><span>Candidate routing intent</span><strong>${esc(skill.routingIntent)}</strong></div><div><span>Indicative input</span><strong>${esc(skill.inputHint)}</strong></div><div><span>Indicative output</span><strong>${esc(skill.outputHint)}</strong></div></div><p class="small muted">Proposed from the supplied descriptions; verify against the downloaded package before implementation.</p></div>
  <h3>Onboarding & execution verification</h3><p class="small muted">A status is self-attested in this browser. This public prototype cannot inspect packages or grant runtime approval.</p>
  <div class="skill-checklist">${SKILL_VERIFICATION_STEPS.map(([key,label])=>`<label class="skill-check"><input type="checkbox" data-skill-check="${key}" ${review.checks?.[key]?'checked':''}><span>${esc(label)}</span></label>`).join('')}</div>
  <div class="field"><label for="skill-source">Safe package reference / internal catalogue ID</label><input id="skill-source" data-skill-review="packageRef" value="${esc(review.packageRef||'')}" maxlength="160" placeholder="Metadata reference only; no credential or package upload"></div>
  <div class="field"><label for="skill-reviewer">Review owner (role or team)</label><input id="skill-reviewer" data-skill-review="reviewer" value="${esc(review.reviewer||'')}" maxlength="100" placeholder="e.g. AI Consulting CoE"></div>
  <div class="field"><label for="skill-notes">Verification notes / execution prerequisites</label><textarea id="skill-notes" data-skill-review="notes" rows="3" maxlength="1500" placeholder="Record package version, validation gaps, approved runtime dependencies; do not enter confidential content">${esc(review.notes||'')}</textarea></div>
  <div class="callout ${st.key==='Ready'?'':'warning'}"><b>${st.key==='Ready'?'All six onboarding checks marked complete.':'Execution remains disabled in this MVP.'}</b> ${st.key==='Ready'?'A production orchestrator must still independently verify artifacts, identities, permissions and approvals.':'Obtain and inspect the actual package, complete verification and enforce enterprise access policies before routing calls to this skill.'}</div>`;
}
function skillInventory(){
  ensureSkillState();const metrics=skillInventoryReport(),search=skillUI.search.trim().toLowerCase();
  const matches=CONSULTING_SKILL_DATA.filter(s=>{
    if(skillUI.group!=='All'&&s.group!==skillUI.group)return false;
    if(skillUI.status!=='All'&&skillReadiness(s.id).key!==skillUI.status)return false;
    return !search||`${s.id} ${s.name} ${s.purpose} ${s.application} ${s.routingIntent}`.toLowerCase().includes(search);
  });
  const selected=CONSULTING_SKILL_DATA.find(s=>s.id===skillUI.selectedId)||CONSULTING_SKILL_DATA[0];
  return `<div class="callout skill-notice"><b>Catalogue scope:</b> These 21 names and descriptions were supplied for inventory purposes. No packages have been uploaded, inspected, licensed, installed or executed. Brand- or enterprise-specific skills require owner authorization before use or redistribution. Do not store confidential implementation details on this public static site.</div>
  <div class="grid four skill-kpis">${card(`<div class="small muted">Skills catalogued</div><div class="kpi">${metrics.total}</div><span class="pill blue">5 categories</span>`)}${card(`<div class="small muted">Package references added</div><div class="kpi">${metrics.packagesReferenced}</div><span class="pill">Metadata only</span>`)}${card(`<div class="small muted">Skills in verification</div><div class="kpi">${metrics.inReview}</div><span class="pill amber">Checks incomplete</span>`)}${card(`<div class="small muted">Marked integration-ready</div><div class="kpi">${metrics.markedReady}</div><span class="pill blue">Self-attested only</span>`)}</div>
  ${section('Complete consulting skill catalogue','Discover reusable capabilities, review intended use and maintain an execution-readiness inventory.')}
  <div class="skill-category-strip">${CONSULTING_SKILL_GROUPS.map(g=>`<button type="button" class="skill-category ${skillUI.group===g.id?'active':''}" data-skill-category="${g.id}"><span>${esc(g.short)}</span><b>${CONSULTING_SKILL_DATA.filter(s=>s.group===g.id).length}</b></button>`).join('')}</div>
  <div class="skill-toolbar"><div class="field"><label for="skill-search">Find skill or use case</label><input id="skill-search" data-skill-search value="${esc(skillUI.search)}" placeholder="e.g. briefing, RFP, architecture, red-team"></div><div class="field"><label for="skill-group">Category</label><select id="skill-group" data-skill-group><option value="All">All 5 categories</option>${CONSULTING_SKILL_GROUPS.map(g=>`<option value="${g.id}" ${skillUI.group===g.id?'selected':''}>${esc(g.label)}</option>`).join('')}</select></div><div class="field"><label for="skill-status">Verification status</label><select id="skill-status" data-skill-status>${[['All','All statuses'],['Missing','Package not supplied'],['Review','In verification'],['Ready','Marked integration-ready']].map(([v,n])=>`<option value="${v}" ${skillUI.status===v?'selected':''}>${n}</option>`).join('')}</select></div></div>
  <div class="skill-layout">${card(`<div class="skill-list-head"><h2>Skill inventory <span class="small muted">${matches.length} of 21</span></h2><span class="small muted">Select a skill to review</span></div><div class="skill-list">${matches.map(skillCardRow).join('')||'<div class="empty">No skills match these filters.</div>'}</div>`,'skill-list-card')}${card(skillDetail(selected),'skill-detail-card')}</div>
  ${section('Governed skill onboarding and agent routing','The router must only call a skill after its package, runtime, permissions and human approval have been verified.')}
  ${card(`<div class="skill-route"><span>Business / consultant request</span><b>→</b><span>Intent & context router</span><b>→</b><span>Authorized skill candidate</span><b>→</b><span>Policy + approval gate</span><b>→</b><span>Execution adapter & evaluation</span></div><div class="callout" style="margin-top:16px"><b>What this release provides:</b> inventory and readiness metadata. <b>What it does not provide:</b> runtime installation, model/tool credentials, skill execution or an active agent router. Exported routing candidates are not executable manifests.</div><div class="action-row"><button type="button" class="secondary" id="export-skills-csv">Export 21-skill inventory CSV</button><button type="button" class="primary" id="export-skill-router">Export governed router candidates JSON</button></div>`)}`;
}
function wireSkillInventory(){
  if(page!=='skills')return;
  document.querySelectorAll('[data-skill-select]').forEach(x=>x.onclick=()=>{skillUI.selectedId=x.dataset.skillSelect;skillUI.notice='';render()});
  document.querySelectorAll('[data-skill-category]').forEach(x=>x.onclick=()=>{skillUI.group=skillUI.group===x.dataset.skillCategory?'All':x.dataset.skillCategory;render()});
  document.querySelectorAll('[data-skill-group]').forEach(x=>x.onchange=()=>{skillUI.group=x.value;render()});
  document.querySelectorAll('[data-skill-status]').forEach(x=>x.onchange=()=>{skillUI.status=x.value;render()});
  document.querySelectorAll('[data-skill-search]').forEach(x=>x.oninput=()=>{const pos=x.selectionStart;skillUI.search=x.value;render();const next=el('skill-search');next.focus();next.setSelectionRange(pos,pos)});
  document.querySelectorAll('[data-skill-check]').forEach(x=>x.onchange=()=>{ensureSkillState();const r=state.skillReviews[skillUI.selectedId]||{packageRef:'',reviewer:'',notes:'',checks:{}};r.checks[x.dataset.skillCheck]=x.checked;state.skillReviews[skillUI.selectedId]=r;persist();render()});
  document.querySelectorAll('[data-skill-review]').forEach(x=>x.onchange=()=>{ensureSkillState();const r=state.skillReviews[skillUI.selectedId]||{packageRef:'',reviewer:'',notes:'',checks:{}};r[x.dataset.skillReview]=x.value.trim();state.skillReviews[skillUI.selectedId]=r;persist();render()});
  el('export-skills-csv')?.addEventListener('click',skillCsv);
  el('export-skill-router')?.addEventListener('click',skillRouterJson);
}

function architectureSkillCallout(){return card(`<div class="evidence-overview"><div><h3>Consulting skill inventory · 21 reusable capability candidates</h3><p class="muted">Search consulting research, strategy, presentation, delivery and authoring-standard skills. Review actual packages and security gates before agent routing.</p></div><button type="button" class="primary" data-go="skills">Explore 21 Skills →</button></div>`,'skill-architecture-callout')}
