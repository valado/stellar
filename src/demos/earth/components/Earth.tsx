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
import { useXR, useXRInputSourceEvent } from "@react-three/xr";
import { useTexture } from "@react-three/drei";
import { useQuaternion } from "$hooks/quaternion";
import { useHits } from "$stores/hits";
import { usePose } from "$stores/pose";

// Types
import type { FC } from "react";
import type { ColorRepresentation } from "three";

type Point = {
  lat: number;
  lon: number;
  fdi: number;
  color?: ColorRepresentation;
};

const RADIUS = 0.5;
const OFFSET_Y = 1;

// (Haupt-)Städte und normalisierte FDI-Werte aus 2023.
// Quelle: https://unctad.org/topic/investment/world-investment-report.
const points: Point[] = (() => {
  const data = [
    {
      // München, Deutschland
      lat: 48.13743,
      lon: 11.57549,
      fdi: 36_697.7,
    },
    {
      // Paris, Frankreich
      lat: 48.856614,
      lon: 2.3522219,
      fdi: 42_031.6,
    },
    {
      // Washington, D.C., United States of America
      lat: 38.89511,
      lon: -77.03637,
      fdi: 310_947,
    },
    {
      // Sydney, Australia
      lat: -33.86785,
      lon: 151.20732,
      fdi: 29_873.9,
    },
    {
      // Beijing, China
      lat: 39.9041999,
      lon: 116.4073963,
      fdi: 163_253.5,
    },
    {
      // Moskau, Russland
      lat: 55.755826,
      lon: 37.6172999,
      fdi: 8_363.5,
    },
    {
      // Neu Delhi, Indien
      lat: 28.6448,
      lon: 77.216721,
      fdi: 28_163.3,
    },
    {
      // Tokyo, Japan
      lat: 35.6761919,
      lon: 139.6503106,
      fdi: 21_433.4,
    },
    {
      // Brasilia, Brasilien
      lat: -15.77972,
      lon: -47.92972,
      fdi: 65_897.2,
    },
    {
      // Toronto, Kanada
      lat: 43.70011,
      lon: -79.4163,
      fdi: 50_324.1,
    },
  ];

  const values = data.map((d) => d.fdi);

  const min = Math.min(...values);
  const max = Math.max(...values);

  return data.map((d) => ({
    ...d,
    fdi: (d.fdi - min) / (max - min),
  }));
})();

const toSpherical = (lat: number, lon: number) =>
  [
    MathUtils.degToRad(90 - lat), // Phi
    MathUtils.degToRad(lon), // Theta
  ] as const;

export const Earth: FC = () => {
  const hits = useHits((state) => state.hits);
  const pose = usePose((state) => state.pose);
  const setPose = usePose((state) => state.setPose);

  const isDraggingRef = useRef(false);
  const pointMeshesRef = useRef<Mesh[]>([]);

  const isHandheld = useXR(
    (state) => state.session?.interactionMode === "screen-space",
  );

  const { scene } = useThree();

  const quaternion = isHandheld
    ? useQuaternion(pose?.quaternion)
    : new Quaternion();

  const [albedoMap, bumpMap] = useTexture([
    "/textures/earth_albedo.jpg",
    "/textures/earth_bump.png",
  ]);

  // Logic for the placement of point markers.
  useEffect(() => {
    if (!pose) {
      return;
    }

    pointMeshesRef.current.forEach((mesh) => scene.remove(mesh));
    pointMeshesRef.current = [];

    for (const { lat, lon, fdi, color = 0xff0000 } of points) {
      const box = new Mesh(
        new BoxGeometry(0.0075, 0.0075, fdi),
        new MeshBasicMaterial({ color }),
      );

      const position = new Vector3()
        .setFromSphericalCoords(RADIUS, ...toSpherical(lat, lon))
        .applyQuaternion(quaternion)
        .add(pose.position)
        .add(new Vector3(0, OFFSET_Y, 0));

      box.position.copy(position);

      box.lookAt(pose.position);

      pointMeshesRef.current.push(box);

      scene.add(box);
    }

    return () => {
      pointMeshesRef.current.forEach((mesh) => scene.remove(mesh));
      pointMeshesRef.current = [];
    };
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
    <group
      position={[pose.position.x, pose.position.y + OFFSET_Y, pose.position.z]}
      rotation={[0, MathUtils.degToRad(-90), 0]}
      onPointerDown={(e) => {
        if (isHandheld || isDraggingRef.current) {
          return;
        }

        isDraggingRef.current = true;

        setPose({
          position: e.point,
          quaternion,
        });
      }}
      onPointerMove={(e) => {
        if (isHandheld || !isDraggingRef.current) {
          return;
        }

        setPose({
          position: e.point,
          quaternion,
        });
      }}
      onPointerUp={() => {
        if (isHandheld) {
          return;
        }

        isDraggingRef.current = false;
      }}
    >
      <mesh quaternion={quaternion}>
        <sphereGeometry args={[RADIUS, 40, 40]} />
        <meshStandardMaterial
          map={albedoMap}
          bumpMap={bumpMap}
          bumpScale={0.15}
        />
      </mesh>
    </group>
  );
};
