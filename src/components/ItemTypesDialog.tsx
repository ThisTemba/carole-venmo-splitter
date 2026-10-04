import Dialog from './ui/Dialog'

interface ItemTypesDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const exampleRows = [
  { label: 'Sushi platter ($40)', maya: '$40', omar: '—' },
  { label: 'Ramen ($10)', maya: '—', omar: '$10' },
  { label: '$10 tip as an item', maya: '$5', omar: '$5', className: 'muted' },
  { label: '$10 tip as a tax, tip, or fee', maya: '$8', omar: '$2', className: 'strong' },
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
        sushi. Maya gets a $40 platter, Omar gets a $10 bowl of ramen, and they leave a $10 tip.
        Here's how the tip splits each way:
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
          {exampleRows.map((row) => (
            <tr key={row.label} className={row.className}>
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
