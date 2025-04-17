import { FC, useMemo } from "react";
import { useLabelOriginStore } from "../../stores/labelOrigin";

type Props = {
  title: string;
  value: string;
  offsetX?: number;
  offsetY?: number;
};

export const Label: FC<Props> = ({
  title,
  value,
  offsetX = 0,
  offsetY = 0,
}) => {
  const origin = useLabelOriginStore((state) => state.origin);

  const { x, y, z } = useMemo(() => {
    const w = window.innerWidth / 2;
    const h = window.innerHeight / 2;

    return {
      x: (origin.x * w + w) | 0,
      y: (-(origin.y * h) + h) | 0,
      z: origin.z,
    };
  }, [window.innerWidth, window.innerHeight, origin]);

  const scale = 1 - z;
  const opacity = Math.max(0, 1 - z * 0.5);

  return !Number.isNaN(origin.x) && !Number.isNaN(origin.y) ? (

    <div
      style={{
        position: "absolute",
        left: `${x + offsetX}px`,
        top: `${y + offsetY}px`,
        transform: `translate(-50%, -50%) scale(${scale * 10})`,
        background: "rgba(255, 255, 255, 0.85)",
        padding: "0.75em 1.2em",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
        backdropFilter: "blur(10px)",
        fontFamily: "Segoe UI, Roboto, sans-serif",
        fontSize: "0.9em",
        color: "#333",
        display: "flex",
        flexDirection: "column",
        gap: "0.25em",
        pointerEvents: "none",
        opacity,
        transition: "opacity 0.2s ease",
        zIndex: 10,
      }}
    >
      <span style={{ fontWeight: 600, fontSize: "1.05em" }}>{title}</span>
      <span style={{ fontWeight: 400 }}>{value}</span>
    </div>
  ) : null;
};
