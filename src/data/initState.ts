import type { Event } from '../types'

export const eventsInit: Event[] = [
  {
    name: "Mexican Restaurant",
    items: [
      {
        what: "Enchiladas",
        howMuch: 17,
        who: ["Brietta"],
      },
      {
        what: "Chiles Rellenos",
        howMuch: 18,
        who: ["Nick"],
      },
      {
        what: "Horchata",
        howMuch: 24,
        who: ["Brietta", "Nick", "Teresa", "Valry"],
      },
      {
        what: "Gringas",
        howMuch: 14,
        who: ["Barnard"],
      },
      {
        what: "Birria",
        howMuch: 38,
        who: ["Teresa", "Valry"],
      },
      {
        what: "Tax+Tip",
        howMuch: 32.86,
        who: ["Brietta", "Valry", "Nick", "Barnard", "Teresa"],
      },
    ],
  },
  {
    name: "Buffet Restaurant",
    items: [
      {
        what: "Total",
        howMuch: 206.43,
        who: [
          "Eda",
          "Harmony",
          "Teresa",
          "Valry",
          "Nick",
          "Brietta",
          "Barnard",
        ],
      },
    ],
  },
  {
    name: "Movie Theater",
    items: [
      {
        what: "Movie",
        howMuch: 62.2,
        who: ["Eda", "Harmony", "Teresa", "Barnard", "Chandler"],
      },
    ],
  },
  {
    name: "Italian Restaurant",
    items: [
      {
        what: "Bucatini",
        howMuch: 18.5,
        who: ["Teresa"],
      },
      {
        what: "Spagetti A la Vodka",
        howMuch: 37,
        who: ["Barnard", "Morry"],
      },
      {
        what: "Linguine & Clams",
        howMuch: 19,
        who: ["Eda"],
      },
      {
        what: "Rigatoni",
        howMuch: 18.5,
        who: ["Harmony"],
      },
      {
        what: "Pesto Pizza",
        howMuch: 18,
        who: ["Chandler"],
      },
      {
        what: "GF Fusili",
        howMuch: 20,
        who: ["Fredi"],
      },
      {
        what: "Parmesan Crusted Chicken",
        howMuch: 22.75,
        who: ["Fonzie"],
      },
      {
        what: "Gnocchi",
        howMuch: 19,
        who: ["Curtis"],
      },
      {
        what: "Espresso",
        howMuch: 3,
        who: ["Teresa"],
      },
      {
        what: "Cappuccino",
        howMuch: 8,
        who: ["Eda", "Chandler"],
      },
      {
        what: "Cake Fee",
        howMuch: 20,
        who: [
          "Eda",
          "Harmony",
          "Teresa",
          "Barnard",
          "Chandler",
          "Fonzie",
          "Fredi",
          "Curtis",
          "Morry",
        ],
      },
      {
        what: "Tax + Tip",
        howMuch: 57.05,
        who: [
          "Eda",
          "Harmony",
          "Teresa",
          "Barnard",
          "Chandler",
          "Fonzie",
          "Fredi",
          "Curtis",
          "Morry",
        ],
      },
    ],
  },
  {
    name: "Reimbursements",
    items: [
      {
        what: "Meal + Movie Refund",
        howMuch: -43,
        who: ["Chandler"],
      },
      {
        what: "Meal + Movie",
        howMuch: 43,
        who: [
          "Eda",
          "Teresa",
          "Barnard",
          "Fonzie",
          "Curtis",
          "Jilly",
          "Tobie",
          "Diandra",
        ],
      },
      {
        what: "Cupcakes",
        howMuch: 28.33,
        who: [
          "Eda",
          "Teresa",
          "Barnard",
          "Fonzie",
          "Curtis",
          "Jilly",
          "Tobie",
          "Diandra",
        ],
      },
    ],
  },
]

export const peopleInit: string[] = [
  "Eda",
  "Harmony",
  "Teresa",
  "Valry",
  "Nick",
  "Brietta",
  "Barnard",
  "Chandler",
  "Fonzie",
  "Fredi",
  "Curtis",
  "Morry",
  "Jilly",
  "Tobie",
  "Diandra",
]
