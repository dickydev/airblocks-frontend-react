import { useCallback, useEffect, useRef, useState } from "react";
import { FilesetResolver, HandLandmarker } from "@mediapipe/tasks-vision";
import type { GestureName, HandLandmark } from "../types/gesture";
import { detectGesture } from "../utils/gesture";

type UseHandTrackingOptions = {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  isEnabled: boolean;
};

const MODEL_URL =
  "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task";

const WASM_URL =
  "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm";

export function useHandTracking({
  videoRef,
  isEnabled,
}: UseHandTrackingOptions) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const handLandmarkerRef = useRef<HandLandmarker | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastVideoTimeRef = useRef<number>(-1);

  const [isModelReady, setIsModelReady] = useState(false);
  const [isHandDetected, setIsHandDetected] = useState(false);
  const [gesture, setGesture] = useState<GestureName>("Idle");
  const [landmarks, setLandmarks] = useState<HandLandmark[]>([]);
  const [error, setError] = useState<string | null>(null);

  const drawLandmarks = useCallback(
    (currentLandmarks: HandLandmark[]) => {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      if (!video || !canvas) return;

      const width = video.videoWidth;
      const height = video.videoHeight;

      if (!width || !height) return;

      canvas.width = width;
      canvas.height = height;

      const context = canvas.getContext("2d");

      if (!context) return;

      context.clearRect(0, 0, width, height);

      if (!currentLandmarks.length) return;

      context.lineWidth = 4;
      context.strokeStyle = "#22d3ee";
      context.fillStyle = "#67e8f9";

      const connections = [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 4],

        [0, 5],
        [5, 6],
        [6, 7],
        [7, 8],

        [0, 9],
        [9, 10],
        [10, 11],
        [11, 12],

        [0, 13],
        [13, 14],
        [14, 15],
        [15, 16],

        [0, 17],
        [17, 18],
        [18, 19],
        [19, 20],

        [5, 9],
        [9, 13],
        [13, 17],
      ];

      for (const [startIndex, endIndex] of connections) {
        const start = currentLandmarks[startIndex];
        const end = currentLandmarks[endIndex];

        if (!start || !end) continue;

        context.beginPath();
        context.moveTo(start.x * width, start.y * height);
        context.lineTo(end.x * width, end.y * height);
        context.stroke();
      }

      currentLandmarks.forEach((landmark, index) => {
        const x = landmark.x * width;
        const y = landmark.y * height;

        context.beginPath();

        if (index === 8) {
          context.fillStyle = "#facc15";
          context.arc(x, y, 9, 0, Math.PI * 2);
        } else if (index === 4) {
          context.fillStyle = "#fb7185";
          context.arc(x, y, 9, 0, Math.PI * 2);
        } else {
          context.fillStyle = "#67e8f9";
          context.arc(x, y, 5, 0, Math.PI * 2);
        }

        context.fill();
      });
    },
    [videoRef],
  );

  const loadModel = useCallback(async () => {
    if (handLandmarkerRef.current) return;

    try {
      setError(null);
      setGesture("Loading Model");

      const vision = await FilesetResolver.forVisionTasks(WASM_URL);

      const handLandmarker = await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: MODEL_URL,
          delegate: "GPU",
        },
        runningMode: "VIDEO",
        numHands: 1,
      });

      handLandmarkerRef.current = handLandmarker;
      setIsModelReady(true);
      setGesture("No Hand");
    } catch (err) {
      console.error("Failed to load hand tracking model:", err);

      setIsModelReady(false);
      setError("Gagal memuat model hand tracking MediaPipe.");
      setGesture("Idle");
    }
  }, []);

  const detectLoop = useCallback(() => {
    const video = videoRef.current;
    const handLandmarker = handLandmarkerRef.current;

    if (!video || !handLandmarker || !isEnabled) {
      return;
    }

    if (video.readyState >= 2) {
      const nowInMs = performance.now();

      if (video.currentTime !== lastVideoTimeRef.current) {
        lastVideoTimeRef.current = video.currentTime;

        const result = handLandmarker.detectForVideo(video, nowInMs);

        const firstHandLandmarks = result.landmarks?.[0] ?? [];

        const normalizedLandmarks: HandLandmark[] = firstHandLandmarks.map(
          (landmark) => ({
            x: landmark.x,
            y: landmark.y,
            z: landmark.z,
          }),
        );

        const detected = normalizedLandmarks.length > 0;
        const currentGesture = detected
          ? detectGesture(normalizedLandmarks)
          : "No Hand";

        setIsHandDetected(detected);
        setLandmarks(normalizedLandmarks);
        setGesture(currentGesture);

        drawLandmarks(normalizedLandmarks);
      }
    }

    animationFrameRef.current = window.requestAnimationFrame(detectLoop);
  }, [drawLandmarks, isEnabled, videoRef]);

  useEffect(() => {
    if (!isEnabled) {
      setIsHandDetected(false);
      setLandmarks([]);
      setGesture("Idle");

      const canvas = canvasRef.current;
      const context = canvas?.getContext("2d");

      if (canvas && context) {
        context.clearRect(0, 0, canvas.width, canvas.height);
      }

      if (animationFrameRef.current) {
        window.cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }

      return;
    }

    let isMounted = true;

    async function startTracking() {
      await loadModel();

      if (!isMounted) return;

      animationFrameRef.current = window.requestAnimationFrame(detectLoop);
    }

    startTracking();

    return () => {
      isMounted = false;

      if (animationFrameRef.current) {
        window.cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [detectLoop, isEnabled, loadModel]);

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        window.cancelAnimationFrame(animationFrameRef.current);
      }

      handLandmarkerRef.current?.close();
      handLandmarkerRef.current = null;
    };
  }, []);

  return {
    canvasRef,
    isModelReady,
    isHandDetected,
    gesture,
    landmarks,
    error,
  };
}
