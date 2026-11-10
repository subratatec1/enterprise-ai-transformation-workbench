# Enterprise AI Transformation Workbench

An interactive, standalone, static MVP for five consulting-led enterprise AI transformation accelerators, now including a linked **Evidence & Assessment** workspace. The methodology and 43 assessment criteria are drawn from the supplied BFSI toolkit. Maturity starting points, use cases and scenario values are **illustrative synthetic inputs**; new evidence starts empty.

Version 0.3 introduced a **Consulting Skill Inventory** based on user-supplied descriptions. No skill packages or runtime capabilities are bundled.

Version 0.4 redesigned the **executive landing page** as an editorial consulting narrative: an AI transformation thesis, a connected five-discipline framework, an evidence-to-value workflow, and clear entry points to the interactive tools. Version 0.5 generalizes the public skill names and removes the RFP Intelligence entry. Capability figures (5 accelerators, 10 dimensions, 43 questions, 20 skills) are counts of built-in MVP functionality, not client performance claims. The design is original and does not reuse the branding of any consulting firm.

Version 0.6 adds the **Management Summary Generator** as the first developed skill package. The workbench includes a safe, locally executed, source-linked extractive preview. It is **not an LLM-generated summary**. The separate Python runner in `skills/management-summary-generator/` can make authorized model-backed calls through an OpenAI-compatible enterprise model gateway; it is not connected to this public static site.

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

### Consulting Skill Inventory (within Architecture that Scales)

The **Consulting Skill Inventory** navigation entry includes **20 public-facing skill candidates**, with generalized names where needed, arranged in five groups:

| Group | Count |
| --- | ---: |
| Research and client intelligence | 5 |
| Strategy and consulting deliverables | 6 |
| Presentations and visualization | 6 |
| Engagement delivery | 2 |
| Skill governance and development | 1 |

It supports full-text search, category and verification filters, a detail panel showing intended use and *indicative* inputs and outputs, plus review metadata for each skill. Use the six-step checklist to track package inspection, ownership/usage rights, input-output contract, runtime requirements, security review and sandbox validation. A skill can be marked integration-ready **only after all six checks and a package reference are provided**; this is a self-attestation, not actual execution authorization.

The inventory can export a CSV and a proposed agent-router-candidates JSON file. The router JSON marks every unverified skill `executionEligible: false`; it is **not an executable skill manifest**. The global workbench JSON export also includes the 20-skill catalogue and active-skill verification notes. The removed entry's identifier (CS-018) is intentionally not reused, so existing review IDs stay stable. Any pre-existing local review of the retired entry is not included in exported inventories.

### Management Summary Generator — first skill pilot

The **Management Summary Pilot** navigation entry accepts up to 12,000 characters of pasted text, preloads fictional transformation notes, and extracts verbatim management takeaways, decisions, risks and actions with `S1:Lx` evidence references. It can export a Markdown source-linked preview. The text remains in page memory and is not uploaded, saved to local storage or sent to a model. Do not paste confidential client material into this public prototype.

The accompanying `skills/management-summary-generator/` package provides:

- A reusable `SKILL.md` procedure with explicit evidence and decision-status rules.
- A quality rubric, management-summary template and fictional test fixtures.
- A standard-library Python runner for an **approved** OpenAI-compatible chat-completions gateway.
- Deterministic validation of schema, required content and citation source-line ranges, plus contract tests.

Run the offline fixture tests from the package directory:

```bash
python3 -m unittest discover -s scripts -p 'test_*.py'
python3 scripts/run_summary.py --input assets/sample-notes.md --mock-response assets/sample-response.json
```

With an approved endpoint and authorization, set `SUMMARY_API_BASE` and `SUMMARY_API_KEY` in the secured execution environment and provide `--model <approved-model>` to the same runner without `--mock-response`. This transmits source content to that configured endpoint; do not do so without appropriate client permission and data-handling checks. Valid citations must still be reviewed for factual support. No API keys belong in the public repository or browser.

**Security and ownership:** Public-facing titles are generic labels and do not imply that the underlying packages are publicly licensed or available. The catalogue does not include proprietary skill instructions, downloaded packages, approved templates, secrets or internal enterprise data. Verify redistribution rights and authorized use before connecting or distributing any package.

## Run

Open `index.html` directly in a modern browser, or serve the folder with any static HTTP server. There is no build step, backend, external dependency, or API key.

## Publish on GitHub Pages

Create a repository named `enterprise-ai-transformation-workbench`; upload these files to the root of the `main` branch. In **Settings → Pages → Build and deployment**, choose **Deploy from a branch**, `main`, `/ (root)`. The resulting URL is `https://subratatec1.github.io/enterprise-ai-transformation-workbench/` after Pages finishes deployment.

## Data and controls

- Default maturity scores and use cases are synthetic. The evidence register starts empty. Information entered into it is user-generated and is **not** labeled synthetic on export.
- Browser local storage retains changes on the same device; **Reset demo** clears them.
- **Export assessment JSON** downloads inputs, evidence metadata, the full question catalogue and derived metrics. Separate CSV exports are provided for the question catalogue and evidence register. No data is sent to a server.
- **Consulting Skill Inventory** stores only references, team/role names, verification checkmarks and safe review notes in browser storage. The inventory data is included in the combined JSON export; no packages are uploaded or executed.
- **Management Summary Pilot** processes pasted notes in memory, supports an offline extractive preview and does not call a model or persist entered notes. The bundled CLI is separate from GitHub Pages and must be deployed in a controlled environment for model-backed execution.
- This is a **public, static site without authentication, uploads, private storage or API connectors**. Never enter confidential client documents, personal data, regulated records, secrets or sensitive content in form fields or notes. Use non-sensitive artifact IDs/references and perform controlled collection in approved enterprise repositories.
- Assessment scores and autonomy recommendations are indicative, not permission to perform regulated actions.
- Risk policy, financial benefits and architecture choices require real client evidence and approval before production use.

## Planned extensions

Authenticated client workspaces, secure document and skill-package ingestion, signed package manifests, real orchestration adapters, source-system connectors with least-privilege approvals, richer evidence citations and reviewer approval workflows, versioned policy and scoring rules, downloadable presentation reports, evaluation and audit logs, and industry-specific content packs.
