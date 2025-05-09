import { useEffect, useState } from "react";
import { useXRSession } from "$stores/xr-session";

// Components
import { Button } from "$components/Button";
import { Card } from "$components/Card";

// Types
import type { FC, MouseEventHandler } from "react";

type Props = {
  title: string;
  onEnterXR: MouseEventHandler<HTMLButtonElement>;
};

export const Welcome: FC<Props> = ({ title, onEnterXR: enterXR }) => {
  const [isXRSupported, setIsXRSupported] = useState(false);
  const isActiveSession = useXRSession((state) => state.isActiveSession);

  const checkXRSupport = async () => {
    setIsXRSupported(
      !!navigator.xr && (await navigator.xr.isSessionSupported("immersive-ar")),
    );
  };

  useEffect(() => {
    checkXRSupport();
  }, []);

  if (isActiveSession) {
    return null;
  }

  return (
    <div className="absolute top-0 left-0 grid place-content-center gap-16 w-full h-full p-8 pb-24">
      <div className="flex flex-col items-center gap-2">
        <img
          src="/logo.png"
          alt="Sopra Steria Custom Software Solutions Logo"
        />
        <h1 className="text-lg">{title}</h1>
      </div>
      {isXRSupported ? (
        <Button onClick={enterXR} className="h-12">
          AR-Umgebung starten
        </Button>
      ) : (
        <Card>
          <div className="flex flex-col gap-2 max-w-64">
            <span className="text-xl">Entschuldigung</span>
            <span className="text-neutral-400">
              Leider unterstützt dieser Browser{" "}
              <a
                href="https://developer.mozilla.org/en-US/docs/Games/Techniques/3D_on_the_web/WebXR"
                className="border-b-[0.1em]"
              >
                WebXR
              </a>{" "}
              nicht.
            </span>
          </div>
        </Card>
      )}
    </div>
  );
};
