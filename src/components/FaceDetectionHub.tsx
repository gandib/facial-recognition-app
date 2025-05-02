const FaceDetectionHub = ({
  mode,
  setMode,
}: {
  mode: string;
  setMode: React.Dispatch<React.SetStateAction<"webcam" | "upload">>;
}) => {
  return (
    <div className="p-4 ">
      <div className="d-flex gap-3 mb-4">
        <button
          className={`btn ${
            mode === "webcam" ? "btn-primary" : "btn-outline-primary"
          }`}
          onClick={() => setMode("webcam")}
        >
          Webcam Mode
        </button>
        <button
          className={`btn ${
            mode === "upload" ? "btn-primary" : "btn-outline-primary"
          }`}
          onClick={() => setMode("upload")}
        >
          Upload Image
        </button>
      </div>
    </div>
  );
};

export default FaceDetectionHub;
