import type { FC, PropsWithChildren } from "react";

export const Card: FC<PropsWithChildren> = ({ children }) => (
  <div
    className="
      relative
      bg-gradient-to-br
      from-neutral-500
      to-neutral-800
      p-6
      border-2
      border-neutral-700
      rounded-lg
    "
  >
    {children}
  </div>
);
