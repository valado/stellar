import { memo, useEffect, useRef, useState } from "react";
import { useXRInputSourceEvent } from "@react-three/xr";
import { MathUtils, Quaternion, Vector3 } from "three";
import { useHits } from "$stores/hits";
import { usePose } from "$stores/pose";

// Components
import { Suspense } from "react";

// Types
import type { FC } from "react";

type Props = {
  open: number;
  close: number;
  high: number;
  low: number;
  volume: number;
};

const INITIAL_SCALE = new Vector3(0.8, 0.8, 0.8);
const BODY_WIDTH = 0.1;
const WICK_WIDTH = 0.01;

const candlesticks: Props[] = [
  { open: 1.0, close: 0.9, high: 1.3, low: 0.8, volume: 0.5 },
  { open: 0.9, close: 0.6, high: 1.1, low: 0.5, volume: 0.4 },
  { open: 0.6, close: 0.5, high: 1.2, low: 0.4, volume: 0.35 },
  { open: 0.5, close: 0.1, high: 0.8, low: 0.2, volume: 0.5 },
  { open: 0.1, close: 0.4, high: 0.5, low: 0.0, volume: 0.55 },
  { open: 0.4, close: 0.6, high: 0.7, low: 0.3, volume: 0.45 },
  { open: 0.6, close: 0.7, high: 0.9, low: 0.5, volume: 0.3 },
  { open: 0.7, close: 1.0, high: 1.2, low: 0.2, volume: 0.25 },
  { open: 1.0, close: 0.6, high: 1.1, low: 0.5, volume: 0.4 },
  { open: 0.6, close: 0.7, high: 0.8, low: 0.5, volume: 0.6 },
  { open: 0.7, close: 0.8, high: 0.9, low: 0.6, volume: 0.5 },
  { open: 0.8, close: 1.5, high: 1.7, low: 0.7, volume: 0.55 },
];

const getTouchDistance = (touches: TouchList) => {
  const dx = touches[0].clientX - touches[1].clientX;
  const dy = touches[0].clientY - touches[1].clientY;
  return Math.sqrt(dx * dx + dy * dy);
};

const Candlestick: FC<Props> = memo(({ open, close, high, low, volume }) => {
  const bodyHeight = Math.abs(close - open);
  const highHeight = high - Math.max(open, close);
  const lowHeight = Math.min(open, close) - low;

  const color = close >= open ? "green" : "red";

  return (
    <group>
      {/* High */}
      <mesh position={[0, high - highHeight / 2, 0]}>
        <boxGeometry args={[WICK_WIDTH, highHeight, WICK_WIDTH]} />
        <meshBasicMaterial color={color} />
      </mesh>

      {/* Body */}
      <mesh position={[0, (open + close) / 2, 0]}>
        <boxGeometry args={[BODY_WIDTH, bodyHeight, volume]} />
        <meshBasicMaterial transparent opacity={0.9} color={color} />
      </mesh>

      {/* Low */}
      <mesh position={[0, low + lowHeight / 2, 0]}>
        <boxGeometry args={[WICK_WIDTH, lowHeight, WICK_WIDTH]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </group>
  );
});

export const Chart: FC = () => {
  const [scale, setScale] = useState<Vector3>(INITIAL_SCALE);
  const hits = useHits((state) => state.hits);
  const pose = usePose((state) => state.pose);
  const setPose = usePose((state) => state.setPose);

  const isDraggingRef = useRef<boolean>(false);
  const lastTouchXRef = useRef<number | null>(null);
  const touchDistanceRef = useRef<number | null>(null);
  const scaleRef = useRef<Vector3 | null>(null);

  // Logic for custom touch gestures.
  useEffect(() => {
    if (!pose) {
      setScale(INITIAL_SCALE);
      return;
    }

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
      if (event.touches.length === 2) {
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
          MathUtils.clamp(newScale.x, 0.2, INITIAL_SCALE.x * 2),
          INITIAL_SCALE.y,
          INITIAL_SCALE.z,
        );

        setScale(clamped);
      }

      // Handle rotation.
      if (event.touches.length === 1 && isDraggingRef.current) {
        const currentX = event.touches[0].clientX;

        if (lastTouchXRef.current !== null) {
          const deltaX = currentX - lastTouchXRef.current;
          const rotationSpeed = -0.005;

          const yRotation = new Quaternion().setFromAxisAngle(
            new Vector3(0, 1, 0),
            -deltaX * rotationSpeed,
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

  // Logic for placing the candlesticks at the selected location.
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
    [pose, hits],
  );

  if (!pose) {
    return null;
  }

  return (
    <Suspense fallback={null}>
      <group {...pose} scale={scale} dispose={null}>
        {candlesticks.map((data, i) => (
          <group key={i} position={[i * BODY_WIDTH * 1.05, 0, 0]}>
            <Candlestick {...data} />
          </group>
        ))}
      </group>
    </Suspense>
  );
};
