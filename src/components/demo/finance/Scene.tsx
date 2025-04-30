import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { IfInSessionMode, XR } from "@react-three/xr";
import { HitTest } from "$components/HitTest";
import { UI } from "$components/demo/finance/UI";
import { Cash } from "$components/demo/finance/views/Cash";

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
          <Suspense fallback={null}>
            <ambientLight intensity={0.5} />
            <directionalLight intensity={1} position={[-5, 5, 10]} />
            {!isPoseSet && <HitTest />}
            <UI />
            <Cash />
          </Suspense>
        </IfInSessionMode>
      </XR>
    </Canvas>
  );
};
