import type { CSSProperties } from 'react'
import { LuX } from 'react-icons/lu'
import { EVERYONE } from '../utils/people'
import { stampTilt, usePersonInk } from '../utils/ink'

interface PersonTagProps {
  person: string
  onRemove?: () => void
}

// A person's name, rubber-stamped in their own ink
export default function PersonTag({ person, onRemove }: PersonTagProps) {
  const ink = usePersonInk(person)
  const everyone = person === EVERYONE
  return (
    <span
      className={`stamp ${everyone ? 'stamp--everyone' : ''} ${ink.double ? 'stamp--double' : ''}`}
      style={{ '--ink': ink.color, '--stamp-tilt': stampTilt(person) } as CSSProperties}
    >
      {person}
      {onRemove && (
        <button
          type="button"
          className="stamp__x"
          aria-label={`Remove ${person}`}
          // Mouse only: Tab goes straight to the text box, where Backspace removes
          tabIndex={-1}
          // Keep focus in the people box so the row stays open
          onMouseDown={(e) => e.preventDefault()}
          onClick={onRemove}
        >
          <LuX aria-hidden />
        </button>
      )}
    </span>
  )
}
