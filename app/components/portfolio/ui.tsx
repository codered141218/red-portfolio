import type { ReactNode } from "react";

export function Panel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`panel ${className}`}>{children}</div>;
}

export function Label({ children }: { children: ReactNode }) {
  return <h3 className="eyebrow">{children}</h3>;
}
