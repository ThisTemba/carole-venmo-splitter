import { useEffect, useRef, useState } from "react";

interface PersonNameProps {
  person: string;
  onRename: (newName: string) => void;
  // Closes the box (saved or undone)
  onDone: () => void;
}

// Renaming someone on the note: a name box in the name's place, opened with
// the name selected. Saves on Enter or leaving the box; Escape undoes.
export default function PersonName({ person, onRename, onDone }: PersonNameProps) {
  const [value, setValue] = useState(person);
  const inputRef = useRef<HTMLInputElement>(null);
  // Escape blurs the box too; this tells save() to skip it
  const cancelled = useRef(false);

  useEffect(() => {
    inputRef.current?.select();
  }, []);

  const save = () => {
    const name = value.trim();
    if (!cancelled.current && name && name !== person) onRename(name);
    cancelled.current = false;
    onDone();
  };

  return (
    <div className="name-edit">
      <input
        ref={inputRef}
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
    </div>
  );
}
