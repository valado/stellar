import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { IfInSessionMode, XR } from "@react-three/xr";
import { Environment } from "@react-three/drei";

// Stores
import { useXRSession } from "$stores/xr-session";

// Types
import type { FC } from "react";
import { Earth } from "./views/Earth";

export const Scene: FC = () => {
  const store = useXRSession((state) => state.store);

  return (
    <Canvas>
      <XR store={store}>
        <IfInSessionMode>
          <Suspense fallback={null}>
            <Environment
              files="/hdr/hochsal_field_1k.hdr"
              environmentRotation={[0, 0, Math.PI / 5]}
            />
            <Earth />
          </Suspense>
        </IfInSessionMode>
      </XR>
    </Canvas>
  );
};
