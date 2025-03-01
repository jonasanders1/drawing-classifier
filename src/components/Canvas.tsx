import React, { useRef, useEffect, useState } from 'react'
import { useColor } from '../context/colorContext'

const Canvas = ({ ...props }) => {
  const { selectedColor } = useColor();
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)

  // Initial setup effect - runs once
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const context = canvas.getContext('2d')
    if (!context) return
    
    // Clear canvas only once on mount
    context.fillStyle = '#ffffff'
    context.fillRect(0, 0, context.canvas.width, context.canvas.height)
  }, []) // Empty dependency array means this runs once on mount

  // Color change effect
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const context = canvas.getContext('2d')
    if (!context) return
    
    // Only update the stroke style when color changes
    context.strokeStyle = selectedColor
    context.lineWidth = 2
    context.lineCap = 'round'
  }, [selectedColor])

  const startDrawing = (e: React.MouseEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const context = canvas.getContext('2d')
    if (!context) return
    const rect = canvas.getBoundingClientRect()
    
    setIsDrawing(true)
    context.beginPath()
    context.moveTo(
      e.clientX - rect.left,
      e.clientY - rect.top
    )
  }

  const draw = (e: React.MouseEvent) => {
    if (!isDrawing) return
    const canvas = canvasRef.current
    if (!canvas) return
    const context = canvas.getContext('2d')
    if (!context) return
    const rect = canvas.getBoundingClientRect()
    
    context.strokeStyle = selectedColor
    context.lineTo(
      e.clientX - rect.left,
      e.clientY - rect.top
    )
    context.stroke()
  }

  const stopDrawing = () => {
    setIsDrawing(false)
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