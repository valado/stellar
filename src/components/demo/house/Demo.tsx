import { Scene } from "$components/demo/house/Scene";
import { Welcome } from "$components/Welcome";

// Types
import type { FC } from "react";

export const Demo: FC = () => (
  <>
    <Welcome title="AR Immobilien Demo" />
    <Scene />
  </>
);
