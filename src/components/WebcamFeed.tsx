import React, { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { setWebcamStatus } from "../redux/features/face/faceSlice";

const WebcamFeed: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const enableWebcam = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
        dispatch(setWebcamStatus(true));
      } catch (err) {
        console.error("Error accessing webcam:", err);
        dispatch(setWebcamStatus(false));
      }
    };
    enableWebcam();
  }, [dispatch]);

  return (
    <div className="position-relative">
      <video ref={videoRef} width="640" height="480" className="img-fluid" />
    </div>
  );
};

export default WebcamFeed;
