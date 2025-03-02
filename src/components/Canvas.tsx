import React, { useRef, useEffect, useState } from 'react'
import { useColor } from '../context/colorContext'

const Canvas = ({ ...props }) => {
  const { selectedColor } = useColor();
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [history, setHistory] = useState<ImageData[]>([])
  const [currentStep, setCurrentStep] = useState(-1)

  // Initial setup effect - runs once
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const context = canvas.getContext('2d')
    if (!context) return
    
    // Clear canvas only once on mount
    context.fillStyle = '#ffffff'
    context.fillRect(0, 0, context.canvas.width, context.canvas.height)
    
    // Save initial blank state
    const initialState = context.getImageData(0, 0, canvas.width, canvas.height)
    setHistory([initialState])
    setCurrentStep(0)
  }, []) // Empty dependency array means this runs once on mount

  // Color change effect
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const context = canvas.getContext('2d', {
      willReadFrequently: true,
      alpha: false
    })
    if (!context) return
    
    // Improve line quality
    context.strokeStyle = selectedColor
    context.lineWidth = 1
    context.lineCap = 'round'
    context.lineJoin = 'round'
    context.imageSmoothingEnabled = true
    context.imageSmoothingQuality = 'high'
    
    // Add shadow for smoother appearance
    context.shadowBlur = 1
    context.shadowColor = selectedColor
  }, [selectedColor])

  useEffect(() => {
    const handleUndo = () => undo();
    const handleRedo = () => redo();
    // Handle both button click and keyboard shortcut
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault(); // Prevent browser's default undo
        handleUndo();
      }
    };

    // Add both event listeners
    document.addEventListener('canvas-undo', handleUndo);
    document.addEventListener('canvas-redo', handleRedo);
    document.addEventListener('keydown', handleKeyDown);

    // Clean up both listeners
    return () => {
      document.removeEventListener('canvas-undo', handleUndo);
      document.removeEventListener('canvas-redo', handleRedo);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentStep]); // Keep currentStep in dependencies

  const startDrawing = (e: React.MouseEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const context = canvas.getContext('2d')
    if (!context) return
    
    setIsDrawing(true)
    context.beginPath()
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    
    context.moveTo(
      (e.clientX - rect.left) * scaleX,
      (e.clientY - rect.top) * scaleY
    )
  }

  const draw = (e: React.MouseEvent) => {
    if (!isDrawing) return
    const canvas = canvasRef.current
    if (!canvas) return
    const context = canvas.getContext('2d')
    if (!context) return
    
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    
    // Calculate new position
    const x = (e.clientX - rect.left) * scaleX
    const y = (e.clientY - rect.top) * scaleY
    
    // Draw with quadratic curve for smoother lines
    context.quadraticCurveTo(
      x - 1, y - 1,  // control point
      x, y           // end point
    )
    context.stroke()
    context.beginPath()
    context.moveTo(x, y)
  }

  const saveState = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const context = canvas.getContext('2d')
    if (!context) return

    const currentState = context.getImageData(0, 0, canvas.width, canvas.height)
    const newHistory = history.slice(0, currentStep + 1)
    setHistory([...newHistory, currentState])
    setCurrentStep(currentStep + 1)
  }

  const stopDrawing = () => {
    if (isDrawing) {
      saveState()
    }
    setIsDrawing(false)
  }

  const undo = () => {
    if (currentStep > 0) {
      const canvas = canvasRef.current
      if (!canvas) return
      const context = canvas.getContext('2d')
      if (!context) return

      const newStep = currentStep - 1
      context.putImageData(history[newStep], 0, 0)
      setCurrentStep(newStep)
    }
  }
  const redo = () => {
    if (currentStep < history.length - 1) {
      const canvas = canvasRef.current
      if (!canvas) return
      const context = canvas.getContext('2d')
      if (!context) return

      const newStep = currentStep + 1
      context.putImageData(history[newStep], 0, 0)
      setCurrentStep(newStep)
    }
  }

  return (
    <canvas
      ref={canvasRef}
      width={600}
      height={400}
      onMouseDown={startDrawing}
      onMouseMove={draw}
      onMouseUp={stopDrawing}
      onMouseOut={stopDrawing}
      style={{ borderRadius: '.25rem' }}
      {...props}
    />
  )
}

export default Canvas