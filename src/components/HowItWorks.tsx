import { useState } from 'react'

type Step = { title: string; detail: string; substeps?: Step[] }

// Mirrors the boxes you fill in, with examples
const steps: Step[] = [
  { title: 'Add a receipt.', detail: 'e.g. “Sakura Sushi”' },
  {
    title: 'Add items.',
    detail: 'For each one:',
    substeps: [
      { title: 'What was it?', detail: 'e.g. “Salmon roll”' },
      { title: 'How much was it?', detail: 'e.g. “12”' },
      { title: 'Who had it?', detail: 'e.g. “Omar”, or “Maya, Omar” for something shared' },
    ],
  },
  { title: 'Add tax, tip, and fees.', detail: "They're split by how much each person ordered." },
  { title: 'Send the requests.', detail: "In Who owes what, click someone's amount to copy it for Venmo, or use the ⋯ beside it to copy their breakdown as an image." },
]

const StepText = ({ title, detail }: Step) => (
  <>
    <span className="how__step-title">{title}</span> <span className="how__detail">{detail}</span>
  </>
)

// Most useful first; only the first is shown until "Show more tips"
const tips = [
  <>
    <kbd>Enter</kbd> or <kbd>Tab</kbd> moves to the next box, and at the end
    of a row starts the next item, so you can type a whole receipt without the mouse.
  </>,
  <>
    Type part of a name and press <kbd>Enter</kbd> to pick them (“om” for Omar), or use <kbd>↑</kbd> <kbd>↓</kbd> to
    choose from the suggestions.
  </>,
  <>“Everyone on this receipt” covers everyone named on the receipt, even people added later.</>,
  <>Add several people at once by typing their names with spaces or commas: “Maya Omar” or “Maya, Omar”.</>,
  <>Click someone's name in Who owes what to see what they had, receipt by receipt.</>,
  <>The ⋯ beside someone's amount copies the amount or their breakdown as an image, renames them, or removes them.</>,
  <>
    <kbd>Enter</kbd> on a new receipt's name saves it and starts the first item.
  </>,
  <>
    <kbd>Esc</kbd> closes the row you're editing. Empty rows disappear. In the people box, it clears what's typed
    first.
  </>,
  <>
    <kbd>Backspace</kbd> in an empty people box removes the last person.
  </>,
  <>
    Tab to a line and press <kbd>Enter</kbd> or <kbd>Space</kbd> to open it, its name selected so typing replaces
    it.
  </>,
  <>
    Drag the handle to the left of a line to move it up or down, or Tab to the line and
    press <kbd>Alt</kbd> + <kbd>↑</kbd> <kbd>↓</kbd>.
  </>,
  <>Click an item under “needs attention” to jump to it.</>,
  <>The arrow next to a receipt's name folds its items away, leaving the name, total, and who was on it.</>,
  <>Save PDF record, on the envelope, keeps a dated copy of every receipt and who owes what.</>,
  <>Save downloads everything as a file; Load opens it again, on this computer or another.</>,
]

// Always shown at the bottom of the page, quiet on the desk so it never competes with the receipts
export default function HowItWorks() {
  const [showAllTips, setShowAllTips] = useState(false)

  return (
    <section className="how" aria-labelledby="how-title">
      <h2 id="how-title" className="how__title">How it works</h2>
      <ol>
        {steps.map((step) => (
          <li key={step.title}>
            <StepText {...step} />
            {step.substeps && (
              <ul>
                {step.substeps.map((substep) => (
                  <li key={substep.title}>
                    <StepText {...substep} />
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ol>
      <h3>Tips</h3>
      <ul className="how__tips">
        {(showAllTips ? tips : tips.slice(0, 1)).map((tip, i) => (
          <li key={i}>{tip}</li>
        ))}
      </ul>
      <button type="button" className="text-btn" onClick={() => setShowAllTips(!showAllTips)}>
        {showAllTips ? 'Show fewer' : `Show ${tips.length - 1} more tips`}
      </button>
    </section>
  )
}
