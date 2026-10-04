import { LuX } from 'react-icons/lu'
import { EVERYONE } from '../utils/people'

interface PersonTagProps {
  person: string
  onRemove?: () => void
}

// A person in the people box while an item is open, removable with the x
export default function PersonTag({ person, onRemove }: PersonTagProps) {
  return (
    <span className={`chip ${person === EVERYONE ? 'chip--everyone' : ''}`}>
      {person}
      {onRemove && (
        <button
          type="button"
          className="chip__x"
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
