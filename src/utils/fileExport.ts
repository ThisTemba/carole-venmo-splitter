import type { Event } from '../types'
import { toaster } from '../components/ui/toaster'
import { getItemsForPerson } from './calculations'

export function formatDate(): string {
  const now = new Date()
  const month = now.getMonth() + 1
  const day = now.getDate()
  const year = now.getFullYear()
  return `${month}-${day}-${year}`
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export function downloadJSON(people: string[], events: Event[], checkedPeople: string[], filename: string) {
  const data = { people, events, checkedPeople }
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  downloadBlob(blob, `${filename}.json`)
}

export function loadJSON(
  file: File,
  setPeople: (people: string[]) => void,
  setEvents: (events: Event[]) => void,
  setCheckedPeople: (checked: string[]) => void,
) {
  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target?.result as string)
      if (data.people) setPeople(data.people)
      if (data.events) setEvents(data.events)
      if (data.checkedPeople) setCheckedPeople(data.checkedPeople)
      toaster.success({
        title: 'Data loaded',
        description: 'Successfully loaded data from file',
      })
    } catch (err) {
      toaster.error({
        title: 'Invalid JSON file',
        description: 'Could not parse the selected file',
      })
    }
  }
  reader.readAsText(file)
}

export function exportTotals(people: string[], events: Event[], checkedPeople: string[]) {
  const filteredPeople = checkedPeople.length > 0 ? people.filter(p => checkedPeople.includes(p)) : people

  let text = `${formatDate()}\n`
  text += '='.repeat(50) + '\n\n'

  filteredPeople.forEach((person) => {
    const items = getItemsForPerson(person, events)
    const total = items.reduce((sum, item) => sum + parseFloat(item.share), 0)

    const itemsByEvent: Record<string, Array<{ what: string; share: string }>> = {}
    items.forEach((item) => {
      if (!itemsByEvent[item.eventName]) itemsByEvent[item.eventName] = []
      itemsByEvent[item.eventName].push({ what: item.item.what, share: item.share })
    })

    text += `${person.toUpperCase()}\n`
    text += '-'.repeat(50) + '\n\n'

    Object.entries(itemsByEvent).forEach(([eventName, eventItems]) => {
      text += `  ${eventName}\n`
      text += '  ' + '-'.repeat(46) + '\n'
      eventItems.forEach((item) => {
        const itemName = item.what.padEnd(35)
        const price = `$${item.share}`.padStart(10)
        text += `  ${itemName}${price}\n`
      })
      if (eventItems.length > 1) {
        const subtotal = eventItems.reduce((sum, item) => sum + parseFloat(item.share), 0)
        text += '  ' + '-'.repeat(46) + '\n'
        const subtotalLabel = 'Subtotal'.padEnd(35)
        const subtotalPrice = `$${subtotal.toFixed(2)}`.padStart(10)
        text += `  ${subtotalLabel}${subtotalPrice}\n`
      }
      text += '\n'
    })

    text += '  ' + '='.repeat(46) + '\n'
    const totalLabel = 'TOTAL'.padEnd(35)
    const totalPrice = `$${total.toFixed(2)}`.padStart(10)
    text += `  ${totalLabel}${totalPrice}\n`
    text += '  ' + '='.repeat(46) + '\n\n\n'
  })

  const blob = new Blob([text], { type: 'text/plain' })
  downloadBlob(blob, `totals-${formatDate()}.txt`)
}
