import { XRSessionProvider } from "$stores/xr-session";

// Types
import type { FC } from "react";
import type { createXRStore } from "@react-three/xr";

type DemoFile = {
  xrStore: ReturnType<typeof createXRStore>;
  Demo: FC;
};

export const createDemo = ({ xrStore, Demo }: DemoFile) => {
  if (!xrStore) {
    throw new Error("All demos must export an XR store called `xrStore`");
  }

  if (!Demo) {
    throw new Error("All demos must export a component called `Demo`");
  }

  return () => (
    <XRSessionProvider xrStore={xrStore}>
      <Demo />
    </XRSessionProvider>
  );
};
