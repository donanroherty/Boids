import createBoidsApp from "../../../boids/app"
import { onMount, createSignal, mergeProps } from "solid-js"
import Controls from "./Controls"
import FPSCounter from "./FpsCounter"

import "tailwindcss/tailwind.css"
import styles from "../index.css"

const defaultProps = { width: 640, height: 480 }

function App(props) {
  const mergedProps = mergeProps(defaultProps, props)
  let canvas

  const [boidsApp, setBoidsApp] = createSignal()
  const [canvasSize, setCanvasSize] = createSignal({ x: mergedProps.width, y: mergedProps.height })

  onMount(() => {
    setBoidsApp(createBoidsApp(canvas))
  })

  return (
    <>
      <style>{styles}</style>
      <div class="w-[640px] shadow-sm relative font-sans">
        <canvas
          ref={canvas}
          class="w-full border-[1px] border-black border-solid rounded-bl-md rounded-br-md"
          width={canvasSize().x}
          height={canvasSize().y}
        ></canvas>
        <div class="absolute top-0 right-0 z-10 mr-2 mt-2">
          {boidsApp() && <FPSCounter valueGetter={boidsApp().tick.getLastRealDelta} />}
        </div>
        <Controls boidsApp={boidsApp()} />
      </div>
    </>
  )
}

export default App
