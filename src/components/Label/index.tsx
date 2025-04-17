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

  return !Number.isNaN(origin.x) && !Number.isNaN(origin.y) ? (
    <div
      style={{
        position: "absolute",
        display: "flex",
        flexDirection: "column",
        padding: "1em",
        background: "rgba(255, 255, 255, 0.75)",
        left: `${x + offsetX}px`,
        top: `${y + offsetY}px`,
        fontSize: `${0.75 * scale}em`,
        transform: `translate(-50%, -50%) scale(${scale})`,
      }}
    >
      <span style={{ fontWeight: "bold" }}>{title}</span>
      <span>{value}</span>
    </div>
  ) : null;
};
