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

  if (!pose) {
    return null;
  }

  return (
    <group
      position={[pose.position.x, pose.position.y + 2, pose.position.z - 3]}
      dispose={null}
    >
      <Defaults>
        <Root>
          <Container flexDirection="row" gap={40}>
          <Card maxWidth={380} padding={32} borderRadius={16}>
            <CardHeader>
              <CardTitle>
                <Text>Hypothekdaten</Text>
              </CardTitle>
              <CardDescription>
                <Text>
                Immobilienwert: 2.650.000 Euro 
                </Text>
                <Text>
                Mtl. Hypothekenzahlung: 6.100 Euro 
                </Text>
                <Text>Zinssatz: 2%
                </Text>
                <Text>  
                Laufzeit: 30 Jahre
                </Text>
              </CardDescription>
            </CardHeader>
            
          </Card>
          <Card maxWidth={380} padding={32} borderRadius={16}>
            <CardHeader>
              <CardTitle>
                <Text>Hausinformation</Text>
              </CardTitle>
              <CardDescription>
                <Text>
                Lage: München-Grünwald  
                </Text>
                <Text>
                Grundfläche: 200 qm  
                </Text>
                <Text>
                Etagen: 2  
                </Text>
                <Text>
                Energie-Effizienz: B
                </Text>
              </CardDescription>
            </CardHeader>
            
          </Card>
          </Container>

        </Root>
      </Defaults>
    </group>
  );
};
