/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useRef } from "react";
import * as faceapi from "face-api.js";
import { useDispatch } from "react-redux";
import { FaceData, setFaces } from "../redux/features/face/faceSlice";

const ImageUploadRecognizer: React.FC = () => {
  const [imageURL, setImageURL] = useState<string | null>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dispatch = useDispatch();

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setImageURL(url);

    // Wait for image to load before processing
    setTimeout(() => handleFaceDetection(url), 100);
  };

  const handleFaceDetection = async (_url: string) => {
    if (!imageRef.current) return;

    const detections = await faceapi
      .detectAllFaces(imageRef.current, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions()
      .withAgeAndGender();

    const canvas = canvasRef.current;
    if (!canvas || !imageRef.current) return;

    faceapi.matchDimensions(canvas, imageRef.current);
    const resizedDetections = faceapi.resizeResults(detections, {
      width: imageRef.current.width,
      height: imageRef.current.height,
    });

    canvas.getContext("2d")?.clearRect(0, 0, canvas.width, canvas.height);
    faceapi.draw.drawDetections(canvas, resizedDetections);
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);

    const formattedDetections: FaceData[] = detections.map((det) => ({
      age: det.age,
      gender: det.gender,
      expressions: Object.fromEntries(
        Object.entries(det.expressions)
      ) as Record<string, number>,
      box: det.detection.box,
    }));

    dispatch(setFaces(formattedDetections));
  };

  return (
    <div className="my-4 flex flex-col items-center">
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="mb-4"
      />
      {imageURL && (
        <div className="position-relative w-100">
          <img
            ref={imageRef}
            src={imageURL}
            alt="Uploaded"
            onLoad={() => handleFaceDetection(imageURL)}
            className="img-fluid w-100 rounded shadow"
          />
          <canvas
            ref={canvasRef}
            className="position-absolute top-0 start-0 w-100 h-100"
            style={{ pointerEvents: "none" }}
          />
        </div>
      )}
    </div>
  );
};

export default ImageUploadRecognizer;
