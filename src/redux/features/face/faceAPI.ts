import * as faceapi from "face-api.js";
import { FaceData } from "./faceSlice";

let modelsLoaded = false;

export const loadModels = async () => {
  if (modelsLoaded) return;
  const MODEL_URL = "/models";

  await Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
    faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
    faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
    faceapi.nets.ageGenderNet.loadFromUri(MODEL_URL),
    faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
  ]);

  modelsLoaded = true;
};

export const detectFaces = async (
  video: HTMLVideoElement
): Promise<FaceData[]> => {
  const detections = await faceapi
    .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
    .withFaceLandmarks()
    .withFaceExpressions()
    .withAgeAndGender();

  return detections.map((d) => ({
    age: d.age,
    gender: d.gender,
    expressions: Object.fromEntries(Object.entries(d.expressions)), // Ensure plain object
    box: {
      x: d.detection.box.x,
      y: d.detection.box.y,
      width: d.detection.box.width,
      height: d.detection.box.height,
    },
  }));
};
