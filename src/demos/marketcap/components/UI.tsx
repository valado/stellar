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

const companies = [
  { name: "Apple", marketCap: 2700, revenue: 387, profit: 100, color: "#1f77b4" },
  { name: "Microsoft", marketCap: 2400, revenue: 230, profit: 80, color: "#2ca02c" },
  { name: "Amazon", marketCap: 1700, revenue: 514, profit: 30, color: "#ff7f0e" },
  { name: "NVIDIA", marketCap: 1500, revenue: 60, profit: 28, color: "#d62728" },
  { name: "Tesla", marketCap: 800, revenue: 95, profit: 13, color: "#9467bd" },
];



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
        <Container flexDirection="row" gap={20}>
      {companies.map((company) => (
        <Card key={company.name} maxWidth={240} padding={32} borderRadius={16}>
          <CardHeader>
            <CardTitle>
              <Text >{company.name}</Text>
            </CardTitle>
            <CardDescription>
              <Text>Marktkapitalisierung(Höhe): ${company.marketCap} Mrd.</Text>
              <Text>Umsatz(Breite): ${company.revenue} Mrd.</Text>
              <Text>Gewinn(Tiefe): ${company.profit} Mrd.</Text>
            </CardDescription>
          </CardHeader>
        </Card>
      ))}
    </Container>


        </Root>
      </Defaults>
    </group>
  );
};
