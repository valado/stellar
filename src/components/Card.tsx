import type { FC, HTMLProps, PropsWithChildren } from "react";

type Props = PropsWithChildren<HTMLProps<HTMLDivElement>>;

export const Card: FC<Props> = ({ children, ...props }) => (
  <div
    className="
      bg-gradient-to-br
      from-neutral-500
      to-neutral-800
      p-6
      border-2
      border-neutral-700
      rounded-lg
    "
    {...props}
  >
    {children}
  </div>
);
