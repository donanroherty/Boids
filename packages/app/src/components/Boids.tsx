import { useCallback, useState } from "react"
import UI from "./UI"
import { colors } from "../utils"
import { createBoidsApp, BoidsApp } from "@boids/lib/src/app"
import { getGeometry } from "@boids/lib/src/scene-geo"
import vec2 from "@boids/lib/src/lib/vec2"
import { polygonCollider, boxCollider } from "@boids/lib/src/lib/colliders"
import "../index.css"

export type BoidsProps = {
  width?: number
  height?: number
}

function Boids(props: BoidsProps) {
  const { width = 640, height = 640 } = props

  const [boidsApp] = useState<BoidsApp>(createBoidsApp())
  const [isInitialized, setIsInitialized] = useState(false)

  const canvasRef = useCallback((canvas: HTMLCanvasElement) => {
    if (!canvas) return

    boidsApp.init(canvas, { x: width, y: height })
    buildScene()
    setIsInitialized(true)

    function buildScene() {
      /** Create scene geometry */

      const geometry = getGeometry()
      geometry.reversePathPointOrder([0, 1, 2, 3, 4, 5])
      geometry.scale(vec2(3.3, 3.3))
      geometry.offset(vec2(135, 245))

      // create geometry in scene
      geometry.getPaths().forEach((ps) => {
        const shape = polygonCollider(ps, {
          fill: false,
          drawNormal: false,
          color: "rgb(160,160,160)",
        })
        boidsApp.getScene().addGeometry(shape)
      })

      const padding = 2
      const sceneBox = boxCollider(
        vec2(padding, padding),
        boidsApp
          .getScene()
          .getSceneSize()
          .sub(vec2(padding * 2, padding * 2)),
        { color: "purple", lineWidth: 1, drawNormal: true, visible: false },
        true
      )
      boidsApp.getScene().addGeometry(sceneBox)

      /** Create boids */

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
        drawDebug: true,
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
        drawDebug: true,
      })
    }
  }, [])

  const dimensionsStyle = { width: `${width}px`, height: `${height}px` }

  return (
    <div style={dimensionsStyle}>
      <div className="absolute" style={dimensionsStyle}>
        {isInitialized && <UI boidsApp={boidsApp} />}
      </div>

      <div className="self-center border border-solid rounded-lg border-boids_btn bg-boids_scene_bg">
        <canvas ref={canvasRef} width={width} height={height}></canvas>
      </div>
    </div>
  )
}

export default Boids
