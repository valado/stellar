import { useXRSession } from "$stores/xr-session";

// Components
import { Button } from "$components/Button";

// Types
import type { FC, MouseEventHandler } from "react";

type Props = {
  title: string;
  onEnterXR: MouseEventHandler<HTMLButtonElement>;
};

export const Welcome: FC<Props> = ({ title, onEnterXR: enterXR }) => {
  const isActiveSession = useXRSession((state) => state.isActiveSession);

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
      <Button onClick={enterXR}>AR-Umgebung starten</Button>
    </div>
  );
};
