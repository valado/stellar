import type { FC, MouseEventHandler, PropsWithChildren } from "react";

type Props = PropsWithChildren<{
  isDisabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}>;

export const Button: FC<Props> = ({ onClick, children }) => (
  <button
    onClick={onClick}
    className="
      relative
      bg-gradient-to-br
      from-neutral-500
      to-neutral-800
      p-4
      border-2
    border-neutral-700
      rounded-lg
      before:hidden
      active:before:block
      before:absolute
      before:-top-1
      before:-left-1
      before:w-[calc(100%+var(--spacing)*2)]
      before:h-[calc(100%+var(--spacing)*2)]
      before:bg-gradient-to-br
      before:from-red-600
      before:to-orange-500
      before:rounded-lg
      before:-z-10
    "
  >
    {children}
  </button>
);
