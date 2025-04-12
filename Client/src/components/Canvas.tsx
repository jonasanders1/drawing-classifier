import React, { useRef, useEffect, useState, useCallback } from "react";
import { useColor } from "../context/colorContext";
import eraserCursor from "@/assets/crosshairs/eraser-big.png";
import pencilCursor from "@/assets/crosshairs/pencil-big.png";
import "../styles/canvas.css";
import { usePredictions } from "../context/predictionContext";
import { debounce } from "lodash";

const API_URL = import.meta.env.VITE_API_URL;

const Canvas = ({ ...props }) => {
  const { selectedColor } = useColor();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isErasing, setIsErasing] = useState(false);
  const { predictions, setPredictions } = usePredictions();
  const [lastPos, setLastPos] = useState<{x: number, y: number} | null>(null);
  const [history, setHistory] = useState<ImageData[]>([]);
  const [currentStep, setCurrentStep] = useState(-1);

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
    
    // Save initial state
    const initialState = context.getImageData(0, 0, canvas.width, canvas.height);
    setHistory([initialState]);
    setCurrentStep(0);
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
        const response = await fetch(`${API_URL}/predict`, {
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
        // console.log(result.predictions);
        if (result.predictions) {
          // Clamp percentages to integers before setting state
          const clampedPredictions = result.predictions.map((pred: { className: string; percentage: number; image: string }) => ({
            ...pred,
            percentage: Math.round(pred.percentage)
          }));
        setPredictions(clampedPredictions);
        }
      } catch (error) {
        console.error("Failed to get predictions:", error);
        // Fallback to mock predictions
        const mockPredictions = predictions
          .map((p) => ({
            ...p,
            percentage: Math.round(Math.random() * 100),
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

  // Add event listeners for undo/redo/save
  useEffect(() => {
    const handleUndo = () => {
      if (currentStep > 0) {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const context = canvas.getContext("2d");
        if (!context) return;

        const newStep = currentStep - 1;
        context.putImageData(history[newStep], 0, 0);
        setCurrentStep(newStep);
      }
    };

    const handleRedo = () => {
      if (currentStep < history.length - 1) {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const context = canvas.getContext("2d");
        if (!context) return;

        const newStep = currentStep + 1;
        context.putImageData(history[newStep], 0, 0);
        setCurrentStep(newStep);
      }
    };

    const handleSave = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      // Create a temporary link element
      const link = document.createElement('a');
      link.download = 'drawing.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    };

    document.addEventListener('canvas-undo', handleUndo);
    document.addEventListener('canvas-redo', handleRedo);
    document.addEventListener('canvas-save', handleSave);

    return () => {
      document.removeEventListener('canvas-undo', handleUndo);
      document.removeEventListener('canvas-redo', handleRedo);
      document.removeEventListener('canvas-save', handleSave);
    };
  }, [currentStep, history]);

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

  // Add saveState function to store canvas state
  const saveState = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const currentState = context.getImageData(0, 0, canvas.width, canvas.height);
    const newHistory = history.slice(0, currentStep + 1);
    setHistory([...newHistory, currentState]);
    setCurrentStep(currentStep + 1);
  };

  // Modify stopDrawing to save state
  const stopDrawing = () => {
    if (isDrawing) {
      saveState();
    }
    setIsDrawing(false);
    setLastPos(null);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
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
