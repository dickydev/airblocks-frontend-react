import { useEffect, useRef, useState } from "react";
import type { GestureName, HandLandmark } from "../types/gesture";
import { useSceneStore } from "../stores/sceneStore";

type UseSwipeSceneControlsOptions = {
  isEnabled: boolean;
  gesture: GestureName;
  landmarks: HandLandmark[];
};

type SwipeAction = "Swipe Left" | "Swipe Right" | "Swipe Up" | "Swipe Down";

type FingerPoint = {
  x: number;
  y: number;
  time: number;
};

const SWIPE_DISTANCE_THRESHOLD = 0.18;
const SWIPE_MAX_DURATION_MS = 550;
const SWIPE_COOLDOWN_MS = 850;

export function useSwipeSceneControls({
  isEnabled,
  gesture,
  landmarks,
}: UseSwipeSceneControlsOptions) {
  const zoomIn = useSceneStore((state) => state.zoomIn);
  const zoomOut = useSceneStore((state) => state.zoomOut);
  const rotateLeft = useSceneStore((state) => state.rotateLeft);
  const rotateRight = useSceneStore((state) => state.rotateRight);

  const startPointRef = useRef<FingerPoint | null>(null);
  const lastSwipeTimeRef = useRef(0);
  const clearActionTimeoutRef = useRef<number | null>(null);

  const [lastSwipeAction, setLastSwipeAction] = useState<SwipeAction | null>(
    null,
  );

  useEffect(() => {
    if (!isEnabled) {
      startPointRef.current = null;
      setLastSwipeAction(null);
      return;
    }

    if (
      gesture === "Pinch" ||
      gesture === "Open Palm" ||
      gesture === "No Hand"
    ) {
      startPointRef.current = null;
      return;
    }

    const indexFingerTip = landmarks[8];

    if (!indexFingerTip) {
      startPointRef.current = null;
      return;
    }

    /**
     * Karena video tampil mirror, kita balik x supaya arah swipe terasa natural.
     * Kalau arah swipe terasa kebalik, ubah menjadi:
     * const screenX = indexFingerTip.x;
     */
    const screenX = 1 - indexFingerTip.x;
    const screenY = indexFingerTip.y;
    const now = Date.now();

    if (!startPointRef.current) {
      startPointRef.current = {
        x: screenX,
        y: screenY,
        time: now,
      };

      return;
    }

    const startPoint = startPointRef.current;

    const dx = screenX - startPoint.x;
    const dy = screenY - startPoint.y;
    const duration = now - startPoint.time;

    const isCooldownActive = now - lastSwipeTimeRef.current < SWIPE_COOLDOWN_MS;

    if (isCooldownActive) {
      return;
    }

    if (duration > SWIPE_MAX_DURATION_MS) {
      startPointRef.current = {
        x: screenX,
        y: screenY,
        time: now,
      };

      return;
    }

    const absX = Math.abs(dx);
    const absY = Math.abs(dy);

    let detectedAction: SwipeAction | null = null;

    if (absX > SWIPE_DISTANCE_THRESHOLD && absX > absY * 1.3) {
      detectedAction = dx > 0 ? "Swipe Right" : "Swipe Left";
    }

    if (absY > SWIPE_DISTANCE_THRESHOLD && absY > absX * 1.3) {
      detectedAction = dy < 0 ? "Swipe Up" : "Swipe Down";
    }

    if (!detectedAction) return;

    if (detectedAction === "Swipe Left") {
      rotateLeft();
    }

    if (detectedAction === "Swipe Right") {
      rotateRight();
    }

    if (detectedAction === "Swipe Up") {
      zoomIn();
    }

    if (detectedAction === "Swipe Down") {
      zoomOut();
    }

    setLastSwipeAction(detectedAction);
    lastSwipeTimeRef.current = now;

    startPointRef.current = {
      x: screenX,
      y: screenY,
      time: now,
    };

    if (clearActionTimeoutRef.current) {
      window.clearTimeout(clearActionTimeoutRef.current);
    }

    clearActionTimeoutRef.current = window.setTimeout(() => {
      setLastSwipeAction(null);
    }, 900);
  }, [gesture, isEnabled, landmarks, rotateLeft, rotateRight, zoomIn, zoomOut]);

  useEffect(() => {
    return () => {
      if (clearActionTimeoutRef.current) {
        window.clearTimeout(clearActionTimeoutRef.current);
      }
    };
  }, []);

  return {
    lastSwipeAction,
  };
}
