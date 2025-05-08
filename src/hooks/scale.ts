import { useEffect, useRef, useState } from "react";
import { MathUtils, Vector3 } from "three";

export const useScale = (initial?: Vector3, min?: Vector3, max?: Vector3) => {
  const [scale, setScale] = useState(initial || new Vector3());

  const touchDistanceRef = useRef<number | null>(null);
  const scaleRef = useRef<Vector3 | null>(null);

  const getTouchDistance = (touches: TouchList) => {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  useEffect(() => {
    const onTouchMove = (event: TouchEvent) => {
      if (event.touches.length === 2) {
        event.preventDefault();
        const newDistance = getTouchDistance(event.touches);

        if (!touchDistanceRef.current) {
          touchDistanceRef.current = newDistance;
          scaleRef.current = scale.clone();
          return;
        }

        const scaleFactor = newDistance / touchDistanceRef.current;

        const oldScale = scaleRef.current || scale.clone();
        const newScale = oldScale.multiplyScalar(scaleFactor);

        if (!min || !max) {
          setScale(newScale);
          return;
        }

        setScale(
          new Vector3(
            MathUtils.clamp(newScale.x, min.x, max.x),
            MathUtils.clamp(newScale.y, min.y, max.y),
            MathUtils.clamp(newScale.z, min.z, max.z),
          ),
        );
      }
    };

    const onTouchEnd = () => {
      touchDistanceRef.current = null;
      scaleRef.current = null;
    };

    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd);
    window.addEventListener("touchcancel", onTouchEnd);

    return () => {
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchcancel", onTouchEnd);
    };
  }, [scale, min, max]);

  return scale;
};
