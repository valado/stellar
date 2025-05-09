import { memo, useEffect, useRef, useState } from "react";
import { useXR, useXRInputSourceEvent } from "@react-three/xr";
import { Quaternion, Vector3 } from "three";
import { useHits } from "$stores/hits";
import { usePose } from "$stores/pose";
import { useScale } from "$hooks/scale";
import { useSelection } from "$demos/candlesticks/stores/selection";

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

const INITIAL_SCALE = new Vector3(0.7, 0.7, 0.7);
const MIN_SCALE = new Vector3(0.2, INITIAL_SCALE.y, INITIAL_SCALE.z);
const MAX_SCALE = new Vector3(1, INITIAL_SCALE.y, INITIAL_SCALE.z);

const BODY_WIDTH = 0.1;
const WICK_WIDTH = 0.01;

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
  const [stocks, setStocks] = useState<Record<string, Props[]>>({});
  const hits = useHits((state) => state.hits);
  const pose = usePose((state) => state.pose);
  const setPose = usePose((state) => state.setPose);
  const selection = useSelection((state) => state.selection);

  const isDraggingRef = useRef(false);

  const isHandheld = useXR(
    (state) => state.session?.interactionMode === "screen-space",
  );

  const scale = isHandheld
    ? useScale(INITIAL_SCALE, MIN_SCALE, MAX_SCALE)
    : INITIAL_SCALE;

  useEffect(() => {
    fetch("/stocks/normalized.json")
      .then((res) => res.json())
      .then(setStocks);
  }, []);

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
    <group
      position={[
        pose.position.x - Math.floor(stocks[selection].length / 2) * BODY_WIDTH,
        pose.position.y,
        pose.position.z,
      ]}
      quaternion={pose.quaternion}
      scale={scale}
      dispose={null}
      onPointerDown={(e) => {
        if (isHandheld || isDraggingRef.current) {
          return;
        }

        isDraggingRef.current = true;

        setPose({
          position: e.point,
          quaternion: new Quaternion(),
        });
      }}
      onPointerMove={(e) => {
        if (isHandheld || !isDraggingRef.current) {
          return;
        }

        setPose({
          position: e.point,
          quaternion: new Quaternion(),
        });
      }}
      onPointerUp={() => {
        if (isHandheld) {
          return;
        }

        isDraggingRef.current = false;
      }}
    >
      <Suspense fallback={null}>
        {stocks[selection].map((data, i) => (
          <group key={i} position={[i * BODY_WIDTH, 0, 0]}>
            <Candlestick {...data} />
          </group>
        ))}
      </Suspense>
    </group>
  );
};
