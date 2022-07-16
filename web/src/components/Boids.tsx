import { useCallback, useState } from "react"
import { createBoidsApp } from "@boids/boids"
import { BoidsApp } from "@boids/boids/src/app"

function Boids() {
  const [boidsApp] = useState<BoidsApp>(createBoidsApp())
  const [canvasResolution] = useState({ x: 640, y: 640 })

  const canvasRef = useCallback((canvas: HTMLCanvasElement) => {
    if (!canvas) return

    boidsApp.init(canvas, canvasResolution)

    // Prey
    boidsApp.getFlockhandler().addFlock({
      color: "black",
      numBoids: 100,
      detectionRange: 50,
      alignmentMaxStrength: 1.5,
      separationRange: 20,
      predatorAvoid: 100,
      minSpeed: 30,
      maxSpeed: 200,
      size: 3.5,
      coheseWithOtherFlocks: false,
      alignWithOtherFlocks: false,
      separateFromOtherFlocks: true,
    })
    // Predator
    boidsApp.getFlockhandler().addFlock({
      color: "red",
      numBoids: 1,
      detectionRange: 90,
      fov: 90,
      minSpeed: 90,
      maxSpeed: 200,
      dragFactor: 0.04,
      size: 8,
      predatorAttack: 0.3,
      predatorAvoid: 50,
      isPredator: true,
    })
  }, [])

  return (
    <div>
      <canvas ref={canvasRef} width={canvasResolution.x} height={canvasResolution.y}></canvas>
    </div>
  )
}

export default Boids
