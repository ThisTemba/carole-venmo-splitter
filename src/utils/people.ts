// Name handling and the people box's suggestions

export const EVERYONE = 'Everyone on this receipt'

// "zara" → "Zara". Names with any capitals are left as typed ("McKenzie", "DJ").
export function tidyName(name: string): string {
  const trimmed = name.trim()
  return trimmed === trimmed.toLowerCase() ? trimmed.charAt(0).toUpperCase() + trimmed.slice(1) : trimmed
}

const isEveryoneWord = (name: string) => ['everyone', EVERYONE.toLowerCase()].includes(name.toLowerCase())

// The person a typed name is, ignoring case. In a list a name has to be typed
// in full, so a half-typed one never picks the wrong person.
const findExact = (typed: string, people: string[]) =>
  people.find((p) => p.toLowerCase() === typed.toLowerCase())

// The names in one comma-separated part, split at spaces. The longest run of
// words that's someone's full name counts as one name, so "Mary Ann" stays
// together when she's on the People list.
function namesInPart(part: string, people: string[]): string[] {
  const words = part.split(/\s+/).filter(Boolean)
  const names: string[] = []
  for (let i = 0; i < words.length; ) {
    let len = words.length - i
    while (len > 1 && !findExact(words.slice(i, i + len).join(' '), people)) len--
    names.push(words.slice(i, i + len).join(' '))
    i += len
  }
  return names
}

// "Omar, Theo Kai" → Omar, Theo, and Kai as a new person
function parseNameList(query: string, people: string[]): string[] {
  const names = query
    .split(',')
    .flatMap((part) => namesInPart(part, people))
    .filter((name) => !isEveryoneWord(name))
    .map((name) => findExact(name, people) ?? tidyName(name))
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
//
// A list of names, split by commas or spaces, is suggested as one option that
// adds them all. With commas it's the only option. With only spaces it could
// also be one name ("Mary Ann"), so it comes after any matches for the whole
// text, and adding the whole text as one new person is still offered last.
export function getPeopleOptions(
  people: string[],
  selected: string[],
  everyone: boolean,
  query: string,
): PeopleOption[] {
  if (everyone) return []
  const listOf = (names: string[]): PeopleOption[] =>
    names.length ? [{ kind: 'list', names, isNew: (name) => !people.includes(name) }] : []
  if (query.includes(',')) return listOf(parseNameList(query, people))
  const typed = query.trim().replace(/\s+/g, ' ')
  const q = typed.toLowerCase()
  const remaining = people.filter((p) => !selected.includes(p))
  const matches = [
    ...remaining.filter((p) => p.toLowerCase().startsWith(q)),
    ...remaining.filter((p) => !p.toLowerCase().startsWith(q) && p.toLowerCase().includes(q)),
  ]
  // Means nobody until someone's been added
  const showEveryone = people.length > 0 && EVERYONE.toLowerCase().startsWith(q)
  const isNew = typed && !isEveryoneWord(typed) && ![...people, ...selected].some((p) => p.toLowerCase() === q)
  const listNames = typed.includes(' ') ? parseNameList(typed, people) : []
  const list = listNames.length > 1 && !showEveryone ? listOf(listNames) : []
  const whole = [
    ...(showEveryone ? [{ kind: 'everyone' as const }] : []),
    ...matches.map((name) => ({ kind: 'person' as const, name })),
  ]
  return [
    ...(whole.length ? [...whole, ...list] : list),
    ...(isNew ? [{ kind: 'new' as const, name: tidyName(typed) }] : []),
  ]
}
