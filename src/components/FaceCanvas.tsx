import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

const FaceCanvas: React.FC = () => {
  const faces = useSelector((state: RootState) => state.face.faces);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const video = document.querySelector("video") as HTMLVideoElement;
    if (!canvas || !video) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Sync canvas size with video dimensions
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    faces.forEach(({ age, gender, expressions, box }) => {
      ctx.strokeStyle = "lime";
      ctx.lineWidth = 2;
      ctx.strokeRect(box.x, box.y, box.width, box.height);

      ctx.font = "20px Arial";
      const emotion = Object.entries(expressions).sort(
        (a, b) => b[1] - a[1]
      )[0][0];
      const label = `Age: ${age.toFixed(
        1
      )}, Gender: ${gender}, Emotion: ${emotion}`;

      const textWidth = ctx.measureText(label).width;
      const textHeight = 16;
      const padding = 4;

      ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
      ctx.fillRect(
        box.x - padding,
        box.y - textHeight - padding,
        textWidth + padding * 2,
        textHeight + padding * 2
      );

      ctx.fillStyle = "yellow";
      ctx.fillText(label, box.x, box.y - 10);
    });
  }, [faces]);

  return (
    <canvas
      ref={canvasRef}
      className="position-absolute top-0 start-0"
      style={{
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
    />
  );
};

export default FaceCanvas;
