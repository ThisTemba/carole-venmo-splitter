---
name: Carole Venmo Splitter
description: Receipts as real thermal slips on a dark desk; totals collected in a kraft envelope.
colors:
  desk-0: "#0f0c0a"
  desk-1: "#17130f"
  desk-2: "#201a14"
  desk-3: "#2b231b"
  desk-4: "#3a3026"
  desk-ink: "#b9ab95"
  desk-ink-dim: "#9a8c78"
  desk-ink-bright: "#eadfca"
  paper: "#eceff1"
  paper-hover: "#e4e8eb"
  paper-shade: "#dde1e5"
  paper-dim: "#d0d5da"
  print: "#423e50"
  print-deep: "#1d1b22"
  print-soft: "#585565"
  print-faint: "#a19ea6"
  print-red: "#b3261e"
  print-red-deep: "#96201a"
  highlight: "#f3d86a"
  kraft: "#a6825a"
  kraft-light: "#b8946a"
  kraft-ink: "#24180c"
  tape: "rgba(226, 212, 176, 0.94)"
  ink-0: "#1f4fa3"
  ink-1: "#b0302a"
  ink-2: "#23744a"
  ink-3: "#6a3fa0"
  ink-4: "#0d6f7c"
  ink-5: "#9c5218"
  ink-6: "#a22d6b"
  ink-7: "#53661b"
typography:
  sign:
    fontFamily: "Bungee, 'Arial Black', sans-serif"
    fontSize: "1.45rem"
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: "0.02em"
  marker:
    fontFamily: "'Permanent Marker', 'Comic Sans MS', cursive"
    fontSize: "clamp(1.45rem, 1.1rem + 1.4vw, 2.05rem)"
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: "0.01em"
  figure:
    fontFamily: "'Sometype Mono', ui-monospace, 'SF Mono', Menlo, monospace"
    fontSize: "1.12rem"
    fontWeight: 700
    lineHeight: 1.5
    fontFeature: "tnum"
  body:
    fontFamily: "'Sometype Mono', ui-monospace, 'SF Mono', Menlo, monospace"
    fontSize: "0.9rem"
    fontWeight: 400
    lineHeight: 1.5
    fontFeature: "tnum"
  label:
    fontFamily: "'Sometype Mono', ui-monospace, 'SF Mono', Menlo, monospace"
    fontSize: "0.74rem"
    fontWeight: 600
    lineHeight: 1.5
    letterSpacing: "0.06em"
  stamp:
    fontFamily: "'Sometype Mono', ui-monospace, 'SF Mono', Menlo, monospace"
    fontSize: "0.74rem"
    fontWeight: 700
    lineHeight: 1.5
    letterSpacing: "0.07em"
rounded:
  stamp: "1px"
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
    textColor: "{colors.print}"
    rounded: "{rounded.print}"
    padding: "0 12px"
    height: "34px"
    typography: "{typography.label}"
  print-btn-hover:
    backgroundColor: "{colors.paper-hover}"
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
  stamp:
    rounded: "{rounded.stamp}"
    padding: "1px 6px"
    typography: "{typography.stamp}"
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
  menu-item-active:
    backgroundColor: "{colors.print}"
    textColor: "{colors.paper}"
    padding: "9px 14px"
---

# Design System: Carole Venmo Splitter

## Overview

**Creative North Star: "The Desk Under One Lamp"**

The app is a warm near-black desk at night, lit by a single lamp, with real objects lying on it. Every receipt is a cool white thermal slip, cut flat across the top, torn off at the bottom, tilted a fraction of a degree and lifted off the desk by a soft shadow. Totals is the collection slip, standing in a kraft envelope that holds the export action. The app title is written in marker on a strip of masking tape. No panels, cards, or dashboard chrome: if something is a surface, it is a physical object with a material.

On paper, everything prints in one monospace face on one character grid, in faded grey-violet thermal ink. The only exceptions are the chunky signage caps of printed headings and the per-person stamp inks. Figures line up like a register: dot leaders run to right-aligned prices in a shared column, totals sit under dashed and double rules. Each person is a rubber stamp in their own ink, consistent everywhere they appear.

Density is that of a real receipt: compact lines, uppercase item names, small tracked labels, and generous space between slips on the desk. Motion is mechanical and brief: new lines feed out of the printer in steps, and changed figures re-ink.

**Key Characteristics:**
- Dark warm desk on a strict tonal ramp with a faint lamp pool and grain.
- Cool thermal paper with a flat-cut top, a seeded, gently varied torn bottom, slight tilt, and lifted shadow.
- One monospace face (Sometype Mono) for everything printed; Bungee only for printed headings; Permanent Marker only for handwriting on tape and kraft.
- Eight stamp inks, one per person by People-list position.
- Register alignment: dot leaders, a shared price column, dashed and double rules.

## Colors

A warm brown-black desk ramp under a cool grey-white paper, printed in one muted violet-grey ink, with eight saturated stamp inks reserved for people.

### Primary
- **Thermal Print** (print): the ink of everything on paper: item text, prices, headings, solid buttons, checked boxes, reverse-print highlights in menus and pickers. Its hover deepens to **Spent Ribbon** (print-deep).

### Secondary
- **Stamp Inks** (ink-0 to ink-7: Postal Blue, Cancel Red, Ledger Green, Violet Pad, Teal Pad, Rust Pad, Magenta Pad, Olive Pad): one per person, assigned by their index in the People list, used for that person's stamp border and name, everywhere. All clear about 5:1 on paper.

### Tertiary
- **Kraft** (kraft, kraft-light, kraft-ink): the envelope body, its lighter mouth and export button, and its dark marker ink. **Masking Tape** (tape): the title strip only.
- **Correction Red** (print-red, deepening to print-red-deep): errors, warnings, destructive actions, the "doesn't add up" line, and the text caret in fields.
- **Highlighter** (highlight): text selection only.

### Neutral
- **Desk ramp** (desk-0 darkest to desk-4): page background gradient (desk-2 to desk-0), body fill (desk-1), scrollbar thumb (desk-4).
- **Desk Ink** (desk-ink), **Dim** (desk-ink-dim), **Bright** (desk-ink-bright): quiet text and buttons that sit directly on the desk; bright is hover and the global focus ring.
- **Thermal Paper** (paper): every slip, menu and picker. **Paper Hover** (paper-hover) and **Paper Shade** (paper-shade): row hover and the editing row. **Paper Dim** (paper-dim): the older-looking "How it works" slip and picker borders.
- **Faint Print** (print-faint): dot leaders, dashed rules, and the dashed breakdown spine.

### Named Rules
**The Ink Belongs to People Rule.** The eight stamp inks mean "this person" and nothing else. Never use them for status, categories or decoration. Past eight people the inks repeat with a double border (people 9 to 16), so neighbours stay distinct.

**The One Ink Rule.** Everything printed on a slip is Thermal Print or Soft Print; red is reserved for things that are wrong or destructive.

## Typography

**Display Font:** Bungee (with Arial Black), printed headings only
**Body Font:** Sometype Mono 400/600/700 (with ui-monospace, SF Mono, Menlo), self-hosted
**Handwriting Font:** Permanent Marker (with Comic Sans MS), on tape and kraft only

**Character:** Chunky shop-sign caps over a strict register monospace, with one human hand writing on the tape and envelope. Tabular figures are on globally.

### Hierarchy
- **Sign** (400, 1.45rem, 1.1, uppercase, 0.02em, centered): every printed heading: receipt names, TOTALS, How it works, dialog titles (1.15rem in dialogs, 1.25rem in the receipt-name input).
- **Marker** (400, clamp(1.45rem, 1.1rem + 1.4vw, 2.05rem)): the app title on tape; 1.3rem for the envelope label.
- **Figure** (700, 1.12rem): per-person totals amounts, the EVERYONE line, and receipt TOTAL lines. Plain bold, no stretching.
- **Body** (400, 0.9rem on slips, 15px on the desk, 1.5): item lines in uppercase with 0.03em tracking; dialogs at 0.88rem, breakdowns and toasts at 0.8 to 0.82rem.
- **Label** (600 or 400, 0.72 to 0.8rem, 0.06 to 0.12em, uppercase): buttons, receipt meta and summary, notes, table headers, the "adds up" line.
- **Stamp** (700, 0.74rem, 0.07em, uppercase): person names.

### Named Rules
**The Signage Heading Rule.** Every printed heading is Bungee caps, centered. Nothing else on paper uses Bungee.

**The No-Stretch Rule.** Figures are plain bold monospace at 1.12rem. Never scaleY or double-height figures; the user rejected stretched digits.

**The Marker Is Handwriting Rule.** Permanent Marker appears only where a person would have written by hand: the tape title and the envelope label.

## Layout

A centered page up to 1100px (padding 28px 24px 72px). Desktop is two columns: the receipt column (up to 600px) and a 372px Totals column with a 56px gap; Totals is sticky at top 28px, capped at viewport height minus 128px, with its tally scrolling inside the slip. At 1040px and below it collapses to one 600px column with a 64px gap and Totals unstuck. At 560px and below the page padding drops to 20px 16px 56px, slip padding to 20px 18px 22px, and tilt and stagger are removed.

Receipts stack with a 52px gap; even receipts are offset 22px to the right so the pile looks dropped. On paper, item and sum lines share one grid (text, a 10ch price column, a 36px action column, 12px gap) so every price and total aligns like a register. Person stamps wrap under their item, indented 2ch.

## Elevation & Depth

Depth is physical: objects lie on the desk and cast shadows; nothing on paper is elevated. Slips lift with a stacked drop-shadow filter, receipts add a blurred elliptical contact shadow where their curled bottom meets the desk, the envelope casts its own shadow and overlaps the bottom of the Totals slip. Paper carries its own shading (darker curled ends, edge vignettes, soft-light grain, a faint thermal banding over the ink).

### Shadow Vocabulary
- **Slip lift** (`filter: drop-shadow(0 1px 1px rgba(0,0,0,.45)) drop-shadow(0 16px 22px rgba(0,0,0,.42))`): every slip, so the torn edge casts a true shadow.
- **Curl contact** (`radial-gradient(closest-side, rgba(0,0,0,.55), transparent)`, blurred 3px, 22px tall below the receipt): receipts only.
- **Envelope** (`box-shadow: 0 -2px 6px rgba(0,0,0,.18), 0 14px 24px rgba(0,0,0,.45)`): the kraft envelope.
- **Tape** (`box-shadow: 0 2px 6px rgba(0,0,0,.35)`): the title strip.
- **Popover** (`box-shadow: 0 14px 28px rgba(0,0,0,.45), 0 1px 2px rgba(0,0,0,.3)`): the desk menu; the people picker uses a lighter `0 10px 24px rgba(0,0,0,.28), 0 1px 2px rgba(0,0,0,.2)`.

### Named Rules
**The Objects Cast Shadows Rule.** Only physical objects on the desk (slips, envelope, tape, popovers) cast shadows, and always soft and downward. Nothing printed on paper gets a shadow.

## Shapes

Paper has no rounded corners. A slip is cut flat across the top and torn at the bottom: a 12px band of teeth masked by an SVG tiled every 360px, generated from a seed per slip so each tears differently, with teeth 10 to 14px wide and gently varied peak and valley depth. A slip whose bottom runs into the envelope has no tear. The tape title has torn ends via clip-path. The envelope has a 22px thumb notch at its mouth and two diagonal flap seams.

Slips tilt between -0.6 and 0.5 degrees; stamps tilt a stable -1.2 to 1.2 degrees per name; the tape tilts -1.6 degrees and the envelope -0.8. Small radii are functional only: 1px for stamps and checkboxes, 3px for printed buttons and row hovers, 4px for desk buttons. Lines are 1.5px: dotted for leaders and field baselines, dashed for rules and outline buttons, solid double for totals.

## Components

### Buttons
Printed text on paper, or quiet ink on the desk.
- **Printed outline:** 34px tall, 1.5px dashed Soft Print border, 3px radius, label type 600; hover fills Paper Hover and turns the border solid Thermal Print. Used for Add item, Add tax/tip/fee.
- **Printed solid / danger:** filled Thermal Print or Correction Red with paper text; hover deepens. Dialog confirm actions.
- **Text button:** Soft Print label with a dotted underline (4px offset), solid on hover; danger turns red on hover. Used for Delete receipt, Edit people.
- **Icon button:** 32px square, 16px Lucide icon in Soft Print; hover Paper Shade fill. Item deletes rest at 55% opacity until row hover or focus.
- **Desk button:** 40px tall, uppercase desk-ink label with a 17px icon; hover brightens and adds a 7% light wash. Save, Load, and the overflow menu.
- **Envelope export:** full-width 42px, 2px kraft-ink border on kraft-light, bold label; hover inverts.
- **Transitions:** 140 to 160ms on color and background with ease-out (cubic-bezier(0.16, 1, 0.3, 1)).

### Stamps (people)
- **Style:** 1.5px border and text in the person's ink, 1px radius, uppercase bold 0.74rem, a stable small tilt, a speckled rubber-ink mask and multiply blend.
- **Variants:** double 4px border for people 9 to 16; dashed border for "Everyone on this receipt"; plain Thermal Print for a name not in the People list. An 18px remove control appears when editing.

### Cards / Containers (Slips)
- **Corner Style:** none; flat top, torn bottom.
- **Background:** Thermal Paper (Paper Dim for How it works) with gradients and grain.
- **Shadow Strategy:** Slip lift, plus curl contact for receipts.
- **Internal Padding:** 22px 26px 24px; dialogs 24px 26px 22px; toasts 14px 18px.

### Inputs / Fields
- **Style:** printed straight onto paper: no box, 1.5px dotted Soft Print baseline, 55% white wash, 32px tall, red caret.
- **Focus:** baseline turns solid Thermal Print and the wash goes solid white. Other focus on paper is a 2px dashed Thermal Print outline; on the desk a 2px solid desk-ink-bright outline, 3px offset.
- **Error:** the row tints red at 7% with a red uppercase warning above it.

### Navigation
A desk header: tape title left, desk buttons right. The overflow menu is a paper sheet with 9px 14px items; hover and focus print in reverse (Thermal Print fill, paper text). The people picker menu uses the same reverse-print selection.

### Totals Slip and Envelope
The collection slip: a Bungee TOTALS heading, a checkbox column (18px printed checkboxes that fill solid when ticked), each person's stamp, a dot leader, and their bold figure, with a chevron opening a dashed-spine breakdown. A double rule closes into the EVERYONE line and an "adds up" check line (red when off). The slip's bottom sinks into the kraft envelope, which carries the marker label and the export button.

### Motion
- **Feed:** new lines, receipts and toasts clip in from the top in 6 steps over 220 to 240ms, like a printer advancing paper.
- **Re-ink:** changed figures fade up from 30% opacity and 1.5px blur over 420ms.
- **Dialog in:** 260ms fade and 14px drop, over a 74% near-black backdrop.
- Reduced motion collapses every animation and transition to 1ms.

## Do's and Don'ts

### Do:
- **Do** put every surface on the desk as a physical object: a slip, the envelope, tape, or a paper menu.
- **Do** cut slips flat on top and tear only the bottom, using the seeded, gently varied tear (12px teeth band, 360px tile).
- **Do** set every printed heading in Bungee caps and everything else on paper in Sometype Mono.
- **Do** align prices and totals in the shared register grid with dot leaders.
- **Do** give each person their stamp ink by People-list position, with a double border from person 9.
- **Do** set figures in plain bold Sometype Mono at 1.12rem.

### Don't:
- **Don't** use rounded cards, panels or a light dashboard background.
- **Don't** tear or zigzag the top of a slip, use uniform zigzags, or make tears very random.
- **Don't** stretch figures or headings vertically (no scaleY, no double-height digits).
- **Don't** use stamp inks for anything other than people.
- **Don't** use Permanent Marker on paper, or Bungee outside printed headings.
- **Don't** use Faint Print for text people need to read; it is for rules and leaders.
