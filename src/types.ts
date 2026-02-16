export interface EventItem {
  what: string
  howMuch: number
  who: string[]
}

export interface Event {
  name: string
  items: EventItem[]
}
