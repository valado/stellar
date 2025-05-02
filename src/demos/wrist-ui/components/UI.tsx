import { useExitXR } from "$hooks/xr-session";

// Components
import { Root } from "@react-three/uikit";
import { Button, Card, Defaults } from "@react-three/uikit-apfel";
import { XIcon } from "@react-three/uikit-lucide";

// Types
import type { FC } from "react";

export const UI: FC = () => {
  const exitXR = useExitXR();

  return (
    <group>
      <Defaults>
        <Root>
          <Card borderRadius={32} padding={16}>
            {/* @ts-expect-error: Types don't align perfectly, but it still works. */}
            <Button onClick={exitXR}>
              <XIcon />
            </Button>
          </Card>
        </Root>
      </Defaults>
    </group>
  );
};
