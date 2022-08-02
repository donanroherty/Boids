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
      visionRange: 50,
      alignment: 1.5,
      separationRange: 20,
      predatorAvoid: 100,
      minSpeed: 30,
      maxSpeed: 200,
      size: 4,
      cohesionInteraction: false,
      alignmentInteraction: false,
      separationInteraction: true,
    })
    // Predator
    boidsApp.getFlockhandler().addFlock({
      color: colors[1],
      numBoids: 1,
      visionRange: 90,
      fov: 90,
      minSpeed: 90,
      maxSpeed: 200,
      drag: 0.04,
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
