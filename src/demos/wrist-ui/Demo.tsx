import { createXRStore } from "@react-three/xr";
import { useEnterXR } from "$hooks/xr-session";

// Components
import { Welcome } from "$components/Welcome";
import { Scene } from "$demos/wrist-ui/components/Scene";
import { Hand } from "$demos/wrist-ui/components/Hand";

// Types
import type { FC } from "react";

export const xrStore = createXRStore({
  gaze: false,
  layers: false,
  meshDetection: false,
  planeDetection: false,
  foveation: 0,
  bounded: false,
  hand: {
    left: Hand,
    right: {
      model: {
        colorWrite: false,
        renderOrder: -1,
      },
      grabPointer: false,
      rayPointer: false,
    },
  },
});

export const Demo: FC = () => {
  const enterXR = useEnterXR("immersive-ar", () => {});

  return (
    <>
      <Welcome title="AR Handgelenk UI Demo" onEnterXR={enterXR} />
      <Scene />
    </>
  );
};
