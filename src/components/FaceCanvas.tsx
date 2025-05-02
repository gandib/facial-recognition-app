import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

const FaceCanvas: React.FC = () => {
  const faces = useSelector((state: RootState) => state.face.faces);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  console.log(faces);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    faces.forEach(({ age, gender, expressions, box }) => {
      ctx.strokeStyle = "lime";
      ctx.lineWidth = 2;
      ctx.strokeRect(box.x, box.y, box.width, box.height);

      ctx.font = "16px Arial";
      ctx.fillStyle = "yellow";
      const emotion = Object.entries(expressions).sort(
        (a, b) => b[1] - a[1]
      )[0][0];
      ctx.fillText(
        `Age: ${age.toFixed(1)}, Gender: ${gender}, Emotion: ${emotion}`,
        box.x,
        box.y - 10
      );
    });
  }, [faces]);

  return (
    <canvas
      ref={canvasRef}
      width="640"
      height="480"
      className="position-absolute top-0 start-0"
    />
  );
};

export default FaceCanvas;
