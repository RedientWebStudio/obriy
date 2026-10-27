import type { ReactNode } from "react";
import { Container } from "@/components/layout/Container";

type Props = {
  code?: string;
  title: string;
  description: string;
  action: ReactNode;
};

/** Shared empty-state composition for 404 / runtime error screens. */
export function StatusScreen({ code, title, description, action }: Props) {
  return (
    <main className="status-page">
      <Container>
        <div className="category-empty status-page-inner">
          {code ? <p className="status-page-code">{code}</p> : null}
          <h1 className="category-empty-title">{title}</h1>
          <p className="category-empty-lead">{description}</p>
          <div className="status-page-action">{action}</div>
        </div>
      </Container>
    </main>
  );
}
