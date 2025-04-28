import { useHits } from "$stores/hits";
import { useLabelOrigin } from "$stores/label-origin";
import { usePose } from "$stores/pose";
import { useXRSession } from "$stores/xr-session";

export const useXRSessionEnter = () => {
  const store = useXRSession((state) => state.store);
  const isInAR = useXRSession((state) => state.isInAR);
  const setIsInAR = useXRSession((state) => state.setIsInAR);
  const resetPose = usePose((state) => state.resetPose);
  const resetHits = useHits((state) => state.resetHits);
  const resetLabelOrigin = useLabelOrigin((state) => state.resetLabelOrigin);

  return async () => {
    if (isInAR) {
      return false;
    }

    try {
      const session = await store.enterAR();

      if (!session) {
        console.error("[Session]", "Failed to start session.");
        return false;
      }

      session.addEventListener("end", () => {
        resetHits();
        resetPose();
        resetLabelOrigin();
        setIsInAR(false);
        console.log("[Session]", "Ending current AR session.");
      });

      setIsInAR(true);
      console.log("[Session]", "Starting new AR session.");
      return true;
    } catch (error) {
      console.error("[Session]", "Failed to start session.", error);
      return false;
    }
  };
};

export const useXRSessionEnd = () => {
  const store = useXRSession((state) => state.store);
  const isInAR = useXRSession((state) => state.isInAR);

  return async () => {
    if (!isInAR) {
      return false;
    }

    const { session } = store.getState();

    if (!session) {
      return false;
    }

    try {
      await session.end();
      return true;
    } catch (error) {
      console.error("[Session]", "Failed to end session.", error);
      return false;
    }
  };
};
