// Evidence & Assessment workspace. All records stay in the visitor's browser unless exported.
let evidenceUI={tab:'questions',dimension:'All',questionFilter:'All',search:'',channel:'All',status:'All',editId:null,prefillQuestion:'',prefillChannel:'Document',message:''};
const EVIDENCE_STATUSES=['Requested','Received','Verified','Rejected'];
const EVIDENCE_CONFIDENCES=['Not evaluated','Low','Medium','High'];
const QUESTION_LEVELS=['Not assessed','1 · Initial','2 · Emerging','3 · Developing','4 · Established','5 · AI-native'];

function ensureEvidenceState(){
  if(!state.assessment||typeof state.assessment!=='object')state.assessment={};
  if(!state.assessment.ratings||typeof state.assessment.ratings!=='object')state.assessment.ratings={};
  if(!state.assessment.notes||typeof state.assessment.notes!=='object')state.assessment.notes={};
  if(!Array.isArray(state.evidence))state.evidence=[];
}
function linkedEvidence(questionId){ensureEvidenceState();return state.evidence.filter(e=>Array.isArray(e.questionIds)&&e.questionIds.includes(questionId))}
function verifiedEvidence(questionId){return linkedEvidence(questionId).filter(e=>e.status==='Verified')}
function assessmentReport(){
  ensureEvidenceState();
  const rated=QUESTION_DATA.filter(q=>state.assessment.ratings[q.id]>=1&&state.assessment.ratings[q.id]<=5);
  const backed=rated.filter(q=>verifiedEvidence(q.id).length>0);
  const dimensions=Object.entries(DIMENSION_GUIDE).map(([id,info],index)=>{
    const questions=QUESTION_DATA.filter(q=>q.dimension===id);
    const answered=questions.filter(q=>state.assessment.ratings[q.id]>=1&&state.assessment.ratings[q.id]<=5);
    const evidenced=answered.filter(q=>verifiedEvidence(q.id).length>0);
    const average=answered.length?answered.reduce((sum,q)=>sum+Number(state.assessment.ratings[q.id]),0)/answered.length:null;
    return {id,label:info.label,index,total:questions.length,rated:answered.length,backed:evidenced.length,average,complete:answered.length===questions.length&&evidenced.length===questions.length};
  });
  return {total:QUESTION_DATA.length,rated:rated.length,backed:backed.length,verifiedRecords:state.evidence.filter(e=>e.status==='Verified').length,requestedRecords:state.evidence.filter(e=>e.status==='Requested').length,dimensions,completeDimensions:dimensions.filter(d=>d.complete).length};
}
function csvValue(v){return '"'+String(v??'').replace(/"/g,'""').replace(/\r?\n/g,' ')+'"'}
function downloadCsv(filename,rows){const csv='\uFEFF'+rows.map(row=>row.map(csvValue).join(',')).join('\r\n');const a=document.createElement('a');const u=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8;'}));a.href=u;a.download=filename;a.click();setTimeout(()=>URL.revokeObjectURL(u),1000)}
function exportQuestionCatalogue(){
  ensureEvidenceState();
  const rows=[['Question ID','Dimension','Assessment criterion','Suggested evidence','Preferred channel','Suggested owner','Score (1-5)','Verified evidence count','Evidence references','Consultant notes']];
  QUESTION_DATA.forEach(q=>rows.push([q.id,DIMENSION_GUIDE[q.dimension].label,q.text,q.expectedEvidence,q.channel,q.owner,state.assessment.ratings[q.id]||'',verifiedEvidence(q.id).length,linkedEvidence(q.id).map(e=>e.id).join('; '),state.assessment.notes[q.id]||'']));
  downloadCsv('ai-assessment-question-catalogue.csv',rows);
}
function exportEvidenceRegister(){
  ensureEvidenceState();
  const rows=[['Evidence ID','Title','Collection channel','Question IDs','Source reference','Evidence owner','Evidence date','Status','Confidence','Review notes','Recorded at']];
  state.evidence.forEach(e=>rows.push([e.id,e.title,e.channel,(e.questionIds||[]).join('; '),e.reference,e.owner,e.date,e.status,e.confidence,e.notes,e.createdAt]));
  downloadCsv('ai-evidence-register.csv',rows);
}
function ratingControl(q){const score=Number(state.assessment.ratings[q.id]||0);return `<select class="question-rating" data-question-score="${q.id}" aria-label="Maturity score for ${q.id}">${QUESTION_LEVELS.map((v,i)=>`<option value="${i}" ${i===score?'selected':''}>${v}</option>`).join('')}</select>`}
function questionTable(){
  const search=evidenceUI.search.trim().toLowerCase();
  const qs=QUESTION_DATA.filter(q=>{
    if(evidenceUI.dimension!=='All'&&q.dimension!==evidenceUI.dimension)return false;
    if(evidenceUI.questionFilter==='Unscored'&&Number(state.assessment.ratings[q.id]))return false;
    if(evidenceUI.questionFilter==='Missing verified proof'&&verifiedEvidence(q.id).length)return false;
    return !search||`${q.id} ${q.text} ${q.expectedEvidence} ${q.owner}`.toLowerCase().includes(search);
  });
  const rows=qs.map(q=>{
    const links=linkedEvidence(q.id),verified=verifiedEvidence(q.id).length,score=Number(state.assessment.ratings[q.id]||0);
    const flag=verified?`<span class="tag high">${verified} verified</span>`:links.length?`<span class="tag low">${links.length} pending</span>`:`<span class="tag">No evidence</span>`;
    return `<tr><td><b>${q.id}</b><div class="small muted">${esc(DIMENSION_GUIDE[q.dimension].label)}</div></td><td class="question-text"><b>${esc(q.text)}</b><div class="question-proof"><span class="small muted">Suggested proof:</span> ${esc(q.expectedEvidence)}</div><div class="small muted">${esc(q.channel)} · ${esc(q.owner)}</div><details><summary class="small">Consultant notes ${state.assessment.notes[q.id]?'· saved':''}</summary><textarea data-question-note="${q.id}" rows="2" placeholder="Interview finding, contradiction, or score rationale (no sensitive data)">${esc(state.assessment.notes[q.id]||'')}</textarea></details></td><td>${ratingControl(q)}</td><td>${flag}${score&&!verified?'<div class="small evidence-pending">Score provisional</div>':''}</td><td><button type="button" class="mini-action" data-request-question="${q.id}">Log evidence</button></td></tr>`
  }).join('');
  return `<div class="evidence-tools"><div class="field"><label for="evidence-dimension">Assessment dimension</label><select id="evidence-dimension" data-evidence-dimension><option value="All">All 10 dimensions</option>${Object.entries(DIMENSION_GUIDE).map(([k,v])=>`<option value="${k}" ${evidenceUI.dimension===k?'selected':''}>${esc(v.label)}</option>`).join('')}</select></div><div class="field"><label for="evidence-question-filter">Coverage status</label><select id="evidence-question-filter" data-evidence-question-filter>${['All','Unscored','Missing verified proof'].map(x=>`<option ${evidenceUI.questionFilter===x?'selected':''}>${x}</option>`).join('')}</select></div><div class="field evidence-search"><label for="evidence-search">Search catalogue</label><input id="evidence-search" data-evidence-search value="${esc(evidenceUI.search)}" placeholder="e.g. AGT.5, rollback, Finance"></div></div>
  <div class="table-wrap"><table class="evidence-table"><thead><tr><th style="min-width:95px">Criterion</th><th>Question and recommended evidence</th><th style="min-width:153px">Score</th><th style="min-width:116px">Proof coverage</th><th>Action</th></tr></thead><tbody>${rows||'<tr><td colspan="5" class="empty">No questions match these filters.</td></tr>'}</tbody></table></div><p class="small muted">Showing ${qs.length} of ${QUESTION_DATA.length} criteria. A score without verified evidence remains provisional. Record only metadata and safe references here.</p>`;
}
function evidenceForm(){
  const edit=state.evidence.find(e=>e.id===evidenceUI.editId)||null;
  const first=edit?.questionIds?.[0]||evidenceUI.prefillQuestion||'';
  const extra=edit?.questionIds?.slice(1).join(', ')||'';
  const channel=edit?.channel||evidenceUI.prefillChannel;
  return `${card(`<div class="evidence-form-head"><div><h2>${edit?'Update evidence record':'Create an evidence record'}</h2><p class="muted small">Register an evidence request, extract, interview or validation result. No file is uploaded.</p></div><span class="pill blue">Metadata only</span></div>
  <form id="evidence-form"><div class="evidence-form-grid"><div class="field evidence-wide"><label for="ev-title">Evidence title *</label><input id="ev-title" name="title" required maxlength="160" value="${esc(edit?.title||'')}" placeholder="e.g. AI CoE charter, approved FY27"></div><div class="field"><label for="ev-channel">Collection method *</label><select id="ev-channel" name="channel">${EVIDENCE_CHANNELS.map(c=>`<option value="${c.id}" ${channel===c.id?'selected':''}>${esc(c.label)}</option>`).join('')}</select></div><div class="field"><label for="ev-question">Linked assessment question *</label><select id="ev-question" name="question" required><option value="">Select a criterion</option>${QUESTION_DATA.map(q=>`<option value="${q.id}" ${first===q.id?'selected':''}>${q.id} · ${esc(q.text.slice(0,64))}…</option>`).join('')}</select></div><div class="field"><label for="ev-extra">Additional question IDs</label><input id="ev-extra" name="extra" value="${esc(extra)}" placeholder="e.g. AGT.5, GOV.4"></div><div class="field"><label for="ev-ref">Safe evidence reference</label><input id="ev-ref" name="reference" maxlength="160" value="${esc(edit?.reference||'')}" placeholder="Document ID / system report ID (no secrets)"></div><div class="field"><label for="ev-owner">Client source / owner</label><input id="ev-owner" name="owner" maxlength="100" value="${esc(edit?.owner||'')}" placeholder="e.g. Head of AI Engineering"></div><div class="field"><label for="ev-date">Evidence date</label><input id="ev-date" name="date" type="date" value="${esc(edit?.date||'')}"></div><div class="field"><label for="ev-status">Review status</label><select id="ev-status" name="status">${EVIDENCE_STATUSES.map(s=>`<option ${s===(edit?.status||'Requested')?'selected':''}>${s}</option>`).join('')}</select></div><div class="field"><label for="ev-confidence">Reviewer confidence</label><select id="ev-confidence" name="confidence">${EVIDENCE_CONFIDENCES.map(s=>`<option ${s===(edit?.confidence||'Not evaluated')?'selected':''}>${s}</option>`).join('')}</select></div><div class="field evidence-wide"><label for="ev-notes">Review findings / limitations</label><textarea id="ev-notes" name="notes" rows="2" maxlength="1000" placeholder="Describe what was inspected, dates, sample size, limitations; do not paste sensitive content">${esc(edit?.notes||'')}</textarea></div></div><div class="action-row"><button type="submit" class="primary">${edit?'Save changes':'Add to register'}</button>${edit?'<button type="button" class="secondary" id="cancel-evidence-edit">Cancel edit</button>':''}</div><div class="form-error" id="evidence-form-error" aria-live="polite"></div></form>`)}`;
}
function evidenceRegister(){
  const entries=state.evidence.filter(e=>(evidenceUI.channel==='All'||e.channel===evidenceUI.channel)&&(evidenceUI.status==='All'||e.status===evidenceUI.status));
  const records=entries.map(e=>`<tr><td><b>${esc(e.id)}</b><div class="small muted">${esc(e.channel)}</div></td><td><b>${esc(e.title)}</b><div class="small muted">${esc(e.reference||'No reference supplied')}</div><div class="small muted">${esc(e.owner||'Owner pending')} · ${esc(e.date||'Date pending')}</div></td><td>${(e.questionIds||[]).map(id=>`<span class="question-id">${esc(id)}</span>`).join('')}</td><td><select aria-label="Status of ${esc(e.id)}" data-record-status="${esc(e.id)}">${EVIDENCE_STATUSES.map(s=>`<option ${e.status===s?'selected':''}>${s}</option>`).join('')}</select><div class="small muted">${esc(e.confidence||'Not evaluated')} confidence</div></td><td><button type="button" class="mini-action" data-record-edit="${esc(e.id)}">Edit</button><button type="button" class="mini-action danger-text" data-record-delete="${esc(e.id)}">Remove</button></td></tr>`).join('');
  return `${evidenceForm()}${section('Evidence register',`Track who supplied evidence, what it supports and whether it has been independently verified. ${state.evidence.length} total record(s).`)}
  ${card(`<div class="evidence-tools compact"><div class="field"><label>Collection method</label><select data-record-channel><option value="All">All channels</option>${EVIDENCE_CHANNELS.map(c=>`<option value="${c.id}" ${evidenceUI.channel===c.id?'selected':''}>${esc(c.label)}</option>`).join('')}</select></div><div class="field"><label>Review status</label><select data-record-filter-status>${['All',...EVIDENCE_STATUSES].map(s=>`<option value="${s}" ${evidenceUI.status===s?'selected':''}>${s==='All'?'All statuses':s}</option>`).join('')}</select></div></div><div class="table-wrap"><table class="evidence-table"><thead><tr><th>Evidence ID</th><th>Source / reference</th><th>Linked criteria</th><th>Status & confidence</th><th>Actions</th></tr></thead><tbody>${records||'<tr><td colspan="5" class="empty">No evidence recorded for this filter. Add a metadata reference above to get started.</td></tr>'}</tbody></table></div>`)}`;
}
function evidence(){
  ensureEvidenceState();const r=assessmentReport();
  return `<div class="callout evidence-notice"><b>Client data protection:</b> This public prototype records evidence metadata and reference IDs only. Do not paste confidential documents, personal data, API keys or regulated records. Entries stay in this browser's local storage until exported or reset; there is no central repository or access control.</div>
  <div class="grid four evidence-kpis">${card(`<div class="small muted">Assessment criteria</div><div class="kpi">${r.total}</div><span class="pill blue">10 dimensions</span>`)}${card(`<div class="small muted">Questions scored</div><div class="kpi">${r.rated}<span class="small muted"> / ${r.total}</span></div><span class="pill">${Math.round(r.rated/r.total*100)}% complete</span>`)}${card(`<div class="small muted">Evidence-backed scores</div><div class="kpi">${r.backed}<span class="small muted"> / ${r.total}</span></div><span class="pill amber">Verified proof required</span>`)}${card(`<div class="small muted">Verified evidence records</div><div class="kpi">${r.verifiedRecords}</div><span class="pill blue">${r.requestedRecords} requests outstanding</span>`)}</div>
  ${section('Four evidence collection methods','Use complementary sources. An interview statement alone should not be treated as proof of an operational control.')}
  <div class="grid two evidence-channels">${EVIDENCE_CHANNELS.map(c=>`<div class="channel-card ${c.theme}"><div class="channel-symbol">${c.icon}</div><h3>${esc(c.label)}</h3><p>${esc(c.description)}</p><span class="channel-format">${esc(c.formats)}</span><button type="button" data-channel-start="${c.id}" class="mini-action">Register this evidence →</button></div>`).join('')}</div>
  ${section('Assessment and evidence management','Rate the maturity criteria, capture provenance and verify supporting proof.')}
  <div class="evidence-tabbar"><button class="${evidenceUI.tab==='questions'?'active':''}" type="button" data-evidence-tab="questions">Assessment-question catalogue <span>${r.total}</span></button><button class="${evidenceUI.tab==='register'?'active':''}" type="button" data-evidence-tab="register">Evidence register <span>${state.evidence.length}</span></button><div class="evidence-tab-actions"><button type="button" class="secondary" id="download-question-csv">Export question catalogue CSV</button><button type="button" class="secondary" id="download-register-csv">Export evidence register CSV</button></div></div>
  ${evidenceUI.message?`<div class="callout evidence-success" role="status">${esc(evidenceUI.message)}</div>`:''}
  ${evidenceUI.tab==='questions'?card(`<h2>43-question enterprise AI maturity catalogue</h2><p class="muted small">Score 1–5 against observed capability. Each question includes the suggested proof and likely client owner. The evidence register links supporting artifacts to these scores.</p>${questionTable()}`):evidenceRegister()}
  ${section('Evidence-led maturity roll-up','A dimension can update the Strategy & Roadmap score only when all its questions have a score and verified supporting evidence.')}
  ${card(`<div class="table-wrap"><table class="rollup-table"><thead><tr><th>Dimension</th><th>Questions scored</th><th>Scores with verified evidence</th><th>Mean score</th><th>Readiness</th></tr></thead><tbody>${r.dimensions.map(d=>`<tr><td><b>${esc(d.label)}</b></td><td>${d.rated} / ${d.total}</td><td>${d.backed} / ${d.total}</td><td>${d.average===null?'—':d.average.toFixed(2)+' / 5'}</td><td>${d.complete?'<span class="tag high">Ready to apply</span>':'<span class="tag low">Incomplete proof</span>'}</td></tr>`).join('')}</tbody></table></div><div class="action-row"><button type="button" class="primary" id="apply-evidence-scores" ${r.completeDimensions?'':'disabled'}>Apply ${r.completeDimensions} completed dimension score${r.completeDimensions===1?'':'s'} to AI Strategy</button><span class="small muted">Only fully scored and verified dimensions are updated. Partial assessments remain provisional.</span></div>`)}`;
}
function evidenceGo(tab,questionId='',channel='Document'){
  evidenceUI.tab=tab;evidenceUI.prefillQuestion=questionId;evidenceUI.prefillChannel=channel;evidenceUI.editId=null;evidenceUI.message='';page='evidence';render();
}
function wireEvidence(){
  if(page!=='evidence')return;
  document.querySelectorAll('[data-evidence-tab]').forEach(b=>b.onclick=()=>{evidenceUI.tab=b.dataset.evidenceTab;evidenceUI.editId=null;evidenceUI.message='';render()});
  document.querySelectorAll('[data-channel-start]').forEach(b=>b.onclick=()=>evidenceGo('register','',b.dataset.channelStart));
  document.querySelectorAll('[data-request-question]').forEach(b=>b.onclick=()=>{const q=QUESTION_DATA.find(x=>x.id===b.dataset.requestQuestion);evidenceGo('register',q.id,q.channel)});
  document.querySelectorAll('[data-question-score]').forEach(x=>x.onchange=()=>{if(+x.value)state.assessment.ratings[x.dataset.questionScore]=+x.value;else delete state.assessment.ratings[x.dataset.questionScore];persist();render()});
  document.querySelectorAll('[data-question-note]').forEach(x=>x.onchange=()=>{state.assessment.notes[x.dataset.questionNote]=x.value.trim();persist()});
  document.querySelectorAll('[data-evidence-dimension]').forEach(x=>x.onchange=()=>{evidenceUI.dimension=x.value;render()});
  document.querySelectorAll('[data-evidence-question-filter]').forEach(x=>x.onchange=()=>{evidenceUI.questionFilter=x.value;render()});
  document.querySelectorAll('[data-evidence-search]').forEach(x=>x.oninput=()=>{const position=x.selectionStart;evidenceUI.search=x.value;render();const next=el('evidence-search');next.focus();next.setSelectionRange(position,position)});
  document.querySelectorAll('[data-record-channel]').forEach(x=>x.onchange=()=>{evidenceUI.channel=x.value;render()});
  document.querySelectorAll('[data-record-filter-status]').forEach(x=>x.onchange=()=>{evidenceUI.status=x.value;render()});
  document.querySelectorAll('[data-record-status]').forEach(x=>x.onchange=()=>{const record=state.evidence.find(e=>e.id===x.dataset.recordStatus);if(record){record.status=x.value;record.updatedAt=new Date().toISOString();persist();render()}});
  document.querySelectorAll('[data-record-edit]').forEach(b=>b.onclick=()=>{evidenceUI.editId=b.dataset.recordEdit;evidenceUI.message='';render();el('evidence-form')?.scrollIntoView({behavior:'smooth',block:'start'})});
  document.querySelectorAll('[data-record-delete]').forEach(b=>b.onclick=()=>{const record=state.evidence.find(e=>e.id===b.dataset.recordDelete);if(record&&confirm(`Remove local evidence record ${record.id}?`)){state.evidence=state.evidence.filter(e=>e.id!==record.id);evidenceUI.message=`Removed ${record.id} from this browser.`;persist();render()}});
  el('cancel-evidence-edit')?.addEventListener('click',()=>{evidenceUI.editId=null;render()});
  el('download-question-csv')?.addEventListener('click',exportQuestionCatalogue);
  el('download-register-csv')?.addEventListener('click',exportEvidenceRegister);
  el('apply-evidence-scores')?.addEventListener('click',()=>{const ready=assessmentReport().dimensions.filter(d=>d.complete);ready.forEach(d=>{state.scores[d.index]=Math.round(d.average*100)/100});persist();evidenceUI.message=`Applied verified scores to ${ready.length} dimension(s) in AI Strategy & Roadmap.`;render()});
  el('evidence-form')?.addEventListener('submit',event=>{
    event.preventDefault();const f=event.currentTarget;const v=n=>f.elements.namedItem(n).value.trim();const ids=[v('question'),...v('extra').split(/[,;\s]+/).map(s=>s.trim()).filter(Boolean)].filter((id,index,all)=>all.indexOf(id)===index);
    const invalid=ids.filter(id=>!QUESTION_DATA.some(q=>q.id===id));if(invalid.length){el('evidence-form-error').textContent='Unknown question ID(s): '+invalid.join(', ');return}
    if(!v('title')||!ids.length){el('evidence-form-error').textContent='Evidence title and at least one question are required.';return}
    const existing=state.evidence.find(e=>e.id===evidenceUI.editId);const now=new Date().toISOString();
    const record={id:existing?.id||'EV-'+now.replace(/\D/g,'').slice(2,16)+'-'+Math.random().toString(36).slice(2,5).toUpperCase(),title:v('title'),channel:v('channel'),questionIds:ids,reference:v('reference'),owner:v('owner'),date:v('date'),status:v('status'),confidence:v('confidence'),notes:v('notes'),createdAt:existing?.createdAt||now,updatedAt:now};
    if(existing)state.evidence=state.evidence.map(e=>e.id===existing.id?record:e);else state.evidence.unshift(record);
    evidenceUI.message=`${existing?'Updated':'Added'} ${record.id}: ${record.title}`;evidenceUI.editId=null;evidenceUI.prefillQuestion='';persist();render();
  });
}
