import { useCallback, useEffect, useRef, useState } from "react";

export function useWebcam() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [isCameraReady, setIsCameraReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startCamera = useCallback(async () => {
    try {
      setError(null);

      if (!navigator.mediaDevices?.getUserMedia) {
        setError("Browser Anda belum mendukung akses kamera.");
        return;
      }

      if (streamRef.current) {
        setIsCameraReady(true);
        return;
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      streamRef.current = mediaStream;

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play();
      }

      setIsCameraReady(true);
    } catch (err) {
      console.error("Camera error:", err);

      setIsCameraReady(false);
      setError(
        "Kamera tidak dapat diakses. Pastikan permission kamera sudah diberikan.",
      );
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setIsCameraReady(false);
  }, []);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };
  }, []);

  return {
    videoRef,
    isCameraReady,
    error,
    startCamera,
    stopCamera,
  };
}
