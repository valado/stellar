import { useEffect, useRef, useState } from "react";
import { Vector3, MathUtils } from "three";

export function useScale(
  initial: Vector3 = new Vector3(1, 1, 1),
  min: Vector3 = new Vector3(0.2, 0.2, 0.2),
  max: Vector3 = new Vector3(3, 3, 3)
) {
  const [scale, setScale] = useState<Vector3>(initial);

  const initialDistanceRef = useRef<number | null>(null);
  const initialScaleRef = useRef<Vector3 | null>(null);

  const getTouchDistance = (touches: TouchList): number => {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  useEffect(() => {
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length !== 2) return;

      const distance = getTouchDistance(e.touches);

      if (initialDistanceRef.current === null) {
        initialDistanceRef.current = distance;
        initialScaleRef.current = scale.clone();
        return;
      }

      const factor = distance / initialDistanceRef.current;
      const next = initialScaleRef.current!.clone().multiplyScalar(factor);

      const clamped = new Vector3(
        MathUtils.clamp(next.x, min.x, max.x),
        MathUtils.clamp(next.y, min.y, max.y),
        MathUtils.clamp(next.z, min.z, max.z)
      );

      setScale(clamped);
    };

    const reset = () => {
      initialDistanceRef.current = null;
      initialScaleRef.current = null;
    };

    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", reset);
    window.addEventListener("touchcancel", reset);

    return () => {
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", reset);
      window.removeEventListener("touchcancel", reset);
    };
  }, [scale, min, max]);

  return scale;
}