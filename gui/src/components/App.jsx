import boidsApp from "../../../boids/app"
import { onMount, createSignal, mergeProps } from "solid-js"
import FPSCounter from "./FpsCounter"

import "tailwindcss/tailwind.css"
import styles from "../index.css"
import ControlPanel from "./ControlPanel"

import vec2 from "../../../boids/lib/vec2"

const defaultProps = { width: 640, height: 300 }

function App(props) {
  const mergedProps = mergeProps(defaultProps, props)
  let canvas

  const [boids, setBoids] = createSignal()
  const [canvasSize, setCanvasSize] = createSignal({ x: mergedProps.width, y: mergedProps.height })

  onMount(() => {
    const app = boidsApp(canvas)
    setBoids(app)

    // Prey
    // app.flockHandler.addFlock({
    //   color: "black",
    //   numBoids: 50,
    //   detectionRange: 50,
    //   alignmentMaxStrength: 1.0,
    //   separationRange: 20,
    //   minSpeed: 30,
    //   maxSpeed: 200,
    //   size: 3.5,
    //   coheseWithOtherFlocks: false,
    //   alignWithOtherFlocks: false,
    //   separateFromOtherFlocks: true,
    // })
    // Predator
    app.flockHandler.addFlock(
      {
        color: "red",
        numBoids: 1,
        detectionRange: 90,
        fov: 90,
        minSpeed: 90,
        maxSpeed: 200,
        drag: 0.04,
        size: 8,
        predatorAttack: 0.3,
        predatorAvoid: 50,
        isPredator: true,
        renderSolid: true,
      }
      // vec2(200, 80)
    )
  })

  return (
    <div class={`w-[${canvasSize().x}px]`}>
      <style>{styles}</style>
      <div
        class="relative w-full select-none font-sans shadow-sm"
        style={`width: ${props.width}px`}
      >
        <canvas
          ref={canvas}
          class="w-full rounded-bl-md rounded-br-md border-[1px] border-solid border-black"
          width={canvasSize().x}
          height={canvasSize().y}
        ></canvas>

        <div class="absolute top-0 right-0 z-10 mr-2 mt-2">
          {boids() && <FPSCounter valueGetter={boids().tick.getLastRealDelta} />}
        </div>

        {boids() && <ControlPanel boidsApp={boids()} maxFlocks={5} />}
      </div>
    </div>
  )
}

export default App
