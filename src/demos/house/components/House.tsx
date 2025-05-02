import { useEffect, useRef, useState } from "react";
import { MathUtils, Quaternion, Vector3 } from "three";
import { useFrame } from "@react-three/fiber";
import { useXRInputSourceEvent } from "@react-three/xr";
import { useHits } from "$stores/hits";
import { usePose } from "$stores/pose";
import { useLabelOrigin } from "$demos/house/stores/label-origin";

// Components
import { Gltf } from "@react-three/drei";

// Types
import type { FC } from "react";

const INITIAL_SCALE = new Vector3(0.3, 0.3, 0.3);

const getTouchDistance = (touches: TouchList) => {
  const dx = touches[0].clientX - touches[1].clientX;
  const dy = touches[0].clientY - touches[1].clientY;
  return Math.sqrt(dx * dx + dy * dy);
};

export const House: FC = () => {
  const [scale, setScale] = useState(INITIAL_SCALE);
  const hits = useHits((state) => state.hits);
  const pose = usePose((state) => state.pose);
  const setPose = usePose((state) => state.setPose);
  const setLabelOrigin = useLabelOrigin((state) => state.setLabelOrigin);

  const isDraggingRef = useRef<boolean>(false);
  const lastTouchXRef = useRef<number | null>(null);
  const touchDistanceRef = useRef<number | null>(null);
  const scaleRef = useRef<Vector3 | null>(null);

  // Logic for custom touch gestures.
  useEffect(() => {
    const onTouchStart = (event: TouchEvent) => {
      if (event.touches.length === 1 && pose) {
        isDraggingRef.current = true;
        lastTouchXRef.current = event.touches[0].clientX;
      }
    };

    const onTouchMove = (event: TouchEvent) => {
      if (!pose) {
        return;
      }

      // Handle scaling.
      if (event.touches.length === 2 && pose) {
        event.preventDefault();
        const newDistance = getTouchDistance(event.touches);

        if (!touchDistanceRef.current) {
          touchDistanceRef.current = newDistance;
          scaleRef.current = scale.clone();
          return;
        }

        const scaleFactor = newDistance / touchDistanceRef.current;

        const oldScale = scaleRef.current || INITIAL_SCALE;
        const newScale = oldScale.multiplyScalar(scaleFactor);

        const clamped = new Vector3(
          MathUtils.clamp(newScale.x, 0.2, 3),
          MathUtils.clamp(newScale.y, 0.2, 3),
          MathUtils.clamp(newScale.z, 0.2, 3)
        );

        setScale(clamped);
      }

      // Handle rotation.
      if (event.touches.length === 1 && isDraggingRef.current && pose) {
        const currentX = event.touches[0].clientX;

        if (lastTouchXRef.current !== null) {
          const deltaX = currentX - lastTouchXRef.current;
          const rotationSpeed = -0.005;

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

        lastTouchXRef.current = currentX;
      }
    };

    const onTouchEnd = () => {
      isDraggingRef.current = false;
      lastTouchXRef.current = null;
      touchDistanceRef.current = null;
      scaleRef.current = null;
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
  }, [pose, scale]);

  // Logic for placing the house model at the selected location.
  useXRInputSourceEvent(
    "all",
    "select",
    (event) => {
      if (pose) {
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
    [pose, hits]
  );

  // Logic for determining the label origin.
  useFrame(({ camera }) => {
    if (!pose) {
      return;
    }

    camera.updateMatrixWorld(true);
    setLabelOrigin(pose.position.clone().project(camera));
  });

  if (!pose) {
    return null;
  }

  return (
    <Gltf
      src="/models/house.glb"
      {...pose}
      rotation={[0, MathUtils.degToRad(-90), 0]}
      scale={scale}
      dispose={null}
    />
  );
};
