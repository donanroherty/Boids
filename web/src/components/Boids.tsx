import { useCallback, useState } from "react"
import { createBoidsApp } from "@boids/boids"
import { BoidsApp } from "@boids/boids/src/app"
import UI from "./UI"
import { colors } from "../utils"

function Boids() {
  const [boidsApp] = useState<BoidsApp>(createBoidsApp())
  const [canvasResolution] = useState({ x: 640, y: 640 })
  const [isInitialized, setIsInitialized] = useState(false)

  const canvasRef = useCallback((canvas: HTMLCanvasElement) => {
    if (!canvas) return

    boidsApp.init(canvas, canvasResolution)
    setIsInitialized(true)

    // Prey
    boidsApp.getFlockhandler().addFlock({
      color: colors[0],
      numBoids: 50,
      detectionRange: 50,
      alignmentMaxStrength: 1.5,
      separationRange: 20,
      predatorAvoid: 100,
      minSpeed: 30,
      maxSpeed: 200,
      size: 4,
      coheseWithOtherFlocks: false,
      alignWithOtherFlocks: false,
      separateFromOtherFlocks: true,
    })
    // Predator
    boidsApp.getFlockhandler().addFlock({
      color: colors[1],
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

  const dimensionsStyle = { width: `${canvasResolution.x}px`, height: `${canvasResolution.y}px` }

  return (
    <div style={dimensionsStyle}>
      <div className="absolute" style={dimensionsStyle}>
        {isInitialized && <UI boidsApp={boidsApp} />}
      </div>
      <div className="self-center border border-solid rounded-lg border-boids_btn bg-boids_scene_bg">
        <canvas
          ref={canvasRef}
          width={canvasResolution.x}
          height={canvasResolution.y}
          className=""
        ></canvas>
      </div>
    </div>
  )
}

export default Boids
