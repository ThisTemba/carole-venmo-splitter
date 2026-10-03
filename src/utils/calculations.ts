import type { Event, EventItem } from '../types'

// What a person owes for an event's regular (non-proportional) items
function getRegularSpend(person: string, event: Event): number {
  return event.items
    .filter((item) => !item.proportional && item.who.includes(person))
    .reduce((sum, item) => sum + item.howMuch / item.who.length, 0)
}

export function getItemShare(item: EventItem, event: Event, person: string): number {
  if (item.proportional) {
    const base = item.who.reduce((sum, p) => sum + getRegularSpend(p, event), 0)
    if (base !== 0) return (item.howMuch * getRegularSpend(person, event)) / base
  }
  return item.howMuch / item.who.length
}

export function getTotalForPerson(person: string, events: Event[]): string {
  const items = getItemsForPerson(person, events)
  const total = items.reduce((sum, item) => sum + parseFloat(item.share), 0)
  return total.toFixed(2)
}

export function getEventTotal(event: Event): string {
  const total = event.items.reduce((sum, item) => sum + item.howMuch, 0)
  return total.toFixed(2)
}

export interface PersonItem {
  eventName: string
  item: EventItem
  share: string
}

export function getItemsForPerson(person: string, events: Event[]): PersonItem[] {
  const items: PersonItem[] = []
  events.forEach((event) => {
    event.items.forEach((item) => {
      if (item.who.includes(person)) {
        const share = getItemShare(item, event, person).toFixed(2)
        items.push({ eventName: event.name, item, share })
      }
    })
  })
  return items
}

export function groupItemsByEvent(items: PersonItem[]): Record<string, PersonItem[]> {
  return items.reduce((acc, item) => {
    if (!acc[item.eventName]) acc[item.eventName] = []
    acc[item.eventName].push(item)
    return acc
  }, {} as Record<string, typeof items>)
}
