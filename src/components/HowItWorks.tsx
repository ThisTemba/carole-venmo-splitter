import { useState } from 'react'
import Slip from './ui/Slip'

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
  { title: 'See the totals.', detail: 'Totals shows what everyone owes.' },
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
    Type part of a name and press <kbd>Enter</kbd> to pick them (“om” for Omar).
  </>,
  <>“Everyone on this receipt” covers everyone named on the receipt, even people added later.</>,
  <>
    <kbd>Esc</kbd> closes the row you're editing. Empty rows disappear.
  </>,
  <>
    <kbd>Backspace</kbd> in an empty people box removes the last person.
  </>,
  <>Add several people at once with commas: “Maya, Omar”.</>,
  <>
    <kbd>↑</kbd> <kbd>↓</kbd> choose from the suggestions.
  </>,
  <>The arrow next to a receipt's name folds it to one line.</>,
  <>Click an item under “needs attention” in Totals to jump to it.</>,
]

// Always shown at the bottom of the page, kept quiet
export default function HowItWorks() {
  const [showAllTips, setShowAllTips] = useState(false)

  return (
    <Slip as="section" className="how" tilt={0.5} aria-label="How it works">
      <h2 className="print-heading">How it works</h2>
      <hr className="rule" />
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
    </Slip>
  )
}
