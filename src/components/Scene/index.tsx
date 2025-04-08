import { Canvas } from "@react-three/fiber";
import { XR, createXRStore, XRHandModel } from "@react-three/xr";
import { FC, Suspense, useEffect, useState } from "react";

const store = createXRStore({
  hand: XRHandModel,
  handTracking: true,
});

export const Scene: FC = () => {
  const [supported, setSupported] = useState(false);
  const [ar, setAR] = useState(false);
  const [red, setRed] = useState(false);

  const enterAR = async () => {
    try {
      const session = await store.enterAR();

      if (!session) {
        // TODO: Fehler anzeigen.
        return;
      }

      session.onend = () => {
        setAR(false);
        console.log("AR session ended!");
      };

      setAR(true);
      console.log("AR session started!");
    } catch (err: unknown) {
      console.error(err);
      // TODO: Fehler anzeigen.
    }
  };

  useEffect(() => {
    // Bessere Erkennung für den Support von AR.
    (async () => {
      console.log("Checking support for AR...");
      setSupported(
        "xr" in navigator &&
          (await navigator.xr!.isSessionSupported("immersive-ar"))
      );
    })();
  }, []);

  return (
    <>
      {!ar && (
        <span style={{ display: "block" }}>
          Supported: {JSON.stringify(supported)}
        </span>
      )}
      {!ar && <button onClick={enterAR}>Enter AR</button>}
      <Canvas>
        <XR store={store}>
          <Suspense>
            <mesh
              pointerEventsType={{ deny: "grab" }}
              onClick={() => setRed(!red)}
              position={[0, 1, -1]}
            >
              <boxGeometry />
              <meshBasicMaterial color={red ? "red" : "blue"} />
            </mesh>
          </Suspense>
        </XR>
      </Canvas>
    </>
  );
};
