import { groupItemsByReceipt, type PersonItem } from "../utils/calculations";
import { money } from "../utils/text";

interface PersonBreakdownProps {
  items: PersonItem[];
}

const sumShares = (items: PersonItem[]) => items.reduce((sum, item) => sum + parseFloat(item.share), 0);

// One person's share, receipt by receipt: each receipt with what they owe on
// it, then the items behind that. Figures line up under the person's total.
export default function PersonBreakdown({ items }: PersonBreakdownProps) {
  return (
    <div className="breakdown">
      {groupItemsByReceipt(items).map(({ receiptIndex, receiptName, items: receiptItems }) => (
        <section key={receiptIndex} className="breakdown__receipt">
          <h3 className="breakdown__head">
            <span className="breakdown__name">{receiptName || "Untitled receipt"}</span>
            <span className="breakdown__amount">{money(sumShares(receiptItems))}</span>
          </h3>
          <ul className="breakdown__items">
            {receiptItems.map((item, idx) => (
              <li key={idx} className="breakdown__line">
                <span className="breakdown__name">{item.item.what}</span>
                <span className="breakdown__amount">{money(parseFloat(item.share))}</span>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
