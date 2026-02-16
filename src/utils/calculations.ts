import type { Event, EventItem } from '../types'

export function getTotalForPerson(person: string, events: Event[]): string {
  const items = getItemsForPerson(person, events)
  const total = items.reduce((sum, item) => sum + parseFloat(item.share), 0)
  return total.toFixed(2)
}

export function getEventTotal(event: Event): string {
  const total = event.items.reduce((sum, item) => sum + item.howMuch, 0)
  return total.toFixed(2)
}

export function getItemsForPerson(person: string, events: Event[]): Array<{
  eventName: string
  item: EventItem
  share: string
}> {
  const items: Array<{ eventName: string; item: EventItem; share: string }> = []
  events.forEach((event) => {
    event.items.forEach((item) => {
      if (item.who.includes(person)) {
        const share = (item.howMuch / item.who.length).toFixed(2)
        items.push({ eventName: event.name, item, share })
      }
    })
  })
  return items
}

export function groupItemsByEvent(items: Array<{ eventName: string; item: EventItem; share: string }>): Record<string, typeof items> {
  return items.reduce((acc, item) => {
    if (!acc[item.eventName]) acc[item.eventName] = []
    acc[item.eventName].push(item)
    return acc
  }, {} as Record<string, typeof items>)
}
