import { useEffect, useRef, useState } from "react";
import { useXRSessionEnd } from "$hooks/xr-session";

// Stores
import { usePose } from "$stores/pose";
import { useHits } from "$stores/hits";
import { useLabelOrigin } from "$stores/label-origin";

// Components
import { XRDomOverlay } from "@react-three/xr";
import {
  EuroIcon,
  EyeClosedIcon,
  EyeIcon,
  RotateCcwIcon,
  RulerDimensionLineIcon,
  XIcon,
} from "lucide-react";
import { ScanEffect } from "$components/ScanEffect";
import { Card } from "$components/Card";
import { Button } from "$components/Button";
import { Loader } from "$components/Loader";
import { Label } from "$components/Label";

// Types
import type { FC, MouseEventHandler } from "react";

export const UI: FC = () => {
  const [areLabelsHidden, setAreLabelsHidden] = useState(false);
  const [isFinancialLabels, setIsFinancialLabels] = useState(true);
  const [isTakingLonger, setIsTakingLonger] = useState(false);
  const isPoseSet = usePose((state) => state.isPoseSet);
  const hits = useHits((state) => state.hits);
  const resetPose = usePose((state) => state.resetPose);
  const resetHits = useHits((state) => state.resetHits);
  const resetLabelOrigin = useLabelOrigin((state) => state.resetLabelOrigin);

  const endSession = useXRSessionEnd();

  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null!);

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

  const exitAR: MouseEventHandler = async (event) => {
    event.stopPropagation();
    await endSession();
  };

  const reset: MouseEventHandler = (event) => {
    event.stopPropagation();
    resetHits();
    resetPose();
    resetLabelOrigin();
  };

  const toggleFinancialLabels: MouseEventHandler = (event) => {
    event.stopPropagation();
    setIsFinancialLabels(!isFinancialLabels);
  };

  const toggleLabels: MouseEventHandler = (event) => {
    event.stopPropagation();
    setAreLabelsHidden(!areLabelsHidden);
  };

  return (
    <XRDomOverlay className="relative min-h-dvh">
      <div className="absolute top-4 left-4 z-10">
        <Button onClick={exitAR}>
          <XIcon />
        </Button>
      </div>

      {isPoseSet && (
        <div className="absolute flex flex-col gap-4 bottom-4 right-4 z-10">
          <Button onClick={reset}>
            <RotateCcwIcon />
          </Button>
          <Button onClick={toggleFinancialLabels}>
            {isFinancialLabels ? <EuroIcon /> : <RulerDimensionLineIcon />}
          </Button>
          <Button onClick={toggleLabels}>
            {areLabelsHidden ? <EyeClosedIcon /> : <EyeIcon />}
          </Button>
        </div>
      )}

      {Object.keys(hits).length === 0 && (
        <>
          <ScanEffect />
          <div className="absolute flex flex-col gap-4 top-1/2 left-1/2 -translate-1/2 select-none z-10">
            <Card>
              <div className="flex flex-col items-center gap-2 min-w-48 text-center">
                <Loader />
                <span className="font-2xl animate-pulse">
                  Scanne Umgebung...
                </span>
              </div>
            </Card>
            {isTakingLonger && (
              <Card>
                <span className="block  text-center">
                  Das dauert länger als gewöhnlich...
                </span>
              </Card>
            )}
          </div>
        </>
      )}

      {isPoseSet &&
        !areLabelsHidden &&
        (isFinancialLabels ? (
          <>
            <Label title="Immobilienwert" body="€ 2.650.000" offsetX={-100} />
            <Label
              title="Mtl. Hypothekenzahlung"
              body="€ 6.100"
              offsetX={100}
            />
            <Label title="Zinssatz" body="2%" offsetY={-100} />
            <Label title="Laufzeit" body="30 Jahre" offsetY={100} />
          </>
        ) : (
          <>
            <Label title="Lage" body="München-Grünwald" offsetX={-100} />
            <Label title="Grundfläche" body="200 qm" offsetX={100} />
            <Label title="Etagen" body="2" offsetY={-100} />
            <Label title="Energie-Effizienz" body="B" offsetY={100} />
          </>
        ))}
    </XRDomOverlay>
  );
};
