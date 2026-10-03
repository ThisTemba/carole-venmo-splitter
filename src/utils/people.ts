// Name handling and the people box's suggestions

export const EVERYONE = 'Everyone on this receipt'

// "zara" → "Zara". Names with any capitals are left as typed ("McKenzie", "DJ").
export function tidyName(name: string): string {
  const trimmed = name.trim()
  return trimmed === trimmed.toLowerCase() ? trimmed.charAt(0).toUpperCase() + trimmed.slice(1) : trimmed
}

const isEveryoneWord = (name: string) => ['everyone', EVERYONE.toLowerCase()].includes(name.toLowerCase())

// The person a typed name means, matched the same way as the suggestions:
// exact, then starts with, then contains. Undefined if nobody matches.
function findPerson(typed: string, people: string[]): string | undefined {
  const q = typed.toLowerCase()
  return (
    people.find((p) => p.toLowerCase() === q) ??
    people.find((p) => p.toLowerCase().startsWith(q)) ??
    people.find((p) => p.toLowerCase().includes(q))
  )
}

// "om, th, Kai" → Omar, Theo, and Kai as a new person
function parseNameList(query: string, people: string[]): string[] {
  const names = query
    .split(',')
    .map((part) => part.trim())
    .filter((name) => name && !isEveryoneWord(name))
    .map((name) => findPerson(name, people) ?? tidyName(name))
  return [...new Set(names)]
}

export type PeopleOption =
  | { kind: 'everyone' }
  | { kind: 'person'; name: string }
  | { kind: 'new'; name: string }
  | { kind: 'list'; names: string[]; isNew: (name: string) => boolean }

export function optionLabel(option: PeopleOption): string {
  if (option.kind === 'everyone') return EVERYONE
  if (option.kind === 'new') return `Add "${option.name}"`
  if (option.kind === 'list')
    return `Add ${option.names.map((n) => (option.isNew(n) ? `${n} (new)` : n)).join(', ')}`
  return option.name
}

// Suggestions for what's typed: "Everyone on this receipt" first, then names
// that start with the text, then names that contain it, then adding it as a
// new person. None while "Everyone on this receipt" is chosen.
export function getPeopleOptions(
  people: string[],
  selected: string[],
  everyone: boolean,
  query: string,
): PeopleOption[] {
  if (everyone) return []
  if (query.includes(',')) {
    const names = parseNameList(query, people)
    return names.length ? [{ kind: 'list', names, isNew: (name) => !people.includes(name) }] : []
  }
  const typed = query.trim()
  const q = typed.toLowerCase()
  const remaining = people.filter((p) => !selected.includes(p))
  const matches = [
    ...remaining.filter((p) => p.toLowerCase().startsWith(q)),
    ...remaining.filter((p) => !p.toLowerCase().startsWith(q) && p.toLowerCase().includes(q)),
  ]
  // Means nobody until someone's been added
  const showEveryone = people.length > 0 && EVERYONE.toLowerCase().startsWith(q)
  const isNew = typed && !isEveryoneWord(typed) && ![...people, ...selected].some((p) => p.toLowerCase() === q)
  return [
    ...(showEveryone ? [{ kind: 'everyone' as const }] : []),
    ...matches.map((name) => ({ kind: 'person' as const, name })),
    ...(isNew ? [{ kind: 'new' as const, name: tidyName(typed) }] : []),
  ]
}
