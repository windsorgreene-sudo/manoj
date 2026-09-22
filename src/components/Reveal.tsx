"use client";

import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";

// Reveals children with a fade-up animation when they scroll into view.
// Uses IntersectionObserver, unobserves after the first reveal, and respects
// prefers-reduced-motion (the CSS handles the no-motion case).
export function Reveal({
  children,
  as,
  className = "",
  delay = 0,
  once = true,
}: {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  delay?: number;
  once?: boolean;
}) {
  const Tag = (as ?? "div") as ElementType;
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            if (once) observer.unobserve(entry.target);
          } else if (!once) {
            setVisible(false);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [once]);

  return (
    <Tag
      ref={ref}
      className={`reveal ${visible ? "is-visible" : ""} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
