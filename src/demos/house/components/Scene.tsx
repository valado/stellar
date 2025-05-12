import { MathUtils } from "three";
import { useXRSession } from "$stores/xr-session";
import { usePose } from "$stores/pose";

// Components
import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { XR, IfInSessionMode } from "@react-three/xr";
import { Environment } from "@react-three/drei";
import { HitTest } from "$components/HitTest";
import { Overlay } from "$demos/house/components/Overlay";
import { UI } from "$demos/house/components/UI";
import { House } from "$demos/house/components/House";

// Types
import type { FC } from "react";

export const Scene: FC = () => {
  const xrStore = useXRSession((state) => state.xrStore);
  const pose = usePose((state) => state.pose);

  return (
    <Canvas>
      <XR store={xrStore}>
        <IfInSessionMode>
          {!pose && <HitTest />}
          <Overlay />
          <Environment
            files="/hdr/hochsal_field_1k.hdr"
            backgroundRotation={[0, 0, MathUtils.degToRad(45)]}
          />
          <ambientLight intensity={0.6 * Math.PI} />
          <Suspense fallback={null}>
            <UI />
            <House />
          </Suspense>
        </IfInSessionMode>
      </XR>
    </Canvas>
  );
};
