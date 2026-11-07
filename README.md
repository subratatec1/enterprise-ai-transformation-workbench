# Enterprise AI Transformation Workbench

An interactive, standalone, static MVP for five consulting-led enterprise AI transformation accelerators. It is based on the methodology in the supplied BFSI toolkit and uses **illustrative synthetic inputs**.

## Modules

1. **AI Strategy & Roadmap** — ten-dimension maturity assessment, target gaps, use-case opportunity rankings and milestone roadmap.
2. **AI Operating Model** — operating-model archetype comparison, ownership and workforce readiness.
3. **Governance & Risk** — autonomy decision support, impact/reversibility caps and control recommendations.
4. **AI Economics** — bankable savings, run cost, implementation cost, ROI, payback and scenario sensitivity.
5. **Architecture that Scales** — five-stage reference architecture, component inventory and skill catalogue.

## Run

Open `index.html` directly in a modern browser, or serve the folder with any static HTTP server. There is no build step, backend, external dependency, or API key.

## Publish on GitHub Pages

Create a repository named `enterprise-ai-transformation-workbench`; upload these files to the root of the `main` branch. In **Settings → Pages → Build and deployment**, choose **Deploy from a branch**, `main`, `/ (root)`. The resulting URL is `https://subratatec1.github.io/enterprise-ai-transformation-workbench/` after Pages finishes deployment.

## Data and controls

- Data is synthetic and editable in the browser.
- Browser local storage retains changes on the same device; **Reset demo** clears them.
- **Export assessment JSON** downloads the current input state. No data is sent to a server.
- Assessment scores and autonomy recommendations are indicative, not permission to perform regulated actions.
- Risk policy, financial benefits and architecture choices require real client evidence and approval before production use.

## Planned extensions

Client workspaces and identity, evidence citations and reviewer approval, versioned policy and scoring rules, imports from enterprise systems, server-side persistence, output report generation, evaluation and audit logs, and industry-specific content packs.
