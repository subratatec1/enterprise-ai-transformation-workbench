// First executable-skill pilot: a transparent local extractive preview.
// It does NOT call an LLM. Model-backed execution is provided by the separate
// governed skill package and must run in an authenticated backend or agent.
const SUMMARY_SAMPLE=`Fictional insurance transformation programme — weekly checkpoint
The application inventory is 80% complete across the initial business scope.
The team has identified 12 applications requiring lifecycle-owner validation.
Decision: Architecture steering group approved a two-week extension for ownership checks.
Risk: Unverified owners may delay the target-state architecture review.
Action: Enterprise Architecture team to validate 12 ownership assignments by 20 November 2026.
The cloud migration business case remains under Finance review.
Next steering meeting is scheduled for 24 November 2026.`;

const summaryUI={source:SUMMARY_SAMPLE,audience:'CIO / CTO',result:null,error:'',notice:''};

function createSummaryPreview(text){
  const raw=String(text||'');
  if(raw.trim().length<60)throw new Error('Add at least 60 characters of source notes to create a meaningful preview.');
  if(raw.length>12000)throw new Error('The local preview supports up to 12,000 characters. Use approved document processing for larger files.');
  const all=raw.split(/\r?\n/);
  const lines=all.map((value,index)=>({id:`S1:L${index+1}`,text:value.trim()})).filter(x=>x.text);
  const categorized={findings:[],decisions:[],risks:[],actions:[],context:[]};
  for(const entry of lines){
    const value=entry.text;
    if(/^(decision|approved|agreed)\s*:/i.test(value))categorized.decisions.push(entry);
    else if(/^(risk|issue|blocker|dependency)\s*:/i.test(value))categorized.risks.push(entry);
    else if(/^(action|next step|follow[- ]up)\s*:/i.test(value))categorized.actions.push(entry);
    else if(/\b\d+(?:\.\d+)?\s*%|\b\d+\s+(?:applications|systems|teams|people)\b|\b(?:completed?|progress|target)\b/i.test(value))categorized.findings.push(entry);
    else categorized.context.push(entry);
  }
  const topFindings=categorized.findings.slice(0,4);
  const takeaway=[...topFindings.slice(0,2),...categorized.decisions.slice(0,1)];
  return {title:categorized.context[0]?.text||'Executive evidence extract',totalLines:all.length,nonEmptyLines:lines.length,findings:topFindings,decisions:categorized.decisions,risks:categorized.risks,actions:categorized.actions,takeaway,questions:categorized.risks.length?['What mitigation and decision are needed for the identified risks?']:[],sourceName:'Pasted source notes',method:'Offline extractive preview — verbatim source lines; no AI model called'};
}

function summaryEvidenceRows(rows,empty){
  return rows.length?`<ul class="summary-evidence-list">${rows.map(x=>`<li><span>${esc(x.text)}</span><small>${esc(x.id)}</small></li>`).join('')}</ul>`:`<p class="summary-empty">${empty}</p>`;
}

function summaryPreviewMarkdown(r){
  const list=(title,items)=>`## ${title}\n${items.length?items.map(i=>`- ${i.text} [${i.id}]`).join('\n'):'Not established in the provided notes.'}\n`;
  return `# Management Summary — Source-linked preview\n\nAudience: ${summaryUI.audience}\nMethod: Offline extractive; no LLM invoked.\nSource: Pasted source notes (${r.nonEmptyLines} nonblank lines)\n\n## Executive takeaway\n${r.takeaway.length?r.takeaway.map(x=>`- ${x.text} [${x.id}]`).join('\n'):'Insufficient explicit evidence for an executive takeaway.'}\n\n${list('Key findings',r.findings)}\n${list('Decisions',r.decisions)}\n${list('Risks and dependencies',r.risks)}\n${list('Actions',r.actions)}\n## Open questions\n${r.questions.length?r.questions.map(q=>'- '+q).join('\n'):'Review missing context and confirm the next management decisions.'}\n\nNote: Extracted statements are not independently fact-checked. Validate against authorized source material before client use.\n`;
}

function managementSummaryPilot(){
  const r=summaryUI.result;
  return `<div class="summary-pilot">
    <div class="summary-banner"><div><span class="summary-eyebrow">FIRST WORKING SKILL · CS-008</span><h2>Management Summary Generator</h2><p>Transform project notes into decision-ready management outputs with traceable evidence. This public interface demonstrates the extraction and evidence contract locally; full AI synthesis requires the separately approved skill runtime.</p></div><div class="summary-banner-mark">01<span>/20</span></div></div>
    <div class="summary-stage"><span>01 &nbsp; Provide source</span><b>→</b><span>02 &nbsp; Identify evidence</span><b>→</b><span>03 &nbsp; Review summary</span><b>→</b><span>04 &nbsp; Export</span></div>
    <div class="callout summary-safe-note"><b>Public sandbox · No AI endpoint connected.</b> Your text is processed in this browser only, is not submitted to a server, and is not saved in local storage. Use the fictional sample or non-confidential notes. AI model-backed execution is available through the source skill package when deployed in a secured runtime.</div>
    <div class="summary-workspace-grid">
      <section class="summary-pane"><div class="summary-pane-header"><div><span>INPUT</span><h3>Source notes</h3></div><span class="summary-badge">Local only</span></div>
        <div class="field"><label for="summary-audience">Management audience</label><select id="summary-audience">${['CIO / CTO','Steering Committee','Programme Leadership','Executive Sponsor'].map(x=>`<option ${summaryUI.audience===x?'selected':''}>${esc(x)}</option>`).join('')}</select></div>
        <div class="field"><label for="summary-source">Approved text / meeting notes</label><textarea id="summary-source" rows="14" maxlength="12000" placeholder="Paste non-confidential notes or select the fictional sample">${esc(summaryUI.source)}</textarea></div>
        <div class="summary-input-actions"><button type="button" class="primary" id="summary-run">Generate local preview ↗</button><button type="button" class="secondary" id="summary-example">Use fictional sample</button><button type="button" class="secondary" id="summary-clear">Clear</button></div>
        ${summaryUI.error?`<p class="summary-error" role="alert">${esc(summaryUI.error)}</p>`:''}
        <p class="small muted">For PDF/DOCX inputs, use an approved extraction service. This starter accepts pasted text only.</p>
      </section>
      <section class="summary-pane summary-output"><div class="summary-pane-header"><div><span>OUTPUT</span><h3>Management briefing preview</h3></div><span class="summary-badge">${r?'Evidence linked':'Awaiting input'}</span></div>
        ${r?`<div class="summary-result-head"><span>OFFLINE EXTRACTIVE DEMO</span><h3>${esc(r.title)}</h3><p>${r.nonEmptyLines} nonblank source lines · ${r.takeaway.length} prioritized excerpts · 100% of displayed excerpts carry source-line IDs</p></div>
          <div class="summary-result"><h4>Executive takeaway</h4>${summaryEvidenceRows(r.takeaway,'No prioritized statements identified. Add clearer status or decision notes.')}
          <h4>Key findings</h4>${summaryEvidenceRows(r.findings,'No quantified or progress-related statements identified.')}
          <h4>Decisions</h4>${summaryEvidenceRows(r.decisions,'No explicit decisions recorded in the notes.')}
          <h4>Risks & dependencies</h4>${summaryEvidenceRows(r.risks,'No explicitly labelled risks recorded.')}
          <h4>Actions</h4>${summaryEvidenceRows(r.actions,'No explicit actions recorded.')}</div>
          <div class="summary-output-actions"><button class="primary" type="button" id="summary-download">Export Markdown summary</button><button class="secondary" type="button" id="summary-copy">Copy AI skill request</button></div>`:
          `<div class="summary-empty-preview"><div class="summary-preview-icon">▤</div><strong>Your source-linked output appears here</strong><p>Select the sample or paste non-confidential notes, then run the local preview to inspect findings, decisions, risks, actions and line references.</p></div>`}
        <p class="small muted" aria-live="polite">${esc(summaryUI.notice)}</p>
      </section>
    </div>
    <div class="summary-footer-grid"><article><span>MODEL-BACKED SKILL PACKAGE</span><h3>Ready for controlled execution</h3><p>A reusable <code>SKILL.md</code>, sample evidence, quality rubric, Python model-gateway runner and contract tests are supplied separately. The model endpoint and credentials are configured only in an approved runtime.</p><a href="https://github.com/subratatec1/enterprise-ai-transformation-workbench/tree/main/skills/management-summary-generator" target="_blank" rel="noopener noreferrer">Explore skill source & tests ↗</a></article><article><span>QUALITY & GOVERNANCE</span><h3>What still requires validation?</h3><p>Semantic accuracy, source support, licensing, data handling, model performance and accountable approval. The static preview does not represent an AI-generated management conclusion.</p><button type="button" class="secondary" data-go="skills">View skill verification checklist ↗</button></article></div>
  </div>`;
}

function wireManagementSummaryPilot(){
  if(page!=='summary')return;
  const source=el('summary-source');
  source.oninput=()=>{summaryUI.source=source.value;summaryUI.error='';if(summaryUI.result){const pos=source.selectionStart;summaryUI.result=null;summaryUI.notice='Source changed. Regenerate to see updated evidence.';render();const next=el('summary-source');next.focus();next.setSelectionRange(pos,pos)}};
  el('summary-audience').onchange=e=>{summaryUI.audience=e.target.value;};
  el('summary-run').onclick=()=>{try{summaryUI.result=createSummaryPreview(summaryUI.source);summaryUI.error='';summaryUI.notice='Source-linked local preview generated; review content before use.';}catch(error){summaryUI.result=null;summaryUI.error=error.message;summaryUI.notice='';}render()};
  el('summary-example').onclick=()=>{summaryUI.source=SUMMARY_SAMPLE;summaryUI.error='';summaryUI.result=null;summaryUI.notice='Fictional sample restored.';render()};
  el('summary-clear').onclick=()=>{summaryUI.source='';summaryUI.error='';summaryUI.result=null;summaryUI.notice='Source notes cleared from the page.';render()};
  el('summary-download')?.addEventListener('click',()=>{if(!summaryUI.result)return;const blob=new Blob([summaryPreviewMarkdown(summaryUI.result)],{type:'text/markdown;charset=utf-8'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='management-summary-source-linked-preview.md';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)});
  el('summary-copy')?.addEventListener('click',async()=>{const prompt='Use $management-summary-generator to prepare a concise evidence-led CIO/CTO management summary from the notes I provide. Separate facts, approved decisions, risks, actions and open questions; cite each source and flag gaps. Do not invent details.';try{await navigator.clipboard.writeText(prompt);summaryUI.notice='Skill request copied. Paste your approved source notes separately into a governed AI workspace.';}catch{summaryUI.notice='Clipboard unavailable. Use the Management Summary Generator skill by name in your approved AI workspace.';}const notice=document.querySelector('.summary-output-actions + .small');if(notice)notice.textContent=summaryUI.notice;});
}
