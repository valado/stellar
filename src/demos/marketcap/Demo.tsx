import { createXRStore } from "@react-three/xr";
import { useEnterXR } from "$hooks/xr-session";
import { usePose } from "$stores/pose";
import { useHits } from "$stores/hits";

// Components
import { Input } from "$components/Input";
import { Welcome } from "$components/Welcome";
import { Scene } from "$demos/marketcap/components/Scene";

// Types
import type { FC } from "react";

export const xrStore = createXRStore({
  gaze: false,
  layers: false,
  meshDetection: false,
  planeDetection: false,
  hand: () => <Input kind="hand" />,
  controller: () => <Input kind="controller" />,
});

export const Demo: FC = () => {
  const resetHits = useHits((state) => state.resetHits);
  const resetPose = usePose((state) => state.resetPose);

  const enterXR = useEnterXR("immersive-ar", () => {
    resetHits();
    resetPose();
  });

  return (
    <>
      <Welcome title="AR MarketCap Demo" onEnterXR={enterXR} />
      <Scene />
    </>
  );
};
