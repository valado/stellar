import { useXR, useXRHitTest } from "@react-three/xr";
import { useOnHit } from "$hooks/on-hit";

// Components
import { Crosshair } from "$components/Crosshair";

// Types
import type { FC } from "react";

const Handheld: FC = () => {
  const onHit = useOnHit();
  useXRHitTest(onHit.bind(null, "none"), "viewer");
  return <Crosshair handedness="none" />;
};

const Headset: FC = () => (
  <>
    <Crosshair handedness="left" />
    <Crosshair handedness="right" />
  </>
);

export const HitTest: FC = () => {
  const isHandheld = useXR(
    (state) => state.session?.interactionMode === "screen-space"
  );

  return isHandheld ? <Handheld /> : <Headset />;
};
