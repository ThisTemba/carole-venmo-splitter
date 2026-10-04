---
version: 1
slug: "src-app-tsx"
primary_target: "src/App.tsx"
related_targets: []
---

# Surface: the splitter (single page)

Scope: the whole app, which is one page: receipts, Totals, the header actions, How it works, dialogs. Mode: Operate.
Audience and job: the person who paid (Carole, the author, friends), at home on a laptop in the evening, typing receipts to get each person's Venmo request amount. Works fully with the keyboard and fully with a mouse.
Constraints: remove Chakra UI entirely. Keep every behavior, keyboard flow, copy, data format and storage key. Must stack on narrow screens.
User-pinned: a dim room where the paper glows (dark warm ground); receipts go all in as thermal-paper receipts; Totals is its own paper slip.

## Direction contract

THESIS: The splitting happens on a dark desk under one lamp. Every receipt is a real curled thermal slip, and Totals is the collection slip standing in a kraft envelope. It refuses the category default of panels and cards in a light dashboard.

OWN-WORLD: A warm near-black desk on a strict tonal ramp, with a faint lamp pool. Thermal paper is cool off-white, with zigzag torn ends, a slight tilt, a lifted shadow and faded grey-violet print. Everything on paper uses one monospace character grid. Receipt names print in double-height caps, and totals use dot leaders and dashed and double rules. Each person has a fixed stamp-ink color for their stamped name tags and their Totals line. Kraft envelope, masking-tape label, title in marker. Buttons are printed text on paper, or quiet ink on the desk.

STORY: Carole sees her receipts as receipts, types or clicks lines in as if the printer is feeding them, and reads each person's amount off the collection slip. It visibly adds up, so she sends the requests and is done.

FIRST VIEWPORT: The masking-tape title sits top left on the desk, with Save, Load and ⋯ as desk-ink text top right. The receipt column (max about 560px slips, staggered tilt) is on the left, and the envelope with the Totals slip is sticky on the right (about 380px). The first receipt's double-height name and its first lines are visible. "Add receipt" is a blank slip outline at the column's end.

FORM: Settling-Up Envelopes (grounded list position 7). Raises: isolated deletes (console), per-person ink (mascot catalog), an "adds up" check line (j-card), one character grid (Crouwel). Seed key 43802605.

SIGNATURE INTERACTION: A new item line feeds out of the receipt with a short paper-advance motion. Totals figures re-ink when they change.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
