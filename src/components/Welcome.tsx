import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useXRSession } from "$stores/xr-session";

// Components
import { ArrowLeftIcon } from "lucide-react";
import { Button } from "$components/Button";
import { Card, CardDescription, CardHeader, CardTitle } from "$components/Card";

// Types
import type { FC, MouseEventHandler } from "react";

type Props = {
  title: string;
  onEnterXR: MouseEventHandler<HTMLButtonElement>;
};

export const Welcome: FC<Props> = ({ title, onEnterXR: enterXR }) => {
  const [isXRSupported, setIsXRSupported] = useState(false);
  const isActiveSession = useXRSession((state) => state.isActiveSession);
  const navigate = useNavigate();

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
          className="pointer-events-none"
        />
        <div className="flex items-center gap-4">
          <Button className="w-4" onClick={() => navigate("/")}>
            <ArrowLeftIcon />
          </Button>
          <h1 className="text-lg">{title}</h1>
        </div>
      </div>
      {isXRSupported ? (
        <Button onClick={enterXR} className="h-12">
          AR-Umgebung starten
        </Button>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Entschuldigung</CardTitle>
            <CardDescription>
              Leider unterstützt dieser Browser{" "}
              <a
                href="https://developer.mozilla.org/en-US/docs/Games/Techniques/3D_on_the_web/WebXR"
                className="border-b-[0.1em]"
                target="_blank"
              >
                WebXR
              </a>{" "}
              nicht.
            </CardDescription>
          </CardHeader>
        </Card>
      )}
    </div>
  );
};
