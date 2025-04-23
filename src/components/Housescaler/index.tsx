import { useEffect, useRef } from "react";
import * as THREE from "three";

type Props = {
  houseRef: React.RefObject<THREE.Object3D>;
};

export const HouseScaler: React.FC<Props> = ({ houseRef }) => {
  const lastDistanceRef = useRef<number | null>(null);

  useEffect(() => {
    const getTouchDistance = (touches: TouchList): number => {
      const dx = touches[0].clientX - touches[1].clientX;
      const dy = touches[0].clientY - touches[1].clientY;
      return Math.sqrt(dx * dx + dy * dy);
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length !== 2 || !houseRef.current) return;

      e.preventDefault(); // IMPORTANT: block browser default gestures


      const newDistance = getTouchDistance(e.touches);

      if (lastDistanceRef.current !== null) {
        const scaleChange = newDistance / lastDistanceRef.current;
        const currentScale = houseRef.current.scale;
        const newScale = currentScale.clone().multiplyScalar(scaleChange);

        // Clamp to prevent it from getting too small or too big
        const clamped = new THREE.Vector3(
          THREE.MathUtils.clamp(newScale.x, 0.2, 3),
          THREE.MathUtils.clamp(newScale.y, 0.2, 3),
          THREE.MathUtils.clamp(newScale.z, 0.2, 3)
        );

        houseRef.current.scale.copy(clamped);
      }

      lastDistanceRef.current = newDistance;
    };

    const onTouchEnd = () => {
      lastDistanceRef.current = null;
    };

    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd);
    window.addEventListener("touchcancel", onTouchEnd);

    return () => {
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchcancel", onTouchEnd);
    };
  }, [houseRef]);

  return null;
};
