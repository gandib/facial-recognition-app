import React, { useEffect, useState } from "react";
import { Provider, useDispatch } from "react-redux";
import { store } from "./redux/store";
import WebcamFeed from "./components/WebcamFeed";
import FaceCanvas from "./components/FaceCanvas";
import { detectFaces, loadModels } from "./redux/features/face/faceAPI";
import { setFaces } from "./redux/features/face/faceSlice";
import ImageUploadRecognizer from "./components/ImageUploadRecognizer";
import FaceDetectionHub from "./components/FaceDetectionHub";

const AppWrapper: React.FC = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

const App: React.FC = () => {
  const dispatch = useDispatch();
  const [mode, setMode] = useState<"webcam" | "upload">("webcam");

  useEffect(() => {
    const setup = async () => {
      await loadModels();
      const interval = setInterval(async () => {
        const video = document.querySelector("video");
        if (video && !video.paused && !video.ended) {
          const results = await detectFaces(video);
          dispatch(setFaces(results));
        }
      }, 1000);

      return () => clearInterval(interval);
    };

    setup();
  }, [dispatch]);

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Facial Recognition Web App</h2>

      {/* Mode switch buttons */}
      <FaceDetectionHub mode={mode} setMode={setMode} />

      <div className="row justify-content-center">
        <div className="col-12 col-md-10 col-lg-8 position-relative">
          {/* Video or Image upload */}
          {mode === "webcam" && <WebcamFeed />}
          {mode === "upload" && <ImageUploadRecognizer />}

          {/* Overlay Canvas */}
          <FaceCanvas />
        </div>
      </div>
    </div>
  );
};

export default AppWrapper;
