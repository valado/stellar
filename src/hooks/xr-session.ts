import { useXRSession } from "$stores/xr-session";

// Types
import { MouseEventHandler } from "react";

export const useEnterXR = (
  mode: Exclude<XRSessionMode, "inline">,
  onExit: () => void
): MouseEventHandler<HTMLButtonElement> => {
  const setIsActiveSession = useXRSession((state) => state.setIsActiveSession);
  const isActiveSession = useXRSession((state) => state.isActiveSession);
  const xrStore = useXRSession((state) => state.xrStore);

  return async (event) => {
    event.stopPropagation();

    if (isActiveSession) {
      return;
    }

    try {
      const session = await (mode === "immersive-ar"
        ? xrStore.enterAR()
        : xrStore.enterVR());

      if (!session) {
        return;
      }

      session.addEventListener("end", () => {
        onExit();
        setIsActiveSession(false);
      });
    } catch (e) {
      console.error(e);
      return;
    }

    setIsActiveSession(true);
  };
};

export const useExitXR = (): MouseEventHandler<HTMLButtonElement> => {
  const isActiveSession = useXRSession((state) => state.isActiveSession);
  const xrStore = useXRSession((state) => state.xrStore);

  return async (event) => {
    event.stopPropagation();

    if (!isActiveSession) {
      return;
    }

    const { session } = xrStore.getState();

    if (!session) {
      return;
    }

    try {
      await session.end();
    } catch {}
  };
};
