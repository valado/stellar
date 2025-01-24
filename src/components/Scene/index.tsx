import { Canvas } from "@react-three/fiber";
import { XR, createXRStore } from "@react-three/xr";
import { FC, useState } from "react";

const store = createXRStore();

export const Scene: FC = () => {
  const [red, setRed] = useState(false);
  return (
    <>
      <button onClick={() => store.enterAR()}>Enter AR</button>
      <Canvas>
        <XR store={store}>
          <mesh
            pointerEventsType={{ deny: "grab" }}
            onClick={() => setRed(!red)}
            position={[0, 1, -1]}
          >
            <boxGeometry />
            <meshBasicMaterial color={red ? "red" : "blue"} />
          </mesh>
        </XR>
      </Canvas>
    </>
  );
};
