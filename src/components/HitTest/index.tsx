import { useXR, useXRHitTest } from "@react-three/xr";
import * as THREE from "three";
import { Crosshair } from "../Crosshair";

export const hitTestMatrices: Partial<Record<XRHandedness, THREE.Matrix4>> = {};

export const onResults = (
  handedness: XRHandedness,
  results: XRHitTestResult[],
  getWorldMatrix: (target: THREE.Matrix4, hit: XRHitTestResult) => void
) => {
  if (results?.length === 0) {
    return;
  }

  hitTestMatrices[handedness] ||= new THREE.Matrix4();
  getWorldMatrix(hitTestMatrices[handedness], results[0]);
};

const Handheld = () => {
  useXRHitTest(onResults.bind(null, "none"), "viewer");
  return <Crosshair handedness="none" />;
};

const Headset = () => (
  <>
    <Crosshair handedness="right" />
    <Crosshair handedness="left" />
  </>
);

export const HitTest = () => {
  const isHandheld = useXR(
    (xr) => xr.session?.interactionMode === "screen-space"
  );
  return isHandheld ? <Handheld /> : <Headset />;
};
