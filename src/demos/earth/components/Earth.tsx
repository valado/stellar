import { useEffect, useRef } from "react";
import {
  Vector3,
  Quaternion,
  MeshBasicMaterial,
  Mesh,
  BoxGeometry,
  MathUtils,
} from "three";
import { useThree } from "@react-three/fiber";
import { useXRInputSourceEvent } from "@react-three/xr";
import { useTexture } from "@react-three/drei";
import { useQuaternion } from "$hooks/use-quaternion";
import { useHits } from "$stores/hits";
import { usePose } from "$stores/pose";

// Types
import type { FC } from "react";

const INITIAL_QUATERNION = new Quaternion(0, 0, 0);

const RADIUS = 0.5;

const toSpherical = (lat: number, lon: number) =>
  [
    MathUtils.degToRad(90 - lat), // Phi
    MathUtils.degToRad(lon), // Theta
  ] as const;

const points: number[][] = [
  [48.13743, 11.57549], // München, Deutschland
  [48.856614, 2.3522219], // Paris, Frankreich
  [40.71427, -74.00597], // New York City, USA
  [-33.86785, 151.20732], // Sydney, Australia
];

export const Earth: FC = () => {
  const hits = useHits((state) => state.hits);
  const pose = usePose((state) => state.pose);
  const setPose = usePose((state) => state.setPose);

  const pointMeshesRef = useRef<Mesh[]>([]);

  const { scene } = useThree();

  const quaternion = useQuaternion(pose?.quaternion || INITIAL_QUATERNION);

  const [albedo, bump] = useTexture([
    "/textures/earth_albedo.jpg",
    "/textures/earth_bump.png",
  ]);

  useEffect(() => {
    if (!pose) {
      return;
    }

    pointMeshesRef.current.forEach((mesh) => scene.remove(mesh));
    pointMeshesRef.current = [];

    for (const [lat, lon] of points) {
      const box = new Mesh(
        new BoxGeometry(0.005, 0.005, 0.5),
        new MeshBasicMaterial({ color: 0xff0000 }),
      );

      const position = new Vector3()
        .setFromSphericalCoords(RADIUS, ...toSpherical(lat, lon))
        .add(pose.position);

      box.position.copy(position);

      box.lookAt(pose.position);

      pointMeshesRef.current.push(box);

      scene.add(box);
    }

    return () => {
      pointMeshesRef.current.forEach((mesh) => scene.remove(mesh));
      pointMeshesRef.current = [];
    };
  }, [pose, points]);

  useEffect(() => {
    if (!pose || !pointMeshesRef.current.length) {
      return;
    }

    pointMeshesRef.current.forEach((mesh, i) => {
      const [lat, lon] = points[i];

      const position = new Vector3()
        .setFromSphericalCoords(RADIUS, ...toSpherical(lat, lon))
        .applyQuaternion(quaternion)
        .add(pose.position);

      mesh.position.copy(position);
      mesh.lookAt(pose.position);
    });
  }, [pose, points, quaternion]);

  // Logic for placing the Earth model at the selected location.
  useXRInputSourceEvent(
    "all",
    "select",
    (event) => {
      if (pose) {
        return;
      }

      const hit = hits[event.inputSource.handedness];

      if (!hit) {
        return;
      }

      const position = new Vector3();
      const quaternion = new Quaternion();

      hit.decompose(position, quaternion, new Vector3());

      setPose({
        position,
        quaternion,
      });
    },
    [pose, hits],
  );

  if (!pose) {
    return null;
  }

  return (
    <group position={pose.position} rotation={[0, MathUtils.degToRad(-90), 0]}>
      <mesh quaternion={quaternion}>
        <sphereGeometry args={[RADIUS, 40, 40]} />
        <meshStandardMaterial map={albedo} bumpMap={bump} />
      </mesh>
    </group>
  );
};
