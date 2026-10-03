export interface EventItem {
  what: string
  howMuch: number
  who: string[]
  // Split in proportion to each person's spend on non-proportional items (e.g. tax, tip)
  proportional?: boolean
}

export interface Event {
  name: string
  items: EventItem[]
}
