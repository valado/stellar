import { FC, PropsWithChildren } from "react";

export const Card: FC<PropsWithChildren> = ({ children }) => (
  <div
    style={{
      background:
        "radial-gradient(113% 91% at 17% -2%, #888888 1%, #FF000000 99%),radial-gradient(75% 75% at 50% 50%, #484848 0%, #606060 100%)",
      padding: "1em",
      border: "1px solid #484848",
    }}
  >
    {children}
  </div>
);
