import { useRef, useState } from "react";
import { LuTrash2 } from "react-icons/lu";

interface PersonEditRowProps {
  person: string;
  onRename: (newName: string) => void;
  onDelete: () => void;
}

// A person's name box in Totals' "Edit people" mode. Saves on Enter or leaving
// the box; Escape undoes.
export default function PersonEditRow({ person, onRename, onDelete }: PersonEditRowProps) {
  const [value, setValue] = useState(person);
  // Escape blurs the box too; this tells save() to skip it
  const cancelled = useRef(false);

  const save = () => {
    const name = value.trim();
    if (!cancelled.current && name && name !== person) onRename(name);
    cancelled.current = false;
    // If the rename went through this row remounts under the new name; if it
    // was refused (name taken), this puts the old name back
    setValue(person);
  };

  return (
    <div className="edit-row">
      <input
        className="field"
        value={value}
        aria-label={`Name for ${person}`}
        onChange={(e) => setValue(e.target.value)}
        onBlur={save}
        onKeyDown={(e) => {
          if (e.key === "Escape") cancelled.current = true;
          if (e.key === "Enter" || e.key === "Escape") e.currentTarget.blur();
        }}
      />
      <button type="button" className="icon-btn icon-btn--danger" aria-label={`Remove ${person}`} onClick={onDelete}>
        <LuTrash2 aria-hidden />
      </button>
    </div>
  );
}
