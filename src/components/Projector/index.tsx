import { FC } from "react";
import { useFrame } from "@react-three/fiber";
import { useLabelStore } from "../../stores/label";
import { usePoseStore } from "../../stores/pose";

export const Projector: FC = () => {
  const position = usePoseStore((state) => state.pose.position);
  const setPosition = useLabelStore((state) => state.setPosition);

  useFrame(({ camera }) => {
    camera.updateMatrixWorld(true);
    setPosition(position.clone().project(camera));
  });

  return null;
};
