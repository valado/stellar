import { useXRSession } from "$stores/xr-session";
import { usePose } from "$stores/pose";

// Components
import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { XR, IfInSessionMode } from "@react-three/xr";
import { HitTest } from "$components/HitTest";
import { Overlay } from "$demos/candlesticks/components/Overlay";
import { UI } from "$demos/candlesticks/components/UI";
import { Chart } from "$demos/candlesticks/components/Chart";

// Types
import type { FC } from "react";

export const Scene: FC = () => {
  const xrStore = useXRSession((state) => state.xrStore);
  const pose = usePose((state) => state.pose);

  return (
    <Canvas shadows>
      <XR store={xrStore}>
        <IfInSessionMode>
          <Suspense>
            {!pose && <HitTest />}
            <ambientLight intensity={0.5} />
            <directionalLight intensity={1} position={[-5, 5, 10]} />
            <Overlay />
            <UI />
            <Chart />
          </Suspense>
        </IfInSessionMode>
      </XR>
    </Canvas>
  );
};
