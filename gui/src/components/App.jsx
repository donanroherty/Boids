import boidsApp from "../../../boids/app"
import { onMount, createSignal, mergeProps } from "solid-js"
import FPSCounter from "./FpsCounter"

import "tailwindcss/tailwind.css"
import styles from "../index.css"
import ControlPanel from "./ControlPanel"

const defaultProps = { width: 640, height: 480 }

function App(props) {
  const mergedProps = mergeProps(defaultProps, props)
  let canvas

  const [boids, setBoids] = createSignal()
  const [canvasSize, setCanvasSize] = createSignal({ x: mergedProps.width, y: mergedProps.height })

  /*
  let config = {
    color: "black",
    numBoids: 50,
    size: 5,
    detectionRange: 50,
    cohesionFactor: 0.2,
    alignmentMaxStrength: 0.3,
    separationMaxStrength: 10,
    separationRange: 30,
    dragFactor: 0.01,
    minSpeed: 50,
    maxSpeed: 150,
    coheseWithOtherFlocks: false,
    alignWithOtherFlocks: false,
    separateFromOtherFlocks: false,
    ...initialConfig,
  }
  */

  onMount(() => {
    const app = boidsApp(canvas)
    app.addFlock({
      color: "black",
      numBoids: 100,
      detectionRange: 40,
      alignmentMaxStrength: 1.0,
      coheseWithOtherFlocks: false,
      alignWithOtherFlocks: false,
      separateFromOtherFlocks: true,
    })
    app.addFlock({
      color: "blue",
      numBoids: 5,
      detectionRange: 140,
      cohesionFactor: 0.4,
      inSpeed: 90,
      maxSpeed: 350,
      separationMaxStrength: 5,
      coheseWithOtherFlocks: true,
      alignWithOtherFlocks: true,
      separateFromOtherFlocks: true,
    })
    setBoids(app)
  })

  return (
    <>
      <style>{styles}</style>
      <div class="relative w-full font-sans shadow-sm" style={`width: ${props.width}px`}>
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
    </>
  )
}

export default App
