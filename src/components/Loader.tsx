import { LoaderCircleIcon } from "lucide-react";

// Types
import type { FC } from "react";

export const Loader: FC = () => (
  <div className="animate-spin">
    <LoaderCircleIcon />
  </div>
);
