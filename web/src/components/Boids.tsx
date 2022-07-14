import { useRef, useCallback, useState, useEffect } from "react"
import { createBoidsApp } from "@boids/boids"
import { BoidsApp } from "@boids/boids/src/app"

function Boids() {
  const [boidsApp] = useState<BoidsApp>(createBoidsApp())
  const [canvasResolution] = useState({ x: 640, y: 480 })

  const canvasRef = useCallback((canvas: HTMLCanvasElement) => {
    if (canvas) boidsApp.init(canvas, canvasResolution)
  }, [])

  return (
    <div>
      <canvas ref={canvasRef} width={canvasResolution.x} height={canvasResolution.y}></canvas>
    </div>
  )
}

export default Boids
