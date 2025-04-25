import { useEffect, useState } from "react";

// Components
import { Card } from "$components/Card";
import { Button } from "$components/Button";

// Hooks
import { useXRSessionEnter } from "$hooks/xr-session";

// Types
import type { FC, MouseEventHandler } from "react";

export const Welcome: FC = () => {
  const [isXRSupported, setIsXRSupported] = useState(false);
  const startSession = useXRSessionEnter();

  useEffect(() => {
    console.clear();
    console.log(
      "%cSopra Steria",
      "background: linear-gradient(314deg, #DE1924, #F67300);" +
        "color: #ffffff;" +
        "padding: 1em;" +
        "border-radius: 0.5em;",
      "AR Immobilien Demo"
    );

    checkXRSupport();
  });

  const checkXRSupport = async () => {
    setIsXRSupported(
      !!navigator.xr && (await navigator.xr.isSessionSupported("immersive-ar"))
    );
  };

  const enterAR: MouseEventHandler = async (event) => {
    event.stopPropagation();
    await startSession();
  };

  return (
    <div className="absolute top-0 left-0 grid place-content-center gap-20 w-full min-h-dvh">
      <div className="grid place-content-center gap-2 text-center">
        <img
          src="/logo.png"
          alt="Sopra Steria CSS Logo"
          className="max-w-72 pointer-events-none"
        />
        <span className="text-neutral-400 text-2xl select-none">
          AR Immobilien Demo
        </span>
      </div>
      {isXRSupported ? (
        <Button onClick={enterAR}>
          <span className="block px-3 py-2">AR-Umgebung starten</span>
        </Button>
      ) : (
        <Card>
          <div className="flex flex-col gap-2 max-w-64">
            <span className="text-xl">Entschuldigung</span>
            <span className="text-neutral-400">
              Leider unterstützt dieser Browser WebXR nicht.
            </span>
          </div>
        </Card>
      )}
    </div>
  );
};
