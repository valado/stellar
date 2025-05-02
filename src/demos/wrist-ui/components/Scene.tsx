import { useXRSession } from "$stores/xr-session";

// Components
import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { XR, IfInSessionMode } from "@react-three/xr";
import { UI } from "$demos/watch/components/UI";

// Types
import type { FC } from "react";

export const Scene: FC = () => {
  const xrStore = useXRSession((state) => state.xrStore);

  return (
    <Canvas>
      <XR store={xrStore}>
        <IfInSessionMode>
          <Suspense>
            <ambientLight intensity={2} />
            <UI />
          </Suspense>
        </IfInSessionMode>
      </XR>
    </Canvas>
  );
};
