import type { RefObject } from "react";
import { Button } from "../atoms/Button";
import { CameraPreview } from "../molecules/CameraPreview";

type CameraPanelProps = {
  videoRef: RefObject<HTMLVideoElement | null>;
  canvasRef?: RefObject<HTMLCanvasElement | null>;
  isCameraReady: boolean;
  error: string | null;
  trackingError?: string | null;
  onStartCamera: () => void;
  onStopCamera: () => void;
};

export function CameraPanel({
  videoRef,
  canvasRef,
  isCameraReady,
  error,
  trackingError,
  onStartCamera,
  onStopCamera,
}: CameraPanelProps) {
  return (
    <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-4 shadow-2xl shadow-slate-950/40">
      <div className="mb-4">
        <p className="text-sm font-bold text-white">Hand Camera</p>
        <p className="mt-1 text-xs leading-6 text-slate-400">
          Kamera ini dipakai untuk membaca gesture tangan dan posisi jari.
        </p>
      </div>

      <CameraPreview
        videoRef={videoRef}
        canvasRef={canvasRef}
        isCameraReady={isCameraReady}
      />

      {error ? (
        <div className="mt-4 rounded-2xl border border-rose-400/20 bg-rose-400/10 p-4 text-sm leading-6 text-rose-100">
          {error}
        </div>
      ) : null}

      {trackingError ? (
        <div className="mt-4 rounded-2xl border border-yellow-400/20 bg-yellow-400/10 p-4 text-sm leading-6 text-yellow-100">
          {trackingError}
        </div>
      ) : null}

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {!isCameraReady ? (
          <Button onClick={onStartCamera} className="w-full sm:col-span-2">
            Start Camera
          </Button>
        ) : (
          <Button
            onClick={onStopCamera}
            variant="danger"
            className="w-full sm:col-span-2"
          >
            Stop Camera
          </Button>
        )}
      </div>

      <p className="mt-4 text-xs leading-6 text-slate-500">
        Gunakan pencahayaan yang cukup dan arahkan tangan ke area kamera.
      </p>
    </section>
  );
}
