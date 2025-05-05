import { useEffect, useRef, useState } from "react";
import { Quaternion, Vector3 } from "three";

export const useQuaternion = (initialQuaternion: Quaternion) => {
  const [quaternion, setQuaternion] = useState<Quaternion>(initialQuaternion);

  const isDraggingRef = useRef<boolean>(false);
  const lastTouchXRef = useRef<number | null>(null);

  useEffect(() => {
    const onTouchStart = (event: TouchEvent) => {
      if (event.touches.length !== 1) {
        return;
      }

      isDraggingRef.current = true;
      lastTouchXRef.current = event.touches[0].clientX;
    };

    const onTouchMove = (event: TouchEvent) => {
      if (event.touches.length !== 1 || !isDraggingRef.current) {
        return;
      }

      const currentX = event.touches[0].clientX;

      if (lastTouchXRef.current !== null) {
        const deltaX = currentX - lastTouchXRef.current;
        const rotationSpeed = -0.005;

        const yRotation = new Quaternion().setFromAxisAngle(
          new Vector3(0, 1, 0),
          -deltaX * rotationSpeed,
        );

        setQuaternion(quaternion.clone().multiply(yRotation));
      }

      lastTouchXRef.current = currentX;
    };

    const onTouchEnd = () => {
      isDraggingRef.current = false;
      lastTouchXRef.current = null;
    };

    window.addEventListener("touchstart", onTouchStart, { passive: false });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd);
    window.addEventListener("touchcancel", onTouchEnd);

    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchcancel", onTouchEnd);
    };
  }, [quaternion]);

  return quaternion;
};
