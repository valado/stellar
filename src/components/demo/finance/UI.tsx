import { useXRSessionEnd } from "$hooks/xr-session";

// Components
import { XRDomOverlay } from "@react-three/xr";
import { Root, Text } from "@react-three/uikit";
import {
  Defaults,
  Card as XRCard,
  Button as XRButton,
} from "@react-three/uikit-apfel";
import { XIcon } from "lucide-react";
import { Button } from "$components/Button";
import { Card } from "$components/Card";
import { ScanEffect } from "$components/ScanEffect";
import { Loader } from "$components/Loader";

// Stores
import { useCashMultiplier } from "$stores/cash-multiplier";
import { useHits } from "$stores/hits";
import { usePose } from "$stores/pose";

// Types
import type { FC, MouseEventHandler } from "react";

const AMOUNT_OF_CASH = 10_000;

export const UI: FC = () => {
  const multiplier = useCashMultiplier((state) => state.multiplier);
  const increment = useCashMultiplier((state) => state.increment);
  const decrement = useCashMultiplier((state) => state.decrement);
  const hits = useHits((state) => state.hits);
  const pose = usePose((state) => state.pose);

  const endSession = useXRSessionEnd();

  const exitAR: MouseEventHandler = async (event) => {
    event.stopPropagation();
    await endSession();
  };

  const { format } = new Intl.NumberFormat("de-DE");

  return (
    <>
      <XRDomOverlay className="relative min-h-dvh">
        <div className="absolute top-4 left-4 z-10">
          <Button onClick={exitAR}>
            <XIcon />
          </Button>
        </div>
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
            </div>
          </>
        )}
      </XRDomOverlay>
      {pose && (
        <group
          quaternion={pose.quaternion}
          position={[pose.position.x, pose.position.y + 1, pose.position.z]}
        >
          <Defaults>
            <Root>
              <XRCard flexDirection="column" borderRadius={32} padding={16}>
                <Text>{format(multiplier * AMOUNT_OF_CASH)} EUR</Text>
                <XRButton
                  onClick={(event) => {
                    event?.stopPropagation();
                    increment();
                  }}
                >
                  <Text>+ {format(AMOUNT_OF_CASH)} EUR</Text>
                </XRButton>
                <XRButton
                  onClick={(event) => {
                    event?.stopPropagation();
                    decrement();
                  }}
                >
                  <Text>- {format(AMOUNT_OF_CASH)} EUR</Text>
                </XRButton>
              </XRCard>
            </Root>
          </Defaults>
        </group>
      )}
    </>
  );
};
