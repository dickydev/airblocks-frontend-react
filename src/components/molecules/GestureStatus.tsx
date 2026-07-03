import { Badge } from "../atoms/Badge";

type GestureStatusProps = {
  isHandDetected?: boolean;
  isModelReady?: boolean;
  gesture?: string;
};

export function GestureStatus({
  isHandDetected = false,
  isModelReady = false,
  gesture = "Idle",
}: GestureStatusProps) {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-white">Gesture Status</p>
          <p className="mt-1 text-xs text-slate-400">
            Status gesture dari MediaPipe Hand Landmarker.
          </p>
        </div>

        <Badge
          variant={
            !isModelReady ? "neutral" : isHandDetected ? "success" : "warning"
          }
        >
          {!isModelReady
            ? "Model Loading"
            : isHandDetected
              ? "Hand Detected"
              : "No Hand"}
        </Badge>
      </div>

      <div className="rounded-2xl bg-slate-900/80 p-4">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
          Current Gesture
        </p>
        <p className="mt-2 text-2xl font-black text-cyan-300">{gesture}</p>
      </div>
    </div>
  );
}
