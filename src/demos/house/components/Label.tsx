import { memo, useMemo } from "react";
import { useLabels } from "$demos/house/stores/labels";

// Components
import { Card, CardHeader, CardTitle, CardDescription } from "$components/Card";

type Props = {
  title: string;
  body: string;
  offsetX?: number;
  offsetY?: number;
};

export const Label = memo<Props>(
  ({ title, body, offsetX = 0, offsetY = 0 }) => {
    const origin = useLabels((state) => state.origin);

    const { x, y, z, scale, opacity } = useMemo(() => {
      if (!origin) {
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

      const x = (origin.x * w + w) | 0;
      const y = (-(origin.y * h) + h) | 0;
      const z = origin.z;

      const scale = (1 - z) * 5;
      const opacity = z > 0.86 ? 1 : Math.max(0, (z - 0.7) | 0);

      return {
        x,
        y,
        z,
        scale,
        opacity,
      };
    }, [origin]);

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
          <CardHeader>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{body}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  },
);
