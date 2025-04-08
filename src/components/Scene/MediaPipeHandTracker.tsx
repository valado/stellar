// File: MediaPipeHandTracker.tsx
import { useEffect } from "react";
import { Hands } from "@mediapipe/hands";
import { Camera } from "@mediapipe/camera_utils";

interface Props {
  onHandMove: (coords: [number, number]) => void;
}

export const MediaPipeHandTracker: React.FC<Props> = ({ onHandMove }) => {
  useEffect(() => {
    const videoElement = document.createElement("video");
    videoElement.style.display = "none";
    document.body.appendChild(videoElement);

    const hands = new Hands({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
    });

    hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.5,
    });

    hands.onResults((results) => {
      const landmarks = results.multiHandLandmarks?.[0];
      if (landmarks) {
        const indexTip = landmarks[8];
        // Normalize to range [-1, 1]
        const x = (indexTip.x - 0.5) * 2;
        const y = -(indexTip.y - 0.5) * 2;
        onHandMove([x, y]);
      }
    });

    const camera = new Camera(videoElement, {
      onFrame: async () => {
        await hands.send({ image: videoElement });
      },
      width: 640,
      height: 480,
    });

    camera.start();

    return () => {
      camera.stop();
      document.body.removeChild(videoElement);
    };
  }, [onHandMove]);

  return null;
};
