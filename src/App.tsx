import React, { useEffect } from "react";
import { Provider, useDispatch } from "react-redux";
import { store } from "./redux/store";
import WebcamFeed from "./components/WebcamFeed";
import FaceCanvas from "./components/FaceCanvas";
import { detectFaces, loadModels } from "./redux/features/face/faceAPI";
import { setFaces } from "./redux/features/face/faceSlice";

const AppWrapper: React.FC = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

const App: React.FC = () => {
  const dispatch = useDispatch();

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
    <div className="container mt-4 text-center">
      <h2 className="mb-4">Facial Recognition Web App</h2>
      <div className="position-relative d-inline-block">
        <WebcamFeed />
        <FaceCanvas />
      </div>
    </div>
  );
};

export default AppWrapper;
