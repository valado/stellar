import { createXRStore } from "@react-three/xr";
import { useEnterXR } from "$hooks/xr-session";
import { usePose } from "$stores/pose";
import { useHits } from "$stores/hits";
import { useCashMultiplier } from "$demos/cash/stores/cash-multiplier";

// Components
import { Input } from "$components/Input";
import { Welcome } from "$components/Welcome";
import { Scene } from "$demos/cash/components/Scene";

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

  const resetCashMultiplier = useCashMultiplier(
    (state) => state.resetCashMultiplier
  );

  const enterXR = useEnterXR("immersive-ar", () => {
    resetHits();
    resetPose();
    resetCashMultiplier();
  });

  return (
    <>
      <Welcome title="AR Bargeld Demo" onEnterXR={enterXR} />
      <Scene />
    </>
  );
};
