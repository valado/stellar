import { Root, Text } from "@react-three/uikit";
import { Button, Card, Defaults } from "@react-three/uikit-apfel";

// Types
import type { FC } from "react";
import { useCashMultiplier } from "../stores/cash-multiplier";
import { usePose } from "$stores/pose";

const AMOUNT_OF_CASH = 10_000;

const { format: formatNumber } = new Intl.NumberFormat("de-DE");

export const UI: FC = () => {
  const pose = usePose((state) => state.pose);
  const cashMultiplier = useCashMultiplier((state) => state.cashMultiplier);

  const incrementCashMultiplier = useCashMultiplier(
    (state) => state.incrementCashMultiplier
  );

  const decrementCashMultiplier = useCashMultiplier(
    (state) => state.decrementCashMultiplier
  );

  if (!pose) {
    return null;
  }

  return (
    <group
      quaternion={pose.quaternion}
      position={[pose.position.x, pose.position.y + 1, pose.position.z - 3]}
    >
      <Defaults>
        <Root>
          <Card flexDirection="column" borderRadius={32} padding={16}>
            <Text>{formatNumber(AMOUNT_OF_CASH * cashMultiplier)}</Text>
            <Button onClick={incrementCashMultiplier}>
              <Text>+ {formatNumber(AMOUNT_OF_CASH)}</Text>
            </Button>
            <Button onClick={decrementCashMultiplier}>
              <Text>- {formatNumber(AMOUNT_OF_CASH)}</Text>
            </Button>
          </Card>
        </Root>
      </Defaults>
    </group>
  );
};
