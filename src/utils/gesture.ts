import type { GestureName, HandLandmark } from "../types/gesture";

export function getDistance(pointA: HandLandmark, pointB: HandLandmark) {
  const dx = pointA.x - pointB.x;
  const dy = pointA.y - pointB.y;
  const dz = (pointA.z ?? 0) - (pointB.z ?? 0);

  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

function isFingerExtended(
  landmarks: HandLandmark[],
  tipIndex: number,
  pipIndex: number,
) {
  const tip = landmarks[tipIndex];
  const pip = landmarks[pipIndex];

  if (!tip || !pip) return false;

  /**
   * Pada normalized coordinate MediaPipe:
   * y semakin kecil berarti posisi semakin ke atas.
   * Jadi tip.y < pip.y artinya jari cenderung terbuka/naik.
   */
  return tip.y < pip.y;
}

export function detectGesture(landmarks: HandLandmark[]): GestureName {
  if (!landmarks.length) return "No Hand";

  const thumbTip = landmarks[4];
  const indexTip = landmarks[8];

  if (!thumbTip || !indexTip) return "Hand Detected";

  const pinchDistance = getDistance(thumbTip, indexTip);

  const isIndexOpen = isFingerExtended(landmarks, 8, 6);
  const isMiddleOpen = isFingerExtended(landmarks, 12, 10);
  const isRingOpen = isFingerExtended(landmarks, 16, 14);
  const isPinkyOpen = isFingerExtended(landmarks, 20, 18);

  const openedFingers = [
    isIndexOpen,
    isMiddleOpen,
    isRingOpen,
    isPinkyOpen,
  ].filter(Boolean).length;

  if (pinchDistance < 0.055) {
    return "Pinch";
  }

  if (openedFingers >= 4) {
    return "Open Palm";
  }

  if (isIndexOpen && openedFingers === 1) {
    return "Pointing";
  }

  return "Hand Detected";
}

export function getIndexFingerPosition(landmarks: HandLandmark[]) {
  const indexTip = landmarks[8];

  if (!indexTip) return null;

  return {
    x: indexTip.x,
    y: indexTip.y,
  };
}
