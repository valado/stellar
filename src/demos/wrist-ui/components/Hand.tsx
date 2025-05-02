import { Suspense } from "react";
import { XRHandModel } from "@react-three/xr";
import { UI } from "$demos/wrist-ui/components/UI";

// Types
import type { FC } from "react";

export const Hand: FC = () => (
  <>
    <Suspense>
      <XRHandModel colorWrite={false} renderOrder={-1} />
    </Suspense>
    <Suspense>
      <UI />
    </Suspense>
  </>
);
