# Carole Venmo Splitter - App Structure

## Purpose

Track shared expenses across receipts and calculate per-person totals. Users split items among multiple people and get individual cost breakdowns.

## Page Structure

- Title at top left: "Carole Venmo Splitter"
- Easter egg: the title's sticky note can be dragged anywhere on the page and stays where it's dropped until the page is reloaded (landing at a fresh slight tilt). Double-click it to send it home. Not mentioned anywhere in the app
- Action buttons at top right: Save, Load, and a "⋯" menu with "Load example data" and "Clear all data". The PDF record is saved from the envelope at the end of Who owes what
- A small, quiet "How it works" section below everything (narrow, centered, quiet text right on the desk so it doesn't compete with the receipts), always shown: four steps with examples: add a receipt (e.g. "Sakura Sushi"); add items, with bullets for what was it (e.g. "Salmon roll"), how much was it (e.g. "12"), and who had it (e.g. "Omar" or "Maya, Omar"); add tax, tip, and fees, which are split by how much each person ordered; send the requests (each person's slip under the receipts, amount click-to-copy), and a "Tips" list of shortcuts, features, and power moves, most useful first (only the first shows until "Show N more tips"). The fuller items vs. taxes, tips, and fees explanation stays behind the ? next to "Add tax, tip, or fee"
- There's always at least one receipt: on a first visit, after clearing, or after deleting the last receipt, a blank one is waiting. On a fresh start (first visit, clear) its name box is open and ready to type into
- Look and feel: see DESIGN.md (receipts as thermal-paper slips on a dark desk)
- Two columns: Receipts on the left (up to 820px), Who owes what on the right (380px). Who owes what stays in view while scrolling: pinned 28px from the top, or, when it's taller than the window (a breakdown open), pinned by its bottom so none of it is out of reach; never an inner scrollbar. At 1040px and below it's one column, Who owes what under the receipts. The notepad strip of names is 374px (314px at 1240px and below, 380px once it's one column, 300px at 820px and below)
- There's no separate People section: people are added from receipts' people boxes and renamed or removed from the ⋯ on their line in Who owes what

## Core Data Types

**People** (localStorage key: "people")

Array of strings representing person names.

```javascript
["Alice", "Bob", "Charlie"]
```

**Receipt Item**

Object representing a single expense with:
- `what` (string): Description of the item
- `howMuch` (number): Cost in dollars, can be negative for refunds/credits
- `who` (array of strings): Names of people splitting this item
- `proportional` (boolean, optional): Marks a tax, tip, or fee. Split in proportion to spend instead of evenly (see Calculation Logic). Omitted on regular items
- `everyone` (boolean, optional): Split between everyone on this receipt instead of the people in `who` (which is then empty). "Everyone on this receipt" means anyone named on one of the receipt's items, worked out each time, so it includes people added later. If nobody on the receipt is named, it's everyone in the People list
- `editing` (boolean): UI state flag, included in JSON exports but should default to false on load

```javascript
{
  what: "Pizza",
  howMuch: 20.0,
  who: ["Alice", "Bob"],
  editing: false
}
```

**Receipt** (localStorage key: "receipts"; data under the older "events" key is read once and moved)

Object representing an occasion/grouping of expenses with:
- `name` (string): Receipt name (e.g., "Restaurant", "Groceries")
- `items` (array of Receipt Items): List of expenses within this receipt
- `collapsed` (boolean, optional): Folded down to a one-line summary in the UI

```javascript
{
  name: "Restaurant",
  items: [
    {what: "Pizza", howMuch: 20.0, who: ["Alice", "Bob"], editing: false},
    {what: "Drinks", howMuch: 10.0, who: ["Alice"], editing: false}
  ]
}
```

Full receipts array:
```javascript
[
  {name: "Restaurant", items: [...]},
  {name: "Groceries", items: [...]}
]
```

## Storage & Persistence

- **localStorage**: Auto-saves all changes (people, receipts)
- **JSON Export/Import**: Save/load complete app state to `.json` files
- **PDF record**: a dated PDF of every receipt and who owes what
- **Sharing**: each person's amount, or their breakdown as an invoice image, copied to the clipboard

### JSON File Format

```json
{
  "people": ["Alice", "Bob", "Charlie"],
  "receipts": [
    {
      "name": "Restaurant",
      "items": [
        {
          "what": "Pizza",
          "howMuch": 20.0,
          "who": ["Alice", "Bob"],
          "editing": false
        }
      ]
    }
  ]
}
```

Saved files use `receipts`. Files saved before the rename use `events` instead, and Load accepts either. The `editing` field is included but ignored on import.

## User Actions

### Top-Level Buttons

**Save**

- Exports current state (people, receipts) as JSON file
- Prompts for a filename, suggesting `carole-M-D-YYYY`, or the receipt's name when there's only one (e.g. `mexican-restaurant-10-4-2026`)
- Downloads `.json` file
- No data modification

**Load**

- Opens file picker for `.json` files
- Replaces all current data with loaded state

Example:
```javascript
// Before (current state)
people: ["Alice"]
receipts: [...]

// After loading file
people: ["Bob", "Charlie"]
receipts: [...from file...]
```

**Clear all data** (in the "⋯" menu)

- Confirmation prompt
- Deletes all data (people, receipts) and starts over with one blank receipt, its name box ready

```javascript
// Before
people: ["Alice", "Bob"]
receipts: [{...}]

// After
people: []
receipts: [{ name: "", items: [] }]
```

**Load example data** (in the "⋯" menu)

- Confirmation prompt
- Loads predefined example data from `src/data/initState.ts`
- Replaces current data with peopleInit and receiptsInit

**Save PDF record** (on the envelope under Totals)

- The payer's own record of the outing, as one dated PDF (Letter, in Courier). First page, a summary: "Receipts" (each receipt's name and total, then All receipts) and "Who owes what" (everyone's total, most first, then the Everyone total and whether it matches the receipts). Then, from a new page, every receipt as entered (items, who had each, subtotal, taxes/tips/fees, total), then "Each person" on a new page (each person's total, then what they had on each receipt)
- Each receipt, and Who owes what, stays on one page when it fits on one
- Downloads `carole-M-D-YYYY.pdf`, or names it after the receipt when there's only one (e.g. `mexican-restaurant-10-4-2026.pdf`)
- Disabled when no valid data exists. Made in the browser with jsPDF, loaded only when the button is pressed

### People

People are managed where they're used rather than in their own section.

**Add Person**

- From any item's people box: type a name that doesn't match anyone and choose `Add "<name>"`
- A list of names separated by commas or spaces (e.g. `Omar, Theo Kai`) adds everyone in it at once. Each name must be typed in full (ignoring case), so a half-typed name never picks the wrong person; anything that isn't someone's full name becomes a new person. Within a space-separated run, the longest run of words that's someone's full name counts as one name, so `Mary Ann Nick` is Mary Ann and Nick when Mary Ann is on the People list. The suggestion spells out the result, e.g. `Add Omar, Theo, Kai (new)`
- With commas, the list is the only suggestion. With only spaces the text could also be one name, so matches for the whole text (e.g. `mary a` → Mary Ann) come first, then the list, then adding the whole text as one new person (e.g. `Add "Bob Smith"`)

```javascript
// Before
people: ["Alice", "Bob"]

// After adding "Charlie"
people: ["Alice", "Bob", "Charlie"]
```

**Name Capitalization**

- A new or renamed name typed entirely in lowercase gets its first letter capitalized ("zara" → "Zara"). Any other capitalization is kept as typed ("mcKenzie", "LIA")
- The suggestion shows the result before it's added, e.g. `Add "Zara"`

**Rename Person**

- "Rename" in the ⋯ menu on their line in Who owes what: the name becomes a name box, with the name selected. Edit and press Enter or leave the box to save (Escape undoes)
- Refused (with a message) if someone else already has that name, ignoring case
- Cascades through all receipt items

```javascript
// Before
people: ["Alice", "Bob"]
receipts: [{
  name: "Restaurant",
  items: [{what: "Pizza", howMuch: 20, who: ["Alice", "Bob"]}]
}]

// After editing "Alice" to "Alicia"
people: ["Alicia", "Bob"]
receipts: [{
  name: "Restaurant",
  items: [{what: "Pizza", howMuch: 20, who: ["Alicia", "Bob"]}]
}]
```

**Delete Person**

- "Remove" in the ⋯ menu on their line in Who owes what
- Asks for confirmation first, saying how many items they're on
- Cascades: removes from all receipt items

```javascript
// Before
people: ["Alice", "Bob", "Charlie"]
receipts: [{
  items: [
    {what: "Pizza", howMuch: 20, who: ["Alice", "Bob"]},
    {what: "Drinks", howMuch: 10, who: ["Alice", "Charlie"]}
  ]
}]

// After deleting "Alice"
people: ["Bob", "Charlie"]
receipts: [{
  items: [
    {what: "Pizza", howMuch: 20, who: ["Bob"]},
    {what: "Drinks", howMuch: 10, who: ["Charlie"]}
  ]
}]
```

### Receipts Section

**Add Receipt**

- "Add receipt" below the receipts: the outline of the next receipt traced on the desk (a receipt's paper width, one thin line with the same torn bottom as the receipts), "+ Add receipt" in the middle; it brightens and fills faintly on hover
- Creates a new receipt with its name box focused (placeholder "Where? e.g. Bar night")
- Enter saves the name and opens a blank first item, so you can go straight to typing items
- Leaving the name box empty (Escape, Enter, or clicking away) removes the new receipt if it has no items, or names it "Untitled receipt" if it has filled-in items. Leaving it for the receipt's first line (clicking Add item or Add tax, tip, or fee) keeps the receipt, still unnamed. So does leaving it for another new receipt (clicking Add receipt again): adding two in a row gives two, the second with its name box open

```javascript
// Before
receipts: [{name: "Restaurant", items: [...]}]

// After adding "Groceries"
receipts: [
  {name: "Restaurant", items: [...]},
  {name: "Groceries", items: []}
]
```

**Edit Receipt Name**

- Click receipt name to edit
- Save on: Enter key or click outside

```javascript
// Before
receipts: [{name: "Restaurant", items: [...]}]

// After editing to "Dinner"
receipts: [{name: "Dinner", items: [...]}]
```

**Delete Receipt**

- "Delete receipt" button on each receipt
- Asks for confirmation first
- Removes entire receipt and all its items

```javascript
// Before
receipts: [
  {name: "Restaurant", items: [...]},
  {name: "Groceries", items: [...]}
]

// After deleting "Restaurant"
receipts: [{name: "Groceries", items: [...]}]
```

**Receipt Layout**

Each receipt is laid out like a paper receipt. The header shows a collapse chevron, the name, and "Delete receipt"; totals are at the bottom.

- The chevron folds the receipt to one line: name · item count · total. Opening one of its items from the "needs attention" list unfolds it
- Folded, the notepad strip shows who was on the receipt, e.g. "Teresa, Valry, Nick & Barnard" (up to five lines, the full list on hover), fading in once the items have folded away. Not on phones, which have no strip

- Regular items, then an "Add item" line
- A rule, then a "Subtotal" line (regular items only; shown when there are taxes, tips, or fees)
- Tax, tip, and fee items, then an "Add tax, tip, or fee" line with a ? button that explains the difference
- The add lines are small tracked labels (`+ ADD ITEM`), quieter than the items so they never read as one. The whole line is the button; on hover or keyboard focus it gets the hover band, the label darkens, and a faint ghost `$0.00` shows in the price column. On phones the ghost price is dropped
- Solid line, then "Total"
- Subtotal and total are calculated, not stored, and line up with the price column

### Receipt Items (within each receipt)

**Add Item**

- The "Add item" line below the items
- Creates new item in edit mode

```javascript
// Before
receipts: [{
  name: "Restaurant",
  items: [{what: "Pizza", howMuch: 20, who: ["Alice"], editing: false}]
}]

// After clicking "Add item"
receipts: [{
  name: "Restaurant",
  items: [
    {what: "Pizza", howMuch: 20, who: ["Alice"], editing: false},
    {what: "", howMuch: 0, who: [], editing: true}
  ]
}]
```

**Add Tax, Tip, or Fee**

- The "Add tax, tip, or fee" line below the taxes, tips, and fees
- Creates a `proportional: true` item in edit mode, set to "Everyone on this receipt"
- Proportional items are split in proportion to each person's share of the receipt's regular (non-proportional) items, instead of evenly
- E.g. A orders $50, B orders $10, a $12 tip splits $10 / $2
- An item's type is fixed when it's added; proportional items are listed under the subtotal

**Reorder Items**

- Each line has a drag handle in the receipt's left margin (shown on hover, faintly visible on touch screens). Drag it up or down to move the line; its names on the strip move with it
- Lines move within their own group: items among items, taxes, tips, and fees among themselves
- The handle is for mouse and touch only (not a tab stop). From the keyboard: Tab to the line, then Alt+↑ / Alt+↓ moves it, and focus moves with it
- Moving a line closes any open row on that receipt

**Edit Item**

- Each line's item name is one tab stop ("Edit <item>"): Enter or Space opens the row at What. After Escape, focus goes back to that line so tabbing carries on from there

- Click any item field to open the row, with the cursor in that field
- Three fields: What (placeholder "What was it?", or "Tax, tip, or fee"), How much, Who
- Who is a tag box: type part of a name and press Enter to add the highlighted suggestion, or click a suggestion. "Everyone on this receipt" is the first suggestion and sets `everyone: true`; while it's set there are no other suggestions, and it shows as that single tag (removing it lets you pick names). Adding people by name always keeps their names, even if that's everyone. Remove someone with their × (mouse only, so Tab goes straight to the text box), or Backspace in an empty box
- Empty box placeholder: "Type names to add people"
- "Everyone on this receipt" isn't offered until at least one person exists
- Nothing is highlighted until you type (highlights the best match) or use the arrow keys / hover. Enter adds the highlighted suggestion if there is one
- If the typed name doesn't exactly match anyone, the last suggestion is `Add "<name>"`, which adds them to the People list and the item
- Enter moves What → How much → Who (Tab works too). In the Who box, Tab accepts what's typed (the highlighted match or list of names) and moves on to the next row of the same kind (items to items, taxes/tips/fees to taxes/tips/fees), starting a new one from the last; Enter with nothing typed or highlighted does the same. On a blank row, either one just closes it
- Escape or clicking outside closes the row. A row left with no name and no price is removed
- While typing, hover highlights are hidden until the mouse moves, so a finished row under a resting pointer doesn't stay lit beside the one being typed in
- Closing waits until any click in progress finishes, so warnings appearing or blank rows disappearing can't move a button out from under the cursor
- Incomplete rows only show their "Missing: ..." warning (and appear in the "needs attention" list) after they've been closed

```javascript
// Before (editing: false)
{what: "Pizza", howMuch: 20, who: ["Alice"], editing: false}

// User clicks item, enters edit mode
{what: "Pizza", howMuch: 20, who: ["Alice"], editing: true}

// User changes values and saves
{what: "Large Pizza", howMuch: 25, who: ["Alice", "Bob"], editing: false}
```

**Delete Item**

- Delete icon on each item, at the end of its names on the notepad strip (so the price sits close to the names). It shows on hover and while the row is open, and stays visible on touch screens and on phones, where it's beside the price
- Available in both read and edit modes
- Asks for confirmation first, except for blank rows

```javascript
// Before
receipts: [{
  name: "Restaurant",
  items: [
    {what: "Pizza", howMuch: 20, who: ["Alice"]},
    {what: "Drinks", howMuch: 10, who: ["Bob"]}
  ]
}]

// After deleting "Drinks"
receipts: [{
  name: "Restaurant",
  items: [{what: "Pizza", howMuch: 20, who: ["Alice"]}]
}]
```

**Item Display**

- Read-only view when the row isn't open
- Shows: "[what] $[howMuch] [people as tags]"
- Items set to everyone show a single "Everyone on this receipt" tag; hovering it lists who that currently is

### Who Owes What Section

Beside the receipts (under them on narrow screens), on the desk.

**Header**

- Printed at the top of the note, like a receipt's heading: "WHO OWES WHAT" in printer caps, "15 people" under it. If anything on the receipts isn't on anyone's total (an item left with no person), it adds in red how much isn't split yet; not while that item is still open and being filled in
- Before anyone's on an item there's no note, so "WHO OWES WHAT" sits on the desk with "Add people to items on a receipt to see what everyone owes."
- Under the rule, a little handwritten note (the title's marker hand) sits over the amounts: "click to copy" ("tap to copy" on touch screens), with a curly arrow pointing down at the first amount

**Needs Attention**

- When items are incomplete, a small slip above the note lists them as "Receipt: Item (no ...)" in red
- Clicking one opens that row with the cursor in the first missing field (unfolding its receipt if collapsed)

**The Note**

- A slip (up to 360px wide, so amounts sit close to names, and always 20px narrower than the envelope): on lined notebook paper (a cooler white than the receipts and the notepad strip, faint blue rules, a red margin line between the chevrons and the names), square-cut at the bottom where it stands in the envelope; the heading sits in a blank band at the top, and from the first name down each row is written on a rule, 32px apart. An opened breakdown takes whole lines, rounded up, so the rows below it stay on the rules
- One line per person: "⌄ Name   $amount  [⋯]". The chevron hangs in the margin
- Most owed first (ties keep People-list order), always. When a change moves someone up or down, the rows slide to their new places
- **Amount**: copies just the number (e.g. `68.19`), ready to paste into a Venmo request; "Copied" shows beside it for a moment, as a small dark ink badge
- **Name** (the name and the whole line up to the amount; its hover band runs that far): opens what they had underneath, in an outlined box under their line, a little wider than the names (from just left of them to the end of the ⋯): their name at the top in spaced caps, each receipt's share (bold caps), then its items with their share, then a ruled TOTAL line with their total, and a Copy as image button (the same as the ⋯ menu's; it reads "Image copied" once done) at the foot (someone on no items yet shows "Not on any items yet.")
- **⋯** (right of the amount, always shown): a menu with Copy amount (the same as clicking the amount), Copy as image (their breakdown as an invoice, a small thermal-receipt image headed with the person's name (e.g. "NICK"), the date, their items by receipt, the total, rendered on a canvas and put on the clipboard as a PNG; browsers that can't copy images download it instead; the ⋯ spins while it's made and "Image copied" shows beside the amount once copied; greyed out for someone on no items), Rename (the name becomes a name box: Enter or clicking away saves, Escape undoes) and Remove (asks first, saying how many items they're on)
- A hand-drawn black rule and TOTAL (everyone's totals together) close the note, the figure underlined twice in blue ballpoint
- Values calculated on-the-fly, not stored

**Envelope**

- The note stands in a kraft envelope, its foot tucked inside (the note keeps three blank lines clear at the bottom for it): "For your records · Who owes what, every receipt, and what each person had" with the Save PDF record button. When the record can't be saved yet (nobody is on an item), the subline says "Put someone on an item to save a record"
- Pressing Save PDF record files the note away: it lifts slightly, drops into the envelope until only its top edge shows in the thumb notch, the envelope dips as it lands, the PDF downloads, and after a beat the note slides back out. The button reads "Saving…" meanwhile, then "PDF downloaded" with a check for a couple of seconds. With reduced motion there's no animation

## Calculation Logic

**Per-Person Total**

Iterates through all receipts and items. For each item assigned to the person, calculates their share and adds to running total. Returns total formatted to 2 decimal places.

- Regular items: item cost divided by number of people splitting it
- Tax, tip, or fee (`proportional: true`): item cost × (person's share of the receipt's regular items ÷ the combined regular-item shares of everyone on the item). Other tax/tip/fee items are excluded from the base, so tax doesn't affect how tip splits
- If no one on a tax/tip/fee item has regular items in the receipt, it falls back to an even split

Each item is split in whole cents. Leftover cents go to the people with the largest remainders (ties go to whoever is listed first on the item), so every item's shares add up exactly, and so do the per-person totals.

The example implementation below shows the even split only, without cent rounding; the real logic lives in `getItemShares` in `src/utils/calculations.ts`.

Example implementation:

```javascript
function getTotalForPerson(person) {
  const totalsByPerson = {};
  receipts.forEach((receipt) => {
    receipt.items.forEach((item) => {
      if (item.who.includes(person)) {
        const itemCostPerPerson = item.howMuch / item.who.length;
        totalsByPerson[person] =
          (totalsByPerson[person] || 0) + itemCostPerPerson;
      }
    });
  });
  return (totalsByPerson[person] || 0).toFixed(2);
}
```

**Receipt Total**

Sums all item costs within a single receipt. Returns total formatted to 2 decimal places.

Example implementation:

```javascript
const receiptTotal = receipt.items
  .reduce((total, item) => {
    return total + item.howMuch;
  }, 0)
  .toFixed(2);
```

## Key Behaviors

**Cascading Updates**

- Editing person name: updates name in all receipt items' `who` arrays
- Deleting person: removes from all receipt items

**Inline Editing Pattern**

- One item row is open at a time; which one is UI state, not stored in data
- Click to open, Escape or click outside to close (see Edit Item)
- A whole receipt can be typed from the keyboard: add the receipt, then name → Enter → price → Enter → people → Enter → next row

**State Validation**

- The PDF record is disabled until valid data exists:
  - At least one person
  - At least one receipt with one item
  - At least one item with at least one person assigned

**Data Integrity**

- No backend/database - purely client-side
- localStorage as single source of truth during session
- JSON files for long-term storage/sharing

## Code Organization

- `src/types.ts`: saved data (`Receipt`, `ReceiptItem`) and UI state (`ItemField`, `Editing`)
- `src/utils/calculations.ts`: money math: who an item is split between (including "Everyone on this receipt"), each person's share in whole cents, totals
- `src/utils/validation.ts`: whether data is complete: blank and incomplete items, "Missing: ..." labels, `canExport`
- `src/components/TitleNote.tsx`: the title on its sticky note, and the drag-it-anywhere easter egg
- `src/utils/people.ts`: name rules (capitalizing all-lowercase names) and the people box's suggestions, including lists of names
- `src/utils/dom.ts`: waiting for a click to finish before changing layout; blurring the focused element
- `src/utils/text.ts`: `plural()`
- `src/utils/fileExport.ts`: Save, Load (accepts `events` or `receipts`), and file names
- `src/utils/share.ts`: copying an amount, and the invoice image
- `src/utils/palette.ts`: the print colors for the invoice image and the PDF, kept in step with the CSS tokens
- `src/utils/record.ts`: the PDF record
- `src/hooks/useLocalStorage.ts`: state saved to localStorage, with a legacy key fallback
- `src/hooks/usePeopleActions.ts`: adding, renaming, and removing people, keeping items in step
- `src/hooks/useConfirm.tsx`: the confirmation dialog used for every delete
- `src/App.tsx`: page layout and shared state, including which item row is open
- Receipts: `ReceiptsSection` (list, adding/removing receipts and items) → `ReceiptCard` (one receipt) → `ReceiptName`, `ItemList` (one group of lines, drag to reorder; dnd-kit) → `ReceiptItemRow` → `PeopleInput` (the people tag box) → `PersonTag`
- Who owes what: `TotalsSection` (header, the note with a `PersonLine` per person, envelope) → `NeedsAttention`, `PersonBreakdown`, `PersonName` (the rename box with remove)
- Help: `HowItWorks` (bottom of the page), `ItemTypesDialog` (the ? next to "Add tax, tip, or fee")

## Edge Cases

**Duplicate Person Names**

- Adding someone from a people box matches existing names (ignoring case) instead of adding a duplicate, and renaming to a name someone else has is refused
- Duplicates can still arrive in a loaded JSON file; they cause confusion in totals but no technical errors

**Empty who Array**

- Items with `who: []` are allowed
- Item cost still counts toward receipt total
- No person is charged for the item in totals calculations

**"Everyone on This Receipt" With No Named People**

- If every item on a receipt is set to everyone, nobody is named, so "everyone on this receipt" falls back to the whole People list
- Name the people on at least one item to narrow it down

**Older Data With Explicit Names**

- Items saved before `everyone` existed keep their explicit names and don't update when people are added; set them to "Everyone on this receipt" to change that

**Stale Names in Loaded Data**

- Loading JSON file can introduce names in item.who arrays that don't exist in people array
- These stale names appear in item chips but not in Who owes what
- No automatic cleanup - user must manually edit items or add missing people

## Example Data

"Load example data" loads the following predefined data from `src/data/initState.ts`:

```javascript
const receiptsInit = [
  {
    name: "Mexican Restaurant",
    items: [
      {
        what: "Enchiladas",
        howMuch: 17,
        who: ["Brietta"],
        editing: false,
      },
      {
        what: "Chiles Rellenos",
        howMuch: 18,
        who: ["Nick"],
        editing: false,
      },
      {
        what: "Horchata",
        howMuch: 24,
        who: ["Brietta", "Nick", "Teresa", "Valry"],
        editing: false,
      },
      {
        what: "Gringas",
        howMuch: 14,
        who: ["Barnard"],
        editing: false,
      },
      {
        what: "Birria",
        howMuch: 38,
        who: ["Teresa", "Valry"],
        editing: false,
      },
      {
        what: "Tax+Tip",
        howMuch: 32.86,
        who: [],
        proportional: true,
        everyone: true,
        editing: false,
      },
    ],
  },
  {
    name: "Buffet Restaurant",
    items: [
      {
        what: "Total",
        howMuch: 206.43,
        who: [
          "Eda",
          "Harmony",
          "Teresa",
          "Valry",
          "Nick",
          "Brietta",
          "Barnard",
        ],
        editing: false,
      },
    ],
  },
  {
    name: "Movie Theater",
    items: [
      {
        what: "Movie",
        howMuch: 62.2,
        who: ["Eda", "Harmony", "Teresa", "Barnard", "Chandler"],
        editing: false,
      },
    ],
  },
  {
    name: "Italian Restaurant",
    items: [
      {
        what: "Bucatini",
        howMuch: 18.5,
        who: ["Teresa"],
        editing: false,
      },
      {
        what: "Spagetti A la Vodka",
        howMuch: 37,
        who: ["Barnard", "Morry"],
        editing: false,
      },
      {
        what: "Linguine & Clams",
        howMuch: 19,
        who: ["Eda"],
        editing: false,
      },
      {
        what: "Rigatoni",
        howMuch: 18.5,
        who: ["Harmony"],
        editing: false,
      },
      {
        what: "Pesto Pizza",
        howMuch: 18,
        who: ["Chandler"],
        editing: false,
      },
      {
        what: "GF Fusili",
        howMuch: 20,
        who: ["Fredi"],
        editing: false,
      },
      {
        what: "Parmesan Crusted Chicken",
        howMuch: 22.75,
        who: ["Fonzie"],
        editing: false,
      },
      {
        what: "Gnocchi",
        howMuch: 19,
        who: ["Curtis"],
        editing: false,
      },
      {
        what: "Espresso",
        howMuch: 3,
        who: ["Teresa"],
        editing: false,
      },
      {
        what: "Cappuccino",
        howMuch: 8,
        who: ["Eda", "Chandler"],
        editing: false,
      },
      {
        what: "Cake Fee",
        howMuch: 20,
        who: [
          "Eda",
          "Harmony",
          "Teresa",
          "Barnard",
          "Chandler",
          "Fonzie",
          "Fredi",
          "Curtis",
          "Morry",
        ],
        editing: false,
      },
      {
        what: "Tax + Tip",
        howMuch: 57.05,
        proportional: true,
        who: [],
        everyone: true,
        editing: false,
      },
    ],
  },
  {
    name: "Reimbursements",
    items: [
      {
        what: "Meal + Movie Refund",
        howMuch: -43,
        who: ["Chandler"],
        editing: false,
      },
      {
        what: "Meal + Movie",
        howMuch: 43,
        who: [
          "Eda",
          "Teresa",
          "Barnard",
          "Fonzie",
          "Curtis",
          "Jilly",
          "Tobie",
          "Diandra",
        ],
        editing: false,
      },
      {
        what: "Cupcakes",
        howMuch: 28.33,
        who: [
          "Eda",
          "Teresa",
          "Barnard",
          "Fonzie",
          "Curtis",
          "Jilly",
          "Tobie",
          "Diandra",
        ],
        editing: false,
      },
    ],
  },
];

const peopleInit = [
  "Eda",
  "Harmony",
  "Teresa",
  "Valry",
  "Nick",
  "Brietta",
  "Barnard",
  "Chandler",
  "Fonzie",
  "Fredi",
  "Curtis",
  "Morry",
  "Jilly",
  "Tobie",
  "Diandra",
];
```
