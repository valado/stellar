import { useEffect, useRef, useState } from "react";
import { useExitXR } from "$hooks/xr-session";
import { usePose } from "$stores/pose";
import { useHits } from "$stores/hits";
import { useLabelOrigin } from "$demos/house/stores/label-origin";

// Components
import { useXR, XRDomOverlay } from "@react-three/xr";
import {
  EuroIcon,
  EyeClosedIcon,
  EyeIcon,
  RotateCcwIcon,
  RulerDimensionLineIcon,
  XIcon,
} from "lucide-react";
import { Button } from "$components/Button";
import { Card, CardContent } from "$components/Card";
import { ScanEffect } from "$components/ScanEffect";
import { Loader } from "$components/Loader";
import { Label } from "$demos/house/components/Label";

// Types
import type { FC, MouseEventHandler } from "react";
import { UI } from "./UI";

export const Overlay: FC = () => {
  const isHandheld = useXR(
    (state) => state.session?.interactionMode === "screen-space",
  );
  const [areLabelsHidden, setAreLabelsHidden] = useState(false);
  const [isFinancialLabels, setIsFinancialLabels] = useState(true);
  const [isTakingLonger, setIsTakingLonger] = useState(false);
  const hits = useHits((state) => state.hits);
  const pose = usePose((state) => state.pose);

  const resetPose = usePose((state) => state.resetPose);
  const resetHits = useHits((state) => state.resetHits);
  const resetLabelOrigin = useLabelOrigin((state) => state.resetLabelOrigin);

  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null!);

  const exitXR = useExitXR();

  useEffect(() => {
    if (Object.keys(hits).length === 0) {
      timeoutRef.current = setTimeout(() => {
        setIsTakingLonger(true);
      }, 1000 * 10);
    } else {
      clearTimeout(timeoutRef.current);
    }

    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, [hits]);

  const reset: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.stopPropagation();
    resetHits();
    resetPose();
    resetLabelOrigin();
  };

  return (
    <XRDomOverlay className="relative min-h-dvh">
      <div className="absolute top-4 left-4">
        <Button onClick={exitXR} className="w-12 h-12">
          <XIcon />
        </Button>
      </div>

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
            onClick={() => setAreLabelsHidden(!areLabelsHidden)}
            className="w-12 h-12"
          >
            {areLabelsHidden ? <EyeClosedIcon /> : <EyeIcon />}
          </Button>
        </div>
      )}

      {Object.keys(hits).length === 0 && (
        <>
          <ScanEffect />
          <div className="absolute flex flex-col gap-4 top-1/2 left-1/2 -translate-1/2 select-none z-10">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center gap-2 min-w-48 text-center">
                  <Loader />
                  <span className="font-2xl animate-pulse">
                    Scanne Umgebung...
                  </span>
                </div>
              </CardContent>
            </Card>
            {isTakingLonger && (
              <Card>
                <CardContent className="p-6">
                  <span className="block text-center">
                    Keine Fläche erkannt. Bitte schaue Dich weiterhin um.
                  </span>
                </CardContent>
              </Card>
            )}
          </div>
        </>
      )}

      {!isHandheld && (<UI></UI>)}
      {isHandheld && pose && !areLabelsHidden && isFinancialLabels && (
        <>
          <Label title="Immobilienwert" body="€ 2.650.000" offsetX={-100} />
          <Label title="Mtl. Hypothekenzahlung" body="€ 6.100" offsetX={100} />
          <Label title="Zinssatz" body="2%" offsetY={-100} />
          <Label title="Laufzeit" body="30 Jahre" offsetY={100} />
        </>
      )}

      {isHandheld && pose && !areLabelsHidden && !isFinancialLabels && (
        <>
          <Label title="Lage" body="München-Grünwald" offsetX={-100} />
          <Label title="Grundfläche" body="200 qm" offsetX={100} />
          <Label title="Etagen" body="2" offsetY={-100} />
          <Label title="Energie-Effizienz" body="B" offsetY={100} />
        </>
      )}
    </XRDomOverlay>
  );
};
