# Carole Venmo Splitter - App Structure

## Purpose

Track shared expenses across events and calculate per-person totals. Users split items among multiple people and get individual cost breakdowns.

## Page Structure

- Title at top: "Carole Venmo Splitter"
- Action buttons row: Save, Load, Clear, Example, Export Totals
- Two-column grid layout:
  - Left column (25% width): People section
  - Right column (75% width): Events section
- Totals section: Centered below the grid, full width

## Core Data Types

**People** (localStorage key: "people")

Array of strings representing person names.

```javascript
["Alice", "Bob", "Charlie"]
```

**Event Item**

Object representing a single expense with:
- `what` (string): Description of the item
- `howMuch` (number): Cost in dollars, can be negative for refunds/credits
- `who` (array of strings): Names of people splitting this item
- `editing` (boolean): UI state flag, included in JSON exports but should default to false on load

```javascript
{
  what: "Pizza",
  howMuch: 20.0,
  who: ["Alice", "Bob"],
  editing: false
}
```

**Event** (localStorage key: "events")

Object representing an occasion/grouping of expenses with:
- `name` (string): Event name (e.g., "Restaurant", "Groceries")
- `items` (array of Event Items): List of expenses within this event

```javascript
{
  name: "Restaurant",
  items: [
    {what: "Pizza", howMuch: 20.0, who: ["Alice", "Bob"], editing: false},
    {what: "Drinks", howMuch: 10.0, who: ["Alice"], editing: false}
  ]
}
```

Full events array:
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

- **localStorage**: Auto-saves all changes (people, events, checkedPeople)
- **JSON Export/Import**: Save/load complete app state to `.json` files
- **Text Export**: Generate human-readable receipt files

### JSON File Format

```json
{
  "people": ["Alice", "Bob", "Charlie"],
  "events": [
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

All three top-level fields required. The `editing` field is included but ignored on import.

## User Actions

### Top-Level Buttons

**Save**

- Exports current state (people, events, checkedPeople) as JSON file
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
events: [...]
checkedPeople: []

// After loading file
people: ["Bob", "Charlie"]
events: [...from file...]
checkedPeople: ["Bob"]
```

**Clear**

- Confirmation prompt
- Deletes all data (people, events, checkedPeople)

```javascript
// Before
people: ["Alice", "Bob"]
events: [{...}]
checkedPeople: ["Alice"]

// After
people: []
events: []
checkedPeople: []
```

**Example**

- Confirmation prompt
- Loads predefined example data from initState.jsx
- Replaces current data with peopleInit and eventsInit

**Export Totals**

- Generates text file with per-person receipts
- Prompts for filename with date suggestion: `receipts-YYYY-M-D.txt` (month is 0-indexed: 0=Jan, 11=Dec)
- Disabled when no valid data exists
- Also available in Totals section

**Text Export Format:**
```
Alice - Total: $15.00
$10.00 - Restaurant - Pizza
$5.00 - Groceries - Milk

Bob - Total: $22.50
$10.00 - Restaurant - Pizza
$12.50 - Restaurant - Drinks

```
Each person section: name + total, then itemized costs (person's share only) with format `$amount - EventName - ItemName`

### People Section

**Add Person**

- Text input field + "Add" button
- Enter key submits

```javascript
// Before
people: ["Alice", "Bob"]

// After adding "Charlie"
people: ["Alice", "Bob", "Charlie"]
```

**Edit Person**

- Click name to enter edit mode
- Save on: Enter key or click outside
- Cascades through all event items

```javascript
// Before
people: ["Alice", "Bob"]
events: [{
  name: "Restaurant",
  items: [{what: "Pizza", howMuch: 20, who: ["Alice", "Bob"]}]
}]
checkedPeople: ["Alice"]

// After editing "Alice" to "Alicia"
people: ["Alicia", "Bob"]
events: [{
  name: "Restaurant",
  items: [{what: "Pizza", howMuch: 20, who: ["Alicia", "Bob"]}]
}]
checkedPeople: ["Alicia"]
```

**Delete Person**

- Delete icon button next to each person
- Cascades: removes from all event items and checkedPeople

```javascript
// Before
people: ["Alice", "Bob", "Charlie"]
events: [{
  items: [
    {what: "Pizza", howMuch: 20, who: ["Alice", "Bob"]},
    {what: "Drinks", howMuch: 10, who: ["Alice", "Charlie"]}
  ]
}]
checkedPeople: ["Alice", "Bob"]

// After deleting "Alice"
people: ["Bob", "Charlie"]
events: [{
  items: [
    {what: "Pizza", howMuch: 20, who: ["Bob"]},
    {what: "Drinks", howMuch: 10, who: ["Charlie"]}
  ]
}]
checkedPeople: ["Bob"]
```

### Events Section

**Add Event**

- Text input field at top
- Creates new event with empty items array

```javascript
// Before
events: [{name: "Restaurant", items: [...]}]

// After adding "Groceries"
events: [
  {name: "Restaurant", items: [...]},
  {name: "Groceries", items: []}
]
```

**Edit Event Name**

- Click event name to edit
- Save on: Enter key or click outside

```javascript
// Before
events: [{name: "Restaurant", items: [...]}]

// After editing to "Dinner"
events: [{name: "Dinner", items: [...]}]
```

**Delete Event**

- "Delete Event" button on each event
- Removes entire event and all its items

```javascript
// Before
events: [
  {name: "Restaurant", items: [...]},
  {name: "Groceries", items: [...]}
]

// After deleting "Restaurant"
events: [{name: "Groceries", items: [...]}]
```

**Event Total Display**

- Calculated value, not stored in data
- Shows sum of all item costs in event
- Format: "Event Name --- Event Total: $XX.XX"

### Event Items (within each event)

**Add Item**

- "Add event item" button below items list
- Creates new item in edit mode

```javascript
// Before
events: [{
  name: "Restaurant",
  items: [{what: "Pizza", howMuch: 20, who: ["Alice"], editing: false}]
}]

// After clicking "Add event item"
events: [{
  name: "Restaurant",
  items: [
    {what: "Pizza", howMuch: 20, who: ["Alice"], editing: false},
    {what: "", howMuch: 0, who: [], editing: true}
  ]
}]
```

**Edit Item**

- Click any item field to enter edit mode
- Three-field form: What, How much, Who (chips to toggle)
- Save on: Enter key or click outside

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

```javascript
// Before
events: [{
  name: "Restaurant",
  items: [
    {what: "Pizza", howMuch: 20, who: ["Alice"]},
    {what: "Drinks", howMuch: 10, who: ["Bob"]}
  ]
}]

// After deleting "Drinks"
events: [{
  name: "Restaurant",
  items: [{what: "Pizza", howMuch: 20, who: ["Alice"]}]
}]
```

**Item Display**

- Read-only view when editing: false
- Shows: "1. [what] $[howMuch] [selected people as chips]"

### Totals Section

**Person Accordions**

- One accordion per person (from people array)
- Shows calculated total amount owed
- Expand to see itemized breakdown
- Values calculated on-the-fly, not stored

**Checkbox per Person**

- Modifies checkedPeople array
- UI filter only, doesn't affect calculations

```javascript
// Before (checkbox unchecked)
checkedPeople: ["Alice"]

// After checking "Bob"
checkedPeople: ["Alice", "Bob"]

// After unchecking "Alice"
checkedPeople: ["Bob"]
```

**Itemized View (expanded)**

- Calculated on-the-fly from events data
- Groups items by event
- Shows person's share: item.howMuch / item.who.length
- Format: "[Item name] $[person's share]"

**Export Totals Button**

- Duplicate of top-level Export Totals button
- Generates text file, no data modification

## Calculation Logic

**Per-Person Total**

Iterates through all events and items. For each item assigned to the person, calculates their share (item cost divided by number of people splitting it) and adds to running total. Returns total formatted to 2 decimal places.

Example implementation:

```javascript
function getTotalForPerson(person) {
  const totalsByPerson = {};
  events.forEach((event) => {
    event.items.forEach((item) => {
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

**Event Total**

Sums all item costs within a single event. Returns total formatted to 2 decimal places.

Example implementation:

```javascript
const eventTotal = event.items
  .reduce((total, item) => {
    return total + item.howMuch;
  }, 0)
  .toFixed(2);
```

## Key Behaviors

**Cascading Updates**

- Editing person name: updates name in all event items' `who` arrays
- Deleting person: removes from all event items, removes from checkedPeople

**Inline Editing Pattern**

- Items toggle between display and edit modes via `editing` boolean
- Click to edit, blur/Enter to save
- Focus management for smooth UX

**State Validation**

- Export/totals disabled until valid data exists:
  - At least one person
  - At least one event with one item
  - At least one item with at least one person assigned

**Data Integrity**

- No backend/database - purely client-side
- localStorage as single source of truth during session
- JSON files for long-term storage/sharing

## Edge Cases

**Duplicate Person Names**

- No validation prevents duplicate names in people array
- System allows multiple people with identical names
- May cause confusion in totals/assignments but no technical errors

**Empty who Array**

- Items with `who: []` are allowed
- Item cost still counts toward event total
- No person is charged for the item in totals calculations

**Stale Names in Loaded Data**

- Loading JSON file can introduce names in item.who arrays that don't exist in people array
- These stale names appear in item chips but not in Totals section
- No automatic cleanup - user must manually edit items or add missing people

## Example Data

The "Example" button loads the following predefined data from `src/initState.jsx`:

```javascript
const eventsInit = [
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
        who: ["Brietta", "Valry", "Nick", "Barnard", "Teresa"],
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
