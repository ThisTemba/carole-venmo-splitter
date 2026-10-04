---
name: Carole Venmo Splitter
description: Receipts as real thermal slips on a warm desk; totals collected in a kraft envelope.
colors:
  desk-0: "#2c2620"
  desk-1: "#3b342d"
  desk-2: "#463e36"
  desk-3: "#524840"
  desk-4: "#685d52"
  desk-ink: "#d9cfbf"
  desk-ink-dim: "#c2b6a3"
  desk-ink-bright: "#f3ebdd"
  paper: "#f7f7f4"
  paper-hover: "#f0f0ec"
  paper-shade: "#ebebe6"
  paper-dim: "#dcdcd5"
  print: "#2e2b27"
  print-deep: "#1c1a17"
  print-soft: "#5f5a53"
  print-faint: "#aaa59c"
  print-red: "#b3261e"
  print-red-deep: "#96201a"
  highlight: "#f3d86a"
  paper-hover-band: "rgba(46, 43, 39, 0.07)"
  notebook: "#f5f7f9"
  notebook-rule: "rgba(72, 120, 190, 0.3)"
  notebook-margin: "rgba(208, 64, 60, 0.38)"
  kraft: "#a6825a"
  kraft-light: "#b8946a"
  kraft-ink: "#24180c"
  note: "#f1db7a"
  note-ink: "#2f2a1c"
typography:
  heading:
    fontFamily: "'Sometype Mono', ui-monospace, 'SF Mono', Menlo, monospace"
    fontSize: "1.3rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "0.14em"
  title:
    fontFamily: "'Sometype Mono', ui-monospace, 'SF Mono', Menlo, monospace"
    fontSize: "clamp(1.2rem, 1rem + 0.8vw, 1.5rem)"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.01em"
  total:
    fontFamily: "'Sometype Mono', ui-monospace, 'SF Mono', Menlo, monospace"
    fontSize: "1.3rem"
    fontWeight: 700
    lineHeight: 1.5
    letterSpacing: "0.04em"
    fontFeature: "tnum"
  figure:
    fontFamily: "'Sometype Mono', ui-monospace, 'SF Mono', Menlo, monospace"
    fontSize: "1.12rem"
    fontWeight: 700
    lineHeight: 1.5
    fontFeature: "tnum"
  body:
    fontFamily: "'Sometype Mono', ui-monospace, 'SF Mono', Menlo, monospace"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
    fontFeature: "tnum"
  label:
    fontFamily: "'Sometype Mono', ui-monospace, 'SF Mono', Menlo, monospace"
    fontSize: "0.74rem"
    fontWeight: 600
    lineHeight: 1.5
    letterSpacing: "0.06em"
  names:
    fontFamily: "'Sometype Mono', ui-monospace, 'SF Mono', Menlo, monospace"
    fontSize: "0.95rem"
    fontWeight: 400
    lineHeight: 1.4
rounded:
  check: "1px"
  print: "3px"
  desk: "4px"
spacing:
  tooth: "12px"
  slip-pad: "22px 26px 24px"
  slip-pad-mobile: "20px 18px 22px"
  receipt-gap: "52px"
  column-gap: "56px"
  page: "28px 24px 72px"
components:
  print-btn:
    textColor: "{colors.print-soft}"
    rounded: "{rounded.print}"
    padding: "0 12px"
    height: "34px"
    typography: "{typography.label}"
  print-btn-hover:
    backgroundColor: "{colors.paper-hover}"
    textColor: "{colors.print}"
  print-btn-solid:
    backgroundColor: "{colors.print}"
    textColor: "{colors.paper}"
    rounded: "{rounded.print}"
    height: "34px"
  print-btn-solid-hover:
    backgroundColor: "{colors.print-deep}"
  print-btn-danger:
    backgroundColor: "{colors.print-red}"
    textColor: "{colors.paper}"
    rounded: "{rounded.print}"
    height: "34px"
  print-btn-danger-hover:
    backgroundColor: "{colors.print-red-deep}"
  desk-btn:
    textColor: "{colors.desk-ink}"
    rounded: "{rounded.desk}"
    padding: "0 12px"
    height: "40px"
  desk-btn-hover:
    textColor: "{colors.desk-ink-bright}"
  icon-btn:
    textColor: "{colors.print-soft}"
    rounded: "{rounded.print}"
    size: "32px"
  icon-btn-hover:
    backgroundColor: "{colors.paper-shade}"
    textColor: "{colors.print}"
  field:
    textColor: "{colors.print}"
    rounded: "0"
    padding: "0 6px"
    height: "32px"
  chip:
    backgroundColor: "{colors.paper-shade}"
    textColor: "{colors.print}"
    rounded: "{rounded.print}"
    padding: "1px 4px 1px 8px"
  how:
    textColor: "{colors.desk-ink-dim}"
    width: "560px"
  slip:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.print}"
    padding: "{spacing.slip-pad}"
    typography: "{typography.body}"
  envelope-export:
    backgroundColor: "{colors.kraft-light}"
    textColor: "{colors.kraft-ink}"
    rounded: "{rounded.print}"
    height: "42px"
  envelope-export-hover:
    backgroundColor: "{colors.kraft-ink}"
    textColor: "{colors.kraft-light}"
  title-note:
    backgroundColor: "{colors.note}"
    textColor: "{colors.note-ink}"
    padding: "18px 28px 16px"
    typography: "{typography.title}"
  menu-item-active:
    backgroundColor: "{colors.print}"
    textColor: "{colors.paper}"
    padding: "9px 14px"
---

# Design System: Carole Venmo Splitter

## Overview

**Creative North Star: "The Desk Under One Lamp"**

The app is a warm brown desk under a single soft lamp, with real objects lying on it. Every receipt is a white thermal slip with a fine paper texture, cut flat across the top, torn off at the bottom, its paper tilted a fraction of a degree and lifted off the desk by a soft shadow. Totals is the collection slip, standing in a kraft envelope that holds the export action. The app title is written on a yellow sticky note taped to the desk, the one object whose writing tilts with it. No panels, cards, or dashboard chrome: if something is a surface, it is a physical object with a material.

On paper, everything prints in one monospace face on one character grid, in warm charcoal thermal ink. Printed headings are the same face in bold, widely tracked caps, the way a receipt printer sets a store name. Figures line up like a register: right-aligned prices in a shared column, each line ruled like the notepad beside it so a row reads straight across to who had it, totals under solid and double rules. People are plain printed names: a quiet comma-separated list beside each price, and a plain name beside each figure in Totals.

The work leads. The core jobs are entering a receipt, checking that every item and its people are right, and reading the totals, so the receipts and the Totals figures are the loudest things on the desk. Help, chrome and decoration recede: How it works is quiet text on the desk, printed add buttons are faint dashed outlines until hovered, and names print in plain mixed case, a hair smaller than the item and its price.

Density is that of a real receipt: compact lines at a readable 1rem, uppercase item names, small tracked labels, and generous space between slips on the desk. Motion is mechanical and brief: new lines feed out of the printer in steps.

The world is meant to be fun but polished: crisp print, muted ink, flat paper and restrained physical effects, never a toy or a classroom craft project.

**Key Characteristics:**
- Warm mid-brown desk on a strict tonal ramp with a weak lamp pool and grain.
- Near-white thermal paper with a lit fiber texture, a flat-cut top, a seeded, gently varied torn bottom, slight tilt on receipts, and lifted shadow.
- Tilt lives on material layers only (paper); the Totals slip and its envelope lie level; all text stays straight, except the large title on its sticky note.
- One family for the whole app: Sometype Mono, with printed headings and the envelope label in its 700 printer caps.
- Receipts and Totals figures lead; help, chrome and decoration recede.
- Names in plain print, no per-person colors.
- Register alignment: a shared price column, a who-had-it column, a faint rule under every line running on from the notepad, solid and double rules.

### Named Rules
**The Work Leads Rule.** Entering a receipt, checking its items and people, and reading the totals are the work, so receipts and the Totals figures are the loudest things on the page. Help, chrome and decoration recede: smaller, dimmer, outlined rather than filled, never in color. Save and Load on the desk are the reference for correctly balanced secondary UI: legible and easy to find, never louder than the work. If a new element draws the eye before a receipt line or a figure, quiet it.

**The Polished Not Playschool Rule.** Fun comes from the world (slips, the envelope, the title note), not from crude effects. Prefer muted ink, crisp straight text and flat paper over loud colors, handwriting fonts, curls and heavy shading. Tape appears in exactly one place, the strip holding the title note to the desk, because the user asked for it there; nothing else is taped. If a detail would look at home in a fifth grader's educational program, cut it.

## Colors

A warm brown desk ramp under near-white paper, printed in one warm charcoal ink.

### Primary
- **Thermal Print** (print): warm charcoal, like real thermal print (13.1:1 on paper): the ink of everything on paper: item text, prices, headings, names, solid buttons, checked boxes, reverse-print highlights in menus and pickers. Its hover deepens to **Spent Ribbon** (print-deep).

### Tertiary
- **Kraft** (kraft, kraft-light, kraft-ink): the envelope body, its lighter mouth and export button, and the dark ink of its label and border.
- **Sticky Note** (note) and **Note Ink** (note-ink): the title note's yellow paper and the dark writing on it. With the translucent **Tape** strip (`rgba(240,236,224,.62)`), they belong to the title note only.
- **Correction Red** (print-red, deepening to print-red-deep): errors, warnings, destructive actions, the "doesn't add up" line, and the text caret in fields.
- **Highlighter** (highlight): text selection only.

### Neutral
- **Desk ramp** (desk-0 darkest to desk-4): page background gradient (desk-2 to desk-0) under a weak warm lamp pool (6% alpha), body fill (desk-1), scrollbar thumb (desk-4). Brighter and lower in contrast than a night desk.
- **Desk Ink** (desk-ink), **Dim** (desk-ink-dim), **Bright** (desk-ink-bright): quiet text and buttons that sit directly on the desk. Dim is the empty-desk message and the How it works text; Desk Ink is Save, Load and How it works titles and step names; Bright is hover and the global focus ring.
- **Thermal Paper** (paper): every slip, menu and picker; on slips it carries the lit fiber texture (see Elevation & Depth). **Paper Hover** (paper-hover): printed button hover. **Hover Band** (paper-hover-band, a 7% Thermal Print wash): hover on receipt lines, Totals rows and the receipt name (see The Quiet Hover Rule). **Paper Shade** (paper-shade): the editing row, icon-button hover, and the fill of people chips. **Paper Dim** (paper-dim): quiet chrome on paper: the dashed border of printed add buttons, chip borders, the dotted rule before the names column, picker borders and the Totals scrollbar.
- **Soft Print** (print-soft): secondary text on paper (6.4:1 on paper): the receipt meta line, notes, text buttons, printed add-button labels, placeholders, empty-state text and the "Who had it?" prompt.
- **Faint Print** (print-faint): the Totals dot leaders, rules, the dashed breakdown spine, and the tally chevron. Never text.

### Named Rules
**The Faint Is Not Text Rule.** Faint Print draws rules and leaders only. Any words on paper, including placeholders and empty states, are at least Soft Print.

## Typography

**Display Font:** Sometype Mono 700 in tracked caps ("printer caps"), for printed headings and the envelope label
**Body Font:** Sometype Mono 400/600/700 (with ui-monospace, SF Mono, Menlo), self-hosted

**Character:** One register monospace for everything, headings set in the printer's own bold, widely spaced caps. One family, no handwriting. Tabular figures are on globally.

### Hierarchy
- **Heading** (700, 1.3rem, 1.2, uppercase, 0.14em, centered): every printed heading: receipt names, TOTALS, dialog titles (1.15rem in dialogs). The receipt-name input matches it at 1.2rem, 700, uppercase, 0.12em.
- **Title** (Sometype Mono 700, clamp(1.2rem, 1rem + 0.8vw, 1.5rem), 1.15, mixed case, -0.01em): the app title in Note Ink, written on the sticky note and tilted with it. The envelope label is 700 caps at 1rem (1.2, 0.12em), over a 600 0.8rem subline (0.06em).
- **Total** (700, 1.3rem, uppercase, 0.04em): a receipt's TOTAL line, the largest print on a receipt.
- **Subtotal** (600, 1rem, mixed case, 0.02em): the first line of the totals block, as real thermal receipts print it: a plain "Subtotal" label on the left with no dot leaders, its figure in the price column, under the dashed rule. Only TOTAL is bold.
- **Figure** (700, 1.12rem): per-person totals amounts and the EVERYONE line. Plain bold, no stretching.
- **Fine print** (0.68 to 0.9rem): the steps under body for secondary print and desk text: 0.9rem empty states and the desk-side sum line, 0.84 to 0.88rem menus, chips and How it works, 0.78 to 0.82rem tracked labels, kbd marks, the envelope subline and button, 0.68rem the "Copied" flash. Use one of these steps for small text; don't add new ones.
- **Body** (400, 1.5): item and sum lines at 1rem (0.94rem at 560px and below), item names uppercase with 0.02em tracking; other slip text at 0.9rem, 15px on the desk; dialogs at 0.88rem, breakdowns and toasts at 0.8 to 0.82rem.
- **Names** (400, mixed case as typed): on a receipt line, a comma-separated Thermal Print list at 0.95rem (1.4 line height), italic for "Everyone on this receipt"; in Totals, plain Thermal Print at 0.95rem; in the people box while editing, chips at 0.86rem.
- **Label** (600 or 400, 0.72 to 0.8rem, 0.06 to 0.12em, uppercase): buttons, the receipt meta line, notes, table headers, the "adds up" line.
- **Desk text** (How it works): Dim Desk Ink at 0.84rem, 1.55; its title and Tips heading in Desk Ink, 700, 0.78rem, 0.12em, uppercase; step names in Desk Ink 600.

### Named Rules
**The Printer Caps Rule.** Every printed heading is Sometype Mono 700 in uppercase, tracked 0.14em and centered, the way a thermal printer sets a store name; the envelope label uses the same caps at 1rem, 0.12em. Sometype Mono is the only family in the app, chosen by the user as "printer caps"; never add a second display face. The app title is not a printed heading: it is Sometype Mono 700 in mixed case, written on the sticky note. Headings in desk text (How it works) are small tracked caps (0.78rem, 0.12em) in Desk Ink.

**The No-Stretch Rule.** Figures are plain bold monospace: 1.12rem in Totals, 1.3rem for a receipt's TOTAL. Never scaleY or double-height figures; the user rejected stretched digits.

**The Straight Print Rule.** Tilt never touches text. Rotated text blurs on 1080p screens, so only material layers rotate: a slip's paper. Headings, lines, names, labels and buttons always sit at 0 degrees. The one sanctioned exception is the app title: large display text on the sticky note, it tilts -1.4 degrees with the note as one object, at a size that stays sharp. All small text stays straight.

## Layout

A centered page up to 1200px (padding 28px 24px 72px). Desktop is two columns: the receipt column (up to 720px) and a 372px Totals column with a 56px gap; Totals is sticky at top 28px, capped at viewport height minus 128px, with its tally scrolling inside the slip. At 1040px and below it collapses to one 720px column with a 64px gap and Totals unstuck. At 560px and below the page padding drops to 20px 16px 56px, slip padding to 20px 18px 22px, and slip tilt and stagger are removed. How it works sits below everything as a centered block of desk text, up to 560px wide, 112px below the slips.

Receipts stack with a 52px gap; even receipts are offset 22px to the right so the pile looks dropped. On paper, item and sum lines share one four-column grid, item, price, who, delete (minmax(0, 1fr), 10ch, minmax(0, 1.25fr), 32px; 12px gap), so every price and total aligns like a register. Names sit in the who column to the right of the price, set off by a 1.5px dotted Paper Dim rule with 14px inset; sum lines leave it empty. At 560px and below the who column drops under the item, indented 2ch with no rule, and lines become item, price, delete.

## Elevation & Depth

Depth is physical: objects lie on the desk and cast shadows; nothing on paper is elevated. Slips lift with a stacked drop-shadow filter that follows the torn edge; the envelope casts its own drop-shadow and overlaps the bottom of the Totals slip. Paper lies flat but is not a flat fill: its surface is two procedural textures multiplied onto the paper color, both noise lit like a bumpy sheet by a distant light from the upper left (azimuth 225). A fine fiber tooth (high-frequency fractal noise, 0.8 by 0.55, 3 octaves, elevation 55, surface scale 1.6) remapped to 0.92 to 1.0 in a 240px tile, over soft mottling (low-frequency clouds at 0.012, elevation 65, surface scale 3) remapped to 0.955 to 1.0 in a 600px tile, with a faint 115-degree white sheen on top in soft-light. There is no curl, no darkened ends, no contact shadow and no banding or fade over the print. The soft-light grain belongs to the desk and the kraft, not the paper. Only a receipt rises while something in it has focus (z-index 3), so its people suggestions overlap the next slip; the Totals slip never rises, so it always stays inside its envelope.

### Shadow Vocabulary
- **Slip lift** (`filter: drop-shadow(0 1px 1px rgba(0,0,0,.35)) drop-shadow(0 12px 18px rgba(0,0,0,.30))`): every slip, so the torn edge casts a true shadow.
- **Envelope** (`filter: drop-shadow(0 -1px 3px rgba(0,0,0,.16)) drop-shadow(0 12px 18px rgba(0,0,0,.32))`): the kraft envelope, following its notched outline.
- **Note** (`filter: drop-shadow(0 1px 1px rgba(0,0,0,.25)) drop-shadow(0 8px 12px rgba(0,0,0,.28))`): the title sticky note and its tape.
- **Popover** (`box-shadow: 0 14px 28px rgba(0,0,0,.45), 0 1px 2px rgba(0,0,0,.3)`): the desk menu; the people picker uses a lighter `0 10px 24px rgba(0,0,0,.28), 0 1px 2px rgba(0,0,0,.2)`.

### Named Rules
**The Objects Cast Shadows Rule.** Only physical objects on the desk (slips, envelope, title note, popovers) cast shadows, and always soft and downward. Nothing printed on paper gets a shadow.

**The Flat Paper Rule.** Thermal paper lies flat: no curl gradients, end darkening, banding, contact shadows or thermal fade overlays. Its surface is a lit fiber texture (fine fiber tooth over soft mottling, multiplied onto the paper color), never a plain fill and never darker than the 0.92 floor.

## Shapes

Paper has no rounded corners. A slip is cut flat across the top and torn at the bottom; the paper and its tear are one clipped layer extending 12px below the content. Its clip-path is a polygon generated per slip from a seed by tearFor() (src/utils/tear.ts), so each slip tears differently: it covers the paper and runs the teeth along the bottom 12px across 1400px, teeth 10 to 14px wide, valleys 1.5 to 3px and tips 7.5 to 10px into the band. It is a clip-path rather than a mask because a rotated mask left a faint hairline along the paper's bottom edge. The blank Add receipt slip uses the same clip-path on a 12px strip below it. A slip whose bottom runs into the envelope has no tear. The envelope has a 22px thumb notch at its mouth and two diagonal flap seams.

Only material layers tilt (see The Straight Print Rule): receipt paper alternates -0.35 and 0.45 degrees; the Totals slip and the envelope kraft lie level; the title note and its writing -1.4, with its tape 3 degrees further. On phones slip paper lies flat. Small radii are functional only: 1px for checkboxes, 3px for printed buttons, chips, hover bands and the editing row, 4px for desk buttons. Lines are 1.5px: dotted for leaders and field baselines, dashed for rules and outline buttons, solid double for totals.

## Components

### Buttons
Printed text on paper, or quiet ink on the desk.
- **Printed outline:** 34px tall, 1.5px dashed Paper Dim border, 3px radius, Soft Print label type 600; hover fills Paper Hover, turns the border solid Soft Print and darkens the label to Thermal Print. Used for Add item, Add tax/tip/fee: present but quieter than the lines they add.
- **Printed solid / danger:** filled Thermal Print or Correction Red with paper text; hover deepens. Dialog confirm actions.
- **Text button:** Soft Print label with a dotted underline (4px offset), solid on hover; danger turns red on hover. Used for Delete receipt, Edit people. In How it works it is Dim Desk Ink, brightening on hover.
- **Icon button:** 32px square, 16px Lucide icon in Soft Print; hover Paper Shade fill. Item deletes rest at 55% opacity until row hover or focus.
- **Desk button:** 40px tall, uppercase desk-ink label with a 17px icon; hover brightens and adds a 7% light wash. Save, Load, and the overflow menu. The reference weight for secondary UI.
- **Envelope export:** full-width 42px, 2px kraft-ink border on kraft-light, bold label; hover inverts. Reads Save PDF record, then Saving… while the note is filed, then PDF downloaded with a check for 2.4s.
- **Transitions:** 140 to 160ms on color and background with ease-out (cubic-bezier(0.16, 1, 0.3, 1)).

### Chips (people)
- **Style:** only while an item is being edited, each person in the people box is a neutral removable chip: Paper Shade fill, 1px Paper Dim border, 3px radius, Thermal Print text at 0.86rem, mixed case, no tilt, with an 18px remove control in Soft Print. "Everyone on this receipt" is italic.
- **At rest:** no chips. A receipt line shows a plain comma-separated list of names in Thermal Print at 0.95rem, in People-list order; Totals shows each name as plain text.

### Cards / Containers (Slips)
- **Corner Style:** none; flat top, torn bottom.
- **Background:** Thermal Paper with the lit fiber and mottle textures and a soft sheen, on a layer behind straight content, tilted on receipts.
- **Shadow Strategy:** Slip lift.
- **Internal Padding:** 22px 26px 24px; dialogs 24px 26px 22px; toasts 14px 18px.
- **Folding a receipt:** a chevron icon button left of the name. The name, the "N items · N people" meta line, the double rule, the TOTAL line and Delete receipt always stay in place; only the body (items, add buttons, subtotal and fees) folds away. The body is inert while folded and clipped only while folded or folding, so people suggestions can overflow an open receipt. There is no separate collapsed summary.

### Inputs / Fields
- **Style:** printed straight onto paper: no box, 1.5px dotted Soft Print baseline, 55% white wash, 32px tall, red caret.
- **Focus:** baseline turns solid Thermal Print and the wash goes solid white. Other focus on paper is a 2px dashed Thermal Print outline; on the desk a 2px solid desk-ink-bright outline, 3px offset.
- **Error:** the row tints red at 7% with a red uppercase warning above it.

### Navigation
A desk header: the title note left, desk buttons right. The title note is Sticky Note paper with a subtle top highlight and bottom shade (padding 18px 28px 16px, Note shadow), with the app name in Sometype Mono 700, mixed case, in Note Ink; note and writing tilt -1.4 degrees together. A 108 by 24px strip of translucent Tape with torn ends crosses its top, rotated a further 3 degrees. The overflow menu is a paper sheet with 9px 14px items; hover and focus print in reverse (Thermal Print fill, paper text). The people picker menu uses the same reverse-print selection.

### Totals Slip and Envelope
The collection slip, lying level: a printer-caps TOTALS heading, a checkbox column (18px printed checkboxes that fill solid when ticked), each person's name in plain text (0.95rem), a dot leader, and their bold figure, with a chevron opening a dashed-spine breakdown. A double rule closes into the EVERYONE line and an "adds up" check line (red when off). The slip's bottom sinks into the kraft envelope: the kraft is a level, notched, seamed layer with grain, and on it sit the 700 caps label with its 600 subline (the flap's folds fade to a fifth up there, full only towards the bottom, so they don't compete with the words) and the export button.

### How it works
Not a slip: plain text lying on the desk below everything, so it never competes with the receipts. Dim Desk Ink at 0.84rem, up to 560px wide; small tracked uppercase headings and step names in Desk Ink; keyboard keys as outlined kbd marks; a text button reveals the rest of the tips.

### Motion
- **Feed:** new lines and toasts clip in from the top in 6 steps over 220 to 240ms, like a printer advancing paper; a receipt added with Add receipt feeds out top first too, but smoothly (420ms on the ease-out curve, no steps; not on page load), the receipt alone; then, from 360ms, its notepad strip slides out its full width from under the receipt's edge (clipped to that edge as it moves) over 340ms on the ease-out curve.
- **Re-sort:** when a change moves someone up or down Who owes what, each row slides from where it was to its new place over 560ms on the ease-out curve, the row going furthest on top, each on a patch of the note's paper carrying its own line.
- **File away:** Save PDF record drops the Who owes what note into the envelope: a 12px lift, then a falling ease-in down until only its top edge shows in the thumb notch (everything below the mouth clipped away), the envelope dipping 5px as it lands. After a 380ms beat it slides back up on the ease-out curve. The one authored moment in the app; reduced motion skips it.
- **Hover wash:** the Hover Band fades in over 120ms on the ease-out curve: across a receipt line (not while it is being edited), a Totals row, and the receipt name as a padded band (2px 10px, 3px radius), also on keyboard focus.
- **Fold:** a receipt body folds by its grid rows (1fr to 0fr) over 260ms on the ease-out curve; the fold chevron rotates -90 degrees over 200ms.
- **Dialog in:** 260ms fade and 14px drop, over a 74% near-black backdrop.
- Reduced motion collapses every animation and transition to 1ms.

#### Named Rules
**The Quiet Hover Rule.** Hover on the work is a clear but quiet wash of the ink itself (a 7% Thermal Print band), never color, a pen stroke or a motion flourish; the user found a highlighter hover "a bit too fun". It fades in briefly and never appears on a line being edited; buttons and chrome keep their own hovers.

## Do's and Don'ts

### Do:
- **Do** keep receipts and the Totals figures the loudest things on the page; help, chrome and decoration recede, with Save and Load as the reference weight for secondary UI.
- **Do** put every surface on the desk as a physical object: a slip, the envelope, or a paper menu.
- **Do** cut slips flat on top and tear only the bottom, using the seeded, gently varied tear (a per-slip clip-path polygon, 12px teeth band).
- **Do** set every printed heading in Sometype Mono 700 printer caps (1.3rem, 0.14em, centered) and everything else in Sometype Mono.
- **Do** tilt only the material layer (receipt paper) and keep every piece of text at 0 degrees; the Totals slip and envelope lie level; the title note's large writing is the one exception.
- **Do** mark hover on receipt lines, Totals rows and receipt names with the quiet 7% ink wash, faded in over 120ms.
- **Do** print Subtotal the way real receipts do: a plain mixed-case label on the left, its figure in the price column, and only TOTAL in bold.
- **Do** align prices and totals in the shared register grid (item, price, who, delete) with each line ruled across both papers.
- **Do** print names as plain text: a comma-separated Thermal Print list at 0.95rem on receipt lines (italic for "Everyone on this receipt"), plain 0.95rem names in Totals, and neutral removable chips only while an item is being edited.
- **Do** set figures in plain bold Sometype Mono: 1.12rem in Totals, 1.3rem for a receipt's TOTAL.

### Don't:
- **Don't** use rounded cards, panels or a light dashboard background.
- **Don't** rotate text, headings, buttons or whole slips; rotated text blurs. Only the title note's large writing tilts, with the note.
- **Don't** tear or zigzag the top of a slip, use uniform zigzags, or make tears very random.
- **Don't** stretch figures or headings vertically (no scaleY, no double-height digits).
- **Don't** give people colors, stamps or per-person inks; the user found colored name stamps "more like a mosaic than helpful UI".
- **Don't** let help or chrome compete with the work: no paper slip, printed headings or bright ink for How it works, and no solid or dark outlines on printed add buttons at rest.
- **Don't** use handwriting fonts, a second typeface beside Sometype Mono, or tape anywhere but the one strip across the title note.
- **Don't** add curl gradients, end darkening, banding, contact shadows or thermal fade over the paper.
- **Don't** use Faint Print for any text, including placeholders and empty states; it is for rules and leaders.
