"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Container } from "@/components/layout/Container";

type Props = {
  children: ReactNode;
};

export function HeaderFrame({ children }: Props) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const update = () => {
      setScrolled(window.scrollY > 0);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <header
      className={scrolled ? "site-header is-scrolled" : "site-header"}
    >
      <Container>
        <div className="header-bar">{children}</div>
      </Container>
    </header>
  );
}
