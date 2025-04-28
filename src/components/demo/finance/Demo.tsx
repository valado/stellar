import { Scene } from "$components/demo/finance/Scene";
import { Welcome } from "$components/Welcome";

// Types
import type { FC } from "react";

export const Demo: FC = () => (
  <>
    <Welcome title="AR Finanzdaten Demo" />
    <Scene />
  </>
);
