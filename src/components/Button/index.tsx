import { FC, MouseEventHandler, PropsWithChildren } from "react";

type Props = PropsWithChildren<{
  onClick?: MouseEventHandler<HTMLButtonElement>;
}>;

export const Button: FC<Props> = ({ onClick, children }) => (
  <button
    onClick={onClick}
    style={{
      background:
        "radial-gradient(113% 91% at 17% -2%, #888888 1%, #FF000000 99%),radial-gradient(75% 75% at 50% 50%, #484848 0%, #606060 100%)",
      padding: "1em",
      border: "1px solid #484848",
      borderRadius: "1em",
      outline: 0,
    }}
  >
    {children}
  </button>
);
