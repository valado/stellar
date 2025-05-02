import { useEffect, useRef, useState } from "react";
import { Vector3, Quaternion, MathUtils } from "three";
import { useFrame } from "@react-three/fiber";
import { useXRInputSourceEvent } from "@react-three/xr";
import * as THREE from "three";

// Components
import { Gltf } from "@react-three/drei";

// Stores
import { useHits } from "$stores/hits";
import { usePose } from "$stores/pose";

// Types
import type { FC } from "react";

const INITIAL_SCALE = new Vector3(1.2, 1.2, 1.2);

const getTouchDistance = (touches: TouchList) => {
  const dx = touches[0].clientX - touches[1].clientX;
  const dy = touches[0].clientY - touches[1].clientY;
  return Math.sqrt(dx * dx + dy * dy);
};

export const Earth: FC = () => {
  const [scale, setScale] = useState(INITIAL_SCALE);
  const [autoAnimate, setAutoAnimate] = useState(true);
  const hits = useHits((state) => state.hits);
  const pose = usePose((state) => state.pose);
  const setPose = usePose((state) => state.setPose);

  const isDraggingRef = useRef<boolean>(false);
  const lastTouchRef = useRef<{ x: number; y: number } | null>(null);
  const touchDistanceRef = useRef<number | null>(null);
  const scaleRef = useRef<Vector3 | null>(null);
  const earthRef = useRef<THREE.Group>(null);

  // Logic for custom touch gestures.
  useEffect(() => {
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDraggingRef.current = true;
        lastTouchRef.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
        };
      }
    };

    const onTouchMove = (event: TouchEvent) => {
      if (!pose) return;

      // Handle scaling.
      if (event.touches.length === 2 && pose) {
        setAutoAnimate(false);

        const distance = getTouchDistance(event.touches);

        if (!touchDistanceRef.current) {
          touchDistanceRef.current = distance;
          scaleRef.current = scale.clone();
          return;
        }

        const factor = distance / touchDistanceRef.current;

        const oldScale = scaleRef.current || INITIAL_SCALE;
        const newScale = oldScale.clone().multiplyScalar(factor);

        const clamped = new Vector3(
          MathUtils.clamp(newScale.x, 0.1, 5),
          MathUtils.clamp(newScale.y, 0.1, 5),
          MathUtils.clamp(newScale.z, 0.1, 5)
        );

        setScale(clamped);
      }

      // Handle rotation.
      if (event.touches.length === 1 && isDraggingRef.current) {
        setAutoAnimate(false);

        const { clientX, clientY } = event.touches[0];
        const last = lastTouchRef.current;

        if (last) {
          const deltaX = clientX - last.x;
          const deltaY = clientY - last.y;

          const rotationSpeed = -0.005;

          const qX = new Quaternion().setFromAxisAngle(
            new Vector3(0, 1, 0),
            -deltaX * rotationSpeed
          );

          const qY = new Quaternion().setFromAxisAngle(
            new Vector3(1, 0, 0),
            -deltaY * rotationSpeed
          );

          const newQuaternion = pose.quaternion
            .clone()
            .multiply(qX)
            .multiply(qY);

          setPose({ ...pose, quaternion: newQuaternion });
        }

        lastTouchRef.current = { x: clientX, y: clientY };
      }
    };

    const onTouchEnd = () => {
      isDraggingRef.current = false;
      lastTouchRef.current = null;
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

  // Logic for placing the Earth model at the selected location.
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

  useFrame((_, delta) => {
    if (!autoAnimate || !earthRef.current || !pose) {
      return;
    }

    const t = performance.now() * 0.001;

    earthRef.current.position.y = pose.position.y + Math.sin(t * 0.5) * 0.05;
    earthRef.current.rotation.y += delta * 0.1;
  });

  if (!pose) {
    return null;
  }

  return (
    <Gltf
      src="/models/earth.glb"
      {...pose}
      ref={earthRef}
      scale={scale}
      dispose={null}
    />
  );
};
