import { Canvas } from "@react-three/fiber";
import {
  DefaultXRController,
  DefaultXRHand,
  IfInSessionMode,
  XR,
  XRDomOverlay,
  XRHitTest,
  XRSpace,
  createXRStore,
  useXRInputSourceStateContext,
} from "@react-three/xr";
import { FC, Suspense, useEffect, useState } from "react";
import { HitTest, onResults } from "../HitTest";
import { House } from "../House";
import { Projector } from "../Projector";
import { Label } from "../Label";

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
  const [supported, setSupported] = useState(false);
  const [ar, setAR] = useState(false);

  const enterAR = async () => {
    try {
      const session = await store.enterAR();

      if (!session) {
        console.error("[Session]", "Failed to retrieve AR session.");
        return;
      }

      session.onend = () => {
        setAR(false);
        console.log("[Session]", "Ending current AR session.");
      };

      setAR(true);
      console.log("[Session]", "Starting new AR session.");
    } catch (err: unknown) {
      console.error("[Session]", "Failed to retrieve AR session.", err);
    }
  };

  const exitAR = () => {
    const { session } = store.getState();

    if (!session) {
      return;
    }

    session.end();
  };

  useEffect(() => {
    (async () => {
      setSupported(
        !!navigator.xr &&
          (await navigator.xr!.isSessionSupported("immersive-ar"))
      );
    })();
  }, []);

  return (
    <>
      {!ar && (
        <>
          <span style={{ display: "block" }}>
            Supported: {JSON.stringify(supported)}
          </span>
          <button onClick={enterAR}>Enter AR</button>
        </>
      )}
      <Canvas>
        <XR store={store}>
          <directionalLight position={[1, 2, 1]} />
          <ambientLight />
          <IfInSessionMode>
            <XRDomOverlay style={{ position: "relative", height: "100dvh" }}>
              <button onClick={exitAR}>Exit AR</button>
              <Label title="Immobilienwert" value="€ 2.650.000" offsetX={100} />
              <Label title="Energie-Effizienzklasse" value="B" offsetX={-200} />
              <Label
                title="Monatliche Hypothek"
                value="€ 6.000"
                offsetY={100}
              />
            </XRDomOverlay>
            <Suspense fallback={null}>
              <HitTest />
              <Projector />
              <House />
            </Suspense>
          </IfInSessionMode>
        </XR>
      </Canvas>
    </>
  );
};
