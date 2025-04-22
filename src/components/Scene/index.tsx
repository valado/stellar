import { FC, MouseEvent, Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import {
  DefaultXRController,
  DefaultXRHand,
  XR,
  XRHitTest,
  XRSpace,
  createXRStore,
  useXRInputSourceStateContext,
} from "@react-three/xr";
import { Environment } from "@react-three/drei";
import { Card } from "../Card";
import { Button } from "../Button";
import { Overlay } from "../Overlay";
import { HitTest, hitTestMatrices, onResults } from "../HitTest";
import { House } from "../House";
import { Projector } from "../Projector";
import { useCrosshairStore } from "../../stores/crosshair";
import { usePoseStore } from "../../stores/pose";
import { useARStore } from "../../stores/ar";
import { useRef } from "react";
import * as THREE from "three";
import { HouseScaler } from "../Housescaler";

const store = createXRStore({
  domOverlay: true,
  hitTest: true,
  anchors: true,
  layers: true,
  hand: () => {
    const state = useXRInputSourceStateContext();

    return (
      <>
        <DefaultXRHand />
        <XRSpace space={state.inputSource.targetRaySpace}>
          <XRHitTest
            onResults={onResults.bind(null, state.inputSource.handedness)}
          />
        </XRSpace>
      </>
    );
  },
  controller: () => {
    const state = useXRInputSourceStateContext();

    return (
      <>
        <DefaultXRController />
        <XRSpace space={state.inputSource.targetRaySpace}>
          <XRHitTest
            onResults={onResults.bind(null, state.inputSource.handedness)}
          />
        </XRSpace>
      </>
    );
  },
});

export const Scene: FC = () => {
  const houseRef = useRef<THREE.Group>(null);


  const [supported, setSupported] = useState(false);
  const { isAR, setIsAR } = useARStore();
  const isReady = useCrosshairStore((state) => state.visible);
  const resetPose = usePoseStore((state) => state.resetPose);

  useEffect(() => {
    (async () => {
      setSupported(
        !!navigator.xr &&
          (await navigator.xr!.isSessionSupported("immersive-ar"))
      );
    })();
  }, []);

  const enterAR = async () => {
    try {
      const session = await store.enterAR();

      if (!session) {
        console.error("[Session]", "Failed to retrieve AR session.");
        return;
      }

      session.onend = () => {
        setIsAR(false);
        console.log("[Session]", "Ending current AR session.");
      };

      setIsAR(true);
      console.log("[Session]", "Starting new AR session.");
    } catch (err: unknown) {
      console.error("[Session]", "Failed to retrieve AR session.", err);
    }
  };

  const exitAR = (event: MouseEvent) => {
    event.stopPropagation();

    const { session } = store.getState();

    if (!session) {
      return;
    }

    session.end();

    resetPose();

    Object.keys(hitTestMatrices).forEach((key) => {
      delete hitTestMatrices[key as XRHandedness];
    });
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: "2em",
        }}
      >
        <img
          src="/logo.png"
          alt="Sopra Steria CSS Logo"
          style={{
            display: "block",
            width: "256px",
          }}
        />
        <span style={{ color: "#9c9c9c", fontSize: "1.5em", fontWeight: 700 }}>
          House Demo
        </span>
        {!isAR &&
          (supported ? (
            <div>
              <Button onClick={enterAR}>Enter AR</Button>
            </div>
          ) : (
            <Card>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.25em",
                }}
              >
                <span style={{ fontSize: "1.05em", fontWeight: 700 }}>
                  Entschuldigung!
                </span>
                <span style={{ color: "#9c9c9c" }}>
                  Dieser Browser unterstützt WebXR nicht.
                </span>
              </div>
            </Card>
          ))}
      </div>
      <Canvas>
        <XR store={store}>
          <Environment
            files="/hdr/hochsal_field_1k.hdr"
            environmentRotation={[0, 0, Math.PI / 5]}
          />
          {isAR && (
            <Suspense fallback={null}>
              <Overlay onExit={exitAR} />
              <HitTest />
              {isReady && (
                <>
                  <Projector />
                  <House ref={houseRef} />
                  <HouseScaler houseRef={houseRef} />
                </>
              )}
            </Suspense>
          )}
        </XR>
      </Canvas>
    </>
  );
};
