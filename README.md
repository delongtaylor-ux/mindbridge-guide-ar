# MindBridge Guide AR

Adult-facing Montessori fraction coaching for SPECS, with a working web companion.

**Work in progress:** the web companion works. The Lens Studio project is the official SPECS Base Template only; MindBridge AR behavior has not been implemented. CLAD installation is blocked in the current development session. This repository does not yet represent a completed hackathon Lens.

Try Fraction Workshop: https://mindbridge-fraction-workshop-4x1hvz.v2.appdeploy.ai/

Devpost draft: https://devpost.com/software/mindbridge-guide-ar

## Source

- `companion/`: JavaScript, HTML, CSS, SVG, tests, and verification notes.
- `MindBridgeLens/`: complete saved Lens Studio starter with Assets, Packages, and `.esproj`.
- `devpost/`: provisional design brief, build checklist, and submission outline.

Run `node --test companion/core.test.mjs`. Six core tests pass. Build portable HTML with `node companion/build.mjs`. The companion supports mouse and touch, exact fractions, hints, and adult-recorded observations with correction, archive/restore, and JSON export. Teaching prompts are scripted; there is no runtime AI or backend synchronization.

## Remaining work

Install CLAD and the Devpost Learn pack, implement the AR flow through Lens Studio MCP, test the actual Lens in preview, record a public YouTube demo under three minutes, and complete the participant form. The required CLAD build and LEAF tests have not occurred.

Official setup: https://developers.specs.com/docs/clad/setup/setup-ai/codex-setup

## Limits

Adult-led prototype. Prompts have not been educator-reviewed. Learning efficacy and mastery indicators are unvalidated. Observations remain in the browser, with a 200-record limit. A 24-hour follow-up is an unvalidated prototype default.

Local authentication files, editor preferences, caches, private downloads, and participant form answers are excluded. Open `MindBridgeLens/MindBridgeLens.esproj` with Lens Studio 5.24.1 or compatible later version. Lens Studio regenerates local configuration.
