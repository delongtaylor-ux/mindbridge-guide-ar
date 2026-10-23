---
status: draft
planning_stage: provisional-before-lens-studio-setup
---

# Design brief: MindBridge Guide AR — Fraction Workshop

Prepared from Taylor Delong's supplied specification using the official Devpost Learn plan-lens template and design references. This is a provisional brief: Lens Studio setup, the plan-lens review, and user sign-off remain incomplete. Values marked **(default)** are proposed implementation choices.

## The one spatial moment

A parent or educator looks down at fraction materials on a table. Beside those materials, two luminous quarter-circle pieces slide into the footprint of a half-circle. The adult can replay the movement, ask a short question, then hide the guidance while the learner works with physical pieces.

The adult records whether the learner succeeded independently, needed help, or should retry. A later, different challenge checks transfer. The overlay belongs to the adult wearer; the child does not see it.

## Why it belongs on glasses

- Uses: **draws in the world** and **leaves your body free** between brief input actions.
- The demonstration sits beside the materials while the adult's attention stays on the same work area. A phone guide requires shifting attention to a separate display or holding a device.
- No claim of live material recognition. The adult selects the lesson and positions the demonstration manually.
- Educational benefit over a tablet guide is a hypothesis requiring evaluation.

## Product or overlay

- Type: overlay that coaches the adult's presentation of a physical activity.
- What the real version would sense: device pose and standard interaction input only; no automatic identification of materials, people, or learner performance.
- Stand-in for preview: a clearly labeled **Preview practice table** with virtual fraction materials. A **Place workshop** control positions the demonstration in front of the adult in the simulated room. This does not claim to detect a real surface.
- Teaching guidance: deterministic example prompts in the first preview build, visibly labeled **Scripted practice guidance**. Runtime AI is deferred until an actual integration exists; the submission must disclose its real status.

## Where things live

- Adult's gaze: the tabletop and hands, slightly below eye level.
- Practice work area: 45 × 30 cm **(default)**, approximately 1 m from the initial view **(default)**, at table height. Position once, then keep fixed in the room; do not lock it to the face.
- Fraction demonstration: 18 cm diameter **(default)**, centered in the work area. Keep a clear space beside it for physical materials in the intended real-world version.
- Current prompt: one short line, 18 × 6 cm **(default)**, beside the demonstration, not over the child's hands.
- Primary controls: three large targets in a 30 cm row **(default)**; minimum target size 6 × 6 cm **(default)**. Show the current step's controls only.
- Progress summary: compact session-only summary next to the mat, shown after the adult opens it. Hide during independent work.
- Colors: bright teal, warm gold, and light violet **(default)**, with fraction labels so meaning does not rely on color. Use light text and visible outlines appropriate to an additive display.

## Hands and input

- Place/reposition: pinch a large placement target; use standard grab/drag to reposition the workshop as one group.
- Select activity: large buttons for **Build a whole**, **Find equivalents**, and **New challenge**.
- Demonstrate/replay: press **Show me**; two quarters move into the same extent as one half. Replay is repeatable and does not record success.
- Practice: drag fraction pieces into a tray with generous snapping. Wrong combinations remain editable and receive calm visual feedback.
- Independent attempt: **Hide guidance** removes hints and demonstration ghosts. The adult can restore them; doing so marks the attempt assisted.
- Record observation: **Independent**, **With help**, or **Try again**. Require a selected outcome before **Save observation**; permit correction of the latest entry.
- Targets are large and highlight when aimed at.
- Voice: not required in the prototype. Every action works with mouse-driven standard interaction in preview.

## When things show

- Placement marker: visible during placement, hidden after confirmation.
- Demonstration ghosts: visible only during requested rehearsal or replay, hidden during independent practice.
- Short prompt: visible on request, dismissible, never a continuous paragraph.
- Observation controls: visible when the adult ends the attempt, then replaced with a brief saved-state acknowledgment.
- If content moves outside the view, a small return cue points toward the workshop **(default)**. No controls behind the shoulder.

## Lesson sequence and evidence

1. **Build a whole:** combine two halves, three thirds, or four quarters. Check with exact rational arithmetic. An incomplete or oversized arrangement must not pass.
2. **Find equivalents:** compare two quarters with one half, including the spatial animation and optional hands-on reconstruction.
3. **New challenge:** use a different arrangement, such as one half plus two quarters to make a whole, with guidance hidden.

Rehearsal is always available to adults. Learner advancement is a separate concept: a proposed mastery policy requires independent success on distinct tasks plus a later independent check **(default; not validated)**. The Lens preview shows session observations only; it must not claim persistent mastery or a real delayed check. Label any demonstration of a later check **Simulated follow-up** and exclude it from real evidence.

The optional companion web/mobile game follows the same objectives with mouse/touch input. Its future local progress must be described as browser-local until real synchronization exists. It is supplementary and cannot replace the required SPECS Lens.

## Done criteria

Each criterion below must be checked in Lens Studio's preview; none has passed yet.

1. Place the workshop, walk left/right and closer/farther, and confirm it stays in the room beside the table. Reposition it without restarting.
2. Select **Find equivalents**, press **Show me**, and see exactly two quarters fill one half. Replay produces the same result and does not create a learner observation.
3. In **Build a whole**, a valid combination fills the whole. An incomplete or oversized combination is rejected; pieces can be removed and retried.
4. Enter **New challenge** and hide guidance. Requesting a hint changes the attempt to assisted; no assisted or incorrect attempt is shown as independent success.
5. Save and correct a session observation. Restart resets the preview's session record; the UI describes the scope honestly and never claims a real delayed mastery check.

## Out of scope

- Children wearing SPECS.
- Live camera recognition, identifying or recording people, face recognition, and always-on capture.
- Voice-only navigation, custom/two-hand gestures, or multiplayer.
- Cross-session spatial anchors or persistent Lens learner records demonstrated in preview.
- Unreviewed generative teaching advice and clinical or diagnostic claims.
- Institutional licensing, billing, full K–12 curriculum, or proven learning outcomes.

## Risks and open questions

- **Feel unproven:** prolonged comfort, real hand tracking, real-world legibility, and physical-material alignment require glasses testing.
- Scripted teaching prompts require educator review before calling them educator-reviewed.
- Any future AI implementation must disclose what runs live and what is a fallback; it must not infer mastery or diagnose a learner.
- A later independent check cannot be demonstrated as real longitudinal evidence in one preview session.
- User review remains needed for the proposed sizes, exact mastery rule, and instructional language. Registration, eligibility attestations, and subjective event survey responses also remain unconfirmed.

## Build notes for CLAD
- Build for SPECS so it runs and can be demonstrated in Lens Studio's preview. No SPECS device is available.
- Use Spectacles Interaction Kit (SIK) and UI Kit for all interactions, so they work with the mouse in Interactive Preview and with LEAF.
- Build any stand-in exactly as described above, and keep it obvious in the scene.
- Use real-world scale in centimeters. Keep content inside the user's view during the main task.
- The display is additive: black renders as transparent. Don't rely on black or very dark content to be seen; keep text light and readable from where the user stands.
- Get the basic flow working first, then add detail.
- Write LEAF scenarios for each done criterion, run them in preview, and report which pass. Say which criteria have no test.
- Don't record, identify, or follow people.

## After the build: judge it
This part is for you, after CLAD finishes.

1. **Does it work?** Ask your agent which LEAF tests passed and which done criteria have no test.
2. **Walk around it.** Open the preview in Interactive Preview. Use WASD to move, Q and E to go down and up, and right-drag (or hold Shift) to look around. Clicking acts as a pinch. Stand where a user would and look at the task.
3. **Ask the three questions.**
   - Does it use what I'm looking at?
   - Does it put something in my space, where it belongs?
   - Does it free my hands or let me keep my eyes up?
   - Would it be just as good on a phone? If so, what would make it need the glasses?
4. **Check comfort.**
   - Everything I need is in view while I do the task. Nothing sits at the edges, behind me, or stuck to my face.
   - Every control is within reach of someone standing there.
   - Text reads easily from where I stand. No dark UI disappearing.
   - Things show when needed and get out of the way.
5. **Label what you know.** Write "logic proven" next to anything the tests and preview show working, and "feel unproven" next to anything only real glasses could tell you (comfort over time, real hand tracking, real recognition).
6. **Fix with design notes, not code.** Tell your agent what to change in design terms, for example: "Move the step card 15 cm lower and next to the pan. Make the Next button twice as big. Re-run the tests." If a fix takes under a minute, like nudging a panel, do it yourself in the scene.
7. **Submit.** Record a video under 3 minutes of your Lens in the preview, public on YouTube. Make your repo public with your Lens Studio project and this `devpost/` folder. Details are on the hackathon site: https://learn-specs.devpost.com/resources

## Planning sources

- Devpost Learn plan-lens: https://github.com/challengepost/learn-specs/tree/main/skills/plan-lens
- Official event requirements and judging criteria retrieved through Devpost Hackathons on October 23, 2026: https://learn-specs.devpost.com
- Taylor Delong's supplied MindBridge product specification. The research citations below come from that specification; no new efficacy claim is made in this brief.

Marshall (2017) provides context for concrete materials and independent work; it does not evaluate this AR product. Garzón and Acevedo (2019) discuss AR learning research across varied settings; their findings do not validate this prototype.

Garzón, J., & Acevedo, J. (2019). Meta-analysis of the impact of augmented reality on students’ learning gains. *Educational Research Review, 27*, 244–260. https://doi.org/10.1016/j.edurev.2019.04.001

Marshall, C. (2017). Montessori education: A review of the evidence base. *npj Science of Learning, 2*, Article 11. https://doi.org/10.1038/s41539-017-0012-7
