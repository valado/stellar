import { useXRInputSourceStateContext } from "@react-three/xr";
import { useOnHit } from "$hooks/hits";

// Components
import {
  DefaultXRController,
  DefaultXRHand,
  XRHitTest,
  XRSpace,
} from "@react-three/xr";

// Types
import type { FC } from "react";

type Props = {
  kind: "hand" | "controller";
};

export const Input: FC<Props> = ({ kind }) => {
  const state = useXRInputSourceStateContext();
  const onHit = useOnHit();

  return (
    <>
      {kind === "hand" ? <DefaultXRHand /> : <DefaultXRController />}
      <XRSpace space={state.inputSource.targetRaySpace}>
        <XRHitTest onResults={onHit.bind(null, state.inputSource.handedness)} />
      </XRSpace>
    </>
  );
};
