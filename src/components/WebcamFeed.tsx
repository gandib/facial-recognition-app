import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { setWebcamOn } from "../redux/features/face/faceSlice";

const WebcamFeed: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const dispatch = useDispatch();
  const webcamOn = useSelector((state: RootState) => state.face.webcamOn);
  const streamRef = useRef<MediaStream | null>(null);

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      streamRef.current = stream;
      dispatch(setWebcamOn(true));
    } catch (err) {
      console.error("Error accessing webcam:", err);
    }
  };

  const stopWebcam = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.srcObject = null;
    }
    dispatch(setWebcamOn(false));
  };

  useEffect(() => {
    return () => {
      stopWebcam();
    };
  }, []);

  return (
    <div className="position-relative w-100">
      <video ref={videoRef} className="img-fluid rounded border w-100" />
      <div className="mt-2 flex gap-2">
        {!webcamOn ? (
          <button onClick={startWebcam} className="px-4 py-2 btn btn-primary">
            Start Webcam
          </button>
        ) : (
          <button onClick={stopWebcam} className="px-4 py-2 btn btn-secondary">
            Stop Webcam
          </button>
        )}
      </div>
    </div>
  );
};

export default WebcamFeed;
