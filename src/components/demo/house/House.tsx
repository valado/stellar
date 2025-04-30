import { useEffect, useRef, useState } from "react";
import { Vector3, Quaternion, MathUtils } from "three";
import { useFrame } from "@react-three/fiber";
import { useXRInputSourceEvent } from "@react-three/xr";

// Components
import { Gltf } from "@react-three/drei";

// Stores
import { useHits } from "$stores/hits";
import { usePose } from "$stores/pose";
import { useLabelOrigin } from "$stores/label-origin";

// Types
import type { FC } from "react";

const INITIAL_SCALE = new Vector3(0.3, 0.3, 0.3);

export const House: FC = () => {
  const [scale, setScale] = useState<Vector3>(INITIAL_SCALE);
  const hits = useHits((state) => state.hits);
  const pose = usePose((state) => state.pose);
  const setPose = usePose((state) => state.setPose);
  const isPoseSet = usePose((state) => state.isPoseSet);
  const setLabelOrigin = useLabelOrigin((state) => state.setLabelOrigin);

  const initialTouchDistanceRef = useRef<number | null>(null);
  const initialScaleRef = useRef<Vector3 | null>(null);
  const isDragging = useRef(false);
  const lastTouchX = useRef<number | null>(null);



  // Logic for scaling using touch gestures.
  useEffect(() => {
    const getTouchDistance = (touches: TouchList): number => {
      const dx = touches[0].clientX - touches[1].clientX;
      const dy = touches[0].clientY - touches[1].clientY;
      return Math.sqrt(dx * dx + dy * dy);
    };
  
    const onTouchStart = (event: TouchEvent) => {
      if (event.touches.length === 1 && isPoseSet) {
        // Start dragging
        isDragging.current = true;
        lastTouchX.current = event.touches[0].clientX;
      }
    };
  
    const onTouchMove = (event: TouchEvent) => {
      if (!isPoseSet) return;
  
      if (event.touches.length === 2) {
        event.preventDefault();
        const newDistance = getTouchDistance(event.touches);
  
        if (initialTouchDistanceRef.current === null) {
          initialTouchDistanceRef.current = newDistance;
          initialScaleRef.current = scale.clone();
          return;
        }
  
        const scaleFactor = newDistance / initialTouchDistanceRef.current;
        const baseScale = initialScaleRef.current || INITIAL_SCALE;
  
        const newScale = baseScale.clone().multiplyScalar(scaleFactor);
  
        const clamped = new Vector3(
          MathUtils.clamp(newScale.x, 0.2, 3),
          MathUtils.clamp(newScale.y, 0.2, 3),
          MathUtils.clamp(newScale.z, 0.2, 3)
        );
  
        setScale(clamped);
      }
  
      if (event.touches.length === 1 && isDragging.current && pose) {
        // 👉 Single finger drag = rotation
        const currentX = event.touches[0].clientX;
        if (lastTouchX.current !== null) {
          const deltaX = currentX - lastTouchX.current;
          const rotationSpeed = -0.005; // Adjust sensitivity
  
          // Modify the pose quaternion to rotate around Y axis
          const yRotation = new Quaternion().setFromAxisAngle(
            new Vector3(0, 1, 0),
            -deltaX * rotationSpeed
          );
  
          const newQuaternion = pose.quaternion.clone().multiply(yRotation);
  
          setPose({
            ...pose,
            quaternion: newQuaternion,
          });
        }
        lastTouchX.current = currentX;
      }
    };
  
    const onTouchEnd = () => {
      initialTouchDistanceRef.current = null;
      initialScaleRef.current = null;
      isDragging.current = false;
      lastTouchX.current = null;
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
  }, [isPoseSet, pose, scale, setPose]);
  
  

  // Logic for placing the house model at the selected location.
  useXRInputSourceEvent(
    "all",
    "select",
    (event) => {
      if (isPoseSet) {
        return;
      }

      const hit = hits[event.inputSource.handedness];

      if (!hit) {
        return;
      }

      const position = new Vector3();
      const quaternion = new Quaternion();

      hit.decompose(position, quaternion, new Vector3());

      setPose({
        position,
        quaternion,
      });
    },
    [isPoseSet, hits]
  );

  // Logic for determining the label origin.
  useFrame(({ camera }) => {
    if (!pose) {
      return;
    }

    camera.updateMatrixWorld(true);
    setLabelOrigin(pose.position.clone().project(camera));
  });

  return isPoseSet ? (
    <group
      {...pose}
      rotation={[0, -Math.PI / 2, 0]}
      scale={scale}
      dispose={null}
    >
      <Gltf src="/models/house.glb" />
    </group>
  ) : null;
};
