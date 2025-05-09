import { useXRSession } from "$stores/xr-session";
import { usePose } from "$stores/pose";

// Components
import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { XR, IfInSessionMode } from "@react-three/xr";
import { HitTest } from "$components/HitTest";
import { Overlay } from "$demos/earth/components/Overlay";
import { Earth } from "$demos/earth/components/Earth";

// Types
import type { FC } from "react";

export const Scene: FC = () => {
  const xrStore = useXRSession((state) => state.xrStore);
  const pose = usePose((state) => state.pose);

  return (
    <Canvas>
      <XR store={xrStore}>
        <IfInSessionMode>
          <Suspense>
            <ambientLight intensity={Math.PI} />
            <directionalLight intensity={0.6 * Math.PI} />
            {!pose && <HitTest />}
            <Overlay />
            <Earth />
          </Suspense>
        </IfInSessionMode>
      </XR>
    </Canvas>
  );
};
