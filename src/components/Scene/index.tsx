import { Canvas } from "@react-three/fiber";
import {
  IfInSessionMode,
  XR,
  XRDomOverlay,
  createXRStore,
} from "@react-three/xr";
import { FC, useEffect, useState } from "react";

const store = createXRStore({
  domOverlay: true,
  hitTest: true,
  anchors: true,
  layers: true,
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
          <IfInSessionMode>
            <XRDomOverlay>
              <button onClick={exitAR}>Exit AR</button>
            </XRDomOverlay>
          </IfInSessionMode>
        </XR>
      </Canvas>
    </>
  );
};
