import { Scene } from "$components/Scene";
import { Welcome } from "$components/Welcome";

// Types
import type { FC } from "react";

export const App: FC = () => (
  <>
    <Welcome />
    <Scene />
  </>
);
