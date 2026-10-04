import { createContext, useContext } from 'react'

const INK_COUNT = 8

// Everyone in the People list, so each person keeps one stamp ink everywhere
export const PeopleInkContext = createContext<string[]>([])

export interface PersonInk {
  color: string
  // Past the eighth person inks come round again, so their stamps print a
  // double border to keep everyone distinct
  double: boolean
}

// A person's stamp ink, by their place in the People list so neighbors
// differ. Anyone not in the list yet gets plain print.
export function usePersonInk(person: string): PersonInk {
  const people = useContext(PeopleInkContext)
  const i = people.indexOf(person)
  if (i === -1) return { color: 'var(--print)', double: false }
  return { color: `var(--ink-${i % INK_COUNT})`, double: Math.floor(i / INK_COUNT) % 2 === 1 }
}

// A slight, stable stamp angle per name
export function stampTilt(person: string): string {
  let hash = 0
  for (const ch of person) hash = (hash * 31 + ch.charCodeAt(0)) | 0
  return `${((Math.abs(hash) % 5) - 2) * 0.6}deg`
}
