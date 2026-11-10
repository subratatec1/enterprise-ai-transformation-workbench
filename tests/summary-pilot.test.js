// Minimal dependency-free regression checks for the static workbench pilot.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');

const root=path.resolve(__dirname,'..');
const nodes=new Map();
const document={
  body:{classList:{toggle(){}}},
  getElementById(id){if(!nodes.has(id))nodes.set(id,{innerHTML:'',textContent:'',value:'',addEventListener(){},focus(){},setSelectionRange(){}});return nodes.get(id)},
  querySelectorAll(){return []},
  querySelector(){return null},
};
const memory=new Map();
const sandbox={document,window:{scrollTo(){}},localStorage:{getItem:k=>memory.get(k)||null,setItem:(k,v)=>memory.set(k,v)},navigator:{clipboard:{writeText:async()=>{}}},confirm:()=>false,setTimeout,URL,Blob,console};
vm.createContext(sandbox);
for(const file of ['questions.js','evidence.js','consulting-skills.js','landing.js','summary-pilot.js','app.js']){
  vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),sandbox,{filename:file});
}

vm.runInContext('goTo("summary")',sandbox);
assert.match(nodes.get('content').innerHTML,/Management Summary Generator/);
assert.match(nodes.get('content').innerHTML,/No AI endpoint connected/);
assert.match(nodes.get('content').innerHTML,/Generate local preview/);

const preview=vm.runInContext('createSummaryPreview(SUMMARY_SAMPLE)',sandbox);
assert.equal(preview.decisions.length,1);
assert.equal(preview.risks.length,1);
assert.equal(preview.actions.length,1);
assert(preview.takeaway.every(x=>/^S1:L\d+$/.test(x.id)));
assert.throws(()=>vm.runInContext('createSummaryPreview("too short")',sandbox),/60 characters/);

vm.runInContext('skillUI.selectedId="CS-008";goTo("skills")',sandbox);
assert.match(nodes.get('content').innerHTML,/First developed skill package/);
assert.match(nodes.get('content').innerHTML,/Try the safe local preview/);
assert.match(nodes.get('content').innerHTML,/Verification in progress/);

vm.runInContext('goTo("overview")',sandbox);
assert.match(nodes.get('content').innerHTML,/From AI ambition/);
vm.runInContext('goTo("strategy")',sandbox);
assert.match(nodes.get('content').innerHTML,/Enterprise AI maturity assessment/);

console.log('PASS: summary navigation, local preview, evidence IDs, inventory integration and existing modules');
