import { useState } from 'react'
import { Box, Button, Heading, Kbd, List, Text } from '@chakra-ui/react'

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
    <Text as="span" fontWeight="medium">{title}</Text>{' '}
    <Text as="span" color="fg.muted">{detail}</Text>
  </>
)

// Most useful first; only the first is shown until "Show more tips"
const tips = [
  <>
    <Kbd size="sm">Enter</Kbd> or <Kbd size="sm">Tab</Kbd> moves to the next box, and at the end
    of a row starts the next item, so you can type a whole receipt without the mouse.
  </>,
  <>
    Type part of a name and press <Kbd size="sm">Enter</Kbd> to pick them (“om” for Omar).
  </>,
  <>“Everyone on this receipt” covers everyone named on the receipt, even people added later.</>,
  <>
    <Kbd size="sm">Esc</Kbd> closes the row you're editing. Empty rows disappear.
  </>,
  <>
    <Kbd size="sm">Backspace</Kbd> in an empty people box removes the last person.
  </>,
  <>Add several people at once with commas: “Maya, Omar”.</>,
  <>
    <Kbd size="sm">↑</Kbd> <Kbd size="sm">↓</Kbd> choose from the suggestions.
  </>,
  <>The arrow next to a receipt's name folds it to one line.</>,
  <>Click an item under “needs attention” in Totals to jump to it.</>,
]

// Always shown at the bottom of the page, kept quiet
export default function HowItWorks() {
  const [showAllTips, setShowAllTips] = useState(false)

  return (
    <Box maxW="lg" mx="auto" mt={10} mb={4} px={2} fontSize="sm">
      <Heading size="sm" mb={3}>
        How it works
      </Heading>
      <List.Root as="ol" gap={1.5} ps={5}>
        {steps.map((step) => (
          <List.Item key={step.title}>
            <StepText {...step} />
            {step.substeps && (
              <List.Root as="ul" gap={1} ps={5} mt={1}>
                {step.substeps.map((substep) => (
                  <List.Item key={substep.title}>
                    <StepText {...substep} />
                  </List.Item>
                ))}
              </List.Root>
            )}
          </List.Item>
        ))}
      </List.Root>
      <Heading size="xs" mt={4} mb={2}>
        Tips
      </Heading>
      <List.Root as="ul" gap={1} ps={5} color="fg.muted">
        {(showAllTips ? tips : tips.slice(0, 1)).map((tip, i) => (
          <List.Item key={i}>{tip}</List.Item>
        ))}
      </List.Root>
      <Button
        variant="plain"
        size="xs"
        px={0}
        mt={1}
        color="fg.muted"
        textDecoration="underline"
        onClick={() => setShowAllTips(!showAllTips)}
      >
        {showAllTips ? 'Show fewer' : `Show ${tips.length - 1} more tips`}
      </Button>
    </Box>
  )
}
