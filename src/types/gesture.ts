export type HandLandmark = {
  x: number;
  y: number;
  z?: number;
};

export type GestureName =
  | "Idle"
  | "Loading Model"
  | "No Hand"
  | "Hand Detected"
  | "Pointing"
  | "Pinch"
  | "Open Palm"
  | "Swipe Left"
  | "Swipe Right"
  | "Swipe Up"
  | "Swipe Down"
  | "Zoom In"
  | "Zoom Out";

export type FingerCursor = {
  x: number;
  y: number;
};

export type HandTrackingState = {
  isModelReady: boolean;
  isHandDetected: boolean;
  gesture: GestureName;
  landmarks: HandLandmark[];
};
