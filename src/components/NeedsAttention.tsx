import { LuTriangleAlert } from "react-icons/lu";
import { describeMissing, type IncompleteItem } from "../utils/validation";
import { plural } from "../utils/text";

interface NeedsAttentionProps {
  items: IncompleteItem[];
  onOpenItem: (item: IncompleteItem) => void;
}

// Incomplete items in Totals, printed in red; clicking one opens it
export default function NeedsAttention({ items, onOpenItem }: NeedsAttentionProps) {
  if (items.length === 0) return null;
  return (
    <div className="attention" role="alert">
      <p className="attention__title">
        <LuTriangleAlert aria-hidden />
        {plural(items.length, "item")} need{items.length > 1 ? "" : "s"} attention
      </p>
      <ul>
        {items.map((incomplete) => (
          <li key={`${incomplete.receiptIndex}-${incomplete.itemIndex}`}>
            <button type="button" onClick={() => onOpenItem(incomplete)}>
              {incomplete.receipt.name}: {incomplete.item.what || "Unnamed item"} (no{" "}
              {describeMissing(incomplete.missing)})
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
