import { FC } from "react";
import { LoaderCircleIcon } from "lucide-react";

export const Loader: FC = () => (
  <LoaderCircleIcon style={{ animation: "spin 1s linear infinite" }} />
);
