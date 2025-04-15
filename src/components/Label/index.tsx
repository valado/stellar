import { FC, useMemo } from "react";
import { useLabelStore } from "../../stores/label";

export const Label: FC = () => {
  const position = useLabelStore((state) => state.position);

  const { x, y } = useMemo(() => {
    const w = window.innerWidth / 2;
    const h = window.innerHeight / 2;

    return {
      x: (position.x * w + w) | 0,
      y: (-(position.y * h) + h) | 0,
    };
  }, [window.innerWidth, window.innerHeight, position]);

  return !Number.isNaN(position.x) && !Number.isNaN(position.y) ? (
    <div
      style={{
        position: "absolute",
        display: "flex",
        flexDirection: "column",
        padding: "1em",
        background: "rgba(255, 255, 255, 0.75)",
        left: `${x}px`,
        top: `${y}px`,
      }}
    >
      <span>Immobilienwert</span>
      <span>€ 2.650.000</span>
    </div>
  ) : null;
};
