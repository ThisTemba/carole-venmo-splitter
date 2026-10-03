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
function getItemPeople(item: ReceiptItem, receipt: Receipt, people: string[]): string[] {
  return item.everyone ? getReceiptPeople(receipt, people) : item.who
}

// What a person owes for a receipt's regular (non-proportional) items
function getRegularSpend(person: string, receipt: Receipt, people: string[]): number {
  return receipt.items
    .filter((item) => !item.proportional)
    .map((item) => ({ item, who: getItemPeople(item, receipt, people) }))
    .filter(({ who }) => who.includes(person))
    .reduce((sum, { item, who }) => sum + item.howMuch / who.length, 0)
}

// Each person's share of an item, in cents. Regular items split evenly; taxes,
// tips, and fees split in proportion to each person's regular spend.
function getItemShares(item: ReceiptItem, receipt: Receipt, people: string[]): Map<string, number> {
  const who = getItemPeople(item, receipt, people)
  const weights = who.map((p) => (item.proportional ? getRegularSpend(p, receipt, people) : 1))
  const cents = splitCents(item.howMuch, weights)
  return new Map(who.map((p, i) => [p, cents[i]]))
}

function getItemShare(item: ReceiptItem, receipt: Receipt, person: string, people: string[]): number {
  return (getItemShares(item, receipt, people).get(person) ?? 0) / 100
}

export function getTotalForPerson(person: string, receipts: Receipt[], people: string[]): string {
  const items = getItemsForPerson(person, receipts, people)
  const total = items.reduce((sum, item) => sum + parseFloat(item.share), 0)
  return total.toFixed(2)
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
  receiptName: string
  item: ReceiptItem
  share: string
}

export function getItemsForPerson(person: string, receipts: Receipt[], people: string[]): PersonItem[] {
  const items: PersonItem[] = []
  receipts.forEach((receipt) => {
    receipt.items.forEach((item) => {
      if (getItemPeople(item, receipt, people).includes(person)) {
        const share = getItemShare(item, receipt, person, people).toFixed(2)
        items.push({ receiptName: receipt.name, item, share })
      }
    })
  })
  return items
}

export function groupItemsByReceipt(items: PersonItem[]): Record<string, PersonItem[]> {
  return items.reduce((acc, item) => {
    if (!acc[item.receiptName]) acc[item.receiptName] = []
    acc[item.receiptName].push(item)
    return acc
  }, {} as Record<string, typeof items>)
}
