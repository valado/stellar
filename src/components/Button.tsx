import type { FC, MouseEventHandler, PropsWithChildren } from "react";
import {Button1} from "./../../components/ui/button"


type Props = PropsWithChildren<{
  onClick?: MouseEventHandler<HTMLButtonElement>;
}>;

export const Button: FC<Props> = ({ onClick, children }) => (
  <Button1 onClick={onClick}>{children}</Button1>
);
