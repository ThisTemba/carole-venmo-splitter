import Dialog from './ui/Dialog'

interface ItemTypesDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

// What each of them ordered, then the same $10 tip split both ways
const ordered = [
  { label: 'Sushi platter', maya: '$40', omar: '' },
  { label: 'Ramen', maya: '', omar: '$10' },
]
const tip = [
  { label: 'As an item', maya: '$5', omar: '$5' },
  { label: 'As a tax, tip, or fee', maya: '$8', omar: '$2', chosen: true },
]

export default function ItemTypesDialog({ open, onOpenChange }: ItemTypesDialogProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title="Items vs. taxes, tips, and fees"
      wide
      actions={
        <button className="print-btn print-btn--solid" onClick={() => onOpenChange(false)} autoFocus>
          Got it
        </button>
      }
    >
      <p>
        Taxes, tips, and fees split differently from regular items. Say Maya and Omar go out for
        sushi. Maya gets a $40 platter, Omar gets a $10 bowl of ramen, and they leave a $10 tip:
      </p>
      <table className="split-table">
        <thead>
          <tr>
            <th />
            <th>Maya</th>
            <th>Omar</th>
          </tr>
        </thead>
        <tbody>
          <tr className="split-table__group">
            <th colSpan={3}>What they ordered</th>
          </tr>
          {ordered.map((row) => (
            <tr key={row.label}>
              <td>{row.label}</td>
              <td>{row.maya}</td>
              <td>{row.omar}</td>
            </tr>
          ))}
        </tbody>
        <tbody>
          <tr className="split-table__group">
            <th colSpan={3}>The $10 tip</th>
          </tr>
          {tip.map((row) => (
            <tr key={row.label} className={row.chosen ? 'split-table__chosen' : undefined}>
              <td>{row.label}</td>
              <td>{row.maya}</td>
              <td>{row.omar}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="how__detail">Maya ordered 80% of the food, so Maya pays 80% of the tip.</p>
      <div className="term">
        <strong>Item</strong>
        Something people ordered. Split evenly between everyone on it.
      </div>
      <div className="term">
        <strong>Tax, tip, or fee</strong>
        A charge on top of the bill. Split by how much each person ordered, so a bigger order pays
        a bigger share. Listed under the subtotal.
      </div>
    </Dialog>
  )
}
