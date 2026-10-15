/** Stable FAQ item keys — copy lives in next-intl messages. */
export const faqItemIds = [
  "order",
  "custom-size",
  "consultation",
  "lead-time",
  "prepayment",
  "payment",
  "manufacturers",
  "warranty",
] as const;

export type FaqItemId = (typeof faqItemIds)[number];

/** Left column = first half, right column = second half (Figma 226:2). */
export const faqColumns: FaqItemId[][] = [
  faqItemIds.slice(0, 4),
  faqItemIds.slice(4),
];
