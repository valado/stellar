import { Matrix4 } from "three";

// Stores
import { useHits } from "$stores/hits";

export const useOnHit = () => {
  const setHit = useHits((state) => state.setHit);

  return (
    handedness: XRHandedness,
    results: XRHitTestResult[],
    getWorldMatrix: (target: Matrix4, hit: XRHitTestResult) => void
  ) => {
    if (!results.length) {
      return;
    }

    const hit = new Matrix4();
    getWorldMatrix(hit, results[0]);

    setHit(handedness, hit);
  };
};
