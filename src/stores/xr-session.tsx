import { createContext, useContext, useRef } from "react";
import { createStore, useStore } from "zustand";

// Types
import type { FC, PropsWithChildren } from "react";
import type { StoreApi } from "zustand";
import type { createXRStore } from "@react-three/xr";

type Props = PropsWithChildren<{
  xrStore: ReturnType<typeof createXRStore>;
}>;

type XRSessionStore = {
  xrStore: ReturnType<typeof createXRStore>;
  isActiveSession: boolean;
  setIsActiveSession: (isActiveSession: boolean) => void;
};

const XRSessionContext = createContext<StoreApi<XRSessionStore>>(null!);

export const XRSessionProvider: FC<Props> = ({ xrStore, children }) => {
  const storeRef = useRef<StoreApi<XRSessionStore>>(null!);

  if (!storeRef.current) {
    storeRef.current = createStore<XRSessionStore>((set) => ({
      xrStore,
      isActiveSession: false,
      setIsActiveSession: (isActiveSession) => set({ isActiveSession }),
    }));
  }

  return (
    <XRSessionContext.Provider value={storeRef.current}>
      {children}
    </XRSessionContext.Provider>
  );
};

export const useXRSession = <T extends XRSessionStore[keyof XRSessionStore]>(
  selector: (state: XRSessionStore) => T
): T => {
  const store = useContext(XRSessionContext);

  if (!store) {
    throw new Error(
      "`useXRSession()` must be used within a `XRSessionProvider` component."
    );
  }

  return useStore(store, selector);
};
