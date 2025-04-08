import { Canvas } from "@react-three/fiber";
import { XR, createXRStore, XRHandModel } from "@react-three/xr";
import { FC, Suspense, useEffect, useState } from "react";
import { MediaPipeHandTracker } from "./MediaPipeHandTracker.tsx";
import { useRef } from "react";
import * as THREE from "three";


const store = createXRStore({
  hand: XRHandModel,
  handTracking: true,
});

export const Scene: FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);

  const [supported, setSupported] = useState(false);
  const [useMediaPipe, setUseMediaPipe] = useState(false);

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
    (async () => {
      const arSupported = "xr" in navigator && await navigator.xr!.isSessionSupported("immersive-ar");
      setSupported(arSupported);
  
      if (!arSupported || !(navigator as any).xr?.hand) {
        setUseMediaPipe(true); // fallback to MediaPipe
      }
    })();
  }, []);
  

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
              ref={meshRef}
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
      {useMediaPipe && (
  <MediaPipeHandTracker
    onHandMove={([x, y]) => {
      if (meshRef.current) {
        meshRef.current.position.x = x;
        meshRef.current.position.y = y + 1; // +1 to keep it above floor
      }
    }}
  />
)}

    </>
  );
};
