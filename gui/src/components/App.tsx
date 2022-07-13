import createBoidsApp, { BoidsApp } from "../../../boids/src/app"
import { onMount, createSignal, mergeProps } from "solid-js"
import FPSCounter from "./FPSCounter"

import "tailwindcss/tailwind.css"
import styles from "../index.css"
import ControlPanel from "./ControlPanel"

const defaultProps = { width: 640, height: 300 }

function App(inProps: any) {
  const props = mergeProps(defaultProps, inProps)
  let canvas: HTMLCanvasElement | undefined

  const [boidsApp, setAppBoids] = createSignal<BoidsApp>()
  const [canvasSize, setCanvasSize] = createSignal({ x: props.width, y: props.height })

  onMount(() => {
    const app = createBoidsApp(canvas as HTMLCanvasElement)
    setAppBoids(app)

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
    app.flockHandler.addFlock({
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
          {boidsApp() && <FPSCounter valueGetter={boidsApp()!.tick.getLastRealDelta} />}
        </div>

        {boidsApp() && <ControlPanel boidsApp={boidsApp()!} maxFlocks={5} />}
      </div>
    </div>
  )
}

export default App
