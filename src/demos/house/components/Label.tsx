import { useMemo } from "react";
import { useLabelOrigin } from "$demos/house/stores/label-origin";

// Components
import { Card } from "$components/Card";

// Types
import type { FC } from "react";

type Props = {
  title: string;
  body: string;
  offsetX?: number;
  offsetY?: number;
};

export const Label: FC<Props> = ({ title, body, offsetX = 0, offsetY = 0 }) => {
  const labelOrigin = useLabelOrigin((state) => state.labelOrigin);

  const { x, y, z, scale, opacity } = useMemo(() => {
    if (!labelOrigin) {
      return {
        x: NaN,
        y: NaN,
        z: NaN,
        scale: NaN,
        opacity: NaN,
      };
    }

    const w = window.innerWidth / 2;
    const h = window.innerHeight / 2;

    const x = (labelOrigin.x * w + w) | 0;
    const y = (-(labelOrigin.y * h) + h) | 0;
    const z = labelOrigin.z;

    const scale = (1 - z) * 5;
    const opacity = z > 0.86 ? 1 : Math.max(0, (z - 0.7) | 0);

    return {
      x,
      y,
      z,
      scale,
      opacity,
    };
  }, [labelOrigin]);

  if ([x, y, z, scale, opacity].some(Number.isNaN)) {
    return null;
  }

  return (
    <div
      className="absolute -translate-1/2 pointer-events-none"
      style={{
        top: `${y + offsetY}px`,
        left: `${x + offsetX}px`,
        opacity,
        scale,
      }}
    >
      <Card>
        <div className="flex flex-col gap-0.5 min-w-48">
          <span className="font-bold">{title}</span>
          <span className="text-neutral-400">{body}</span>
        </div>
      </Card>
    </div>
  );
};
