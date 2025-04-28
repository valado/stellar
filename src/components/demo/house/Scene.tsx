import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { IfInSessionMode, XR } from "@react-three/xr";
import { Environment } from "@react-three/drei";
import { UI } from "$components/demo/house/UI";
import { HitTest } from "$components/HitTest";
import { House } from "$components/demo/house/House";

// Stores
import { useXRSession } from "$stores/xr-session";
import { usePose } from "$stores/pose";

// Types
import type { FC } from "react";

export const Scene: FC = () => {
  const store = useXRSession((state) => state.store);
  const isPoseSet = usePose((state) => state.isPoseSet);

  return (
    <Canvas>
      <XR store={store}>
        <IfInSessionMode>
          <UI />
          {!isPoseSet && <HitTest />}
          <Suspense fallback={null}>
            <Environment
              files="/hdr/hochsal_field_1k.hdr"
              environmentRotation={[0, 0, Math.PI / 5]}
            />
            <House />
          </Suspense>
        </IfInSessionMode>
      </XR>
    </Canvas>
  );
};
