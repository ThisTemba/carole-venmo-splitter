import type { Receipt } from '../types'
import { toaster } from './toast'

export function formatDate(): string {
  const now = new Date()
  const month = now.getMonth() + 1
  const day = now.getDate()
  const year = now.getFullYear()
  return `${month}-${day}-${year}`
}

// A file name for the outing: the receipt's name when there's just one
// ("mexican-restaurant-10-4-2026"), otherwise `fallback` with the date
export function fileName(receipts: Receipt[], fallback: string): string {
  const only = receipts.length === 1 ? receipts[0].name : ''
  const slug = only
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
  return `${slug || fallback}-${formatDate()}`
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export function downloadJSON(people: string[], receipts: Receipt[], filename: string) {
  const data = { people, receipts }
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  downloadBlob(blob, `${filename}.json`)
}

export function loadJSON(
  file: File,
  setPeople: (people: string[]) => void,
  setReceipts: (receipts: Receipt[]) => void,
) {
  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target?.result as string)
      if (data.people) setPeople(data.people)
      // Files saved before the rename use "events"
      const receipts = data.receipts ?? data.events
      if (receipts) setReceipts(receipts)
      toaster.success({
        title: 'Data loaded',
        description: 'Successfully loaded data from file',
      })
    } catch {
      toaster.error({
        title: 'Invalid JSON file',
        description: 'Could not parse the selected file',
      })
    }
  }
  reader.readAsText(file)
}
