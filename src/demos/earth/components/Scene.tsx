import { MathUtils } from "three";
import { useXRSession } from "$stores/xr-session";
import { usePose } from "$stores/pose";

// Components
import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { XR, IfInSessionMode } from "@react-three/xr";
import { Environment } from "@react-three/drei";
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
            <Environment
              files="/hdr/hochsal_field_1k.hdr"
              backgroundRotation={[0, 0, MathUtils.degToRad(45)]}
            />
            {!pose && <HitTest />}
            <Overlay />
            <Earth />
          </Suspense>
        </IfInSessionMode>
      </XR>
    </Canvas>
  );
};
