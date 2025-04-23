import { FC } from "react";
import { useFrame } from "@react-three/fiber";
import { useLabelOriginStore } from "../../stores/labelOrigin";
import { usePoseStore } from "../../stores/pose";

export const Projector: FC = () => {
  const position = usePoseStore((state) => state.pose.position);
  const setOrigin = useLabelOriginStore((state) => state.setOrigin);

  useFrame(({ camera }) => {
    camera.updateMatrixWorld(true);
    setOrigin(position.clone().project(camera));
  });

  return null;
};
