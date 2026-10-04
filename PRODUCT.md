# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: Carole, a real person the app was made for. She pays for group outings and then collects from everyone through Venmo. The author and a few friends use it the same way.

The situation: someone went out with friends (dinner, then ice cream after), paid for everything, and is now home on a laptop, typing in the receipts to find out how much to request from each person. The people who owe money never use the app; they only see the amount on a Venmo request and sometimes the breakdown behind it.

## Product Purpose

Turn one outing's receipts into one number per person: the amount to request on Venmo. Success means typing everything in quickly, getting totals you trust, sending the requests, and being done. It is not a ledger or a record that lasts. You don't need a permanent record; you need your money.

## Positioning

Simpler than Splitwise and similar tools, on purpose. There are no accounts, no groups, no running balances, and nothing that the people who owe need to install. One person enters what happened and gets each person's total. The split is still fair: tax, tip, and fees are divided by how much each person ordered, not evenly.

## Operating Context

- Mostly used on a laptop after the event, working from paper or photographed receipts. It's keyboard friendly: Enter or Tab moves through the fields, and you can type part of a name to pick a person. Not everyone works that way, though, so clicking through has to be just as easy.
- One outing often has several receipts (a restaurant, then dessert somewhere else) plus things like reimbursements or refunds, which are negative amounts.
- Groups can be large. The example data has 15 people at a birthday dinner with a shared cake fee.
- Afterwards, the payer usually sends each Venmo request by hand. Optionally, they share the itemized breakdown (the text export) so people can see what the request covers. The total per person is the main thing they need.

## Capabilities and Constraints

- A static single-page app (React, Vite, Chakra UI), deployed to GitHub Pages. No backend and no accounts.
- Data saves automatically to localStorage. Saving and loading JSON files moves data between devices, and old files that use `events` instead of `receipts` still load.
- Receipts contain items (what, how much, who). An item can be split among named people or among "everyone on this receipt". Tax, tip, or fee items are split in proportion to what each person ordered.
- Totals has a section per person showing what they owe, and exports a text file.
- The app does not connect to Venmo. Requests are sent by hand outside the app.
- Undecided: how Carole and the others actually use the breakdown after the totals. The author isn't sure, and nobody has observed it.

## Brand Commitments

- The name "Carole Venmo Splitter" stays.
- It should feel personal, like something made for a particular person, not a corporate fintech product.

## Evidence on Hand

- Realistic example data in `src/data/initState.ts` (a birthday dinner, reimbursements, 15 people).
- In-app "How it works" copy and tips in `src/components/HowItWorks.tsx`.
- No testimonials, usage numbers, or user research exist. Do not make them up.

## Product Principles

1. **Done fast, then gone.** Every feature has to make it quicker to go from receipts to request amounts. Anything that turns the app into a record-keeping system works against its purpose.
2. **The number per person comes first.** What each person owes is the answer. Breakdowns are there to back up that number and to explain it if someone asks.
3. **Fair without arithmetic.** Splitting tax and tip by what each person ordered, and "everyone on this receipt", do the fair math so the payer doesn't have to.
4. **Keyboard friendly, easy either way.** The keyboard shortcuts are there to make entry fast for people who like typing straight through. Everything has to be just as obvious and easy with a mouse or trackpad, and nobody should have to learn a shortcut to finish.
5. **Payer only.** Built for one person entering receipts. Nobody else needs to touch it.
6. **Personal, not a platform.** No sign-ups, no social features, no growth features.
