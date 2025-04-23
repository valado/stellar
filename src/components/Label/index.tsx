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
  const opacity = z > 0.86 ? 1 : Math.max(0, (z - 0.7) / 1);

  return !Number.isNaN(origin.x) && !Number.isNaN(origin.y) ? (
    <div
      style={{
        position: "absolute",
        left: `${x + offsetX}px`,
        top: `${y + offsetY}px`,
        transform: `translate(-50%, -50%) scale(${scale * 10})`,
        display: "flex",
        flexDirection: "column",
        gap: "0.25em",
        background:
          "radial-gradient(113% 91% at 17% -2%, #888888 1%, #FF000000 99%),radial-gradient(75% 75% at 50% 50%, #484848 0%, #606060 100%)",
        backdropFilter: "blur(10px)",
        padding: "1em",
        border: "1px solid #484848",
        borderRadius: "1em",
        fontSize: "0.9em",
        opacity,
        transition: "opacity 0.2s ease",
        pointerEvents: "none",
        zIndex: 10,
      }}
    >
      <span style={{ fontWeight: 600, fontSize: "1.05em" }}>{title}</span>
      <span style={{ color: "#9c9c9c" }}>{value}</span>
    </div>
  ) : null;
};
