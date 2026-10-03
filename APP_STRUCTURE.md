# Carole Venmo Splitter - App Structure

## Purpose

Track shared expenses across receipts and calculate per-person totals. Users split items among multiple people and get individual cost breakdowns.

## Page Structure

- Title at top: "Carole Venmo Splitter"
- Action buttons row: Save, Load, and a "⋯" menu with "Load example data" and "Clear all data". Export lives in the Totals section
- A small, quiet "How it works" section below everything (narrow, centered, no card), always shown: four steps with examples: add a receipt (e.g. "Sakura Sushi"); add items, with bullets for what was it (e.g. "Salmon roll"), how much was it (e.g. "12"), and who had it (e.g. "Omar" or "Maya, Omar"); add tax, tip, and fees, which are split by how much each person ordered; see the totals, and a "Tips" list of shortcuts and power moves, most useful first (only the first shows until "Show N more tips"). The fuller items vs. taxes, tips, and fees explanation stays behind the ? next to "Add tax, tip, or fee"
- With no receipts, the Receipts section says "No receipts yet."
- Two-column grid layout (stacks on narrow screens):
  - Left column: Receipts section
  - Right column (360px): Totals section, which stays in view while scrolling
- There's no separate People section: people are added from receipts' people boxes and renamed or removed from Totals

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

**Checked People** (localStorage key: "cp")

Array of strings representing checked state for each person. Checkboxes appear next to each person in Totals section but currently don't filter the view (state is persisted but filtering behavior not implemented).

```javascript
["Alice", "Bob"]
```

## Storage & Persistence

- **localStorage**: Auto-saves all changes (people, receipts, checkedPeople)
- **JSON Export/Import**: Save/load complete app state to `.json` files
- **Text Export**: Generate human-readable receipt files

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
  ],
  "checkedPeople": ["Alice"]
}
```

Saved files use `receipts`. Files saved before the rename use `events` instead, and Load accepts either. The `editing` field is included but ignored on import.

## User Actions

### Top-Level Buttons

**Save**

- Exports current state (people, receipts, checkedPeople) as JSON file
- Prompts for filename with date suggestion: `venmo-splitter-YYYY-M-D.json` (month is 0-indexed: 0=Jan, 11=Dec)
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
checkedPeople: []

// After loading file
people: ["Bob", "Charlie"]
receipts: [...from file...]
checkedPeople: ["Bob"]
```

**Clear all data** (in the "⋯" menu)

- Confirmation prompt
- Deletes all data (people, receipts, checkedPeople)

```javascript
// Before
people: ["Alice", "Bob"]
receipts: [{...}]
checkedPeople: ["Alice"]

// After
people: []
receipts: []
checkedPeople: []
```

**Load example data** (in the "⋯" menu)

- Confirmation prompt
- Loads predefined example data from `src/data/initState.ts`
- Replaces current data with peopleInit and receiptsInit

**Export Totals** (in the Totals section)

- Generates text file with per-person receipts for the people included in export
- Prompts for filename with date suggestion: `receipts-YYYY-M-D.txt` (month is 0-indexed: 0=Jan, 11=Dec)
- Disabled when no valid data exists

**Text Export Format:**
```
Alice - Total: $15.00
$10.00 - Restaurant - Pizza
$5.00 - Groceries - Milk

Bob - Total: $22.50
$10.00 - Restaurant - Pizza
$12.50 - Restaurant - Drinks

```
Each person section: name + total, then itemized costs (person's share only) with format `$amount - ReceiptName - ItemName`

### People

People are managed where they're used rather than in their own section.

**Add Person**

- From any item's people box: type a name that doesn't match anyone and choose `Add "<name>"`
- A comma-separated list (e.g. `om, th, Kai`) adds everyone in it at once. Each name is matched like a single entry (exact, then starts with, then contains, ignoring case); anything that matches nobody becomes a new person. The suggestion spells out the result first, e.g. `Add Omar, Theo, Kai (new)`

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

- "Edit people" in the Totals header switches the list to a name box per person; edit a name and press Enter or leave the box to save (Escape undoes). "Done" switches back
- Refused (with a message) if someone else already has that name, ignoring case
- Cascades through all receipt items

```javascript
// Before
people: ["Alice", "Bob"]
receipts: [{
  name: "Restaurant",
  items: [{what: "Pizza", howMuch: 20, who: ["Alice", "Bob"]}]
}]
checkedPeople: ["Alice"]

// After editing "Alice" to "Alicia"
people: ["Alicia", "Bob"]
receipts: [{
  name: "Restaurant",
  items: [{what: "Pizza", howMuch: 20, who: ["Alicia", "Bob"]}]
}]
checkedPeople: ["Alicia"]
```

**Delete Person**

- Trash icon next to the person's name box in Totals' "Edit people" mode
- Asks for confirmation first, saying how many items they're on
- Cascades: removes from all receipt items and checkedPeople

```javascript
// Before
people: ["Alice", "Bob", "Charlie"]
receipts: [{
  items: [
    {what: "Pizza", howMuch: 20, who: ["Alice", "Bob"]},
    {what: "Drinks", howMuch: 10, who: ["Alice", "Charlie"]}
  ]
}]
checkedPeople: ["Alice", "Bob"]

// After deleting "Alice"
people: ["Bob", "Charlie"]
receipts: [{
  items: [
    {what: "Pizza", howMuch: 20, who: ["Bob"]},
    {what: "Drinks", howMuch: 10, who: ["Charlie"]}
  ]
}]
checkedPeople: ["Bob"]
```

### Receipts Section

**Add Receipt**

- "Add receipt" button below the receipts (like "Add item" below items)
- Creates a new receipt with its name box focused (placeholder "Where? e.g. Bar night")
- Enter saves the name and opens a blank first item, so you can go straight to typing items
- Leaving the name box empty (Escape, Enter, or clicking away) removes the new receipt if it has no items, or names it "Untitled receipt" if it does

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

- The chevron folds the receipt to one line: name · item count · total. Opening one of its items from Totals' "needs attention" list unfolds it

- Regular items, then "Add item"
- Dashed line, then a "Subtotal" line (regular items only; shown when there are taxes, tips, or fees)
- Tax, tip, and fee items, then "Add tax, tip, or fee" and a ? button that explains the difference
- Solid line, then "Total"
- Subtotal and total are calculated, not stored, and line up with the price column

### Receipt Items (within each receipt)

**Add Item**

- "Add item" button below items list
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

- "Add tax, tip, or fee" button next to "Add item"
- Creates a `proportional: true` item in edit mode, set to "Everyone on this receipt"
- Proportional items are split in proportion to each person's share of the receipt's regular (non-proportional) items, instead of evenly
- E.g. A orders $50, B orders $10, a $12 tip splits $10 / $2
- An item's type is fixed when it's added; proportional items are listed under the subtotal

**Edit Item**

- Click any item field to open the row, with the cursor in that field
- Three fields: What (placeholder "What was it?", or "Tax, tip, or fee"), How much, Who
- Who is a tag box: type part of a name and press Enter to add the highlighted suggestion, or click a suggestion. "Everyone on this receipt" is the first suggestion and sets `everyone: true`; while it's set there are no other suggestions, and it shows as that single tag (removing it lets you pick names). Adding people by name always keeps their names, even if that's everyone. Remove someone with their × (mouse only, so Tab goes straight to the text box), or Backspace in an empty box
- Empty box placeholder: "Type names to add people"
- "Everyone on this receipt" isn't offered until at least one person exists
- Nothing is highlighted until you type (highlights the best match) or use the arrow keys / hover. Enter adds the highlighted suggestion if there is one
- If the typed name doesn't exactly match anyone, the last suggestion is `Add "<name>"`, which adds them to the People list and the item
- Enter moves What → How much → Who (Tab works too). In the Who box, Tab accepts what's typed (the highlighted match or comma list) and starts a new row of the same kind; Enter with nothing typed or highlighted does the same. On a blank row, either one just closes it
- Escape or clicking outside closes the row. A row left with no name and no price is removed
- Closing waits until any click in progress finishes, so warnings appearing or blank rows disappearing can't move a button out from under the cursor
- Incomplete rows only show their "Missing: ..." warning (and appear in Totals' "needs attention" list) after they've been closed

```javascript
// Before (editing: false)
{what: "Pizza", howMuch: 20, who: ["Alice"], editing: false}

// User clicks item, enters edit mode
{what: "Pizza", howMuch: 20, who: ["Alice"], editing: true}

// User changes values and saves
{what: "Large Pizza", howMuch: 25, who: ["Alice", "Bob"], editing: false}
```

**Delete Item**

- Delete icon on each item
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

### Totals Section

**Person Accordions**

- One accordion per person (from people array)
- Shows calculated total amount owed
- Expand to see itemized breakdown
- "Edit people" button in the header switches to renaming and removing people (Export is hidden until "Done")
- Values calculated on-the-fly, not stored
- An "Everyone" line under the list shows the sum of everyone's totals, which matches the receipts when every item is assigned

**Needs Attention**

- Above the list: "N items need attention", listing incomplete items (missing name, price, or person) as "Receipt: Item (no ...)"
- Clicking one opens that row with the cursor in the first missing field (unfolding its receipt if collapsed)

**Export Checkbox per Person**

- Labeled "Tick to export only some people" above the list; decides who Export Totals covers, doesn't affect calculations
- Nobody is ticked by default, which exports everyone. Ticking people exports only them. `checkedPeople` lists who's ticked
- The Export button shows the count when it's not everyone, e.g. "Export totals (2 of 7)"

```javascript
// Default: nobody ticked, so everyone is exported
checkedPeople: []

// After ticking "Bob" and "Charlie": only they're exported
checkedPeople: ["Bob", "Charlie"]
```

**Itemized View (expanded)**

- Calculated on-the-fly from receipts data
- Groups items by receipt
- Shows person's share of each item (see Calculation Logic)
- Format: "[Item name] $[person's share]"

**Export Totals Button**

- The only Export button (see Export Totals above)
- Generates text file, no data modification

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
- Deleting person: removes from all receipt items, removes from checkedPeople

**Inline Editing Pattern**

- One item row is open at a time; which one is UI state, not stored in data
- Click to open, Escape or click outside to close (see Edit Item)
- A whole receipt can be typed from the keyboard: add the receipt, then name → Enter → price → Enter → people → Enter → next row

**State Validation**

- Export/totals disabled until valid data exists:
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
- `src/utils/people.ts`: name rules (capitalizing all-lowercase names) and the people box's suggestions, including comma lists
- `src/utils/dom.ts`: waiting for a click to finish before changing layout; blurring the focused element
- `src/utils/text.ts`: `plural()`
- `src/utils/fileExport.ts`: Save, Load (accepts `events` or `receipts`), and the text export
- `src/hooks/useLocalStorage.ts`: state saved to localStorage, with a legacy key fallback
- `src/hooks/usePeopleActions.ts`: adding, renaming, and removing people, keeping items and export ticks in step
- `src/hooks/useConfirm.tsx`: the confirmation dialog used for every delete
- `src/App.tsx`: page layout and shared state, including which item row is open
- Receipts: `ReceiptsSection` (list, adding/removing receipts and items) → `ReceiptCard` (one receipt) → `ReceiptName`, `ReceiptItemRow` → `PeopleInput` (the people tag box) → `PersonTag`
- Totals: `TotalsSection` → `NeedsAttention`, `PersonBreakdown`, `PersonEditRow`
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
- These stale names appear in item chips but not in Totals section
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
