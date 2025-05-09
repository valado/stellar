import { useXRSession } from "$stores/xr-session";
import { usePose } from "$stores/pose";

// Components
import { Suspense, useState } from "react";
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
  const [earthIndex, setEarthIndex] = useState(0);

const earthVariants = [
  Earth
];

const ActiveEarth = earthVariants[earthIndex];


  return (
    <Canvas>
      <XR store={xrStore}>
        <IfInSessionMode>
          <Suspense>
            {!pose && <HitTest />}
            <ambientLight intensity={Math.PI} />
            <Overlay earthIndex={earthIndex}
  setEarthIndex={setEarthIndex}
  total={earthVariants.length}/>
            <ActiveEarth 
            />
          </Suspense>
        </IfInSessionMode>
      </XR>
    </Canvas>
  );
};
