import React, { useRef, useEffect, useState, useCallback } from "react";
import { useColor } from "../context/colorContext";
import eraserCursor from "@/assets/crosshairs/eraser-big.png";
import pencilCursor from "@/assets/crosshairs/pencil-big.png";
import "../styles/canvas.css";
import { usePredictions } from "../context/predictionContext";
import { debounce } from "lodash";


const Canvas = ({ ...props }) => {
  const { selectedColor } = useColor();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isErasing, setIsErasing] = useState(false);
  const { predictions, setPredictions } = usePredictions();
  const [lastPos, setLastPos] = useState<{x: number, y: number} | null>(null);

  // Initial setup effect - runs once
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) return;

    canvas.width = 500;
    canvas.height = 500;

    // Clear canvas with black background
    context.fillStyle = "#000";
    context.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  // Add eraser toggle effect
  useEffect(() => {
    const toggleEraser = () => setIsErasing((prev) => !prev);
    document.addEventListener("canvas-toggle-eraser", toggleEraser);
    return () =>
      document.removeEventListener("canvas-toggle-eraser", toggleEraser);
  }, []);

  // Handle drawing settings
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) return;

    context.strokeStyle = isErasing ? "#000" : selectedColor;
    context.lineWidth = isErasing ? 20 : 10;
    context.lineCap = "round";
    context.lineJoin = "round";
  }, [selectedColor, isErasing]);

  const sendCanvasData = useCallback(
    debounce(async (canvas: HTMLCanvasElement) => {
      const context = canvas.getContext("2d", { willReadFrequently: true });
      if (!context) return;

      // Get the raw image data
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = Array.from(imageData.data);

      try {
        const response = await fetch("http://127.0.0.1:5000/predict", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            pixels: pixels,
            width: canvas.width,
            height: canvas.height,
            predictions: predictions
          }),
        });

        const result = await response.json();
        if (result.predictions) {
          setPredictions(result.predictions);
        }
      } catch (error) {
        console.error("Failed to get predictions:", error);
        // Fallback to mock predictions
        const mockPredictions = predictions
          .map((p) => ({
            ...p,
            percentage: Math.random() * 100,
          }))
          .sort((a, b) => b.percentage - a.percentage);
        setPredictions(mockPredictions);
      }
    }, 100),
    [predictions, setPredictions]
  );

  // Clean up debounce on unmount
  useEffect(() => {
    return () => {
      sendCanvasData.cancel();
    };
  }, [sendCanvasData]);

  const startDrawing = (e: React.MouseEvent) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) return;

    // Start a new path when we begin drawing
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);
    
    context.beginPath();
    context.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) return;
  
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);
  
    context.beginPath();
    context.moveTo(lastPos?.x || x, lastPos?.y || y);
    context.lineTo(x, y);
    context.stroke();
  
    setLastPos({ x, y });
    sendCanvasData(canvas);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    setLastPos(null);
    // Close the path when we stop drawing
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) return;
    context.closePath();
  };

  return (
    <canvas
      ref={canvasRef}
      onMouseDown={startDrawing}
      onMouseMove={draw}
      onMouseUp={stopDrawing}
      onMouseOut={stopDrawing}
      className="canvas"
      style={{
        borderRadius: ".25rem",
        cursor: isErasing
          ? `url('${eraserCursor}') 0 32, crosshair`
          : `url('${pencilCursor}') 0 32, crosshair`,
      }}
      {...props}
    />
  );
};

export default Canvas;
