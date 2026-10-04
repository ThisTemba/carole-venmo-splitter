import type { Receipt, ReceiptItem } from '../types'

// Split an amount into whole cents by weight. Leftover cents go to the largest
// remainders (ties to whoever is listed first), so the parts always add up exactly.
function splitCents(amount: number, weights: number[]): number[] {
  const totalCents = Math.round(amount * 100)
  const totalWeight = weights.reduce((sum, w) => sum + w, 0)
  if (totalWeight === 0) return splitCents(amount, weights.map(() => 1))

  const exact = weights.map((w) => (totalCents * w) / totalWeight)
  const cents = exact.map((e) => Math.floor(e + 1e-9))
  const leftover = totalCents - cents.reduce((sum, c) => sum + c, 0)
  exact
    .map((e, i) => ({ i, remainder: e - cents[i] }))
    .sort((a, b) => b.remainder - a.remainder || a.i - b.i)
    .slice(0, leftover)
    .forEach(({ i }) => cents[i]++)
  return cents
}

// "Everyone on this receipt": anyone named on one of its items, in People list
// order. If nobody is named, everyone in the People list.
export function getReceiptPeople(receipt: Receipt, people: string[]): string[] {
  const named = new Set(receipt.items.filter((item) => !item.everyone).flatMap((item) => item.who))
  if (named.size === 0) return people
  return [...people.filter((p) => named.has(p)), ...[...named].filter((p) => !people.includes(p))]
}

// Who an item is split between
export function getItemPeople(item: ReceiptItem, receipt: Receipt, people: string[]): string[] {
  return item.everyone ? getReceiptPeople(receipt, people) : item.who
}

// What each person owes for a receipt's regular (non-proportional) items
function getRegularSpends(receipt: Receipt, people: string[]): Map<string, number> {
  const spends = new Map<string, number>()
  receipt.items
    .filter((item) => !item.proportional)
    .forEach((item) => {
      const who = getItemPeople(item, receipt, people)
      who.forEach((p) => spends.set(p, (spends.get(p) ?? 0) + item.howMuch / who.length))
    })
  return spends
}

// Each person's share of an item, in cents. Regular items split evenly; taxes,
// tips, and fees split in proportion to each person's regular spend.
function getItemShares(item: ReceiptItem, receipt: Receipt, people: string[], spends: Map<string, number>): Map<string, number> {
  const who = getItemPeople(item, receipt, people)
  const weights = who.map((p) => (item.proportional ? (spends.get(p) ?? 0) : 1))
  const cents = splitCents(item.howMuch, weights)
  return new Map(who.map((p, i) => [p, cents[i]]))
}

// A person's total, from their items
export function sumItems(items: PersonItem[]): string {
  return items.reduce((sum, item) => sum + parseFloat(item.share), 0).toFixed(2)
}

export function getSubtotal(receipt: Receipt): number {
  return receipt.items
    .filter((item) => !item.proportional)
    .reduce((sum, item) => sum + item.howMuch, 0)
}

export function getReceiptTotal(receipt: Receipt): number {
  return receipt.items.reduce((sum, item) => sum + item.howMuch, 0)
}

export interface PersonItem {
  // Which receipt, by position: two receipts can share a name
  receiptIndex: number
  receiptName: string
  item: ReceiptItem
  share: string
}

// Everyone's items with their shares, worked out in one pass: each item is
// split once, not once per person
export function getItemsByPerson(receipts: Receipt[], people: string[]): Map<string, PersonItem[]> {
  const byPerson = new Map<string, PersonItem[]>(people.map((p) => [p, []]))
  receipts.forEach((receipt, receiptIndex) => {
    const spends = getRegularSpends(receipt, people)
    receipt.items.forEach((item) => {
      getItemShares(item, receipt, people, spends).forEach((cents, person) => {
        if (!byPerson.has(person)) byPerson.set(person, [])
        byPerson.get(person)!.push({ receiptIndex, receiptName: receipt.name, item, share: (cents / 100).toFixed(2) })
      })
    })
  })
  return byPerson
}

export interface ReceiptGroup {
  receiptIndex: number
  receiptName: string
  items: PersonItem[]
}

// A person's items, receipt by receipt in receipt order. Grouped by receipt,
// not by name, so two receipts called the same thing stay apart.
export function groupItemsByReceipt(items: PersonItem[]): ReceiptGroup[] {
  const groups = new Map<number, ReceiptGroup>()
  items.forEach((item) => {
    const group = groups.get(item.receiptIndex)
    if (group) group.items.push(item)
    else groups.set(item.receiptIndex, { receiptIndex: item.receiptIndex, receiptName: item.receiptName, items: [item] })
  })
  return [...groups.values()]
}
