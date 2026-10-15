"use client";

import { useId, useState } from "react";
import { faqColumns, type FaqItemId } from "@/lib/faq";

export type FaqItemCopy = {
  id: FaqItemId;
  question: string;
  answer: string;
};

type Props = {
  items: FaqItemCopy[];
};

export function FaqAccordion({ items }: Props) {
  const baseId = useId();
  const [openIds, setOpenIds] = useState<Set<FaqItemId>>(() => new Set());

  const byId = new Map(items.map((item) => [item.id, item]));

  const toggle = (id: FaqItemId) => {
    setOpenIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="faq-grid">
      {faqColumns.map((column, columnIndex) => (
        <div key={columnIndex} className="faq-column">
          {column.map((id) => {
            const item = byId.get(id);
            if (!item) return null;

            const open = openIds.has(id);
            const panelId = `${baseId}-${id}-panel`;
            const buttonId = `${baseId}-${id}-button`;

            return (
              <div
                key={id}
                className={open ? "faq-item is-open" : "faq-item"}
              >
                <button
                  type="button"
                  id={buttonId}
                  className="faq-trigger"
                  aria-expanded={open}
                  aria-controls={panelId}
                  onClick={() => toggle(id)}
                >
                  <span className="faq-question">{item.question}</span>
                  <span className="faq-icon" aria-hidden="true">
                    {open ? "×" : "+"}
                  </span>
                </button>

                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  className="faq-panel"
                  aria-hidden={!open}
                >
                  <div className="faq-panel-inner">
                    <div className="faq-divider" aria-hidden="true" />
                    <p className="faq-answer">{item.answer}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
