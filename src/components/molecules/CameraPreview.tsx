import type { RefObject } from "react";
import { Badge } from "../atoms/Badge";

type CameraPreviewProps = {
  videoRef: RefObject<HTMLVideoElement | null>;
  canvasRef?: RefObject<HTMLCanvasElement | null>;
  isCameraReady: boolean;
};

export function CameraPreview({
  videoRef,
  canvasRef,
  isCameraReady,
}: CameraPreviewProps) {
  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900 shadow-2xl shadow-slate-950/40">
      <div className="relative aspect-[4/5] w-full bg-slate-950 md:aspect-video xl:aspect-[4/5]">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="absolute inset-0 h-full w-full scale-x-[-1] object-cover"
        />

        {canvasRef ? (
          <canvas
            ref={canvasRef}
            className="pointer-events-none absolute inset-0 h-full w-full scale-x-[-1] object-cover"
          />
        ) : null}

        {!isCameraReady ? (
          <div className="absolute inset-0 grid place-items-center bg-slate-900">
            <div className="px-6 text-center">
              <div className="mx-auto mb-4 grid h-20 w-20 place-items-center rounded-[2rem] border border-white/10 bg-white/5">
                <span className="text-3xl">📷</span>
              </div>

              <p className="text-sm font-bold text-white">Camera Preview</p>

              <p className="mt-2 text-xs leading-6 text-slate-400">
                Klik tombol Start Camera untuk mengaktifkan webcam.
              </p>
            </div>
          </div>
        ) : null}
      </div>

      <div className="absolute left-4 top-4">
        <Badge variant={isCameraReady ? "success" : "warning"}>
          {isCameraReady ? "Camera Active" : "Camera Off"}
        </Badge>
      </div>

      <div className="pointer-events-none absolute inset-0 rounded-[2rem] ring-1 ring-inset ring-white/10" />
    </div>
  );
}
