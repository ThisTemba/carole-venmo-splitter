export interface ReceiptItem {
  what: string
  howMuch: number
  who: string[]
  // Everyone on this receipt (see getItemPeople); `who` is ignored when set
  everyone?: boolean
  // Split in proportion to each person's spend on non-proportional items (e.g. tax, tip)
  proportional?: boolean
}

export interface Receipt {
  name: string
  items: ReceiptItem[]
  // Folded down to a one-line summary
  collapsed?: boolean
}

// UI state, not saved

export type ItemField = 'what' | 'howMuch' | 'who'

// The open item row
export interface Editing {
  receipt: number
  item: number
  field: ItemField
}
