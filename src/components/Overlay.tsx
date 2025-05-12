import { useExitXR } from "$hooks/xr-session";

// Components
import { XRDomOverlay } from "@react-three/xr";
import { XIcon } from "lucide-react";
import { Button } from "$components/Button";

// Types
import type { FC, PropsWithChildren } from "react";

export const Overlay: FC<PropsWithChildren> = ({ children }) => {
  const exitXR = useExitXR();

  return (
    <XRDomOverlay className="relative h-dvh">
      <div className="absolute top-4 left-4">
        <Button onClick={exitXR} className="w-12 h-12">
          <XIcon />
        </Button>
      </div>
      {children}
    </XRDomOverlay>
  );
};
