import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { IfInSessionMode, XR } from "@react-three/xr";
import { Environment, Float } from "@react-three/drei";
import { UI } from "$components/demo/house/UI";
import { HitTest } from "$components/HitTest";

// Stores
import { useXRSession } from "$stores/xr-session";
import { usePose } from "$stores/pose";

// Types
import type { FC } from "react";
import { Earth } from "./FinancialData/Earth";
import { Cash } from "./FinancialData/Cash";

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
            <Float rotationIntensity={1}
            speed={1}
            floatIntensity={1}
            floatingRange={[0, 1]}><Cash /></Float>
          </Suspense>
        </IfInSessionMode>
      </XR>
    </Canvas>
  );
};
