import type { Event } from "../types";

export function canExport(people: string[], events: Event[]): boolean {
  if (people.length === 0) return false;
  if (events.length === 0) return false;

  const hasEventWithItem = events.some((event) => event.items.length > 0);
  if (!hasEventWithItem) return false;

  const hasItemWithPerson = events.some((event) =>
    event.items.some((item) => item.who.length > 0),
  );

  return hasItemWithPerson;
}
