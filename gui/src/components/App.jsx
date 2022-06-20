import createBoidsApp from "../../../boids/app"
import { onMount, createSignal } from "solid-js"
import Controls from "./Controls"
import FPSCounter from "./FpsCounter"

function App() {
  let canvas

  const [boidsApp, setBoidsApp] = createSignal()
  const [canvasSize, setCanvasSize] = createSignal({ x: 640, y: 480 })

  onMount(() => {
    setBoidsApp(createBoidsApp(canvas))
  })

  return (
    <div class="w-[640px] shadow-sm relative">
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
  )
}

export default App
