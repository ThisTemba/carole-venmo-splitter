import type { ReactNode } from "react";
import { groupItemsByReceipt, type PersonItem } from "../utils/calculations";
import { money } from "../utils/text";

interface PersonBreakdownProps {
  person: string;
  items: PersonItem[];
  // At the foot of the box, under the total
  footer?: ReactNode;
}

const sumShares = (items: PersonItem[]) => items.reduce((sum, item) => sum + parseFloat(item.share), 0);

// One person's share, headed with their name, receipt by receipt: each receipt with what they owe on
// it, then the items behind that, then their total.
export default function PersonBreakdown({ person, items, footer }: PersonBreakdownProps) {
  return (
    <div className="breakdown">
      <h3 className="breakdown__person">{person}</h3>
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
      <p className="breakdown__total">
        <span>Total</span>
        <span className="breakdown__amount">{money(sumShares(items))}</span>
      </p>
      {footer && <div className="breakdown__foot">{footer}</div>}
    </div>
  );
}
