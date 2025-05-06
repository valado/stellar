import { useXRSession } from "$stores/xr-session";
import { usePose } from "$stores/pose";

// Components
import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { XR, IfInSessionMode } from "@react-three/xr";
import { HitTest } from "$components/HitTest";
import { Overlay } from "$demos/earth/components/Overlay";

// Types
import type { FC } from "react";
import { MarketCap } from "./MarketCap";

export const Scene: FC = () => {
  const xrStore = useXRSession((state) => state.xrStore);
  const pose = usePose((state) => state.pose);

  return (
    <Canvas>
      <XR store={xrStore}>
        <IfInSessionMode>
          <Suspense>
            {!pose && <HitTest />}
            <ambientLight intensity={Math.PI} />
            <Overlay />
            <MarketCap />
          </Suspense>
        </IfInSessionMode>
      </XR>
    </Canvas>
  );
};
