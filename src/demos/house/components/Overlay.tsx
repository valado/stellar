import { useState } from "react";
import { usePose } from "$stores/pose";
import { useHits } from "$stores/hits";
import { useLabels } from "$demos/house/stores/labels";

// Components
import { useXR } from "@react-three/xr";
import {
  EuroIcon,
  EyeClosedIcon,
  EyeIcon,
  RotateCcwIcon,
  RulerDimensionLineIcon,
} from "lucide-react";
import { Button } from "$components/Button";
import { Overlay as BaseOverlay } from "$components/Overlay";
import { Scan } from "$components/Scan";
import { Label } from "$demos/house/components/Label";

// Types
import type { FC, MouseEventHandler } from "react";

export const Overlay: FC = () => {
  const isHandheld = useXR(
    (state) => state.session?.interactionMode === "screen-space",
  );

  const [isFinancialLabels, setIsFinancialLabels] = useState(true);
  const isLabelVisible = useLabels((state) => state.isVisible);
  const setIsLabelVisible = useLabels((state) => state.setIsVisible);
  const pose = usePose((state) => state.pose);

  const resetPose = usePose((state) => state.resetPose);
  const resetHits = useHits((state) => state.resetHits);
  const resetOrigin = useLabels((state) => state.resetOrigin);

  const reset: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.stopPropagation();
    resetHits();
    resetPose();
    resetOrigin();
  };

  return (
    <BaseOverlay>
      {!pose && <Scan />}

      {pose && (
        <div className="absolute flex flex-col gap-4 bottom-4 right-4 z-10">
          <Button onClick={reset} className="w-12 h-12">
            <RotateCcwIcon />
          </Button>
          <Button
            onClick={() => setIsFinancialLabels(!isFinancialLabels)}
            className="w-12 h-12"
          >
            {isFinancialLabels ? <EuroIcon /> : <RulerDimensionLineIcon />}
          </Button>
          <Button
            onClick={() => setIsLabelVisible(!isLabelVisible)}
            className="w-12 h-12"
          >
            {isLabelVisible ? <EyeIcon /> : <EyeClosedIcon />}
          </Button>
        </div>
      )}

      {isHandheld && pose && isLabelVisible && isFinancialLabels && (
        <>
          <Label title="Immobilienwert" body="€ 2.650.000" offsetX={-100} />
          <Label title="Mtl. Hypothekenzahlung" body="€ 6.100" offsetX={100} />
          <Label title="Zinssatz" body="2%" offsetY={-100} />
          <Label title="Laufzeit" body="30 Jahre" offsetY={100} />
        </>
      )}

      {isHandheld && pose && isLabelVisible && !isFinancialLabels && (
        <>
          <Label title="Lage" body="München-Grünwald" offsetX={-100} />
          <Label title="Grundfläche" body="200 qm" offsetX={100} />
          <Label title="Etagen" body="2" offsetY={-100} />
          <Label title="Energie-Effizienz" body="B" offsetY={100} />
        </>
      )}
    </BaseOverlay>
  );
};
