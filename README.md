# Enterprise AI Transformation Workbench

An interactive, standalone, static MVP for five consulting-led enterprise AI transformation accelerators, now including a linked **Evidence & Assessment** workspace. The methodology and 43 assessment criteria are drawn from the supplied BFSI toolkit. Maturity starting points, use cases and scenario values are **illustrative synthetic inputs**; new evidence starts empty.

## Modules

1. **AI Strategy & Roadmap** — ten-dimension maturity assessment, target gaps, use-case opportunity rankings and milestone roadmap. Links directly to evidence-based scoring.
2. **AI Operating Model** — operating-model archetype comparison, ownership and workforce readiness.
3. **Governance & Risk** — autonomy decision support, impact/reversibility caps and control recommendations.
4. **AI Economics** — bankable savings, run cost, implementation cost, ROI, payback and scenario sensitivity.
5. **Architecture that Scales** — five-stage reference architecture, component inventory and skill catalogue.

### Evidence & Assessment workspace (within Strategy & Roadmap)

The standalone navigation entry **Evidence & Questions** supports the maturity assessment:

- **43-question catalogue:** seven core dimensions (28 questions) and three extension dimensions for agentic readiness, enterprise AI architecture and value realization (15 questions). Every criterion has a suggested evidence artifact, collection channel and accountable client owner.
- **Four evidence intake channels:** document collection (PDF/DOCX/PPTX/XLSX); approved read-only enterprise system extracts (API/CSV/JSON); structured stakeholder interviews; and operational demonstration, sampling and test results.
- **Evidence register:** add, edit, filter, mark as requested/received/verified/rejected and remove evidence metadata. Each entry can link to one or more assessment question IDs, specify its owner, source ID, date, reviewer confidence and findings.
- **Coverage tracking:** count scored criteria and scored criteria with independently verified evidence, including dimension-by-dimension completeness and question-level proof indicators.
- **Evidence-based maturity sync:** only dimensions where *all* questions are scored and backed by at least one verified evidence record can update the maturity figures in Strategy & Roadmap. No automatic assumption of capability or client proof.
- **Outputs:** question catalogue CSV, evidence register CSV and combined assessment JSON, including question ratings, evidence references, review status, coverage metrics and the full catalogue.

Suggested consulting workflow: request proof → log safe artifact references and owners → inspect/read-only validate → mark verified → score each question and capture rationale → apply fully evidenced dimension scores → review maturity gaps and AI roadmap with sponsors.

## Run

Open `index.html` directly in a modern browser, or serve the folder with any static HTTP server. There is no build step, backend, external dependency, or API key.

## Publish on GitHub Pages

Create a repository named `enterprise-ai-transformation-workbench`; upload these files to the root of the `main` branch. In **Settings → Pages → Build and deployment**, choose **Deploy from a branch**, `main`, `/ (root)`. The resulting URL is `https://subratatec1.github.io/enterprise-ai-transformation-workbench/` after Pages finishes deployment.

## Data and controls

- Default maturity scores and use cases are synthetic. The evidence register starts empty. Information entered into it is user-generated and is **not** labeled synthetic on export.
- Browser local storage retains changes on the same device; **Reset demo** clears them.
- **Export assessment JSON** downloads inputs, evidence metadata, the full question catalogue and derived metrics. Separate CSV exports are provided for the question catalogue and evidence register. No data is sent to a server.
- This is a **public, static site without authentication, uploads, private storage or API connectors**. Never enter confidential client documents, personal data, regulated records, secrets or sensitive content in form fields or notes. Use non-sensitive artifact IDs/references and perform controlled collection in approved enterprise repositories.
- Assessment scores and autonomy recommendations are indicative, not permission to perform regulated actions.
- Risk policy, financial benefits and architecture choices require real client evidence and approval before production use.

## Planned extensions

Authenticated client workspaces, secure document upload and evidence storage, source-system connectors with least-privilege approvals, richer evidence citations and reviewer approval workflows, versioned policy and scoring rules, downloadable presentation reports, evaluation and audit logs, and industry-specific content packs.
