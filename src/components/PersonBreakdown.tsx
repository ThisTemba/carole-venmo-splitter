import { groupItemsByReceipt, type PersonItem } from "../utils/calculations";
import { money } from "../utils/text";

interface PersonBreakdownProps {
  items: PersonItem[];
  total: string;
}

// One person's share of each item, printed like a little receipt per receipt
export default function PersonBreakdown({ items, total }: PersonBreakdownProps) {
  return (
    <div className="breakdown">
      {Object.entries(groupItemsByReceipt(items)).map(([receiptName, receiptItems]) => (
        <div key={receiptName} className="breakdown__receipt">
          <p className="breakdown__title">{receiptName}</p>
          {receiptItems.map((item, idx) => (
            <div key={idx} className="breakdown__line">
              <span>{item.item.what}</span>
              <span>{money(parseFloat(item.share))}</span>
            </div>
          ))}
          {receiptItems.length > 1 && (
            <div className="breakdown__line breakdown__line--sub">
              <span>Subtotal</span>
              <span>{money(receiptItems.reduce((sum, item) => sum + parseFloat(item.share), 0))}</span>
            </div>
          )}
        </div>
      ))}
      <div className="breakdown__line breakdown__line--total">
        <span>TOTAL</span>
        <span>{money(parseFloat(total))}</span>
      </div>
    </div>
  );
}
