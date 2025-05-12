import { Quaternion, Vector3 } from "three";
import { useFrame } from "@react-three/fiber";
import { useXRInputSourceEvent } from "@react-three/xr";
import { useHits } from "$stores/hits";
import { usePose } from "$stores/pose";
import { useQuaternion } from "$hooks/quaternion";
import { useLabels } from "$demos/house/stores/labels";
// Types
import type { FC } from "react";

const companies = [
  { name: "Apple", marketCap: 2700, revenue: 387, profit: 100, color: "#1f77b4" },
  { name: "Microsoft", marketCap: 2400, revenue: 230, profit: 80, color: "#2ca02c" },
  { name: "Amazon", marketCap: 1700, revenue: 514, profit: 30, color: "#ff7f0e" },
  { name: "NVIDIA", marketCap: 1500, revenue: 60, profit: 28, color: "#d62728" },
  { name: "Tesla", marketCap: 800, revenue: 95, profit: 13, color: "#9467bd" },
];



export const MarketCap: FC = () => {
  const hits = useHits((state) => state.hits);
  const pose = usePose((state) => state.pose);
    const isLabelVisible = useLabels((state) => state.isVisible);
    const setOrigin = useLabels((state) => state.setOrigin);

  
  const setPose = usePose((state) => state.setPose);
  const quaternion = useQuaternion();

  useFrame(({ camera }) => {
    if (!pose || !isLabelVisible) {
      return;
    }

    camera.updateMatrixWorld(true);
    setOrigin(pose.position.clone().project(camera));
  });

  // 🟢 Place model at touch (same logic as House)
  useXRInputSourceEvent(
    "all",
    "select",
    (event) => {
      if (pose) return;

      const hit = hits[event.inputSource.handedness];
      if (!hit) return;

      const position = new Vector3();
      const rotation = new Quaternion();

      hit.decompose(position, rotation, new Vector3());

      setPose({ position, quaternion: rotation });
    },
    [pose, hits]
  );

  // 🔴 Don't render anything if not placed yet
  if (!pose) return null;
  return (
    <group position={pose.position} quaternion={quaternion} scale={[0.4, 0.4, 0.4]}>
      {companies.map((company, i) => {
        const height = Math.max(company.marketCap / 1000, 0);
        const width = Math.max(company.revenue / 500, 0);
        const depth = Math.max(company.profit / 50, 0);
  
        const spacing = 1;
        const xOffset = (i - companies.length / 2) * spacing;
  
        return (
          <group key={company.name} position={[xOffset, 0, 0]}>
            <mesh position={[0, height / 2, 0]}>
              <boxGeometry args={[width, height, depth]} />
              <meshStandardMaterial color={company.color} />
            </mesh>
          </group>
        );
      })}
    </group>)
};
