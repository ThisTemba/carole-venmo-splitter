import { useState } from "react";
import { Box, Flex, chakra } from "@chakra-ui/react";
import PersonTag from "./PersonTag";
import { EVERYONE, getPeopleOptions, optionLabel, type PeopleOption } from "../utils/people";

interface PeopleInputProps {
  people: string[];
  who: string[];
  everyone: boolean;
  onChange: (who: string[], everyone: boolean) => void;
  // Add someone new to the People list
  onAddPerson: (name: string) => void;
  // Done with this box: Enter with nothing typed or highlighted, or Tab
  onNext: () => void;
  onEscape: () => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
}

export default function PeopleInput({
  people,
  who,
  everyone,
  onChange,
  onAddPerson,
  onNext,
  onEscape,
  inputRef,
}: PeopleInputProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  // Nothing is highlighted until you type or use the arrow keys, so Enter
  // only adds someone when it's clear who
  const [highlight, setHighlight] = useState<number | null>(null);
  const options = getPeopleOptions(people, who, everyone, query);
  const active = highlight === null || options.length === 0 ? null : Math.min(highlight, options.length - 1);

  const add = (option: PeopleOption) => {
    if (option.kind === "everyone") {
      onChange([], true);
    } else if (option.kind === "new") {
      onAddPerson(option.name);
      onChange([...who, option.name], false);
    } else if (option.kind === "list") {
      option.names.filter((name) => !people.includes(name)).forEach(onAddPerson);
      onChange([...new Set([...who, ...option.names])], false);
    } else {
      onChange([...who, option.name], false);
    }
    setQuery("");
    setHighlight(null);
  };

  const remove = (person: string) => onChange(who.filter((p) => p !== person), false);
  const clearEveryone = () => onChange([], false);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (active !== null) add(options[active]);
      else if (!query.trim()) onNext();
    } else if (e.key === "Tab" && !e.shiftKey) {
      // Accept whatever's typed, then move on
      e.preventDefault();
      const option = options[active ?? 0];
      if (query.trim() && option) add(option);
      onNext();
    } else if (e.key === "Backspace" && !query && everyone) {
      clearEveryone();
    } else if (e.key === "Backspace" && !query && who.length > 0) {
      remove(who[who.length - 1]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight(active === null ? 0 : Math.min(active + 1, options.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight(active === null ? 0 : Math.max(active - 1, 0));
    } else if (e.key === "Escape") {
      if (query) {
        setQuery("");
        setHighlight(null);
      } else onEscape();
    }
  };

  return (
    <Box position="relative">
      <Flex
        gap={1}
        flexWrap="wrap"
        alignItems="center"
        minH={8}
        px={1}
        py={1}
        borderWidth={1}
        borderRadius="sm"
        cursor="text"
        _focusWithin={{ outline: "2px solid", outlineColor: "colorPalette.focusRing", outlineOffset: "-1px" }}
        onClick={() => inputRef.current?.focus()}
      >
        {everyone ? (
          <PersonTag person={EVERYONE} onRemove={clearEveryone} />
        ) : (
          who.map((person) => <PersonTag key={person} person={person} onRemove={() => remove(person)} />)
        )}
        <chakra.input
          ref={inputRef}
          value={query}
          placeholder={everyone || who.length ? "" : "Type names to add people"}
          onChange={(e) => {
            setQuery(e.target.value);
            // Typing highlights the best match
            setHighlight(e.target.value.trim() ? 0 : null);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => {
            setOpen(false);
            setHighlight(null);
          }}
          onKeyDown={handleKeyDown}
          flex="1"
          minW="6ch"
          px={1}
          outline="none"
          bg="transparent"
          fontSize="sm"
        />
      </Flex>
      {open && options.length > 0 && (
        <Box
          position="absolute"
          top="100%"
          left={0}
          right={0}
          mt={1}
          zIndex="dropdown"
          bg="bg"
          borderWidth={1}
          borderRadius="md"
          boxShadow="md"
          maxH="60"
          overflowY="auto"
          py={1}
          // Hovering highlights; moving off goes back to the typed match, if any
          onMouseLeave={() => setHighlight(query.trim() ? 0 : null)}
        >
          {options.map((option, i) => (
            <Box
              key={optionLabel(option)}
              px={3}
              py={1.5}
              fontSize="sm"
              cursor="pointer"
              bg={i === active ? "bg.muted" : undefined}
              fontWeight={option.kind === "person" ? undefined : "medium"}
              onMouseEnter={() => setHighlight(i)}
              // Keep focus in the input so the row stays open
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => add(option)}
            >
              {optionLabel(option)}
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}
