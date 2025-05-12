import { MathUtils } from "three";
import { useXR } from "@react-three/xr";
import { usePose } from "$stores/pose";

// Components
import { Root, Text, Container } from "@react-three/uikit";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  Defaults,
} from "@react-three/uikit-default";

// Types
import type { FC } from "react";

export const UI: FC = () => {
  const pose = usePose((state) => state.pose);

  const isHandheld = useXR(
    (state) => state.session?.interactionMode === "screen-space",
  );

  if (isHandheld || !pose) {
    return null;
  }

  return (
    <group
      position={[pose.position.x, pose.position.y + 2, pose.position.z - 3]}
      dispose={null}
    >
      <Defaults>
        <Root>
          <Container flexDirection="row" gap={16}>
            <Container flexDirection="column" gap={16}>
              <Card>
                <CardHeader>
                  <CardTitle>
                    <Text>Immobilienwert</Text>
                  </CardTitle>
                  <CardDescription>
                    <Text>2.650.000 Euro</Text>
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>
                    <Text>Zinssatz</Text>
                  </CardTitle>
                  <CardDescription>
                    <Text>2%</Text>
                  </CardDescription>
                </CardHeader>
              </Card>
            </Container>
            <Container flexDirection="column" gap={16}>
              <Card>
                <CardHeader>
                  <CardTitle>
                    <Text>Mtl. Hypothekenzahlung</Text>
                  </CardTitle>
                  <CardDescription>
                    <Text>6.100 Euro</Text>
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>
                    <Text>Laufzeit</Text>
                  </CardTitle>
                  <CardDescription>
                    <Text>30 Jahre</Text>
                  </CardDescription>
                </CardHeader>
              </Card>
            </Container>
            <Container flexDirection="column" gap={16}>
              <Card>
                <CardHeader>
                  <CardTitle>
                    <Text>Lage</Text>
                  </CardTitle>
                  <CardDescription>
                    <Text>München-Grünwald</Text>
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>
                    <Text>Etagen</Text>
                  </CardTitle>
                  <CardDescription>
                    <Text>2</Text>
                  </CardDescription>
                </CardHeader>
              </Card>
            </Container>
            <Container flexDirection="column" gap={16}>
              <Card>
                <CardHeader>
                  <CardTitle>
                    <Text>Grundfläche</Text>
                  </CardTitle>
                  <CardDescription>
                    <Text>200 qm</Text>
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>
                    <Text>Energie-Effizienzklasse</Text>
                  </CardTitle>
                  <CardDescription>
                    <Text>B</Text>
                  </CardDescription>
                </CardHeader>
              </Card>
            </Container>
          </Container>
        </Root>
      </Defaults>
    </group>
  );
};
