import { useEffect, useRef, useState } from "react";
import { useExitXR } from "$hooks/xr-session";
import { usePose } from "$stores/pose";
import { useHits } from "$stores/hits";
import { XRDomOverlay } from "@react-three/xr";
import { RotateCcwIcon, XIcon } from "lucide-react";
import { Button } from "$components/Button";
import { Card } from "$components/Card";
import { ScanEffect } from "$components/ScanEffect";
import { Loader } from "$components/Loader";

// Types
import type { FC, MouseEventHandler } from "react";

export const Overlay: FC = () => {
  const [isTakingLonger, setIsTakingLonger] = useState(false);
  const hits = useHits((state) => state.hits);
  const pose = usePose((state) => state.pose);

  const resetPose = usePose((state) => state.resetPose);
  const resetHits = useHits((state) => state.resetHits);

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
  };

  return (
    <XRDomOverlay className="relative min-h-dvh">
      <div className="absolute top-4 left-4">
        <Button onClick={exitXR}>
          <XIcon />
        </Button>
      </div>

      {pose && (
        <div className="absolute flex flex-col gap-4 bottom-4 right-4 z-10">
          <Button onClick={reset}>
            <RotateCcwIcon />
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
                <span className="block text-center">
                  Keine Fläche erkannt. Bitte schaue Dich weiterhin um.
                </span>
              </Card>
            )}
          </div>
        </>
      )}
    </XRDomOverlay>
  );
};
