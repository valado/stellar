

// Types
import type { FC } from "react";
type Company = {
  name: string;
  marketCap: number; // e.g., in billions
  revenue: number;   // e.g., in billions
  color: string;     // main color (green/red)
};

const companies: Company[] = [
  {
    name: "Firma A",
    marketCap: 400,
    revenue: 250,
    color: "green",
  },
  {
    name: "Firma B",
    marketCap: 220,
    revenue: 300,
    color: "red",
  },
];

const Bar: FC<{ height: number; color: string; position: [number, number, number] }> = ({
  height,
  color,
  position,
}) => (
  <mesh position={[position[0], height / 2, position[2]]}>
    <boxGeometry args={[0.3, height, 0.3]} />
    <meshStandardMaterial color={color} />
  </mesh>
);

export const MarketCap: FC = () => {
  return (
    <group position={[-1, 0, 0]}>
      {companies.map((company, index) => {
        const baseX = index * 1.5;

        return (
          <group key={company.name} position={[baseX, 0, 0]}>
            {/* Market Cap Bar */}
            <Bar
              height={company.marketCap / 100} // scaled down
              color={company.color}
              position={[0, 0, 0]}
            />

            {/* Revenue Bar */}
            <Bar
              height={company.revenue / 100}
              color={"blue"}
              position={[0.5, 0, 0]}
            />
          </group>
        );
      })}
    </group>
  );
};
