import type { Receipt } from '../types'
import { toaster } from '../components/ui/toaster'
import { tidyName } from '../utils/people'

type Setter<T> = React.Dispatch<React.SetStateAction<T>>

// Adding, renaming, and removing people, keeping items and export ticks in step
export function usePeopleActions(
  people: string[],
  setPeople: Setter<string[]>,
  setReceipts: Setter<Receipt[]>,
  setCheckedPeople: Setter<string[]>,
) {
  // Apply a change to every item's people
  const updateWho = (fn: (who: string[]) => string[]) =>
    setReceipts((prev) =>
      prev.map((receipt) => ({
        ...receipt,
        items: receipt.items.map((item) => ({ ...item, who: fn(item.who) })),
      })),
    )

  const addPerson = (name: string) => setPeople((prev) => (prev.includes(name) ? prev : [...prev, name]))

  const renamePerson = (oldName: string, typedName: string) => {
    const newName = tidyName(typedName)
    if (!newName || newName === oldName) return
    if (people.some((p) => p.toLowerCase() === newName.toLowerCase() && p !== oldName)) {
      toaster.error({ title: `There's already someone called ${newName}` })
      return
    }
    const rename = (p: string) => (p === oldName ? newName : p)
    setPeople((prev) => prev.map(rename))
    updateWho((who) => who.map(rename))
    setCheckedPeople((prev) => prev.map(rename))
  }

  const deletePerson = (name: string) => {
    setPeople((prev) => prev.filter((p) => p !== name))
    updateWho((who) => who.filter((p) => p !== name))
    setCheckedPeople((prev) => prev.filter((p) => p !== name))
  }

  return { addPerson, renamePerson, deletePerson }
}
