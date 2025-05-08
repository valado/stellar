import { usePose } from "$stores/pose";
import { useSelection } from "$demos/candlesticks/stores/selection";

// Components
import { Container, Root, Text } from "@react-three/uikit";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Defaults,
  Label,
  Switch,
} from "@react-three/uikit-default";

// Types
import type { FC } from "react";

type Stock = {
  company: string;
  symbol: string;
};

const stocks: Stock[] = [
  {
    company: "Apple, Inc.",
    symbol: "AAPL",
  },
  {
    company: "Microsoft, Inc.",
    symbol: "MSFT",
  },
  {
    company: "Meta, Inc.",
    symbol: "META",
  },
];

export const UI: FC = () => {
  const pose = usePose((state) => state.pose);
  const selection = useSelection((state) => state.selection);
  const setSelection = useSelection((state) => state.setSelection);

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
          <Card maxWidth={380} padding={32} borderRadius={16}>
            <CardHeader>
              <CardTitle>
                <Text>Aktien</Text>
              </CardTitle>
              <CardDescription>
                <Text>
                  Wähle eine Option: Verwende die Schalter unten, um eine der
                  Aktien zu wählen.
                </Text>
              </CardDescription>
            </CardHeader>
            <CardContent flexDirection="column" gap={16}>
              {stocks.map(({ symbol, company }, i) => (
                <Container
                  key={i}
                  flexDirection="row"
                  justifyContent="space-between"
                  alignItems="center"
                  gap={16}
                >
                  <Label>
                    <Text>
                      {symbol} ({company})
                    </Text>
                  </Label>
                  <Switch
                    checked={symbol === selection}
                    onCheckedChange={() => setSelection(symbol)}
                  />
                </Container>
              ))}
            </CardContent>
          </Card>
        </Root>
      </Defaults>
    </group>
  );
};
