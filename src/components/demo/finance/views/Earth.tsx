import { useEffect, useRef, useState } from "react";
import { Vector3, Quaternion, MathUtils } from "three";
import { useFrame } from "@react-three/fiber";
import { useXRInputSourceEvent } from "@react-three/xr";
import * as THREE from "three"


// Components
import { Gltf } from "@react-three/drei";

// Stores
import { useHits } from "$stores/hits";
import { usePose } from "$stores/pose";
import { useLabelOrigin } from "$stores/label-origin";

// Types
import type { FC } from "react";

const INITIAL_SCALE = new Vector3(1.2, 1.2, 1.2);

export const Earth: FC = () => {
  const [isPlaced, setIsPlaced] = useState(false);

  const hits = useHits((state) => state.hits);
  const pose = usePose((state) => state.pose);
  const setPose = usePose((state) => state.setPose);
  const isPoseSet = usePose((state) => state.isPoseSet);
  const setLabelOrigin = useLabelOrigin((state) => state.setLabelOrigin);
  const [scale, setScale] = useState(INITIAL_SCALE);
  const initialTouchDistanceRef = useRef<number | null>(null);
  const initialScaleRef = useRef<Vector3 | null>(null);
  const isDragging = useRef(false);
  const lastTouch = useRef<{ x: number; y: number } | null>(null);
  const cameraRef = useRef<THREE.Camera | null>(null);
  const [autoAnimate, setAutoAnimate] = useState(true);
  const earthGroupRef = useRef<THREE.Group>(null); // Add this for controlling transform



  
  // Logic for placing the house model at the selected location.
  
  useEffect(() => {

    
    const handleTap = () => {
      if (isPlaced || pose || !cameraRef.current) return;
    
      const camera = cameraRef.current;
    
      const position = new Vector3(0, 0, -1.5);
      position.applyMatrix4(camera.matrixWorld);
    
      const quaternion = camera.quaternion.clone();
    
      setPose({ position, quaternion });
      setIsPlaced(true);
    };
    
  

    const getTouchDistance = (touches: TouchList) => {
      const dx = touches[0].clientX - touches[1].clientX;
      const dy = touches[0].clientY - touches[1].clientY;
      return Math.sqrt(dx * dx + dy * dy);
    };
  
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging.current = true;
        lastTouch.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
        };
      }
    };
  
    const onTouchMove = (e: TouchEvent) => {
      if (!pose) return;
  
      if (e.touches.length === 2) {
        setAutoAnimate(false); // Stops auto float/rotation

        // Pinch to scale
        const distance = getTouchDistance(e.touches);
        if (initialTouchDistanceRef.current === null) {
          initialTouchDistanceRef.current = distance;
          initialScaleRef.current = scale.clone();
          return;
        }
  
        const factor = distance / initialTouchDistanceRef.current;
        const base = initialScaleRef.current!;
        const next = base.clone().multiplyScalar(factor);
  
        const clamped = new Vector3(
          MathUtils.clamp(next.x, 0.1, 5),
          MathUtils.clamp(next.y, 0.1, 5),
          MathUtils.clamp(next.z, 0.1, 5)
        );
  
        setScale(clamped);
      }
  
      if (e.touches.length === 1 && isDragging.current) {
        setAutoAnimate(false); // Stops auto float/rotation

        const { clientX, clientY } = e.touches[0];
        const last = lastTouch.current;
  
        if (last) {
          const deltaX = clientX - last.x;
          const deltaY = clientY - last.y;
  
          const rotSpeed = -0.005;
          const qX = new Quaternion().setFromAxisAngle(
            new Vector3(0, 1, 0), // Y-axis (horizontal drag)
            -deltaX * rotSpeed
          );
          const qY = new Quaternion().setFromAxisAngle(
            new Vector3(1, 0, 0), // X-axis (vertical drag)
            -deltaY * rotSpeed
          );
  
          const newQuat = pose.quaternion.clone().multiply(qX).multiply(qY);
          setPose({ ...pose, quaternion: newQuat });
        }
  
        lastTouch.current = { x: clientX, y: clientY };
      }
    };
  
    const onTouchEnd = () => {
      initialTouchDistanceRef.current = null;
      initialScaleRef.current = null;
      lastTouch.current = null;
      isDragging.current = false;
    };
  
    window.addEventListener("touchstart", onTouchStart, { passive: false });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd);
    window.addEventListener("touchcancel", onTouchEnd);
    window.addEventListener("click", handleTap);
  
    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchcancel", onTouchEnd);
      window.removeEventListener("click", handleTap);
    };
  }, [isPlaced, pose, scale, setPose]);
  
  useFrame((state) => {
    cameraRef.current = state.camera;
  
    if (pose) {
      state.camera.updateMatrixWorld(true);
      setLabelOrigin(pose.position.clone().project(state.camera));
    }
  });

  useFrame((_, delta) => {
    if (!autoAnimate || !earthGroupRef.current) return;
  
    const t = performance.now() * 0.001;
    earthGroupRef.current.position.y = pose!.position.y + Math.sin(t * 0.5) * 0.05;
    earthGroupRef.current.rotation.y += delta * 0.1;
  });
  

  return pose ? (
    <group
      {...pose}
      ref={earthGroupRef} // 👈 here!
      scale={scale}
      rotation={[0, -Math.PI / 2, 0]}
      dispose={null}
    >
      <Gltf src="/models/world.glb" />
    </group>
  ) : null;
};
